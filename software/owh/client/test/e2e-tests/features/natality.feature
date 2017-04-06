Feature: Natality filters
  As a user
  I want to see the data table upon selection of natality filters
  So that I can see the results of the filter options
  and I can quickly visualize and analyze the data

  Background: Access Natality page
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Mortality"
    When I change 'I'm interested in' dropdown value to "Natality"
    Then I should see filter type "Natality" selected
    And I should see filter type "Number of Births" selected for show me dropdown
    And user clicks on "+ 13 more" more link for "Year" filter
    And all years should be enabled in Year filter

  Scenario: Default filter state
    Then I see "Year" as first option in sidebar filters
    And  I see the data table with race, female, male and total table headers
    And I see population count for "2015" option

  Scenario: Filter categories
    Then I see "Birth Characteristics" as first filter category
    And  I see 2 filters visible
    And  I see show more filters link
    When I click on show more filters link
    Then I see 14 filters visible
    And  I see show more filters link changed to show less filters
    When I click on show less filters
    Then I see 2 filters visible

  Scenario: Birth rates
    When I change show me dropdown option to "Birth Rates"
    Then I should see filter type "Birth Rates" selected for show me dropdown
    And the data table must show Births, Population and Birth Rates

  Scenario: Disable filters when show me filter value changes - Birth Rates
    When I change show me dropdown option to "Birth Rates"
    Then I see expected filters should be disabled for Birth Rates
    And years "2000", "2001", "2002" should be disabled for Year filter

  Scenario: Fertility rates
    When I change show me dropdown option to "Fertility Rates"
    Then I should see filter type "Fertility Rates" selected for show me dropdown
    And the data table must show Births, Female Population and Birth Rates

  Scenario: Fertility rates for Mother's age 9
    When I change show me dropdown option to "Fertility Rates"
    Then I click on "6 more filters"
    And I expand "Mother's Age 9" filter section
    And  filter "Mother's Age 9" and option "15-19 years" selected
    And the data table should display values filtered by age selected

  Scenario: Disable filters when show me filter value changes - Fertility Rates
    When I change show me dropdown option to "Fertility Rates"
    Then I see expected filters should be disabled for Fertility Rates
    And years "2000", "2001", "2002" should be disabled for Year filter




