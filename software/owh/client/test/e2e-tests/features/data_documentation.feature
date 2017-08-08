@DataDocumentation
Feature: Data Documentation
  As a User
  I want to see a one page dataset documentation on Natality
  So that I can understand what the dataset is all about

  Scenario: Natality data documentation
    Given I am at home page
    And  I click on Explore button in Health Information Gateway section
    When I change 'I'm interested in' dropdown value to "Natality"
    Then I see data documentation link
    When I click on data documentation link
    Then I see details about natality dataset

  Scenario: redirect to dataset search page
    When I click on explore dataset button
    Then I see I am being redirected to natality page
