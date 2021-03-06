var AidsPage = function () {

    // All filters
    this.getFilters = function () {
        return element.all(by.className('filter-display-name'))
            .getText();
    };

    // Single filter actions
    this.getFilter = function (target_filter) {
        return element.all(by.cssContainingText('.side-pane-div', target_filter))
            .first();
    };

    this.expandFilter = function (target_filter) {
        return this.getFilter(target_filter)
            .all(by.tagName('a'))
            .first()
            .click();
    };

    this.clickMoreOptionsForFilter = function (target_filter) {
        return this.getFilter(target_filter)
            .element(by.xpath('..'))
            .element(by.className('more-options'))
            .click();
    };

    this.getOptionsForFilter = function (target_filter) {
        return this.getFilter(target_filter)
            .element(by.xpath('..'))
            .element(by.tagName('ul'))
            .all(by.className('custom-label'))
            .map(function (el) {
                return el.getText();
            });
    };

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

    this.getElementContainingText = function (text) {
        return element(by.partialLinkText(text));
    };
};

module.exports = new AidsPage;
