let express = require('express');
let router = express.Router();
let config = require('../config/configServer');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('moveon', { title: config.appName, subtitle: config.subtitle  });
});


module.exports = router;
