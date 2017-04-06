var elasticSearch = require('../models/elasticSearch');
var expect = require("expect.js");

describe("Elastic Search", function () {


    beforeEach( function () {
        this.timeout(10000);
    });

    it("Check mortality counts by year", function (done){
        new elasticSearch().executeESQuery('owh_mortality', 'mortality',JSON.stringify({"size":0,
                "aggregations":{
                    "group_year":{
                        "terms":{  "field":"current_year","size" :100 ,"order" : { "_term" : "desc" } }
                    }
                }
            })
        ).then(function (resp) {
            expect(resp.aggregations.group_year.buckets[0].doc_count).to.be(2712630);
            expect(resp.aggregations.group_year.buckets[1].doc_count).to.be(2626418);
            expect(resp.aggregations.group_year.buckets[2].doc_count).to.be(2596993);
            expect(resp.aggregations.group_year.buckets[3].doc_count).to.be(2543279);
            expect(resp.aggregations.group_year.buckets[4].doc_count).to.be(2515458);
            expect(resp.aggregations.group_year.buckets[14].doc_count).to.be(2416425);
            done();
        })
    });

    it("Check aggregate natality data", function (){
        var query = [{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":100000},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":100000}}}},"group_maps_0_states":{"terms":{"field":"state","size":100000},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":100000}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2014"}}]}}]}}}}}];
        new elasticSearch().aggregateNatalityData(query).then(function (resp) {
            var  data = resp.data.nested.table.race;
            expect(data[0].name).equal('White');
            expect(data[0].natality).greaterThan(0);
            var  nestedData = data[0].sex;
            expect(nestedData[0].name).equal('Male');
            expect(nestedData[0].natality).greaterThan(0);
            expect(nestedData[1].name).equal('Female');
            expect(nestedData[1].natality).greaterThan(0);
            done();
        })
    });

    it("Check aggregate natality data with Census rate query", function (done){
        var query = [{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":100000},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":100000},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}},"group_chart_0_sex":{"terms":{"field":"sex","size":100000},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":100000},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}},"group_maps_0_states":{"terms":{"field":"state","size":100000},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":100000},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"race":"American Indian or Alaska Native"}},{"term":{"race":"Black"}}]}},{"bool":{"should":[{"term":{"current_year":"2014"}}]}}]}}}}},{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":100000},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":100000},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"race":"American Indian or Alaska Native"}},{"term":{"race":"Black"}}]}},{"bool":{"should":[{"term":{"current_year":"2014"}}]}}]}}}}}]
        new elasticSearch().aggregateNatalityData(query).then(function (resp) {
            var  data = resp.data.nested.table.race;
            expect(data[0].name).equal('American Indian or Alaska Native');
            expect(data[0].natality).equal(44928);
            var  nestedData = data[0].sex;
            expect(nestedData[0].name).equal('Female');
            expect(nestedData[0].natality).equal(22120);
            expect(nestedData[0].pop).equal(23068743);
            expect(nestedData[1].name).equal('Male');
            expect(nestedData[1].natality).equal(22808);
            expect(nestedData[1].pop).equal(21240651);
            done();
        })
    });
});