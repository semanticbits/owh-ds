var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var factsheetsDefinitionsWrapper = function () {

    this.setDefaultTimeout(600000);

    var fsp = require('../support/factsheets.po')

    this.When(/^I navigate to factsheets page$/, function () {
        return browser.get("/factsheets");
    });

    this.Then(/^I should get factsheets page$/, function () {
        expect(fsp.pageHeading.isDisplayed()).to.eventually.equal(true);
        expect(fsp.pageDescription.isDisplayed()).to.eventually.equal(true);
        expect(fsp.stateSelectBox.isDisplayed()).to.eventually.equal(true);
        expect(fsp.typeSelectBox.isDisplayed()).to.eventually.equal(true);
        return expect(fsp.generateFactSheetLink.isDisplayed()).to.eventually.equal(true);
    });

    this.When(/^I click on generate fact sheet link$/, function (next) {
        fsp.generateFactSheetLink.click()
            .then(next);
    });

    this.Then(/^generated data should be displayed on same factsheets page$/, function (next) {
        /*var until = protractor.ExpectedConditions;
        browser.wait(until.presenceOf(element(by.id('bridge-race-table1'))), 25000, 'PDF generation taking too long.....');
        */
        expect(element(by.className('state-heading')).isDisplayed()).to.eventually.equal(true);
        expect(element(by.className('state-heading')).getText()).to.eventually.equal("Maryland");
        expect(element(by.className('bridge-race-heading')).getText()).to.eventually.equal("Population in Maryland");
        expect(element(by.className('bridge-race-heading')).getText()).to.eventually.equal("Population in Maryland");
        fsp.getTableHeaders('bridge-race-table1').then(function(headers) {
            expect(headers[0]).to.contains('Racial Distributions of Residents*');
            expect(headers[1]).to.contains('Total');
            expect(headers[2]).to.contains('Black, non-Hispanic');
            expect(headers[3]).to.contains('White, non-Hispanic');
            expect(headers[4]).to.contains('American Indian');
            expect(headers[5]).to.contains('Asian/Pacific Islander');
            expect(headers[6]).to.contains('Hispanic');
        });
        fsp.getTableCellData('bridge-race-table1', 0,1).then(function(data){
            expect(data).to.contains('6,006,401');
        });
        fsp.getTableHeaders('detail-mortality-table').then(function(headers){
            expect(headers[0]).to.contains('Cause of Death');
            expect(headers[1]).to.contains('Number of Deaths');
            expect(headers[2]).to.contains('Age-Adjusted Death Rate (per 100,000)');
        });
        fsp.getTableCellData('detail-mortality-table', 0,1).then(function(data){
             expect(data).to.contains('47,247');
        });
        fsp.getTableHeaders('infant-mortality-table').then(function(headers){
            expect(headers[0]).to.contains('Deaths');
            expect(headers[1]).to.contains('Births');
            expect(headers[2]).to.contains('Death Rate');
        });
        fsp.getTableCellData('infant-mortality-table', 0,0).then(function(data){
            expect(data).to.contains('480');
        });
        fsp.getTableRowData('prams-table-1', 0).then(function(data){
            expect(data[0]).to.contains('Smoking cigarettes during the last three months of pregnancy');
            expect(data[1]).to.contains('9.1%');
        });
        fsp.getTableRowData('brfss-table', 0).then(function(data){
            expect(data[0]).to.contains('Were Obese (BMI 30.0 - 99.8)');
            expect(data[1]).to.contains('29.8%');
        });
        fsp.getTableRowData('yrbs-table', 0).then(function(data){
            expect(data[0]).to.contains('Currently use alcohol');
            expect(data[1]).to.contains('26.1%');
        });
        fsp.getTableRowData('natality-table', 0).then(function(data){
            expect(data[0]).to.contains('Births');
            expect(data[1]).to.contains('73,616');
        });
        fsp.getTableHeaders('tb-table').then(function(headers){
            expect(headers[0]).to.contains('Total Cases (Rates)');
            expect(headers[1]).to.contains('American Indian or Alaska Native');
            expect(headers[2]).to.contains('Asian');
            expect(headers[3]).to.contains('Black or African American');
            expect(headers[4]).to.contains('Hispanic or Latino');
            expect(headers[5]).to.contains('Multiple races');
            expect(headers[6]).to.contains('Native Hawaiian or Other Pacific Islander');
            expect(headers[7]).to.contains('White');
        });
        fsp.getTableCellData('tb-table', 0,0).then(function(data){
            expect(data).to.contains('176 (2.9)');
        });
        fsp.getTableHeaders('std-table').then(function(headers){
            expect(headers[0]).to.contains('Disease');
            expect(headers[1]).to.contains('Total Cases (Rates)');
            expect(headers[2]).to.contains('American Indian or Alaska Native');
            expect(headers[3]).to.contains('Asian');
            expect(headers[4]).to.contains('Black or African American');
            expect(headers[5]).to.contains('Hispanic or Latino');
            expect(headers[6]).to.contains('Multiple races');
            expect(headers[7]).to.contains('Native Hawaiian or Other Pacific Islander');
            expect(headers[8]).to.contains('White');
        });
        fsp.getTableCellData('std-table', 0, 1).then(function(data){
            expect(data).to.contains('27,450 (459.3)');
        });
        fsp.getTableHeaders('hiv-table').then(function(headers){
            expect(headers[0]).to.contains('Indicator');
            expect(headers[1]).to.contains('Total Cases (Rates)');
            expect(headers[2]).to.contains('American Indian or Alaska Native');
            expect(headers[3]).to.contains('Asian');
            expect(headers[4]).to.contains('Black or African American');
            expect(headers[5]).to.contains('Hispanic or Latino');
            expect(headers[6]).to.contains('Multiple races');
            expect(headers[7]).to.contains('Native Hawaiian or Other Pacific Islander');
            expect(headers[8]).to.contains('White');
        });
        fsp.getTableCellData('hiv-table', 0, 1).then(function(data){
            expect(data).to.contains('660 (13.1)');
        });
        fsp.getTableHeaders('cancer-table').then(function(headers){
            expect(headers[0]).to.contains('Cancer Site');
            expect(headers[1]).to.contains('Population');
            expect(headers[2]).to.contains('Count');
            expect(headers[3]).to.contains('Incidence Crude Rates (per 100,000)');
            expect(headers[4]).to.contains('Deaths');
            expect(headers[5]).to.contains('Mortality Crude Rates (per 100,000)');
        });
        fsp.getTableCellData('cancer-table', 0, 1).then(function(data){
            expect(data).to.contains('5,975,346');
        }).then(next);

    });
};
module.exports = factsheetsDefinitionsWrapper;