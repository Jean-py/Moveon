var lfo = require('waves-lfo/client');
var Myo = require('src/client/js/sensors/myo');
var SG = require('ml-savitzky-golay');


//Time for the bpfDisplay
let time = 0;
const dt = 0.01;
let timeEMG = 0;
const dtEMG = 0.01;

//Starting myo
Myo.connect('com.stolksdorf.myAwesomeApp');
var myMyo;

//For the sliding window of kinestetic awareness replication
var slidingWindow = [];

//variables for the savitzky-golay filter
var arrayFilteringX = [];
var arrayFilteringY = [];
var arrayFilteringZ = [];
var ansx = [];
var ansy = [];
var ansz = [];
var options = {derivative: 1};
var optionsGolayLowpass = {derivative: 0};


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

var addEvents = function(myo){
  
  myMyo.streamEMG(true);
  myMyo.lock();
  
  Myo.on('emg', function(data){
    timeEMG += dtEMG;
  
    //Slinding window of EMG
    if(slidingWindow.length > 1000){
      slidingWindow.shift();
    }
    slidingWindow.push(Math.max(...data));
    maxSliding = Math.max(...slidingWindow);
    const frameEMGSliding = {
      time: timeEMG,
      data: slidingWindow[slidingWindow.length-1]/maxSliding,
    }
   // console.log(frameEMGSliding);
    
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
    max: 100,
    min: -100
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
    f0: 10000,
    gain: 3,
    q: 12,
  });
  
  const biquad2 = new lfo.operator.Biquad({
    type: 'lowpass',
    f0: 10,
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
      data: [data.accelerometer.x, data.accelerometer.y, data.accelerometer.z]
    };
    const frameGyro = {
      time: time,
      data: [data.gyroscope.x, data.gyroscope.y, data.gyroscope.z]
    };
  
    eventInAccelero.processFrame(frameAccelero);
  
    //Calculing smoothness
    arrayFilteringX.push(data.accelerometer.x);
    arrayFilteringY.push(data.accelerometer.y);
    arrayFilteringZ.push(data.accelerometer.z);
    
    //taille de la fenetre de calcule de l'algorithme
    if(arrayFilteringZ.length > 20 ){
      arrayFilteringX.shift();
      arrayFilteringY.shift();
      arrayFilteringZ.shift();
     
      //apllication de savitzky-golay filter
      ansx =  SG(arrayFilteringX, 1, options);
      ansy =  SG(arrayFilteringY, 1, options);
      ansz =  SG(arrayFilteringZ, 1, options);
      var frameSmoothness = {
        time: time,
        data: [ansx[ansx.length - 1],ansy[ansy.length - 1],ansz[ansz.length - 1]],
      };
      eventInSmoothness.processFrame(frameSmoothness);
    }
  });
  
  /*MYO stop event handler*/
  /*Connection of the graph to display */
  
  
  //ACCELERO
  /*eventInAccelero.connect(biquad);
  biquad.connect(bpfDisplayAccelero);*/
  eventInAccelero.connect(bpfDisplayAccelero);
  
  
  //Smoothness
  eventInSmoothness.connect(bpfDisplayJerkiness);
  
  //EMG
  /* eventInEMG.connect(biquad2);
   biquad2.connect(bpfDisplayEMG);
  */eventInEMG.connect(bpfDisplayEMG)
  
  //EMG SLIDING WINDOW
  eventInEMGSliding.connect(bpfDisplayEMGSlinding);
  
};