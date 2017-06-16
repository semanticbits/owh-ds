var TBpage = function() {
    var tb = this;

    tb.owhTable = element(by.tagName('owh-table'));
    tb.owhSideFilters = element(by.tagName('owh-side-filter'));

    tb.getTableHeaders = function() {
        return tb.owhTable.element(by.tagName('table')).element(by.tagName('thead')).all(by.tagName('th')).getText();
    };
    tb.getTableRowData = function(rowNumber) {
        return tb.owhTable.element(by.id('clusterize-table')).element(by.tagName('tbody')).all(by.tagName('tr')).get(rowNumber).all(by.tagName('td')).getText();
    };

    tb.getElementContainingText = function (text) {
        return element(by.partialLinkText(text));
    }

};

module.exports = new TBpage;