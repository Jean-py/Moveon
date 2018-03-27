let express = require('express');
let router = express.Router();
let smartphoneSensors = require('../../public/js/smartphoneSensors');

/* GET users listing. */
router.get('/sensors', function(req, res, next) {
  res.send('Here the sensor page, streaming data from smartphone and MYO');
 // next =
});



module.exports = router;
