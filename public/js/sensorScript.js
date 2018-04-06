var lfo = require('waves-lfo/client');
var Myo = require('myo');

let time = 0;
const dt = 0.1;

const eventIn = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 0.1,
  description: ['acceleroX', 'acceleroY', 'acceleroZ'],
});

const eventInAccelero = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 0.1,
  description: ['acceleroX', 'acceleroY', 'acceleroZ'],
});

const eventInGyro = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 0.1,
  description: ['gyroX', 'gyroY', 'gyroZ'],
});




// initialize and start the graph
eventInAccelero.start();
eventIn.start();
eventInGyro.start();
console.log("event in started");

Myo.connect('com.stolksdorf.myAwesomeApp');
var myMyo;

Myo.onError = function () {
  console.log("Couldn't connect to Myo Connect");
};

Myo.on('connected', function(){
  myMyo = this;
  addEvents(myMyo);
});



var addEvents = function(myo){
  myMyo.on('emg', function(data){
    //console.log(data);
  });
  const logger = new lfo.sink.Logger({ data: true });
  const bpfDisplayAccelero = new lfo.sink.BpfDisplay({
    canvas: '#canvasBPFAccelero',
    width: 400,
    height: 250,
    duration: 5,
  });
  const bpfDisplayGyro = new lfo.sink.BpfDisplay({
    canvas: '#canvasBPFGyro',
    width: 400,
    height: 250,
    duration: 5,
  });
  
  const barChart = new lfo.sink.BarChartDisplay({
    canvas: '#canvasBarchart',
  });
  
  const biquad = new lfo.operator.Biquad({
    type: 'lowpass',
    f0: 2000,
    gain: 3,
    q: 12,
  });
  
//new Date().getTime() / 10000
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
    eventInGyro.processFrame(frameGyro);
   // eventIn.connect(logger);
    //console.log("accelerometer : "+ data.accelerometer.x, data.accelerometer.y, data.accelerometer.z);
    //console.log("gyroscope : "+ data.gyroscope.x, data.gyroscope.y, data.gyroscope.z);
  });
  
  //eventIn.connect(bpfDisplay);
  // eventIn.connect(barChart);
  //eventIn.connect(biquad);
  //eventInAccelero.connect(bpfDisplayAccelero);
  //eventInGyro.connect(bpfDisplayGyro);
  
  eventInAccelero.connect(bpfDisplayAccelero);
  eventInGyro.connect(bpfDisplayGyro);
  
  
  
}