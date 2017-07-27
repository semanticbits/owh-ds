var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var aidsPage = require('../support/aids.po');
var commonPage = require('../support/commonpage.po');

var aidsStepDefinitions = function () {
    this.setDefaultTimeout(600000);

    this.Then(/^On the aids page, I should see the filters "([^"]*)" in order$/, function (expected_filters, next) {
        var expected = expected_filters.split(', ');
        aidsPage.getFilters().then(function (filters) {
            filters.forEach(function (filter, index) {
                expect(filter).to.equal(expected[index]);
            });
        }).then(next);
    });

    this.When(/^On the aids page, I expand the "([^"]*)" filter$/, function (filter) {
        return aidsPage.expandFilter(filter).then(function () {
            return aidsPage.clickMoreOptionsForFilter(filter);
        });
    });

    this.Then(/^On the aids page, I should see "([^"]*)" options for "([^"]*)" filter$/, function (expected_options, filter, next) {
        var expected = expected_options.split(', ');
        aidsPage.getOptionsForFilter(filter).then(function (options) {
            options.forEach(function (option, index) {
                expect(option).to.contain(expected[index]);
            });
        }).then(next);
    });

    this.Then(/^On the aids page, I should see the data table with the headers "([^"]*)"/, function (expected_headers, next) {
        var expected = expected_headers.split(', ');
        aidsPage.getTableHeaders().then(function (headers) {
            headers.forEach(function (header, index) {
                expect(header).to.equal(expected[index]);
            });
        }).then(next);
    });

    this.Then(/^On the aids page, the values in table should match$/, function (next) {
        var row0 = [ 'All races/ethnicities', 'Rate\n3.2\nCases\n4,459\nPopulation\n137,380,626', 'Rate\n10.5\nCases\n13,815\nPopulation\n131,291,099', 'Rate\n6.8\nCases\n18,274\nPopulation\n268,671,725' ]
        var row1 = [ 'American Indian/Alaska Native', '4.0\n39\n980,927', '6.1\n57\n939,994', '5.0\n96\n1,920,921' ]
        aidsPage.getTableRow(0).then(function (values) {
            values.forEach(function (value, index) {
                expect(value).to.equal(row0[index]);
            });
        }).then(function () {
            return aidsPage.getTableRow(1).then(function (values) {
                values.forEach(function (value, index) {
                    expect(value).to.equal(row1[index]);
                });
            }).then(next);
        });
    });

    this.Then(/^I see menu appears with data\-sets options$/, function () {
       return expect(commonPage.secondaryMenu.isDisplayed()).to.eventually.equal(true);
    });

    this.When(/^I click on Aids dataset$/, function () {
        /*element(by.id('aids')).click()
            .then(next);*/

        var elm = element(by.id('aids'));
        return browser.executeScript("arguments[0].click();", elm);
        //elm.click().next(next);
    });
};

module.exports = aidsStepDefinitions;
