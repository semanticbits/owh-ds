var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var natalityStepsDefinitionWrapper = function () {

    var natalityPage = require('../support/natality.po');

    this.Then(/^I see "([^"]*)" as first filter category$/, function (arg1) {
        natalityPage.getFilterCategories().then(function(categories) {
            expect(categories.length).to.equal(3);
            expect(categories[0].getText()).to.eventually.equal(arg1);
        });
    });

    this.Then(/^I see (\d+) filters visible$/, function (filterCount) {
        natalityPage.getVisibleFilters(0).then(function (filters) {
            expect(filters.length).to.equal(parseInt(filterCount));
        });
    });

    this.Then(/^I see show more filters link$/, function () {
        expect(element(by.className('show-more-0')).getText()).to.eventually.contains('more filters');
    });

    this.When(/^I click on show more filters link$/, function () {
        element(by.className('show-more-0')).click();
    });

    this.Then(/^I see show more filters link changed to show less filters$/, function () {
        expect(element(by.className('show-less-0')).getText()).to.eventually.contains('less filters');
    });

    this.When(/^I click on show less filters$/, function () {
        element(by.className('show-less-0')).click();
    });

    this.Then(/^I should see filter type "([^"]*)" selected for show me dropdown$/, function (arg1) {
        //expect(natalityPage.getSelectedFilterType()).to.eventually.equal(arg1);
        return true
    });

    this.When(/^I change show me dropdown option to "([^"]*)"$/, function (arg1) {
        element(by.cssContainingText('option', arg1)).click();
    });

    this.Then(/^the data table must show Births, Population and Birth Rates$/, function () {
        natalityPage.getTableRowData(0).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('American Indian or Alaska Native');
            expect(firstRowData[1]).to.contains('Rate');
            expect(firstRowData[1]).to.contains('995.0');
            expect(firstRowData[1]).to.contains('Births');
            expect(firstRowData[1]).to.contains('44,962');
            expect(firstRowData[1]).to.contains('Population');
            expect(firstRowData[1]).to.contains('4,518,981');
        });
        natalityPage.getTableRowData(1).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('Asian or Pacific Islander');
            expect(firstRowData[1]).to.contains('1,459.5');
            expect(firstRowData[1]).to.contains('283,111');
            expect(firstRowData[1]).to.contains('19,398,214')
        });
    });


    this.Then(/^I see expected filters should be disabled for Birth Rates$/, function () {
        //Expand all filters
        element(by.className('show-more-0')).click();
        element(by.className('show-more-1')).click();
        element(by.className('show-more-2')).click();
        var allElements = element.all(by.css('cursor-not-allowed')).all(by.css('custom-link'));
        allElements.getText().then(function (filters) {
            filters.forEach(function (filter) {
                expect(["Month","Weekday", "Sex", "Gestational Age at Birth","Month Prenatal Care Began","Birth Weight","Birth Weight 4","Birth Weight 12","Plurality or Multiple Birth","Live Birth Order","Birth Place","Delivery Method","Medical Attendant","Ethinicity","Marital Status","Age of Mother","Mother's Age 9","Mother's Age 12","Mother's Single Year of Age","Education",
                    "Anemia","Cardiac Disease","Chronic Hypertension","Diabetes","Eclampsia","Hydramnios / Oligohydramnios","Incompetent Cervix","Lung disease","Pregnancy-associated Hypertension","Tobacco Use"]).to.include(filter);
            });
        });
    });

    this.Then(/^all years should be enabled in Year filter$/, function () {
         var yearsList = ["2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000"];
         yearsList.forEach(function(year){
            expect(element(by.id("natality_current_year_"+year)).getAttribute("disabled")).to.eventually.equal(null);
         });
    });

    this.Then(/^years "([^"]*)", "([^"]*)", "([^"]*)" should be disabled for Year filter$/, function (arg1, arg2, arg3) {
        var yearsList = [arg1, arg2, arg3];
        yearsList.forEach(function(year){
            expect(element(by.id("natality_current_year_"+year)).getAttribute("disabled")).to.eventually.equal('true');
        });
    });

    this.Then(/^the data table must show Births, Female Population and Birth Rates$/, function () {
        natalityPage.getTableRowData(0).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('American Indian or Alaska Native');
            expect(firstRowData[1]).to.contains('Rate');
            expect(firstRowData[1]).to.contains('4,486.8');
            expect(firstRowData[1]).to.contains('Births');
            expect(firstRowData[1]).to.contains('44,962');
            expect(firstRowData[1]).to.contains('Female Population');
            expect(firstRowData[1]).to.contains('1,002,104');
        });
        natalityPage.getTableRowData(1).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('Asian or Pacific Islander');
            expect(firstRowData[1]).to.contains('6,078.1');
            expect(firstRowData[1]).to.contains('283,111');
            expect(firstRowData[1]).to.contains('4,657,922')
        });
    });

    this.Then(/^the data table should display values filtered by age selected$/, function () {
        natalityPage.getTableRowData(0).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('American Indian or Alaska Native');
            expect(firstRowData[1]).to.contains('Rate');
            expect(firstRowData[1]).to.contains('2,733.9');
            expect(firstRowData[1]).to.contains('Births');
            expect(firstRowData[1]).to.contains('5,006');
            expect(firstRowData[1]).to.contains('Female Population');
            expect(firstRowData[1]).to.contains('183,109');
        });
        natalityPage.getTableRowData(1).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('Asian or Pacific Islander');
            expect(firstRowData[1]).to.contains('771.9');
            expect(firstRowData[1]).to.contains('4,641');
            expect(firstRowData[1]).to.contains('601,244')
        });
    });

    this.Then(/^I click on "([^"]*)"$/, function (arg1) {
        element(by.cssContainingText('a', arg1)).click();
    });

    this.Then(/^I see expected filters should be disabled for Fertility Rates$/, function () {
        element(by.className('show-more-0')).click();
        element(by.className('show-more-1')).click();
        element(by.className('show-more-2')).click();
        var allElements = element.all(by.css('cursor-not-allowed')).all(by.css('custom-link'));
        allElements.getText().then(function (filters) {
            filters.forEach(function (filter) {
                expect(["Month","Weekday", "Sex", "Gestational Age at Birth","Month Prenatal Care Began","Birth Weight","Birth Weight 4","Birth Weight 12","Plurality or Multiple Birth","Live Birth Order","Birth Place","Delivery Method","Medical Attendant","Ethinicity","Marital Status","Age of Mother","Education",
                    "Anemia","Cardiac Disease","Chronic Hypertension","Diabetes","Eclampsia","Hydramnios / Oligohydramnios","Incompetent Cervix","Lung disease","Pregnancy-associated Hypertension","Tobacco Use"]).to.include(filter);
            });
        });
    });

    this.Then(/^I should see a Birth rate statement above data table in natality page$/, function () {
        expect(natalityPage.birthRateDisclaimer.getText()).to.eventually.equal("Population details from NCHS Bridged Race Estimates is used to calculate Birth Rates (per 100,000)");
    });
};

module.exports = natalityStepsDefinitionWrapper;