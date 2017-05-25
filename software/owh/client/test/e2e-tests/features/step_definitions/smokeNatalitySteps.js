var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var smokeNatalityStepsDefinitionWrapper = function () {

    this.setDefaultTimeout(600000);
    var natalityPage = require('../support/natality.po');
};

module.exports = smokeNatalityStepsDefinitionWrapper;