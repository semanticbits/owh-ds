var MortalitySearchPage = function() {
    var msp = this;

    msp.chartDataDiv = element(by.repeater('chartData in startChartData'));
    msp.expandVisualizationLink = element(by.css('a[name=expand_graph]'));
    msp.sideMenu = element(by.className('owh-side-menu'));
    msp.hideFiltersBtn = element(by.cssContainingText('a', 'HIDE FILTERS'));
    msp.showFiltersBtn = element(by.cssContainingText('a', 'SHOW FILTERS'));
    msp.owhTable = element(by.tagName('owh-table'));
    msp.showOrHidePecentageDiv = element(by.id('togglePercentage'));
    msp.showPecentageButton = element(by.id('togglePercentage')).element(by.cssContainingText('a', 'Show'));
    msp.hidePecentageButton = element(by.id('togglePercentage')).element(by.cssContainingText('a', 'Hide'));
    msp.raceOptionsLink = element(by.partialLinkText('Race'));
    msp.stateOptionsLink = element(by.partialLinkText('State'));
    msp.sexOptionsLink = element(by.partialLinkText('Sex'));
    msp.autopsyOptionsLink = element(by.partialLinkText('Autopsy'));
    msp.placeOfDeathOptionsLink = element(by.partialLinkText('Place of Death'));
    msp.raceOption2Link = element(by.cssContainingText('label', 'White'));
    msp.raceOption2 = element(by.cssContainingText('a', 'Race')).element(by.xpath('ancestor::label')).element(by.xpath('following-sibling::ul')).all(by.tagName('li')).get(3);
    msp.interestedInSelectBox = element(by.id('selectedPrimaryFilterDiv'));
    msp.interestedInDropdown = element(by.className('dropdown-submenu'));
    msp.deathRatesOption = element(by.cssContainingText('option', 'Crude Death Rates'));
    msp.ageRatesOption = element(by.cssContainingText('option', 'Age Adjusted Death Rates'));
    msp.creduDeathRatesOption = element(by.cssContainingText('option', 'Crude Death Rates'));
    msp.tableViewDropdown = element(by.model('ots.selectedShowFilter'));
    msp.mainSearch = element(by.tagName('owh-menu'));
    msp.deathRateDisclaimer = element(by.id('death-rate-disclaimer'));
    msp.ethnicityHispanicOption = element(by.id('deaths_hispanicOrigin_Hispanic')).element(by.xpath('..'));
    msp.ethnicityDominicanOption = element(by.id('deaths_hispanicOrigin_Dominican')).element(by.xpath('..'));
    msp.ethnicitySpaniardOption = element(by.id('deaths_hispanicOrigin_Spaniard')).element(by.xpath('..'));
    msp.showMoreYears = element(by.cssContainingText('a', '+ 13 more'));
    msp.expandEthnicity = element(by.cssContainingText('a', 'Ethnicity'));
    msp.ethnicityUnknownOption = element(by.id('deaths_hispanicOrigin_Unknown')).element(by.xpath('..'));
    msp.ethnicityNonHispanicOption = element(by.id('deaths_hispanicOrigin_Non-Hispanic')).element(by.xpath('..'));
    msp.bookmarkButton = element(by.cssContainingText('a', 'Bookmark this Search'));

    msp.getSelectedFilterType = function() {
       return msp.interestedInSelectBox.getText();
    };

    msp.getByTypeSelectedFilters = function() {
        return element.all( by.repeater("$item in $select.selected"));
    };

    msp.isVisualizationDisplayed = function(){
        //Verify visualization css classes present or not
        return element(by.css('.nvd3-svg')).isPresent() &&
               element(by.css('.nv-y.nv-axis')).isPresent() &&
               element(by.css('.nv-x.nv-axis')).isPresent()
    };

    msp.getAxisLabelsForMinimizedVisualization= function () {
        //Verify Visualization has 'nv-axislabel' css class for both axis
        //minimized visualization has id starts with '.chart_'
        var axis_x_label = element(by.id('chart_0_1')).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-x.nv-axis')).element(by.css('.nv-axislabel'));
        var axis_y_label = element(by.id('chart_0_1')).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-y.nv-axis')).element(by.css('.nv-axislabel'));
        return [axis_x_label, axis_y_label];
    };
    msp.getAxisLabelsForExpandedVisualization= function () {
        //Verify Visualization has 'nv-axislabel' css class for both axis
        //expanded visualization has id starts with '.chart_expanded_'
        var chart = element(by.id('chart_expanded_0'));
        browser.executeScript("arguments[0].scrollIntoView();", chart);
        var axis_x_label = chart.element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-x.nv-axis')).element(by.css('.nv-axislabel'));
        var axis_y_label = chart.element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-y.nv-axis')).element(by.css('.nv-axislabel'));
        return [axis_x_label, axis_y_label]
    };
    msp.getTableHeaders = function() {
        //Verify that owhTable has given column
        return msp.owhTable.element(by.tagName('table')).element(by.tagName('thead')).all(by.tagName('th')).getText();

    };
    msp.getTableRowData = function(rowNumber) {
        return msp.owhTable.element(by.id('clusterize-table')).element(by.tagName('tbody')).all(by.tagName('tr')).get(rowNumber).all(by.tagName('td')).getText();
    };

    msp.getTableDataByRowFilterAndColumnHeaderText = function (rowFilter, headerCellText) {
        return msp.owhTable.element(by.tagName('table')).element(by.tagName('thead')).all(by.tagName('th')).getText().then(function (cells) {
            var columnIndex = cells.indexOf(headerCellText);

            return msp.owhTable.element(by.id('clusterize-table')).element(by.tagName('tbody')).all(by.tagName('tr')).filter(rowFilter).all(by.tagName('td')).get(columnIndex).getText();
        });
    };

    msp.getTableCellData = function(row, column) {
        return msp.owhTable.element(by.id('clusterize-table')).element(by.tagName('tbody')).all(by.tagName('tr')).get(row).all(by.tagName('td')).get(column).getText();
    };

    msp.getTableRowDataCells = function(rowNumber) {
        return msp.owhTable.element(by.id('clusterize-table')).element(by.tagName('tbody')).all(by.tagName('tr')).get(rowNumber).all(by.tagName('td'));
    };
    //FilterType ex: Race, Sex, Autopsy...
    //viewType ex: Column, Row, Off
    msp.selectSideFilter = function(filterType, viewType) {
        return element(by.cssContainingText('div.sidebar-filter-label', filterType)).element(By.xpath('following-sibling::owh-toggle-switch')).element(by.cssContainingText('a', viewType));
    };

    msp.getCategoryBars = function() {
        return element.all(by.className('owh-question__title'));
    };

    msp.getCategoryContents = function() {
        return element.all(by.className('owh-question__table'));
    };

    msp.getShowMoreLinks = function() {
        return element.all(by.className('owh-question__show'));
    };

    msp.getCategoryQuestions = function() {
        return element.all(by.className('owh-question__question'));
    };

    msp.getExpandLinks = function() {
        return element.all(by.className('owh-question__expand'));
    };

    msp.getSideFilterTotals = function() {
        return element(by.tagName('owh-side-filter')).all(by.className('count-value'));
    };

    msp.getOptionByFilterAndKey = function(filter, key) {
        return element(by.id('deaths_' + filter + '_' + key)).element(by.xpath('..'));
    };

    msp.expandStateFilter = function() {
        element(by.cssContainingText('a', 'State')).click();
    };

    msp.getDisabledSideFilters = function () {
        return element.all(by.className('disabled-filter'))
            .map(function (el) {
                return el.element(by.className('filter-display-name'))
                    .getText()
            })
    };

    msp.getSelectedFilters = function () {
        return element.all(by.repeater("filter in lfc.appliedFilters | orderBy: lfc.getFilterOrder"));
    };
};

module.exports = new MortalitySearchPage;
