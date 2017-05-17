Feature: Observe "Detailed Mortality" page filters
  As a user
  I should be able to access "Detailed Mortality" page
  In order to do further activities
  So that I can manipulate filters
  And I can see valid results via visualizations

Scenario: Access mortality page
  When I am at home page
  And  I click on Explore button in Health Information Gateway section
  Then I should get search page with default filter type "Detailed Mortality"
#  And show me drop-down should default to "Number of Deaths"
#  And I can Hide Sidebar
#  Then I can Show Sidebar
#  Then user clicks on "+ 13 more" more link for "Year" filter
#  Then user clicks on "- 13 less" less link for "Year" filter 

#Scenario: Observe mortality default sidebar filters
#  Given I am on search page
#  Then I should see sidebar filters in default positions

#Scenario: Observe mortality default visualizations
#  Given I am on search page
#  Then I should check out various viz on page

#Scenario: Observe default mortality Crude Death Rates sidebar filters
#  Given I am on search page
#  When I choose the option "Crude Death Rates"
#  Then I should see default filters

#Scenario: Observe default mortality Age Adjusted Death Rates sidebar filters
#  Given I am on search page
#  When the user chooses the option 'Age Adjusted Death Rates'
#  Then I should see default filters