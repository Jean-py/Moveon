let express = require('express');
let router = express.Router();
let config = require('../config/configServer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: config.appName, subtitle: 'Touch the screen to continue...'});
});

module.exports = router;
