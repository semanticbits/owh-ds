var elasticSearch = require('../models/elasticSearch');
var yrbs = require("../api/yrbs");
var factSheetQueries = require('../json/factsheet-queries.json');
var factSheetCountriesQueries = require('../json/factsheet-country-queries.json');
var searchUtils = require('../api/utils');
var wonder = require("../api/wonder");
var Q = require('q');
var logger = require('../config/logging');
var AppConstants = require('../utils/constant');

var WomenOfReproductiveAgeHealthFactSheet = function() {};

WomenOfReproductiveAgeHealthFactSheet.prototype.prepareFactSheet = function (state, fsType, sex) {
    var deferred = Q.defer();
    var factSheetQueryJSON;
    if(state) {
        factSheetQueryJSON = JSON.parse(JSON.stringify(factSheetQueries.women_age_health).split("$state$").join(state));
    } else {
        factSheetQueryJSON = factSheetCountriesQueries.women_age_health;
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
        getBridgeRaceDataForFactSheet(factSheetQueryJSON).then(function (bridgeRaceData) {
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
            return getNatalityDataForFactSheet(factSheetQueryJSON, sex);
        }).then(function (natalityData) {
            factsheet.natality = natalityData;
            factsheet.state = state;
            factsheet.fsType = fsType;
            deferred.resolve(factsheet);
        });
    }
    return deferred.promise;
};

function getBridgeRaceDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    var bridgeRaceQueryObj = factSheetQueryJSON.bridge_race;
    var es = new elasticSearch();
    var promises = [
        es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.gender_population),
        es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.age_population)
    ];

    Q.all(promises).then( function (resp) {
        var genderData = searchUtils.populateDataWithMappings(resp[0], 'bridge_race', 'pop');
        var ageGroupData = searchUtils.populateDataWithMappings(resp[1], 'bridge_race', 'pop');
        var data =  prepareFactSheetForPopulation(genderData, ageGroupData);
        deferred.resolve(data);
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

function getDetailMortalityDataForFactSheet(factSheetQueryJSON) {[1];
    var cerebrovascularESQuery = factSheetQueryJSON.detailMortality["cerebrovascular"][0];
    var cerebrovascularWonderQuery = factSheetQueryJSON.detailMortality["cerebrovascular"][1];
    var diabetesMellitusESQuery = factSheetQueryJSON.detailMortality["diabetes_mellitus"][0];
    var diabetesMellitusWonderQuery = factSheetQueryJSON.detailMortality["diabetes_mellitus"][1];
    var heartDiseasesESQuery = factSheetQueryJSON.detailMortality["heart_diseases"][0];
    var heartDiseasesWonderQuery = factSheetQueryJSON.detailMortality["heart_diseases"][1];
    var pregnancyChildbirthPuerperiumESQuery = factSheetQueryJSON.detailMortality["pregnancy_childbirth_puerperium"][0];
    var pregnancyChildbirthPuerperiumWonderQuery = factSheetQueryJSON.detailMortality["pregnancy_childbirth_puerperium"][1];
    var es = new elasticSearch();
    var promises = [
        es.executeMultipleESQueries(cerebrovascularESQuery, 'owh_mortality', 'mortality'),
        new wonder('D77').invokeWONDER(cerebrovascularWonderQuery),
        es.executeMultipleESQueries(diabetesMellitusESQuery, 'owh_mortality', 'mortality'),
        new wonder('D77').invokeWONDER(diabetesMellitusWonderQuery),
        es.executeMultipleESQueries(heartDiseasesESQuery, 'owh_mortality', 'mortality'),
        new wonder('D77').invokeWONDER(heartDiseasesWonderQuery),
        es.executeMultipleESQueries(pregnancyChildbirthPuerperiumESQuery, 'owh_mortality', 'mortality'),
        new wonder('D77').invokeWONDER(pregnancyChildbirthPuerperiumWonderQuery)
    ];
    var deferred = Q.defer();
    Q.all(promises).then(function (resp) {
        var cerebrovascularData = searchUtils.populateDataWithMappings(resp[0], 'deaths');
        searchUtils.mergeAgeAdjustedRates(cerebrovascularData.data.nested.table, resp[1].table);
        searchUtils.applySuppressions(cerebrovascularData, 'deaths');

        var diabetesMellitusData = searchUtils.populateDataWithMappings(resp[2], 'deaths');
        searchUtils.mergeAgeAdjustedRates(diabetesMellitusData.data.nested.table, resp[3].table);
        searchUtils.applySuppressions(diabetesMellitusData, 'deaths');

        var heartDiseaseData = searchUtils.populateDataWithMappings(resp[4], 'deaths');
        searchUtils.mergeAgeAdjustedRates(heartDiseaseData.data.nested.table, resp[5].table);
        searchUtils.applySuppressions(heartDiseaseData, 'deaths');

        var pregnancyChildbirthPuerperiumData = searchUtils.populateDataWithMappings(resp[6], 'deaths');
        searchUtils.mergeAgeAdjustedRates(pregnancyChildbirthPuerperiumData.data.nested.table, resp[7].table);
        searchUtils.applySuppressions(pregnancyChildbirthPuerperiumData, 'deaths');

        var data = [
            {causeOfDeath: "Diseases of heart", data:heartDiseaseData.data.nested.table.year[0]},
            {causeOfDeath: "Cerebrovascular diseases", data:cerebrovascularData.data.nested.table.year[0]},
            {causeOfDeath: "Diabetes mellitus", data:diabetesMellitusData.data.nested.table.year[0]},
            {causeOfDeath: "Intentional self-harm (suicide)", data:pregnancyChildbirthPuerperiumData.data.nested.table.year[0]}
        ];

        deferred.resolve(data);
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });

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
    if(sex != 'male') {
        //Question: In the 12 months before your baby was born  you were in a physical fight
        var qn205 = factSheetQueryJSON.prams['qn205'];
        //Question: Was your baby seen by a doctor  nurse or other health care provider in the first week after he or she left the hospital?
        var qn101 = factSheetQueryJSON.prams['qn101'];
        var yrbsAPI = new yrbs();
        var promises = [
            yrbsAPI.invokeYRBSService(qn205),
            yrbsAPI.invokeYRBSService(qn101)
        ];
        Q.all(promises).then(function (resp) {
            var pramsData = [
                {"question": "In the 12 months before your baby was born  you were in a physical fight", data: processPramsResponse(resp[0], state)},
                {"question": "Was your baby seen by a doctor  nurse or other health care provider in the first week after he or she left the hospital?",
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
    return deferred.promise;
}

function getBrfsDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    new yrbs().invokeYRBSService(factSheetQueryJSON.brfss).then(function (resp) {
        deferred.resolve(prepareBRFSSData(resp));
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}


function getYrbsDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
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
    return deferred.promise;
}

function getSTDDataForFactSheet(factSheetQueryJSON) {
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
    var deferred = Q.defer();
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
    return deferred.promise;
}

function getHivDataForFactSheet(factSheetQueryJSON) {
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
    var deferred = Q.defer();
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
    return deferred.promise;
}

function getNatalityDataForFactSheet(factSheetQueryJSON, sex) {
    var deferred = Q.defer();
    if(sex != 'male') {
        var prepregnancyHypertensionESQuery = factSheetQueryJSON.natality["prepregnancy_hypertension"];
        var gestationalHypertensionESQuery = factSheetQueryJSON.natality["gestational_hypertension"];
        var prepregnancyDiabetesESQuery = factSheetQueryJSON.natality["prepregnancy_diabetes"];
        var gestationalDiabetesESQuery = factSheetQueryJSON.natality["gestational_diabetes"];
        var eclampsiaESQuery = factSheetQueryJSON.natality["eclampsia"];
        var es = new elasticSearch();
        var promises = [
            es.executeMultipleESQueries(prepregnancyHypertensionESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(gestationalHypertensionESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(prepregnancyDiabetesESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(gestationalDiabetesESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(eclampsiaESQuery, 'owh_natality', 'natality'),
        ];

        Q.all(promises).then(function (resp) {
            var prepregnancyHypertensionData = searchUtils.populateDataWithMappings(resp[0], 'natality');
            var gestationalHypertensionData = searchUtils.populateDataWithMappings(resp[1], 'natality');
            var prepregnancyDiabetesData = searchUtils.populateDataWithMappings(resp[2], 'natality');
            var gestationalDiabetesData = searchUtils.populateDataWithMappings(resp[3], 'natality');
            var eclampsiaData = searchUtils.populateDataWithMappings(resp[4], 'natality');

            var data = [
                {cause:"Prepregnancy Hypertension", data: formatNatalityResponseData(prepregnancyHypertensionData)},
                {cause:"Gestational Hypertension", data: formatNatalityResponseData(gestationalHypertensionData)},
                {cause:"Prepregnancy Diabetes", data: formatNatalityResponseData(prepregnancyDiabetesData)},
                {cause:"Gestational Diabetes", data: formatNatalityResponseData(gestationalDiabetesData)},
                {cause:"Eclampsia", data: formatNatalityResponseData(eclampsiaData)}
            ];
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } else {
        deferred.resolve([]);
    }
    return deferred.promise;
}
function formatNatalityResponseData(response) {
    if(response.data.nested.table.current_year && response.data.nested.table.current_year[0] &&
        response.data.nested.table.current_year[0].natality) {
        return response.data.nested.table.current_year[0].natality;
    }
    return '';
}
function getCancerDataForFactSheet(factSheetQueryJSON, sex) {
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

    var deferred = Q.defer();
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
        {question: 'Was there a time in the past 12 months when you needed to see a doctor but could not because of cost?', data: 'Not applicable'},
        {question: 'Do you have any kind of health care coverage?', data: 'Not applicable'},
        {question: 'About how long has it been since you last visited a doctor for a routine checkup?', data: 'Not applicable'},
        {question: 'Ever told you had a heart attack (myocardial infarction)?', data: 'Not applicable'},
        {question: 'Ever told you had a stroke?', data: 'Not applicable'},
        {question: 'Have you ever been told by a doctor that you have diabetes?', data: 'Not applicable'}
    ];

    brfssResp.table.question.forEach(function(eachRecord) {
        switch(eachRecord.name) {
            case "_bmi5cat":
                if(eachRecord["obese (bmi 30.0 - 99.8)"] && eachRecord["obese (bmi 30.0 - 99.8)"].brfss)
                    brfssData[0].data = eachRecord["obese (bmi 30.0 - 99.8)"].brfss.mean;
                break;
            case "medcost":
                if(eachRecord.yes && eachRecord.yes.brfss) brfssData[1].data = eachRecord.yes.brfss.mean;
                break;
            case "hlthpln1":
                if(eachRecord.yes && eachRecord.yes.brfss) brfssData[2].data = eachRecord.yes.brfss.mean;
                break;
            case "checkup1":
                if(eachRecord["within the past 5 years"] && eachRecord["within the past 5 years"].brfss)
                    brfssData[0].data = eachRecord["within the past 5 years"].brfss.mean;
                break;
            case "cvdinfr4":
                if(eachRecord.yes && eachRecord.yes.brfss) brfssData[4].data = eachRecord.yes.brfss.mean;
                break;
            case "cvdstrk3":
                if(eachRecord.yes && eachRecord.yes.brfss) brfssData[5].data = eachRecord.yes.brfss.mean;
                break;
            case "diabete3":
                if(eachRecord.yes && eachRecord.yes.brfss) brfssData[6].data = eachRecord.yes.brfss.mean;
                break;
        }
    });
    return brfssData;
}

function prepareFactSheetForPopulation(genderData, ageGroupData) {
    var factSheet = {};
    factSheet.gender = genderData.data.simple.group_table_sex;

    factSheet.totalGenderPop = 0;
    factSheet.gender.forEach(function (data) {
        factSheet.totalGenderPop += data.bridge_race;
    });

    ageGroupData = ageGroupData.data.simple.group_table_agegroup;
    prepareAgeGroups(factSheet, ageGroupData, "ageGroups");
    return factSheet;
}

function prepareAgeGroups(factSheet, ageGroupData, factSheetAttr) {

    factSheet[factSheetAttr] = [];
    var ageGroups20to44 = ['20-24 years', '25-29 years', '30-34 years',
        '35-39 years', '40-44 years'];

    var count20to44 = 0, count15to20 = 0;
    ageGroupData.forEach(function (data) {
        if (ageGroups20to44.indexOf(data.name)>=0) {
            count20to44 += data.bridge_race;
        } else {
            count15to20 = data.bridge_race;
        }
    });

    factSheet[factSheetAttr].push({name: "15-19 years", bridge_race: count15to20}, {name: "20-44 years",bridge_race: count20to44})
}
module.exports = WomenOfReproductiveAgeHealthFactSheet;