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

    std.getFilter = function (target_filter) {
        return element.all(by.className('side-pane-label')).filter(function (category) {
            return category.element(by.className('filter-display-name')).getText()
                .then(function (text) {
                    return text === target_filter;
                });
        })
            .first();
    };
    std.getDisabledFilterOptions = function (target_filter) {
        return std.getFilter(target_filter)
            .element(by.xpath('..'))
            .element(by.tagName('ul')).all(by.className('disable-click'))
            .map(function (label) {
                return label.getText()
            });
    };

};

module.exports = new STDpage;