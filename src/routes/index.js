let express = require('express');
let router = express.Router();
let config = require('../config/default');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: config.appName, subtitle: 'Touch the screen to continue...'});
});


//var screen = window.getElementById('screen');
//screen.onclick=fbody();

function fbody(){
  console.log('touching screen');
}

function bodyload(){
  ;
}
module.exports = router;
