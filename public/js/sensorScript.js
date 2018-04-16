let lfo = require('waves-lfo/client');
let Myo = require('myo');
let SG = require('ml-savitzky-golay');
let config = require('../../src/config/default');

//Gravity constant
const g = 9.81;

//Constant for window Length used
var EMGWindowLength = 500;
var acceleroWindowLength = 30;
//Modification en direct
var speedRateWindowLength = 10;
var amplitudeWindowLength = 40;
var SGWindowLength = 22;


//Time for the bpfDisplay
let time = 0;
const dt = 0.01;
let timeEMG = 0;
const dtEMG = 0.01;

//Socked to send data to node
const socketSendJerkiness = new lfo.sink.SocketSend({ port: config.socketClientToServer.port });

//Starting myo
Myo.connect('com.stolksdorf.myAwesomeApp');
let myMyo;

//Creation of graph
const eventInAccelero = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 0.01,
  description: ['acceleroX', 'acceleroY', 'acceleroZ'],
});

const eventInSmoothness = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 1,
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
  //myMyo.setLockingPolicy("Manual");
  addEvents(myMyo);
  
});

let addEvents = function(myo){
  
  myMyo.streamEMG(true);
  Myo.on('emg', function(data){
      displayEMGWindow(EMGWindowLength,data);
  });
  
  const bpfDisplayAccelero = new lfo.sink.BpfDisplay({
    canvas: '#canvasBPFAccelero',
    width: 400,
    height: 250,
    duration: 5,
    max: 100,
    min: -100
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
    myMyo.lock();
    displayAcceleroWindowSpeed(acceleroWindowLength,data);
    displaySmoothness(SGWindowLength,data);
    
    //console.log("speedRate : " + speedRate);
    const frameGyro = {
      time: time,
      data: [data.gyroscope.x, data.gyroscope.y, data.gyroscope.z],
    };
  });
  /*MYO end of event handler*/
  
  /*ACCELERO*/
  //eventInAccelero.connect(bpfDisplayAccelero);
  /*JERKINESS RATE*/
  eventInSmoothness.connect(bpfDisplayJerkiness);
  eventInSmoothness.connect(socketSendJerkiness);
  /*EMG*/
 // eventInEMG.connect(bpfDisplayEMG);
  /*EMGS SLIDING WINDOW*/
  //eventInEMGSliding.connect(bpfDisplayEMGSlinding);
};



/*Method sliding window computation, require less computation than the naive one*/
var ansX = [];
var ansY = [];
var ansZ = [];
var computedSpeedRate = 0;
var sumLastElem = 0;
var sumFirstElem = 0;
function computeSpeedRateAdaptativeWindow(windowLength, newX,newY,newZ) {
  if (ansX.length >= windowLength) {
    var firstElementX = ansX.shift();
    var firstElementY = ansY.shift();
    var firstElementZ = ansZ.shift();
    sumFirstElem = (firstElementX ) + (firstElementY ) + (firstElementZ );
  }
    let x = Math.abs(newX/g);
   // let x = (newX/g);
    ansX.push(x);
    let y = Math.abs(newY/g);
   // let y = (newY/g);
    ansY.push(y);
    let z = Math.abs(newZ/g);
    //let z = (newZ/g);
    ansZ.push(z);
  
    sumLastElem = (x)+(y)+(z);
    computedSpeedRate = computedSpeedRate - sumFirstElem + sumLastElem;
    //console.log(computedSpeedRate);
  
  return computedSpeedRate;
}


//Algorithm de calcul naif de la vitesse selon une fenetre: retourne le meme resultat que l'algorithme evolué
var ansXNaif = [];
var ansYNaif = [];
var ansZNaif = [];
function computeSpeedRateAdaptativeWindowNaif(windowLength,x,y,z){
  console.log("The function computeSpeedRateAdaptativeWindowNaif is deprecated, use computeSpeedRateAdaptativeWindow instead.");
  if (ansXNaif.length >= windowLength) {
    ansXNaif.shift();
    ansYNaif.shift();
    ansZNaif.shift();
  }
  ansXNaif.push(x/g);
  ansYNaif.push(y/g);
  ansZNaif.push(z/g);
  
  let  speedRate = 0;
  for (let i = 0; i < windowLength ; i++) {
      speedRate += (ansXNaif[i]) + (ansYNaif[i]) + (ansZNaif[i]);
      //speedRate += Math.abs(ansX[i]/g)+ Math.abs(ansY[i]/g) +  Math.abs(ansZ[i]/g);
     // speedRate +=Math.sqrt(Math.pow( Math.abs(ansX[i]/g) ,2)+ Math.pow(  Math.abs(ansY[i]/g),2) + Math.pow( Math.abs(ansZ[i]/g),2));
  }
  return speedRate;
}

