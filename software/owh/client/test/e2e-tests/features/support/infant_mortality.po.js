var InfantMortalityPage = function () {

    var imp = this;

    // Sidebar Elements and Actions
    imp.getFilter = function (target_filter) {
        return element.all(by.className('side-pane-div')).filter(function (category) {
            return category.element(by.className('filter-display-name')).getText()
                .then(function (text) {
                    return text === target_filter;
                });
        })
        .first();
    };

    imp.getSelectedOptionForFilter = function (target_filter) {
        return imp.getFilter(target_filter)
            .element(by.tagName('owh-toggle-switch'))
            .element(by.className('selected'))
            .getText();
    };

    imp.expandFilter = function (target_filter) {
        return imp.getFilter(target_filter)
            .element(by.tagName('a'))
            .click();
    };

    imp.clickMoreOptionsForFilter = function (target_filter) {
        return imp.getFilter(target_filter)
            .element(by.xpath('..'))
            .element(by.className('more-options'))
            .click();
    };

    imp.getAvailableFilterOptions = function (target_filter) {
        return imp.getFilter(target_filter)
            .element(by.xpath('..'))
            .element(by.tagName('ul')).all(by.className('count-label'))
            .map(function (label) {
                return label.getText();
            });
    };

    imp.getDisabledFilterOptions = function (target_filter) {
        return imp.getFilter(target_filter)
            .element(by.xpath('..'))
            .element(by.tagName('ul')).all(by.className('disable-click'))
            .map(function (label) {
                return label.getText()
            });
    };

    imp.clickOptionForFilter = function (target_filter, option) {
        return imp.getFilter(target_filter)
            .element(by.xpath('..'))
            .element(by.tagName('ul')).all(by.className('count-label'))
            .filter(function (label) {
                return label.getText().then(function (text) {
                    return text === option;
                });
            })
            .first()
            .element(by.xpath('ancestor::label'))
            .click();
    };

    // Sidebar Category Elements and Actions
    imp.getCategories = function() {
        return element.all(by.className('filter-category')).map(function (category) {
            return category.getText();
        });
    };

    imp.getCategory = function (target_category) {
        return element.all(by.className('filter-category')).filter(function (category) {
            return category.getText()
                .then(function (text) {
                    return text === target_category;
                });
        })
        .first()
        .element(by.xpath('..'))
    };

    imp.expandCategory = function (target_category) {
        return imp.getCategory(target_category)
            .element(by.className('toggle-filter-link'))
            .element(by.tagName('a'))
            .click();
    };

    imp.getFiltersForCategory = function (target_category) {
        return imp.getCategory(target_category)
            .all(by.className('side-pane-div'))
            .map(function (filter) {
                return filter.element(by.className('filter-display-name')).getText();
            });
    };

    // Table elements
    imp.owhTable = element(by.tagName('owh-table'));

    imp.getTableHeaders = function () {
        return imp.owhTable.element(by.tagName('table')).element(by.tagName('thead')).all(by.tagName('th')).getText();
    };

    imp.getTableRowData = function (row) {
        return imp.owhTable.element(by.id('clusterize-table')).element(by.tagName('tbody')).all(by.tagName('tr')).get(row).all(by.tagName('td')).getText();
    };

    imp.getAxisLabelsForMinimizedVisualization= function (xIndex, yIndex) {
        var chartId= 'chart_'+xIndex+'_'+yIndex;
        var axis_x_label = element(by.id(chartId)).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-x.nv-axis')).element(by.css('.nv-axislabel'));
        var axis_y_label = element(by.id(chartId)).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-y.nv-axis')).element(by.css('.nv-axislabel'));
        return [axis_x_label, axis_y_label];
    };
};


module.exports = new InfantMortalityPage;