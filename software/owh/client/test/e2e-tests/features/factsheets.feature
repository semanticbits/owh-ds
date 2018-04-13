@Factsheets
Feature: Fact sheet page
  As a user
  I should be able to access Fact sheet page

Scenario: Access fact sheet page
  When I am at home page
  And I navigate to factsheets page
  Then I should get factsheets page

 Scenario: Generate Factsheet for Maryland
 When I select state "Maryland" from state selectbox
   And I select fact sheet type "Minority Health"
 And I click on generate fact sheet link
 Then generated data should be displayed on same factsheets page

  Scenario: Generate Minority FactSheet "Maryland"
   When I select state "Maryland" from state selectbox
   And I select fact sheet type "Minority Health"
  And I click on generate fact sheet link
#  Then generated data should be displayed on same factsheets page
  Then For "Maryland" the generated population data as defined in "population_total.csv" file

  Scenario: Generate Minority FactSheet "Arizona"
   When I select state "Arizona" from state selectbox
   And I select fact sheet type "Minority Health"
  And I click on generate fact sheet link
  Then For "Arizona" the generated population data as defined in "population_total.csv" file


  Scenario: Generate Minority FactSheet population for all states based upon Racial Distributions of Residents
   Then For <state> and type "Minority Health" the generated population data as defined in "population_total.csv" file
     |state|
     |Arizona|
     |Alabama|
     |Alaska|
     |Arkansas|
     |California|
     |Colorado|
     |Connecticut|
     |Delaware|
     |District of Columbia|
     |Florida|
     |Georgia|
     |Hawaii|
     |Idaho|
     |Illinois|
  |Indiana|
  |Iowa|
  |Kansas|
     |Kentucky|
    |Louisiana|
    |Maryland|
    |Maine|
    |Massachusetts|
    |Michigan|
    |Minnesota|
    |Mississippi|
    |Missouri|
    |Montana|
    |Nebraska|
    |Nevada|
  |New Hampshire|
    |New Jersey|
    |New Mexico|
    |New York|
  |North Carolina|
  |North Dakota|
  |Ohio|
  |Oklahoma|
  |Pennsylvania|
  |Rhode Island|
  |South Carolina|
  |South Dakota|
  |Tennessee|
  |Texas|
  |Utah|
  |Vermont|
  |Virginia|
  |Washington|
  |West Virginia|
    |Wisconsin|
  |Wyoming|



    #  Generate Infant Mortality-Minority Health fact sheet for all states "
   Scenario: Generate Infant Mortality-Minority Health fact sheet for all states
    Then For <state> and type "Minority Health" the generated Infant Mortality data as defined in "infant_mortality.csv" file
      |state|
      |Arizona|
      |Alabama|
      |Alaska|
      |Arkansas|
      |California|
      |Colorado|
      |Connecticut|
      |Delaware|
      |District of Columbia|
      |Florida|
      |Georgia|
      |Hawaii|
      |Idaho|
      |Illinois|
      |Indiana|
      |Iowa|
      |Kansas|
      |Kentucky|
      |Louisiana|
      |Maryland|
      |Maine|
      |Massachusetts|
      |Michigan|
      |Minnesota|
      |Mississippi|
      |Missouri|
      |Montana|
      |Nebraska|
      |Nevada|
      |New Hampshire|
      |New Jersey|
      |New Mexico|
      |New York|
      |North Carolina|
      |North Dakota|
      |Ohio|
      |Oklahoma|
      |Pennsylvania|
      |Rhode Island|
      |South Carolina|
      |South Dakota|
      |Tennessee|
      |Texas|
      |Utah|
      |Vermont|
      |Virginia|
      |Washington|
      |West Virginia|
      |Wisconsin|
      |Wyoming|









