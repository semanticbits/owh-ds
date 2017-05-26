var OwhHomepage = function() {
    var hp = this;
    //explore button in Quick Health Data Online Box
    hp.quickHealthExploreBtn = element( by.css('.qh-button'));

    //Birth Explore link in Women's Health section
    hp.birthExplorerLink = element( by.id('wh_birth_explorer'));

    //Explore link in Youth related under Behavior Risk section
    hp.mentalExplorerLink = element( by.id('br_mental_health_explorer'));

    hp.getPhaseTwoPopupHeading =  function() {
        return element( by.binding("'label.next.impl' | translate")).getText();
    };
    hp.getYouCanSectionContent = function() {
        return element(by.css('.youCanContent')).all(by.tagName('p'));
    };
    hp.getWorkInProgressMessage = function () {
        return element(by.css('.usa-disclaimer-official')).element(by.tagName('span')).getText();
    };
    hp.getOWHAppName = function() {
        return element( by.binding("'label.app.title.qhdo' | translate")).getText();
    }
};

module.exports = new OwhHomepage;