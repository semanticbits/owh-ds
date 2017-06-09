var elasticSearch = require('../models/elasticSearch');
var expect = require("expect.js");
var stdCasesQuery = require('./data/std_cases_elastic_query.json');
var stdPopulationQuery = require('./data/std_population_elastic_query.json');
var stdSideFilterCountQuery = require('./data/std_sidefilter_count_query.json');
var stdAggreFinalQueryResp = require('./data/std_aggregate_data_final_query_response.json');

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

    it("should aggregate mortality side filter counts", function (){
        var query = [{"size":0,"aggregations":{"year":{"terms":{"field":"current_year","size":0}},"race":{"terms":{"field":"race","size":0}},"gender":{"terms":{"field":"sex","size":0}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}},null];
        return new elasticSearch().aggregateDeaths(query, true).then(function (response) {

            var race = response.data.simple.race;
            expect(race[0].name).to.eql("White");
            expect(race[0].deaths).to.be(2306861);
            expect(race[1].name).to.eql("Black");
            expect(race[1].deaths).to.be(320072);

            var gender = response.data.simple.gender;
            expect(gender[0].name).to.eql("Male");
            expect(gender[0].deaths).to.be(1373404);
            expect(gender[1].name).to.eql("Female");
            expect(gender[1].deaths).to.be(1339226);

            var year = response.data.simple.year;
            expect(year[0].name).to.eql("2015");
            expect(race[0].deaths).to.be(2306861);
        });
    });

    it("should aggregate mortality data by race and gender for 2015", function (){
        var query = [{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}},{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}}];
        return new elasticSearch().aggregateDeaths(query, true).then(function (response) {
            var data = response.data.nested.table;

            expect(data.race[0].name).to.eql("American Indian");
            expect(data.race[0].deaths).to.be(19016);
            expect(data.race[0].gender[0].name).to.eql("Female");
            expect(data.race[0].gender[0].deaths).to.be(8565);
            expect(data.race[0].gender[1].name).to.eql("Male");
            expect(data.race[0].gender[1].deaths).to.be(10451);

            expect(data.race[1].name).to.eql("Asian or Pacific Islander");
            expect(data.race[1].deaths).to.be(66681);
            expect(data.race[1].gender[0].name).to.eql("Female");
            expect(data.race[1].gender[0].deaths).to.be(32574);
            expect(data.race[1].gender[1].name).to.eql("Male");
            expect(data.race[1].gender[1].deaths).to.be(34107);
        });
    });

    it("should aggregate bridged-race data by race and gender for 2015", function (){
        var query = {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}};
        return new elasticSearch().aggregateCensusData(query, true).then(function (response) {
            var race = response.data.nested.table.race;
            expect(race[0].name).to.eql("American Indian");
            expect(race[0].bridge_race).to.be(4577853);
            expect(race[0].sex[0].name).to.eql("Female");
            expect(race[0].sex[0].bridge_race).to.be(2279263);
            expect(race[0].sex[1].name).to.eql("Male");
            expect(race[0].sex[1].bridge_race).to.be(2298590);

            expect(race[1].name).to.eql("Asian or Pacific Islander");
            expect(race[1].bridge_race).to.be(20102717);
            expect(race[1].sex[0].name).to.eql("Female");
            expect(race[1].sex[0].bridge_race).to.be(10480265);
            expect(race[1].sex[1].name).to.eql("Male");
            expect(race[1].sex[1].bridge_race).to.be(9622452);
        });
    });

    it("should fetch metadata for 2015", function (){
        var natalityMetadata = require('./data/natality_matadata.json');
        var sortFn = function (a, b){
            if (a._source.filter_name > b._source.filter_name) { return 1; }
            if (a._source.filter_name < b._source.filter_name) { return -1; }
            return 0;
        };
        return new elasticSearch().getDsMetadata('natality', ['2015']).then(function (response) {
            var resultsFromMetaData = response.hits.hits.sort(sortFn);
            var natalityResults = natalityMetadata.sort(sortFn);
            resultsFromMetaData.forEach(function(filter, index){
               expect(filter._source.filter_name).to.eql(natalityResults[index]._source.filter_name);
               expect(filter._source.year).to.eql(natalityResults[index]._source.year);
               expect(filter._source.dataset).to.eql(natalityResults[index]._source.dataset);
               expect(JSON.stringify(filter._source.permissible_values)).to.eql(JSON.stringify(natalityResults[index]._source.permissible_values));
            });
        });
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

    it("should suppress data if counts are less than 10", function () {
        var query = [{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}},"group_chart_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}},"group_maps_0_states":{"terms":{"field":"state","size":0},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"mother_age_1year_interval":"15 years"}},{"term":{"mother_age_1year_interval":"16 years"}},{"term":{"mother_age_1year_interval":"17 years"}},{"term":{"mother_age_1year_interval":"18 years"}}]}},{"bool":{"should":[{"term":{"state":"AK"}}]}}]}}}}},{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"mother_age_1year_interval":"15 years"}},{"term":{"mother_age_1year_interval":"16 years"}},{"term":{"mother_age_1year_interval":"17 years"}},{"term":{"mother_age_1year_interval":"18 years"}}]}},{"bool":{"should":[{"term":{"state":"AK"}}]}}]}}}}}];
        return new elasticSearch().aggregateNatalityData(query, true).then(function (resp) {
            var  data = resp.data.nested.table.race;
            expect(data[2].name).equal('Black');
            expect(data[2].natality).equal('suppressed');
            var genderData = data[2].sex;
            expect(genderData[0].natality).equal('suppressed');
            expect(genderData[1].natality).equal(11);
        });
    });

    //Enable once OWH-1179 issue fixed.
    xit("Check aggregate natality data with Census rate query", function (done){
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

    //Enable once OWH-1179 issue fixed.
    xit("Check aggregate deaths data with Census rate query and wonder query", function(done) {
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

    it("Check aggregate std data with final query", function (done){
        var query = [stdCasesQuery, stdPopulationQuery];
        new elasticSearch().aggregateSTDData(query).then(function (resp) {
            //All races/ethnicities
            expect(resp.data.nested.table.race[0].name).equal(stdAggreFinalQueryResp.data.nested.table.race[0].name);
            expect(resp.data.nested.table.race[0].std).equal(stdAggreFinalQueryResp.data.nested.table.race[0].std);
            //Both sexes
            expect(resp.data.nested.table.race[0].sex[0].name).equal(stdAggreFinalQueryResp.data.nested.table.race[0].sex[0].name);
            expect(resp.data.nested.table.race[0].sex[0].std).equal(stdAggreFinalQueryResp.data.nested.table.race[0].sex[0].std);
            expect(resp.data.nested.table.race[0].sex[0].pop).equal(stdAggreFinalQueryResp.data.nested.table.race[0].sex[0].pop);
            done();
        })
    });

    it("Check aggregate std data with sidefilter query", function (done){
        var expectedResponseData = {"data":{"simple":{"disease":[{"name":"Chlamydia","std":1526658}],"current_year":[{"name":"2015","std":1526658}],"race":[{"name":"All races/ethnicities","std":1526658}],"age_group":[{"name":"All age groups","std":1526658}],"sex":[{"name":"Both sexes","std":1526658}],"state":[{"name":"National","std":1526658}],"group_count_cases":[]},"nested":{"table":{},"charts":[],"maps":{}}},"pagination":{"total":1}};
        new elasticSearch().aggregateSTDData([stdSideFilterCountQuery]).then(function (resp) {
            //SideFilter counts: disease
            expect(resp.data.simple.disease[0].name).equal(expectedResponseData.data.simple.disease[0].name);
            expect(resp.data.simple.disease[0].std).equal(expectedResponseData.data.simple.disease[0].std);
            //SideFilter counts: current_year
            expect(resp.data.simple.current_year[0].name).equal(expectedResponseData.data.simple.current_year[0].name);
            expect(resp.data.simple.current_year[0].std).equal(expectedResponseData.data.simple.current_year[0].std);
            //SideFilter counts: race
            expect(resp.data.simple.race[0].name).equal(expectedResponseData.data.simple.race[0].name);
            expect(resp.data.simple.race[0].std).equal(expectedResponseData.data.simple.race[0].std);
            //SideFilter counts: age_group
            expect(resp.data.simple.age_group[0].name).equal(expectedResponseData.data.simple.age_group[0].name);
            expect(resp.data.simple.age_group[0].std).equal(expectedResponseData.data.simple.age_group[0].std);
            //SideFilter counts: sex
            expect(resp.data.simple.sex[0].name).equal(expectedResponseData.data.simple.sex[0].name);
            expect(resp.data.simple.sex[0].std).equal(expectedResponseData.data.simple.sex[0].std);
            //SideFilter counts: state
            expect(resp.data.simple.state[0].name).equal(expectedResponseData.data.simple.state[0].name);
            expect(resp.data.simple.state[0].std).equal(expectedResponseData.data.simple.state[0].std);
            //nested table, charts, maps length should be zero
            expect(resp.data.nested.table.length).equal(expectedResponseData.data.nested.table.length);
            expect(resp.data.nested.charts.length).equal(expectedResponseData.data.nested.charts.length);
            expect(resp.data.nested.maps.length).equal(expectedResponseData.data.nested.maps.length);
            done();
        })
    });

});