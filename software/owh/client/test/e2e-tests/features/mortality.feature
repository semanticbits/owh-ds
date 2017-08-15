@Mortality
Feature: Mortality page
  As a user
  I should be able to access mortality page
  I want to see labels on X and Y axis on the quick visualization
  So that I can instantly know what data is plotted on which axis
  I want to see raw data and percentages (as default results) when I select to view "Number of Deaths" in the main search bar
  So that I can see percentages along with number of deaths

Scenario: Access mortality page
  When I am at home page
  And  I click on Explore button in Health Information Gateway section
  Then I should get search page with default filter type "Detailed Mortality"

Scenario: Co-Branded header
  Then I see text on Co-Branded header
  When I click on "Explore HHS"
  Then Co-Branded menus should be displayed
  When I click on "Close"
  Then Co-Branded menus should be hidden

Scenario: Axis labels
  When user sees a visualization
  Then labels are displayed on both the axes for minimized visualization
  When user expand visualization
  Then I should see grouped and stacked controls on expaned visualization
  And labels are displayed on both the axes for expanded visualization

Scenario: Side filter collapse
  Given I am on search page
  Then user sees side filter
  Then there is button to hide filter
  When I click hide filter button
  Then side menu slides away
  Then I see button to show filters
  When I click show filters button
  Then side menu slides back into view

Scenario: Side filter options retain order
  Given I am on search page
  When user expands race options
  And user clicks on "+ 1 more" more link
  And user selects second race option
  #Then race options retain their initial ordering

Scenario: Display show/hide percentage button only on mortality page
  When I am at home page
  And  I click on Explore button in Health Information Gateway section
  Then I should get search page with default filter type "Detailed Mortality"
  And an option to show/hide percentages is displayed
  When I change 'I'm interested in' dropdown value to "Youth Risk Behavior"
  Then I should be redirected to YRBS page
  And show/hide percentages button shouldn't display

Scenario: Death Rates
  Given I am on search page
  When the user chooses the option 'Death Rates'
  Then the rates and population are shown for each row in 'Death Rates' view

Scenario: Dropdown Location
  Given I am on search page
  Then dropdown is in the main search bar

Scenario: Decimal Precision
  Given I am on search page
  Then the Percentages should have a one decimal precision

Scenario: Percentages in data table
  When I see the number of deaths in data table
  Then the percentages are shown for each row are displayed by default

Scenario: Filter options updated
  When I update criteria in filter options with column "Autopsy"
  Then data table is updated and the number of deaths and percentages are updated too

Scenario: Items added to columns/rows
  When I add new data items to row or columns
  Then the percentages get re-calculated based on all the information displayed in a given row

Scenario: Percentages display
  When I see the data table
  Then percentages are displayed in the same column/cell in parenthesis

Scenario: Show/Hide percentages
  When I see the results
  Then an option to show/hide percentages is displayed
  And when that option is toggled, the percentages are either displayed/hidden

Scenario: Decimal Precision
  When I look at the table results
  And percentage option is enabled
  Then the Rates and Percentages should have a one decimal precision

Scenario: Quick visualizations
  Given I am on search page
  When I see the quick visualizations
  Then they're displayed same as before and nothing changes

Scenario: Help Message above the quick visualization pane
  Given I am on search page
  When the user chooses the option 'Death Rates'
  Then the following message should be displayed stating that population data is being retrieved from Census "Population details from NCHS Bridged-Race Estimates are used to calculate Death Rates (per 100,000)."

Scenario: Years are supposed to be in descending order
  Given I am on search page
  When user sees side filter
  Then user clicks on "+ 13 more" more link for "Year" filter
  Then years should be in descending order

Scenario: Ethnicity Filter
  Given I am on search page
  When user expands ethnicity filter
  Then user should see two subcategories- Hispanic and NonHispanic

Scenario: Check box
  Given I am on search page
  When user expands ethnicity filter
  When user checks entire Hispanic group
  Then all Hispanic child options should be checked

Scenario: Ethnicity Hispanic Group
  Given I am on search page
  When user expands ethnicity filter
  When user expands hispanic option group
  Then user should see all the of the Hispanic Origin options grouped(Central American,Cuban,Dominican,Latin American, Mexican, Puerto Rican, South American,Spaniard, Other Hispanic, Unknown) under one Category- Hispanic

Scenario: Check box- Hispanic Sub Categories
  Given I am on search page
  When user groups ethnicity by row
  When user expands ethnicity filter
  When user expands hispanic option group
  When user checks some options under hispanic group
  Then data should be filtered by the checked hispanic options

