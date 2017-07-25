var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var homeStepDefinitionsWrapper = function () {

    this.setDefaultTimeout(600000);
    var homePage = require('../support/homepage.po');
    var mortalityPage = require('../support/mortalitypage.po')

    this.When(/^I hit app url$/, function () {
       return browser.get('/');
    });

    this.Then(/^I should be automatically redirected to home page$/, function (next) {
        browser.getCurrentUrl().then(function(url) {
           expect(url).to.equal(browser.baseUrl);
        }).then(next);

    });

    this.When(/^I click on Explore button in Health Information Gateway section$/, function () {
        homePage.quickHealthExploreBtn.click();
        return browser.waitForAngular();

    });
    this.When(/^I click on Explore button in Youth Related card under Behavioral Risk$/, function (next) {
        homePage.mentalExplorerLink.click()
            .then(next);
    });

    this.Then(/^I should get search page with default filter type "([^"]*)"$/, function (arg1) {
        return expect(mortalityPage.getSelectedFilterType()).to.eventually.equal(arg1);
    });

    this.When(/^I click on explore button in Birth card under womens health section$/, function (next) {
        homePage.birthExplorerLink.click()
            .then(next);
    });

    this.Then(/^I should get a info modal$/, function (next) {
        homePage.getPhaseTwoPopupHeading().then(function(heading){
            expect(heading).to.equal('Work in progress')
        }).then(next);
    });

    this.When(/^I am at home page$/, function () {
        return browser.get("/");
    });

    this.Then(/^gray banner on top reads "([^"]*)"$/, function (givenMessage, next) {
        homePage.getWorkInProgressMessage().then(function(foundMessage){
           expect(givenMessage).to.equal(foundMessage);
        }).then(next);
    });

    this.When(/^I am at search page$/, function () {
        return browser.get("/search");
    });

    this.Then(/^I see the name of application as "([^"]*)"$/, function (arg1, next) {
        browser.sleep(10000);
        homePage.getOWHAppName().then(function(appName){
            expect(appName).to.equal(arg1)
        }).then(next);
    });

    this.Then(/^footer should have "([^"]*)" links$/, function (arg1, next) {
        var links = arg1.split(',');
        var allElements =  element.all(by.className('footer-li'));
        allElements.getText().then(function (filters) {
            filters.forEach(function (filter, index) {
                expect(filter).to.contains(links[index]);
            });
        }).then(next);
    });
};
module.exports = homeStepDefinitionsWrapper;
