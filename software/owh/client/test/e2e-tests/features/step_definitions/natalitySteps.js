var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var natalityStepsDefinitionWrapper = function () {

    this.setDefaultTimeout(600000);
    var natalityPage = require('../support/natality.po');

    this.Then(/^I see "([^"]*)" as first filter category$/, function (arg1, next) {
        natalityPage.getFilterCategories().then(function(categories) {
            expect(categories.length).to.equal(5);
            expect(categories[0].getText()).to.eventually.equal(arg1);
        }).then(next);
    });

    this.Then(/^I see (\d+) filters visible$/, function (filterCount, next) {
        natalityPage.getVisibleFilters(0).then(function (filters) {
            expect(filters.length).to.equal(parseInt(filterCount));
        }).then(next);
    });

    this.Then(/^I see show more filters link$/, function () {
        return expect(element(by.className('show-more-0')).getText()).to.eventually.contains('more filters');
    });

    this.When(/^I click on show more filters link$/, function (next) {
        element(by.className('show-more-0')).click()
            .then(next);
    });

    this.Then(/^I see show more filters link changed to show less filters$/, function () {
        return expect(element(by.className('show-less-0')).getText()).to.eventually.contains('less filters');
    });

    this.When(/^I click on show less filters$/, function (next) {
        element(by.className('show-less-0')).click()
            .then(next);
    });

    this.Then(/^I should see filter type "([^"]*)" selected for show me dropdown$/, function (arg1) {
        //expect(natalityPage.getSelectedFilterType()).to.eventually.equal(arg1);
        return browser.waitForAngular();
    });

    this.When(/^I change show me dropdown option to "([^"]*)"$/, function (arg1, next) {
        element(by.cssContainingText('option', arg1)).click()
            .then(next);
    });

    this.Then(/^the data table must show Births, Population and Birth Rates$/, function (next) {
        natalityPage.getTableRowData(0).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('American Indian or Alaska Native');
            expect(firstRowData[1]).to.contains('Birth Rate');
            expect(firstRowData[1]).to.contains('967.7');
            expect(firstRowData[1]).to.contains('Births');
            expect(firstRowData[1]).to.contains('44,299');
            expect(firstRowData[1]).to.contains('Population');
            expect(firstRowData[1]).to.contains('4,577,853');
        });
        natalityPage.getTableRowData(1).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('Asian or Pacific Islander');
            expect(firstRowData[1]).to.contains('1,399.1');
            expect(firstRowData[1]).to.contains('281,264');
            expect(firstRowData[1]).to.contains('20,102,717')
        }).then(next);
    });


    this.Then(/^I see expected filters should be disabled for Birth Rates$/, function (next) {
        //Expand all filters
        element(by.className('show-more-0')).click();
        element(by.className('show-more-1')).click();
        element(by.className('show-more-3')).click();
        var allElements = element.all(by.css('cursor-not-allowed')).all(by.css('custom-link'));
        allElements.getText().then(function (filters) {
            filters.forEach(function (filter) {
                expect(["Month","Weekday", "Sex", "Gestational Age at Birth","Month Prenatal Care Began","Birth Weight","Birth Weight 4","Birth Weight 12","Plurality or Multiple Birth","Live Birth Order","Birth Place","Delivery Method","Medical Attendant","Ethinicity","Marital Status", "Education", "1-Year Age Groups", "5-Year Age Groups",
                    "Anemia","Cardiac Disease","Chronic Hypertension","Diabetes","Eclampsia","Hydramnios / Oligohydramnios","Incompetent Cervix","Lung disease","Pregnancy-associated Hypertension","Tobacco Use"]).to.include(filter);
            });
        }).then(next);
    });

    this.Then(/^all years should be enabled in Year filter$/, function () {
         var yearsList = ["2015","2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000"];
         yearsList.forEach(function(year){
            expect(element(by.id("natality_current_year_"+year)).getAttribute("disabled")).to.eventually.equal(null);
         });
         return browser.waitForAngular();
    });

    this.Then(/^years "([^"]*)", "([^"]*)", "([^"]*)" should be disabled for Year filter$/, function (arg1, arg2, arg3) {
        var yearsList = [arg1, arg2, arg3];
        yearsList.forEach(function(year){
            expect(element(by.id("natality_current_year_"+year)).getAttribute("disabled")).to.eventually.equal('true');
        });
        return browser.waitForAngular();
    });

    this.Then(/^the data table must show Births, Female Population and Birth Rates$/, function (next) {
        natalityPage.getTableRowData(0).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('American Indian or Alaska Native');
            expect(firstRowData[1]).to.contains('Fertility Rate');
            expect(firstRowData[1]).to.contains('4,385.7');
            expect(firstRowData[1]).to.contains('Births');
            expect(firstRowData[1]).to.contains('44,299');
            expect(firstRowData[1]).to.contains('Female Population');
            expect(firstRowData[1]).to.contains('1,010,086');
        });
        natalityPage.getTableRowData(1).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('Asian or Pacific Islander');
            expect(firstRowData[1]).to.contains('5,845.2');
            expect(firstRowData[1]).to.contains('281,264');
            expect(firstRowData[1]).to.contains('4,811,897')
        }).then(next);
    });

    this.Then(/^the data table should display values filtered by age selected$/, function (next) {
        natalityPage.getTableRowData(0).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('American Indian or Alaska Native');
            expect(firstRowData[1]).to.contains('Fertility Rate');
            expect(firstRowData[1]).to.contains('2,574.6');
            expect(firstRowData[1]).to.contains('Births');
            expect(firstRowData[1]).to.contains('4,738');
            expect(firstRowData[1]).to.contains('Female Population');
            expect(firstRowData[1]).to.contains('184,028');
        });
        natalityPage.getTableRowData(1).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('Asian or Pacific Islander');
            expect(firstRowData[1]).to.contains('691.2');
            expect(firstRowData[1]).to.contains('4,297');
            expect(firstRowData[1]).to.contains('621,691')
        }).then(next);
    });

    this.Then(/^I click on "([^"]*)"$/, function (arg1, next) {
        element(by.cssContainingText('a', arg1)).click()
            .then(next);
    });

    this.Then(/^I see expected filters should be disabled for Fertility Rates$/, function (next) {
        element(by.className('show-more-0')).click();
        element(by.className('show-more-1')).click();
        element(by.className('show-more-3')).click();
        var allElements = element.all(by.css('cursor-not-allowed')).all(by.css('custom-link'));
        allElements.getText().then(function (filters) {
            filters.forEach(function (filter) {
                expect(["Month","Weekday", "Sex", "Gestational Age at Birth","Month Prenatal Care Began","Birth Weight","Birth Weight 4","Birth Weight 12","Plurality or Multiple Birth","Live Birth Order","Birth Place","Delivery Method","Medical Attendant","Ethinicity","Marital Status","Age of Mother","Education",
                    "Anemia","Cardiac Disease","Chronic Hypertension","Diabetes","Eclampsia","Hydramnios / Oligohydramnios","Incompetent Cervix","Lung disease","Pregnancy-associated Hypertension","Tobacco Use"]).to.include(filter);
            });
        }).then(next);
    });

    this.Then(/^I should see a Birth rate statement above data table in natality page$/, function () {
        return expect(natalityPage.birthRateDisclaimer.getText()).to.eventually.equal("Population details from NCHS Bridged Race Estimates are used to calculate Birth Rates (per 100,000).");
    });

    this.When(/^I see "([^"]*)" category in the sidebar$/, function (arg1, next) {
        natalityPage.getFilterCategories().then(function(categories) {
            expect(categories.length).to.equal(5);
            expect(categories[2].getText()).to.eventually.equal(arg1);
        }).then(next);
    });

    this.Then(/^I should see "([^"]*)" options under Mother Age category for 5-Year age group$/, function (arg1, next) {
        natalityPage.getOptions(arg1).then(function(elements) {
            //We have a two extra <li> to display search box and to show more filter link
            expect(elements.length).to.equal(9);
            expect(elements[1].getText()).to.eventually.contains('All');
            expect(elements[2].getText()).to.eventually.contains('15-19 years');
            expect(elements[3].getText()).to.eventually.contains('20-24 years');
            expect(elements[4].getText()).to.eventually.contains('25-29 years');
            expect(elements[5].getText()).to.eventually.contains('30-34 years');
            expect(elements[6].getText()).to.eventually.contains('35-39 years');
            expect(elements[7].getText()).to.eventually.contains('40-44 years');
        }).then(next);
    });

    this.Then(/^I select groupBy "([^"]*)" option for "([^"]*)" filter$/, function (arg1, arg2, next) {
        natalityPage.selectSideFilter(arg2, arg1).click()
            .then(next);
    });

    this.Then(/^data table should display right values for 5\-Year age filter$/, function (next) {
        natalityPage.getTableRowData(0).then(function(rowdata) {
            //Race
            expect(rowdata[0]).to.equals('American Indian or Alaska Native');
            //Mother's Age 9
            expect(rowdata[1]).to.equals('15-19 years');
            //Female
            expect(rowdata[2]).to.equals('3,776 (49.1%)');
            //Male
            expect(rowdata[3]).to.equals('3,914 (50.9%)');
            //Total
            expect(rowdata[4]).to.equals('7,690');
        }).then(next);
    });

    this.Then(/^I should see "([^"]*)" options under Mother Age category for 1\-Year age group$/, function (arg1, next) {
        natalityPage.getOptions(arg1).then(function(elements) {
            //We have a two extra <li> to display search box and to show more filter link
            expect(elements.length).to.equal(33);
            expect(elements[1].getText()).to.eventually.contains('All');
            expect(elements[2].getText()).to.eventually.contains('15 years');
            expect(elements[3].getText()).to.eventually.contains('16 years');
            expect(elements[4].getText()).to.eventually.contains('17 years');
            expect(elements[5].getText()).to.eventually.contains('18 years');
            expect(elements[6].getText()).to.eventually.contains('19 years');
            expect(elements[7].getText()).to.eventually.contains('20 years');
            expect(elements[8].getText()).to.eventually.contains('21 years');
            expect(elements[9].getText()).to.eventually.contains('22 years');
            expect(elements[10].getText()).to.eventually.contains('23 years');
            expect(elements[11].getText()).to.eventually.contains('24 years');
            expect(elements[12].getText()).to.eventually.contains('25 years');
            expect(elements[13].getText()).to.eventually.contains('26 years');
            expect(elements[14].getText()).to.eventually.contains('27 years');
            expect(elements[15].getText()).to.eventually.contains('28 years');
            expect(elements[16].getText()).to.eventually.contains('29 years');
            expect(elements[17].getText()).to.eventually.contains('30 years');
            expect(elements[18].getText()).to.eventually.contains('31 years');
            expect(elements[19].getText()).to.eventually.contains('32 years');
            expect(elements[20].getText()).to.eventually.contains('33 years');
            expect(elements[21].getText()).to.eventually.contains('34 years');
            expect(elements[22].getText()).to.eventually.contains('35 years');
            expect(elements[23].getText()).to.eventually.contains('36 years');
            expect(elements[24].getText()).to.eventually.contains('37 years');
            expect(elements[25].getText()).to.eventually.contains('38 years');
            expect(elements[26].getText()).to.eventually.contains('39 years');
            expect(elements[27].getText()).to.eventually.contains('40 years');
            expect(elements[28].getText()).to.eventually.contains('41 years');
            expect(elements[29].getText()).to.eventually.contains('42 years');
            expect(elements[30].getText()).to.eventually.contains('43 years');
            expect(elements[31].getText()).to.eventually.contains('44 years');
        }).then(next);
    });

    this.Then(/^data table should display right values for 1\-Year age filter$/, function (next) {
        natalityPage.getTableRowData(0).then(function(rowdata) {
            //Race
            expect(rowdata[0]).to.equals('American Indian or Alaska Native');
            //Mother's Age 9
            expect(rowdata[1]).to.equals('15 years');
            //Female
            expect(rowdata[2]).to.equals('204 (49.6%)');
            //Male
            expect(rowdata[3]).to.equals('207 (50.4%)');
            //Total
            expect(rowdata[4]).to.equals('411');
        }).then(next);
    });

    this.Then(/^the category Mother's Age should has 1\-Year and 5\-Year age group filters$/, function (next) {
        var allFilters = element(by.className('category-2')).all(by.tagName('li'));
        allFilters.getText().then(function (filters) {
            expect(filters[0]).to.contains("1-Year Age Groups");
            expect(filters[7]).to.contains("5-Year Age Groups");
        }).then(next);
    });

    this.Then(/^I see expected filters should be disabled in natality page for number for births$/, function (next) {
        var allElements = element.all(by.css('.cursor-not-allowed')).all(By.css('.filter-display-name'));
        allElements.getText().then(function (filters) {
            filters.forEach(function (filter) {
                expect(["Gestational Age at Birth", "Anemia", "Cardiac Disease", "Hydramnios / Oligohydramnios", "Incompetent Cervix", "Lung disease"]).to.include(filter);
            });
        }).then(next);
    });

    this.Then(/^I see expected filters should be enabled in natality page for number of births$/, function (next) {
        var allElements = element.all(by.css('.cursor-not-allowed')).all(By.css('.filter-display-name'));
        allElements.getText().then(function (filters) {
            filters.forEach(function (filter) {
                expect(["Year", "Month", "Weekday", "Sex", "Month Prenatal Care Began", "Birth Weight", "Birth Weight 4", "Birth Weight 12",
                    "Plurality or Multiple Birth", "Live Birth Order", "Birth Place", "Delivery Method", "Medical Attendant", "Race", "Ethnicity",
                    "Marital Status", "Education", "1-Year Age Groups", "5-Year Age Groups", "Chronic Hypertension", "Diabetes", "Eclampsia",
                    "Pregnancy-associated Hypertension", "Tobacco Use" ]).to.not.include(filter);
            });
        }).then(next);
    });

    this.Then(/^I see an option to show\/hide percentages$/, function () {
        expect(natalityPage.showOrHidePecentageDiv.isPresent()).to.eventually.equal(true);
        expect(natalityPage.showPecentageButton.isPresent()).to.eventually.equal(true);
        return expect(natalityPage.hidePecentageButton.isPresent()).to.eventually.equal(true);
    });

    this.When(/^I click the "([^"]*)" option$/, function (arg, next) {
        natalityPage.hidePecentageButton.click().then(next)
    });

    this.Then(/^the percentages should be hidden$/, function () {
        return natalityPage.getTableRowData(0).then(function (row) {
            expect(row[1]).to.equal('21,593');
            expect(row[2]).to.equal('22,706');
            expect(row[3]).to.equal('44,299');
        });
    });

    this.When(/^I select "([^"]*)" state for "([^"]*)"$/, function (state, type, next) {
        element.all(by.css('label[for='+type+'_state_'+state+']')).then(function(elements) {
                elements[1].click();
        }).then(next);
    });

    this.Then(/^I see data is displayed in data\-table for races$/, function (next) {
        natalityPage.getTableRowData(0).then(function (row) {
            expect(row[0]).to.equal('American Indian or Alaska Native');
            expect(row[1]).to.equal('1,179 (48.8%)');
            expect(row[2]).to.equal('1,236 (51.2%)');
            expect(row[3]).to.equal('2,415');
        }).then(next);
    });

    this.Then(/^I see data is grouped by state in data table$/, function (next) {
        natalityPage.getTableHeaders().then(function(headers) {
            expect(headers[4]).to.contains('Alabama');
            expect(headers[5]).to.contains('Alaska');
            //alabama
            natalityPage.getTableCellData(0,1).then(function(data){
                expect(data).to.contains('100 (3.8%)');
            });
            //Alaska
            natalityPage.getTableCellData(0,2).then(function(data){
                expect(data).to.contains('1,179 (45.3%)');
            });
        }).then(next);
    });

    this.When(/^I select Puerto Rican ethnicity option$/, function (next) {
        element.all(by.css('label[for*=natality_hispanic_origin_Puerto]')).then(function(elements, index) {
            elements[0].click();
        }).then(next);
    });

    this.Then(/^I see suppressed cells in data table$/, function (next) {
        natalityPage.getTableCellData(0,1).then(function(data){
            expect(data).to.contains('Suppressed');
        });
        natalityPage.getTableCellData(0,2).then(function(data){
            expect(data).to.contains('Suppressed');
        });
        natalityPage.getTableCellData(2,1).then(function(data){
            expect(data).to.contains('Suppressed');
        });
        natalityPage.getTableCellData(2,2).then(function(data){
            expect(data).to.equal('11');
        }).then(next);
    });

    this.Then(/^I see birth rate for state$/, function (next) {
        natalityPage.getTableRowData(0).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('American Indian or Alaska Native');
            expect(firstRowData[1]).to.contains('Birth Rate');
            expect(firstRowData[1]).to.contains('510.4');
            expect(firstRowData[1]).to.contains('Births');
            expect(firstRowData[1]).to.contains('190');
            expect(firstRowData[1]).to.contains('Population');
            expect(firstRowData[1]).to.contains('37,228');
        });
        natalityPage.getTableRowData(1).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('Asian or Pacific Islander');
            expect(firstRowData[1]).to.contains('1,534.4');
            expect(firstRowData[1]).to.contains('1,193');
            expect(firstRowData[1]).to.contains('77,752')
        }).then(next);
    });

    this.Then(/^I see fertility rates for state$/, function (next) {
        natalityPage.getTableRowData(0).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('American Indian or Alaska Native');
            expect(firstRowData[1]).to.contains('Fertility Rate');
            expect(firstRowData[1]).to.contains('2,429.7');
            expect(firstRowData[1]).to.contains('Births');
            expect(firstRowData[1]).to.contains('190');
            expect(firstRowData[1]).to.contains('Population');
            expect(firstRowData[1]).to.contains('7,820');
        });
        natalityPage.getTableRowData(1).then(function(firstRowData){
            expect(firstRowData[0]).to.equals('Asian or Pacific Islander');
            expect(firstRowData[1]).to.contains('6,043.0');
            expect(firstRowData[1]).to.contains('1,193');
            expect(firstRowData[1]).to.contains('19,742')
        }).then(next);
    });
};

module.exports = natalityStepsDefinitionWrapper;