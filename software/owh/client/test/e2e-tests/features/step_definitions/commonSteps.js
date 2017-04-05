var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;
var currentUrl = "";
var previousUrl = "";

var commonStepDefinitionsWrapper = function () {


    var commonPage = require('../support/commonpage.po');

    this.Then(/^URL in browser bar should change$/, function (done) {
        browser.getCurrentUrl().then(function(url) {
            expect(url).not.to.equal(browser.baseUrl);
            done();
        });
    });

    this.Then(/^URL in browser bar should not be base URL$/, function (done) {
        browser.getCurrentUrl().then(function(url) {
            expect(url).to.contains("/search/");
            done();
        });
    });

    this.When(/^I selects the back button then browser URL should change$/, function (done) {
        var previousUrl = browser.getCurrentUrl().then(function(url) {
            return url;
        });
        browser.navigate().back();
        expect(browser.getCurrentUrl()).not.to.eventually.equal(previousUrl);
        done();
    });

    this.When(/^I selects the forward button in browser then URL should change$/, function (done) {
        var previousUrl = browser.getCurrentUrl().then(function(url) {
            return url;
        });
        browser.navigate().forward();
        expect(browser.getCurrentUrl()).not.to.eventually.equal(previousUrl);
        done();
    });


    this.Then(/^most recent filter action "([^"]*)" type "([^"]*)" is removed and I am taken back by one step$/, function (filter, type, done) {
        var autopsyColumn = element(by.cssContainingText('a', filter)).element(By.xpath('following-sibling::owh-toggle-switch')).element(by.cssContainingText('a', type));
        expect(autopsyColumn.getAttribute('class')).not.to.eventually.contains('selected');
        done();
    });

    this.Then(/^the results page should have (\d+) graphs and table has columns "([^"]*)", "([^"]*)", "([^"]*)" for filter "([^"]*)"$/, function (chartCount, column1, column2, column3, filterType, done) {
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
            done();
        });


    });

    this.Then(/^I should see the forward and backward button in the application$/, function (done) {
        expect(commonPage.backButton.isDisplayed()).to.eventually.equal(true);
        expect(commonPage.forwardButton.isDisplayed()).to.eventually.equal(true);
        done();
    });

    this.When(/^I select the back button in application$/, function (done) {
        commonPage.backButton.click();
        done();
    });

    this.When(/^I select the forward button in application$/, function (done) {
        commonPage.forwardButton.click();
        done();
    });

    this.Then(/^I should see filter type "([^"]*)" selected$/, function (arg) {
        expect(commonPage.getSelectedFilterType()).to.eventually.equal(arg);
    });
};
module.exports = commonStepDefinitionsWrapper;