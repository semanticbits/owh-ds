var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var smokeYrbsStepDefinitionsWrapper = function () {

    this.setDefaultTimeout(600000);
    var yrbsPage = require('../support/yrbspage.po')

};
module.exports = smokeYrbsStepDefinitionsWrapper;