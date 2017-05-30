Feature: PRAMS filters
  As a user
  I want to see the data table upon selection of PRAMS filters
  So that I can see the results of the filter options
  and I can quickly visualize and analyze the data

  Scenario: Default filter state
    Given I am on search page
    When I select PRAMS as primary filter
    Then I see 'By' filter pre-selected with State and Question
    And  I see state data displayed in data table

  Scenario: Visualizations
    When I click on "Show 3 More" questions link
    And  I click on chart icon for 'Indicator of whether delivery was paid for by insurance purchased directly question'
    Then I see chart being displayed for "Indicator of whether delivery was paid for by insurance purchased directly" question
    And  I see axis labels for chart- state and Percentage
    And  I close chart dialog

  #Scenario: Topic filter
    #Given I am on search page
    #And  I select PRAMS as primary filter
    #When I change class to "Demographics"
    #And  I see topics Household Characteristics and Income displayed in side filter
    #When filter "Topic" and option "Income" selected
    #Then I see only "Income" topic in data table

  Scenario: Questions filter
    Given I am on search page
    And  I select PRAMS as primary filter
    When I change class to "Demographics"
    And  I click on "Select Questions" button
    Then I see question categories in question tree are matching with topic
    And  I close questions dialog
    When I change class to "Family Planning"
    And  user clicks on "+ 1 more" more link for "Topic" filter
    And  I click on "Select Questions" button
    Then I see question categories in question tree are matching with topic