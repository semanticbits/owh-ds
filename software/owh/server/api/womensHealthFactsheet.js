var elasticSearch = require('../models/elasticSearch');
var yrbs = require("../api/yrbs");
var factSheetQueries = require('../json/factsheet-queries.json');
var factSheetCountriesQueries = require('../json/factsheet-country-queries.json');
var factSheetMensQueries = require('../json/factsheet-mens-queries.json');
var searchUtils = require('../api/utils');
var wonder = require("../api/wonder");
var Q = require('q');
var logger = require('../config/logging');
var AppConstants = require('../utils/constant');

var WomenHealthFactSheet = function() {};

WomenHealthFactSheet.prototype.prepareFactSheet = function (state, fsType, sex) {
    var deferred = Q.defer();
    var factSheetQueryJSON;
    if(state) {
        if(sex == 'male') {
            factSheetQueryJSON = JSON.parse(JSON.stringify(factSheetMensQueries.women_health).split("$state$").join(state));
        } else {
            factSheetQueryJSON = JSON.parse(JSON.stringify(factSheetQueries.women_health).split("$state$").join(state));
        }
    } else {
        factSheetQueryJSON = factSheetCountriesQueries.women_health;
    }
    if (factSheetQueryJSON) {
        //For YRBS & prams - If state 'Arizona', change code to 'AZB'
        if(state && state === 'AZ') {
            factSheetQueryJSON.yrbs["alcohol"].query.sitecode.value = 'AZB';
            if(sex != 'male') {
                Object.keys(factSheetQueryJSON.prams).forEach(function(eachKey){
                    factSheetQueryJSON.prams[eachKey].query.sitecode.value = ["AZB"];
                });
            }
        }
        var factsheet = {};
        getBridgeRaceDataForFactSheet(factSheetQueryJSON, sex).then(function (bridgeRaceData) {
            factsheet = bridgeRaceData;
            return getDetailMortalityDataForFactSheet(factSheetQueryJSON);
        }).then(function (mortalityData) {
            factsheet.detailMortalityData = mortalityData;
            return getPramsDataForFactSheet(factSheetQueryJSON, state, sex);
        }).then(function (pramsData) {
            factsheet.prams = pramsData;
            return getBrfsDataForFactSheet(factSheetQueryJSON);
        }).then(function (brfsData) {
            factsheet.brfss = brfsData;
            return getYrbsDataForFactSheet(factSheetQueryJSON);
        }).then(function (yrbsData) {
            factsheet.yrbs = yrbsData;
            return getSTDDataForFactSheet(factSheetQueryJSON);
        }).then(function (stdData) {
            factsheet.stdData = stdData;
            return getHivDataForFactSheet(factSheetQueryJSON);
        }).then(function (hivData) {
            factsheet.hivAIDSData = hivData;
            return getCancerDataForFactSheet(factSheetQueryJSON, sex)
        }).then(function (cancerData) {
            factsheet.cancerData = cancerData;
            factsheet.state = state;
            factsheet.fsType = fsType;
            deferred.resolve(factsheet);
        });
    }
    return deferred.promise;
};

