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


  # Racial distributions of minority residents*
  Scenario: Generate Minority FactSheet population for all states based upon Racial Distributions of Residents
   Then For <state> and type "Minority Health" the generated population racial distributions data as defined in "population_total.csv" file
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

##Population - Age Distribution
  Scenario: Generate Minority FactSheet population for all states based upon Age Distributions of Residents
    Then For <state> and type "Minority Health" the generated population data as defined in "population_age.csv" file
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

  #Mortality Dataset
  Scenario: Generate Mortality - Minority Health fact sheet for all states
    Then For <state> and type "Minority Health" the generated Mortality data as defined in "mortalityDataset.csv" file
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


    #  Generate Infant Mortality-Minority Health fact sheet for all states
   Scenario: Generate Infant Mortality-Minority Health fact sheet for all states
    Then For <state> and type "Minority Health" the generated Infant Mortality data as defined in "infant_mortality.csv" file
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

   #  Generate Prenatal Care and Pregnancy Risk (PREGNANT WOMEN) - Minority Health fact sheet for all states
   Scenario: Generate Prenatal Care and Pregnancy Risk (Pregenent Women)-Minority Health fact sheet for all states
    Then For <state> and type "Minority Health" the generated Pregenent Women data as defined in "prams_dataset.csv" file
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

#   Generate Behavioral Risk Factors-Minority Health fact sheet for all states
  Scenario: Generate Behavioral Risk Factors - Minority Health fact sheet for all states
    Then For <state> and type "Minority Health" the generated Behavioral Risk data as defined in "behavioral_risk_factors_dataset.csv" file
      |state|
      |Alabama|
      |Alaska|
      |Arizona|
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

#Generate Teen Health-Minority Health fact sheet for all states
  Scenario: Generate Teen Health - Minority Health fact sheet for all states
    Then For <state> and type "Minority Health" the generated teen health data as defined in "teen_health_dataset.csv" file
      |state|
      |Alabama|
      |Alaska|
      |Arizona|
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

    #Births- Minority Health fact sheet
    Scenario: Generate Births - Minority Health fact sheet for all states
    Then For <state> and type "Minority Health" the generated Births data as defined in "births_dataset.csv" file
      |state|
      |Alabama|
      |Arizona|
      |Alaska|
      |Arkansas|
      |California|
      |Colorado|
      |Connecticut|
      |District of Columbia|
      |Florida|
      |Georgia|
      |Idaho|
      |Illinois|
      |Indiana|
      |Iowa|
      |Louisiana|
      |Maryland|
      |Massachusetts|
      |Michigan|
      |Minnesota|
      |Mississippi|
      |Missouri|
      |Montana|
      |Nebraska|
      |Nevada|
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
      |Virginia|
      |Washington|
      |West Virginia|
      |Wisconsin|
      |Delaware |
      | Hawaii|
      |Maine  |
      |New Hampshire|
      |Vermont |
      |Wyoming |
      |Kentucky |


  #Generate Tuberculosis-Minority Health fact sheet for all states
   Scenario: Generate Tuberculosis- Minority Health fact sheet for all states
    Then For <state> and type "Minority Health" the generated Tuberculosis data as defined in "tuberculosis_dataset.csv" file
      |state|
      |Alabama|
      |Alaska|
      |Arizona|
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


 #Sexually Transmitted Infections
 Scenario: Generate Sexually Transmitted Infections- Minority Health fact sheet for all states
    Then For <state> and type "Minority Health" the generated STD data as defined in "std_dataset.csv" file
      |state|
      |Alabama|
      |Alaska|
      |Arizona|
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


  # HIV/AIDS Data set
  Scenario: Generate HIV-AIDS  - Minority Health fact sheet for all states
    Then For <state> and type "Minority Health" the generated HIV-AIDS data as defined in "hiv_aids_dataset.csv" file
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

  Scenario: Generate Cancer Statistics - Minority Health fact sheet for all states
    Then For <state> and type "Minority Health" the generated Cancer Statistics data as defined in "cancer_statistics_dataset.csv" file
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

    #   Generate pdf for all states
  Scenario: Generate  Minority Health fact sheet pdf for all states
  Then I select <state> and fact sheet type "Minority Health" and generated data downloaded file defined in "states.csv"

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

