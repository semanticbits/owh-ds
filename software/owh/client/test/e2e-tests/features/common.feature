Feature: Common functionality
  As a I view and update filters to view results for my searches
  I want to be able to go back few steps by the 'browser back button' and 'in-application back button' and undo the recently selected filters one at a time
  So that I can switch and update my filter selections

Scenario: Access mortality page
  When I am at home page
  And  I click on Explore button in Health Information Gateway section
  Then I should get search page with default filter type "Detailed Mortality"
  And URL in browser bar should not be base URL

Scenario: Filter options updated
  When I update criteria in filter options with column "Autopsy"
  Then URL in browser bar should change

#Scenario: Browser back button
#  When I selects the back button then browser URL should change
#  Then most recent filter action "Autopsy" type "Column" is removed and I am taken back by one step
#  And the results page should have 2 graphs and table has columns "Race", "Female", "Male" for filter "Race"

#Scenario: Browser forward button
#  When I selects the forward button in browser then URL should change
#  Then the results page should have 4 graphs and table has columns "Yes", "No", "Unknown" for filter "Autopsy"


Scenario: Browser back button
  When I am at home page
  And  I click on Explore button in Health Information Gateway section
  Then I should get search page with default filter type "Detailed Mortality"
  When I change 'I'm interested in' dropdown value to "Bridged-Race Population Estimates"
  #Then I should see Bridge race search page with filter type "Bridged-Race Population Estimates"
  When I expand "Ethnicity" filter section
  And  filter "Ethnicity" and option "Non Hispanic" selected
  When I select the back button in browser
  Then I should get search page with default filter type "Bridged-Race Population Estimates"
  #And the results page (yrbs data table) should be refreshed to reflect "Ethnicity" filter with option "All"

Scenario: Browser forward button
  When I select the forward button in browser
  Then I should get search page with default filter type "Bridged-Race Population Estimates"
  #And the results page (yrbs data table) should be refreshed to reflect "Ethnicity" filter with option "Non Hispanic"

Scenario: In-application forward and backward buttons
  Then I should see the forward and backward button in the application
  When I select the back button in application
  Then I should get search page with default filter type "Bridged-Race Population Estimates"
  #And the results page (yrbs data table) should be refreshed to reflect "Ethnicity" filter with option "All"
  When I select the forward button in application
  Then I should get search page with default filter type "Bridged-Race Population Estimates"
  #And the results page (yrbs data table) should be refreshed to reflect "Ethnicity" filter with option "Non Hispanic"
