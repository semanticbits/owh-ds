var CancerMortalityPage = function () {

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
};

module.exports = new CancerMortalityPage;
