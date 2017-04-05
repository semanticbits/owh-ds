var NatalitySearchPage = function () {

    var nsp = this;

    nsp.showMeDropDown = element(by.id("showMeDropDown"));
    nsp.owhTable = element(by.tagName('owh-table'));

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
};


module.exports = new NatalitySearchPage;