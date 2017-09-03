var elasticSearch = require('../models/elasticSearch');
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
    if (fsType === 'State Health') {
        var bridgeRaceQueryObj = factSheetQueries.bridge_race;
        //STD
        var std_chlamydia_esQuery = factSheetQueries.std["chlamydia"][0];
        var std_chlamydia_populationQuery = factSheetQueries.std["chlamydia"][1];
        var std_gonorrhea_esQuery = factSheetQueries.std["Gonorrhea"][0];
        var std_gonorrhea_populationQuery = factSheetQueries.std["Gonorrhea"][1];
        var std_primarySyphilis_esQuery = factSheetQueries.std["Primary and Secondary Syphilis"][0];
        var std_primarySyphilis_populationQuery = factSheetQueries.std["Primary and Secondary Syphilis"][1];
        var std_earlySyphilis_esQuery = factSheetQueries.std["Early Latent Syphilis"][0];
        var std_earlySyphilis_populationQuery =factSheetQueries.std["Early Latent Syphilis"][1];
        var std_congSyphilis_esQuery = factSheetQueries.std["Congenital Syphilis"][0];
        var std_congSyphilis_populationQuery = factSheetQueries.std["Congenital Syphilis"][1];
        //HIV-AIDS
        var AIDSDiagnoses_esQuery = factSheetQueries.aids["AIDS Diagnoses"][0];
        var AIDSDiagnoses_populationQuery = factSheetQueries.aids["AIDS Diagnoses"][1];
        var AIDSDeaths_esQuery = factSheetQueries.aids["AIDS Deaths"][0];
        var AIDSDeaths_populationQuery = factSheetQueries.aids["AIDS Deaths"][1];
        var AIDSPrevalence_esQuery = factSheetQueries.aids["AIDS Prevalence"][0];
        var AIDSPrevalence_populationQuery = factSheetQueries.aids["AIDS Prevalence"][1];
        var HIVDiagnoses_esQuery = factSheetQueries.aids["HIV Diagnoses"][0];
        var HIVDiagnoses_populationQuery = factSheetQueries.aids["HIV Diagnoses"][1];
        var HIVDeaths_esQuery = factSheetQueries.aids["HIV Deaths"][0];
        var HIVDeaths_populationQuery = factSheetQueries.aids["HIV Deaths"][1];
        var HIVPrevalence_esQuery = factSheetQueries.aids["HIV Prevalence"][0];
        var HIVPrevalence_populationQuery = factSheetQueries.aids["HIV Prevalence"][1];
        //Detail Mortality - Total
        var mortality_total_esQuery = factSheetQueries.detailMortality["Total"][0];
        var mortality_total_wonderQuery = factSheetQueries.detailMortality["Total"][1];
        //Detail Mortality - C50-C50
        var c50_esQuery = factSheetQueries.detailMortality["C50-C50"][0];
        var c50_wonderQuery = factSheetQueries.detailMortality["C50-C50"][1];
        //Detail Mortality - C00-C97
        var c00_c97_esQuery = factSheetQueries.detailMortality["C00-C97"][0];
        var c00_c97_wonderQuery = factSheetQueries.detailMortality["C00-C97"][1];
        //Detail Mortality - C53
        var c53_esQuery = factSheetQueries.detailMortality["C53"][0];
        var c53_wonderQuery = factSheetQueries.detailMortality["C53"][1];
        //Detail Mortality - I160-I169
        var i160_i169_esQuery = factSheetQueries.detailMortality["I160-I169"][0];
        var i160_i169_wonderQuery = factSheetQueries.detailMortality["I160-I169"][1];
        //Detail Mortality - J40-J47 and J60
        var j40_j47_j60_esQuery = factSheetQueries.detailMortality["J40-47-60"][0];
        var j40_j47_j60_wonderQuery = factSheetQueries.detailMortality["J40-47-60"][1];
        //Detail Mortality - drug-induced
        var drug_induced_esQuery = factSheetQueries.detailMortality["drug-induced"][0];
        var drug_induced_wonderQuery = factSheetQueries.detailMortality["drug-induced"][1];
        //Detail Mortality - Suicide
        var suicide_esQuery = factSheetQueries.detailMortality["Suicide"][0];
        var suicide_wonderQuery = factSheetQueries.detailMortality["Suicide"][1];
        //Detail Mortality - Homicide
        var homicide_esQuery = factSheetQueries.detailMortality["Homicide"][0];
        var homicide_wonderQuery = factSheetQueries.detailMortality["Homicide"][1];
        //Detail Mortality - B20-B24
        var b20_b24_esQuery = factSheetQueries.detailMortality["B20-B24"][0];
        var b20_b24_wonderQuery = factSheetQueries.detailMortality["B20-B24"][1];
        //Natality - Brith Rates
        var natality_birthRates_esQuery = factSheetQueries.natality["birthRates"][0];
        var natality_birthRates_populationQuery = factSheetQueries.natality["birthRates"][1];
        //Natality - fertilityRates
        var natality_fertilityRates_esQuery = factSheetQueries.natality["fertilityRates"][0];
        var natality_fertilityRates_populationQuery = factSheetQueries.natality["fertilityRates"][1];
        //Cancer - Mortality
        var cancer_mortality_esQuery = factSheetQueries.cancer["mortality"][0];
        var cancer_mortality_populationQuery = factSheetQueries.cancer["mortality"][1];


        var es = new elasticSearch();
        var promises = [
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.gender_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.nonHispanicRace_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.race_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.hispanic_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.age_population),
            new wonder('D69').invokeWONDER(factSheetQueries.infant_mortality),
            //For Tuberculosis
            es.executeESQuery('owh_tb', 'tb', factSheetQueries.tuberculosis[0]),
            es.aggregateCensusDataQuery(factSheetQueries.tuberculosis[1], 'owh_tb', "tb", 'pop'),
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
            //Cancer - Mortality
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cancer_mortality_esQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cancer_mortality_populationQuery)

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
            // For STD - Gonorrhea
            var stdGonorrheaData = searchUtils.populateDataWithMappings(resp[10], 'std' , 'cases');
            es.mergeWithCensusData(stdGonorrheaData, resp[11], 'pop');
            // For STD - Primary and Secondary Syphilis
            var stdPrimarySyphilisData = searchUtils.populateDataWithMappings(resp[12], 'std' , 'cases');
            es.mergeWithCensusData(stdPrimarySyphilisData, resp[13], 'pop');
            // For STD - Early Latent Syphilis
            var stdEarlySyphilisData = searchUtils.populateDataWithMappings(resp[14], 'std' , 'cases');
            es.mergeWithCensusData(stdEarlySyphilisData, resp[15], 'pop');
            //For STD - Congenital Syphilis
            var stdCongenitalData = searchUtils.populateDataWithMappings(resp[16], 'std' , 'cases');
            es.mergeWithCensusData(stdCongenitalData, resp[17], 'pop');
            //For - AIDS Diagnoses
            var AIDSDiagnosesData = searchUtils.populateDataWithMappings(resp[18], 'aids' , 'cases');
            es.mergeWithCensusData(AIDSDiagnosesData, resp[19], 'pop');
            //For - AIDS Deaths
            var AIDSDeathsData = searchUtils.populateDataWithMappings(resp[20], 'aids' , 'cases');
            es.mergeWithCensusData(AIDSDeathsData, resp[21], 'pop');
            //For - AIDS Prevalence
            var AIDSPrevalenceData = searchUtils.populateDataWithMappings(resp[22], 'aids' , 'cases');
            es.mergeWithCensusData(AIDSPrevalenceData, resp[23], 'pop');
            //For - HIV Diagnoses
            var HIVDiagnosesData = searchUtils.populateDataWithMappings(resp[24], 'aids' , 'cases');
            es.mergeWithCensusData(HIVDiagnosesData, resp[25], 'pop');
            //For - HIV Deaths
            var HIVDeathsData = searchUtils.populateDataWithMappings(resp[26], 'aids' , 'cases');
            es.mergeWithCensusData(HIVDeathsData, resp[27], 'pop');
            //For - HIV Prevalence
            var HIVPrevalenceData = searchUtils.populateDataWithMappings(resp[28], 'aids' , 'cases');
            es.mergeWithCensusData(HIVPrevalenceData, resp[29], 'pop');
            //For - Detail Mortality - Total
            var detailMortalityTotal_Data = searchUtils.populateDataWithMappings(resp[30], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityTotal_Data.data.nested.table, resp[31].table);
            //For - Detail Mortality - C00-C97
            var detailMortalityC00_C97_Data = searchUtils.populateDataWithMappings(resp[32], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC00_C97_Data.data.nested.table, resp[33].table);
            //For - Detail Mortality - C50-C50
            var detailMortalityC50Data = searchUtils.populateDataWithMappings(resp[34], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC50Data.data.nested.table, resp[35].table);
            //For - Detail Mortality - C53
            var detailMortalityC53_Data = searchUtils.populateDataWithMappings(resp[36], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityC53_Data.data.nested.table, resp[37].table);
            //For - Detail Mortality - I60-69
            var detailMortalityI60_I69_Data = searchUtils.populateDataWithMappings(resp[38], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityI60_I69_Data.data.nested.table, resp[39].table);
            //For - Detail Mortality - J40-J47 and J60
            var detailMortalityJ40_J47_J60_Data = searchUtils.populateDataWithMappings(resp[40], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityJ40_J47_J60_Data.data.nested.table, resp[41].table);
            //For - Detail Mortality - Drug induced
            var detailMortalityDrugInduced_Data = searchUtils.populateDataWithMappings(resp[42], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityDrugInduced_Data.data.nested.table, resp[43].table);
            //For - Detail Mortality -Suicide
            var detailMortalitySuicide_Data = searchUtils.populateDataWithMappings(resp[44], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalitySuicide_Data.data.nested.table, resp[45].table);
            //For - Detail Mortality -Homicide
            var detailMortalityHomicide_Data = searchUtils.populateDataWithMappings(resp[46], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityHomicide_Data.data.nested.table, resp[47].table);
            //For - Detail Mortality -B20-B24
            var detailMortalityB20_B24_Data = searchUtils.populateDataWithMappings(resp[48], 'deaths');
            searchUtils.mergeAgeAdjustedRates(detailMortalityB20_B24_Data.data.nested.table, resp[49].table);
            //Natality - Birth Rates
            var natality_BirthRates_Data = searchUtils.populateDataWithMappings(resp[50], 'natality');
            es.mergeWithCensusData(natality_BirthRates_Data, resp[51], 'pop');
            //Natality - fertilityRates
            var natality_fertilityRates_Data = searchUtils.populateDataWithMappings(resp[52], 'natality');
            es.mergeWithCensusData(natality_fertilityRates_Data, resp[53], 'pop');
            //Cancer - Mortality
            var cancer_mortality_data = searchUtils.populateDataWithMappings(resp[54], 'cancer_mortality');
            var cancer_mortality_population = searchUtils.populateDataWithMappings(resp[55], 'cancer_population');
            searchUtils.attachPopulation(cancer_mortality_data.data.nested.table, cancer_mortality_population.data.nested.table, []);

            var factSheet = prepareFactSheetForPopulation(genderData, nonHispanicRaceData,
                raceData, hispanicData, ageGroupData);
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
            factSheet.detailMortalityData = [{causeOfDeath:"Total (all ages)", data:detailMortalityTotal_Data.data.nested.table.year[0]},
                {causeOfDeath:"Cancer (Malignant neoplasms)", data:[]},
                {causeOfDeath: "Breast Cancer (Malignant neoplasms of breast)", data:detailMortalityC50Data.data.nested.table.year[0]},
                {causeOfDeath: "Cervical Cancer(Malignant neoplasm of cervix uteri)", data:detailMortalityC53_Data.data.nested.table.year[0]},
                {causeOfDeath: "Cerebrovascular diseases (Stroke)", data:detailMortalityI60_I69_Data.data.nested.table.year[0]},
                {causeOfDeath: "Chronic Lower Respiratory Disease", data:detailMortalityJ40_J47_J60_Data.data.nested.table.year[0]},
                {causeOfDeath: "Alcohol or Drug Induced", data:detailMortalityDrugInduced_Data.data.nested.table.year[0]},
                {causeOfDeath: "Suicide", data:detailMortalitySuicide_Data.data.nested.table.year[0]},
                {causeOfDeath: "Homicide", data:detailMortalityHomicide_Data.data.nested.table.year[0]},
                {causeOfDeath: "Human Immunodeficiency Virus(HIV)", data:detailMortalityB20_B24_Data.data.nested.table.year[0]}];
            factSheet.natalityData = prepareNatalityData(natality_BirthRates_Data, natality_fertilityRates_Data);
            factSheet.cancerMortalityData = prepareCancerData(cancer_mortality_data);
            deferred.resolve(factSheet);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    return deferred.promise;
};

