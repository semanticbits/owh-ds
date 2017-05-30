Feature: Observe "Detailed Mortality" page filters
  As a user
  I should be able to access "Detailed Mortality" page
  In order to do further activities
  So that I can manipulate filters
  And I can see valid results via visualizations

Scenario: Observe default "Detailed Mortality" page
  When I am at home page
  And  I click on Explore button in Health Information Gateway section
  Then I should get search page with default filter type "Detailed Mortality"
  Then the user observes the option "Number of Deaths"
  Then user sees side filter
  Then there is button to hide filter
  When I click hide filter button
  Then side menu slides away
  Then I see button to show filters
  When I click show filters button
  Then side menu slides back into view
  Then user clicks on "+ 13 more" more link for "Year" filter
  Then years should be in descending order
  Then user clicks on "- 13 less" less link for "Year" filter 

Scenario: Observe default "Detailed Mortality" sidebar filters
#  Given I am on search page
  When I see "Year" as first option in sidebar filters
  Then I see filter Year and option "2015" selected
#  And I make observations for all other enabled filters

Scenario: Observe default "Detailed Mortality" visualizations
#  Given I am on search page
  When user sees a visualization
  Then labels are displayed on both the axes for minimized visualization
#  When user expand visualization
#  Then labels are displayed on both the axes for expanded visualization
  Then I observe a button for Facebook
  When I see the number of deaths in data table
#  Then data should be right aligned in table
  Then the percentages are shown for each row are displayed by default
  Then the Percentages should have a one decimal precision
#  Then percentages are displayed in the same column/cell in parenthesis
  And an option to show/hide percentages is displayed
#  And when that option is toggled, the percentages are either displayed/hidden

Scenario: Observe default "Detailed Mortality" with "Crude Death Rates" sidebar filters
#  Given I am on search page
  When I choose the option "Crude Death Rates"
  Then I should see Crude Deth Rates page
  When user sees a visualization
#  Then labels for "Crude Death Rates" are displayed on minimized visualization
#  And I should observe "2015" option is selected in "Year" filter

Scenario: Observe default "Detailed Mortality" with "Age Adjusted Death Rates" sidebar filters
#  Given I am on search page
  When the user chooses the option 'Age Adjusted Death Rates'
  Then the age adjusted rates are shown for each row
  When user sees a visualization
#  Then labels for "Age Adjusted Death Rates" are displayed on minimized visualization