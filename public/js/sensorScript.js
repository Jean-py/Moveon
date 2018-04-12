let lfo = require('waves-lfo/client');
let Myo = require('myo');
let SG = require('ml-savitzky-golay');
let config = require('../../src/config/default');

/*
const socketSend = new lfo.sink.SocketSend({ port: 9004 });

const eventIn = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 0.01,
  description: ['alpha', 'beta', 'gamma'],
});

eventIn.connect(socketSend);

eventIn.start();

let timess = 0;

(function createFrame() {
  const frame = {
    time: timess,
    data: [1,2,3],
  };
  eventIn.process(1,[1,2,3],1);
  timess += 1;
  console.log('sending cool stuff');
  setTimeout(createFrame, 1000);
}());
*/
/*const socketReceive = new lfo.source.SocketReceive({
  port: 5001
  //config.socketServerToClient.port
});*/

const logger = new lfo.sink.Logger({
  time: true,
  data: true,
});

//socket.connect(bpfDisplayAccelero);

//END TEST


//Time for the bpfDisplay
let time = 0;
const dt = 0.01;
let timeEMG = 0;
const dtEMG = 0.01;

//Starting myo
Myo.connect('com.stolksdorf.myAwesomeApp');
let myMyo;

//For the sliding window of kinestetic awareness replication
let slidingWindow = [];

//variables for the savitzky-golay filter
let arrayFilteringX = [];
let arrayFilteringY = [];
let arrayFilteringZ = [];
let ansx = [];
let ansy = [];
let ansz = [];
let options = {derivative: 1};
let optionsGolayLowPass = {derivative: 0};


//Creation of graph
const eventInAccelero = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 0.01,
  description: ['acceleroX', 'acceleroY', 'acceleroZ'],
});

const eventInSmoothness = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 0.01,
  description: ['smoothX', 'smoothY', 'smoothZ'],
});

const eventInGyro = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 0.01,
  description: ['gyroX', 'gyroY', 'gyroZ'],
});

const eventInEMG = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 8,
  frameRate: 0.01,
  description: ['emg', 'emg', 'emg','emg', 'emg', 'emg','emg', 'emg'],
});

const eventInEMGSliding = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 1,
  frameRate: 0.01,
  description: ['emgSliding'],
});

const movingAverage = new lfo.operator.MovingAverage({
  order: 5,
  fill: 0
});



// initialize and start the different graph used
eventInAccelero.start();
//eventInGyro.start();
eventInSmoothness.start();
eventInEMGSliding.start();
eventInEMG.start();
console.log("event in started");

/*MYO starting event handler*/
Myo.onError = function () {
  console.log("Couldn't connect to Myo Connect");
};

Myo.on('connected', function(){
  myMyo = this;
  addEvents(myMyo);
});

let addEvents = function(myo){
  
  myMyo.streamEMG(true);
  Myo.on('emg', function(data){
    timeEMG += dtEMG;
  
    //Slinding window of EMG
    if(slidingWindow.length > 1000){
      slidingWindow.shift();
    }
    slidingWindow.push(Math.max(...data));
    let maxSliding = Math.max(...slidingWindow);
    const frameEMGSliding = {
      time: timeEMG,
      data: slidingWindow[slidingWindow.length-1]/maxSliding,
    };
    
    const frameEMG = {
      time: timeEMG,
      data: data,
    };
    eventInEMGSliding.processFrame(frameEMGSliding);
    eventInEMG.processFrame(frameEMG);
  });
  
  const bpfDisplayAccelero = new lfo.sink.BpfDisplay({
    canvas: '#canvasBPFAccelero',
    width: 400,
    height: 250,
    duration: 5,
    max: 2,
    min: -2
  });
  const bpfDisplayJerkiness = new lfo.sink.BpfDisplay({
    canvas: '#bpfDisplayJerkiness',
    width: 400,
    height: 250,
    duration: 5,
    max: 1,
    min: -1
  });
  const bpfDisplayEMG = new lfo.sink.BpfDisplay({
    canvas: '#canvasEMG1',
    width: 400,
    height: 250,
    duration: 5,
    max: 128,
    min: -128
  });
  const bpfDisplayEMGSlinding = new lfo.sink.BpfDisplay({
    canvas: '#canvasEMG2',
    width: 400,
    height: 250,
    duration: 5,
    max: 1,
    min: -1
  });
  
  //Le low pass ne marche pas et je ne sais toujours pas pourquoi. Probleme de config?
  const biquad = new lfo.operator.Biquad({
    type: 'lowpass',
    f0: 50,
    gain: 3,
    q: 12,
  });
  
  const biquad2 = new lfo.operator.Biquad({
    type: 'lowpass',
    f0: 500,
    gain: 3,
    q: 12,
  });
  
  const movingAverage = new lfo.operator.MovingAverage({
    order: 5,
    fill: 0
  });
  
  
  Myo.on('imu', function (data) {
    time += dt;
    const frameAccelero = {
      time: time,
      data: [data.accelerometer.x, data.accelerometer.y, data.accelerometer.z],
    };
    const frameGyro = {
      time: time,
      data: [data.gyroscope.x, data.gyroscope.y, data.gyroscope.z],
    };
  
    eventInAccelero.processFrame(frameAccelero);
  
    //Calculing smoothness
    arrayFilteringX.push(data.accelerometer.x);
    arrayFilteringY.push(data.accelerometer.y);
    arrayFilteringZ.push(data.accelerometer.z);
    
    //taille de la fenetre de calcule de l'algorithme = 20
    if(arrayFilteringZ.length >= 10 ){
      arrayFilteringX.shift();
      arrayFilteringY.shift();
      arrayFilteringZ.shift();
     
      //apllication de savitzky-golay filter
      ansx =  SG(arrayFilteringX, 1, options);
      ansy =  SG(arrayFilteringY, 1, options);
      ansz =  SG(arrayFilteringZ, 1, options);
      let frameSmoothness = {
        time: time,
        data: [ansx[ansx.length - 1],ansy[ansy.length - 1],ansz[ansz.length - 1]],
      };
      eventInSmoothness.processFrame(frameSmoothness);
    }
  });
  /*MYO end of event handler*/
  
  
  /*ACCELERO*/
 /* eventInAccelero.connect(biquad);
  biquad.connect(bpfDisplayAccelero);*/
  //eventInAccelero.connect(bpfDisplayAccelero);
  /*eventInAccelero.connect(movingAverage);
  movingAverage.connect(bpfDisplayAccelero);*/
//  const logger = new lfo.sink.Logger({ data: true });
  
  //eventInAccelero.connect(bpfDisplayAccelero);
  /*eventInAccelero.connect(movingAverage);
  movingAverage.connect(bpfDisplayAccelero);*/
  eventInAccelero.connect(bpfDisplayAccelero);
  //socketReceive.connect(logger);
  //socketReceive.connect(bpfDisplayAccelero);
  
  //socketReceive.connect(bpfDisplayAccelero);
  
  
  
  /*JERKINESS RATE*/
  eventInSmoothness.connect(bpfDisplayJerkiness);
  
  /*EMG*/
   /*eventInEMG.connect(biquad2);
   biquad2.connect(bpfDisplayEMG);*/
  eventInEMG.connect(bpfDisplayEMG);
  
  /*EMGS SLIDING WINDOW*/
  eventInEMGSliding.connect(bpfDisplayEMGSlinding);
  
  
  
  
};




