var CommonPage = function() {
    var msp = this;
    msp.backButton = element(by.css('button[title="Previous Query"]'));
    msp.forwardButton = element(by.css('button[title="Next Query"]'));
    msp.interestedInSelectBox = element(by.id('interestedIn'));

    msp.getSelectedFilterType = function() {
        return msp.interestedInSelectBox.$('option:checked').getText();
    };
};

module.exports = new CommonPage;
