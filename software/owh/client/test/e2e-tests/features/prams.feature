Feature: PRAMS filters
  As a user
  I want to see the data table upon selection of PRAMS filters
  So that I can see the results of the filter options
  and I can quickly visualize and analyze the data

  Scenario: Default filter state
    Given I am on search page
    When I select PRAMS as primary filter
    Then I see 'By' filter pre-selected with State and Question
    And  I see class- Delivery
    And  I state data displayed in data table