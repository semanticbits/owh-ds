var elasticSearch = require('../models/elasticSearch');
var expect = require("expect.js");

describe("Elastic Search", function () {

    this.timeout(60000);

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

    it("Check aggregate deaths data with Census rate query", function(done) {
        var query = [{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0}}}},"group_chart_0_gender":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0}}}},"group_maps_0_states":{"terms":{"field":"state","size":0},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}},{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}},"group_chart_0_gender":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}}] ;
        new elasticSearch().aggregateDeaths(query).then(function (resp){
            var  tableData = resp.data.nested.table.race;
            var chartsData = resp.data.nested.charts[0].gender;
            expect(tableData[0].name).equal('American Indian');
            expect(tableData[0].deaths).equal(19016);
            expect(tableData[0].pop).equal(4577853);
            var  nestedData = tableData[0].gender;
            expect(nestedData[0].name).equal('Female');
            expect(nestedData[0].deaths).equal(8565);
            expect(nestedData[0].pop).equal(2279263);
            expect(nestedData[1].name).equal('Male');
            expect(nestedData[1].deaths).equal(10451);
            expect(nestedData[1].pop).equal(2298590);
            //chart data
            expect(chartsData[0].name).equal("Female");
            expect(chartsData[0].deaths).equal(1339226);
            expect(chartsData[0].pop).equal(163189523);
            var nestedChartData = chartsData[0].race;
            expect(nestedChartData[0].name).equal("American Indian");
            expect(nestedChartData[0].deaths).equal(8565);
            expect(nestedChartData[0].pop).equal(2279263);
            expect(nestedChartData[1].name).equal("Asian or Pacific Islander");
            expect(nestedChartData[1].deaths).equal(32574);
            expect(nestedChartData[1].pop).equal(10480265);
            expect(nestedChartData[2].name).equal("Black");
            expect(nestedChartData[2].deaths).equal(155402);
            expect(nestedChartData[2].pop).equal(23345129);
            expect(nestedChartData[3].name).equal("White");
            expect(nestedChartData[3].deaths).equal(1142685);
            expect(nestedChartData[3].pop).equal(127084866);
            done();
        });
    });

    it("Check aggregate deaths data with Census rate query and wonder query", function(done) {
        var query = [{
            "size": 0,
            "aggregations": {
                "group_table_race": {
                    "terms": {"field": "race", "size": 0},
                    "aggregations": {"group_table_gender": {"terms": {"field": "sex", "size": 0}}}
                },
                "group_chart_0_gender": {
                    "terms": {"field": "sex", "size": 0},
                    "aggregations": {"group_chart_0_race": {"terms": {"field": "race", "size": 0}}}
                },
                "group_maps_0_states": {
                    "terms": {"field": "state", "size": 0},
                    "aggregations": {"group_maps_0_sex": {"terms": {"field": "sex", "size": 0}}}
                }
            },
            "query": {
                "filtered": {
                    "query": {"bool": {"must": []}},
                    "filter": {"bool": {"must": [{"bool": {"should": [{"term": {"current_year": "2015"}}]}}]}}
                }
            }
        }, {
            "size": 0,
            "aggregations": {
                "group_table_race": {
                    "terms": {"field": "race", "size": 0},
                    "aggregations": {
                        "group_table_gender": {
                            "terms": {"field": "sex", "size": 0},
                            "aggregations": {"pop": {"sum": {"field": "pop"}}}
                        }
                    }
                },
                "group_chart_0_gender": {
                    "terms": {"field": "sex", "size": 0},
                    "aggregations": {
                        "group_chart_0_race": {
                            "terms": {"field": "race", "size": 0},
                            "aggregations": {"pop": {"sum": {"field": "pop"}}}
                        }
                    }
                }
            },
            "query": {
                "filtered": {
                    "query": {"bool": {"must": []}},
                    "filter": {"bool": {"must": [{"bool": {"should": [{"term": {"current_year": "2015"}}]}}]}}
                }
            }
        }];
        query.wonderQuery = {
            "searchFor": "deaths",
            "query": {
                "current_year": {
                    "key": "year",
                    "queryKey": "current_year",
                    "value": [
                        "2015"
                    ],
                    "primary": false
                }
            },
            "aggregations": {
                "simple": [],
                "nested": {
                    "table": [
                        {
                            "key": "race",
                            "queryKey": "race",
                            "size": 0
                        },
                        {
                            "key": "gender",
                            "queryKey": "sex",
                            "size": 0
                        }
                    ],
                    "charts": [
                        [
                            {
                                "key": "gender",
                                "queryKey": "sex",
                                "size": 0
                            },
                            {
                                "key": "race",
                                "queryKey": "race",
                                "size": 0
                            }
                        ]
                    ],
                    "maps": [
                        [
                            {
                                "key": "states",
                                "queryKey": "state",
                                "size": 0
                            },
                            {
                                "key": "sex",
                                "queryKey": "sex",
                                "size": 0
                            }
                        ]
                    ]
                }
            }
        };
        new elasticSearch().aggregateDeaths(query).then(function (resp) {
            var  tableData = resp.data.nested.table.race;
            var chartsData = resp.data.nested.charts[0].gender;
            expect(tableData[0].name).equal('American Indian');
            expect(tableData[0].deaths).equal(19016);
            expect(tableData[0].ageAdjustedRate).equal("596.9");
            expect(tableData[0].standardPop).equal(4577853);
            expect(tableData[0].pop).equal(4577853);
            var  nestedData = tableData[0].gender;
            expect(nestedData[0].name).equal('Female');
            expect(nestedData[0].deaths).equal(8565);
            expect(nestedData[0].ageAdjustedRate).equal("511.3");
            expect(nestedData[0].standardPop).equal(2279263);
            expect(nestedData[0].pop).equal(2279263);
            expect(nestedData[1].name).equal('Male');
            expect(nestedData[1].deaths).equal(10451);
            expect(nestedData[1].ageAdjustedRate).equal("693.6");
            expect(nestedData[1].standardPop).equal(2298590);
            expect(nestedData[1].pop).equal(2298590);
            //chart data
            expect(chartsData[0].name).equal("Female");
            expect(chartsData[0].deaths).equal(1339226);
            expect(chartsData[0].ageAdjustedRate).equal("624.2");
            expect(chartsData[0].pop).equal(163189523);
            expect(chartsData[0].standardPop).equal(163189523);
            var nestedChartData = chartsData[0].race;
            expect(nestedChartData[0].name).equal("American Indian");
            expect(nestedChartData[0].deaths).equal(8565);
            expect(nestedChartData[0].ageAdjustedRate).equal("511.3");
            expect(nestedChartData[0].pop).equal(2279263);
            expect(nestedChartData[0].standardPop).equal(2279263);
            done();
        });
    });
});