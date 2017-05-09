var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var infantMortalityStepDefinitions = function () {
    this.setDefaultTimeout(600000);
    var imp = require('../support/infant_mortality.po');

    this.Then(/^I should see "([^"]*)" categories in the sidebar$/, function (match, next) {
        imp.getFilterCategories().then(function(categories) {
            expect(categories.length).to.equal(parseInt(match));
        }).then(next);
    });

    this.Then(/^the categories should be "([^"]*)"$/, function (match, next) {
       var expected = match.split(', ');
       imp.getFilterCategories().then(function (categories) {
           categories.forEach(function (category, index) {
               expect(category).to.equal(expected[index]);
           });
       }).then(next);
    });

    this.Then(/^the "([^"]*)" filter should be toggled to "([^"]*)"$/, function (match1, match2, next) {
        imp.getSelectedOptionForFilterGroup(match1).then(function (actual) {
            expect(actual).to.equal(match2)
        }).then(next);
    });

};

module.exports = infantMortalityStepDefinitions;