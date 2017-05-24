var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var PRAMSStepDefinitionsWrapper = function () {

    this.setDefaultTimeout(600000);
    var pramsPage = require('../support/prams.po');

    this.When(/^I select PRAMS as primary filter$/, function (next) {
        pramsPage.pramsOption.click().then(next);
    });

    this.Then(/^I see 'By' filter pre\-selected with State and Question$/, function () {
        var ele = element(by.css('span.ui-select-match'));
        return expect(ele.getText()).to.eventually.equal(' ×\nState\n ×\nQuestion');
    });

    this.Then(/^I see class\- Delivery$/, function () {
        var selectedClass = pramsPage.getSelectedPramsClass();
        return expect(selectedClass.getText()).to.eventually.equal('Delivery');
    });

    this.Then(/^I see state data displayed in data table$/, function (next) {
        //table headers
        pramsPage.getTableHeadData(0).then(function (value) {
            expect(value).to.contains('Question');
            expect(value).to.contains('Response');
            expect(value).to.contains('Alabama');
            expect(value).to.contains('Alaska');
            expect(value).to.contains('Arizona');
        });

        //data
        var dataRow = pramsPage.dataTable.all(by.tagName('tbody')).get(8)
            .all(by.tagName('tr')).get(1).all(by.tagName('td'));

        dataRow.getText().then(function (data) {
            expect(data[0]).to.contains('Indicator of no insurance to pay for delivery');
            expect(data[1]).to.contains('NO (UNCHECKED)');
            //Alabama
            expect(data[2]).to.contains('Not Available');
            //Alaska
            expect(data[3]).to.contains('97.4');
            //Arizona
            expect(data[4]).to.contains('Not Available');
        }).then(next);
    });

    this.When(/^I click on "([^"]*)" questions link$/, function (text, next) {
        element(by.cssContainingText('a.owh-question__show', text)).click().then(next);
    });

    this.When(/^I click on chart icon for 'Indicator of whether delivery was paid for by insurance purchased directly question'$/, function (next) {
        element(by.id('qn366')).click().then(next)
    });

    this.Then(/^I see chart being displayed for "([^"]*)" question$/, function (text, next) {
        var header= pramsPage.getChartHeader();
        header.getText().then(function (text) {
            expect(text).to.equal(text);
        }).then(next);
    });

    this.Then(/^I see axis labels for chart\- state and Percentage$/, function (next) {
        var axisLabels = pramsPage.getChartAxis();
        axisLabels[0].getText().then(function (text) {
            expect(text).to.equal('State');
        });
        axisLabels[1].getText().then(function (text) {
            expect(text).to.equal('Percentage');
        }).then(next);
    });

    this.Then(/^I close chart dialog$/, function (next) {
        element(by.css('a[name=close]')).click().then(next);
    });

    this.When(/^I change class to "([^"]*)"$/, function (clazz) {
        return pramsPage.updateClassTo(clazz)
    });

    this.When(/^I see topics Household Characteristics and Income displayed in side filter$/, function (next) {

        element.all(by.css('label[for*=prams_topic_]')).then(function(topics, index) {
            expect(topics.length).to.equal(2);
            expect(topics[0].getText()).to.eventually.contains('Household Characteristics');
            expect(topics[1].getText()).to.eventually.contains('Income');
        }).then(next);
    });

    this.Then(/^I see only "([^"]*)" topic in data table$/, function (topic) {
        return expect(element(by.className('owh-question__title')).getText()).to.eventually.contains(topic);
    });
};

module.exports = PRAMSStepDefinitionsWrapper;