function displayAcceleroWindowSpeed(windowLength, data){
  time += dt;
  let speedRate = computeSpeedRateAdaptativeWindow(windowLength,data.accelerometer.x, data.accelerometer.y, data.accelerometer.z);
  const frameAccelero = {
    time: time,
    data: [data.accelerometer.x*(speedRate), data.accelerometer.y*(speedRate), data.accelerometer.z*(speedRate)],
    metadata:true,
  };
  eventInAccelero.processFrame(frameAccelero);
}


//For the sliding window of kinestetic awareness replication
let slidingWindow = [];
function displayEMGWindow(windowLength, data){
  timeEMG += dtEMG;
  //Slinding window of EMG
  if(slidingWindow.length > windowLength){
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
}


//variables for the savitzky-golay filter
let arrayFilteringX = [];
let arrayFilteringY = [];
let arrayFilteringZ = [];
let ansx = [];
let ansy = [];
let ansz = [];
let options = {derivative: 1,windowSize: SGWindowLength-1};
let optionsGolayLowPass = {derivative: 0};
function displaySmoothness(windowLengthSG, data ){
  //Calculing smoothness
  arrayFilteringX.push(data.accelerometer.x);
  arrayFilteringY.push(data.accelerometer.y);
  arrayFilteringZ.push(data.accelerometer.z);
  
  //taille de la fenetre de calcule de l'algorithme
  if(arrayFilteringZ.length >= windowLengthSG ){
    arrayFilteringX.shift();
    arrayFilteringY.shift();
    arrayFilteringZ.shift();
    
    //apllication de savitzky-golay filter
    ansx =  SG(arrayFilteringX, 1, options);
    ansy =  SG(arrayFilteringY, 1, options);
    ansz =  SG(arrayFilteringZ, 1, options);
    
    //normalising data
    let normaliseData = Math.sqrt(Math.pow(ansx[ansx.length - 1],2)+Math.pow(ansy[ansy.length - 1],2)+Math.pow(ansz[ansz.length - 1],2));
    let amplitudeData = computeAmplitudeWindow(amplitudeWindowLength,normaliseData);
    let speedRate = computeSpeedRateAdaptativeWindow(speedRateWindowLength,data.accelerometer.x,data.accelerometer.y,data.accelerometer.z);
   // console.log("speedRate : " + speedRate);
    let frameSmoothness = {
      time: time,
     // data: speedRate*normaliseData,
      //data: amplitudeData,
      data: normaliseData,
      metadata:null,
    };
    eventInSmoothness.processFrame(frameSmoothness);
  }
}

//version naive de l'algorithme, le for peut etre remplacé comme dans la fonction: computeSpeedRateAdaptativeWindow
//Moyenne des données du jerk normalisé
var arrayAmplitude =[];
function computeAmplitudeWindow(windowLength, data){
  let amplitudeRate = 0;
  if(arrayAmplitude.length > windowLength){
    arrayAmplitude.shift();
  }
  arrayAmplitude.push(data);
  for (let i = 0; i < windowLength ; i++) {
    amplitudeRate += arrayAmplitude[i];
  }
  amplitudeRate /= windowLength;
 // console.log("amplitudeRate : " + amplitudeRate );
  return amplitudeRate;
}




//TEST RECEIVING FROM SERVER
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


/*const logger = new lfo.sink.Logger({
  time: true,
  data: true,
});*/

//socket.connect(bpfDisplayAccelero);


function setSpeedRateWindowLength (newValue) {
  speedRateWindowLength= newValue;
}
function setSpeedRateWindowLength (newValue) {
  amplitudeWindowLength= newValue;
}
function setSpeedRateWindowLength (newValue) {
  SGWindowLength= newValue;
}
