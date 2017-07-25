@Home
Feature: Home page
  As a user
  I should be able to access home page
  In order to do further activities
  I want to see/know that this site is work in progress
  So that I know it's not complete/live
  I want to see the name of the application as Health Information Gateway
  So that it is no longer called Quick Health Data Online

Scenario: Access home page
  When I hit app url
  Then I should be automatically redirected to home page
  And I see the name of application as "Health Information Gateway"

Scenario: Access search page with default filter type mortality
  When I click on Explore button in Health Information Gateway section
#  Then I should get search page with default filter type mortality
#  And I see the name of application as "Health Information Gateway"

Scenario: Access search page with filter type YRBS
  When I am at home page
  And I click on Explore button in Youth Related card under Behavioral Risk
  #Then I should get search page with default filter type "Youth Risk Behavior"

Scenario: Access Birth card
  When I am at home page
  And I click on explore button in Birth card under womens health section
  Then I should get a info modal

Scenario: Banner
  When I am at home page
  Then gray banner on top reads "An official website of the United States Government. This site is work in progress and may contain inaccuracies. If you don't find what you need, visit this site or CDC Wonder."
  When I am at search page
  Then gray banner on top reads "An official website of the United States Government. This site is work in progress and may contain inaccuracies. If you don't find what you need, visit this site or CDC Wonder."

Scenario: Footer links
  When I am at home page
  Then footer should have "Contact HHS,Privacy Policy,FIOA,Viewers & Players,Womenshealth.gov,HHS.gov,USA.gov" links