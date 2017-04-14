var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var yrbsStepDefinitionsWrapper = function () {

    var yrbsPage = require('../support/yrbspage.po')

    this.Given(/^I select YRBS as primary filter$/, function () {
        yrbsPage.yrbsOption.click();
        browser.sleep(300);
    });

    this.When(/^I click on the down arrow at the corner of each category bar$/, function () {
        yrbsPage.getExpandLinks().then(function(elements) {
            elements[0].click();
        })
    });

    this.Then(/^this category must be collapsible$/, function () {
        yrbsPage.getCategoryContents().then(function(elements) {
            expect(elements[0].isDisplayed()).to.eventually.equal(true);
        });
    });

    this.When(/^I click on Show \# More under the questions in any category$/, function () {
        browser.sleep(300);
        element(by.cssContainingText('a', 'Show 18 More')).click();
    });

    this.Then(/^the category should expand to show all the questions$/, function () {
        yrbsPage.getCategoryQuestions().then(function(elements) {
            expect(elements[6].isDisplayed()).to.eventually.equal(true);
        });
    });

    this.Then(/^'Show \# More' should be replaced with 'Show Less'$/, function () {
        expect(element(by.cssContainingText('a', 'Show Less')).isPresent()).to.eventually.equal(true);
    });

    this.When(/^I click on 'Show Less'$/, function () {
        element(by.cssContainingText('a', 'Show Less')).click();
    });

    this.Then(/^the category to reset back to the original view of the two questions$/, function () {
        yrbsPage.getCategoryQuestions().then(function(elements) {
            expect(elements[9].getAttribute('class')).to.eventually.include('ng-hide');
        });
    });

    this.Then(/^'Show Less' should be replaced with 'Show \# More'$/, function () {
        expect(element(by.cssContainingText('a', 'Show Less')).isPresent()).to.eventually.equal(false);
    });

    this.When(/^I hover the mouse over a category name$/, function () {
        yrbsPage.getExpandLinks().then(function(elements) {
            browser.actions().mouseMove(elements[0]).perform();
        });
    });

    this.Then(/^an option\/link to 'Show only this Category' should be seen$/, function () {
        yrbsPage.getShowOnlyLinks().then(function(elements) {
            expect(elements[0].isDisplayed()).to.eventually.equal(true);
            expect(elements[0].getText()).to.eventually.equal('Show only this category');
        });
    });

    this.When(/^I click on 'Show only this Category'$/, function () {
        yrbsPage.getShowOnlyLinks().then(function(elements) {
            elements[0].click();
        });
    });

    this.When(/^I click on 'Show all Categories'$/, function () {
        yrbsPage.getShowOnlyLinks().then(function(elements) {
            elements[0].click();
        });
    });

    this.Then(/^the data table must show only that category$/, function () {
        yrbsPage.getExpandLinks().then(function(elements) {
            expect(elements[0].isDisplayed()).to.eventually.equal(true);
            expect(elements.length).to.equal(1);
        });
    });

    this.Then(/^an option\/link to 'Show all Categories' should be seen$/, function () {
        yrbsPage.getShowOnlyLinks().then(function(elements) {
            expect(elements[0].isDisplayed()).to.eventually.equal(true);
            expect(elements[0].getText()).to.eventually.equal('Show all categories');
        });
    });

    this.Then(/^the data table should show all categories$/, function () {
        yrbsPage.getExpandLinks().then(function(elements) {
            expect(elements[0].isDisplayed()).to.eventually.equal(true);
            expect(elements[1].isDisplayed()).to.eventually.equal(true);
            expect(elements.length).to.be.above(1);
        });
    });

    this.Then(/^each category has two questions in the given order$/, function () {
        yrbsPage.getCategoryQuestions().then(function(elements) {
            expect(elements[0].getText()).to.eventually.contain('Currently Drank Alcohol');
            expect(elements[1].getText()).to.eventually.contain('Currently Used Marijuana');
        });
    });

    this.When(/^I looks at the filter sub categories$/, function () {
        yrbsPage.sideFilterUnOrderedList.all(by.tagName('li')).count().then(function (size) {
             expect(size).to.greaterThan(0);
        });
    });


    this.Then(/^I should be able to select more than one\. The radio buttons must be changed to checkboxes$/, function () {
        var raceFilter = yrbsPage.selectSideFilter("Race/Ethnicity");
        var raceParentElement = raceFilter.element(by.xpath('..')).element(by.xpath('..')).element(by.xpath('..'));
        raceFilter.getAttribute('class').then(function(className){
            if(className =="fa fa-chevron-right") {
                //Exapnd filter
                raceFilter.element(by.xpath('..')).click();
            }
            raceParentElement.element(by.xpath('.//*[.="Asian"]')).click();
        });
        browser.sleep(300);
        raceFilter.getAttribute('class').then(function(className){
            if(className =="fa fa-chevron-right") {
                //Exapnd filter
                raceFilter.element(by.xpath('..')).click();
            }
            raceParentElement.element(by.xpath('.//*[.="American Indian or Alaska Native"]')).click();
        });
        browser.sleep(300);
    });

    this.Then(/^the default filter pre\-selected should be Race$/, function () {
        var raceFilter = element(by.className('side-filters')).element(by.xpath('.//*[.="Race/Ethnicity"]'));
        var raceParentLabel = raceFilter.element(by.xpath('..')).element(by.xpath('..'));
        var columnButton = raceParentLabel.element(by.tagName('owh-toggle-switch')).element(by.tagName('a'));
        expect(columnButton.getAttribute('class')).to.eventually.contains("selected");
    });

    this.Then(/^the default year selected should be 2015$/, function () {
        var filter = element(by.cssContainingText('a', "Year")).element(by.xpath('ancestor::label'));
        filter.element(by.xpath('following-sibling::ul')).element(by.cssContainingText("li", "2015")).isSelected().to.eventually.equal(true);
    });

    this.Then(/^then table and visualizations adjust to that they use up the entire available screen space$/, function () {
        expect(element(by.className("owh-search-content--expanded")).isPresent()).to.eventually.equal(true);
    });
    this.Then(/^the entire table and visualizations adjust to the reduced screen space$/, function () {
        expect(element(by.className("owh-search-content--expanded")).isPresent()).to.eventually.equal(false);
    });

    this.Given(/^the background highlight is in lighter purple \(button color\)$/, function () {
       element(by.className('owh-side-menu__handle--collapsed')).getCssValue('background-color').then(function(bgColor) {
           // expect(bgColor).to.equal('rgba(246, 246, 246, 1)');
        });
    });

    this.Then(/^filters should be in this order "([^"]*)"$/, function (givenFilters) {
        var allElements =  element.all(by.css('filter-display-name'));
        allElements.getText().then(function (filters) {
            filters.forEach(function (filter, index) {
                expect(filter).to.eventually.contains(givenFilters[index]);
            });
        });
    });

    this.Then(/^the data must be right justified in the table$/, function () {
        yrbsPage.getQuestionContent().then(function (elements) {
            expect(elements[0].getCssValue('text-align')).to.eventually.equal('start');
            expect(elements[1].getCssValue('text-align')).to.eventually.equal('right');
        });
    });

    this.Then(/^each question should have chart icon displayed$/, function () {
        element.all(by.className('owh-question__table')).each(function(questionBlock){
            questionBlock.element(by.className('owh-question__question')).all(by.tagName('i')).count().then(function(size){
                expect(size).to.equal(1);
            });
        });
    });

    this.Given(/^filter "([^"]*)" and option "([^"]*)" selected$/, function (filterName, option) {
        var raceFilter = yrbsPage.selectSideFilter(filterName);
        var raceParentElement = raceFilter.element(by.xpath('..')).element(by.xpath('..')).element(by.xpath('..'));
        raceParentElement.element(by.xpath('.//*[.="'+option+'"]')).click();
        browser.sleep(300);
    });

    this.Then(/^I see question categories in this order "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)"$/, function (questionCat1, questionCat2, questionCat3, questionCat4, questionCat5, questionCat6, questionCat7, questionCat8) {
        browser.sleep(100);
        element(by.id('question')).all(by.tagName('li')).then(function(elements){
            expect(elements[0].getText()).to.eventually.equals(questionCat1);
            expect(elements[1].getText()).to.eventually.equals(questionCat2);
            expect(elements[2].getText()).to.eventually.equals(questionCat3);
            expect(elements[3].getText()).to.eventually.equals(questionCat4);
            expect(elements[4].getText()).to.eventually.equals(questionCat5);
            expect(elements[5].getText()).to.eventually.equals(questionCat6);
            expect(elements[6].getText()).to.eventually.equals(questionCat7);
            expect(elements[7].getText()).to.eventually.equals(questionCat8);
        });
    });

    this.When(/^I select "([^"]*)" button$/, function (arg1) {
         element(by.cssContainingText('button', arg1)).click();
    });

    this.Given(/^I expand "([^"]*)" filter section$/, function (arg1) {
        element(by.partialLinkText(arg1)).click();
    });

    this.Then(/^race filter should be labeled Race\/Ethnicity$/, function () {
        element(by.tagName('owh-side-filter')).all(by.className('accordion')).then(function(elements) {
            expect(elements[2].element(by.tagName('a')).getText()).to.eventually.equal('Race/Ethnicity');
        });
    });

    this.When(/^I click on "([^"]*)" button$/, function (arg1) {
        yrbsPage.selectQuestionsButton.click();
    });


    this.Then(/^it should also have a Search Questions \- search bar above the list$/, function () {
        expect(element(by.id('search_text')).isPresent()).to.eventually.equal(true);
    });

    this.When(/^I open up the Survey Question pop up$/, function () {
        yrbsPage.selectQuestionsButton.click();
    });

    this.Then(/^by default no questions should be selected$/, function () {
        //Div with "Filter selected questions" button should be hidden
        expect(element(by.css('[ng-show="tc.selectedNodes.length > 0"]')).getAttribute('aria-hidden')).to.eventually.equal('true');
    });

    this.When(/^I begin to type a word in the search bar$/, function () {
        yrbsPage.searchQuestionsBox.clear().sendKeys('Unintentional');
    });

    this.Then(/^the list below that should be updated dynamically$/, function () {
        //I should see only one question with string 'Unintentional', remaining 7 parent nodes should be hidden
        element(by.id('question')).element(by.tagName('ul')).all(by.className('jstree-hidden')).count().then(function (size) {
            expect(size).to.equal(7);
        });
    });


    this.When(/^I hovers his mouse on any of the questions from the list$/, function () {
        browser.actions().mouseMove(element(by.className('jstree-anchor'))).perform();
    });

    this.Then(/^a \+ sign appears in the end of the question to indicate the user that he can click to add the question$/, function () {
        //a + fontawesome icon should be displayed
    });

    this.When(/^I have selected a question$/, function () {
        //select first child question
        element(by.className('jstree-anchor jstree-search')).click();
    });

    this.Then(/^the \+ sign changes to \- sign to indicate the user that he can click to deselect the question$/, function () {
        //a - fontawesome icon should be displayed beside question

        //and unselect it
        element(by.className('jstree-anchor')).click();
    });


    this.Then(/^another heading \- "([^"]*)" must appear on the top of the 'Search Questions' search bar$/, function (arg1) {
        expect(element(by.cssContainingText('label', arg1)).isPresent()).to.eventually.equal(true);
    });

    this.Then(/^then the selected question must be listed under the Selected Question\(s\)$/, function () {
         expect(element(by.repeater('eachNode in tc.optionValues')).getText()).to.eventually.equal('Unintentional Injuries and Violence');
    });


    this.When(/^I see the selected questions under the Selected Question\(s\) list$/, function () {
        expect(element(by.repeater('eachNode in tc.optionValues')).getText()).to.eventually.equal('Unintentional Injuries and Violence');
    });


    this.Then(/^I should also be able to see a x button to the end of the question$/, function () {
        expect(element(by.id('removeQuestion')).isPresent()).to.eventually.equal(true);
    });

    this.Then(/^I click on this button then that particular question is deleted from the list \(deselected\)$/, function () {
        element(by.id('removeQuestion')).click();
        //No element should present with class 'jstree-clicked'
        element(by.id('question')).element(by.tagName('ul')).all(by.className('jstree-clicked')).count().then(function (size) {
            expect(size).to.equal(0);
        });
    });

    this.When(/^I select a few questions and clicks on the Add Selected Question\(s\) button$/, function () {
        element(by.className('jstree-anchor')).click();
        yrbsPage.addSelectedQuestionsButton.click();
    });

    this.Then(/^the data table should update based on the selection$/, function () {
        //Verify the data table
        var allNodes = element(by.tagName('owh-accordion-table')).all(by.tagName('tr'));
        expect(allNodes.get(1).getText()).to.eventually.contains('Unintentional Injuries and Violence');
        //all other nodes should not display
        //get all tbody in table
        var allTbody = element.all(by.repeater('eachCategory in oatc.data | filter: oatc.filterCategory'));
        //except first tbody, remaining all tbody's should be empty
        for (var index = 1; index < allTbody.length; index++) {
            allTbody.get(index).all(by.tagName('tr')).count().then(function (size) {
                expect(size).to.equal(0);
            })
        }
    });

    this.When(/^I see the selected questions under the Selected Question\(s\) list in side filter$/, function () {
        expect(element(by.repeater('selectedNode in group.selectedNodes')).isPresent()).to.eventually.equal(true);
    });

    this.Then(/^I should also see a "([^"]*)" button at the end of the selected questions list$/, function (arg1) {
        expect(yrbsPage.clearSelectedQuestionsButton.isPresent()).to.eventually.equal(true);
    });

    this.Then(/^I click on this button, then all the selected questions are deleted from the list \(deselected\)$/, function () {
        yrbsPage.clearSelectedQuestionsButton.click();
        browser.sleep(100);
        expect(element(by.repeater('selectedNode in group.selectedNodes')).isPresent()).to.eventually.equal(false);
    });

    this.Then(/^the "([^"]*)" button should be renamed to "([^"]*)"$/, function (selectButton, updateButton) {
        expect(element(by.cssContainingText('button', selectButton)).isPresent()).to.eventually.equal(false);
        expect(element(by.cssContainingText('button', updateButton)).isPresent()).to.eventually.equal(true);
    });

    this.When(/^I select the back button in browser$/, function () {
        browser.navigate().back();
    });

    this.When(/^I select the forward button in browser$/, function () {
        browser.navigate().forward();
    });

    this.Then(/^the results page \(yrbs data table\) should be refreshed to reflect "([^"]*)" filter with option "([^"]*)"$/, function (filterName, option) {
        var raceFilter = yrbsPage.selectSideFilter(filterName);
        var raceParentElement = raceFilter.element(by.xpath('..')).element(by.xpath('..')).element(by.xpath('..'));
        expect(raceParentElement.element(by.xpath('.//*[.="'+option+'"]')).isSelected()).to.eventually.equal(true);

        var raceFilter2 = yrbsPage.selectSideFilter("year");
        var raceParentElement2 = raceFilter2.element(by.xpath('..')).element(by.xpath('..')).element(by.xpath('..'));
        expect(raceParentElement2.element(by.xpath('.//*[.="2015"]')).isSelected()).to.eventually.equal(true);
    });


    this.Then(/^I see a link "([^"]*)" at the top of the sidebar$/, function (arg1) {
        expect(element(by.cssContainingText('span', arg1)).isPresent()).to.eventually.equal(true);
    });

    this.When(/^I click on the "([^"]*)" link$/, function (arg1) {
         if(arg1 == 'Switch to Basic Search'){
             element(by.cssContainingText('span', arg1)).click();
         }
         else if(arg1 == 'Switch to Advanced Search'){
             element(by.cssContainingText('span', arg1)).click();
         }
    });

    this.Then(/^the sidebar switches to an Advanced Search mode$/, function () {
        /*Expand Sex to verify check boxes or radio buttons*/
        element(by.partialLinkText('Sex')).click();
        expect(element(by.id("mental_health_yrbsSex_Female")).getAttribute('type')).to.eventually.equal('checkbox')
        expect(element(by.id("mental_health_yrbsSex_Male")).getAttribute('type')).to.eventually.equal('checkbox')
    });

    this.Then(/^the sidebar switches to an Basic Search mode$/, function () {
        element(by.partialLinkText('Sex')).click();
        expect(element(by.id("mental_health_yrbsSex_Female")).getAttribute('type')).to.eventually.equal('radio')
        expect(element(by.id("mental_health_yrbsSex_Male")).getAttribute('type')).to.eventually.equal('radio')
    });

    this.Then(/^the link above the sidebar changes to "([^"]*)"$/, function (arg1) {
        expect(element(by.cssContainingText('span', arg1)).isPresent()).to.eventually.equal(true);
    });

    this.Then(/^the link "([^"]*)" should be disappear$/, function (arg1) {
        expect(element(by.cssContainingText('span', arg1)).isPresent()).to.eventually.equal(false);
    });

    this.Then(/^Questions selected value should be "([^"]*)"$/, function (arg1) {
        if(arg1 == "All") {
            expect(element(by.id("allNodes")).getText()).to.eventually.contains(arg1);
        }
        else {
            expect(element(by.id("selectedNodes")).getText()).to.eventually.contains(arg1);
        }
    });

    this.When(/^the link should be "([^"]*)" displayed$/, function (arg1) {
        expect(element(by.cssContainingText('span', arg1)).isDisplayed()).to.eventually.equal(true);
    });

    this.When(/^filter "([^"]*)" under "([^"]*)" should be a "([^"]*)"/, function (arg1, arg2, arg3) {
        element(by.partialLinkText(arg2)).click();
        expect(element(by.id("mental_health_yrbsRace_"+arg1)).getAttribute("type")).to.eventually.equal(arg3);
    });

    this.When(/^"([^"]*)" button should be displayed$/, function (arg1) {
        expect(yrbsPage.selectQuestionsButton.isDisplayed()).to.eventually.equal(true);
    });

    this.When(/^I see hide filter button in yrbs page$/, function () {
        browser.actions().mouseMove(element(by.cssContainingText('a', "<< Hide Filters"))).perform();
    });

    this.When(/^I click hide filter button in yrbs page$/, function () {
        element(by.cssContainingText('span', "<< Hide Filters")).click();
    });

    this.Then(/^I click on Filter Selected Questions button$/, function () {
        yrbsPage.addSelectedQuestionsButton.click();
    });

    this.When(/^I set "([^"]*)" filter "([^"]*)"$/, function (filter1, viewType1) {
        element(by.cssContainingText('a', filter1)).element(By.xpath('following-sibling::owh-toggle-switch')).element(by.cssContainingText('span', viewType1)).click();
    });

    this.Then(/^I should see records for states$/, function () {
        yrbsPage.getTableRowData(1).then(function(rowdata){
            expect(rowdata[0]).to.equals('Currently drank alcohol(at least one drink of alcohol on at least 1 day during the 30 days before the survey)');
            //Alabama
            expect(rowdata[1]).to.contains('30.7');
            //Alaska
            expect(rowdata[2]).to.contains('22.0');
            //Arizona
            expect(rowdata[3]).to.contains('34.8');
        });
        yrbsPage.getTableRowData(2).then(function(rowdata){
            expect(rowdata[0]).to.equals('Currently used marijuana(one or more times during the 30 days before the survey)');
            //Alabama
            expect(rowdata[1]).to.contains('17.3');
            //Alaska
            expect(rowdata[2]).to.contains('19.0');
            //Arizona
            expect(rowdata[3]).to.contains('23.3');
        });
    });

    this.Given(/^I am on yrbs advanced search page$/, function (callback) {
        browser.get('/search/');
        yrbsPage.yrbsOption.click();
        browser.sleep(300);
        element(by.cssContainingText('span', 'Switch to Advanced Search')).click();
        callback(null, 'done');
    });

    this.Then(/^I see Sexual orientation and Sexual contact filter disabled$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'done');
    });

    this.When(/^I expand Sexual Identity section$/, function (callback) {
        yrbsPage.sexualIdentity.click();
        callback(null, 'done');
    });

    this.Then(/^I see Heterosexual \(straight\), Gay or Lesbian, Bisexual, Not Sure$/, function (callback) {
        yrbsPage.getOptions('Sexual Identity').then(function(elements) {
            expect(elements[1].getText()).to.eventually.contains('All');
            expect(elements[2].getText()).to.eventually.contains('Heterosexual (straight)');
            expect(elements[3].getText()).to.eventually.contains('Gay or Lesbian');
            expect(elements[4].getText()).to.eventually.contains('Bisexual');
            expect(elements[5].getText()).to.eventually.contains('Not Sure');
        });
        callback(null, 'done');
    });

    this.When(/^I select Bisexual$/, function (callback) {
        var filter = element(by.cssContainingText('label', 'Bisexual'));
        filter.click();
        callback(null, 'done');
    });

    this.When(/^I click on run query button$/, function (callback) {
        element(by.css('button[title="Click to Run Query"]')).click();
        callback(null, 'done');
    });

    this.Then(/^I see results being displayed in data table for Sexual Identity$/, function (callback) {
        yrbsPage.getTableRowData(1).then(function(rowdata){
            expect(rowdata[0]).to.equals('Currently drank alcohol(at least one drink of alcohol on at least 1 day during the 30 days before the survey)');
            //Alabama
            expect(rowdata[1]).to.contains('92.1');
            //Alaska
            expect(rowdata[2]).to.contains('26.6');
            //Arizona
            expect(rowdata[3]).to.contains('34.2');
        });
        callback(null, 'done');
    });

    this.Then(/^I see results being displayed in data table for Sexual Contact$/, function (callback) {
        yrbsPage.getTableRowData(1).then(function(rowdata){
            expect(rowdata[0]).to.equals('Currently drank alcohol(at least one drink of alcohol on at least 1 day during the 30 days before the survey)');
            //Alabama
            expect(rowdata[1]).to.contains('47.7');
            //Alaska
            expect(rowdata[2]).to.contains('36.5');
            //Arizona
            expect(rowdata[3]).to.contains('31.7');
        });
        callback(null, 'done');
    });

    this.When(/^I expand Sexual Contact section$/, function (callback) {
        yrbsPage.sexualContact.click();
        callback(null, 'done');
    });

    this.Then(/^I see Opposite Sex Only, Same Sex Only, Both Sexes, No Sexual Contact$/, function (callback) {
        yrbsPage.getOptions('Sex of Sexual Contacts').then(function(elements) {
            expect(elements[1].getText()).to.eventually.contains('All');
            expect(elements[2].getText()).to.eventually.contains('Opposite Sex Only');
            expect(elements[3].getText()).to.eventually.contains('Same Sex Only');
            expect(elements[4].getText()).to.eventually.contains('Both Sexes');
            expect(elements[5].getText()).to.eventually.contains('No Sexual Contact');
        });

        callback(null, 'done');
    });

    this.When(/^I select Opposite Sex Only$/, function (callback) {
        var filter = element(by.cssContainingText('label', 'Opposite Sex Only'));
        filter.click();
        callback(null, 'done');
    });

    this.When(/^user clicks on "([^"]*)" more link for Sexual Identity filter$/, function (arg1) {
        var sexualIdentity = element(by.cssContainingText('a', 'Sexual Identity')).element(by.xpath('ancestor::label')).element(by.xpath('following-sibling::ul'));
        sexualIdentity.element(by.cssContainingText('a', arg1)).click();
    });

    this.When(/^user clicks on "([^"]*)" more link for Sexual Contact filter$/, function (arg1) {
        var sexualContact = element(by.cssContainingText('a', 'Sex of Sexual Contacts')).element(by.xpath('ancestor::label')).element(by.xpath('following-sibling::ul'));
        sexualContact.element(by.cssContainingText('a', arg1)).click();
    });
};
module.exports = yrbsStepDefinitionsWrapper;
