var expect = require("expect.js");
var result = require("../models/result");

describe("Results", function(){
    it("Build result json object with pagination", function(done){
        var resultObj = new result(200, [], {total:100, from:0, size:10}, "success");
        expect(resultObj.status).equal(200);
        expect(resultObj.messages).equal("success");
        expect(JSON.stringify(resultObj.pagination)).equal(JSON.stringify({total:100, from:0, size:10}));
        done()
    });

    it("Build result json object without pagination", function(done){
        var resultObj = new result(200, [], undefined, "success");
        expect(resultObj.status).equal(200);
        expect(resultObj.messages).equal("success");
        expect(resultObj).to.not.have.property('pagination');
        done()
    });
});
