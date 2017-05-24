var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var smokeMortalityStepDefinitionsWrapper = function () {

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
        expect(mortalityPage.shareOnFacebookLink.isDisplayed()).to.eventually.equal(true);
    });

    this.When(/^I should observe "([^"]*)" option is selected in "([^"]*)" filter$/, function (arg1, arg2) {
        var filter = element(by.className('side-filters')).element(by.xpath('.//*[.="'+arg2+'"]'));
        var filterParentElement = filter.element(by.xpath('..')).element(by.tagName('i')).element(by.xpath('..')).element(by.xpath('..')).element(by.xpath('..'));
        expect(filterParentElement.element(by.xpath('.//*[.="'+arg1+'"]').element(by.model('checked').isSelected()))).to.eventually.equal(true);
    });
}; 
module.exports = smokeMortalityStepDefinitionsWrapper;