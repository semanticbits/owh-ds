var y = require("../api/yrbs");
var supertest = require("supertest");
var expect = require("expect.js");
var config = require('../config/config');

describe("YRBS API", function () {
    var yrbs;
    this.timeout(60000);
    beforeEach( function () {
        yrbs = new y();
    });

    it("buildYRBSQueries with grouping param", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn1&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&q=qn2&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&q=qn3&v=sex,race']);

    });

    it("buildYRBSQueries with grouping param for basic query", function (){
        var apiQuery = {'searchFor': 'mental_health', 'yrbsBasic': true, 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn1&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn2&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn3&v=sex,race']);

    });

    it("buildYRBSQueries with all grouping params", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsGrade","queryKey":"grade","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn1&v=sex,grade,race',config.yrbs.queryUrl+'?d=yrbss&q=qn2&v=sex,grade,race',config.yrbs.queryUrl+'?d=yrbss&q=qn3&v=sex,grade,race']);

    });

    it("buildYRBSQueries with no grouping params", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn1',config.yrbs.queryUrl+'?d=yrbss&q=qn2',config.yrbs.queryUrl+'?d=yrbss&q=qn3']);

    });

    it("buildYRBSQueries with only filtering params", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'race':{value:['White', 'Black or African American']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn1&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&q=qn2&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&q=qn3&f=race:White,Black or African American']);

    });


    it("buildYRBSQueries with grouping and filtering params", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'race':{value:['White', 'Black or African American']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn1&v=race&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&q=qn2&v=race&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&q=qn3&v=race&f=race:White,Black or African American']);

    });

    it("buildYRBSQueries with multiple grouping and filtering params", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'race':{value:['White', 'Black or African American']},'sex':{value:['Female']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn1&v=sex,race&f=race:White,Black or African American|sex:Female',config.yrbs.queryUrl+'?d=yrbss&q=qn2&v=sex,race&f=race:White,Black or African American|sex:Female',config.yrbs.queryUrl+'?d=yrbss&q=qn3&v=sex,race&f=race:White,Black or African American|sex:Female']);

    });

    it("buildYRBSQueries with state grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsState","queryKey":"sitecode","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn1&v=race,sitecode',config.yrbs.queryUrl+'?d=yrbss&q=qn2&v=race,sitecode',config.yrbs.queryUrl+'?d=yrbss&q=qn3&v=race,sitecode']);

    });

    it("buildYRBSQueries with state filtering", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'sitecode':{'value':['AL', 'MN']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn1&v=race&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&q=qn2&v=race&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&q=qn3&v=race&f=sitecode:AL,MN']);

    });

    it("buildYRBSQueries with state filtering and grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsState","queryKey":"sitecode","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'sitecode':{'value':['AL', 'MN']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn1&v=race,sitecode&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&q=qn2&v=race,sitecode&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&q=qn3&v=race,sitecode&f=sitecode:AL,MN']);

    });

    it("buildYRBSQueries with sexid filtering and grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},
            {"key":"sexid","queryKey":"sexid","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'sexid':{'value':['Bisexual', 'Heterosexual']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn8&v=sexid&f=sexid:Bisexual,Heterosexual']);

    });

    it("buildYRBSQueries with age_group filtering and grouping", function (){
        var apiQuery = {
            "searchFor": "brfss",
            "aggregations": {
                "nested": {
                    "table": [
                        {
                            "key": "question",
                            "queryKey": "question.key",
                            "size": 100000
                        },
                        {
                            "key": "age_group",
                            "queryKey": "age_group",
                            "size": 100000
                        }
                    ]
                }
            },
            "query": {
                "question.path": {
                    "value": [
                        "DRNKANY5"
                    ]
                },
                "year": {
                    "value": [
                        "2015"
                    ]
                },
                "age_group": {
                    "value": [
                        "Age 18-24"
                    ]
                }
            }
        };
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=brfss&s=1&q=DRNKANY5&v=age_group&f=year:2015|age_group:Age 18-24']);
    });

    it("buildYRBSQueries with gender filtering and grouping", function (){
        var apiQuery = {
            "searchFor": "brfss",
            "aggregations": {
                "nested": {
                    "table": [
                        {
                            "key": "question",
                            "queryKey": "question.key",
                            "size": 100000
                        },
                        {
                            "key": "gender",
                            "queryKey": "gender",
                            "size": 100000
                        }
                    ]
                }
            },
            "query": {
                "question.path": {
                    "value": [
                        "DRNKANY5"
                    ]
                },
                "year": {
                    "value": [
                        "2015"
                    ]
                },
                "gender": {
                    "value": [
                        "Male"
                    ]
                }
            }
        };
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=brfss&s=1&q=DRNKANY5&v=gender&f=year:2015|gender:Male']);
    });

    it("buildYRBSQueries with education filtering and grouping", function (){
        var apiQuery = {
            "searchFor": "brfss",
            "aggregations": {
                "nested": {
                    "table": [
                        {
                            "key": "question",
                            "queryKey": "question.key",
                            "size": 10
                        },
                        {
                            "key": "education",
                            "queryKey": "education",
                            "size": 10
                        }
                    ]
                }
            },
            "query": {
                "question.path": {
                    "value": [
                        "DRNKANY5"
                    ]
                },
                "year": {
                    "value": [
                        "2015"
                    ]
                },
                "education": {
                    "value": [
                        "Less than H.S."
                    ]
                }
            }
        };
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=brfss&s=1&q=DRNKANY5&v=education&f=year:2015|education:Less than H.S.']);
    });

    it("buildYRBSQueries with income filtering and grouping", function (){
        var apiQuery = {
            "searchFor": "brfss",
            "aggregations": {
                "nested": {
                    "table": [
                        {
                            "key": "question",
                            "queryKey": "question.key",
                            "size": 10
                        },
                        {
                            "key": "income",
                            "queryKey": "income",
                            "size": 10
                        }
                    ]
                }
            },
            "query": {
                "question.path": {
                    "value": [
                        "DRNKANY5"
                    ]
                },
                "year": {
                    "value": [
                        "2015"
                    ]
                },
                "income": {
                    "value": [
                        "Less than $15,000"
                    ]
                }
            }
        };
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=brfss&s=1&q=DRNKANY5&v=income&f=year:2015|income:Less than $15,000']);
    });

    it("buildYRBSQueries with year filtering and grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},
            {"key":"year","queryKey":"year","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'year':{'value':['2015', '2014']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn8&v=year&f=year:2015,2014']);

    });

    it("buildYRBSQueries with sexpart filtering and grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},
            {"key":"sexpart","queryKey":"sexpart","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'sexpart':{'value':['Both Sexes', 'Same sex only']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&q=qn8&v=sexpart&f=sexpart:Both Sexes,Same sex only']);

    });

    it("processYRBSReponses", function (){
        var yrbsresp = [{
            "response": null,
            "vars": [
                "sex"
            ],
            "filter": {
                "year": [
                    "2015"
                ]
            },
            "var_levels": null,
            "results": [
                {
                    "level": 0,
                    "ci_u": 0.6594,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6325,
                    "q": "qn41",
                    "count": 15049,
                    "ci_l": 0.6047,
                    "se": 0.0136
                },
                {
                    "level": 1,
                    "ci_u": 0.6382,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6142,
                    "q": "qn41",
                    "count": 7424,
                    "ci_l": 0.5895,
                    "se": 0.0121,
                    "sex": "Male"
                },
                {
                    "level": 1,
                    "ci_u": 0.6913,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6534,
                    "q": "qn41",
                    "count": 7518,
                    "ci_l": 0.6135,
                    "se": 0.0193,
                    "sex": "Female"
                },
                {
                    "level": 0,
                    "ci_u": 0.6594,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6325,
                    "q": "qn41",
                    "count": 15049,
                    "ci_l": 0.6047,
                    "se": 0.0136
                },
                {
                    "level": 1,
                    "ci_u": 0.6382,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6142,
                    "q": "qn41",
                    "count": 7424,
                    "ci_l": 0.5895,
                    "se": 0.0121,
                    "sex": "Male"
                },
                {
                    "level": 1,
                    "ci_u": 0.6913,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6534,
                    "q": "qn41",
                    "count": 7518,
                    "ci_l": 0.6135,
                    "se": 0.0193,
                    "sex": "Female"
                }
            ],
            "q": "qn41",
            "is_socrata": false,
            "error": null,
            "question": "Ever drank alcohol"
        },null,
            {
                "response": null,
                "vars": [
                    "sex"
                ],
                "filter": {
                    "year": [
                        "2015"
                    ]
                },
                "var_levels": null,
                "results": [
                    {
                        "level": 0,
                        "ci_u": 0.0523,
                        "response": true,
                        "filter": {
                            "year": [
                                "2015"
                            ]
                        },
                        "mean": 0.0432,
                        "q": "qn45",
                        "count": 11597,
                        "ci_l": 0.0355,
                        "se": 0.0041
                    },
                    {
                        "level": 1,
                        "ci_u": 0.0741,
                        "response": true,
                        "filter": {
                            "year": [
                                "2015"
                            ]
                        },
                        "mean": 0.0606,
                        "q": "qn45",
                        "count": 5694,
                        "ci_l": 0.0493,
                        "se": 0.0061,
                        "sex": "Male"
                    },
                    {
                        "level": 1,
                        "ci_u": 0.0334,
                        "response": true,
                        "filter": {
                            "year": [
                                "2015"
                            ]
                        },
                        "mean": 0.0253,
                        "q": "qn45",
                        "count": 5815,
                        "ci_l": 0.0191,
                        "se": 0.0035,
                        "sex": "Female"
                    },
                    {
                        "level": 0,
                        "ci_u": 0.0523,
                        "response": false,
                        "filter": {
                            "year": [
                                "2015"
                            ]
                        },
                        "mean": 0.0432,
                        "q": "qn45",
                        "count": 11597,
                        "ci_l": 0.0355,
                        "se": 0.0041
                    },
                    {
                        "level": 1,
                        "ci_u": 0.0741,
                        "response": false,
                        "filter": {
                            "year": [
                                "2015"
                            ]
                        },
                        "mean": 0.0606,
                        "q": "qn45",
                        "count": 5694,
                        "ci_l": 0.0493,
                        "se": 0.0061,
                        "sex": "Male"
                    },
                    {
                        "level": 1,
                        "ci_u": 0.0334,
                        "response": false,
                        "filter": {
                            "year": [
                                "2015"
                            ]
                        },
                        "mean": 0.0253,
                        "q": "qn45",
                        "count": 5815,
                        "ci_l": 0.0191,
                        "se": 0.0035,
                        "sex": "Female"
                    }
                ],
                "q": "qn45",
                "is_socrata": false,
                "error": null,
                "question": "Reported that the largest number of drinks they had in a row was 10 or more"
            }
        ]
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'mental_health');
        expect(result).to.eql({
            "table":{
                "question":[
                    {
                        "name":"qn41",
                        "YES":{
                            "mental_health":{
                                "mean":"63.2",
                                "ci_l":"60.5",
                                "ci_u":"65.9",
                                "count":15049
                            },
                            "sex":[
                                {
                                    "name":"Male",
                                    "mental_health":{
                                        "mean":"61.4",
                                        "ci_l":"59.0",
                                        "ci_u":"63.8",
                                        "count":7424
                                    }
                                },
                                {
                                    "name":"Female",
                                    "mental_health":{
                                        "mean":"65.3",
                                        "ci_l":"61.4",
                                        "ci_u":"69.1",
                                        "count":7518
                                    }
                                }
                            ]
                        },
                        "NO":{
                            "mental_health":{
                                "mean":"63.2",
                                "ci_l":"60.5",
                                "ci_u":"65.9",
                                "count":15049
                            },
                            "sex":[
                                {
                                    "name":"Male",
                                    "mental_health":{
                                        "mean":"61.4",
                                        "ci_l":"59.0",
                                        "ci_u":"63.8",
                                        "count":7424
                                    }
                                },
                                {
                                    "name":"Female",
                                    "mental_health":{
                                        "mean":"65.3",
                                        "ci_l":"61.4",
                                        "ci_u":"69.1",
                                        "count":7518
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "name":"qn45",
                        "YES":{
                            "mental_health":{
                                "mean":"4.3",
                                "ci_l":"3.5",
                                "ci_u":"5.2",
                                "count":11597
                            },
                            "sex":[
                                {
                                    "name":"Male",
                                    "mental_health":{
                                        "mean":"6.1",
                                        "ci_l":"4.9",
                                        "ci_u":"7.4",
                                        "count":5694
                                    }
                                },
                                {
                                    "name":"Female",
                                    "mental_health":{
                                        "mean":"2.5",
                                        "ci_l":"1.9",
                                        "ci_u":"3.3",
                                        "count":5815
                                    }
                                }
                            ]
                        },
                        "NO":{
                            "mental_health":{
                                "mean":"4.3",
                                "ci_l":"3.5",
                                "ci_u":"5.2",
                                "count":11597
                            },
                            "sex":[
                                {
                                    "name":"Male",
                                    "mental_health":{
                                        "mean":"6.1",
                                        "ci_l":"4.9",
                                        "ci_u":"7.4",
                                        "count":5694
                                    }
                                },
                                {
                                    "name":"Female",
                                    "mental_health":{
                                        "mean":"2.5",
                                        "ci_l":"1.9",
                                        "ci_u":"3.3",
                                        "count":5815
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

    });

    it("processYRBSReponses for group by gender", function (){
        var resp = [{"q":"_RFDRHV5","is_socrata":true,"error":null,"question":"_RFDRHV5","response":null,"filter":{"gender":["Male"],"sitecode":["AL"],"year":["2015"]},"vars":["gender"],"var_levels":null,"results":[{"q":"_RFDRHV5","ci_l":0.94,"ci_u":0.98,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.96,"sample_size":432.0},{"q":"_RFDRHV5","ci_l":0.02,"ci_u":0.06,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.04,"sample_size":21.0},{"q":"_RFDRHV5","ci_l":0.911,"ci_u":0.959,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.935,"sample_size":671.0},{"q":"_RFDRHV5","ci_l":0.041,"ci_u":0.089,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.065,"sample_size":40.0},{"q":"_RFDRHV5","ci_l":0.909,"ci_u":0.956,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.933,"sample_size":802.0},{"q":"_RFDRHV5","ci_l":0.044,"ci_u":0.091,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.067,"sample_size":45.0},{"q":"_RFDRHV5","ci_l":0.929,"ci_u":0.958,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.943,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.042,"ci_u":0.072,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.057,"sample_size":70.0},{"q":"_RFDRHV5","ci_l":0.948,"ci_u":0.972,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.96,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.028,"ci_u":0.052,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.04,"sample_size":67.0},{"q":"_RFDRHV5","ci_l":0.967,"ci_u":0.982,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.975,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.018,"ci_u":0.033,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.026,"sample_size":74.0},{"q":"_RFDRHV5","ci_l":0.945,"ci_u":0.959,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.952,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.041,"ci_u":0.055,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.048,"sample_size":317.0},{"q":"_RFDRHV5","ci_l":0.929,"ci_u":0.968,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.949,"sample_size":841.0},{"q":"_RFDRHV5","ci_l":0.032,"ci_u":0.071,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.051,"sample_size":38.0},{"q":"_RFDRHV5","ci_l":0.938,"ci_u":0.964,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.951,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.036,"ci_u":0.062,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.049,"sample_size":92.0},{"q":"_RFDRHV5","ci_l":0.941,"ci_u":0.967,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.954,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.033,"ci_u":0.059,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.046,"sample_size":84.0},{"q":"_RFDRHV5","ci_l":0.939,"ci_u":0.964,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.951,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.036,"ci_u":0.061,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.049,"sample_size":103.0},{"q":"_RFDRHV5","ci_l":0.929,"ci_u":0.971,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.95,"sample_size":884.0},{"q":"_RFDRHV5","ci_l":0.029,"ci_u":0.071,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.05,"sample_size":32.0},{"q":"_RFDRHV5","ci_l":0.953,"ci_u":0.98,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.966,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.02,"ci_u":0.047,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.034,"sample_size":39.0},{"q":"_RFDRHV5","ci_l":0.903,"ci_u":0.963,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.933,"sample_size":655.0},{"q":"_RFDRHV5","ci_l":0.037,"ci_u":0.097,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.067,"sample_size":33.0},{"q":"_RFDRHV5","ci_l":0.921,"ci_u":0.969,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.945,"sample_size":823.0},{"q":"_RFDRHV5","ci_l":0.031,"ci_u":0.079,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.055,"sample_size":34.0},{"q":"_RFDRHV5","ci_l":0.927,"ci_u":0.953,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.94,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.047,"ci_u":0.073,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.06,"sample_size":148.0},{"q":"_RFDRHV5","ci_l":0.944,"ci_u":0.96,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.952,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.04,"ci_u":0.056,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.048,"sample_size":228.0},{"q":"_RFDRHV5","ci_l":0.933,"ci_u":0.963,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.948,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.038,"ci_u":0.067,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":0.052,"sample_size":75.0},{"q":"_RFDRHV5","ci_l":0.983,"ci_u":1.0,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.992,"sample_size":105.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":-1.0,"sample_size":3.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":-1.0,"sample_size":33.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":-1.0,"sample_size":1.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":-1.0,"sample_size":4.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":-1.0,"sample_size":0.0},{"q":"_RFDRHV5","ci_l":0.953,"ci_u":1.0,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.98,"sample_size":48.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":-1.0,"sample_size":2.0},{"q":"_RFDRHV5","ci_l":0.806,"ci_u":0.985,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.896,"sample_size":70.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":-1.0,"sample_size":6.0},{"q":"_RFDRHV5","ci_l":0.947,"ci_u":1.0,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Total","mean":0.978,"sample_size":89.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Total","mean":-1.0,"sample_size":2.0},{"q":"_RFDRHV5","ci_l":0.93,"ci_u":0.953,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Male","mean":0.942,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.047,"ci_u":0.07,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Male","mean":0.058,"sample_size":162.0},{"q":"_RFDRHV5","ci_l":0.952,"ci_u":0.969,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","gender":"Female","mean":0.961,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.031,"ci_u":0.048,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","gender":"Female","mean":0.04,"sample_size":155.0}]}]
        var result = yrbs.processYRBSReponses(resp, false, 'brfss');
        expect(JSON.stringify(result)).to.eql( '{"table":{"question":[{"name":"_RFDRHV5","Do not meet criteria for heavy drinking":{"gender":[{"name":"Total","brfss":{"mean":"97.8","ci_l":"94.7","ci_u":"100.0","count":89}},{"name":"Male","brfss":{"mean":"94.2","ci_l":"93.0","ci_u":"95.3","count":-1}},{"name":"Female","brfss":{"mean":"96.1","ci_l":"95.2","ci_u":"96.9","count":-1}}]},"Meet criteria for heavy drinking":{"gender":[{"name":"Total","brfss":{"mean":"0","ci_l":"0","ci_u":"0","count":2}},{"name":"Male","brfss":{"mean":"5.8","ci_l":"4.7","ci_u":"7.0","count":162}},{"name":"Female","brfss":{"mean":"4.0","ci_l":"3.1","ci_u":"4.8","count":155}}]}}]}}');
    });

    it("processYRBSReponses for group by age_group", function (){
        var yrbsresp = [{"q":"_RFDRHV5","is_socrata":true,"error":null,"question":"_RFDRHV5","response":null,"filter":{"year":["2015"],"age_group":["Age 18-24"],"sitecode":["AL"]},"vars":["age_group"],"var_levels":null,"results":[{"q":"_RFDRHV5","ci_l":0.94,"age_group":"18-24","mean":0.96,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.98,"sample_size":432},{"q":"_RFDRHV5","ci_l":0.02,"age_group":"18-24","mean":0.04,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.06,"sample_size":21},{"q":"_RFDRHV5","ci_l":0.911,"age_group":"25-34","mean":0.935,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.959,"sample_size":671},{"q":"_RFDRHV5","ci_l":0.041,"age_group":"25-34","mean":0.065,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.089,"sample_size":40},{"q":"_RFDRHV5","ci_l":0.909,"age_group":"35-44","mean":0.933,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.956,"sample_size":802},{"q":"_RFDRHV5","ci_l":0.044,"age_group":"35-44","mean":0.067,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.091,"sample_size":45},{"q":"_RFDRHV5","ci_l":0.929,"age_group":"45-54","mean":0.943,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.958,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.042,"age_group":"45-54","mean":0.057,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.072,"sample_size":70},{"q":"_RFDRHV5","ci_l":0.948,"age_group":"55-64","mean":0.96,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.972,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.028,"age_group":"55-64","mean":0.04,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.052,"sample_size":67},{"q":"_RFDRHV5","ci_l":0.967,"age_group":"65+","mean":0.975,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.982,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.018,"age_group":"65+","mean":0.026,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.033,"sample_size":74},{"q":"_RFDRHV5","ci_l":0.945,"age_group":"Total","mean":0.952,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.959,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.041,"age_group":"Total","mean":0.048,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.055,"sample_size":317},{"q":"_RFDRHV5","ci_l":0.929,"age_group":"Total","mean":0.949,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.968,"sample_size":841},{"q":"_RFDRHV5","ci_l":0.032,"age_group":"Total","mean":0.051,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.071,"sample_size":38},{"q":"_RFDRHV5","ci_l":0.938,"age_group":"Total","mean":0.951,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.964,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.036,"age_group":"Total","mean":0.049,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.062,"sample_size":92},{"q":"_RFDRHV5","ci_l":0.941,"age_group":"Total","mean":0.954,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.967,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.033,"age_group":"Total","mean":0.046,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.059,"sample_size":84},{"q":"_RFDRHV5","ci_l":0.939,"age_group":"Total","mean":0.951,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.964,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.036,"age_group":"Total","mean":0.049,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.061,"sample_size":103},{"q":"_RFDRHV5","ci_l":0.929,"age_group":"Total","mean":0.95,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.971,"sample_size":884},{"q":"_RFDRHV5","ci_l":0.029,"age_group":"Total","mean":0.05,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.071,"sample_size":32},{"q":"_RFDRHV5","ci_l":0.953,"age_group":"Total","mean":0.966,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.98,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.02,"age_group":"Total","mean":0.034,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.047,"sample_size":39},{"q":"_RFDRHV5","ci_l":0.903,"age_group":"Total","mean":0.933,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.963,"sample_size":655},{"q":"_RFDRHV5","ci_l":0.037,"age_group":"Total","mean":0.067,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.097,"sample_size":33},{"q":"_RFDRHV5","ci_l":0.921,"age_group":"Total","mean":0.945,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.969,"sample_size":823},{"q":"_RFDRHV5","ci_l":0.031,"age_group":"Total","mean":0.055,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.079,"sample_size":34},{"q":"_RFDRHV5","ci_l":0.927,"age_group":"Total","mean":0.94,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.953,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.047,"age_group":"Total","mean":0.06,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.073,"sample_size":148},{"q":"_RFDRHV5","ci_l":0.944,"age_group":"Total","mean":0.952,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.96,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.04,"age_group":"Total","mean":0.048,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.056,"sample_size":228},{"q":"_RFDRHV5","ci_l":0.933,"age_group":"Total","mean":0.948,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.963,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.038,"age_group":"Total","mean":0.052,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.067,"sample_size":75},{"q":"_RFDRHV5","ci_l":0.983,"age_group":"Total","mean":0.992,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":1,"sample_size":105},{"q":"_RFDRHV5","ci_l":-1,"age_group":"Total","mean":-1,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":-1,"sample_size":3},{"q":"_RFDRHV5","ci_l":-1,"age_group":"Total","mean":-1,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":-1,"sample_size":33},{"q":"_RFDRHV5","ci_l":-1,"age_group":"Total","mean":-1,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":-1,"sample_size":1},{"q":"_RFDRHV5","ci_l":-1,"age_group":"Total","mean":-1,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":-1,"sample_size":4},{"q":"_RFDRHV5","ci_l":-1,"age_group":"Total","mean":-1,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":-1,"sample_size":0},{"q":"_RFDRHV5","ci_l":0.953,"age_group":"Total","mean":0.98,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":1,"sample_size":48},{"q":"_RFDRHV5","ci_l":-1,"age_group":"Total","mean":-1,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":-1,"sample_size":2},{"q":"_RFDRHV5","ci_l":0.806,"age_group":"Total","mean":0.896,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.985,"sample_size":70},{"q":"_RFDRHV5","ci_l":-1,"age_group":"Total","mean":-1,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":-1,"sample_size":6},{"q":"_RFDRHV5","ci_l":0.947,"age_group":"Total","mean":0.978,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":1,"sample_size":89},{"q":"_RFDRHV5","ci_l":-1,"age_group":"Total","mean":-1,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":-1,"sample_size":2},{"q":"_RFDRHV5","ci_l":0.93,"age_group":"Total","mean":0.942,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.953,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.047,"age_group":"Total","mean":0.058,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.07,"sample_size":162},{"q":"_RFDRHV5","ci_l":0.952,"age_group":"Total","mean":0.961,"method":"socrata","std_err":-1,"response":"Do not meet criteria for heavy drinking","ci_u":0.969,"sample_size":-1},{"q":"_RFDRHV5","ci_l":0.031,"age_group":"Total","mean":0.04,"method":"socrata","std_err":-1,"response":"Meet criteria for heavy drinking","ci_u":0.048,"sample_size":155}]}]
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'brfss');
        expect(JSON.stringify(result)).to.eql('{"table":{"question":[{"name":"_RFDRHV5","Do not meet criteria for heavy drinking":{"age_group":[{"name":"18-24","brfss":{"mean":"96.0","ci_l":"94.0","ci_u":"98.0","count":432}},{"name":"25-34","brfss":{"mean":"93.5","ci_l":"91.1","ci_u":"95.9","count":671}},{"name":"35-44","brfss":{"mean":"93.3","ci_l":"90.9","ci_u":"95.6","count":802}},{"name":"45-54","brfss":{"mean":"94.3","ci_l":"92.9","ci_u":"95.8","count":-1}},{"name":"55-64","brfss":{"mean":"96.0","ci_l":"94.8","ci_u":"97.2","count":-1}},{"name":"65+","brfss":{"mean":"97.5","ci_l":"96.7","ci_u":"98.2","count":-1}},{"name":"Total","brfss":{"mean":"96.1","ci_l":"95.2","ci_u":"96.9","count":-1}}]},"Meet criteria for heavy drinking":{"age_group":[{"name":"18-24","brfss":{"mean":"4.0","ci_l":"2.0","ci_u":"6.0","count":21}},{"name":"25-34","brfss":{"mean":"6.5","ci_l":"4.1","ci_u":"8.9","count":40}},{"name":"35-44","brfss":{"mean":"6.7","ci_l":"4.4","ci_u":"9.1","count":45}},{"name":"45-54","brfss":{"mean":"5.7","ci_l":"4.2","ci_u":"7.2","count":70}},{"name":"55-64","brfss":{"mean":"4.0","ci_l":"2.8","ci_u":"5.2","count":67}},{"name":"65+","brfss":{"mean":"2.6","ci_l":"1.8","ci_u":"3.3","count":74}},{"name":"Total","brfss":{"mean":"4.0","ci_l":"3.1","ci_u":"4.8","count":155}}]}}]}}');
    });

    it("processYRBSReponses for group by education", function (){
        var yrbsresp = [{"q":"_RFDRHV5","is_socrata":true,"error":null,"question":"_RFDRHV5","response":null,"filter":{"education":["Less than H.S."],"sitecode":["AL"],"year":["2015"]},"vars":["education"],"var_levels":null,"results":[{"q":"_RFDRHV5","ci_l":0.94,"ci_u":0.98,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.96,"sample_size":432.0},{"q":"_RFDRHV5","ci_l":0.02,"ci_u":0.06,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.04,"sample_size":21.0},{"q":"_RFDRHV5","ci_l":0.911,"ci_u":0.959,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.935,"sample_size":671.0},{"q":"_RFDRHV5","ci_l":0.041,"ci_u":0.089,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.065,"sample_size":40.0},{"q":"_RFDRHV5","ci_l":0.909,"ci_u":0.956,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.933,"sample_size":802.0},{"q":"_RFDRHV5","ci_l":0.044,"ci_u":0.091,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.067,"sample_size":45.0},{"q":"_RFDRHV5","ci_l":0.929,"ci_u":0.958,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.943,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.042,"ci_u":0.072,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.057,"sample_size":70.0},{"q":"_RFDRHV5","ci_l":0.948,"ci_u":0.972,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.96,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.028,"ci_u":0.052,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.04,"sample_size":67.0},{"q":"_RFDRHV5","ci_l":0.967,"ci_u":0.982,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.975,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.018,"ci_u":0.033,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.026,"sample_size":74.0},{"q":"_RFDRHV5","ci_l":0.945,"ci_u":0.959,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.952,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.041,"ci_u":0.055,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.048,"sample_size":317.0},{"q":"_RFDRHV5","ci_l":0.929,"ci_u":0.968,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Less than H.S.","mean":0.949,"sample_size":841.0},{"q":"_RFDRHV5","ci_l":0.032,"ci_u":0.071,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Less than H.S.","mean":0.051,"sample_size":38.0},{"q":"_RFDRHV5","ci_l":0.938,"ci_u":0.964,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"H.S. or G.E.D.","mean":0.951,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.036,"ci_u":0.062,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"H.S. or G.E.D.","mean":0.049,"sample_size":92.0},{"q":"_RFDRHV5","ci_l":0.941,"ci_u":0.967,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Some post-H.S.","mean":0.954,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.033,"ci_u":0.059,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Some post-H.S.","mean":0.046,"sample_size":84.0},{"q":"_RFDRHV5","ci_l":0.939,"ci_u":0.964,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"College graduate","mean":0.951,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.036,"ci_u":0.061,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"College graduate","mean":0.049,"sample_size":103.0},{"q":"_RFDRHV5","ci_l":0.929,"ci_u":0.971,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.95,"sample_size":884.0},{"q":"_RFDRHV5","ci_l":0.029,"ci_u":0.071,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.05,"sample_size":32.0},{"q":"_RFDRHV5","ci_l":0.953,"ci_u":0.98,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.966,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.02,"ci_u":0.047,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.034,"sample_size":39.0},{"q":"_RFDRHV5","ci_l":0.903,"ci_u":0.963,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.933,"sample_size":655.0},{"q":"_RFDRHV5","ci_l":0.037,"ci_u":0.097,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.067,"sample_size":33.0},{"q":"_RFDRHV5","ci_l":0.921,"ci_u":0.969,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.945,"sample_size":823.0},{"q":"_RFDRHV5","ci_l":0.031,"ci_u":0.079,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.055,"sample_size":34.0},{"q":"_RFDRHV5","ci_l":0.927,"ci_u":0.953,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.94,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.047,"ci_u":0.073,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.06,"sample_size":148.0},{"q":"_RFDRHV5","ci_l":0.944,"ci_u":0.96,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.952,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.04,"ci_u":0.056,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.048,"sample_size":228.0},{"q":"_RFDRHV5","ci_l":0.933,"ci_u":0.963,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.948,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.038,"ci_u":0.067,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.052,"sample_size":75.0},{"q":"_RFDRHV5","ci_l":0.983,"ci_u":1.0,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.992,"sample_size":105.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":-1.0,"sample_size":3.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":-1.0,"sample_size":33.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":-1.0,"sample_size":1.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":-1.0,"sample_size":4.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":-1.0,"sample_size":0.0},{"q":"_RFDRHV5","ci_l":0.953,"ci_u":1.0,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.98,"sample_size":48.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":-1.0,"sample_size":2.0},{"q":"_RFDRHV5","ci_l":0.806,"ci_u":0.985,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.896,"sample_size":70.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":-1.0,"sample_size":6.0},{"q":"_RFDRHV5","ci_l":0.947,"ci_u":1.0,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.978,"sample_size":89.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":-1.0,"sample_size":2.0},{"q":"_RFDRHV5","ci_l":0.93,"ci_u":0.953,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.942,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.047,"ci_u":0.07,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.058,"sample_size":162.0},{"q":"_RFDRHV5","ci_l":0.952,"ci_u":0.969,"method":"socrata","std_err":-1.0,"response":"Do not meet criteria for heavy drinking","education":"Total","mean":0.961,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.031,"ci_u":0.048,"method":"socrata","std_err":-1.0,"response":"Meet criteria for heavy drinking","education":"Total","mean":0.04,"sample_size":155.0}]}]
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'brfss');
        expect(JSON.stringify(result)).to.eql('{"table":{"question":[{"name":"_RFDRHV5","Do not meet criteria for heavy drinking":{"education":[{"name":"Total","brfss":{"mean":"96.1","ci_l":"95.2","ci_u":"96.9","count":-1}},{"name":"Less than H.S.","brfss":{"mean":"94.9","ci_l":"92.9","ci_u":"96.8","count":841}},{"name":"H.S. or G.E.D.","brfss":{"mean":"95.1","ci_l":"93.8","ci_u":"96.4","count":-1}},{"name":"Some post-H.S.","brfss":{"mean":"95.4","ci_l":"94.1","ci_u":"96.7","count":-1}},{"name":"College graduate","brfss":{"mean":"95.1","ci_l":"93.9","ci_u":"96.4","count":-1}}]},"Meet criteria for heavy drinking":{"education":[{"name":"Total","brfss":{"mean":"4.0","ci_l":"3.1","ci_u":"4.8","count":155}},{"name":"Less than H.S.","brfss":{"mean":"5.1","ci_l":"3.2","ci_u":"7.1","count":38}},{"name":"H.S. or G.E.D.","brfss":{"mean":"4.9","ci_l":"3.6","ci_u":"6.2","count":92}},{"name":"Some post-H.S.","brfss":{"mean":"4.6","ci_l":"3.3","ci_u":"5.9","count":84}},{"name":"College graduate","brfss":{"mean":"4.9","ci_l":"3.6","ci_u":"6.1","count":103}}]}}]}}');
    });

    it("processYRBSReponses for group by income", function (){
        var yrbsresp = [{"q":"_RFDRHV5","is_socrata":true,"error":null,"question":"_RFDRHV5","response":null,"filter":{"year":["2015"],"sitecode":["AL"],"income":["Less than $15","000"]},"vars":["income"],"var_levels":null,"results":[{"q":"_RFDRHV5","ci_l":0.94,"ci_u":0.98,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.96,"sample_size":432.0},{"q":"_RFDRHV5","ci_l":0.02,"ci_u":0.06,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.04,"sample_size":21.0},{"q":"_RFDRHV5","ci_l":0.911,"ci_u":0.959,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.935,"sample_size":671.0},{"q":"_RFDRHV5","ci_l":0.041,"ci_u":0.089,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.065,"sample_size":40.0},{"q":"_RFDRHV5","ci_l":0.909,"ci_u":0.956,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.933,"sample_size":802.0},{"q":"_RFDRHV5","ci_l":0.044,"ci_u":0.091,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.067,"sample_size":45.0},{"q":"_RFDRHV5","ci_l":0.929,"ci_u":0.958,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.943,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.042,"ci_u":0.072,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.057,"sample_size":70.0},{"q":"_RFDRHV5","ci_l":0.948,"ci_u":0.972,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.96,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.028,"ci_u":0.052,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.04,"sample_size":67.0},{"q":"_RFDRHV5","ci_l":0.967,"ci_u":0.982,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.975,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.018,"ci_u":0.033,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.026,"sample_size":74.0},{"q":"_RFDRHV5","ci_l":0.945,"ci_u":0.959,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.952,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.041,"ci_u":0.055,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.048,"sample_size":317.0},{"q":"_RFDRHV5","ci_l":0.929,"ci_u":0.968,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.949,"sample_size":841.0},{"q":"_RFDRHV5","ci_l":0.032,"ci_u":0.071,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.051,"sample_size":38.0},{"q":"_RFDRHV5","ci_l":0.938,"ci_u":0.964,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.951,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.036,"ci_u":0.062,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.049,"sample_size":92.0},{"q":"_RFDRHV5","ci_l":0.941,"ci_u":0.967,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.954,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.033,"ci_u":0.059,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.046,"sample_size":84.0},{"q":"_RFDRHV5","ci_l":0.939,"ci_u":0.964,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.951,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.036,"ci_u":0.061,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.049,"sample_size":103.0},{"q":"_RFDRHV5","ci_l":0.929,"ci_u":0.971,"method":"socrata","std_err":-1.0,"income":"Less than $15,000","response":"Do not meet criteria for heavy drinking","mean":0.95,"sample_size":884.0},{"q":"_RFDRHV5","ci_l":0.029,"ci_u":0.071,"method":"socrata","std_err":-1.0,"income":"Less than $15,000","response":"Meet criteria for heavy drinking","mean":0.05,"sample_size":32.0},{"q":"_RFDRHV5","ci_l":0.953,"ci_u":0.98,"method":"socrata","std_err":-1.0,"income":"$15,000-$24,999","response":"Do not meet criteria for heavy drinking","mean":0.966,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.02,"ci_u":0.047,"method":"socrata","std_err":-1.0,"income":"$15,000-$24,999","response":"Meet criteria for heavy drinking","mean":0.034,"sample_size":39.0},{"q":"_RFDRHV5","ci_l":0.903,"ci_u":0.963,"method":"socrata","std_err":-1.0,"income":"$25,000-$34,999","response":"Do not meet criteria for heavy drinking","mean":0.933,"sample_size":655.0},{"q":"_RFDRHV5","ci_l":0.037,"ci_u":0.097,"method":"socrata","std_err":-1.0,"income":"$25,000-$34,999","response":"Meet criteria for heavy drinking","mean":0.067,"sample_size":33.0},{"q":"_RFDRHV5","ci_l":0.921,"ci_u":0.969,"method":"socrata","std_err":-1.0,"income":"$35,000-$49,999","response":"Do not meet criteria for heavy drinking","mean":0.945,"sample_size":823.0},{"q":"_RFDRHV5","ci_l":0.031,"ci_u":0.079,"method":"socrata","std_err":-1.0,"income":"$35,000-$49,999","response":"Meet criteria for heavy drinking","mean":0.055,"sample_size":34.0},{"q":"_RFDRHV5","ci_l":0.927,"ci_u":0.953,"method":"socrata","std_err":-1.0,"income":"$50,000+","response":"Do not meet criteria for heavy drinking","mean":0.94,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.047,"ci_u":0.073,"method":"socrata","std_err":-1.0,"income":"$50,000+","response":"Meet criteria for heavy drinking","mean":0.06,"sample_size":148.0},{"q":"_RFDRHV5","ci_l":0.944,"ci_u":0.96,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.952,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.04,"ci_u":0.056,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.048,"sample_size":228.0},{"q":"_RFDRHV5","ci_l":0.933,"ci_u":0.963,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.948,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.038,"ci_u":0.067,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.052,"sample_size":75.0},{"q":"_RFDRHV5","ci_l":0.983,"ci_u":1.0,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.992,"sample_size":105.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":-1.0,"sample_size":3.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":-1.0,"sample_size":33.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":-1.0,"sample_size":1.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":-1.0,"sample_size":4.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":-1.0,"sample_size":0.0},{"q":"_RFDRHV5","ci_l":0.953,"ci_u":1.0,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.98,"sample_size":48.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":-1.0,"sample_size":2.0},{"q":"_RFDRHV5","ci_l":0.806,"ci_u":0.985,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.896,"sample_size":70.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":-1.0,"sample_size":6.0},{"q":"_RFDRHV5","ci_l":0.947,"ci_u":1.0,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.978,"sample_size":89.0},{"q":"_RFDRHV5","ci_l":-1.0,"ci_u":-1.0,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":-1.0,"sample_size":2.0},{"q":"_RFDRHV5","ci_l":0.93,"ci_u":0.953,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.942,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.047,"ci_u":0.07,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.058,"sample_size":162.0},{"q":"_RFDRHV5","ci_l":0.952,"ci_u":0.969,"method":"socrata","std_err":-1.0,"income":"Total","response":"Do not meet criteria for heavy drinking","mean":0.961,"sample_size":-1.0},{"q":"_RFDRHV5","ci_l":0.031,"ci_u":0.048,"method":"socrata","std_err":-1.0,"income":"Total","response":"Meet criteria for heavy drinking","mean":0.04,"sample_size":155.0}]}]
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'brfss');
        expect(JSON.stringify(result)).to.eql('{"table":{"question":[{"name":"_RFDRHV5","Do not meet criteria for heavy drinking":{"income":[{"name":"Total","brfss":{"mean":"96.1","ci_l":"95.2","ci_u":"96.9","count":-1}},{"name":"Less than $15,000","brfss":{"mean":"95.0","ci_l":"92.9","ci_u":"97.1","count":884}},{"name":"$15,000-$24,999","brfss":{"mean":"96.6","ci_l":"95.3","ci_u":"98.0","count":-1}},{"name":"$25,000-$34,999","brfss":{"mean":"93.3","ci_l":"90.3","ci_u":"96.3","count":655}},{"name":"$35,000-$49,999","brfss":{"mean":"94.5","ci_l":"92.1","ci_u":"96.9","count":823}},{"name":"$50,000+","brfss":{"mean":"94.0","ci_l":"92.7","ci_u":"95.3","count":-1}}]},"Meet criteria for heavy drinking":{"income":[{"name":"Total","brfss":{"mean":"4.0","ci_l":"3.1","ci_u":"4.8","count":155}},{"name":"Less than $15,000","brfss":{"mean":"5.0","ci_l":"2.9","ci_u":"7.1","count":32}},{"name":"$15,000-$24,999","brfss":{"mean":"3.4","ci_l":"2.0","ci_u":"4.7","count":39}},{"name":"$25,000-$34,999","brfss":{"mean":"6.7","ci_l":"3.7","ci_u":"9.7","count":33}},{"name":"$35,000-$49,999","brfss":{"mean":"5.5","ci_l":"3.1","ci_u":"7.9","count":34}},{"name":"$50,000+","brfss":{"mean":"6.0","ci_l":"4.7","ci_u":"7.3","count":148}}]}}]}}');
    });

    it("processYRBSReponses with no groupings", function (){
        var yrbsresp = [
            {
                "response": null,
                "vars": [],
                "filter": {
                    "year": [
                        "2015"
                    ]
                },
                "var_levels": null,
                "results": [
                    {
                        "level": 0,
                        "ci_u": 0.0523,
                        "response": true,
                        "filter": {
                            "year": [
                                "2015"
                            ]
                        },
                        "mean": 0.0432,
                        "q": "qn45",
                        "count": 11597,
                        "ci_l": 0.0355,
                        "se": 0.0041
                    },
                    {
                        "level": 0,
                        "ci_u": 0.0523,
                        "response": false,
                        "filter": {
                            "year": [
                                "2015"
                            ]
                        },
                        "mean": 0.0432,
                        "q": "qn45",
                        "count": 11597,
                        "ci_l": 0.0355,
                        "se": 0.0041
                    }
                ],
                "q": "qn45",
                "is_socrata": false,
                "error": null,
                "question": "Reported that the largest number of drinks they had in a row was 10 or more"
            },null,
            {
                "response": null,
                "vars": [],
                "filter": {
                    "year": [
                        "2015"
                    ]
                },
                "var_levels": null,
                "results": [
                    {
                        "ci_u": 0.4642,
                        "method": "socrata",
                        "response": true,
                        "mean": 0.441,
                        "q": "qn46",
                        "count": 4436,
                        "ci_l": 0.419
                    },
                    {
                        "ci_u": 0.581,
                        "method": "socrata",
                        "response": false,
                        "mean": 0.559,
                        "q": "qn46",
                        "count": 4436,
                        "ci_l": 0.5358
                    }
                ],
                "q": "qn46",
                "is_socrata": true,
                "error": null,
                "question": "qn46"
            }
        ];

        var result = yrbs.processYRBSReponses(yrbsresp, false, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn45",
                        "YES":{
                            "mental_health":{
                                "mean":"4.3",
                                "ci_l":"3.5",
                                "ci_u":"5.2",
                                "count":11597
                            }
                        },
                        "NO":{
                            "mental_health":{
                                "mean":"4.3",
                                "ci_l":"3.5",
                                "ci_u":"5.2",
                                "count":11597
                            }
                        }
                    },
                    {
                        "name":"qn46",
                        "YES":{
                            "mental_health":{
                                "mean":"44.1",
                                "ci_l":"41.9",
                                "ci_u":"46.4",
                                "count":4436
                            }
                        },
                        "NO":{
                            "mental_health":{
                                "mean":"55.9",
                                "ci_l":"53.6",
                                "ci_u":"58.1",
                                "count":4436
                            }
                        }
                    }
                ]
            }
        });
    });

    it("processYRBSReponses precomputed results with no groupings", function (){
        var yrbsresp = [
            {
                "response": null,
                "vars": [],
                "filter": {
                    "year": [
                        "2015"
                    ]
                },
                "var_levels": null,
                "results": [
                    {
                        "ci_u": 0.0512,
                        "method": "socrata",
                        "response": true,
                        "mean": 0.043,
                        "q": "qn45",
                        "count": 11597,
                        "ci_l": 0.0364
                    },
                    {
                        "ci_u": 0.9636,
                        "method": "socrata",
                        "response": false,
                        "mean": 0.957,
                        "q": "qn45",
                        "count": 11597,
                        "ci_l": 0.9488
                    }
                ],
                "q": "qn45",
                "is_socrata": true,
                "error": null,
                "question": "qn45"
            },
            {
                "response": null,
                "vars": [],
                "filter": {
                    "year": [
                        "2015"
                    ]
                },
                "var_levels": null,
                "results": [
                    {
                        "ci_u": 0.4642,
                        "method": "socrata",
                        "response": true,
                        "mean": 0.441,
                        "q": "qn46",
                        "count": 4436,
                        "ci_l": 0.419
                    },
                    {
                        "ci_u": 0.581,
                        "method": "socrata",
                        "response": false,
                        "mean": 0.559,
                        "q": "qn46",
                        "count": 4436,
                        "ci_l": 0.5358
                    }
                ],
                "q": "qn46",
                "is_socrata": true,
                "error": null,
                "question": "qn46"
            }
        ];

        var result = yrbs.processYRBSReponses(yrbsresp, true, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn45",
                        "YES":{
                            "mental_health":{
                                "mean":"4.3",
                                "ci_l":"3.6",
                                "ci_u":"5.1",
                                "count":11597
                            }
                        },
                        "NO":{
                            "mental_health":{
                                "mean":"95.7",
                                "ci_l":"94.9",
                                "ci_u":"96.4",
                                "count":11597
                            }
                        }
                    },
                    {
                        "name":"qn46",
                        "YES":{
                            "mental_health":{
                                "mean":"44.1",
                                "ci_l":"41.9",
                                "ci_u":"46.4",
                                "count":4436
                            }
                        },
                        "NO":{
                            "mental_health":{
                                "mean":"55.9",
                                "ci_l":"53.6",
                                "ci_u":"58.1",
                                "count":4436
                            }
                        }
                    }
                ]
            }
        });
    });

    it("processYRBSReponses precomputed results with group by sex", function (){
        var yrbsresp = [{
            "response": null,
            "vars": [
                "sex"
            ],
            "filter": {
                "year": [
                    "2015"
                ]
            },
            "var_levels": null,
            "results": [
                {
                    "ci_u": 0.0724,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.061,
                    "q": "qn45",
                    "count": 5694,
                    "ci_l": 0.0506,
                    "sex": "Male"
                },
                {
                    "ci_u": 0.0332,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.025,
                    "q": "qn45",
                    "count": 5815,
                    "ci_l": 0.0193,
                    "sex": "Female"
                },
                {
                    "ci_u": 0.0512,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.043,
                    "q": "qn45",
                    "count": 11597,
                    "ci_l": 0.0364,
                    "sex": "Total"
                },
                {
                    "ci_u": 0.9494,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.939,
                    "q": "qn45",
                    "count": 5694,
                    "ci_l": 0.9276,
                    "sex": "Male"
                },
                {
                    "ci_u": 0.9807,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.975,
                    "q": "qn45",
                    "count": 5815,
                    "ci_l": 0.9668,
                    "sex": "Female"
                },
                {
                    "ci_u": 0.9636,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.957,
                    "q": "qn45",
                    "count": 11597,
                    "ci_l": 0.9488,
                    "sex": "Total"
                }
            ],
            "q": "qn45",
            "is_socrata": true,
            "error": null,
            "question": "qn45"
        }
        ];

        var result = yrbs.processYRBSReponses(yrbsresp, true, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn45",
                        "YES":{
                            "sex":[
                                {
                                    "name":"Male",
                                    "mental_health":{
                                        "mean":"6.1",
                                        "ci_l":"5.1",
                                        "ci_u":"7.2",
                                        "count":5694
                                    }
                                },
                                {
                                    "name":"Female",
                                    "mental_health":{
                                        "mean":"2.5",
                                        "ci_l":"1.9",
                                        "ci_u":"3.3",
                                        "count":5815
                                    }
                                }
                            ],
                            "mental_health":{
                                "mean":"4.3",
                                "ci_l":"3.6",
                                "ci_u":"5.1",
                                "count":11597
                            }
                        },
                        "NO":{
                            "sex":[
                                {
                                    "name":"Male",
                                    "mental_health":{
                                        "mean":"93.9",
                                        "ci_l":"92.8",
                                        "ci_u":"94.9",
                                        "count":5694
                                    }
                                },
                                {
                                    "name":"Female",
                                    "mental_health":{
                                        "mean":"97.5",
                                        "ci_l":"96.7",
                                        "ci_u":"98.1",
                                        "count":5815
                                    }
                                }
                            ],
                            "mental_health":{
                                "mean":"95.7",
                                "ci_l":"94.9",
                                "ci_u":"96.4",
                                "count":11597
                            }
                        }
                    }
                ]
            }
        });
    });

    it("processYRBSReponses precomputed results with filter by grade and sex and group by sex", function (){
        var yrbsresp = [{
            "response": null,
            "vars": [
                "sex"
            ],
            "filter": {
                "grade": [
                    "11th"
                ],
                "year": [
                    "2015"
                ],
                "sex": [
                    "Female"
                ]
            },
            "var_levels": null,
            "results": [
                {
                    "ci_u": 0.5353,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.497,
                    "q": "qn46",
                    "count": 626,
                    "ci_l": 0.4595,
                    "sex": "Female"
                },
                {
                    "ci_u": 0.5405,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.503,
                    "q": "qn46",
                    "count": 626,
                    "ci_l": 0.4647,
                    "sex": "Female"
                }
            ],
            "q": "qn46",
            "is_socrata": true,
            "error": null,
            "question": "qn46"
        }
        ];

        var result = yrbs.processYRBSReponses(yrbsresp, true, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn46",
                        "YES":{
                            "sex":[
                                {
                                    "name":"Female",
                                    "mental_health":{
                                        "mean":"49.7",
                                        "ci_l":"46.0",
                                        "ci_u":"53.5",
                                        "count":626
                                    }
                                }
                            ],
                            "mental_health":{
                                "mean":"49.7",
                                "ci_l":"46.0",
                                "ci_u":"53.5",
                                "count":626
                            }
                        },
                        "NO":{
                            "sex":[
                                {
                                    "name":"Female",
                                    "mental_health":{
                                        "mean":"50.3",
                                        "ci_l":"46.5",
                                        "ci_u":"54.0",
                                        "count":626
                                    }
                                }
                            ],
                            "mental_health":{
                                "mean":"50.3",
                                "ci_l":"46.5",
                                "ci_u":"54.0",
                                "count":626
                            }
                        }
                    }
                ]
            }
        });
    });

    it("processYRBSReponses precomputed results with multiple groupings result nested in order Sex, race", function (){
        var yrbsresp = [{
            "response": null,
            "vars": [
                "sex",
                "race"
            ],
            "filter": {
                "year": [
                    "2015"
                ]
            },
            "var_levels": null,
            "results": [
                {
                    "ci_u": 0.5116,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.485,
                    "q": "qn46",
                    "count": 2321,
                    "ci_l": 0.4581,
                    "race": "Total",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": true,
                    "mean": -1,
                    "q": "qn46",
                    "count": 37,
                    "ci_l": -1,
                    "race": "Asian",
                    "sex": "Male"
                },
                {
                    "ci_u": 0.527,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.402,
                    "q": "qn46",
                    "count": 156,
                    "ci_l": 0.2883,
                    "race": "Black or African American",
                    "sex": "Male"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": true,
                    "mean": -1,
                    "q": "qn46",
                    "count": 20,
                    "ci_l": -1,
                    "race": "Am Indian / Alaska Native",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": true,
                    "mean": -1,
                    "q": "qn46",
                    "count": 25,
                    "ci_l": -1,
                    "race": "Native Hawaiian/other PI",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.5436,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.507,
                    "q": "qn46",
                    "count": 1162,
                    "ci_l": 0.4697,
                    "race": "White",
                    "sex": "Female"
                },
                {
                    "ci_u": 0.5485,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.462,
                    "q": "qn46",
                    "count": 192,
                    "ci_l": 0.3784,
                    "race": "Black or African American",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": true,
                    "mean": -1,
                    "q": "qn46",
                    "count": 93,
                    "ci_l": -1,
                    "race": "Multiple - Non-Hispanic",
                    "sex": "Male"
                },
                {
                    "ci_u": 0.5456,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.434,
                    "q": "qn46",
                    "count": 146,
                    "ci_l": 0.3294,
                    "race": "Multiple - Non-Hispanic",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": true,
                    "mean": -1,
                    "q": "qn46",
                    "count": 21,
                    "ci_l": -1,
                    "race": "Native Hawaiian/other PI",
                    "sex": "Male"
                },
                {
                    "ci_u": 0.5012,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.407,
                    "q": "qn46",
                    "count": 241,
                    "ci_l": 0.3197,
                    "race": "Multiple - Non-Hispanic",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.4642,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.441,
                    "q": "qn46",
                    "count": 4436,
                    "ci_l": 0.419,
                    "race": "Total",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.4701,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.416,
                    "q": "qn46",
                    "count": 1025,
                    "ci_l": 0.3631,
                    "race": "White",
                    "sex": "Male"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": true,
                    "mean": -1,
                    "q": "qn46",
                    "count": 37,
                    "ci_l": -1,
                    "race": "Asian",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": true,
                    "mean": -1,
                    "q": "qn46",
                    "count": 36,
                    "ci_l": -1,
                    "race": "Am Indian / Alaska Native",
                    "sex": "Male"
                },
                {
                    "ci_u": 0.5127,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.433,
                    "q": "qn46",
                    "count": 349,
                    "ci_l": 0.3573,
                    "race": "Black or African American",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.5026,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.459,
                    "q": "qn46",
                    "count": 737,
                    "ci_l": 0.4167,
                    "race": "Hispanic/Latino",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": true,
                    "mean": -1,
                    "q": "qn46",
                    "count": 2,
                    "ci_l": -1,
                    "race": "Native Hawaiian/other PI",
                    "sex": "Female"
                },
                {
                    "ci_u": 0.4317,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.399,
                    "q": "qn46",
                    "count": 2088,
                    "ci_l": 0.3676,
                    "race": "Total",
                    "sex": "Male"
                },
                {
                    "ci_u": 0.448,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.413,
                    "q": "qn46",
                    "count": 1422,
                    "ci_l": 0.3798,
                    "race": "Hispanic/Latino",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.4138,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.365,
                    "q": "qn46",
                    "count": 681,
                    "ci_l": 0.3186,
                    "race": "Hispanic/Latino",
                    "sex": "Male"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": true,
                    "mean": -1,
                    "q": "qn46",
                    "count": 74,
                    "ci_l": -1,
                    "race": "Asian",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.4947,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.461,
                    "q": "qn46",
                    "count": 2193,
                    "ci_l": 0.4284,
                    "race": "White",
                    "sex": "Total"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": true,
                    "mean": -1,
                    "q": "qn46",
                    "count": 57,
                    "ci_l": -1,
                    "race": "Am Indian / Alaska Native",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.5419,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.515,
                    "q": "qn46",
                    "count": 2321,
                    "ci_l": 0.4884,
                    "race": "Total",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": false,
                    "mean": -1,
                    "q": "qn46",
                    "count": 37,
                    "ci_l": -1,
                    "race": "Asian",
                    "sex": "Male"
                },
                {
                    "ci_u": 0.7117,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.598,
                    "q": "qn46",
                    "count": 156,
                    "ci_l": 0.473,
                    "race": "Black or African American",
                    "sex": "Male"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": false,
                    "mean": -1,
                    "q": "qn46",
                    "count": 20,
                    "ci_l": -1,
                    "race": "Am Indian / Alaska Native",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": false,
                    "mean": -1,
                    "q": "qn46",
                    "count": 25,
                    "ci_l": -1,
                    "race": "Native Hawaiian/other PI",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.5303,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.493,
                    "q": "qn46",
                    "count": 1162,
                    "ci_l": 0.4564,
                    "race": "White",
                    "sex": "Female"
                },
                {
                    "ci_u": 0.6216,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.538,
                    "q": "qn46",
                    "count": 192,
                    "ci_l": 0.4515,
                    "race": "Black or African American",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": false,
                    "mean": -1,
                    "q": "qn46",
                    "count": 93,
                    "ci_l": -1,
                    "race": "Multiple - Non-Hispanic",
                    "sex": "Male"
                },
                {
                    "ci_u": 0.6706,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.566,
                    "q": "qn46",
                    "count": 146,
                    "ci_l": 0.4544,
                    "race": "Multiple - Non-Hispanic",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": false,
                    "mean": -1,
                    "q": "qn46",
                    "count": 21,
                    "ci_l": -1,
                    "race": "Native Hawaiian/other PI",
                    "sex": "Male"
                },
                {
                    "ci_u": 0.6803,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.593,
                    "q": "qn46",
                    "count": 241,
                    "ci_l": 0.4988,
                    "race": "Multiple - Non-Hispanic",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.581,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.559,
                    "q": "qn46",
                    "count": 4436,
                    "ci_l": 0.5358,
                    "race": "Total",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.6369,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.584,
                    "q": "qn46",
                    "count": 1025,
                    "ci_l": 0.5299,
                    "race": "White",
                    "sex": "Male"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": false,
                    "mean": -1,
                    "q": "qn46",
                    "count": 37,
                    "ci_l": -1,
                    "race": "Asian",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": false,
                    "mean": -1,
                    "q": "qn46",
                    "count": 36,
                    "ci_l": -1,
                    "race": "Am Indian / Alaska Native",
                    "sex": "Male"
                },
                {
                    "ci_u": 0.6427,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.567,
                    "q": "qn46",
                    "count": 349,
                    "ci_l": 0.4873,
                    "race": "Black or African American",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.5833,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.541,
                    "q": "qn46",
                    "count": 737,
                    "ci_l": 0.4974,
                    "race": "Hispanic/Latino",
                    "sex": "Female"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": false,
                    "mean": -1,
                    "q": "qn46",
                    "count": 2,
                    "ci_l": -1,
                    "race": "Native Hawaiian/other PI",
                    "sex": "Female"
                },
                {
                    "ci_u": 0.6324,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.601,
                    "q": "qn46",
                    "count": 2088,
                    "ci_l": 0.5683,
                    "race": "Total",
                    "sex": "Male"
                },
                {
                    "ci_u": 0.6202,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.587,
                    "q": "qn46",
                    "count": 1422,
                    "ci_l": 0.552,
                    "race": "Hispanic/Latino",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.6814,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.635,
                    "q": "qn46",
                    "count": 681,
                    "ci_l": 0.5862,
                    "race": "Hispanic/Latino",
                    "sex": "Male"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": false,
                    "mean": -1,
                    "q": "qn46",
                    "count": 74,
                    "ci_l": -1,
                    "race": "Asian",
                    "sex": "Total"
                },
                {
                    "ci_u": 0.5716,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.539,
                    "q": "qn46",
                    "count": 2193,
                    "ci_l": 0.5053,
                    "race": "White",
                    "sex": "Total"
                },
                {
                    "ci_u": -1,
                    "method": "socrata",
                    "response": false,
                    "mean": -1,
                    "q": "qn46",
                    "count": 57,
                    "ci_l": -1,
                    "race": "Am Indian / Alaska Native",
                    "sex": "Total"
                }
            ],
            "q": "qn46",
            "is_socrata": true,
            "error": null,
            "question": "qn46"
        }];
        var result = yrbs.processYRBSReponses(yrbsresp,true, 'mental_health');
        expect(result).to.eql({
            "table":{
                "question":[
                    {
                        "name":"qn46",
                        "YES":{
                            "sex":[
                                {
                                    "name":"Male",
                                    "race":[
                                        {
                                            "name":"Asian",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":37
                                            }
                                        },
                                        {
                                            "name":"Black or African American",
                                            "mental_health":{
                                                "mean":"40.2",
                                                "ci_l":"28.8",
                                                "ci_u":"52.7",
                                                "count":156
                                            }
                                        },
                                        {
                                            "name":"Multiple - Non-Hispanic",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":93
                                            }
                                        },
                                        {
                                            "name":"Native Hawaiian/other PI",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":21
                                            }
                                        },
                                        {
                                            "name":"White",
                                            "mental_health":{
                                                "mean":"41.6",
                                                "ci_l":"36.3",
                                                "ci_u":"47.0",
                                                "count":1025
                                            }
                                        },
                                        {
                                            "name":"Am Indian / Alaska Native",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":36
                                            }
                                        },
                                        {
                                            "name":"Hispanic/Latino",
                                            "mental_health":{
                                                "mean":"36.5",
                                                "ci_l":"31.9",
                                                "ci_u":"41.4",
                                                "count":681
                                            }
                                        }
                                    ]
                                },
                                {
                                    "name":"Female",
                                    "race":[
                                        {
                                            "name":"Am Indian / Alaska Native",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":20
                                            }
                                        },
                                        {
                                            "name":"White",
                                            "mental_health":{
                                                "mean":"50.7",
                                                "ci_l":"47.0",
                                                "ci_u":"54.4",
                                                "count":1162
                                            }
                                        },
                                        {
                                            "name":"Black or African American",
                                            "mental_health":{
                                                "mean":"46.2",
                                                "ci_l":"37.8",
                                                "ci_u":"54.9",
                                                "count":192
                                            }
                                        },
                                        {
                                            "name":"Multiple - Non-Hispanic",
                                            "mental_health":{
                                                "mean":"43.4",
                                                "ci_l":"32.9",
                                                "ci_u":"54.6",
                                                "count":146
                                            }
                                        },
                                        {
                                            "name":"Asian",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":37
                                            }
                                        },
                                        {
                                            "name":"Hispanic/Latino",
                                            "mental_health":{
                                                "mean":"45.9",
                                                "ci_l":"41.7",
                                                "ci_u":"50.3",
                                                "count":737
                                            }
                                        },
                                        {
                                            "name":"Native Hawaiian/other PI",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":2
                                            }
                                        }
                                    ]
                                }
                            ],
                            "mental_health":{
                                "mean":"44.1",
                                "ci_l":"41.9",
                                "ci_u":"46.4",
                                "count":4436
                            }
                        },
                        "NO":{
                            "sex":[
                                {
                                    "name":"Male",
                                    "race":[
                                        {
                                            "name":"Asian",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":37
                                            }
                                        },
                                        {
                                            "name":"Black or African American",
                                            "mental_health":{
                                                "mean":"59.8",
                                                "ci_l":"47.3",
                                                "ci_u":"71.2",
                                                "count":156
                                            }
                                        },
                                        {
                                            "name":"Multiple - Non-Hispanic",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":93
                                            }
                                        },
                                        {
                                            "name":"Native Hawaiian/other PI",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":21
                                            }
                                        },
                                        {
                                            "name":"White",
                                            "mental_health":{
                                                "mean":"58.4",
                                                "ci_l":"53.0",
                                                "ci_u":"63.7",
                                                "count":1025
                                            }
                                        },
                                        {
                                            "name":"Am Indian / Alaska Native",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":36
                                            }
                                        },
                                        {
                                            "name":"Hispanic/Latino",
                                            "mental_health":{
                                                "mean":"63.5",
                                                "ci_l":"58.6",
                                                "ci_u":"68.1",
                                                "count":681
                                            }
                                        }
                                    ]
                                },
                                {
                                    "name":"Female",
                                    "race":[
                                        {
                                            "name":"Am Indian / Alaska Native",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":20
                                            }
                                        },
                                        {
                                            "name":"White",
                                            "mental_health":{
                                                "mean":"49.3",
                                                "ci_l":"45.6",
                                                "ci_u":"53.0",
                                                "count":1162
                                            }
                                        },
                                        {
                                            "name":"Black or African American",
                                            "mental_health":{
                                                "mean":"53.8",
                                                "ci_l":"45.1",
                                                "ci_u":"62.2",
                                                "count":192
                                            }
                                        },
                                        {
                                            "name":"Multiple - Non-Hispanic",
                                            "mental_health":{
                                                "mean":"56.6",
                                                "ci_l":"45.4",
                                                "ci_u":"67.1",
                                                "count":146
                                            }
                                        },
                                        {
                                            "name":"Asian",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":37
                                            }
                                        },
                                        {
                                            "name":"Hispanic/Latino",
                                            "mental_health":{
                                                "mean":"54.1",
                                                "ci_l":"49.7",
                                                "ci_u":"58.3",
                                                "count":737
                                            }
                                        },
                                        {
                                            "name":"Native Hawaiian/other PI",
                                            "mental_health":{
                                                "mean":"0",
                                                "ci_l":"0",
                                                "ci_u":"0",
                                                "count":2
                                            }
                                        }
                                    ]
                                }
                            ],
                            "mental_health":{
                                "mean":"55.9",
                                "ci_l":"53.6",
                                "ci_u":"58.1",
                                "count":4436
                            }
                        }
                    }
                ]
            }
        });
    });

    it("processYRBSReponses with multiple groupings result nested in order Sex, race", function (){
        var yrbsresp = [{
            "response": null,
            "vars": [
                "sex",
                "race"
            ],
            "filter": {
                "year": [
                    "2015"
                ]
            },
            "var_levels": null,
            "results": [
                {
                    "level": 0,
                    "ci_u": 0.6594,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6325,
                    "q": "qn41",
                    "count": 15049,
                    "ci_l": 0.6047,
                    "se": 0.0136
                },
                {
                    "level": 2,
                    "ci_u": 0.6669,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.634,
                    "race": "Hispanic/Latino",
                    "count": 2430,
                    "ci_l": 0.5998,
                    "q": "qn41",
                    "se": 0.0166,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.8401,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.73,
                    "race": "Native Hawaiian/other PI",
                    "count": 71,
                    "ci_l": 0.5819,
                    "q": "qn41",
                    "se": 0.0629,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.4992,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.4212,
                    "race": "Asian",
                    "count": 308,
                    "ci_l": 0.347,
                    "q": "qn41",
                    "se": 0.0374,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.7338,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6618,
                    "race": "Multiple - Non-Hispanic",
                    "count": 331,
                    "ci_l": 0.5813,
                    "q": "qn41",
                    "se": 0.0379,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.7556,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6174,
                    "race": "Am Indian / Alaska Native",
                    "count": 63,
                    "ci_l": 0.4572,
                    "q": "qn41",
                    "se": 0.0721,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.67,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6402,
                    "race": "White",
                    "count": 3266,
                    "ci_l": 0.6092,
                    "q": "qn41",
                    "se": 0.015,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.525,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.4449,
                    "race": "Asian",
                    "count": 302,
                    "ci_l": 0.3676,
                    "q": "qn41",
                    "se": 0.0386,
                    "sex": "Female"
                },
                {
                    "level": 1,
                    "ci_u": 0.6913,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6534,
                    "q": "qn41",
                    "count": 7518,
                    "ci_l": 0.6135,
                    "se": 0.0193,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.7178,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6863,
                    "race": "Hispanic/Latino",
                    "count": 2473,
                    "ci_l": 0.6529,
                    "q": "qn41",
                    "se": 0.0161,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.7004,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.3912,
                    "race": "Native Hawaiian/other PI",
                    "count": 22,
                    "ci_l": 0.1501,
                    "q": "qn41",
                    "se": 0.1301,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.8125,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.7523,
                    "race": "Multiple - Non-Hispanic",
                    "count": 376,
                    "ci_l": 0.6803,
                    "q": "qn41",
                    "se": 0.0327,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.883,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.7752,
                    "race": "Am Indian / Alaska Native",
                    "count": 92,
                    "ci_l": 0.6118,
                    "q": "qn41",
                    "se": 0.0665,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.7247,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6672,
                    "race": "White",
                    "count": 3386,
                    "ci_l": 0.6042,
                    "q": "qn41",
                    "se": 0.03,
                    "sex": "Female"
                },
                {
                    "level": 1,
                    "ci_u": 0.6382,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6142,
                    "q": "qn41",
                    "count": 7424,
                    "ci_l": 0.5895,
                    "se": 0.0121,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.5676,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.5103,
                    "race": "Black or African American",
                    "count": 776,
                    "ci_l": 0.4527,
                    "q": "qn41",
                    "se": 0.0284,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.6379,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.579,
                    "race": "Black or African American",
                    "count": 776,
                    "ci_l": 0.5177,
                    "q": "qn41",
                    "se": 0.0296,
                    "sex": "Female"
                },
                {
                    "level": 0,
                    "ci_u": 0.6594,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6325,
                    "q": "qn41",
                    "count": 15049,
                    "ci_l": 0.6047,
                    "se": 0.0136
                },
                {
                    "level": 2,
                    "ci_u": 0.6669,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.634,
                    "race": "Hispanic/Latino",
                    "count": 2430,
                    "ci_l": 0.5998,
                    "q": "qn41",
                    "se": 0.0166,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.8401,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.73,
                    "race": "Native Hawaiian/other PI",
                    "count": 71,
                    "ci_l": 0.5819,
                    "q": "qn41",
                    "se": 0.0629,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.4992,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.4212,
                    "race": "Asian",
                    "count": 308,
                    "ci_l": 0.347,
                    "q": "qn41",
                    "se": 0.0374,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.7338,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6618,
                    "race": "Multiple - Non-Hispanic",
                    "count": 331,
                    "ci_l": 0.5813,
                    "q": "qn41",
                    "se": 0.0379,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.7556,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6174,
                    "race": "Am Indian / Alaska Native",
                    "count": 63,
                    "ci_l": 0.4572,
                    "q": "qn41",
                    "se": 0.0721,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.67,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6402,
                    "race": "White",
                    "count": 3266,
                    "ci_l": 0.6092,
                    "q": "qn41",
                    "se": 0.015,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.525,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.4449,
                    "race": "Asian",
                    "count": 302,
                    "ci_l": 0.3676,
                    "q": "qn41",
                    "se": 0.0386,
                    "sex": "Female"
                },
                {
                    "level": 1,
                    "ci_u": 0.6913,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6534,
                    "q": "qn41",
                    "count": 7518,
                    "ci_l": 0.6135,
                    "se": 0.0193,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.7178,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6863,
                    "race": "Hispanic/Latino",
                    "count": 2473,
                    "ci_l": 0.6529,
                    "q": "qn41",
                    "se": 0.0161,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.7004,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.3912,
                    "race": "Native Hawaiian/other PI",
                    "count": 22,
                    "ci_l": 0.1501,
                    "q": "qn41",
                    "se": 0.1301,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.8125,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.7523,
                    "race": "Multiple - Non-Hispanic",
                    "count": 376,
                    "ci_l": 0.6803,
                    "q": "qn41",
                    "se": 0.0327,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.883,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.7752,
                    "race": "Am Indian / Alaska Native",
                    "count": 92,
                    "ci_l": 0.6118,
                    "q": "qn41",
                    "se": 0.0665,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.7247,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6672,
                    "race": "White",
                    "count": 3386,
                    "ci_l": 0.6042,
                    "q": "qn41",
                    "se": 0.03,
                    "sex": "Female"
                },
                {
                    "level": 1,
                    "ci_u": 0.6382,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.6142,
                    "q": "qn41",
                    "count": 7424,
                    "ci_l": 0.5895,
                    "se": 0.0121,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.5676,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.5103,
                    "race": "Black or African American",
                    "count": 776,
                    "ci_l": 0.4527,
                    "q": "qn41",
                    "se": 0.0284,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.6379,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.579,
                    "race": "Black or African American",
                    "count": 776,
                    "ci_l": 0.5177,
                    "q": "qn41",
                    "se": 0.0296,
                    "sex": "Female"
                }
            ],
            "q": "qn41",
            "is_socrata": false,
            "error": null,
            "question": "Ever drank alcohol"
        }];
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'mental_health');
        expect(result).to.eql({"table":{"question":[{"name":"qn41","YES":{"mental_health":{"mean":"63.2","ci_l":"60.5","ci_u":"65.9","count":15049},"sex":[{"name":"Male","race":[{"name":"Hispanic/Latino","mental_health":{"mean":"63.4","ci_l":"60.0","ci_u":"66.7","count":2430}},{"name":"Native Hawaiian/other PI","mental_health":{"mean":"73.0","ci_l":"58.2","ci_u":"84.0","count":71}},{"name":"Asian","mental_health":{"mean":"42.1","ci_l":"34.7","ci_u":"49.9","count":308}},{"name":"Multiple - Non-Hispanic","mental_health":{"mean":"66.2","ci_l":"58.1","ci_u":"73.4","count":331}},{"name":"White","mental_health":{"mean":"64.0","ci_l":"60.9","ci_u":"67.0","count":3266}},{"name":"Am Indian / Alaska Native","mental_health":{"mean":"77.5","ci_l":"61.2","ci_u":"88.3","count":92}},{"name":"Black or African American","mental_health":{"mean":"51.0","ci_l":"45.3","ci_u":"56.8","count":776}}],"mental_health":{"mean":"61.4","ci_l":"59.0","ci_u":"63.8","count":7424}},{"name":"Female","race":[{"name":"Am Indian / Alaska Native","mental_health":{"mean":"61.7","ci_l":"45.7","ci_u":"75.6","count":63}},{"name":"Asian","mental_health":{"mean":"44.5","ci_l":"36.8","ci_u":"52.5","count":302}},{"name":"Hispanic/Latino","mental_health":{"mean":"68.6","ci_l":"65.3","ci_u":"71.8","count":2473}},{"name":"Native Hawaiian/other PI","mental_health":{"mean":"39.1","ci_l":"15.0","ci_u":"70.0","count":22}},{"name":"Multiple - Non-Hispanic","mental_health":{"mean":"75.2","ci_l":"68.0","ci_u":"81.3","count":376}},{"name":"White","mental_health":{"mean":"66.7","ci_l":"60.4","ci_u":"72.5","count":3386}},{"name":"Black or African American","mental_health":{"mean":"57.9","ci_l":"51.8","ci_u":"63.8","count":776}}],"mental_health":{"mean":"65.3","ci_l":"61.4","ci_u":"69.1","count":7518}}]},"NO":{"mental_health":{"mean":"63.2","ci_l":"60.5","ci_u":"65.9","count":15049},"sex":[{"name":"Male","race":[{"name":"Hispanic/Latino","mental_health":{"mean":"63.4","ci_l":"60.0","ci_u":"66.7","count":2430}},{"name":"Native Hawaiian/other PI","mental_health":{"mean":"73.0","ci_l":"58.2","ci_u":"84.0","count":71}},{"name":"Asian","mental_health":{"mean":"42.1","ci_l":"34.7","ci_u":"49.9","count":308}},{"name":"Multiple - Non-Hispanic","mental_health":{"mean":"66.2","ci_l":"58.1","ci_u":"73.4","count":331}},{"name":"White","mental_health":{"mean":"64.0","ci_l":"60.9","ci_u":"67.0","count":3266}},{"name":"Am Indian / Alaska Native","mental_health":{"mean":"77.5","ci_l":"61.2","ci_u":"88.3","count":92}},{"name":"Black or African American","mental_health":{"mean":"51.0","ci_l":"45.3","ci_u":"56.8","count":776}}],"mental_health":{"mean":"61.4","ci_l":"59.0","ci_u":"63.8","count":7424}},{"name":"Female","race":[{"name":"Am Indian / Alaska Native","mental_health":{"mean":"61.7","ci_l":"45.7","ci_u":"75.6","count":63}},{"name":"Asian","mental_health":{"mean":"44.5","ci_l":"36.8","ci_u":"52.5","count":302}},{"name":"Hispanic/Latino","mental_health":{"mean":"68.6","ci_l":"65.3","ci_u":"71.8","count":2473}},{"name":"Native Hawaiian/other PI","mental_health":{"mean":"39.1","ci_l":"15.0","ci_u":"70.0","count":22}},{"name":"Multiple - Non-Hispanic","mental_health":{"mean":"75.2","ci_l":"68.0","ci_u":"81.3","count":376}},{"name":"White","mental_health":{"mean":"66.7","ci_l":"60.4","ci_u":"72.5","count":3386}},{"name":"Black or African American","mental_health":{"mean":"57.9","ci_l":"51.8","ci_u":"63.8","count":776}}],"mental_health":{"mean":"65.3","ci_l":"61.4","ci_u":"69.1","count":7518}}]}}]}});
    });

    it("processYRBSReponses with groupings for Sex, sexpart", function (){
        var yrbsresp = [{
            "response": null,
            "vars": [
                "sex",
                "sexpart"
            ],
            "filter": {
                "year": [
                    "2015"
                ]
            },
            "var_levels": null,
            "results": [
                {
                    "level": 0,
                    "ci_u": 0.8508,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8136,
                    "q": "qn8",
                    "count": 8757,
                    "ci_l": 0.7696,
                    "se": 0.0201
                },
                {
                    "level": 2,
                    "ci_u": 0.941,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Same sex only",
                    "mean": 0.8125,
                    "q": "qn8",
                    "count": 47,
                    "ci_l": 0.5407,
                    "se": 0.0966,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.7796,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Never had sex",
                    "mean": 0.7222,
                    "q": "qn8",
                    "count": 1789,
                    "ci_l": 0.6564,
                    "se": 0.0306,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.9273,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Opposite sex only",
                    "mean": 0.9032,
                    "q": "qn8",
                    "count": 2481,
                    "ci_l": 0.8722,
                    "se": 0.0135,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.9034,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Both Sexes",
                    "mean": 0.813,
                    "q": "qn8",
                    "count": 93,
                    "ci_l": 0.6691,
                    "se": 0.0571,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.9471,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Both Sexes",
                    "mean": 0.9179,
                    "q": "qn8",
                    "count": 268,
                    "ci_l": 0.8746,
                    "se": 0.0176,
                    "sex": "Female"
                },
                {
                    "level": 1,
                    "ci_u": 0.8436,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8014,
                    "q": "qn8",
                    "count": 3951,
                    "ci_l": 0.7511,
                    "se": 0.0229,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.7763,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Never had sex",
                    "mean": 0.7238,
                    "q": "qn8",
                    "count": 1785,
                    "ci_l": 0.6643,
                    "se": 0.0278,
                    "sex": "Male"
                },
                {
                    "level": 1,
                    "ci_u": 0.8601,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8244,
                    "q": "qn8",
                    "count": 4769,
                    "ci_l": 0.7819,
                    "se": 0.0193,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.9027,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Opposite sex only",
                    "mean": 0.8698,
                    "q": "qn8",
                    "count": 1523,
                    "ci_l": 0.828,
                    "se": 0.0184,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.9431,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Same sex only",
                    "mean": 0.857,
                    "q": "qn8",
                    "count": 88,
                    "ci_l": 0.6843,
                    "se": 0.0606,
                    "sex": "Female"
                },
                {
                    "level": 0,
                    "ci_u": 0.8508,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8136,
                    "q": "qn8",
                    "count": 8757,
                    "ci_l": 0.7696,
                    "se": 0.0201
                },
                {
                    "level": 2,
                    "ci_u": 0.941,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Same sex only",
                    "mean": 0.8125,
                    "q": "qn8",
                    "count": 47,
                    "ci_l": 0.5407,
                    "se": 0.0966,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.7796,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Never had sex",
                    "mean": 0.7222,
                    "q": "qn8",
                    "count": 1789,
                    "ci_l": 0.6564,
                    "se": 0.0306,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.9273,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Opposite sex only",
                    "mean": 0.9032,
                    "q": "qn8",
                    "count": 2481,
                    "ci_l": 0.8722,
                    "se": 0.0135,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.9034,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Both Sexes",
                    "mean": 0.813,
                    "q": "qn8",
                    "count": 93,
                    "ci_l": 0.6691,
                    "se": 0.0571,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.9471,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Both Sexes",
                    "mean": 0.9179,
                    "q": "qn8",
                    "count": 268,
                    "ci_l": 0.8746,
                    "se": 0.0176,
                    "sex": "Female"
                },
                {
                    "level": 1,
                    "ci_u": 0.8436,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8014,
                    "q": "qn8",
                    "count": 3951,
                    "ci_l": 0.7511,
                    "se": 0.0229,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.7763,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Never had sex",
                    "mean": 0.7238,
                    "q": "qn8",
                    "count": 1785,
                    "ci_l": 0.6643,
                    "se": 0.0278,
                    "sex": "Male"
                },
                {
                    "level": 1,
                    "ci_u": 0.8601,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8244,
                    "q": "qn8",
                    "count": 4769,
                    "ci_l": 0.7819,
                    "se": 0.0193,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.9027,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Opposite sex only",
                    "mean": 0.8698,
                    "q": "qn8",
                    "count": 1523,
                    "ci_l": 0.828,
                    "se": 0.0184,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.9431,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexpart": "Same sex only",
                    "mean": 0.857,
                    "q": "qn8",
                    "count": 88,
                    "ci_l": 0.6843,
                    "se": 0.0606,
                    "sex": "Female"
                }
            ],
            "q": "qn8",
            "is_socrata": false,
            "error": null,
            "question": "Rarely or never wore a bicycle helmet"
        }];
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'mental_health');
        expect(result).to.eql({
            "table":{
                "question":[
                    {
                        "name":"qn8",
                        "YES":{
                            "mental_health":{
                                "mean":"81.4",
                                "ci_l":"77.0",
                                "ci_u":"85.1",
                                "count":8757
                            },
                            "sex":[
                                {
                                    "name":"Male",
                                    "sexpart":[
                                        {
                                            "name":"Same sex only",
                                            "mental_health":{
                                                "mean":"81.3",
                                                "ci_l":"54.1",
                                                "ci_u":"94.1",
                                                "count":47
                                            }
                                        },
                                        {
                                            "name":"Opposite sex only",
                                            "mental_health":{
                                                "mean":"90.3",
                                                "ci_l":"87.2",
                                                "ci_u":"92.7",
                                                "count":2481
                                            }
                                        },
                                        {
                                            "name":"Both Sexes",
                                            "mental_health":{
                                                "mean":"81.3",
                                                "ci_l":"66.9",
                                                "ci_u":"90.3",
                                                "count":93
                                            }
                                        },
                                        {
                                            "name":"Never had sex",
                                            "mental_health":{
                                                "mean":"72.4",
                                                "ci_l":"66.4",
                                                "ci_u":"77.6",
                                                "count":1785
                                            }
                                        }
                                    ],
                                    "mental_health":{
                                        "mean":"82.4",
                                        "ci_l":"78.2",
                                        "ci_u":"86.0",
                                        "count":4769
                                    }
                                },
                                {
                                    "name":"Female",
                                    "sexpart":[
                                        {
                                            "name":"Never had sex",
                                            "mental_health":{
                                                "mean":"72.2",
                                                "ci_l":"65.6",
                                                "ci_u":"78.0",
                                                "count":1789
                                            }
                                        },
                                        {
                                            "name":"Both Sexes",
                                            "mental_health":{
                                                "mean":"91.8",
                                                "ci_l":"87.5",
                                                "ci_u":"94.7",
                                                "count":268
                                            }
                                        },
                                        {
                                            "name":"Opposite sex only",
                                            "mental_health":{
                                                "mean":"87.0",
                                                "ci_l":"82.8",
                                                "ci_u":"90.3",
                                                "count":1523
                                            }
                                        },
                                        {
                                            "name":"Same sex only",
                                            "mental_health":{
                                                "mean":"85.7",
                                                "ci_l":"68.4",
                                                "ci_u":"94.3",
                                                "count":88
                                            }
                                        }
                                    ],
                                    "mental_health":{
                                        "mean":"80.1",
                                        "ci_l":"75.1",
                                        "ci_u":"84.4",
                                        "count":3951
                                    }
                                }
                            ]
                        },
                        "NO":{
                            "mental_health":{
                                "mean":"81.4",
                                "ci_l":"77.0",
                                "ci_u":"85.1",
                                "count":8757
                            },
                            "sex":[
                                {
                                    "name":"Male",
                                    "sexpart":[
                                        {
                                            "name":"Same sex only",
                                            "mental_health":{
                                                "mean":"81.3",
                                                "ci_l":"54.1",
                                                "ci_u":"94.1",
                                                "count":47
                                            }
                                        },
                                        {
                                            "name":"Opposite sex only",
                                            "mental_health":{
                                                "mean":"90.3",
                                                "ci_l":"87.2",
                                                "ci_u":"92.7",
                                                "count":2481
                                            }
                                        },
                                        {
                                            "name":"Both Sexes",
                                            "mental_health":{
                                                "mean":"81.3",
                                                "ci_l":"66.9",
                                                "ci_u":"90.3",
                                                "count":93
                                            }
                                        },
                                        {
                                            "name":"Never had sex",
                                            "mental_health":{
                                                "mean":"72.4",
                                                "ci_l":"66.4",
                                                "ci_u":"77.6",
                                                "count":1785
                                            }
                                        }
                                    ],
                                    "mental_health":{
                                        "mean":"82.4",
                                        "ci_l":"78.2",
                                        "ci_u":"86.0",
                                        "count":4769
                                    }
                                },
                                {
                                    "name":"Female",
                                    "sexpart":[
                                        {
                                            "name":"Never had sex",
                                            "mental_health":{
                                                "mean":"72.2",
                                                "ci_l":"65.6",
                                                "ci_u":"78.0",
                                                "count":1789
                                            }
                                        },
                                        {
                                            "name":"Both Sexes",
                                            "mental_health":{
                                                "mean":"91.8",
                                                "ci_l":"87.5",
                                                "ci_u":"94.7",
                                                "count":268
                                            }
                                        },
                                        {
                                            "name":"Opposite sex only",
                                            "mental_health":{
                                                "mean":"87.0",
                                                "ci_l":"82.8",
                                                "ci_u":"90.3",
                                                "count":1523
                                            }
                                        },
                                        {
                                            "name":"Same sex only",
                                            "mental_health":{
                                                "mean":"85.7",
                                                "ci_l":"68.4",
                                                "ci_u":"94.3",
                                                "count":88
                                            }
                                        }
                                    ],
                                    "mental_health":{
                                        "mean":"80.1",
                                        "ci_l":"75.1",
                                        "ci_u":"84.4",
                                        "count":3951
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });
    });

    it("processYRBSReponses with groupings for Sex, sexid", function (){
        var yrbsresp = [{
            "response": null,
            "vars": [
                "sex",
                "sexid"
            ],
            "filter": {
                "year": [
                    "2015"
                ]
            },
            "var_levels": null,
            "results": [
                {
                    "level": 0,
                    "ci_u": 0.8508,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8136,
                    "q": "qn8",
                    "count": 8757,
                    "ci_l": 0.7696,
                    "se": 0.0201
                },
                {
                    "level": 2,
                    "ci_u": 0.9039,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Bisexual",
                    "mean": 0.8549,
                    "q": "qn8",
                    "count": 355,
                    "ci_l": 0.7868,
                    "se": 0.0287,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.8686,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Not Sure",
                    "mean": 0.781,
                    "q": "qn8",
                    "count": 99,
                    "ci_l": 0.658,
                    "se": 0.0519,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.8679,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Gay or Lesbian",
                    "mean": 0.7125,
                    "q": "qn8",
                    "count": 65,
                    "ci_l": 0.483,
                    "se": 0.0977,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.8395,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Heterosexual",
                    "mean": 0.7946,
                    "q": "qn8",
                    "count": 3134,
                    "ci_l": 0.741,
                    "se": 0.0243,
                    "sex": "Female"
                },
                {
                    "level": 1,
                    "ci_u": 0.8436,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8014,
                    "q": "qn8",
                    "count": 3951,
                    "ci_l": 0.7511,
                    "se": 0.0229,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.8664,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Not Sure",
                    "mean": 0.7779,
                    "q": "qn8",
                    "count": 132,
                    "ci_l": 0.6542,
                    "se": 0.0524,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.8638,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Heterosexual",
                    "mean": 0.8256,
                    "q": "qn8",
                    "count": 4233,
                    "ci_l": 0.7794,
                    "se": 0.0209,
                    "sex": "Male"
                },
                {
                    "level": 1,
                    "ci_u": 0.8601,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8244,
                    "q": "qn8",
                    "count": 4769,
                    "ci_l": 0.7819,
                    "se": 0.0193,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.872,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Gay or Lesbian",
                    "mean": 0.748,
                    "q": "qn8",
                    "count": 82,
                    "ci_l": 0.5641,
                    "se": 0.0766,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.8896,
                    "response": true,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Bisexual",
                    "mean": 0.8049,
                    "q": "qn8",
                    "count": 99,
                    "ci_l": 0.6787,
                    "se": 0.0517,
                    "sex": "Male"
                },
                {
                    "level": 0,
                    "ci_u": 0.8508,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8136,
                    "q": "qn8",
                    "count": 8757,
                    "ci_l": 0.7696,
                    "se": 0.0201
                },
                {
                    "level": 2,
                    "ci_u": 0.9039,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Bisexual",
                    "mean": 0.8549,
                    "q": "qn8",
                    "count": 355,
                    "ci_l": 0.7868,
                    "se": 0.0287,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.8686,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Not Sure",
                    "mean": 0.781,
                    "q": "qn8",
                    "count": 99,
                    "ci_l": 0.658,
                    "se": 0.0519,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.8679,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Gay or Lesbian",
                    "mean": 0.7125,
                    "q": "qn8",
                    "count": 65,
                    "ci_l": 0.483,
                    "se": 0.0977,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.8395,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Heterosexual",
                    "mean": 0.7946,
                    "q": "qn8",
                    "count": 3134,
                    "ci_l": 0.741,
                    "se": 0.0243,
                    "sex": "Female"
                },
                {
                    "level": 1,
                    "ci_u": 0.8436,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8014,
                    "q": "qn8",
                    "count": 3951,
                    "ci_l": 0.7511,
                    "se": 0.0229,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.8664,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Not Sure",
                    "mean": 0.7779,
                    "q": "qn8",
                    "count": 132,
                    "ci_l": 0.6542,
                    "se": 0.0524,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.8638,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Heterosexual",
                    "mean": 0.8256,
                    "q": "qn8",
                    "count": 4233,
                    "ci_l": 0.7794,
                    "se": 0.0209,
                    "sex": "Male"
                },
                {
                    "level": 1,
                    "ci_u": 0.8601,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "mean": 0.8244,
                    "q": "qn8",
                    "count": 4769,
                    "ci_l": 0.7819,
                    "se": 0.0193,
                    "sex": "Male"
                },
                {
                    "level": 2,
                    "ci_u": 0.872,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Gay or Lesbian",
                    "mean": 0.748,
                    "q": "qn8",
                    "count": 82,
                    "ci_l": 0.5641,
                    "se": 0.0766,
                    "sex": "Female"
                },
                {
                    "level": 2,
                    "ci_u": 0.8896,
                    "response": false,
                    "filter": {
                        "year": [
                            "2015"
                        ]
                    },
                    "sexid": "Bisexual",
                    "mean": 0.8049,
                    "q": "qn8",
                    "count": 99,
                    "ci_l": 0.6787,
                    "se": 0.0517,
                    "sex": "Male"
                }
            ],
            "q": "qn8",
            "is_socrata": false,
            "error": null,
            "question": "Rarely or never wore a bicycle helmet"
        }]
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn8",
                        "YES":{
                            "mental_health":{
                                "mean":"81.4",
                                "ci_l":"77.0",
                                "ci_u":"85.1",
                                "count":8757
                            },
                            "sex":[
                                {
                                    "name":"Female",
                                    "sexid":[
                                        {
                                            "name":"Bisexual",
                                            "mental_health":{
                                                "mean":"85.5",
                                                "ci_l":"78.7",
                                                "ci_u":"90.4",
                                                "count":355
                                            }
                                        },
                                        {
                                            "name":"Heterosexual",
                                            "mental_health":{
                                                "mean":"79.5",
                                                "ci_l":"74.1",
                                                "ci_u":"84.0",
                                                "count":3134
                                            }
                                        },
                                        {
                                            "name":"Not Sure",
                                            "mental_health":{
                                                "mean":"77.8",
                                                "ci_l":"65.4",
                                                "ci_u":"86.6",
                                                "count":132
                                            }
                                        },
                                        {
                                            "name":"Gay or Lesbian",
                                            "mental_health":{
                                                "mean":"74.8",
                                                "ci_l":"56.4",
                                                "ci_u":"87.2",
                                                "count":82
                                            }
                                        }
                                    ],
                                    "mental_health":{
                                        "mean":"80.1",
                                        "ci_l":"75.1",
                                        "ci_u":"84.4",
                                        "count":3951
                                    }
                                },
                                {
                                    "name":"Male",
                                    "sexid":[
                                        {
                                            "name":"Not Sure",
                                            "mental_health":{
                                                "mean":"78.1",
                                                "ci_l":"65.8",
                                                "ci_u":"86.9",
                                                "count":99
                                            }
                                        },
                                        {
                                            "name":"Gay or Lesbian",
                                            "mental_health":{
                                                "mean":"71.3",
                                                "ci_l":"48.3",
                                                "ci_u":"86.8",
                                                "count":65
                                            }
                                        },
                                        {
                                            "name":"Heterosexual",
                                            "mental_health":{
                                                "mean":"82.6",
                                                "ci_l":"77.9",
                                                "ci_u":"86.4",
                                                "count":4233
                                            }
                                        },
                                        {
                                            "name":"Bisexual",
                                            "mental_health":{
                                                "mean":"80.5",
                                                "ci_l":"67.9",
                                                "ci_u":"89.0",
                                                "count":99
                                            }
                                        }
                                    ],
                                    "mental_health":{
                                        "mean":"82.4",
                                        "ci_l":"78.2",
                                        "ci_u":"86.0",
                                        "count":4769
                                    }
                                }
                            ]
                        },
                        "NO":{
                            "mental_health":{
                                "mean":"81.4",
                                "ci_l":"77.0",
                                "ci_u":"85.1",
                                "count":8757
                            },
                            "sex":[
                                {
                                    "name":"Female",
                                    "sexid":[
                                        {
                                            "name":"Bisexual",
                                            "mental_health":{
                                                "mean":"85.5",
                                                "ci_l":"78.7",
                                                "ci_u":"90.4",
                                                "count":355
                                            }
                                        },
                                        {
                                            "name":"Heterosexual",
                                            "mental_health":{
                                                "mean":"79.5",
                                                "ci_l":"74.1",
                                                "ci_u":"84.0",
                                                "count":3134
                                            }
                                        },
                                        {
                                            "name":"Not Sure",
                                            "mental_health":{
                                                "mean":"77.8",
                                                "ci_l":"65.4",
                                                "ci_u":"86.6",
                                                "count":132
                                            }
                                        },
                                        {
                                            "name":"Gay or Lesbian",
                                            "mental_health":{
                                                "mean":"74.8",
                                                "ci_l":"56.4",
                                                "ci_u":"87.2",
                                                "count":82
                                            }
                                        }
                                    ],
                                    "mental_health":{
                                        "mean":"80.1",
                                        "ci_l":"75.1",
                                        "ci_u":"84.4",
                                        "count":3951
                                    }
                                },
                                {
                                    "name":"Male",
                                    "sexid":[
                                        {
                                            "name":"Not Sure",
                                            "mental_health":{
                                                "mean":"78.1",
                                                "ci_l":"65.8",
                                                "ci_u":"86.9",
                                                "count":99
                                            }
                                        },
                                        {
                                            "name":"Gay or Lesbian",
                                            "mental_health":{
                                                "mean":"71.3",
                                                "ci_l":"48.3",
                                                "ci_u":"86.8",
                                                "count":65
                                            }
                                        },
                                        {
                                            "name":"Heterosexual",
                                            "mental_health":{
                                                "mean":"82.6",
                                                "ci_l":"77.9",
                                                "ci_u":"86.4",
                                                "count":4233
                                            }
                                        },
                                        {
                                            "name":"Bisexual",
                                            "mental_health":{
                                                "mean":"80.5",
                                                "ci_l":"67.9",
                                                "ci_u":"89.0",
                                                "count":99
                                            }
                                        }
                                    ],
                                    "mental_health":{
                                        "mean":"82.4",
                                        "ci_l":"78.2",
                                        "ci_u":"86.0",
                                        "count":4769
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });
    });

    it("invokeYRBS service group by race and sex", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8', 'qn9']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            var q1=resp.table.question[1];
            expect(q0.YES.mental_health.mean).to.eql(87.4);
            expect(q0.YES.mental_health.ci_l).to.eql(86.5);
            expect(q0.YES.mental_health.ci_u).to.eql(88.3);
            expect(q0.YES.mental_health.count).to.eql(121103);
            var sex = sortByKey(q0.YES.sex,'name',true);
            expect(sex.length).to.eql(2);
            expect(sex[0].name).to.eql("Female");
            expect(sex[1].name).to.eql("Male");
            var female = sortByKey(sex[0].race, 'name', true);
            expect(female).to.eql([{"name":"Am Indian / Alaska Native","mental_health":{"mean":"88.4","ci_l":"83.1","ci_u":"92.2","count":519}},{"name":"Asian","mental_health":{"mean":"76.8","ci_l":"72.9","ci_u":"80.2","count":1541}},{"name":"Black or African American","mental_health":{"mean":"92.9","ci_l":"91.5","ci_u":"94.0","count":11670}},{"name":"Hispanic/Latino","mental_health":{"mean":"89.6","ci_l":"88.5","ci_u":"90.6","count":14016}},{"name":"Multiple - Non-Hispanic","mental_health":{"mean":"82.1","ci_l":"77.5","ci_u":"85.9","count":1370}},{"name":"Native Hawaiian/other PI","mental_health":{"mean":"81.3","ci_l":"72.0","ci_u":"88.1","count":274}},{"name":"White","mental_health":{"mean":"84.8","ci_l":"83.4","ci_u":"86.1","count":23714}}]);
            var male = sortByKey(sex[1].race, 'name', true);
            expect(male).to.eql([{"name":"Am Indian / Alaska Native","mental_health":{"mean":"91.5","ci_l":"87.3","ci_u":"94.3","count":832}},{"name":"Asian","mental_health":{"mean":"81.3","ci_l":"78.1","ci_u":"84.1","count":2115}},{"name":"Black or African American","mental_health":{"mean":"94.4","ci_l":"93.7","ci_u":"95.1","count":13866}},{"name":"Hispanic/Latino","mental_health":{"mean":"91.5","ci_l":"90.6","ci_u":"92.3","count":17566}},{"name":"Multiple - Non-Hispanic","mental_health":{"mean":"83.9","ci_l":"78.7","ci_u":"88.0","count":1509}},{"name":"Native Hawaiian/other PI","mental_health":{"mean":"81.2","ci_l":"73.2","ci_u":"87.3","count":417}},{"name":"White","mental_health":{"mean":"86.8","ci_l":"85.7","ci_u":"87.9","count":28769}}]);
        });
    });

    it("invokeYRBS service with no grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            expect(resp).to.eql( {
                "table":{
                    "question":[
                        {
                            "name":"qn8",
                            "YES":{
                                "mental_health":{
                                    "mean":"87.4",
                                    "ci_l":"86.5",
                                    "ci_u":"88.3",
                                    "count":121103
                                }
                            },
                            "NO":{
                                "mental_health":{
                                    "mean":"87.4",
                                    "ci_l":"86.5",
                                    "ci_u":"88.3",
                                    "count":121103
                                }
                            }
                        }
                    ]
                }
            } );
        });
    });

    it("invokeYRBS service with grouping and filtering", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'race':{value:['White', 'Black or African American']},'sex':{value:['Female']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            expect(q0.YES.mental_health).to.eql({"mean":"86.1","ci_l":"84.9","ci_u":"87.3","count":35384});
            expect(q0.YES.sex.length).to.eql(1);
            var sex = sortByKey(q0.YES.sex, 'name', true);
            expect(sex[0].name).to.eql("Female");
            var race = sortByKey(sex[0].race, 'name', true);
            expect(race).to.eql([{"name":"Black or African American","mental_health":{"mean":"92.9","ci_l":"91.5","ci_u":"94.0","count":11670}},{"name":"White","mental_health":{"mean":"84.8","ci_l":"83.4","ci_u":"86.1","count":23714}}]);
            expect(q0.NO.mental_health).to.eql({"mean":"86.1","ci_l":"84.9","ci_u":"87.3","count":35384});
            var sexno = sortByKey(q0.NO.sex, 'name', true);
            expect(sex[0].name).to.eql("Female");
            var race = sortByKey(sex[0].race, 'name', true);
            expect([{"name":"Black or African American","mental_health":{"mean":"92.9","ci_l":"91.5","ci_u":"94.0","count":11670}},{"name":"White","mental_health":{"mean":"84.8","ci_l":"83.4","ci_u":"86.1","count":23714}}]);
        });
    });

    it("invokeYRBS state service with grouping and filtering", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsState","queryKey":"sitecode","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'race':{value:['White', 'Black or African American']},'sitecode':{value:['CA','MO']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            expect(q0.YES.mental_health).to.eql({"mean":"81.6","ci_l":"77.4","ci_u":"85.1","count":10156});
            var race = sortByKey(q0.YES.race,'name',true);
            expect(race[0].name).to.eql("Black or African American");
            expect(race[1].name).to.eql("White");
            var b = sortByKey(race[0].sitecode, 'name', true);
            expect(b).to.eql([{"name":"CA","mental_health":{"mean":"suppressed","ci_l":"76.8","ci_u":"96.1","count":38}}, {"name":"MO","mental_health":{"mean":"92.8","ci_l":"90.2","ci_u":"94.7","count":1395}}]);
            var w = sortByKey(race[1].sitecode, 'name', true);
            expect(w).to.eql([{"name":"CA","mental_health":{"mean":"48.8","ci_l":"37.8","ci_u":"59.9","count":240}}, {"name":"MO","mental_health":{"mean":"87.8","ci_l":"85.1","ci_u":"90.1","count":8483}}]);

        });
    });

    it("invokeYRBS service for precomputed results", function (){
        var apiQuery = {'searchFor': 'mental_health', 'yrbsBasic': true, 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'year':{value:['2015']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            expect(resp).to.eql( {"table":{"question":[{"name":"qn8","YES":{"mental_health":{"mean":"81.4","ci_l":"77.0","ci_u":"85.1","count":8757}},"NO":{"mental_health":{"mean":"18.6","ci_l":"14.9","ci_u":"23.0","count":8757}}}]}} );
        });
    });

    it("invokeYRBS service for precomputed results with grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'yrbsBasic': true, 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'year':{value:['2015']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            expect(q0.YES.mental_health.mean).to.eql(81.4);
            expect(q0.YES.mental_health.ci_l).to.eql(77.0);
            expect(q0.YES.mental_health.ci_u).to.eql(85.1);
            expect(q0.YES.mental_health.count).to.eql(8757);
            var sex= sortByKey(q0.YES.sex,'name',true);
            expect(sex[0].name).to.eql("Female");
            expect(sex[0].mental_health.mean).to.eql(80.1);
            expect(sex[0].mental_health.ci_l).to.eql(75.2);
            expect(sex[0].mental_health.ci_u).to.eql(84.3);
            expect(sex[0].mental_health.count).to.eql(3951);
            expect(q0.NO.mental_health.mean).to.eql(18.6);
            expect(q0.NO.mental_health.ci_l).to.eql(14.9);
            expect(q0.NO.mental_health.ci_u).to.eql(23.0);
            expect(q0.NO.mental_health.count).to.eql(8757);
        });
    });

    it("invokeYRBS service for basic results with default grouping - suppressing if value < 100", function (){
        var apiQuery = {"searchFor":"mental_health","query":{"year":{"key":"year","queryKey":"year","value":"2015","primary":false},
            "question.path":{"key":"question","queryKey":"question.key","value":["qn14"],"primary":false}},"aggregations":{"simple":[],
            "nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"yrbsSex","queryKey":"sex","size":0},
                {"key":"yrbsRace","queryKey":"race","size":0}],"charts":[],"maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}},"yrbsBasic":true,"pagination":{"from":0,"size":10000}}

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            var sex= sortByKey(q0.YES.sex,'name',true);
            var race= sortByKey(sex[0].race,'name',true);
            expect(race[5].name).to.eql("Native Hawaiian/other PI");
            expect(race[5].mental_health.mean).to.eql("suppressed");
            expect(race[5].mental_health.count).to.eql("19");

            expect(race[6].name).to.eql("White");
            expect(race[6].mental_health.mean).to.not.eql("suppressed");
            expect(race[6].mental_health.count).to.eql("2723");
        });
    });

    it("invokeYRBS service for basic results with default grouping for chart - supressed values are set to -1 if count < 100", function (){
        var apiQuery = {"searchFor":"mental_health", "isChartorMapQuery":true, "query":{"year":{"key":"year","queryKey":"year","value":"2015","primary":false},
            "question.path":{"key":"question","queryKey":"question.key","value":["qn14"],"primary":false}},"aggregations":{"simple":[],
            "nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"yrbsSex","queryKey":"sex","size":0},
                {"key":"yrbsRace","queryKey":"race","size":0}],"charts":[],"maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}},"yrbsBasic":true,"pagination":{"from":0,"size":10000}}

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            var sex= sortByKey(q0.YES.sex,'name',true);
            var race= sortByKey(sex[0].race,'name',true);
            expect(race[5].name).to.eql("Native Hawaiian/other PI");
            expect(race[5].mental_health.mean).to.eql("-1");
            expect(race[5].mental_health.count).to.eql("19");

            expect(race[6].name).to.eql("White");
            expect(race[6].mental_health.mean).to.not.eql("-1");
            expect(race[6].mental_health.count).to.eql("2723");
        });
    });


    it("invokeYRBS service for advanced results with sexid filter - suppressing if value < 30", function (){
        var apiQuery = {"searchFor":"mental_health","query":{"year":{"key":"year","queryKey":"year","value":["2015"],"primary":false},
            "sexid":{"key":"sexid","queryKey":"sexid","value":["Heterosexual"],"primary":false},
            "question.path":{"key":"question","queryKey":"question.key","value":["qn64"],"primary":false}},"aggregations":{"simple":[],
            "nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"yrbsRace","queryKey":"race","size":0}],
                "charts":[], "maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}}, "pagination":{"from":0,"size":10000}};
        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            var race = sortByKey(q0.YES.race,'name',true);
            expect(race[5].name).to.eql("Native Hawaiian/other PI");
            expect(race[5].mental_health.mean).to.eql("suppressed");
            expect(race[5].mental_health.count).to.eql("16");

            expect(race[1].name).to.eql("Asian");
            expect(race[1].mental_health.mean).to.not.eql("suppressed");
            expect(race[1].mental_health.count).to.eql("81");
        });
    });

    it("invokeYRBS service for advanced results with sexid filter for chart - supressed values set to -1 if value < 30", function (){
        var apiQuery = {"searchFor":"mental_health", "isChartorMapQuery":true, "query":{"year":{"key":"year","queryKey":"year","value":["2015"],"primary":false},
            "sexid":{"key":"sexid","queryKey":"sexid","value":["Heterosexual"],"primary":false},
            "question.path":{"key":"question","queryKey":"question.key","value":["qn64"],"primary":false}},"aggregations":{"simple":[],
            "nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"yrbsRace","queryKey":"race","size":0}],
                "charts":[], "maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}}, "pagination":{"from":0,"size":10000}};
        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            var race = sortByKey(q0.YES.race,'name',true);
            expect(race[5].name).to.eql("Native Hawaiian/other PI");
            expect(race[5].mental_health.mean).to.eql("-1");
            expect(race[5].mental_health.count).to.eql("16");

            expect(race[1].name).to.eql("Asian");
            expect(race[1].mental_health.mean).to.not.eql("-1");
            expect(race[1].mental_health.count).to.eql("81");
        });
    });

    it("invokeYRBS service for brfss for suppressed data", function (){
        var apiQuery = {"searchFor":"brfss","query":{"year":{"key":"year","queryKey":"year","value":["2015"],"primary":false},"sitecode":{"key":"state","queryKey":"sitecode","value":["AL"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["DRNKANY2","DRNKANY3","DRNKANY4","DRNKANY5","DRINKANY","_RFBING2","_RFBING3","_RFBINGE","_RFBING4","_RFBING5","_RFDRCHR","_RFDRHV5","_RFDRHV2","_RFDRHV3","_RFDRHV4","_RFDRHVY"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"race","queryKey":"race","size":0}],"charts":[],"maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}},"pagination":{"from":0,"size":10000}};
        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q5=resp.table.question[3];
            var yesReponse = q5['Yes'];
            //suppressed
            expect(yesReponse.race[4].name).to.eql("Asian, non-Hispanic");
            expect(yesReponse.race[4].brfss.mean).to.eql("suppressed");
            expect(yesReponse.race[4].brfss.ci_l).to.eql(0);
            expect(yesReponse.race[4].brfss.ci_u).to.eql(0);
            expect(yesReponse.race[4].brfss.count).to.eql(11);

            //No response
            expect(yesReponse.race[5].name).to.eql("Native Hawaiian or other Pacific Islander, non-Hispanic");
            expect(yesReponse.race[5].brfss.mean).to.eql("na");
            expect(yesReponse.race[5].brfss.ci_l).to.eql(0);
            expect(yesReponse.race[5].brfss.ci_u).to.eql(0);
            expect(yesReponse.race[5].brfss.count).to.eql(0);

            //valid response
            expect(yesReponse.race[6].name).to.eql("Other, non-Hispanic");
            expect(yesReponse.race[6].brfss.mean).to.eql(32.9);
            expect(yesReponse.race[6].brfss.ci_l).to.eql(15.1);
            expect(yesReponse.race[6].brfss.ci_u).to.eql(50.7);
            expect(yesReponse.race[6].brfss.count).to.eql(15);

        });
    });

    it("getYRBSQuestionsTree from yrbs service", function (){
        return yrbs.getYRBSQuestionsTree().then(function (response) {
            expect(response.questionTree[7].text).to.eql("Unintentional Injuries and Violence");
            expect(response.questionTree[6].text).to.eql("Tobacco Use");
            expect(response.questionTree[0].text).to.eql("Alcohol and Other Drug Use");
            expect(response.questionTree[5].text).to.eql("Sexual Behaviors");
            expect(response.questionTree[2].text).to.eql("Obesity, Overweight, and Weight Control");
            expect(response.questionTree[1].text).to.eql("Dietary Behaviors");
            expect(response.questionTree[4].text).to.eql("Physical Activity");
            expect(response.questionTree[3].text).to.eql("Other Health Topics");
            //Childrens are in alphabetical order
            expect(response.questionTree[7].children[0].text).to.eql("Attempted suicide that resulted in an injury, poisoning, or overdose that had to be treated by a doctor or nurse(during the 12 months before the survey)");
            expect(response.questionTree[7].children[1].text).to.eql("Attempted suicide(one or more times during the 12 months before the survey)");
            expect(response.questionTree[7].children[2].text).to.eql("Carried a gun(on at least 1 day during the 30 days before the survey)");

            //Verify questionsList
            expect(response.questionsList[0].qkey).to.eql("qn10");
            expect(response.questionsList[1].qkey).to.eql("qn11");
            expect(response.questionsList[0].title).to.eql("Rode with a driver who had been drinking alcohol(in a car or other vehicle one or more times during the 30 days before the survey)");
            expect(response.questionsList[1].title).to.eql("Drove when drinking alcohol(in a car or other vehicle one or more times during the 30 days before the survey, among students who had driven a car or other vehicle during the 30 days before the survey)");
        });
    });

    it("should get prams questions tree", function (){
        return yrbs.getPramsQuestionsTree().then(function (response) {

            expect(response.questionTree[0].text).to.eql("Abuse - Mental");
            expect(response.questionTree[0].children.length).to.eql(1);
            expect(response.questionTree[0].children[0].text).to.eql("(*PCH) During the 12 months before pregnancy  did your husband or partner threaten you  limit your activities against your will  or make you feel unsafe in any other way?");

            expect(response.questionTree[1].text).to.eql("Abuse - Physical");
            expect(response.questionTree[1].children.length).to.eql(8);
            expect(response.questionTree[1].children[0].text).to.eql("(*PCH) During the 12 months before you got pregnant  did your husband or partner push  hit  slap, kick, choke, or physically hurt you in any other way?");
            expect(response.questionTree[1].children[7].text).to.eql("Indicator of no physical abuse during pregnancy");

            expect(response.questionTree[2].text).to.eql("Alcohol Use");
            expect(response.questionTree[2].children.length).to.eql(5);
            expect(response.questionTree[2].children[0].text).to.eql("(*PCH) Indicator of binge drinking (4+ drinks) during 3 months before pregnancy");
            expect(response.questionTree[2].children[4].text).to.eql("Indicator of whether mother reported having any alcoholic drinks during the last 3 months of pregnancy");

            //46 topics
            expect(response.questionTree.length).to.eql(46);
            //270 questions
            expect(response.questionsList.length).to.eql(270);

            yrbs.getPramsQuestionsTree().then(function (cachedResponse) {
                expect(JSON.stringify(response)).to.eql(JSON.stringify(cachedResponse));
            });
        });
    });

    it("should get brfss questions tree", function (){
        return yrbs.getBRFSQuestionsTree().then(function (response) {
            console.log(JSON.stringify(response));
            expect(response.questionTree[0].text).to.eql("Aerobic Activity");
            expect(response.questionTree[0].children.length).to.eql(2);
            expect(response.questionTree[0].children[0].text).to.eql("Participated in enough Aerobic and Muscle Strengthening exercises to meet guidelines (variable calculated from one or more BRFSS questions)");

            expect(response.questionTree[2].text).to.eql("Alcohol Consumption");
            expect(response.questionTree[2].children.length).to.eql(5);
            expect(response.questionTree[2].children[0].text).to.eql("Adults who have had at least one drink of alcohol within the past 30 days");

            //46 topics
            expect(response.questionTree.length).to.eql(64);
            //270 questions
            expect(response.questionsList.length).to.eql(139);

            yrbs.getBRFSQuestionsTree().then(function (cachedResponse) {
                expect(JSON.stringify(response)).to.eql(JSON.stringify(cachedResponse));
            });
        });
    });

    function sortByKey(array, key, asc) {
        return array.sort(function(a, b) {
            var x = typeof(key) === 'function' ? key(a) : a[key];
            var y = typeof(key) === 'function' ? key(b) : b[key];
            if(asc===undefined || asc === true) {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }else {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });
    }
});
