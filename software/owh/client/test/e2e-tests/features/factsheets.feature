@Factsheets
Feature: Fact sheet page
  As a user
  I should be able to access Fact sheet page

Scenario: Access fact sheet page
  When I am at home page
  And I navigate to factsheets page
  Then I should get factsheets page

Scenario: Generate PDF
  When I select state "Maryland" from state selectbox
  And I click on generate fact sheet link
  Then generated data should be displayed on same factsheets page

