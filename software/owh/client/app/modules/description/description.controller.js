(function(){
    angular
        .module('owh.description')
        .controller('DescriptionController', DescriptionController);

    DescriptionController.$inject = ['$scope', '$state', '$stateParams', '$location'];

    function DescriptionController($scope, $state, $stateParams, $location) {
        var dc = this;
        dc.getDataSetDetails = getDataSetDetails;
        dc.scrollToElement = scrollToElement;

        dc.datasetInfo = {
                births: {
                    key:"natality",
                    title: 'Births',
                    image: 'natality-icon.svg',
                    yrsAvail: '2000-2017',
                    topics: 'Births, Babies, Birth Rates, Fertility Rates, Prenatal Care',
                    dataDescription:"This dataset has counts and rates of births occurring within the United States to U.S. residents and nonresidents. State is defined by the mother's place of residence recorded on the birth certificate. Data elements include demographics, and maternal risk factors. Population is Live Births in United States.",
                    suppression:"Vital statistics data are suppressed due to confidentiality constraints, in order to protect personal privacy. All sub-national data representing zero to nine (0-9) births are suppressed. Corresponding population denominator data are also suppressed when the figure represents fewer than ten persons.",
                    source: "The Births data set is provided by the U.S. Department of Health and Human Services (US HHS), Centers for Disease Control and Prevention (CDC), National Center for Health Statistics (NCHS).",
                    isRateCalculation: true,
                    filters: [
                        {name: "Births", description: "The birth counts in the data represent births that occurred in the 50 United States and the District of Columbia, for the legal place of residence of the decedent."},
                        {name: "Birth Rates", description: "Birth rates are calculated as the number of births divided by total population in the given year(s)."},
                        {name: "Fertility Rates", description: "Fertility rates are calculated as the number of births divided by the number of females age 15 - 44 years old in the given year(s)"},
                        {name: "Population", description: "The population estimates are bridged-race estimates based on Bureau of the Census estimates of total U.S., State resident populations"},
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
                    ],
                    additionalInfo:[
                        {
                            question:"What are the population sources?",
                            answer:"The current population sources for calculating birth and fertility rates come from these sources:" +
                            "<ul>" +
                            "<li>Rates for year 2017:  the July 1st, 2016 (Vintage 2017) postcensal bridged-race estimates of the resident population, released by NCHS on June 27, 2018.</li>" +
                            "<li>Rates for year 2016:  the July 1st, 2016 (Vintage 2016) postcensal bridged-race estimates of the resident population, released by NCHS on June 26, 2017.</li>" +
                            "<li>Rates for year 2015:  the July 1st, 2015 (Vintage 2015) postcensal bridged-race estimates of the resident population, released by NCHS on June 28, 2016.</li>" +
                            "<li>Rates for year 2014:  the July 1st, 2014 (Vintage 2014) postcensal bridged-race estimates of the resident population, released by NCHS on June 30, 2015.</li>" +
                            "<li>Rates for year 2013:  the July 1st, 2013 (Vintage 2013) postcensal bridged-race estimates of the resident population, released by NCHS on June 26, 2014.</li>" +
                            "<li>Rates for year 2012:  the July 1st, 2012 (Vintage 2012) postcensal bridged-race estimates of the resident population, released by NCHS on June 13, 2013.</li>" +
                            "<li>Rates for year 2011:  the July 1st, 2011 (Vintage 2011) postcensal bridged-race estimates of the resident population, released by NCHS on July 18, 2012.</li>" +
                            "<li>Rates for year 2010:  the April 1st, 2010 bridged-race Census counts for year 2010, released by NCHS on November 17, 2011.</li>" +
                            "<li>Rates for years 2003-2009:  the July 1st revised intercensal estimates of the resident population, released by NCHS on October 26, 2012</li>" +
                            "</ul>"
                        },
                        {
                            question:"What is the difference between the various Birth Weight filters?",
                            answer:"Infant's weight at birth is available in 3 sets of categories, through 8165 grams, or Not stated:" +
                            "<ul>" +
                            "<li>Birth Weight: 100 gram increments</li>" +
                            "<li>Birth Weight 12: 12 groups in 500 gram increments</li>" +
                            "<li>Birth Weight 14: 14 groups in 250 gram increments</li>" +
                            "</ul>"
                        },
                        {
                            isRateInfo:true,
                            question:"How are Birth Rates and Fertility Rates calculated?",
                            answer:"Birth rates are calculated as the number of births divided by total population in the given year(s). When the numerator is sub-set by mother's race, location, or year of birth, then the same sub-set for race, location and year applies to the denominator population. If the data are sub-set by any other variable, then birth rates and denominator data are not available.<br/>Notes:" +
                            "<ul>" +
                            "<li>Birth rates are available for the Births data beginning in year 2003.</li>" +
                            "<li>Birth rates are only available for the total population, or for mother's race, mother's place of residence and the year of birth. If data are grouped by any other variable, or limited for any other variable, then birth rates are not calculated.</li>" +
                            "</ul>" +
                            "Fertility rates are calculated as the number of births divided by the number of females age 15 - 44 years old in the given year(s). When the numerator is sub-set by mother's age, mother's race, location, or year of birth, then the same sub-set for age, race, location and year applies to the denominator population. If data are sub-set by any other variable, then fertility rates and denominator data are not available.<br/>Notes:" +
                            "<ul>" +
                            "<li>Fertility rates are available for the Births data since year 2003.</li>" +
                            "<li>Fertility rates are only available for the total population, or for mother's age, mother's race, mother's place of residence and the year of birth. If data are grouped by any other variable, or limited for any other variable, then fertility rates are not calculated. Comparable denominator data are not available for the other variables.</li>" +
                            "</ul>"
                        },
                        {
                            question:"What are the Assurance of Confidentiality constraints for the data?",
                            answer:"Data reports for years 1989 and later must meet the NCHS data use restrictions. Vital statistics data are suppressed due to confidentiality constraints, in order to protect personal privacy." +
                            "<ul>" +
                            "<li>The term <i>Suppressed</i> replaces sub-national births counts, birth rates and fertility rates, when the figure represents zero to nine (0-9) persons.	Corresponding population denominator data are also suppressed when the figure represents fewer than ten persons.</li>" +
                            "<li>Totals and sub-totals are suppressed when the value falls within scope of the suppression criteria, or when the summary value includes a single suppressed figure, in order to prevent the inadvertent disclosure of suppressed values.</li>" +
                            "<li>The confidentiality constraints are established by the original data providers. For more information, please contact the data providers.</li>" +
                            "<li>Births data for the United States are limited to births occurring within the United States to U.S. residents and nonresidents. Births to non-residents of the United State are excluded from all tabulations by place of residence. Births occurring to U.S. citizens outside the United States are not included.</li>" +
                            "<li>All Births data are reported in conformance to the reporting criteria of the mother's place of residence, rather than the actual criteria on the birth certificate issued by the reporting area of occurrence. For example, if a baby was born in Texas to a mother legally residing in California, then only those data items reported by California are included in the data set. The original Births 2004 public use dataset includes data fields from the birth certificate, with an associated reporting flag for each field to indicate whether the mother's place of residence reports this item.</li>" +
                            "</ul>"
                        },
                        {
                            question:"Why are some filters disabled for Birth Rates and Fertility Rate calculations?",
                            answer:"The Birth Rates data are available by Year, Race, State, Census Region, Census Division, HHS Region. The Fertility Rates data are available by Year, Race, Age of Mother, State, Census Region, Census Division, HHS Region. These data are not available for filters that show up as disabled.<br/><br/>",
                        }
                    ]
                },
                deaths: {
                    key:"deaths",
                    title: 'Detailed Mortality',
                    image: 'detailed-mortality-icon.svg',
                    yrsAvail: '2000-2017',
                    topics: 'Multiple Causes of Death, Cancer, Diabetes, Deaths, Sexually Transmitted Diseases, Tuberculosis, Alcohol and Other Drug Use, Obesity, Overweight, Weight Control, Tobacco Use, HIV/AIDS, Prostate Cancer, Population Data',
                    dataDescription: 'The mortality data are based on death certificates for U.S. residents. Each death certificate identifies a single underlying cause of death and demographic data. The number of deaths, crude death rates or age-adjusted death rates can be obtained by place of residence (total U.S., region, and state), 5-year age groups, race (4 groups), Hispanic ethnicity, gender, year, cause-of-death (4-digit ICD-10 code or group of codes), injury intent and injury mechanism, drug/alcohol induced causes. Data are also available for place of death, month and week day of death, and whether an autopsy was performed (2017 is the most recent year for which detailed mortality data are available).',
                    suppression: 'Vital statistics data are suppressed due to confidentiality constraints, in order to protect personal privacy. As of May 23, 2011, all sub-national data representing zero to nine (0-9) deaths or births are suppressed. Corresponding sub-national denominator population figures are also suppressed when the population represents fewer than ten persons.',
                    source: 'The Detailed Mortality data are compiled from data provided by the 57 vital statistics jurisdictions through the Vital Statistics Cooperative; the data set is produced by the U.S. Department of Health and Human Services (US HHS), Centers for Disease Control and Prevention (CDC), National Center for Health Statistics (NCHS), Division of Vital Statistics (DVS), Mortality Statistics Branch.',
                    isRateCalculation: true,
                    filters: [
                        {name: "Deaths", description: "The death counts in the data represent deaths that occurred in the 50 United States and the District of Columbia, for the legal place of residence of the decedent."},
                        {name: "Crude Death Rates", description: "Crude Rates are expressed as the number of deaths reported each calendar year per the factor you select. The default factor is per 100,000 population, reporting the death rate per 100,000 persons."},
                        {name: "Age Adjusted Death Rates", description: "Age-adjusted death rates are weighted averages of the age-specific death rates, where the weights represent a fixed population by age."},
                        {name: "Population", description: "The population estimates are U.S. Census Bureau estimates of U.S. national, state resident populations."},
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
                    ],
                    additionalInfo:[
                        {
                            question:"What are the population sources?",
                            answer:"<ul>" +
                            "<li>The year 2000 and year 2010 populations are April 1 modified census counts.</li>" +
                            "<li>The 2001 through 2009 population estimates are revised intercensal estimates of the July 1 resident population, based on the year 2000 and year 2010 census counts (released by NCHS on 10/26/2012).</li>" +
                            "<li>The archive population estimates for years 2001 - 2009 are postcensal estimates of the July 1 resident population.</li>" +
                            "<li>The 2011 - 2017 population estimates are postcensal estimates of the July 1 resident population.</li>" +
                            "</ul>" +
                            "Note that these estimates are based on bridged-race categories. The population estimates are by geographic unit (total United States, State), year, race (white, black, other races), sex, and age group. To permit the calculation of infant mortality rates, NCHS live-birth data are included on the file.<br/><br/>"
                        },
                        {
                            isRateInfo:true,
                            question:"How are Age Adjusted Rates calculated?",
                            answer:"<p>Age-adjusted death rates are weighted averages of the age-specific death rates, where the weights represent a fixed population by age. They are used to compare relative mortality risk among groups and over time. An age-adjusted rate represents the rate that would have existed had the age-specific rates of the particular year prevailed in a population whose age distribution was the same as that of the fixed population. Age-adjusted rates should be viewed as relative indexes rather than as direct or actual measures of mortality risk. The rates of almost all causes of death vary by age. Age adjustment is a technique for &quot;removing&quot; the effects of age from crude rates, so as to allow meaningful comparisons across populations with different underlying age structures. For example, comparing the crude rate of heart disease in Florida to that of California is misleading, because the relatively older population in Florida will lead to a higher crude death rate, even if the age-specific rates of heart disease in Florida and California are the same. For such a comparison, age-adjusted rates are preferable. Age-adjusted rates should be viewed as relative indexes rather than as direct or actual measures of mortality risk.</p>" +
                            "<p>The National Center for Health Statistics (NCHS) age-adjusted death rates using the direct method. That is, by applying age-specific death rates (Ri) to the U.S. standard population age distribution.</p>" +
                            "<p>R' = S i ( Psi / Ps ) Ri</p>where <b>Psi</b> is the standard population for age group <b>i</b> and <b>Ps</b> is the total U.S. standard population (all ages combined)." +
                            "<p>Age-adjusted death rates are powered by CDC WONDER.</p><br/>"
                        },
                        {
                            question:"How are Crude Rates calculated?",
                            answer:"Crude Rates are expressed as the number of deaths reported each calendar year per the factor you select. The default factor is per 100,000 population, reporting the death rate per 100,000 persons." +
                            "<p>Crude Rate = Count / Population * 100,000</p>"
                        },
                        {
                            question:"What are the suppression rules for Crude Death Rates?",
                            answer:"<ul>" +
                            "<li>Rates for small populations should be interpreted with caution.</li>" +
                            "<li>Rates are suppressed for sub-national data representing zero to nine (0-9) deaths. Corresponding sub-national denominator population figures are also suppressed when the population represents fewer than 10 persons.</li>" +
                            "<li>Rates are marked as <i>unreliable</i> when the death count is less than 20.</li>" +
                            "<li>Rates are marked as <i>not applicable</i> when the population denominator figure is unavailable, such as persons of not stated or unknown age or Hispanic origin.</li>" +
                            "</ul>"
                        },
                        {
                            question:"What are the suppression rules for Age Adjusted Death Rates?",
                            answer:"<ul>" +
                            "<li>Rates are suppressed for sub-national data representing zero to nine (0-9) deaths. Corresponding sub-national denominator population figures are also suppressed when the population represents fewer than 10 persons.</li>" +
                            "<li>Rates are marked as unreliable when the death count is less than 20.</li>" +
                            "<li>Rates are marked as not applicable when the denominator population figure is unavailable, such as not stated or unknown age or ethnicity.</li>" +
                            "<li>Deaths of persons with not stated or unknown age are not included in the calculation of age-adjusted rates.</li>" +
                            "</ul>"
                        },
                        {
                            question:"Why are some filters disabled for Crude Rates and Age Adjusted Rate calculations?",
                            answer:"The Crude Rates and Fertility Rates data are limited to certain items. These data are not available for filters that show up as disabled.<br/><br/>",
                        }
                    ]
                },
                bridge_race: {
                    key:"bridge_race",
                    title: 'Bridged Race',
                    image: 'bridged-race-icon.svg',
                    yrsAvail: '2000-2018',
                    topics: 'Demographics, Population Data',
                    dataDescription: "The estimates result from bridging the 31 race categories used in Census 2000, as specified in the 1997 Office of Management and Budget (OMB) standards for the collection of data on race and ethnicity, to the four race categories specified under the 1977 standards (Asian or Pacific Islander, Black or African American, American Indian or Alaska Native, White).",
                    source: "Data source is United States Department of Health and Human Services (HHS), Centers for Disease Control and Prevention (CDC), National Center for Health Statistics (NCHS), Bridged-Race Population Estimates, United States July 1st resident population by state, age, sex, bridged-race, and Hispanic origin." +
                    "<ul><li>2010 to 2018 (Vintage 2018) postcensal estimates of the July 1 resident population by five-year of age groups, bridged-race, sex, and Hispanic origin released by NCHS on June 25, 2019.</li>" +
                    "<li>2000 to 2009 revised intercensal estimates of the July 1 resident population by five-year of age groups, bridged-race, sex, and Hispanic origin released by NCHS on October 26, 2012.</li>" +
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
                cancer_incidence: {
                    key:"cancer_incidence",
                    title: 'Cancer Incidence',
                    image: 'cancer-incidence-icon.svg',
                    yrsAvail: '2000-2016',
                    topics: "Cancer, Babies, Prostate Cancer, Childhood Cancers",
                    dataDescription: "Cancer incidence data are collected from cancer registries, based on oncology reports from health care providers. Cancer incidence and death counts, rates, cancer classification, age, race, and gender. Charts and maps are also available. The data are updated annually.\n\nCancer incidence and mortality data are available for the United States, state by age group, race, ethnicity, gender and cancer site for the years 2000-2016 (2016 is the most recent year for which incidence data are available).",
                    suppression: "<ul>" +
                      "<li>Data are suppressed if the figures represent fewer than 16 cases for the specific category:" +
                        "<ul class='sub'>" +
                          "<li>Suppress if case count less than 16 or if the standard error of the rate is approximately 25% or more as large as the rate </li>" +
                          "<li>Suppress if case count in one of the stratified category is less than 16 (e.g. cancer type stratified by sex: if male case count is 19 and female is 7, suppress both male and female)</li>" +
                        "</ul>" +
                      "</li>" +
                      "<li>Suppress if population is less than 50,000 within race- and ethnic-specific categories.</li>" +
                      "<li>Data are suppressed at the state level for certain race and ethnicity groups:" +
                        "<ul class='sub'>" +
                          "<li>Hispanic ethnicity cannot be broken out for Delaware, Kentucky, and Massachusetts.</li>" +
                          "<li>American Indian or Alaskan Native data cannot be broken out for Delaware, Illinois, Kentucky, New Jersey, and New York.</li>" +
                          "<li>Asian or Pacific Islander data cannot be broken out for Delaware, Illinois, and Kentucky.</li>" +
                          "<li>For 2013 & 2014, Arkansas Hispanic and API must be suppressed</li>" +
                        "</ul>" +
                      "</li>" +
                      "<li>States decide whether to suppress data for specific race and ethnicity categories. The suppression criteria may vary in previous releases of these data</li>" +
                      "<li>Death rates are flagged as Unreliable when the rate is calculated with a numerator of 20 or less</li>" +
                      "<li>'Not Applicable' is displayed: </li>" +
                        "<ul class='sub'>" +
                            "<li>For all data values when sex-specific cancers are combined with the wrong sex.</li>"+
                            "<li>For Population when it is not available, and for Age Adjusted Rates, Crude Rates, 95% Confidence Interval, and Standard Error when they cannot be calculated due to lack of denominator population.</li>" +
                        "</ul>"+
                    "</ul>",
                    source: "The United States Cancer Statistics (USCS) are the official federal statistics on cancer incidence from registries having high-quality data and cancer mortality statistics for 50 states and the District of Columbia. USCS are produced by the Centers for Disease Control and Prevention (CDC) and the National Cancer Institute (NCI), in collaboration with the North American Association of Central Cancer Registries (NAACCR). Data are provided by:" +
                    "<ul>" +
                    "<li>The Centers for Disease Control and Prevention National Program of Cancer Registries (NPCR) </li>" +
                  "<li>The National Cancer Institute Surveillance, Epidemiology and End Results (SEER) program.</li>" +
                    "</ul>",
                    isRateCalculation: true,
                    filters: [
                        {name: "Cancer Counts", description: "Cancer case reports in this data set are counted by or summed by the cancer reported. For example, a single person with more than one primary cancer verified by a medical doctor is counted as a case report for each type of primary cancer reported. Having more than one primary cancer occurs in less than 20% of the population. The counts report the frequency of verified cancer diagnoses in the selected population and time period."},
                        {name: "Cancer Population", description: "The population estimates are a slight modification of the annual time series of July 1 population estimates (by age, sex, race, and Hispanic origin) produced by the Population Estimates Program of the U.S. Bureau of the Census (Census Bureau) with support from the National Cancer Institute (NCI) through an interagency agreement."},
                        {name: "Crude Rates", description: "Crude Rates are expressed as the number of cases reported each calendar year per 100,000 population"},
                        {name: "Year", description: "This field indicates the year of diagnosis or death"},
                        {name: "Sex", description: "This field indicates the sex of the patient"},
                        {name: "Race", description: "This field indicates the race of the patient"},
                        {name: "Ethnicity", description: "This field indicates the ethnicity of the patient"},
                        {name: "Age Group", description: "This field indicates the age group of the patient"},
                        {name: "Cancer Sites", description: "This field indicates the primary cancer site that is the organ of origin within the body where a given cancer occurs in an individual"},
                        {name: "Childhood Cancers", description: "This field indicates the childhood cancer that are usually studied in children who are less than age 20"},
                        /*{name: "Leading Cancer Sites", description: "This field contains a list of only the top or leading cancer sites, meaning the primary cancers with the highest incidence for each race and sex"},*/
                        {name: "State", description: "This field indicates the State of patient's residence at the time the case was submitted to the registry"},
                        {name: "Census Regions", description: "The United States is split into 4 Census Regions: Northeast, Midwest, South and West. Census Divisions are multi-state groups, sub-sets of Census Regions. You can group by Census Division, or select any combination of individual Census Divisions"}
                    ],
                    additionalInfo:[
                        {
                            question:"What are the population sources?",
                            answer:"The population estimates are a slight modification of the annual time series of July 1 population estimates (by age, sex, race, and Hispanic origin) produced by the Population Estimates Program of the U.S. Bureau of the Census (Census Bureau) with support from the National Cancer Institute (NCI) through an interagency agreement.<br/><br/>"
                        },
                        {
                            isRateInfo:true,
                            question:"What are Crude Rates? How are they calculated?",
                            answer:"Crude Rates are expressed as the number of cases reported each calendar year per 100,000 population." +
                            "<p>Crude Rate = Count / Population * 100,000</p>"
                        },
                        {
                            question: "Why are some states disabled for certain years?",
                            answer: "The following combination of states and years did not meet the United States Cancer Statistics (USCS) publication standard or did not allow permission for their data to be used.  These data are not included in the data set:" +
                            "<ul>" +
                              "<li>Arkansas, 2000</li>" +
                              "<li>District of Columbia, 2002</li>" +
                              "<li>Kansas, 2000-2014</li>" +
                              "<li>Mississippi, 2000-2002</li>" +
                              "<li>Nevada, 2011</li>" +
                              "<li>South Dakota, 2000</li>" +
                            "</ul>"
                        }
                    ]
                },
                cancer_mortality: {
                    key:"cancer_mortality",
                    title: 'Cancer Mortality',
                    image: 'cancer-mortality-icon.svg',
                    yrsAvail: '2000-2016',
                    topics: "Cancer, Deaths, Prostate Cancer",
                    dataDescription: "Cancer mortality data are derived from death certificates. Cancer incidence and death counts, rates, cancer classification, age, race, and gender. Charts and maps are also available. The data are updated annually. Cancer incidence and mortality data are available for the United States, state by age group, race, ethnicity, gender and cancer site for the years 2000-2016 (2016 is the most recent year for which incidence data are available).",
                    suppression: "<ul>" +
                      "<li>Data are suppressed if the figures represent fewer than 16 cases for the specific category." +"</li>"+
                      "</ul>",
                    source: "The United States Cancer Statistics (USCS) are the official federal statistics on cancer incidence from registries having high-quality data and cancer mortality statistics for 50 states and the District of Columbia. USCS are produced by the Centers for Disease Control and Prevention (CDC) and the National Cancer Institute (NCI), in collaboration with the North American Association of Central Cancer Registries (NAACCR). Data are provided by:" +
                    "<ul>" +
                    "<li>The Centers for Disease Control and Prevention National Program of Cancer Registries (NPCR) </li>" +
                    "<li>The National Cancer Institute Surveillance, Epidemiology and End Results (SEER) program.</li>" +
                    "</ul>",
                    isRateCalculation: true,
                    filters: [
                        {name: "Cancer Counts", description: "Cancer case reports in this data set are counted by or summed by the cancer reported. For example, a single person with more than one primary cancer verified by a medical doctor is counted as a case report for each type of primary cancer reported. Having more than one primary cancer occurs in less than 20% of the population. The counts report the frequency of verified cancer diagnoses in the selected population and time period."},
                        {name: "Cancer Population", description: "The population estimates are a slight modification of the annual time series of July 1 population estimates (by age, sex, race, and Hispanic origin) produced by the Population Estimates Program of the U.S. Bureau of the Census (Census Bureau) with support from the National Cancer Institute (NCI) through an interagency agreement."},
                        {name: "Crude Rates", description: "Crude Rates are expressed as the number of cases reported each calendar year per 100,000 population"},
                        {name: "Year", description: "This field indicates the year of diagnosis or death"},
                        {name: "Sex", description: "This field indicates the sex of the patient"},
                        {name: "Race", description: "This field indicates the race of the patient"},
                        {name: "Ethnicity", description: "This field indicates the ethnicity of the patient"},
                        {name: "Age Group", description: "This field indicates the age group of the patient"},
                        {name: "Cancer Sites", description: "This field indicates the primary cancer site that is the organ of origin within the body where a given cancer occurs in an individual"},
                        /*{name: "Childhood Cancers", description: "This field indicates the childhood cancer that are usually studied in children who are less than age 20"},*/
                        /*{name: "Leading Cancer Sites", description: "This field contains a list of only the top or leading cancer sites, meaning the primary cancers with the highest incidence for each race and sex"},*/
                        {name: "State", description: "This field indicates the State of patient's residence at the time the case was submitted to the registry"},
                        {name: "Census Regions", description: "The United States is split into 4 Census Regions: Northeast, Midwest, South and West. Census Divisions are multi-state groups, sub-sets of Census Regions. You can group by Census Division, or select any combination of individual Census Divisions"}
                    ],
                    additionalInfo:[
                        {
                            question:"What are the population sources?",
                            answer:"The population estimates are a slight modification of the annual time series of July 1 population estimates (by age, sex, race, and Hispanic origin) produced by the Population Estimates Program of the U.S. Bureau of the Census (Census Bureau) with support from the National Cancer Institute (NCI) through an interagency agreement.<br/><br/>"
                        },
                        {
                            isRateInfo:true,
                            question:"What are Crude Rates? How are they calculated?",
                            answer:"Crude Rates are expressed as the number of cases reported each calendar year per 100,000 population." +
                            "<p>Crude Rate = Count / Population * 100,000</p>"
                        }
                    ]
                },
                std: {
                    key:"std",
                    title: 'Sexually Transmitted Diseases/Infections',
                    image: 'std-icon.svg',
                    yrsAvail: '2000-2016',
                    topics: "Infants, Sexually Transmitted Diseases, Chlamydia, Gonorrhea, Primary and Secondary Syphilis, Early Latent Syphilis, Congenital Syphilis",
                    dataDescription: "STD morbidity data presented in this report are compiled from a combination of data reported on standardized hard copy reporting forms and electronic data received through the National Electronic Tele­communications System for Surveillance (NETSS) for diagnosis years 2000 through 2016.",
                    suppression: "For STD data, the data suppression rule is applied when the numerator for a given state is 3 or less. When suppressed, data are only displayed by state totals and breakdown by demographic characteristics is not permitted.",
                    source: "The CDC collects, analyzes, and disseminates surveillance data on STD diagnoses. The NCHHSTP AtlasPlus presents chlamydia, gonorrhea, congenital syphilis, and primary and secondary syphilis case report data submitted from all 50 states, the District of Columbia for the years 2000 to 2016 and early latent syphilis case report data for 2003-2016. STD data are presented by disease, year of diagnosis, reporting area (state), age group, race/ethnicity, and sex.",
                    isRateCalculation: true,
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
                    ],
                    additionalInfo:[
                        {
                            isRateInfo:true,
                            question:"How are Rates calculated?",
                            answer:"Each rate was calculated by dividing the number of STD cases for the calendar year by the population for that calendar year and then multiplying the number by 100,000.<br/><br/>"
                        },
                        {
                            isRateInfo:false,
                            question:"What are the scenarios where data is not available?",
                            answer:"<u>Race/Ethnicity</u><ul><li>Data are not available for the Race/Ethnicity stratification over National data for the years 2007-2010 for all diseases</li><li>No data are available for Race/Ethnicity stratification for 2000-2006 for all diseases</li></ul><p>When specific race/ethnicity data are presented in this atlas, the following OMB compliant categories are reported: American Indian or Alaska Native, Asian, Black or African American, Hispanic or Latino, Native Hawaiian or Other Pacific Islander, White and multirace. States began reporting these OMB compliant race categories in different years. Therefore, specific race/ethnicity categories are presented for a state only in the years when that state reported 97% or more of its cases with OMB compliant race/ethnicity categories. In addition, when presenting 5-year trend data, only states that reported 97% of more of their cases with OMB compliant race/ethnicity categories for all five years are included.</p><u>Additional Scenarios:</u><ul><li>National data are not available for the years 2000-2002 for Early Latent Syphilis</li><li>Population data are not available when Race/Ethnicity is Unknown, hence the Rates are not applicable</li><li>Only aggregate data are available for Congenital Syphilis. No demographic filter can be applied on these data</li></ul>"
                        }
                    ]
                },
                tb: {
                    key:"tb",
                    title: 'Tuberculosis',
                    image: 'tuberculosis-icon.svg',
                    yrsAvail: '2000-2017',
                    topics: "Tuberculosis",
                    dataDescription: "TB data are presented by year of disease confirmation, reporting area (state), age group, race/ethnicity, sex, and whether or not the patient was born in the United States. The most common site of infection is the lung, but other organs may be involved. Nationally notifiable TB surveillance data are collected and compiled from reports sent to CDC’s Division of TB Elimination by the TB control programs and health departments in all 50 states, the District of Columbia, U.S. dependencies and possessions, and independent nations in free association with the United States.",
                    suppression: "Data are not suppressed at the state level; TB data can be viewed in aggregate format or one-way stratifications (i.e., by age group, sex, race/ethnicity, or country of birth [U.S.-born or foreign-born]).",
                    source: "The CDC collects, analyzes, and disseminates surveillance data on newly reported cases of tuberculosis (TB) disease in the United States. The Atlas presents TB case report data submitted from all 50 states, the District of Columbia for the years 2000 to 2017.",
                    isRateCalculation: true,
                    filters: [
                        {name: "Cases", description: "A case of TB is described as a chronic bacterial infection caused by Mycobacterium tuberculosis, usually characterized pathologically by the formation of granulomas"},
                        {name: "Rates", description: "Rates are expressed as the number of cases reported each calendar year per 100,000 populations."},
                        {name: "Population", description: "Population denominators used in calculating TB rates were based on the US Census population estimates for 2000–2017."},
                        {name: "Location(State)", description: "This field indicates the State where the TB surveillance data are collected"},
                        {name: "Year", description: "This field indicates year of diagnosis or death"},
                        {name: "Sex", description: "This field indicates the sex of the patient at birth"},
                        {name: "Race/Ethnicity", description: "This field indicates the Race/Ethnicity of the patient"},
                        {name: "Age Group", description: "This field indicates the age group of the patient"},
                        {name: "Country of Birth", description: "This field indicates the country of birth of the patient"}
                    ],
                    additionalInfo:[
                        {
                            isRateInfo:true,
                            question:"How are Rates calculated?",
                            answer:"TB Rates are expressed as the number of cases reported each calendar year per 100,000 populations.<br/><br/>"
                        },
                        {
                            isRateInfo:false,
                            question:"Why cannot I apply more than one demographic filter on State data?",
                            answer:"TB data can be viewed in aggregate format or one-way stratifications (i.e., by age group, sex, race/ethnicity, or country of birth [U.S.-born or foreign-born]). When the state filter is applied, then only one of the demographic filters can be applied as data are not available.<br/><br/>"
                        }
                    ]
                },
                aids: {
                    key:"aids",
                    title: 'HIV/AIDS',
                    image: 'aids-hiv-icon.svg',
                    yrsAvail: '2000-2017',
                    topics: "Deaths, Babies, HIV/AIDS, AIDS Diagnoses, AIDS Deaths, AIDS Prevalence, HIV Diagnoses, HIV Deaths, HIV Prevalence",
                    dataDescription: "These data are the nation’s source of information on HIV in the United States. Numbers and rates and presented based on the date of diagnosis of HIV infection and infection classified as stage 3 (AIDS) (from the beginning of the epidemic through December 31, 2017; reported as of June 30, 2018).<br/>Data on diagnoses of HIV infection should be interpreted with caution. Data may not be representative of all persons with HIV because not all infected persons have been tested. Also, many states offer anonymous testing; the results of anonymous tests are not reported to the confidential name-based HIV registries of state and local health departments.",
                    suppression: "A data suppression rule is applied if:" +
                    "<ul>" +
                    "<li>The population denominator for 1-way and 2-way demographic/transmission category data is less than 100.</li>" +
                    "<li>Two variables are already selected from section X, then no further stratifications are allowed.</li>" +
                    "<li>Two-way demographic/risk stratifications for U.S. dependent areas (except Puerto Rico, for age and sex) are queried.</li>" +
                    "<li>Two-way demographic/risk stratifications for the race groups Native Hawaiians/Other Pacific Islanders (NHOPIs) and Multiple races are queried.</li>" +
                    "<li>Two-way demographic/transmission category stratifications for New Hampshire are queried.</li>" +
                    "</ul>Also, data are suppressed or aggregated to preclude arithmetic calculation of a suppressed cell.",
                    source: "CDC collects, analyzes, and disseminates surveillance data on diagnoses of HIV infection; these data are the nation’s source of information on HIV in the United States. Numbers and rates are presented based on the date of diagnosis of HIV infection and infection classified as stage 3 (AIDS) (from the beginning of the epidemic through December 31, 2017; reported as of June 30, 2018).",
                    isRateCalculation: true,
                    filters: [
                        {name: "Deaths", description: "Persons reported to the national HIV surveillance system are assumed alive unless their deaths have been reported to CDC by state/local HIV surveillance programs."},
                        {name: "Prevalence", description: "(Persons Living with Diagnosed HIV Infection or infection classified as stage 3 (AIDS)): The data reflect persons living with diagnosed HIV infection at the end of each year during 2008–2016, or persons living with infection ever classified as stage 3 (AIDS) at the end of each year during 2000–2016"},
                        {name: "Diagnoses", description: "Diagnoses of HIV infection or infection classified as stage 3 (AIDS) refer to confirmed diagnoses during a given time period."},
                        {name: "Rates", description: "Each rate was calculated by dividing the total number of diagnoses (or deaths or prevalence) for the calendar year by the population for that calendar year and then multiplying the result by 100,000"},
                        {name: "Population", description: "The population denominators used to compute the rates for the 50 states, the District of Columbia were based on the Vintage 2009 postcensal estimates file (for the years 2000 to 2009) and the Vintage 2017 file (for years 2010 to 2017) from the U.S. Census Bureau."},
                        {name: "Indicator", description: "This field indicates diagnosis, prevalence of deaths of AIDS/HIV"},
                        {name: "Location(State)", description: "This field indicates the State where the AIDS/HIV surveillance data are collected"},
                        {name: "Year", description: "This field indicates year of diagnosis or death. For persons living with diagnosed HIV, year refers to the end of the queried calendar year"},
                        {name: "Sex", description: "This field indicates the sex of the patient at birth"},
                        {name: "Race/Ethnicity", description: "This field indicates the Race/Ethnicity of the patient"},
                        {name: "Age Group", description: "This field indicates the age group of the patient. HIV surveillance data include adults and adolescents only (persons aged 13 years and older)"},
                        {name: "Transmission Category", description: "This field indicates the classification of cases that summarizes a person’s possible HIV risk factor"}
                    ],
                    note: "<span class='bold-class'>Note:</span> Data on diagnoses of HIV infection should be interpreted with caution. Data may not be representative of all persons with HIV because not all infected persons have been tested. Also, many states offer anonymous testing; the results of anonymous tests are not reported to the confidential name-based HIV registries of state and local health departments. The data presented provide minimum number of persons for whom HIV infection has been diagnosed and reported to the National HIV Surveillance System. In addition, because surveillance practices differ, the reporting and the updating of a person’s clinical and vital status differ among states. The completeness of reporting of HIV diagnoses is estimated at more than 80%.<br/><br/>",
                    additionalInfo:[
                        {
                            question:"Can I get more information on AIDS/HIV age groups?",
                            answer:"The data source only includes data for adults and adolescents (i.e., persons aged 13 years and older). When comparing HIV data with STD and/or TB data, the HIV age group remains ages 13–24. For diagnosis data, age is based on the person’s age at diagnosis (HIV infection or stage 3 [AIDS]). For data on persons living with diagnosed HIV infection or stage 3 (AIDS), the age is based on the person’s age as of December 31 of the queried year. For HIV or AIDS death data, age is based on the person’s age at the time of death. Ten-year age groups are used with HIV surveillance data to ensure data security and confidentiality.<br/><br/>"
                        },
                        {
                            question:"What is Transmission Category?",
                            answer:"Transmission category is the term for the classification of cases that summarizes a person’s possible HIV risk factors; the summary classification results from selecting, from the presumed hierarchical order of probability, the one risk factor most likely to have resulted in HIV transmission. The exception is men who had sexual contact with other men and injected drugs; this group makes up a separate transmission category." +
                            "<p>Persons whose transmission category is classified as male-to-male sexual contact include men who report sexual contact with other men (i.e., homosexual contact) and men who report sexual contact with both men and women (i.e., bisexual contact).</p>" +
                            "<p>Persons whose transmission category is classified as injection drug use (IDU) are persons who injected non-prescribed drugs.</p>"+
                            "<p>Persons whose transmission category is classified as heterosexual contact are persons who have ever had specific heterosexual contact with a person known to have, or to be at high risk for, HIV infection (e.g., a person who injects drugs). </p>"+
                            "<p>All other transmission categories have been collapsed into “Other.” The “Other” transmission category includes: hemophilia, blood transfusion, perinatal exposure, and risk factor not reported or not identified.</p>"+
                            "<p>Data have been statistically adjusted to account for missing transmission category.</p>"
                        },
                        {
                            isRateInfo:true,
                            question:"How are Rates calculated?",
                            answer:"Rates per 100,000 population were calculated for" +
                            "<ul>" +
                            "<li>The numbers of diagnoses of HIV infection and the numbers of infections classified as stage 3 (AIDS)</li>" +
                            "<li>The numbers of deaths of persons with diagnosed HIV infection and deaths of persons with infection classified as stage 3 (AIDS)</li>" +
                            "<li>The numbers of persons living with diagnosed HIV infection and persons living with infection classified as stage 3 (AIDS).</li>" +
                            "</ul>"
                        },
                        {
                            question:"What are the  population sources?",
                            answer:"The population denominators used to compute the rates for the 50 states, the District of Columbia were based on the Vintage 2009 postcensal estimates file (for the years 2000 to 2009) and the Vintage 2017 file (for years 2010 to 2017) from the U.S. Census Bureau. The denominators used for calculating age-, sex-, and race/ethnicity-specific rates were computed by applying the appropriate vintage estimates for age, sex, and race/ethnicity for the 50 states and the District of Columbia.<br/><br/>"
                        }
                    ]
                },
                infant_mortality: {
                    key:"infant_mortality",
                    title: 'Infant Mortality',
                    image: 'infant-mortality-icon.svg',
                    yrsAvail: '2000-2017',
                    topics: "Underlying Cause of Death, Cancer, Diabetes, Deaths, Tuberculosis, Obesity, Overweight and Weight Control, Tobacco Use, Unintentional Injury and Violence, Births, Infant Deaths, HIV/AIDS, Delivery, Infant Health, Prenatal Care",
                    dataDescription: "This data collection provides counts and rates for deaths of children under 1 year of age, occurring within the United States to U.S. residents. Data are available by state of mother's residence, child's age, underlying cause of death, gender, birth weight, birth plurality, birth order, gestational age at birth, period of prenatal care, maternal race and ethnicity, maternal age, maternal education and marital status.<br/> This dataset is powered by CDC WONDER.",
                    suppression: "Vital statistics data are suppressed due to confidentiality constraints, in order to protect personal privacy." +
                    "<ul>" +
                    "<li>The term <i>Suppressed</i> replaces sub-national death counts, births counts and death rates, when the figure represents zero to nine (0-9) persons.</li>" +
                    "<li>Totals and sub-totals are suppressed when the value falls within scope of the suppression criteria, or when the summary value includes a single suppressed figure, in order to prevent the inadvertent disclosure of suppressed values.</li>" +
                    "<li>About <i>Unreliable</i> rates representing fewer than 20 deaths: Rates are flagged as Unreliable when there are fewer than 20 deaths in the numerator, because the figure does not meet the NCHS standard of reliability or precision.</li>" +
                    "</ul>",
                    source: "The Linked Birth/Infant Death Records data are compiled from data provided by the 57 vital statistics jurisdictions through the Vital Statistics Cooperative; the data are produced by the U.S. Department of Health and Human Services (US HHS), Centers for Disease Control and Prevention (CDC), National Center for Health Statistics (NCHS).",
                    isRateCalculation: true,
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
                    ],
                    additionalInfo:[
                        {
                            isRateInfo:true,
                            question:"How are Rates calculated?",
                            answer:"This represents the rates for deaths of children under 1 year of age, occurring within the United States to U.S. residents" +
                            "<p>Rates = (Counts of deaths of children under 1 year of age) / Live births (age under 365 days) to a mother who is a resident of the United States</p>"
                        },
                        {
                            question:"Why can I not pick years from two groups?",
                            answer:"Different sets of years have different filter options available. Hence the years under one set cannot be combined and compared with other set. The years 2000-2017 are divided into three sets 2000-2002, 2003-2006 and 2007-2017.<br/><br/>"
                        }
                    ]
                },
                mental_health: {
                    key:"mental_health",
                    title: 'Youth Risk Behavior Surveillance System (YRBSS)',
                    image: 'yrbss-icon.svg',
                    yrsAvail: '2000-2017',
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
                    ],
                     additionalInfo:[
                         {
                             question:"Why are results not available for every state?",
                             answer:"Results are not available from every state for several reasons. First, three states (Minnesota, Oregon, and Washington) do not participate in the YRBSS. Second, some states that do participate do not achieve a high enough overall response rate to receive weighted results. Therefore, their results are not posted on the CDC web site and CDC does not distribute their data.<br/><br/>"
                         },
                         {
                             question:"Are students required to participate in YRBSS?",
                             answer:"No. YRBS’s supported by CDC are always a voluntary activity for states, large urban school districts, schools, and students.<br/><br/>"
                         },
                         {
                             question:"How are the YRBSS results used?",
                             answer:"State, territorial, tribal government, and local agencies and nongovernmental organizations use YRBSS data to set and track progress toward meeting school health and health promotion program goals, support modification of school health curricula or other programs, support new legislation and policies that promote health, and seek funding and other support for new initiatives. CDC and other federal agencies routinely use YRBSS data to assess trends in priority health behaviors among high school students, monitor progress toward achieving national health objectives, and evaluate the contribution of broad prevention efforts in schools and other settings toward helping the nation reduce health risk behaviors among youth.<br/><br/>"
                         }
                     ]
                },
                prams: {
                    key:"prams",
                    title: 'Pregnancy Risk Assessment Monitoring System (PRAMS)',
                    image: 'prams-icon.svg',
                    yrsAvail: '2000-2014',
                    topics: " Alcohol and Other Drug Use, Tobacco Use, Births, Babies, Demographics, Delivery, Family, Planning, Flu, Infant Health, Maternal Behavior/Health, Prenatal Care, Insurance/Medicaid/Services, Health Care Access/ Coverage , Women's Health",
                    dataDescription: "Pregnancy Risk Assessment Monitoring System is a joint research project between the state departments of health and the Centers for Disease Control and Prevention, Division of Reproductive Health.PRAMS collects state-specific, population-based data on maternal attitudes and experiences before, during, and shortly after pregnancy. PRAMS surveillance currently covers about 83% of all U.S. births. These data can be used to identify groups of women and infants at high risk for health problems, to monitor changes in health status, and to measure progress towards goals in improving the health of mothers and infants. PRAMS data are used by researchers to investigate emerging issues in the field of reproductive health and by state and local governments to plan and review programs and policies aimed at reducing health problems among mothers and babies.<br/>",
                    announcement:"PRAMS data from 2012-2014 are being updated during the week of 08/27/2018. Advanced search with updated data will be available coming weeks",
                    suppression: "Data suppression must be applied if the unweighted sample size was < 30.",
                    source: "PRAMSTAT - Pregnancy Risk Assessment Monitoring System (PRAMS) Statistics is produced by the United States Department of Health and Human Services (HHS), Centers for Disease Control and Prevention (CDC), National Center for Chronic Disease Prevention and Health Promotion (NCCDPHP), Division of Reproductive Health (DRH).",
                    filters: [
                        {name: "Class", description: "This field indicates that the Category of Topics addressed in the PRAMS core questionnaire"},
                        {name: "Topic", description: "Topics addressed in the PRAMS core questionnaire include barriers to and content of prenatal care, obstetric history, maternal use of alcohol and cigarettes, physical abuse, contraception, economic status, maternal stress, and early infant development and health status"},
                        {name: "Year", description: "This field indicates the Year of the PRAMS survey"},
                        {name: "Location- State", description: "This field indicates the States for which PRAMS data is available"},
                        {name: "Question", description: "This field indicates the questions which were developed and tested and ultimately placed on the PRAMS questionnaire"},
                    ],
                    additionalInfo:[
                        {
                            question:"What is the purpose of PRAMS?",
                            answer:"The purpose of PRAMS is to find out why some babies are born healthy and others are not. The survey asks new mothers questions about their pregnancy and their new baby. The questions give us important information about the mother and the baby and help us learn why some babies are born healthy and others are not.<br/><br/>"
                        },
                        {
                            question:"Why is PRAMS important?",
                            answer:"<ul>" +
                            "<li>PRAMS provides data for state health officials to use to improve the health of mothers and infants.</li>" +
                            "<li>PRAMS allows CDC and the states to monitor changes in maternal and child health indicators (e.g., unintended pregnancy, prenatal care, breastfeeding, smoking, drinking, infant health).</li>" +
                            "<li>PRAMS enhances information from birth certificates used to plan and review state maternal and infant health programs.</li>" +
                            "<li>The PRAMS sample is chosen from all women who had a live birth recently, so findings can be applied to the state’s entire population of women who have recently delivered a live-born infant.</li>" +
                            "<li>PRAMS not only provides state-specific data but also allows comparisons among participating states because the same data collection methods are used in all states.</li>" +
                            "</ul>"
                        },
                        {
                            question:"How are PRAMS data used?",
                            answer:"PRAMS provides data not available from other sources about pregnancy and the first few months after birth. These data can be used to identify groups of women and infants at high risk for health problems, to monitor changes in health status, and to measure progress towards goals in improving the health of mothers and infants. PRAMS data are used by:" +
                            "<ul>" +
                            "<li>Researchers to investigate emerging issues in the field of maternal and child health.</li>" +
                            "<li>State and local governments to plan and review programs and policies aimed at reducing health problems among mothers and babies.</li>" +
                            "<li>State agencies to identify other agencies that have important contributions to make in planning maternal and infant health programs and to develop partnerships with those agencies.</li>" +
                            "</ul>"
                        },
                        {
                            question:"What does PRAMS do with the information?",
                            answer:"The information collected from the mothers is used to develop health programs and policies; help doctors and nurses improve care; and make better use of health resources.<br/><br/>"
                        },
                        {
                            question:"Why are results not available for every state?",
                            answer:"Forty-seven states currently participate in PRAMS. The CDC does not provide data for California, Idaho, Ohio and Washington DC: <a href='https://www.cdc.gov/prams/states.htm' target='_blank'>https://www.cdc.gov/prams/states.htm</a>"
                        }
                    ]
                },
                brfss: {
                    key:"brfss",
                    title: 'Behavioral Risk Factor Surveillance System(BRFSS)',
                    image: 'brfss-icon.svg',
                    yrsAvail: '2000-2017',
                    topics: "Cancer, Diabetes, Alcohol and Other Drug Use, Obesity, Overweight and Weight Control, Dietary Behaviors, Physical Activity, Sexual Behavior, Tobacco Use, Babies, Health and Nutrition, Demographics, Chronic Health Indicators, Health Care Access and Coverage, Oral Health, Women’s Health, Prostate Cancer",
                    dataDescription: "BRFSS is the nation's premier system of health-related telephone surveys that collect state data about U.S. residents regarding their health-related risk behaviors, chronic health conditions, and use of preventive services. BRFSS collects data in all 50 states as well as the District of Columbia. BRFSS completes more than 400,000 adult interviews each year, making it the largest continuously conducted health survey system in the world",
                    suppression: "The Prevalence estimate not available if the unweighted sample size for the denominator was < 50 or the Relative Standard Error (RSE) is > 0.3 or if the state did not collect data for that calendar year.",
                    source: "The Behavioral Risk Factor Surveillance System data are published by the United States Department of Health and Human Services (HHS), Centers for Disease Control and Prevention (CDC), National Center for Chronic Disease Prevention and Health Promotion (NCCDPHP), Division of Adult and Community Health, Behavioral Surveillance Branch.",
                    filters: [
                        {name: "Class", description: "This field indicates that the category of topics addressed in the BRFSS core questionnaire"},
                        {name: "Topic", description: "Topics addressed in the BRFSS core questionnaire include barriers to and content of prenatal care, obstetric history, maternal use of alcohol and cigarettes, physical abuse, contraception, economic status, maternal stress, and early infant development and health status"},
                        {name: "Year", description: "This field indicates the Year of the BRFSS survey"},
                        {name: "Location- State", description: "This field indicates the States for which BRFSS data is available"},
                        {name: "Question", description: "This field indicates the questions which were developed and tested and ultimately placed on the BRFSS questionnaire"},
                        {name: "Sex", description: "This field indicates the sex of the survey respondents"},
                        {name: "Race/Ethnicity", description: "This field indicates the race or ethnicity of the survey respondents"},
                        {name: "Age Group", description: "This field indicates the age-group of the survey respondents"},
                        {name: "Education attained", description: "This field indicates the education attained by the survey respondents"},
                        {name: "Household Income", description: "This field indicates the household income of the survey respondents"}
                    ],
                    additionalInfo:[
                        {
                            question:"How is the survey conducted?",
                            answer:"With technical and methodological assistance from CDC, state health departments use in-house interviewers or contract with telephone call centers or universities to administer the BRFSS surveys continuously through the year. The states use a standardized core questionnaire, optional modules, and state-added questions. The survey is conducted using Random Digit Dialing (RDD) techniques on both landlines and cell phones.<br/><br/>"
                        },
                        {
                            question:"Who takes part in the BRFSS survey? Are they compensated?",
                            answer:"Adults 18 years or older are asked to take part in the survey. Participants are not compensated monetarily but should know that they are taking part in a rewarding endeavor that helps improve the health of U.S. residents. The number of interviews within each state will vary based on funding and the size of regions, such as health districts, within each state.<br/><br/>"
                        },
                        {
                            question:"How are BRFSS data weighted? What variables are used when weighting BRFSS data?",
                            answer:"From the 1980s to 2010, CDC has used a statistical method called post stratification to weight BRFSS survey data to known proportions of age, race and ethnicity, sex, geographic region within a population. In 2011 the BRFSS moved to a new weighting methodology known as iterative proportional fitting or raking. Raking has several advantages over post stratification. First, it allows the introduction of more demographic variables—such as education level, marital status, and homeownership—into the statistical weighting process than would have been possible with post stratification. This advantage reduces the potential for bias and increases the representativeness of estimates. Second, raking allows for the incorporation of a now-crucial variable—telephone ownership (landline and/or cellular telephone)—into the BRFSS weighting methodology. Beginning with the 2011 dataset, raking succeeded post stratification as the BRFSS statistical weighting method. As noted in the previous paragraph, age, sex, categories of ethnicity, geographic regions within states, marital status, education level, home ownership and type of phone ownership are currently used to weight BRFSS data.<br/><br/>"
                        }
                    ]
                }
        };

        function scrollToElement(eleClazz) {
            if (eleClazz) {
                angular.element('html,body').animate({ scrollTop: $("." + eleClazz).offset().top}, 'slow');
            }
        }
        $scope.redirectToMortalityPage = function() {
            $state.go('search');
        };

        function getDataSetDetails() {
            var datasetKey = $stateParams.dataSetKey;
            if (datasetKey === 'natality') {
                $location.path("/description/births").replace();
            }
            return dc.datasetInfo[datasetKey];
        }
    }
}());
