var CancerIncidencePage = function () {

    // Table
    this.owhTable = function () {
        return element(by.tagName('owh-table'));
    };

    this.getTableHeaders = function () {
        return this.owhTable()
            .all(by.tagName('table'))
            .first()
            .element(by.tagName('thead'))
            .all(by.tagName('th'))
            .getText();
    };

    this.getTableRow = function (row) {
        return this.owhTable()
            .element(by.id('clusterize-table'))
            .element(by.tagName('tbody'))
            .all(by.tagName('tr'))
            .get(row)
            .all(by.tagName('td'))
            .getText();
    };

    this.isVisualizationDisplayed = function () {
        return element(by.css('.nvd3-svg')).isPresent() && element(by.css('.nv-y.nv-axis')).isPresent() && element(by.css('.nv-x.nv-axis')).isPresent();
    };
};

module.exports = new CancerIncidencePage;
