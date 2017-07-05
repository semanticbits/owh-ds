var elasticQueryBuilder = require("../api/elasticQueryBuilder");
var supertest = require("supertest");
var expect = require("expect.js");
var pramsFilters = require('./prams_filters.json');
var stdCasesQuery = require('./data/std_cases_elastic_query.json');
var stdPopulationQuery = require('./data/std_population_elastic_query.json');
var stdSideFilterCountQuery = require('./data/std_sidefilter_count_query.json');
var stdApiQueryWithMultipleFilters = require('./data/std_apiQuery_with_multiple_filters.json');
var tbApiQueryWithMultipleFilters = require('./data/tb_apiQuery_with_multiple_filters.json');
var aidsApiQueryWithMultipleFilters = require('./data/aids_apiQuery_with_multiple_filters.json');

describe("Build elastic search queries", function(){
     it("Build search query with empty query and aggregations", function(done){
        var params = {query:{}, aggregations:{}};
        var result = elasticQueryBuilder.buildSearchQuery(params, true)
        var query = result[0];
        expect(JSON.stringify(query.aggregations)).to.eql("{}");
        expect(query.size).to.eql(0);
        console.log(" result 1 ", result[1]);
        expect(result[1]).to.eql(undefined);
        done()
    });

    it("Build search query with empty query and simple aggregations", function(done){
        var params = {query:{}, aggregations:{ simple:[{ key:"year", queryKey:"current_year", size:100000}]}};
        var result = elasticQueryBuilder.buildSearchQuery(params, true);
        var query = result[0];
        expect(JSON.stringify(query.aggregations)).to.eql(JSON.stringify({"year":{"terms":{"field":"current_year","size":100000}}}));
        expect(query.size).to.eql(0);
        expect(query.query).to.not.eql(undefined);
        expect(result[1]).to.eql(undefined);
        done()
    });

     it("Build search query with empty query and simple and nested aggregations", function(done){
        var params = {query:{}, aggregations:{ simple:[{ key:"year", queryKey:"current_year", size:100000}], nested:[]}};
        var query = elasticQueryBuilder.buildSearchQuery(params, true)[0];
        expect(JSON.stringify(query.aggregations)).to.eql(JSON.stringify({"year":{"terms":{"field":"current_year","size":100000}}}));
        expect(query.size).to.eql(0);
        expect(query.query).to.not.eql(undefined);
        done()
    });

    it("Build search query with empty query and simple and nested aggregations", function(done){
        var params = {aggregations:{ simple:[{ key:"year", queryKey:"current_year", size:100000}],
            nested:{
                charts: [[{ key:"gender",  queryKey:"sex",  size:100000}, { key:"race",  queryKey:"race",  size:100000}]],
                maps: [[{ key:"states",  queryKey:"state",  size:100000}, { key:"sex",  queryKey:"sex",  size:100000}]],
                table : [{ key:"gender", queryKey:"sex", size:100000}, { key:"race", queryKey:"race", size:100000},{"key":"year","queryKey":"current_year","size"
                    :100000}]
            }
        }
        };
        var result = elasticQueryBuilder.buildSearchQuery(params, true);
        var query =result[0];
        var censusQuery = result[1];
        expect(query.aggregations).to.have.property('year');
        expect(query.aggregations).to.have.property('group_table_gender');
        expect(query.aggregations).to.have.property('group_chart_0_gender');
        expect(query.aggregations.group_table_gender.aggregations).to.have.property('group_table_race');
        expect(query.aggregations.group_table_gender.aggregations.group_table_race.aggregations).to.have.property('group_table_year');
        expect(query.size).to.eql(0);
        expect(query).to.have.property('query');
        expect(query).to.have.property('size');
        expect(censusQuery).to.not.eql(undefined);
        expect(censusQuery.aggregations).to.have.property('group_table_gender');
        expect(censusQuery.aggregations.group_table_gender.aggregations).to.have.property('group_table_race');
        expect(censusQuery.aggregations.group_table_gender.aggregations.group_table_race.aggregations).to.have.property('group_table_year');
        expect(censusQuery.aggregations.group_table_gender.aggregations.group_table_race.aggregations.group_table_year.aggregations).to.have.property('pop');
        expect(censusQuery.aggregations.group_table_gender.aggregations.group_table_race.aggregations.group_table_year.aggregations.pop.sum.field).to.eql("pop");
        expect(censusQuery.aggregations.group_chart_0_gender.aggregations.group_chart_0_race.aggregations.pop.sum.field).to.eql("pop");

        var mapQuery = result[2];
        expect(mapQuery.aggregations).to.have.property('group_maps_0_states');
        expect(mapQuery.aggregations.group_maps_0_states.terms.field).to.eql('state');
        expect(mapQuery.aggregations.group_maps_0_states.aggregations.group_maps_0_sex.terms.field).to.eql('sex');
        done()
    });


    it("Build search query with nested aggregations and count results by pop", function(done){
        var params = {countQueryKey:'pop', aggregations:{ simple:[{ key:"year", queryKey:"current_year",  size:10}],
            nested:{
                table : [{ key:"gender", queryKey:"sex", size:10}, { key:"race", queryKey:"race", size:10},
                    {"key":"year","queryKey":"current_year","size":10}],
                charts: [[{ key:"gender",  queryKey:"sex",  size:10}, { key:"race",  queryKey:"race",  size:10}]],
            }
        }
        };
        var result = elasticQueryBuilder.buildSearchQuery(params, true);
        var query =result[0];
        expect(query.aggregations).to.have.property('year');
        expect(query.aggregations).to.have.property('group_table_gender');
        expect(query.aggregations).to.have.property('group_chart_0_gender');
        expect(query.aggregations).to.have.property('group_count_pop');
        expect(query.aggregations.group_table_gender.aggregations).to.have.property('group_table_race');
        expect(query.aggregations.group_chart_0_gender.aggregations).to.have.property('group_chart_0_race');
        expect(query.aggregations.group_table_gender.aggregations.group_table_race.aggregations).to.have.property('group_table_year');
        done()
    });

     it("Build search query with query", function(done){
        var params = {
            "query":{
                "current_year":{"key":"year","queryKey":"current_year","value":"2014","primary":false, caseChange:false},
                "sex":{"key":"gender","queryKey":["sex", "gender"],"value":["M"],"primary":false, caseChange:true},
                "start_date":{"key":"created_date","queryKey":"start_date","value":["M"],"primary":false, dataType:"date", caseChange:false},
                "week_of_death":{"key":"weekday","queryKey":"week_of_death","value":"6","primary":false, caseChange:true},

                "race":{"key":"race","queryKey":"race","value":"1","primary" :true, caseChange:true},
                "created_date":{"key":"created_date","queryKey":["created_date", "start_date"],"value":"M","primary":true,
                    dataType:"date", caseChange:false},
                "month_of_death":{"key":"month","queryKey":"month_of_death","value" :["12"],"primary":false, caseChange:false},
                "autopsy":{"key":"autopsy","queryKey":["autopsy","autopsy_data"],"value":["N"],"primary":true, caseChange:true},

                "dummy":{"key":"dummy","queryKey":"","value":["N"],"primary":true, caseChange:true}
            }, aggregations:{}, pagination:{from:0, size:0}};
        var query = elasticQueryBuilder.buildSearchQuery(params, false);
        var queryZero = {"filtered":{"query":{"bool":{"must":[{"bool":{"should":[{"match":{"race":"1"}}]}},{"bool":{"should":[{"range":{"start_date":{"gte":"M","lte":"M"}}}]}},{"bool":{"should":[{"match":{"autopsy_data":"n"}}]}},{"bool":{}}]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2014"}}]}},{"bool":{"should":[{"term":{"gender":"m"}}]}},{"bool":{"should":[{"range":{"start_date":{"lte":"now"}}}]}},{"bool":{"should":[{"term":{"week_of_death":"6"}}]}},{"bool":{"should":[{"term":{"month_of_death":"12"}}]}}]}}}}
        expect(query[0]).to.not.eql(undefined);
        expect(JSON.stringify(query[0].query)).to.eql(JSON.stringify(queryZero));
        expect(query[1]).eql(undefined);
        done()
    });


    it("Build search query with empty primary query and non-empty filter query", function(done){
        var params = {
            "query":{
                "current_year":{"key":"year","queryKey":"current_year","value":"2014","primary":false, caseChange:false},
                "sex":{"key":"gender","queryKey":["sex", "gender"],"value":["M"],"primary":false, caseChange:true},
                "start_date":{"key":"created_date","queryKey":"start_date","value":["M"],"primary":false, dataType:"date", caseChange:false},
                "week_of_death":{"key":"weekday","queryKey":"week_of_death","value":"6","primary":false, caseChange:true}
            }, aggregations:{}, pagination:{from:0, size:0}};
        var query = elasticQueryBuilder.buildSearchQuery(params, false);
        console.log("query zero ", JSON.stringify(query[0]));
        var queryZero = {"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2014"}}]}},{"bool":{"should":[{"term":{"gender":"m"}}]}},{"bool":{"should":[{"range":{"start_date":{"lte":"now"}}}]}},{"bool":{"should":[{"term":{"week_of_death":"6"}}]}}]}}}};
        expect(query[0]).to.not.eql(undefined);
        expect(JSON.stringify(query[0].query)).to.eql(JSON.stringify(queryZero));
        expect(query[1]).to.eql(undefined);
        done()
    });


    it("Build search query with empty invalid query key", function(done){
        var params = {
            "query":{
                "current_year":{"key":"year","queryKey": new Object(),"value":"2014","primary":false, caseChange:false}
            }, aggregations:{}, pagination:{from:0, size:0}};
        var query = elasticQueryBuilder.buildSearchQuery(params, false);
        console.log("query zero ", JSON.stringify(query[0]));
        var queryZero = {"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{}}]}}}};
        expect(query[0]).to.not.eql(undefined);
        expect(JSON.stringify(query[0].query)).to.eql(JSON.stringify(queryZero));
        expect(query[1]).to.eql(undefined);
        done()
    });

    it("Build search query for STD data", function(done){
        var allOptionValues = ["Both sexes", "All races/ethnicities", "All age groups", "National"];
        var params = {
            "searchFor": "std",
            "countQueryKey": "cases",
            "query": {
                "sex": {
                    "key": "sex",
                    "queryKey": "sex",
                    "value": "Both sexes",
                    "primary": false
                },
                "disease": {
                    "key": "disease",
                    "queryKey": "disease",
                    "value": "Chlamydia",
                    "primary": false
                },
                "race_ethnicity": {
                    "key": "race",
                    "queryKey": "race_ethnicity",
                    "value": "All races/ethnicities",
                    "primary": false
                },
                "current_year": {
                    "key": "current_year",
                    "queryKey": "current_year",
                    "value": "2015",
                    "primary": false
                },
                "age_group": {
                    "key": "age_group",
                    "queryKey": "age_group",
                    "value": "All age groups",
                    "primary": false
                },
                "state": {
                    "key": "state",
                    "queryKey": "state",
                    "value": "National",
                    "primary": false
                }
            },
            "aggregations": {
                "simple": [],
                "nested": {
                    "table": [
                        {
                            "key": "race",
                            "queryKey": "race_ethnicity",
                            "size": 0
                        },
                        {
                            "key": "sex",
                            "queryKey": "sex",
                            "size": 0
                        }
                    ],
                    "charts": [],
                    "maps": []
                }
            }
        };
        var resultQuery = elasticQueryBuilder.buildSearchQuery(params, true, allOptionValues);
        expect(resultQuery[0]).to.not.eql(undefined);
        expect(resultQuery[0].query).to.eql(stdCasesQuery.query);
        expect(resultQuery[1]).to.not.eql(undefined);
        expect(resultQuery[1].query).to.eql(stdPopulationQuery.query);
        done()
    });

    it("Build search query for STD sidefilters count", function(done){
        var allOptionValues = ["Both sexes", "All races/ethnicities", "All age groups", "National"];
        var params = {
            "searchFor": "std",
            "aggregations": {
                "simple": [
                    {
                        "key": "disease",
                        "queryKey": "disease",
                        "size": 0
                    },
                    {
                        "key": "current_year",
                        "queryKey": "current_year",
                        "size": 0
                    },
                    {
                        "key": "sex",
                        "queryKey": "sex",
                        "size": 0
                    },
                    {
                        "key": "race",
                        "queryKey": "race_ethnicity",
                        "size": 0
                    },
                    {
                        "key": "age_group",
                        "queryKey": "age_group",
                        "size": 0
                    },
                    {
                        "key": "state",
                        "queryKey": "state",
                        "size": 0
                    }
                ]
            },
            "query": {
                "sex": {
                    "key": "sex",
                    "queryKey": "sex",
                    "value": "Both sexes",
                    "primary": false
                },
                "disease": {
                    "key": "disease",
                    "queryKey": "disease",
                    "value": "Chlamydia",
                    "primary": false
                },
                "race_ethnicity": {
                    "key": "race",
                    "queryKey": "race_ethnicity",
                    "value": "All races/ethnicities",
                    "primary": false
                },
                "current_year": {
                    "key": "current_year",
                    "queryKey": "current_year",
                    "value": "2015",
                    "primary": false
                },
                "age_group": {
                    "key": "age_group",
                    "queryKey": "age_group",
                    "value": "All age groups",
                    "primary": false
                },
                "state": {
                    "key": "state",
                    "queryKey": "state",
                    "value": "National",
                    "primary": false
                }
            },
            "countQueryKey": "cases"
        };
        var resultQuery = elasticQueryBuilder.buildSearchQuery(params, true);
        expect(resultQuery[0]).to.not.eql(undefined);
        expect(resultQuery[0].query).to.eql(stdSideFilterCountQuery.query);
        expect(resultQuery[1]).to.eql(undefined);
        done()
    });

    it("Build search query for std with multiple filters ", function(done){
        var allOptionValues = ["Both sexes", "All races/ethnicities", "All age groups", "National"];
        var resultQuery = elasticQueryBuilder.buildSearchQuery(stdApiQueryWithMultipleFilters, true, allOptionValues);
        //Make sure main query don't have chart aggregation query
        expect(resultQuery[0].aggregations.group_chart_0_age_group).to.eql(undefined);
        //Chart query should have aggregations for selected filters
        expect(resultQuery[3].length).to.eql(3);
        //group_chart_0_age_group
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group).to.not.eql(undefined);
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group.terms.field).to.eql('age_group');
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group.aggregations.group_chart_0_race).to.not.eql(undefined);
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group.aggregations.group_chart_0_race.terms.field).to.eql('race_ethnicity');
        //group_chart_1_sex
        expect(resultQuery[3][1].aggregations.group_chart_1_sex).to.not.eql(undefined);
        expect(resultQuery[3][1].aggregations.group_chart_1_sex.terms.field).to.eql('sex');
        expect(resultQuery[3][1].aggregations.group_chart_1_sex.aggregations.group_chart_1_age_group).to.not.eql(undefined);
        expect(resultQuery[3][1].aggregations.group_chart_1_sex.aggregations.group_chart_1_age_group.terms.field).to.eql('age_group');
        //group_chart_2_sex
        expect(resultQuery[3][2].aggregations.group_chart_2_sex).to.not.eql(undefined);
        expect(resultQuery[3][2].aggregations.group_chart_2_sex.terms.field).to.eql('sex');
        expect(resultQuery[3][2].aggregations.group_chart_2_sex.aggregations.group_chart_2_race).to.not.eql(undefined);
        expect(resultQuery[3][2].aggregations.group_chart_2_sex.aggregations.group_chart_2_race.terms.field).to.eql('race_ethnicity');
        done();
    });

    it("Build search query for tb with multiple filters ", function(done){
        var allOptionValues = ["Both sexes", "All races/ethnicities", "All age groups", "National"];
        var resultQuery = elasticQueryBuilder.buildSearchQuery(tbApiQueryWithMultipleFilters, true, allOptionValues);
        //Make sure main query don't have chart aggregation query
        expect(resultQuery[0].aggregations.group_chart_0_age_group).to.eql(undefined);
        //Chart query should have aggregations for selected filters
        expect(resultQuery[3].length).to.eql(3);
        //group_chart_0_age_group
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group).to.not.eql(undefined);
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group.terms.field).to.eql('age_group');
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group.aggregations.group_chart_0_race).to.not.eql(undefined);
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group.aggregations.group_chart_0_race.terms.field).to.eql('race_ethnicity');
        //group_chart_1_sex
        expect(resultQuery[3][1].aggregations.group_chart_1_sex).to.not.eql(undefined);
        expect(resultQuery[3][1].aggregations.group_chart_1_sex.terms.field).to.eql('sex');
        expect(resultQuery[3][1].aggregations.group_chart_1_sex.aggregations.group_chart_1_race).to.not.eql(undefined);
        expect(resultQuery[3][1].aggregations.group_chart_1_sex.aggregations.group_chart_1_race.terms.field).to.eql('race_ethnicity');
        //group_chart_2_sex
        expect(resultQuery[3][2].aggregations.group_chart_2_sex).to.not.eql(undefined);
        expect(resultQuery[3][2].aggregations.group_chart_2_sex.terms.field).to.eql('sex');
        expect(resultQuery[3][2].aggregations.group_chart_2_sex.aggregations.group_chart_2_age_group).to.not.eql(undefined);
        expect(resultQuery[3][2].aggregations.group_chart_2_sex.aggregations.group_chart_2_age_group.terms.field).to.eql('age_group');
        done();
    });

    it("Build search query for aids with multiple filters ", function(done){
        var allOptionValues = ["Both sexes", "All races/ethnicities", "All age groups", "National"];
        var resultQuery = elasticQueryBuilder.buildSearchQuery(aidsApiQueryWithMultipleFilters, true, allOptionValues);
        //Make sure main query don't have chart aggregation query
        expect(resultQuery[0].aggregations.group_chart_0_age_group).to.eql(undefined);
        //Chart query should have aggregations for selected filters
        expect(resultQuery[3].length).to.eql(3);
        //group_chart_0_age_group
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group).to.not.eql(undefined);
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group.terms.field).to.eql('age_group');
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group.aggregations.group_chart_0_race).to.not.eql(undefined);
        expect(resultQuery[3][0].aggregations.group_chart_0_age_group.aggregations.group_chart_0_race.terms.field).to.eql('race_ethnicity');
        //group_chart_1_sex
        expect(resultQuery[3][1].aggregations.group_chart_1_sex).to.not.eql(undefined);
        expect(resultQuery[3][1].aggregations.group_chart_1_sex.terms.field).to.eql('sex');
        expect(resultQuery[3][1].aggregations.group_chart_1_sex.aggregations.group_chart_1_age_group).to.not.eql(undefined);
        expect(resultQuery[3][1].aggregations.group_chart_1_sex.aggregations.group_chart_1_age_group.terms.field).to.eql('age_group');
        //group_chart_2_sex
        expect(resultQuery[3][2].aggregations.group_chart_2_sex).to.not.eql(undefined);
        expect(resultQuery[3][2].aggregations.group_chart_2_sex.terms.field).to.eql('sex');
        expect(resultQuery[3][2].aggregations.group_chart_2_sex.aggregations.group_chart_2_race).to.not.eql(undefined);
        expect(resultQuery[3][2].aggregations.group_chart_2_sex.aggregations.group_chart_2_race.terms.field).to.eql('race_ethnicity');
        done();
    });


    it("getGroupQuery returns query with size 0", function(done){
        var filter = {"key":"year","queryKey": "current_year","value":"2014","primary":false};
        var query = elasticQueryBuilder.getGroupQuery(filter);
        expect(JSON.stringify(query)).to.eql(JSON.stringify({key: "year", queryKey: "current_year", getPercent: undefined, size: 0}));
        done()
    });

     it("prepareMapAggregations returns query with size 0", function(done){
        var query = elasticQueryBuilder.prepareMapAggregations();
        expect(JSON.stringify(query)).to.eql(JSON.stringify([[{ key: 'states', queryKey: 'state', size: 0 },{ key: 'sex', queryKey: 'sex', size: 0 }]]));
        done()
    });

    it("add filters to calculate fertility rates", function(done){
        var topLevelQuery = {
            "size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}},
            "query":{
                "filtered":{
                    "query":{"bool":{"must":[]}},
                    "filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2011"}}]}}]}}
                }
            }
        };
        var expectedQuery = {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}},
                                "query":{
                                    "filtered":
                                    {
                                        "query":{"bool":{"must":[]}},
                                        "filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2011"}}]}},
                                                                  {"bool":{"should":[{"term":{"age":"15"}},{"term":{"age":"16"}},{"term":{"age":"17"}},{"term":{"age":"18"}},{"term":{"age":"19"}},{"term":{"age":"20"}},{"term":{"age":"21"}},{"term":{"age":"22"}},{"term":{"age":"23"}},{"term":{"age":"24"}},{"term":{"age":"25"}},{"term":{"age":"26"}},{"term":{"age":"27"}},{"term":{"age":"28"}},{"term":{"age":"29"}},{"term":{"age":"30"}},{"term":{"age":"31"}},{"term":{"age":"32"}},{"term":{"age":"33"}},{"term":{"age":"34"}},{"term":{"age":"35"}},{"term":{"age":"36"}},{"term":{"age":"37"}},{"term":{"age":"38"}},{"term":{"age":"37"}},{"term":{"age":"38"}},{"term":{"age":"39"}},{"term":{"age":"40"}},{"term":{"age":"41"}},{"term":{"age":"42"}},{"term":{"age":"43"}},{"term":{"age":"44"}}]}},
                                                                  {"bool":{"should":[{"term":{"sex":"Female"}}]}}]}
                                        }
                                    }
                                }
                            };
        var updatedQuery = elasticQueryBuilder.addFiltersToCalcFertilityRates(topLevelQuery);
        expect(JSON.stringify(updatedQuery)).to.eql(JSON.stringify(expectedQuery));
        done()
    });

    it("add filters to calculate fertility rates with mother_age_5year_interval filter", function(done){
        var topLevelQuery = {
            "size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}},
            "query":{
                "filtered":{
                    "query":{"bool":{"must":[]}},
                    "filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2011"}}]}},
                                              {"bool":{"should":[{"term":{"mother_age_5year_interval":"15-19 years"}}]}}]}}
                }
            }
        };
        var expectedQuery = {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}},
                                    "query":
                                        {
                                          "filtered":
                                                {
                                                    "query":
                                                        {"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2011"}}]}},
                                                                                      {"bool":{"should":[{"term":{"mother_age_5year_interval":"15-19 years"}}]}},
                                                                                      {"bool":{"should":[{"term":{"sex":"Female"}}]}}]}}
                                                }
                                        }
                            };
        var updatedQuery = elasticQueryBuilder.addFiltersToCalcFertilityRates(topLevelQuery);
        expect(JSON.stringify(updatedQuery)).to.eql(JSON.stringify(expectedQuery));
        done()
    });

    it("find Filter by key and value", function (done) {
        //if found
        var filters = [{"key":"gender","title":"label.filter.gender","queryKey":"sex","primary":false,"value":[],"autoCompleteOptions":[{"key":"Female","title":"Female"},{"key":"Male","title":"Male"}]},{"queryKey":"state","key":"state","primary":false,"value":["AL"],"groupBy":false,"type":"label.filter.group.location","filterType":"checkbox","autoCompleteOptions":[{"key":"AL","title":"Alabama"},{"key":"AK","title":"Alaska"}]}];
        var stateFilter = elasticQueryBuilder.findFilterByKeyAndValue(filters, 'key', 'state');
        expect(stateFilter.key).to.eql('state');

        //not found
        var filter = elasticQueryBuilder.findFilterByKeyAndValue(filters, 'key', 'race');
        expect(filter).to.eql(null);
        done();
    });

    it("test if filter is applied", function (done) {
        //if filter applied
        var filter = {"queryKey":"state","key":"state","primary":false,"value":["AL"],"groupBy":false,"type":"label.filter.group.location","filterType":"checkbox","autoCompleteOptions":[{"key":"AL","title":"Alabama"},{"key":"AK","title":"Alaska"}]};
        var isFilterApplied = elasticQueryBuilder.isFilterApplied(filter);
        expect(isFilterApplied).to.eql(true);

        //not applied
        filter = {"queryKey":"state","key":"state","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.location","filterType":"checkbox","autoCompleteOptions":[{"key":"AL","title":"Alabama"},{"key":"AK","title":"Alaska"}]};
        var isFilterApplied = elasticQueryBuilder.isFilterApplied(filter);
        expect(isFilterApplied).to.eql(false);
        done();
    });



    it("build yrbs grade filter query", function (done) {
        var filter = { key: 'yrbsGrade', title: 'label.yrbs.filter.grade', queryKey:"grade", primary: false, value: '11th', groupBy: false,
            filterType: 'radio',autoCompleteOptions: ['9th', '10th', '11th','12th'], defaultGroup:"column", helpText:"label.help.text.yrbs.grade" }
        var result = elasticQueryBuilder.buildFilterQuery(filter);
        expect(result).to.eql( { key: 'yrbsGrade',
            queryKey: 'grade',
            value: '11th',
            primary: false });
        done();
    });

    it("test filter query with multiple selection", function (done) {
        var filter = { key: 'yrbsGrade', title: 'label.yrbs.filter.grade', queryKey:"grade", primary: false, value: ['11th', '12th'], groupBy: false,
            filterType: 'radio',autoCompleteOptions: ['9th', '10th', '11th','12th'], defaultGroup:"column", helpText:"label.help.text.yrbs.grade" }
        var result = elasticQueryBuilder.buildFilterQuery(filter);
        expect(result).to.eql( { key: 'yrbsGrade',
            queryKey: 'grade',
            value: ['11th','12th'],
            primary: false });
        done();
    });

    it("test filter query with all values selected", function (done) {
        var filter = { key: 'yrbsGrade', title: 'label.yrbs.filter.grade', queryKey:"grade", primary: false, value: ['9th', '10th','11th', '12th'], groupBy: false,
            filterType: 'radio',autoCompleteOptions: ['9th', '10th', '11th','12th'], defaultGroup:"column", helpText:"label.help.text.yrbs.grade" }
        var result = elasticQueryBuilder.buildFilterQuery(filter);
        expect(result).to.eql(false);
        done();
    });

    it("should build API query for prams selected year", function (done) {
        var result = elasticQueryBuilder.buildAPIQuery(pramsFilters);
        var apiQuery = result.apiQuery;
        expect(apiQuery.searchFor).to.eql( 'prams');
        var query = apiQuery.query;
        expect(query.year).to.eql(
            {key: 'year',
            queryKey: 'year',
            value: [ '2007' ],
            primary: false });
        done();
    });

    it("should build API query for prams all years", function (done) {
        var yearFilter = pramsFilters.sideFilters[0].sideFilters[1];
        //reset selected years
        yearFilter.filters.value = [];
        yearFilter.filters.allChecked = true;

        var result = elasticQueryBuilder.buildAPIQuery(pramsFilters);
        var apiQuery = result.apiQuery;
        expect(apiQuery.searchFor).to.eql( 'prams');
        var query = apiQuery.query;
        expect(query.year).to.eql(
            {key: 'year',
            queryKey: 'year',
            value: [ '2009','2007' ],
            primary: false });
        done();
    });

    it("should build API query for selected prams question", function (done) {
        var quesFilter = pramsFilters.allFilters[3];
        //select questions
        quesFilter.value = ['qn319', 'qn318'];
        var result = elasticQueryBuilder.buildAPIQuery(pramsFilters);
        var apiQuery = result.apiQuery;
        var query = apiQuery.query;
        expect(query['question.path']).to.eql(
            {key: 'question',
                queryKey: 'question.key',
                value: [ 'qn319','qn318' ],
                primary: false });
        //reset selected filter
        quesFilter.value = [];
        done();
    });
});