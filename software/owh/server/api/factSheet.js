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
        var hivAIDSDiagnoses_esQuery = factSheetQueries.aids["AIDS Diagnoses"][0];
        var hivAIDSDiagnoses_populationQuery = factSheetQueries.aids["AIDS Diagnoses"][1];
        var hivAIDSDeaths_esQuery = factSheetQueries.aids["AIDS Deaths"][0];
        var hivAIDSDeaths_populationQuery = factSheetQueries.aids["AIDS Deaths"][1];
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
            //For HIV-AIDS - AIDS Diagnoses
            es.executeESQuery('owh_aids', 'aids', hivAIDSDiagnoses_esQuery),
            es.aggregateCensusDataQuery(hivAIDSDiagnoses_populationQuery, 'owh_aids', "aids", 'pop'),
            //For HIV-AIDS - AIDS Deaths
            es.executeESQuery('owh_aids', 'aids', hivAIDSDeaths_esQuery),
            es.aggregateCensusDataQuery(hivAIDSDeaths_populationQuery, 'owh_aids', "aids", 'pop')
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
            //For HIV-AIDS - AIDS Diagnoses
            var hivAIDSDiagnosesData = searchUtils.populateDataWithMappings(resp[18], 'aids' , 'cases');
            es.mergeWithCensusData(hivAIDSDiagnosesData, resp[19], 'pop');
            //For HIV-AIDS - AIDS Diagnoses
            var hivAIDSDeathsData = searchUtils.populateDataWithMappings(resp[20], 'aids' , 'cases');
            es.mergeWithCensusData(hivAIDSDeathsData, resp[21], 'pop');
            var factSheet = prepareFactSheetForPopulation(genderData, nonHispanicRaceData,
                raceData, hispanicData, ageGroupData);
            factSheet.infantMortalityData = infantMortalityData;
            factSheet.tuberculosis = prepareDiseaseData(tbData, 'tb');
            factSheet.stdData = [{disease:"Chlamydia", data:prepareDiseaseData(stdChlamydiaData, 'std')},
                {disease:"Gonorrhea", data:prepareDiseaseData(stdGonorrheaData, 'std')},
                {disease:"Primary and Secondary Syphilis", data:prepareDiseaseData(stdPrimarySyphilisData, 'std')},
                {disease:"Early Latent Syphilis", data:prepareDiseaseData(stdEarlySyphilisData, 'std')},
                {disease:"Congenital Syphilis", data:prepareDiseaseData(stdCongenitalData, 'std')}];
            factSheet.hivAIDSData = [{disease:"AIDS Diagnoses", data:prepareDiseaseData(hivAIDSDiagnosesData, 'aids')},
                {disease:"AIDS Deaths", data:prepareDiseaseData(hivAIDSDeathsData, 'aids')}];
            deferred.resolve(factSheet);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    return deferred.promise;
};

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