function prepareCancerData(cancerMortalityData) {
    var cancerData = [];
    cancerMortalityData.data.nested.table.site.forEach(function(eachRecord){
        var crudeRate = eachRecord.pop != 'n/a' ? Math.round(eachRecord.cancer_mortality /  eachRecord.pop * 1000000) / 10 : "Not Available";
        switch(eachRecord.name){
            case "26000":
                cancerData.push({site:'Breast', deaths: eachRecord.cancer_mortality, rate: crudeRate });
                break;
            case "27010":
                cancerData.push({site:'Cervix Uteri†', deaths: eachRecord.cancer_mortality, rate: crudeRate });
                break;
            case "21041-21052":
                cancerData.push({site:'Colon and Rectum', deaths: eachRecord.cancer_mortality, rate: crudeRate });
                break;
            case "22030":
                cancerData.push({site:'Lung and Bronchus', deaths: eachRecord.cancer_mortality, rate: crudeRate });
                break;
            case "25010":
                cancerData.push({site:'Melanoma of the Skin', deaths: eachRecord.cancer_mortality, rate: crudeRate });
                break;
            case "27040":
                cancerData.push({site:'Ovary†', deaths: eachRecord.cancer_mortality, rate: crudeRate });
                break;
            case "28010-28040":
                cancerData.push({site:'Prostate††', deaths: eachRecord.cancer_mortality, rate: crudeRate });
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



function prepareNatalityData(natalityBirthData, natalityFertilityData) {
    var natalityBirthDataForYear = natalityBirthData.data.nested.table.current_year[0];
    var natalityFertilityDataForYear = natalityFertilityData.data.nested.table.current_year[0];
    var natalityData = {};
    natalityData.births = natalityBirthDataForYear.natality;
    natalityData.population = natalityBirthDataForYear.pop;
    natalityData.birthRate = natalityBirthDataForYear.pop ? Math.round(natalityBirthDataForYear.natality / natalityBirthDataForYear.pop * 1000000) / 10 : 0;

    natalityData.femalePopulation = natalityFertilityDataForYear.pop;
    natalityData.fertilityRate = natalityFertilityDataForYear.pop ? Math.round(natalityFertilityDataForYear.natality / natalityFertilityDataForYear.pop * 1000000) / 10 : 0;
    return natalityData;
}


function prepareDiseaseData(data, countKey) {
    var tbData = data.data.nested.table.race;
    tbData.forEach(function(record, index){
        if(record[countKey] === 0) {
            record['displayValue'] = 0;
        }
        else {
            var rate = record['pop'] ? Math.round(record[countKey] / record['pop'] * 1000000) / 10 : 0;
            record['displayValue'] = record[countKey] + " (" + rate + " )";
        }
        //Delete un wanted properties from JSON
        delete record[countKey];
        //Remove population property except All races population
        index != 0 && delete record['pop'];
    });
    return tbData;
}

function prepareFactSheetForPopulation(genderData, nonHispanicRaceData,
                                       raceData, hispanicData, ageGroupData) {
    var factSheet = {};
    factSheet.totalGenderPop = 0;
    factSheet.gender = genderData.data.simple.group_table_sex;
    factSheet.gender.forEach(function (data) {
        factSheet.totalGenderPop += data.bridge_race;
    });

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
