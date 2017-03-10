'use strict';

var express= require('express');
var app =express();
require('dotenv').load();
var routes = require('./app/routes/index.js');
var passport = require('passport');
var session = require('express-session');
require('./app/config/passport')(passport);
var FileStore = require('session-file-store')(session);

app.use(express.static(__dirname + ''));
app.use('/app', express.static(process.cwd() + '/app'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/node_modules', express.static(process.cwd() + '/node_modules'));

app.use(session({
	secret: 'secretYoutubeViewer',
	store: new FileStore(),
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.listen(8080, function() {
    console.log("server started successfully");
});