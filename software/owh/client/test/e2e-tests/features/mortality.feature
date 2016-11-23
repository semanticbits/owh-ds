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
  Given user is on search page
  Then user sees side filter
  Then there is button to hide filter
  When user clicks hide filter button
  Then side menu slides away
  Then user sees button to show filters
  When user clicks show filters button
  Then side menu slides back into view

Scenario: Side filter options retain order
  Given user is on search page
  When user expands race options
  Then user clicks on "+ 2 more" more link for "Race" filter
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
  Given user is on search page
  When the user chooses the option 'Death Rates'
  Then the rates are shown for each row (with the Total population, from Bridge Race Estimates, as the denominator) - and not the total number of deaths shown in the table

Scenario: Dropdown Location
  Given user is on search page
  Then dropdown is in the main search bar

Scenario: Decimal Precision
  Given user is on search page
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
  Given user is on search page
  When I see the quick visualizations
  Then they're displayed same as before and nothing changes

Scenario: Help Message above the quick visualization pane
  Given user is on search page
  When the user chooses the option 'Death Rates'
  Then the following message should be displayed stating that population data is being retrieved from Census "Population details from NCHS Bridge Race Estimates is used to calculate Death Rates (per 100,000)"

Scenario: Years are supposed to be in descending order
  Given user is on search page
  When user sees side filter
  Then user clicks on "+ 12 more" more link for "Year" filter
  Then years should be in descending order

Scenario: Race options should be in proper order
  Given user is on search page
  When user sees side filter
  Then user expands race options
  Then user clicks on "+ 2 more" more link for "Race" filter
  Then race options should be in proper order

Scenario: Autopsy options should be in proper order
  Given user is on search page
  When user sees side filter
  Then user expands autopsy filter
  Then autopsy options should be in proper order


#Scenario: Suppressed
#  When counts fall below the determined "cut-off" value and the conditions for suppression are met
#  Then the value should be suppressed

#Scenario: Data table
#  When the user looks at a suppressed value in the data table
#  Then the word suppressed must be displayed in it's place

Scenario: Age Adjusted Death Rates
  Given user is on search page
  When the user chooses the option 'Age Adjusted Death Rates'
  Then the age adjusted rates are shown for each row

Scenario: Age filter for age adjusted rates
  Given user is on search page
  When the user chooses the option 'Age Adjusted Death Rates'
  Then the age filter should be hidden

Scenario: Side filter total suppression
  Given user is on search page
  When user shows more year filters
  And user filters by year 2013
  Then user expands race options
  And user clicks on "+ 2 more" more link for "Race" filter
  When user expands ethnicity filter
  And user shows more ethnicity filter
  And user filters by ethnicity Spaniard
  Then user should only see total for white race in side filter

Scenario: Ethnicity order
  Given user is on search page
  When user expands ethnicity filter
  When user shows more ethnicity filter
  Then ethnicity filters should be in given order
