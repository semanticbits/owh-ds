'use strict';
var result = require('../models/result');
var hash = require('object-hash');
var queryBuilder = require('../api/elasticQueryBuilder');

var generateHashCodeRouter = function(app, rConfig) {
    app.post('/generateHashCode', function(req, res) {
        var generatedHash = hash(JSON.stringify(req.body.q), { algorithm: 'md5', encoding: 'hex' });
        res.send( new result('OK', generatedHash, "success") );
    });
};
module.exports = generateHashCodeRouter;
