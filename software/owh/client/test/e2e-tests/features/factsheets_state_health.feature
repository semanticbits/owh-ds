@Factsheets
Feature: Fact sheet page
  As a user
  I should be able to access Fact sheet page

  Scenario: Access fact sheet page
    When I am at home page
    And I navigate to factsheets page
    Then I should get factsheets page

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





