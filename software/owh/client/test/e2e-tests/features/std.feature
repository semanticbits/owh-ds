@STD
Feature: STD page
  As a User
  I want to see the data table upon selection of filters
  So that I can see the results of the filter options

  Scenario: Default Filters
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "Sexually Transmitted Diseases"
    Then I should see filter type "Sexually Transmitted Diseases" selected
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
    When filter "Disease" and option "Congenital Syphilis" selected
    Then user clicks on "+ 6 more" more link for "Race/Ethnicity" filter
    Then user clicks on "+ 8 more" more link for "Age Groups" filter
    Then expected filters should be disabled for std

  Scenario: Race/Ethnicity, Sex, Age Group - any sub option selected
    When  filter "Disease" and option "Chlamydia" selected
    Then  filter "Sex" and option "Female" selected
    And "disease" filter option "Congenital Syphilis" should be disabled for "std"
    And  filter "Sex" and option "Both sexes" selected
    And "disease" filter option "Congenital Syphilis" should be enabled for "std"

  Scenario: Race/Ethnicity filter should be enabled/disabled on year change
    When filter "Year" and option "2015" selected
    Then all side filters should be enabled
    And user clicks on "+ 13 more" more link for "Year" filter
    When filter "Year" and option "2006" selected
    Then filter "Race/Ethnicity" should be disabled
    When filter "Year" and option "2015" selected
    Then all side filters should be enabled
    And the "Race/Ethnicity" filter should be toggled to "Off"

  Scenario: STD Cases visualizations
    When  I select groupBy "Row" option for "Race/Ethnicity" filter
    And user sees a visualization
    Then I see labels "Race/Ethnicity" and "Cases" are displayed on minimized visualization
    When user expand visualization
    Then I should see grouped and stacked controls on expaned visualization
    And  I see labels "Race/Ethnicity" and "Cases" are displayed on expanded visualization
    And I close visualization popup

  Scenario: STD Rates visualizations
    When I click on Rate chart view toggle button
    And user sees a visualization
    Then I see labels "Race/Ethnicity" and "Rates" are displayed on minimized visualization
    When user expand visualization
    Then I should not see grouped and stacked controls on expanded visualization
    And  I see labels "Race/Ethnicity" and "Rates" are displayed on expanded visualization
    And I close visualization popup

  Scenario: STD suppression
    When I select "AL" state for "std"
    Then std data table should suppress results

  Scenario: Age Groups filter options
    When I look at the sidebar
    Then I see the available options "All age groups|0-14|15-19|20-24|25-29|30-34|35-39|40-44|45-54|55-64|65+" for "Age Groups"

  Scenario: Select disease 'Early Latent Syphilis'
    When filter "Disease" and option "Early Latent Syphilis" selected
    Then "current_year" filter option "2000" should be disabled for "std"
    And "current_year" filter option "2001" should be disabled for "std"
    And "current_year" filter option "2002" should be disabled for "std"

  Scenario: Select year between 2000 - 20002
    When filter "Disease" and option "Chlamydia" selected
    Then "current_year" filter option "2000" should be enabled for "std"
    And "current_year" filter option "2001" should be enabled for "std"
    And "current_year" filter option "2002" should be enabled for "std"
    When filter "Year" and option "2000" selected
    Then "disease" filter option "Early Latent Syphilis" should be disabled for "std"
    When filter "Year" and option "2015" selected
    Then "disease" filter option "Early Latent Syphilis" should be enabled for "std"

  Scenario: Select year between 2007 - 2010
    When filter "Year" and option "2007" selected
    Then all side filters should be enabled
    And the following message should be displayed "National data are not available for any disease for the years 2007-2010." on std page