@Infant
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

  Scenario: Infant Mortality Default Table Data for 2014
    Then the default headers of the table should be "Race, Female, Male, Number of Infant Deaths"
    And the values in row "0" should be "American Indian / Alaskan Native, 146, 194, 340"
    And the values in row "0" should be "American Indian / Alaskan Native, 22,120, 22,808, 44,928"
    And the values in row "0" should be "American Indian / Alaskan Native, 6.6, 8.5, 7.6"
    And the values in row "1" should be "Asian / Pacific Islander, 480, 600, 1,080"
    And the values in row "1" should be "Asian / Pacific Islander, 137,076, 145,647, 282,723"
    And the values in row "1" should be "Asian / Pacific Islander, 3.5, 4.1, 3.8"
    And the values in row "2" should be "Black or African American, 3,082, 3,727, 6,809"
    And the values in row "2" should be "Black or African American, 315,741, 324,821, 640,562"
    And the values in row "2" should be "Black or African American, 9.8, 11.5, 10.6"
    And the values in row "3" should be "White, 6,543, 8,278, 14,821"
    And the values in row "3" should be "White, 1,472,438, 1,547,425, 3,019,863"
    And the values in row "3" should be "White, 4.4, 5.3, 4.9"

  Scenario: Infant Mortality Race Options for 2014
    When I click on the "Race" filter and expand all available options
    Then I see the available options "American Indian / Alaskan Native|Asian / Pacific Islander|Black or African American|White" for "Race"
    And I see the disabled options "Chinese|Japanese|Hawaiian|Filipino|Other Asian" for "Race"

  Scenario: Infant Mortality Education Options for 2014
    When I click to show all filters for "Maternal Characteristics"
    Then I see the available filter "Education" for "Maternal Characteristics"
    When I click on the "Education" filter and expand all available options
    Then I see the available options "8th grade or less|9th through 12th grade with no diploma|High school graduate or GED completed|Some college credit, but not a degree|Associate degree (AA,AS)|Bachelor’s degree (BA, AB, BS)|Master’s degree (MA, MS, MEng, MEd, MSW, MBA)|Doctorate (PhD, EdD) or Professional Degree (MD, DDS, DVM, LLB, JD)|Unknown" for "Education"
    And I see the disabled options "0 – 8 years|9 – 11 years|12 years|13 – 15 years|16 years and over|Not stated|Not on certificate" for "Education"

  Scenario: Infant Mortality Table Data Suppression for Alaska in 2000
    When I select the option "2000" for "Year" and the option "Alaska" for "State"
    Then the values in row "0" should be "Black or African American, Not Available, Suppressed, Suppressed"
    And the values in row "1" should be "White, Not Available, 20, 37"
    And the values in row "2" should be "Hawaiian, Not Available, Suppressed, Suppressed"
    And the values in row "3" should be "Other Asian, Suppressed, Not Available, Suppressed"
