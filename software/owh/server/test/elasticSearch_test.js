var elasticSearch = require('../models/elasticSearch');
var expect = require("expect.js");
var stdCasesQuery = require('./data/std_cases_elastic_query.json');
var stdMapQuery = require('./data/std_map_query.json');
var diseaseChartQuery = require('./data/disease_chart_query.json');
var stdQueryWithMultipleFilters = require('./data/std_query_array_with_multiple_groupBy.json');
var tbQueryWithMultipleFilters = require('./data/tb_query_array_with_multiple_groupBy.json');
var aidsQueryWithMultipleFilters = require('./data/aids_query_array_with_multiple_groupBy.json');
var stdPopulationQuery = require('./data/std_population_elastic_query.json');
var stdSideFilterCountQuery = require('./data/std_sidefilter_count_query.json');
var stdAggreFinalQueryResp = require('./data/std_aggregate_data_final_query_response.json');
var stdSuppressionQueryResp = require('./data/std_suppression_query_response.json');

describe("Elastic Search", function () {

    this.timeout(80000);

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
        var query = [{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}},
            {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}},
            {
                "size": 0,
                "aggregations": {
                    "group_maps_0_states": {
                        "terms": {"field": "state", "size": 0},
                        "aggregations": {
                            "group_maps_0_sex": {
                                "terms": {"field": "sex", "size": 0},
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
        var allSelectedOptions = {"race":{"options":["American Indian", "Asian or Pacific Islander","Black","White"]},"gender":{"options":["Female","Male"]}};
        return new elasticSearch().aggregateDeaths(query, true, allSelectedOptions).then(function (response) {
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

            var stateData = response.data.nested.maps.states;
            expect(stateData[0].name).to.eql('AK');
            expect(stateData[0].deaths).to.be(4316);
            expect(stateData[0].sex[0].name).to.eql('Female');
            expect(stateData[0].sex[0].deaths).to.be(1866);
            expect(stateData[0].sex[1].name).to.eql('Male');
            expect(stateData[0].sex[1].deaths).to.be(2450);

            expect(stateData[50].name).to.eql('WY');
            expect(stateData[50].deaths).to.be(4778);
            expect(stateData[50].sex[0].name).to.eql('Female');
            expect(stateData[50].sex[0].deaths).to.be(2228);
            expect(stateData[50].sex[1].name).to.eql('Male');
            expect(stateData[50].sex[1].deaths).to.be(2550);
        });
    });

    it('should suppress mortality state counts when counts are less', function(done){
        var mortalityESQuery = {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0}}}},"group_chart_0_gender":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"state":"DC"}}]}}]}}}}};
        var censusQuery = {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}},"group_chart_0_gender":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"state":"DC"}}]}}]}}}}};
        var mapQuery = {"size":0,"aggregations":{"group_maps_0_states":{"terms":{"field":"state","size":0},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}};
        var query = [mortalityESQuery, censusQuery, mapQuery];
        var selectedOptions = {"race":{"options":["American Indian","Asian or Pacific Islander","Black","White"]},"gender":{"options":["Female","Male"]}};
        new elasticSearch().aggregateDeaths(query, true, selectedOptions).then(function (results) {
            var tableData = results.data.nested.table;
            expect(tableData.race[0].name).to.equal('American Indian');
            expect(tableData.race[0].deaths).to.equal('suppressed');
            expect(tableData.race[0].pop).to.equal(4583);
            expect(tableData.race[0].gender.length).to.equal(2);
            expect(tableData.race[0].gender[0].name).to.equal('Female');
            expect(tableData.race[0].gender[0].deaths).to.equal('suppressed');
            expect(tableData.race[0].gender[0].pop).to.equal(2308);
            expect(tableData.race[0].gender[1].name).to.equal('Male');
            expect(tableData.race[0].gender[1].deaths).to.equal('suppressed');
            expect(tableData.race[0].gender[1].pop).to.equal(2275);
            expect(tableData.race[1].name).to.equal('Asian or Pacific Islander');
            expect(tableData.race[1].deaths).to.equal(58);
            expect(tableData.race[1].pop).to.equal(32075);
            expect(tableData.race[1].gender.length).to.equal(2);
            expect(tableData.race[1].gender[0].name).to.equal('Female');
            expect(tableData.race[1].gender[0].deaths).to.equal(34);
            expect(tableData.race[1].gender[0].pop).to.equal(18388);
            expect(tableData.race[1].gender[1].name).to.equal('Male');
            expect(tableData.race[1].gender[1].deaths).to.equal(24);
            expect(tableData.race[1].gender[1].pop).to.equal(13687);
            done();
        });

    });

    it('should suppress mortality state counts when some filter options are not available', function(done){
        var mortalityESQuery = {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0}}}},"group_chart_0_gender":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[{"bool":{"should":[{"match":{"ICD_10_code.path":"A16-A19"}}]}}]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"state":"DC"}}]}}]}}}}};
        var censusQuery = {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}},"group_chart_0_gender":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"state":"DC"}}]}}]}}}}} ;
        var mapQuery = {"size":0,"aggregations":{"group_maps_0_states":{"terms":{"field":"state","size":0},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[{"bool":{"should":[{"match":{"ICD_10_code.path":"A16-A19"}}]}}]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}};
        var query = [mortalityESQuery, censusQuery, mapQuery];
        var selectedOptions = {"race":{"options":["American Indian","Asian or Pacific Islander","Black","White"]},"gender":{"options":["Female","Male"]}};
        new elasticSearch().aggregateDeaths(query, true, selectedOptions).then(function (results) {
            var tableData = results.data.nested.table;
            expect(tableData.race[0].name).to.equal('American Indian');
            expect(tableData.race[0].deaths).to.equal('suppressed');
            expect(tableData.race[0].pop).to.equal(4583);
            expect(tableData.race[0].gender.length).to.equal(2);
            expect(tableData.race[0].gender[0].name).to.equal('Female');
            expect(tableData.race[0].gender[0].deaths).to.equal('suppressed');
            expect(tableData.race[0].gender[0].pop).to.equal(2308);
            expect(tableData.race[0].gender[1].name).to.equal('Male');
            expect(tableData.race[0].gender[1].deaths).to.equal('suppressed');
            expect(tableData.race[0].gender[1].pop).to.equal(2275);
            expect(tableData.race[1].name).to.equal('Asian or Pacific Islander');
            expect(tableData.race[1].deaths).to.equal('suppressed');
            expect(tableData.race[1].pop).to.equal(32075);
            expect(tableData.race[1].gender.length).to.equal(2);
            expect(tableData.race[1].gender[0].name).to.equal('Female');
            expect(tableData.race[1].gender[0].deaths).to.equal('suppressed');
            expect(tableData.race[1].gender[0].pop).to.equal(18388);
            expect(tableData.race[1].gender[1].name).to.equal('Male');
            expect(tableData.race[1].gender[1].deaths).to.equal('suppressed');
            expect(tableData.race[1].gender[1].pop).to.equal(13687);

            expect(tableData.race[2].name).to.equal('Black');
            expect(tableData.race[2].deaths).to.equal('suppressed');
            expect(tableData.race[2].pop).to.equal(333883);
            expect(tableData.race[2].gender.length).to.equal(2);
            expect(tableData.race[2].gender[0].name).to.equal('Female');
            expect(tableData.race[2].gender[0].deaths).to.equal('suppressed');
            expect(tableData.race[2].gender[0].pop).to.equal(182093);
            expect(tableData.race[2].gender[1].name).to.equal('Male');
            expect(tableData.race[2].gender[1].deaths).to.equal('suppressed');
            expect(tableData.race[2].gender[1].pop).to.equal(151790);

            expect(tableData.race[3].name).to.equal('White');
            expect(tableData.race[3].deaths).to.equal('suppressed');
            expect(tableData.race[3].pop).to.equal(301687);
            expect(tableData.race[3].gender.length).to.equal(2);
            expect(tableData.race[3].gender[0].name).to.equal('Female');
            expect(tableData.race[3].gender[0].deaths).to.equal('suppressed');
            expect(tableData.race[3].gender[0].pop).to.equal(150838);
            expect(tableData.race[3].gender[1].name).to.equal('Male');
            expect(tableData.race[3].gender[1].deaths).to.equal('suppressed');
            expect(tableData.race[3].gender[1].pop).to.equal(150849);


            done();
        });

    });

    it('should suppress mortality state counts if it falls below 10', function () {
      var query = [{"size":0,"aggregations":{"year":{"terms":{"field":"current_year","size":0}},"race":{"terms":{"field":"race","size":0}},"gender":{"terms":{"field":"sex","size":0}},"state":{"terms":{"field":"state","size":0}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"race":"American Indian"}}]}},{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}}];
        new elasticSearch().aggregateDeaths(query).then(function (results) {
            var stateData = results.simple.state;
            expect(stateData[48].name).to.be('VT');
            expect(stateData[48].deaths).to.be(10);

            expect(stateData[49].name).to.be('WV');
            expect(stateData[49].deaths).to.equal('suppressed');

            expect(stateData[50].name).to.be('NH');
            expect(stateData[50].deaths).to.equal('suppressed');
        });
    });

    it("should count bridged-race data for side filters for 2015 ", function (){
        var query = {"size":0,"aggregations":{"current_year":{"terms":{"field":"current_year","size":0},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}},"sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"race":{"terms":{"field":"race","size":0},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}};
        return new elasticSearch().aggregateCensusData([query], true).then(function (response) {
            var data = response.data.simple;
            expect(data.current_year[0].name).to.eql("2015");
            expect(data.current_year[0].bridge_race).to.eql(321039839);

            expect(data.sex[0].name).to.eql("Female");
            expect(data.sex[0].bridge_race).to.eql(162991686);

            expect(data.sex[1].name).to.eql("Male");
            expect(data.sex[1].bridge_race).to.eql(158048153);

            expect(data.race[0].name).to.eql("American Indian");
            expect(data.race[0].bridge_race).to.eql(4571638);

            expect(data.race[1].name).to.eql("Asian or Pacific Islander");
            expect(data.race[1].bridge_race).to.eql(19972154);
        });
    });

    it("should aggregate bridged-race data by race and gender for 2015", function (){
        var tableQuery = {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}};
        var mapQuery = {"size":0,"aggregations":{"group_maps_0_states":{"terms":{"field":"state","size":0},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}};
        return new elasticSearch().aggregateCensusData([tableQuery, {}, mapQuery], true).then(function (response) {
            var race = response.data.nested.table.race;
            expect(race[0].name).to.eql("American Indian");
            expect(race[0].bridge_race).to.be(4571638);
            expect(race[0].sex[0].name).to.eql("Female");
            expect(race[0].sex[0].bridge_race).to.be(2276911);
            expect(race[0].sex[1].name).to.eql("Male");
            expect(race[0].sex[1].bridge_race).to.be(2294727);

            expect(race[1].name).to.eql("Asian or Pacific Islander");
            expect(race[1].bridge_race).to.be(19972154);
            expect(race[1].sex[0].name).to.eql("Female");
            expect(race[1].sex[0].bridge_race).to.be(10406564);
            expect(race[1].sex[1].name).to.eql("Male");
            expect(race[1].sex[1].bridge_race).to.be(9565590);
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

    it('should suppress natality state counts if it falls below 10', function () {
        var query = [{"size":0,"aggregations":{"current_year":{"terms":{"field":"current_year","size":0}},"mother_age_1year_interval":{"terms":{"field":"mother_age_1year_interval","size":0}},"state":{"terms":{"field":"state","size":0}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"mother_age_1year_interval":"Under 15 years"}}]}}]}}}}}];
        new elasticSearch().aggregateNatalityData(query).then(function (results) {
            var stateData = results.simple.state;
            expect(stateData[41].name).to.be('CT');
            expect(stateData[41].deaths).to.be(101);

            expect(stateData[49].name).to.be('WV');
            expect(stateData[49].deaths).to.equal('suppressed');

            expect(stateData[50].name).to.be('NH');
            expect(stateData[50].deaths).to.equal('suppressed');
        });
    });

    it("Check aggregate natality data with Census rate query", function (done){
        var query = [{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":100000},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":100000},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}},"group_chart_0_sex":{"terms":{"field":"sex","size":100000},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":100000},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}},"group_maps_0_states":{"terms":{"field":"state","size":100000},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":100000},"aggregations":{"group_count_pop":{"sum":{"field":"pop"}}}},"group_count_pop":{"sum":{"field":"pop"}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"race":"American Indian"}},{"term":{"race":"Black"}}]}},{"bool":{"should":[{"term":{"current_year":"2014"}}]}}]}}}}},{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":100000},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":100000},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"race":"American Indian"}},{"term":{"race":"Black"}}]}},{"bool":{"should":[{"term":{"current_year":"2014"}}]}}]}}}}}]
        new elasticSearch().aggregateNatalityData(query).then(function (resp) {
            var  data = resp.data.nested.table.race;
            expect(data[0].name).equal('American Indian');
            expect(data[0].natality).equal(44928);
            var  nestedData = data[0].sex;
            expect(nestedData[0].name).equal('Female');
            expect(nestedData[0].natality).equal(22120);
            expect(nestedData[0].pop).equal(2250008);
            expect(nestedData[1].name).equal('Male');
            expect(nestedData[1].natality).equal(22808);
            expect(nestedData[1].pop).equal(2268973);
            done();
        })
    });

    it("Check aggregate deaths data with Census rate query", function(done) {
        var query = [{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0}}}},"group_chart_0_gender":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0}}}},"group_maps_0_states":{"terms":{"field":"state","size":0},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}},
            {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}},"group_chart_0_gender":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}}]}}}}},
            {
                "size": 0,
                "aggregations": {
                    "group_maps_0_states": {
                        "terms": {"field": "state", "size": 0},
                        "aggregations": {
                            "group_maps_0_sex": {
                                "terms": {"field": "sex", "size": 0},
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
                }}] ;
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
        var query = [
            {
            "size": 0,
            "aggregations": {
                "group_table_race": {
                    "terms": {"field": "race", "size": 0},
                    "aggregations": {"group_table_gender": {"terms": {"field": "sex", "size": 0}}}
                },
                "group_chart_0_gender": {
                    "terms": {"field": "sex", "size": 0},
                    "aggregations": {"group_chart_0_race": {"terms": {"field": "race", "size": 0}}}
                }
            },
            "query": {
                "filtered": {
                    "query": {"bool": {"must": []}},
                    "filter": {"bool": {"must": [{"bool": {"should": [{"term": {"current_year": "2015"}}]}}]}}
                }
            }
        },
            {
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
        },
            {
                "size": 0,
                "aggregations": {
                    "group_maps_0_states": {
                        "terms": {
                            "field": "state",
                            "size": 0
                        },
                        "aggregations": {
                            "group_maps_0_sex": {
                                "terms": {
                                    "field": "sex",
                                    "size": 0
                                },
                                "aggregations": {
                                    "pop": {
                                        "sum": {
                                            "field": "pop"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "query": {
                    "filtered": {
                        "query": {
                            "bool": {
                                "must": []
                            }
                        },
                        "filter": {
                            "bool": {
                                "must": [
                                    {
                                        "bool": {
                                            "should": [
                                                {
                                                    "term": {
                                                        "current_year": "2015"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        ];
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
            var mapData = resp.data.nested.maps;
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
            //Map data
            expect(mapData.states[0].name).equal('AK');
            expect(mapData.states[0].deaths).equal(4316);
            expect(mapData.states[0].standardPop).equal(738432);
            expect(mapData.states[0].ageAdjustedRate).equal('747.4');

            expect(mapData.states[27].name).equal('NC');
            expect(mapData.states[27].deaths).equal(89133);
            expect(mapData.states[27].standardPop).equal(10042802);
            expect(mapData.states[27].ageAdjustedRate).equal('789.9');
            done();
        });
    });

    it("Get population data for map query - crude death rates", function(done) {
        var query = [
            {
                "size": 0,
                "aggregations": {
                    "group_table_state": {
                        "terms": {"field": "state", "size": 0},
                        "aggregations": {"group_table_gender": {"terms": {"field": "sex", "size": 0}}}
                    }
                },
                "query": {
                    "filtered": {
                        "query": {"bool": {"must": []}},
                        "filter": {"bool": {"must": [{"bool": {"should": [{"term": {"current_year": "2015"}}]}}]}}
                    }
                }
            },
            {
                "size": 0,
                "aggregations": {
                    "group_table_state": {
                        "terms": {"field": "state", "size": 0},
                        "aggregations": {
                            "group_table_gender": {
                                "terms": {"field": "sex", "size": 0},
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
            },
            {
                "size": 0,
                "aggregations": {
                    "group_maps_0_states": {
                        "terms": {"field": "state", "size": 0},
                        "aggregations": {
                            "group_maps_0_sex": {
                                "terms": {"field": "sex", "size": 0},
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
            }
        ];
        new elasticSearch().aggregateDeaths(query).then(function (resp) {
            var mapData = resp.data.nested.maps;
            expect(mapData.states[0].name).equal('AK');
            expect(mapData.states[0].deaths).equal(4316);
            expect(mapData.states[0].pop).equal(738432);

            expect(mapData.states[1].name).equal('AL');
            expect(mapData.states[1].deaths).equal(51909);
            expect(mapData.states[1].pop).equal(4858979);
            done();
        });
    });
    it("Check aggregate std data with final query", function (done){
        var query = [stdCasesQuery, stdPopulationQuery, stdMapQuery, diseaseChartQuery];
        new elasticSearch().aggregateDiseaseData(query, 'std', 'owh_std', 'std').then(function (resp) {
            //All races/ethnicities
            expect(resp.data.nested.table.race[0].name).equal(stdAggreFinalQueryResp.data.nested.table.race[0].name);
            expect(resp.data.nested.table.race[0].std).equal(stdAggreFinalQueryResp.data.nested.table.race[0].std);
            //Both sexes
            expect(resp.data.nested.table.race[0].sex[0].name).equal(stdAggreFinalQueryResp.data.nested.table.race[0].sex[0].name);
            expect(resp.data.nested.table.race[0].sex[0].std).equal(stdAggreFinalQueryResp.data.nested.table.race[0].sex[0].std);
            expect(resp.data.nested.table.race[0].sex[0].pop).equal(stdAggreFinalQueryResp.data.nested.table.race[0].sex[0].pop);

            var states = resp.data.nested.maps.states;
            expect(states[0].name).equal('AK');
            expect(states[0].sex[0].name).equal('Both sexes');
            expect(states[0].sex[0].std).equal(11320);
            expect(states[0].sex[1].name).equal('Female');
            expect(states[0].sex[1].std).equal(7572);
            expect(states[0].sex[2].name).equal('Male');
            expect(states[0].sex[2].std).equal(3742);

            done();
        })
    });

    it("Check aggregate std chart data with filter 'Sex', 'Race/Ethinicity' and 'Age Group'", function (done){
        var casesQuery = stdQueryWithMultipleFilters[0];
        var populationQuery = stdQueryWithMultipleFilters[1];
        var mapQuery = stdQueryWithMultipleFilters[2];
        var chartQuery = stdQueryWithMultipleFilters[3];
        var query = [casesQuery, populationQuery, mapQuery, chartQuery];
        new elasticSearch().aggregateDiseaseData(query, 'std', 'owh_std', 'std').then(function (resp) {
            //Chart 0 -> age_group vs race
            expect(resp.data.nested.charts[0].age_group[10].name).equal("All age groups");
            expect(resp.data.nested.charts[0].age_group[10].race[0].name).equal("All races/ethnicities");
            expect(resp.data.nested.charts[0].age_group[10].race[0].std).equal(1526658);
            expect(resp.data.nested.charts[0].age_group[10].race[0].pop).equal(321418820);
            //Chart 1 -> sex vs age_group
            expect(resp.data.nested.charts[1].sex[0].name).equal("Both sexes");
            expect(resp.data.nested.charts[1].sex[0].age_group[10].name).equal("All age groups");
            expect(resp.data.nested.charts[1].sex[0].age_group[10].std).equal(1526658);
            expect(resp.data.nested.charts[1].sex[0].age_group[10].pop).equal(321418820);
            //Chart 2 -> sex vs race
            expect(resp.data.nested.charts[2].sex[0].name).equal("Both sexes");
            expect(resp.data.nested.charts[2].sex[0].race[0].name).equal("All races/ethnicities");
            expect(resp.data.nested.charts[2].sex[0].race[0].std).equal(1526658);
            expect(resp.data.nested.charts[2].sex[0].race[0].pop).equal(321418820);
            done();
        })
    });


    it("Check aggregate std data with sidefilter query", function (done){
        var expectedResponseData = {"data":{"simple":{"disease":[{"name":"Chlamydia","std":1526658}],"current_year":[{"name":"2015","std":1526658}],"race":[{"name":"All races/ethnicities","std":1526658}],"age_group":[{"name":"All age groups","std":1526658}],"sex":[{"name":"Both sexes","std":1526658}],"state":[{"name":"National","std":1526658}],"group_count_cases":[]},"nested":{"table":{},"charts":[],"maps":{}}},"pagination":{"total":1}};
        new elasticSearch().aggregateDiseaseData([stdSideFilterCountQuery], 'std', 'owh_std', 'std').then(function (resp) {
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

    it("Check aggregate std data with final query for suppression", function (done){
        //Filter by State 'Alabama'
        stdCasesQuery.query.filtered.filter.bool.must[3].bool.should[0].term.state = 'AL';
        var query = [stdCasesQuery, stdPopulationQuery, stdMapQuery, diseaseChartQuery];
        new elasticSearch().aggregateDiseaseData(query, 'std', 'owh_std', 'std', true).then(function (resp) {
            //All races/ethnicities
            expect(resp.data.nested.table.race[0].name).equal(stdSuppressionQueryResp.data.nested.table.race[0].name);
            expect(resp.data.nested.table.race[0].std).equal(stdSuppressionQueryResp.data.nested.table.race[0].std);
            //Both sexes
            expect(resp.data.nested.table.race[0].sex[0].name).equal(stdSuppressionQueryResp.data.nested.table.race[0].sex[0].name);
            expect(resp.data.nested.table.race[0].sex[0].std).equal(stdSuppressionQueryResp.data.nested.table.race[0].sex[0].std);
            expect(resp.data.nested.table.race[0].sex[0].pop).equal(stdSuppressionQueryResp.data.nested.table.race[0].sex[0].pop);
            //suppression
            //name = Native Hawaiian or Other Pacific Islander
            expect(resp.data.nested.table.race[6].name).equal(stdSuppressionQueryResp.data.nested.table.race[6].name);
            //Both Sexes
            expect(resp.data.nested.table.race[6].sex[0].name).equal(stdSuppressionQueryResp.data.nested.table.race[6].sex[0].name);
            //value Suppressed
            expect(resp.data.nested.table.race[6].sex[0].std).equal('suppressed');
            expect(stdSuppressionQueryResp.data.nested.table.race[6].sex[0].std).equal('suppressed');
            //Female
            expect(resp.data.nested.table.race[6].sex[1].name).equal(stdSuppressionQueryResp.data.nested.table.race[6].sex[1].name);
            //value Suppressed
            expect(resp.data.nested.table.race[6].sex[1].std).equal('suppressed');
            expect(stdSuppressionQueryResp.data.nested.table.race[6].sex[1].std).equal('suppressed');
            //Male
            expect(resp.data.nested.table.race[6].sex[2].name).equal(stdSuppressionQueryResp.data.nested.table.race[6].sex[2].name);
            //value Suppressed
            expect(resp.data.nested.table.race[6].sex[2].std).equal(0);
            expect(stdSuppressionQueryResp.data.nested.table.race[6].sex[2].std).equal(0);
            done();
        })
    });


    it("should aggregate tb data by race and sex", function (done){
        var query = [{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race_ethnicity","size":0},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_count_cases":{"sum":{"field":"cases"}}}},"group_count_cases":{"sum":{"field":"cases"}}}},"group_count_cases":{"sum":{"field":"cases"}},"group_maps_0_states":{"terms":{"field":"state","size":0},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_count_cases":{"sum":{"field":"cases"}}}},"group_count_cases":{"sum":{"field":"cases"}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"age_group":"All age groups"}}]}},{"bool":{"should":[{"term":{"state":"National"}}]}}]}}}}},[{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"state","size":0},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"age_group":"All age groups"}}]}},{"bool":{"should":[{"term":{"state":"National"}}]}}]}}}}},{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race_ethnicity","size":0},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"age_group":"All age groups"}}]}},{"bool":{"should":[{"term":{"state":"National"}}]}}]}}}}},{"size":0,"aggregations":{"group_chart_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race_ethnicity","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"age_group":"All age groups"}}]}},{"bool":{"should":[{"term":{"state":"National"}}]}}]}}}}}],{"size":0,"aggregations":{"group_maps_0_states":{"terms":{"field":"state","size":0},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_count_cases":{"sum":{"field":"cases"}}}},"group_count_cases":{"sum":{"field":"cases"}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"age_group":"All age groups"}}]}}]}}}}}];
        query.push(diseaseChartQuery);
        new elasticSearch().aggregateDiseaseData(query, 'tb', 'owh_tb', 'tb').then(function (resp) {
            //All races/ethnicities
            expect(resp.data.nested.table.race[0].name).equal('All races/ethnicities');
            expect(resp.data.nested.table.race[0].tb).equal(38170);

            //Both sexes
            expect(resp.data.nested.table.race[0].sex[0].name).equal('Both sexes');
            expect(resp.data.nested.table.race[0].sex[0].tb).equal(19089);

            expect(resp.data.nested.table.race[0].sex[1].name).equal('Female');
            expect(resp.data.nested.table.race[0].sex[1].tb).equal(7647);

            expect(resp.data.nested.table.race[0].sex[2].name).equal('Male');
            expect(resp.data.nested.table.race[0].sex[2].tb).equal(11434);

            //map data
            var states = resp.data.nested.maps.states;
            expect(states[0].name).equal('AK');
            expect(states[0].sex[0].name).equal('Both sexes');
            expect(states[0].sex[0].tb).equal(204);
            expect(states[0].sex[1].name).equal('Female');
            expect(states[0].sex[1].tb).equal(24);
            expect(states[0].sex[2].name).equal('Male');
            expect(states[0].sex[2].tb).equal(44);

            done();
        })
    });

    it("should aggregate tb data for each filter", function (done){
        var query = {"size":0,"aggregations":{"current_year":{"terms":{"field":"current_year","size":0},"aggregations":{"group_count_cases":{"sum":{"field":"cases"}}}},"group_count_cases":{"sum":{"field":"cases"}},"sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_count_cases":{"sum":{"field":"cases"}}}},"race":{"terms":{"field":"race_ethnicity","size":0},"aggregations":{"group_count_cases":{"sum":{"field":"cases"}}}},"age_group":{"terms":{"field":"age_group","size":0},"aggregations":{"group_count_cases":{"sum":{"field":"cases"}}}},"state":{"terms":{"field":"state","size":0},"aggregations":{"group_count_cases":{"sum":{"field":"cases"}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"sex":"Both sexes"}}]}},{"bool":{"should":[{"term":{"race_ethnicity":"All races/ethnicities"}}]}},{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"age_group":"All age groups"}}]}},{"bool":{"should":[{"term":{"state":"National"}}]}}]}}}}};
        new elasticSearch().aggregateDiseaseData([query], 'tb', 'owh_tb', 'tb', false).then(function (resp) {
            //SideFilter counts: current_year
            expect(resp.data.simple.current_year[0].name).equal('2015');
            expect(resp.data.simple.current_year[0].tb).equal(19089);
            //SideFilter counts: race
            expect(resp.data.simple.race[0].name).equal('All races/ethnicities');
            expect(resp.data.simple.race[0].tb).equal(19089);
            //SideFilter counts: age_group
            expect(resp.data.simple.age_group[0].name).equal('All age groups');
            expect(resp.data.simple.age_group[0].tb).equal(19089);
            //SideFilter counts: sex
            expect(resp.data.simple.sex[0].name).equal('Both sexes');
            expect(resp.data.simple.sex[0].tb).equal(19089);
            done();
        })
    });

    it("Check aggregate tb chart data with filter 'Sex', 'Race/Ethinicity' and 'Age Group'", function (done){
        var casesQuery = tbQueryWithMultipleFilters[0];
        var populationQuery = tbQueryWithMultipleFilters[1];
        var mapQuery = tbQueryWithMultipleFilters[2];
        var chartQuery = tbQueryWithMultipleFilters[3];
        var query = [casesQuery, populationQuery, mapQuery, chartQuery];
        new elasticSearch().aggregateDiseaseData(query, 'tb', 'owh_tb', 'tb').then(function (resp) {
            //Chart 0 -> age_group vs race
            expect(resp.data.nested.charts[0].age_group[8].name).equal("All age groups");
            expect(resp.data.nested.charts[0].age_group[8].race[0].name).equal("All races/ethnicities");
            expect(resp.data.nested.charts[0].age_group[8].race[0].tb).equal(19089);
            expect(resp.data.nested.charts[0].age_group[8].race[0].pop).equal(321039839);
            //Chart 1 -> sex vs age_group
            expect(resp.data.nested.charts[1].sex[0].name).equal("Both sexes");
            expect(resp.data.nested.charts[1].sex[0].race[0].name).equal("All races/ethnicities");
            expect(resp.data.nested.charts[1].sex[0].race[0].tb).equal(19089);
            expect(resp.data.nested.charts[1].sex[0].race[0].pop).equal(321039839);
            //Chart 2 -> sex vs race
            expect(resp.data.nested.charts[2].sex[0].name).equal("Both sexes");
            expect(resp.data.nested.charts[2].sex[0].age_group[8].name).equal("All age groups");
            expect(resp.data.nested.charts[2].sex[0].age_group[8].tb).equal(19089);
            expect(resp.data.nested.charts[2].sex[0].age_group[8].pop).equal(321039839);
            done();
        })
    });

    it("Check aggregate aids chart data with filter 'Sex', 'Race/Ethinicity' and 'Age Group'", function (done){
        var casesQuery = aidsQueryWithMultipleFilters[0];
        var PopulationQuery = aidsQueryWithMultipleFilters[1];
        var mapQuery = aidsQueryWithMultipleFilters[2];
        var chartQuery = aidsQueryWithMultipleFilters[3];
        var query = [casesQuery, PopulationQuery, mapQuery, chartQuery];
        new elasticSearch().aggregateDiseaseData(query, 'aids', 'owh_aids', 'aids').then(function (resp) {
            //Chart 0 -> age_group vs race
            expect(resp.data.nested.charts[0].age_group[0].name).equal("All age groups");
            expect(resp.data.nested.charts[0].age_group[0].race[0].name).equal("All races/ethnicities");
            expect(resp.data.nested.charts[0].age_group[0].race[0].aids).equal(18902);
            expect(resp.data.nested.charts[0].age_group[0].race[0].pop).equal(268302942);
            //Chart 1 -> sex vs age_group
            expect(resp.data.nested.charts[1].sex[0].name).equal("Both sexes");
            expect(resp.data.nested.charts[1].sex[0].age_group[0].name).equal("All age groups");
            expect(resp.data.nested.charts[1].sex[0].age_group[0].aids).equal(18902);
            expect(resp.data.nested.charts[1].sex[0].age_group[0].pop).equal(268302942);
            //Chart 2 -> sex vs race
            expect(resp.data.nested.charts[2].sex[0].name).equal("Both sexes");
            expect(resp.data.nested.charts[2].sex[0].race[0].name).equal("All races/ethnicities");
            expect(resp.data.nested.charts[2].sex[0].race[0].aids).equal(18902);
            expect(resp.data.nested.charts[2].sex[0].race[0].pop).equal(268302942);
            done();
        })
    });
    // We disabled side filters count as we are getting infant death data from wonder API
    /*  it("Check aggregate infant mortality data with birth query", function (){
        var query = [{"size":0,"aggregations":{"year_of_death":{"terms":{"field":"year_of_death","size":0}},"sex":{"terms":{"field":"sex","size":0}},"infant_age_at_death":{"terms":{"field":"infant_age_at_death","size":0}},"race":{"terms":{"field":"race","size":0}},"hispanic_origin":{"terms":{"field":"hispanic_origin","size":0}},"mother_age_5_interval":{"terms":{"field":"mother_age_5_interval","size":0}},"marital_status":{"terms":{"field":"marital_status","size":0}},"mother_education":{"terms":{"field":"mother_education","size":0}},"gestation_recode11":{"terms":{"field":"gestation_recode11","size":0}},"gestation_recode10":{"terms":{"field":"gestation_recode10","size":0}},"gestation_weekly":{"terms":{"field":"gestation_weekly","size":0}},"prenatal_care":{"terms":{"field":"prenatal_care","size":0}},"birth_weight":{"terms":{"field":"birth_weight_r12","size":0}},"birth_plurality":{"terms":{"field":"birth_plurality","size":0}},"live_birth":{"terms":{"field":"live_birth","size":0}},"birth_place":{"terms":{"field":"birth_place","size":0}},"delivery_method":{"terms":{"field":"delivery_method","size":0}},"medical_attendant":{"terms":{"field":"medical_attendant","size":0}},"ucd-chapter-10":{"terms":{"field":"ICD_10_code.path","size":0}},"state":{"terms":{"field":"state","size":0}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"year_of_death":"2014"}}]}}]}}}}},null,null];
        new elasticSearch().aggregateInfantMortalityData(query).then(function (resp) {
            var  data = resp.data.simple;
            expect(data[0].name).equal('American Indian / Alaskan Native');
            expect(data[0].infant_mortality).equal(340);
            expect(data[0].pop).equal(44928);
            var  nestedData = data[0].sex;
            expect(nestedData[0].name).equal('Female');
            expect(nestedData[0].infant_mortality).equal(146);
            expect(nestedData[0].pop).equal(22120);
            expect(nestedData[1].name).equal('Male');
            expect(nestedData[1].infant_mortality).equal(194);
            expect(nestedData[1].pop).equal(22808);
            expect(data[1].name).equal('Asian / Pacific Islander');
            expect(data[1].infant_mortality).equal(1080);
            expect(data[1].pop).equal(282723);
            done();
        })
    });

    it("Check aggregate infant mortality data for sidefilter query", function (){
        var query = [{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":0}}}},"group_chart_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"year_of_death":"2014"}}]}}]}}}}},{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}},"group_chart_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2014"}}]}}]}}}}},{"size":0,"aggregations":{"group_maps_0_states":{"terms":{"field":"state","size":0},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"year_of_death":"2014"}}]}}]}}}}}];
        new elasticSearch().aggregateInfantMortalityData(query).then(function (resp) {
            var  simple = resp.data.simple;
            expect(simple.race[0].name).equal('White');
            expect(simple.race[0].infant_mortality).equal(14821);
            expect(simple.sex[0].name).equal('Male');
            expect(simple.sex[0].infant_mortality).equal(12799);
            done();
        })
    });*/

    it("Check aggregate infant mortality data with birth query for years 2007 - 20014. Database D69", function (done){
        //user selected year '2014' and Race on 'Row' and 'Sex' on 'Column'
        var apiQuery = {"searchFor":"infant_mortality","query":{"year_of_death":{"key":"year_of_death","queryKey":"year_of_death","value":["2014"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"race","queryKey":"race","size":0},{"key":"sex","queryKey":"sex","size":0}],"charts":[[{"key":"sex","queryKey":"sex","size":0},{"key":"race","queryKey":"race","size":0}]],"maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}}};
        new elasticSearch().aggregateInfantMortalityData(apiQuery, false, ['2014']).then(function (resp) {
            var  data = resp.data.nested.table.race;
            //Black
            expect(data[2].name).equal('Black or African American');
            expect(data[2].infant_mortality).equal(6853);
            expect(data[2].deathRate).equal("10.70");
            expect(data[2].pop).equal(640562);
            var  nestedData2 = data[2].sex;
            expect(nestedData2[0].name).equal('Female');
            expect(nestedData2[0].infant_mortality).equal(3101);
            expect(nestedData2[0].deathRate).equal("9.82");
            expect(nestedData2[0].pop).equal(315741);
            expect(nestedData2[1].name).equal('Male');
            expect(nestedData2[1].infant_mortality).equal(3752);
            expect(nestedData2[1].deathRate).equal("11.55");
            expect(nestedData2[1].pop).equal(324821);
            //White
            expect(data[3].name).equal('White');
            expect(data[3].infant_mortality).equal(14927);
            expect(data[3].deathRate).equal("4.94");
            expect(data[3].pop).equal(3019863);
            var  nestedData1 = data[3].sex;
            expect(nestedData1[0].name).equal('Female');
            expect(nestedData1[0].infant_mortality).equal(6590);
            expect(nestedData1[0].deathRate).equal("4.48");
            expect(nestedData1[0].pop).equal(1472438);
            expect(nestedData1[1].name).equal('Male');
            expect(nestedData1[1].infant_mortality).equal(8337);
            expect(nestedData1[1].deathRate).equal("5.39");
            expect(nestedData1[1].pop).equal(1547425);
            done();
        })
    });

    it("Check aggregate infant mortality data with birth query for years 2003 - 2006. Database D31", function (done){
        //user selected year '2014' and Race on 'Row' and 'Sex' on 'Column'
        var apiQuery = {"searchFor":"infant_mortality","query":{"year_of_death":{"key":"year_of_death","queryKey":"year_of_death","value":["2006"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"race","queryKey":"race","size":0},{"key":"sex","queryKey":"sex","size":0}],"charts":[[{"key":"sex","queryKey":"sex","size":0},{"key":"race","queryKey":"race","size":0}]],"maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}}};
        new elasticSearch().aggregateInfantMortalityData(apiQuery, false, ['2006']).then(function (resp) {
            var  data = resp.data.nested.table.race;
            //Black
            expect(data[2].name).equal('Black or African American');
            expect(data[2].infant_mortality).equal(8595);
            expect(data[2].deathRate).equal("12.90");
            expect(data[2].pop).equal(666494);
            var  nestedData2 = data[2].sex;
            expect(nestedData2[0].name).equal('Female');
            expect(nestedData2[0].infant_mortality).equal(3869);
            expect(nestedData2[0].deathRate).equal("11.84");
            expect(nestedData2[0].pop).equal(326650);
            expect(nestedData2[1].name).equal('Male');
            expect(nestedData2[1].infant_mortality).equal(4726);
            expect(nestedData2[1].deathRate).equal("13.91");
            expect(nestedData2[1].pop).equal(339844);
            //White
            expect(data[3].name).equal('White');
            expect(data[3].infant_mortality).equal(18422);
            expect(data[3].deathRate).equal("5.57");
            expect(data[3].pop).equal(3310331);
            var  nestedData1 = data[3].sex;
            expect(nestedData1[0].name).equal('Female');
            expect(nestedData1[0].infant_mortality).equal(8039);
            expect(nestedData1[0].deathRate).equal("4.98");
            expect(nestedData1[0].pop).equal(1614445);
            expect(nestedData1[1].name).equal('Male');
            expect(nestedData1[1].infant_mortality).equal(10384);
            expect(nestedData1[1].deathRate).equal("6.12");
            expect(nestedData1[1].pop).equal(1695886);
            done();
        })
    });

    it("Check aggregate infant mortality data with birth query for years 2000 - 2002. Database D18", function (done){
        //user selected year '2014' and Race on 'Row' and 'Sex' on 'Column'
        var apiQuery = {"searchFor":"infant_mortality","query":{"year_of_death":{"key":"year_of_death","queryKey":"year_of_death","value":["2001"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"race","queryKey":"race","size":0},{"key":"sex","queryKey":"sex","size":0}],"charts":[[{"key":"sex","queryKey":"sex","size":0},{"key":"race","queryKey":"race","size":0}]],"maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}}};
        new elasticSearch().aggregateInfantMortalityData(apiQuery, false, ['2001']).then(function (resp) {
            var  data = resp.data.nested.table.race;
            //Black
            expect(data[1].name).equal('Black or African American');
            expect(data[1].infant_mortality).equal(8084);
            expect(data[1].deathRate).equal("13.34");
            expect(data[1].pop).equal(606183);
            var  nestedData2 = data[1].sex;
            expect(nestedData2[0].name).equal('Female');
            expect(nestedData2[0].infant_mortality).equal(3541);
            expect(nestedData2[0].deathRate).equal("11.87");
            expect(nestedData2[0].pop).equal(298332);
            expect(nestedData2[1].name).equal('Male');
            expect(nestedData2[1].infant_mortality).equal(4543);
            expect(nestedData2[1].deathRate).equal("14.76");
            expect(nestedData2[1].pop).equal(307851);
            //White
            expect(data[7].name).equal('White');
            expect(data[7].infant_mortality).equal(18087);
            expect(data[7].deathRate).equal("5.69");
            expect(data[7].pop).equal(3177698);
            var  nestedData1 = data[7].sex;
            expect(nestedData1[0].name).equal('Female');
            expect(nestedData1[0].infant_mortality).equal(7955);
            expect(nestedData1[0].deathRate).equal("5.13");
            expect(nestedData1[0].pop).equal(1552150);
            expect(nestedData1[1].name).equal('Male');
            expect(nestedData1[1].infant_mortality).equal(10132);
            expect(nestedData1[1].deathRate).equal("6.23");
            expect(nestedData1[1].pop).equal(1625548);
            done();
        })
    });


    it("Check aggregate infant mortality data with birth query - selected 'All' option and data not available for few options", function (done){
        //user selected year '2000', state 'AL' and Race on 'Row' and 'Sex' on 'Column'
        var apiQuery = {"searchFor":"infant_mortality","query":{"year_of_death":{"key":"year_of_death","queryKey":"year_of_death","value":["2000"],"primary":false},"state":{"key":"state","queryKey":"state","value":["AL"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"race","queryKey":"race","size":0},{"key":"sex","queryKey":"sex","size":0}],"charts":[[{"key":"sex","queryKey":"sex","size":0},{"key":"race","queryKey":"race","size":0}]],"maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}}};
        new elasticSearch().aggregateInfantMortalityData(apiQuery, false, ['2000']).then(function (resp) {
            var  data = resp.data.nested.table.race;
            //Only Black and White race data available for state 'AL'
            expect(data[0].name).equal('American Indian or Alaska Native');
            expect(data[0].infant_mortality).equal('suppressed');
            expect(data[1].name).equal('Black or African American');
            expect(data[1].infant_mortality).equal(317);
            var  nestedData = data[1].sex;
            expect(nestedData[0].name).equal('Female');
            expect(nestedData[0].infant_mortality).equal(140);
            expect(nestedData[0].deathRate).equal('13.82');
            expect(nestedData[0].pop).equal(10130);
            expect(nestedData[1].name).equal('Male');
            expect(nestedData[1].infant_mortality).equal(177);
            expect(nestedData[1].deathRate).equal('17.05');
            expect(nestedData[1].pop).equal(10382);
            expect(data[2].name).equal('Chinese');
            expect(data[2].infant_mortality).equal('suppressed');
            expect(data[7].name).equal('White');
            done();
        })
    });

    it("Check aggregate infant mortality data with birth query - selected specific option and data not available for selected options", function (done){
        //user selected year '2000', state 'AK' and Race on 'Row' and 'Sex' on 'Column'
        var apiQuery = {"searchFor":"infant_mortality","query":{"year_of_death":{"key":"year_of_death","queryKey":"year_of_death","value":["2000"],"primary":false},"state":{"key":"state","queryKey":"state","value":["AL"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"race","queryKey":"race","size":0},{"key":"sex","queryKey":"sex","size":0}],"charts":[[{"key":"sex","queryKey":"sex","size":0},{"key":"race","queryKey":"race","size":0}]],"maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}}};
        new elasticSearch().aggregateInfantMortalityData(apiQuery, false, ['2000']).then(function (resp) {
            var  data = resp.data.nested.table.race;
            //only Black and White should be available for state 'AL' and year 2000
            expect(data.length).equal(8);
            expect(data[0].name).equal('American Indian or Alaska Native');
            expect(data[0].infant_mortality).equal('suppressed');
            expect(data[1].name).equal('Black or African American');
            expect(data[2].name).equal('Chinese');
            expect(data[3].name).equal('Filipino');
            expect(data[4].name).equal('Hawaiian');
            expect(data[5].name).equal('Japanese');
            expect(data[7].name).equal('White');
            done();
        })
    });
   // We disabled side filters count as we are getting infant death data from wonder API
   /* it('should suppress infant mortality state counts if it falls below 10', function () {

        var query = [{"size":0,"aggregations":{"year_of_death":{"terms":{"field":"year_of_death","size":0}},"sex":{"terms":{"field":"sex","size":0}},"race":{"terms":{"field":"race","size":0}},"state":{"terms":{"field":"state","size":0}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"race":"American Indian or Alaska Native"}}]}},{"bool":{"should":[{"term":{"year_of_death":"2001"}}]}}]}}}}}];

        new elasticSearch().aggregateInfantMortalityData(query).then(function (results) {
            var stateData = results.simple.state;

            expect(stateData[12].name).to.be('CO');
            expect(stateData[12].deaths).to.equal('suppressed');

            expect(stateData[13].name).to.be('FL');
            expect(stateData[13].deaths).to.equal('suppressed');
        });
    });*/

    it('should merge populations into mortality response', function(done){
        var mort =   {"data":{"nested":{"table":{"group_table_race":[{"name":"1","deaths":2106697,"undefined":[{"name":"F","deaths":1079109},{"name":"M","deaths":1027588}]},{"name":"2","deaths":291706,"undefined":[{"name":"M","deaths":148258},{"name":"F","deaths":143448}]}]}}}};
        var census = {"data":{"nested":{"table":{"group_table_race":[{"name":"2","undefined":[{"name":"F","pop":4444},{"name":"M","pop":3333}]},{"name":"1","undefined":[{"name":"M","pop":5555},{"name":"F","pop":6666}]}]}}}};
        var mergedData = {"data":{"nested":{"table":{"group_table_race":[{"name":"1","deaths":2106697,"undefined":[{"name":"F","deaths":1079109, "pop":6666},{"name":"M","deaths":1027588,"pop":5555 }]},{"name":"2","deaths":291706,"undefined":[{"name":"F","deaths":143448, "pop":4444},{"name":"M","deaths":148258, "pop":3333}]}]}}}};
        var es = new elasticSearch();

        es.mergeWithCensusData(mort, census, 'pop');
        expect(JSON.stringify(mort)).equal(JSON.stringify(mergedData));
        done();
    });

    describe('aggregateCancerData', function () {
        it('should aggregate cancer incidence data for side filter query', function (done) {
            var query = [{"size":0,"aggregations":{"current_year":{"terms":{"field":"current_year","size":0}},"sex":{"terms":{"field":"sex","size":0}},"race":{"terms":{"field":"race","size":0}},"hispanic_origin":{"terms":{"field":"hispanic_origin","size":0}},"age_group":{"terms":{"field":"age_group","size":0}},"site":{"terms":{"field":"cancer_site","size":0}},"state":{"terms":{"field":"state","size":0}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2014"}}]}}]}}}}},null,null];
            var mock = new elasticSearch();
            mock.aggregateCancerData(query).then(function (response) {
                expect(response.hits.total).equal(1654838);
            });
            done();
        });

        it('should aggregate cancer incidence data for final filter query', function (done) {
            var query = [{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":0}}}},"group_chart_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2014"}}]}}]}}}}},{"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_sex":{"terms":{"field":"sex","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}},"group_chart_0_sex":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0},"aggregations":{"pop":{"sum":{"field":"pop"}}}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2014"}}]}}]}}}}},{"size":0,"aggregations":{"group_maps_0_states":{"terms":{"field":"state","size":0},"aggregations":{"group_maps_0_sex":{"terms":{"field":"sex","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2014"}}]}}]}}}}}];
            var mock = new elasticSearch();
            mock.aggregateCancerData(query).then(function (response) {
                var results = response.group_table_race.buckets.map(function (bucket) {
                    return bucket.doc_count;
                });
                var expected = [ 1364295, 180310, 53141, 47775, 9317 ];
                expected.forEach(function (value) {
                    expect(results).to.contain(value);
                });
            });
            done();
        });
    })
});
