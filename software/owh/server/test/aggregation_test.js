var expect = require("expect.js");
var Aggregation = require("../models/aggregation");

describe("Aggregations", function(){
    it("Build aggregation bucket object", function(done){
        var aggregationObj = new Aggregation({key:"Bucket key", doc_count:100}, "deaths");
        expect(aggregationObj.name).equal("Bucket key");
        expect(aggregationObj.deaths).equal(100);
        done()
    });
});
