Feature: Infant Mortality filters
  As a user
  I want to see the data table upon selection of natality filters
  So that I can see the results of the filter options
  and I can quickly visualize and analyze the data

  Background: Access Infant Mortality page
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "Infant Mortality"
    Then I should see filter type "Infant Mortality" selected

  Scenario: Infant Mortality Side Filters and Defaults
    Then I should see "4" categories in the sidebar
    And the categories should be "Infant Characteristics, Maternal Characteristics, Birth Characteristics, Location"
    And the "Year" filter should be toggled to "Off"
    And the "Sex" filter should be toggled to "Column"
    And the "Race" filter should be toggled to "Row"
