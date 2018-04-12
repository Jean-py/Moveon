let express = require('express');
let router = express.Router();
let smartphoneSensors = require('../../public/js/smartphoneSensors');
let Myo = require('myo');
let osc = require('osc');
let lfo = require('waves-lfo/node');
let SG = require('ml-savitzky-golay');
var config = require('../config/default');


/*Adress for sending data to MAX*/
var udpPortMax = new osc.UDPPort({
  localAddress: config.osc.sendAddress,
  localPort: config.osc.sendPort,
  metadata: true
});

//Socket for sending data to client


// Open the sockets.
udpPortMax.open();

/* GET users listing. */
router.get('/', function(req, res, next) {
  /*MYO Connection*/
  Myo.connect('com.stolksdorf.myAwesomeApp', require('ws'));
  
  /*MYO starting event handler*/

//Starting myo
  let myMyo;
  var time =0;
  var dt = 0.01;
  
  Myo.onError = function () {
    console.log("Couldn't connect to Myo Connect");
  };
  
  Myo.on('connected', function(){
    myMyo = this;
    addEvents(myMyo);
  });
  
  
  
  let addEvents = function(myMyo) {
    const eventInAccelero = new lfo.source.EventIn({
      frameType: 'vector',
      frameSize: 3,
      frameRate: 0.01,
      description: ['acceleroX', 'acceleroY', 'acceleroZ'],
    });
    
    //const socketSend = new lfo.sink.SocketSend({ port: 5001 });
    const socketReceive = new lfo.source.SocketReceive({ port: config.socketServerToClient.port });
    //socketReceive.connect(udpPortMax);
  
  
  
    eventInAccelero.init().then(() => {
      //eventInAccelero.start();
      //eventInAccelero.connect(socketSend);
    });
    
    Myo.on('imu', function (data) {
      time += dt;
      var arr = [data.accelerometer.x, data.accelerometer.y, data.accelerometer.z];
      var dataArray = new Float32Array(arr);
      
      const frameAccelero = {
        time: time,
        data: dataArray,
        metadata :  null
      };
      //console.log("sending into process frame : " + frameAccelero.data);
      //eventInAccelero.processFrame(frameAccelero);
      //console.log(frameAccelero);
      //eventInAccelero.processFrame(frameAccelero);
      
      //console.log(frameAccelero);
      // eventInAccelero.processFrame(time, [Math.random(), Math.random()], { test: true });
      //eventInAccelero.process(1, [0, 1, 2]);
// is equivalent to
      //eventInAccelero.processFrame({ time: 1, data: [0, 1, 2] });
      
      
      
    });
  };
  res.render('sensors', { title: 'Devices supported: '});
});



/*Sending fonction*/
//TODO completer la fonction pour envoyer les données a MAX
function sendMessageOSC(dataSensor){
  udpPortMax.send({
    address: "/myo",
    args: [
      {
        type: "s",
        value: "accelero"
      },
      {
        type: "f",
        value: dataSensor.x
      },
      {
        type: "f",
        value: dataSensor.y
      },
      {
        type: "f",
        value: dataSensor.z
      }
    ]
  }, "127.0.0.1", 8085);
}



  /*MYO end of event handler*/

/*Test sending to client*/

  /* End test sending to client*/
/*const eventIn = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 3,
  frameRate: 0.01,
  description: ['alpha', 'beta', 'gamma'],
});

//config.socketServerToClient.port
const socketSend = new lfo.sink.SocketSend({ port: 9000 });


let timeb = 0;
  
  (function createFrame() {
    const frame = {
      time: timeb,
      data: [1,2,3],
    };
    console.log("send stuff to the client");
    
    
    eventIn.process(1,[1,2,3],1);
    timeb += 1;
    //console.log('sending cool stuff');
    setTimeout(createFrame, 1000);
  }());


const socketReceive = new lfo.source.SocketReceive({
  port: 9004
  //config.socketServerToClient.port
});

const logger = new lfo.sink.Logger({
  time: true,
  data: true,
});

socketReceive.connect(logger);
//socketReceive.connect(socketSend);
//socket.connect(bpfDisplayAccelero);*/


module.exports = router;
