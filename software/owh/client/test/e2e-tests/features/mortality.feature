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
  Then I should get search page with default filter type "Mortality"

Scenario: Axis labels
  When user sees a visualization
  Then labels are displayed on both the axes for minimized visualization
  When user expand visualization
  Then labels are displayed on both the axes for expanded visualization

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
  Then user clicks on "+ 1 more" more link for "Race" filter
  When user selects second race option
  Then race options retain their initial ordering

Scenario: Display show/hide percentage button only on mortality page
  When I am at home page
  And  I click on Explore button in Health Information Gateway section
  Then I should get search page with default filter type "Mortality"
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
  Then the following message should be displayed stating that population data is being retrieved from Census "Population details from NCHS Bridged-Race Estimates are used to calculate Death Rates (per 100,000)"

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
  When user shows more year filters
  And user filters by year 2015
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
  And user clicks on "+ 13 more" more link for "Year" filter
  Then I select "Year" value "2000"
  And I un-select "Year" value "2015"
  And data table should display right population count for Crude Death Rates

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

#Scenario: Data table
#  When the user looks at a suppressed value in the data table
#  Then the word suppressed must be displayed in it's place

Scenario: Age Adjusted Death Rates
  Given I am on search page
  When the user chooses the option 'Age Adjusted Death Rates'
  Then the age adjusted rates are shown for each row

#Scenario: Age filter for age adjusted rates
#  Given I am on search page
#  When the user chooses the option 'Age Adjusted Death Rates'
#  Then the age filter should be hidden

Scenario: Filer 'Multiple Causes of Deaths' should be displayed
  Given I am on search page
  When user sees side filter
  Then filter "Multiple Causes of Death" should be displayed

Scenario: Data should be right aligned
  Given I am on search page
  When I update criteria in filter options with column "Autopsy"
  When I update criteria in filter option with row "Sex"
  Then data should be right aligned in table

#Scenario: Rates, Deaths and Population values closer to each other
#  Given I am on search page
#  When I choose the option "Crude Death Rates"
#  Then Rates, Deaths and Population values look as a single data element in the column
#  When I select "Column" type for "Race" filter
#  Then Rates, Deaths and Population shouldn't be overlap

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

# Ethiniciry filter is disabled in rate views, there is a task OWH-1028 to enable it, this test will be enabled
  #after OWH-1028 is implemented
#Scenario: Hispanic Group options for crude death rate view
#  When I update criteria in filter option with row "Ethnicity"
#  When the user chooses the option 'Death Rates'
#  Then table should display Hispanic groups only

Scenario Outline: Non applicable filters disabled in cude and age adjusted rate
  Given I am on search page
  When I choose the option <showMeFilter>
  Then I see appropriate side filters disabled

  Examples:
    | showMeFilter              |
    |  "Crude Death Rates"        |
    |  "Age Adjusted Death Rates" |

Scenario: Group by 'State' in age adjusted rate
    When I update criteria in filter options with off "Sex"
    And I update criteria in filter options with off "Race"
    And I update criteria in filter option with row "State"
    Then I see all state age adjusted rate data by rows in the result table
    And I update criteria in filter options with column "State"
    Then I see all state age adjusted rate data by columns in the result table

 Scenario: Group by 'State' in crude rate
    Given I am on search page
    When I choose the option "Crude Death Rates"
    And I update criteria in filter options with off "Sex"
    And I update criteria in filter options with off "Race"
    And I update criteria in filter option with row "State"
    Then I see all state crude rate data by rows in the result table
    And I update criteria in filter options with column "State"
    Then I see all state crude rate data by columns in the result table

 Scenario: Disabled filters must not be seen in the data-table
    Given I am on search page
    When I select groupBy "Column" option for "Place of Death" filter
    Then I see disabled option "Hospital, clinic or Medical Center- Patient status unknown" not being displayed in data table