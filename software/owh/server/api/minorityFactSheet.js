var elasticSearch = require('../models/elasticSearch');
var yrbs = require("../api/yrbs");
var factSheetQueries = require('../json/factsheet-queries.json');
var searchUtils = require('../api/utils');
var wonder = require("../api/wonder");
var Q = require('q');
var logger = require('../config/logging');
var MinorityFactSheet = function() {};

MinorityFactSheet.prototype.prepareFactSheet = function (state, fsType) {
    var self = this;
    var deferred = Q.defer();
    var factSheetQueryString = JSON.stringify(factSheetQueries.minority_health);
    var factSheetQueryJSON;
    factSheetQueryJSON = JSON.parse(factSheetQueryString.split("$state$").join(state));
    if (factSheetQueryJSON) {
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

        var es = new elasticSearch();

        var factsheet = {};
        getBridgeRaceDataForFactSheet(factSheetQueryJSON, fsType).then(function (bridgeRaceData) {
            factsheet = bridgeRaceData;
            return getFactSheetDataForInfants(factSheetQueryJSON);
        }).then(function (infantData) {
            factsheet.infantMortalityData = infantData;
            return getTBDataForFactSheets(factSheetQueryJSON);
        }).then(function (tbData) {
            factsheet.tuberculosis = tbData;
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
            return getCancerDataForFactSheet(factSheetQueryJSON)
        }).then(function (cancerData) {
            factsheet.cancerData = cancerData;
            return getYRBSDataForFactSheet(factSheetQueryJSON)
        }).then(function (yrbsData) {
            factsheet.yrbs = yrbsData;
            return getBRFSDataForFactSheet(factSheetQueryJSON)
        }).then(function (brfssData) {
            factsheet.brfss = brfssData;
            return getPRAMSDataForFactSheet(factSheetQueryJSON);
        }).then(function (pramsData) {
            factsheet.prams = pramsData;
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
    var selectedRaces = {options: ['Black', 'Hispanic', 'Other Race']};
    var resultData = [
        {"question": "Smoking cigarettes during the last three months of pregnancy", data: respData[0].table.question[0] && respData[0].table.question[0].yes ? respData[0].table.question[0].yes.maternal_race : "Not applicable"},
        {"question": "Females reported physical abuse by husband or partner during pregnancy", data: respData[1].table.question[0] && respData[1].table.question[0].yes ? respData[1].table.question[0].yes.maternal_race: "Not applicable"},
        {"question": "Ever breastfed or pump breast milk to feed after delivery", data: respData[2].table.question[0] && respData[2].table.question[0].yes ? respData[2].table.question[0].yes.maternal_race : "Not applicable"},
        {"question": "Indicator of depression 3 months before pregnancy", data: respData[3].table.question[0] && respData[3].table.question[0].yes ? respData[3].table.question[0].yes.maternal_race : "Not applicable"}
    ];
    resultData.forEach(function (quest, indx) {
        if(quest.data !== 'Not applicable') {
            searchUtils.addMissingFilterOptions(selectedRaces, quest.data, 'prams');
            quest.data = sortArrayByPropertyAndSortOrder(quest.data, 'name', selectedRaces.options);
        }
    });
    return resultData;
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
        { question: 'Are heavy drinkers (adult men having more than 14 drinks per week and adult women having more than 7 drinks per week)', data: 'Not applicable' },
        { question: 'Participated in 150 minutes or more of Aerobic Physical Activity per week', data: 'Not applicable' }
    ];
    data.table.question.forEach(function(eachRecord) {
        var property = 'name';
        var sortOrder = ['AI/AN', 'Asian', 'Black', 'Hispanic', 'Multiracial non-Hispanic', 'NHOPI', 'Other Race'];
        switch(eachRecord.name){
            case "x_bmi5cat":
                brfssData[0].data = sortArrayByPropertyAndSortOrder(eachRecord["obese (bmi 30.0 - 99.8)"].race, property, sortOrder);
                break;
            case "x_rfsmok3":
                brfssData[1].data = sortArrayByPropertyAndSortOrder(eachRecord.yes.race, property, sortOrder);
                break;
            case "x_rfdrhv5":
                brfssData[2].data = sortArrayByPropertyAndSortOrder(eachRecord["meet criteria for heavy drinking"].race, property, sortOrder);
                break;
            case "x_paindx1":
                brfssData[3].data = sortArrayByPropertyAndSortOrder(eachRecord.yes.race, property, sortOrder);
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
    yrbsData.push({
        "question": "Obese", data:data.table.question[6] && data.table.question[6].Yes ?
            sortArrayByPropertyAndSortOrder(data.table.question[6].Yes.race, property, sortOrder) : "Not applicable"
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
            record['rates'] = 'Not Applicable';
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

function getBridgeRaceDataForFactSheet(factSheetQueryJSON, fsType) {
    var deferred = Q.defer();
    var bridgeRaceQueryObj = factSheetQueryJSON.bridge_race;
    var es = new elasticSearch();
    var promises = [
        es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.gender_population),
        es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.nonHispanicRace_population),
        es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.race_population),
        es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.hispanic_population),
        es.executeESQuery('owh_census', 'census', bridgeRaceQueryObj.age_population)
    ];

    Q.all(promises).then(function (resp) {
        var genderData = searchUtils.populateDataWithMappings(resp[0], 'bridge_race', 'pop');
        var nonHispanicRaceData = searchUtils.populateDataWithMappings(resp[1], 'bridge_race', 'pop');
        var raceData = searchUtils.populateDataWithMappings(resp[2], 'bridge_race', 'pop');
        var hispanicData = searchUtils.populateDataWithMappings(resp[3], 'bridge_race', 'pop');
        var ageGroupData = searchUtils.populateDataWithMappings(resp[4], 'bridge_race', 'pop');
        var data =  prepareFactSheetForPopulation(genderData, nonHispanicRaceData,
            raceData, hispanicData, ageGroupData, fsType);
        deferred.resolve(data);
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

function prepareFactSheetForPopulation(genderData, nonHispanicRaceData,
                                       raceData, hispanicData, ageGroupData, fsType) {
    var factSheet = {};
    factSheet.gender = genderData.data.simple.group_table_sex;
    factSheet.totalGenderPop = 0;
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

/**
 * Prepare Infant mortality data for fact-sheet
 * @param factSheetQueryJSON
 */
function getFactSheetDataForInfants(factSheetQueryJSON) {
    var deferred = Q.defer();
    var promises = [
        new wonder('D69').invokeWONDER(factSheetQueryJSON.infant_mortality.racePopulation),
        new wonder('D69').invokeWONDER(factSheetQueryJSON.infant_mortality.hispanicPopulation)
    ];
    Q.all(promises).then(function (resp) {
        //non-hispanic races
        var infantMortalityData = resp[0].table;
        //hispanic data
        infantMortalityData['Hispanic'] = resp[1].table['2014'];
        //cdc returns NUMBER+(Unreliable) i.e. 5.20 (Unreliable) if data is Unreliable
        //Convert it into 'Unreliable' string
        for (var prop in infantMortalityData) {
            var deathRate = infantMortalityData[prop].deathRate;
            if (deathRate && deathRate.indexOf('Unreliable') != -1) {
                infantMortalityData[prop].deathRate = 'Unreliable';
            }
        }
        deferred.resolve(infantMortalityData);
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

function getTBDataForFactSheets(factSheetQueryJSON) {
    var es = new elasticSearch();
    var promises = [
        es.executeESQuery('owh_tb', 'tb', factSheetQueryJSON.tuberculosis[0]),
        es.aggregateCensusDataQuery(factSheetQueryJSON.tuberculosis[1], 'owh_tb', "tb", 'pop')
    ];
    var deferred = Q.defer();
    Q.all(promises).then(function (resp) {
        var tbData = searchUtils.populateDataWithMappings(resp[0], 'tb' , 'cases');
        es.mergeWithCensusData(tbData, resp[1], 'pop');
        var data = prepareDiseaseData(tbData, 'tb');
        deferred.resolve(data);
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

function getSTDDataForFactSheets(factSheetQueryJSON) {
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
        es.executeESQuery('owh_std', 'std', gonorrheaESQuery),
        es.aggregateCensusDataQuery(gonorrheaPopQuery, 'owh_std', "std", 'pop'),
        es.executeESQuery('owh_std', 'std', syphilisESQuery),
        es.aggregateCensusDataQuery(syphilisPopQuery, 'owh_std', "std", 'pop'),
        es.executeESQuery('owh_std', 'std', earlySyphilisESQuery),
        es.aggregateCensusDataQuery(earlySyphilisPopQuery, 'owh_std', "std", 'pop')
    ];

    var deferred = Q.defer();
    Q.all(promises).then(function (resp) {
        // For Chlamydia
        var stdChlamydiaData = searchUtils.populateDataWithMappings(resp[0], 'std' , 'cases');
        es.mergeWithCensusData(stdChlamydiaData, resp[1], 'pop');
        searchUtils.applySuppressions(stdChlamydiaData, 'std', 4);
        // For Gonorrhea
        var stdGonorrheaData = searchUtils.populateDataWithMappings(resp[2], 'std' , 'cases');
        es.mergeWithCensusData(stdGonorrheaData, resp[3], 'pop');
        searchUtils.applySuppressions(stdGonorrheaData, 'std', 4);
        // For Primary and Secondary Syphilis
        var stdPrimarySyphilisData = searchUtils.populateDataWithMappings(resp[4], 'std' , 'cases');
        es.mergeWithCensusData(stdPrimarySyphilisData, resp[5], 'pop');
        searchUtils.applySuppressions(stdPrimarySyphilisData, 'std', 4);
        // For Early Latent Syphilis
        var stdEarlySyphilisData = searchUtils.populateDataWithMappings(resp[6], 'std' , 'cases');
        es.mergeWithCensusData(stdEarlySyphilisData, resp[7], 'pop');
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
    return deferred.promise;

}

function getAIDSDataForFactSheets(factSheetQueryJSON) {
    var aidsDiagnosesESQuery = factSheetQueryJSON.aids["AIDS Diagnoses"][0];
    var aidsDiagnosesPopQuery = factSheetQueryJSON.aids["AIDS Diagnoses"][1];
    var aidsDeathsESQuery = factSheetQueryJSON.aids["AIDS Deaths"][0];
    var aidsDeathsPopQuery = factSheetQueryJSON.aids["AIDS Deaths"][1];
    var aidsPrevalenceESQuery = factSheetQueryJSON.aids["AIDS Prevalence"][0];
    var aidsPrevalencePopQuery = factSheetQueryJSON.aids["AIDS Prevalence"][1];
    var hivDiagnosesESQuery = factSheetQueryJSON.aids["HIV Diagnoses"][0];
    var hivDiagnosesPopQuery = factSheetQueryJSON.aids["HIV Diagnoses"][1];
    var hivDeathsESQuery = factSheetQueryJSON.aids["HIV Deaths"][0];
    var hivDeathsPopQuery = factSheetQueryJSON.aids["HIV Deaths"][1];
    var hivPrevalenceESQuery = factSheetQueryJSON.aids["HIV Prevalence"][0];
    var hivPrevalencePopQuery = factSheetQueryJSON.aids["HIV Prevalence"][1];
    var es = new elasticSearch();
    var promises = [
        es.executeESQuery('owh_aids', 'aids', aidsDiagnosesESQuery),
        es.aggregateCensusDataQuery(aidsDiagnosesPopQuery, 'owh_aids', "aids", 'pop'),
        es.executeESQuery('owh_aids', 'aids', aidsDeathsESQuery),
        es.aggregateCensusDataQuery(aidsDeathsPopQuery, 'owh_aids', "aids", 'pop'),
        es.executeESQuery('owh_aids', 'aids', aidsPrevalenceESQuery),
        es.aggregateCensusDataQuery(aidsPrevalencePopQuery, 'owh_aids', "aids", 'pop'),
        es.executeESQuery('owh_aids', 'aids', hivDiagnosesESQuery),
        es.aggregateCensusDataQuery(hivDiagnosesPopQuery, 'owh_aids', "aids", 'pop'),
        es.executeESQuery('owh_aids', 'aids', hivDeathsESQuery),
        es.aggregateCensusDataQuery(hivDeathsPopQuery, 'owh_aids', "aids", 'pop'),
        es.executeESQuery('owh_aids', 'aids', hivPrevalenceESQuery),
        es.aggregateCensusDataQuery(hivPrevalencePopQuery, 'owh_aids', "aids", 'pop')
    ];

    var deferred = Q.defer();
    Q.all(promises).then(function (resp) {
        //AIDS Diagnoses
        var aidsDiagnosesData = searchUtils.populateDataWithMappings(resp[0], 'aids' , 'cases');
        es.mergeWithCensusData(aidsDiagnosesData, resp[1], 'pop');
        searchUtils.applySuppressions(aidsDiagnosesData, 'aids', 0);
        //AIDS Deaths
        var aidsDeathsData = searchUtils.populateDataWithMappings(resp[2], 'aids' , 'cases');
        es.mergeWithCensusData(aidsDeathsData, resp[3], 'pop');
        searchUtils.applySuppressions(aidsDeathsData, 'aids', 0);
        //AIDS Prevalence
        var aidsPrevalenceData = searchUtils.populateDataWithMappings(resp[4], 'aids' , 'cases');
        es.mergeWithCensusData(aidsPrevalenceData, resp[5], 'pop');
        searchUtils.applySuppressions(aidsPrevalenceData, 'aids', 0);
        //HIV Diagnoses
        var hivDiagnosesData = searchUtils.populateDataWithMappings(resp[6], 'aids' , 'cases');
        es.mergeWithCensusData(hivDiagnosesData, resp[7], 'pop');
        searchUtils.applySuppressions(hivDiagnosesData, 'aids', 0);
        //HIV Deaths
        var hivDeathsData = searchUtils.populateDataWithMappings(resp[8], 'aids' , 'cases');
        es.mergeWithCensusData(hivDeathsData, resp[9], 'pop');
        searchUtils.applySuppressions(hivDeathsData, 'aids', 0);
        //HIV Prevalence
        var hivPrevalenceData = searchUtils.populateDataWithMappings(resp[10], 'aids' , 'cases');
        es.mergeWithCensusData(hivPrevalenceData, resp[11], 'pop');
        searchUtils.applySuppressions(hivPrevalenceData, 'aids', 0);

        var hivData = [{disease:"AIDS Diagnoses", data:prepareDiseaseData(aidsDiagnosesData, 'aids')},
            {disease:"AIDS Deaths*", data:prepareDiseaseData(aidsDeathsData, 'aids')},
            {disease:"AIDS Prevalence*", data:prepareDiseaseData(aidsPrevalenceData, 'aids')},
            {disease:"HIV Diagnoses", data:prepareDiseaseData(hivDiagnosesData, 'aids')},
            {disease:"HIV Deaths*", data:prepareDiseaseData(hivDeathsData, 'aids')},
            {disease:"HIV Prevalence*", data:prepareDiseaseData(hivPrevalenceData, 'aids')}];

        deferred.resolve(hivData);
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

function getDetailMortalityDataForFactSheet(factSheetQueryJSON) {
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
    var deferred = Q.defer();
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
    return deferred.promise;
}

function prepareDetailMortalityData(raceCountData, raceRateData, hispanicCountData, hispanicRateDate) {

    var noDataAvailableObj = {name: 'Hispanic', deaths: 'suppressed', ageAdjustedRate: 'Not Available', standardPop: 'Not Available'};
    var selectedRaces = { "options": [ "American Indian", "Asian or Pacific Islander", "Black", 'Hispanic' ]};
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
    resultantData.data.nested.table.race[3] = hispanic;
    resultantData.data.nested.table.race = sortArrayByPropertyAndSortOrder(resultantData.data.nested.table.race, 'name', selectedRaces.options);
    return resultantData;
}

function getNatalityDataForFactSeet(factSheetQueryJSON) {
    var birthRatesESQuery = factSheetQueryJSON.natality["birthRates"][0];
    var birthRatesPopQuery = factSheetQueryJSON.natality["birthRates"][1];
    var fertilityRatesESQuery = factSheetQueryJSON.natality["fertilityRates"][0];
    var fertilityRatesPopQuery = factSheetQueryJSON.natality["fertilityRates"][1];
    var vaginalESQuery = factSheetQueryJSON.natality["vaginal"];
    var cesareanESQuery = factSheetQueryJSON.natality["cesarean"];
    var lowBirthWeightESQuery = factSheetQueryJSON.natality["lowBirthWeight"];
    var twinBirthESQuery = factSheetQueryJSON.natality["twinBirth"];
    var totalBirthsESQuery = factSheetQueryJSON.natality["totalBirthsByYear"];

    var es = new elasticSearch();
    var promises = [
        es.executeMultipleESQueries(birthRatesESQuery, 'owh_natality', 'natality'),
        es.aggregateCensusDataQuery(birthRatesPopQuery, 'owh_census_rates', "census_rates", 'pop'),
        es.executeMultipleESQueries(fertilityRatesESQuery, 'owh_natality', 'natality'),
        es.aggregateCensusDataQuery(fertilityRatesPopQuery, 'owh_census_rates', "census_rates", 'pop'),
        es.executeMultipleESQueries(vaginalESQuery, 'owh_natality', 'natality'),
        es.executeMultipleESQueries(cesareanESQuery, 'owh_natality', 'natality'),
        es.executeMultipleESQueries(lowBirthWeightESQuery, 'owh_natality', 'natality'),
        es.executeMultipleESQueries(twinBirthESQuery, 'owh_natality', 'natality'),
        es.executeMultipleESQueries(totalBirthsESQuery, 'owh_natality', 'natality')
    ];
    var deferred = Q.defer();
    Q.all(promises).then(function (resp) {
        var sortOrder = ['American Indian', 'Asian or Pacific Islander', 'Black'];
        var birthRatesData = searchUtils.populateDataWithMappings(resp[0], 'natality');
        es.mergeWithCensusData(birthRatesData, resp[1], 'pop');
        searchUtils.addMissingFilterOptions({ "options": sortOrder}, birthRatesData.data.nested.table.race, 'natality');
        searchUtils.applySuppressions(birthRatesData, 'natality');

        var fertilityRatesData = searchUtils.populateDataWithMappings(resp[2], 'natality');
        es.mergeWithCensusData(fertilityRatesData, resp[3], 'pop');
        searchUtils.addMissingFilterOptions({ "options": sortOrder}, fertilityRatesData.data.nested.table.race, 'natality');
        searchUtils.applySuppressions(fertilityRatesData, 'natality');

        var vaginalData = searchUtils.populateDataWithMappings(resp[4], 'natality');
        searchUtils.addMissingFilterOptions({ "options": sortOrder}, vaginalData.data.nested.table.race, 'natality');
        searchUtils.applySuppressions(vaginalData, 'natality');

        var cesareanData = searchUtils.populateDataWithMappings(resp[5], 'natality');
        searchUtils.addMissingFilterOptions({ "options": sortOrder}, cesareanData.data.nested.table.race, 'natality');
        searchUtils.applySuppressions(cesareanData, 'natality');

        var lowBirthWeightData = searchUtils.populateDataWithMappings(resp[6], 'natality');
        searchUtils.addMissingFilterOptions({ "options": sortOrder}, lowBirthWeightData.data.nested.table.race, 'natality');
        searchUtils.applySuppressions(lowBirthWeightData, 'natality');

        var twinBirthData = searchUtils.populateDataWithMappings(resp[7], 'natality');
        searchUtils.addMissingFilterOptions({ "options": sortOrder}, twinBirthData.data.nested.table.race, 'natality');
        searchUtils.applySuppressions(twinBirthData, 'natality');

        var totalBirthPopData = searchUtils.populateDataWithMappings(resp[8], 'natality');
        searchUtils.addMissingFilterOptions({ "options": sortOrder}, totalBirthPopData.data.nested.table.race, 'natality');
        searchUtils.applySuppressions(totalBirthPopData, 'natality');
        var natalityData = {
            birthRateData:sortArrayByPropertyAndSortOrder(birthRatesData.data.nested.table.race, 'name', sortOrder),
            fertilityRatesData:sortArrayByPropertyAndSortOrder(fertilityRatesData.data.nested.table.race, 'name', sortOrder),
            vaginalData:sortArrayByPropertyAndSortOrder(vaginalData.data.nested.table.race, 'name', sortOrder),
            cesareanData:sortArrayByPropertyAndSortOrder(cesareanData.data.nested.table.race, 'name', sortOrder),
            lowBirthWeightData:sortArrayByPropertyAndSortOrder(lowBirthWeightData.data.nested.table.race, 'name', sortOrder),
            twinBirthData: sortArrayByPropertyAndSortOrder(twinBirthData.data.nested.table.race, 'name', sortOrder),
            totalBirthPopulation:sortArrayByPropertyAndSortOrder(totalBirthPopData.data.nested.table.race, 'name', sortOrder)
        };
        deferred.resolve(natalityData);
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

function getCancerDataForFactSheet(factSheetQueryJSON) {
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
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', breastCancerESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', breastCancerHispanicESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', colonCancerESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', colonCancerHispanicESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', lungCancerESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', lungCancerHispanicESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', melanomaCancerESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', melanomaCancerHispanicESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', cervixCancerESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', cervixCancerHispanicESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', ovaryCancerESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', ovaryCancerHispanicESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', prostateCancerESQuery),
        es.executeESQuery('owh_cancer_incident', 'cancer_incident', prostateCancerHispanicESQuery)
    ];
    var deferred = Q.defer();
    Q.all(promises).then(function (resp) {
        var selectedRaces = { "options": [ "American Indian/Alaska Native", "Asian or Pacific Islander", "Black" ]};
        //Cancer - Mortality
        var cancerMortalityBreastData = prepareCancerData(resp[0], resp[1], resp[2], resp[3], 'cancer_mortality');

        var cancerMortalityColonAndRectumData = prepareCancerData(resp[4], resp[5], resp[6], resp[7], 'cancer_mortality');

        var cancerMortalityLungAndBronchusData = prepareCancerData(resp[8], resp[9], resp[10], resp[11], 'cancer_mortality');

        var cancerMortalityMelanomaData = prepareCancerData(resp[12], resp[13], resp[14], resp[15], 'cancer_mortality');

        var cancerMortalityCervixData = prepareCancerData(resp[16], resp[17], resp[18], resp[19], 'cancer_mortality');

        var cancerMortalityOvaryData = prepareCancerData(resp[20], resp[21], resp[22], resp[23], 'cancer_mortality');

        var cancerMortalityProstateData = prepareCancerData(resp[24], resp[25], resp[26], resp[27], 'cancer_mortality');

        //Cancer - Incident
        var rules = searchUtils.createCancerIncidenceSuppressionRules(['2014'], true, false);
        var cancerIncidentBreastData = prepareCancerData(resp[28], resp[1], resp[29], resp[3], 'cancer_incident');
        searchUtils.applyCustomSuppressions(cancerIncidentBreastData.data.nested, rules, 'cancer_incident');

        var cancerIncidentColonAndRectumData = prepareCancerData(resp[30], resp[5], resp[31], resp[7], 'cancer_incident');
        searchUtils.applyCustomSuppressions(cancerIncidentColonAndRectumData.data.nested, rules, 'cancer_incident');

        var cancerIncidentLungAndBronchusData = prepareCancerData(resp[32], resp[9], resp[33], resp[11], 'cancer_incident');
        searchUtils.applyCustomSuppressions(cancerIncidentLungAndBronchusData.data.nested, rules, 'cancer_incident');

        var cancerIncidentMelanomaData = prepareCancerData(resp[34], resp[13], resp[35], resp[15], 'cancer_incident');
        searchUtils.applyCustomSuppressions(cancerIncidentMelanomaData.data.nested, rules, 'cancer_incident');

        var cancerIncidentCervixData = prepareCancerData(resp[36], resp[17], resp[37], resp[19], 'cancer_incident');
        searchUtils.applyCustomSuppressions(cancerIncidentCervixData.data.nested, rules, 'cancer_incident');

        var cancerIncidentOvaryData = prepareCancerData(resp[38], resp[21], resp[39], resp[23], 'cancer_incident');
        searchUtils.applyCustomSuppressions(cancerIncidentOvaryData.data.nested, rules, 'cancer_incident');

        var cancerIncidentProstateData = prepareCancerData(resp[40], resp[25], resp[41], resp[27], 'cancer_incident');
        searchUtils.applyCustomSuppressions(cancerIncidentProstateData.data.nested, rules, 'cancer_incident');

        var sortOrder = ['American Indian/Alaska Native', 'Asian or Pacific Islander', 'Black', 'Hispanic'];
        var cancerData = [
            {
                mortality: sortArrayByPropertyAndSortOrder(cancerMortalityBreastData.data.nested.table.race, 'name', sortOrder),
                incidence: sortArrayByPropertyAndSortOrder(cancerIncidentBreastData.data.nested.table.race, 'name', sortOrder),
                site: 'Breast'
            },{
                mortality: sortArrayByPropertyAndSortOrder(cancerMortalityCervixData.data.nested.table.race, 'name', sortOrder),
                incidence: sortArrayByPropertyAndSortOrder(cancerIncidentCervixData.data.nested.table.race, 'name', sortOrder),
                site: 'Cervix Uteri†'
            },{
                mortality: sortArrayByPropertyAndSortOrder(cancerMortalityColonAndRectumData.data.nested.table.race, 'name', sortOrder),
                incidence: sortArrayByPropertyAndSortOrder(cancerIncidentColonAndRectumData.data.nested.table.race, 'name', sortOrder),
                site: 'Colon and Rectum'
            },{
                mortality: sortArrayByPropertyAndSortOrder(cancerMortalityLungAndBronchusData.data.nested.table.race, 'name', sortOrder),
                incidence: sortArrayByPropertyAndSortOrder(cancerIncidentLungAndBronchusData.data.nested.table.race, 'name', sortOrder),
                site: 'Lung and Bronchus'
            },{
                mortality: sortArrayByPropertyAndSortOrder(cancerMortalityMelanomaData.data.nested.table.race, 'name', sortOrder),
                incidence: sortArrayByPropertyAndSortOrder(cancerIncidentMelanomaData.data.nested.table.race, 'name', sortOrder),
                site: 'Melanoma of the Skin'
            },{
                mortality: sortArrayByPropertyAndSortOrder(cancerMortalityOvaryData.data.nested.table.race, 'name', sortOrder),
                incidence: sortArrayByPropertyAndSortOrder(cancerIncidentOvaryData.data.nested.table.race, 'name', sortOrder),
                site: 'Ovary†'
            },{
                mortality: sortArrayByPropertyAndSortOrder(cancerMortalityProstateData.data.nested.table.race, 'name', sortOrder),
                incidence: sortArrayByPropertyAndSortOrder(cancerIncidentProstateData.data.nested.table.race, 'name', sortOrder),
                site: 'Prostate††'
            }
        ];

        deferred.resolve(cancerData);
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

function prepareCancerData(pop, totalPop, hispanicPop, hispanicTotalPop, countKey) {

    var selectedRaces = { "options": [ "American Indian/Alaska Native", "Asian or Pacific Islander", "Black" ]};
    var resultantData = searchUtils.populateDataWithMappings(pop, countKey);
    searchUtils.addMissingFilterOptions(selectedRaces, resultantData.data.nested.table.race, countKey);
    var cancerPopulation = searchUtils.populateDataWithMappings(totalPop, 'cancer_population');
    searchUtils.addMissingFilterOptions(selectedRaces, cancerPopulation.data.nested.table.race, countKey);
    var cancerPopulationIndex = searchUtils.createPopIndex(cancerPopulation.data.nested.table, 'cancer_population');
    searchUtils.attachPopulation(resultantData.data.nested.table, cancerPopulationIndex, '');

    var cancerHispanicData = searchUtils.populateDataWithMappings(hispanicPop, countKey);
    var cancerHispanicPopulation = searchUtils.populateDataWithMappings(hispanicTotalPop, 'cancer_population');
    var hispanicPopulationIndex = searchUtils.createPopIndex(cancerHispanicPopulation.data.nested.table, 'cancer_population');
    searchUtils.attachPopulation(cancerHispanicData.data.nested.table, hispanicPopulationIndex, '');
    var hispanicData = cancerHispanicData.data.nested.table.current_year[0] || {name:'Hispanic', pop:cancerHispanicPopulation.data.nested.table.current_year[0].cancer_population};
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

function getBRFSDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    var brfsQuery = factSheetQueryJSON.brfss.query_2015;
    new yrbs().invokeYRBSService(brfsQuery).then(function (resp) {
        deferred.resolve(prepareBRFSSData(resp));
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

function getPRAMSDataForFactSheet(factSheetQueryJSON) {
    var deferred = Q.defer();
    var promises = [
        new yrbs().invokeYRBSService(factSheetQueryJSON.prams['qn30']),//Smoking
        new yrbs().invokeYRBSService(factSheetQueryJSON.prams['qn21']),//Physical Abuse
        new yrbs().invokeYRBSService(factSheetQueryJSON.prams['qn5']),//Breast feeding
        new yrbs().invokeYRBSService(factSheetQueryJSON.prams['qn133'])//indicator of depression
    ];

    Q.all(promises).then(function (resp) {
        var data = preparePRAMSData([resp[0], resp[1], resp[2], resp[3]]);
        deferred.resolve(data);
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

module.exports = MinorityFactSheet;
