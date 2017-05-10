var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var PRAMSStepDefinitionsWrapper = function () {

    this.setDefaultTimeout(600000);
    var pramsPage = require('../support/prams.po');

    this.When(/^I select PRAMS as primary filter$/, function (next) {
        pramsPage.pramsOption.click().then(next);
    });

    this.Then(/^I see 'By' filter pre\-selected with State and Question$/, function () {
        var ele = element(by.css('span.ui-select-match'));
        return expect(ele.getText()).to.eventually.equal(' ×\nState\n ×\nQuestion');
    });

    this.Then(/^I see class\- Delivery$/, function () {
        var selectedClass = pramsPage.getSelectedPramsClass();
        return expect(selectedClass.getText()).to.eventually.equal('Delivery');
    });

    this.Then(/^I see state data displayed in data table$/, function (next) {
        //table headers
        pramsPage.getTableHeadData(0).then(function (value) {
            expect(value).to.contains('Question');
            expect(value).to.contains('Response');
            expect(value).to.contains('Alabama');
            expect(value).to.contains('Alaska');
            expect(value).to.contains('Arizona');
        });

        //data
        var dataRow = pramsPage.dataTable.all(by.tagName('tbody')).get(8)
            .all(by.tagName('tr')).get(1).all(by.tagName('td'));

        dataRow.getText().then(function (data) {
            expect(data[0]).to.contains('Indicator of no insurance to pay for delivery');
            expect(data[1]).to.contains('NO (UNCHECKED)');
            //Alabama
            expect(data[2]).to.contains('Not Available');
            //Alaska
            expect(data[3]).to.contains('97.4');
            //Arizona
            expect(data[4]).to.contains('Not Available');
        }).then(next);
    });
};

module.exports = PRAMSStepDefinitionsWrapper;