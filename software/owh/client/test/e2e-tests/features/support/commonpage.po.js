var CommonPage = function() {
    var cp = this;
    cp.backButton = element(by.css('i[title="Previous query"]'));
    cp.forwardButton = element(by.css('i[title="Next query"]'));
    cp.interestedInSelectBox = element(by.id('selectedPrimaryFilterDiv'));
    cp.secondaryMenu = element(by.className('dropdown-submenu'));

    cp.getSelectedFilterType = function() {
        return cp.interestedInSelectBox.getText();
    };

    cp.getFilterByType = function (type) {
        var elm = element(by.cssContainingText('div.sidebar-filter-label', type));
        browser.executeScript("arguments[0].scrollIntoView();", elm);
        return element(by.cssContainingText('div.sidebar-filter-label', type));
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
        return filter.element(by.xpath('ancestor::span')).element(by.tagName('ul'))
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
    };
};

module.exports = new CommonPage;