Scenario: Side filter total suppression
  Given I am on search page
  And I expand "Race" filter section
  And I expand "State" filter section
  And  user select "American Indian or Alaska Native" option in "Race" filter
  And user clicks on "+ 48 more" more link for "State" filter
  Then I see count for few states are suppressed

  #And user expands sex options
  #When user expands ethnicity filter
  #And user groups ethnicity by row
  #And user expands hispanic option group
  #And user filters by ethnicity Dominican
  #And user expands state filter
  #And user selects Alaska state
  #Then user should see total for Male and Female in side filter suppressed
  #And total should be suppressed for all Races except White

Scenario: Ethnicity order
  Given I am on search page
  When user expands ethnicity filter
  And user expands hispanic option group
  Then ethnicity filters should be in given order

Scenario: Race options should be in proper order
  Given I am on search page
  When user sees side filter
  Then user expands race options
  Then user clicks on "+ 1 more" more link for "Race" filter
  Then race options should be in proper order

Scenario: Autopsy options should be in proper order
  Given I am on search page
  When user sees side filter
  Then user expands autopsy filter
  Then autopsy options should be in proper order

Scenario: verify Place of Death filter options
  Given I am on search page
  When user sees side filter
  Then user expands placeOfDeath filter
  And user clicks on "+ 6 more" more link for "Place of Death" filter
  Then placeofDeath filter options should be in proper order

Scenario: filter data with Hospice Facility
  Given I am on search page
  When user sees side filter
  Then user expands placeOfDeath filter
  And user clicks on "+ 6 more" more link for "Place of Death" filter
  When user select "Hospice facility" option in "Place of Death" filter
  Then data table should display right Number of Deaths

Scenario: Crude Death rates population count should match with CDC for year 2000
  Given I am on search page
  When I choose the option "Crude Death Rates"
  Then I should see Crude Deth Rates page
  When user sees a visualization
  Then labels "Race" and "Crude Death Rates" are displayed on minimized visualization
  When user expand visualization
  Then I should not see grouped and stacked controls on expanded visualization
  And labels "Race" and "Crude Death Rates" are displayed on expanded visualization
  And user clicks on "+ 13 more" more link for "Year" filter
  Then I select "Year" value "2000"
  And I un-select "Year" value "2015"
  And data table should display right population count for Crude Death Rates
  When I update criteria in filter option with row "Ethnicity"
  Then table should display Hispanic groups for Crude Death Rates

Scenario: Crude Death Rates side filter options
  Given I am on search page
  When I choose the option "Crude Death Rates"
  Then I should see the options "Year, Sex, Race, Ethnicity, Age Groups, State, Underlying Case of Death" enabled

Scenario: Select 'All' years
  Given I am on search page
  When user select "All" option in "Year" filter
  #Then data table should display right population count for year 'All' filter

Scenario: Suppression
  Given I am on search page
  And I expands the State filter
  When I select Alabama state from state filter
  And I select groupBy "Off" option for "Sex" filter
  And I select groupBy "Column" option for "Age Groups" filter
  Then I see cell values being suppressed for American Indian race
  And I see total is also being suppressed
  When I expand "Age Groups" filter section
  And I select Age Groups from '20' to '100'
  Then Age Group values "20" and ">100" should be displayed on slider
  And mortality data table should display results for Age Group
  When I select the back button in browser
  Then Age Group values "Not stated" and ">100" should be displayed on slider
  When I select the forward button in browser
  Then Age Group values "20" and ">100" should be displayed on slider

#Age adjusted death rates
Scenario: Age Adjusted Death Rates
  Given I am on search page
  When the user chooses the option 'Age Adjusted Death Rates'
  Then the age adjusted rates are shown for each row
  When user sees a visualization
  Then labels "Race" and "Age Adjusted Death Rates" are displayed on minimized visualization
  When user expand visualization
  Then I should not see grouped and stacked controls on expanded visualization
  And labels "Race" and "Age Adjusted Death Rates" are displayed on expanded visualization
  When I update criteria in filter option with row "Ethnicity"
  Then table should display Hispanic groups for Age Adjusted Death Rates
  When I expand "Underlying Cause of Death" filter section
  And I click on "Select Cause of Death" button
  And I select a cause and click on the Filter Selected Cause(s) of Death(s) button
  Then the "Select Cause of Death" button should be renamed to "Update Cause of Death"
  And data table should display Age Adjusted Death Rates for selected cause of death

Scenario: Filer 'Multiple Causes of Deaths' should be displayed
  Given I am on search page
  When user sees side filter
  Then filter "Multiple Causes of Death" should be displayed
  When I expand "Multiple Causes of Death" filter section
  And I set "Multiple Causes of Death" filter "Row"
  Then I see Multiple Causes of Deaths in datatable


Scenario: Non-Hispanic should have total in the side filter
  Given I am on search page
  When user expands ethnicity filter
  Then I should see total for Non-Hispanic

Scenario: Disable unknown when other option is selected
  When user checks entire Hispanic group
  Then Unknown is disabled- grayed out

