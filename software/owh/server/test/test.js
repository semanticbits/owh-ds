var expect = require("expect.js");
var route = require("../routes/route");
var elasticSearch = require("../models/elasticSearch");

//istanbul cover node_modules/mocha/bin/_mocha -- -R spec


describe('ElasticClient', function(){
    it('should merge populations into mortality response', function(done){
        var mort =   {"data":{"nested":{"table":{"group_table_race":[{"name":"1","deaths":2106697,"undefined":[{"name":"F","deaths":1079109},{"name":"M","deaths":1027588}]},{"name":"2","deaths":291706,"undefined":[{"name":"M","deaths":148258},{"name":"F","deaths":143448}]}]}}}};
        var census = {"data":{"nested":{"table":{"group_table_race":[{"name":"2","undefined":[{"name":"F","pop":4444},{"name":"M","pop":3333}]},{"name":"1","undefined":[{"name":"M","pop":5555},{"name":"F","pop":6666}]}]}}}};
        var mergedData = {"data":{"nested":{"table":{"group_table_race":[{"name":"1","deaths":2106697,"undefined":[{"name":"F","deaths":1079109, "pop":6666},{"name":"M","deaths":1027588,"pop":5555 }]},{"name":"2","deaths":291706,"undefined":[{"name":"F","deaths":143448, "pop":4444},{"name":"M","deaths":148258, "pop":3333}]}]}}}};
        var es = new elasticSearch();

        es.mergeWithCensusData(mort, census);
        expect(JSON.stringify(mort)).equal(JSON.stringify(mergedData));
        done();
    });
});
