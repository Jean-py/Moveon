var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const favicon = require('express-favicon');
require('babel-core/register');

var indexRouter = require('./src/routes/index');
//var sensorsRouter = require('./src/routes/sensors');
var workshop2 = require('./src/routes/workshop2');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/src/client'));
app.use('/dist', express.static('dist/'));
app.use('/public', express.static('public/'));
app.use('/src', express.static('src/'));
//app.use('/static', express.static('public/media/devices'));


// Set Jade as the default template engine
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(favicon(__dirname + '/public/media/favicon.ico'));

//page used in my application
app.use('/', indexRouter);
//app.use('/sensors', sensorsRouter);
app.use('/workshop2', workshop2);



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


module.exports = app;

