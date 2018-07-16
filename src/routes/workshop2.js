let express = require('express');
let router = express.Router();
let config = require('../config/default');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('workshop2', { title: config.appName, subtitle: 'Bienvenue'});
});


module.exports = router;
