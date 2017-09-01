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
        mortalityPage.getSelectedFilterType().then(function (text) {
            return expect(text).to.equal(arg1);
        })
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

    this.Then(/^I see text on Co\-Branded header$/, function () {
        expect(element(by.cssContainingText('a', "HHS.gov")).isDisplayed()).to.eventually.equal(true);
        expect(element(by.cssContainingText('a', "U.S. Department of Health & Human Services")).isDisplayed()).to.eventually.equal(true);
        return expect(element(by.cssContainingText('a', "Explore HHS")).isDisplayed()).to.eventually.equal(true);
    });

    this.Then(/^Co\-Branded menus should be displayed$/, function () {
        expect(element(by.cssContainingText('a', "About HHS")).isDisplayed()).to.eventually.equal(true);
        expect(element(by.cssContainingText('a', "Programs & Services")).isDisplayed()).to.eventually.equal(true);
        expect(element(by.cssContainingText('a', "Grants & Contracts")).isDisplayed()).to.eventually.equal(true);
        return expect(element(by.cssContainingText('a', "Laws & Regulations")).isDisplayed()).to.eventually.equal(true);
    });

    this.Then(/^Co\-Branded menus should be hidden$/, function () {
        expect(element(by.cssContainingText('a', "About HHS")).isDisplayed()).to.eventually.equal(false);
        expect(element(by.cssContainingText('a', "Programs & Services")).isDisplayed()).to.eventually.equal(false);
        expect(element(by.cssContainingText('a', "Grants & Contracts")).isDisplayed()).to.eventually.equal(false);
        return expect(element(by.cssContainingText('a', "Laws & Regulations")).isDisplayed()).to.eventually.equal(false);
    });

    this.Then(/^footer should have "([^"]*)" links$/, function (arg1, next) {
        var footer = element(by.className('footer-link'));
        browser.executeScript("arguments[0].scrollIntoView();", footer);
        var links = arg1.split(',');
        var allElements =  footer.all(by.className('ft-link'));
        allElements.getText().then(function (filters) {
            filters.forEach(function (filter, index) {
                expect(filter).to.contains(links[index]);
            });
        }).then(next);
    });

    this.Then(/^I see content ownership statement "([^"]*)"$/, function (arg1) {
        return expect(element(by.className("contentOwnership")).getText()).to.eventually.contains(arg1);
    });

    this.Then(/^I see "([^"]*)" msg on footer$/, function (arg1, next) {
        var elms = element.all(by.className("usa-text-small"));
        elms.getText().then(function (textList) {
            expect(textList[1]).to.contains(arg1);
        }).then(next);
    });
};
module.exports = homeStepDefinitionsWrapper;
