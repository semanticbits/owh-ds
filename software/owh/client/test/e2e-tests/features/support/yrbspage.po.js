var YRBSSearchPage = function() {
    var ysp = this;

    ysp.yrbsOption = element(by.cssContainingText('option', 'Youth Risk Behavior'));
    ysp.sideFilterUnOrderedList = element(by.css('.side-filters'));
    ysp.selectQuestionsButton = element(by.cssContainingText('button', 'Select Questions'));
    ysp.addSelectedQuestionsButton = element(by.cssContainingText('button', 'Filter Selected Questions'));
    ysp.searchQuestionsBox = element(by.id('search_text'));
    ysp.clearSelectedQuestionsButton = element(by.cssContainingText('button', 'CLEAR'));
    ysp.owhTable = element(by.className('owh-data-table'));
    ysp.sexualIdentity = element(by.partialLinkText('Sexual Identity'));
    ysp.sexualContact = element(by.partialLinkText('Sex of Sexual Contacts'));
    ysp.closePopup = function() {
        element(by.id("modal-close")).click();
    };
    ysp.getCategoryBars = function() {
        return element.all(by.className('owh-question__title'));
    };

    ysp.getCategoryContents = function() {
        return element.all(by.className('owh-question__table'));
    };

    ysp.getShowMoreLinks = function() {
        return element.all(by.className('owh-question__show'));
    };

    ysp.getCategoryQuestions = function() {
        return element.all(by.className('owh-question__question'));
    };

    ysp.getExpandLinks = function() {
        return element.all(by.className('owh-question__title'));
    };

    ysp.getShowOnlyLinks = function() {
        return element.all(by.className('owh-question__show-only'));
    };

    ysp.selectSideFilter = function(filterType) {
        var filter = element(by.className('side-filters')).element(by.xpath('.//*[.="'+filterType+'"]'));
        return filter.element(by.xpath('..')).element(by.tagName('i'));
    };

    ysp.getQuestionContent = function() {
        return element.all(by.className('owh-question__content'));
    };

    ysp.getTableRowData = function(rowNumber) {
        return ysp.owhTable.element(by.tagName('tbody')).all(by.tagName('tr')).get(rowNumber).all(by.tagName('td')).getText();
    };

    ysp.getOptions = function(filterType) {
        return element(by.cssContainingText('a', filterType)).element(by.xpath('ancestor::label')).element(by.xpath('following-sibling::ul')).all(by.tagName('li'));
    };

};

module.exports = new YRBSSearchPage;
