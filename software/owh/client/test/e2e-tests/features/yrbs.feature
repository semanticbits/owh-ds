Feature: As a User
  I want the sidebar layout in YRBS to be similar to Mortality
  So that there is consistency in the design
  I want to see the YRBS question categories in the given order
  So that I can see the most important question categories first

  Scenario: Access YRBS page from home page
    Given I am on search page
    When I select YRBS as primary filter
    Then I should get search page with default filter type "Youth Risk Behavior"

  Scenario: Accesss YRBS from search page
    Given I am on search page
    #Given user select YRBS as primary filter
    When I select YRBS as primary filter
    Then the default filter pre-selected should be Race
    And side menu slides back into view

  Scenario: Result table shows both Yes and No Responses
    #Then I should see "Response" column in the result table
    And I should see YES and NO responses for question

  Scenario: Hide Sidebar
    When I see hide filter button in yrbs page
    And I click hide filter button in yrbs page
    Then side menu slides away
    Then I see button to show filters
    And then table and visualizations adjust to that they use up the entire available screen space
    And the background highlight is in lighter purple (button color)

  Scenario: Un collapse sidebar
    When I click show filters button
    Then side menu slides back into view
    And the entire table and visualizations adjust to the reduced screen space
    And there is button to hide filter

Scenario: show chart for each question
   Given I am on search page
   When I select YRBS as primary filter
   Then each question should have chart icon displayed

  Scenario: sort order
    When I looks at the filter sub categories
    Then I should be able to select more than one. The radio buttons must be changed to checkboxes
    And filters should be in this order "Year, Sex, Race/Ethnicity, Grade, State, Question, Variance"

  Scenario: Category Collapsible
    When I click on the down arrow at the corner of each category bar
    Then this category must be collapsible

  Scenario: Show # More
    When I click on Show # More under the questions in any category
    Then the category should expand to show all the questions
    And 'Show # More' should be replaced with 'Show Less'

  Scenario: Show Less
    When I click on 'Show Less'
    Then the category to reset back to the original view of the two questions
    And 'Show Less' should be replaced with 'Show # More'

  Scenario: Category Title
    When I hover the mouse over a category name
    Then an option/link to 'Show only this Category' should be seen

  Scenario: Show only this Category button
    When I click on 'Show only this Category'
    Then the data table must show only that category

  Scenario: Show all Categories link is visible
    When I hover the mouse over a category name
    Then an option/link to 'Show all Categories' should be seen

  Scenario: Show all Categories works
    When I click on 'Show all Categories'
    Then the data table should show all categories

  Scenario: Race/Ethnicity label
    Then race filter should be labeled Race/Ethnicity
  Scenario: Data Alignment
    Then the data must be right justified in the table

  Scenario: Show all odd years from 1991-2015
   When Click on show more on year filter
   Then year filter should list all odd years 1991-2015

  Scenario: Group by year
    When Group by year is selected
    Then results should be grouped by year

  Scenario: YRBS question categories in the given order
    When I select "Select Questions" button
   # Then I see question categories in this order "Unintentional Injuries and Violence", "Tobacco Use", "Alcohol and Other Drug Use", "Sexual Behaviors", "Obesity, Overweight, and Weight Control", "Dietary Behaviors", "Physical Activity", "Other Health Topics"
    Then I see question categories in this order "Alcohol and Other Drug Use", "Dietary Behaviors", "Obesity, Overweight, and Weight Control", "Other Health Topics", "Physical Activity", "Sexual Behaviors", "Tobacco Use", "Unintentional Injuries and Violence"
    And by default no questions should be selected
    And it should also have a Search Questions - search bar above the list

Scenario: Filter by year
  When Years "2015", "2013" are selected
  Then results shows only 2015 and 2013 data

