var InfantMortalityPage = function () {

    var imp = this;

    imp.getFilterCategories = function() {
        return element.all(by.className('filter-category')).map(function (category) {
            return category.getText()
        });
    };

    imp.getSelectedOptionForFilterGroup = function (target_filter) {
        return element.all(by.className('side-pane-label')).filter(function (category) {
            return category.element(by.className('filter-display-name')).getText()
                .then(function (text) {
                    return text === target_filter
                });
            })
            .first()
            .element(by.tagName('owh-toggle-switch'))
            .element(by.className('selected'))
            .getText();
    };
};


module.exports = new InfantMortalityPage;