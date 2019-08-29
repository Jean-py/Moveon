let express = require('express');
let router = express.Router();
let config = require('../server/config/configServer');
var User = require('../server/data_base/models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: config.appName});
});


// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/'));
});



//TODO a voir
//POST route for updating data
// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/'));
});


//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  /*
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }*/
  console.log("------------- REQ ----------");
  console.log(req);
  console.log("------------- REQ ----------");
  
  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {
    
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    };
    
    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profil');
      }
    });
    
  } else if (req.body.username && req.body.pass) {
    User.authenticate(req.body.username, req.body.pass, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        /*console.log( 'user._id');
        console.log(user._id);
        console.log('req.session');
        console.log(user.session);*/
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required - (index.js)');
    err.status = 400;
    return next(err);
  }
});

// GET route after registering
router.get('/profile', function (req, res, next) {
  console.log(req.session);
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});


module.exports = router;