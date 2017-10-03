var OwhHomepage = function() {
    var hp = this;
    //explore button in Quick Health Data Online Box
    hp.quickHealthExploreBtn = element( by.css('.usa-button-secondary'));
    hp.acceptButton = element( by.id('acceptDataUseRestrictions'));

    //Birth Explore link in Women's Health section
    hp.birthExplorerLink = element( by.cssContainingText('div', "Pregnancy Risk Assessment Monitoring System (PRAMS)"));

    //Explore link in Youth related under Behavior Risk section
    hp.mentalExplorerLink = element( by.cssContainingText('div', "Youth Risk Behavior Surveillance System (YRBSS)"));

    hp.getPhaseTwoPopupHeading =  function() {
        return element( by.css('.custom-modal-body.usa-grid')).getText();
    };
    hp.getYouCanSectionContent = function() {
        return element(by.css('.youCanContent')).all(by.tagName('p'));
    };
    hp.getWorkInProgressMessage = function () {
        return element(by.css('.usa-disclaimer-official')).element(by.tagName('span')).getText();
    };
    hp.getOWHAppName = function() {
        return element( by.cssContainingText("title", "OWH-Health Information Gateway")).getText();
    }
};

module.exports = new OwhHomepage;