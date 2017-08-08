var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var commonPage = require('../support/commonpage.po');
var documentationPage = require('../support/data_documentation.po');

var dataDocumentationStepDefinitions = function () {

    this.setDefaultTimeout(600000);

    this.Then(/^I see data documentation link$/, function (next) {
        documentationPage.getDocumentationLink().getText().then(function (text) {
            expect(text).to.equal('Data Documentation');
        }).then(next);
    });

    this.When(/^I click on data documentation link$/, function (next) {
        documentationPage.getDocumentationLink().click().then(next)
    });

    this.Then(/^I see details about natality dataset$/, function () {
        //dataset
        expect(element(by.className('dataset-name')).getText()).to.eventually.equal('Natality');
        //datsset description
        expect(element(by.binding('dataset.dataDescription')).getText()).to.eventually.equal("This dataset has counts and rates of births occurring within the United States to U.S. residents and nonresidents. State and county are defined by the mother's place of residence recorded on the birth certificate. Data elements include demographics, and maternal risk factors. Population is Live Births in United States.");
        //source
        return expect(element(by.binding('dataset.source')).getText()).to.eventually.equal("The Natality data set is provided by the U.S. Department of Health and Human Services (US HHS), Centers for Disease Control and Prevention (CDC), National Center for Health Statistics (NCHS).");
    });

    this.When(/^I click on explore dataset button$/, function (next) {
        element(by.className('explore-dataset-btn')).click().then(next);
    });

    this.Then(/^I see I am being redirected to natality page$/, function () {
        return commonPage.getSelectedFilterType().then(function (text) {
            return expect(text).to.equal('Natality');
        });
    });
};

module.exports = dataDocumentationStepDefinitions;
