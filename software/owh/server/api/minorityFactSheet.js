var elasticSearch = require('../models/elasticSearch');
var yrbs = require("../api/yrbs");
var factSheetQueries = require('../json/factsheet-queries.json');
var factSheetCountriesQueries = require('../json/factsheet-country-queries.json');
var searchUtils = require('../api/utils');
var wonder = require("../api/wonder");
var Q = require('q');
var logger = require('../config/logging');
var MinorityFactSheet = function() {};

MinorityFactSheet.prototype.prepareFactSheet = function (state, fsType) {
    var self = this;
    var deferred = Q.defer();
    var factSheetQueryJSON;
    if(state) {
        factSheetQueryJSON = JSON.parse(JSON.stringify(factSheetQueries.minority_health).split("$state$").join(state));
    } else {
        factSheetQueryJSON = JSON.parse(JSON.stringify(factSheetCountriesQueries.minority_health));
    }
    if (factSheetQueryJSON) {
        //If state 'Arizona' change code to 'AZB' for YRBS,
        if(state === 'AZ') {
            factSheetQueryJSON.yrbs["alcohol"].query.sitecode.value = 'AZB';
            Object.keys(factSheetQueryJSON.prams).forEach(function(eachKey){
                factSheetQueryJSON.prams[eachKey].query.sitecode.value = ["AZB"];
            });
        }

        var es = new elasticSearch();

        var factsheet = {};
        getBridgeRaceDataForFactSheet(factSheetQueryJSON).then(function (bridgeRaceData) {
            factsheet = bridgeRaceData;
            return getFactSheetDataForInfants(factSheetQueryJSON);
        }).then(function (infantData) {
            factsheet.infantMortalityData = infantData;
            return getTBDataForFactSheets(factSheetQueryJSON);
        }).then(function (tbData) {
            factsheet.tuberculosis = tbData;
            // factsheet.tbPopulation = tbData.population;
            return getSTDDataForFactSheets(factSheetQueryJSON);
        }).then(function (stdData) {
            factsheet.stdData = stdData;
            return getAIDSDataForFactSheets(factSheetQueryJSON);
        }).then(function (aidsData) {
            factsheet.hivAIDSData = aidsData;
            return getDetailMortalityDataForFactSheet(factSheetQueryJSON);
        }).then(function (mortalityData) {
            factsheet.detailMortalityData = mortalityData;
            return getNatalityDataForFactSeet(factSheetQueryJSON);
        }).then(function (natalityData) {
            factsheet.natality = natalityData;
            return getCancerDataForFactSheet(factSheetQueryJSON);
        }).then(function (cancerData) {
            factsheet.cancerData = cancerData;
            return getBRFSDataForFactSheet(factSheetQueryJSON, state);
        }).then(function (brfssData) {
            factsheet.brfss = brfssData;
            factsheet.state = state;
            factsheet.fsType = fsType;
            deferred.resolve(factsheet);
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
function preparePRAMSData(respData) {
    // var selectedRaces = {options: ['Black', 'Other Race' ,'Hispanic']};
    var resultData = [
        {"question": "In the 12 months before your baby was born  you were in a physical fight", data: processPramsValue(respData[0])},
        {"question": "Was your baby seen by a doctor nurse or other healthcare provider in the first week after he or she left the hospital?",
            data: processPramsValue(respData[1])}
    ];
    return resultData;
}
function processPramsValue(data) {
    if(data.table.question[0] && data.table.question[0].yes && data.table.question[0].yes.year &&
        data.table.question[0].yes.year[0] && data.table.question[0].yes.year[0].prams &&
        data.table.question[0].yes.year[0].prams.mean) {
        return data.table.question[0].yes.year[0].prams.mean;
    }
    return "Not applicable";
}
/**
 * To prepare BRFSS data
 * @param data_2015
 * @param data_2009
 * @return BRFSS data array
 */
function prepareBRFSSData(data){
    var brfssData = [
        { question: 'Obese (Body Mass Index 30.0 - 99.8)', data: 'Not applicable' },
        { question: 'Adults who are current smokers', data: 'Not applicable' },
        { question: 'Participated in 150 minutes or more of Aerobic Physical Activity per week', data: 'Not applicable' },
        { question: 'Adults who have been told they have high blood pressure (variable calculated from one or more BRFSS questions)', data: 'Not applicable' },
        { question: 'I do have healthcare coverage', data: 'Not applicable' },
    ];
    data.table.question.forEach(function(eachRecord, index) {
        var property = 'name';
        var sortOrder = ['AI/AN', 'Asian', 'Black', 'NHOPI', 'Multiracial non-Hispanic', 'Other Race', 'Hispanic', 'White'];
        switch(eachRecord.name){
            case "_bmi5cat":
                if(eachRecord["obese (bmi 30.0 - 99.8)"]) brfssData[index].data = sortArrayByPropertyAndSortOrder(eachRecord["obese (bmi 30.0 - 99.8)"].race, property, sortOrder);
                break;
            default:
                if(eachRecord.yes) brfssData[index].data = sortArrayByPropertyAndSortOrder(eachRecord.yes.race, property, sortOrder);
                break;
        }
    });
    return brfssData;
}
function processBrfssValue(data) {
    if(data && data[0] && data[0].brfss && data[0].brfss.mean) {
        return data[0].brfss.mean;
    }
    return data;
}

/**
 * To prepare YRBS data
 * @param data
 * @return YRBS data array
 */
function prepareYRBSData(data) {
    var yrbsData = [];
    yrbsData.push({"question": "Currently use alcohol", data: processYrbsValue(data.table.question[0])});
    yrbsData.push({"question": "Currently use cigarettes", data: processYrbsValue(data.table.question[1])});
    yrbsData.push({"question": "Currently use marijuana", data: processYrbsValue(data.table.question[2])});
    yrbsData.push({"question": "Currently sexually active", data: processYrbsValue(data.table.question[3])});
    yrbsData.push({"question": "Attempted suicide", data: processYrbsValue(data.table.question[4])});
    yrbsData.push({"question": "Overweight", data: processYrbsValue(data.table.question[5])});
    yrbsData.push({"question": "Obese", data: processYrbsValue(data.table.question[6])});
    return yrbsData;
}

function processYrbsValue(data) {
    if(data && data.Yes && data.Yes.year && data.Yes.year[0] &&
        data.Yes.year[0].mental_health && data.Yes.year[0].mental_health.mean) {
        return data.Yes.year[0].mental_health.mean;
    }
    return "Not applicable";
}

/**
 * Prepare disease data
 * @param data
 * @param countKey
 */
function prepareDiseaseData(data, countKey) {
    var sortOrder = ['American Indian or Alaska Native', 'Asian', 'Black or African American',
    'Native Hawaiian or Other Pacific Islander', 'Multiple races', 'Hispanic or Latino', 'Unknown', 'White'];
    var diseaseData = sortArrayByPropertyAndSortOrder(data.data.nested.table.race, 'name', sortOrder);
    diseaseData.forEach(function(record, index){
        updateDiseaseRecord(record, countKey);
        //Delete un wanted properties from JSON
        delete record[countKey];
        //Remove population property except All races population
        index != 0 && delete record['pop'];
    });
    // if(totalRecord) diseaseData.unshift(updateDiseaseRecord(totalRecord, countKey));
    return diseaseData;
}

function updateDiseaseRecord(record, countKey) {
    if(record[countKey] === 0) {
        record['cases'] = 0;
        record['rates'] = '0.0';
    }
    else if(record[countKey] === 'na') {
        record['cases'] = 'Not available';
        record['rates'] = 'Not applicable';
    }
    else if(record[countKey] === 'suppressed') {
        record['cases'] = 'Suppressed';
        record['rates'] = 'Suppressed';
    }
    else {
        var rate = record['pop'] ? Math.round(record[countKey] / record['pop'] * 1000000) / 10 : 0;
        record.rates = rate.toFixed(1);
        record['cases'] = formatNumber(record[countKey]);
    }
    return record;
}
/**
 * To format number
 * @param num
 */
function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function getBridgeRaceDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        var sortOrder = ['Total', 'American Indian', 'Asian or Pacific Islander', 'Black', 'Hispanic', 'White'];
        var bridgeRaceQueryObj = factSheetQueryJSON.bridge_race;
        var es = new elasticSearch();
        var promises = [
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.non_hispanic_race_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.hispanic_population),
            es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.age_population)
        ];

        Q.all(promises).then(function (resp) {
            var nonHispanicRaceData = searchUtils.populateDataWithMappings(resp[0], 'bridge_race', 'pop');
            var hispanicData = searchUtils.populateDataWithMappings(resp[1], 'bridge_race', 'pop');
            var ageGroupData = searchUtils.populateDataWithMappings(resp[2], 'bridge_race', 'pop');
            var data =  prepareFactSheetForPopulation(nonHispanicRaceData, hispanicData, ageGroupData);
            data.totalPop = resp[0].aggregations.group_count_pop.value + resp[1].aggregations.group_count_pop.value;
            data.race.unshift({name: "Total", bridge_race: data.totalPop});
            data.race = sortArrayByPropertyAndSortOrder(data.race, 'name', sortOrder);
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

function prepareFactSheetForPopulation(nonHispanicRaceData,
                                       hispanicData, ageGroupData) {
    var factSheet = {};

    var race = nonHispanicRaceData.data.simple.group_table_race;
    race = race.concat(hispanicData.data.simple.group_table_ethnicity);
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

function sortObjectByOrder(object, sortOrder) {
    var sortedObject = {};
    for(var i=0; i<sortOrder.length;i++) {
        sortedObject[sortOrder[i]] = object[sortOrder[i]];
    }
    return sortedObject;
}
/**
 * Prepare Infant mortality data for fact-sheet
 * @param factSheetQueryJSON
 */
function getFactSheetDataForInfants(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        var sortOrder = ['American Indian or Alaska Native', 'Asian or Pacific Islander', 'Black or African American', 'Hispanic', 'White'];
        var promises = [
            new wonder('D69').invokeWONDER(factSheetQueryJSON.infant_mortality.racePopulation),
            new wonder('D69').invokeWONDER(factSheetQueryJSON.infant_mortality.hispanicPopulation)
        ];
        Q.all(promises).then(function (resp) {
            delete resp[0].table.Total;
            //non-hispanic races
            var infantMortalityData = resp[0].table;
            //hispanic data
            infantMortalityData['Hispanic'] = resp[1].table['2016'];
            //cdc returns NUMBER+(Unreliable) i.e. 5.20 (Unreliable) if data is Unreliable
            //Convert it into 'Unreliable' string
            for (var prop in infantMortalityData) {
                var deathRate = infantMortalityData[prop].deathRate;
                if (deathRate && deathRate.indexOf('Unreliable') != -1) {
                    infantMortalityData[prop].deathRate = 'Unreliable';
                }
            }
            deferred.resolve(sortObjectByOrder(infantMortalityData, sortOrder));
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for InfantDeaths:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function getTBDataForFactSheets(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        var es = new elasticSearch();
        var promises = [
            es.executeESQuery('owh_tb', 'tb', factSheetQueryJSON.tuberculosis[0]),
            es.aggregateCensusDataQuery(factSheetQueryJSON.tuberculosis[1], 'owh_tb', "tb", 'pop'),
        ];
        // es.executeESQuery('owh_tb', 'tb', factSheetQueryJSON.tuberculosis[1])
        Q.all(promises).then(function (resp) {
            var tbData = searchUtils.populateDataWithMappings(resp[0], 'tb' , 'cases');
            es.mergeWithCensusData(tbData, resp[1], undefined, 'pop');
            var data = prepareDiseaseData(tbData, 'tb');
            // var totalPop = resp[2].aggregations.total_pop.value;
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for Tuberculosis:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function getSTDDataForFactSheets(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        var chlamydiaESQuery = factSheetQueryJSON.std["chlamydia"][0];
        var chlamydiaPopQuery = factSheetQueryJSON.std["chlamydia"][1];
        var gonorrheaESQuery = factSheetQueryJSON.std["Gonorrhea"][0];
        var gonorrheaPopQuery = factSheetQueryJSON.std["Gonorrhea"][1];
        var syphilisESQuery = factSheetQueryJSON.std["Primary and Secondary Syphilis"][0];
        var syphilisPopQuery = factSheetQueryJSON.std["Primary and Secondary Syphilis"][1];
        var earlySyphilisESQuery = factSheetQueryJSON.std["Early Latent Syphilis"][0];
        var earlySyphilisPopQuery =factSheetQueryJSON.std["Early Latent Syphilis"][1];
        var congSyphilisESQuery = factSheetQueryJSON.std["Congenital Syphilis"][0];
        var congSyphilisPopQuery = factSheetQueryJSON.std["Congenital Syphilis"][1];
        var es = new elasticSearch();
        var promises = [
            es.executeESQuery('owh_std', 'std', chlamydiaESQuery),
            es.aggregateCensusDataQuery(chlamydiaPopQuery, 'owh_std', "std", 'pop'),
            es.executeESQuery('owh_std', 'std', chlamydiaPopQuery),
            es.executeESQuery('owh_std', 'std', gonorrheaESQuery),
            es.aggregateCensusDataQuery(gonorrheaPopQuery, 'owh_std', "std", 'pop'),
            es.executeESQuery('owh_std', 'std', gonorrheaPopQuery),
            es.executeESQuery('owh_std', 'std', syphilisESQuery),
            es.aggregateCensusDataQuery(syphilisPopQuery, 'owh_std', "std", 'pop'),
            es.executeESQuery('owh_std', 'std', syphilisPopQuery),
            es.executeESQuery('owh_std', 'std', earlySyphilisESQuery),
            es.aggregateCensusDataQuery(earlySyphilisPopQuery, 'owh_std', "std", 'pop'),
            es.executeESQuery('owh_std', 'std', earlySyphilisPopQuery)
        ];

        Q.all(promises).then(function (resp) {
            // For Chlamydia
            var stdChlamydiaData = searchUtils.populateDataWithMappings(resp[0], 'std' , 'cases');
            es.mergeWithCensusData(stdChlamydiaData, resp[1], undefined, 'pop');
            searchUtils.applySuppressions(stdChlamydiaData, 'std', 4);
            // For Gonorrhea
            var stdGonorrheaData = searchUtils.populateDataWithMappings(resp[3], 'std' , 'cases');
            es.mergeWithCensusData(stdGonorrheaData, resp[4], undefined, 'pop');
            searchUtils.applySuppressions(stdGonorrheaData, 'std', 4);
            // For Primary and Secondary Syphilis
            var stdPrimarySyphilisData = searchUtils.populateDataWithMappings(resp[6], 'std' , 'cases');
            es.mergeWithCensusData(stdPrimarySyphilisData, resp[7], undefined, 'pop');
            searchUtils.applySuppressions(stdPrimarySyphilisData, 'std', 4);
            // For Early Latent Syphilis
            var stdEarlySyphilisData = searchUtils.populateDataWithMappings(resp[9], 'std' , 'cases');
            es.mergeWithCensusData(stdEarlySyphilisData, resp[10], undefined, 'pop');
            searchUtils.applySuppressions(stdEarlySyphilisData, 'std', 4);

            var stdData = [{disease:"Chlamydia", data:prepareDiseaseData(stdChlamydiaData, 'std')},
                {disease:"Gonorrhea", data:prepareDiseaseData(stdGonorrheaData, 'std')},
                {disease:"Primary and Secondary Syphilis", data:prepareDiseaseData(stdPrimarySyphilisData, 'std')},
                {disease:"Early Latent Syphilis", data:prepareDiseaseData(stdEarlySyphilisData, 'std')}];

            deferred.resolve(stdData);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for STD:', error);
        deferred.reject(error);
    }
    return deferred.promise;

}

function getAIDSDataForFactSheets(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        var aidsDiagnosesESQuery = factSheetQueryJSON.aids["AIDS Diagnoses"][0];
        var aidsDiagnosesPopQuery = factSheetQueryJSON.aids["AIDS Diagnoses"][1];
        var aidsDeathsESQuery = factSheetQueryJSON.aids["AIDS Deaths"][0];
        var aidsDeathsPopQuery = factSheetQueryJSON.aids["AIDS Deaths"][1];
        var aidsPrevalenceESQuery = factSheetQueryJSON.aids["AIDS Prevalence"][0];
        var aidsPrevalencePopQuery = factSheetQueryJSON.aids["AIDS Prevalence"][1];
        var hivDiagnosesESQuery = factSheetQueryJSON.aids["HIV Diagnoses"][0];
        var hivDiagnosesPopQuery = factSheetQueryJSON.aids["HIV Diagnoses"][1];
        var hivPrevalenceESQuery = factSheetQueryJSON.aids["HIV Prevalence"][0];
        var hivPrevalencePopQuery = factSheetQueryJSON.aids["HIV Prevalence"][1];
        var es = new elasticSearch();
        var promises = [
            es.executeESQuery('owh_aids', 'aids', aidsDiagnosesESQuery),
            es.aggregateCensusDataQuery(aidsDiagnosesPopQuery, 'owh_aids', "aids", 'pop'),
            // es.executeESQuery('owh_aids', 'aids', aidsDiagnosesPopQuery),
            es.executeESQuery('owh_aids', 'aids', aidsDeathsESQuery),
            es.aggregateCensusDataQuery(aidsDeathsPopQuery, 'owh_aids', "aids", 'pop'),
            // es.executeESQuery('owh_aids', 'aids', aidsDeathsPopQuery),
            es.executeESQuery('owh_aids', 'aids', aidsPrevalenceESQuery),
            es.aggregateCensusDataQuery(aidsPrevalencePopQuery, 'owh_aids', "aids", 'pop'),
            // es.executeESQuery('owh_aids', 'aids', aidsPrevalencePopQuery),
            es.executeESQuery('owh_aids', 'aids', hivDiagnosesESQuery),
            es.aggregateCensusDataQuery(hivDiagnosesPopQuery, 'owh_aids', "aids", 'pop'),
            // es.executeESQuery('owh_aids', 'aids', hivDiagnosesPopQuery),
            es.executeESQuery('owh_aids', 'aids', hivPrevalenceESQuery),
            es.aggregateCensusDataQuery(hivPrevalencePopQuery, 'owh_aids', "aids", 'pop'),
            // es.executeESQuery('owh_aids', 'aids', hivPrevalencePopQuery)
        ];

        Q.all(promises).then(function (resp) {
            //AIDS Diagnoses
            var aidsDiagnosesData = searchUtils.populateDataWithMappings(resp[0], 'aids' , 'cases');
            es.mergeWithCensusData(aidsDiagnosesData, resp[1], undefined, 'pop');
            searchUtils.applySuppressions(aidsDiagnosesData, 'aids', 0);
            //AIDS Deaths
            var aidsDeathsData = searchUtils.populateDataWithMappings(resp[2], 'aids' , 'cases');
            es.mergeWithCensusData(aidsDeathsData, resp[3], undefined, 'pop');
            searchUtils.applySuppressions(aidsDeathsData, 'aids', 0);
            //AIDS Prevalence
            var aidsPrevalenceData = searchUtils.populateDataWithMappings(resp[4], 'aids' , 'cases');
            es.mergeWithCensusData(aidsPrevalenceData, resp[5], undefined, 'pop');
            searchUtils.applySuppressions(aidsPrevalenceData, 'aids', 0);
            //HIV Diagnoses
            var hivDiagnosesData = searchUtils.populateDataWithMappings(resp[6], 'aids' , 'cases');
            es.mergeWithCensusData(hivDiagnosesData, resp[7], undefined, 'pop');
            searchUtils.applySuppressions(hivDiagnosesData, 'aids', 0);
            //HIV Prevalence
            var hivPrevalenceData = searchUtils.populateDataWithMappings(resp[8], 'aids' , 'cases');
            es.mergeWithCensusData(hivPrevalenceData, resp[9], undefined, 'pop');
            searchUtils.applySuppressions(hivPrevalenceData, 'aids', 0);

            var hivData = [{disease:"AIDS Diagnoses", data:prepareDiseaseData(aidsDiagnosesData, 'aids')},
                {disease:"AIDS Deaths", data:prepareDiseaseData(aidsDeathsData, 'aids')},
                {disease:"AIDS Prevalence", data:prepareDiseaseData(aidsPrevalenceData, 'aids')},
                {disease:"HIV Diagnoses", data:prepareDiseaseData(hivDiagnosesData, 'aids')},
                {disease:"HIV Prevalence", data:prepareDiseaseData(hivPrevalenceData, 'aids')}];

            deferred.resolve(hivData);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for AIDS:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function getDetailMortalityDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        //Number of deaths
        var alzheimerESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["alzheimer"][0];
        var malignantNeoplasmESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["malignant_neoplasm"][0];
        var accidentESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["accident"][0];
        var cerebrovascularESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["cerebrovascular"][0];
        var chronicRespiratoryESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["chronic_respiratory"][0];
        var diabetesMellitusESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["diabetes_mellitus"][0];
        var suicideESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["suicide"][0];
        var influenzaESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["influenza"][0];
        var nephritisESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["nephritis"][0];
        var heartDiseaseESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["heart_diseases"][0];

        var alzheimerHispanicESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["alzheimer"][1];
        var malignantNeoplasmHispanicESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["malignant_neoplasm"][1];
        var accidentHispanicESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["accident"][1];
        var cerebrovascularHispanicESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["cerebrovascular"][1];
        var chronicRespiratoryHispanicESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["chronic_respiratory"][1];
        var diabetesMellitusHispanicESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["diabetes_mellitus"][1];
        var suicideHispanicESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["suicide"][1];
        var influenzaHispanicESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["influenza"][1];
        var nephritisHispanicESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["nephritis"][1];
        var heartDiseaseHispanicESQuery = factSheetQueryJSON.detailMortality.number_of_deaths["heart_diseases"][1];

        var alzheimerWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["alzheimer"][0];
        var malignantNeoplasmWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["malignant_neoplasm"][0];
        var accidentWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["accident"][0];
        var cerebrovascularWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["cerebrovascular"][0];
        var chronicRespiratoryWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["chronic_respiratory"][0];
        var diabetesMellitusWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["diabetes_mellitus"][0];
        var suicideWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["suicide"][0];
        var influenzaWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["influenza"][0];
        var nephritisWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["nephritis"][0];
        var heartDiseaseWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["heart_diseases"][0];

        var alzheimerHispanicWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["alzheimer"][1];
        var malignantNeoplasmHispanicWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["malignant_neoplasm"][1];
        var accidentHispanicWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["accident"][1];
        var cerebrovascularHispanicWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["cerebrovascular"][1];
        var chronicRespiratoryHispanicWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["chronic_respiratory"][1];
        var diabetesMellitusHispanicWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["diabetes_mellitus"][1];
        var suicideHispanicWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["suicide"][1];
        var influenzaHispanicWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["influenza"][1];
        var nephritisHispanicWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["nephritis"][1];
        var heartDiseaseHispanicWonderQuery = factSheetQueryJSON.detailMortality.age_adjusted_rates["heart_diseases"][1];

        var es = new elasticSearch();
        var querySet1 = [
            //Detail Mortality - Number of deaths
            es.executeMultipleESQueries(malignantNeoplasmESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(malignantNeoplasmWonderQuery),
            es.executeMultipleESQueries(malignantNeoplasmHispanicESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(malignantNeoplasmHispanicWonderQuery),

            es.executeMultipleESQueries(chronicRespiratoryESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(chronicRespiratoryWonderQuery),
            es.executeMultipleESQueries(chronicRespiratoryHispanicESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(chronicRespiratoryHispanicWonderQuery),

            es.executeMultipleESQueries(accidentESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(accidentWonderQuery),
            es.executeMultipleESQueries(accidentHispanicESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(accidentHispanicWonderQuery),

            es.executeMultipleESQueries(cerebrovascularESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(cerebrovascularWonderQuery),
            es.executeMultipleESQueries(cerebrovascularHispanicESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(cerebrovascularHispanicWonderQuery),

            es.executeMultipleESQueries(heartDiseaseESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(heartDiseaseWonderQuery),
            es.executeMultipleESQueries(heartDiseaseHispanicESQuery, 'owh_mortality', 'mortality'),
            new wonder('D77').invokeWONDER(heartDiseaseHispanicWonderQuery)


        ];
        Q.all(querySet1).then(function (resp) {
            var malignantNeoplasmData = prepareDetailMortalityData(resp[0], resp[1], resp[2], resp[3]);
            var chronicRespiratoryData = prepareDetailMortalityData(resp[4], resp[5], resp[6], resp[7]);
            var accidentData = prepareDetailMortalityData(resp[8], resp[9], resp[10], resp[11]);
            var cerebroVascularData = prepareDetailMortalityData(resp[12], resp[13], resp[14], resp[15]);
            var heartDiseaseData = prepareDetailMortalityData(resp[16], resp[17], resp[18], resp[19]);

            return [
                {causeOfDeath:"Diseases of heart", data:heartDiseaseData.data.nested.table.race},
                {causeOfDeath:"Malignant neoplasms", data:malignantNeoplasmData.data.nested.table.race},
                {causeOfDeath: "Chronic lower respiratory disease", data:chronicRespiratoryData.data.nested.table.race},
                {causeOfDeath: "Accidents (unintentional injuries)", data:accidentData.data.nested.table.race},
                {causeOfDeath: "Cerebrovascular diseases", data:cerebroVascularData.data.nested.table.race}
            ];
        }).then(function (set1Data) {
            var executeSet2Queries = function () {
                var querySet2 = [
                    es.executeMultipleESQueries(alzheimerESQuery, 'owh_mortality', 'mortality'),
                    new wonder('D77').invokeWONDER(alzheimerWonderQuery),
                    es.executeMultipleESQueries(alzheimerHispanicESQuery, 'owh_mortality', 'mortality'),
                    new wonder('D77').invokeWONDER(alzheimerHispanicWonderQuery),

                    es.executeMultipleESQueries(diabetesMellitusESQuery, 'owh_mortality', 'mortality'),
                    new wonder('D77').invokeWONDER(diabetesMellitusWonderQuery),
                    es.executeMultipleESQueries(diabetesMellitusHispanicESQuery, 'owh_mortality', 'mortality'),
                    new wonder('D77').invokeWONDER(diabetesMellitusHispanicWonderQuery),

                    es.executeMultipleESQueries(suicideESQuery, 'owh_mortality', 'mortality'),
                    new wonder('D77').invokeWONDER(suicideWonderQuery),
                    es.executeMultipleESQueries(suicideHispanicESQuery, 'owh_mortality', 'mortality'),
                    new wonder('D77').invokeWONDER(suicideHispanicWonderQuery),

                    es.executeMultipleESQueries(influenzaESQuery, 'owh_mortality', 'mortality'),
                    new wonder('D77').invokeWONDER(influenzaWonderQuery),
                    es.executeMultipleESQueries(influenzaHispanicESQuery, 'owh_mortality', 'mortality'),
                    new wonder('D77').invokeWONDER(influenzaHispanicWonderQuery),

                    es.executeMultipleESQueries(nephritisESQuery, 'owh_mortality', 'mortality'),
                    new wonder('D77').invokeWONDER(nephritisWonderQuery),
                    es.executeMultipleESQueries(nephritisHispanicESQuery, 'owh_mortality', 'mortality'),
                    new wonder('D77').invokeWONDER(nephritisHispanicWonderQuery)
                ];
                var defr = Q.defer();
                Q.all(querySet2).then(function (resp) {
                    var alzheimerData = prepareDetailMortalityData(resp[0], resp[1], resp[2], resp[3]);

                    var diabetesMellitusData = prepareDetailMortalityData(resp[4], resp[5], resp[6], resp[7]);

                    var suicideData = prepareDetailMortalityData(resp[8], resp[9], resp[10], resp[11]);

                    var influenzaData = prepareDetailMortalityData(resp[12], resp[13], resp[14], resp[15]);

                    var nephritisData = prepareDetailMortalityData(resp[16], resp[17], resp[18], resp[19]);
                    var data = set1Data.concat([
                        {causeOfDeath: "Alzheimer's disease", data:alzheimerData.data.nested.table.race},
                        {causeOfDeath: "Diabetes mellitus", data:diabetesMellitusData.data.nested.table.race},
                        {causeOfDeath: "Influenza and pneumonia", data:influenzaData.data.nested.table.race},
                        {causeOfDeath: "Nephritis, nephrotic syndrome and nephrosis", data:nephritisData.data.nested.table.race},
                        {causeOfDeath: "Intentional self-harm (suicide)", data:suicideData.data.nested.table.race}
                    ]);
                    defr.resolve(data);
                });
                return defr.promise;
            };
            deferred.resolve(executeSet2Queries());
        });
    } catch(error) {
        console.error('Error in generating Factsheet for Detailed Mortality:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function prepareDetailMortalityData(raceCountData, raceRateData, hispanicCountData, hispanicRateDate) {

    var noDataAvailableObj = {name: 'Hispanic', deaths: 'suppressed', ageAdjustedRate: 'Not available', standardPop: 'Not available'};
    var selectedRaces = { "options": [ "American Indian", "Asian or Pacific Islander", "Black", 'Hispanic', 'White' ]};
    //race counts & rates data
    var resultantData = searchUtils.populateDataWithMappings(raceCountData, 'deaths');
    searchUtils.addMissingFilterOptions(selectedRaces, resultantData.data.nested.table.race, 'deaths');
    searchUtils.mergeAgeAdjustedRates(resultantData.data.nested.table, raceRateData.table);
    searchUtils.applySuppressions(resultantData, 'deaths');

    //merge hispanic data to race data
    var hispanicData = searchUtils.populateDataWithMappings(hispanicCountData, 'deaths');
    searchUtils.mergeAgeAdjustedRates(hispanicData.data.nested.table, hispanicRateDate.table);
    searchUtils.applySuppressions(hispanicData, 'deaths');
    var hispanic = hispanicData.data.nested.table.year[0] || noDataAvailableObj;
    hispanic.name = 'Hispanic';
    resultantData.data.nested.table.race[4] = hispanic;
    resultantData.data.nested.table.race = sortArrayByPropertyAndSortOrder(resultantData.data.nested.table.race, 'name', selectedRaces.options);
    return resultantData;
}

function getNatalityDataForFactSeet(factSheetQueryJSON) {
    var sortOrder = ['American Indian', 'Asian or Pacific Islander', 'Black','Hispanic', 'White'];
    var deferred = Q.defer();
    try {
        var birthRatesESQuery = factSheetQueryJSON.natality["birthRates"][0];
        var birthRatesPopQuery = factSheetQueryJSON.natality["birthRates"][1];
        var birthRatesHispanicESQuery = factSheetQueryJSON.natality["birthRates"][2];
        var birthRatesHispanicPopQuery = factSheetQueryJSON.natality["birthRates"][3];
        var fertilityRatesESQuery = factSheetQueryJSON.natality["fertilityRates"][0];
        var fertilityRatesPopQuery = factSheetQueryJSON.natality["fertilityRates"][1];
        var fertilityRatesHispanicESQuery = factSheetQueryJSON.natality["fertilityRates"][2];
        var fertilityRatesHispanicPopQuery = factSheetQueryJSON.natality["fertilityRates"][3];
        var vaginalESQuery = factSheetQueryJSON.natality["vaginal"][0];
        var vaginalHispanicESQuery = factSheetQueryJSON.natality["vaginal"][1];
        var cesareanESQuery = factSheetQueryJSON.natality["cesarean"][0];
        var cesareanHispanicESQuery = factSheetQueryJSON.natality["cesarean"][1];
        var lowBirthWeightESQuery = factSheetQueryJSON.natality["lowBirthWeight"][0];
        var lowBirthWeightHispanicESQuery = factSheetQueryJSON.natality["lowBirthWeight"][1];
        var twinBirthESQuery = factSheetQueryJSON.natality["twinBirth"][0];
        var twinBirthHispanicESQuery = factSheetQueryJSON.natality["twinBirth"][1];
        var totalBirthsESQuery = factSheetQueryJSON.natality["totalBirthsByYear"][0];
        var totalBirthsHispanicESQuery = factSheetQueryJSON.natality["totalBirthsByYear"][1];

        var es = new elasticSearch();
        var promises = [
            es.executeMultipleESQueries(birthRatesESQuery, 'owh_natality', 'natality'),
            es.aggregateCensusDataQuery(birthRatesPopQuery, 'owh_census_rates', "census_rates", 'pop'),
            es.executeMultipleESQueries(birthRatesHispanicESQuery, 'owh_natality', 'natality'),
            es.aggregateCensusDataQuery(birthRatesHispanicPopQuery, 'owh_census_rates', "census_rates", 'pop'),
            es.executeMultipleESQueries(fertilityRatesESQuery, 'owh_natality', 'natality'),
            es.aggregateCensusDataQuery(fertilityRatesPopQuery, 'owh_census_rates', "census_rates", 'pop'),
            es.executeMultipleESQueries(fertilityRatesHispanicESQuery, 'owh_natality', 'natality'),
            es.aggregateCensusDataQuery(fertilityRatesHispanicPopQuery, 'owh_census_rates', "census_rates", 'pop'),
            es.executeMultipleESQueries(vaginalESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(vaginalHispanicESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(cesareanESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(cesareanHispanicESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(lowBirthWeightESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(lowBirthWeightHispanicESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(twinBirthESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(twinBirthHispanicESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(totalBirthsESQuery, 'owh_natality', 'natality'),
            es.executeMultipleESQueries(totalBirthsHispanicESQuery, 'owh_natality', 'natality')
        ];
        Q.all(promises).then(function (resp) {
            var birthRatesData = searchUtils.populateDataWithMappings(resp[0], 'natality');
            es.mergeWithCensusData(birthRatesData, resp[1], undefined, 'pop');
            searchUtils.applySuppressions(birthRatesData, 'natality');

            var birthRatesHispanicData = searchUtils.populateDataWithMappings(resp[2], 'natality');
            es.mergeWithCensusData(birthRatesHispanicData, resp[3], undefined, 'pop');
            searchUtils.applySuppressions(birthRatesHispanicData, 'natality');
            mergeHispanicData(birthRatesData, birthRatesHispanicData);
            searchUtils.addMissingFilterOptions({ "options": sortOrder}, birthRatesData.data.nested.table.race, 'natality');
            //(birthRatesHispanicData.data.nested.table.year.length>0)?birthRatesHispanicData.data.nested.table.year[0].name = 'hispanic':'';
            //birthRatesData.data.nested.table.race.concat(birthRatesHispanicData.data.nested.table.year);

            var fertilityRatesData = searchUtils.populateDataWithMappings(resp[4], 'natality');
            es.mergeWithCensusData(fertilityRatesData, resp[5], undefined, 'pop');
            searchUtils.applySuppressions(fertilityRatesData, 'natality');

            var fertilityRatesHispanicData = searchUtils.populateDataWithMappings(resp[6], 'natality');
            es.mergeWithCensusData(fertilityRatesHispanicData, resp[7], undefined, 'pop');
            searchUtils.applySuppressions(fertilityRatesHispanicData, 'natality');
            mergeHispanicData(fertilityRatesData, fertilityRatesHispanicData);
            searchUtils.addMissingFilterOptions({ "options": sortOrder}, fertilityRatesData.data.nested.table.race, 'natality');

            var vaginalData = searchUtils.populateDataWithMappings(resp[8], 'natality');
            searchUtils.applySuppressions(vaginalData, 'natality');

            var vaginalHispanicData = searchUtils.populateDataWithMappings(resp[9], 'natality');
            searchUtils.applySuppressions(vaginalHispanicData, 'natality');
            mergeHispanicData(vaginalData, vaginalHispanicData);
            searchUtils.addMissingFilterOptions({ "options": sortOrder}, vaginalData.data.nested.table.race, 'natality');

            var cesareanData = searchUtils.populateDataWithMappings(resp[10], 'natality');
            searchUtils.applySuppressions(cesareanData, 'natality');

            var cesareanHispanicData = searchUtils.populateDataWithMappings(resp[11], 'natality');
            searchUtils.applySuppressions(cesareanHispanicData, 'natality');
            mergeHispanicData(cesareanData, cesareanHispanicData);
            searchUtils.addMissingFilterOptions({ "options": sortOrder}, cesareanData.data.nested.table.race, 'natality');

            var lowBirthWeightData = searchUtils.populateDataWithMappings(resp[12], 'natality');
            searchUtils.applySuppressions(lowBirthWeightData, 'natality');

            var lowBirthWeightHispanicData = searchUtils.populateDataWithMappings(resp[13], 'natality');
            searchUtils.applySuppressions(lowBirthWeightHispanicData, 'natality');
            mergeHispanicData(lowBirthWeightData, lowBirthWeightHispanicData);
            searchUtils.addMissingFilterOptions({ "options": sortOrder}, lowBirthWeightData.data.nested.table.race, 'natality');

            var twinBirthData = searchUtils.populateDataWithMappings(resp[14], 'natality');
            searchUtils.applySuppressions(twinBirthData, 'natality');

            var twinBirthHispanicData = searchUtils.populateDataWithMappings(resp[15], 'natality');
            searchUtils.applySuppressions(twinBirthHispanicData, 'natality');
            mergeHispanicData(twinBirthData, twinBirthHispanicData);
            searchUtils.addMissingFilterOptions({ "options": sortOrder}, twinBirthData.data.nested.table.race, 'natality');

            var totalBirthPopData = searchUtils.populateDataWithMappings(resp[16], 'natality');
            searchUtils.applySuppressions(totalBirthPopData, 'natality');

            var totalBirthPopHispanicData = searchUtils.populateDataWithMappings(resp[17], 'natality');
            searchUtils.applySuppressions(totalBirthPopHispanicData, 'natality');
            mergeHispanicData(totalBirthPopData, totalBirthPopHispanicData);
            searchUtils.addMissingFilterOptions({ "options": sortOrder}, totalBirthPopData.data.nested.table.race, 'natality');

            var natalityData = {
                birthRateData:sortArrayByPropertyAndSortOrder(birthRatesData.data.nested.table.race, 'name', sortOrder),
                fertilityRatesData:sortArrayByPropertyAndSortOrder(fertilityRatesData.data.nested.table.race, 'name', sortOrder),
                vaginalData:sortArrayByPropertyAndSortOrder(vaginalData.data.nested.table.race, 'name', sortOrder),
                cesareanData:sortArrayByPropertyAndSortOrder(cesareanData.data.nested.table.race, 'name', sortOrder),
                lowBirthWeightData:sortArrayByPropertyAndSortOrder(lowBirthWeightData.data.nested.table.race, 'name', sortOrder),
                twinBirthData: sortArrayByPropertyAndSortOrder(twinBirthData.data.nested.table.race, 'name', sortOrder),
                totalBirthPopulation:sortArrayByPropertyAndSortOrder(totalBirthPopData.data.nested.table.race, 'name', sortOrder)
            };

/*
            var natalityData = {
                birthRateData:birthRatesData.data.nested.table.year[0],
                fertilityRatesData:fertilityRatesData.data.nested.table.year[0],
                vaginalData:vaginalData.data.nested.table.year[0],
                cesareanData:cesareanData.data.nested.table.year[0],
                lowBirthWeightData:lowBirthWeightData.data.nested.table.year[0],
                twinBirthData: twinBirthData.data.nested.table.year[0],
                totalBirthPopulation:totalBirthPopData.data.nested.table.year[0]
            };
*/
            deferred.resolve(natalityData);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for Natality:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function mergeHispanicData(nonHispanicData, hispanicData) {
    if(hispanicData.data.nested.table.year.length>0) {
        hispanicData.data.nested.table.year[0].name = 'Hispanic';
        nonHispanicData.data.nested.table.race = nonHispanicData.data.nested.table.race.concat(hispanicData.data.nested.table.year);
    }
    else {
        nonHispanicData.data.nested.table.race.push({name: 'hispanic', natality: 0});
    }
}
function getCancerDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    try {
        var breastCancerESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Breast"][0];
        var breastCancerPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Breast"][1];
        var breastCancerHispanicESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Breast"][2];
        var breastCancerHispanicPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Breast"][3];
        var colonCancerESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Colon and Rectum"][0];
        var colonCancerPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Colon and Rectum"][1];
        var colonCancerHispanicESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Colon and Rectum"][2];
        var colonCancerHispanicPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Colon and Rectum"][3];
        var lungCancerESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Lung and Bronchus"][0];
        var lungAndBronchusPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Lung and Bronchus"][1];
        var lungCancerHispanicESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Lung and Bronchus"][2];
        var lungCancerHispanicPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Lung and Bronchus"][3];
        var melanomaCancerESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Melanoma of the Skin"][0];
        var melanomaCancerPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Melanoma of the Skin"][1];
        var melanomaCancerHispanicESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Melanoma of the Skin"][2];
        var melanomaCancerHispanicPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Melanoma of the Skin"][3];
        var cervixCancerESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Cervix Uteri"][0];
        var cervixCancerPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Cervix Uteri"][1];
        var cervixCancerHispanicESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Cervix Uteri"][2];
        var cervixCancerHispanicPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Cervix Uteri"][3];
        var ovaryCancerESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Ovary"][0];
        var ovaryCancerPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Ovary"][1];
        var ovaryCancerHispanicESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Ovary"][2];
        var ovaryCancerHispanicPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Ovary"][3];
        var prostateCancerESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Prostate"][0];
        var prostateCancerPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Prostate"][1];
        var prostateCancerHispanicESQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Prostate"][2];
        var prostateCancerHispanicPopQuery = factSheetQueryJSON.cancer["mortality-incidence"]["Prostate"][3];

        var es = new elasticSearch();
        var promises = [
            //Cancer mortality
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', breastCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', breastCancerPopQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', breastCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', breastCancerHispanicPopQuery),

            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', colonCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', colonCancerPopQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', colonCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', colonCancerHispanicPopQuery),

            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', lungCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', lungAndBronchusPopQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', lungCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', lungCancerHispanicPopQuery),

            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', melanomaCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', melanomaCancerPopQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', melanomaCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', melanomaCancerHispanicPopQuery),

            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cervixCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cervixCancerPopQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', cervixCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', cervixCancerHispanicPopQuery),

            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', ovaryCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', ovaryCancerPopQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', ovaryCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', ovaryCancerHispanicPopQuery),

            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', prostateCancerESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', prostateCancerPopQuery),
            es.executeESQuery('owh_cancer_mortality', 'cancer_mortality', prostateCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_population', 'cancer_population', prostateCancerHispanicPopQuery),

            //Cancer - incident
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', breastCancerESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', breastCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', colonCancerESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', colonCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', lungCancerESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', lungCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', melanomaCancerESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', melanomaCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', cervixCancerESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', cervixCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', ovaryCancerESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', ovaryCancerHispanicESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', prostateCancerESQuery),
            es.executeESQuery('owh_cancer_incidence', 'cancer_incidence', prostateCancerHispanicESQuery)
        ];
        Q.all(promises).then(function (resp) {
            try {

                var selectedRaces = {"options": ["American Indian/Alaska Native", "Asian or Pacific Islander", "Black"]};
                //Cancer - Mortality
                var cancerMortalityBreastData = prepareCancerData(resp[0], resp[1], resp[2], resp[3], 'cancer_mortality');

                var cancerMortalityColonAndRectumData = prepareCancerData(resp[4], resp[5], resp[6], resp[7], 'cancer_mortality');

                var cancerMortalityLungAndBronchusData = prepareCancerData(resp[8], resp[9], resp[10], resp[11], 'cancer_mortality');

                var cancerMortalityMelanomaData = prepareCancerData(resp[12], resp[13], resp[14], resp[15], 'cancer_mortality');

                var cancerMortalityCervixData = prepareCancerData(resp[16], resp[17], resp[18], resp[19], 'cancer_mortality');

                var cancerMortalityOvaryData = prepareCancerData(resp[20], resp[21], resp[22], resp[23], 'cancer_mortality');

                var cancerMortalityProstateData = prepareCancerData(resp[24], resp[25], resp[26], resp[27], 'cancer_mortality');

                //Cancer - Incident
                var rules = searchUtils.createCancerIncidenceSuppressionRules(['2016'], true, false);
                var cancerIncidentBreastData = prepareCancerData(resp[28], resp[1], resp[29], resp[3], 'cancer_incidence');
                searchUtils.applyCustomSuppressions(cancerIncidentBreastData.data.nested, rules, 'cancer_incidence');

                var cancerIncidentColonAndRectumData = prepareCancerData(resp[30], resp[5], resp[31], resp[7], 'cancer_incidence');
                searchUtils.applyCustomSuppressions(cancerIncidentColonAndRectumData.data.nested, rules, 'cancer_incidence');

                var cancerIncidentLungAndBronchusData = prepareCancerData(resp[32], resp[9], resp[33], resp[11], 'cancer_incidence');
                searchUtils.applyCustomSuppressions(cancerIncidentLungAndBronchusData.data.nested, rules, 'cancer_incidence');

                var cancerIncidentMelanomaData = prepareCancerData(resp[34], resp[13], resp[35], resp[15], 'cancer_incidence');
                searchUtils.applyCustomSuppressions(cancerIncidentMelanomaData.data.nested, rules, 'cancer_incidence');

                var cancerIncidentCervixData = prepareCancerData(resp[36], resp[17], resp[37], resp[19], 'cancer_incidence');
                searchUtils.applyCustomSuppressions(cancerIncidentCervixData.data.nested, rules, 'cancer_incidence');

                var cancerIncidentOvaryData = prepareCancerData(resp[38], resp[21], resp[39], resp[23], 'cancer_incidence');
                searchUtils.applyCustomSuppressions(cancerIncidentOvaryData.data.nested, rules, 'cancer_incidence');

                var cancerIncidentProstateData = prepareCancerData(resp[40], resp[25], resp[41], resp[27], 'cancer_incidence');
                searchUtils.applyCustomSuppressions(cancerIncidentProstateData.data.nested, rules, 'cancer_incidence');

                var sortOrder = ['American Indian/Alaska Native', 'Asian or Pacific Islander', 'Black', 'Hispanic', 'White'];
                var cancerData = [
                    {
                        mortality: sortArrayByPropertyAndSortOrder(cancerMortalityBreastData.data.nested.table.race, 'name', sortOrder),
                        incidence: sortArrayByPropertyAndSortOrder(cancerIncidentBreastData.data.nested.table.race, 'name', sortOrder),
                        site: 'Breast'
                    }, {
                        mortality: sortArrayByPropertyAndSortOrder(cancerMortalityCervixData.data.nested.table.race, 'name', sortOrder),
                        incidence: sortArrayByPropertyAndSortOrder(cancerIncidentCervixData.data.nested.table.race, 'name', sortOrder),
                        site: 'Cervix Uteri†'
                    }, {
                        mortality: sortArrayByPropertyAndSortOrder(cancerMortalityColonAndRectumData.data.nested.table.race, 'name', sortOrder),
                        incidence: sortArrayByPropertyAndSortOrder(cancerIncidentColonAndRectumData.data.nested.table.race, 'name', sortOrder),
                        site: 'Colon and Rectum'
                    }, {
                        mortality: sortArrayByPropertyAndSortOrder(cancerMortalityLungAndBronchusData.data.nested.table.race, 'name', sortOrder),
                        incidence: sortArrayByPropertyAndSortOrder(cancerIncidentLungAndBronchusData.data.nested.table.race, 'name', sortOrder),
                        site: 'Lung and Bronchus'
                    }, {
                        mortality: sortArrayByPropertyAndSortOrder(cancerMortalityMelanomaData.data.nested.table.race, 'name', sortOrder),
                        incidence: sortArrayByPropertyAndSortOrder(cancerIncidentMelanomaData.data.nested.table.race, 'name', sortOrder),
                        site: 'Melanoma of the Skin'
                    }, {
                        mortality: sortArrayByPropertyAndSortOrder(cancerMortalityOvaryData.data.nested.table.race, 'name', sortOrder),
                        incidence: sortArrayByPropertyAndSortOrder(cancerIncidentOvaryData.data.nested.table.race, 'name', sortOrder),
                        site: 'Ovary†'
                    }, {
                        mortality: sortArrayByPropertyAndSortOrder(cancerMortalityProstateData.data.nested.table.race, 'name', sortOrder),
                        incidence: sortArrayByPropertyAndSortOrder(cancerIncidentProstateData.data.nested.table.race, 'name', sortOrder),
                        site: 'Prostate††'
                    }
                ];

                deferred.resolve(cancerData);
            } catch (error) {
                console.log("Error occured in MinorityFactSheet parsing...");
                console.error(error);
                deferred.reject("Error occured in MinorityFactSheet parsing...");
            }
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } catch(error) {
        console.error('Error in generating Factsheet for Cancer:', error);
        deferred.reject(error);
    }
    return deferred.promise;
}

function prepareCancerData(pop, totalPop, hispanicPop, hispanicTotalPop, countKey) {

    var selectedRaces = { "options": [ "American Indian/Alaska Native", "Asian or Pacific Islander", "Black", "White" ]};
    var resultantData = searchUtils.populateDataWithMappings(pop, countKey);
    searchUtils.addMissingFilterOptions(selectedRaces, resultantData.data.nested.table.race, countKey);
    var cancerPopulation = searchUtils.populateDataWithMappings(totalPop, 'cancer_population');
    searchUtils.addMissingFilterOptions(selectedRaces, resultantData.data.nested.table.race, countKey);
    var cancerPopulationIndex = searchUtils.createPopIndex(cancerPopulation.data.nested.table, 'cancer_population');
    searchUtils.attachPopulation(resultantData.data.nested.table, cancerPopulationIndex, '');

    var cancerHispanicData = searchUtils.populateDataWithMappings(hispanicPop, countKey);
    var cancerHispanicPopulation = searchUtils.populateDataWithMappings(hispanicTotalPop, 'cancer_population');
    var hispanicPopulationIndex = searchUtils.createPopIndex(cancerHispanicPopulation.data.nested.table, 'cancer_population');
    searchUtils.attachPopulation(cancerHispanicData.data.nested.table, hispanicPopulationIndex, '');
    var hispanicData = cancerHispanicData.data.nested.table.year[0] || {name:'Hispanic', pop:cancerHispanicPopulation.data.nested.table.year[0].cancer_population};
    if(hispanicData[countKey] === undefined) {
        hispanicData[countKey] = 0;
    }
    hispanicData['name'] = 'Hispanic';
    resultantData.data.nested.table.race.push(hispanicData);
    searchUtils.applySuppressions(resultantData, countKey, 16);

    return resultantData;
}

function getYRBSDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    var alcoholStatsQuery = factSheetQueryJSON.yrbs["alcohol"];
    new yrbs().invokeYRBSService(alcoholStatsQuery).then(function (resp) {
        deferred.resolve(prepareYRBSData(resp));
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

function getBRFSDataForFactSheet(factSheetQueryJSON, state) {
    var deferred = Q.defer();
    if(state) {
        var brfsQuery = factSheetQueryJSON.brfss.query_2016;
        new yrbs().invokeYRBSService(brfsQuery).then(function (resp) {
            deferred.resolve(prepareBRFSSData(resp));
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    } else {
        deferred.resolve({});
    }
    return deferred.promise;
}

function getPRAMSDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    var promises = [
        new yrbs().invokeYRBSService(factSheetQueryJSON.prams['qn205']),//In the 12 months before your baby was born  you were in a physical fight
        new yrbs().invokeYRBSService(factSheetQueryJSON.prams['qn101'])//Was your baby seen by a doctor  nurse or other healthcare provider in the first week after he or she left the hospital?
    ];

    Q.all(promises).then(function (resp) {
        var data = preparePRAMSData([resp[0], resp[1]]);
        deferred.resolve(data);
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

module.exports = MinorityFactSheet;
