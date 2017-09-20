var PRAMSSearchPage = function() {
    var prams = this;

    prams.dataTable = element(by.className('owh-data-table'));

    prams.getSelectedPramsClass = function () {
        return element(by.css('select[ng-options="eachFilter.title | translate for eachFilter in ots.showFilters.prams"]')).$('[selected]');
    };

    prams.getTableHeadData = function(rowNumber) {
        return prams.dataTable.element(by.tagName('thead')).all(by.tagName('tr')).get(rowNumber).all(by.tagName('th')).getText();
    };

    prams.getChartAxis = function () {
        var xAxis = element(by.css('.nv-x.nv-axis')).element(by.css('.nv-axislabel'));
        var yAxis = element(by.css('.nv-y.nv-axis')).element(by.css('.nv-axislabel'));
        return [xAxis, yAxis];
    };

    prams.getChartHeader = function () {
        return element(by.binding('eg.graphTitle| translate'));
    };

    prams.updateClassTo = function (clazz) {
        element(by.cssContainingText('option', clazz)).click();
    };

    prams.getPramsTopics = function () {
        return element.all(by.css('label[for*=prams_topic_cat] span'));
    };

    prams.getQuestionTree = function () {
        var elm = element(by.id('modal-close'));
        browser.executeScript("arguments[0].scrollIntoView();", elm);
        return element.all(by.css('li[aria-expanded=false] a'));
    };
};

module.exports = new PRAMSSearchPage;
