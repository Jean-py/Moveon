var express = require('express');
var router = express.Router();
let smartphoneSensors = require('../../public/js/smartphoneSensors');

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  //phoneMuteDisplay.connect(phoneDisplay);
  
  var Myo = require('myo');
  Myo.connect('com.stolksdorf.myAwesomeApp', require('ws'));
  
  res.render('sensors', { title: 'Devices supported: '});
  
});

module.exports = router;
