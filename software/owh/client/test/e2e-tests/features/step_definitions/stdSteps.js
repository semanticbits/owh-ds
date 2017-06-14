var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var stdStepDefinitionsWrapper = function () {

    this.setDefaultTimeout(30000);
    var stdPage = require('../support/stdpage.po');

    this.When(/^I look at the STD data table$/, function () {
        var dtTableHeaders = stdPage.getTableHeaders();
        expect(dtTableHeaders).to.eventually.contains('Race/Ethnicity');
        expect(dtTableHeaders).to.eventually.contains('Female');
        expect(dtTableHeaders).to.eventually.contains('Male');
        return expect(dtTableHeaders).to.eventually.contains('Both sexes');
    });

    this.Then(/^I see the Rates, Population and Cases as outputs in the STD data table$/, function (next) {
        stdPage.getTableRowData(0).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('All races/ethnicities');
            //Female
            expect(firstRowData[1]).to.contains('Rate');
            expect(firstRowData[1]).to.contains('645.5');
            expect(firstRowData[1]).to.contains('Cases');
            expect(firstRowData[1]).to.contains('1,045,143');
            expect(firstRowData[1]).to.contains('Population');
            expect(firstRowData[1]).to.contains('161,920,569');
            //Male
            expect(firstRowData[2]).to.contains('Rate');
            expect(firstRowData[2]).to.contains('305.2');
            expect(firstRowData[2]).to.contains('Cases');
            expect(firstRowData[2]).to.contains('478,981');
            expect(firstRowData[2]).to.contains('Population');
            expect(firstRowData[2]).to.contains('156,936,487');
            //Both sexes
            expect(firstRowData[3]).to.contains('Rate');
            expect(firstRowData[3]).to.contains('478.8');
            expect(firstRowData[3]).to.contains('Cases');
            expect(firstRowData[3]).to.contains('1,526,658');
            expect(firstRowData[3]).to.contains('Population');
            expect(firstRowData[3]).to.contains('318,857,056');
        });
        stdPage.getTableRowData(1).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('American Indian or Alaska Native');
            //Female
            expect(firstRowData[1]).to.contains('1,001.4');
            expect(firstRowData[1]).to.contains('10,170');
            expect(firstRowData[1]).to.contains('1,015,540');
            //Male
            expect(firstRowData[2]).to.contains('297.8');
            expect(firstRowData[2]).to.contains('2,940');
            expect(firstRowData[2]).to.contains('987,119');
            //Both sexes
            expect(firstRowData[3]).to.contains('654.8');
            expect(firstRowData[3]).to.contains('13,113');
            expect(firstRowData[3]).to.contains('2,002,659');
        }).then(next);
    });

    this.Then(/^filter "([^"]*)" under STD "([^"]*)" should be a "([^"]*)"$/, function (arg1, arg2, arg3) {
        return expect(element(by.id("std_"+arg2+"_"+arg1)).getAttribute("type")).to.eventually.equal(arg3);
    });

    this.When(/^I look at the sidebar$/, function () {
        return expect(stdPage.owhSideFilters.isPresent()).to.eventually.equal(true);
    });

    this.When(/^I expand each STD filter$/, function (next) {
        //Expand all filters expect 'Disease' and 'Year' - These are already expanded
        element(by.partialLinkText("Sex")).click();
        element(by.partialLinkText("Race/Ethnicity")).click();
        element(by.partialLinkText("Age Groups")).click();
        element(by.partialLinkText("State")).click()
            .then(next);
    });

    this.Then(/^every STD filter must have Radio buttons under then$/, function () {
        //Disease
        expect(element(by.id("std_disease_Chlamydia")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_disease_Gonorrhea")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_disease_Primary and Secondary Syphilis")).getAttribute("type")).to.eventually.equal("radio");
        //Year
        expect(element(by.id("std_current_year_2015")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_current_year_2014")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_current_year_2013")).getAttribute("type")).to.eventually.equal("radio");
        //Sex
        expect(element(by.id("std_sex_Both sexes")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_sex_Female")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_sex_Male")).getAttribute("type")).to.eventually.equal("radio");
        //Race/Ethnicity
        expect(element(by.id("std_race_All races/ethnicities")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_race_American Indian or Alaska Native")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_race_Asian")).getAttribute("type")).to.eventually.equal("radio");
        //Age Groups
        expect(element(by.id("std_age_group_All age groups")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_age_group_Age 15 and older")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_age_group_0-4")).getAttribute("type")).to.eventually.equal("radio");
        //State
        expect(element(by.id("std_state_National")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_state_AL")).getAttribute("type")).to.eventually.equal("radio");
        return expect(element(by.id("std_state_AK")).getAttribute("type")).to.eventually.equal("radio");
    });

    this.When(/^I click on Rate chart view toggle button$/, function (next) {
         element(by.cssContainingText('span', 'Rate')).click()
             .then(next);
    });

    this.Then(/^I should see grouped and stacked controls on expaned visualization$/, function () {
        expect(element(by.className('nv-controlsWrap ')).isPresent()).to.eventually.equal(true);
        expect(element(by.cssContainingText('text', 'Grouped')).isDisplayed()).to.eventually.equal(true);
        return expect(element(by.cssContainingText('text', 'Stacked')).isDisplayed()).to.eventually.equal(true);
    });

    this.Then(/^I should not see grouped and stacked controls on expaned visualization$/, function () {
        expect(element(by.cssContainingText('text', 'Grouped')).isPresent()).to.eventually.equal(false);
        return expect(element(by.cssContainingText('text', 'Stacked')).isPresent()).to.eventually.equal(false);
    });
};

module.exports = stdStepDefinitionsWrapper;