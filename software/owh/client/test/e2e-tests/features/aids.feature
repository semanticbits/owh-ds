@AIDS
Feature: AIDS/HIV page
  As a User
  I want to see the data table upon selection of filters
  So that I can see the results of the filter options

  Background: Access AIDS/HIV page
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "HIV/AIDS"
    Then I should see filter type "HIV/AIDS" selected

  Scenario: Available filter options and filter order
    Then On the aids page, I should see the filters "Indicator, Year, Sex, Race/Ethnicity, Age Groups, Transmission, State" in order
    When On the aids page, I expand the "Indicator" filter
    Then On the aids page, I should see "AIDS Diagnoses, AIDS Deaths, AIDS Prevalence, HIV Diagnoses, HIV Deaths, HIV Prevalence" options for "Indicator" filter
    When On the aids page, I expand the "Race/Ethnicity" filter
    Then On the aids page, I should see "All races/ethnicities, American Indian/Alaska Native, Asian, Black/African American, Hispanic/Latino, Multiple races, Native Hawaiian/Other Pacific Islander, White" options for "Race/Ethnicity" filter
    When On the aids page, I expand the "Age Groups" filter
    Then On the aids page, I should see "All age groups, 13-24, 25-34, 35-44, 45-54, 55+" options for "Age Groups" filter
    When On the aids page, I expand the "Transmission" filter
    Then On the aids page, I should see "All transmission categories, Heterosexual contact, Injection drug use, Male-to-male sexual contact, Male-to-male sexual contact and injection drug use, Other" options for "Transmission" filter

  Scenario: Data table defaults
    Then On the aids page, I should see the data table with the headers "Race/Ethnicity, Female, Male, Both sexes"
    Then On the aids page, the values in table should match

  Scenario: One filter on groupBy 'Row' should display totals
    When  I select groupBy "Off" option for "Sex" filter
    Then the default headers of the table should be "Race/Ethnicity, Number of Cases"
    And the values in row "0" should be "All races/ethnicities, 18,274"
    And the values in row "0" should be "All races/ethnicities, 268,671,725"
    And the values in row "0" should be "All races/ethnicities, 6.8"
    And the values in row "1" should be "American Indian/Alaska Native, 96"
    And the values in row "1" should be "American Indian/Alaska Native, 1,920,921"
    And the values in row "1" should be "American Indian/Alaska Native, 5.0"

  Scenario: AIDS/HIV Visualizations
    When  I select groupBy "Column" option for "Sex" filter
    Then user sees a visualization
    And I see labels "Race/Ethnicity" and "Cases" are displayed on minimized visualization
    When user expand visualization
    And I see labels "Race/Ethnicity" and "Cases" are displayed on expanded visualization
    And I close visualization popup
    When I click on Rate chart view toggle button
    And I see labels "Race/Ethnicity" and "Rates" are displayed on minimized visualization
    When user expand visualization
    And I see labels "Race/Ethnicity" and "Rates" are displayed on expanded visualization
