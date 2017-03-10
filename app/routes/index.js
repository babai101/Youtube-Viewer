'use strict';
var path = process.cwd();
var ServerFunctions = require(path + '/app/controllers/serverController.js');

module.exports = function(app, passport) {
    var serverFunctions = new ServerFunctions();

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect('/');
        }
    }

    app.route('/')
        .get(function(req, res) {
            res.sendFile(path + '/public/index.html');
        });
    app.route('/video')
        .get(isLoggedIn, serverFunctions.getVideo);

    app.route('/auth/isLoggedIn')
        .get(function(req, res) {
            if (req.isAuthenticated()) {
                res.send(req.user);
            }
            else {
                res.sendStatus(401);
            }
        });

    app.route('/auth/login')
        .post(
            passport.authenticate('local'),
            function(req, res) {
                console.log('local auth POST received');
                res.send(req.user);
            });
            
    app.route('/auth/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/');
        });
};
