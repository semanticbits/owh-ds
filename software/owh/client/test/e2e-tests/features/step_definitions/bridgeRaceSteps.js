var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var BridgeRaceStepDefinitionsWrapper = function () {

    this.setDefaultTimeout(30000);
    var bridgeRacePage = require('../support/bridgerace.po');

    this.Then(/^I see the data table with race, female, male and total table headers$/, function () {
        var dtTableHeaders = bridgeRacePage.getTableHeaders();
        expect(dtTableHeaders).to.eventually.contains('Race');
        expect(dtTableHeaders).to.eventually.contains('Female');
        expect(dtTableHeaders).to.eventually.contains('Male');
        return expect(dtTableHeaders).to.eventually.contains('Total');
    });

    this.Then(/^I see "([^"]*)" as first option in sidebar filters$/, function (arg1, next) {
        browser.waitForAngular();
        element.all(by.css('.side-filters')).all(by.css('.accordion')).then(function (items) {
            expect(items[0].getText()).to.eventually.contains(arg1);
        }).then(next);
    });

    this.When(/^I click on row button in row-column switch for "([^"]*)"$/, function (arg1, next) {
        bridgeRacePage.selectRowOrColumn(arg1, 'Row').click()
            .then(next);
    });

    this.Then(/^I see data yearly filter in data table\.$/, function () {
        var dtTableHeaders = bridgeRacePage.getTableHeaders();
        return dtTableHeaders.to.eventually.contains('Yearly July 1st Estimates');
    });

    this.Then(/^I see "([^"]*)" filter in data table header$/, function (arg) {
        var dtTableHeaders = bridgeRacePage.getTableHeaders();
        return expect(dtTableHeaders).to.eventually.contains(arg);
    });

    this.When(/^I click on sex filter$/, function (next) {
        bridgeRacePage.sexOptionsLink.click()
            .then(next);
    });

    this.Then(/^I see male and female sub filters$/, function (next) {
        bridgeRacePage.getSubFiltersOfAFilter('Sex').then(function(elements) {
            expect(elements[1].getText()).to.eventually.contains('All');
            expect(elements[2].getText()).to.eventually.contains('Female');
            expect(elements[3].getText()).to.eventually.contains('Male');
        }).then(next);
    });

    this.Then(/^I see sex filter options disappeared$/, function (next) {
        bridgeRacePage.getSubFiltersOfAFilter('Sex').then(function(elements) {
            expect(elements[0].isDisplayed()).to.eventually.equal(false);
            expect(elements[1].isDisplayed()).to.eventually.equal(false);
            expect(elements[2].isDisplayed()).to.eventually.equal(false);
        }).then(next);
    });

    this.When(/^I see a visualization$/, function (next) {
        browser.waitForAngular();
        bridgeRacePage.isVisualizationDisplayed().then(function(value) {
            expect(value).to.equal(true);
        }).then(next);
    });

    this.Then(/^I see data element and values are plotted on both the axes$/, function (next) {
        bridgeRacePage.isVisualizationDisplayed().then(function(value) {
            expect(value).to.equal(true);
        }).then(next);
    });

    this.Then(/^I see chart heading appears on the top$/, function (next) {
        bridgeRacePage.getGraphTitle().then(function(value) {
            expect(value[0].getText()).to.eventually.contains('Sex and Race');
        }).then(next);
    });

    this.Then(/^I see an axis labels are displayed on the graph$/, function (next) {
        var labelArr = bridgeRacePage.getAxisLabelsForAGraph(1);
        expect(labelArr[0].getText()).to.eventually.equal('Race');
        return expect(labelArr[1].getText()).to.eventually.equal('Population');
    });

    this.Then(/^I see an Expand button on the top right corner$/, function (next) {
        bridgeRacePage.isExpandBtnDisplayed().then(function(value) {
            expect(value).to.equal(true);
        }).then(next);
    });

    this.Then(/^I see an share button on the top right corner$/, function (next) {
        bridgeRacePage.isFBShareBtnDisplayed().then(function(value) {
            expect(value).to.equal(true);
        }).then(next);
    });

    this.Then(/^I clicks on the expand button$/, function (next) {
        bridgeRacePage.expandGraph()
            .then(next);
    });

    this.Then(/^I see expanded graph in modal dialog$/, function (next) {
        bridgeRacePage.isGraphModalDisplayed().then(function(value) {
            expect(value).to.equal(true);
        }).then(next);
    });

    this.Then(/^I see expand button is changed to collapse button$/, function (next) {
        bridgeRacePage.isCollapseBtnDisplayed().then(function(value) {
            expect(value).to.equal(true);
        }).then(next);
    });

    this.When(/^I click on collapse button$/, function (next) {
        bridgeRacePage.collapseGraph()
            .then(next);
    });

    this.Then(/^I see graph is collapsed$/, function (next) {
        bridgeRacePage.isCollapseBtnDisplayed().then(function(value) {
            expect(value).to.equal(false);
        }).then(next);
    });

    this.When(/^I remove default filters$/, function (next) {
        element.all(by.className('ui-select-match-close')).then(function (slectedFilter) {
            slectedFilter[0].click();
        });
        browser.waitForAngular();
        element.all(by.className('ui-select-match-close')).then(function (slectedFilter) {
            slectedFilter[0].click();
        }).then(next);
    });

    this.When(/^I select year filter$/, function (next) {
        bridgeRacePage.selectFilterSwitch('Yearly July 1st Estimates', 'Column').click()
            .then(next);
    });

    this.Then(/^I should see line graph$/, function (next) {
        element.all(by.className('nv-lineChart')).then(function (lineChart) {
            expect(lineChart.length).to.be.above(0);
        }).then(next);
    });

    this.When(/^I expands the State filter$/, function (next) {
        bridgeRacePage.stateOptionsLink.click()
            .then(next);
    });

    this.Then(/^I see the search box$/, function () {
        var searchBox = element(by.model('search.title'));
        return expect(searchBox.isPresent()).to.eventually.equal(true);
    });

    this.When(/^I begins to type a state name "([^"]*)" in the search box$/, function (arg1, next) {
        var searchBox = element(by.model('search.title'));
        console.log(searchBox);
        searchBox.clear().sendKeys(arg1)
            .then(next);
    });

    this.Then(/^I see results dynamically populate with the states matching the "([^"]*)"$/, function (arg1, next) {
        bridgeRacePage.getSubFiltersOfAFilter('State').then(function(elements) {
            expect(elements.count()).to.equal(2);
            expect(elements[0].getText()).to.eventually.contains('All');
            expect(elements[1].getText()).to.eventually.contains(arg1);
        }).then(next);
    });

    this.Then(/^I see population count for "([^"]*)" option$/, function (arg, next) {
        var countEle = element(by.cssContainingText('.count-label', arg))
            .element(by.xpath('following-sibling::span'));
        countEle.getText().then(function (text) {
            expect(parseInt(text)).to.be.above(0);
        }).then(next);
    });

};

module.exports = BridgeRaceStepDefinitionsWrapper;