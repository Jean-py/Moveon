let express = require('express');
let router = express.Router();
let smartphoneSensors = require('../client/js/sensors/smartphoneSensors');
let Myo = require('myo');
let osc = require('osc');
let lfo = require('waves-lfo/node');
let SG = require('ml-savitzky-golay');
var config = require('../config/default');


/*Adress for sending data to MAX*/
var udpPortMax = new osc.UDPPort({
  localAddress: config.osc.sendAddress,
  localPort: 8082,
 // localPort: config.osc.sendPort,
  metadata: true
});

//Socket for receiving data from client
const socketReceive = new lfo.source.SocketReceive({
  port: config.socketClientToServer.port,
  //config.socketServerToClient.port
});




const logger = new lfo.sink.Logger({
  time: false,
  data: true,
});

const bridge = new lfo.sink.Bridge({
  processFrame: (frame) => sendMessageOSC(frame.data),
});

//socketReceive.connect(logger);
const eventInJerkiness = new lfo.source.EventIn({
  frameType: 'vector',
  frameSize: 1,
  frameRate: 0.01,
  description: ['Jerkiness'],
});


eventInJerkiness.init().then(() => {
  eventInJerkiness.start();
  socketReceive.connect(eventInJerkiness);
  //eventInJerkiness.connect(logger);
  eventInJerkiness.connect(bridge);
  //eventInJerkiness.connect(logger);
});



// Open the sockets.
udpPortMax.open();

/* GET users listing. */
router.get('/', function(req, res, next) {
  /*MYO Connection*/
  Myo.connect('com.stolksdorf.myAwesomeApp', require('ws'));
  //Myo.setLockingPolicy("Manual");
  
  
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
    Myo.on('imu', function (data) {
      time += dt;
      let arr = new Float32Array([data.accelerometer.x, data.accelerometer.y, data.accelerometer.z]);
      const frameAccelero = {
        time: time,
        data: arr,
        metadata :  null
      };
      
      
    });
  };
  res.render('sensors', { title: 'Devices supported: '});
});




/*Sending fonction*/
//TODO completer la fonction pour envoyer les données a MAX
function sendMessageOSC(dataSensor){
  //console.log("dataSensor : " + dataSensor);
  if( dataSensor[0] === 1000  || dataSensor[0] === 2000){
    console.log("on ou off : " +  dataSensor[0]);
    var onOff = 1;
    if(dataSensor[0] === 2000 ){
      onOff = 1;
    }
    else {
      onOff = 0;
    }
    udpPortMax.send({
      address: "/OnOff",
      args: [
        {
          type: "i",
          value: onOff
        },
      ]
    }, "127.0.0.1", 8081);
  } else if(isNaN(dataSensor[0]) ){
    return 'Not a number';
  } else {
    udpPortMax.send({
      address: "/jerkiness",
      args: [
        {
          type: "f",
          value: dataSensor[0]
        },
      ]
    }, "127.0.0.1", 8081);
    //"127.0.0.1", config.osc.receivePort);
  }
  
}



module.exports = router;
