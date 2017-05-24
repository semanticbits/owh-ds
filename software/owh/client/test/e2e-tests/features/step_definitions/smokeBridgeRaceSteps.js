var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var BridgeRaceStepDefinitionsWrapper = function () {

    this.setDefaultTimeout(600000);
    var bridgeRacePage = require('../support/bridgerace.po');

    this.Then(/^I see "([^"]*)" as second option in sidebar filters$/, function (arg1, next) {
        element.all(by.css('.side-filters')).all(by.css('.accordion')).then(function (items) {
            expect(items[1].getText()).to.eventually.contains(arg1);
        }).then(next);
    });
};

module.exports = BridgeRaceStepDefinitionsWrapper;