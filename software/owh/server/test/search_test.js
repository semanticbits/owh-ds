var result = require('../models/result');
var expect = require("expect.js");
var request = require("supertest");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

describe('FactSheet', function(){

    it("get FactSheet data", function(done){
        app.use(bodyParser.json());

        app.post('/factsheet', function(req, res) {
            var response = {};
            res.send(req.body.state);
        });
        request(app)
            .post('/factsheet')
            .send({qID:'4dcdd1323203ffe625cac68900edc1b51', state:'AK', fsType: 'State Health'})
            .expect(200, done)
            .end(function(err, res){
                if (err) return done(err);
                done()
            });
    });
});

