@STD
Feature: STD page
  As a User
  I want to see the data table upon selection of filters
  So that I can see the results of the filter options

  Scenario: Default Filters
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "STD"
    Then I should see filter type "STD" selected
    And I expand "Disease" filter section
    And filter "Chlamydia" under STD "disease" should be a "radio"
    And  filter "Disease" and option "Chlamydia" selected
    And  filter "Year" and option "2015" selected
    And the "Year" filter should be toggled to "Off"
    And the "Sex" filter should be toggled to "Column"
    And the "Race/Ethnicity" filter should be toggled to "Row"
    And the "Disease" filter should be toggled to "Off"

  Scenario: STD data table
    When I look at the STD data table
    Then I see the Rates, Population and Cases as outputs in the STD data table

  Scenario: Filter order
    When I look at the sidebar
    Then filters should be in this order "Disease, Year, Sex, Race/Ethnicity, Age Groups, State"

  Scenario: Radio Buttons
    When I expand each STD filter
    Then every STD filter must have Radio buttons under then

  Scenario: Congenital Syphilis selected
    When I look at the sidebar
    Then user clicks on "+ 2 more" more link for "Disease" filter
    When  filter "Disease" and option "Congenital Syphilis" selected
    Then expected filters should be disabled for std and aids-hiv

  Scenario: Race/Ethnicity, Sex, Age Group - any sub option selected
    When  filter "Disease" and option "Chlamydia" selected
    Then  filter "Sex" and option "Female" selected
    And "disease" filter option "Congenital Syphilis" should be disabled for "std"
    And  filter "Sex" and option "Both sexes" selected
    And "disease" filter option "Congenital Syphilis" should be enabled for "std"

  Scenario: STD Cases visualizations
    When user sees a visualization
    Then labels "Race/Ethnicity" and "Cases" are displayed on minimized visualization
    When user expand visualization
    Then I should see grouped and stacked controls on expaned visualization
    And labels "Race/Ethnicity" and "Cases" are displayed on expanded visualization

  Scenario: STD Rates visualizations
    When I click on Rate chart view toggle button
    And user sees a visualization
    Then labels "Race/Ethnicity" and "Rates" are displayed on minimized visualization
    When user expand visualization
    Then I should not see grouped and stacked controls on expanded visualization
    And labels "Race/Ethnicity" and "Rates" are displayed on expanded visualization

  Scenario: STD suppression
    When I select "AL" state for "std"
    Then std data table should suppress results