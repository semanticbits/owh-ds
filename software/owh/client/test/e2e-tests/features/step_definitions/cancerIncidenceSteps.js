var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var cancerIncidencePage = require('../support/cancerIncidence.po');

var cancerIncidenceStepDefinitions = function () {
    this.setDefaultTimeout(600000);

    this.Then(/^On the cancer incidence page, I should see the data table with the headers "([^"]*)"/, function (expected_headers, next) {
        var expected = expected_headers.split(', ');
        cancerIncidencePage.getTableHeaders().then(function (headers) {
            headers.forEach(function (header, index) {
                expect(header).to.equal(expected[index]);
            });
        }).then(next);
    });

    this.Then(/^On the cancer incidence page, the values in row "([^"]*)" should be "([^"]*)"$/, function (row_number, values, next) {
        var expected = values.split(', ');
        cancerIncidencePage.getTableRow(parseInt(row_number, 10)).then(function (row) {
            row.forEach(function (column, index) {
                expect(column).to.contains(expected[index]);
            });
        }).then(next);
    });

    this.Then(/On the cancer incidence page, the visualization is displayed/, function (next) {
        cancerIncidencePage.isVisualizationDisplayed().then(function (value) {
            expect(value).to.be.true;
        }).then(next);
    });
};

module.exports = cancerIncidenceStepDefinitions;
