var elasticSearch = require('../models/elasticSearch');
var yrbs = require("../api/yrbs");
var queryBuilder = require('../api/elasticQueryBuilder');
var factSheetQueries = require('../json/factsheet-queries.json');
var factSheetCountryQueries = require('../json/factsheet-country-queries.json');
var searchUtils = require('../api/utils');
var wonder = require("../api/wonder");
var Q = require('q');
var logger = require('../config/logging');
var extend = require('util')._extend;
var FactSheet = function() {

};

FactSheet.prototype.prepareFactSheet = function (state, fsType) {
    var self = this;
    var deferred = Q.defer();
    var factSheetQueryJSON;
    if(state) {
        factSheetQueryJSON = JSON.parse(JSON.stringify(factSheetQueries[fsType]).split("$state$").join(state));
    } else {
        factSheetQueryJSON = JSON.parse(JSON.stringify(factSheetCountryQueries[fsType]));
    }
    if (factSheetQueryJSON) {
        var bridgeRaceQueryObj = factSheetQueryJSON.bridge_race;
        //STD
        var std_chlamydia_esQuery = factSheetQueryJSON.std["chlamydia"][0];
        var std_chlamydia_populationQuery = factSheetQueryJSON.std["chlamydia"][1];
        var std_gonorrhea_esQuery = factSheetQueryJSON.std["Gonorrhea"][0];
        var std_gonorrhea_populationQuery = factSheetQueryJSON.std["Gonorrhea"][1];
        var std_primarySyphilis_esQuery = factSheetQueryJSON.std["Primary and Secondary Syphilis"][0];
        var std_primarySyphilis_populationQuery = factSheetQueryJSON.std["Primary and Secondary Syphilis"][1];
        var std_earlySyphilis_esQuery = factSheetQueryJSON.std["Early Latent Syphilis"][0];
        var std_earlySyphilis_populationQuery =factSheetQueryJSON.std["Early Latent Syphilis"][1];
        var std_congSyphilis_esQuery = factSheetQueryJSON.std["Congenital Syphilis"][0];
        var std_congSyphilis_populationQuery = factSheetQueryJSON.std["Congenital Syphilis"][1];
        //HIV-AIDS
        var AIDSDiagnoses_esQuery = factSheetQueryJSON.aids["AIDS Diagnoses"][0];
        var AIDSDiagnoses_populationQuery = factSheetQueryJSON.aids["AIDS Diagnoses"][1];
        var AIDSDeaths_esQuery = factSheetQueryJSON.aids["AIDS Deaths"][0];
        var AIDSDeaths_populationQuery = factSheetQueryJSON.aids["AIDS Deaths"][1];
        var AIDSPrevalence_esQuery = factSheetQueryJSON.aids["AIDS Prevalence"][0];
        var AIDSPrevalence_populationQuery = factSheetQueryJSON.aids["AIDS Prevalence"][1];
        var HIVDiagnoses_esQuery = factSheetQueryJSON.aids["HIV Diagnoses"][0];
        var HIVDiagnoses_populationQuery = factSheetQueryJSON.aids["HIV Diagnoses"][1];
        var HIVDeaths_esQuery = factSheetQueryJSON.aids["HIV Deaths"][0];
        var HIVDeaths_populationQuery = factSheetQueryJSON.aids["HIV Deaths"][1];
        var HIVPrevalence_esQuery = factSheetQueryJSON.aids["HIV Prevalence"][0];
        var HIVPrevalence_populationQuery = factSheetQueryJSON.aids["HIV Prevalence"][1];
        //Detail Mortality - Total
        var mortality_total_esQuery = factSheetQueryJSON.detailMortality["Total"][0];
        var mortality_total_wonderQuery = factSheetQueryJSON.detailMortality["Total"][1];
        //Detail Mortality - alzheimer
        var alzheimerESQuery = factSheetQueryJSON.detailMortality["alzheimer"][0];
        var alzheimerWonderQuery = factSheetQueryJSON.detailMortality["alzheimer"][1];
        //Detail Mortality - malignant_neoplasm
        var malignantNeoplasmESQuery = factSheetQueryJSON.detailMortality["malignant_neoplasm"][0];
        var malignantNeoplasmWonderQuery = factSheetQueryJSON.detailMortality["malignant_neoplasm"][1];
        //Detail Mortality - accident
        var accidentESQuery = factSheetQueryJSON.detailMortality["accident"][0];
        var accidentWonderQuery = factSheetQueryJSON.detailMortality["accident"][1];
        //Detail Mortality - Cerebrovascular Disease
        var cerebrovascularESQuery = factSheetQueryJSON.detailMortality["cerebrovascular"][0];
        var cerebrovascularWonderQuery = factSheetQueryJSON.detailMortality["cerebrovascular"][1];
        //Detail Mortality - Chronic Respiratory
        var chronicRespiratoryESQuery = factSheetQueryJSON.detailMortality["chronic_respiratory"][0];
        var chronicRespiratoryWonderQuery = factSheetQueryJSON.detailMortality["chronic_respiratory"][1];
        //Detail Mortality - Diabetes Mellitus
        var diabetesMellitusESQuery = factSheetQueryJSON.detailMortality["diabetes_mellitus"][0];
        var diabetesMellitusWonderQuery = factSheetQueryJSON.detailMortality["diabetes_mellitus"][1];
        //Detail Mortality - Influenza
        var influenzaESQuery = factSheetQueryJSON.detailMortality["influenza"][0];
        var influenzaWonderQuery = factSheetQueryJSON.detailMortality["influenza"][1];
        //Detail Mortality - Nephritis
        var nephritisESQuery = factSheetQueryJSON.detailMortality["nephritis"][0];
        var nephritisWonderQuery = factSheetQueryJSON.detailMortality["nephritis"][1];
        //Detail Mortality - Suicide
        var suicideESQuery = factSheetQueryJSON.detailMortality["suicide"][0];
        var suicideWonderQuery = factSheetQueryJSON.detailMortality["suicide"][1];
        //Detail Mortality - Heart Diseases
        var heartDiseasesESQuery = factSheetQueryJSON.detailMortality["heart_diseases"][0];
        var heartDiseasesWonderQuery = factSheetQueryJSON.detailMortality["heart_diseases"][1];
        //Natality - Brith Rates
        var natality_birthRates_esQuery = factSheetQueryJSON.natality["birthRates"][0];
        var natality_birthRates_populationQuery = factSheetQueryJSON.natality["birthRates"][1];
        //Natality - fertilityRates
        var natality_fertilityRates_esQuery = factSheetQueryJSON.natality["fertilityRates"][0];
        var natality_fertilityRates_populationQuery = factSheetQueryJSON.natality["fertilityRates"][1];
        //Natality - Vaginal
        var natality_vaginal_esQuery = factSheetQueryJSON.natality["vaginal"];
        //Natality - Cesarean
        var natality_cesarean_esQuery = factSheetQueryJSON.natality["cesarean"];
        //Natality - Low Birth Weight (<2500 gms)
        var natality_lowBirthWeight_esQuery = factSheetQueryJSON.natality["lowBirthWeight"];
        //Natality - Twin Birth Rate
        var natality_twinBirth_esQuery = factSheetQueryJSON.natality["twinBirth"];
        //Natality - total 2015 births
        var natality_total_births_esQuery = factSheetQueryJSON.natality["totalBirthsByYear"];

        //Cancer - Mortality - Incident
        var cancer_Breast_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Breast"][0];
        var cancer_Breast_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Breast"][1];
        var cancer_colonAndRectum_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Colon and Rectum"][0];
        var cancer_colonAndRectum_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Colon and Rectum"][1];
        var cancer_lungAndBronchus_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Lung and Bronchus"][0];
        var cancer_lungAndBronchus_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Lung and Bronchus"][1];
        var cancer_melanoma_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Melanoma of the Skin"][0];
        var cancer_melanoma_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Melanoma of the Skin"][1];
        var cancer_cervix_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Cervix Uteri"][0];
        var cancer_cervix_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Cervix Uteri"][1];
        var cancer_ovary_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Ovary"][0];
        var cancer_ovary_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Ovary"][1];
        var cancer_prostate_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Prostate"][0];
        var cancer_prostate_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Prostate"][1];

        //YRBS - Use Alcohol
        //If state 'Arizona' change code to 'AZB' for YRBS,
        if(state && state === 'AZ') {
            factSheetQueryJSON.yrbs["alcohol"].query.sitecode.value = 'AZB';
            Object.keys(factSheetQueryJSON.prams).forEach(function(eachKey){
                factSheetQueryJSON.prams[eachKey].query.sitecode.value = ["AZB"];
            });
        }
        var yrbs_alcohol_stats_query = factSheetQueryJSON.yrbs["alcohol"];
        //BRFSS - 2015 - Overweight and Obesity(BMI), Tobbaco use, Fruits and Vegetables, Alcohol Consumption
        var brfss_2015_query = factSheetQueryJSON.brfss.query_2016;
        //PRAMS - 2009 - Smoking cigarettes during the last three months of pregnancy
        var prams_smoking_query = factSheetQueryJSON.prams['qn30'];
        //PRAMS - 2009 - Females reported physical abuse by husband or partner during pregnancy (percent)
        var prams_physical_abuse_query = factSheetQueryJSON.prams['qn21'];
        //PRAMS - 2009 - Ever breastfed or pump breast milk to feed after delivery
        var prams_breast_milk_feed_query = factSheetQueryJSON.prams['qn5'];
        //PRAMS - 2009 - Indicator of depression 3 months before pregnancy
        var prams_indicator_depression_query = factSheetQueryJSON.prams['qn133'];

        var es = new elasticSearch();
        var promises = [
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.gender_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.nonHispanicRace_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.race_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.hispanic_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.age_population),
            new wonder('D69').invokeWONDER(factSheetQueryJSON.infant_mortality),
            //For Tuberculosis
            es.executeESQuery('owh_tb', 'tb', factSheetQueryJSON.tuberculosis[0]),
            es.aggregateCensusDataQuery(factSheetQueryJSON.tuberculosis[1], 'owh_tb', "tb", 'pop'),
            //For Sexually Transmitted Diseases - chlamydia
            es.executeESQuery('owh_std', 'std', std_chlamydia_esQuery),
            es.aggregateCensusDataQuery(std_chlamydia_populationQuery, 'owh_std', "std", 'pop'),
            //For Sexually Transmitted Diseases - gonorrhea
            es.executeESQuery('owh_std', 'std', std_gonorrhea_esQuery),
            es.aggregateCensusDataQuery(std_gonorrhea_populationQuery, 'owh_std', "std", 'pop'),
            //For Sexually Transmitted Diseases - Primary and Secondary Syphilis
            es.executeESQuery('owh_std', 'std', std_primarySyphilis_esQuery),
            es.aggregateCensusDataQuery(std_primarySyphilis_populationQuery, 'owh_std', "std", 'pop'),
            //For Sexually Transmitted Diseases - Early Latent Syphilis
            es.executeESQuery('owh_std', 'std', std_earlySyphilis_esQuery),
            es.aggregateCensusDataQuery(std_earlySyphilis_populationQuery, 'owh_std', "std", 'pop'),
            //For Sexually Transmitted Diseases - Congenital Syphilis
            es.executeESQuery('owh_std', 'std', std_congSyphilis_esQuery),
            es.aggregateCensusDataQuery(std_congSyphilis_populationQuery, 'owh_std', "std", 'pop'),
            //For AIDS Diagnoses
            es.executeESQuery('owh_aids', 'aids', AIDSDiagnoses_esQuery),
            es.aggregateCensusDataQuery(AIDSDiagnoses_populationQuery, 'owh_aids', "aids", 'pop'),
            //For AIDS Deaths
            es.executeESQuery('owh_aids', 'aids', AIDSDeaths_esQuery),
            es.aggregateCensusDataQuery(AIDSDeaths_populationQuery, 'owh_aids', "aids", 'pop'),
            //For AIDS Prevalence
            es.executeESQuery('owh_aids', 'aids', AIDSPrevalence_esQuery),
            es.aggregateCensusDataQuery(AIDSPrevalence_populationQuery, 'owh_aids', "aids", 'pop'),
            //For HIV Diagnoses
            es.executeESQuery('owh_aids', 'aids', HIVDiagnoses_esQuery),
            es.aggregateCensusDataQuery(HIVDiagnoses_populationQuery, 'owh_aids', "aids", 'pop'),
            //For HIV Prevalence
            es.executeESQuery('owh_aids', 'aids', HIVPrevalence_esQuery),
            es.aggregateCensusDataQuery(HIVPrevalence_populationQuery, 'owh_aids', "aids", 'pop'),
            //Detail Mortality - Malignant Neoplasm
            es.executeMultipleESQueries(malignantNeoplasmESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(malignantNeoplasmWonderQuery),
            //Detail Mortality - alzheimer
            es.executeMultipleESQueries(alzheimerESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(alzheimerWonderQuery),
            //Detail Mortality - accident
            es.executeMultipleESQueries(accidentESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(accidentWonderQuery),
            //Detail Mortality - Cerebrovascular Disease
            es.executeMultipleESQueries(cerebrovascularESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(cerebrovascularWonderQuery),
            //Detail Mortality - Chronic Respiratory
            es.executeMultipleESQueries(chronicRespiratoryESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(chronicRespiratoryWonderQuery),
            //Detail Mortality - Diabetes Mellitus
            es.executeMultipleESQueries(diabetesMellitusESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(diabetesMellitusWonderQuery),
            //Detail Mortality - influenza
            es.executeMultipleESQueries(influenzaESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(influenzaWonderQuery),
            //Detail Mortality - Nephritis
            es.executeMultipleESQueries(nephritisESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(nephritisWonderQuery),
            //Detail Mortality - Suicide
            es.executeMultipleESQueries(suicideESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(suicideWonderQuery),
            //Natality - Birth Rates
            es.executeMultipleESQueries(natality_birthRates_esQuery, 'owh_natality', 'natality'),
            es.aggregateCensusDataQuery(natality_birthRates_populationQuery, 'owh_census_rates', "census_rates", 'pop'),
            //Natality - fertilityRates
            es.executeMultipleESQueries(natality_fertilityRates_esQuery, 'owh_natality', 'natality'),
            es.aggregateCensusDataQuery(natality_fertilityRates_populationQuery, 'owh_census_rates', "census_rates", 'pop'),
            //Natality - Vaginal
            es.executeMultipleESQueries(natality_vaginal_esQuery, 'owh_natality', 'natality'),
            //Natality cesarean
            es.executeMultipleESQueries(natality_cesarean_esQuery, 'owh_natality', 'natality'),
            //Natality Low Birth Weight (<2500 gms)
            es.executeMultipleESQueries(natality_lowBirthWeight_esQuery, 'owh_natality', 'natality'),
            //Natality Twin Birth Rate
            es.executeMultipleESQueries(natality_twinBirth_esQuery, 'owh_natality', 'natality'),
            //Natality total birth population by year
            es.executeMultipleESQueries(natality_total_births_esQuery, 'owh_natality', 'natality'),
            //Cancer - Mortality
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_Breast_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_Breast_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_colonAndRectum_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_colonAndRectum_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_lungAndBronchus_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_lungAndBronchus_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_melanoma_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_melanoma_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_cervix_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_cervix_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_ovary_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_ovary_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_prostate_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_prostate_populationQuery),

            //Cancer - incident
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', cancer_Breast_esQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', cancer_colonAndRectum_esQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', cancer_lungAndBronchus_esQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', cancer_melanoma_esQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', cancer_cervix_esQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', cancer_ovary_esQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', cancer_prostate_esQuery),
            new yrbs().invokeYRBSService(yrbs_alcohol_stats_query),
            //BRFSS - 2015 - Overweight and Obesity(BMI), Tobbaco use, Fruits and Vegetables, Alcohol Consumption
            new yrbs().invokeYRBSService(brfss_2015_query),
            //PRAMS - 2009 - Smoking cigarettes during the last three months of pregnancy
            new yrbs().invokeYRBSService(prams_smoking_query),
            //PRAMS - 2009 - Females reported physical abuse by husband or partner during pregnancy (percent)
            new yrbs().invokeYRBSService(prams_physical_abuse_query),
            //PRAMS - 2009 - Ever breastfed or pump breast milk to feed after delivery
            new yrbs().invokeYRBSService(prams_breast_milk_feed_query),
            //PRAMS - 2009 - Indicator of depression 3 months before pregnancy
            new yrbs().invokeYRBSService(prams_indicator_depression_query),

            //Detail Mortality - Disease of Heart
            es.executeMultipleESQueries(heartDiseasesESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(heartDiseasesWonderQuery)
        ];

        Q.all(promises).then( function (resp) {
            try {

                var genderData = searchUtils.populateDataWithMappings(resp[0], 'bridge_race', 'pop');
                var nonHispanicRaceData = searchUtils.populateDataWithMappings(resp[1], 'bridge_race', 'pop');
                var raceData = searchUtils.populateDataWithMappings(resp[2], 'bridge_race', 'pop');
                var hispanicData = searchUtils.populateDataWithMappings(resp[3], 'bridge_race', 'pop');
                var ageGroupData = searchUtils.populateDataWithMappings(resp[4], 'bridge_race', 'pop');
                //Infant mortality data
                var infantMortalityData = resp[5].table.Total;
                //TB data
                var tbData = searchUtils.populateDataWithMappings(resp[6], 'tb', 'cases');
                es.mergeWithCensusData(tbData, resp[7], undefined, 'pop');
                //STD data
                // For STD - Chlamydia
                var stdChlamydiaData = searchUtils.populateDataWithMappings(resp[8], 'std', 'cases');
                es.mergeWithCensusData(stdChlamydiaData, resp[9], undefined, 'pop');
                searchUtils.applySuppressions(stdChlamydiaData, 'std', 4);
                // For STD - Gonorrhea
                var stdGonorrheaData = searchUtils.populateDataWithMappings(resp[10], 'std', 'cases');
                es.mergeWithCensusData(stdGonorrheaData, resp[11], undefined, 'pop');
                searchUtils.applySuppressions(stdGonorrheaData, 'std', 4);
                // For STD - Primary and Secondary Syphilis
                var stdPrimarySyphilisData = searchUtils.populateDataWithMappings(resp[12], 'std', 'cases');
                es.mergeWithCensusData(stdPrimarySyphilisData, resp[13], undefined, 'pop');
                searchUtils.applySuppressions(stdPrimarySyphilisData, 'std', 4);
                // For STD - Early Latent Syphilis
                var stdEarlySyphilisData = searchUtils.populateDataWithMappings(resp[14], 'std', 'cases');
                es.mergeWithCensusData(stdEarlySyphilisData, resp[15], undefined, 'pop');
                searchUtils.applySuppressions(stdEarlySyphilisData, 'std', 4);
                //For STD - Congenital Syphilis
                var stdCongenitalData = searchUtils.populateDataWithMappings(resp[16], 'std', 'cases');
                es.mergeWithCensusData(stdCongenitalData, resp[17], undefined, 'pop');
                searchUtils.applySuppressions(stdCongenitalData, 'std', 4);
                //For - AIDS Diagnoses
                var AIDSDiagnosesData = searchUtils.populateDataWithMappings(resp[18], 'aids', 'cases');
                es.mergeWithCensusData(AIDSDiagnosesData, resp[19], undefined, 'pop');
                searchUtils.applySuppressions(AIDSDiagnosesData, 'aids', 0);
                //For - AIDS Deaths
                var AIDSDeathsData = searchUtils.populateDataWithMappings(resp[20], 'aids', 'cases');
                es.mergeWithCensusData(AIDSDeathsData, resp[21], undefined, 'pop');
                searchUtils.applySuppressions(AIDSDeathsData, 'aids', 0);
                //For - AIDS Prevalence
                var AIDSPrevalenceData = searchUtils.populateDataWithMappings(resp[22], 'aids', 'cases');
                es.mergeWithCensusData(AIDSPrevalenceData, resp[23], undefined, 'pop');
                searchUtils.applySuppressions(AIDSPrevalenceData, 'aids', 0);
                //For - HIV Diagnoses
                var HIVDiagnosesData = searchUtils.populateDataWithMappings(resp[24], 'aids', 'cases');
                es.mergeWithCensusData(HIVDiagnosesData, resp[25], undefined, 'pop');
                searchUtils.applySuppressions(HIVDiagnosesData, 'aids', 0);
                //For - HIV Prevalence
                var HIVPrevalenceData = searchUtils.populateDataWithMappings(resp[26], 'aids', 'cases');
                es.mergeWithCensusData(HIVPrevalenceData, resp[27], undefined, 'pop');
                searchUtils.applySuppressions(HIVPrevalenceData, 'aids', 0);
                //For - Detail Mortality - malignantNeoplasm
                var malignantNeoplasmData = searchUtils.populateDataWithMappings(resp[28], 'deaths');
                searchUtils.mergeAgeAdjustedRates(malignantNeoplasmData.data.nested.table, resp[29].table);
                searchUtils.applySuppressions(malignantNeoplasmData, 'deaths');
                //For - Detail Mortality - alzheimer
                var alzheimerData = searchUtils.populateDataWithMappings(resp[30], 'deaths');
                searchUtils.mergeAgeAdjustedRates(alzheimerData.data.nested.table, resp[31].table);
                searchUtils.applySuppressions(alzheimerData, 'deaths');
                //For - Detail Mortality - accident
                var accidentData = searchUtils.populateDataWithMappings(resp[32], 'deaths');
                searchUtils.mergeAgeAdjustedRates(accidentData.data.nested.table, resp[33].table);
                searchUtils.applySuppressions(accidentData, 'deaths');
                //For - Detail Mortality - Cerebrovascular Disease
                var cerebrovascularData = searchUtils.populateDataWithMappings(resp[34], 'deaths');
                searchUtils.mergeAgeAdjustedRates(cerebrovascularData.data.nested.table, resp[35].table);
                searchUtils.applySuppressions(cerebrovascularData, 'deaths');
                //For - Detail Mortality - Chronic Respiratory
                var chronicRespiratoryData = searchUtils.populateDataWithMappings(resp[36], 'deaths');
                searchUtils.mergeAgeAdjustedRates(chronicRespiratoryData.data.nested.table, resp[37].table);
                searchUtils.applySuppressions(chronicRespiratoryData, 'deaths');
                //For - Detail Mortality - diabetesMellitus
                var diabetesMellitusData = searchUtils.populateDataWithMappings(resp[38], 'deaths');
                searchUtils.mergeAgeAdjustedRates(diabetesMellitusData.data.nested.table, resp[39].table);
                searchUtils.applySuppressions(diabetesMellitusData, 'deaths');
                //For - Detail Mortality - Influenza
                var influenzaData = searchUtils.populateDataWithMappings(resp[40], 'deaths');
                searchUtils.mergeAgeAdjustedRates(influenzaData.data.nested.table, resp[41].table);
                searchUtils.applySuppressions(influenzaData, 'deaths');
                //For - Detail Mortality - Nephritis
                var nephritisData = searchUtils.populateDataWithMappings(resp[42], 'deaths');
                searchUtils.mergeAgeAdjustedRates(nephritisData.data.nested.table, resp[43].table);
                searchUtils.applySuppressions(nephritisData, 'deaths');
                //For - Detail Mortality - Suicide
                var suicideData = searchUtils.populateDataWithMappings(resp[44], 'deaths');
                searchUtils.mergeAgeAdjustedRates(suicideData.data.nested.table, resp[45].table);
                searchUtils.applySuppressions(suicideData, 'deaths');
                //For - Detail Mortality - Heart Diseases
                var heartDiseaseData = searchUtils.populateDataWithMappings(resp[82], 'deaths');
                searchUtils.mergeAgeAdjustedRates(heartDiseaseData.data.nested.table, resp[83].table);
                searchUtils.applySuppressions(heartDiseaseData, 'deaths');
                //Natality - Birth Rates
                var natality_BirthRates_Data = searchUtils.populateDataWithMappings(resp[46], 'natality');
                es.mergeWithCensusData(natality_BirthRates_Data, resp[47], undefined, 'pop');
                searchUtils.applySuppressions(natality_BirthRates_Data, 'natality');
                //Natality - fertilityRates
                var natality_fertilityRates_Data = searchUtils.populateDataWithMappings(resp[48], 'natality');
                es.mergeWithCensusData(natality_fertilityRates_Data, resp[49], undefined, 'pop');
                searchUtils.applySuppressions(natality_fertilityRates_Data, 'natality');
                //Natality - vaginal
                var natality_vaginal_Data = searchUtils.populateDataWithMappings(resp[50], 'natality');
                searchUtils.applySuppressions(natality_vaginal_Data, 'natality');
                //Natality n- Cesarean
                var natality_cesarean_Data = searchUtils.populateDataWithMappings(resp[51], 'natality');
                searchUtils.applySuppressions(natality_cesarean_Data, 'natality');
                //Natality - Low Birth weight (<2500 gms)
                var natality_lowBirthWeight_Data = searchUtils.populateDataWithMappings(resp[52], 'natality');
                searchUtils.applySuppressions(natality_lowBirthWeight_Data, 'natality');
                //Natality - Twin Birth Rate
                var natality_twinBirth_Data = searchUtils.populateDataWithMappings(resp[53], 'natality');
                searchUtils.applySuppressions(natality_twinBirth_Data, 'natality');
                //Natality - Total birth population by year
                var natality_totalBirthPopulation_Data = searchUtils.populateDataWithMappings(resp[54], 'natality');
                searchUtils.applySuppressions(natality_totalBirthPopulation_Data, 'natality');
                //Cancer - Mortality
                var cancer_mortality_breast_data = searchUtils.populateDataWithMappings(resp[55], 'cancer_mortality');
                var cancer_breast_population = searchUtils.populateDataWithMappings(resp[56], 'cancer_population');
                var cancer_breast_population_index = searchUtils.createPopIndex(cancer_breast_population.data.nested.table, 'cancer_population');
                searchUtils.attachPopulation(cancer_mortality_breast_data.data.nested.table, cancer_breast_population_index, '');
                searchUtils.applySuppressions(cancer_mortality_breast_data, 'cancer_mortality', 16);

                var cancer_mortality_colonAndRectum_data = searchUtils.populateDataWithMappings(resp[57], 'cancer_mortality');
                var cancer_colonAndRectum_population = searchUtils.populateDataWithMappings(resp[58], 'cancer_population');
                var cancer_colonAndRectum_population_index = searchUtils.createPopIndex(cancer_colonAndRectum_population.data.nested.table, 'cancer_population');
                searchUtils.attachPopulation(cancer_mortality_colonAndRectum_data.data.nested.table, cancer_colonAndRectum_population_index, '');
                searchUtils.applySuppressions(cancer_mortality_colonAndRectum_data, 'cancer_mortality', 16);

                var cancer_mortality_lungAndBronchus_data = searchUtils.populateDataWithMappings(resp[59], 'cancer_mortality');
                var cancer_lungAndBronchus_population = searchUtils.populateDataWithMappings(resp[60], 'cancer_population');
                var cancer_lungAndBronchus_population_index = searchUtils.createPopIndex(cancer_lungAndBronchus_population.data.nested.table, 'cancer_population');
                searchUtils.attachPopulation(cancer_mortality_lungAndBronchus_data.data.nested.table, cancer_lungAndBronchus_population_index, '');
                searchUtils.applySuppressions(cancer_mortality_lungAndBronchus_data, 'cancer_mortality', 16);

                var cancer_mortality_melanoma_data = searchUtils.populateDataWithMappings(resp[61], 'cancer_mortality');
                var cancer_melanoma_population = searchUtils.populateDataWithMappings(resp[62], 'cancer_population');
                var cancer_melanoma_population_index = searchUtils.createPopIndex(cancer_melanoma_population.data.nested.table, 'cancer_population');
                searchUtils.attachPopulation(cancer_mortality_melanoma_data.data.nested.table, cancer_melanoma_population_index, '');
                searchUtils.applySuppressions(cancer_mortality_melanoma_data, 'cancer_mortality', 16);

                var cancer_mortality_cervix_data = searchUtils.populateDataWithMappings(resp[63], 'cancer_mortality');
                var cancer_cervix_population = searchUtils.populateDataWithMappings(resp[64], 'cancer_population');
                var cancer_cervix_population_index = searchUtils.createPopIndex(cancer_cervix_population.data.nested.table, 'cancer_population')
                searchUtils.attachPopulation(cancer_mortality_cervix_data.data.nested.table, cancer_cervix_population_index, '');
                searchUtils.applySuppressions(cancer_mortality_cervix_data, 'cancer_mortality', 16);

                var cancer_mortality_ovary_data = searchUtils.populateDataWithMappings(resp[65], 'cancer_mortality');
                var cancer_ovary_population = searchUtils.populateDataWithMappings(resp[66], 'cancer_population');
                var cancer_ovary_population_index = searchUtils.createPopIndex(cancer_ovary_population.data.nested.table, 'cancer_population');
                searchUtils.attachPopulation(cancer_mortality_ovary_data.data.nested.table, cancer_ovary_population_index, '');
                searchUtils.applySuppressions(cancer_mortality_ovary_data, 'cancer_mortality', 16);

                var cancer_mortality_prostate_data = searchUtils.populateDataWithMappings(resp[67], 'cancer_mortality');
                var cancer_prostate_population = searchUtils.populateDataWithMappings(resp[68], 'cancer_population');
                var cancer_prostate_population_index = searchUtils.createPopIndex(cancer_prostate_population.data.nested.table, 'cancer_population');
                searchUtils.attachPopulation(cancer_mortality_prostate_data.data.nested.table, cancer_prostate_population_index, '');
                searchUtils.applySuppressions(cancer_mortality_ovary_data, 'cancer_mortality', 16);

                //Merge all Cancer mortality sites data
                var cancer_mortality_data = cancer_mortality_breast_data;
                cancer_mortality_data.data.nested.table.current_year.push.apply(cancer_mortality_data.data.nested.table.current_year, cancer_mortality_colonAndRectum_data.data.nested.table.current_year);
                cancer_mortality_data.data.nested.table.current_year.push.apply(cancer_mortality_data.data.nested.table.current_year, cancer_mortality_lungAndBronchus_data.data.nested.table.current_year);
                cancer_mortality_data.data.nested.table.current_year.push.apply(cancer_mortality_data.data.nested.table.current_year, cancer_mortality_melanoma_data.data.nested.table.current_year);
                cancer_mortality_data.data.nested.table.current_year.push.apply(cancer_mortality_data.data.nested.table.current_year, cancer_mortality_cervix_data.data.nested.table.current_year);
                cancer_mortality_data.data.nested.table.current_year.push.apply(cancer_mortality_data.data.nested.table.current_year, cancer_mortality_ovary_data.data.nested.table.current_year);
                cancer_mortality_data.data.nested.table.current_year.push.apply(cancer_mortality_data.data.nested.table.current_year, cancer_mortality_prostate_data.data.nested.table.current_year);
                //Cancer - Incident
                var rules = searchUtils.createCancerIncidenceSuppressionRules(['2014'], true, false);
                var cancer_incident_breast_data = searchUtils.populateDataWithMappings(resp[69], 'cancer_incidence');
                searchUtils.attachPopulation(cancer_incident_breast_data.data.nested.table, cancer_breast_population_index, '');
                searchUtils.applySuppressions(cancer_incident_breast_data, 'cancer_incidence', 16);
                searchUtils.applyCustomSuppressions(cancer_incident_breast_data.data.nested, rules, 'cancer_incidence');
                var cancer_incident_colonAndRectum_data = searchUtils.populateDataWithMappings(resp[70], 'cancer_incidence');
                searchUtils.attachPopulation(cancer_incident_colonAndRectum_data.data.nested.table, cancer_colonAndRectum_population_index, '');
                searchUtils.applySuppressions(cancer_incident_colonAndRectum_data, 'cancer_incidence', 16);
                searchUtils.applyCustomSuppressions(cancer_incident_colonAndRectum_data.data.nested, rules, 'cancer_incidence');
                var cancer_incident_lungAndBronchus_data = searchUtils.populateDataWithMappings(resp[71], 'cancer_incidence');
                searchUtils.attachPopulation(cancer_incident_lungAndBronchus_data.data.nested.table, cancer_lungAndBronchus_population_index, '');
                searchUtils.applySuppressions(cancer_incident_lungAndBronchus_data, 'cancer_incidence', 16);
                searchUtils.applyCustomSuppressions(cancer_incident_lungAndBronchus_data.data.nested, rules, 'cancer_incidence');
                var cancer_incident_melanoma_data = searchUtils.populateDataWithMappings(resp[72], 'cancer_incidence');
                searchUtils.attachPopulation(cancer_incident_melanoma_data.data.nested.table, cancer_melanoma_population_index, '');
                searchUtils.applySuppressions(cancer_incident_melanoma_data, 'cancer_incidence', 16);
                searchUtils.applyCustomSuppressions(cancer_incident_melanoma_data.data.nested, rules, 'cancer_incidence');
                var cancer_incident_cervix_data = searchUtils.populateDataWithMappings(resp[73], 'cancer_incidence');
                searchUtils.attachPopulation(cancer_incident_cervix_data.data.nested.table, cancer_cervix_population_index, '');
                searchUtils.applySuppressions(cancer_incident_cervix_data, 'cancer_incidence', 16);
                searchUtils.applyCustomSuppressions(cancer_incident_cervix_data.data.nested, rules, 'cancer_incidence');
                var cancer_incident_ovary_data = searchUtils.populateDataWithMappings(resp[74], 'cancer_incidence');
                searchUtils.attachPopulation(cancer_incident_ovary_data.data.nested.table, cancer_ovary_population_index, '');
                searchUtils.applySuppressions(cancer_incident_ovary_data, 'cancer_incidence', 16);
                searchUtils.applyCustomSuppressions(cancer_incident_ovary_data.data.nested, rules, 'cancer_incidence');
                var cancer_incident_prostate_data = searchUtils.populateDataWithMappings(resp[75], 'cancer_incidence');
                searchUtils.attachPopulation(cancer_incident_prostate_data.data.nested.table, cancer_prostate_population_index, '');
                searchUtils.applySuppressions(cancer_incident_prostate_data, 'cancer_incidence', 16);
                searchUtils.applyCustomSuppressions(cancer_incident_prostate_data.data.nested, rules, 'cancer_incidence');
                //Merge all Cancer incident sites data
                var cancer_incident_data = cancer_incident_breast_data;
                cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_colonAndRectum_data.data.nested.table.current_year);
                cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_lungAndBronchus_data.data.nested.table.current_year);
                cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_melanoma_data.data.nested.table.current_year);
                cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_cervix_data.data.nested.table.current_year);
                cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_ovary_data.data.nested.table.current_year);
                cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_prostate_data.data.nested.table.current_year);
                //YRBS - Alcohol
                var yrbs_alchohol_data = resp[76];
                //BRFSS - 2015 - Overweight and Obesity(BMI), Tobbaco use, Fruits and Vegetables, Alcohol Consumption
                var brfss_2015_data = resp[77];
                //PRAMS - 2009 - Smoking cigarettes during the last three months of pregnancy
                var prams_smoking_data = resp[78];
                //PRAMS - 2009 - Females reported physical abuse by husband or partner during pregnancy (percent)
                var prams_physical_abuse_data = resp[79];
                //PRAMS - 2009 - Ever breastfed or pump breast milk to feed after delivery
                var prams_breast_milk_feed_data = resp[80];
                //PRAMS - 2009 - Indicator of depression 3 months before pregnancy
                var prams_indicator_depression_data = resp[81];

                var factSheet = prepareFactSheetForPopulation(genderData, nonHispanicRaceData,
                    raceData, hispanicData, ageGroupData, fsType);
                factSheet.state = state;
                factSheet.fsType = fsType;
                factSheet.infantMortalityData = infantMortalityData;
                factSheet.tuberculosis = prepareDiseaseData(tbData, 'tb');
                factSheet.stdData = [{disease: "Chlamydia", data: prepareDiseaseData(stdChlamydiaData, 'std')},
                    {disease: "Gonorrhea", data: prepareDiseaseData(stdGonorrheaData, 'std')},
                    {
                        disease: "Primary and Secondary Syphilis",
                        data: prepareDiseaseData(stdPrimarySyphilisData, 'std')
                    },
                    {disease: "Early Latent Syphilis", data: prepareDiseaseData(stdEarlySyphilisData, 'std')}];

                factSheet.hivAIDSData = [{
                    disease: "AIDS Diagnoses",
                    data: prepareDiseaseData(AIDSDiagnosesData, 'aids')
                },
                    {disease: "AIDS Deaths", data: prepareDiseaseData(AIDSDeathsData, 'aids')},
                    {disease: "AIDS Prevalence", data: prepareDiseaseData(AIDSPrevalenceData, 'aids')},
                    {disease: "HIV Diagnoses", data: prepareDiseaseData(HIVDiagnosesData, 'aids')},
                    {disease: "HIV Prevalence", data: prepareDiseaseData(HIVPrevalenceData, 'aids')}];
                factSheet.detailMortalityData = [
                    {causeOfDeath: "Diseases of heart", data: heartDiseaseData.data.nested.table.year[0]},
                    {causeOfDeath: "Malignant neoplasms", data: malignantNeoplasmData.data.nested.table.year[0]},
                    {
                        causeOfDeath: "Chronic lower respiratory diseases",
                        data: chronicRespiratoryData.data.nested.table.year[0]
                    },
                    {causeOfDeath: "Accidents (unintentional injuries)", data: accidentData.data.nested.table.year[0]},
                    {causeOfDeath: "Cerebrovascular diseases", data: cerebrovascularData.data.nested.table.year[0]},
                    {causeOfDeath: "Alzheimer's disease", data: alzheimerData.data.nested.table.year[0]},
                    {causeOfDeath: "Diabetes mellitus", data: diabetesMellitusData.data.nested.table.year[0]},
                    {causeOfDeath: "Influenza and pneumonia", data: influenzaData.data.nested.table.year[0]},
                    {
                        causeOfDeath: "Nephritis, nephrotic syndrome and nephrosis",
                        data: nephritisData.data.nested.table.year[0]
                    },
                    {causeOfDeath: "Intentional self-harm (suicide)", data: suicideData.data.nested.table.year[0]}];
                factSheet.natalityData = prepareNatalityData(natality_BirthRates_Data, natality_fertilityRates_Data, natality_vaginal_Data,
                    natality_cesarean_Data, natality_lowBirthWeight_Data, natality_twinBirth_Data, natality_totalBirthPopulation_Data);
                factSheet.cancerData = prepareCancerData(cancer_mortality_data, cancer_incident_data);
                factSheet.yrbs = prepareYRBSData(yrbs_alchohol_data);
                factSheet.brfss = prepareBRFSSData(brfss_2015_data);
                factSheet.prams = preparePRAMSData([prams_smoking_data, prams_physical_abuse_data, prams_breast_milk_feed_data, prams_indicator_depression_data]);
                deferred.resolve(factSheet);
            } catch(error) {
                console.log('Error occured in factsheet processing.');
                logger.error(error);
                deferred.reject("Error occured in factsheet processing.");
            }
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    return deferred.promise;
};

/**
 * To prepare PRAMS data
 * @param pregnantWomenData
 * @param womenData
 * @return {{pregnantWoment: [], women: []}}
 */
function preparePRAMSData(pramsData) {
    if(pramsData) {
        return [
            {"question": "Smoking cigarettes during the last three months of pregnancy",
                data: (pramsData[0].table.question[0] && pramsData[0].table.question[0].yes &&
                    pramsData[0].table.question[0].yes.sitecode) ?
                    getMeanDisplayValue(pramsData[0].table.question[0].yes.sitecode[0].prams.mean) : "Not applicable"},
            {"question": "Females reported physical abuse by husband or partner during pregnancy",
                data: (pramsData[1].table.question[0] && pramsData[1].table.question[0].yes &&
                pramsData[1].table.question[0].yes.sitecode) ?
                    getMeanDisplayValue(pramsData[1].table.question[0].yes.sitecode[0].prams.mean): "Not applicable"},
            {"question": "Ever breastfed or pump breast milk to feed after delivery",
                data: (pramsData[2].table.question[0] && pramsData[2].table.question[0].yes &&
                    pramsData[2].table.question[0].yes.sitecode) ?
                    getMeanDisplayValue(pramsData[2].table.question[0].yes.sitecode[0].prams.mean) : "Not applicable"},
            {"question": "Indicator of depression 3 months before pregnancy",
                data: (pramsData[3].table.question[0] && pramsData[3].table.question[0].yes &&
                    pramsData[3].table.question[0].yes.sitecode) ?
                    getMeanDisplayValue(pramsData[3].table.question[0].yes.sitecode[0].prams.mean) : "Not applicable"}
        ];
    } else
        return [];
}

function getMeanDisplayValue(data) {
    var displayValue;
    if (data) {
        if (data === 'suppressed') {
            displayValue = 'Suppressed';
        }
        else if (data === 'na') {
            displayValue = 'NR';
        }
        else {
            displayValue = data + "%";
        }
    }
    return displayValue;
}
/**
 * To prepare BRFSS data
 * @param data_2015
 * @param data_2009
 * @return BRFSS data array
 */
function prepareBRFSSData(data_2015){
    var brfssData = [];
    brfssData.push({question: 'Obese (Body Mass Index 30.0 - 99.8)', data: 'Not applicable' });
    brfssData.push({question: 'Do you have any kind of health care coverage?', data: 'Not applicable'});
    brfssData.push({question: 'Adults who have been told they have high blood pressure (variable calculated from one or more BRFSS questions)', data: 'Not applicable'});
    brfssData.push({question: 'Participated in 150 minutes or more of Aerobic Physical Activity per week', data: 'Not applicable'});
    data_2015.table.question.forEach(function(eachRecord){
        switch(eachRecord.name){
            case "_bmi5cat":
                if(eachRecord["obese (bmi 30.0 - 99.8)"]) brfssData[0].data = getMeanDisplayValue(eachRecord["obese (bmi 30.0 - 99.8)"].brfss.mean);
                break;
            case "hlthpln1":
                if(eachRecord.yes) brfssData[1].data = getMeanDisplayValue(eachRecord.yes.brfss.mean);
                break;
            case "x_rfhype5":
                if(eachRecord["meet criteria for heavy drinking"]) brfssData[2].data = getMeanDisplayValue(eachRecord["meet criteria for heavy drinking"].brfss.mean);
                break;
            case "_paindx1":
                if(eachRecord.yes) brfssData[3].data = getMeanDisplayValue(eachRecord.yes.brfss.mean);
                break;
        }
    });
    return brfssData;
}

/**
 * To prepare YRBS data
 * @param data
 * @return YRBS data array
 */
function prepareYRBSData(data) {
    var yrbsData = [];
    yrbsData.push({"question": "Currently use alcohol", data:data.table.question[0] && data.table.question[0].Yes ? getMeanDisplayValue(data.table.question[0].Yes.mental_health.mean) : "Not applicable"});
    yrbsData.push({"question": "Currently use cigarettes", data:data.table.question[1] && data.table.question[1].Yes ? getMeanDisplayValue(data.table.question[1].Yes.mental_health.mean) : "Not applicable"});
    yrbsData.push({"question": "Currently use marijuana", data:data.table.question[2] && data.table.question[2].Yes ? getMeanDisplayValue(data.table.question[2].Yes.mental_health.mean) : "Not applicable"});
    yrbsData.push({"question": "Currently sexually active", data:data.table.question[3] && data.table.question[3].Yes ? getMeanDisplayValue(data.table.question[3].Yes.mental_health.mean) : "Not applicable"});
    yrbsData.push({"question": "Attempted suicide", data:data.table.question[4] && data.table.question[4].Yes ? getMeanDisplayValue(data.table.question[4].Yes.mental_health.mean) : "Not applicable"});
    yrbsData.push({"question": "Overweight", data:data.table.question[5] && data.table.question[5].Yes ? getMeanDisplayValue(data.table.question[5].Yes.mental_health.mean) : "Not applicable"});
    yrbsData.push({"question": "Obese", data:data.table.question[6] && data.table.question[6].Yes ? getMeanDisplayValue(data.table.question[6].Yes.mental_health.mean) : "Not applicable"});
    return yrbsData;
}

/**
 * To prepare CancerData
 * @param cancerMortalityData
 * @param cancerIncidentData
 * @return Cancer data array
 */
function prepareCancerData(cancerMortalityData, cancerIncidentData) {
    var cancerData = [];
    cancerMortalityData.data.nested.table.current_year.forEach(function(eachRecord, index){
        var crudeMortalityRate;
        var cancerMortalityDeathCounts;
        var incidentData;
        var crudeIncidentRate;
        if(eachRecord.cancer_mortality === 'suppressed') {
            cancerMortalityDeathCounts = 'Suppressed';
            crudeMortalityRate = 'Suppressed';
        }
        else if(eachRecord.cancer_mortality < 20) {
            cancerMortalityDeathCounts = eachRecord.cancer_mortality;
            crudeMortalityRate = 'Unreliable';
        }
        else {
            cancerMortalityDeathCounts = eachRecord.cancer_mortality;
            crudeMortalityRate = eachRecord.pop != 'n/a' ? Math.round(cancerMortalityDeathCounts / eachRecord.pop * 1000000) / 10 : "Not available";
        }
        incidentData = cancerIncidentData.data.nested.table.current_year[index] ? cancerIncidentData.data.nested.table.current_year[index] : {
            cancer_incidence: 'Not available',
            pop: 'n/a'
        };
        if(incidentData.cancer_incidence === 'suppressed'){
            incidentData.cancer_incidence = 'Suppressed';
            crudeIncidentRate = 'Suppressed';
        }
        else if(incidentData.cancer_incidence < 20) {
            crudeIncidentRate = 'Unreliable';
        }
        else {
            crudeIncidentRate = incidentData.pop != 'n/a' ? Math.round(incidentData.cancer_incidence / incidentData.pop * 1000000) / 10 : "Not available";
        }
        switch(index){
            case 0:
                cancerData.push({site:'Breast', pop: eachRecord.pop, count: incidentData.cancer_incidence, incident_rate: crudeIncidentRate,  deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 1:
                cancerData.push({site:'Colon and Rectum', pop: eachRecord.pop, count: incidentData.cancer_incidence, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 2:
                cancerData.push({site:'Lung and Bronchus', pop: eachRecord.pop, count: incidentData.cancer_incidence, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 3:
                cancerData.push({site:'Melanoma of the Skin', pop: eachRecord.pop, count: incidentData.cancer_incidence, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 4:
                cancerData.push({site:'Cervix Uteri†', pop: eachRecord.pop, count: incidentData.cancer_incidence, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 5:
                cancerData.push({site:'Ovary†', pop: eachRecord.pop, count: incidentData.cancer_incidence, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 6:
                cancerData.push({site:'Prostate††', pop: eachRecord.pop, count: incidentData.cancer_incidence, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
        }
    });
    var sortFn = function (a, b){
        if (a.site > b.site) { return 1; }
        if (a.site < b.site) { return -1; }
        return 0;
    };
    return cancerData.sort(sortFn);
}


/**
 *  To prepare natality data
 * @param natalityBirthData
 * @param natalityFertilityData
 * @return Natality data json
 */
function prepareNatalityData(natalityBirthData, natalityFertilityData, vaginalData, cesareanData, lowBirthWeightData, twinBirthData, totalBirthsData) {
    var natalityBirthDataForYear = natalityBirthData.data.nested.table.current_year[0];
    var natalityFertilityDataForYear = natalityFertilityData.data.nested.table.current_year[0];
    var totalBirthPopulationByYear = totalBirthsData.data.nested.table.current_year[0].natality;
    var natalityData = {};
    natalityData.births = natalityBirthDataForYear.natality;
    natalityData.population = natalityBirthDataForYear.pop;
    if(natalityBirthDataForYear.natality === 'suppressed') {
        natalityData.birthRate = 'Suppressed';
    }
    else {
        natalityData.birthRate = natalityBirthDataForYear.pop ? Math.round(natalityBirthDataForYear.natality / natalityBirthDataForYear.pop * 1000000) / 10 : 0;
    }
    natalityData.femalePopulation = natalityFertilityDataForYear.pop;
    if(natalityFertilityDataForYear.natality === 'suppressed') {
        natalityData.fertilityRate = 'Suppressed';
    }
    else {
        natalityData.fertilityRate = natalityFertilityDataForYear.pop ? Math.round(natalityFertilityDataForYear.natality / natalityFertilityDataForYear.pop * 1000000) / 10 : 0;
    }
    if(vaginalData.data.nested.table.current_year[0].natality === 'suppressed') {
        natalityData.vaginalRate = 'Suppressed';
    }
    else {
        natalityData.vaginalRate = totalBirthPopulationByYear ? parseFloat(vaginalData.data.nested.table.current_year[0].natality / totalBirthPopulationByYear * 100).toFixed(2) + "%" : 0;
    }
    if(cesareanData.data.nested.table.current_year[0].natality === 'suppressed') {
        natalityData.cesareanRate = 'Suppressed';
    }
    else {
        natalityData.cesareanRate = totalBirthPopulationByYear ? parseFloat(cesareanData.data.nested.table.current_year[0].natality / totalBirthPopulationByYear * 100).toFixed(2) + "%" : 0;
    }
    if(lowBirthWeightData.data.nested.table.current_year[0].natality === 'suppressed') {
        natalityData.lowBirthWeightRate = 'Suppressed';
    }
    else {
        natalityData.lowBirthWeightRate = totalBirthPopulationByYear ? parseFloat(lowBirthWeightData.data.nested.table.current_year[0].natality / totalBirthPopulationByYear * 100).toFixed(2) + "%" : 0;
    }
    if(twinBirthData.data.nested.table.current_year[0].natality === 'suppressed') {
        natalityData.twinBirthRate = 'Suppressed';
    }
    else {
        natalityData.twinBirthRate = totalBirthPopulationByYear ? parseFloat(twinBirthData.data.nested.table.current_year[0].natality / totalBirthPopulationByYear * 1000).toFixed(1) + " per 1,000 births" : 0;
    }
    return natalityData;
}


/**
 * Prepare disease data
 * @param data
 * @param countKey
 */
function prepareDiseaseData(data, countKey) {
    var tbData = data.data.nested.table.race;
    tbData.forEach(function(record, index){
        if(record[countKey] === 0) {
            record['displayValue'] = 0;
        }
        else if(record[countKey] === 'na') {
            record['displayValue'] = 'Not available';
        }
        else if(record[countKey] === 'suppressed') {
            record['displayValue'] = 'Suppressed';
        }
        else {
            var rate = record['pop'] ? Math.round(record[countKey] / record['pop'] * 1000000) / 10 : 0;
            record['displayValue'] = formatNumber(record[countKey]);
            record['rate'] = rate.toFixed(1);
        }
        //Delete un wanted properties from JSON
        delete record[countKey];
        //Remove population property except All races population
        index != 0 && delete record['pop'];
    });
    return tbData;
}

/**
 * To format number
 * @param num
 */
function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function prepareFactSheetForPopulation(genderData, nonHispanicRaceData,
                                       raceData, hispanicData, ageGroupData, fsType) {
    var factSheet = {};
    factSheet.gender = genderData.data.simple.group_table_sex;
    if(fsType != "Women's Health") {
        factSheet.totalGenderPop = 0;
        factSheet.gender.forEach(function (data) {
            factSheet.totalGenderPop += data.bridge_race;
        });
    }

    var race = nonHispanicRaceData.data.simple.group_table_race;
    race = race.concat(raceData.data.simple.group_table_race, hispanicData.data.simple.group_table_ethnicity);

    factSheet.race = race;

    factSheet.ageGroups = [];

    ageGroupData = ageGroupData.data.simple.group_table_agegroup;
    var ageGroups15to44 = ['15-19 years', '20-24 years', '25-29 years', '30-34 years',
        '35-39 years', '40-44 years'];

    var ageGroups45to64 = ['45-49 years', '50-54 years', '55-59 years', '60-64 years'];
    var ageGroups65to84 = ['65-69 years', '70-74 years', '75-79 years', '80-84 years'];

    var count15to44 = {"15-44 years" : [{ name:'15-19 years' }, { name:'20-44 years' }]};
    var count20to44 = 0;
    var count45to64 = 0;
    var count65to84 = 0;

    ageGroupData.forEach(function (data) {
        if (ageGroups15to44.indexOf(data.name) !== -1) {
            if (data.name === '15-19 years') {
                count15to44["15-44 years"][0].bridge_race = data.bridge_race;
            } else {
                count20to44 += data.bridge_race;
            }
        } else if(ageGroups45to64.indexOf(data.name) !== -1) {
            count45to64 += data.bridge_race;
        } else if (ageGroups65to84.indexOf(data.name) !== -1) {
            count65to84 += data.bridge_race;
        } else {
            factSheet.ageGroups.push(data);
        }
    });
    count15to44["15-44 years"][1].bridge_race = count20to44;
    factSheet.ageGroups.splice(1, 0, count15to44);
    factSheet.ageGroups.splice(2, 0, {name:'45-64 years', bridge_race: count45to64});
    factSheet.ageGroups.splice(3, 0, {name:'65-84 years', bridge_race: count65to84});
    return factSheet;
}

module.exports = FactSheet;