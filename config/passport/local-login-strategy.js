var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');

var strategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, callback) {
  User.findOne({ 'local.email' : email }, function(err, user) {
    if (err) return callback(err);
    if (!user) {
      return callback(null, false, req.flash('error', 'User not found'));
    }
    if (!user.isValidPassword(password)) {
      return callback(null, false, req.flash('error', 'Oops, wrong password'));
    }
    return callback(null, user);
  });
});

module.exports = strategy;
