Feature: Observe "Bridged-Race Population Estimates" page filters
  As a user
  I should be able to access "Bridged-Race Population Estimates" page
  In order to do further activities
  So that I can manipulate filters
  And I can see valid results via visualizations

 Scenario: Access Bridged-Race Population estimates page
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "Bridged-Race Population Estimates"
    Then I should see filter type "Bridged-Race Population Estimates" selected
    And  An option to show/hide percentages is displayed

 Scenario: Observe default "Bridged-Race Population Estimates" sidebar filters
    Then I see "Yearly July 1st Estimates" as first option in sidebar filters
    And  filter "Yearly July 1st Estimates" and option "2015" selected
    And  I see the data table with race, female, male and total table headers
    And I see population count for "2015" option
 #   Then I see "Sex" as second option in sidebar filters
 #   And  filter "Sex" and option "All" selected
 #  And I make observations for all other enabled filters

 Scenario: Side filter collapse
    Then user sees side filter
    Then there is button to hide filter
    When I click hide filter button
    Then side menu slides away
    Then I see button to show filters
    When I click show filters button
    Then side menu slides back into view

 Scenario: View axis labels & data elements for chart
    When I see a visualization
    Then I see data element and values are plotted on both the axes
    And I see chart heading appears on the top
    #And I see an axis labels are displayed on the graph
    #And I see an Expand button on the top right corner
    #And I see an share button on the top right corner