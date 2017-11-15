@Infant
Feature: Infant Mortality filters
  As a user
  I want to see the data table upon selection of natality filters
  So that I can see the results of the filter options
  and I can quickly visualize and analyze the data

  Scenario: Access Infant Mortality page
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "Infant Mortality"
    Then I should see filter type "Infant Mortality" selected

  Scenario: Quick visualizations
    When I see the quick visualizations
    Then I see label "Race" and "Totals" are displayed on minimized visualization
    When user expand visualization
    Then I should see grouped and stacked controls on expaned visualization
    And I close visualization popup

  Scenario: Deaths/Rates visualizations switch
    When I click on Rate chart view toggle button
    And user sees a visualization
    Then I see label "Race" and "Rates" are displayed on minimized visualization
    When I click on Deaths chart view toggle button
    And user sees a visualization
    Then I see label "Race" and "Totals" are displayed on minimized visualization

  Scenario: Infant Mortality Side Filters and Defaults
    Then I should see "4" categories in the sidebar
    And the categories should be "Infant Characteristics, Maternal Characteristics, Birth Characteristics, Location"
    And the "Year" filter should be toggled to "Off"
    And the "Sex" filter should be toggled to "Column"
    And the "Race" filter should be toggled to "Row"

  Scenario: Infant Mortality Default Table Data for 2014
    Then the default headers of the table should be "Race, Female, Male, Totals"
    And the values in row "0" should be "American Indian or Alaska Native, 146, 195, 341"
    And the values in row "0" should be "American Indian or Alaska Native, 22,120, 22,808, 44,928"
    And the values in row "0" should be "American Indian or Alaska Native, 6.6, 8.6, 7.6"
    And the values in row "1" should be "Asian or Pacific Islander, 484, 605, 1,090"
    And the values in row "1" should be "Asian or Pacific Islander, 137,076, 145,647, 282,723"
    And the values in row "1" should be "Asian or Pacific Islander, 3.5, 4.2, 3.9"
    And the values in row "2" should be "Black or African American, 3,101, 3,752, 6,853"
    And the values in row "2" should be "Black or African American, 315,741, 324,821, 640,562"
    And the values in row "2" should be "Black or African American, 9.8, 11.6, 10.7"
    And the values in row "3" should be "White, 6,590, 8,337, 14,927"
    And the values in row "3" should be "White, 1,472,438, 1,547,425, 3,019,863"
    And the values in row "3" should be "White, 4.5, 5.4, 4.9"

  Scenario: Infant Mortality Race Options for 2014
    When I click on the "Race" filter and expand all available options
    Then I see the available options "American Indian or Alaska Native|Asian or Pacific Islander|Black or African American|White" for "Race"

  Scenario: Infant Mortality Education Options for 2014
    When I click to show all filters for "Maternal Characteristics"
    Then I see the available filter "Education" for "Maternal Characteristics"
    When I click on the "Education" filter and expand all available options
    Then I see the available options "8th grade or less|9th through 12th grade with no diploma|High school graduate or GED completed|Some college credit, but not a degree|Associate degree (AA,AS)|Bachelor’s degree (BA, AB, BS)|Master’s degree (MA, MS, MEng, MEd, MSW, MBA)|Doctorate (PhD, EdD) or Professional Degree (MD, DDS, DVM, LLB, JD)|Unknown" for "Education"
    And I see the disabled options "0 – 8 years|9 – 11 years|12 years|13 – 15 years|16 years and over|Not stated|Not on certificate" for "Education"

  #Wonder api is returning 'Chinese', 'Filipino', 'Hawaiian', 'Japanese' and 'Other Asian' instead of 'Asian or Pacific Islander'
  #So for D18 database (year 2000 - 2002) data mismatched a little bit. once we fix that issue we can update steps
  Scenario: Infant Mortality Table Data Suppression for Alaska in 2000
    When I select the option "2000" for "Year" and the option "Alaska" for "State"
    When I click on the "State" filter and expand all available options
    Then the values in row "0" should be "American Indian or Alaska Native, Suppressed, 21, Suppressed"
    Then the values in row "0" should be "American Indian or Alaska Native, 1,190, 1,319, Not Available"
    And the values in row "1" should be "Asian or Pacific Islander, Suppressed, Suppressed, Suppressed"
    And the values in row "1" should be "Asian or Pacific Islander, Not Available, Not Available, Not Available"
    And the values in row "2" should be "Black or African American, Suppressed, Suppressed, Suppressed"
    And the values in row "2" should be "Black or African American, 215, 247, Not Available"
    And the values in row "3" should be "White, 17, 20, 37"
    And the values in row "3" should be "White, 3,102, 3,262, Not Available"
    And the values in row "3" should be "White, Unreliable, 6.1, Not Available"

  #Wonder api is returning 'Chinese', 'Filipino', 'Hawaiian', 'Japanese' and 'Other Asian' instead of 'Asian or Pacific Islander'
  #So for D18 database (year 2000 - 2002) data mismatched a little bit. once we fix that issue we can update steps
  Scenario: Infant Mortality Table Data with only 'Female'
    When I expand "Sex" filter section
    And filter "Sex" and option "Female" selected
    Then the values in row "0" should be "American Indian or Alaska Native, Suppressed, Suppressed"
    Then the values in row "0" should be "American Indian or Alaska Native, 1,190, Not Available"
    And the values in row "1" should be "Asian or Pacific Islander, Suppressed, Suppressed"
    And the values in row "1" should be "Asian or Pacific Islander, Not Available, Not Available"
    And the values in row "2" should be "White, 17, 17"
    And the values in row "2" should be "White, 3,102, Not Available"
    And the values in row "2" should be "White, Unreliable, Not Available"
