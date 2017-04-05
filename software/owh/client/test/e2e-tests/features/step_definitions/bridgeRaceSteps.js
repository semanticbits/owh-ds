var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var BridgeRaceStepDefinitionsWrapper = function () {

    var bridgeRacePage = require('../support/bridgerace.po');

    this.Then(/^I see the data table with race, female, male and total table headers$/, function () {
        var dtTableHeaders = bridgeRacePage.getTableHeaders();
        expect(dtTableHeaders).to.eventually.contains('Race');
        expect(dtTableHeaders).to.eventually.contains('Female');
        expect(dtTableHeaders).to.eventually.contains('Male');
        expect(dtTableHeaders).to.eventually.contains('Total');
    });

    this.Then(/^I see "([^"]*)" as first option in sidebar filters$/, function (arg1) {
        browser.sleep(5000);
        element.all(by.css('.side-filters')).all(by.css('.accordion')).then(function (items) {
            expect(items[0].getText()).to.eventually.contains(arg1);
        });
    });

    this.When(/^I click on row button in row-column switch for "([^"]*)"$/, function (arg1) {
        bridgeRacePage.selectRowOrColumn(arg1, 'Row').click();
    });

    this.Then(/^I see data yearly filter in data table\.$/, function () {
        var dtTableHeaders = bridgeRacePage.getTableHeaders();
        dtTableHeaders.to.eventually.contains('Yearly July 1st Estimates');
    });

    this.Then(/^I see "([^"]*)" filter in data table header$/, function (arg) {
        var dtTableHeaders = bridgeRacePage.getTableHeaders();
        expect(dtTableHeaders).to.eventually.contains(arg);
    });

    this.When(/^I click on sex filter$/, function () {
        bridgeRacePage.sexOptionsLink.click();
    });

    this.Then(/^I see male and female sub filters$/, function () {
        bridgeRacePage.getSubFiltersOfAFilter('Sex').then(function(elements) {
            expect(elements[0].getText()).to.eventually.contains('All');
            expect(elements[1].getText()).to.eventually.contains('Female');
            expect(elements[2].getText()).to.eventually.contains('Male');
        });
    });

    this.Then(/^I see sex filter options disappeared$/, function () {
        bridgeRacePage.getSubFiltersOfAFilter('Sex').then(function(elements) {
            expect(elements[0].isDisplayed()).to.eventually.equal(false);
            expect(elements[1].isDisplayed()).to.eventually.equal(false);
            expect(elements[2].isDisplayed()).to.eventually.equal(false);
        });
    });

    this.When(/^I see a visualization$/, function () {
        browser.sleep(5000);
        bridgeRacePage.isVisualizationDisplayed().then(function(value) {
            expect(value).to.equal(true);
        });
    });

    this.Then(/^I see data element and values are plotted on both the axes$/, function () {
        bridgeRacePage.isVisualizationDisplayed().then(function(value) {
            expect(value).to.equal(true);
        });
    });

    this.Then(/^I see chart heading appears on the top$/, function () {
        bridgeRacePage.getGraphTitle().then(function(value) {
            expect(value[0].getText()).to.eventually.contains('Sex and Race');
        });
    });

    this.Then(/^I see an axis labels are displayed on the graph$/, function () {
        var labelArr = bridgeRacePage.getAxisLabelsForAGraph(0);
        expect(labelArr[0].getText()).to.eventually.equal('Race');
        expect(labelArr[1].getText()).to.eventually.equal('Population');
    });

    this.Then(/^I see an Expand button on the top right corner$/, function () {
        bridgeRacePage.isExpandBtnDisplayed().then(function(value) {
            expect(value).to.equal(true);
        });
    });

    this.Then(/^I see an share button on the top right corner$/, function () {
        bridgeRacePage.isFBShareBtnDisplayed().then(function(value) {
            expect(value).to.equal(true);
        });
    });

    this.Then(/^I clicks on the expand button$/, function () {
        bridgeRacePage.expandGraph();
    });

    this.Then(/^I see expanded graph in modal dialog$/, function () {
        bridgeRacePage.isGraphModalDisplayed().then(function(value) {
            expect(value).to.equal(true);
        });
    });

    this.Then(/^I see expand button is changed to collapse button$/, function () {
        bridgeRacePage.isCollapseBtnDisplayed().then(function(value) {
            expect(value).to.equal(true);
        });
    });

    this.When(/^I click on collapse button$/, function () {
        bridgeRacePage.collapseGraph();
    });

    this.Then(/^I see graph is collapsed$/, function () {
        bridgeRacePage.isCollapseBtnDisplayed().then(function(value) {
            expect(value).to.equal(false);
        });
    });

    this.When(/^I remove default filters$/, function () {
        element.all(by.className('ui-select-match-close')).then(function (slectedFilter) {
            slectedFilter[0].click();
        });
        browser.sleep(50);
        element.all(by.className('ui-select-match-close')).then(function (slectedFilter) {
            slectedFilter[0].click();
        });
    });

    this.When(/^I select year filter$/, function () {
        bridgeRacePage.selectFilterSwitch('Yearly July 1st Estimates', 'Column').click();
    });

    this.Then(/^I should see line graph$/, function () {
        element.all(by.className('nv-lineChart')).then(function (lineChart) {
            expect(lineChart.length).to.be.above(0);
        })
    });

    this.When(/^I expands the State filter$/, function (callback) {
        bridgeRacePage.stateOptionsLink.click();
        callback(null, 'done');
    });

    this.Then(/^I see the search box$/, function (callback) {
        var searchBox = element(by.model('search.title'));
        expect(searchBox).to.exist;
        callback(null, 'done');
    });

    this.When(/^I begins to type a state name "([^"]*)" in the search box$/, function (arg1, callback) {
        var searchBox = element(by.model('search.title'));
        console.log(searchBox);
        searchBox.clear().sendKeys(arg1);
        callback(null, 'done');
    });

    this.Then(/^I see results dynamically populate with the states matching the "([^"]*)"$/, function (arg1, callback) {
        bridgeRacePage.getSubFiltersOfAFilter('State').then(function(elements) {
            expect(elements.count()).to.equal(2);
            expect(elements[0].getText()).to.eventually.contains('All');
            expect(elements[1].getText()).to.eventually.contains(arg1);
        });
        callback(null, 'done');
    });

    this.Then(/^I see population count for "([^"]*)" option$/, function (arg) {
        var countEle = element(by.cssContainingText('.count-label', arg))
            .element(by.xpath('following-sibling::span'));
        countEle.getText().then(function (text) {
            expect(parseInt(text)).to.be.above(0);
        });
    });

};

module.exports = BridgeRaceStepDefinitionsWrapper;