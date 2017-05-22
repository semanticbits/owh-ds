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

  Scenario: Infant Mortality Default Table Data for 2013
    Then the default headers of the table should be "Race, Female, Male, Number of Infant Deaths"
    And the values in row "0" should be "American Indian / Alaskan Native, 153 (43.8%), 196 (56.2%), 349"
    And the values in row "1" should be "Asian / Pacific Islander, 462 (43.1%), 609 (56.9%), 1,071"
    And the values in row "2" should be "Black or African American, 3,102 (45.6%), 3,707 (54.4%), 6,809"
    And the values in row "3" should be "White, 6,524 (43.5%), 8,471 (56.5%), 14,995"

  Scenario: Infant Mortality Race Options for 2013
    When I click on the "Race" filter and expand all available options
    Then I see the available options "American Indian / Alaskan Native|Asian / Pacific Islander|Black or African American|White" for "Race"
    And I see the disabled options "Chinese|Japanese|Hawaiian|Filipino|Other Asian" for "Race"

  Scenario: Infant Mortality Education Options for 2013
    When I click to show all filters for "Maternal Characteristics"
    Then I see the available filter "Education" for "Maternal Characteristics"
    When I click on the "Education" filter and expand all available options
    Then I see the available options "8th grade or less|9th through 12th grade with no diploma|High school graduate or GED completed|Some college credit, but not a degree|Associate degree (AA,AS)|Bachelor’s degree (BA, AB, BS)|Master’s degree (MA, MS, MEng, MEd, MSW, MBA)|Doctorate (PhD, EdD) or Professional Degree (MD, DDS, DVM, LLB, JD)|Unknown" for "Education"
    And I see the disabled options "0 – 8 years|9 – 11 years|12 years|13 – 15 years|16 years and over|Not stated|Not on certificate" for "Education"
