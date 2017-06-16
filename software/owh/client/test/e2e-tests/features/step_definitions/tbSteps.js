var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var tbStepDefinitionsWrapper = function () {

    this.setDefaultTimeout(30000);
    var tbPage = require('../support/tb.po');

    this.When(/^I look at the TB data table$/, function () {
        var dtTableHeaders = tbPage.getTableHeaders();
        expect(dtTableHeaders).to.eventually.contains('Race/Ethnicity');
        expect(dtTableHeaders).to.eventually.contains('Female');
        expect(dtTableHeaders).to.eventually.contains('Male');
        return expect(dtTableHeaders).to.eventually.contains('Both sexes');
    });

    this.Then(/^I see the Rates, Population and Cases as outputs in the TB data table$/, function (next) {
        tbPage.getTableRowData(0).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('All races/ethnicities');
            //Female
            expect(firstRowData[1]).to.contains('Rate');
            expect(firstRowData[1]).to.contains('4.7');
            expect(firstRowData[1]).to.contains('Cases');
            expect(firstRowData[1]).to.contains('7,648');
            expect(firstRowData[1]).to.contains('Population');
            expect(firstRowData[1]).to.contains('163,189,523');
            //Male
            expect(firstRowData[2]).to.contains('Rate');
            expect(firstRowData[2]).to.contains('7.2');
            expect(firstRowData[2]).to.contains('Cases');
            expect(firstRowData[2]).to.contains('11,433');
            expect(firstRowData[2]).to.contains('Population');
            expect(firstRowData[2]).to.contains('158,229,297');
            //Both sexes
            expect(firstRowData[3]).to.contains('Rate');
            expect(firstRowData[3]).to.contains('5.9');
            expect(firstRowData[3]).to.contains('Cases');
            expect(firstRowData[3]).to.contains('19,087');
            expect(firstRowData[3]).to.contains('Population');
            expect(firstRowData[3]).to.contains('321,418,820');
        });
        tbPage.getTableRowData(1).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('American Indian or Alaska Native');
            //Female
            expect(firstRowData[1]).to.contains('9.4');
            expect(firstRowData[1]).to.contains('113');
            expect(firstRowData[1]).to.contains('1,201,860');
            //Male
            expect(firstRowData[2]).to.contains('14.8');
            expect(firstRowData[2]).to.contains('173');
            expect(firstRowData[2]).to.contains('1,167,974');
            //Both sexes
            expect(firstRowData[3]).to.contains('12.1');
            expect(firstRowData[3]).to.contains('286');
            expect(firstRowData[3]).to.contains('2,369,834');
        }).then(next);
    });

    this.Then(/^filter "([^"]*)" under TB "([^"]*)" should be a "([^"]*)"$/, function (arg1, arg2, arg3) {
        return expect(element(by.id("tb_"+arg2+"_"+arg1)).getAttribute("type")).to.eventually.equal(arg3);
    });

    this.When(/^I expand each TB filter$/, function (next) {
        tbPage.getElementContainingText("Sex").click();
        tbPage.getElementContainingText("Race/Ethnicity").click();
        tbPage.getElementContainingText("Age Groups").click();
        tbPage.getElementContainingText("State").click()
            .then(next);
    });

    this.Then(/^every TB filter must have Radio buttons under then$/, function () {

        //Year
        expect(element(by.id("tb_current_year_2015")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_current_year_2014")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_current_year_2013")).getAttribute("type")).to.eventually.equal("radio");
        //Sex
        expect(element(by.id("tb_sex_Both sexes")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_sex_Female")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_sex_Male")).getAttribute("type")).to.eventually.equal("radio");
        //Race/Ethnicity
        expect(element(by.id("tb_race_All races/ethnicities")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_race_American Indian or Alaska Native")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_race_Asian")).getAttribute("type")).to.eventually.equal("radio");
        //Age Groups
        expect(element(by.id("tb_age_group_All age groups")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_age_group_Age 15 and older")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_age_group_0-4")).getAttribute("type")).to.eventually.equal("radio");
        //State
        expect(element(by.id("tb_state_National")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_state_AL")).getAttribute("type")).to.eventually.equal("radio");
        return expect(element(by.id("tb_state_AK")).getAttribute("type")).to.eventually.equal("radio");
    });
};

module.exports = tbStepDefinitionsWrapper;