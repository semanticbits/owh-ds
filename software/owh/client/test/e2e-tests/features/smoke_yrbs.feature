Feature: Observe "Youth Risk Behavior" page filters
  As a user
  I should be able to access "Youth Risk Behavior" page
  In order to do further activities
  So that I can manipulate filters
  And I can see valid results via visualizations

Scenario: Access YRBS page from home page
    Given I am on search page
    When I select YRBS as primary filter
    Then I should get search page with default filter type "Youth Risk Behavior"

Scenario: YRBS Advanced Search
    When I see a link "Switch to Advanced Search" at the top of the sidebar
    And I click on the "Switch to Advanced Search" link
    Then the sidebar switches to an Advanced Search mode
    And the link above the sidebar changes to "Switch to Basic Search"
    And the link "Switch to Advanced Search" should be disappear