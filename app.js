var createError = require('http-errors');
var express = require('express');
var path = require('path');
var connect = require('connect');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var session = require('express-session');

var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
//const favicon = require('express-favicon');
require('babel-core/register');
var indexRouter = require('./src/routes/index');
//var sensorsRouter = require('./src/routes/sensors');
//var workshop2 = require('./src/routes/workshop2');
//var testFile = require('./src/routes/testFile');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, '/src/client'));
app.use('/dist', express.static('dist/'));
app.use('/public', express.static('public/'));
app.use('/src', express.static('src/'));
//app.use('/static', express.static('public/media/devices'));
// Set Jade as the default template engine
app.set('view engine', 'jade');
//app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

//page used in my application
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// Connection UR
  const url = 'mongodb://localhost/moveon';
// Database Name
  const dbName = 'moveon';

// Create a new MongoClient
  //const client = new MongoClient();
  
  //connect to MongoDB
  mongoose.connect('mongodb://localhost/moveon',  { useNewUrlParser: true });

  
  var db = mongoose.connection;
  

//handle mongo error
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    // we're connected!
    console.log("The server is connected to MongoDB!");
    
  
    
    var User = require('./src/server/data_base/models/user');
    const jp = new User({
      email: 'jp4 @mail.com',
      username: 'd',
      password: 'd',
    });
    
    /*jp.save(function (err, user) {
      if (err) return console.error(err);
      console.log(user.username + " saved to bookstore collection.");
    });*/
  
  
    app.use(cookieParser());
//use sessions for tracking logins
    app.use(session({
      secret: 'michka',
      resave: true,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: db
      })
    }));
  });
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  



module.exports = app;

