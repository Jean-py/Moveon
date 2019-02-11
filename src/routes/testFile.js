let express = require('express');
let router = express.Router();
let config = require('../config/configServer');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('sensors', { title: config.appName, subtitle: 'Bienvenue'});
});


module.exports = router;