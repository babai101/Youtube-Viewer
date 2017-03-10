'use strict';

var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {
            var user = {};
            if ((process.env.USERNAME == username) && (process.env.PASSWORD == password)) {
                user.username = username;
                user.password = password;
                return done(null, user);
            }
            else {
                return done(null, false, {
                    message: 'Incorrect username or password'
                });
            }
        }
    ));
};
