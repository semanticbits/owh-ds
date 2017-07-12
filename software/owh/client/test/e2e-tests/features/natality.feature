@Natality
Feature: Natality filters
  As a user
  I want to see the data table upon selection of natality filters
  So that I can see the results of the filter options
  and I can quickly visualize and analyze the data

  Background: Access Natality page
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "Natality"
    Then I should see filter type "Natality" selected
    And I should see filter type "Number of Births" selected for show me dropdown
    And user clicks on "+ 13 more" more link for "Year" filter
    And all years should be enabled in Year filter

  Scenario: Default filter state
    Then I see "Year" as first option in sidebar filters
    And  I see the data table with race, female, male and total table headers
    And I see population count for "2015" option
    Then I expand "+ 12 more filters" filter section
    And I expand "+ 2 more filters" filter section
    And I expand "+ 8 more filters" filter section
    And I see expected filters should be disabled in natality page for number for births
    And I see expected filters should be enabled in natality page for number of births

  Scenario: Filter categories
    Then I see "Birth Characteristics" as first filter category
    And  I see 2 filters visible
    And  I see show more filters link
    When I click on show more filters link
    Then I see 14 filters visible
    And  I see show more filters link changed to show less filters
    When I click on show less filters
    Then I see 2 filters visible

  Scenario: Birth rates - Disable filters when show me filter value changes
    When I change show me dropdown option to "Birth Rates"
    Then I should see filter type "Birth Rates" selected for show me dropdown
    And I should see a Birth rate statement above data table in natality page
    And I see expected filters should be disabled for Birth Rates
    And years "2000", "2001", "2002" should be disabled for Year filter
    And the data table must show Births, Population and Birth Rates
    When  I select groupBy "Row" option for "State" filter
    And user sees a visualization
    Then labels "State" and "Birth Rates" are displayed on minimized visualization
    When user expand visualization
    Then I should not see grouped and stacked controls on expanded visualization
    And labels "State" and "Birth Rates" are displayed on expanded visualization

  Scenario: Fertility rates - Disable filters when show me filter value changes
    When I change show me dropdown option to "Fertility Rates"
    Then I should see filter type "Fertility Rates" selected for show me dropdown
    And I see expected filters should be disabled for Fertility Rates
    And years "2000", "2001", "2002" should be disabled for Year filter
    And the data table must show Births, Female Population and Birth Rates
    When I expand "5-Year Age Groups" filter section
    And  filter "5-Year Age Groups" and option "15-19 years" selected
    Then the data table should display values filtered by age selected
    When  I select groupBy "Row" option for "State" filter
    And user sees a visualization
    Then labels "State" and "Fertility Rates" are displayed on minimized visualization
    When user expand visualization
    Then I should not see grouped and stacked controls on expanded visualization
    And labels "State" and "Fertility Rates" are displayed on expanded visualization

  Scenario: Filter Name and Location
    When I see "Mother's Age" category in the sidebar
    Then the category Mother's Age should has 1-Year and 5-Year age group filters

  Scenario: 5- Year Age Group
    Then I expand "5-Year Age Groups" filter section
    And I should see "5-Year Age Groups" options under Mother Age category for 5-Year age group
    Then I select "Year" value "2003"
    And I un-select "Year" value "2015"
    And  filter "5-Year Age Groups" and option "15-19 years" selected
    And I select groupBy "Row" option for "5-Year Age Groups" filter
    Then data table should display right values for 5-Year age filter

  Scenario: 1- Year Age Group
    Then I expand "1-Year Age Groups" filter section
    And I should see "1-Year Age Groups" options under Mother Age category for 1-Year age group
    Then I select "Year" value "2003"
    And I un-select "Year" value "2015"
    And  filter "1-Year Age Groups" and option "15 years" selected
    And I select groupBy "Row" option for "1-Year Age Groups" filter
    Then data table should display right values for 1-Year age filter

  Scenario: Show/Hide Percentages
    Then I see an option to show/hide percentages
    When I click the "Hide" option
    Then the percentages should be hidden

  Scenario: State filter
    When I expand "State" filter section
    And  I select "AK" state for "natality"
    Then I see data is displayed in data-table for races
    When I select "AL" state for "natality"
    And  I select groupBy "Column" option for "State" filter
    Then I see data is grouped by state in data table

  Scenario: Apply Suppression
    When I expand "Ethnicity" filter section
    And  I select Puerto Rican ethnicity option
    And  I expand "State" filter section
    And  I select "AK" state for "natality"
    Then I see suppressed cells in data table

  Scenario: Birth rates by state
    When I change show me dropdown option to "Birth Rates"
    Then I should see filter type "Birth Rates" selected for show me dropdown
    When I expand "State" filter section
    And  I select "AK" state for "natality"
    And  I select "AL" state for "natality"
    And  I select groupBy "Column" option for "State" filter
    Then I see birth rate for state

  Scenario: Fertility rates by state
    When I change show me dropdown option to "Fertility Rates"
    Then I should see filter type "Fertility Rates" selected for show me dropdown
    When I expand "State" filter section
    And  I select "AK" state for "natality"
    And  I select "AL" state for "natality"
    And  I select groupBy "Column" option for "State" filter
    Then I see fertility rates for state