Scenario: Disable other options when Unknown is selected
  Given I am on search page
  When user expands ethnicity filter
  And the user selects Unknown
  Then the rest of the options are disabled- grayed out

Scenario: Age group selection disabled for age rates
  Given I am on search page
  When I update criteria in filter option with row "Age Groups"
  When the user chooses the option 'Age Adjusted Death Rates'
  Then table should not include age groups

Scenario Outline: Non applicable filters disabled in cude and age adjusted rate
  Given I am on search page
  When I choose the option <showMeFilter>
  Then I see appropriate side filters disabled for <filterOptions>

  Examples:
    | showMeFilter              |   filterOptions |
    |  "Crude Death Rates"        | "Autopsy,Place of Death,Weekday,Month,Multiple Causes of Death" |
    |  "Age Adjusted Death Rates" | "Age Groups,Autopsy,Place of Death,Weekday,Month" |

Scenario: Group by 'State' in age adjusted rate
    When I update criteria in filter options with off "Sex"
    And I update criteria in filter options with off "Race"
    And I update criteria in filter option with row "State"
    Then I see all state age adjusted rate data by rows in the result table
    And I update criteria in filter options with column "State"
    #There is a bug - when user puts only one filter on column then last filter option is missing in data table
    #Once we fix this bug we can enable this step
    #Then I see all state age adjusted rate data by columns in the result table

 Scenario: Group by 'State' in crude rate
    Given I am on search page
    When I choose the option "Crude Death Rates"
    And I update criteria in filter options with off "Sex"
    And I update criteria in filter options with off "Race"
    And I update criteria in filter option with row "State"
    Then I see all state crude rate data by rows in the result table
    And I update criteria in filter options with column "State"
    #There is a bug - when user puts only one filter on column then last filter option is missing in data table
    #Once we fix this bug we can enable this step
    #Then I see all state crude rate data by columns in the result table

 Scenario: Disabled filters must not be seen in the data-table
    Given I am on search page
    When I select groupBy "Column" option for "Place of Death" filter
    Then I see disabled option "Hospital, clinic or Medical Center- Patient status unknown" not being displayed in data table

 Scenario: State filter group by row
   Given I am on search page
   When I select groupBy "Row" option for "State" filter
   Then I see data table with Race and State values

  Scenario: Filtering on State- Rate
   Given I am on search page
   When I choose the option "Age Adjusted Death Rates"
   And user expands state filter
   Then user clicks on "+ 48 more" more link for "State" filter
   When I select State "DC"
   And I select State "CT"
   And I select groupBy "Row" option for "State" filter
   Then the rates corresponding to the deaths 0-9 must be suppressed
   And any value in the data table is suppressed then the totals in the State filter (sidebar) must be suppressed too
   And the death count <20 then the corresponding Rate must be marked as "Unreliable"

  Scenario: Group UCD codes on Row
    Given I am on search page
    And I expand "Underlying Cause of Death" filter section
    When I set "Underlying Cause of Death" filter "Row"
    Then I see data in data table grouped by Underlying Cause of Death and Race

  Scenario: Display selected filters at top
    Given I am on search page
    Then I see "Year: 2015" in list of applied filters
    When I expand "Race" filter section
    And  user select "American Indian or Alaska Native" option in "Race" filter
    Then I see "Year: 2015 | Race: American Indian or Alaska Native" in list of applied filters

    When user select "Asian or Pacific Islander" option in "Race" filter
    Then I see "Year: 2015 | Race: American Indian or Alaska Native, Asian or Pacific Islander" in list of applied filters

    When I deselect "American Indian or Alaska Native" option in "Race" filter
    Then I see "Year: 2015 | Race: Asian or Pacific Islander" in list of applied filters

  Scenario: State filter in Death Rates
    Given I am on search page
    When the user chooses the option 'Death Rates'
    And user expands state filter
    Then user clicks on "+ 48 more" more link for "State" filter
    When I select State "DC"
    And I select State "CT"
    Then the rates, deaths and population for "Female" "Asian or Pacific Islander" in 'Death Rates' view are "153.8", "170" and "110,561"

  Scenario: Row grouping on State filter in Death Rates
    Given I am on search page
    When I choose the option "Death Rates"
    And I select groupBy "Off" option for "Race" filter
    And I select groupBy "Row" option for "State" filter
    Then the rates, deaths and population for "Male" "Colorado" in 'Death Rates' view are "681.2", "18,690" and "2,743,763"

  Scenario: Column grouping on State filter in Death Rates
    Given I am on search page
    When I choose the option "Death Rates"
    And I select groupBy "Off" option for "Sex" filter
    And I select groupBy "Column" option for "State" filter
    Then the rates, deaths and population for "Delaware" "Black or African American" in 'Death Rates' view are "664.0", "1,474" and "221,986"
