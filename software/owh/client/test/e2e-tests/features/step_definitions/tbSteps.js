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
            expect(firstRowData[1]).to.contains('2.3');
            expect(firstRowData[1]).to.contains('Cases');
            expect(firstRowData[1]).to.contains('3,827');
            expect(firstRowData[1]).to.contains('Population');
            expect(firstRowData[1]).to.contains('163,189,523');
            //Male
            expect(firstRowData[2]).to.contains('Rate');
            expect(firstRowData[2]).to.contains('3.6');
            expect(firstRowData[2]).to.contains('Cases');
            expect(firstRowData[2]).to.contains('5,724');
            expect(firstRowData[2]).to.contains('Population');
            expect(firstRowData[2]).to.contains('158,229,297');
            //Both sexes
            expect(firstRowData[3]).to.contains('Rate');
            expect(firstRowData[3]).to.contains('3.0');
            expect(firstRowData[3]).to.contains('Cases');
            expect(firstRowData[3]).to.contains('9,554');
            expect(firstRowData[3]).to.contains('Population');
            expect(firstRowData[3]).to.contains('321,418,820');
        });
        tbPage.getTableRowData(1).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('American Indian or Alaska Native');
            //Female
            expect(firstRowData[1]).to.contains('4.7');
            expect(firstRowData[1]).to.contains('57');
            expect(firstRowData[1]).to.contains('1,201,860');
            //Male
            expect(firstRowData[2]).to.contains('7.5');
            expect(firstRowData[2]).to.contains('88');
            expect(firstRowData[2]).to.contains('1,167,974');
            //Both sexes
            expect(firstRowData[3]).to.contains('6.1');
            expect(firstRowData[3]).to.contains('145');
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
        tbPage.getElementContainingText("Country of Birth").click();
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
        //Transmission
        expect(element(by.id("tb_transmission_No stratification")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_transmission_Foreign-born")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_transmission_US-born")).getAttribute("type")).to.eventually.equal("radio");
        //State
        expect(element(by.id("tb_state_National")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("tb_state_AL")).getAttribute("type")).to.eventually.equal("radio");
        return expect(element(by.id("tb_state_AK")).getAttribute("type")).to.eventually.equal("radio");
    });

    this.Then(/^I see country of birth results on data table$/, function (next) {
        tbPage.getTableRowData(0).then(function(rowData){
            expect(rowData[0]).to.equals('All countries of birth');
            expect(rowData[1]).to.equals('All races/ethnicities');
            //Female
            expect(rowData[2]).to.contains('Rate');
            expect(rowData[2]).to.contains('2.3');
            expect(rowData[2]).to.contains('Cases');
            expect(rowData[2]).to.contains('3,827');
            expect(rowData[2]).to.contains('Population');
            expect(rowData[2]).to.contains('163,189,523');
            //Male
            expect(rowData[3]).to.contains('Rate');
            expect(rowData[3]).to.contains('3.6');
            expect(rowData[3]).to.contains('Cases');
            expect(rowData[3]).to.contains('5,724');
            expect(rowData[3]).to.contains('Population');
            expect(rowData[3]).to.contains('158,229,297');
            //Both sexes
            expect(rowData[4]).to.contains('Rate');
            expect(rowData[4]).to.contains('3.0');
            expect(rowData[4]).to.contains('Cases');
            expect(rowData[4]).to.contains('9,554');
            expect(rowData[4]).to.contains('Population');
            expect(rowData[4]).to.contains('321,418,820');
        });
        tbPage.getTableRowData(9).then(function(rowData){
            expect(rowData[0]).to.equals('Foreign-born');
            expect(rowData[1]).to.equals('All races/ethnicities');
            //Female
            expect(rowData[2]).to.contains('Not Applicable');
            expect(rowData[2]).to.contains('2,680');
            expect(rowData[2]).to.contains('Not Available');
            //Male
            expect(rowData[3]).to.contains('Not Applicable');
            expect(rowData[3]).to.contains('3,665');
            expect(rowData[3]).to.contains('Not Available');
            //Both sexes
            expect(rowData[4]).to.contains('Not Applicable');
            expect(rowData[4]).to.contains('6,347');
            expect(rowData[4]).to.contains('Not Available');
        });
        tbPage.getTableRowData(10).then(function(rowData){
            expect(rowData[0]).to.equals('American Indian or Alaska Native');
            //Female
            expect(rowData[1]).to.contains('Suppressed');
            expect(rowData[1]).to.contains('Not Available');
            //Male
            expect(rowData[2]).to.contains('Suppressed');
            expect(rowData[2]).to.contains('Not Available');
            //Both sexes
            expect(rowData[3]).to.contains('Suppressed');
            expect(rowData[3]).to.contains('Not Available');
        });
        tbPage.getTableRowData(11).then(function(rowData){
            expect(rowData[0]).to.equals('Asian');
            //Female
            expect(rowData[1]).to.contains('1,333');
            expect(rowData[1]).to.contains('Not Available');
            expect(rowData[1]).to.contains('Not Applicable');
            //Male
            expect(rowData[2]).to.contains('1,698');
            expect(rowData[2]).to.contains('Not Available');
            expect(rowData[2]).to.contains('Not Applicable');
            //Both sexes
            expect(rowData[3]).to.contains('3,032');
            expect(rowData[3]).to.contains('Not Available');
            expect(rowData[3]).to.contains('Not Applicable');
        });
        tbPage.getTableRowData(18).then(function(rowData){
            expect(rowData[0]).to.equals('US-born');
            expect(rowData[1]).to.equals('All races/ethnicities');
            //Female
            expect(rowData[2]).to.contains('Not Applicable');
            expect(rowData[2]).to.contains('1,141');
            expect(rowData[2]).to.contains('Not Available');
            //Male
            expect(rowData[3]).to.contains('Not Applicable');
            expect(rowData[3]).to.contains('2,044');
            expect(rowData[3]).to.contains('Not Available');
            //Both sexes
            expect(rowData[4]).to.contains('Not Applicable');
            expect(rowData[4]).to.contains('3,186');
            expect(rowData[4]).to.contains('Not Available');
        });
        tbPage.getTableRowData(19).then(function(rowData){
            expect(rowData[0]).to.equals('American Indian or Alaska Native');
            //Female
            expect(rowData[1]).to.contains('55');
            expect(rowData[1]).to.contains('Not Available');
            expect(rowData[1]).to.contains('Not Applicable');
            //Male
            expect(rowData[2]).to.contains('85');
            expect(rowData[2]).to.contains('Not Available');
            expect(rowData[2]).to.contains('Not Applicable');
            //Both sexes
            expect(rowData[3]).to.contains('140');
            expect(rowData[3]).to.contains('Not Available');
            expect(rowData[3]).to.contains('Not Applicable');
        }).then(next);
    });

    this.When(/^I select Alabama state from tb state filter$/, function (next) {
        element.all(by.css('label[for=tb_state_AL]')).then(function(elements, index) {
            elements[1].click();
        }).then(next);
    });

    this.When(/^I select National state option from tb state filter$/, function (next) {
        element.all(by.css('label[for=tb_state_National]')).then(function(elements, index) {
            elements[1].click();
        }).then(next);
    });
};

module.exports = tbStepDefinitionsWrapper;