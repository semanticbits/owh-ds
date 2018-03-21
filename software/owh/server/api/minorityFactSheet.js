var elasticSearch = require('../models/elasticSearch');
var yrbs = require("../api/yrbs");
var queryBuilder = require('../api/elasticQueryBuilder');
var factSheetQueries = require('../json/factsheet-queries.json');
var searchUtils = require('../api/utils');
var wonder = require("../api/wonder");
var Q = require('q');
var logger = require('../config/logging');
var extend = require('util')._extend;
var MinorityFactSheet = function() {

};

MinorityFactSheet.prototype.prepareFactSheet = function (state, fsType) {
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

        //Detail Mortality - Number of deaths
        var mortality_total_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["Total"][0];
        var c50_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["C50-C50"][0];
        var c00_c97_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["C00-C97"][0];
        var c53_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["C53"][0];
        var i160_i169_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["I160-I169"][0];
        var j40_j47_j60_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["J40-47-60"][0];
        var drug_induced_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["drug-induced"][0];
        var suicide_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["Suicide"][0];
        var homicide_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["Homicide"][0];
        var b20_b24_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["B20-B24"][0];

        var mortality_total_hispanic_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["Total"][1];
        var c50_hispanic_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["C50-C50"][1];
        var c00_c97_hispanic_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["C00-C97"][1];
        var c53_hispanic_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["C53"][1];
        var i160_i169_hispanic_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["I160-I169"][1];
        var j40_j47_j60_hispanic_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["J40-47-60"][1];
        var drug_induced_hispanic_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["drug-induced"][1];
        var suicide_hispanic_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["Suicide"][1];
        var homicide_hispanic_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["Homicide"][1];
        var b20_b24_hispanic_esQuery = factSheetQueryJSON.detailMortality.number_of_deaths["B20-B24"][1];

        //Detail Mortality - Age adjusted death rates
        var mortality_total_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["Total"][0];
        var c50_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["C50-C50"][0];
        var c00_c97_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["C00-C97"][0];
        var c53_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["C53"][0];
        var i160_i169_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["I160-I169"][0];
        var j40_j47_j60_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["J40-47-60"][0];
        var drug_induced_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["drug-induced"][0];
        var suicide_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["Suicide"][0];
        var homicide_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["Homicide"][0];
        var b20_b24_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["B20-B24"][0];

        var mortality_total_hispanic_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["Total"][1];
        var c50_hispanic_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["C50-C50"][1];
        var c00_c97_hispanic_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["C00-C97"][1];
        var c53_hispanic_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["C53"][1];
        var i160_i169_hispanic_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["I160-I169"][1];
        var j40_j47_j60_hispanic_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["J40-47-60"][1];
        var drug_induced_hispanic_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["drug-induced"][1];
        var suicide_hispanic_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["Suicide"][1];
        var homicide_hispanic_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["Homicide"][1];
        var b20_b24_hispanic_wonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["B20-B24"][1];

        //Natality - Birth Rates
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
        var cancer_BreastHispanic_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Breast"][2];
        var cancer_BreastHispanic_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Breast"][3];
        var cancer_colonAndRectum_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Colon and Rectum"][0];
        var cancer_colonAndRectum_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Colon and Rectum"][1];
        var cancer_colonAndRectumHispanic_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Colon and Rectum"][2];
        var cancer_colonAndRectumHispanic_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Colon and Rectum"][3];
        var cancer_lungAndBronchus_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Lung and Bronchus"][0];
        var cancer_lungAndBronchus_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Lung and Bronchus"][1];
        var cancer_lungAndBronchusHispanic_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Lung and Bronchus"][2];
        var cancer_lungAndBronchusHispanic_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Lung and Bronchus"][3];
        var cancer_melanoma_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Melanoma of the Skin"][0];
        var cancer_melanoma_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Melanoma of the Skin"][1];
        var cancer_melanomaHispanic_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Melanoma of the Skin"][2];
        var cancer_melanomaHispanic_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Melanoma of the Skin"][3];
        var cancer_cervix_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Cervix Uteri"][0];
        var cancer_cervix_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Cervix Uteri"][1];
        var cancer_cervixHispanic_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Cervix Uteri"][2];
        var cancer_cervixHispanic_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Cervix Uteri"][3];
        var cancer_ovary_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Ovary"][0];
        var cancer_ovary_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Ovary"][1];
        var cancer_ovaryHispanic_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Ovary"][2];
        var cancer_ovaryHispanic_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Ovary"][3];
        var cancer_prostate_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Prostate"][0];
        var cancer_prostate_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Prostate"][1];
        var cancer_prostateHispanic_esQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Prostate"][2];
        var cancer_prostateHispanic_populationQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Prostate"][3];

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
            new wonder('D69').invokeWONDER(factSheetQueryJSON.infant_mortality.racePopulation),
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
            //Detail Mortality - Number of deaths
            es.executeMultipleESQueries(mortality_total_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(c00_c97_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(c50_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(c53_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(i160_i169_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(j40_j47_j60_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(drug_induced_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(suicide_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(homicide_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(b20_b24_esQuery, 'owh_mortality', 'mortality'),

            //Detail Mortality - Age adjusted rates
            new wonder('D77').invokeWONDER(mortality_total_wonderQuery),
            new wonder('D77').invokeWONDER(c00_c97_wonderQuery),
            new wonder('D77').invokeWONDER(c50_wonderQuery),
            new wonder('D77').invokeWONDER(c53_wonderQuery),
            new wonder('D77').invokeWONDER(i160_i169_wonderQuery),
            new wonder('D77').invokeWONDER(j40_j47_j60_wonderQuery),
            new wonder('D77').invokeWONDER(drug_induced_wonderQuery),
            new wonder('D77').invokeWONDER(suicide_wonderQuery),
            new wonder('D77').invokeWONDER(homicide_wonderQuery),
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
            new yrbs().invokeYRBSService(prams_indicator_depression_query),

            //add hispanic columns to infant mortality
            new wonder('D69').invokeWONDER(factSheetQueryJSON.infant_mortality.hispanicPopulation),

            //add hispanic columns to mortality
            es.executeMultipleESQueries(mortality_total_hispanic_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(c00_c97_hispanic_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(c50_hispanic_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(c53_hispanic_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(i160_i169_hispanic_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(j40_j47_j60_hispanic_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(drug_induced_hispanic_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(suicide_hispanic_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(homicide_hispanic_esQuery, 'owh_mortality', 'mortality'),
            es.executeMultipleESQueries(b20_b24_hispanic_esQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(mortality_total_hispanic_wonderQuery),
            new wonder('D77').invokeWONDER(c50_hispanic_wonderQuery),
            new wonder('D77').invokeWONDER(c00_c97_hispanic_wonderQuery),
            new wonder('D77').invokeWONDER(c53_hispanic_wonderQuery),

            //add cancer hispanic population
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_BreastHispanic_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_BreastHispanic_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_colonAndRectumHispanic_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_colonAndRectumHispanic_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_lungAndBronchusHispanic_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_lungAndBronchusHispanic_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_melanomaHispanic_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_melanomaHispanic_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_cervixHispanic_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_cervixHispanic_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_ovaryHispanic_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_ovaryHispanic_populationQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_prostateHispanic_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_prostateHispanic_populationQuery),

            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_BreastHispanic_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_colonAndRectumHispanic_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_lungAndBronchusHispanic_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_melanomaHispanic_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_cervixHispanic_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_ovaryHispanic_esQuery),
            es.executeESQuery('owh_cancer_incident', 'cancer_incident', cancer_prostateHispanic_esQuery)
        ];

        Q.all(promises).then( function (resp) {
            var genderData = searchUtils.populateDataWithMappings(resp[0], 'bridge_race', 'pop');
            var nonHispanicRaceData = searchUtils.populateDataWithMappings(resp[1], 'bridge_race', 'pop');
            var raceData = searchUtils.populateDataWithMappings(resp[2], 'bridge_race', 'pop');
            var hispanicData = searchUtils.populateDataWithMappings(resp[3], 'bridge_race', 'pop');
            var ageGroupData = searchUtils.populateDataWithMappings(resp[4], 'bridge_race', 'pop');
            //Infant mortality data
            var infantMortalityData = resp[5].table;
            //merge hispanic data to race data
            infantMortalityData['Hispanic'] = resp[88].table.Total;
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

            //For - Detail Mortality
            var noDataAvailableObj = {name: 'Hispanic', deaths: 'suppressed', ageAdjustedRate: 'Not Available', standardPop: 'Not Available'};

            var selectedRaces = { "options": [ "American Indian", "Asian or Pacific Islander", "Black", 'Hispanic' ]};
            var detailMortalityTotal_Data = searchUtils.populateDataWithMappings(resp[30], 'deaths');
            searchUtils.addMissingFilterOptions(selectedRaces, detailMortalityTotal_Data.data.nested.table.race, 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityTotal_Data.data.nested.table, resp[40].table);
            searchUtils.applySuppressions(detailMortalityTotal_Data, 'deaths');

            var detailMortalityTotalHispanicData = searchUtils.populateDataWithMappings(resp[89], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityTotalHispanicData.data.nested.table, resp[99].table);
            searchUtils.applySuppressions(detailMortalityTotalHispanicData, 'deaths');
            var totalHispanic = detailMortalityTotalHispanicData.data.nested.table.year[0] || noDataAvailableObj;
            totalHispanic.name = 'Hispanic';
            detailMortalityTotal_Data.data.nested.table.race[3] =  totalHispanic;

            var detailMortalityC00_C97_Data = searchUtils.populateDataWithMappings(resp[31], 'deaths');
            searchUtils.addMissingFilterOptions(selectedRaces, detailMortalityC00_C97_Data.data.nested.table.race, 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC00_C97_Data.data.nested.table, resp[41].table);
            searchUtils.applySuppressions(detailMortalityC00_C97_Data, 'deaths');

            var detailMortalityC00C97HispanicData = searchUtils.populateDataWithMappings(resp[90], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC00C97HispanicData.data.nested.table, resp[101].table);
            searchUtils.applySuppressions(detailMortalityC00C97HispanicData, 'deaths');
            var C00C97Hispanic = detailMortalityC00C97HispanicData.data.nested.table.year[0] || noDataAvailableObj;
            C00C97Hispanic.name = 'Hispanic';
            detailMortalityC00_C97_Data.data.nested.table.race[3] =  C00C97Hispanic;

            var detailMortalityC50Data = searchUtils.populateDataWithMappings(resp[32], 'deaths');
            searchUtils.addMissingFilterOptions(selectedRaces, detailMortalityC50Data.data.nested.table.race, 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC50Data.data.nested.table, resp[42].table);
            searchUtils.applySuppressions(detailMortalityC50Data, 'deaths');

            var detailMortalityC50HispanicData = searchUtils.populateDataWithMappings(resp[91], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC50HispanicData.data.nested.table, resp[100].table);
            searchUtils.applySuppressions(detailMortalityC50HispanicData, 'deaths');
            var c50Hispanic = detailMortalityC50HispanicData.data.nested.table.year[0] || noDataAvailableObj;
            detailMortalityC50Data.data.nested.table.race[3] =  c50Hispanic;

            var detailMortalityC53_Data = searchUtils.populateDataWithMappings(resp[33], 'deaths');
            searchUtils.addMissingFilterOptions(selectedRaces, detailMortalityC53_Data.data.nested.table.race, 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC53_Data.data.nested.table, resp[43].table);
            searchUtils.applySuppressions(detailMortalityC53_Data, 'deaths');

            var detailMortalityC53HispanicData = searchUtils.populateDataWithMappings(resp[92], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC53HispanicData.data.nested.table, resp[102].table);
            searchUtils.applySuppressions(detailMortalityC53HispanicData, 'deaths');
            var c53Hispanic = detailMortalityC53HispanicData.data.nested.table.year[0] || noDataAvailableObj;
            c53Hispanic.name = 'Hispanic';
            detailMortalityC53_Data.data.nested.table.race[3] =  c53Hispanic;

            var detailMortalityI60_I69_Data = searchUtils.populateDataWithMappings(resp[34], 'deaths');
            searchUtils.addMissingFilterOptions(selectedRaces, detailMortalityI60_I69_Data.data.nested.table.race, 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityI60_I69_Data.data.nested.table, resp[44].table);
            searchUtils.applySuppressions(detailMortalityI60_I69_Data, 'deaths');

            /*var detailMortalityI60I69HispanicData = searchUtils.populateDataWithMappings(resp[93], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityI60I69HispanicData.data.nested.table, resp[103].table);
            searchUtils.applySuppressions(detailMortalityI60I69HispanicData, 'deaths');
            var I60I69Hispanic = detailMortalityI60I69HispanicData.data.nested.table.year[0];
            I60I69Hispanic.name = 'Hispanic';
            detailMortalityI60_I69_Data.data.nested.table.race[3] =  I60I69Hispanic;*/

            var detailMortalityJ40_J47_J60_Data = searchUtils.populateDataWithMappings(resp[35], 'deaths');
            searchUtils.addMissingFilterOptions(selectedRaces, detailMortalityJ40_J47_J60_Data.data.nested.table.race, 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityJ40_J47_J60_Data.data.nested.table, resp[45].table);
            searchUtils.applySuppressions(detailMortalityJ40_J47_J60_Data, 'deaths');

            /*var detailMortalityJ40J60HispanicData = searchUtils.populateDataWithMappings(resp[94], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityJ40J60HispanicData.data.nested.table, resp[104].table);
            searchUtils.applySuppressions(detailMortalityJ40J60HispanicData, 'deaths');
            var J40J60Hispanic = detailMortalityJ40J60HispanicData.data.nested.table.year[0];
            J40J60Hispanic.name = 'Hispanic';
            detailMortalityJ40_J47_J60_Data.data.nested.table.race[3] = J40J60Hispanic;*/

            var detailMortalityDrugInduced_Data = searchUtils.populateDataWithMappings(resp[36], 'deaths');
            searchUtils.addMissingFilterOptions(selectedRaces, detailMortalityDrugInduced_Data.data.nested.table.race, 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityDrugInduced_Data.data.nested.table, resp[46].table);
            searchUtils.applySuppressions(detailMortalityDrugInduced_Data, 'deaths');

            /*var detailMortalityDrugInducedHispanicData = searchUtils.populateDataWithMappings(resp[95], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityDrugInducedHispanicData.data.nested.table, resp[105].table);
            searchUtils.applySuppressions(detailMortalityDrugInducedHispanicData, 'deaths');
            var drugInducedHispanic = detailMortalityDrugInducedHispanicData.data.nested.table.year[0];
            drugInducedHispanic.name = 'Hispanic';
            detailMortalityDrugInduced_Data.data.nested.table.race[3] = drugInducedHispanic;*/

            var detailMortalitySuicide_Data = searchUtils.populateDataWithMappings(resp[37], 'deaths');
            searchUtils.addMissingFilterOptions(selectedRaces, detailMortalitySuicide_Data.data.nested.table.race, 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalitySuicide_Data.data.nested.table, resp[47].table);
            searchUtils.applySuppressions(detailMortalitySuicide_Data, 'deaths');

            /*var detailMortalitySuicideHispanicData = searchUtils.populateDataWithMappings(resp[96], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalitySuicideHispanicData.data.nested.table, resp[106].table);
            searchUtils.applySuppressions(detailMortalitySuicideHispanicData, 'deaths');
            var suicideHispanic = detailMortalitySuicideHispanicData.data.nested.table.year[0];
            suicideHispanic.name = 'Hispanic';
            detailMortalitySuicide_Data.data.nested.table.race[3] = suicideHispanic;*/

            var detailMortalityHomicide_Data = searchUtils.populateDataWithMappings(resp[38], 'deaths');
            searchUtils.addMissingFilterOptions(selectedRaces, detailMortalityHomicide_Data.data.nested.table.race, 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityHomicide_Data.data.nested.table, resp[48].table);
            searchUtils.applySuppressions(detailMortalityHomicide_Data, 'deaths');

            /*var detailMortalityHomicideHispanicData = searchUtils.populateDataWithMappings(resp[97], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityHomicideHispanicData.data.nested.table, resp[107].table);
            searchUtils.applySuppressions(detailMortalityHomicideHispanicData, 'deaths');
            var homicideHispanic = detailMortalityHomicideHispanicData.data.nested.table.year[0];
            homicideHispanic.name = 'Hispanic';
            detailMortalityHomicide_Data.data.nested.table.race[3] = homicideHispanic;*/

            var detailMortalityB20_B24_Data = searchUtils.populateDataWithMappings(resp[39], 'deaths');
            searchUtils.addMissingFilterOptions(selectedRaces, detailMortalityB20_B24_Data.data.nested.table.race, 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityB20_B24_Data.data.nested.table, resp[49].table);
            searchUtils.applySuppressions(detailMortalityB20_B24_Data, 'deaths');

            /*var detailMortalityB20B24HispanicData = searchUtils.populateDataWithMappings(resp[98], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityB20B24HispanicData.data.nested.table, resp[108].table);
            searchUtils.applySuppressions(detailMortalityB20B24HispanicData, 'deaths');
            var B20B24Hispanic = detailMortalityB20B24HispanicData.data.nested.table.year[0];
            B20B24Hispanic.name = 'Hispanic';
            detailMortalityB20_B24_Data.data.nested.table.race[3] = B20B24Hispanic;*/

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
            selectedRaces = { "options": [ "American Indian/Alaska Native", "Asian or Pacific Islander", "Black" ]};
            var cancer_mortality_breast_data = searchUtils.populateDataWithMappings(resp[59], 'cancer_mortality');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_mortality_breast_data.data.nested.table.race, 'cancer_mortality');
            var cancer_breast_population = searchUtils.populateDataWithMappings(resp[60], 'cancer_population');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_breast_population.data.nested.table.race, 'cancer_mortality');
            var cancer_breast_population_index = searchUtils.createPopIndex(cancer_breast_population.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_breast_data.data.nested.table, cancer_breast_population_index, '');

            var breastCancerMortality = searchUtils.populateDataWithMappings(resp[103], 'cancer_mortality');
            var breastCancerPopulation = searchUtils.populateDataWithMappings(resp[104], 'cancer_population');
            cancer_breast_population_index = searchUtils.createPopIndex(breastCancerPopulation.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(breastCancerMortality.data.nested.table, cancer_breast_population_index, '');
            var bcMrtality = breastCancerMortality.data.nested.table.current_year[0] || {name:'Hispanic', cancer_mortality:0, pop:breastCancerPopulation.data.nested.table.current_year[0].cancer_population};
            bcMrtality['name'] = 'Hispanic';
            cancer_mortality_breast_data.data.nested.table.race.push(bcMrtality);
            searchUtils.applySuppressions(cancer_mortality_breast_data, 'cancer_mortality', 16);

            var cancer_mortality_colonAndRectum_data = searchUtils.populateDataWithMappings(resp[61], 'cancer_mortality');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_mortality_colonAndRectum_data.data.nested.table.race, 'cancer_mortality');
            var cancer_colonAndRectum_population = searchUtils.populateDataWithMappings(resp[62], 'cancer_population');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_colonAndRectum_population.data.nested.table.race, 'cancer_mortality');
            var cancer_colonAndRectum_population_index = searchUtils.createPopIndex(cancer_colonAndRectum_population.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_colonAndRectum_data.data.nested.table, cancer_colonAndRectum_population_index, '');

            var crCancerMortality = searchUtils.populateDataWithMappings(resp[105], 'cancer_mortality');
            var crCancerPopulation = searchUtils.populateDataWithMappings(resp[106], 'cancer_population');
            var crPopulationIndex = searchUtils.createPopIndex(crCancerPopulation.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(crCancerMortality.data.nested.table, crPopulationIndex, '');
            var crMortality = crCancerMortality.data.nested.table.current_year[0] || {name:'Hispanic', cancer_mortality:0, pop:crCancerPopulation.data.nested.table.current_year[0].cancer_population};
            crMortality.name = 'Hispanic';
            cancer_mortality_colonAndRectum_data.data.nested.table.race.push(crMortality);
            searchUtils.applySuppressions(cancer_mortality_colonAndRectum_data, 'cancer_mortality', 16);

            var cancer_mortality_lungAndBronchus_data = searchUtils.populateDataWithMappings(resp[63], 'cancer_mortality');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_mortality_lungAndBronchus_data.data.nested.table.race, 'cancer_mortality');
            var cancer_lungAndBronchus_population = searchUtils.populateDataWithMappings(resp[64], 'cancer_population');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_lungAndBronchus_population.data.nested.table.race, 'cancer_mortality');
            var cancer_lungAndBronchus_population_index = searchUtils.createPopIndex(cancer_lungAndBronchus_population.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_lungAndBronchus_data.data.nested.table, cancer_lungAndBronchus_population_index, '');

            var lungCancerMortality = searchUtils.populateDataWithMappings(resp[107], 'cancer_mortality');
            var lungCancerPopulation = searchUtils.populateDataWithMappings(resp[108], 'cancer_population');
            var lungPopulationIndex = searchUtils.createPopIndex(lungCancerPopulation.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(lungCancerMortality.data.nested.table, lungPopulationIndex, '');
            var lungMortality = lungCancerMortality.data.nested.table.current_year[0] || {name:'Hispanic', cancer_mortality:0, pop:lungCancerPopulation.data.nested.table.current_year[0].cancer_population};
            lungMortality.name = 'Hispanic';
            cancer_mortality_lungAndBronchus_data.data.nested.table.race.push(lungMortality);
            searchUtils.applySuppressions(cancer_mortality_lungAndBronchus_data, 'cancer_mortality', 16);

            var cancer_mortality_melanoma_data = searchUtils.populateDataWithMappings(resp[65], 'cancer_mortality');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_mortality_melanoma_data.data.nested.table.race, 'cancer_mortality');
            var cancer_melanoma_population = searchUtils.populateDataWithMappings(resp[66], 'cancer_population');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_melanoma_population.data.nested.table.race, 'cancer_mortality');
            var cancer_melanoma_population_index = searchUtils.createPopIndex(cancer_melanoma_population.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_melanoma_data.data.nested.table, cancer_melanoma_population_index, '');

            var melanomaCancerMortality = searchUtils.populateDataWithMappings(resp[109], 'cancer_mortality');
            var melanomaCancerPopulation = searchUtils.populateDataWithMappings(resp[110], 'cancer_population');
            var melanomaPopulationIndex = searchUtils.createPopIndex(melanomaCancerPopulation.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(melanomaCancerMortality.data.nested.table, melanomaPopulationIndex, '');
            var melanomaMortality = melanomaCancerMortality.data.nested.table.current_year[0] || {name:'Hispanic', cancer_mortality:0, pop:melanomaCancerPopulation.data.nested.table.current_year[0].cancer_population};
            melanomaMortality.name = 'Hispanic';
            cancer_mortality_melanoma_data.data.nested.table.race.push(melanomaMortality);
            searchUtils.applySuppressions(cancer_mortality_melanoma_data, 'cancer_mortality', 16);

            var cancer_mortality_cervix_data = searchUtils.populateDataWithMappings(resp[67], 'cancer_mortality');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_mortality_cervix_data.data.nested.table.race, 'cancer_mortality');
            var cancer_cervix_population = searchUtils.populateDataWithMappings(resp[68], 'cancer_population');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_cervix_population.data.nested.table.race, 'cancer_mortality');
            var cancer_cervix_population_index = searchUtils.createPopIndex(cancer_cervix_population.data.nested.table, 'cancer_population')
            searchUtils.attachPopulation(cancer_mortality_cervix_data.data.nested.table, cancer_cervix_population_index, '');

            var cervixCancerMortality = searchUtils.populateDataWithMappings(resp[111], 'cancer_mortality');
            var cervixCancerPopulation = searchUtils.populateDataWithMappings(resp[112], 'cancer_population');
            var cervixPopulationIndex = searchUtils.createPopIndex(cervixCancerPopulation.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cervixCancerMortality.data.nested.table, cervixPopulationIndex, '');
            var cervixMortality = cervixCancerMortality.data.nested.table.current_year[0] || {name:'Hispanic', cancer_mortality:0, pop:cervixCancerPopulation.data.nested.table.current_year[0].cancer_population};
            cervixMortality.name = 'Hispanic';
            cancer_mortality_cervix_data.data.nested.table.race.push(cervixMortality);
            searchUtils.applySuppressions(cancer_mortality_cervix_data, 'cancer_mortality', 16);

            var cancer_mortality_ovary_data = searchUtils.populateDataWithMappings(resp[69], 'cancer_mortality');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_mortality_ovary_data.data.nested.table.race, 'cancer_mortality');
            var cancer_ovary_population = searchUtils.populateDataWithMappings(resp[70], 'cancer_population');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_ovary_population.data.nested.table.race, 'cancer_mortality');
            var cancer_ovary_population_index = searchUtils.createPopIndex(cancer_ovary_population.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_ovary_data.data.nested.table, cancer_ovary_population_index, '');

            var ovaryCancerMortality = searchUtils.populateDataWithMappings(resp[113], 'cancer_mortality');
            var ovaryCancerPopulation = searchUtils.populateDataWithMappings(resp[114], 'cancer_population');
            var ovaryPopulationIndex = searchUtils.createPopIndex(ovaryCancerPopulation.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(ovaryCancerMortality.data.nested.table, ovaryPopulationIndex, '');
            var ovaryCancerMortalityData = ovaryCancerMortality.data.nested.table.current_year[0] || {name:'Hispanic', cancer_mortality:0, pop:ovaryCancerPopulation.data.nested.table.current_year[0].cancer_population};
            ovaryCancerMortalityData.name = 'Hispanic';
            cancer_mortality_ovary_data.data.nested.table.race.push(ovaryCancerMortalityData);
            searchUtils.applySuppressions(cancer_mortality_ovary_data, 'cancer_mortality', 16);

            var cancer_mortality_prostate_data = searchUtils.populateDataWithMappings(resp[71], 'cancer_mortality');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_mortality_prostate_data.data.nested.table.race, 'cancer_mortality');
            var cancer_prostate_population = searchUtils.populateDataWithMappings(resp[72], 'cancer_population');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_prostate_population.data.nested.table.race, 'cancer_mortality');
            var cancer_prostate_population_index = searchUtils.createPopIndex(cancer_prostate_population.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_prostate_data.data.nested.table, cancer_prostate_population_index, '');

            var prostateCancerMortality = searchUtils.populateDataWithMappings(resp[115], 'cancer_mortality');
            var prostateCancerPopulation = searchUtils.populateDataWithMappings(resp[116], 'cancer_population');
            var prostatePopulationIndex = searchUtils.createPopIndex(prostateCancerPopulation.data.nested.table, 'cancer_population');
            searchUtils.attachPopulation(prostateCancerMortality.data.nested.table, prostatePopulationIndex, '');
            var prostateCancerMortalityData = prostateCancerMortality.data.nested.table.current_year[0] || {name:'Hispanic', cancer_mortality:0, pop:prostateCancerPopulation.data.nested.table.current_year[0].cancer_population};
            prostateCancerMortalityData.name = 'Hispanic';
            cancer_mortality_prostate_data.data.nested.table.race.push(prostateCancerMortalityData);
            searchUtils.applySuppressions(cancer_mortality_prostate_data, 'cancer_mortality', 16);

            //Cancer - Incident
            var rules = searchUtils.createCancerIncidenceSuppressionRules(['2014'], true, false);
            var cancer_incident_breast_data = searchUtils.populateDataWithMappings(resp[73], 'cancer_incident');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_incident_breast_data.data.nested.table.race, 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_breast_data.data.nested.table, cancer_breast_population_index, '');

            var hispanicBreastCancerIncidence = searchUtils.populateDataWithMappings(resp[117], 'cancer_incident');
            searchUtils.attachPopulation(hispanicBreastCancerIncidence.data.nested.table, cancer_breast_population_index, '');
            var breastCancerIncidenceData = hispanicBreastCancerIncidence.data.nested.table.current_year[0] || {name:'Hispanic', cancer_incident:0, pop:breastCancerPopulation.data.nested.table.current_year[0].cancer_population};
            breastCancerIncidenceData.name = 'Hispanic';
            cancer_incident_breast_data.data.nested.table.race.push(breastCancerIncidenceData);
            searchUtils.applySuppressions(cancer_incident_breast_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_breast_data.data.nested, rules, 'cancer_incident');

            var cancer_incident_colonAndRectum_data = searchUtils.populateDataWithMappings(resp[74], 'cancer_incident');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_incident_colonAndRectum_data.data.nested.table.race, 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_colonAndRectum_data.data.nested.table, cancer_colonAndRectum_population_index, '');

            var hispanicColonCancerIncidence = searchUtils.populateDataWithMappings(resp[118], 'cancer_incident');
            searchUtils.attachPopulation(hispanicColonCancerIncidence.data.nested.table, crPopulationIndex, '');
            var colonCancerIncidenceData = hispanicColonCancerIncidence.data.nested.table.current_year[0] || {name:'Hispanic', cancer_incident:0, pop:crCancerPopulation.data.nested.table.current_year[0].cancer_population};
            colonCancerIncidenceData.name = 'Hispanic';
            cancer_incident_colonAndRectum_data.data.nested.table.race.push(colonCancerIncidenceData);
            searchUtils.applySuppressions(cancer_incident_colonAndRectum_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_colonAndRectum_data.data.nested, rules, 'cancer_incident');

            var cancer_incident_lungAndBronchus_data = searchUtils.populateDataWithMappings(resp[75], 'cancer_incident');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_incident_lungAndBronchus_data.data.nested.table.race, 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_lungAndBronchus_data.data.nested.table, cancer_lungAndBronchus_population_index, '');

            var hispanicLungCancerIncidence = searchUtils.populateDataWithMappings(resp[119], 'cancer_incident');
            searchUtils.attachPopulation(hispanicLungCancerIncidence.data.nested.table, lungPopulationIndex, '');
            var lungCancerIncidenceData = hispanicLungCancerIncidence.data.nested.table.current_year[0] || {name:'Hispanic', cancer_incident:0, pop:lungCancerPopulation.data.nested.table.current_year[0].cancer_population};
            lungCancerIncidenceData.name = 'Hispanic';
            cancer_incident_lungAndBronchus_data.data.nested.table.race.push(lungCancerIncidenceData);
            searchUtils.applySuppressions(cancer_incident_lungAndBronchus_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_lungAndBronchus_data.data.nested, rules, 'cancer_incident');

            var cancer_incident_melanoma_data = searchUtils.populateDataWithMappings(resp[76], 'cancer_incident');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_incident_melanoma_data.data.nested.table.race, 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_melanoma_data.data.nested.table, cancer_melanoma_population_index, '');

            var hispanicMelanomaCancerIncidence = searchUtils.populateDataWithMappings(resp[120], 'cancer_incident');
            searchUtils.attachPopulation(hispanicMelanomaCancerIncidence.data.nested.table, melanomaPopulationIndex, '');
            var melanomaCancerIncidenceData = hispanicMelanomaCancerIncidence.data.nested.table.current_year[0] || {name:'Hispanic', cancer_incident:0, pop:melanomaCancerPopulation.data.nested.table.current_year[0].cancer_population};
            melanomaCancerIncidenceData.name = 'Hispanic';
            cancer_incident_melanoma_data.data.nested.table.race.push(melanomaCancerIncidenceData);
            searchUtils.applySuppressions(cancer_incident_melanoma_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_melanoma_data.data.nested, rules, 'cancer_incident');

            var cancer_incident_cervix_data = searchUtils.populateDataWithMappings(resp[77], 'cancer_incident');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_incident_cervix_data.data.nested.table.race, 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_cervix_data.data.nested.table, cancer_cervix_population_index, '');

            var hispanicCervixCancerIncidence = searchUtils.populateDataWithMappings(resp[121], 'cancer_incident');
            searchUtils.attachPopulation(hispanicCervixCancerIncidence.data.nested.table, cervixPopulationIndex, '');
            var cervixCancerIncidenceData = hispanicCervixCancerIncidence.data.nested.table.current_year[0] || {name:'Hispanic', cancer_incident:0, pop:cervixCancerPopulation.data.nested.table.current_year[0].cancer_population};
            cervixCancerIncidenceData.name = 'Hispanic';
            cancer_incident_cervix_data.data.nested.table.race.push(cervixCancerIncidenceData);
            searchUtils.applySuppressions(cancer_incident_cervix_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_cervix_data.data.nested, rules, 'cancer_incident');

            var cancer_incident_ovary_data = searchUtils.populateDataWithMappings(resp[78], 'cancer_incident');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_incident_ovary_data.data.nested.table.race, 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_ovary_data.data.nested.table, cancer_ovary_population_index, '');

            var hispanicOvaryCancerIncidence = searchUtils.populateDataWithMappings(resp[122], 'cancer_incident');
            searchUtils.attachPopulation(hispanicOvaryCancerIncidence.data.nested.table, ovaryPopulationIndex, '');
            var ovaryCancerIncidenceData = hispanicOvaryCancerIncidence.data.nested.table.current_year[0] || {name:'Hispanic', cancer_incident:0, pop:ovaryCancerPopulation.data.nested.table.current_year[0].cancer_population};
            ovaryCancerIncidenceData.name = 'Hispanic';
            cancer_incident_ovary_data.data.nested.table.race.push(ovaryCancerIncidenceData);
            searchUtils.applySuppressions(cancer_incident_ovary_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_ovary_data.data.nested, rules, 'cancer_incident');

            var cancer_incident_prostate_data = searchUtils.populateDataWithMappings(resp[79], 'cancer_incident');
            searchUtils.addMissingFilterOptions(selectedRaces, cancer_incident_prostate_data.data.nested.table.race, 'cancer_incident');
            searchUtils.attachPopulation(cancer_incident_prostate_data.data.nested.table, cancer_prostate_population_index, '');

            var hispanicProstateCancerIncidence = searchUtils.populateDataWithMappings(resp[123], 'cancer_incident');
            searchUtils.attachPopulation(hispanicProstateCancerIncidence.data.nested.table, prostatePopulationIndex, '');
            var prostateCancerIncidenceData = hispanicProstateCancerIncidence.data.nested.table.current_year[0] || {name:'Hispanic', cancer_incident:0, pop:prostateCancerPopulation.data.nested.table.current_year[0].cancer_population};
            prostateCancerIncidenceData.name = 'Hispanic';
            cancer_incident_prostate_data.data.nested.table.race.push(prostateCancerIncidenceData);
            searchUtils.applySuppressions(cancer_incident_prostate_data, 'cancer_incident', 16);
            searchUtils.applyCustomSuppressions(cancer_incident_prostate_data.data.nested, rules, 'cancer_incident');

            //Merge Cancer incident & Mortality data
            sortOrder = ['American Indian/Alaska Native', 'Asian or Pacific Islander', 'Black', 'Hispanic'];
            var cancer_data = [
                {
                    mortality: sortArrayByPropertyAndSortOrder(cancer_mortality_breast_data.data.nested.table.race, 'name', sortOrder),
                    incidence: sortArrayByPropertyAndSortOrder(cancer_incident_breast_data.data.nested.table.race, 'name', sortOrder),
                    site: 'Breast'
                },{
                    mortality: sortArrayByPropertyAndSortOrder(cancer_mortality_cervix_data.data.nested.table.race, 'name', sortOrder),
                    incidence: sortArrayByPropertyAndSortOrder(cancer_incident_cervix_data.data.nested.table.race, 'name', sortOrder),
                    site: 'Cervix Uteri†'
                },{
                    mortality: sortArrayByPropertyAndSortOrder(cancer_mortality_colonAndRectum_data.data.nested.table.race, 'name', sortOrder),
                    incidence: sortArrayByPropertyAndSortOrder(cancer_incident_colonAndRectum_data.data.nested.table.race, 'name', sortOrder),
                    site: 'Colon and Rectum'
                },{
                    mortality: sortArrayByPropertyAndSortOrder(cancer_mortality_lungAndBronchus_data.data.nested.table.race, 'name', sortOrder),
                    incidence: sortArrayByPropertyAndSortOrder(cancer_incident_lungAndBronchus_data.data.nested.table.race, 'name', sortOrder),
                    site: 'Lung and Bronchus'
                },{
                    mortality: sortArrayByPropertyAndSortOrder(cancer_mortality_melanoma_data.data.nested.table.race, 'name', sortOrder),
                    incidence: sortArrayByPropertyAndSortOrder(cancer_incident_melanoma_data.data.nested.table.race, 'name', sortOrder),
                    site: 'Melanoma of the Skin'
                },{
                    mortality: sortArrayByPropertyAndSortOrder(cancer_mortality_ovary_data.data.nested.table.race, 'name', sortOrder),
                    incidence: sortArrayByPropertyAndSortOrder(cancer_incident_ovary_data.data.nested.table.race, 'name', sortOrder),
                    site: 'Ovary†'
                },{
                    mortality: sortArrayByPropertyAndSortOrder(cancer_mortality_prostate_data.data.nested.table.race, 'name', sortOrder),
                    incidence: sortArrayByPropertyAndSortOrder(cancer_incident_prostate_data.data.nested.table.race, 'name', sortOrder),
                    site: 'Prostate††'
                }
            ];

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
                {disease:"Early Latent Syphilis", data:prepareDiseaseData(stdEarlySyphilisData, 'std')},
                {disease:"Congenital Syphilis", data:prepareDiseaseData(stdCongenitalData, 'std')}];
            factSheet.hivAIDSData = [{disease:"AIDS Diagnoses", data:prepareDiseaseData(AIDSDiagnosesData, 'aids')},
                {disease:"AIDS Deaths*", data:prepareDiseaseData(AIDSDeathsData, 'aids')},
                {disease:"AIDS Prevalence*", data:prepareDiseaseData(AIDSPrevalenceData, 'aids')},
                {disease:"HIV Diagnoses", data:prepareDiseaseData(HIVDiagnosesData, 'aids')},
                {disease:"HIV Deaths*", data:prepareDiseaseData(HIVDeathsData, 'aids')},
                {disease:"HIV Prevalence*", data:prepareDiseaseData(HIVPrevalenceData, 'aids')}];

            factSheet.detailMortalityData = [
                {causeOfDeath:"Total (all ages)", data:detailMortalityTotal_Data.data.nested.table.race},
                {causeOfDeath:"Cancer (Malignant neoplasms)", data:detailMortalityC00_C97_Data.data.nested.table.race},
                {causeOfDeath: "Breast Cancer (Malignant neoplasms of breast)", data:detailMortalityC50Data.data.nested.table.race},
                {causeOfDeath: "Cervical Cancer (Malignant neoplasm of cervix uteri)", data:detailMortalityC53_Data.data.nested.table.race},
                {causeOfDeath: "Cerebrovascular diseases (Stroke)", data:detailMortalityI60_I69_Data.data.nested.table.race},
                {causeOfDeath: "Chronic Lower Respiratory Disease", data:detailMortalityJ40_J47_J60_Data.data.nested.table.race},
                {causeOfDeath: "Alcohol or Drug Induced", data:detailMortalityDrugInduced_Data.data.nested.table.race},
                {causeOfDeath: "Suicide", data:detailMortalitySuicide_Data.data.nested.table.race},
                {causeOfDeath: "Homicide", data:detailMortalityHomicide_Data.data.nested.table.race},
                {causeOfDeath: "Human Immunodeficiency Virus(HIV)", data:detailMortalityB20_B24_Data.data.nested.table.race}
            ];
            //for natality
            var sortOrder = ['American Indian', 'Asian or Pacific Islander', 'Black'];
            factSheet.natality = {
                birthRateData:sortArrayByPropertyAndSortOrder(natality_BirthRates_Data.data.nested.table.race, 'name', sortOrder),
                fertilityRatesData:sortArrayByPropertyAndSortOrder(natality_fertilityRates_Data.data.nested.table.race, 'name', sortOrder),
                vaginalData:sortArrayByPropertyAndSortOrder(natality_vaginal_Data.data.nested.table.race, 'name', sortOrder),
                cesareanData:sortArrayByPropertyAndSortOrder(natality_cesarean_Data.data.nested.table.race, 'name', sortOrder),
                lowBirthWeightData:sortArrayByPropertyAndSortOrder(natality_lowBirthWeight_Data.data.nested.table.race, 'name', sortOrder),
                twinBirthData: sortArrayByPropertyAndSortOrder(natality_twinBirth_Data.data.nested.table.race, 'name', sortOrder),
                totalBirthPopulation:sortArrayByPropertyAndSortOrder(natality_totalBirthPopulation_Data.data.nested.table.race, 'name', sortOrder)
            };

            factSheet.cancerData = cancer_data;
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

    pramsData.pregnantWoment.push({"question": "Smoking cigarettes during the last three months of pregnancy", data: pregnantWomenData[0].table.question[0] && pregnantWomenData[0].table.question[0].yes ? pregnantWomenData[0].table.question[0].yes.maternal_race : "Not applicable"});
    pramsData.pregnantWoment.push({"question": "Intended pregnancy", data: pregnantWomenData[1].table.question[0] && pregnantWomenData[1].table.question[0]["intended"] ? pregnantWomenData[1].table.question[0]["intended"].maternal_race : "Not applicable"});
    pramsData.pregnantWoment.push({"question": "Females reported physical abuse by husband or partner during pregnancy (percent)", data: pregnantWomenData[2].table.question[0] && pregnantWomenData[2].table.question[0].yes ? pregnantWomenData[2].table.question[0].yes.maternal_race: "Not applicable"});

    pramsData.women.push({"question": "With one or more previous live births who reported unintended pregnancy", data: womenData[0].table.question[0] && womenData[0].table.question[0]["unintended"] ? womenData[0].table.question[0]["unintended"].maternal_race : "Not applicable"});
    pramsData.women.push({"question": "Ever breastfed or pump breast milk to feed after delivery", data: womenData[1].table.question[0] && womenData[1].table.question[0].yes ? womenData[1].table.question[0].yes.maternal_race : "Not applicable"});
    pramsData.women.push({"question": "Indicator of depression 3 months before pregnancy", data: womenData[2].table.question[0] && womenData[2].table.question[0].yes ? womenData[2].table.question[0].yes.maternal_race : "Not applicable"});
    return pramsData;
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
        var property = 'name';
        var sortOrder = ['AI/AN', 'Asian', 'Black', 'Hispanic', 'Multiracial non-Hispanic', 'NHOPI', 'Other Race'];
        switch(eachRecord.name){
            case "x_bmi5cat":
                brfssData[0].data = sortArrayByPropertyAndSortOrder(eachRecord["obese (bmi 30.0 - 99.8)"].race, property, sortOrder);
                break;
            case "x_rfsmok3":
                brfssData[1].data = sortArrayByPropertyAndSortOrder(eachRecord.yes.race, property, sortOrder);
                break;
            case "x_frtlt1":
                brfssData[2].data = sortArrayByPropertyAndSortOrder(eachRecord["one or more times per day"].race, property, sortOrder);
                break;
            case "x_veglt1":
                brfssData[3].data = sortArrayByPropertyAndSortOrder(eachRecord["one or more times per day"].race, property, sortOrder);
                break;
            case "x_rfdrhv5":
                brfssData[4].data = sortArrayByPropertyAndSortOrder(eachRecord["meet criteria for heavy drinking"].race, property, sortOrder);
                break;
            case "x_paindx1":
                brfssData[5].data = sortArrayByPropertyAndSortOrder(eachRecord.yes.race, property, sortOrder);
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
    var sortOrder = ['Am Indian / Alaska Native', 'Asian', 'Black or African American',
        'Hispanic/Latino', 'Multiple - Non-Hispanic', 'Native Hawaiian/other PI'];
    var property = 'name';
    yrbsData.push({
        "question": "Currently use alcohol", data:data.table.question[0] && data.table.question[0].Yes ?
            sortArrayByPropertyAndSortOrder(data.table.question[0].Yes.race, property, sortOrder) : "Not applicable"
    });
    yrbsData.push({
        "question": "Currently use cigarettes", data:data.table.question[1] && data.table.question[1].Yes ?
            sortArrayByPropertyAndSortOrder(data.table.question[1].Yes.race, property, sortOrder) : "Not applicable"
    });
    yrbsData.push({
        "question": "Currently use marijuana", data:data.table.question[2] && data.table.question[2].Yes ?
            sortArrayByPropertyAndSortOrder(data.table.question[2].Yes.race, property, sortOrder) : "Not applicable"
    });
    yrbsData.push({
        "question": "Currently sexually active", data:data.table.question[3] && data.table.question[3].Yes ?
            sortArrayByPropertyAndSortOrder(data.table.question[3].Yes.race, property, sortOrder) : "Not applicable"
    });
    yrbsData.push({
        "question": "Attempted suicide", data:data.table.question[4] && data.table.question[4].Yes ?
            sortArrayByPropertyAndSortOrder(data.table.question[4].Yes.race, property, sortOrder) : "Not applicable"
    });
    yrbsData.push({
        "question": "Overweight", data:data.table.question[5] && data.table.question[5].Yes ?
            sortArrayByPropertyAndSortOrder(data.table.question[5].Yes.race, property, sortOrder) : "Not applicable"
    });
    return yrbsData;
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
            record['cases'] = 0;
            record['rates'] = '0.0';
        }
        else if(record[countKey] === 'na') {
            record['cases'] = 'Not Available';
            record['rates'] = 'Not Available';
        }
        else if(record[countKey] === 'suppressed') {
            record['cases'] = 'Suppressed';
            record['rates'] = 'Suppressed';
        }
        else {
            record.rates = record['pop'] ? Math.round(record[countKey] / record['pop'] * 1000000) / 10 : 0;
            record['cases'] = formatNumber(record[countKey]);
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

/**
 * Function is used to sort the Array based on given sort order
 * @param arr -> Object array to be sorted
 * @param sortOrder
 */
function sortArrayByPropertyAndSortOrder(arr, property, sortOrder) {
    var results = [];
    sortOrder.forEach(function(key) {
        var found = false;
        arr = arr.filter(function(item) {
            if(!found && item[property] == key) {
                results.push(item);
                found = true;
                return false;
            } else
                return true;
        });
    });
    return results;
}

module.exports = MinorityFactSheet;
