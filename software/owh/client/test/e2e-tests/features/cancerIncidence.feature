@CancerIncidence
Feature: Cancer Incidence page
    As a User
    I want to see the data table upon selection of filters
    So that I can see the results of the filter options

Scenario: Access Cancer Incidence page
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "Cancer Incidence"
    Then I should see filter type "Cancer Incidence" selected

Scenario: Data table defaults
    Then On the cancer incidence page, I should see the data table with the headers "Race, Female, Male, Total Incidences"
    Then On the cancer incidence page, the values in row "0" should be "White, 705,033 (51.7%), 659,262 (48.3%), 1,364,295"
    Then On the cancer incidence page, the values in row "1" should be "Black, 94,161 (52.2%), 86,149 (47.8%), 180,310"
    Then On the cancer incidence page, the values in row "2" should be "American Indian/Alaska Native, 4,963 (53.3%), 4,354 (46.7%), 9,317"
    Then On the cancer incidence page, the values in row "3" should be "Asian or Pacific Islander, 31,423 (59.1%), 21,718 (40.9%), 53,141"
    Then On the cancer incidence page, the values in row "4" should be "Unknown, 21,459 (44.9%), 26,316 (55.1%), 47,775"

Scenario: Cancer Incidence charts
    Then On the cancer incidence page, the visiualization is displayed
