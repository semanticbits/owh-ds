var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var mortalityStepDefinitionsWrapper = function () {

    this.setDefaultTimeout(600000);
    var mortalityPage = require('../support/mortalitypage.po');
    var commonPage = require('../support/commonpage.po');

    this.When(/^user sees a visualization$/, function (next) {
        mortalityPage.isVisualizationDisplayed().then(function(value) {
            expect(value).to.equal(true);
        }).then(next);
    });

    this.Then(/^labels are displayed on both the axes for minimized visualization$/, function () {
        var labelArray = mortalityPage.getAxisLabelsForMinimizedVisualization();
        expect(labelArray[0].getText()).to.eventually.equal('Race');
        return expect(labelArray[1].getText()).to.eventually.equal('Deaths');
    });

    this.When(/^user expand visualization$/, function (next) {
        mortalityPage.expandVisualizationLink.click()
            .then(next);
    });

    this.Then(/^labels are displayed on both the axes for expanded visualization$/, function () {
        var labelArray = mortalityPage.getAxisLabelsForExpandedVisualization();
        expect(labelArray[0].getText()).to.eventually.equal('Race');
        return expect(labelArray[1].getText()).to.eventually.equal('Deaths');
    });

    this.Given(/^I am on search page$/, function () {
        return browser.get('/search/');
    });

    this.Then(/^user sees side filter$/, function () {
        browser.sleep(300);
        return expect(mortalityPage.sideMenu.isDisplayed()).to.eventually.equal(true)
    });

    this.Then(/^there is button to hide filter$/, function () {
        return expect(mortalityPage.hideFiltersBtn.isDisplayed()).to.eventually.equal(true);
    });

    this.When(/^I click hide filter button$/, function (next) {
        mortalityPage.hideFiltersBtn.click()
            .then(next);
    });

    this.Then(/^side menu slides away$/, function () {
        return expect(mortalityPage.sideMenu.getAttribute('class')).to.eventually.include('ng-hide');
    });

    this.Then(/^I see button to show filters$/, function () {
        return expect(mortalityPage.showFiltersBtn.isDisplayed()).to.eventually.equal(true);
    });

    this.When(/^I click show filters button$/, function () {
        return mortalityPage.showFiltersBtn.click();
    });

    this.Then(/^side menu slides back into view$/, function () {
        return expect(mortalityPage.sideMenu.getAttribute('class')).to.not.eventually.include('ng-hide');
    });

    this.When(/^I see the number of deaths in data table$/, function (next) {
        mortalityPage.getTableHeaders().then(function(value) {
            expect(value).to.contains('Number of Deaths');
        }).then(next);
    });

    this.Then(/^the percentages are shown for each row are displayed by default$/, function (next) {
        mortalityPage.getTableRowData(0).then(function(value){
            expect(value[1]).to.equal('8,565 (45.0%)');
        }).then(next);
    });

    this.When(/^I update criteria in filter options with column "([^"]*)"$/, function (arg1, next) {
        mortalityPage.selectSideFilter(arg1, 'Column').click()
            .then(next);
    });

    this.When(/^I update criteria in filter option with row "([^"]*)"$/, function (arg1, next) {
        mortalityPage.selectSideFilter(arg1, 'Row').click()
            .then(next);
    });

    this.When(/^I update criteria in filter options with off "([^"]*)"$/, function (arg1, next) {
        mortalityPage.selectSideFilter(arg1, 'Off').click()
            .then(next);
    });

    this.Then(/^data table is updated and the number of deaths and percentages are updated too$/, function (next) {
        mortalityPage.getTableRowData(0).then(function (value) {
            expect(value[1]).to.equal('887 (4.7%)');
        }).then(next);
    });

    this.When(/^I add new data items to row or columns$/, function (next) {
        mortalityPage.selectSideFilter('Age Groups', 'Row').click()
            .then(next);
    });

    this.Then(/^the percentages get re\-calculated based on all the information displayed in a given row$/, function (next) {
        browser.actions().mouseMove(element(by.tagName('owh-table'))).perform();
        mortalityPage.getTableRowData(9).then(function(value){
            expect(value[1]).to.equal('98 (9.4%)');
        }).then(next);
    });

    this.When(/^I see the data table$/, function () {
        return expect(mortalityPage.owhTable.isPresent()).to.eventually.equal(true);
    });

    this.Then(/^percentages are displayed in the same column\/cell in parenthesis$/, function (next) {
        browser.actions().mouseMove(element(by.tagName('owh-table'))).perform();
        mortalityPage.getTableRowData(9).then(function(value){
            expect(value[1]).to.equal('98 (9.4%)');
        }).then(next);
    });

    this.When(/^I see the quick visualizations$/, function (next) {
        mortalityPage.isVisualizationDisplayed().then(function(value) {
            expect(value).to.equal(true);
        }).then(next);
    });

    this.Then(/^they're displayed same as before and nothing changes$/, function () {
        var labelArray = mortalityPage.getAxisLabelsForMinimizedVisualization();
        expect(labelArray[0].getText()).to.eventually.equal('Race');
        expect(labelArray[1].getText()).to.eventually.equal('Deaths');
        mortalityPage.expandVisualizationLink.click();
        labelArray = mortalityPage.getAxisLabelsForExpandedVisualization();
        expect(labelArray[0].getText()).to.eventually.equal('Race');
        return expect(labelArray[1].getText()).to.eventually.equal('Deaths');
    });

    /* this.When(/^I export the data table into excel or csv$/, function () {
         return false;
     });
 
     this.Then(/^percentages are exported as well$/, function () {
         return false;
     });
 
     this.Then(/^each percentage is displayed in a separate column \(unlike UI in the application\)$/, function () {
         return false;
     });
 */
    this.When(/^I see the results$/, function () {
        return expect(mortalityPage.owhTable.isPresent()).to.eventually.equal(true);
        /*mortalityPage.getTableHeaders().then(function(value) {
            expect(value).to.contains('Number of Deaths');
        }).then(next);*/
    });

    this.Then(/^an option to show\/hide percentages is displayed$/, function () {
        expect(mortalityPage.showOrHidePecentageDiv.isPresent()).to.eventually.equal(true);
        expect(mortalityPage.showPecentageButton.isPresent()).to.eventually.equal(true);
        return expect(mortalityPage.hidePecentageButton.isPresent()).to.eventually.equal(true);
    });

    this.Then(/^show\/hide percentages button shouldn't display$/, function () {
        expect(mortalityPage.showOrHidePecentageDiv.isDisplayed()).to.eventually.equal(false);
        expect(mortalityPage.showPecentageButton.isDisplayed()).to.eventually.equal(false);
        return expect(mortalityPage.hidePecentageButton.isDisplayed()).to.eventually.equal(false);
    });

    this.Then(/^when that option is toggled, the percentages are either displayed\/hidden$/, function (next) {
        mortalityPage.hidePecentageButton.click();
        mortalityPage.getTableRowData(9).then(function(value){
            expect(value[1]).to.equal('98');
        }).then(next);
    });

    /*this.Then(/^this option decides if percentages get exported into the excel\/csv or not$/, function () {
        return false;
    });*/

    this.When(/^I look at the table results$/, function () {
        return expect(mortalityPage.owhTable.isPresent()).to.eventually.equal(true);
        /*mortalityPage.getTableHeaders().then(function(value) {
            expect(value).to.contains('Number of Deaths');
        }).then(next);*/
    });

    this.When(/^percentage option is enabled$/, function (next) {
        mortalityPage.showPecentageButton.click()
            .then(next);
    });

    this.Then(/^the Rates and Percentages should have a one decimal precision$/, function (next) {
        mortalityPage.getTableRowData(9).then(function(value){
            expect(value[1]).to.equal('98 (9.4%)');
        }).then(next);
    });

    this.When(/^user expands race options$/, function (next) {
        mortalityPage.raceOptionsLink.click()
            .then(next);
    });

    this.When(/^user expands sex options$/, function (next) {
        mortalityPage.sexOptionsLink.click()
            .then(next);
    });

    this.When(/^user selects second race option$/, function (next) {
        mortalityPage.raceOption2Link.click()
            .then(next);
    });

    this.Then(/^race options retain their initial ordering$/, function (next) {
        commonPage.getAllOptionsForFilter('Race').then(function(elements) {
            elements[3].getOuterHtml().then(function(value) {
                expect(mortalityPage.raceOption2.getOuterHtml()).to.eventually.equal(value);
            }).then(next);
        });
    });

    this.When(/^I change 'I'm interested in' dropdown value to "([^"]*)"$/, function (arg1, next) {
        element(by.id('interestedIn')).click();
        mortalityPage.interestedInDropdown.element(by.cssContainingText('span', arg1)).click()
            .then(next);
    });

    this.When(/^I change 'I'm interested in' dropdown$/, function (next) {
        element(by.id('interestedIn')).click().then(next);
    });

    this.When(/^I click on "([^"]*)" dataset$/, function (arg1, next) {
        element(by.cssContainingText('a', arg1)).click()
            .then(next);
    });

    this.Then(/^I should be redirected to YRBS page$/, function () {
        //for first time yrbs page takes time to load but from second time page should load quickly
        //so changed sleep time from 60000 to 300 seconds
        browser.sleep(300);
        var text = mortalityPage.sideMenu.getText();
        expect(text).to.eventually.contains("Question");
        //expect(text).to.eventually.contains("Select Questions");
        return expect(text).to.eventually.contains("Grade");
    });

    this.When(/^the user chooses the option 'Death Rates'$/, function (next) {
        mortalityPage.deathRatesOption.click()
            .then(next);
    });

    this.Then(/^the rates and population are shown for each row in 'Death Rates' view$/, function (next) {
        //By default 2015 year is selected
        mortalityPage.getTableRowData(0).then(function(text){
            expect(text[1]).to.equal('Crude Death Rate\n375.8\nDeaths\n8,565\nPopulation\n2,279,263');
            expect(text[2]).to.equal('Crude Death Rate\n454.7\nDeaths\n10,451\nPopulation\n2,298,590');
            expect(text[3]).to.equal('Crude Death Rate\n415.4\nDeaths\n19,016\nPopulation\n4,577,853');

        }).then(next);
    });

    //the rates, deaths and population for "Asian or Pacific Islander" in 'Death Rates' view are "153.8", "170" and "110,561"
    this.Then(/^the rates, deaths and population for "([^"]*)" "([^"]*)" in 'Death Rates' view are "([^"]*)", "([^"]*)" and "([^"]*)"$/, function (columnText, rowText, rate, deaths, population, next) {
        //By default 2015 year is selected
        var firstRow = false;
        mortalityPage.getTableDataByRowFilterAndColumnHeaderText(function (row, index) {
            return row.all(by.tagName('td')).get(0).getText().then(function (text) {
                if (text === rowText) {
                    firstRow = index === 0;
                    return true;
                }
                else {
                    return false;
                }
            });
        }, columnText).then(function (text) {
            if (firstRow) {
                expect(text).to.equal("Crude Death Rate\n" + rate + "\n" + "Deaths\n" + deaths + "\n" + "Population\n" + population);
            }
            else {
                expect(text).to.equal(rate + "\n" + deaths + "\n" + population);
            }
        }).then(next);
    });

    this.Then(/^dropdown is in the main search bar$/, function () {
        return expect(mortalityPage.mainSearch.element(by.className('dropdown-submenu')).isPresent()).to.eventually.equal(true);
    });

    this.Then(/^the Percentages should have a one decimal precision$/, function (next) {
        //By default 2015 year is selected
        mortalityPage.getTableRowData(0).then(function(text) {
            expect(text[1]).to.equal('8,565 (45.0%)');
            expect(text[2]).to.equal('10,451 (55.0%)');
            expect(text[3]).to.equal('19,016');
        }).then(next);
    });

    this.Then(/^the following message should be displayed stating that population data is being retrieved from Census "([^"]*)"$/, function (arg1) {
        return expect(mortalityPage.deathRateDisclaimer.getText()).to.eventually.equal(arg1);
    });

    this.When(/^the user chooses the option 'Age Adjusted Death Rates'$/, function (next) {
        mortalityPage.ageRatesOption.click()
            .then(next);
    });

    this.Then(/^the age adjusted rates are shown for each row$/, function (next) {
        mortalityPage.getTableRowData(0).then(function(value){
            expect(value[1]).to.equal('Age Adjusted Death Rate\n511.3\nDeaths\n8,565\nPopulation\n2,279,263');
        }).then(next);
    });

    this.When(/^user filters by year (\d+)$/, function (arg1, next) {
        commonPage.getAllOptionsForFilter('Year').then(function(elements) {
            elements[2015 - arg1 + 2].click();
        }).then(next);
    });

    this.When(/^user filters by ethnicity Dominican/, function (next) {
        mortalityPage.ethnicityDominicanOption.click()
            .then(next);
    });

    this.Then(/^user should see total for Male and Female in side filter suppressed$/, function (next) {
        mortalityPage.getSideFilterTotals().then(function(elements) {
            // Male
            expect(elements[4].getInnerHtml()).to.eventually.equal('Suppressed');
            //Female
            expect(elements[5].getInnerHtml()).to.eventually.equal('Suppressed');
        }).then(next);
    });

    this.When(/^user shows more year filters$/, function (next) {
        mortalityPage.showMoreYears.click()
            .then(next);
    });

    this.When(/^user expands ethnicity filter$/, function (next) {
        mortalityPage.expandEthnicity.click()
            .then(next);
    });

    this.Then(/^ethnicity filters should be in given order$/, function (next) {
        commonPage.getAllOptionsForFilter('Ethnicity').then(function(elements) {
            expect(elements[1].getText()).to.eventually.contains('All');
            expect(elements[2].getText()).to.eventually.contains('Non-Hispanic');
            expect(elements[3].getText()).to.eventually.contains('Hispanic');
            expect(elements[4].getText()).to.eventually.contains('Central and South American');
            expect(elements[5].getText()).to.eventually.contains('Central American');
            expect(elements[6].getText()).to.eventually.contains('Cuban');
            expect(elements[7].getText()).to.eventually.contains('Dominican');
            expect(elements[8].getText()).to.eventually.contains('Latin American');
            expect(elements[9].getText()).to.eventually.contains('Mexican');
            expect(elements[10].getText()).to.eventually.contains('Puerto Rican');
            expect(elements[11].getText()).to.eventually.contains('South American');
            expect(elements[12].getText()).to.eventually.contains('Spaniard');
            expect(elements[13].getText()).to.eventually.contains('Other Hispanic');
            expect(elements[14].getText()).to.eventually.contains('Unknown');
        }).then(next);
    });

    this.Then(/^the age filter should be hidden$/, function () {
        return expect(mortalityPage.selectSideFilter('Age Groups', 'Row').isPresent()).to.eventually.equal(false);
    });

    this.Then(/^years should be in descending order$/, function (next) {
        commonPage.getAllOptionsForFilter('Year').then(function(elements) {
            expect(elements[1].getText()).to.eventually.contains('All');
            expect(elements[2].getText()).to.eventually.contains('2015');
            expect(elements[3].getText()).to.eventually.contains('2014');
            expect(elements[4].getText()).to.eventually.contains('2013');
            expect(elements[5].getText()).to.eventually.contains('2012');
            expect(elements[6].getText()).to.eventually.contains('2011');
            expect(elements[7].getText()).to.eventually.contains('2010');
            expect(elements[8].getText()).to.eventually.contains('2009');
            expect(elements[9].getText()).to.eventually.contains('2008');
            expect(elements[10].getText()).to.eventually.contains('2007');
            expect(elements[11].getText()).to.eventually.contains('2006');
            expect(elements[12].getText()).to.eventually.contains('2005');
            expect(elements[13].getText()).to.eventually.contains('2004');
            expect(elements[14].getText()).to.eventually.contains('2003');
            expect(elements[15].getText()).to.eventually.contains('2002');
            expect(elements[16].getText()).to.eventually.contains('2001');
            expect(elements[17].getText()).to.eventually.contains('2000');
        }).then(next);
    });


    this.Then(/^user clicks on "([^"]*)" more link for "([^"]*)" filter$/, function (linkText, filterType, next) {
        commonPage.getShowMoreFilterOptionsLinkFor(filterType, linkText).click().then(next);
    });

    this.Then(/^user should see two subcategories\- Hispanic and NonHispanic$/, function (next) {
        commonPage.getAllOptionsForFilter('Ethnicity').then(function(elements) {
            expect(elements[2].getText()).to.eventually.contains('Non-Hispanic');
            expect(elements[3].getText()).to.eventually.contains('Hispanic');
        }).then(next);
    });

    this.When(/^user expands hispanic option group$/, function (next) {
        commonPage.getGroupOptionsFor('Ethnicity').then(function(elements) {
            elements[0].element(by.tagName('span')).click();
        }).then(next);
    });

    this.When(/^user checks entire Hispanic group$/, function (next) {
        mortalityPage.ethnicityHispanicOption.click()
            .then(next);
    });

    this.Then(/^all Hispanic child options should be checked$/, function (next) {
        var elm = element(by.className('owh-side-menu__sub-category-options'));
        browser.executeScript("arguments[0].scrollIntoView();", elm);

        elm.all(by.tagName('li')).then(function(elmnts) {
            for(var i = 0; i < 10; i++) {
                expect(elmnts[i].element(by.tagName('input')).isSelected()).to.eventually.equal(true);
            }
        }).then(next);

    });

    this.Then(/^user should see all the of the Hispanic Origin options grouped\(Central American,Cuban,Dominican,Latin American, Mexican, Puerto Rican, South American,Spaniard, Other Hispanic, Unknown\) under one Category\- Hispanic$/, function (next) {
        commonPage.getAllOptionsForFilter('Ethnicity').then(function(elements) {
            expect(elements[3].getText()).to.eventually.contains('Hispanic');
            expect(elements[4].getText()).to.eventually.contains('Central and South American');
            expect(elements[5].getText()).to.eventually.contains('Central American');
            expect(elements[6].getText()).to.eventually.contains('Cuban');
            expect(elements[7].getText()).to.eventually.contains('Dominican');
            expect(elements[8].getText()).to.eventually.contains('Latin American');
            expect(elements[9].getText()).to.eventually.contains('Mexican');
            expect(elements[10].getText()).to.eventually.contains('Puerto Rican');
            expect(elements[11].getText()).to.eventually.contains('South American');
            expect(elements[12].getText()).to.eventually.contains('Spaniard');
            expect(elements[13].getText()).to.eventually.contains('Other Hispanic');
        }).then(next);
    });

    this.When(/^user checks some options under hispanic group$/, function (next) {
        element(by.id('deaths_hispanicOrigin_Cuban')).element(by.xpath('..')).click();
        browser.sleep(300);
        element(by.id('deaths_hispanicOrigin_Latin American')).element(by.xpath('..')).click();
        browser.sleep(400);
        element(by.id('deaths_hispanicOrigin_Puerto Rican')).element(by.xpath('..')).click()
            .then(next);
    });

    this.When(/^user groups ethnicity by row$/, function (next) {
        mortalityPage.selectSideFilter('Ethnicity', 'Row').click()
            .then(next);
    });

    this.Then(/^data should be filtered by the checked hispanic options$/, function (next) {
        mortalityPage.getTableRowData(0).then(function(text) {
            expect(text[1]).to.equal('Cuban');
        });
        mortalityPage.getTableRowData(1).then(function(text) {
            expect(text[0]).to.equal('Latin American');
        });
        mortalityPage.getTableRowData(2).then(function(text) {
            expect(text[0]).to.equal('Puerto Rican');
        }).then(next);
    });

    this.Then(/^race options should be in proper order$/, function (next) {
        commonPage.getAllOptionsForFilter('Race').then(function(elements) {
            expect(elements[1].getText()).to.eventually.contains('All');
            expect(elements[2].getText()).to.eventually.contains('American Indian or Alaska Native');
            expect(elements[3].getText()).to.eventually.contains('Asian or Pacific Islander');
            expect(elements[4].getText()).to.eventually.contains('Black or African American');
            expect(elements[5].getText()).to.eventually.contains('White');
        }).then(next);
    });

    this.Then(/^user expands autopsy filter$/, function (next) {
        mortalityPage.autopsyOptionsLink.click()
            .then(next);
    });

    this.Then(/^autopsy options should be in proper order$/, function (next) {
        commonPage.getAllOptionsForFilter('Autopsy').then(function(elements) {
            expect(elements[1].getText()).to.eventually.contains('All');
            expect(elements[2].getText()).to.eventually.contains('Yes');
            expect(elements[3].getText()).to.eventually.contains('No');
            expect(elements[4].getText()).to.eventually.contains('Unknown');
        }).then(next);
    });

    this.Then(/^filter "([^"]*)" should be displayed$/, function (arg1) {
        return expect(element(by.tagName('owh-side-filter')).getText()).to.eventually.contains(arg1);
    });

    this.Then(/^data should be right aligned in table$/, function (next) {
        mortalityPage.getTableRowDataCells(0).then(function (elements) {
            expect(elements[0].getCssValue('text-align')).to.eventually.equal('start');
            expect(elements[1].getCssValue('text-align')).to.eventually.equal('start');
            expect(elements[2].getCssValue('text-align')).to.eventually.equal('right');
            expect(elements[3].getCssValue('text-align')).to.eventually.equal('right');
        });
        mortalityPage.getTableRowDataCells(1).then(function (elements) {
            expect(elements[0].getCssValue('text-align')).to.eventually.equal('start');
            expect(elements[1].getCssValue('text-align')).to.eventually.equal('right');
            expect(elements[2].getCssValue('text-align')).to.eventually.equal('right');
            expect(elements[3].getCssValue('text-align')).to.eventually.equal('right');
        }).then(next);
    });

    this.When(/^I choose the option "([^"]*)"$/, function (arg1, next) {
        element(by.cssContainingText('option', arg1)).click()
            .then(next);
    });


    this.Then(/^Rates, Deaths and Population values look as a single data element in the column$/, function () {
        expect(element(by.id('crudeRateDiv')).getAttribute('class')).to.eventually.include('usa-width-one-third');
    });

    this.When(/^I select "([^"]*)" type for "([^"]*)" filter$/, function (type, filter) {
        mortalityPage.selectSideFilter(filter, type).click();
    });

    this.Then(/^Rates, Deaths and Population shouldn't be overlap$/, function () {
        expect(element(by.id('crudeRateDiv')).getAttribute('class')).to.eventually.include('usa-width-one-half');
    });

    this.Then(/^I should see total for Non\-Hispanic$/, function (next) {
        mortalityPage.getSideFilterTotals().then(function(elements) {
            expect(elements[8].getInnerHtml()).to.eventually.equal('2,522,201');
        }).then(next);
    });

    this.Then(/^Unknown is disabled\- grayed out$/, function () {
        return expect(mortalityPage.ethnicityUnknownOption.element(by.tagName('input')).isEnabled()).to.eventually.equal(false);
    });

    this.When(/^the user selects Unknown$/, function (next) {
        mortalityPage.ethnicityUnknownOption.click()
            .then(next);
    });

    this.Then(/^the rest of the options are disabled\- grayed out$/, function () {
        expect(mortalityPage.ethnicityHispanicOption.element(by.tagName('input')).isEnabled()).to.eventually.equal(false);
        return expect(mortalityPage.ethnicityNonHispanicOption.element(by.tagName('input')).isEnabled()).to.eventually.equal(false);
    });

    this.Then(/^zero cells should not have percentage$/, function () {
        mortalityPage.getTableRowDataCells(1).then(function (elements) {
            expect(elements[12].getText()).to.eventually.equal('0');
        });
    });

    this.Then(/^table should not include age groups$/, function (next) {
        mortalityPage.getTableRowDataCells(0).then(function (elements) {
            expect(elements.length).to.equal(4);
        }).then(next);
    });

    this.When(/^I select the "([^"]*)" link in application$/, function (bookmarkbtn) {
        mortalityPage.bookmarkButton.click();
    });

    this.Then(/^browser's bookmarking window should be displayed to save the link to Browser$/, function () {
        //verify 'New Bookmark' text appears on bookmark window
        var alertDialog = browser.switchTo().alert();
        expect(alertDialog.getText()).to.eventually.include('HIG Search');
    });

    this.When(/^I hovers on the bookmark link$/, function () {
        browser.actions().mouseMove(mortalityPage.bookmarkButton).perform();
    });

    this.Then(/^the link gets a background box so that I feel it like a button\/action$/, function () {
        //Verify bookmarkbutton css
        expect(mortalityPage.bookmarkButton.getAttribute('class')).to.eventually.include('bookmark-button');
    });

    this.When(/^I selects a saved bookmark$/, function () {
        //Need to find out a way to select saved bookmark
    });

    this.Then(/^all the search parameters should be autopopulated and search results should be displayed$/, function () {
        mortalityPage.isVisualizationDisplayed().then(function(value) {
            expect(value).to.equal(true);
        });
        var labelArray = mortalityPage.getAxisLabelsForMinimizedVisualization();
        expect(labelArray[0].getText()).to.eventually.equal('Race');
        expect(labelArray[1].getText()).to.eventually.equal('Deaths');
        //Verify autocompleted filters and table data also.

    });

    this.Then(/^table should display Hispanic groups for Crude Death Rates/, function (next) {
        mortalityPage.getTableRowDataCells(0).then(function (elements) {
            expect(elements[0].getText()).to.eventually.equal('Non-Hispanic');
            expect(elements[1].getText()).to.eventually.equal('American Indian or Alaska Native');
            expect(elements[2].getText()).to.eventually.contains('Crude Death Rate');
            expect(elements[2].getText()).to.eventually.contains('425.0');
            expect(elements[3].getText()).to.eventually.contains('517.0');
            expect(elements[4].getText()).to.eventually.contains('470.3');
        });
        mortalityPage.getTableRowDataCells(5).then(function (elements) {
            expect(elements[0].getText()).to.eventually.equal('Hispanic');
            expect(elements[1].getText()).to.eventually.equal('American Indian or Alaska Native');
            expect(elements[2].getText()).to.eventually.contains('33.2');
            expect(elements[3].getText()).to.eventually.contains('52.6');
            expect(elements[4].getText()).to.eventually.contains('43.3');
        }).then(next);
    });

    this.Then(/^I see appropriate side filters disabled for "([^"]*)"$/, function (arg1, next) {
        var givenFilters = arg1.split(',');
        var disabledFilters = element.all(by.css('.cursor-not-allowed')).all(By.css('.filter-display-name'));
        disabledFilters.getText().then(function (filters) {
            expect(givenFilters).to.eql(filters);
        }).then(next);
    });

    this.When(/^I choose the option Age Adjusted Death Rates$/, function (next) {
        mortalityPage.ageRatesOption.click()
            .then(next);
    });

    this.Then(/^user expands placeOfDeath filter$/, function (next) {
        mortalityPage.placeOfDeathOptionsLink.click()
            .then(next);
    });

    this.Then(/^placeofDeath filter options should be in proper order$/, function (next) {
        commonPage.getAllOptionsForFilter('Place of Death').then(function(elements) {
            expect(elements[1].getText()).to.eventually.contains('All');
            expect(elements[2].getText()).to.eventually.contains('Decedent’s home');
            expect(elements[3].getText()).to.eventually.contains('Hospital, Clinic or Medical Center- Dead on Arrival');
            expect(elements[4].getText()).to.eventually.contains('Hospital, Clinic or Medical Center- Inpatient');
            expect(elements[5].getText()).to.eventually.contains('Hospital, Clinic or Medical Center- Outpatient or admitted to Emergency Room');
            expect(elements[6].getText()).to.eventually.contains('Hospital, Clinic or Medical Center- Patient status unknown');
            expect(elements[7].getText()).to.eventually.contains('Nursing home/long term care');
            expect(elements[8].getText()).to.eventually.contains('Hospice facility');
            expect(elements[9].getText()).to.eventually.contains('Other');
            expect(elements[10].getText()).to.eventually.contains('Place of death unknown');
        }).then(next);
    });

    this.When(/^user select "([^"]*)" option in "([^"]*)" filter$/, function (option, filterType, next) {
        commonPage.getFilterOptionForAFilter(filterType, option).click().then(next);
    });

    this.When(/^I deselect "([^"]*)" option in "([^"]*)" filter$/, function (option, filterType, next) {
        commonPage.getFilterOptionForAFilter(filterType, option).click().then(next);
    });

    this.Then(/^data table should display right Number of Deaths$/, function (next) {
        mortalityPage.getTableRowData(0).then(function(rowdata){
            expect(rowdata[0]).to.equals('American Indian or Alaska Native');
            expect(rowdata[3]).to.contains('875');
        });
        mortalityPage.getTableRowData(1).then(function(rowdata){
            expect(rowdata[0]).to.equals('Asian or Pacific Islander');
            expect(rowdata[3]).to.contains('3,100');
        });
        mortalityPage.getTableRowData(2).then(function(rowdata){
            expect(rowdata[0]).to.equals('Black or African American');
            expect(rowdata[3]).to.contains('22,147');
        });
        mortalityPage.getTableRowData(3).then(function(rowdata){
            expect(rowdata[0]).to.equals('White');
            expect(rowdata[3]).to.contains('183,453');
        }).then(next);
    });

    this.Then(/^I should see Crude Deth Rates page$/, function () {
        return expect(mortalityPage.deathRateDisclaimer.getText()).to.eventually.equal("Population details from NCHS Bridged-Race Estimates are used to calculate Death Rates (per 100,000).");
    });

    this.Then(/^I select "([^"]*)" value "([^"]*)"$/, function (arg1, arg2, next) {
        commonPage.getAllOptionsForFilter(arg1).then(function(elements) {
            elements[2015 - arg2 + 2].click();
        }).then(next);
    });

    this.Then(/^I un\-select "([^"]*)" value "([^"]*)"$/, function (arg1, arg2, next) {
        commonPage.getAllOptionsForFilter(arg1).then(function(elements) {
            elements[2015 - arg2 + 2].click();
        }).then(next);
    });

    this.Then(/^data table should display right population count for Crude Death Rates$/, function (next) {
        mortalityPage.getTableRowData(0).then(function(rowdata){
            expect(rowdata[0]).to.equals('American Indian or Alaska Native');
            //Female
            expect(rowdata[1]).to.contains('Crude Death Rate');
            expect(rowdata[1]).to.contains('346.1');
            expect(rowdata[1]).to.contains('Deaths');
            expect(rowdata[1]).to.contains('5,178');
            expect(rowdata[1]).to.contains('Population');
            expect(rowdata[1]).to.contains('1,496,044');
            //Male
            expect(rowdata[2]).to.contains('Crude Death Rate');
            expect(rowdata[2]).to.contains('415.6');
            expect(rowdata[2]).to.contains('Deaths');
            expect(rowdata[2]).to.contains('6,185');
            expect(rowdata[2]).to.contains('Population');
            expect(rowdata[2]).to.contains('1,488,106');
            //Number of deaths
            expect(rowdata[3]).to.contains('Crude Death Rate');
            expect(rowdata[3]).to.contains('380.8');
            expect(rowdata[3]).to.contains('Deaths');
            expect(rowdata[3]).to.contains('11,363');
            expect(rowdata[3]).to.contains('Population');
            expect(rowdata[3]).to.contains('2,984,150');
        }).then(next);
    });

    this.Then(/^total should be suppressed for all Races except White$/, function (next) {
        mortalityPage.getTableRowData(0).then(function(rowdata) {
            expect(rowdata[0]).to.equals('American Indian or Alaska Native');
            //Ethnicity
            expect(rowdata[1]).to.equals('Spaniard');
            //Female
            expect(rowdata[2]).to.equals('Suppressed');
            //Male
            expect(rowdata[3]).to.equals('11');
            //Number of Deaths
            expect(rowdata[4]).to.equals('Suppressed');
        });
        //Total for American Indian
        mortalityPage.getTableRowData(1).then(function(rowdata) {
            expect(rowdata[0]).to.equals('Total');
            expect(rowdata[1]).to.equals('Suppressed');
        });
        mortalityPage.getTableRowData(2).then(function(rowdata) {
            expect(rowdata[0]).to.equals('Asian or Pacific Islander');
            //Ethnicity
            expect(rowdata[1]).to.equals('Spaniard');
            //Female
            expect(rowdata[2]).to.equals('19');
            //Male
            expect(rowdata[3]).to.equals('Suppressed');
            //Number of Deaths
            expect(rowdata[4]).to.equals('Suppressed');
        });
        //Total for American Indian
        mortalityPage.getTableRowData(3).then(function(rowdata) {
            expect(rowdata[0]).to.equals('Total');
            expect(rowdata[1]).to.equals('Suppressed');
        });
        mortalityPage.getTableRowData(4).then(function(rowdata) {
            expect(rowdata[0]).to.equals('Black or African American');
            //Ethnicity
            expect(rowdata[1]).to.equals('Spaniard');
            //Female
            expect(rowdata[2]).to.equals('Suppressed');
            //Male
            expect(rowdata[3]).to.equals('Suppressed');
            //Number of Deaths
            expect(rowdata[4]).to.equals('Suppressed');
        });
        //Total for American Indian
        mortalityPage.getTableRowData(5).then(function(rowdata) {
            expect(rowdata[0]).to.equals('Total');
            expect(rowdata[1]).to.equals('Suppressed');
        });
        mortalityPage.getTableRowData(6).then(function(rowdata) {
            expect(rowdata[0]).to.equals('White');
            //Ethnicity
            expect(rowdata[1]).to.equals('Spaniard');
            //Female
            expect(rowdata[2]).to.equals('324 (53.3%)');
            //Male
            expect(rowdata[3]).to.equals('284 (46.7%)');
            //Number of Deaths
            expect(rowdata[4]).to.equals('608');
        });
        //Total for American Indian
        mortalityPage.getTableRowData(7).then(function(rowdata) {
            expect(rowdata[0]).to.equals('Total');
            expect(rowdata[1]).to.equals('608');
        }).then(next);
    });

    this.Then(/^data table should display right population count for year 'All' filter$/, function (next) {
        //Right now for year '2014' showing zero deaths, once this issue fixed then
        //update death values and percentages
        mortalityPage.getTableRowData(0).then(function(rowdata) {
            //Race
            expect(rowdata[0]).to.equals('American Indian or Alaska Native');
            //Female
            expect(rowdata[1]).to.equals('107,334 (45.4%)');
            //Male
            expect(rowdata[2]).to.equals('128,863 (54.6%)');
            //Number of Deaths
            expect(rowdata[3]).to.equals('236,197');
        });
        mortalityPage.getTableRowData(1).then(function(rowdata) {
            //Race
            expect(rowdata[0]).to.equals('Asian or Pacific Islander');
            //Female
            expect(rowdata[1]).to.equals('368,746 (47.9%)');
            //Male
            expect(rowdata[2]).to.equals('401,777 (52.1%)');
            //Number of Deaths
            expect(rowdata[3]).to.equals('770,523');
        }).then(next);
    });

    this.When(/^user expands state filter$/, function (next) {
        mortalityPage.stateOptionsLink.click()
            .then(next);
    });

    this.When(/^user selects Alaska state$/, function (then) {
        element(by.id('deaths_state_AK')).click()
            .then(next);
    });


    this.When(/^I un\-check Hispanic group$/, function (next) {
        mortalityPage.ethnicityHispanicOption.click()
            .then(next);
    });

    this.When(/^I see all state age adjusted rate data by rows in the result table$/, function (next) {
        mortalityPage.getTableHeaders().then(function(value) {
            expect(value).to.contains('State');
            mortalityPage.getTableCellData(0,0).then(function(data){
                expect(data).to.contains('Alabama');
            });
            mortalityPage.getTableCellData(0,1).then(function(data){
                expect(data).not.to.contains('Not Available');
                expect(data).to.contains('924.5');
            });
            mortalityPage.getTableCellData(50,0).then(function(data){
                expect(data).to.contains('Wyoming');
            });
            mortalityPage.getTableCellData(50,1).then(function(data){
                expect(data).not.to.contains('Not Available');
                expect(data).to.contains('748.3');
            });
        }).then(next);
    });

    this.When(/^I see all state age adjusted rate data by columns in the result table$/, function (next) {
        mortalityPage.getTableHeaders().then(function(value) {
            expect(value).to.contains('Alabama');
            expect(value).to.contains('Wyoming');
            mortalityPage.getTableCellData(0,0).then(function(data){
                expect(data).to.contains('924.5');
            });
            mortalityPage.getTableCellData(0,50).then(function(data){
                expect(data).not.to.contains('Not Available');
                expect(data).to.contains('748.3');
            });
        }).then(next);
    });

    this.When(/^I see all state crude rate data by rows in the result table$/, function (next) {
        mortalityPage.getTableHeaders().then(function(value) {
            expect(value).to.contains('State');
            mortalityPage.getTableCellData(0,0).then(function(data){
                expect(data).to.contains('Alabama');
            });
            mortalityPage.getTableCellData(0,1).then(function(data){
                expect(data).not.to.contains('Not Available');
                expect(data).to.contains('1,068.3');
            });
            mortalityPage.getTableCellData(50,0).then(function(data){
                expect(data).to.contains('Wyoming');
            });
            mortalityPage.getTableCellData(50,1).then(function(data){
                expect(data).not.to.contains('Not Available');
                expect(data).to.contains('815.2');
            });
        }).then(next);
    });

    this.When(/^I see all state crude rate data by columns in the result table$/, function (next) {
        mortalityPage.getTableHeaders().then(function(value) {
            expect(value).to.contains('Alabama');
            expect(value).to.contains('Wyoming');
            mortalityPage.getTableCellData(0,0).then(function(data){
                expect(data).to.contains('1,068.3');
            });
            mortalityPage.getTableCellData(0,50).then(function(data){
                expect(data).not.to.contains('Not Available');
                expect(data).to.contains('815.2');
            });
        }).then(next);
    });

    this.Then(/^I see disabled option "([^"]*)" not being displayed in data table$/, function (arg1, next) {
        element.all(by.binding('eachHeader.title')).then(function (headers) {
            headers.forEach(function (header) {
                expect(header.getText()).to.not.eventually.equal(arg1);
            })
        }).then(next);
    });

    this.When(/^I select Alabama state from state filter$/, function (next) {
        element.all(by.css('label[for=deaths_state_AL]')).then(function(elements, index) {
            elements[1].click();
        }).then(next);
    });

    this.Then(/^I see cell values being suppressed for American Indian race$/, function (next) {
        mortalityPage.getTableCellData(0,0).then(function(data){
            expect(data).to.contains('American Indian or Alaska Native');
        });
        mortalityPage.getTableCellData(0,1).then(function(data){
            expect(data).to.contains('Suppressed');
        }).then(next);
    });

    this.Then(/^I see total is also being suppressed$/, function (next) {
        mortalityPage.getTableHeaders().then(function(data){
            expect(data[22]).to.equals('Number of Deaths');
        });
        mortalityPage.getTableCellData(0,22).then(function(data){
            expect(data).to.contains('Suppressed');
        }).then(next);
    });


    this.Then(/^I see data table with Race and State values$/, function (next) {
        mortalityPage.getTableRowData(0).then(function(rowdata) {
            //Race
            expect(rowdata[0]).to.equals('American Indian or Alaska Native');
            //State
            expect(rowdata[1]).to.equals('Alabama');
            //Female
            expect(rowdata[2]).to.equals('44 (41.5%)');
            //Male
            expect(rowdata[3]).to.equals('62 (58.5%)');
            //Number of Deaths
            expect(rowdata[4]).to.equals('106');
        }).then(next);
    });

    this.Then(/^labels "([^"]*)" and "([^"]*)" are displayed on minimized visualization$/, function (arg1, arg2) {
        var labelArray = mortalityPage.getAxisLabelsForMinimizedVisualization();
        expect(labelArray[0].getText()).to.eventually.equal(arg1);
        return expect(labelArray[1].getText()).to.eventually.equal(arg2);
    });

    this.Then(/^labels "([^"]*)" and "([^"]*)" are displayed on expanded visualization$/, function (arg1, arg2, next) {
        var chart = element(by.className('custom-modal-header'));
        browser.executeScript("arguments[0].scrollIntoView();", chart);
        /*var labelArray = mortalityPage.getAxisLabelsForExpandedVisualization();
        expect(labelArray[0].getText()).to.eventually.equal(arg1);
        expect(labelArray[1].getText()).to.eventually.equal(arg2);*/
        element(by.name('close')).click().then(next);
    });

    this.When(/^I select State "([^"]*)"$/, function (arg1, next) {
        element.all(by.css('label[for=deaths_state_'+arg1+']')).then(function(elements, index) {
            elements[1].click();
        }).then(next);
    });

    this.Then(/^the rates corresponding to the deaths 0\-9 must be suppressed$/, function (next) {
        //For state District Of Columbia
        mortalityPage.getTableRowData(1).then(function(rowdata) {
            //State
            expect(rowdata[0]).to.equals('District of Columbia');
            //Female
            expect(rowdata[1]).to.contains('Suppressed');
            //Male
            expect(rowdata[2]).to.contains('Suppressed');
        }).then(next);
    });

    this.Then(/^any value in the data table is suppressed then the totals in the State filter \(sidebar\) must be suppressed too$/, function (next) {
        mortalityPage.getTableRowData(1).then(function(rowdata) {
            //Female
            expect(rowdata[1]).to.contains('Suppressed');
            //Male
            expect(rowdata[2]).to.contains('Suppressed');
            //Number of Deaths
            expect(rowdata[3]).to.contains('Suppressed');
        });
        mortalityPage.getTableRowData(2).then(function(rowdata) {
            //Total
            expect(rowdata[0]).to.contains('Total');
            expect(rowdata[1]).to.contains('Suppressed');
        }).then(next);
    });

    this.Then(/^the death count <20 then the corresponding Rate must be marked as "([^"]*)"$/, function (arg1, next) {
        mortalityPage.getTableRowData(0).then(function(rowdata) {
            //Female
            expect(rowdata[2]).to.contains('Age Adjusted Death Rate');
            expect(rowdata[2]).to.contains('Unreliable');
        }).then(next);
    });

    this.Then(/^table should display Hispanic groups for Age Adjusted Death Rates$/, function (next) {
        mortalityPage.getTableRowDataCells(0).then(function (elements) {
            expect(elements[0].getText()).to.eventually.equal('Non-Hispanic');
            expect(elements[1].getText()).to.eventually.equal('American Indian or Alaska Native');
            expect(elements[2].getText()).to.eventually.contains('Age Adjusted Death Rate');
            expect(elements[2].getText()).to.eventually.contains('679.5');
            expect(elements[3].getText()).to.eventually.contains('950.2');
            expect(elements[4].getText()).to.eventually.contains('805.7');
        });
        mortalityPage.getTableRowDataCells(5).then(function (elements) {
            expect(elements[0].getText()).to.eventually.equal('Hispanic');
            expect(elements[1].getText()).to.eventually.equal('American Indian or Alaska Native');
            expect(elements[2].getText()).to.eventually.contains('77.8');
            expect(elements[3].getText()).to.eventually.contains('119.7');
            expect(elements[4].getText()).to.eventually.contains('96.7');
        }).then(next);
    });

    this.When(/^I select a cause and click on the Filter Selected Cause\(s\) of Death\(s\) button$/, function (next) {
        var elm = element(by.id('modal-close'));
        browser.executeScript("arguments[0].scrollIntoView();", elm);
        var until = protractor.ExpectedConditions;
        browser.wait(until.presenceOf(element(by.className('jstree-checkbox'))), 10000, 'Element taking too long to appear in the DOM');
        element(by.className('jstree-checkbox')).click();
        element(by.cssContainingText('button', 'Filter Selected Cause(s) of Deaths')).click()
            .then(next);
    });

    this.Then(/^data table should display Age Adjusted Death Rates for selected cause of death$/, function (next) {
        mortalityPage.getTableRowDataCells(0).then(function (elements) {
            expect(elements[0].getText()).to.eventually.equal('Non-Hispanic');
            expect(elements[1].getText()).to.eventually.equal('American Indian or Alaska Native');
            expect(elements[2].getText()).to.eventually.contains('Age Adjusted Death Rate');
            expect(elements[2].getText()).to.eventually.contains('22.4');
            expect(elements[3].getText()).to.eventually.contains('28.1');
            expect(elements[4].getText()).to.eventually.contains('25.1');
        });
        mortalityPage.getTableRowDataCells(1).then(function (elements) {
            expect(elements[0].getText()).to.eventually.equal('Asian or Pacific Islander');
            expect(elements[1].getText()).to.eventually.contains('8.0');
            expect(elements[2].getText()).to.eventually.contains('12.4');
            expect(elements[3].getText()).to.eventually.contains('9.9');
        }).then(next);
    });

    this.When(/^I select Age Groups from '20' to '100'$/, function (next) {
        element(by.className('jslider-scale')).all(by.tagName('span')).then(function(elements){
            elements[5].click();
        }).then(next);
    });

    this.Then(/^Age Group values "([^"]*)" and "([^"]*)" should be displayed on slider$/, function (arg1, arg2, next) {
        element.all(by.className('jslider-value')).then(function(elements){
            expect(elements[0].getText()).to.eventually.equal(arg1);
            expect(elements[1].getText()).to.eventually.equal(arg2);
        }).then(next);
    });

    this.Then(/^mortality data table should display results for Age Group$/, function () {
        mortalityPage.getTableRowDataCells(0).then(function (elements) {
            expect(elements[0].getText()).to.eventually.equal('American Indian or Alaska Native');
            //15 - 19 years
            expect(elements[1].getText()).to.eventually.contains('Not Available');
            //20 - 24 years
            expect(elements[2].getText()).to.eventually.contains('Suppressed');
            //25 - 29 years
            expect(elements[3].getText()).to.eventually.contains('Not Available');
        });
        mortalityPage.getTableRowDataCells(2).then(function (elements) {
            expect(elements[0].getText()).to.eventually.equal('Black or African American');
            //15 - 19 years
            expect(elements[1].getText()).to.eventually.contains('83 (0.7%)');
            //20 - 24 years
            expect(elements[2].getText()).to.eventually.contains('169 (1.5%)');
            //25 - 29 years
            expect(elements[3].getText()).to.eventually.contains('187 (1.6%)');
        });
    });

    this.Then(/^I see data in data table grouped by Underlying Cause of Death and Race$/, function (next) {
        mortalityPage.getTableRowDataCells(0).then(function (elements) {
            expect(elements[0].getText()).to.eventually.equal('Certain infectious and parasitic diseases(A00-B99)');
            mortalityPage.getTableCellData(0,1).then(function(data){
                expect(data).to.contains('American Indian or Alaska Native');
            });
            mortalityPage.getTableCellData(0,2).then(function(data){
                expect(data).to.contains('295 (46.8%)');
            });

            mortalityPage.getTableRowDataCells(5).then(function (elements) {
                expect(elements[0].getText()).to.eventually.equal('Intestinal infectious diseases(A00-A09)');
                mortalityPage.getTableCellData(5,1).then(function(data){
                    expect(data).to.contains('American Indian or Alaska Native');
                });
                mortalityPage.getTableCellData(5,2).then(function(data){
                    expect(data).to.contains('38 (55.9%)');
                });
            });
        }).then(next);
    });

    this.Then(/^I should see the options "([^"]*)" enabled$/, function (filters, next) {
        var enabled = filters.split(', ');
        mortalityPage.getDisabledSideFilters().then(function (disabled) {
            enabled.map(function (filter) {
                expect(disabled).to.not.contain(filter);
            });
        }).then(next);
    });

    this.Then(/^I see "([^"]*)" in list of applied filters$/, function (selectedFilters, next) {
        mortalityPage.getSelectedFilters().then(function (items, next) {
            items.forEach(function (item) {
                item.getText().then(function (text) {
                    expect(selectedFilters).to.contains(text);
                });
            });
        }).then(next);
    });

    this.Then(/^I see count for few states are suppressed$/, function (next) {
        mortalityPage.getSideFilterTotals().then(function(elements) {
            expect(elements[41].getInnerHtml()).to.eventually.equal('Suppressed');
            expect(elements[62].getInnerHtml()).to.eventually.equal('Suppressed');
        }).then(next);
    });

    this.When(/^user clicks on "([^"]*)" more link$/, function (arg1, next) {
        var elm = element(by.cssContainingText('a', arg1));
        commonPage.scrollToElement(elm);
        elm.click().then(next);
    });

    this.Then(/^I see suppressed data in data table$/, function (next) {
        mortalityPage.getTableRowData(7).then(function(rowdata) {
            //race
            expect(rowdata[0]).to.contains('American Indian or Alaska Native');
            //state
            expect(rowdata[1]).to.contains('Delaware');
            //10 should not be suppressed
            expect(rowdata[2]).to.contains(10);
            // value < 10 should be suppressed
            expect(rowdata[3]).to.contains('Suppressed');
            //total should be suppressed
            expect(rowdata[4]).to.contains('Suppressed');
        }).then(next);
    });


    this.Then(/^I see Multiple Causes of Deaths in datatable$/, function (next) {
        mortalityPage.getTableRowDataCells(0).then(function (elements) {
            expect(elements[0].getText()).to.eventually.equal('I00-I99');
            expect(elements[1].getText()).to.eventually.equal('American Indian or Alaska Native');
            expect(elements[2].getText()).to.eventually.contains('4,180 (45.9%)');
            expect(elements[3].getText()).to.eventually.contains('4,929 (54.1%)');
        }).then(next);
    });

};
module.exports = mortalityStepDefinitionsWrapper;
