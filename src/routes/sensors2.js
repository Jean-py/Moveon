var express = require('express');
var router = express.Router();
let smartphoneSensors = require('../../public/js/smartphoneSensors');
let myo = require('../../public/js/myo');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Accessing to sensors page');
  var Myo = require('myo');
  Myo.connect('com.stolksdorf.myAwesomeApp', require('ws'));
  Myo.on('fist', function(){
    console.log('Hello Myo!');
    //this.vibrate();
  });
  
  res.render('sensors2', { title: 'sensor for testing sensors MYO: '});
  //next(); // pass control to the next handler
});

module.exports = router;
