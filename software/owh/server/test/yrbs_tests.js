var y = require("../api/yrbs");
var supertest = require("supertest");
var expect = require("expect.js");
var config = require('../config/config');

describe("YRBS API", function () {
    var yrbs;
    this.timeout(30000);
    beforeEach( function () {
        yrbs = new y();
    });

    it("buildYRBSQueries with grouping param", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
                        'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn1&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn2&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn3&v=sex,race']);

    });

    it("buildYRBSQueries with grouping param for basic query", function (){
        var apiQuery = {'searchFor': 'mental_health', 'yrbsBasic': true, 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&s=1&q=qn1&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&r=1&s=1&q=qn2&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&r=1&s=1&q=qn3&v=sex,race']);

    });

    it("buildYRBSQueries with all grouping params", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsGrade","queryKey":"grade","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
                        'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn1&v=sex,grade,race',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn2&v=sex,grade,race',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn3&v=sex,grade,race']);

    });

    it("buildYRBSQueries with no grouping params", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000}]}},
                        'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn1',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn2',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn3']);

    });

    it("buildYRBSQueries with only filtering params", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'race':{value:['White', 'Black or African American']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn1&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn2&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn3&f=race:White,Black or African American']);

    });


    it("buildYRBSQueries with grouping and filtering params", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
        'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'race':{value:['White', 'Black or African American']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn1&v=race&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn2&v=race&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn3&v=race&f=race:White,Black or African American']);

    });

    it("buildYRBSQueries with multiple grouping and filtering params", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'race':{value:['White', 'Black or African American']},'sex':{value:['Female']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn1&v=sex,race&f=race:White,Black or African American|sex:Female',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn2&v=sex,race&f=race:White,Black or African American|sex:Female',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn3&v=sex,race&f=race:White,Black or African American|sex:Female']);

    });

    it("buildYRBSQueries with state grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsState","queryKey":"sitecode","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn1&v=race,sitecode',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn2&v=race,sitecode',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn3&v=race,sitecode']);

    });

    it("buildYRBSQueries with state filtering", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'sitecode':{'value':['AL', 'MN']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn1&v=race&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn2&v=race&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn3&v=race&f=sitecode:AL,MN']);

    });

    it("buildYRBSQueries with state filtering and grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsState","queryKey":"sitecode","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'sitecode':{'value':['AL', 'MN']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn1&v=race,sitecode&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn2&v=race,sitecode&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn3&v=race,sitecode&f=sitecode:AL,MN']);

    });

    it("buildYRBSQueries with sexid filtering and grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},
            {"key":"sexid","queryKey":"sexid","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'sexid':{'value':['Bisexual', 'Heterosexual']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn8&v=sexid&f=sexid:Bisexual,Heterosexual']);

    });

    it("buildYRBSQueries with year filtering and grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},
            {"key":"year","queryKey":"year","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'year':{'value':['2015', '2014']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn8&v=year&f=year:2015,2014']);

    });

    it("buildYRBSQueries with sexpart filtering and grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},
            {"key":"sexpart","queryKey":"sexpart","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'sexpart':{'value':['Both Sexes', 'Same sex only']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&r=1&q=qn8&v=sexpart&f=sexpart:Both Sexes,Same sex only']);

    });

    it("processYRBSReponses", function (){
        var yrbsresp = [ {
            "q": "qn41",
            "results": [
                {
                    "mean": 0.6325,
                    "level": 0,
                    "se": 0.013,
                    "ci_u": 0.6584,
                    "count": 15049,
                    "ci_l": 0.6058
                },
                {
                    "sex": "Female",
                    "q_resp": true,
                    "q": "qn41",
                    "se": 0.0187,
                    "level": 1,
                    "mean": 0.6534,
                    "ci_u": 0.6901,
                    "count": 7518,
                    "ci_l": 0.6147
                },
                {
                    "sex": "Male",
                    "q_resp": true,
                    "q": "qn41",
                    "se": 0.0115,
                    "level": 1,
                    "mean": 0.6142,
                    "ci_u": 0.6371,
                    "count": 7424,
                    "ci_l": 0.5907
                }
            ],
            "response": true,
            "question": "Ever drank alcohol",
            "var_levels": {
                "sex": {
                    "question": "What is your sex",
                    "responses": [
                        [
                            "1",
                            "Female"
                        ],
                        [
                            "2",
                            "Male"
                        ]
                    ]
                }
            },
            "vars": [
                "sex"
            ]
        }, null,
            {
                "q": "qn45",
                "results": [
                    {
                        "mean": 0.6325,
                        "level": 0,
                        "se": 0.013,
                        "ci_u": 0.6584,
                        "count": 15049,
                        "ci_l": 0.6058
                    },
                    {
                        "sex": "Female",
                        "q_resp": true,
                        "q": "qn41",
                        "se": 0.0187,
                        "level": 1,
                        "mean": 0.6534,
                        "ci_u": 0.6901,
                        "count": 7518,
                        "ci_l": 0.6147
                    },
                    {
                        "sex": "Male",
                        "q_resp": true,
                        "q": "qn41",
                        "se": 0.0115,
                        "level": 1,
                        "mean": 0.6142,
                        "ci_u": 0.6371,
                        "count": 7424,
                        "ci_l": 0.5907
                    }
                ],
                "response": true,
                "question": "Ever drank alcohol",
                "var_levels": {
                    "sex": {
                        "question": "What is your sex",
                        "responses": [
                            [
                                "1",
                                "Female"
                            ],
                            [
                                "2",
                                "Male"
                            ]
                        ]
                    }
                },
                "vars": [
                    "sex"
                ]
            }]
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'mental_health');
        expect(result).to.eql({
            "table":{
                "question":[
                    {
                        "name":"qn41",
                        "mental_health": {
                            "mean": 63.2,
                            "ci_l": 60.6,
                            "ci_u": 65.8,
                            "count": 15049
                        },
                        "sex":[
                            {
                                "name":"Female",
                                "mental_health": {
                                    "mean": 65.3,
                                    "ci_l": 61.5,
                                    "ci_u": 69.0,
                                    "count": 7518
                                }
                            },
                            {
                                "name":"Male",
                                "mental_health": {
                                    "mean": 61.4,
                                    "ci_l": 59.1,
                                    "ci_u": 63.7,
                                    "count": 7424
                                }
                            }
                        ]
                    },
                    {
                        "name":"qn45",
                        "mental_health": {
                            "mean": 63.2,
                            "ci_l": 60.6,
                            "ci_u": 65.8,
                            "count": 15049
                        },
                        "sex":[
                            {
                                "name":"Female",
                                "mental_health": {
                                    "mean": 65.3,
                                    "ci_l": 61.5,
                                    "ci_u": 69.0,
                                    "count": 7518
                                }
                            },
                            {
                                "name":"Male",
                                "mental_health": {
                                    "mean": 61.4,
                                    "ci_l": 59.1,
                                    "ci_u": 63.7,
                                    "count": 7424
                                }
                            }
                        ]
                    }
                ]
            }
        });

    });

    it("processYRBSReponses with no groupings", function (){
        var yrbsresp = [
            {
                "q":"qn45",
                "results":[
                    {
                        "mean":0.6326,
                        "level":0,
                        "se":0.013,
                        "ci_u":0.6584,
                        "count":15049,
                        "ci_l":0.6058
                    }
                ]
            },null,
            {
                "q":"qn46",
                "results":[
                    {
                        "mean":0.6324,
                        "level":0,
                        "se":0.013,
                        "ci_u":0.6500,
                        "count":15049,
                        "ci_l":0.6057
                    }
                ]
            }
        ];

        var result = yrbs.processYRBSReponses(yrbsresp, false, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn45",
                        "mental_health": {
                            "mean": 63.3,
                            "ci_l": 60.6,
                            "ci_u": 65.8,
                            "count": 15049
                        }
                    },
                    {
                        "name":"qn46",
                        "mental_health": {
                            "mean": 63.2,
                            "ci_l": 60.6,
                            "ci_u": 65.0,
                            "count": 15049
                        }
                    }
                ]
            }
        });
    });

    it("processYRBSReponses precomputed results with no groupings", function (){
        var yrbsresp = [
            {
                "results": [
                    {
                        "ci_u": 0.0512,
                        "count": 11597,
                        "mean": 0.043,
                        "q_resp": true,
                        "method": "socrata",
                        "ci_l": 0.0364,
                        "q": "qn45"
                    }
                ],
                "q": "qn45",
                "question": "Reported that the largest number of drinks they had in a row was 10 or more",
                "vars": [],
                "response": true,
                "filter": {
                    "year": [
                        "2015"
                    ]
                },
                "precomputed": [],
                "var_levels": {},
                "is_socrata": true
            },
            {
                "results": [
                    {
                        "ci_u": 0.4642,
                        "count": 4436,
                        "mean": 0.441,
                        "q_resp": true,
                        "method": "socrata",
                        "ci_l": 0.419,
                        "q": "qn46"
                    }
                ],
                "q": "qn46",
                "question": "Usually obtained the alcohol they drank by someone giving it to them",
                "vars": [],
                "response": true,
                "filter": {
                    "year": [
                        "2015"
                    ]
                },
                "precomputed": [],
                "var_levels": {},
                "is_socrata": true
            }
        ];

        var result = yrbs.processYRBSReponses(yrbsresp, true, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn45",
                        "mental_health": {
                            "mean": 4.3,
                            "ci_l": 3.6,
                            "ci_u": 5.1,
                            "count": 11597
                        }
                    },
                    {
                        "name":"qn46",
                        "mental_health": {
                            "mean": 44.1,
                            "ci_l": 41.9,
                            "ci_u": 46.4,
                            "count": 4436
                        }
                    }
                ]
            }
        });
    });

    it("processYRBSReponses precomputed results with group by sex", function (){
        var yrbsresp = [
            {
                "results": [
                    {
                        "sex": "Female",
                        "ci_u": 0.5116,
                        "count": 2321,
                        "mean": 0.485,
                        "q_resp": true,
                        "method": "socrata",
                        "ci_l": 0.4581,
                        "q": "qn46"
                    },
                    {
                        "sex": "Total",
                        "ci_u": 0.4642,
                        "count": 4436,
                        "mean": 0.441,
                        "q_resp": true,
                        "method": "socrata",
                        "ci_l": 0.419,
                        "q": "qn46"
                    },
                    {
                        "sex": "Male",
                        "ci_u": 0.4317,
                        "count": 2088,
                        "mean": 0.399,
                        "q_resp": true,
                        "method": "socrata",
                        "ci_l": 0.3676,
                        "q": "qn46"
                    }
                ],
                "q": "qn46",
                "question": "Usually obtained the alcohol they drank by someone giving it to them",
                "vars": [
                    "sex"
                ],
                "response": true,
                "filter": {
                    "year": [
                        "2015"
                    ]
                },
                "precomputed": [],
                "var_levels": {
                    "sex": {
                        "responses": [
                            [
                                "1",
                                "Female"
                            ],
                            [
                                "2",
                                "Male"
                            ]
                        ],
                        "is_integer": true,
                        "question": "1=Female, 2=Male"
                    }
                },
                "is_socrata": true
            }
        ];

        var result = yrbs.processYRBSReponses(yrbsresp, true, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn46",
                        "mental_health": {
                            "mean": 44.1,
                            "ci_l": 41.9,
                            "ci_u": 46.4,
                            "count": 4436
                        },
                        sex:[
                            {   "name":"Female",
                                "mental_health": {
                                    "mean": 48.5,
                                    "ci_l": 45.8,
                                    "ci_u": 51.2,
                                    "count": 2321
                                }
                            },
                            {   "name":"Male",
                                "mental_health": {
                                    "mean": 39.9,
                                    "ci_l": 36.8,
                                    "ci_u": 43.2,
                                    "count": 2088
                                }
                            }
                        ]
                    }
                ]
            }
        });
    });

    it("processYRBSReponses precomputed results with filter by grade and sex and group by sex", function (){
        var yrbsresp = [
            {
                "results": [
                    {
                        "sex": "Female",
                        "ci_u": 0.5116,
                        "count": 2321,
                        "mean": 0.485,
                        "q_resp": true,
                        "method": "socrata",
                        "ci_l": 0.4581,
                        "q": "qn46"
                    }
                ],
                "q": "qn46",
                "question": "Usually obtained the alcohol they drank by someone giving it to them",
                "vars": [
                    "sex"
                ],
                "response": true,
                "filter": {
                    "year": [
                        "2015"
                    ],
                    "sex" : [ "Female"],
                    "grade" : ["11th"]

                },
                "precomputed": [],
                "var_levels": {
                    "sex": {
                        "responses": [
                            [
                                "1",
                                "Female"
                            ],
                            [
                                "2",
                                "Male"
                            ]
                        ],
                        "is_integer": true,
                        "question": "1=Female, 2=Male"
                    }
                },
                "is_socrata": true
            }
        ];

        var result = yrbs.processYRBSReponses(yrbsresp, true, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn46",
                        "mental_health": {
                            "mean": 48.5,
                            "ci_l": 45.8,
                            "ci_u": 51.2,
                            "count": 2321
                        },
                        sex:[
                            {   "name":"Female",
                                "mental_health": {
                                    "mean": 48.5,
                                    "ci_l": 45.8,
                                    "ci_u": 51.2,
                                    "count": 2321
                                }
                            }
                        ]
                    }
                ]
            }
        });
    });

    it("processYRBSReponses precomputed results with multiple groupings result nested in order Sex, race", function (){
        var yrbsresp = [{"results":[{"sex":"Female","ci_u":0.5116,"count":2321,"mean":0.485,"q_resp":true,"method":"socrata","ci_l":0.4581,"race":"Total","q":"qn46"},{"sex":"Male","ci_u":-1.0,"count":37,"mean":-1.0,"q_resp":true,"method":"socrata","ci_l":-1.0,"race":"Asian","q":"qn46"},{"sex":"Male","ci_u":0.527,"count":156,"mean":0.402,"q_resp":true,"method":"socrata","ci_l":0.2883,"race":"Black or African American","q":"qn46"},{"sex":"Female","ci_u":-1.0,"count":20,"mean":-1.0,"q_resp":true,"method":"socrata","ci_l":-1.0,"race":"American Indian or Alaska Native","q":"qn46"},{"sex":"Total","ci_u":-1.0,"count":25,"mean":-1.0,"q_resp":true,"method":"socrata","ci_l":-1.0,"race":"Native Hawaiian or Other Pacific Islander","q":"qn46"},{"sex":"Female","ci_u":0.5436,"count":1162,"mean":0.507,"q_resp":true,"method":"socrata","ci_l":0.4697,"race":"White","q":"qn46"},{"sex":"Female","ci_u":0.5485,"count":192,"mean":0.462,"q_resp":true,"method":"socrata","ci_l":0.3784,"race":"Black or African American","q":"qn46"},{"sex":"Male","ci_u":-1.0,"count":93,"mean":-1.0,"q_resp":true,"method":"socrata","ci_l":-1.0,"race":"Multiple Race","q":"qn46"},{"sex":"Female","ci_u":0.5456,"count":146,"mean":0.434,"q_resp":true,"method":"socrata","ci_l":0.3294,"race":"Multiple Race","q":"qn46"},{"sex":"Male","ci_u":-1.0,"count":21,"mean":-1.0,"q_resp":true,"method":"socrata","ci_l":-1.0,"race":"Native Hawaiian or Other Pacific Islander","q":"qn46"},{"sex":"Total","ci_u":0.5012,"count":241,"mean":0.407,"q_resp":true,"method":"socrata","ci_l":0.3197,"race":"Multiple Race","q":"qn46"},{"sex":"Total","ci_u":0.4642,"count":4436,"mean":0.441,"q_resp":true,"method":"socrata","ci_l":0.419,"race":"Total","q":"qn46"},{"sex":"Male","ci_u":0.4701,"count":1025,"mean":0.416,"q_resp":true,"method":"socrata","ci_l":0.3631,"race":"White","q":"qn46"},{"sex":"Female","ci_u":-1.0,"count":37,"mean":-1.0,"q_resp":true,"method":"socrata","ci_l":-1.0,"race":"Asian","q":"qn46"},{"sex":"Male","ci_u":-1.0,"count":36,"mean":-1.0,"q_resp":true,"method":"socrata","ci_l":-1.0,"race":"American Indian or Alaska Native","q":"qn46"},{"sex":"Total","ci_u":0.5127,"count":349,"mean":0.433,"q_resp":true,"method":"socrata","ci_l":0.3573,"race":"Black or African American","q":"qn46"},{"sex":"Female","ci_u":0.5026,"count":737,"mean":0.459,"q_resp":true,"method":"socrata","ci_l":0.4167,"race":"Hispanic or Latino","q":"qn46"},{"sex":"Female","ci_u":-1.0,"count":2,"mean":-1.0,"q_resp":true,"method":"socrata","ci_l":-1.0,"race":"Native Hawaiian or Other Pacific Islander","q":"qn46"},{"sex":"Male","ci_u":0.4317,"count":2088,"mean":0.399,"q_resp":true,"method":"socrata","ci_l":0.3676,"race":"Total","q":"qn46"},{"sex":"Total","ci_u":0.448,"count":1422,"mean":0.413,"q_resp":true,"method":"socrata","ci_l":0.3798,"race":"Hispanic or Latino","q":"qn46"},{"sex":"Male","ci_u":0.4138,"count":681,"mean":0.365,"q_resp":true,"method":"socrata","ci_l":0.3186,"race":"Hispanic or Latino","q":"qn46"},{"sex":"Total","ci_u":-1.0,"count":74,"mean":-1.0,"q_resp":true,"method":"socrata","ci_l":-1.0,"race":"Asian","q":"qn46"},{"sex":"Total","ci_u":0.4947,"count":2193,"mean":0.461,"q_resp":true,"method":"socrata","ci_l":0.4284,"race":"White","q":"qn46"},{"sex":"Total","ci_u":-1.0,"count":57,"mean":-1.0,"q_resp":true,"method":"socrata","ci_l":-1.0,"race":"American Indian or Alaska Native","q":"qn46"}],"q":"qn46","question":"Usually obtained the alcohol they drank by someone giving it to them","vars":["sex","race"],"response":true,"filter":{"year":["2015"]},"precomputed":[],"var_levels":{"race":{"responses":[["1","Am Indian \/ Alaska Native"],["2","Asian"],["3","Black or African American"],["4","Hispanic\/Latino"],["5","Native Hawaiian\/other PI"],["6","White"],["7","Multiple - Non-Hispanic"]],"is_integer":true,"question":"7-level race variable"},"sex":{"responses":[["1","Female"],["2","Male"]],"is_integer":true,"question":"1=Female, 2=Male"}},"is_socrata":true}];
        var result = yrbs.processYRBSReponses(yrbsresp,true, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn46",
                        "mental_health": {
                            "mean": "44.1",
                            "ci_l": "41.9",
                            "ci_u": "46.4",
                            "count": 4436
                        },
                        "sex":[
                            {
                                "name":"Male",
                                "race":[
                                    {
                                    "name":"Asian",
                                    "mental_health": {
                                        "mean": "0",
                                        "ci_l": "0",
                                        "ci_u": "0",
                                        "count": 37
                                    }
                                    },

                                    {
                                        "name":"Black or African American",
                                        "mental_health": {
                                            "mean": "40.2",
                                            "ci_l": "28.8",
                                            "ci_u": "52.7",
                                            "count": 156
                                        }
                                    },
                                    {
                                        "name":"Multiple Race",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 93
                                        }
                                    },
                                    {
                                        "name":"Native Hawaiian or Other Pacific Islander",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 21
                                        }
                                    },
                                    {
                                        "name":"White",
                                        "mental_health": {
                                            "mean": "41.6",
                                            "ci_l": "36.3",
                                            "ci_u": "47.0",
                                            "count": 1025
                                        }
                                    },
                                    {
                                        "name":"American Indian or Alaska Native",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 36
                                        }
                                    },
                                    {
                                        "name":"Hispanic or Latino",
                                        "mental_health": {
                                            "mean": "36.5",
                                            "ci_l": "31.9",
                                            "ci_u": "41.4",
                                            "count": 681
                                        }
                                    }
                                ]
                            },
                            {
                                "name":"Female",
                                "race":[
                                    {
                                        "name":"American Indian or Alaska Native",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 20
                                        }
                                    },
                                    {
                                        "name":"White",
                                        "mental_health": {
                                            "mean": "50.7",
                                            "ci_l": "47.0",
                                            "ci_u": "54.4",
                                            "count": 1162
                                        }
                                    },
                                    {
                                        "name":"Black or African American",
                                        "mental_health": {
                                            "mean": "46.2",
                                            "ci_l": "37.8",
                                            "ci_u": "54.9",
                                            "count": 192
                                        }
                                    },
                                    {
                                        "name":"Multiple Race",
                                        "mental_health": {
                                            "mean": "43.4",
                                            "ci_l": "32.9",
                                            "ci_u": "54.6",
                                            "count": 146
                                        }
                                    },
                                    {
                                        "name":"Asian",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 37
                                        }
                                    },
                                    {
                                        "name":"Hispanic or Latino",
                                        "mental_health": {
                                            "mean": "45.9",
                                            "ci_l": "41.7",
                                            "ci_u": "50.3",
                                            "count": 737
                                        }
                                    },
                                    {
                                        "name":"Native Hawaiian or Other Pacific Islander",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 2
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    });

    it("processYRBSReponses with multiple groupings result nested in order Sex, race", function (){
        var yrbsresp = [{"q":"qn41","results":[{"mean":0.6325,"level":0,"se":0.013,"ci_u":0.6584,"count":15049.0,"ci_l":0.6058},{"sex":"Female","q_resp":true,"level":2,"q":"qn41","se":0.073,"race":"Am Indian \/ Alaska Native","mean":0.6174,"ci_l":0.4551,"count":63.0,"ci_u":0.7572},{"sex":"Male","q_resp":true,"level":2,"q":"qn41","se":0.0678,"race":"Am Indian \/ Alaska Native","mean":0.7752,"ci_l":0.6081,"count":92.0,"ci_u":0.8846},{"sex":"Female","q_resp":true,"level":2,"q":"qn41","se":0.0372,"race":"Asian","mean":0.4449,"ci_l":0.3704,"count":302.0,"ci_u":0.522},{"sex":"Male","q_resp":true,"level":2,"q":"qn41","se":0.0371,"race":"Asian","mean":0.4212,"ci_l":0.3477,"count":308.0,"ci_u":0.4984},{"sex":"Female","q_resp":true,"level":2,"q":"qn41","se":0.0326,"race":"Black or African American","mean":0.579,"ci_l":0.5115,"count":776.0,"ci_u":0.6436},{"sex":"Male","q_resp":true,"level":2,"q":"qn41","se":0.0308,"race":"Black or African American","mean":0.5103,"ci_l":0.4479,"count":776.0,"ci_u":0.5723},{"sex":"Female","q_resp":true,"level":2,"q":"qn41","se":0.0177,"race":"Hispanic \/ Latino","mean":0.6521,"ci_l":0.6149,"count":1150.0,"ci_u":0.6875},{"sex":"Male","q_resp":true,"level":2,"q":"qn41","se":0.0257,"race":"Hispanic \/ Latino","mean":0.6087,"ci_l":0.5553,"count":1134.0,"ci_u":0.6597},{"sex":"Female","q_resp":true,"level":2,"q":"qn41","se":0.0182,"race":"Multiple - Hispanic","mean":0.7141,"ci_l":0.6759,"count":1323.0,"ci_u":0.7495},{"sex":"Male","q_resp":true,"level":2,"q":"qn41","se":0.0157,"race":"Multiple - Hispanic","mean":0.6546,"ci_l":0.6223,"count":1296.0,"ci_u":0.6856},{"sex":"Female","q_resp":true,"level":2,"q":"qn41","se":0.0333,"race":"Multiple - Non-Hispanic","mean":0.7523,"ci_l":0.6788,"count":376.0,"ci_u":0.8135},{"sex":"Male","q_resp":true,"level":2,"q":"qn41","se":0.0356,"race":"Multiple - Non-Hispanic","mean":0.6618,"ci_l":0.5863,"count":331.0,"ci_u":0.7298},{"sex":"Female","q_resp":true,"level":2,"q":"qn41","se":0.1282,"race":"Native Hawaiian\/other PI","mean":0.3912,"ci_l":0.1525,"count":22.0,"ci_u":0.6965},{"sex":"Male","q_resp":true,"level":2,"q":"qn41","se":0.0587,"race":"Native Hawaiian\/other PI","mean":0.73,"ci_l":0.5927,"count":71.0,"ci_u":0.834},{"sex":"Female","q_resp":true,"level":2,"q":"qn41","se":0.0295,"race":"White","mean":0.6672,"ci_l":0.6051,"count":3386.0,"ci_u":0.7239},{"sex":"Male","q_resp":true,"level":2,"q":"qn41","se":0.0151,"race":"White","mean":0.6402,"ci_l":0.6092,"count":3266.0,"ci_u":0.67}],"response":true,"question":"Ever drank alcohol","var_levels":{"sex":{"question":"What is your sex","responses":[["1","Female"],["2","Male"]]},"race":{"question":"Race\/Ethnicity","responses":[["1","Am Indian \/ Alaska Native"],["2","Asian"],["3","Black or African American"],["4","Native Hawaiian\/other PI"],["5","White"],["6","Hispanic \/ Latino"],["7","Multiple - Hispanic"],["8","Multiple - Non-Hispanic"]]}},"vars":["race","sex"]}];
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn41",
                        "mental_health": {
                            "mean": "63.2",
                            "ci_l": "60.6",
                            "ci_u": "65.8",
                            "count": 15049
                        },
                        "sex":[

                            {
                                "name":"Female",
                                "race":[
                                    {
                                        "name":"Am Indian / Alaska Native",
                                        "mental_health": {
                                            "mean": "61.7",
                                            "ci_l": "45.5",
                                            "ci_u": "75.7",
                                            "count": 63
                                        }
                                    },
                                    {
                                        "name":"Asian",
                                        "mental_health": {
                                            "mean": "44.5",
                                            "ci_l": "37.0",
                                            "ci_u": "52.2",
                                            "count": 302
                                        }
                                    },
                                    {
                                        "name":"Black or African American",
                                        "mental_health": {
                                            "mean": "57.9",
                                            "ci_l": "51.1",
                                            "ci_u": "64.4",
                                            "count": 776
                                        }
                                    },
                                    {
                                        "name":"Hispanic / Latino",
                                        "mental_health": {
                                            "mean": "65.2",
                                            "ci_l": "61.5",
                                            "ci_u": "68.8",
                                            "count": 1150
                                        }
                                    },
                                    {
                                        "name":"Multiple - Hispanic",
                                        "mental_health": {
                                            "mean": "71.4",
                                            "ci_l": "67.6",
                                            "ci_u": "75.0",
                                            "count": 1323
                                        }
                                    },
                                    {
                                        "name":"Multiple - Non-Hispanic",
                                        "mental_health": {
                                            "mean": "75.2",
                                            "ci_l": "67.9",
                                            "ci_u": "81.3",
                                            "count": 376
                                        }
                                    },
                                    {
                                        "name":"Native Hawaiian/other PI",
                                        "mental_health": {
                                            "mean": "39.1",
                                            "ci_l": "15.3",
                                            "ci_u": "69.7",
                                            "count": 22
                                        }
                                    },
                                    {
                                        "name":"White",
                                        "mental_health": {
                                            "mean": "66.7",
                                            "ci_l": "60.5",
                                            "ci_u": "72.4",
                                            "count": 3386
                                        }
                                    }
                                ]
                            },
                            {
                                "name":"Male",
                                "race":[
                                    {
                                        "name":"Am Indian / Alaska Native",
                                        "mental_health": {
                                            "mean": "77.5",
                                            "ci_l": "60.8",
                                            "ci_u": "88.5",
                                            "count": 92
                                        }
                                    },
                                    {
                                        "name":"Asian",
                                        "mental_health": {
                                            "mean": "42.1",
                                            "ci_l": "34.8",
                                            "ci_u": "49.8",
                                            "count": 308
                                        }
                                    },
                                    {
                                        "name":"Black or African American",
                                        "mental_health": {
                                            "mean": "51.0",
                                            "ci_l": "44.8",
                                            "ci_u": "57.2",
                                            "count": 776
                                        }
                                    },
                                    {
                                        "name":"Hispanic / Latino",
                                        "mental_health": {
                                            "mean": "60.9",
                                            "ci_l": "55.5",
                                            "ci_u": "66.0",
                                            "count": 1134
                                        }
                                    },
                                    {
                                        "name":"Multiple - Hispanic",
                                        "mental_health": {
                                            "mean": "65.5",
                                            "ci_l": "62.2",
                                            "ci_u": "68.6",
                                            "count": 1296
                                        }
                                    },
                                    {
                                        "name":"Multiple - Non-Hispanic",
                                        "mental_health": {
                                            "mean": "66.2",
                                            "ci_l": "58.6",
                                            "ci_u": "73.0",
                                            "count": 331
                                        }
                                    },
                                    {
                                        "name":"Native Hawaiian/other PI",
                                        "mental_health": {
                                            "mean": "73.0",
                                            "ci_l": "59.3",
                                            "ci_u": "83.4",
                                            "count": 71
                                        }
                                    },
                                    {
                                        "name":"White",
                                        "mental_health": {
                                            "mean": "64.0",
                                            "ci_l": "60.9",
                                            "ci_u": "67.0",
                                            "count": 3266
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    });

    it("processYRBSReponses with groupings for Sex, sexpart", function (){
        var yrbsresp = [{"q":"qn8","results":[{"mean":0.6325,"level":0,"se":0.013,"ci_u":0.6584,"count":15049,"ci_l":0.6058},{"sex":"Female","q_resp":true,"level":2,"q":"qn8","se":0.073,"sexpart":"Opposite sex only","mean":0.6174,"ci_l":0.4551,"count":63,"ci_u":0.7572},{"sex":"Male","q_resp":true,"level":2,"q":"qn8","se":0.0678,"sexpart":"Opposite sex only","mean":0.7752,"ci_l":0.6081,"count":92,"ci_u":0.8846},{"sex":"Female","q_resp":true,"level":2,"q":"qn8","se":0.0372,"sexpart":"Same sex only","mean":0.4449,"ci_l":0.3704,"count":302,"ci_u":0.522},{"sex":"Male","q_resp":true,"level":2,"q":"qn8","se":0.0371,"sexpart":"Same sex only","mean":0.4212,"ci_l":0.3477,"count":308,"ci_u":0.4984}],"response":true,"question":"Ever drank alcohol","var_levels":{"sex":{"question":"What is your sex","responses":[["1","Female"],["2","Male"]]},"sexpart":{"question":"Sex of sex contact(s)","responses":[["1","Opposite sex only"],["2","Same sex only"]]}},"vars":["sexpart","sex"]}];
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn8",
                        "mental_health": {
                            "mean": "63.2",
                            "ci_l": "60.6",
                            "ci_u": "65.8",
                            "count": 15049
                        },
                        "sex":[

                            {
                                "name":"Female",
                                "sexpart":[
                                    {
                                        "name":"Opposite sex only",
                                        "mental_health": {
                                            "mean": "61.7",
                                            "ci_l": "45.5",
                                            "ci_u": "75.7",
                                            "count": 63
                                        }
                                    },
                                    {
                                        "name":"Same sex only",
                                        "mental_health": {
                                            "mean": "44.5",
                                            "ci_l": "37.0",
                                            "ci_u": "52.2",
                                            "count": 302
                                        }
                                    }
                                ]
                            },
                            {
                                "name":"Male",
                                "sexpart":[
                                    {
                                        "name":"Opposite sex only",
                                        "mental_health": {
                                            "mean": "77.5",
                                            "ci_l": "60.8",
                                            "ci_u": "88.5",
                                            "count": 92
                                        }
                                    },
                                    {
                                        "name":"Same sex only",
                                        "mental_health": {
                                            "mean": "42.1",
                                            "ci_l": "34.8",
                                            "ci_u": "49.8",
                                            "count": 308
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    });

    it("processYRBSReponses with groupings for Sex, sexid", function (){
        var yrbsresp = [{"q":"qn8","results":[{"mean":0.6325,"level":0,"se":0.013,"ci_u":0.6584,"count":15049,"ci_l":0.6058},{"sex":"Female","q_resp":true,"level":2,"q":"qn8","se":0.073,"sexid":"Heterosexual","mean":0.6174,"ci_l":0.4551,"count":63,"ci_u":0.7572},{"sex":"Male","q_resp":true,"level":2,"q":"qn8","se":0.0678,"sexid":"Heterosexual","mean":0.7752,"ci_l":0.6081,"count":92,"ci_u":0.8846},{"sex":"Female","q_resp":true,"level":2,"q":"qn8","se":0.0372,"sexid":"Bisexual","mean":0.4449,"ci_l":0.3704,"count":302,"ci_u":0.522},{"sex":"Male","q_resp":true,"level":2,"q":"qn8","se":0.0371,"sexid":"Bisexual","mean":0.4212,"ci_l":0.3477,"count":308,"ci_u":0.4984}],"response":true,"question":"Ever drank alcohol","var_levels":{"sex":{"question":"What is your sex","responses":[["1","Female"],["2","Male"]]},"sexpart":{"question":"Sexual identity","responses":[["1","Heterosexual"],["2","Bisexual"]]}},"vars":["sexpart","sex"]}];
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'mental_health');
        expect(result).to.eql( {
            "table":{
                "question":[
                    {
                        "name":"qn8",
                        "mental_health": {
                            "mean": "63.2",
                            "ci_l": "60.6",
                            "ci_u": "65.8",
                            "count": 15049
                        },
                        "sex":[
                            {
                                "name":"Female",
                                "sexid":[
                                    {
                                        "name":"Heterosexual",
                                        "mental_health": {
                                            "mean": "61.7",
                                            "ci_l": "45.5",
                                            "ci_u": "75.7",
                                            "count": 63
                                        }
                                    },
                                    {
                                        "name":"Bisexual",
                                        "mental_health": {
                                            "mean": "44.5",
                                            "ci_l": "37.0",
                                            "ci_u": "52.2",
                                            "count": 302
                                        }
                                    }
                                ]
                            },
                            {
                                "name":"Male",
                                "sexid":[
                                    {
                                        "name":"Heterosexual",
                                        "mental_health": {
                                            "mean": "77.5",
                                            "ci_l": "60.8",
                                            "ci_u": "88.5",
                                            "count": 92
                                        }
                                    },
                                    {
                                        "name":"Bisexual",
                                        "mental_health": {
                                            "mean": "42.1",
                                            "ci_l": "34.8",
                                            "ci_u": "49.8",
                                            "count": 308
                                        }
                                    }
                                ]
                            }
                        ]
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
            expect(q0.mental_health).to.eql({"mean":"87.4","ci_l":"86.5","ci_u":"88.3","count":121103});
            expect(q1.mental_health).to.eql({"mean":"14.2","ci_l":"13.4","ci_u":"15.1","count":186154});
            var sex = sortByKey(q0.sex,'name',true);
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
            expect(resp).to.eql( {"table":{"question":[{"name":"qn8","mental_health":{"mean":"87.4","ci_l":"86.5","ci_u":"88.3","count":121103}}]}} );
        });
    });

    it("invokeYRBS service with grouping and filtering", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'race':{value:['White', 'Black or African American']},'sex':{value:['Female']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            expect(q0.mental_health).to.eql({"mean":"86.1","ci_l":"84.9","ci_u":"87.3","count":35384});
            expect(q0.sex.length).to.eql(1);
            expect(q0.sex[0].name).to.eql("Female");
            var race = sortByKey(q0.sex[0].race, 'name', true);
            expect(race).to.eql([{"name":"Black or African American","mental_health":{"mean":"92.9","ci_l":"91.5","ci_u":"94.0","count":11670}},{"name":"White","mental_health":{"mean":"84.8","ci_l":"83.4","ci_u":"86.1","count":23714}}]);
        });
    });

    it("invokeYRBS state service with grouping and filtering", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsState","queryKey":"sitecode","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'race':{value:['White', 'Black or African American']},'sitecode':{value:['VA','MO']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            expect(q0.mental_health).to.eql({"mean":"86.4","ci_l":"84.7","ci_u":"87.9","count":16512});
            var race = sortByKey(q0.race,'name',true);
            expect(race[0].name).to.eql("Black or African American");
            expect(race[1].name).to.eql("White");
            var b = sortByKey(race[0].sitecode, 'name', true);
            expect(b).to.eql([{"name":"MO","mental_health":{"mean":"92.8","ci_l":"90.2","ci_u":"94.7","count":1395}},{"name":"VA","mental_health":{"mean":"91.1","ci_l":"88.7","ci_u":"93.1","count":2031}}]);
            var w = sortByKey(race[1].sitecode, 'name', true);
            expect(w).to.eql([{"name":"MO","mental_health":{"mean":"87.8","ci_l":"85.1","ci_u":"90.1","count":8483}},{"name":"VA","mental_health":{"mean":"77.6","ci_l":"74.7","ci_u":"80.3","count":4603}}]);
        });
    });

    it("invokeYRBS service for precomputed results", function (){
        var apiQuery = {'searchFor': 'mental_health', 'yrbsBasic': true, 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'year':{value:['2015']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            expect(resp).to.eql( {"table":{"question":[{"name":"qn8","mental_health":{"mean":"81.4","ci_l":"77.0","ci_u":"85.1","count":8757}}]}} );
        });
    });

    it("invokeYRBS service for precomputed results with grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'yrbsBasic': true, 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'year':{value:['2015']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            expect(resp).to.eql( {"table":{"question":[{"name":"qn8","mental_health":{"mean":"81.4","ci_l":"77.0","ci_u":"85.1","count":8757}, sex:[{"name":"Female","mental_health":{"mean":"80.1","ci_l":"75.2","ci_u":"84.3","count":3951}},{"name":"Male","mental_health":{"mean":"82.4","ci_l":"78.2","ci_u":"86.0","count":4769}}]}]}} );
        });
    });


    it("getQuestionsTreeByYears from yrbs service using 'All'", function (){
        return yrbs.getQuestionsTreeByYears(["All"]).then(function (response) {
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

    it("getQuestionsTreeByYears from yrbs service by year", function (){
        return yrbs.getQuestionsTreeByYears(["2015"]).then(function (response) {
            expect(response.questionTree[7].text).to.eql("Unintentional Injuries and Violence");
            expect(response.questionTree[6].text).to.eql("Tobacco Use");
            expect(response.questionTree[0].text).to.eql("Alcohol and Other Drug Use");
            expect(response.questionTree[5].text).to.eql("Sexual Behaviors");
            expect(response.questionTree[2].text).to.eql("Obesity, Overweight, and Weight Control");
            expect(response.questionTree[1].text).to.eql("Dietary Behaviors");
            expect(response.questionTree[4].text).to.eql("Physical Activity");
            expect(response.questionTree[3].text).to.eql("Other Health Topics");
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
