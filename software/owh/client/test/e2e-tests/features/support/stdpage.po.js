var STDpage = function() {
    var std = this;

    std.owhTable = element(by.tagName('owh-table'));
    std.owhSideFilters = element(by.tagName('owh-side-filter'));

    std.getTableHeaders = function() {
        return std.owhTable.element(by.tagName('table')).element(by.tagName('thead')).all(by.tagName('th')).getText();
    };
    std.getTableRowData = function(rowNumber) {
        return std.owhTable.element(by.id('clusterize-table')).element(by.tagName('tbody')).all(by.tagName('tr')).get(rowNumber).all(by.tagName('td')).getText();
    };

};

module.exports = new STDpage;