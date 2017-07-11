@Census
Feature: Bridge race filters
  As a user
  I want to see the data table upon selection of Bridged-Race filters
  So that I can see the results of the filter options
  and I can quickly visualize and analyze the data

  Background: Access Bridged-Race Population estimates page
    When I am at home page
    And  I click on Explore button in Health Information Gateway section
    Then I should get search page with default filter type "Detailed Mortality"
    When I change 'I'm interested in' dropdown value to "Bridged-Race Population Estimates"
    Then I should see filter type "Bridged-Race Population Estimates" selected
    And  An option to show/hide percentages is displayed


  Scenario: Default filter state
    Then I see "Yearly July 1st Estimates" as first option in sidebar filters
    And  filter "Yearly July 1st Estimates" and option "2015" selected
    And  I see the data table with race, female, male and total table headers
    And I see population count for "2015" option

  Scenario: Side filter collapse
    Then user sees side filter
    Then there is button to hide filter
    When I click hide filter button
    Then side menu slides away
    Then I see button to show filters
    When I click show filters button
    Then side menu slides back into view

  Scenario: Toggle row/column switch switches
    When I click on row button in row-column switch for "Yearly July 1st Estimates"
    Then I see "Yearly July 1st Estimates" filter in data table header

  Scenario: Expand/collapse a filter option
    When I click on sex filter
    Then I see male and female sub filters
    When I click on sex filter
    Then I see sex filter options disappeared

  Scenario: View axis labels & data elements for chart
    When I see a visualization
    Then I see data element and values are plotted on both the axes
    And I see chart heading appears on the top
    #And I see an axis labels are displayed on the graph
    #And I see an Expand button on the top right corner
    #And I see an share button on the top right corner

  #Scenario: Export chart
    #And I see export chart button
    #When I click on export chart button
    #Then The chart is downloaded

  @Only
  Scenario: Expand/collapse chart
    When I clicks on the expand button
    Then I see expanded graph in modal dialog
    And  I see expand button is changed to collapse button
    And I see export chart button
    When I hover on the export chart button
    Then I see two export menus displayed
    When I click on the export as PNG
    Then I see a PNG file is downloaded
    When I hover on the export chart button
    When I click on the export as PDF
    Then I see a PDF file is downloaded
    When I click on collapse button
    Then I see graph is collapsed
    And I see an Expand button on the top right corner


 # Scenario: Show line graph
 #   When I remove default filters
  #  And I select year filter
 #   Then I should see line graph

  Scenario: State filter search box
    When I expands the State filter
    Then I see the search box
    #When I begins to type a state name "alas" in the search box
    #Then I see results dynamically populate with the states matching the "alas"

  Scenario: Percentages
    When I click the "Hide" button
    Then I should not see percentages

  Scenario: Age group 85+ years groupings
    When I set "Age Groups" filter "Row"
    Then I see data in data table for 85+ years age group
