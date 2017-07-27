var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var infantMortalityStepDefinitions = function () {
    this.setDefaultTimeout(600000);
    var imp = require('../support/infant_mortality.po');

    this.Then(/^I should see "([^"]*)" categories in the sidebar$/, function (number_of_categories, next) {
        imp.getCategories().then(function(categories) {
            expect(categories.length).to.equal(parseInt(number_of_categories));
        }).then(next);
    });

    this.Then(/^the categories should be "([^"]*)"$/, function (labels, next) {
       var expected = labels.split(', ');
       imp.getCategories().then(function (categories) {
           categories.forEach(function (category, index) {
               expect(category).to.equal(expected[index]);
           });
       }).then(next);
    });

    this.Then(/^the "([^"]*)" filter should be toggled to "([^"]*)"$/, function (filter, group_option, next) {
        imp.getSelectedOptionForFilter(filter).then(function (actual) {
            expect(actual).to.equal(group_option);
        }).then(next);
    });

    this.Then(/^the default headers of the table should be "([^"]*)"$/, function (table_headers, next) {
        var expected = table_headers.split(', ');
        imp.getTableHeaders().then(function (headers) {
            headers.forEach(function (header, index) {
                expect(header).to.equal(expected[index]);
            });
        }).then(next);
    });

    this.Then(/^the values in row "([^"]*)" should be "([^"]*)"$/, function (row, values, next) {
        var expected = values.split(', ');
        imp.getTableRowData(row).then(function (row) {
            row.forEach(function (column, index) {
               expect(column).to.contains(expected[index]);
            });
        }).then(next);
    });

    this.When(/^I click on the "([^"]*)" filter and expand all available options$/, function (filter) {
        return imp.expandFilter(filter).then(function () {
            return imp.clickMoreOptionsForFilter(filter);
        });
    });

    this.Then(/^I see the available options "([^"]*)" for "([^"]*)"$/, function (available_options, filter, next) {
        var expected = available_options.split('|');
        imp.getAvailableFilterOptions(filter).then(function (options) {
            options.forEach(function (option, index) {
                expect(option).to.equal(expected[index]);
            });
        }).then(next);
    });

    this.Then(/^I see label "([^"]*)" and "([^"]*)" are displayed on minimized visualization$/, function (arg1, arg2) {
        var labelArray = imp.getAxisLabelsForMinimizedVisualization(0,1);
        expect(labelArray[0].getText()).to.eventually.equal(arg1);
        return expect(labelArray[1].getText()).to.eventually.equal(arg2);
    });

    this.Then(/^I see the disabled options "([^"]*)" for "([^"]*)"$/, function (disabled_options, filter, next) {
       var expected = disabled_options.split('|');
       imp.getDisabledFilterOptions(filter).then(function (options) {
           options.forEach(function (option, index) {
               expect(option).to.equal(expected[index]);
           });
       }).then(next);
    });

    this.When(/^I click to show all filters for "([^"]*)"$/, function (category) {
        return imp.expandCategory(category);
    });

    this.Then(/^I see the available filter "([^"]*)" for "([^"]*)"$/, function (filter, category, next) {
        imp.getFiltersForCategory(category).then(function (filters) {
            expect(filters).to.contain(filter);
        }).then(next);
    });

    this.When(/^I select the option "([^"]*)" for "([^"]*)" and the option "([^"]*)" for "([^"]*)"$/, function (filter_1_option, filter_1, filter_2_option, filter_2) {
        return imp.clickMoreOptionsForFilter(filter_1).then(function () {
            return imp.clickOptionForFilter(filter_1, filter_1_option);
        }).then(function () {
            // De-select 2014 to show values that should be suppressed
            return imp.clickOptionForFilter(filter_1, '2014');
        }).then(function () {
            return imp.expandFilter(filter_2);
        }).then(function () {
            return imp.clickOptionForFilter(filter_2, filter_2_option);
        });
    });


    this.When(/^I click on Deaths chart view toggle button$/, function (next) {
        element(by.cssContainingText('span', 'Deaths')).click()
            .then(next);
    });
};

module.exports = infantMortalityStepDefinitions;
