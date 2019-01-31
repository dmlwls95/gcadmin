/*var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var User = require('../models/editor.js');
module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        console.log('deserializeUser()',user);
        User.findById({_id : id}, function(err, user) {
            done(err, user);
        });
    });
    passport.use(new LocalStrategy({
        session:true,
        passReqToCallback: false
    },
        function(username, password, done){
            User.findOne({ 저자 : username }, function(err, user){
                if(err) {return done(err);}
                if(!user) {return done(null, false, { message: 'There is no email'});}
                if(user._id != password) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));
};*/

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require('../models/editor.js');
var config = require('../config/database'); // get db config file

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload._id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};