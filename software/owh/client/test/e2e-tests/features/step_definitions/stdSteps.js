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
        expect(element(by.id("std_age_group_0-14")).getAttribute("type")).to.eventually.equal("radio");
        //State
        expect(element(by.id("std_state_National")).getAttribute("type")).to.eventually.equal("radio");
        expect(element(by.id("std_state_AL")).getAttribute("type")).to.eventually.equal("radio");
        return expect(element(by.id("std_state_AK")).getAttribute("type")).to.eventually.equal("radio");
    });

    this.When(/^I click on Rate chart view toggle button$/, function (next) {
         element(by.cssContainingText('span', 'Rates')).click()
             .then(next);
    });

    this.Then(/^I should see grouped and stacked controls on expaned visualization$/, function () {
        var ele = element(by.id('chart_expanded_0'));
        browser.executeScript("arguments[0].scrollIntoView();", ele);
        expect(element(by.className('nv-controlsWrap ')).isPresent()).to.eventually.equal(true);
        expect(element(by.cssContainingText('text', 'Grouped')).isDisplayed()).to.eventually.equal(true);
        return expect(element(by.cssContainingText('text', 'Stacked')).isDisplayed()).to.eventually.equal(true);
    });

    this.Then(/^I should not see grouped and stacked controls on expanded visualization$/, function () {
        expect(element(by.cssContainingText('text', 'Grouped')).isPresent()).to.eventually.equal(false);
        return expect(element(by.cssContainingText('text', 'Stacked')).isPresent()).to.eventually.equal(false);
    });

    this.Then(/^std data table should suppress results$/, function (next) {
        stdPage.getTableRowData(5).then(function(rowData){
            expect(rowData[0]).to.equals('Native Hawaiian or Other Pacific Islander');
            //Female
            expect(rowData[1]).to.contains('Suppressed');
            expect(rowData[1]).to.contains('1,096');
            //Male
            expect(rowData[2]).to.contains('Not Available');
            expect(rowData[2]).to.contains('Not Applicable');
            expect(rowData[2]).to.contains('1,168');
            //Both sexes
            expect(rowData[3]).to.contains('Suppressed');
            expect(rowData[3]).to.contains('2,264');
        });
        //Unreliable should not display for STD
        stdPage.getTableRowData(1).then(function(rowData){
            expect(rowData[0]).to.equals('American Indian or Alaska Native');
            //Male
            expect(rowData[2]).to.not.contains('Unreliable');
        });
        //Unreliable should not display for STD
        stdPage.getTableRowData(2).then(function(rowData){
            expect(rowData[0]).to.equals('Asian');
            //Male
            expect(rowData[2]).to.not.contains('Unreliable');
        }).then(next);
    });

    this.When(/^I select "([^"]*)" state in disease related views$/, function (arg1, callback) {
        element.all(by.css('label[for=natality_state_AL]')).then(function(elements, index) {
            elements[1].click();
        }).then(next);
    });

    this.Then(/^expected filters should be disabled for std$/, function (next) {
        //All race filter options expect "All races/ethnicities"
        var expectedRaceFilters = ["American Indian or Alaska Native","Asian","Black or African American","Hispanic or Latino","Native Hawaiian or Other Pacific Islander","White","Multiple races","Unknown","Asian or Pacific Islander","Other"];
        //All Sex filter options except "Both sexes"
        var expectedSexFilters = ["Female", "Male"];
        //All age group options except "All age groups"
        var expectedAgeGroupFilters = ["0-14","15-19","20-24","25-29","30-34","35-39","40-44","45-54","55-64","65+"];
        stdPage.getDisabledFilterOptions("Race/Ethnicity").then(function (options) {
            expect(options.length > 0).equal(true);
            options.forEach(function (option, index) {
                expect(option).to.equal(expectedRaceFilters[index]);
            });
        });
        stdPage.getDisabledFilterOptions("Sex").then(function (options) {
            expect(options.length > 0).equal(true);
            options.forEach(function (option, index) {
                expect(option).to.equal(expectedSexFilters[index]);
            });
        });
        stdPage.getDisabledFilterOptions("Age Groups").then(function (options) {
            expect(options.length > 0).equal(true);
            options.forEach(function (option, index) {
                expect(option).to.equal(expectedAgeGroupFilters[index]);
            });
        }).then(next);
    });

    this.Then(/^"([^"]*)" filter option "([^"]*)" should be disabled for "([^"]*)"$/, function (arg1, arg2, arg3) {
        return expect(element(by.id(arg3+'_'+arg1+'_'+arg2)).getAttribute('disabled')).to.eventually.equal('true');
    });

    this.Given(/^"([^"]*)" filter option "([^"]*)" should be enabled for "([^"]*)"$/, function (arg1, arg2, arg3) {
        return expect(element(by.id(arg3+'_'+arg1+'_'+arg2)).getAttribute('disabled')).to.eventually.equal(null);
    });

    this.Then(/^I see labels "([^"]*)" and "([^"]*)" are displayed on minimized visualization$/, function (arg1, arg2) {
        var labelArray = stdPage.getAxisLabelsForMinimizedVisualization(0,1);
        expect(labelArray[0].getText()).to.eventually.equal(arg1);
        return expect(labelArray[1].getText()).to.eventually.equal(arg2);
    });

    this.Then(/^I see labels "([^"]*)" and "([^"]*)" are displayed on expanded visualization$/, function (arg1, arg2) {
        var labelArray = stdPage.getAxisLabelsForExpandedVisualization(0);
        expect(labelArray[0].getText()).to.eventually.equal(arg1);
        return expect(labelArray[1].getText()).to.eventually.equal(arg2);
    });

    this.Then(/^I close visualization popup$/, function (next) {
        var elm = element(by.cssContainingText('i', 'fullscreen_exit'));
        browser.executeScript("arguments[0].scrollIntoView();", elm);
        elm.click().then(next);
    });

    this.Then(/^all side filters should be enabled$/, function () {
        return expect(element(by.className('cursor-not-allowed')).isPresent()).to.eventually.equal(false);
    });
    this.Then(/^filter "([^"]*)" should be disabled$/, function (arg1, next) {
        var allElements = element.all(by.css('.cursor-not-allowed')).all(By.css('.filter-display-name'));
        allElements.getText().then(function (filters) {
            expect(filters).to.include(arg1);
        }).then(next);
    });

    this.Then(/^the following message should be displayed "([^"]*)" on std page$/, function (arg1) {
        return expect(element(by.id('std-disclaimer')).getText()).to.eventually.equal(arg1);
    });
};

module.exports = stdStepDefinitionsWrapper;