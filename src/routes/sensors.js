var express = require('express');
var router = express.Router();
let smartphoneSensors = require('../../public/js/smartphoneSensors');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Accessing to sensors page');
  res.render('sensors', { title: 'Select your device(s): '});
  res.send('birds home page');
  next(); // pass control to the next handler
});



module.exports = router;



module.exports = router;
