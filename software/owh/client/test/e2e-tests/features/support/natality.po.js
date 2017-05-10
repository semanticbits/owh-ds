var NatalitySearchPage = function () {

    var nsp = this;

    nsp.showMeDropDown = element(by.id("showMeDropDown"));
    nsp.owhTable = element(by.tagName('owh-table'));
    nsp.birthRateDisclaimer = element(by.id('birth-rate-disclaimer'));
    nsp.showOrHidePecentageDiv = element(by.id('togglePercentage'));
    nsp.showPecentageButton = element(by.id('togglePercentage')).element(by.cssContainingText('a', 'Show'));
    nsp.hidePecentageButton = element(by.id('togglePercentage')).element(by.cssContainingText('a', 'Hide'));

    nsp.getFilterCategories = function() {
        return element.all(by.className('filter-category'));
    };

    nsp.getVisibleFilters = function (categoryIndex) {
        return element.all(by.css('.category-'+categoryIndex+' li.accordion'));
    };

    nsp.getSelectedFilterType = function() {
        return nsp.showMeDropDown.$('option:selected').getText();
    };

    nsp.getTableRowData = function(rowNumber) {
        return nsp.owhTable.element(by.id('clusterize-table')).element(by.tagName('tbody')).all(by.tagName('tr')).get(rowNumber).all(by.tagName('td')).getText();
    };

    nsp.getOptions = function(filterType) {
        return element(by.cssContainingText('a', filterType)).element(by.xpath('ancestor::label')).element(by.xpath('following-sibling::ul')).all(by.tagName('li'));
    };

    nsp.selectSideFilter = function(filterType, viewType) {
        return element(by.cssContainingText('a', filterType)).element(By.xpath('following-sibling::owh-toggle-switch')).element(by.cssContainingText('a', viewType));
    };

};


module.exports = new NatalitySearchPage;