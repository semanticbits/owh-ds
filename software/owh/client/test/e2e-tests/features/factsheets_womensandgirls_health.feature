@Factsheets
Feature: Fact sheet page
  As a user
  I should be able to access Fact sheet page

  Scenario: Access fact sheet page
    When I am at home page
    And I navigate to factsheets page
    Then I should get factsheets page

# Population-Women's and Girl's Health
  Scenario: Generate Women's and Girl's FactSheet population for all states
    Then For  select <state> and select type is "Women's and Girls' Health" then generated population data as defined in "population_womens_dataset.csv" file
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

  # Mortality Data Set -Women's and Girl's Health
  Scenario: Generate Women's and Girl's FactSheet Mortality Dataset  for all states
    Then For  select <state> and select type is "Women's and Girls' Health" then generated Mortality data as defined in "mortality_womens_dataset.csv" file
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


   # Prenatal Care and Pregnancy Risk Health
  Scenario: Generate Women's and Girl's PRAMS fact sheet  for all states
    Then For  select <state> and select type is "Women's and Girls' Health" then generated PRAMS data as defined in "prams_womens_dataset.csv" file
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


  # Behavioral Risk Factors- Womens and Girls Health
  Scenario: Generate Women's and Girl's BRFS FactSheet for all states
    Then For  select <state> and select type is "Women's and Girls' Health" then generated Behavioral Risk Factors data as defined in "brfs_womens_dataset.csv" file
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

   # Teen Health- Womens and Girls Health
  Scenario: Generate Women's and Girl's Teen Health FactSheet for all states
    Then For  select <state> and select type is "Women's and Girls' Health" then generated Teen Health fact sheet data as defined in "teen_health_womens_dataset.csv" file
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

   # Sexually Transmitted Infections  - Womens and Girls Health
  Scenario: Generate Women's and Girl's STD FactSheet for all states
    Then For  select <state> and select type is "Women's and Girls' Health" then generated STD fact sheet data as defined in "std_womens_dataset.csv" file
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


   # HIV/AIDS Data set  - Womens and Girls Health
  Scenario: Generate Women's and Girl's HIV/AIDS FactSheet for all states
    Then For  select <state> and select type is "Women's and Girls' Health" then generated HIV/AIDS fact sheet data as defined in "hiv_aids_womens_dataset.csv" file
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

   # Cancer Statistics Data set  - Womens and Girls Health
  Scenario: Generate Women's and Girl's Cancer Statistics Fact Sheet for all states
    Then For  select <state> and select type is "Women's and Girls' Health" then generated Cancer Statistics fact sheet data as defined in "cancer_statistics_womens_dataset.csv" file
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
    Scenario: Generate Women's and Girl's pdf for all states
       Then For select <state> and select type is "Women's and Girls' Health" then generated fact sheet data as defined in "states.csv"
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





