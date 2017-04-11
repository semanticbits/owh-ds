var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var homeStepDefinitionsWrapper = function () {

    var homePage = require('../support/homepage.po');
    var mortalityPage = require('../support/mortalitypage.po')

    this.When(/^I hit app url$/, function () {
        browser.get('/');
    });

    this.Then(/^I should be automatically redirected to home page$/, function () {
        browser.getCurrentUrl().then(function(url) {
           expect(url).to.equal(browser.baseUrl);
        });

    });

    this.When(/^I click on Explore button in Health Information Gateway section$/, function () {
        homePage.quickHealthExploreBtn.click();
    });
    this.When(/^I click on Explore button in Youth Related card under Behavioral Risk$/, function (next) {
        homePage.mentalExplorerLink.click()
            .then(next);
    });

    this.Then(/^I should get search page with default filter type "([^"]*)"$/, function (arg1) {
        browser.sleep(1000);
        return expect(mortalityPage.getSelectedFilterType()).to.eventually.equal(arg1);
    });

    this.When(/^I click on explore button in Birth card under womens health section$/, function (next) {
        homePage.birthExplorerLink.click()
            .then(next);
    });

    this.Then(/^I should get a info modal$/, function () {
        homePage.getPhaseTwoPopupHeading().then(function(heading){
            expect(heading).to.equal('Work in progress')
        });
    });

    this.When(/^I am at home page$/, function () {
        browser.get("/");
    });

    this.Then(/^gray banner on top reads "([^"]*)"$/, function (givenMessage) {
        homePage.getWorkInProgressMessage().then(function(foundMessage){
           expect(givenMessage).to.equal(foundMessage);
        });
    });

    this.When(/^I am at search page$/, function () {
        browser.get("/search");
    });

    this.Then(/^I see the name of application as "([^"]*)"$/, function (arg1) {
        browser.sleep(10000);
        homePage.getOWHAppName().then(function(appName){
            expect(appName).to.equal(arg1)
        });
    });
};
module.exports = homeStepDefinitionsWrapper;
