var FactsheetsPage = function() {
    var fsp = this;

    fsp.pageHeading = element(by.id('pageHeading'));
    fsp.pageDescription = element(by.id('pageDescription'));
    fsp.stateSelectBox = element(by.id('state'));
    fsp.generateFactSheetLink = element(by.id('generateFactSheetLink'));
    fsp.downloadFactSheetLink = element(by.id('downloadFactSheetLink'));

    fsp.getTableHeaders = function(tableClassName) {
        return element(by.className(tableClassName)).element(by.tagName('thead')).all(by.tagName('th')).getText();
    };
    fsp.getTableCellData = function(tableClassName, row, column) {
        return element(by.className(tableClassName)).element(by.tagName('tbody')).all(by.tagName('tr')).get(row).all(by.tagName('td')).get(column).getText();
    };
    fsp.getTableRowData = function(tableClassName, row) {
        return element(by.className(tableClassName)).all(by.tagName('tr')).get(row).all(by.tagName('td')).getText();
    };

};
module.exports = new FactsheetsPage;
