@CancerMortality
Feature: Cancer Mortality page
    As a User
    I want to see the data table upon selection of filters
    So that I can see the results of the filter options

Background: Access Cancer Mortality page
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "Cancer Mortality"
    Then I should see filter type "Cancer Mortality" selected

Scenario: Data table defaults
    Then On the cancer mortality page, I should see the data table with the headers "Race, Female, Male, Total Deaths"
    Then On the cancer mortality page, the values in row "0" should be "White, 239,046 (47.1%), 268,912 (52.9%), 507,958"
    Then On the cancer mortality page, the values in row "1" should be "Black, 34,182 (49.2%), 35,312 (50.8%), 69,494"
    Then On the cancer mortality page, the values in row "2" should be "American Indian/Alaska Native, 1,426 (45.2%), 1,727 (54.8%), 3,153"
    Then On the cancer mortality page, the values in row "3" should be "Asian or Pacific Islander, 8,154 (49.3%), 8,375 (50.7%), 16,529"

Scenario: Cancer Mortality charts
    Then On the cancer mortality page, the visualization is displayed
