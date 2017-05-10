var PRAMSSearchPage = function() {
    var prams = this;

    prams.pramsOption = element(by.cssContainingText('option', 'PRAMS'));
    prams.dataTable = element(by.className('owh-data-table'));

    prams.getSelectedPramsClass = function () {
        return element(by.css('select[ng-options="eachFilter.title | translate for eachFilter in ots.showFilters.prams"]')).$('[selected]');
    };

    prams.getTableHeadData = function(rowNumber) {
        return prams.dataTable.element(by.tagName('thead')).all(by.tagName('tr')).get(rowNumber).all(by.tagName('th')).getText();
    };
};

module.exports = new PRAMSSearchPage;
