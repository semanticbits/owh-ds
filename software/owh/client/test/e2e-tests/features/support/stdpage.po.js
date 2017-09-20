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
        return element.all(by.className('side-pane-div')).filter(function (category) {
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

    std.getAxisLabelsForMinimizedVisualization= function (xIndex, yIndex) {
        //Verify Visualization has 'nv-axislabel' css class for both axis
        //minimized visualization has id starts with '.chart_'
        var chartId= 'chart_'+xIndex+'_'+yIndex;
        var axis_x_label = element(by.id(chartId)).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-x.nv-axis')).element(by.css('.nv-axislabel'));
        var axis_y_label = element(by.id(chartId)).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-y.nv-axis')).element(by.css('.nv-axislabel'));
        return [axis_x_label, axis_y_label];
    };

    std.getAxisLabelsForExpandedVisualization= function (index) {
        //Verify Visualization has 'nv-axislabel' css class for both axis
        //minimized visualization has id starts with '.chart_'
        var chartId = 'chart_expanded_'+index;
        var elm = element(by.id(chartId));
        browser.executeScript("arguments[0].scrollIntoView();", elm);

        var axis_x_label = element(by.id(chartId)).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-x.nv-axis')).element(by.css('.nv-axislabel'));
        var axis_y_label = element(by.id(chartId)).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-y.nv-axis')).element(by.css('.nv-axislabel'));
        return [axis_x_label, axis_y_label];
    };
};

module.exports = new STDpage;