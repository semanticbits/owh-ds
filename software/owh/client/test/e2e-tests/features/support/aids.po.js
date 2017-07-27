var AidsPage = function () {

    // All filters
    this.getFilters = function () {
        return element.all(by.className('filter-display-name'))
            .getText();
    };

    // Single filter actions
    this.getFilter = function (target_filter) {
        return element.all(by.cssContainingText('.side-pane-label', target_filter))
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

    this.getAxisLabelsForMinimizedVisualization= function (xIndex, yIndex) {
        //Verify Visualization has 'nv-axislabel' css class for both axis
        //minimized visualization has id starts with '.chart_'
        var chartId= 'chart_'+xIndex+'_'+yIndex;
        var axis_x_label = element(by.id(chartId)).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-x.nv-axis')).element(by.css('.nv-axislabel'));
        var axis_y_label = element(by.id(chartId)).element(by.css('.nvd3.nv-wrap.nv-multiBarHorizontalChart')).element(by.css('.nv-y.nv-axis')).element(by.css('.nv-axislabel'));
        return [axis_x_label, axis_y_label];
    };
};

module.exports = new AidsPage;
