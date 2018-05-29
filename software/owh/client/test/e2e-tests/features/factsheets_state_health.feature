@Factsheets
Feature: Fact sheet page
  As a user
  I should be able to access Fact sheet page

  Scenario: Access fact sheet page
    When I am at home page
    And I navigate to factsheets page
    Then I should get factsheets page

# Racial Distribution - State Health
  Scenario: Generate State Health  FactSheet population for all states based upon Racial Distributions of Residents
    Then For select <state> and type "State Health" the generated population racial distributions data as defined in "population_racial_state.csv" file
      |state|
      |Alabama|
      |Arizona|
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

# Age Distribution of Residents - State Health
  Scenario: Generate State Health FactSheet population for all states based upon Age Distribution of Residents
    Then For select <state> and type "State Health" the generated Age Distribution  data as defined in "population_age_state.csv" file
      |state|
      |Alabama|
      |Arizona|
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

#   Mortality - State Health fact sheet
   Scenario: Generate State Health Mortality fact sheet for all states
    Then For select <state> and type "State Health" the generated Mortality fact sheet data as defined in "mortality_state_dataset.csv" file
      |state|
      |Alabama|
      |Arizona|
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

#   Infant Mortality -State Health fact sheet
   Scenario: Generate State Health Infant Mortality fact sheet for all states
    Then For select <state> and type "State Health" the generated Infant Mortality fact sheet data as defined in "infant_mortality_state.csv" file
      |state|
      |Alabama|
      |Arizona|
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


  # Generate pdf for all states
    Scenario: Generate state Health pdf for all states
       Then For select <state> and select type is "State Health" then generated fact sheet data as defined in "states.csv"
      |state|
      |Alabama|
      |Arizona|
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





