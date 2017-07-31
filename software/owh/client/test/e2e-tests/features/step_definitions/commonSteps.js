var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;
var currentUrl = "";
var previousUrl = "";

var commonStepDefinitionsWrapper = function () {

    this.setDefaultTimeout(600000);
    var commonPage = require('../support/commonpage.po');

    this.Then(/^URL in browser bar should change$/, function (next) {
        browser.getCurrentUrl().then(function(url) {
            expect(url).not.to.equal(browser.baseUrl);
        }).then(next);
    });

    this.Then(/^URL in browser bar should not be base URL$/, function (next) {
        browser.getCurrentUrl().then(function(url) {
            expect(url).to.contains("/search/");
        }).then(next);
    });

    this.When(/^I selects the back button then browser URL should change$/, function () {
        var previousUrl = browser.getCurrentUrl().then(function(url) {
            return url;
        });
        browser.navigate().back();
        return expect(browser.getCurrentUrl()).not.to.eventually.equal(previousUrl);
    });

    this.When(/^I selects the forward button in browser then URL should change$/, function () {
        var previousUrl = browser.getCurrentUrl().then(function(url) {
            return url;
        });
        browser.navigate().forward();
        return expect(browser.getCurrentUrl()).not.to.eventually.equal(previousUrl);
    });


    this.Then(/^most recent filter action "([^"]*)" type "([^"]*)" is removed and I am taken back by one step$/, function (filter, type) {
        var autopsyColumn = element(by.cssContainingText('a', filter)).element(By.xpath('following-sibling::owh-toggle-switch')).element(by.cssContainingText('a', type));
        return expect(autopsyColumn.getAttribute('class')).not.to.eventually.contains('selected');
    });

    this.Then(/^the results page should have (\d+) graphs and table has columns "([^"]*)", "([^"]*)", "([^"]*)" for filter "([^"]*)"$/, function (chartCount, column1, column2, column3, filterType, next) {
        element.all(by.repeater('chartData in startChartData')).count().then(function (size) {
            expect(size).to.equal(parseInt(chartCount));
        });

        element(by.tagName("owh-table")).all(by.tagName("th")).then(function (columns) {
            if(filterType == 'Race') {
                expect(columns[0].getText()).to.eventually.equals(column1);
                expect(columns[1].getText()).to.eventually.equals(column2);
                expect(columns[2].getText()).to.eventually.equals(column3);
            }
            else {
                expect(columns[4].getText()).to.eventually.equals(column1);
                expect(columns[5].getText()).to.eventually.equals(column2);
                expect(columns[6].getText()).to.eventually.equals(column3);
            }
        }).then(next);


    });

    this.Then(/^I should see the forward and backward button in the application$/, function () {
        expect(commonPage.backButton.isDisplayed()).to.eventually.equal(true);
        return expect(commonPage.forwardButton.isDisplayed()).to.eventually.equal(true);
    });

    this.When(/^I select the back button in application$/, function (next) {
        commonPage.backButton.click()
            .then(next);
    });

    this.When(/^I select the forward button in application$/, function (next) {
        commonPage.forwardButton.click()
            .then(next);
    });

    this.Then(/^I should see filter type "([^"]*)" selected$/, function (arg) {
        commonPage.getSelectedFilterType().then(function (text) {
            return expect(text).to.equal(arg);
        })
    });

    this.When(/^I hit wrong url$/, function () {
        return browser.get("/wrongURL");
    });

    this.Then(/^I should see error page$/, function () {
        expect(element(by.className("error-msg-h1")).getText()).to.eventually.equal("Oops!");
        expect(element(by.className("error-404-msg")).getText()).to.eventually.contains("We can't seem to find the page you're looking for.");
        expect(element(by.className("error-404-msg")).getText()).to.eventually.contains("Error code: 404");
        return expect(element(by.className("error-404-msg")).getText()).to.eventually.contains("Here are some helpful links instead:");
    });
};
module.exports = commonStepDefinitionsWrapper;