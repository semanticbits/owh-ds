var CommonPage = function() {
    var cp = this;
    cp.backButton = element(by.css('button[title="Previous Query"]'));
    cp.forwardButton = element(by.css('button[title="Next Query"]'));
    cp.interestedInSelectBox = element(by.id('interestedIn'));

    cp.getSelectedFilterType = function() {
        return cp.interestedInSelectBox.$('option:checked').getText();
    };

    cp.getFilterByType = function (type) {
        return element(by.cssContainingText('div.sidebar-filter-label', type))
    };

    cp.getSwitchForFilterType = function (type) {
        var filter = cp.getFilterByType(type);
        return filter.element(By.xpath('following-sibling::owh-toggle-switch'));
    };

    cp.getRowSwitchByFilterType = function (type) {
        var swtch = cp.getSwitchForFilterType(type);
        return swtch.element(by.cssContainingText('a', 'Row'));
    };

    cp.getColumnSwitchByFilterType = function (type) {
        var swtch = cp.getSwitchForFilterType(type);
        return swtch.element(by.cssContainingText('a', 'Column'));
    };

    cp.getOffSwitchByFilterType = function (type) {
        var swtch = cp.getSwitchForFilterType(type);
        return swtch.element(by.cssContainingText('a', 'Off'));
    };

    cp.getFilterOptionContainerForFilter = function (filterType) {
        var filter = cp.getFilterByType(filterType);
        return filter.element(by.xpath('ancestor::label')).element(by.xpath('following-sibling::ul'))
    };

    cp.getAllOptionsForFilter = function (filterType) {
        var optionsContainer = cp.getFilterOptionContainerForFilter(filterType);
        return optionsContainer.all(by.tagName('li'));
    };

    cp.getGroupOptionsFor = function (filterType) {
        var optionsContainer = cp.getFilterOptionContainerForFilter(filterType);
        return optionsContainer.all(by.className('owh-side-menu__group-option'));
    };

    cp.getFilterOptionForAFilter = function (filterType, filterOption) {
        var filterOptions = cp.getFilterOptionContainerForFilter(filterType);
        return filterOptions.element(by.xpath('.//*[.="'+filterOption+'"]'));
    };
    
    cp.getShowMoreFilterOptionsLinkFor = function (filterType, linkText) {
        return cp.getFilterOptionContainerForFilter(filterType).element(by.cssContainingText('a', linkText));
    }

    cp.getShowLessFilterOptionsLinkFor = function (filterType, linkText) {
        return cp.getFilterOptionContainerForFilter(filterType).element(by.cssContainingText('a', linkText));
    }
};

module.exports = new CommonPage;
