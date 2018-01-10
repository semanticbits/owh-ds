'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morganlogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('./config/logging');
var helmet = require('helmet');
var expressSanitizer = require('express-sanitizer');

var app = express();
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb'}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morganlogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(expressSanitizer());

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

//all routes goes here
require("./routes/search")(app);
require("./routes/fb")(app);
require("./routes/generateHashCode")(app);
var allRoutes = require("./routes/route");
//all routes goes in above section



// This will change in production since we'll be using the dist folder
app.use(express.static(path.join(__dirname, '../client')));
// This covers serving up the index page
app.use(express.static(path.join(__dirname, '../client/.tmp')));
app.use(express.static(path.join(__dirname, '../client/app')));

app.use("*", allRoutes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        logger.error(err);
        res.status(err.status || 500);
        res.send(new result('Unexpected error!',err, "failed"));
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    logger.error(err);
    res.status(err.status || 500);
    res.send(new result('Unexpected error!','', "failed"));
});


module.exports = app;
