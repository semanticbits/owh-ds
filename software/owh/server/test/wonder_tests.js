var wonder = require("../api/wonder");
var supertest = require("supertest");
var expect = require("expect.js");
var stateWonderResponse = require('./data/wonder_response_for_states.json');
var stateWonderResponseForCharts_RaceAndState = require('./data/wonder_response_for_charts_race_state.json');
var stateWonderResponseForCharts_GenderAndSex = require('./data/wonder_response_for_charts_gender_sex.json');
var Q = require('q');

describe("WONDER API", function () {
    var w;
    this.timeout(60000);
    beforeEach( function () {
        w = new wonder('D77');
    });

    it("invoke wonder API default query (group by 2)", function (done){
        var startTime = new Date();
        query = {"searchFor":"deaths","query":{"current_year":{"key":"year","queryKey":"current_year","value":["2014"],"primary":false}},
            "aggregations":{"simple":[],"nested":{"table":[{"key":"race","queryKey":"race","size":100000},{"key":"gender","queryKey":"sex","size":100000}]}}}

        w.invokeWONDER(query).then( function (resp) {
            var duration = new Date() - startTime;
            console.log("invoke wonder API default query duration: "+duration);
            expect(resp.table).to.eql({ 'American Indian or Alaska Native':
                { Female: { ageAdjustedRate: '514.1', standardPop :2250008 },
                    Male: { ageAdjustedRate: '685.4', standardPop :2268973 },
                    Total: { ageAdjustedRate: '594.1', standardPop : 4518981} },
                'Asian or Pacific Islander':
                    { Female: { ageAdjustedRate: '331.1', standardPop :10113992 },
                        Male: { ageAdjustedRate: '462.0', standardPop :9284222 },
                        Total: { ageAdjustedRate: '388.3', standardPop :19398214} },
                'Black or African American':
                    { Female: { ageAdjustedRate: '713.3', standardPop :23068743 },
                        Male: { ageAdjustedRate: '1,034.0', standardPop :21240651 },
                        Total: { ageAdjustedRate: '849.3', standardPop :44309394 } },
                White:
                    { Female: { ageAdjustedRate: '617.6', standardPop :126487826 },
                        Male: { ageAdjustedRate: '853.4', standardPop :124142641 },
                        Total: { ageAdjustedRate: '725.4', standardPop :250630467 } },
                Total: { ageAdjustedRate: '724.6', standardPop :318857056} });
            //We didn't pass chart details in query, so response array won't have a chart results.
            expect(resp.charts).to.eql([]);
            done();
        }, function(err){
            console.log(err);
            expect(err).to.be.undefined();
        });
    });
    it("invoke wonder API query for state", function(done){

        query = {"searchFor":"deaths","query":{"current_year":{"key":"year","queryKey":"current_year","value":["2015"],"primary":false}},
            "aggregations":{"simple":[],"nested":{"table": [{"key":"race","queryKey":"race","size":0},
                                                            {"key":"state","queryKey ":"state","size":0},
                                                            {"key":"gender","queryKey":"sex","size":0}],
            "tableCounts": [{"key":"gender","queryKey":"sex","size":0},
                {"key":"race","queryKey":"race","size":0},
                {"key":"state","queryKey ":"state","size":0}],
            "charts":[[{"key":"race","queryKey":"race","size":0},
                       {"key":"state","queryKey":"state","size":0}],
                      [{"key":"gender","queryKey":"sex","size":0},
                       {"key":"race","queryKey":"race","size":0}]],
            "maps":[[{"key":"states","queryKey":"state","size":0},
                     {"key":"sex","queryKey":"sex","size":0}]]
            }}
        };
        var startTime = new Date();
        w.invokeWONDER(query).then( function (resp) {
            var duration = new Date() - startTime;
            console.log("invoke wonder API query (group by 3) duration: " + duration);
            expect(resp.table).to.eql(stateWonderResponse);
            expect(resp.charts[0]).to.eql(stateWonderResponseForCharts_RaceAndState);
            expect(resp.charts[1]).to.eql(stateWonderResponseForCharts_GenderAndSex);
            //Map data
            expect(resp.maps.Alabama.Female.standardPop).to.eql(2505795);
            expect(resp.maps.Alabama.Male.standardPop).to.eql(2353184);
            done();
        }, function(err){
            console.log(err);
            expect(err).to.be.undefined();
        });
    });

    it("invoke wonder API query (group by 3)", function (done){
        query = {"searchFor":"deaths","query":{"current_year":{"key":"year","queryKey":"current_year","value":["2014","2013"],"primary":false}},
                  "aggregations":{"simple":[],"nested":{"table":[{"key":"race","queryKey":"race","size":100000},
                                                                 {"key":"gender","queryKey":"sex","size":100000},
                                                                 {"key":"hispanicOrigin","queryKey":"hispanic_origin","size":100000}]}}};
        var startTime = new Date();
        w.invokeWONDER(query).then( function (resp) {
            var duration = new Date() - startTime;
            console.log("invoke wonder API query (group by 3) duration: "+duration);
            expect(resp.table).to.eql( { 'American Indian or Alaska Native':
                { Female:
                    { 'Hispanic or Latino': { ageAdjustedRate: '79.3',standardPop:1763399  },
                        'Not Hispanic or Latino': { ageAdjustedRate: '671.9',standardPop: 2704061},
                        'Not Stated': { ageAdjustedRate: 'Not Applicable',standardPop:'Not Applicable' },
                        Total: { ageAdjustedRate: '511.2',standardPop: 4467460 } },
                    Male:
                        { 'Hispanic or Latino': { ageAdjustedRate: '107.9',standardPop:1903219 },
                            'Not Hispanic or Latino': { ageAdjustedRate: '932.6',standardPop:2606236 },
                            'Not Stated': { ageAdjustedRate: 'Not Applicable',standardPop:'Not Applicable' },
                            Total: { ageAdjustedRate: '687.1',standardPop: 4509455} },
                    Total: { ageAdjustedRate: '592.9',standardPop: 8976915} },
                'Asian or Pacific Islander':
                    { Female:
                        { 'Hispanic or Latino': { ageAdjustedRate: '202.1',standardPop: 943800},
                            'Not Hispanic or Latino': { ageAdjustedRate: '338.9',standardPop:18883229 },
                            'Not Stated': { ageAdjustedRate: 'Not Applicable',standardPop:'Not Applicable' },
                            Total: { ageAdjustedRate: '336.9',standardPop:19827029 } },
                        Male:
                            { 'Hispanic or Latino': { ageAdjustedRate: '292.2',standardPop: 953772},
                                'Not Hispanic or Latino': { ageAdjustedRate: '476.7',standardPop:17247549 },
                                'Not Stated': { ageAdjustedRate: 'Not Applicable',standardPop:'Not Applicable' },
                                Total: { ageAdjustedRate: '474.4',standardPop: 18201321} },
                        Total: { ageAdjustedRate: '396.5',standardPop:38028350 } },
                'Black or African American':
                    { Female:
                        { 'Hispanic or Latino': { ageAdjustedRate: '169.6',standardPop:2988006 },
                            'Not Hispanic or Latino': { ageAdjustedRate: '735.8',standardPop:42842267 },
                            'Not Stated': { ageAdjustedRate: 'Not Applicable',standardPop:'Not Applicable' },
                            Total: { ageAdjustedRate: '716.9',standardPop: 45830273} },
                        Male:
                            { 'Hispanic or Latino': { ageAdjustedRate: '236.1',standardPop: 2899054},
                                'Not Hispanic or Latino': { ageAdjustedRate: '1,071.6',standardPop:39276338 },
                                'Not Stated': { ageAdjustedRate: 'Not Applicable',standardPop:'Not Applicable' },
                                Total: { ageAdjustedRate: '1,043.2',standardPop: 42175392} },
                        Total: { ageAdjustedRate: '855.0',standardPop:88005665 } },
                White:
                    { Female:
                        { 'Hispanic or Latino': { ageAdjustedRate: '466.8',standardPop:48284882	 },
                            'Not Hispanic or Latino': { ageAdjustedRate: '636.1',standardPop: 203988162	},
                            'Not Stated': { ageAdjustedRate: 'Not Applicable',standardPop:'Not Applicable' },
                            Total: { ageAdjustedRate: '620.6',standardPop:252273044 } },
                        Male:
                            { 'Hispanic or Latino': { ageAdjustedRate: '667.7',standardPop:49722777 },
                                'Not Hispanic or Latino': { ageAdjustedRate: '874.5',standardPop:197979144	 },
                                'Not Stated': { ageAdjustedRate: 'Not Applicable',standardPop:'Not Applicable' },
                                Total: { ageAdjustedRate: '856.3',standardPop:247701921 } },
                        Total: { ageAdjustedRate: '728.2',standardPop: 499974965} },
                Total: { ageAdjustedRate: '728.2',standardPop: 634985895} });
            done();
        }, function(err){
            console.log(err);
            expect(err).to.be.undefined();
        });
    });

    it("invoke wonder API bigger query (group by 5)", function (done){
        query = {"searchFor":"deaths","query":{},
                 "aggregations":{"simple":[],"nested":{"table":[{"key":"race","queryKey":"race","size":100000},
                                                                {"key":"placeofdeath","queryKey":"place_of_death","size":100000},
                                                                {"key":"hispanicOrigin","queryKey":"hispanic_origin","size":100000},
                                                                {"key":"gender","queryKey":"sex","size":100000},
                                                                {"key":"weekday","queryKey":"week_of_death","size":100000}],
                                                                "charts":[[{"key":"race","queryKey":"race","size":100000},{"key":"hispanicOrigin","queryKey":"hispanic_origin","size":100000}],[{"key":"gender","queryKey":"sex","size":100000},{"key":"race","queryKey":"race","size":100000}],[{"key":"gender","queryKey":"sex","size":100000},{"key":"placeofdeath","queryKey":"place_of_death","size":100000}],[{"key":"gender","queryKey":"sex","size":100000},{"key":"hispanicOrigin","queryKey":"hispanic_origin","size":100000}]],"maps":[[{"key":"states","queryKey":"state","size":100000},{"key":"sex","queryKey":"sex","size":100000}]]}}}
        var startTime = new Date();
        w.invokeWONDER(query).then( function (resp) {
            var duration = new Date() - startTime;
            console.log("invoke wonder API bigger query (group by 5) duration: "+duration);
            expect(resp.table).to.not.be.empty();
            done();
        }, function(err){
            console.log(err);
            expect(err).to.be.undefined();
        });
    });

    it("invoke wonder API with year aggregation", function (done){
        query =   {"searchFor":"deaths","query":{},"aggregations":{"simple":[],"nested":{"table":[
                    {"key":"race","queryKey":"race","size":100000},
                    {"key":"year","queryKey":"current_year","size":100000},
                    {"key":"gender","queryKey":"sex","size":100000}],
                     "charts":[[{"key":"gender","queryKey":"sex","size":100000},{"key":"race","queryKey":"race","size":100000}]],"maps":[[{"key":"states","queryKey":"state","size":100000},{"key":"sex","queryKey":"sex","size":100000}]]}}}
        var startTime = new Date();
        w.invokeWONDER(query).then( function (resp) {
            var duration = new Date() - startTime;
            console.log("invoke wonder API with year aggregation: "+duration);
            expect(resp.table).to.not.be.empty();
            done();
        }, function(err){
            console.log(err);
            expect(err).to.be.undefined();
        });
    });

    it("invoke wonder API with no aggregations specified returns error", function (done){
        query = {"searchFor":"deaths","query":{},
            "aggregations":{"simple":[],"nested":{"table":[]}}};
        var startTime = new Date();
        w.invokeWONDER(query).then( function (resp) {
            var duration = new Date() - startTime;
            console.log("invoke wonder API with no aggregations specified: "+duration);
            expect(resp).to.be.empty();
            done();
        }, function(err){
            console.log(err);
            expect(err).to.not.be.empty();
        });
    });

    it("invoke wonder API with filter option selected", function (done){
        query = {"searchFor":"deaths","query":{"sex":{"key":"gender","queryKey":"sex","value":["Female"],"primary":false}},
            "aggregations":{"simple":[],"nested":{"table":[{"key":"race","queryKey":"race","size":100000},{"key":"gender","queryKey":"sex","size":100000}],"charts":[[{"key":"gender","queryKey":"sex","size":100000},{"key":"race","queryKey":"race","size":100000}]],"maps":[[{"key":"states","queryKey":"state","size":100000},{"key":"sex","queryKey":"sex","size":100000}]]}}};
        var startTime = new Date();
        w.invokeWONDER(query).then( function (resp) {
            var duration = new Date() - startTime;
            console.log("invoke wonder API with filter option duration: "+duration);
            expect(resp.table).to.not.be.empty();
            done();
        }, function(err){
            console.log(err);
            expect(err).to.be.undefined();
        });
    });

    it("invoke wonder API with unmapped filter options selected", function (done){
        query = {"searchFor":"deaths","query":{"race":{"key":"race","queryKey":"race","value":["White","Other (Puerto Rico only)"],"primary":false}},
            "aggregations":{"simple":[],"nested":{"table":[{"key":"race","queryKey":"race","size":100000},{"key":"gender","queryKey":"sex","size":100000}],"charts":[[{"key":"gender","queryKey":"sex","size":100000},{"key":"race","queryKey":"race","size":100000}]],"maps":[[{"key":"states","queryKey":"state","size":100000},{"key":"sex","queryKey":"sex","size":100000}]]}}}
        var startTime = new Date();
        w.invokeWONDER(query).then( function (resp) {
            var duration = new Date() - startTime;
            console.log("invoke wonder API with unmapped filter option duration: "+duration);
            expect(resp.table).to.not.be.empty();
            done();
        }, function(err){
            console.log(err);
            expect(err).to.be.undefined();
        });
    });

    it("perform state level grouping query", function (done){
        query = {"searchFor":"deaths","query":{"race":{"key":"race","queryKey":"race","value":["White","Other (Puerto Rico only)"],"primary":false}},
            "aggregations":{"simple":[],"nested":{"table":[{"key":"race","queryKey":"race","size":100000},{"key":"gender","queryKey":"sex","size":100000},{"key":"state","queryKey":"state","size":100000}],"charts":[[{"key":"gender","queryKey":"sex","size":100000},{"key":"race","queryKey":"race","size":100000}]],"maps":[[{"key":"states","queryKey":"state","size":100000},{"key":"sex","queryKey":"sex","size":100000}]]}}}
        var startTime = new Date();
        w.invokeWONDER(query).then( function (resp) {
            var duration = new Date() - startTime;
            console.log("invoke wonder API with unmapped filter option duration: "+duration);
            expect(resp.table).to.not.be.empty();
            expect(JSON.stringify(resp.table).indexOf('error')).to.eql(-1);
            done();
        }, function(err){
            console.log(err);
            expect(err).to.be.undefined();
        });
    });

    xit("perform state level filtering query", function (done){
        query = {"searchFor":"deaths","query":{"race":{"key":"state","queryKey":"state","value":["01","02"],"primary":false}},
            "aggregations":{"simple":[],"nested":{"table":[{"key":"state","queryKey":"state","size":100000}],"charts":[[{"key":"gender","queryKey":"sex","size":100000},{"key":"race","queryKey":"race","size":100000}]],"maps":[[{"key":"states","queryKey":"state","size":100000},{"key":"sex","queryKey":"sex","size":100000}]]}}}
        var startTime = new Date();
        w.invokeWONDER(query).then( function (resp) {
            var duration = new Date() - startTime;
            console.log("invoke wonder API with unmapped filter option duration: "+duration);
            expect(resp.table).to.not.be.empty();
            expect(resp.table).eql({"Alabama":{"ageAdjustedRate":"964.5","standardPop":79153531},"Alaska":{"ageAdjustedRate":"771.6","standardPop":11619054},"Total":{"ageAdjustedRate":"947.3","standardPop":90772585}});
            done();
        }, function(err){
            console.log(err);
            expect(err).to.be.undefined();
        });
    });

    it("perform UCD level filtering query", function (done){
        query = {
            "searchFor": "deaths",
            "query": {
                "ICD_10_code": {
                    "key": "ucd-chapter-10",
                    "queryKey": "ICD_10_code.path",
                    "value": [
                        "P00-P96"
                    ],
                    "primary": true
                },
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
        var startTime = new Date();
        w.invokeWONDER(query).then( function (resp) {
            var duration = new Date() - startTime;
            console.log("invoke wonder API with filter option duration: "+duration);
            expect(resp.table).to.not.be.empty();
            expect(resp.table).eql({"American Indian or Alaska Native":{"Female":{"ageAdjustedRate":"2.1","standardPop":2279263},"Male":{"ageAdjustedRate":"2.3","standardPop":2298590},"Total":{"ageAdjustedRate":"2.2","standardPop":4577853}},"Asian or Pacific Islander":{"Female":{"ageAdjustedRate":"2.7","standardPop":10480265},"Male":{"ageAdjustedRate":"3.3","standardPop":9622452},"Total":{"ageAdjustedRate":"3.0","standardPop":20102717}},"Black or African American":{"Female":{"ageAdjustedRate":"7.4","standardPop":23345129},"Male":{"ageAdjustedRate":"8.9","standardPop":21518067},"Total":{"ageAdjustedRate":"8.2","standardPop":44863196}},"White":{"Female":{"ageAdjustedRate":"3.0","standardPop":127084866},"Male":{"ageAdjustedRate":"3.5","standardPop":124790188},"Total":{"ageAdjustedRate":"3.2","standardPop":251875054}},"Total":{"ageAdjustedRate":"4.1","standardPop":321418820}});
            done();
        }, function(err){
            console.log(err);
            expect(err).to.be.undefined();
        });
    });
});