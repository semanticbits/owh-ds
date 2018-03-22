var elasticSearch = require('../models/elasticSearch');
var yrbs = require("../api/yrbs");
var queryBuilder = require('../api/elasticQueryBuilder');
var factSheetQueries = require('../json/factsheet-queries.json');
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
    var factSheetQueryString = JSON.stringify(factSheetQueries[fsType]);
    var factSheetQueryJSON;
    factSheetQueryJSON = JSON.parse(factSheetQueryString.split("$state$").join(state));
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
        //Detail Mortality - C50-C50
        var c50_esQuery = factSheetQueryJSON.detailMortality["C50-C50"][0];
        var c50_wonderQuery = factSheetQueryJSON.detailMortality["C50-C50"][1];
        //Detail Mortality - C00-C97
        var c00_c97_esQuery = factSheetQueryJSON.detailMortality["C00-C97"][0];
        var c00_c97_wonderQuery = factSheetQueryJSON.detailMortality["C00-C97"][1];
        //Detail Mortality - C53
        var c53_esQuery = factSheetQueryJSON.detailMortality["C53"][0];
        var c53_wonderQuery = factSheetQueryJSON.detailMortality["C53"][1];
        //Detail Mortality - I160-I169
        var i160_i169_esQuery = factSheetQueryJSON.detailMortality["I160-I169"][0];
        var i160_i169_wonderQuery = factSheetQueryJSON.detailMortality["I160-I169"][1];
        //Detail Mortality - J40-J47 and J60
        var j40_j47_j60_esQuery = factSheetQueryJSON.detailMortality["J40-47-60"][0];
        var j40_j47_j60_wonderQuery = factSheetQueryJSON.detailMortality["J40-47-60"][1];
        //Detail Mortality - drug-induced
        var drug_induced_esQuery = factSheetQueryJSON.detailMortality["drug-induced"][0];
        var drug_induced_wonderQuery = factSheetQueryJSON.detailMortality["drug-induced"][1];
        //Detail Mortality - Suicide
        var suicide_esQuery = factSheetQueryJSON.detailMortality["Suicide"][0];
        var suicide_wonderQuery = factSheetQueryJSON.detailMortality["Suicide"][1];
        //Detail Mortality - Homicide
        var homicide_esQuery = factSheetQueryJSON.detailMortality["Homicide"][0];
        var homicide_wonderQuery = factSheetQueryJSON.detailMortality["Homicide"][1];
        //Detail Mortality - B20-B24
        var b20_b24_esQuery = factSheetQueryJSON.detailMortality["B20-B24"][0];
        var b20_b24_wonderQuery = factSheetQueryJSON.detailMortality["B20-B24"][1];
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
        if(state === 'AZ') {
            factSheetQueryJSON.yrbs["alcohol"].query.sitecode.value = 'AZB';
            Object.keys(factSheetQueryJSON.prams["Pregnant women"]).forEach(function(eachKey){
                factSheetQueryJSON.prams["Pregnant women"][eachKey].query.sitecode.value = ["AZB"];
            });
            Object.keys(factSheetQueryJSON.prams["Women"]).forEach(function(eachKey){
                factSheetQueryJSON.prams["Women"][eachKey].query.sitecode.value = ["AZB"];
            });
        }
        var yrbs_alcohol_stats_query = factSheetQueryJSON.yrbs["alcohol"];
        //BRFSS - 2015 - Overweight and Obesity(BMI), Tobbaco use, Fruits and Vegetables, Alcohol Consumption
        var brfss_2015_query = factSheetQueryJSON.brfss.query_2015;
        //PRAMS - 2009 - Smoking cigarettes during the last three months of pregnancy
        var prams_smoking_query = factSheetQueryJSON.prams['Pregnant women']['qn30'];
        //PRAMS - 2009 - Intended pregnancy
        var prams_intended_pregnancy_query = factSheetQueryJSON.prams['Pregnant women']['qn16'];
        //PRAMS - 2009 - Females reported physical abuse by husband or partner during pregnancy (percent)
        var prams_physical_abuse_query = factSheetQueryJSON.prams['Pregnant women']['qn21'];
        //PRAMS - 2009 - With one or more previous live births who reported unintended pregnancy
        var prams_live_birth_unintended_query = factSheetQueryJSON.prams['Women']['qn16'];
        //PRAMS - 2009 - Ever breastfed or pump breast milk to feed after delivery
        var prams_breast_milk_feed_query = factSheetQueryJSON.prams['Women']['qn5'];
        //PRAMS - 2009 - Indicator of depression 3 months before pregnancy
        var prams_indicator_depression_query = factSheetQueryJSON.prams['Women']['qn133'];

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
            //For HIV Deaths
            es.executeESQuery('owh_aids', 'aids', HIVDeaths_esQuery),
            es.aggregateCensusDataQuery(HIVDeaths_populationQuery, 'owh_aids', "aids", 'pop'),
            //For HIV Prevalence
            es.executeESQuery('owh_aids', 'aids', HIVPrevalence_esQuery),
            es.aggregateCensusDataQuery(HIVPrevalence_populationQuery, 'owh_aids', "aids", 'pop'),
            //Detail Mortality - Total ages
            es.executeMultipleESQueries(mortality_total_esQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(mortality_total_wonderQuery),
            //Detail Mortality - C00-C97
            es.executeMultipleESQueries(c00_c97_esQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(c00_c97_wonderQuery),
            //Detail Mortality - C50-C50
            es.executeMultipleESQueries(c50_esQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(c50_wonderQuery),
            //Detail Mortality - C53
            es.executeMultipleESQueries(c53_esQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(c53_wonderQuery),
            //Detail Mortality - I160-I169
            es.executeMultipleESQueries(i160_i169_esQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(i160_i169_wonderQuery),
            //Detail Mortality - J40-J47 and J60
            es.executeMultipleESQueries(j40_j47_j60_esQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(j40_j47_j60_wonderQuery),
            //Detail Mortality - Drug induced
            es.executeMultipleESQueries(drug_induced_esQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(drug_induced_wonderQuery),
            //Detail Mortality - Suicide
            es.executeMultipleESQueries(suicide_esQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(suicide_wonderQuery),
            //Detail Mortality - Homicide
            es.executeMultipleESQueries(homicide_esQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(homicide_wonderQuery),
            //Detail Mortality - B20-B24
            es.executeMultipleESQueries(b20_b24_esQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(b20_b24_wonderQuery),
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
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_Breast_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_colonAndRectum_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_lungAndBronchus_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_melanoma_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_cervix_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_ovary_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_prostate_esQuery),
            new yrbs().invokeYRBSService(yrbs_alcohol_stats_query),
            //BRFSS - 2015 - Overweight and Obesity(BMI), Tobbaco use, Fruits and Vegetables, Alcohol Consumption
            new yrbs().invokeYRBSService(brfss_2015_query),
            //PRAMS - 2009 - Smoking cigarettes during the last three months of pregnancy
            new yrbs().invokeYRBSService(prams_smoking_query),
            //PRAMS - 2009 - Intended pregnancy
            new yrbs().invokeYRBSService(prams_intended_pregnancy_query),
            //PRAMS - 2009 - Females reported physical abuse by husband or partner during pregnancy (percent)
            new yrbs().invokeYRBSService(prams_physical_abuse_query),
            //PRAMS - 2009 - With one or more previous live births who reported unintended pregnancy
            new yrbs().invokeYRBSService(prams_live_birth_unintended_query),
            //PRAMS - 2009 - Ever breastfed or pump breast milk to feed after delivery
            new yrbs().invokeYRBSService(prams_breast_milk_feed_query),
            //PRAMS - 2009 - Indicator of depression 3 months before pregnancy
            new yrbs().invokeYRBSService(prams_indicator_depression_query)
        ];

        Q.all(promises).then( function (resp) {
            var genderData = searchUtils.populateDataWithMappings(resp[0], 'bridge_race', 'pop');
            var nonHispanicRaceData = searchUtils.populateDataWithMappings(resp[1], 'bridge_race', 'pop');
            var raceData = searchUtils.populateDataWithMappings(resp[2], 'bridge_race', 'pop');
            var hispanicData = searchUtils.populateDataWithMappings(resp[3], 'bridge_race', 'pop');
            var ageGroupData = searchUtils.populateDataWithMappings(resp[4], 'bridge_race', 'pop');
            //Infant mortality data
            var infantMortalityData = resp[5].table.Total;
            //TB data
            var tbData = searchUtils.populateDataWithMappings(resp[6], 'tb' , 'cases');
            es.mergeWithCensusData(tbData, resp[7], 'pop');
            //STD data
            // For STD - Chlamydia
            var stdChlamydiaData = searchUtils.populateDataWithMappings(resp[8], 'std' , 'cases');
            es.mergeWithCensusData(stdChlamydiaData, resp[9], 'pop');
            searchUtils.applySuppressions(stdChlamydiaData, 'std', 4);
            // For STD - Gonorrhea
            var stdGonorrheaData = searchUtils.populateDataWithMappings(resp[10], 'std' , 'cases');
            es.mergeWithCensusData(stdGonorrheaData, resp[11], 'pop');
            searchUtils.applySuppressions(stdGonorrheaData, 'std', 4);
            // For STD - Primary and Secondary Syphilis
            var stdPrimarySyphilisData = searchUtils.populateDataWithMappings(resp[12], 'std' , 'cases');
            es.mergeWithCensusData(stdPrimarySyphilisData, resp[13], 'pop');
            searchUtils.applySuppressions(stdPrimarySyphilisData, 'std', 4);
            // For STD - Early Latent Syphilis
            var stdEarlySyphilisData = searchUtils.populateDataWithMappings(resp[14], 'std' , 'cases');
            es.mergeWithCensusData(stdEarlySyphilisData, resp[15], 'pop');
            searchUtils.applySuppressions(stdEarlySyphilisData, 'std', 4);
            //For STD - Congenital Syphilis
            var stdCongenitalData = searchUtils.populateDataWithMappings(resp[16], 'std' , 'cases');
            es.mergeWithCensusData(stdCongenitalData, resp[17], 'pop');
            searchUtils.applySuppressions(stdCongenitalData, 'std', 4);
            //For - AIDS Diagnoses
            var AIDSDiagnosesData = searchUtils.populateDataWithMappings(resp[18], 'aids' , 'cases');
            es.mergeWithCensusData(AIDSDiagnosesData, resp[19], 'pop');
            searchUtils.applySuppressions(AIDSDiagnosesData, 'aids', 0);
            //For - AIDS Deaths
            var AIDSDeathsData = searchUtils.populateDataWithMappings(resp[20], 'aids' , 'cases');
            es.mergeWithCensusData(AIDSDeathsData, resp[21], 'pop');
            searchUtils.applySuppressions(AIDSDeathsData, 'aids', 0);
            //For - AIDS Prevalence
            var AIDSPrevalenceData = searchUtils.populateDataWithMappings(resp[22], 'aids' , 'cases');
            es.mergeWithCensusData(AIDSPrevalenceData, resp[23], 'pop');
            searchUtils.applySuppressions(AIDSPrevalenceData, 'aids', 0);
            //For - HIV Diagnoses
            var HIVDiagnosesData = searchUtils.populateDataWithMappings(resp[24], 'aids' , 'cases');
            es.mergeWithCensusData(HIVDiagnosesData, resp[25], 'pop');
            searchUtils.applySuppressions(HIVDiagnosesData, 'aids', 0);
            //For - HIV Deaths
            var HIVDeathsData = searchUtils.populateDataWithMappings(resp[26], 'aids' , 'cases');
            es.mergeWithCensusData(HIVDeathsData, resp[27], 'pop');
            searchUtils.applySuppressions(HIVDeathsData, 'aids', 0);
            //For - HIV Prevalence
            var HIVPrevalenceData = searchUtils.populateDataWithMappings(resp[28], 'aids' , 'cases');
            es.mergeWithCensusData(HIVPrevalenceData, resp[29], 'pop');
            searchUtils.applySuppressions(HIVPrevalenceData, 'aids', 0);
            //For - Detail Mortality - Total
            var detailMortalityTotal_Data = searchUtils.populateDataWithMappings(resp[30], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityTotal_Data.data.nested.table, resp[31].table);
            searchUtils.applySuppressions(detailMortalityTotal_Data, 'deaths');
            //For - Detail Mortality - C00-C97
            var detailMortalityC00_C97_Data = searchUtils.populateDataWithMappings(resp[32], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC00_C97_Data.data.nested.table, resp[33].table);
            searchUtils.applySuppressions(detailMortalityC00_C97_Data, 'deaths');
            //For - Detail Mortality - C50-C50
            var detailMortalityC50Data = searchUtils.populateDataWithMappings(resp[34], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC50Data.data.nested.table, resp[35].table);
            searchUtils.applySuppressions(detailMortalityC50Data, 'deaths');
            //For - Detail Mortality - C53
            var detailMortalityC53_Data = searchUtils.populateDataWithMappings(resp[36], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC53_Data.data.nested.table, resp[37].table);
            searchUtils.applySuppressions(detailMortalityC53_Data, 'deaths');
            //For - Detail Mortality - I60-69
            var detailMortalityI60_I69_Data = searchUtils.populateDataWithMappings(resp[38], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityI60_I69_Data.data.nested.table, resp[39].table);
            searchUtils.applySuppressions(detailMortalityI60_I69_Data, 'deaths');
            //For - Detail Mortality - J40-J47 and J60
            var detailMortalityJ40_J47_J60_Data = searchUtils.populateDataWithMappings(resp[40], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityJ40_J47_J60_Data.data.nested.table, resp[41].table);
            searchUtils.applySuppressions(detailMortalityJ40_J47_J60_Data, 'deaths');
            //For - Detail Mortality - Drug induced
            var detailMortalityDrugInduced_Data = searchUtils.populateDataWithMappings(resp[42], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityDrugInduced_Data.data.nested.table, resp[43].table);
            searchUtils.applySuppressions(detailMortalityDrugInduced_Data, 'deaths');
            //For - Detail Mortality -Suicide
            var detailMortalitySuicide_Data = searchUtils.populateDataWithMappings(resp[44], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalitySuicide_Data.data.nested.table, resp[45].table);
            searchUtils.applySuppressions(detailMortalitySuicide_Data, 'deaths');
            //For - Detail Mortality -Homicide
            var detailMortalityHomicide_Data = searchUtils.populateDataWithMappings(resp[46], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityHomicide_Data.data.nested.table, resp[47].table);
            searchUtils.applySuppressions(detailMortalityHomicide_Data, 'deaths');
            //For - Detail Mortality -B20-B24
            var detailMortalityB20_B24_Data = searchUtils.populateDataWithMappings(resp[48], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityB20_B24_Data.data.nested.table, resp[49].table);
            searchUtils.applySuppressions(detailMortalityB20_B24_Data, 'deaths');
            //Natality - Birth Rates
            var natality_BirthRates_Data = searchUtils.populateDataWithMappings(resp[50], 'natality');
            es.mergeWithCensusData(natality_BirthRates_Data, resp[51], 'pop');
            searchUtils.applySuppressions(natality_BirthRates_Data, 'natality');
            //Natality - fertilityRates
            var natality_fertilityRates_Data = searchUtils.populateDataWithMappings(resp[52], 'natality');
            es.mergeWithCensusData(natality_fertilityRates_Data, resp[53], 'pop');
            searchUtils.applySuppressions(natality_fertilityRates_Data, 'natality');
            //Natality - vaginal
            var natality_vaginal_Data = searchUtils.populateDataWithMappings(resp[54], 'natality');
            searchUtils.applySuppressions(natality_vaginal_Data, 'natality');
            //Natality n- Cesarean
            var natality_cesarean_Data = searchUtils.populateDataWithMappings(resp[55], 'natality');
            searchUtils.applySuppressions(natality_cesarean_Data, 'natality');
            //Natality - Low Birth weight (<2500 gms)
            var natality_lowBirthWeight_Data = searchUtils.populateDataWithMappings(resp[56], 'natality');
            searchUtils.applySuppressions(natality_lowBirthWeight_Data, 'natality');
            //Natality - Twin Birth Rate
            var natality_twinBirth_Data = searchUtils.populateDataWithMappings(resp[57], 'natality');
            searchUtils.applySuppressions(natality_twinBirth_Data, 'natality');
            //Natality - Total birth population by year
            var natality_totalBirthPopulation_Data = searchUtils.populateDataWithMappings(resp[58], 'natality');
            searchUtils.applySuppressions(natality_totalBirthPopulation_Data, 'natality');
            //Cancer - Mortality
            var cancer_mortality_breast_data = searchUtils.populateDataWithMappings(resp[59], 'cancer_mortality');
            var cancer_breast_population = searchUtils.populateDataWithMappings(resp[60], 'cancer_population');
            var cancer_breast_population_index = searchUtils.createPopIndex(cancer_breast_population.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_breast_data.data.nested.table, cancer_breast_population_index, '');
            searchUtils.applySuppressions(cancer_mortality_breast_data, 'cancer_mortality', 16);

            var cancer_mortality_colonAndRectum_data = searchUtils.populateDataWithMappings(resp[61], 'cancer_mortality');
            var cancer_colonAndRectum_population = searchUtils.populateDataWithMappings(resp[62], 'cancer_population');
            var cancer_colonAndRectum_population_index = searchUtils.createPopIndex(cancer_colonAndRectum_population.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_colonAndRectum_data.data.nested.table, cancer_colonAndRectum_population_index, '');
            searchUtils.applySuppressions(cancer_mortality_colonAndRectum_data, 'cancer_mortality', 16);

            var cancer_mortality_lungAndBronchus_data = searchUtils.populateDataWithMappings(resp[63], 'cancer_mortality');
            var cancer_lungAndBronchus_population = searchUtils.populateDataWithMappings(resp[64], 'cancer_population');
            var cancer_lungAndBronchus_population_index = searchUtils.createPopIndex(cancer_lungAndBronchus_population.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_lungAndBronchus_data.data.nested.table, cancer_lungAndBronchus_population_index, '');
            searchUtils.applySuppressions(cancer_mortality_lungAndBronchus_data, 'cancer_mortality', 16);

            var cancer_mortality_melanoma_data = searchUtils.populateDataWithMappings(resp[65], 'cancer_mortality');
            var cancer_melanoma_population = searchUtils.populateDataWithMappings(resp[66], 'cancer_population');
            var cancer_melanoma_population_index = searchUtils.createPopIndex(cancer_melanoma_population.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_melanoma_data.data.nested.table, cancer_melanoma_population_index, '');
            searchUtils.applySuppressions(cancer_mortality_melanoma_data, 'cancer_mortality', 16);

            var cancer_mortality_cervix_data = searchUtils.populateDataWithMappings(resp[67], 'cancer_mortality');
            var cancer_cervix_population = searchUtils.populateDataWithMappings(resp[68], 'cancer_population');
            var cancer_cervix_population_index = searchUtils.createPopIndex(cancer_cervix_population.data.nested.table, 'cancer_population')
            searchUtils.attachPopulation(cancer_mortality_cervix_data.data.nested.table, cancer_cervix_population_index, '');
            searchUtils.applySuppressions(cancer_mortality_cervix_data, 'cancer_mortality', 16);

            var cancer_mortality_ovary_data = searchUtils.populateDataWithMappings(resp[69], 'cancer_mortality');
            var cancer_ovary_population = searchUtils.populateDataWithMappings(resp[70], 'cancer_population');
            var cancer_ovary_population_index = searchUtils.createPopIndex(cancer_ovary_population.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_ovary_data.data.nested.table, cancer_ovary_population_index, '');
            searchUtils.applySuppressions(cancer_mortality_ovary_data, 'cancer_mortality', 16);

            var cancer_mortality_prostate_data = searchUtils.populateDataWithMappings(resp[71], 'cancer_mortality');
            var cancer_prostate_population = searchUtils.populateDataWithMappings(resp[72], 'cancer_population');
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
            var cancer_incident_breast_data = searchUtils.populateDataWithMappings(resp[73], 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_breast_data.data.nested.table, cancer_breast_population_index, '');
            searchUtils.applySuppressions(cancer_incident_breast_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_breast_data.data.nested, rules, 'cancer_incident');
            var cancer_incident_colonAndRectum_data = searchUtils.populateDataWithMappings(resp[74], 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_colonAndRectum_data.data.nested.table, cancer_colonAndRectum_population_index, '');
            searchUtils.applySuppressions(cancer_incident_colonAndRectum_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_colonAndRectum_data.data.nested, rules, 'cancer_incident');
            var cancer_incident_lungAndBronchus_data = searchUtils.populateDataWithMappings(resp[75], 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_lungAndBronchus_data.data.nested.table, cancer_lungAndBronchus_population_index, '');
            searchUtils.applySuppressions(cancer_incident_lungAndBronchus_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_lungAndBronchus_data.data.nested, rules, 'cancer_incident');
            var cancer_incident_melanoma_data = searchUtils.populateDataWithMappings(resp[76], 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_melanoma_data.data.nested.table, cancer_melanoma_population_index, '');
            searchUtils.applySuppressions(cancer_incident_melanoma_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_melanoma_data.data.nested, rules, 'cancer_incident');
            var cancer_incident_cervix_data = searchUtils.populateDataWithMappings(resp[77], 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_cervix_data.data.nested.table, cancer_cervix_population_index, '');
            searchUtils.applySuppressions(cancer_incident_cervix_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_cervix_data.data.nested, rules, 'cancer_incident');
            var cancer_incident_ovary_data = searchUtils.populateDataWithMappings(resp[78], 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_ovary_data.data.nested.table, cancer_ovary_population_index, '');
            searchUtils.applySuppressions(cancer_incident_ovary_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_ovary_data.data.nested, rules, 'cancer_incident');
            var cancer_incident_prostate_data = searchUtils.populateDataWithMappings(resp[79], 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_prostate_data.data.nested.table, cancer_prostate_population_index, '');
            searchUtils.applySuppressions(cancer_incident_prostate_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_prostate_data.data.nested, rules, 'cancer_incident');
            //Merge all Cancer incident sites data
            var cancer_incident_data = cancer_incident_breast_data;
            cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_colonAndRectum_data.data.nested.table.current_year);
            cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_lungAndBronchus_data.data.nested.table.current_year);
            cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_melanoma_data.data.nested.table.current_year);
            cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_cervix_data.data.nested.table.current_year);
            cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_ovary_data.data.nested.table.current_year);
            cancer_incident_data.data.nested.table.current_year.push.apply(cancer_incident_data.data.nested.table.current_year, cancer_incident_prostate_data.data.nested.table.current_year);
            //YRBS - Alcohol
            var yrbs_alchohol_data =  resp[80];
            //BRFSS - 2015 - Overweight and Obesity(BMI), Tobbaco use, Fruits and Vegetables, Alcohol Consumption
            var brfss_2015_data = resp[81];
            //PRAMS - 2009 - Smoking cigarettes during the last three months of pregnancy
            var prams_smoking_data = resp[82];
            //PRAMS - 2009 - Intended pregnancy
            var prams_intended_pregnancy_data = resp[83];
            //PRAMS - 2009 - Females reported physical abuse by husband or partner during pregnancy (percent)
            var prams_physical_abuse_data = resp[84];
            //PRAMS - 2009 - With one or more previous live births who reported unintended pregnancy
            var prams_live_birth_unintended_data = resp[85];
            //PRAMS - 2009 - Ever breastfed or pump breast milk to feed after delivery
            var prams_breast_milk_feed_data = resp[86];
            //PRAMS - 2009 - Indicator of depression 3 months before pregnancy
            var prams_indicator_depression_data = resp[87];

            var factSheet = prepareFactSheetForPopulation(genderData, nonHispanicRaceData,
                raceData, hispanicData, ageGroupData, fsType);
            factSheet.state = state;
            factSheet.fsType = fsType;
            factSheet.infantMortalityData = infantMortalityData;
            factSheet.tuberculosis = prepareDiseaseData(tbData, 'tb');
            factSheet.stdData = [{disease:"Chlamydia", data:prepareDiseaseData(stdChlamydiaData, 'std')},
                {disease:"Gonorrhea", data:prepareDiseaseData(stdGonorrheaData, 'std')},
                {disease:"Primary and Secondary Syphilis", data:prepareDiseaseData(stdPrimarySyphilisData, 'std')},
                {disease:"Early Latent Syphilis", data:prepareDiseaseData(stdEarlySyphilisData, 'std')}];

            factSheet.hivAIDSData = [{disease:"AIDS Diagnoses", data:prepareDiseaseData(AIDSDiagnosesData, 'aids')},
                {disease:"AIDS Deaths*", data:prepareDiseaseData(AIDSDeathsData, 'aids')},
                {disease:"AIDS Prevalence*", data:prepareDiseaseData(AIDSPrevalenceData, 'aids')},
                {disease:"HIV Diagnoses", data:prepareDiseaseData(HIVDiagnosesData, 'aids')},
                {disease:"HIV Deaths*", data:prepareDiseaseData(HIVDeathsData, 'aids')},
                {disease:"HIV Prevalence*", data:prepareDiseaseData(HIVPrevalenceData, 'aids')}];
            factSheet.detailMortalityData = [{causeOfDeath:"Total (all ages)", data:detailMortalityTotal_Data.data.nested.table.year[0]},
                {causeOfDeath:"Cancer (Malignant neoplasms)", data:detailMortalityC00_C97_Data.data.nested.table.year[0]},
                {causeOfDeath: "Breast Cancer (Malignant neoplasms of breast)", data:detailMortalityC50Data.data.nested.table.year[0]},
                {causeOfDeath: "Cervical Cancer (Malignant neoplasm of cervix uteri)", data:detailMortalityC53_Data.data.nested.table.year[0]},
                {causeOfDeath: "Cerebrovascular diseases (Stroke)", data:detailMortalityI60_I69_Data.data.nested.table.year[0]},
                {causeOfDeath: "Chronic Lower Respiratory Disease", data:detailMortalityJ40_J47_J60_Data.data.nested.table.year[0]},
                {causeOfDeath: "Alcohol or Drug Induced", data:detailMortalityDrugInduced_Data.data.nested.table.year[0]},
                {causeOfDeath: "Suicide", data:detailMortalitySuicide_Data.data.nested.table.year[0]},
                {causeOfDeath: "Homicide", data:detailMortalityHomicide_Data.data.nested.table.year[0]},
                {causeOfDeath: "Human Immunodeficiency Virus(HIV)", data:detailMortalityB20_B24_Data.data.nested.table.year[0]}];
            factSheet.natalityData = prepareNatalityData(natality_BirthRates_Data, natality_fertilityRates_Data, natality_vaginal_Data,
                natality_cesarean_Data, natality_lowBirthWeight_Data, natality_twinBirth_Data, natality_totalBirthPopulation_Data);
            factSheet.cancerData = prepareCancerData(cancer_mortality_data, cancer_incident_data);
            factSheet.yrbs = prepareYRBSData(yrbs_alchohol_data);
            factSheet.brfss = prepareBRFSSData(brfss_2015_data);
            factSheet.prams = preparePRAMSData([prams_smoking_data, prams_intended_pregnancy_data, prams_physical_abuse_data], [prams_live_birth_unintended_data, prams_breast_milk_feed_data, prams_indicator_depression_data]);
            deferred.resolve(factSheet);
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
function preparePRAMSData(pregnantWomenData, womenData) {
    var pramsData = {
        pregnantWoment: [],
        women: []
    };

    pramsData.pregnantWoment.push({"question": "Smoking cigarettes during the last three months of pregnancy", data: pregnantWomenData[0].table.question[0] && pregnantWomenData[0].table.question[0].yes ? getMeanDisplayValue(pregnantWomenData[0].table.question[0].yes.sitecode[0].prams.mean) : "Not applicable"});
    pramsData.pregnantWoment.push({"question": "Intended pregnancy", data: pregnantWomenData[1].table.question[0] && pregnantWomenData[1].table.question[0]["intended"] ? getMeanDisplayValue(pregnantWomenData[1].table.question[0]["intended"].sitecode[0].prams.mean) : "Not applicable"});
    pramsData.pregnantWoment.push({"question": "Females reported physical abuse by husband or partner during pregnancy (percent)", data: pregnantWomenData[2].table.question[0] && pregnantWomenData[2].table.question[0].yes ? getMeanDisplayValue(pregnantWomenData[2].table.question[0].yes.sitecode[0].prams.mean): "Not applicable"});

    pramsData.women.push({"question": "With one or more previous live births who reported unintended pregnancy", data: womenData[0].table.question[0] && womenData[0].table.question[0]["unintended"] ? getMeanDisplayValue(womenData[0].table.question[0]["unintended"].sitecode[0].prams.mean) : "Not applicable"});
    pramsData.women.push({"question": "Ever breastfed or pump breast milk to feed after delivery", data: womenData[1].table.question[0] && womenData[1].table.question[0].yes ? getMeanDisplayValue(womenData[1].table.question[0].yes.sitecode[0].prams.mean) : "Not applicable"});
    pramsData.women.push({"question": "Indicator of depression 3 months before pregnancy", data: womenData[2].table.question[0] && womenData[2].table.question[0].yes ? getMeanDisplayValue(womenData[2].table.question[0].yes.sitecode[0].prams.mean) : "Not applicable"});
    return pramsData;
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
    brfssData.push({question: 'Were Obese (BMI 30.0 - 99.8)', data: 'Not applicable' });
    brfssData.push({question: 'Adults who are current smokers', data: 'Not applicable'});
    brfssData.push({question: 'Consumed fruits one or more times a day', data: 'Not applicable'});
    brfssData.push({question: 'Consumed vegetables one or more times a day', data: 'Not applicable'});
    brfssData.push({question: 'Are heavy drinkers (adult men having more than 14 drinks per week and adult women having more than 7 drinks per week)', data: 'Not applicable'});
    brfssData.push({question: 'Participated in 150 minutes or more of Aerobic Physical Activity per week (variable calculated from one or more BRFSS questions)', data: 'Not applicable'});
    data_2015.table.question.forEach(function(eachRecord){
        switch(eachRecord.name){
            case "x_bmi5cat":
                brfssData[0].data = getMeanDisplayValue(eachRecord["obese (bmi 30.0 - 99.8)"].brfss.mean);
                break;
            case "x_rfsmok3":
                brfssData[1].data = getMeanDisplayValue(eachRecord.yes.brfss.mean);
                break;
            case "x_frtlt1":
                brfssData[2].data = getMeanDisplayValue(eachRecord["one or more times per day"].brfss.mean);
                break;
            case "x_veglt1":
                brfssData[3].data =  getMeanDisplayValue(eachRecord["one or more times per day"].brfss.mean);
                break;
            case "x_rfdrhv5":
                brfssData[4].data = getMeanDisplayValue(eachRecord["meet criteria for heavy drinking"].brfss.mean);
                break;
            case "x_paindx1":
                brfssData[5].data = getMeanDisplayValue(eachRecord.yes.brfss.mean);
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
            crudeMortalityRate = eachRecord.pop != 'n/a' ? Math.round(cancerMortalityDeathCounts / eachRecord.pop * 1000000) / 10 : "Not Available";
        }
        incidentData = cancerIncidentData.data.nested.table.current_year[index] ? cancerIncidentData.data.nested.table.current_year[index] : {
            cancer_incident: 'Not Available',
            pop: 'n/a'
        };
        var incidentPopulation = incidentData.pop == 'n/a' ? 'Not Available' : incidentData.pop;
        if(incidentData.cancer_incident === 'suppressed'){
            incidentData.cancer_incident = 'Suppressed';
            crudeIncidentRate = 'Suppressed';
        }
        else if(incidentData.cancer_incident < 20) {
            crudeIncidentRate = 'Unreliable';
        }
        else {
            crudeIncidentRate = incidentData.pop != 'n/a' ? Math.round(incidentData.cancer_incident / incidentData.pop * 1000000) / 10 : "Not Available";
        }
        switch(index){
            case 0:
                cancerData.push({site:'Breast', pop: incidentPopulation, count: incidentData.cancer_incident, incident_rate: crudeIncidentRate,  deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 1:
                cancerData.push({site:'Colon and Rectum', pop: incidentPopulation, count: incidentData.cancer_incident, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 2:
                cancerData.push({site:'Lung and Bronchus', pop: incidentPopulation, count: incidentData.cancer_incident, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 3:
                cancerData.push({site:'Melanoma of the Skin', pop: incidentPopulation, count: incidentData.cancer_incident, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 4:
                cancerData.push({site:'Cervix Uteri†', pop: incidentPopulation, count: incidentData.cancer_incident, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 5:
                cancerData.push({site:'Ovary†', pop: incidentPopulation, count: incidentData.cancer_incident, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
                break;
            case 6:
                cancerData.push({site:'Prostate††', pop: incidentPopulation, count: incidentData.cancer_incident, incident_rate: crudeIncidentRate, deaths: cancerMortalityDeathCounts, mortality_rate: crudeMortalityRate });
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
            record['displayValue'] = 'Not Available';
        }
        else if(record[countKey] === 'suppressed') {
            record['displayValue'] = 'Suppressed';
        }
        else {
            var rate = record['pop'] ? Math.round(record[countKey] / record['pop'] * 1000000) / 10 : 0;
            record['displayValue'] = formatNumber(record[countKey]) + " (" + rate.toFixed(1) + ")";
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