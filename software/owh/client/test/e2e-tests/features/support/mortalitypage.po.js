var MortalitySearchPage = function() {
    var msp = this;

    msp.chartDataDiv = element(by.repeater('chartData in startChartData'));
    msp.expandVisualizationLink = element(by.css('a[name=expand_graph]'));
    msp.sideMenu = element(by.className('owh-side-menu'));
    msp.hideFiltersBtn = element(by.cssContainingText('a', '<< Hide Filters'));
    msp.showFiltersBtn = element(by.cssContainingText('a', 'Show Filters >>'));
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
    msp.interestedInSelectBox = element(by.id('interestedIn'));
    msp.deathRatesOption = element(by.cssContainingText('option', 'Crude Death Rates'));
    msp.ageRatesOption = element(by.cssContainingText('option', 'Age Adjusted Death Rates'));
    msp.creduDeathRatesOption = element(by.cssContainingText('option', 'Crude Death Rates'));
    msp.showMeDropDown = element(by.id('showMeDropDown'));
    msp.tableViewDropdown = element(by.model('ots.selectedShowFilter'));
    msp.mainSearch = element(by.tagName('owh-search'));
    msp.deathRateDisclaimer = element(by.id('death-rate-disclaimer'));
    msp.ethnicityHispanicOption = element(by.id('deaths_hispanicOrigin_Hispanic')).element(by.xpath('..'));
    msp.ethnicityDominicanOption = element(by.id('deaths_hispanicOrigin_Dominican')).element(by.xpath('..'));
    msp.ethnicitySpaniardOption = element(by.id('deaths_hispanicOrigin_Spaniard')).element(by.xpath('..'));
    msp.showMoreYears = element(by.cssContainingText('a', '+ 13 more'));
    msp.showLessYears = element(by.cssContainingText('a', '- 13 less'));
    msp.expandEthnicity = element(by.cssContainingText('a', 'Ethnicity'));
    msp.ethnicityUnknownOption = element(by.id('deaths_hispanicOrigin_Unknown')).element(by.xpath('..'));
    msp.ethnicityNonHispanicOption = element(by.id('deaths_hispanicOrigin_Non-Hispanic')).element(by.xpath('..'));
    msp.bookmarkButton = element(by.cssContainingText('a', 'Bookmark this Search'));

    msp.getSelectedFilterType = function() {
       return msp.interestedInSelectBox.$('option:checked').getText();
    };

    msp.getSelectedShowMeFilterType = function() {
       return msp.showMeDropDown.$('option:checked').getText();
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
        var axis_x_label = element(by.id('chart_0_0')).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-x.nv-axis')).element(by.css('.nv-axislabel'));
        var axis_y_label = element(by.id('chart_0_0')).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-y.nv-axis')).element(by.css('.nv-axislabel'));
        return [axis_x_label, axis_y_label];
    };
    msp.getAxisLabelsForExpandedVisualization= function () {
        //Verify Visualization has 'nv-axislabel' css class for both axis
        //expanded visualization has id starts with '.chart_expanded_'
        var axis_x_label = element(by.id('chart_expanded_0')).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-x.nv-axis')).element(by.css('.nv-axislabel'));
        var axis_y_label = element(by.id('chart_expanded_0')).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-y.nv-axis')).element(by.css('.nv-axislabel'));
        return [axis_x_label, axis_y_label]
    };
    msp.getTableHeaders = function() {
        //Verify that owhTable has given column
        return msp.owhTable.element(by.tagName('table')).element(by.tagName('thead')).all(by.tagName('th')).getText();

    };
    msp.getTableRowData = function(rowNumber) {
        return msp.owhTable.element(by.id('clusterize-table')).element(by.tagName('tbody')).all(by.tagName('tr')).get(rowNumber).all(by.tagName('td')).getText();
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
        return element(by.cssContainingText('a', filterType)).element(By.xpath('following-sibling::owh-toggle-switch')).element(by.cssContainingText('a', viewType));
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

    msp.getOptions = function(filterType) {
        return element(by.cssContainingText('a', filterType)).element(by.xpath('ancestor::label')).element(by.xpath('following-sibling::ul')).all(by.tagName('li'));
    };

    msp.getGroupOptions = function(filterType) {
        return element(by.cssContainingText('a', filterType)).element(by.xpath('ancestor::label')).element(by.xpath('following-sibling::ul')).all(by.className('owh-side-menu__group-option'));
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

};

module.exports = new MortalitySearchPage;
