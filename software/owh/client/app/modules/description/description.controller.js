(function(){
    angular
        .module('owh.description')
        .controller('DescriptionController', DescriptionController);

    DescriptionController.$inject = ['$scope', '$state', '$stateParams'];

    function DescriptionController($scope, $state, $stateParams) {
        var dc = this;
        dc.getDataSetDetails = getDataSetDetails;

        dc.datasetInfo = {
                natality: {
                    key:"natality",
                    title: 'Natality',
                    image: 'natality-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: 'Births, Babies, Birth Rates, Fertility Rates, Prenatal Care',
                    dataDescription:"This dataset has counts and rates of births occurring within the United States to U.S. residents and nonresidents. State and county are defined by the mother's place of residence recorded on the birth certificate. Data elements include demographics, and maternal risk factors. Population is Live Births in United States.",
                    suppression:"Vital statistics data are suppressed due to confidentiality constraints, in order to protect personal privacy. All sub-national data representing zero to nine (0-9) births are suppressed. Corresponding population denominator data are also suppressed when the figure represents fewer than ten persons.",
                    source: "The Natality data set is provided by the U.S. Department of Health and Human Services (US HHS), Centers for Disease Control and Prevention (CDC), National Center for Health Statistics (NCHS).",
                    filters: [
                        {name: "Births", description: "The birth counts in the data represent births that occurred in the 50 United States and the district of Columbia, for the legal place of residence of the decedent."},
                        {name: "Birth Rates", description: "Birth rates are calculated as the number of births divided by total population in the given year(s)."},
                        {name: "Fertility Rates", description: "Fertility rates are calculated as the number of births divided by the number of females age 15 - 44 years old in the given year(s)"},
                        {name: "Population", description: "The population estimates are bridged-race estimates based on Bureau of the Census estimates of total U.S., State, and county resident populations"},
                        {name: "Year", description: "This field indicates year of birth"},
                        {name: "Sex", description: "This field indicates the sex of the child as recorded on the birth certificate."},
                        {name: "Month", description: "This field indicates month of birth"},
                        {name: "Weekday", description: "This field indicates day of the week of birth."},
                        {name: "Gestational Age", description: "This indicates range of weeks that represents the duration of the pregnancy at the time of birth"},
                        {name: "Month Prenatal Care Began", description: "This field indicates the month in the pregnancy when prenatal care began"},
                        {name: "Birth Weight", description: "The Birth Weight field indicates weight ranges for the child at birth"},
                        {name: "Plurality or Multiple Birth", description: "The Plurality field indicates if more than one infant shared the gestation and birth"},
                        {name: "Live Birth Order", description: "This field indicates the mother's total number of live births, including this birth. Live birth order data are only included for data in the year 2003 and later(per 2003 revised birth certificate)"},
                        {name: "Birth Place", description: "This field indicates the place of birth. Birthplace data are only included for data in the year 2003 and later"},
                        {name: "Delivery Method", description: "This field indicates whether the baby was born by Cesarean section or vaginal birth. Method of delivery data are only included for data in the year 2003 and later"},
                        {name: "Medical Attendant", description: "This field indicates the attendant(MD,DO,CNM) at the time of birth. Birth attendant data are only included for data in the year 2003 and later"},
                        {name: "Ethnicity", description: "This field indicates the Hispanic ethnicity of the mother."},
                        {name: "Race", description: "This field indicates the race of the mother"},
                        {name: "Marital Status", description: "This field indicates the marital status of the mother as recorded on the birth certificate"},
                        {name: "Age of Mother", description: "This field indicates the age group of the mother at the time of birth"},
                        {name: "Education", description: "This field indicates a range for the number of years of education received by the mother at the time of birth"},
                        {name: "Anemia", description: "This field indicates whether anemia is reported as a maternal risk factor. These data are only available before year 2003 (per the 1989 U.S. Standard birth certificate)"},
                        {name: "Cardiac Disease", description: "This field indicates whether Cardiac (Heart) Disease is reported as a maternal risk factor. These data are only available before year 2003"},
                        {name: "Chronic Hypertension", description: "This field indicates whether Chronic Hypertension is reported as a maternal risk factor"},
                        {name: "Diabetics", description: "This field indicates whether Diabetes is reported as a maternal risk factor."},
                        {name: "Eclampsia", description: "This field indicates whether Eclampsia is reported as a maternal risk factor"},
                        {name: "Hydramnios / Oligohydramnios", description: "This field indicates whether Hydramnios/Oligohydramnios is reported as a maternal risk factor. These data are only available before year 2003 (per the 1989 U.S. Standard birth certificate)"},
                        {name: "Incompetent Cervix", description: "This field indicates whether Incompetent Cervix is reported as a maternal risk factor. These data are only available before year 2003"},
                        {name: "Lung Disease", description: "This field indicates whether Lung disease (acute or chronic) is reported as a maternal risk factor. These data are only available before year 2003"},
                        {name: "Pregnancy Associated Hypertension", description: "This field indicates whether Pregnancy-associated Hypertension is reported as a maternal risk factor"},
                        {name: "Tobacco Use", description: "This field indicates whether tobacco use was reported during the pregnancy"},
                        {name: "State", description: "This field indicates mother's legal residence recorded on the birth certificate"},
                        {name: "Census Regions", description: "The United States is split into 4 Census Regions: Northeast, Midwest, South and West. Census Divisions are multi-state groups, sub-sets of Census Regions. You can group by Census Division, or select any combination of individual Census Divisions."},
                        {name: "HHS Regions", description: "The Department of Health and Human Services (HHS) groups the 50 states, the District of Columbia, and the U.S. territories into ten reporting regions, referred to as the HHS regions. Any number of locations can be specified here."}
                    ]
                },
                deaths: {
                    key:"deaths",
                    title: 'Detailed Mortality',
                    image: 'mortality-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: 'Multiple Causes of Death, Cancer, Diabetes, Deaths, Sexually Transmitted Diseases, Tuberculosis, Alcohol and Other Drug Use, Obesity, Overweight, Weight Control, Tobacco Use, HIV/AIDS, Prostate Cancer, Population Data',
                    dataDescription: 'The mortality data are based on death certificates for U.S. residents. Each death certificate identifies a single underlying cause of death and demographic data. The number of deaths, crude death rates or age-adjusted death rates, and 95% confidence intervals and standard errors for death rates can be obtained by place of residence (total U.S., region, and state), age group (single-year-of age, 5-year age groups, 10-year age groups), race (4 groups), Hispanic ethnicity, gender, year, cause-of-death (4-digit ICD-10 code or group of codes), injury intent and injury mechanism, drug/alcohol induced causes. Data are also available for place of death, month and week day of death, and whether an autopsy was performed.',
                    suppression: 'Vital statistics data are suppressed due to confidentiality constraints, in order to protect personal privacy. As of May 23, 2011, all sub-national data representing zero to nine (0-9) deaths or births are suppressed. Corresponding sub-national denominator population figures are also suppressed when the population represents fewer than ten persons.',
                    source: 'The Detailed Mortality data are compiled from data provided by the 57 vital statistics jurisdictions through the Vital Statistics Cooperative; the data set is produced by the U.S. Department of Health and Human Services (US HHS), Centers for Disease Control and Prevention (CDC), National Center for Health Statistics (NCHS), Division of Vital Statistics (DVS), Mortality Statistics Branch.',
                    filters: [
                        {name: "Deaths", description: "The death counts in the data represent deaths that occurred in the 50 United States and the district of Columbia, for the legal place of residence of the decedent."},
                        {name: "Crude Death Rates", description: "Crude Rates are expressed as the number of deaths reported each calendar year per the factor you select. The default factor is per 100,000 population, reporting the death rate per 100,000 persons."},
                        {name: "Age Adjusted Death Rates", description: "Age-adjusted death rates are weighted averages of the age-specific death rates, where the weights represent a fixed population by age."},
                        {name: "Population", description: "The population estimates are U.S. Census Bureau estimates of U.S. national, state, and county resident populations."},
                        {name: "Year", description: "This field indicates the year of occurrence of death."},
                        {name: "Sex", description: "This field indicates the sex of the deceased."},
                        {name: "Race", description: "This field indicates the race of the deceased"},
                        {name: "Ethnicity", description: "This field indicates the ethnicity of the deceased"},
                        {name: "Age", description: "This field contains values for age or age range"},
                        {name: "Autopsy", description: "This field indicates whether or not an autopsy was performed"},
                        {name: "Place of Death", description: "This field indicates the place of death"},
                        {name: "Weekday", description: "This field indicates the day of the week of occurrence of death"},
                        {name: "Month", description: "This field indicates the month of occurrence of death"},
                        {name: "UCD", description: "This field indicates the underlying cause of death from the death certificate.The disease or injury which initiated the train of morbid events leading directly to death, or the circumstances of the accident or violence which produced the fatal injury"},
                        {name: "MCD", description: "This field indicates the multiple causes of death from the death certificate. Multiple causes of death including not only the underlying cause but also immediate cause of death and all other intermediate and contributory conditions entered by the certifying physician"},
                        {name: "State", description: "This field indicates the person's place of legal residence at the time of death"},
                        {name: "Census Regions", description: "The United States is split into 4 Census Regions: Northeast, Midwest, South and West. Census Divisions are multi-state groups, sub-sets of Census Regions. You can group by Census Division, or select any combination of individual Census Divisions"},
                        {name: "HHS Regions", description: "The Department of Health and Human Services (HHS) groups the 50 states, the District of Columbia, and the U.S. territories into ten reporting regions, referred to as the HHS regions. Any number of locations can be specified here."}
                    ]
                },
                bridge_race: {
                    key:"bridge_race",
                    title: 'Bridged Race',
                    image: 'bridged-race-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: 'Demographics, Population Data',
                    dataDescription: "The estimates result from bridging the 31 race categories used in Census 2000, as specified in the 1997 Office of Management and Budget (OMB) standards for the collection of data on race and ethnicity, to the four race categories specified under the 1977 standards (Asian or Pacific Islander, Black or African American, American Indian or Alaska Native, White).",
                    source: "Data source is United States Department of Health and Human Services (HHS), Centers for Disease Control and Prevention (CDC), National Center for Health Statistics (NCHS), Bridged-Race Population Estimates, United States July 1st resident population by state, county, age, sex, bridged-race, and Hispanic origin." +
                    "<ul><li>2010 to 2015 (Vintage 2015) postcensal estimates of the July 1 resident population by year, county, single-year of age groups, bridged-race, sex, and Hispanic originreleased by NCHS on June 28, 2016.</li>" +
                    "<li>2000 to 2009 revised intercensal estimates of the July 1 resident population by year, county, single-year of age groups, bridged-race, sex, and Hispanic origin released by NCHS on October 26, 2012.</li>" +
                    "</ul>",
                    filters: [
                        {name: "Year", description: "This field indicates July 1st estimates for 2000 through last year of the series"},
                        {name: "Sex", description: "This field indicates the sex of the population"},
                        {name: "Age", description: "This field contains values for age or age range of the population"},
                        {name: "Race", description: "This field contains values for the four bridged-race categories: American Indian or Alaskan Native, Asian or Pacific Islander, Black or African American, White"},
                        {name: "Ethnicity", description: "This field indicates the Ethnicity of the population"},
                        {name: "State", description: "This field indicates the State of residence"},
                        {name: "Census Regions", description: "The United States is split into 4 Census Regions: Northeast, Midwest, South and West. Census Divisions are multi-state groups, sub-sets of Census Regions. You can group by Census Division, or select any combination of individual Census Divisions"}
                    ]
                },
                cancer: {
                    key:"cancer_incident",
                    title: 'Cancer',
                    image: 'disease-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: "Infants, Sexually Transmitted Diseases, Chlamydia, Gonorrhea, Primary and Secondary Syphilis, Early Latent Syphilis, Congenital Syphilis",
                    dataDescription: "Cancer mortality data are available for the United States, state by age group, race, ethnicity, gender and cancer site for the years 2000- 2015. ",
                    suppression: "For STD data, the data suppression rule is applied when the numerator for a given state is 3 or less. When suppressed, data are only displayed by state totals and breakdown by demographic characteristics is not permitted.",
                    source: "The United States Cancer Statistics (USCS) are the official federal statistics on cancer incidence from registries having high-quality data and cancer mortality statistics for 50 states and the District of Columbia. USCS are produced by the Centers for Disease Control and Prevention (CDC) and the National Cancer Institute (NCI), in collaboration with the North American Association of Central Cancer Registries (NAACCR). Data are provided by:" +
                    "ul><li>The Centers for Disease Control and Prevention National Program of Cancer Registries (NPCR)</li>" +
                    "<li>The National Cancer Institute Surveillance, Epidemiology and End Results (SEER) program.</li>" +
                    "</ul>",
                    filters: [
                        {name: "Year", description: "This field indicates the year of diagnosis or death"},
                        {name: "Sex", description: "This field indicates the sex of the patient"},
                        {name: "Race", description: "This field indicates the race of the patient"},
                        {name: "Ethnicity", description: "This field indicates the ethnicity of the patient"},
                        {name: "Age group", description: "This field indicates the age group of the patient"},
                        {name: "Cancer sites", description: "This field indicates the primary cancer site that is the organ of origin within the body where a given cancer occurs in an individual"},
                        {name: "Childhood Cancers", description: "This field indicates the childhood cancer that are usually studied in children who are less than age 20"},
                        {name: "State", description: "This field indicates the State of patient's residence at the time the case was submitted to the registry"}
                    ]
                },
                std: {
                    key:"std",
                    title: 'Sexually Transmitted Diseases/Infections',
                    image: 'std-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: "Infants, Sexually Transmitted Diseases, Chlamydia, Gonorrhea, Primary and Secondary Syphilis, Early Latent Syphilis, Congenital Syphilis",
                    dataDescription: "STD morbidity data presented in this report are compiled from a combination of data reported on standardized hard copy reporting forms and electronic data received through the National Electronic Tele­communications System for Surveillance (NETSS) for diagnosis years 2000 through 2015.",
                    suppression: "For STD data, the data suppression rule is applied when the numerator for a given state is 3 or less. When suppressed, data are only displayed by state totals and breakdown by demographic characteristics is not permitted.",
                    source: "The CDC collects, analyzes, and disseminates surveillance data on STD diagnoses. The NCHHSTP AtlasPlus presents chlamydia, gonorrhea, congenital syphilis, and primary and secondary syphilis case report data submitted from all 50 states, the District of Columbia for the years 2000 to 2015 and early latent syphilis case report data for 2003-2015. STD data are presented by disease, year of diagnosis, reporting area (state or territory), age group, race/ethnicity, and sex.",
                    filters: [
                        {name: "Cases", description: "Cases of a given STD refer to confirmed diagnoses during a given time period"},
                        {name: "Rates", description: "Each rate was calculated by dividing the number of cases for the calendar year by the population for that calendar year and then multiplying the number by 100,000."},
                        {name: "Population", description: "The population denominators used to compute these rates for the 50 states and the District of Columbia were based on the U.S. Census Bureau population estimates utilizing the OMB compliant race categories."},
                        {name: "Disease", description: "This field indicates the type of sexually transmitted disease"},
                        {name: "Location(State)", description: "This field indicates the State where the STD surveillance data are collected"},
                        {name: "Year", description: "This field indicates year of diagnosis or death"},
                        {name: "Sex", description: "This field indicates the current sex of the patient"},
                        {name: "Race/Ethnicity", description: "This field indicates the Race/Ethnicity of the patient"},
                        {name: "Age Group", description: "This field indicates the age group of the patient"}
                    ]
                },
                tb: {
                    key:"tb",
                    title: 'Tuberculosis',
                    image: 'tuberculosis-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: "Tuberculosis",
                    dataDescription: "TB data are presented by year of disease confirmation, reporting area (state/territory or county), age group, race/ethnicity, sex, and whether or not the patient was born in the United States. The most common site of infection is the lung, but other organs may be involved. Nationally notifiable TB surveillance data are collected and compiled from reports sent to CDC’s Division of TB Elimination by the TB control programs and health departments in all 50 states, the District of Columbia, U.S. dependencies and possessions, and independent nations in free association with the United States.",
                    suppression: "Data are not suppressed at the state level; TB data can be viewed in aggregate format or one-way stratifications (i.e., by age group, sex, race/ethnicity, or country of birth [U.S.-born or foreign-born]).",
                    source: "The CDC collects, analyzes, and disseminates surveillance data on newly reported cases of tuberculosis (TB) disease in the United States. The Atlas presents TB case report data submitted from all 50 states, the District of Columbia for the years 2000 to 2015.",
                    filters: [
                        {name: "Cases", description: "A case of TB is described as a chronic bacterial infection caused by Mycobacterium tuberculosis, usually characterized pathologically by the formation of granulomas"},
                        {name: "Rates", description: "Rates are expressed as the number of cases reported each calendar year per 100,000 populations."},
                        {name: "Population", description: "Population denominators used in calculating TB rates were based on the US Census population estimates for 2000–2015."},
                        {name: "Location(State)", description: "This field indicates the State where the TB surveillance data are collected"},
                        {name: "Year", description: "This field indicates year of diagnosis or death"},
                        {name: "Sex", description: "This field indicates the sex of the patient at birth"},
                        {name: "Race/Ethnicity", description: "This field indicates the Race/Ethnicity of the patient"},
                        {name: "Age Group", description: "This field indicates the age group of the patient"},
                        {name: "Country of Birth", description: "This field indicates the country of birth of the patient"}
                    ]
                },
                aids: {
                    key:"aids",
                    title: 'HIV/AIDS',
                    image: 'aids-hiv-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: "Deaths, Babies, HIV/AIDS, AIDS Diagnoses, AIDS Deaths, AIDS Prevalence, HIV Diagnoses, HIV Deaths, HIV Prevalence",
                    dataDescription: "These data are the nation’s source of information on HIV in the United States. Numbers and rates and presented based on the date of diagnosis of HIV infection and infection classified as stage 3 (AIDS) (from the beginning of the epidemic through December 31, 2015; reported as of June 30, 2016).<br/>Data on diagnoses of HIV infection should be interpreted with caution. Data may not be representative of all persons with HIV because not all infected persons have been tested. Also, many states offer anonymous testing; the results of anonymous tests are not reported to the confidential name-based HIV registries of state and local health departments.",
                    suppression: "A data suppression rule is applied if:" +
                    "<ol>" +
                    "<li>The population denominator for 1-way and 2-way demographic/transmission category data is less than 100.</li>" +
                    "<li>Two variables are already selected from section X, then no further stratifications are allowed.</li>" +
                    "<li>Two-way demographic/risk stratifications for U.S. dependent areas (except Puerto Rico, for age and sex) are queried.</li>" +
                    "<li>Two-way demographic/risk stratifications for the race groups Native Hawaiians/Other Pacific Islanders (NHOPIs) and Multiple races are queried.</li>" +
                    "<li>Two-way demographic/transmission category stratifications for New Hampshire are queried.</li>" +
                    "</ol>Also, data are suppressed or aggregated to preclude arithmetic calculation of a suppressed cell.",
                    source: "CDC collects, analyzes, and disseminates surveillance data on diagnoses of HIV infection; these data are the nation’s source of information on HIV in the United States. Numbers and rates and presented based on the date of diagnosis of HIV infection and infection classified as stage 3 (AIDS) (from the beginning of the epidemic through December 31, 2015; reported as of June 30, 2016).",
                    filters: [
                        {name: "Deaths", description: "Persons reported to the national HIV surveillance system are assumed alive unless their deaths have been reported to CDC by state/local HIV surveillance programs."},
                        {name: "Prevalence", description: "(Persons Living with Diagnosed HIV Infection or infection classified as stage 3 (AIDS)): The data reflect persons living with diagnosed HIV infection at the end of each year during 2008–2014, or persons living with infection ever classified as stage 3 (AIDS) at the end of each year during 2000–2014"},
                        {name: "Diagnoses", description: "Diagnoses of HIV infection or infection classified as stage 3 (AIDS) refer to confirmed diagnoses during a given time period."},
                        {name: "Rates", description: "Each rate was calculated by dividing the total number of diagnoses (or deaths or prevalence) for the calendar year by the population for that calendar year and then multiplying the result by 100,000"},
                        {name: "Population", description: "The population denominators used to compute the rates for the 50 states, the District of Columbia were based on the Vintage 2009 postcensal estimates file (for the years 2000 to 2009) and the Vintage 2015 file (for years 2010 to 2015) from the U.S. Census Bureau."},
                        {name: "Indicator", description: "This field indicates diagnosis, prevalence of deaths of AIDS/HIV"},
                        {name: "Location(State)", description: "This field indicates the State where the AIDS/HIV surveillance data are collected"},
                        {name: "Year", description: "This field indicates year of diagnosis or death. For persons living with diagnosed HIV, year refers to the end of the queried calendar year"},
                        {name: "Sex", description: "This field indicates the sex of the patient at birth"},
                        {name: "Race/Ethnicity", description: "This field indicates the Race/Ethnicity of the patient"},
                        {name: "Age Group", description: "This field indicates the age group of the patient. HIV surveillance data include adults and adolescents only (persons aged 13 years and older)"},
                        {name: "Transmission Category", description: "This field indicates the classification of cases that summarizes a person’s possible HIV risk factor"}
                    ]
                },
                infant_mortality: {
                    key:"infant_mortality",
                    title: 'Infant Mortality',
                    image: 'infant-mortality-icon.svg',
                    yrsAvail: '2000-2014',
                    topics: "Underlying Cause of Death, Cancer, Diabetes, Deaths, Tuberculosis, Obesity, Overweight and Weight Control, Tobacco Use, Unintentional Injury and Violence, Births, Infant Deaths, HIV/AIDS, Delivery, Infant Health, Prenatal Care",
                    dataDescription: "This data collection provides counts and rates for deaths of children under 1 year of age, occurring within the United States to U.S. residents. Data are available by state of mother's residence, child's age, underlying cause of death, gender, birth weight, birth plurality, birth order, gestational age at birth, period of prenatal care, maternal race and ethnicity, maternal age, maternal education and marital status.",
                    suppression: "Vital statistics data are suppressed due to confidentiality constraints, in order to protect personal privacy." +
                    "<ul>" +
                    "<li>The term <i>Suppressed</i> replaces sub-national death counts, births counts and death rates, when the figure represents zero to nine (0-9) persons.</li>" +
                    "<li>Totals and sub-totals are suppressed when the value falls within scope of the suppression criteria, or when the summary value includes a single suppressed figure, in order to prevent the inadvertent disclosure of suppressed values.</li>" +
                    "<li>About <i>Unreliable</i> rates representing fewer than 20 deaths: Rates are flagged as Unreliable when there are fewer than 20 deaths in the numerator, because the figure does not meet the NCHS standard of reliability or precision.</li>" +
                    "</ul>",
                    source: "The Linked Birth/Infant Death Records data are compiled from data provided by the 57 vital statistics jurisdictions through the Vital Statistics Cooperative; the data are produced by the U.S. Department of Health and Human Services (US HHS), Centers for Disease Control and Prevention (CDC), National Center for Health Statistics (NCHS).",
                    filters: [
                        {name: "Deaths", description: "This represents the counts of deaths of children under 1 year of age, occurring within the United States to U.S. residents"},
                        {name: "Births", description: "This represents live births and infant (age under 365 days) deaths to maternal residents of the United States"},
                        {name: "Infant Death Rates", description: "This represents the rates for deaths of children under 1 year of age, occurring within the United States to U.S. residents"},
                        {name: "Year", description: "This field indicates year of death"},
                        {name: "Sex", description: "This field indicates the sex of the child as recorded on the birth certificate"},
                        {name: "Age of Infant Death", description: "This field indicates the age of infant at death"},
                        {name: "Gestational Age Group 1", description: "This indicates range of weeks that represents the duration of the pregnancy at the time of birth in 10 age groups: Under 20 weeks; 20-27 weeks; 28-31 weeks; 32-35 weeks; 36 weeks; 37-39 weeks; 40 weeks; 41 weeks; 42 weeks or more; Unknown."},
                        {name: "Gestational Age Group 2", description: "This indicates range of weeks that represents the duration of the pregnancy at the time of birth in 11 age groups: Under 20 weeks; 20-27 weeks; 28-31 weeks; 32-33 weeks; 34-36 weeks; 37-38 weeks; 39 weeks, 40 weeks; 41 weeks; 42 or more weeks; Unknown."},
                        {name: "Gestational Age Weekly", description: "This indicates range of weeks that represents the duration of the pregnancy at the time of birth in weekly age groups: 17 weeks through 47 weeks; Unknown"},
                        {name: "Month Prenatal Care Began", description: "This field indicates the month in the pregnancy when prenatal care began"},
                        {name: "Birth Weight", description: "The Birth Weight field indicates weight ranges for the child at birth"},
                        {name: "Plurality or Multiple Birth", description: "The Plurality field indicates if more than one infant shared the gestation and birth"},
                        {name: "Live Birth Order", description: "Plurality or Multiple BirthThis field indicates the mother's total number of live births, including this birth"},
                        {name: "Birth place", description: "This field indicates the place of birth"},
                        {name: "Medical Attendant", description: "This field indicates the attendant(MD,DO,CNM) at the time of birth"},
                        {name: "UCD", description: "This field represents the underlying cause of death from the death certificate"},
                        {name: "Ethnicity", description: "This field indicates the Hispanic ethnicity of the mother"},
                        {name: "Race", description: "This field indicates the race of the mother"},
                        {name: "Marital Status", description: "This field indicates the marital status of the mother as recorded on the birth certificate"},
                        {name: "Age of Mother", description: "This field indicates the age group of the mother at the time of birth"},
                        {name: "Education", description: "This field indicates a range for the number of years of education received by the mother at the time of birth"},
                        {name: "State", description: "This field indicates mother's legal residence at the time of birth"},
                        {name: "Census Regions", description: "This field indicates the mother’s place of legal residence at the time of death. The United States is split into 4 Census Regions: Northeast, Midwest, South and West. Census Divisions are multi-state groups, sub-sets of Census Regions. You can group by Census Division, or select any combination of individual Census Divisions"},
                        {name: "HHS Regions", description: "This field indicates the mother’s place of legal residence at the time of death. The Department of Health and Human Services (HHS) groups the 50 states, the District of Columbia, and the U.S. territories into ten reporting regions, referred to as the HHS regions. Any number of locations can be specified here."}
                    ]
                },
                 mental_health: {
                    key:"mental_health",
                    title: 'Youth Risk Behavior Surveillance System (YRBSS)',
                    image: 'yrbss-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: "Diabetes, Alcohol and Other Drug Use, Obesity, Overweight and Weight Control, Dietary Behaviors, Physical Activity, Sexual Behavior, Tobacco Use, Unintentional Injury and Violence, Health and Nutrition, Youth Risk",
                    dataDescription: "The YRBS includes national, state, territorial, tribal government, and local school-based surveys of representative samples of 9th through 12th grade students. These surveys are conducted every two years, usually during the spring semester. The national survey, conducted by CDC, provides data representative of 9th through 12th grade students in public and private schools in the United States. The state, territorial, tribal government, and local surveys, conducted by departments of health and education, provide data representative of mostly public high school students in each jurisdiction.",
                    suppression: "Data suppressions must be applied: When the unweighted frequency <100, then corresponding percentage response must be suppressed.",
                    source: "Data source is US Department of Health and Human Services (HHS), Centers for Disease Control and Prevention (CDC), National Center for Chronic Disease Prevention and Health Promotion (NCCDPHP), Adolescent and School Health (ASH).",
                    filters: [
                        {name: "Year", description: "This field indicates year of the Youth Risk Behavior Survey (YRBS)"},
                        {name: "Sex", description: "This field indicates the sex of the students who participated in the YRBS National Survey"},
                        {name: "Race/Ethnicity", description: "This field indicates the Race/Ethnicity of the students who participated in the YRBS National Survey"},
                        {name: "Grade", description: "This field indicates the grade of the students of the participating schools in the national survey"},
                        {name: "Sexual Orientation", description: "Youth may identify as heterosexual, gay, lesbian, or bisexual in this survey"},
                        {name: "State", description: "This field indicates the State that participated in the YRBS National Survey"},
                        {name: "Question", description: "This field indicates the questions which were asked in the survey questionnaire. “Students” refers to those who participated in the YRBS National Survey."},
                        {name: "Unintentional Injuries and Violence", description: "These questions contain summaries of survey data on behaviors that lead to intentional or unintentional injuries, including drinking and driving, violent behavior, weapons carrying, and suicide."},
                        {name: "Tobacco Use", description: "These questions contain summaries of survey data on tobacco use, including cigarette smoking, cigar smoking, and the use of smokeless tobacco"},
                        {name: "Alcohol and Other Drug Use", description: "These questions contain summaries of survey data on the use of alcohol, marijuana, and other drugs, including cocaine (powder, crack, or freebase forms), methamphetamines, ecstasy, inhalants, steroid pills/shots, prescription drugs, heroin, and intravenous drugs"},
                        {name: "Sexual Behaviors", description: "These questions include summaries of survey data on behaviors that can lead to HIV and/or AIDS, other sexually transmitted diseases (STDs), and unintended pregnancies"},
                        {name: "Physical Activity", description: "These questions contain summaries of survey data related to physical activity/inactivity, including vigorous exercise, involvement in physical education and organized sports, watching TV, and playing video/computer games."},
                        {name: "Obesity, Overweight, and Weight Control", description: "These questions contain summaries of survey data on weight and obesity"},
                        {name: "Dietary Behaviors", description: "These questions contain summaries of survey data on dietary behaviors,nutrition, and fat intake"},
                        {name: "Other health topics", description: "These questions contain summaries of survey data related to a question on asthma"},
                    ]
                },
                prams: {
                    key:"prams",
                    title: 'Pregnancy Risk Assessment Monitoring System (PRAMS)',
                    image: 'prams-icon.svg',
                    yrsAvail: '2000-2014',
                    topics: " Alcohol and Other Drug Use, Tobacco Use, Births, Babies, Demographics, Delivery, Family, Planning, Flu, Infant Health, Maternal Behavior/Health, Prenatal Care, Insurance/Medicaid/Services, Health Care Access/ Coverage , Women's Health",
                    dataDescription: "Pregnancy Risk Assessment Monitoring System is a joint research project between the state departments of health and the Centers for Disease Control and Prevention, Division of Reproductive Health.PRAMS collects state-specific, population-based data on maternal attitudes and experiences before, during, and shortly after pregnancy. PRAMS surveillance currently covers about 83% of all U.S. births. These data can be used to identify groups of women and infants at high risk for health problems, to monitor changes in health status, and to measure progress towards goals in improving the health of mothers and infants. PRAMS data are used by researchers to investigate emerging issues in the field of reproductive health and by state and local governments to plan and review programs and policies aimed at reducing health problems among mothers and babies.",
                    suppression: "Data suppression must be applied if the unweighted sample size was < 30.",
                    source: "PRAMSTAT - Pregnancy Risk Assessment Monitoring System (PRAMS) Statistics is produced by the United States Department of Health and Human Services (HHS), Centers for Disease Control and Prevention (CDC), National Center for Chronic Disease Prevention and Health Promotion (NCCDPHP), Division of Reproductive Health (DRH).",
                    filters: [
                        {name: "Class", description: "This field indicates that the Category of Topics addressed in the PRAMS core questionnaire"},
                        {name: "Topic", description: "Topics addressed in the PRAMS core questionnaire include barriers to and content of prenatal care, obstetric history, maternal use of alcohol and cigarettes, physical abuse, contraception, economic status, maternal stress, and early infant development and health status"},
                        {name: "Year", description: "This field indicates the Year of the PRAMS survey"},
                        {name: "Location- State", description: "This field indicates the States for which PRAMS data is available"},
                        {name: "Question", description: "This field indicates the questions which were developed and tested and ultimately placed on the PRAMS questionnaire"},
                    ]
                }
        };
        $scope.redirectToMortalityPage = function() {
            $state.go('search');
        };

        function getDataSetDetails() {
            return dc.datasetInfo[$stateParams.dataSetKey]
        }
    }
}());