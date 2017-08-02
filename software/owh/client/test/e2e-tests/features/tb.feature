@TB
Feature: TB page
  As a User
  I want to see the data table upon selection of filters
  So that I can see the results of the filter options

  Scenario: Default Filters
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "Tuberculosis"
    Then I should see filter type "Tuberculosis" selected
    And  filter "Year" and option "2015" selected
    And the "Year" filter should be toggled to "Off"
    And the "Sex" filter should be toggled to "Column"
    And the "Race/Ethnicity" filter should be toggled to "Row"

  Scenario: TB data table
    When I look at the TB data table
    Then I see the Rates, Population and Cases as outputs in the TB data table

  Scenario: Filter order
    When I look at the sidebar
    Then filters should be in this order "Year, Sex, Race/Ethnicity, Age Groups, Country of Birth, State"

  Scenario: Radio Buttons
    When I expand each TB filter
    Then every TB filter must have Radio buttons under then

  Scenario: TB Cases visualizations
    When user sees a visualization
    Then I see labels "Race/Ethnicity" and "Cases" are displayed on minimized visualization
    When user expand visualization
    Then I should see grouped and stacked controls on expaned visualization
    And I see labels "Race/Ethnicity" and "Cases" are displayed on expanded visualization
    And I close visualization popup

  Scenario: TB Rates visualizations
    When I click on Rate chart view toggle button
    And  user sees a visualization
    Then I see labels "Race/Ethnicity" and "Rates" are displayed on minimized visualization
    When user expand visualization
    Then I should not see grouped and stacked controls on expanded visualization
    And  I see labels "Race/Ethnicity" and "Rates" are displayed on expanded visualization
    And I close visualization popup

  Scenario: GroupBy Country of Birth
    When  I select groupBy "Row" option for "Country of Birth" filter
    Then I see country of birth results on data table

