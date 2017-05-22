var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var homeStepDefinitionsWrapper = function () {

    this.setDefaultTimeout(600000);
    var homePage = require('../support/homepage.po');
    var mortalityPage = require('../support/mortalitypage.po')

    this.Then(/^the user observes the option "([^"]*)"$/, function (arg1) {
        var text = mortalityPage.getSelectedShowMeFilterType();
        expect(text).to.eventually.contains(arg1);
    });

    this.Then(/^user clicks on "([^"]*)" less link for "([^"]*)" filter$/, function (linkText, filterType, next) {
        var filter = element(by.cssContainingText('a', filterType)).element(by.xpath('ancestor::label')).element(by.xpath('following-sibling::ul'));
        filter.element(by.cssContainingText('a', linkText)).click()
            .then(next)
    });

    this.Then(/^I observe critera in filter options with off "([^"]*)"$/, function (arg1) {
        var text = mortalityPage.selectSideFilter(arg1, 'Off').getText();
        var type = mortalityPage.selectSideFilter(arg1, 'Off').element(By.xpath('following-sibling::owh-toggle-switch')).element(by.cssContainingText('a', 'Off'));
        expect(text).to.eventually.contains(arg1);
        expect(type).to.eventually.contains('Off');
    });

    this.Then(/^I observe a button for Facebook$/, function () {
        return expect(mortalityPage.shareOnFacebookLink.isDisplayed()).to.eventually.equal(true);
    });

/*    this.When(/^I hit app url$/, function () {
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
    }); */
}; 
module.exports = homeStepDefinitionsWrapper;