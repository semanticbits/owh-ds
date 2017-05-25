Feature: Observe "Natality" page filters
  As a user
  I should be able to access "Natality" page
  In order to do further activities
  So that I can manipulate filters
  And I can see valid results via visualizations

Scenario: Access Natality page
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "Natality"
    Then I should see filter type "Natality" selected
    And I should see filter type "Number of Births" selected for show me dropdown
    And user clicks on "+ 13 more" more link for "Year" filter
    And all years should be enabled in Year filter

Scenario: Birth rates
    When I change show me dropdown option to "Birth Rates"
    Then I should see filter type "Birth Rates" selected for show me dropdown
    And I should see a Birth rate statement above data table in natality page
    And the data table must show Births, Population and Birth Rates

Scenario: Fertility rates
    When I change show me dropdown option to "Fertility Rates"
    Then I should see filter type "Fertility Rates" selected for show me dropdown
    And the data table must show Births, Female Population and Birth Rates