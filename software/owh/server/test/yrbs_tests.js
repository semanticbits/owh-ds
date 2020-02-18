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

    it("buildYRBSQueries with grouping yrbss", function (){
        var apiQuery = { basicSearch:true, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn1&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn2&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn3&v=sex,race']);

        apiQuery.basicSearch = false;
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=0&q=qn1&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&s=0&q=qn2&v=sex,race',config.yrbs.queryUrl+'?d=yrbss&s=0&q=qn3&v=sex,race']);
    });

    it("buildYRBSQueries with grouping param for basic query", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'prams', 'yrbsBasic': true, 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams&s=1&q=qn1&v=sex,race',config.yrbs.queryUrl+'?d=prams&s=1&q=qn2&v=sex,race',config.yrbs.queryUrl+'?d=prams&s=1&q=qn3&v=sex,race']);

    });

    it("buildYRBSQueries with all grouping yrbss", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsGrade","queryKey":"grade","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn1&v=sex,grade,race',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn2&v=sex,grade,race',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn3&v=sex,grade,race']);

    });

    it("buildYRBSQueries with no grouping yrbss", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn1',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn2',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn3']);

    });

    it("buildYRBSQueries with only filtering yrbss", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'race':{value:['White', 'Black or African American']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn1&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn2&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn3&f=race:White,Black or African American']);

    });


    it("buildYRBSQueries with grouping and filtering yrbss", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'race':{value:['White', 'Black or African American']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn1&v=race&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn2&v=race&f=race:White,Black or African American',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn3&v=race&f=race:White,Black or African American']);

    });

    it("buildYRBSQueries with multiple grouping and filtering yrbss", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'race':{value:['White', 'Black or African American']},'sex':{value:['Female']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn1&v=sex,race&f=race:White,Black or African American|sex:Female',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn2&v=sex,race&f=race:White,Black or African American|sex:Female',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn3&v=sex,race&f=race:White,Black or African American|sex:Female']);

    });

    it("buildYRBSQueries with state grouping", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsState","queryKey":"sitecode","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn1&v=race,sitecode',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn2&v=race,sitecode',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn3&v=race,sitecode']);

    });

    it("buildYRBSQueries with state filtering", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'sitecode':{'value':['AL', 'MN']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn1&v=race&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn2&v=race&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn3&v=race&f=sitecode:AL,MN']);

    });

    it("buildYRBSQueries with state filtering and grouping", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsState","queryKey":"sitecode","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn1', 'qn2', 'qn3']}, 'sitecode':{'value':['AL', 'MN']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn1&v=race,sitecode&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn2&v=race,sitecode&f=sitecode:AL,MN',config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn3&v=race,sitecode&f=sitecode:AL,MN']);

    });

    it("buildYRBSQueries with sexid filtering and grouping", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},
            {"key":"sexid","queryKey":"sexid","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'sexid':{'value':['Bisexual', 'Heterosexual']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=1&q=qn8&v=sexid&f=sexid:Bisexual,Heterosexual']);

    });

    it("buildYRBSQueries with group by birth_weight for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year",
            "value":["2014"],"primary":false}, "question.path":{"key":"question","queryKey":"question.key",
                "value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"adequacy","queryKey":"prenatal_care","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=prenatal_care&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=prenatal_care&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=prenatal_care&f=year:2014']);
    });

    it("buildYRBSQueries with group by birth_weight for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"state","queryKey":"sitecode","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=sitecode&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=sitecode&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=sitecode&f=year:2014']);
    });

    it("buildYRBSQueries with group by year for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"year","queryKey":"year","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=year&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=year&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=year&f=year:2014']);
    });

    it("buildYRBSQueries with group by year for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"year","queryKey":"year","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=year&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=year&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=year&f=year:2014']);
    });

    it("buildYRBSQueries with group by wic_during_preg for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"wic_during_preg","queryKey":"wic_during_preg","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=wic_during_preg&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=wic_during_preg&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=wic_during_preg&f=year:2014']);
    });

    it("buildYRBSQueries with group by smoked_last_tri for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"smoked_last_tri","queryKey":"smoked_last_tri","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=smoked_last_tri&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=smoked_last_tri&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=smoked_last_tri&f=year:2014']);
    });

    it("buildYRBSQueries with group by smoked_3mo_pre_preg for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"smoked_3mo_pre_preg","queryKey":"smoked_3mo_pre_preg","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=smoked_3mo_pre_preg&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=smoked_3mo_pre_preg&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=smoked_3mo_pre_preg&f=year:2014']);
    });

    it("buildYRBSQueries with group by prev_live_births for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"prev_live_births","queryKey":"prev_live_births","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=prev_live_births&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=prev_live_births&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=prev_live_births&f=year:2014']);
    });

    it("buildYRBSQueries with group by preg_intend for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"preg_intend","queryKey":"preg_intend","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=preg_intend&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=preg_intend&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=preg_intend&f=year:2014']);
    });

    it("buildYRBSQueries with group by mother_hispanic for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"mother_hispanic","queryKey":"mother_hispanic","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=mother_hispanic&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=mother_hispanic&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=mother_hispanic&f=year:2014']);
    });

    it("buildYRBSQueries with group by medicaid_recip for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"medicaid_recip","queryKey":"medicaid_recip","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=medicaid_recip&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=medicaid_recip&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=medicaid_recip&f=year:2014']);
    });

    it("buildYRBSQueries with group by medicaid_recip for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"medicaid_recip","queryKey":"medicaid_recip","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=medicaid_recip&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=medicaid_recip&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=medicaid_recip&f=year:2014']);
    });

    it("buildYRBSQueries with group by maternal_race for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"maternal_race","queryKey":"maternal_race","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=maternal_race&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=maternal_race&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=maternal_race&f=year:2014']);
    });

    it("buildYRBSQueries with group by maternal_race for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"maternal_race","queryKey":"maternal_race","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=maternal_race&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=maternal_race&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=maternal_race&f=year:2014']);
    });

    it("buildYRBSQueries with group by maternal_education for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"maternal_education","queryKey":"maternal_education","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=maternal_education&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=maternal_education&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=maternal_education&f=year:2014']);
    });

    it("buildYRBSQueries with group by maternal_age_4lvl for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"maternal_age_4lvl","queryKey":"maternal_age_4lvl","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=maternal_age_4lvl&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=maternal_age_4lvl&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=maternal_age_4lvl&f=year:2014']);
    });

    it("buildYRBSQueries with group by maternal_age_3lvl for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"maternal_age_3lvl","queryKey":"maternal_age_3lvl","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=maternal_age_3lvl&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=maternal_age_3lvl&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=maternal_age_3lvl&f=year:2014']);
    });

    it("buildYRBSQueries with group by maternal_age_18to44grp for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"maternal_age_18to44grp","queryKey":"maternal_age_18to44grp","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=maternal_age_18to44grp&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=maternal_age_18to44grp&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=maternal_age_18to44grp&f=year:2014']);
    });

    it("buildYRBSQueries with group by maternal_age_18to44 for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"maternal_age_18to44","queryKey":"maternal_age_18to44","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=maternal_age_18to44&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=maternal_age_18to44&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=maternal_age_18to44&f=year:2014']);
    });

    it("buildYRBSQueries with group by marital_status for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"marital_status","queryKey":"marital_status","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=marital_status&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=marital_status&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=marital_status&f=year:2014']);
    });

    it("buildYRBSQueries with group by birth_weight for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"birth_weight","queryKey":"birth_weight","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=birth_weight&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=birth_weight&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=birth_weight&f=year:2014']);
    });

    it("buildYRBSQueries with group by income for prams advance query", function (){
        var apiQuery = {"searchFor":"prams","query":{"year":{"key":"year","queryKey":"year","value":["2014"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["pd_comp","nohosp_b","nohosp_m"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"income","queryKey":"income","size":0}]}},"pagination":{"from":0,"size":10000}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=pd_comp&v=income&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_b&v=income&f=year:2014',config.yrbs.queryUrl+'?d=prams_p2011&s=0&q=nohosp_m&v=income&f=year:2014']);
    });

    it("buildYRBSQueries with age_group filtering and grouping", function (){
        var apiQuery = {
            basicSearch:true,
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
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=brfss_pre2011&s=1&q=DRNKANY5&f=year:2015|age_group:Age 18-24']);
    });

    it("buildYRBSQueries with gender filtering and grouping", function (){
        var apiQuery = {
            basicSearch:false,
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
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=brfss&s=0&q=DRNKANY5&f=year:2015|gender:Male']);
    });

    it("buildYRBSQueries with education filtering and grouping", function (){
        var apiQuery = {
            basicSearch:false,
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
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=brfss&s=0&q=DRNKANY5&v=education&f=year:2015|education:Less than H.S.']);
    });

    it("buildYRBSQueries with income filtering and grouping", function (){
        var apiQuery = {
            basicSearch:false,
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
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=brfss&s=0&q=DRNKANY5&v=income&f=year:2015|income:Less than $15,000']);
    });

    it("buildYRBSQueries with year filtering and grouping", function (){
        var apiQuery = {basicSearch:false, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},
            {"key":"year","queryKey":"year","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'year':{'value':['2015', '2014']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=0&q=qn8&v=year&f=year:2015,2014']);

    });

    it("buildYRBSQueries with sexpart filtering and grouping", function (){
        var apiQuery = {basicSearch:false, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},
            {"key":"sexpart","queryKey":"sexpart","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'sexpart':{'value':['Both Sexes', 'Same sex only']}}};
        var result = yrbs.buildYRBSQueries(apiQuery);
        expect(result).to.eql( [config.yrbs.queryUrl+'?d=yrbss&s=0&q=qn8&v=sexpart&f=sexpart:Both Sexes,Same sex only']);

    });

    it("processYRBSReponses for group by birth_weight", function (){
        var resp = [{"error":null,"q":"pd_comp","filter":{"year":["2014"],"sitecode":["MN","ME","NY","WI","HI","NM","GA","AK","MO","AL","MI","NH","VT","UT","IL","AR","MD","TN","YC","RI","PA","CT","NJ","OK","WA","NE","OR","WV","MA","IA","OH","CO","DE","WY"]},"question":"pd_comp","vars":["birth_weight"],"results":[{"birth_weight":"LBW","mean":0.9713,"se":0.0054,"ci_l":0.9559,"ci_u":0.9815,"count":4866,"sample_size":5017,"response":"No","level":1},{"birth_weight":"NBW","mean":0.9747,"se":0.0125,"ci_l":0.9228,"ci_u":0.992,"count":938,"sample_size":958,"response":"No","level":1},{"ci_l":0.9558,"ci_u":0.9819,"count":5806,"level":0,"mean":0.9716,"response":"No","sample_size":5977,"se":0.0056,"birth_weight":"Total"},{"birth_weight":"LBW","mean":0.0287,"se":0.0054,"ci_l":0.0185,"ci_u":0.0441,"count":151,"sample_size":5017,"response":"Yes","level":1},{"birth_weight":"NBW","mean":0.0253,"se":0.0125,"ci_l":0.008,"ci_u":0.0772,"count":20,"sample_size":958,"response":"Yes","level":1},{"ci_l":0.0181,"ci_u":0.0442,"count":171,"level":0,"mean":0.0284,"response":"Yes","sample_size":5977,"se":0.0056,"birth_weight":"Total"}]}]
        var result = yrbs.processYRBSReponses(resp, false, 'prams');
        expect(JSON.stringify(result)).to.eql( '{"table":{"question":[{"name":"pd_comp","No":{"birth_weight":[{"name":"LBW","prams":{"mean":"97.1","ci_l":"95.6","ci_u":"98.2","count":4866,"sampleSize":5017,"se":0.0054}},{"name":"NBW","prams":{"mean":"97.5","ci_l":"92.3","ci_u":"99.2","count":938,"sampleSize":958,"se":0.0125}}],"prams":{"mean":"97.2","ci_l":"95.6","ci_u":"98.2","count":5806,"sampleSize":5977,"se":0.0056}},"Yes":{"birth_weight":[{"name":"LBW","prams":{"mean":"2.9","ci_l":"1.9","ci_u":"4.4","count":151,"sampleSize":5017,"se":0.0054}},{"name":"NBW","prams":{"mean":"2.5","ci_l":"0.8","ci_u":"7.7","count":20,"sampleSize":958,"se":0.0125}}],"prams":{"mean":"2.8","ci_l":"1.8","ci_u":"4.4","count":171,"sampleSize":5977,"se":0.0056}}}]}}');
    });

    it("processYRBSReponses for group by marital_status", function (){
        var resp = [{"error":null,"q":"pd_comp","filter":{"year":["2014"],"sitecode":["MN","ME","NY","WI","HI","NM","GA","AK","MO","AL","MI","NH","VT","UT","IL","AR","MD","TN","YC","RI","PA","CT","NJ","OK","WA","NE","OR","WV","MA","IA","OH","CO","DE","WY"]},"question":"pd_comp","vars":["marital_status"],"results":[{"marital_status":"married","mean":0.9609,"se":0.0054,"ci_l":0.9468,"ci_u":0.9713,"count":3512.0,"sample_size":3660.0,"response":"No","level":1},{"marital_status":"other","mean":0.9886,"se":0.004,"ci_l":0.975,"ci_u":0.9948,"count":2284.0,"sample_size":2307.0,"response":"No","level":1},{"ci_l":0.9558,"ci_u":0.9819,"count":5806.0,"level":0,"mean":0.9716,"response":"No","sample_size":5977.0,"se":0.0056,"marital_status":"Total"},{"marital_status":"married","mean":0.0391,"se":0.0054,"ci_l":0.0287,"ci_u":0.0532,"count":148.0,"sample_size":3660.0,"response":"Yes","level":1},{"marital_status":"other","mean":0.0114,"se":0.004,"ci_l":0.0052,"ci_u":0.025,"count":23.0,"sample_size":2307.0,"response":"Yes","level":1},{"ci_l":0.0181,"ci_u":0.0442,"count":171.0,"level":0,"mean":0.0284,"response":"Yes","sample_size":5977.0,"se":0.0056,"marital_status":"Total"}]}]
        var result = yrbs.processYRBSReponses(resp, false, 'prams');
        expect(JSON.stringify(result)).to.eql( '{"table":{"question":[{"name":"pd_comp","No":{"marital_status":[{"name":"married","prams":{"mean":"96.1","ci_l":"94.7","ci_u":"97.1","count":3512,"sampleSize":3660,"se":0.0054}},{"name":"other","prams":{"mean":"98.9","ci_l":"97.5","ci_u":"99.5","count":2284,"sampleSize":2307,"se":0.004}}],"prams":{"mean":"97.2","ci_l":"95.6","ci_u":"98.2","count":5806,"sampleSize":5977,"se":0.0056}},"Yes":{"marital_status":[{"name":"married","prams":{"mean":"3.9","ci_l":"2.9","ci_u":"5.3","count":148,"sampleSize":3660,"se":0.0054}},{"name":"other","prams":{"mean":"1.1","ci_l":"0.5","ci_u":"2.5","count":23,"sampleSize":2307,"se":0.004}}],"prams":{"mean":"2.8","ci_l":"1.8","ci_u":"4.4","count":171,"sampleSize":5977,"se":0.0056}}}]}}');
    });

    it("processYRBSReponses for group by maternal_age_18to44grp", function (){
        var resp = [{"error":null,"q":"pd_comp","filter":{"year":["2014"],"sitecode":["MN","ME","NY","WI","HI","NM","GA","AK","MO","AL","MI","NH","VT","UT","IL","AR","MD","TN","YC","RI","PA","CT","NJ","OK","WA","NE","OR","WV","MA","IA","OH","CO","DE","WY"]},"question":"pd_comp","vars":["maternal_age_18to44grp"],"results":[{"maternal_age_18to44grp":"18-24","mean":0.9875,"se":0.0069,"ci_l":0.9569,"ci_u":0.9964,"count":1422.0,"sample_size":1438.0,"response":"No","level":1},{"maternal_age_18to44grp":"25-29","mean":0.9684,"se":0.0053,"ci_l":0.9538,"ci_u":0.9785,"count":2057.0,"sample_size":2131.0,"response":"No","level":1},{"maternal_age_18to44grp":"30-44","mean":0.9644,"se":0.0063,"ci_l":0.947,"ci_u":0.9763,"count":2227.0,"sample_size":2307.0,"response":"No","level":1},{"maternal_age_18to44grp":"45 plus","mean":1.0,"se":0.0,"ci_l":null,"ci_u":null,"count":10.0,"sample_size":10.0,"response":"No","level":1},{"maternal_age_18to44grp":"<18","mean":0.991,"se":0.0098,"ci_l":0.8965,"ci_u":0.9993,"count":90.0,"sample_size":91.0,"response":"No","level":1},{"ci_l":0.9558,"ci_u":0.9819,"count":5806.0,"level":0,"mean":0.9716,"response":"No","sample_size":5977.0,"se":0.0056,"maternal_age_18to44grp":"Total"},{"maternal_age_18to44grp":"18-24","mean":0.0125,"se":0.0069,"ci_l":0.0036,"ci_u":0.0431,"count":16.0,"sample_size":1438.0,"response":"Yes","level":1},{"maternal_age_18to44grp":"25-29","mean":0.0316,"se":0.0053,"ci_l":0.0215,"ci_u":0.0462,"count":74.0,"sample_size":2131.0,"response":"Yes","level":1},{"maternal_age_18to44grp":"30-44","mean":0.0356,"se":0.0063,"ci_l":0.0237,"ci_u":0.053,"count":80.0,"sample_size":2307.0,"response":"Yes","level":1},{"maternal_age_18to44grp":"45 plus","mean":0.0,"se":0.0,"ci_l":null,"ci_u":null,"count":0.0,"sample_size":10.0,"response":"Yes","level":1},{"maternal_age_18to44grp":"<18","mean":0.009,"se":0.0098,"ci_l":0.0007,"ci_u":0.1035,"count":1.0,"sample_size":91.0,"response":"Yes","level":1},{"ci_l":0.0181,"ci_u":0.0442,"count":171.0,"level":0,"mean":0.0284,"response":"Yes","sample_size":5977.0,"se":0.0056,"maternal_age_18to44grp":"Total"}]}]
        var result = yrbs.processYRBSReponses(resp, false, 'prams');
        expect(JSON.stringify(result)).to.eql( '{"table":{"question":[{"name":"pd_comp","No":{"maternal_age_18to44grp":[{"name":"18-24","prams":{"mean":"98.8","ci_l":"95.7","ci_u":"99.6","count":1422,"sampleSize":1438,"se":0.0069}},{"name":"25-29","prams":{"mean":"96.8","ci_l":"95.4","ci_u":"97.9","count":2057,"sampleSize":2131,"se":0.0053}},{"name":"30-44","prams":{"mean":"96.4","ci_l":"94.7","ci_u":"97.6","count":2227,"sampleSize":2307,"se":0.0063}},{"name":"45 plus","prams":{"mean":"100.0","ci_l":"0","ci_u":"0","count":10,"sampleSize":10,"se":0}},{"name":"<18","prams":{"mean":"99.1","ci_l":"89.6","ci_u":"99.9","count":90,"sampleSize":91,"se":0.0098}}],"prams":{"mean":"97.2","ci_l":"95.6","ci_u":"98.2","count":5806,"sampleSize":5977,"se":0.0056}},"Yes":{"maternal_age_18to44grp":[{"name":"18-24","prams":{"mean":"1.3","ci_l":"0.4","ci_u":"4.3","count":16,"sampleSize":1438,"se":0.0069}},{"name":"25-29","prams":{"mean":"3.2","ci_l":"2.2","ci_u":"4.6","count":74,"sampleSize":2131,"se":0.0053}},{"name":"30-44","prams":{"mean":"3.6","ci_l":"2.4","ci_u":"5.3","count":80,"sampleSize":2307,"se":0.0063}},{"name":"45 plus","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":0,"sampleSize":10,"se":0}},{"name":"<18","prams":{"mean":"0.9","ci_l":"0.1","ci_u":"10.4","count":1,"sampleSize":91,"se":0.0098}}],"prams":{"mean":"2.8","ci_l":"1.8","ci_u":"4.4","count":171,"sampleSize":5977,"se":0.0056}}}]}}');
    });

    it("processYRBSReponses for group by maternal_age_3lvl", function (){
        var resp = [{"error":null,"q":"pd_comp","filter":{"year":["2014"],"sitecode":["MN","ME","NY","WI","HI","NM","GA","AK","MO","AL","MI","NH","VT","UT","IL","AR","MD","TN","YC","RI","PA","CT","NJ","OK","WA","NE","OR","WV","MA","IA","OH","CO","DE","WY"]},"question":"pd_comp","vars":["maternal_age_3lvl"],"results":[{"maternal_age_3lvl":"20-29","mean":0.9749,"se":0.0056,"ci_l":0.9587,"ci_u":0.9848,"count":2817.0,"sample_size":2892.0,"response":"No","level":1},{"maternal_age_3lvl":"30 plus","mean":0.9659,"se":0.0054,"ci_l":0.9514,"ci_u":0.9762,"count":2643.0,"sample_size":2736.0,"response":"No","level":1},{"maternal_age_3lvl":"<20","mean":0.9917,"se":0.0076,"ci_l":0.9367,"ci_u":0.999,"count":346.0,"sample_size":349.0,"response":"No","level":1},{"ci_l":0.9558,"ci_u":0.9819,"count":5806.0,"level":0,"mean":0.9716,"response":"No","sample_size":5977.0,"se":0.0056,"maternal_age_3lvl":"Total"},{"maternal_age_3lvl":"20-29","mean":0.0251,"se":0.0056,"ci_l":0.0152,"ci_u":0.0413,"count":75.0,"sample_size":2892.0,"response":"Yes","level":1},{"maternal_age_3lvl":"30 plus","mean":0.0341,"se":0.0054,"ci_l":0.0238,"ci_u":0.0486,"count":93.0,"sample_size":2736.0,"response":"Yes","level":1},{"maternal_age_3lvl":"<20","mean":0.0083,"se":0.0076,"ci_l":0.001,"ci_u":0.0633,"count":3.0,"sample_size":349.0,"response":"Yes","level":1},{"ci_l":0.0181,"ci_u":0.0442,"count":171.0,"level":0,"mean":0.0284,"response":"Yes","sample_size":5977.0,"se":0.0056,"maternal_age_3lvl":"Total"}]}]
        var result = yrbs.processYRBSReponses(resp, false, 'prams');
        expect(JSON.stringify(result)).to.eql( '{"table":{"question":[{"name":"pd_comp","No":{"maternal_age_3lvl":[{"name":"20-29","prams":{"mean":"97.5","ci_l":"95.9","ci_u":"98.5","count":2817,"sampleSize":2892,"se":0.0056}},{"name":"30 plus","prams":{"mean":"96.6","ci_l":"95.1","ci_u":"97.6","count":2643,"sampleSize":2736,"se":0.0054}},{"name":"<20","prams":{"mean":"99.2","ci_l":"93.7","ci_u":"99.9","count":346,"sampleSize":349,"se":0.0076}}],"prams":{"mean":"97.2","ci_l":"95.6","ci_u":"98.2","count":5806,"sampleSize":5977,"se":0.0056}},"Yes":{"maternal_age_3lvl":[{"name":"20-29","prams":{"mean":"2.5","ci_l":"1.5","ci_u":"4.1","count":75,"sampleSize":2892,"se":0.0056}},{"name":"30 plus","prams":{"mean":"3.4","ci_l":"2.4","ci_u":"4.9","count":93,"sampleSize":2736,"se":0.0054}},{"name":"<20","prams":{"mean":"0.8","ci_l":"0.1","ci_u":"6.3","count":3,"sampleSize":349,"se":0.0076}}],"prams":{"mean":"2.8","ci_l":"1.8","ci_u":"4.4","count":171,"sampleSize":5977,"se":0.0056}}}]}}');
    });

    it("processYRBSReponses for group by maternal_age_4lvl", function (){
        var resp = [{"error":null,"q":"pd_comp","filter":{"year":["2014"],"sitecode":["NE","IA","VT","NH","ME","DE","WI","CO","IL","GA","WA","NM","OR","MN","UT","MI","HI","TN","MD","WY","OK","PA","MA","NJ","WV","AL","AK","NY","OH","AR","YC","CT","RI","MO"]},"question":"pd_comp","vars":["maternal_age_4lvl"],"results":[{"maternal_age_4lvl":"20-24","mean":0.9865,"se":0.0041,"ci_l":0.9754,"ci_u":0.9926,"count":1166.0,"sample_size":1180.0,"response":"No","level":1},{"maternal_age_4lvl":"25-34","mean":0.9681,"se":0.0037,"ci_l":0.9601,"ci_u":0.9746,"count":3360.0,"sample_size":3481.0,"response":"No","level":1},{"maternal_age_4lvl":"35 plus","mean":0.9603,"se":0.0081,"ci_l":0.9411,"ci_u":0.9735,"count":934.0,"sample_size":967.0,"response":"No","level":1},{"maternal_age_4lvl":"<20","mean":0.9917,"se":0.0048,"ci_l":0.9746,"ci_u":0.9973,"count":346.0,"sample_size":349.0,"response":"No","level":1},{"ci_l":0.9659,"ci_u":0.9764,"count":5806.0,"level":0,"mean":0.9716,"response":"No","sample_size":5977.0,"se":0.0027,"maternal_age_4lvl":"Total"},{"maternal_age_4lvl":"20-24","mean":0.0135,"se":0.0041,"ci_l":0.0074,"ci_u":0.0246,"count":14.0,"sample_size":1180.0,"response":"Yes","level":1},{"maternal_age_4lvl":"25-34","mean":0.0319,"se":0.0037,"ci_l":0.0254,"ci_u":0.0399,"count":121.0,"sample_size":3481.0,"response":"Yes","level":1},{"maternal_age_4lvl":"35 plus","mean":0.0397,"se":0.0081,"ci_l":0.0265,"ci_u":0.0589,"count":33.0,"sample_size":967.0,"response":"Yes","level":1},{"maternal_age_4lvl":"<20","mean":0.0083,"se":0.0048,"ci_l":0.0027,"ci_u":0.0254,"count":3.0,"sample_size":349.0,"response":"Yes","level":1},{"ci_l":0.0236,"ci_u":0.0341,"count":171.0,"level":0,"mean":0.0284,"response":"Yes","sample_size":5977.0,"se":0.0027,"maternal_age_4lvl":"Total"}]}]
        var result = yrbs.processYRBSReponses(resp, false, 'prams');
        expect(JSON.stringify(result)).to.eql( '{"table":{"question":[{"name":"pd_comp","No":{"maternal_age_4lvl":[{"name":"20-24","prams":{"mean":"98.7","ci_l":"97.5","ci_u":"99.3","count":1166,"sampleSize":1180,"se":0.0041}},{"name":"25-34","prams":{"mean":"96.8","ci_l":"96.0","ci_u":"97.5","count":3360,"sampleSize":3481,"se":0.0037}},{"name":"35 plus","prams":{"mean":"96.0","ci_l":"94.1","ci_u":"97.4","count":934,"sampleSize":967,"se":0.0081}},{"name":"<20","prams":{"mean":"99.2","ci_l":"97.5","ci_u":"99.7","count":346,"sampleSize":349,"se":0.0048}}],"prams":{"mean":"97.2","ci_l":"96.6","ci_u":"97.6","count":5806,"sampleSize":5977,"se":0.0027}},"Yes":{"maternal_age_4lvl":[{"name":"20-24","prams":{"mean":"1.4","ci_l":"0.7","ci_u":"2.5","count":14,"sampleSize":1180,"se":0.0041}},{"name":"25-34","prams":{"mean":"3.2","ci_l":"2.5","ci_u":"4.0","count":121,"sampleSize":3481,"se":0.0037}},{"name":"35 plus","prams":{"mean":"4.0","ci_l":"2.7","ci_u":"5.9","count":33,"sampleSize":967,"se":0.0081}},{"name":"<20","prams":{"mean":"0.8","ci_l":"0.3","ci_u":"2.5","count":3,"sampleSize":349,"se":0.0048}}],"prams":{"mean":"2.8","ci_l":"2.4","ci_u":"3.4","count":171,"sampleSize":5977,"se":0.0027}}}]}}');
    });

    it("processYRBSReponses for group by maternal_education", function (){
        var resp = [{"error":null,"q":"pd_comp","filter":{"year":["2014"],"sitecode":["MN","ME","NY","WI","HI","NM","GA","AK","MO","AL","MI","NH","VT","UT","IL","AR","MD","TN","YC","RI","PA","CT","NJ","OK","WA","NE","OR","WV","MA","IA","OH","CO","DE","WY"]},"question":"pd_comp","vars":["maternal_education"],"results":[{"maternal_education":"12yrs","mean":0.9806,"se":0.0052,"ci_l":0.9647,"ci_u":0.9894,"count":1456.0,"sample_size":1486.0,"response":"No","level":1},{"maternal_education":"<12yrs","mean":0.9926,"se":0.0041,"ci_l":0.9746,"ci_u":0.9979,"count":754.0,"sample_size":760.0,"response":"No","level":1},{"maternal_education":">12yrs","mean":0.9647,"se":0.0048,"ci_l":0.952,"ci_u":0.9741,"count":3556.0,"sample_size":3689.0,"response":"No","level":1},{"ci_l":0.9558,"ci_u":0.9819,"count":5806.0,"level":0,"mean":0.9716,"response":"No","sample_size":5977.0,"se":0.0056,"maternal_education":"Total"},{"maternal_education":"12yrs","mean":0.0194,"se":0.0052,"ci_l":0.0106,"ci_u":0.0353,"count":30.0,"sample_size":1486.0,"response":"Yes","level":1},{"maternal_education":"<12yrs","mean":0.0074,"se":0.0041,"ci_l":0.0021,"ci_u":0.0254,"count":6.0,"sample_size":760.0,"response":"Yes","level":1},{"maternal_education":">12yrs","mean":0.0353,"se":0.0048,"ci_l":0.0259,"ci_u":0.048,"count":133.0,"sample_size":3689.0,"response":"Yes","level":1},{"ci_l":0.0181,"ci_u":0.0442,"count":171.0,"level":0,"mean":0.0284,"response":"Yes","sample_size":5977.0,"se":0.0056,"maternal_education":"Total"}]}]
        var result = yrbs.processYRBSReponses(resp, false, 'prams');
        expect(JSON.stringify(result)).to.eql( '{"table":{"question":[{"name":"pd_comp","No":{"maternal_education":[{"name":"12yrs","prams":{"mean":"98.1","ci_l":"96.5","ci_u":"98.9","count":1456,"sampleSize":1486,"se":0.0052}},{"name":"<12yrs","prams":{"mean":"99.3","ci_l":"97.5","ci_u":"99.8","count":754,"sampleSize":760,"se":0.0041}},{"name":">12yrs","prams":{"mean":"96.5","ci_l":"95.2","ci_u":"97.4","count":3556,"sampleSize":3689,"se":0.0048}}],"prams":{"mean":"97.2","ci_l":"95.6","ci_u":"98.2","count":5806,"sampleSize":5977,"se":0.0056}},"Yes":{"maternal_education":[{"name":"12yrs","prams":{"mean":"1.9","ci_l":"1.1","ci_u":"3.5","count":30,"sampleSize":1486,"se":0.0052}},{"name":"<12yrs","prams":{"mean":"0.7","ci_l":"0.2","ci_u":"2.5","count":6,"sampleSize":760,"se":0.0041}},{"name":">12yrs","prams":{"mean":"3.5","ci_l":"2.6","ci_u":"4.8","count":133,"sampleSize":3689,"se":0.0048}}],"prams":{"mean":"2.8","ci_l":"1.8","ci_u":"4.4","count":171,"sampleSize":5977,"se":0.0056}}}]}}');
    });

    it("processYRBSReponses for group by maternal_race", function (){
        var resp = [{"error":null,"q":"pd_comp","filter":{"year":["2014"],"sitecode":["MN","ME","NY","WI","HI","NM","GA","AK","MO","AL","MI","NH","VT","UT","IL","AR","MD","TN","YC","RI","PA","CT","NJ","OK","WA","NE","OR","WV","MA","IA","OH","CO","DE","WY"]},"question":"pd_comp","vars":["maternal_race"],"results":[{"maternal_race":"Black","mean":0.9935,"se":0.0043,"ci_l":0.9683,"ci_u":0.9987,"count":901.0,"sample_size":908.0,"response":"No","level":1},{"maternal_race":"Hispanic","mean":0.9825,"se":0.0022,"ci_l":0.9762,"ci_u":0.9871,"count":1114.0,"sample_size":1127.0,"response":"No","level":1},{"maternal_race":"Other Race","mean":0.9779,"se":0.0069,"ci_l":0.9547,"ci_u":0.9893,"count":796.0,"sample_size":829.0,"response":"No","level":1},{"maternal_race":"White","mean":0.9601,"se":0.0065,"ci_l":0.9409,"ci_u":0.9732,"count":2990.0,"sample_size":3108.0,"response":"No","level":1},{"ci_l":0.9558,"ci_u":0.9819,"count":5806.0,"level":0,"mean":0.9716,"response":"No","sample_size":5977.0,"se":0.0056,"maternal_race":"Total"},{"maternal_race":"Black","mean":0.0065,"se":0.0043,"ci_l":0.0013,"ci_u":0.0317,"count":7.0,"sample_size":908.0,"response":"Yes","level":1},{"maternal_race":"Hispanic","mean":0.0175,"se":0.0022,"ci_l":0.0129,"ci_u":0.0238,"count":13.0,"sample_size":1127.0,"response":"Yes","level":1},{"maternal_race":"Other Race","mean":0.0221,"se":0.0069,"ci_l":0.0107,"ci_u":0.0453,"count":33.0,"sample_size":829.0,"response":"Yes","level":1},{"maternal_race":"White","mean":0.0399,"se":0.0065,"ci_l":0.0268,"ci_u":0.0591,"count":118.0,"sample_size":3108.0,"response":"Yes","level":1},{"ci_l":0.0181,"ci_u":0.0442,"count":171.0,"level":0,"mean":0.0284,"response":"Yes","sample_size":5977.0,"se":0.0056,"maternal_race":"Total"}]}]
        var result = yrbs.processYRBSReponses(resp, false, 'prams');
        expect(JSON.stringify(result)).to.eql( '{"table":{"question":[{"name":"pd_comp","No":{"maternal_race":[{"name":"Black","prams":{"mean":"99.4","ci_l":"96.8","ci_u":"99.9","count":901,"sampleSize":908,"se":0.0043}},{"name":"Hispanic","prams":{"mean":"98.3","ci_l":"97.6","ci_u":"98.7","count":1114,"sampleSize":1127,"se":0.0022}},{"name":"Other Race","prams":{"mean":"97.8","ci_l":"95.5","ci_u":"98.9","count":796,"sampleSize":829,"se":0.0069}},{"name":"White","prams":{"mean":"96.0","ci_l":"94.1","ci_u":"97.3","count":2990,"sampleSize":3108,"se":0.0065}}],"prams":{"mean":"97.2","ci_l":"95.6","ci_u":"98.2","count":5806,"sampleSize":5977,"se":0.0056}},"Yes":{"maternal_race":[{"name":"Black","prams":{"mean":"0.7","ci_l":"0.1","ci_u":"3.2","count":7,"sampleSize":908,"se":0.0043}},{"name":"Hispanic","prams":{"mean":"1.8","ci_l":"1.3","ci_u":"2.4","count":13,"sampleSize":1127,"se":0.0022}},{"name":"Other Race","prams":{"mean":"2.2","ci_l":"1.1","ci_u":"4.5","count":33,"sampleSize":829,"se":0.0069}},{"name":"White","prams":{"mean":"4.0","ci_l":"2.7","ci_u":"5.9","count":118,"sampleSize":3108,"se":0.0065}}],"prams":{"mean":"2.8","ci_l":"1.8","ci_u":"4.4","count":171,"sampleSize":5977,"se":0.0056}}}]}}');
    });

    it("processYRBSReponses for group by medicaid_recip", function (){
        var resp = [{"error":null,"q":"pd_comp","filter":{"year":["2014"],"sitecode":["MN","ME","NY","WI","HI","NM","GA","AK","MO","AL","MI","NH","VT","UT","IL","AR","MD","TN","YC","RI","PA","CT","NJ","OK","WA","NE","OR","WV","MA","IA","OH","CO","DE","WY"]},"question":"pd_comp","vars":["medicaid_recip"],"results":[{"medicaid_recip":"No","mean":0.9571,"se":0.0045,"ci_l":0.9456,"ci_u":0.9663,"count":2747.0,"sample_size":2879.0,"response":"No","level":1},{"medicaid_recip":"Yes","mean":0.986,"se":0.0045,"ci_l":0.9714,"ci_u":0.9932,"count":3059.0,"sample_size":3098.0,"response":"No","level":1},{"ci_l":0.9558,"ci_u":0.9819,"count":5806.0,"level":0,"mean":0.9716,"response":"No","sample_size":5977.0,"se":0.0056,"medicaid_recip":"Total"},{"medicaid_recip":"No","mean":0.0429,"se":0.0045,"ci_l":0.0337,"ci_u":0.0544,"count":132.0,"sample_size":2879.0,"response":"Yes","level":1},{"medicaid_recip":"Yes","mean":0.014,"se":0.0045,"ci_l":0.0068,"ci_u":0.0286,"count":39.0,"sample_size":3098.0,"response":"Yes","level":1},{"ci_l":0.0181,"ci_u":0.0442,"count":171.0,"level":0,"mean":0.0284,"response":"Yes","sample_size":5977.0,"se":0.0056,"medicaid_recip":"Total"}]}]
        var result = yrbs.processYRBSReponses(resp, false, 'prams');
        expect(JSON.stringify(result)).to.eql( '{"table":{"question":[{"name":"pd_comp","No":{"medicaid_recip":[{"name":"No","prams":{"mean":"95.7","ci_l":"94.6","ci_u":"96.6","count":2747,"sampleSize":2879,"se":0.0045}},{"name":"Yes","prams":{"mean":"98.6","ci_l":"97.1","ci_u":"99.3","count":3059,"sampleSize":3098,"se":0.0045}}],"prams":{"mean":"97.2","ci_l":"95.6","ci_u":"98.2","count":5806,"sampleSize":5977,"se":0.0056}},"Yes":{"medicaid_recip":[{"name":"No","prams":{"mean":"4.3","ci_l":"3.4","ci_u":"5.4","count":132,"sampleSize":2879,"se":0.0045}},{"name":"Yes","prams":{"mean":"1.4","ci_l":"0.7","ci_u":"2.9","count":39,"sampleSize":3098,"se":0.0045}}],"prams":{"mean":"2.8","ci_l":"1.8","ci_u":"4.4","count":171,"sampleSize":5977,"se":0.0056}}}]}}');
    });

    it("processYRBSReponses for group by mother_hispanic", function (){
        var resp = [{"error":null,"q":"pd_comp","filter":{"year":["2014"],"sitecode":["MN","ME","NY","WI","HI","NM","GA","AK","MO","AL","MI","NH","VT","UT","IL","AR","MD","TN","YC","RI","PA","CT","NJ","OK","WA","NE","OR","WV","MA","IA","OH","CO","DE","WY"]},"question":"pd_comp","vars":["mother_hispanic"],"results":[{"mother_hispanic":"Hispanic","mean":0.9825,"se":0.0022,"ci_l":0.9762,"ci_u":0.9871,"count":1114.0,"sample_size":1127.0,"response":"No","level":1},{"mother_hispanic":"non-Hispanic","mean":0.9687,"se":0.0065,"ci_l":0.9498,"ci_u":0.9806,"count":4683.0,"sample_size":4841.0,"response":"No","level":1},{"ci_l":0.9558,"ci_u":0.9819,"count":5806.0,"level":0,"mean":0.9716,"response":"No","sample_size":5977.0,"se":0.0056,"mother_hispanic":"Total"},{"mother_hispanic":"Hispanic","mean":0.0175,"se":0.0022,"ci_l":0.0129,"ci_u":0.0238,"count":13.0,"sample_size":1127.0,"response":"Yes","level":1},{"mother_hispanic":"non-Hispanic","mean":0.0313,"se":0.0065,"ci_l":0.0194,"ci_u":0.0502,"count":158.0,"sample_size":4841.0,"response":"Yes","level":1},{"ci_l":0.0181,"ci_u":0.0442,"count":171.0,"level":0,"mean":0.0284,"response":"Yes","sample_size":5977.0,"se":0.0056,"mother_hispanic":"Total"}]}]
        var result = yrbs.processYRBSReponses(resp, false, 'prams');
        expect(JSON.stringify(result)).to.eql( '{"table":{"question":[{"name":"pd_comp","No":{"mother_hispanic":[{"name":"Hispanic","prams":{"mean":"98.3","ci_l":"97.6","ci_u":"98.7","count":1114,"sampleSize":1127,"se":0.0022}},{"name":"non-Hispanic","prams":{"mean":"96.9","ci_l":"95.0","ci_u":"98.1","count":4683,"sampleSize":4841,"se":0.0065}}],"prams":{"mean":"97.2","ci_l":"95.6","ci_u":"98.2","count":5806,"sampleSize":5977,"se":0.0056}},"Yes":{"mother_hispanic":[{"name":"Hispanic","prams":{"mean":"1.8","ci_l":"1.3","ci_u":"2.4","count":13,"sampleSize":1127,"se":0.0022}},{"name":"non-Hispanic","prams":{"mean":"3.1","ci_l":"1.9","ci_u":"5.0","count":158,"sampleSize":4841,"se":0.0065}}],"prams":{"mean":"2.8","ci_l":"1.8","ci_u":"4.4","count":171,"sampleSize":5977,"se":0.0056}}}]}}');
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
                    "sample_size": 15049,
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
                    "sample_size": 7424,
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
                    "sample_size": 7518,
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
                    "sample_size": 15049,
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
                    "sample_size": 7424,
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
                    "sample_size": 7518,
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
                        "sample_size": 11597,
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
                        "sample_size": 5694,
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
                        "sample_size": 5815,
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
                        "sample_size": 11597,
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
                        "sample_size": 5694,
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
                        "sample_size": 5815,
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
                                "ci_l":"3.6",
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
                                "ci_l":"3.6",
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
        var resp = [{"error":null,"q":"drnkany5","filter":{"year":["2015"],"sitecode":["AL"]},"question":"drnkany5","vars":["sex"],"results":[{"mean":0.407,"se":null,"count":2767,"sex":"Total","ci_u":0.422,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.391},{"mean":0.478,"se":null,"count":1329,"sex":"Male","ci_u":0.503,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.453},{"mean":0.658,"se":null,"count":3238,"sex":"Female","ci_u":0.677,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.638},{"mean":0.522,"se":null,"count":1567,"sex":"Male","ci_u":0.547,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.497},{"mean":0.593,"se":null,"count":4805,"sex":"Total","ci_u":0.609,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.578},{"mean":0.342,"se":null,"count":1438,"sex":"Female","ci_u":0.362,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.323}]}]
        var result = yrbs.processYRBSReponses(resp, false, 'brfss');
        expect(JSON.stringify(result)).to.eql( '{"table":{"question":[{"name":"drnkany5","yes":{"sex":[{"name":"Total","brfss":{"mean":"40.7","ci_l":"39.1","ci_u":"42.2","count":2767,"se":null}},{"name":"Male","brfss":{"mean":"47.8","ci_l":"45.3","ci_u":"50.3","count":1329,"se":null}},{"name":"Female","brfss":{"mean":"34.2","ci_l":"32.3","ci_u":"36.2","count":1438,"se":null}}]},"no":{"sex":[{"name":"Female","brfss":{"mean":"65.8","ci_l":"63.8","ci_u":"67.7","count":3238,"se":null}},{"name":"Male","brfss":{"mean":"52.2","ci_l":"49.7","ci_u":"54.7","count":1567,"se":null}},{"name":"Total","brfss":{"mean":"59.3","ci_l":"57.8","ci_u":"60.9","count":4805,"se":null}}]}}]}}');
    });

    it("processYRBSReponses for group by age_group", function (){
        var yrbsresp = [{"error":null,"q":"drnkany5","filter":{"year":["2015"],"sitecode":["AL"]},"question":"drnkany5","vars":["age"],"results":[{"mean":0.242,"se":null,"count":635,"ci_u":0.263,"response":"yes","age":"65+","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.221},{"mean":0.565,"se":null,"count":734,"ci_u":0.599,"response":"no","age":"45-54","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.532},{"mean":0.407,"se":null,"count":2767,"ci_u":0.422,"response":"yes","age":"Total","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.391},{"mean":0.464,"se":null,"count":404,"ci_u":0.508,"response":"yes","age":"35-44","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.421},{"mean":0.536,"se":null,"count":452,"ci_u":0.579,"response":"no","age":"35-44","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.492},{"mean":0.463,"se":null,"count":330,"ci_u":0.509,"response":"no","age":"25-34","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.416},{"mean":0.758,"se":null,"count":1889,"ci_u":0.779,"response":"no","age":"65+","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.737},{"mean":0.453,"se":null,"count":210,"ci_u":0.509,"response":"yes","age":"18-24","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.396},{"mean":0.593,"se":null,"count":4805,"ci_u":0.609,"response":"no","age":"Total","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.578},{"mean":0.547,"se":null,"count":253,"ci_u":0.604,"response":"no","age":"18-24","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.491},{"mean":0.435,"se":null,"count":549,"ci_u":0.468,"response":"yes","age":"45-54","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.401},{"mean":0.363,"se":null,"count":580,"ci_u":0.394,"response":"yes","age":"55-64","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.332},{"mean":0.637,"se":null,"count":1147,"ci_u":0.668,"response":"no","age":"55-64","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.606},{"mean":0.537,"se":null,"count":389,"ci_u":0.584,"response":"yes","age":"25-34","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.491}]}]
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'brfss');
        expect(JSON.stringify(result)).to.eql('{"table":{"question":[{"name":"drnkany5","yes":{"age":[{"name":"65+","brfss":{"mean":"24.2","ci_l":"22.1","ci_u":"26.3","count":635,"se":null}},{"name":"Total","brfss":{"mean":"40.7","ci_l":"39.1","ci_u":"42.2","count":2767,"se":null}},{"name":"35-44","brfss":{"mean":"46.4","ci_l":"42.1","ci_u":"50.8","count":404,"se":null}},{"name":"18-24","brfss":{"mean":"45.3","ci_l":"39.6","ci_u":"50.9","count":210,"se":null}},{"name":"45-54","brfss":{"mean":"43.5","ci_l":"40.1","ci_u":"46.8","count":549,"se":null}},{"name":"55-64","brfss":{"mean":"36.3","ci_l":"33.2","ci_u":"39.4","count":580,"se":null}},{"name":"25-34","brfss":{"mean":"53.7","ci_l":"49.1","ci_u":"58.4","count":389,"se":null}}]},"no":{"age":[{"name":"45-54","brfss":{"mean":"56.5","ci_l":"53.2","ci_u":"59.9","count":734,"se":null}},{"name":"35-44","brfss":{"mean":"53.6","ci_l":"49.2","ci_u":"57.9","count":452,"se":null}},{"name":"25-34","brfss":{"mean":"46.3","ci_l":"41.6","ci_u":"50.9","count":330,"se":null}},{"name":"65+","brfss":{"mean":"75.8","ci_l":"73.7","ci_u":"77.9","count":1889,"se":null}},{"name":"Total","brfss":{"mean":"59.3","ci_l":"57.8","ci_u":"60.9","count":4805,"se":null}},{"name":"18-24","brfss":{"mean":"54.7","ci_l":"49.1","ci_u":"60.4","count":253,"se":null}},{"name":"55-64","brfss":{"mean":"63.7","ci_l":"60.6","ci_u":"66.8","count":1147,"se":null}}]}}]}}');
    });

    it("processYRBSReponses for group by education", function (){
        var yrbsresp = [{"error":null,"q":"drnkany5","filter":{"year":["2015"],"sitecode":["AL"]},"question":"drnkany5","vars":["education"],"results":[{"mean":0.407,"se":null,"education":"Total","count":2767,"ci_u":0.422,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.391},{"mean":0.751,"se":null,"education":"Less than High School","count":706,"ci_u":0.792,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.71},{"mean":0.249,"se":null,"education":"Less than High School","count":188,"ci_u":0.29,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.208},{"mean":0.469,"se":null,"education":"College/Technical School Graduate","count":1071,"ci_u":0.497,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.44},{"mean":0.593,"se":null,"education":"Total","count":4805,"ci_u":0.609,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.578},{"mean":0.452,"se":null,"education":"Attended College/Technical School","count":833,"ci_u":0.48,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.423},{"mean":0.532,"se":null,"education":"College/Technical School Graduate","count":1053,"ci_u":0.56,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.503},{"mean":0.363,"se":null,"education":"High School Graduate","count":690,"ci_u":0.391,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.335},{"mean":0.637,"se":null,"education":"High School Graduate","count":1702,"ci_u":0.665,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.609},{"mean":0.549,"se":null,"education":"Attended College/Technical School","count":1308,"ci_u":0.577,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.52}]}]
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'brfss');
        expect(JSON.stringify(result)).to.eql('{"table":{"question":[{"name":"drnkany5","yes":{"education":[{"name":"Total","brfss":{"mean":"40.7","ci_l":"39.1","ci_u":"42.2","count":2767,"se":null}},{"name":"Less than High School","brfss":{"mean":"24.9","ci_l":"20.8","ci_u":"29.0","count":188,"se":null}},{"name":"Attended College/Technical School","brfss":{"mean":"45.2","ci_l":"42.3","ci_u":"48.0","count":833,"se":null}},{"name":"College/Technical School Graduate","brfss":{"mean":"53.2","ci_l":"50.3","ci_u":"56.0","count":1053,"se":null}},{"name":"High School Graduate","brfss":{"mean":"36.3","ci_l":"33.5","ci_u":"39.1","count":690,"se":null}}]},"no":{"education":[{"name":"Less than High School","brfss":{"mean":"75.1","ci_l":"71.0","ci_u":"79.2","count":706,"se":null}},{"name":"College/Technical School Graduate","brfss":{"mean":"46.9","ci_l":"44.0","ci_u":"49.7","count":1071,"se":null}},{"name":"Total","brfss":{"mean":"59.3","ci_l":"57.8","ci_u":"60.9","count":4805,"se":null}},{"name":"High School Graduate","brfss":{"mean":"63.7","ci_l":"60.9","ci_u":"66.5","count":1702,"se":null}},{"name":"Attended College/Technical School","brfss":{"mean":"54.9","ci_l":"52.0","ci_u":"57.7","count":1308,"se":null}}]}}]}}');
    });

    it("processYRBSReponses for group by income", function (){
        var yrbsresp = [{"error":null,"q":"drnkany5","filter":{"year":["2015"],"sitecode":["AL"]},"question":"drnkany5","vars":["income"],"results":[{"mean":0.407,"se":null,"count":2767,"income":"Total","ci_u":0.422,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.391},{"mean":0.311,"se":null,"count":225,"income":"<$15k","ci_u":0.354,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.268},{"mean":0.681,"se":null,"count":912,"income":"$15k-$25k","ci_u":0.716,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.647},{"mean":0.435,"se":null,"count":331,"income":"$35k-$50k","ci_u":0.482,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.387},{"mean":0.319,"se":null,"count":388,"income":"$15k-$25k","ci_u":0.354,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.284},{"mean":0.438,"se":null,"count":234,"income":"$25k-$35k","ci_u":0.492,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.383},{"mean":0.593,"se":null,"count":4805,"income":"Total","ci_u":0.609,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.578},{"mean":0.566,"se":null,"count":533,"income":"$35k-$50k","ci_u":0.613,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.518},{"mean":0.563,"se":null,"count":459,"income":"$25k-$35k","ci_u":0.617,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.508},{"mean":0.476,"se":null,"count":1157,"income":"$50k+","ci_u":0.503,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.449},{"mean":0.524,"se":null,"count":1223,"income":"$50k+","ci_u":0.551,"response":"yes","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.497},{"mean":0.689,"se":null,"count":702,"income":"<$15k","ci_u":0.733,"response":"no","qid":"drnkany5","sitecode":"AL","year":"2015","ci_l":0.646}]}]
        var result = yrbs.processYRBSReponses(yrbsresp, false, 'brfss');
        expect(JSON.stringify(result)).to.eql('{"table":{"question":[{"name":"drnkany5","yes":{"income":[{"name":"Total","brfss":{"mean":"40.7","ci_l":"39.1","ci_u":"42.2","count":2767,"se":null}},{"name":"<$15k","brfss":{"mean":"31.1","ci_l":"26.8","ci_u":"35.4","count":225,"se":null}},{"name":"$35k-$50k","brfss":{"mean":"43.5","ci_l":"38.7","ci_u":"48.2","count":331,"se":null}},{"name":"$15k-$25k","brfss":{"mean":"31.9","ci_l":"28.4","ci_u":"35.4","count":388,"se":null}},{"name":"$25k-$35k","brfss":{"mean":"43.8","ci_l":"38.3","ci_u":"49.2","count":234,"se":null}},{"name":"$50k+","brfss":{"mean":"52.4","ci_l":"49.7","ci_u":"55.1","count":1223,"se":null}}]},"no":{"income":[{"name":"$15k-$25k","brfss":{"mean":"68.1","ci_l":"64.7","ci_u":"71.6","count":912,"se":null}},{"name":"Total","brfss":{"mean":"59.3","ci_l":"57.8","ci_u":"60.9","count":4805,"se":null}},{"name":"$35k-$50k","brfss":{"mean":"56.6","ci_l":"51.8","ci_u":"61.3","count":533,"se":null}},{"name":"$25k-$35k","brfss":{"mean":"56.3","ci_l":"50.8","ci_u":"61.7","count":459,"se":null}},{"name":"$50k+","brfss":{"mean":"47.6","ci_l":"44.9","ci_u":"50.3","count":1157,"se":null}},{"name":"<$15k","brfss":{"mean":"68.9","ci_l":"64.6","ci_u":"73.3","count":702,"se":null}}]}}]}}');
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
                        "sample_size": 11597,
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
                        "sample_size": 11597,
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
                        "sample_size": 4436,
                        "ci_l": 0.419
                    },
                    {
                        "ci_u": 0.581,
                        "method": "socrata",
                        "response": false,
                        "mean": 0.559,
                        "q": "qn46",
                        "sample_size": 4436,
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
                                "ci_l":"3.6",
                                "ci_u":"5.2",
                                "count":11597
                            }
                        },
                        "NO":{
                            "mental_health":{
                                "mean":"4.3",
                                "ci_l":"3.6",
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
                        "sample_size": 11597,
                        "ci_l": 0.0364
                    },
                    {
                        "ci_u": 0.9636,
                        "method": "socrata",
                        "response": false,
                        "mean": 0.957,
                        "q": "qn45",
                        "sample_size": 11597,
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
                        "sample_size": 4436,
                        "ci_l": 0.419
                    },
                    {
                        "ci_u": 0.581,
                        "method": "socrata",
                        "response": false,
                        "mean": 0.559,
                        "q": "qn46",
                        "sample_size": 4436,
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
                    "sample_size": 5694,
                    "ci_l": 0.0506,
                    "sex": "Male"
                },
                {
                    "ci_u": 0.0332,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.025,
                    "q": "qn45",
                    "sample_size": 5815,
                    "ci_l": 0.0193,
                    "sex": "Female"
                },
                {
                    "ci_u": 0.0512,
                    "method": "socrata",
                    "response": true,
                    "mean": 0.043,
                    "q": "qn45",
                    "sample_size": 11597,
                    "ci_l": 0.0364,
                    "sex": "Total"
                },
                {
                    "ci_u": 0.9494,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.939,
                    "q": "qn45",
                    "sample_size": 5694,
                    "ci_l": 0.9276,
                    "sex": "Male"
                },
                {
                    "ci_u": 0.9807,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.975,
                    "q": "qn45",
                    "sample_size": 5815,
                    "ci_l": 0.9668,
                    "sex": "Female"
                },
                {
                    "ci_u": 0.9636,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.957,
                    "q": "qn45",
                    "sample_size": 11597,
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
                    "sample_size": 626,
                    "ci_l": 0.4595,
                    "sex": "Female"
                },
                {
                    "ci_u": 0.5405,
                    "method": "socrata",
                    "response": false,
                    "mean": 0.503,
                    "q": "qn46",
                    "sample_size": 626,
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
                                        "ci_u":"54.1",
                                        "count":626
                                    }
                                }
                            ],
                            "mental_health":{
                                "mean":"50.3",
                                "ci_l":"46.5",
                                "ci_u":"54.1",
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
                    "sample_size": 2321,
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
                    "sample_size": 37,
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
                    "sample_size": 156,
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
                    "sample_size": 20,
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
                    "sample_size": 25,
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
                    "sample_size": 1162,
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
                    "sample_size": 192,
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
                    "sample_size": 93,
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
                    "sample_size": 146,
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
                    "sample_size": 21,
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
                    "sample_size": 241,
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
                    "sample_size": 4436,
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
                    "sample_size": 1025,
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
                    "sample_size": 37,
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
                    "sample_size": 36,
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
                    "sample_size": 349,
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
                    "sample_size": 737,
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
                    "sample_size": 2,
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
                    "sample_size": 2088,
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
                    "sample_size": 1422,
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
                    "sample_size": 681,
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
                    "sample_size": 74,
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
                    "sample_size": 2193,
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
                    "sample_size": 57,
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
                    "sample_size": 2321,
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
                    "sample_size": 37,
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
                    "sample_size": 156,
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
                    "sample_size": 20,
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
                    "sample_size": 25,
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
                    "sample_size": 1162,
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
                    "sample_size": 192,
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
                    "sample_size": 93,
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
                    "sample_size": 146,
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
                    "sample_size": 21,
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
                    "sample_size": 241,
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
                    "sample_size": 4436,
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
                    "sample_size": 1025,
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
                    "sample_size": 37,
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
                    "sample_size": 36,
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
                    "sample_size": 349,
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
                    "sample_size": 737,
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
                    "sample_size": 2,
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
                    "sample_size": 2088,
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
                    "sample_size": 1422,
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
                    "sample_size": 681,
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
                    "sample_size": 74,
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
                    "sample_size": 2193,
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
                    "sample_size": 57,
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
                                                "ci_l":"45.2",
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
                    "sample_size": 15049,
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
                    "sample_size": 2430,
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
                    "sample_size": 71,
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
                    "sample_size": 308,
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
                    "sample_size": 331,
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
                    "sample_size": 63,
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
                    "sample_size": 3266,
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
                    "sample_size": 302,
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
                    "sample_size": 7518,
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
                    "sample_size": 2473,
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
                    "sample_size": 22,
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
                    "sample_size": 376,
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
                    "sample_size": 92,
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
                    "sample_size": 3386,
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
                    "sample_size": 7424,
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
                    "sample_size": 776,
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
                    "sample_size": 776,
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
                    "sample_size": 15049,
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
                    "sample_size": 2430,
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
                    "sample_size": 71,
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
                    "sample_size": 308,
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
                    "sample_size": 331,
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
                    "sample_size": 63,
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
                    "sample_size": 3266,
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
                    "sample_size": 302,
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
                    "sample_size": 7518,
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
                    "sample_size": 2473,
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
                    "sample_size": 22,
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
                    "sample_size": 376,
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
                    "sample_size": 92,
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
                    "sample_size": 3386,
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
                    "sample_size": 7424,
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
                    "sample_size": 776,
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
                    "sample_size": 776,
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
                    "sample_size": 8757,
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
                    "sample_size": 47,
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
                    "sample_size": 1789,
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
                    "sample_size": 2481,
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
                    "sample_size": 93,
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
                    "sample_size": 268,
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
                    "sample_size": 3951,
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
                    "sample_size": 1785,
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
                    "sample_size": 4769,
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
                    "sample_size": 1523,
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
                    "sample_size": 88,
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
                    "sample_size": 8757,
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
                    "sample_size": 47,
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
                    "sample_size": 1789,
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
                    "sample_size": 2481,
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
                    "sample_size": 93,
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
                    "sample_size": 268,
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
                    "sample_size": 3951,
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
                    "sample_size": 1785,
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
                    "sample_size": 4769,
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
                    "sample_size": 1523,
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
                    "sample_size": 88,
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
                    "sample_size": 8757,
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
                    "sample_size": 355,
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
                    "sample_size": 99,
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
                    "sample_size": 65,
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
                    "sample_size": 3134,
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
                    "sample_size": 3951,
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
                    "sample_size": 132,
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
                    "sample_size": 4233,
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
                    "sample_size": 4769,
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
                    "sample_size": 82,
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
                    "sample_size": 99,
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
                    "sample_size": 8757,
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
                    "sample_size": 355,
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
                    "sample_size": 99,
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
                    "sample_size": 65,
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
                    "sample_size": 3134,
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
                    "sample_size": 3951,
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
                    "sample_size": 132,
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
                    "sample_size": 4233,
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
                    "sample_size": 4769,
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
                    "sample_size": 82,
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
                    "sample_size": 99,
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
        var apiQuery = {"searchFor": "mental_health", "aggregations":{"nested":{"table":[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000}]}},
            "query": {"question.path":{ "value": ["qn8", "qn9"]}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            expect(q0.Yes.mental_health.mean).to.eql(13.6);
            expect(q0.Yes.mental_health.ci_l).to.eql(12.8);
            expect(q0.Yes.mental_health.ci_u).to.eql(14.5);
            expect(q0.Yes.mental_health.count).to.eql(198028);
            var sex = sortByKey(q0.Yes.sex,'name',true);
            expect(sex.length).to.eql(2);
            expect(sex[0].name).to.eql("Female");
            expect(sex[1].name).to.eql("Male");
            var female = sortByKey(sex[0].race, 'name', true);
            expect(female).to.eql([{"name":"Am Indian / Alaska Native","mental_health":{"mean":"15.5","ci_l":"12.1","ci_u":"19.5","count":984}},{"name":"Asian","mental_health":{"mean":"8.6","ci_l":"7.2","ci_u":"10.2","count":3347}},{"name":"Black or African American","mental_health":{"mean":"15.4","ci_l":"14.1","ci_u":"16.8","count":22879}},{"name":"Hispanic/Latino","mental_health":{"mean":"10.8","ci_l":"9.8","ci_u":"11.9","count":27173}},{"name":"Multiple - Non-Hispanic","mental_health":{"mean":"7.1","ci_l":"5.6","ci_u":"9.0","count":2812}},{"name":"Native Hawaiian/other PI","mental_health":{"mean":"10.9","ci_l":"7.5","ci_u":"15.4","count":538}},{"name":"Total","mental_health":{"mean":"10.6","ci_l":"9.8","ci_u":"11.3","count":99880}},{"name":"White","mental_health":{"mean":"9.4","ci_l":"8.5","ci_u":"10.4","count":40155}}]);
            var male = sortByKey(sex[1].race, 'name', true);

            expect(male).to.eql([{"name":"Am Indian / Alaska Native","mental_health":{"mean":"22.2","ci_l":"18.3","ci_u":"26.7","count":1222}},{"name":"Asian","mental_health":{"mean":"10.9","ci_l":"9.4","ci_u":"12.7","count":3473}},{"name":"Black or African American","mental_health":{"mean":"22.0","ci_l":"20.4","ci_u":"23.6","count":20467}},{"name":"Hispanic/Latino","mental_health":{"mean":"14.4","ci_l":"13.1","ci_u":"15.8","count":26303}},{"name":"Multiple - Non-Hispanic","mental_health":{"mean":"12.9","ci_l":"10.5","ci_u":"15.8","count":2386}},{"name":"Native Hawaiian/other PI","mental_health":{"mean":"21.0","ci_l":"15.8","ci_u":"27.4","count":657}},{"name":"Total","mental_health":{"mean":"16.5","ci_l":"15.6","ci_u":"17.6","count":97549}},{"name":"White","mental_health":{"mean":"16.1","ci_l":"14.8","ci_u":"17.4","count":40836}}]);
        });
    });

    it("invokeYRBS service with no grouping", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            expect(resp).to.eql( {
                "table": {
                    "question": [
                        {
                            "name": "qn8",
                            "Yes": {
                                "mental_health": {
                                    "mean": "13.6",
                                    "ci_l": "12.8",
                                    "ci_u": "14.5",
                                    "count": 198028
                                }
                            },
                            "No": {
                                "mental_health": {
                                    "mean": "86.4",
                                    "ci_l": "85.5",
                                    "ci_u": "87.2",
                                    "count": 198028
                                }
                            }
                        }
                    ]
                }
            } );
        });
    });

    it("invokeYRBS service with grouping and filtering", function (){
        var apiQuery = {basicSearch:false, 'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'race':{value:['White', 'Black or African American']},'sex':{value:['Female']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            expect(q0.Yes.mental_health).to.eql({"mean":"10.5","ci_l":"9.7","ci_u":"11.4","count":63034});
            expect(q0.Yes.sex.length).to.eql(1);
            var sex = sortByKey(q0.Yes.sex, 'name', true);
            expect(sex[0].name).to.eql("Female");
            var race = sortByKey(sex[0].race, 'name', true);
            expect(race).to.eql([{"name":"Black or African American","mental_health":{"mean":"15.4","ci_l":"14.1","ci_u":"16.8","count":22879}},{"name":"Total","mental_health":{"mean":"10.5","ci_l":"9.7","ci_u":"11.4","count":63034}},{"name":"White","mental_health":{"mean":"9.4","ci_l":"8.5","ci_u":"10.4","count":40155}}]);
            expect(q0.No.mental_health).to.eql({"mean":"89.5","ci_l":"88.6","ci_u":"90.3","count":63034});
            expect(sex[0].name).to.eql("Female");
            race = sortByKey(sex[0].race, 'name', true);
            expect([{"name":"Black or African American","mental_health":{"mean":"92.9","ci_l":"91.5","ci_u":"94.0","count":11670}},{"name":"White","mental_health":{"mean":"84.8","ci_l":"83.4","ci_u":"86.1","count":23714}}]);
        });
    });

    it("invokeYRBS state service with grouping and filtering", function (){
        var apiQuery = {'searchFor': 'mental_health', 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsRace","queryKey":"race","size":100000},{"key":"yrbsState","queryKey":"sitecode","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'race':{value:['White', 'Black or African American']},'sitecode':{value:['CA','MO']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            expect(q0.Yes.mental_health).to.eql({"mean":"12.8","ci_l":"11.3","ci_u":"14.5","count":19343});
            var race = sortByKey(q0.Yes.race,'name',true);
            expect(race[0].name).to.eql("Black or African American");
            expect(race[1].name).to.eql("White");
            var b = sortByKey(race[0].sitecode, 'name', true);
            expect(b).to.eql([{"name":"CA","mental_health":{"mean":"8.2","ci_l":"4.1","ci_u":"15.7","count":149}},{"name":"MO","mental_health":{"mean":"22.1","ci_l":"20.0","ci_u":"24.4","count":2704}},{"name":"Total","mental_health":{"mean":"19.2","ci_l":"17.2","ci_u":"21.5","count":2853}}]);
            var w = sortByKey(race[1].sitecode, 'name', true);
            expect(w).to.eql([{"name":"CA","mental_health":{"mean":"2.3","ci_l":"1.0","ci_u":"5.0","count":677}},{"name":"MO","mental_health":{"mean":"14.9","ci_l":"13.2","ci_u":"16.9","count":15813}},{"name":"Total","mental_health":{"mean":"11.6","ci_l":"9.9","ci_u":"13.4","count":16490}}]);
        });
    });

    it("invokeYRBS service for precomputed results", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'mental_health', 'yrbsBasic': true, 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'year':{value:['2015']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            expect(resp).to.eql( {"table":{"question":[{"name":"qn8","Yes":{"mental_health":{"mean":"6.1","ci_l":"4.9","ci_u":"7.6","count":14070}},"No":{"mental_health":{"mean":"93.9","ci_l":"92.4","ci_u":"95.1","count":14070}}}]}} );
        });
    });

    it("invokeYRBS service for precomputed results with grouping", function (){
        var apiQuery = {basicSearch:true, 'searchFor': 'mental_health', 'yrbsBasic': true, 'aggregations':{'nested':{'table':[{"key":"question","queryKey":"question.key","size":100000},{"key":"yrbsSex","queryKey":"sex","size":100000}]}},
            'query': {'question.path':{ 'value': ['qn8']}, 'year':{value:['2015']}}};

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            expect(q0.Yes.mental_health.mean).to.eql(6.1);
            expect(q0.Yes.mental_health.ci_l).to.eql(4.9);
            expect(q0.Yes.mental_health.ci_u).to.eql(7.6);
            expect(q0.Yes.mental_health.count).to.eql(14070);
            var sex= sortByKey(q0.Yes.sex,'name',true);
            expect(sex[0].name).to.eql("Female");
            expect(sex[0].mental_health.mean).to.eql(4.9);
            expect(sex[0].mental_health.ci_l).to.eql(3.8);
            expect(sex[0].mental_health.ci_u).to.eql(6.3);
            expect(sex[0].mental_health.count).to.eql(7028);
            expect(q0.No.mental_health.mean).to.eql(93.9);
            expect(q0.No.mental_health.ci_l).to.eql(92.4);
            expect(q0.No.mental_health.ci_u).to.eql(95.1);
            expect(q0.No.mental_health.count).to.eql(14070);
        });
    });

    it("invokeYRBS service for basic results with default grouping - suppressing if value < 100", function (){
        var apiQuery = {"searchFor":"mental_health","query":{"sex":{"key":"yrbsSex","queryKey":"sex","value":"Male","primary":false},"race":{"key":"yrbsRace","queryKey":"race","value":"Am Indian / Alaska Native","primary":false},"year":{"key":"year","queryKey":"year","value":"2017","primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["qn42"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"yrbsRace","queryKey":"race","size":0}],"charts":[],"maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}},"basicSearch":true,"pagination":{"from":0,"size":10000}}

        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            var race= q0.Yes.race;
            expect(race[0].name).to.eql("Am Indian / Alaska Native");
            expect(race[0].mental_health.mean).to.eql("suppressed");
            expect(race[0].mental_health.count).to.eql("68");
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
            var race = sortByKey(q0.Yes.race,'name',true);
            expect(race[5].name).to.eql("Native Hawaiian/other PI");
            expect(race[5].mental_health.mean).to.eql("suppressed");
            expect(race[5].mental_health.count).to.eql("17");

            expect(race[1].name).to.eql("Asian");
            expect(race[1].mental_health.mean).to.eql("38.6");
            expect(race[1].mental_health.count).to.eql("79");

            expect(race[2].name).to.eql("Black or African American");
            expect(race[2].mental_health.mean).to.not.eql("suppressed");
            expect(race[2].mental_health.count).to.eql("417");
        });
    });

    it("invokeYRBS service for advanced results with sexid filter for chart - supressed values set to -1 if value < 30", function (){
        var apiQuery = { "searchFor":"mental_health", "isChartorMapQuery":true, "query":{"year":{"key":"year","queryKey":"year","value":["2015"],"primary":false},
            "sexid":{"key":"sexid","queryKey":"sexid","value":["Heterosexual"],"primary":false},
            "question.path":{"key":"question","queryKey":"question.key","value":["qn64"],"primary":false}},"aggregations":{"simple":[],
            "nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"yrbsRace","queryKey":"race","size":0}],
                "charts":[], "maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}}, "pagination":{"from":0,"size":10000}};
        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q0=resp.table.question[0];
            var race = sortByKey(q0.Yes.race,'name',true);
            expect(race[5].name).to.eql("Native Hawaiian/other PI");
            expect(race[5].mental_health.mean).to.eql("-1");
            expect(race[5].mental_health.count).to.eql("17");

            expect(race[1].name).to.eql("Asian");
            expect(race[1].mental_health.mean).to.eql("38.6");
            expect(race[1].mental_health.count).to.eql("79");
        });
    });

    it("invokeYRBS service for brfss for suppressed data", function (){
        var apiQuery = {basicSearch:true, "searchFor":"brfss","query":{"year":{"key":"year","queryKey":"year","value":["2015"],"primary":false},"sitecode":{"key":"state","queryKey":"sitecode","value":["AL"],"primary":false},"question.path":{"key":"question","queryKey":"question.key","value":["drnkany5","x_rfbing5","x_rfdrhv5"],"primary":false}},"aggregations":{"simple":[],"nested":{"table":[{"key":"question","queryKey":"question.key","size":0},{"key":"race","queryKey":"race","size":0}],"charts":[],"maps":[[{"key":"states","queryKey":"state","size":0},{"key":"sex","queryKey":"sex","size":0}]]}},"pagination":{"from":0,"size":10000}};
        return yrbs.invokeYRBSService(apiQuery).then( function (resp) {
            var q = resp.table.question[0];
            var yesReponse = q['yes'];
            //suppressed
            expect(yesReponse.race[3].name).to.eql("Asian");
            expect(yesReponse.race[3].brfss.mean).to.eql("suppressed");
            expect(yesReponse.race[3].brfss.ci_l).to.eql(0);
            expect(yesReponse.race[3].brfss.ci_u).to.eql(0);
            expect(yesReponse.race[3].brfss.count).to.eql(11);

            //No response
            expect(yesReponse.race[0].name).to.eql("NHOPI");
            expect(yesReponse.race[0].brfss.mean).to.eql("na");
            expect(yesReponse.race[0].brfss.ci_l).to.eql(0);
            expect(yesReponse.race[0].brfss.ci_u).to.eql(0);
            expect(yesReponse.race[0].brfss.count).to.eql(0);

            //valid response
            expect(yesReponse.race[4].name).to.eql("Other Race");
            expect(yesReponse.race[4].brfss.mean).to.eql(32.9);
            expect(yesReponse.race[4].brfss.ci_l).to.eql(15.1);
            expect(yesReponse.race[4].brfss.ci_u).to.eql(50.7);
            expect(yesReponse.race[4].brfss.count).to.eql(15);

        });
    });

    it("getYRBSQuestionsTree from yrbs service", function (){
        return yrbs.getYRBSQuestionsTree().then(function (response) {
            expect(response.questionTree[0].text).to.eql("Alcohol and Other Drug Use");
            expect(response.questionTree[0].children.length).to.eql(20);
            expect(response.questionTree[0].children[0].id).to.eql('qn42');
            expect(response.questionTree[0].children[0].text).to.eql('Currently drank alcohol(at least one drink of alcohol, on at least 1 day during the 30 days before the survey)');

            expect(response.questionTree[7].text).to.eql("Unintentional Injuries and Violence");
            expect(response.questionTree[6].text).to.eql("Tobacco Use");
            expect(response.questionTree[0].text).to.eql("Alcohol and Other Drug Use");
            expect(response.questionTree[5].text).to.eql("Sexual Behaviors");
            expect(response.questionTree[2].text).to.eql("Obesity, Overweight, and Weight Control");
            expect(response.questionTree[1].text).to.eql("Dietary Behaviors");
            expect(response.questionTree[4].text).to.eql("Physical Activity");
            expect(response.questionTree[3].text).to.eql("Other Health Topics");
            //Childrens are in alphabetical order
            expect(response.questionTree[7].children[0].text).to.eql("Attempted suicide(one or more times during the 12 months before the survey)");
            expect(response.questionTree[7].children[1].text).to.eql("Carried a gun(on at least 1 day during the 12 months before the survey, not counting the days when they carried a gun only for hunting or for a sport such as target shooting)");
            expect(response.questionTree[7].children[2].text).to.eql("Carried a weapon on school property(such as a gun, knife, or club, on at least 1 day during the 30 days before the survey)");
            expect(response.questionTree[7].children[3].text).to.eql("Carried a weapon(such as a gun, knife, or club, on at least 1 day during the 30 days before the survey)");
            expect(response.questionTree[7].children[4].text).to.eql("Did not go to school because they felt unsafe at school or on their way to or from school(on at least 1 day during the 30 days before the survey)");

            //Verify questionsList
            expect(response.questionsList[0].qkey).to.eql("qn10");
            expect(response.questionsList[0].title).to.eql("Drove a car or other vehicle when they had been drinking alcohol(in a car or other vehicle, one or more times during the 30 days before the survey, among students who had driven a car or other vehicle during the 30 days before the survey)");
            expect(response.questionsList[1].qkey).to.eql("qn11");
            expect(response.questionsList[0].title).to.eql("Drove a car or other vehicle when they had been drinking alcohol(in a car or other vehicle, one or more times during the 30 days before the survey, among students who had driven a car or other vehicle during the 30 days before the survey)");
            expect(response.questionsList[1].title).to.eql("Texted or e-mailed while driving a car or other vehicle(on at least 1 day during the 30 days before the survey, among students who had driven a car or other vehicle during the 30 days before the survey)");
        });
    });

    it("should get prams questions tree for pre-computed data", function (){
        return yrbs.getPramsBasicQuestionsTree().then(function (response) {

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

            yrbs.getPramsBasicQuestionsTree().then(function (cachedResponse) {
                expect(JSON.stringify(response)).to.eql(JSON.stringify(cachedResponse));
            });
        });
    });

    it("should get prams questions tree for raw data", function (){
        return yrbs.getPramsAdvanceQuestionsTree().then(function (response) {

            expect(response.questionTree[0].text).to.eql("Abuse - Physical");
            expect(response.questionTree[0].children.length).to.eql(3);
            expect(response.questionTree[0].children[0].text).to.eql("(*PCH) During the 12 months before you got pregnant, did your husband or partner push, hit, slap, kick, choke, or physically hurt you in any other way?");

            expect(response.questionTree[1].text).to.eql("Alcohol Use");
            expect(response.questionTree[1].children.length).to.eql(7);
            expect(response.questionTree[1].children[0].text).to.eql("(*PCH) Indicator of drinking alcohol during the three months before pregnancy");
            expect(response.questionTree[1].children[6].text).to.eql("Indicator of whether mother reported having any alcoholic drinks during the last 3 months of pregnancy");

            expect(response.questionTree[2].text).to.eql("Assisted Reproduction");
            expect(response.questionTree[2].children.length).to.eql(1);
            expect(response.questionTree[2].children[0].text).to.eql("(*PCH) Indicator of receiving any fertility drugs or treatment");

            //39 topics
            expect(response.questionTree.length).to.eql(39);
            //185 questions
            expect(response.questionsList.length).to.eql(185);

            yrbs.getPramsAdvanceQuestionsTree().then(function (cachedResponse) {
                expect(JSON.stringify(response)).to.eql(JSON.stringify(cachedResponse));
            });
        });
    });

    it("should get brfss questions tree", function (){
        return yrbs.getBRFSQuestionsTree().then(function (response) {
            expect(response.questionTree[0].text).to.eql("Aerobic Activity");
            expect(response.questionTree[0].children.length).to.eql(2);
            expect(response.questionTree[0].children[0].text).to.eql("Participated in 150 minutes or more of Aerobic Physical Activity per week (variable calculated from one or more BRFSS questions)");

            expect(response.questionTree[2].text).to.eql("Alcohol Consumption");
            expect(response.questionTree[2].children.length).to.eql(1);
            expect(response.questionTree[2].children[0].text).to.eql("Adults who have had at least one drink of alcohol within the past 30 days");

            expect(response.questionTree.length).to.eql(64);
            expect(response.questionsList.length).to.eql(97);

            yrbs.getBRFSQuestionsTree().then(function (cachedResponse) {
                return expect(JSON.stringify(response)).to.eql(JSON.stringify(cachedResponse));
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
