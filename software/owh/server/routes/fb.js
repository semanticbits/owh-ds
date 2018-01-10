'use strict';
var result = require('../models/result');
const fs = require("fs");
var uuid = require('node-uuid');
var logger = require('../config/logging');
var config = require('../config/config');
var appURL = config.fb.appURL;

var imageRouter = function(app, rConfig) {
    app.post('/fb/upload', function(req, res) {
        var rawData = req.body.q.data;
        var base64Data = rawData.replace(/^data:image\/png;base64,/, "");
        var v1 = uuid.v1();
        var v2 = uuid.v1();
        var full_size = v1+".png";
        var thumb_size = v2+".png";
        fs.writeFile("./uploads/"+full_size, base64Data, "base64", function(err) {
            if (err) {
                res.send( new result('FAILED', {}, [], "error") );
                logger.error(err);
            } else {
                res.send( new result('OK', {imageId: full_size, appURL: appURL}, [], "success") );
            }
        });
    });

    app.get('/fb/:imageId', function(req, res) {
        var image_id = req.params.imageId;
        var img = fs.readFileSync('./uploads/'+image_id);
        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(img, 'binary');
    });

    app.get('/getFBAppID', function(req, res) {
        var fbAppID = config.fb.appID;
        res.send( new result('OK', {fbAppID: fbAppID }, [], "success") );
    });
};

module.exports = imageRouter;