Scenario: Filter by ethnicity
  When ethniciy "White", "Asian" are selected
  Then results shows only data for the selected ethnicities

  Scenario: Search Questions
    When I begin to type a word in the search bar
    Then the list below that should be updated dynamically

  Scenario: Selected Survey Question(s)
    When I have selected a question
    Then another heading - "Selected Question(s)" must appear on the top of the 'Search Questions' search bar
    And then the selected question must be listed under the Selected Question(s)

  Scenario: Delete x
    When I see the selected questions under the Selected Question(s) list
    Then I should also be able to see a x button to the end of the question
    And I click on this button then that particular question is deleted from the list (deselected)

  Scenario: Data Table
    When I have selected a question
    Then I click on Filter Selected Questions button
    Then the data table should update based on the selection

  Scenario: Clear
    When I see the selected questions under the Selected Question(s) list in side filter
    Then I should also see a "Clear" button at the end of the selected questions list
    And I click on this button, then all the selected questions are deleted from the list (deselected)

  Scenario: Edit Selection and Clear buttons
    When I click on "Select Questions" button
    And I select a few questions and clicks on the Add Selected Question(s) button
    Then the "Select Questions" button should be renamed to "Update Questions"

  Scenario: Check/un-check questions
    Given I am on search page
    When I select YRBS as primary filter
    And  I click on "Select Questions" button
    When I expand one of the nodes
    Then I see checkboxes for the questions in a tree
    When I check a non-leaf node
    Then I see all leaf node being selected
    When I un-check one of the leaf nodes
    Then I see the node is un-checked
    And  I see it's parent node is also un-checked

  Scenario: Browser back button
    Given I am on search page
    When I select YRBS as primary filter
    Then I should get search page with default filter type "Youth Risk Behavior"
    When I expand "Race/Ethnicity" filter section
    And  filter "Race/Ethnicity" and option "Asian" selected
    When I click on "Select Questions" button
    And I select a few questions and clicks on the Add Selected Question(s) button
    Then the "Select Questions" button should be renamed to "Update Questions"
    When I select the back button in browser
    Then I should get search page with default filter type "Youth Risk Behavior"
   # And the results page (yrbs data table) should be refreshed to reflect "Race/Ethnicity" filter with option "All"
    Then the "Update Questions" button should be renamed to "Select Questions"
    And Questions selected value should be "All"

  Scenario: Browser forward button
    When I select the forward button in browser
    Then I should get search page with default filter type "Youth Risk Behavior"
    #And the results page (yrbs data table) should be refreshed to reflect "Race/Ethnicity" filter with option "Asian"
    Then the "Select Questions" button should be renamed to "Update Questions"
    And Questions selected value should be "Alcohol and Other Drug Use"

  Scenario: YRBS Advanced Search
    When I see a link "Switch to Advanced Search" at the top of the sidebar
    And I click on the "Switch to Advanced Search" link
    Then the sidebar switches to an Advanced Search mode
    And the link above the sidebar changes to "Switch to Basic Search"
    And the link "Switch to Advanced Search" should be disappear

  Scenario: Basic Search link
    When I see a link "Switch to Basic Search" at the top of the sidebar
    And I click on the "Switch to Basic Search" link
    Then the sidebar switches to an Basic Search mode
    And the link above the sidebar changes to "Switch to Advanced Search"
    And the link "Switch to Basic Search" should be disappear

  Scenario: Bookmark Advanced and Basic search
    Given I am on search page
    When I select YRBS as primary filter
    Then I should get search page with default filter type "Youth Risk Behavior"
    When I see a link "Switch to Advanced Search" at the top of the sidebar
    And I expand "Race/Ethnicity" filter section
    And  filter "Race/Ethnicity" and option "Asian" selected
    And the link should be "Switch to Advanced Search" displayed
    And filter "Asian" under "Race/Ethnicity" should be a "radio"
    When I click on the "Switch to Advanced Search" link
    And I click on "Select Questions" button
    And I select a few questions and clicks on the Add Selected Question(s) button
    Then the "Select Questions" button should be renamed to "Update Questions"
    And I see a link "Switch to Basic Search" at the top of the sidebar
    When I select the back button in browser
    And the link should be "Switch to Advanced Search" displayed
    And filter "Asian" under "Race/Ethnicity" should be a "radio"
    When I select the forward button in browser
    And the link should be "Switch to Basic Search" displayed
    And filter "Asian" under "Race/Ethnicity" should be a "checkbox"
    And "Run Query" button should be displayed

  Scenario: Select only 'State' filter as column
    Given I am on search page
    When I select YRBS as primary filter
    Then I should get search page with default filter type "Youth Risk Behavior"
    When I click on "Select Questions" button
    And I select a few questions and clicks on the Add Selected Question(s) button
    When I set "Race" filter "Off"
    Then I set "State" filter "Column"
    Then I should see records for states

  Scenario: Sexual Identity and Sex of Sexual contact filter for only 2015 year
    Given I am on yrbs advanced search page
    When I select "Year" value "2013"
    Then I see Sexual identity and Sexual contact filter disabled

  #YRBS service returning 'Internal Server Error' for feq questions and state combinations
  # Once we fix this issue then enable below scenario.
  #Scenario Outline: Search By Sexual Identity and Sex of Sexual contact
  #  Given I am on yrbs advanced search page
  #  When I expand <filter> section
  #  And user clicks on "+ 1 more" more link for <filter> filter
  #  Then I see <filterOptions>
  #  When I select <filterOption>
  #  And I click on run query button
    #Then I see results being displayed in data table for <filter>

    #Examples:
    #  | filter                  | filterOptions                                                     | filterOption      |
    #  |  Sexual Identity        |  Heterosexual (straight), Gay or Lesbian, Bisexual, Not Sure      | Bisexual          |
    #  |  Sexual Contact         |  Opposite Sex Only, Same Sex Only, Both Sexes, No Sexual Contact  | Opposite Sex Only |


  Scenario: Show/Hide Confidence Intervals for variance filter - YRBS Basic Search
    Given I am on search page
    When I select YRBS as primary filter
    Then I should get search page with default filter type "Youth Risk Behavior"
    When I click on Confidence Intervals option's "Show" button
    Then "Show" button for Confidence Intervals should be remain selected
    And I see Confidence Intervals value in data table
    And I set "Sex" filter "Column"
    Then "Show" button for Confidence Intervals should be remain selected
    And Confidence Intervals value in data table should be updated

  Scenario: Show/Hide Unweighted Frequency for variance filter  - YRBS Basic Search
    When I click on Unweighted Frequency option's "Show" button
    Then "Show" button for Unweighted Frequency should be remain selected
    And I see Unweighted Frequency value in data table
    And I set "Sex" filter "Off"
    Then "Show" button for Unweighted Frequency should be remain selected
    And  Unweighted Frequency value in data table should be updated

  Scenario: Show/Hide Confidence Intervals and Unweighted Frequency for variance filter - YRBS Advanced Search
    When I click on the "Switch to Advanced Search" link
    When I click on "Select Questions" button
    And I select a few questions and clicks on the Add Selected Question(s) button
    Then "Show" button for Confidence Intervals should be remain selected
    And "Show" button for Unweighted Frequency should be remain selected
    And I see both Confidence Intervals and Unweighted Frequency values in data table
    When I set "Sex of Sexual Contacts" filter "Column"
    And I expand "Sexual Identity" filter section
    And  filter "Sexual Identity" and option "Heterosexual (straight)" selected
    And I click on run query button
    Then results in yrbs data table should be suppressed

