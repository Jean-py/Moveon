var express = require('express');
var router = express.Router();
let smartphoneSensors = require('../../public/js/smartphoneSensors');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Accessing to sensors page');
  res.render('sensors', { title: 'Possible device(s): '});
  //next(); // pass control to the next handler
});

module.exports = router;