function getBridgeRaceDataForFactSheet(factSheetQueryJSON, sex) {
    var deferred = Q.defer();
    try {
        var bridgeRaceQueryObj = factSheetQueryJSON.bridge_race;
        var es = new elasticSearch();
        var promises = [
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.gender_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.nonHispanicRace_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.race_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.hispanic_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.age_population)
        ];
        // if(sex == 'male') {
        //     promises.push(es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.gender_national_population));
        //     promises.push(es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.age_national_population));
        // }

        Q.all(promises).then( function (resp) {
            var genderData = searchUtils.populateDataWithMappings(resp[0], 'bridge_race', 'pop');
            var nonHispanicRaceData = searchUtils.populateDataWithMappings(resp[1], 'bridge_race', 'pop');
            var raceData = searchUtils.populateDataWithMappings(resp[2], 'bridge_race', 'pop');
            var hispanicData = searchUtils.populateDataWithMappings(resp[3], 'bridge_race', 'pop');
            var ageGroupData = searchUtils.populateDataWithMappings(resp[4], 'bridge_race', 'pop');
            // var nationalGenderData,nationalAgeGroupData;
            // if(sex == 'male') {
            //     nationalGenderData = searchUtils.populateDataWithMappings(resp[5], 'bridge_race', 'pop');
            //     nationalAgeGroupData = searchUtils.populateDataWithMappings(resp[6], 'bridge_race', 'pop');
            // }
            var data =  prepareFactSheetForPopulation(sex, genderData, nonHispanicRaceData,
                raceData, hispanicData, ageGroupData);
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for BridgeRace:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function getDetailMortalityDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        var alzheimerESQuery = factSheetQueryJSON.detailMortality["alzheimer"][0];
        var alzheimerWonderQuery = factSheetQueryJSON.detailMortality["alzheimer"][1];
        var malignantNeoplasmESQuery = factSheetQueryJSON.detailMortality["malignant_neoplasm"][0];
        var malignantNeoplasmWonderQuery = factSheetQueryJSON.detailMortality["malignant_neoplasm"][1];
        var accidentESQuery = factSheetQueryJSON.detailMortality["accident"][0];
        var accidentWonderQuery = factSheetQueryJSON.detailMortality["accident"][1];
        var cerebrovascularESQuery = factSheetQueryJSON.detailMortality["cerebrovascular"][0];
        var cerebrovascularWonderQuery = factSheetQueryJSON.detailMortality["cerebrovascular"][1];
        var chronicRespiratoryESQuery = factSheetQueryJSON.detailMortality["chronic_respiratory"][0];
        var chronicRespiratoryWonderQuery = factSheetQueryJSON.detailMortality["chronic_respiratory"][1];
        var diabetesMellitusESQuery = factSheetQueryJSON.detailMortality["diabetes_mellitus"][0];
        var diabetesMellitusWonderQuery = factSheetQueryJSON.detailMortality["diabetes_mellitus"][1];
        var influenzaESQuery = factSheetQueryJSON.detailMortality["influenza"][0];
        var influenzaWonderQuery = factSheetQueryJSON.detailMortality["influenza"][1];
        var nephritisESQuery = factSheetQueryJSON.detailMortality["nephritis"][0];
        var nephritisWonderQuery = factSheetQueryJSON.detailMortality["nephritis"][1];
        var suicideESQuery = factSheetQueryJSON.detailMortality["suicide"][0];
        var suicideWonderQuery = factSheetQueryJSON.detailMortality["suicide"][1];
        var heartDiseasesESQuery = factSheetQueryJSON.detailMortality["heart_diseases"][0];
        var heartDiseasesWonderQuery = factSheetQueryJSON.detailMortality["heart_diseases"][1];
        var es = new elasticSearch();
        var promises = [
            es.executeMultipleESQueries(malignantNeoplasmESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(malignantNeoplasmWonderQuery),
            es.executeMultipleESQueries(alzheimerESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(alzheimerWonderQuery),
            es.executeMultipleESQueries(accidentESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(accidentWonderQuery),
            es.executeMultipleESQueries(cerebrovascularESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(cerebrovascularWonderQuery),
            es.executeMultipleESQueries(chronicRespiratoryESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(chronicRespiratoryWonderQuery),
            es.executeMultipleESQueries(diabetesMellitusESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(diabetesMellitusWonderQuery),
            es.executeMultipleESQueries(influenzaESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(influenzaWonderQuery),
            es.executeMultipleESQueries(nephritisESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(nephritisWonderQuery),
            es.executeMultipleESQueries(suicideESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(suicideWonderQuery),
            es.executeMultipleESQueries(heartDiseasesESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(heartDiseasesWonderQuery)
        ];
        Q.all(promises).then(function (resp) {
            var malignantNeoplasmData = searchUtils.populateDataWithMappings(resp[0], 'deaths');
            searchUtils.mergeAgeAdjustedRates(malignantNeoplasmData.data.nested.table, resp[1].table);
            searchUtils.applySuppressions(malignantNeoplasmData, 'deaths');

            var alzheimerData = searchUtils.populateDataWithMappings(resp[2], 'deaths');
            searchUtils.mergeAgeAdjustedRates(alzheimerData.data.nested.table, resp[3].table);
            searchUtils.applySuppressions(alzheimerData, 'deaths');

            var accidentData = searchUtils.populateDataWithMappings(resp[4], 'deaths');
            searchUtils.mergeAgeAdjustedRates(accidentData.data.nested.table, resp[5].table);
            searchUtils.applySuppressions(accidentData, 'deaths');

            var cerebrovascularData = searchUtils.populateDataWithMappings(resp[6], 'deaths');
            searchUtils.mergeAgeAdjustedRates(cerebrovascularData.data.nested.table, resp[7].table);
            searchUtils.applySuppressions(cerebrovascularData, 'deaths');

            var chronicRespiratoryData = searchUtils.populateDataWithMappings(resp[8], 'deaths');
            searchUtils.mergeAgeAdjustedRates(chronicRespiratoryData.data.nested.table, resp[9].table);
            searchUtils.applySuppressions(chronicRespiratoryData, 'deaths');

            var diabetesMellitusData = searchUtils.populateDataWithMappings(resp[10], 'deaths');
            searchUtils.mergeAgeAdjustedRates(diabetesMellitusData.data.nested.table, resp[11].table);
            searchUtils.applySuppressions(diabetesMellitusData, 'deaths');

            var influenzaData = searchUtils.populateDataWithMappings(resp[12], 'deaths');
            searchUtils.mergeAgeAdjustedRates(influenzaData.data.nested.table, resp[13].table);
            searchUtils.applySuppressions(influenzaData, 'deaths');

            var nephritisData = searchUtils.populateDataWithMappings(resp[14], 'deaths');
            searchUtils.mergeAgeAdjustedRates(nephritisData.data.nested.table, resp[15].table);
            searchUtils.applySuppressions(nephritisData, 'deaths');

            var suicideData = searchUtils.populateDataWithMappings(resp[16], 'deaths');
            searchUtils.mergeAgeAdjustedRates(suicideData.data.nested.table, resp[17].table);
            searchUtils.applySuppressions(suicideData, 'deaths');

            var heartDiseaseData = searchUtils.populateDataWithMappings(resp[18], 'deaths');
            searchUtils.mergeAgeAdjustedRates(heartDiseaseData.data.nested.table, resp[19].table);
            searchUtils.applySuppressions(heartDiseaseData, 'deaths');

            var data = [
                {causeOfDeath: "Diseases of heart", data:heartDiseaseData.data.nested.table.year[0]},
                {causeOfDeath: "Malignant neoplasms", data:malignantNeoplasmData.data.nested.table.year[0]},
                {causeOfDeath: "Chronic lower respiratory diseases", data:chronicRespiratoryData.data.nested.table.year[0]},
                {causeOfDeath: "Accidents (unintentional injuries)", data:accidentData.data.nested.table.year[0]},
                {causeOfDeath: "Cerebrovascular diseases", data:cerebrovascularData.data.nested.table.year[0]},
                {causeOfDeath: "Alzheimer's disease", data:alzheimerData.data.nested.table.year[0]},
                {causeOfDeath: "Diabetes mellitus", data:diabetesMellitusData.data.nested.table.year[0]},
                {causeOfDeath: "Influenza and pneumonia", data:influenzaData.data.nested.table.year[0]},
                {causeOfDeath: "Nephritis, nephrotic syndrome and nephrosis", data:nephritisData.data.nested.table.year[0]},
                {causeOfDeath: "Intentional self-harm (suicide)", data:suicideData.data.nested.table.year[0]}
            ];

            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for Detailed Mortality:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function processPramsResponse(pramsData, state) {
    if(state) {
        return (pramsData.table.question[0] && pramsData.table.question[0].yes &&
            pramsData.table.question[0].yes.sitecode) ?
            pramsData.table.question[0].yes.sitecode[0].prams.mean : "Not applicable"
    } else {
        return (pramsData.table.question[0] && pramsData.table.question[0].yes &&
            pramsData.table.question[0].yes) ?
            pramsData.table.question[0].yes.prams.mean : "Not applicable"
    }
}
function getPramsDataForFactSheet(factSheetQueryJSON, state, sex) {
    var deferred = Q.defer();
    try {
        if(sex != 'male') {
            //Question: In the 12 months before your baby was born  you were in a physical fight
            var qn205 = factSheetQueryJSON.prams['qn205'];
            //Question: Was your baby seen by a doctor  nurse or other healthcare provider in the first week after he or she left the hospital?
            var qn101 = factSheetQueryJSON.prams['qn101'];
            var yrbsAPI = new yrbs();
            var promises = [
                yrbsAPI.invokeYRBSService(qn205),
                yrbsAPI.invokeYRBSService(qn101)
            ];
            Q.all(promises).then(function (resp) {
                var pramsData = [
                    {"question": "In the 12 months before your baby was born  you were in a physical fight", data: processPramsResponse(resp[0], state)},
                    {"question": "Was your baby seen by a doctor  nurse or other healthcare provider in the first week after he or she left the hospital?",
                        data: processPramsResponse(resp[1], state)}
                ];
                deferred.resolve(pramsData);
            }, function (err) {
                logger.error(err.message);
                deferred.reject(err);
            });
        } else {
            deferred.resolve([]);
        }
    } catch(error) {
        console.error('Error in generating Factsheet for PRAMS data:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function getBrfsDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        new yrbs().invokeYRBSService(factSheetQueryJSON.brfss).then(function (resp) {
            deferred.resolve(prepareBRFSSData(resp));
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for Detailed Mortality:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}


function getYrbsDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        var alcoholStatsQuery = factSheetQueryJSON.yrbs["alcohol"];
        new yrbs().invokeYRBSService(alcoholStatsQuery).then(function (resp) {
            var data = [
                {"question": "Currently use alcohol", data: resp.table.question[0] && resp.table.question[0].Yes ? resp.table.question[0].Yes.mental_health.mean : "Not applicable"},
                {"question": "Currently use cigarettes", data: resp.table.question[1] && resp.table.question[1].Yes ? resp.table.question[1].Yes.mental_health.mean : "Not applicable"},
                {"question": "Currently used electronic vapor products", data: resp.table.question[2] && resp.table.question[2].Yes ? resp.table.question[2].Yes.mental_health.mean : "Not applicable"},
                {"question": "Currently use marijuana", data: resp.table.question[3] && resp.table.question[3].Yes ? resp.table.question[3].Yes.mental_health.mean : "Not applicable"},
                {"question": "Currently sexually active", data: resp.table.question[4] && resp.table.question[4].Yes ? resp.table.question[4].Yes.mental_health.mean : "Not applicable"},
                {"question": "Attempted suicide", data: resp.table.question[5] && resp.table.question[5].Yes ? resp.table.question[5].Yes.mental_health.mean : "Not applicable"},
                {"question": "Overweight", data: resp.table.question[6] && resp.table.question[6].Yes ? resp.table.question[6].Yes.mental_health.mean : "Not applicable"},
                {"question": "Obese", data: resp.table.question[7] && resp.table.question[7].Yes ? resp.table.question[7].Yes.mental_health.mean : "Not applicable"}
            ];
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for Detailed Mortality:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function getSTDDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        var chlamydiaESQuery = factSheetQueryJSON.std["chlamydia"][0];
        var chlamydiaPopulationQuery = factSheetQueryJSON.std["chlamydia"][1];
        var gonorrheaESQuery = factSheetQueryJSON.std["Gonorrhea"][0];
        var gonorrheaPopulationQuery = factSheetQueryJSON.std["Gonorrhea"][1];
        var primarySyphilisESQuery = factSheetQueryJSON.std["Primary and Secondary Syphilis"][0];
        var primarySyphilisPopulationQuery = factSheetQueryJSON.std["Primary and Secondary Syphilis"][1];
        var earlySyphilisESQuery = factSheetQueryJSON.std["Early Latent Syphilis"][0];
        var earlySyphilisPopulationQuery = factSheetQueryJSON.std["Early Latent Syphilis"][1];
        var es = new elasticSearch();
        var promises = [
            es.executeESQuery('owh_std', 'std', chlamydiaESQuery),
            es.aggregateCensusDataQuery(chlamydiaPopulationQuery, 'owh_std', "std", 'pop'),
            es.executeESQuery('owh_std', 'std', gonorrheaESQuery),
            es.aggregateCensusDataQuery(gonorrheaPopulationQuery, 'owh_std', "std", 'pop'),
            es.executeESQuery('owh_std', 'std', primarySyphilisESQuery),
            es.aggregateCensusDataQuery(primarySyphilisPopulationQuery, 'owh_std', "std", 'pop'),
            es.executeESQuery('owh_std', 'std', earlySyphilisESQuery),
            es.aggregateCensusDataQuery(earlySyphilisPopulationQuery, 'owh_std', "std", 'pop')
        ];
        Q.all(promises).then(function (resp) {
            var chlamydiaData = searchUtils.populateDataWithMappings(resp[0], 'std' , 'cases');
            es.mergeWithCensusData(chlamydiaData, resp[1], undefined, 'pop');
            searchUtils.applySuppressions(chlamydiaData, 'std', 4);

            var gonorrheaData = searchUtils.populateDataWithMappings(resp[2], 'std' , 'cases');
            es.mergeWithCensusData(gonorrheaData, resp[3], undefined, 'pop');
            searchUtils.applySuppressions(gonorrheaData, 'std', 4);

            var primarySyphilisData = searchUtils.populateDataWithMappings(resp[4], 'std' , 'cases');
            es.mergeWithCensusData(primarySyphilisData, resp[5],  undefined,'pop');
            searchUtils.applySuppressions(primarySyphilisData, 'std', 4);

            var earlySyphilisData = searchUtils.populateDataWithMappings(resp[6], 'std' , 'cases');
            es.mergeWithCensusData(earlySyphilisData, resp[7], undefined, 'pop');
            searchUtils.applySuppressions(earlySyphilisData, 'std', 4);

            var data = [
                {disease:"Chlamydia", data: chlamydiaData.data.nested.table.state[0]},
                {disease:"Gonorrhea", data: gonorrheaData.data.nested.table.state[0]},
                {disease:"Primary and Secondary Syphilis", data: primarySyphilisData.data.nested.table.state[0]},
                {disease:"Early Latent Syphilis", data: earlySyphilisData.data.nested.table.state[0]}
            ];
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for Detailed Mortality:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function getHivDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        var aidsDiagnosesESQuery = factSheetQueryJSON.aids["AIDS Diagnoses"][0];
        var aidsDiagnosesPopulationQuery = factSheetQueryJSON.aids["AIDS Diagnoses"][1];
        var aidsDeathsESQuery = factSheetQueryJSON.aids["AIDS Deaths"][0];
        var aidsDeathsPopulationQuery = factSheetQueryJSON.aids["AIDS Deaths"][1];
        var aidsPrevalenceESQuery = factSheetQueryJSON.aids["AIDS Prevalence"][0];
        var aidsPrevalencePopulationQuery = factSheetQueryJSON.aids["AIDS Prevalence"][1];
        var hivDiagnosesESQuery = factSheetQueryJSON.aids["HIV Diagnoses"][0];
        var hivDiagnosesPopulationQuery = factSheetQueryJSON.aids["HIV Diagnoses"][1];
        var hivPrevalenceESQuery = factSheetQueryJSON.aids["HIV Prevalence"][0];
        var hivPrevalencePopulationQuery = factSheetQueryJSON.aids["HIV Prevalence"][1];
        var es = new elasticSearch();
        var promises = [
            es.executeESQuery('owh_aids', 'aids', aidsDiagnosesESQuery),
            es.aggregateCensusDataQuery(aidsDiagnosesPopulationQuery, 'owh_aids', "aids", 'pop'),
            es.executeESQuery('owh_aids', 'aids', aidsDeathsESQuery),
            es.aggregateCensusDataQuery(aidsDeathsPopulationQuery, 'owh_aids', "aids", 'pop'),
            es.executeESQuery('owh_aids', 'aids', aidsPrevalenceESQuery),
            es.aggregateCensusDataQuery(aidsPrevalencePopulationQuery, 'owh_aids', "aids", 'pop'),
            es.executeESQuery('owh_aids', 'aids', hivDiagnosesESQuery),
            es.aggregateCensusDataQuery(hivDiagnosesPopulationQuery, 'owh_aids', "aids", 'pop'),
            es.executeESQuery('owh_aids', 'aids', hivPrevalenceESQuery),
            es.aggregateCensusDataQuery(hivPrevalencePopulationQuery, 'owh_aids', "aids", 'pop')
        ];
        Q.all(promises).then(function (resp) {
            var aidsDiagnosesData = searchUtils.populateDataWithMappings(resp[0], 'aids' , 'cases');
            es.mergeWithCensusData(aidsDiagnosesData, resp[1], undefined, 'pop');
            searchUtils.applySuppressions(aidsDiagnosesData, 'aids', 0);

            var aidsDeathsData = searchUtils.populateDataWithMappings(resp[2], 'aids' , 'cases');
            es.mergeWithCensusData(aidsDeathsData, resp[3], undefined, 'pop');
            searchUtils.applySuppressions(aidsDeathsData, 'aids', 0);

            var aidsPrevalenceData = searchUtils.populateDataWithMappings(resp[4], 'aids' , 'cases');
            es.mergeWithCensusData(aidsPrevalenceData, resp[5], undefined, 'pop');
            searchUtils.applySuppressions(aidsPrevalenceData, 'aids', 0);

            var hivDiagnosesData = searchUtils.populateDataWithMappings(resp[6], 'aids' , 'cases');
            es.mergeWithCensusData(hivDiagnosesData, resp[7], undefined, 'pop');
            searchUtils.applySuppressions(hivDiagnosesData, 'aids', 0);

            var hivPrevalenceData = searchUtils.populateDataWithMappings(resp[8], 'aids' , 'cases');
            es.mergeWithCensusData(hivPrevalenceData, resp[9], undefined, 'pop');
            searchUtils.applySuppressions(hivPrevalenceData, 'aids', 0);

            var data = [
                {disease:"AIDS Diagnoses", data: aidsDiagnosesData.data.nested.table.state[0]},
                {disease:"AIDS Deaths", data: aidsDeathsData.data.nested.table.state[0]},
                {disease:"AIDS Prevalence", data: aidsPrevalenceData.data.nested.table.state[0]},
                {disease:"HIV Diagnoses", data: hivDiagnosesData.data.nested.table.state[0]},
                {disease:"HIV Prevalence", data: hivPrevalenceData.data.nested.table.state[0]}
            ];
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for Detailed Mortality:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function getCancerDataForFactSheet(factSheetQueryJSON, sex) {
    var deferred = Q.defer();
    try {
        var breastCancerESQuery = factSheetQueryJSON.cancer["breast"][0];
        var breastCancerPopulationQuery = factSheetQueryJSON.cancer["breast"][1];
        var colonAndRectumCancerESQuery = factSheetQueryJSON.cancer["colon_rectum"][0];
        var colonAndRectumPopulationQuery = factSheetQueryJSON.cancer["colon_rectum"][1];
        var lungAndBronchusCancerESQuery = factSheetQueryJSON.cancer["lung_bronchus"][0];
        var lungAndBronchusCancerPopulationQuery = factSheetQueryJSON.cancer["lung_bronchus"][1];
        var melanomaCancerESQuery = factSheetQueryJSON.cancer["melanoma"][0];
        var melanomaCancerPopulationQuery = factSheetQueryJSON.cancer["melanoma"][1];
        var cervixCancerESQuery = factSheetQueryJSON.cancer["cervix_uteri"][0];
        var cervixCancerPopulationQuery = factSheetQueryJSON.cancer["cervix_uteri"][1];
        var ovaryCancerESQuery = factSheetQueryJSON.cancer["ovary"][0];
        var ovaryCancerPopulationQuery = factSheetQueryJSON.cancer["ovary"][1];
        var uterusCancerESQuery = factSheetQueryJSON.cancer["uterus"][0];
        var uterusCancerPopulationQuery = factSheetQueryJSON.cancer["uterus"][1];
        var es = new elasticSearch();
        var promises = [
            //Cancer - Mortality
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', breastCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', breastCancerPopulationQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', breastCancerESQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', colonAndRectumCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', colonAndRectumPopulationQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', colonAndRectumCancerESQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', lungAndBronchusCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', lungAndBronchusCancerPopulationQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', lungAndBronchusCancerESQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', melanomaCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', melanomaCancerPopulationQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', melanomaCancerESQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cervixCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cervixCancerPopulationQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', cervixCancerESQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', ovaryCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', ovaryCancerPopulationQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', ovaryCancerESQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', uterusCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', uterusCancerPopulationQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', uterusCancerESQuery)
        ];

        Q.all(promises).then(function (resp) {
            var rules = searchUtils.createCancerIncidenceSuppressionRules(['2016'], true, false);

            var breastCancerMortalityData = prepareCancerData(resp[0], resp[1], 'cancer_mortality');
            var breastCancerIncidentData = prepareCancerData(resp[2], resp[1], 'cancer_incidence');
            searchUtils.applyCustomSuppressions(breastCancerIncidentData.data.nested, rules, 'cancer_incidence');

            var colonCancerMortalityData = prepareCancerData(resp[3], resp[4], 'cancer_mortality');
            var colonCancerIncidentData = prepareCancerData(resp[5], resp[4], 'cancer_incidence');
            searchUtils.applyCustomSuppressions(colonCancerIncidentData.data.nested, rules, 'cancer_incidence');

            var lungCancerMortalityData = prepareCancerData(resp[6], resp[7], 'cancer_mortality');
            var lungCancerIncidentData = prepareCancerData(resp[8], resp[7], 'cancer_incidence');
            searchUtils.applyCustomSuppressions(lungCancerIncidentData.data.nested, rules, 'cancer_incidence');

            var melanomaCancerMortalityData = prepareCancerData(resp[9], resp[10], 'cancer_mortality');
            var melanomaCancerIncidentData = prepareCancerData(resp[11], resp[10], 'cancer_incidence');
            searchUtils.applyCustomSuppressions(melanomaCancerIncidentData.data.nested, rules, 'cancer_incidence');

            var cervixCancerMortalityData = prepareCancerData(resp[12], resp[13], 'cancer_mortality');
            var cervixCancerIncidentData = prepareCancerData(resp[14], resp[13], 'cancer_incidence');
            searchUtils.applyCustomSuppressions(cervixCancerIncidentData.data.nested, rules, 'cancer_incidence');

            var ovaryCancerMortalityData = prepareCancerData(resp[15], resp[16], 'cancer_mortality');
            var ovaryCancerIncidentData = prepareCancerData(resp[17], resp[16], 'cancer_incidence');
            searchUtils.applyCustomSuppressions(ovaryCancerIncidentData.data.nested, rules, 'cancer_incidence');

            var uterusCancerMortalityData = prepareCancerData(resp[18], resp[19], 'cancer_mortality');
            var uterusCancerIncidentData = prepareCancerData(resp[20], resp[19], 'cancer_incidence');
            searchUtils.applyCustomSuppressions(uterusCancerIncidentData.data.nested, rules, 'cancer_incidence');

            var naIncidence = {cancer_incidence: 'Not available'};
            var checkForNoData = function (data, cancerType, sex) {
                if((AppConstants.MENS_CANCER_LIST.indexOf(cancerType) < 0) && sex == 'male' && data == undefined) {
                    return 'na';
                }
                return data;
            };

            var data = [
                {
                    site:"Breast",
                    mortality: breastCancerMortalityData.data.nested.table.current_year[0],
                    incidence: breastCancerIncidentData.data.nested.table.current_year[0]? breastCancerIncidentData.data.nested.table.current_year[0]: naIncidence
                },{
                    site:"Lung and Bronchus",
                    mortality: lungCancerMortalityData.data.nested.table.current_year[0],
                    incidence: lungCancerIncidentData.data.nested.table.current_year[0]? lungCancerIncidentData.data.nested.table.current_year[0]: naIncidence
                },{
                    site:"Colon and Rectum",
                    mortality: colonCancerMortalityData.data.nested.table.current_year[0],
                    incidence: colonCancerIncidentData.data.nested.table.current_year[0]? colonCancerIncidentData.data.nested.table.current_year[0]: naIncidence
                },{
                    site:"Melanoma of the Skin",
                    mortality: melanomaCancerMortalityData.data.nested.table.current_year[0],
                    incidence: melanomaCancerIncidentData.data.nested.table.current_year[0]? melanomaCancerIncidentData.data.nested.table.current_year[0]: naIncidence
                },{
                    site:"Cervix",
                    mortality: checkForNoData(cervixCancerMortalityData.data.nested.table.current_year[0], 'Cervix', sex),
                    incidence: checkForNoData(cervixCancerIncidentData.data.nested.table.current_year[0], 'Cervix', sex),
                },{
                    site:"Ovary",
                    mortality: checkForNoData(ovaryCancerMortalityData.data.nested.table.current_year[0], 'Ovary', sex),
                    incidence: checkForNoData(ovaryCancerIncidentData.data.nested.table.current_year[0], 'Ovary', sex),
                },{
                    site:"Uterus",
                    mortality: checkForNoData(uterusCancerMortalityData.data.nested.table.current_year[0], 'Uterus', sex),
                    incidence: checkForNoData(uterusCancerIncidentData.data.nested.table.current_year[0], 'Uterus', sex),
                }
            ];
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for Detailed Mortality:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function prepareCancerData(pop, totalPop, countKey) {
    var resultantData = searchUtils.populateDataWithMappings(pop, countKey);
    var cancerPopulation = searchUtils.populateDataWithMappings(totalPop, 'cancer_population');
    var cancerPopulationIndex = searchUtils.createPopIndex(cancerPopulation.data.nested.table, 'cancer_population');
    searchUtils.attachPopulation(resultantData.data.nested.table, cancerPopulationIndex, '');
    searchUtils.applySuppressions(resultantData, countKey, 16);
    return resultantData;
}

/**
 * To prepare BRFSS data
 * @return BRFSS data array
 */
function prepareBRFSSData(brfssResp) {
    var brfssData = [
        {question: 'Obese (Body Mass Index 30.0 - 99.8)', data: 'Not applicable' },
        {question: 'Adults who are current smokers', data: 'Not applicable'}
    ];

    brfssResp.table.question.forEach(function(eachRecord) {
        switch(eachRecord.name) {
            case "_bmi5cat":
                if(eachRecord["obese (bmi 30.0 - 99.8)"] && eachRecord["obese (bmi 30.0 - 99.8)"].brfss)
                    brfssData[0].data = eachRecord["obese (bmi 30.0 - 99.8)"].brfss.mean;
                break;
            case "_rfsmok3":
                if(eachRecord.yes && eachRecord.yes.brfss) brfssData[1].data = eachRecord.yes.brfss.mean;
                break;
        }
    });
    return brfssData;
}

function prepareFactSheetForPopulation(sex, genderData, nonHispanicRaceData,
                                       raceData, hispanicData, ageGroupData) {
    var factSheet = {};
    factSheet.gender = genderData.data.simple.group_table_sex;

    factSheet.totalGenderPop = 0;
    factSheet.gender.forEach(function (data) {
        factSheet.totalGenderPop += data.bridge_race;
    });
    var race = nonHispanicRaceData.data.simple.group_table_race;
    race = race.concat(raceData.data.simple.group_table_race, hispanicData.data.simple.group_table_ethnicity);

    ageGroupData = ageGroupData.data.simple.group_table_agegroup;
    prepareAgeGroups(factSheet, ageGroupData, "ageGroups");

    // if(sex == 'male') {
    //     factSheet.menData = nationalGenderData.data.simple.group_table_sex;
    //     factSheet.totalMenGenderPop = 0;
    //     factSheet.menData.forEach(function (data) {
    //         factSheet.totalMenGenderPop += data.bridge_race;
    //     });
    //     nationalAgeGroupData = nationalAgeGroupData.data.simple.group_table_agegroup;
    //     prepareAgeGroups(factSheet, nationalAgeGroupData, "nationalMenAgeGroups");
    // }
    factSheet.race = race;
    return factSheet;
}

function prepareAgeGroups(factSheet, ageGroupData, factSheetAttr) {

    factSheet[factSheetAttr] = [];
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
            factSheet[factSheetAttr].push(data);
        }
    });

    count15to44["15-44 years"][1].bridge_race = count20to44;
    factSheet[factSheetAttr].splice(1, 0, count15to44);
    factSheet[factSheetAttr].splice(2, 0, {name:'45-64 years', bridge_race: count45to64});
    factSheet[factSheetAttr].splice(3, 0, {name:'65-84 years', bridge_race: count65to84});
}
module.exports = WomenHealthFactSheet;