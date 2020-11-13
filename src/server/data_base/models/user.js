var mongoose = require('mongoose');
var bcrypt = require('bcrypt');



var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

//authenticate input against database
UserSchema.statics.authenticate = function (usern, password, callback) {
  var mongoose = require('mongoose');
  var session = require('express-session');
  var MongoStore = require('connect-mongo')(session);
  
  mongoose.connect('mongodb://localhost/moveon',  { useNewUrlParser: true });
  const db = mongoose.connection;
  
  console.log("user.js");
  console.log(usern, password);
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    // we're connected!
    User.findOne({username: usern}, function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        console.log('no user');
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
  });
};

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var username = this;
  bcrypt.hash(username.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    username.password = hash;
    next();
  })
});

var User = mongoose.model('User', UserSchema);
module.exports = User;