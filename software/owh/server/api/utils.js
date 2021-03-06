var Aggregation = require('../models/aggregation');
var merge = require('merge');

/**
 * To add missing filter option to results data
 * ElasticSearch match query returns only available options
 * For example if sex -> male records available then results only have 'Male' data not 'Female' data
 * So we are adding missing 'Female' data (like this {name:'Female', countkey: 0})]
 * countkey could be anything 'infant_mortality', 'deaths' etc..
 * @param filter
 * @param aggResults
 * @param countKey
 */
function addMissingFilterOptions(filter, aggResults, countKey) {
    if (filter.options.length != aggResults.length) {
        filter.options.forEach(function (eachOption) {
            var isOptionAvailable = false;
            aggResults.forEach(function (eachAggOption) {
                if (eachAggOption.name === eachOption) {
                    isOptionAvailable = true;
                }
            });
            //Adding missing options
            //For example {name:'Female', countKey: 0 } or {name:'White', countKey: 0 }
            if (!isOptionAvailable) {
                var missingOption = {};
                missingOption["name"] = eachOption;
                missingOption[countKey] = 0;
                aggResults.push(missingOption);
            }
        });
    }
}

/**
 * Get selected aggregation keys from give query json object
 * @param query
 * @return Array of selected aggregation keys
 */
function getAggregationKeys(query) {
    var aggKeys = [];
    for (key in query) {
        if (!!query[key] && typeof(query[key])=="object") {
            if(key.indexOf('group_table_') > -1) {
                var groupKeyRegex = /group_table_/;
                aggKeys.push(key.split(groupKeyRegex)[1]);
            }
            aggKeys.push.apply(aggKeys, getAggregationKeys(query[key]));
        }
    }
    return aggKeys;
}

var populateDataWithMappings = function(resp, countKey, countQueryKey, allSelectedFilterOptions, query) {
  var result = {
        data: {
            simple: {},
            nested: {
                table: {},
                tableCounts: {},
                charts: [],
                maps:{}
            }
        },
        pagination: {
            total: resp? resp.hits.total : 0
        }
    };
   //Get selected aggregation keys, so that we can add missing filters and filter options nested level
    var tableAggKeys = [];
    var chartAggKeys = {};
    var mapAggKeys = [];
    if(query) {
      tableAggKeys = getAggregationKeys(query);
      //To capture selected chart aggregation keys, so that we can add missing filters and filter options for chart data
      Object.keys(query.aggregations).forEach(function(eachAggKey){
          if(eachAggKey.indexOf('group_chart_') > -1){
              var keySplits = eachAggKey.split("_");
              var groupKeyRegex = /group_chart_\d_/;
              chartAggKeys[keySplits[2]] = [];
              chartAggKeys[keySplits[2]].push(eachAggKey.split(groupKeyRegex)[1]);
              Object.keys(query.aggregations[eachAggKey].aggregations).forEach(function(nestedAggKey){
                  if(nestedAggKey.indexOf('group_chart_') > -1) {
                      chartAggKeys[Number(keySplits[2])].push(nestedAggKey.split(groupKeyRegex)[1])
                  }
              });
          }
          else if(eachAggKey.indexOf('group_maps_') >  -1){
              var groupKeyRegex = /group_maps_\d_/;
              mapAggKeys.push(eachAggKey.split(groupKeyRegex)[1]);
              Object.keys(query.aggregations[eachAggKey].aggregations).forEach(function(nestedAggKey){
                  if(nestedAggKey.indexOf('group_maps_') > -1) {
                      mapAggKeys.push(nestedAggKey.split(groupKeyRegex)[1]);
                  }
              });
          }
      });
    }
    if(resp && resp.aggregations) {
        var data = resp.aggregations;
        Object.keys(data).forEach(function (key) {
            var dataKey = '';
            if (key.indexOf('group_table_') > -1) {
                var groupKeyRegex = /group_table_/;
                dataKey = key.split(groupKeyRegex)[1];
                result.data.nested.table[dataKey] = populateAggregatedData(data[key].buckets, countKey, 1, undefined, countQueryKey, groupKeyRegex, dataKey, allSelectedFilterOptions, tableAggKeys, 'group_table_');
            }
            if (key.indexOf('group_table_counts_') > -1) {
                var groupKeyRegex = /group_table_counts_/;
                dataKey = key.split(groupKeyRegex)[1];
                result.data.nested.tableCounts[dataKey] = populateAggregatedData(data[key].buckets, countKey, 1, undefined, countQueryKey, groupKeyRegex, dataKey, allSelectedFilterOptions, tableAggKeys, 'group_table_counts_');
            }
            if (key.indexOf('group_chart_') > -1) {
                var keySplits = key.split("_");
                var groupKeyRegex = /group_chart_\d_/;
                dataKey = key.split(groupKeyRegex)[1];
                var dataIndex = Number(keySplits[2]);
                var aggData = {};
                aggData[dataKey] = populateAggregatedData(data[key].buckets, countKey, 3, undefined, countQueryKey, groupKeyRegex, dataKey, allSelectedFilterOptions, chartAggKeys[dataIndex], 'group_chart_'+keySplits[2]+'_');
                result.data.nested.charts[dataIndex] = aggData;
            }
            if (key.indexOf('group_maps_') > -1) {
                var keySplits = key.split("_");
                var groupKeyRegex = /group_maps_\d_/;
                dataKey = key.split(groupKeyRegex)[1];
                var aggData = {};
                var allSelectedFilterOptionsForMap = {};
                if(mapAggKeys.length > 0) {
                    allSelectedFilterOptionsForMap[mapAggKeys[0]] = {"options":["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA",
                        "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]};
                    allSelectedFilterOptionsForMap[mapAggKeys[1]] = {"options":['Female', 'Male']};
                    (countKey === 'std' || countKey === 'tb' || countKey === 'aids') && allSelectedFilterOptionsForMap[mapAggKeys[1]].options.unshift('Both sexes');
                    aggData[dataKey] = populateAggregatedData(data[key].buckets, countKey, 3, true, countQueryKey, groupKeyRegex, dataKey, allSelectedFilterOptionsForMap, mapAggKeys, 'group_maps_'+keySplits[2]+'_');
                }
                else {
                    aggData[dataKey] = populateAggregatedData(data[key].buckets, countKey, 3, true, countQueryKey);
                }
                result.data.nested.maps[dataKey]= aggData[dataKey];
            } else {
                result.data.simple[key] = populateAggregatedData(data[key].buckets, countKey, undefined, undefined, countQueryKey, undefined, key, allSelectedFilterOptions);
            }
        });
    }
    // console.log(JSON.stringify(result));
    return result;
};

var populateWonderDataWithMappings = function(resp, countKey, countQueryKey, wonderQuery, isStateSelected) {
    var result = {
        data: {
            simple: {},
            nested: {
                table: {},
                charts: [],
                maps:{}
            }
        },
        pagination: {
            total: 0
        }
    };
    //Get selected aggregation filter keys
    var tableFilterKeys = [];
    wonderQuery.aggregations.nested.table.forEach(function(eachAgg){
        tableFilterKeys.push(eachAgg.key);
    });
    var tableCountsFilterKeys = [];
    if(wonderQuery.aggregations.nested.tableCounts)
        wonderQuery.aggregations.nested.tableCounts.forEach(function(eachAgg){
            tableCountsFilterKeys.push(eachAgg.key);
        });
    var chartFilterKeys = [];
    wonderQuery.aggregations.nested.charts.forEach(function(eachChartArray){
        var chartAggKeyArray = [];
        eachChartArray.forEach(function(eachAgg){
            chartAggKeyArray.push(eachAgg.key);
        });
       chartFilterKeys.push(chartAggKeyArray);
    });
    var mapAggFilterKeys = [];
    wonderQuery.aggregations.nested.maps[0].forEach(function(eachAgg){
        mapAggFilterKeys.push(eachAgg.key);
    });
    if(resp) {
        result.data.nested.table = populateAggregateDataForWonderResponse(resp.table, 'Total', tableFilterKeys, isStateSelected);
        if(resp.tableCounts)
            result.data.nested.tableCounts = populateAggregateDataForWonderResponse(resp.tableCounts, 'Total', tableCountsFilterKeys, isStateSelected);
        chartFilterKeys.forEach(function(eachChartFilterKeys, index){
            result.data.nested.charts[index] = populateAggregateDataForWonderResponse(resp.charts[index], 'Total', eachChartFilterKeys, isStateSelected);
        });
        result.data.nested.maps = populateAggregateDataForWonderResponse(resp.maps, 'Total', mapAggFilterKeys, isStateSelected);
    }
    return result;
};

var populateAggregateDataForWonderResponse = function(wonderResponse, key, filterKeys, isStateSelected){
    var keyMap = {
        "Alabama": "AL",
        "Alaska": "AK",
        "Arizona": "AZ",
        "Arkansas": "AR",
        "California": "CA",
        "Colorado": "CO",
        "Connecticut": "CT",
        "Delaware": "DE",
        "District of Columbia": "DC",
        "Florida": "FL",
        "Georgia": "GA",
        "Hawaii": "HI",
        "Idaho": "ID",
        "Illinois": "IL",
        "Indiana": "IN",
        "Iowa": "IA",
        "Kansas": "KS",
        "Kentucky": "KY",
        "Louisiana": "LA",
        "Maine": "ME",
        "Maryland": "MD",
        "Massachusetts": "MA",
        "Michigan": "MI",
        "Minnesota": "MN",
        "Mississippi": "MS",
        "Missouri": "MO",
        "Montana": "MT",
        "Nebraska": "NE",
        "Nevada": "NV",
        "New Hampshire": "NH",
        "New Jersey": "NJ",
        "New Mexico": "NM",
        "New York": "NY",
        "North Carolina": "NC",
        "North Dakota": "ND",
        "Ohio": "OH",
        "Oklahoma": "OK",
        "Oregon": "OR",
        "Pennsylvania": "PA",
        "Rhode Island": "RI",
        "South Carolina": "SC",
        "South Dakota": "SD",
        "Tennessee": "TN",
        "Texas": "TX",
        "Utah": "UT",
        "Vermont": "VT",
        "Virginia": "VA",
        "Washington": "WA",
        "West Virginia": "WV",
        "Wisconsin": "WI",
        "Wyoming": "WY"
    };
    var result = {};
    if(keyMap[key]){
        key = keyMap[key];
    }
    if (wonderResponse.Total){
        result['name'] = key.trim();
        result.infant_mortality = wonderResponse.Total['deathRate'] === 'Suppressed' ? 'suppressed': wonderResponse.Total['infant_mortality'];
        result['deathRate'] = wonderResponse.Total['deathRate'] === 'Suppressed' ? 'suppressed': wonderResponse.Total['deathRate'];
        result['pop'] = isNaN(wonderResponse.Total['births']) ? 'suppressed' : wonderResponse.Total['births'];
        result [filterKeys[0]] = [];
        Object.keys(wonderResponse).forEach(function (key) {
            if (key != 'Total') {
                result [filterKeys[0]].push(populateAggregateDataForWonderResponse(wonderResponse[key], key, filterKeys.slice(0).filter(function (x, i) { return i !== 0;}), isStateSelected));
            }
        });
        return result;
    } else if (!wonderResponse.hasOwnProperty('infant_mortality')) {
        result['name'] = key.trim();
        result [filterKeys[0]] = [];
        Object.keys(wonderResponse).forEach(function (key) {
            result [filterKeys[0]].push(populateAggregateDataForWonderResponse(wonderResponse[key], key, filterKeys.slice(0).filter(function (x, i) { return i !== 0;}), isStateSelected));
        });
        return result;
    }
    else if(isStateSelected && !wonderResponse.hasOwnProperty('infant_mortality')) {
        result['name'] = key.trim();
        result['infant_mortality'] = 'na';
        result['deathRate'] = 'na';
        result['pop'] = 'na';
        result [filterKeys[0]] = [];
        Object.keys(wonderResponse).forEach(function (key) {
            result [filterKeys[0]].push(populateAggregateDataForWonderResponse(wonderResponse[key], key, filterKeys.slice(0).filter(function (x, i) { return i !== 0;}), isStateSelected));
        });
        return result;
    }
    else {
        result['name'] = key.trim();
        result.infant_mortality = wonderResponse['deathRate'] === 'Suppressed' ? 'suppressed' : wonderResponse['infant_mortality'];
        result['deathRate'] = wonderResponse['deathRate'] === 'Suppressed' ? 'suppressed' : wonderResponse['deathRate'];
        result['pop'] = isNaN(wonderResponse['births']) ? 'suppressed' : wonderResponse['births'];
        return result;
    }
};

var populateAggregatedData = function(buckets, countKey, splitIndex, map, countQueryKey, regex, dataKey, allSelectedFilterOptions, groupFilters, groupKey, parentOpt) {
    var result = [];
    //Preparing a new bucket to add buckets for missing filters
    var newBuckets = [];
    var regDivMap = {'CENS-D1':'CENS-R1','CENS-D2':'CENS-R1','CENS-D3':'CENS-R2','CENS-D4':'CENS-R2','CENS-D5':'CENS-R3',
        'CENS-D6':'CENS-R3','CENS-D7':'CENS-R3','CENS-D8':'CENS-R4','CENS-D9':'CENS-R4'}
    if(allSelectedFilterOptions && allSelectedFilterOptions[dataKey]) {
        allSelectedFilterOptions[dataKey].options.forEach(function(eachFilterOption){
            var foundFilterOptionAt = findIndexByKeyAndValue(buckets, 'key', eachFilterOption);
            //If any filter option not available in buckets then add it to
            if(foundFilterOptionAt === -1){
                // For cencus devision, add only divisions corresponding the parent region
                if(dataKey !== 'census-region|census_division' || regDivMap[eachFilterOption] === parentOpt) {
                    var newObj = {};
                    newObj.key = eachFilterOption;
                    newObj.doc_count = 0;
                    if(groupFilters && groupFilters.length > 1) {
                        newObj[groupKey+groupFilters[1]] = {buckets: []};
                    }
                    newBuckets.push(newObj);
                }
            }
            //If filter option available in buckets then add it
            else {
                newBuckets.push(buckets[foundFilterOptionAt]);
            }
        });
    }
    //If selected filter options not provided we will add any buckets for missing filter options
    else {
        newBuckets.push.apply(newBuckets, buckets);
    }
    for(var index in newBuckets) {
        // console.log(buckets[index]);
        //ignoring key -9 for blank data.
        if (newBuckets[index].key!=='-9') {
            var aggregation = new Aggregation(newBuckets[index], countKey, countQueryKey);

            aggregation[countKey] = aggregation[countKey];
            var innerObjKey = isValueHasGroupData(newBuckets[index]);
            // take from pop.value instead of doc_count for census data
            if(countKey === 'pop' || countKey === 'cancer_population') {
                aggregation = {name: newBuckets[index]['key']};
                if(newBuckets[index]['pop']) {
                    aggregation[countKey] = newBuckets[index]['pop'].value;
                } else {
                    aggregation[countKey] = sumBucketProperty(newBuckets[index][innerObjKey], 'pop');
                }
            }
            if(countKey === 'bridge_race') {
                aggregation = {name: newBuckets[index]['key']};
                if(newBuckets[index]['group_count_pop']) {
                    aggregation[countKey] = newBuckets[index]['group_count_pop'].value;
                } else {
                    aggregation[countKey] = sumBucketProperty(newBuckets[index][innerObjKey], 'group_count_pop');
                }
            }
            if( innerObjKey ) {
                //if you want to split group key by regex
                if (regex && (regex.test('group_table_') || regex.test('group_table_counts_') || regex.test('group_chart_0_') || regex.test('group_maps_0_'))) {
                    aggregation[innerObjKey.split(regex)[1]] =  populateAggregatedData(newBuckets[index][innerObjKey].buckets,
                        countKey, splitIndex, map, countQueryKey, regex, innerObjKey.split(regex)[1], allSelectedFilterOptions, groupFilters  ? groupFilters.slice(1): undefined, groupKey,newBuckets[index].key );
                } else {//by default split group key by underscore and retrieve key based on index
                    //adding slice and join because some keys are delimited by underscore so need to be reconstructed
                    aggregation[innerObjKey.split("_").slice(splitIndex).join('_')] =  populateAggregatedData(newBuckets[index][innerObjKey].buckets, countKey, splitIndex, map, countQueryKey);
                }

            }
            result.push(aggregation);
        }
    }

    /*
    * To add missing filter option to results data
    * ElasticSearch match query returns only available options
    * For example if sex -> male records available then results only have 'Male' data not 'Female' data
    * So we are adding missing 'Female' data (like this {name:'Female', countkey: 0})]
    * Here we are adding missing options for 'Infant_mortality' only
    **/
    if(regex && (regex.test('group_table_') || regex.test('group_table_counts_') || regex.test('group_chart_0_') || regex.test('group_maps_0_')) && allSelectedFilterOptions && allSelectedFilterOptions[dataKey] != undefined && dataKey !== 'census-region|census_division') {
       addMissingFilterOptions(allSelectedFilterOptions[dataKey], result, countKey);
    }
    return result;
};

/**
 * Suppress Counts if count is less than give 'maxValue'
 * If 'maxValue' undefined suppress counts if count is less then 10
 * @param obj
 * @param countKey - if 'obj['countKey']' less then 10 or maxValue then set 'suppressed'
 * @param dataType
 * @param suppressKey - if suppressKey passed then set 'obj[suppresskey]' to 'suppressed'
 * @param maxValue
 */
function suppressCounts (obj, countKey, dataType, suppressKey, maxValue, dataset, isBasicSearch) {
    var key = suppressKey ? suppressKey : countKey;
    var value = maxValue !== undefined ? maxValue : 10;
    var suppressedVal = 'suppressed';
    var naVal = 'na';
    // Set supressed and na value for charts to -1 and -2 respectively;
    if(dataType === 'charts'){
        suppressedVal = -1;
        naVal = -2;
    }
    for (var property in obj) {
        if (property === 'name') {
            continue;
        }
        //keep the track of data types
        if (['table', 'charts', 'maps'].indexOf(property) != -1) {
            dataType = property;
        }

        if (obj[property] && obj[property].constructor === Object) {
            suppressCounts(obj[property], countKey, dataType, suppressKey, maxValue, dataset, isBasicSearch);
        } else if (obj[property] && obj[property].constructor === Array) {
            obj[property].forEach(function(arrObj) {
                suppressCounts(arrObj, countKey, dataType, suppressKey, maxValue, dataset, isBasicSearch);
            });
        } else if(dataset === 'brfss') {
            if(isBasicSearch) {
                if(obj.mean == 0 && obj.count != 0) {
                    obj.mean = suppressedVal;
                } else if(obj.mean == 0 && obj.count == 0) {
                    obj.mean = naVal; //no response
                }
            } else if(!isBasicSearch) {
                var rse = obj.se*100 / obj.mean;
                if(obj.sampleSize < 50 || rse > 0.3) {
                    obj.mean = suppressedVal;
                }
            }
        } else if(dataset === 'prams') {
            //for basic search
            if(isBasicSearch && obj.mean == 0 && obj.count == null) {
                obj.mean = suppressedVal;
            } else if(!isBasicSearch && obj.sampleSize < 30) {//for advance search
                obj.mean = suppressedVal;
            }
        } else if(obj[countKey] != undefined && obj[countKey] < value) {
            if(countKey === 'std' && obj[countKey] === 0) {
                //obj[countKey] = naVal;
            } else if(obj[countKey] === -2) {
                obj[countKey] = naVal;
            } else {// suppress value
                obj[key] = suppressedVal;
            }
        }
    }
};

/**
 * Suppress totals if one of the count is suppressed
 * @param obj
 * @param countKey - if 'obj['countKey']' less then 10 or maxValue then set 'suppressed'
 * @param dataType
 * @param suppressKey - if suppressKey passed then set 'obj[suppresskey]' to 'suppressed'
 */
function suppressTotalCounts (obj, countKey, dataType, suppressKey) {
    var key = suppressKey ? suppressKey : countKey;
    for (var property in obj) {

        if (property === 'name') {
            continue;
        }

        if (['table', 'charts', 'maps'].indexOf(property) != -1) {
            dataType = property;
        }

        if (obj[property].constructor === Object) {
            if (obj[countKey] && JSON.stringify(obj).indexOf('suppressed') != -1 ) {
                if(dataType == 'maps' || dataType == 'charts') {//for chart and map set suppressed values to 0
                    obj[countKey] = 0;
                } else {//for table data set to suppressed
                    obj[key] = 'suppressed';
                }
            }
            suppressTotalCounts(obj[property], countKey, dataType, suppressKey);
        } else if (obj[property].constructor === Array) {
            obj[property].forEach(function(arrObj) {
                if (obj[countKey] && JSON.stringify(obj).indexOf('suppressed') != -1 ) {
                    if(dataType == 'charts') {//for chart and map set suppressed values to 0
                        obj[countKey] = 0;
                    } else {//for table data set to suppressed
                        obj[key] = 'suppressed';
                    }
                }
                suppressTotalCounts(arrObj, countKey, dataType, suppressKey);
            });
        }
    }
};

/**
 * Apply suppression for data
 * @param obj
 * @param countKey
 */
function applySuppressions(obj, countKey, maxValue) {
    var dataType;
    suppressCounts(obj.data, countKey, dataType, null, maxValue);
    suppressTotalCounts(obj.data, countKey, dataType, null, maxValue);
}

/**
 * To suppress YRBS Basic and Advanced search data
 * @param obj
 * @param countKey
 * @param suppressKey
 * @param isSexFiltersSelected
 */
function applyYRBSSuppressions(obj, countKey, suppressKey, isSexFiltersSelected, isChartorMapQuery ) {
    var dataType;
    if(isChartorMapQuery){
        dataType = 'charts';
    }
    var maxValue = isSexFiltersSelected ? 30 : 100;
    suppressCounts(obj.data, countKey, dataType, suppressKey, maxValue);
    suppressTotalCounts(obj.data, countKey, dataType, suppressKey);
};

/**
 * To suppress YRBS Basic and Advanced search data
 * @param obj
 * @param countKey
 * @param suppressKey
 * @param isSexFiltersSelected
 */
function applyPRAMSuppressions(obj, countKey, suppressKey, isChartorMapQuery, isBasicSearch ) {
    var dataType;
    if(isChartorMapQuery){
        dataType = 'charts';
    }
    var maxValue = 30;
    suppressCounts(obj.data, countKey, dataType, suppressKey, maxValue, 'prams', isBasicSearch);
}

/**
 * Suppression for BRFSS
 * @param obj
 * @param countKey
 * @param suppressKey
 * @param isChartorMapQuery
 */
function applyBRFSSuppression(obj, countKey, suppressKey, isChartorMapQuery, isBasicSearch ) {
    var dataType;
    if(isChartorMapQuery){
        dataType = 'charts';
    }
    suppressCounts(obj.data, countKey, dataType, suppressKey, undefined, 'brfss', isBasicSearch);
}

/**
 * This function is used to suppress the state totals when it reaches to specified value
 * @param stateData
 */
function suppressStateTotals(stateData, key, minVal) {
    stateData.forEach(function (data) {
        if (data[key] < minVal) {
            data[key] = 'suppressed';
        }
    })
}

var sumBucketProperty = function(bucket, key) {
    var sum = 0;
    for(var i = 0; i < bucket.buckets.length; i++) {
        if(bucket.buckets[i][key]) {
            sum += bucket.buckets[i][key].value;
        } else if(bucket.buckets[i].key !== '-9'){
            //recurse with next bucket
            sum += sumBucketProperty(bucket.buckets[i][isValueHasGroupData(bucket.buckets[i])], key);
        }
    }
    return sum;
};

var isValueHasGroupData = function(bucket) {
    for ( var key in bucket ){
        if ( typeof bucket[key] === 'object' && bucket[key].hasOwnProperty('buckets')){
            return key;
        }
    }
    return false;
};

//matches suppressed table totals with corresponding side filter total and replace if necessary
/*var suppressSideFilterTotals = function(sideFilter, data) {
    for(var key in data) {
        if(key !== 'natality' && key !== 'deaths' && key !== 'name' && key !== 'ageAdjustedRate' && key !== 'standardPop' && key !== 'pop') {
            for(var i = 0; i < data[key].length; i++) {
                if(data[key][i].deaths === 'suppressed') {
                    for(var j = 0; j < sideFilter[key].length; j++) {
                        if(sideFilter[key][j].name === data[key][i].name) {
                            sideFilter[key][j].deaths = data[key][i].deaths;
                        }
                    }
                }
                suppressSideFilterTotals(sideFilter, data[key][i]);
            }
        }
    }
};*/

var populateYRBSData = function( results, headers, aggregations) {
    var data = {};
    data[aggregations[0].key] = [];
    var maxQuestion = {
        key: '',
        count: 0
    };
    for(var resultIndex in results) {
        var eachResult = results[resultIndex];
        data[aggregations[0].key] = populateEachYRBSResultData(eachResult._source, headers, aggregations, data[aggregations[0].key], undefined, maxQuestion, undefined);
    }
    return {table: data, maxQuestion: maxQuestion.key} ;
};

var populateEachYRBSResultData = function (eachResult, headers, aggregations, data, finalResultData, maxQuestion, finalPercentData) {
    data = data ? data : [];
    if(aggregations.length > 0) {
        var currentAggregation = aggregations[0];
        var queryKey = currentAggregation.queryKey ? currentAggregation.queryKey : currentAggregation.key;
        var currentAggregationValue = eval('eachResult.' + queryKey);
        if(currentAggregation.isPrimary) {
            for(var headerIndex in headers) {
                var currentHeader = headers[headerIndex];
                currentHeader.getPercent = currentAggregation.getPercent;
                var eachHeaderData = eachResult[currentHeader.key];
                var countData = getYRBSCount(eachHeaderData);
                var percentData = eachHeaderData ? Number(eachHeaderData.percent) : 0;
                percentData = isNaN(percentData) ? 0 : percentData;
                data = populateEachHeaderYRBSResultData(eachResult, headers, aggregations, data, countData, maxQuestion, currentHeader, currentHeader.key, percentData);
            }
        } else {
            data = populateEachHeaderYRBSResultData(eachResult, headers, aggregations, data, finalResultData, maxQuestion, currentAggregation, currentAggregationValue, finalPercentData);
        }
       /* var queryKey = currentAggregation.queryKey ? currentAggregation.queryKey : currentAggregation.key;
        var currentAggregationValue = eachResult[queryKey];
        var dataIndex = findIndexByKeyAndValue(data, 'name', currentAggregationValue);
        if(dataIndex < 0) {
            data.push({
                name: eachResult[queryKey],
                mental_health: currentAggregation.key === 'question' ? getYRBSCount(eachResult) : finalResultData
            });
            dataIndex = 0;
        }
        if(aggregations.length > 1) {
            var nextAggregation = aggregations[1];
            data[dataIndex][nextAggregation.key] = populateAggregatedData(eachResult, headers, aggregations.slice(1), data[dataIndex][nextAggregation.key], finalResultData)
        }*/
    }
    return data;
};

var populateEachHeaderYRBSResultData = function (eachResult, headers, aggregations, data, finalResultData, maxQuestion, currentAggregation, currentAggregationValue, finalPercentData) {
    var dataIndex = findIndexByKeyAndValue(data, 'name', currentAggregationValue);
    if(dataIndex < 0) {
        var mental_healthData;
        if(currentAggregation.getPercent) {
            mental_healthData = finalPercentData;
        } else {
            mental_healthData = currentAggregation.key === 'question' ? getYRBSCount(eachResult) : finalResultData;
        }
        data.push({
            name: currentAggregationValue,
            mental_health: mental_healthData
        });
        if(currentAggregation.key === 'question') {
            var count = Number(eachResult.count);
            if(!isNaN(count) && count > maxQuestion.count) {
                maxQuestion.count = count;
                maxQuestion.key = eachResult.question.key;
            }
        }
        dataIndex = data.length - 1;
    }
    if(aggregations.length > 1) {
        var nextAggregation = aggregations[1];
        data[dataIndex][nextAggregation.key] = populateEachYRBSResultData(eachResult, headers, aggregations.slice(1), data[dataIndex][nextAggregation.key], finalResultData, maxQuestion, finalPercentData)
    }
    return data;
};

var getYRBSCount = function(jsonObject) {
    if(jsonObject) {
        var count = jsonObject.count;
        var countWithCommas = isNaN(Number(count)) ? count : numberWithCommas(Number(count));
        var percent = jsonObject.percent;
        percent = isNaN(Number(percent)) || Number(percent) !== -99 ? percent : 'N/A';
        return percent + "<br/><nobr>(" + jsonObject.lower_confidence + "&#8209;" + jsonObject.upper_confidence + ")</nobr><br/>" + countWithCommas
    }
    return '';
};

//merge age adjust death rates into mortality response
var mergeAgeAdjustedRates = function(mort, rates) {
    var keyMap = {
        'Black': 'Black or African American',
        'American Indian': 'American Indian or Alaska Native',
        'Hispanic': 'Hispanic or Latino',
        'Non-Hispanic': 'Not Hispanic or Latino',
        "AL": "Alabama",
        "AK": "Alaska",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District of Columbia",
        "FL": "Florida",
        "GA": "Georgia",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming",
        "CENS-R1": "Census Region 1: Northeast",
        "CENS-R2": "Census Region 2: Midwest",
        "CENS-R3": "Census Region 3: South",
        "CENS-R4": "Census Region 4: West",
        "CENS-D1": "Division 1: New England",
        "CENS-D2": "Division 2: Middle Atlantic",
        "CENS-D3": "Division 3: East North Central",
        "CENS-D4": "Division 4: West North Central",
        "CENS-D5": "Division 5: South Atlantic",
        "CENS-D6": "Division 6: East South Central",
        "CENS-D7": "Division 7: West South Central",
        "CENS-D8": "Division 8: Mountain",
        "CENS-D9": "Division 9: Pacific",
        "HHS-1": "HHS Region #1  CT, ME, MA, NH, RI, VT",
        "HHS-2": "HHS Region #2  NJ, NY",
        "HHS-3": "HHS Region #3  DE, DC, MD, PA, VA, WV",
        "HHS-4": "HHS Region #4  AL, FL, GA, KY, MS, NC, SC, TN",
        "HHS-5": "HHS Region #5  IL, IN, MI, MN, OH, WI",
        "HHS-6": "HHS Region #6  AR, LA, NM, OK, TX",
        "HHS-7": "HHS Region #7  IA, KS, MO, NE",
        "HHS-8": "HHS Region #8  CO, MT, ND, SD, UT, WY",
        "HHS-9": "HHS Region #9  AZ, CA, HI, NV",
        "HHS-10": "HHS Region #10  AK, ID, OR, WA",
    };
    if(mort && rates) {
        for (var key in mort) {
            if (key !== 'natality' && key !== 'deaths' && key !== 'name' && key !== 'pop' && key !== 'ageAdjustedRate' && key !== 'standardPop') {
                for (var i = 0; i < mort[key].length; i++) {
                    var age = rates[mort[key][i].name];
                    if (!age) {
                        age = rates[keyMap[mort[key][i].name]];
                    }
                    if (age) {
                        if (!age['ageAdjustedRate']) { // Nested result. go to the leaf node recursively
                            if (age['Total']) { // If there is a subtotal, assign subtotal value
                                mort[key][i]['ageAdjustedRate'] = age['Total'].ageAdjustedRate;
                                mort[key][i]['standardPop'] = age['Total'].standardPop;
                            }
                            mergeAgeAdjustedRates(mort[key][i], age);
                        } else {
                            mort[key][i]['ageAdjustedRate'] = age.ageAdjustedRate;
                            mort[key][i]['standardPop'] = age.standardPop;
                        }
                    }
                }
            }
        }
    }
};

var mergeWonderResponseWithInfantESData = function(mort, rates) {
    var keyMap = {
        'Other Asian': 'Other Asian ',
        'Black': 'Black or African American',
        'American Indian': 'American Indian or Alaska Native',
        'Hispanic': 'Hispanic or Latino',
        'Non-Hispanic': 'Not Hispanic or Latino',
        "AL": "Alabama",
        "AK": "Alaska",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District of Columbia",
        "FL": "Florida",
        "GA": "Georgia",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    };

    for(var key in mort) {
        if(key !== 'name') {
            for(var i = 0; i < mort[key].length; i++) {
                var age = rates[mort[key][i].name];
                if(!age) {
                    age = rates[keyMap[mort[key][i].name]];
                }
                if(age) {
                    if (age['infant_mortality'] == undefined) { // Nested result. go to the leaf node recursively
                        if (age['Total']) { // If there is a subtotal, assign subtotal value
                            mort[key][i]['deathRate'] = age['Total'].deathRate;
                            mort[key][i]['pop'] = age['Total'].births;
                            mort[key][i]['infant_mortality'] = isNaN(age['Total'].infant_mortality) ? 0: age['Total'].infant_mortality;
                        }
                        //IF wonder response don't have 'infant_mortality' property and If ES response has it then set this property to 'na'
                        //So we show 'Not Available' in the UI
                        else if(mort[key][i]['infant_mortality']) {
                            mort[key][i]['infant_mortality'] = 'na';
                        }
                        mergeWonderResponseWithInfantESData(mort[key][i], age);
                    }else {
                        mort[key][i]['deathRate'] = age.deathRate;
                        mort[key][i]['pop'] = age.births;
                        mort[key][i]['infant_mortality'] = isNaN(age.infant_mortality) ? 0: age.infant_mortality;
                    }
                }
            }
        }
    }
};


/**
 * Finds and returns the first object in array of objects by using the key and value
 * @param a
 * @param key
 * @param value
 * @returns {*}
 */
var findIndexByKeyAndValue = function (a, key, value) {
    for (var i = 0; i < a.length; i++) {
        if ( a[i][key] && a[i][key] === value ) {return i;}
    }
    return -1;
};

function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * STD, TB and HIV-AIDS filters has different types of All values
 * To show data table data in proper order, we need this list
 * @return Side filters All option values
 */
function getAllOptionValues() {
    return [ "Both sexes", "All races/ethnicities", "All age groups", "National", "No stratification" ];
}

function getSelectedGroupByOptions (filters) {
    return filters.reduce(function (selected, filter) {
        if (!filter.groupBy || filter.key === 'year_of_death') return selected;
        var options = filter.autoCompleteOptions.map(function (option) {
            var newOption = {};
            newOption.key = option.key;
            newOption.title = option.title;
            newOption.filter = filter.key;
            return newOption;
        });
        return selected.concat(options);
    }, []);
}

function getTargetFilter (filters, targetFilterKey) {
  return filters.find(function (filter) {
      return filter.key === targetFilterKey;
  });
}

function getTargetFilterValue (filters, targetFilterKey) {
    var targetFilter = getTargetFilter(filters, targetFilterKey);
    if (!targetFilter) return [];
    if (targetFilter.allChecked) {
        return targetFilter.autoCompleteOptions.map(function (option) {
            return option.key;
        });
    }
    return targetFilter.value
}

function mapAndGroupOptionResults (options, results) {
    // Group results according to option.key
    // As in group all the 'race' results together and all the 'sex' results together
    var mappedOptions = options.map(function (option, index) {
        option.count = results[index].count;
        return option;
    });
    var groupedOptions = mappedOptions.reduce(function (prev, option) {
        if (!prev[option.filter]) prev[option.filter] = [];
        prev[option.filter].push(option);
        return prev;
    }, {});
    return Object.keys(groupedOptions).map(function (key) {
        return groupedOptions[key];
    });
}

/**
 * To get all selected filter options
 * @param q
 * @return all filter options ex: {{'sex':['Female', 'Male']}, {'race':[......]} ... }
 */
function getAllSelectedFilterOptions(q, datasetName) {
    var allOptions = {};
    q.allFilters.forEach(function(eachFilter){
        if(eachFilter.groupBy) {
            allOptions[eachFilter.key] = {"options": []};
            if(['std', 'tb', 'aids'].indexOf(datasetName) > -1) {
                var diseaseDataSetsAllOptions = getAllOptionValues();
                if(eachFilter.value && diseaseDataSetsAllOptions.indexOf(eachFilter.value) === -1){
                    allOptions[eachFilter.key].options.push(eachFilter.value);
                }
                else {
                    eachFilter.autoCompleteOptions.forEach(function(eachOption){
                        !eachOption.disabled && allOptions[eachFilter.key].options.push(eachOption.key);
                    });
                }
            }
            else if(eachFilter.key === 'mcd-chapter-10'){
                if(eachFilter.value.set1.length > 0 || eachFilter.value.set2.length > 0 ){
                    eachFilter.value.set1.forEach(function(eachOption){
                        allOptions[eachFilter.key].options.push(eachOption);
                    });
                    eachFilter.value.set2.forEach(function(eachOption){
                        if(allOptions[eachFilter.key].options.indexOf(eachOption) < 0) {
                            allOptions[eachFilter.key].options.push(eachOption);
                        }
                    });

                }
                else {
                    eachFilter.autoCompleteOptions.forEach(function(eachOption){
                        if(!eachOption.disabled) {
                            allOptions[eachFilter.key].options.push(eachOption.key);
                            if (eachOption.options) {
                                allOptions[eachFilter.key].options = allOptions[eachFilter.key].options.concat(eachOption.options.map(function (opt)  { return opt.key; }));
                            }
                        }
                    });
                }
            }
            else if(eachFilter.key != 'census-region'){
                if(eachFilter.value.length > 0){
                    eachFilter.value.forEach(function(eachOption){
                        allOptions[eachFilter.key].options.push(eachOption);
                    });
                }
                else {
                    eachFilter.autoCompleteOptions.forEach(function(eachOption){
                        if(!eachOption.disabled) {
                            allOptions[eachFilter.key].options.push(eachOption.key);
                            if (eachOption.options) {
                                allOptions[eachFilter.key].options = allOptions[eachFilter.key].options.concat(eachOption.options.map(function (opt)  { return opt.key; }));
                            }
                        }
                    });
                }
            }else{
                var cesregOpts = allOptions['census-region|census_region'] = {"options": []};
                var cesdivOpts = allOptions['census-region|census_division'] = {"options": []};
                if(eachFilter.value.length > 0){
                    eachFilter.value.forEach(function(eachOption){
                        if(eachOption[5] === 'R') { // If the value is region value, add to region list, else to division
                            cesregOpts.options.push(eachOption);
                        }else {
                            cesdivOpts.options.push(eachOption)
                        }
                    });
                }
                else {
                    eachFilter.autoCompleteOptions.forEach(function(eachOption){
                        cesregOpts.options.push(eachOption.key);
                        cesdivOpts.options = cesdivOpts.options.concat(eachOption.options.map(function (o){return o.key;}));
                    });
                }
            }
        }
    });
    return allOptions;
}


/**
 * To get all filter options which are showing totals in side filter section
 * @param q
 * @return Return list of objects. Each object will have key as filter key and value is JSON object with all it's filter options
 */
function getAllFilterOptions(q) {
    var allOptions = {};
    q.allFilters.forEach(function(eachFilter){
        if(['ucd-chapter-10', 'hhs-region', 'mcd-chapter-10'].indexOf(eachFilter.key) === -1) {
            allOptions[eachFilter.key] = {"options": []};
            eachFilter.autoCompleteOptions.forEach(function(eachOption){
                allOptions[eachFilter.key].options.push(eachOption.key);
                if (eachOption.options) {
                    allOptions[eachFilter.key].options = allOptions[eachFilter.key].options.concat(eachOption.options.map(function (opt)  { return opt.key; }));
                }
            });
        }
    });
    return allOptions;
}

function isFilterApplied (filter) {
    var value = Array.isArray(filter.value) ? filter.value.length > 0 : !!filter.value;
    var groupBy = !!filter.groupBy;
    return value || groupBy;
}

function findAllAppliedFilters (allFilters, ignoredFilterKeys) {
    return allFilters.reduce(function (applied, filter) {
        if (ignoredFilterKeys.indexOf(filter.key) !== -1) return applied
        if (isFilterApplied(filter)) return applied.concat(filter.key)
        return applied
    }, [])
}

function hasFilterApplied (allFilters, targets) {
    return allFilters.reduce(function (applied, filter) {
        if (isFilterApplied(filter) && targets.indexOf(filter.key) !== -1) return true
        return applied
    }, false)
}

function recursivelySuppressOptions (tree, countKey, suppressionValue) {
    for (var prop in tree) {
        if (prop === countKey) {
            tree[prop] = suppressionValue;
        } else if (Array.isArray(tree[prop])) {
            tree[prop].forEach(function (node) {
                recursivelySuppressOptions(node, countKey, suppressionValue);
            });
        }

    }
}

function searchTree (root, rule, config, path) {
    var containsRule = rule.every(function (value) {
      return path.indexOf(value) !== -1;
    });
    if (containsRule) recursivelySuppressOptions(root, config.countKey, config.suppressionValue)
    for (var property in root) {
        if (Array.isArray(root[property])) {
            root[property].forEach(function (option) {
                searchTree(option, rule, config, path.concat([option.name]))
            })
        }
    }
}

function createCancerIncidenceSuppressionRules (years, states, stateGroupBy) {
    var rules = [
        [ ['American Indian/Alaska Native'], ['DE','IL','KY','NJ','NY'] ],
        [ ['Asian or Pacific Islander'], ['DE', 'IL', 'KY'] ],
        [ ['Hispanic', 'Non-Hispanic', 'Invalid'], ['DE', 'KY', 'MA'] ]
    ];
    var stateSelectedRules = [];

    if (states.length && !stateGroupBy) {
        var stateRules = {
          AR: [ 'Asian or Pacific Islander', 'Hispanic', 'Non-Hispanic', 'Invalid' ],
          DE: [ 'American Indian/Alaska Native', 'Asian or Pacific Islander', 'Hispanic', 'Non-Hispanic', 'Invalid' ],
          IL: [ 'American Indian/Alaska Native', 'Asian or Pacific Islander' ],
          KY: [ 'American Indian/Alaska Native', 'Asian or Pacific Islander', 'Hispanic', 'Non-Hispanic', 'Invalid' ],
          NJ: [ 'American Indian/Alaska Native' ],
          NY: [ 'American Indian/Alaska Native' ],
          MA: [ 'Hispanic', 'Non-Hispanic', 'Invalid' ]
        }
        stateSelectedRules = states.reduce(function (prev, state) {
            if (stateRules[state] && state !== 'AR') {
              return prev.concat(stateRules[state])
            } else if (state === 'AR' && (years.indexOf('2013') !== -1 || years.indexOf('2014') !== -1)) {
              return prev.concat(stateRules[state])
            }
            return prev
        }, [])
        .reduce(function (unique, option) {
            if (!~unique.indexOf(option)) return unique.concat([[option]]);
            return unique;
        }, [])
    }

    if (years.indexOf('2013') !== -1 || years.indexOf('2014') !== -1) {
        rules.push(
            [ ['Hispanic', 'Non-Hispanic', 'Invalid'], ['AR'] ],
            [ ['Asian or Pacific Islander'], ['AR'] ]
        );
    }

    return rules.reduce(function (acc, rule) {
        return acc.concat(create_rules(rule[0], rule[1]))
    }, [])
    .concat(stateSelectedRules);

    function create_rules (f1options, f2options) {
        return f1options.reduce(function (accu, f1option) {
            return accu.concat(f2options.map(function (f2option) {
                return [f1option, f2option];
            }));
        }, []);
    }
}

function applyCustomSuppressions (data, rules, countKey) {
    rules.forEach(function (rule) {
        searchTree(data.table, rule, { countKey: countKey, suppressionValue: 'suppressed' }, [])
    })
    rules.forEach(function (rule) {
        data.charts.forEach(function (chart) {
            searchTree(chart, rule, { countKey: countKey, suppressionValue: -1 }, []);
        });
    });
}

function applyCustomMapSuppressions (mapData, allFilters) {
    var mapSuppressionIndex = {
      'American Indian/Alaska Native': ['DE','IL','KY','NJ','NY'],
      'Asian or Pacific Islander': ['DE', 'IL', 'KY'],
      'Hispanic': ['DE', 'KY', 'MA'],
      'Non-Hispanic': ['DE', 'KY', 'MA'],
      'Invalid': ['DE', 'KY', 'MA']
    };
    var yearFilter = getTargetFilter(allFilters, 'current_year');
    var isARSuppressionRequired = yearFilter.allChecked || !!~yearFilter.value.indexOf('2013') || !!~yearFilter.value.indexOf('2014');
    var selectedRaceOptions = getTargetFilter(allFilters, 'race').value;
    var selectedHispanicOptions = getTargetFilter(allFilters, 'hispanic_origin').value;
    var mapSuppressionRules = selectedRaceOptions.concat(selectedHispanicOptions)
        .reduce(function (states, option) {
            if (~Object.keys(mapSuppressionIndex).indexOf(option)) {
                states = states.concat(mapSuppressionIndex[option]);
            }
            if (isARSuppressionRequired && ~['American Indian/Alaska Native', 'Hispanic', 'Non-Hispanic', 'Invalid'].indexOf(option)) {
                states = states.concat('AR');
            }
            return states;
        }, [])
        .reduce(function (unique, option) {
            if (!~unique.indexOf(option)) return unique.concat([[option]]);
            return unique;
        }, [])
    mapSuppressionRules.forEach(function (rule) {
        searchTree(mapData, rule, { countKey: 'cancer_incidence', suppressionValue: 'suppressed' }, []);
    });
}

function applyCustomSidebarTotalSuppressions (sidebarTotals, allFilters) {
    var stateSuppressionIndex = {
      DE: [ 'American Indian/Alaska Native', 'Asian or Pacific Islander', 'Hispanic', 'Non-Hispanic', 'Invalid' ],
      IL: [ 'American Indian/Alaska Native', 'Asian or Pacific Islander' ],
      KY: [ 'American Indian/Alaska Native', 'Asian or Pacific Islander', 'Hispanic', 'Non-Hispanic', 'Invalid' ],
      NJ: [ 'American Indian/Alaska Native' ],
      NY: [ 'American Indian/Alaska Native' ],
      MA: [ 'Hispanic', 'Non-Hispanic', 'Invalid' ]
    };
    var yearFilter = getTargetFilter(allFilters, 'current_year');
    var isARSuppressionRequired = yearFilter.allChecked || !!~yearFilter.value.indexOf('2013') || !!~yearFilter.value.indexOf('2014');

    var selectedStateOptions = getTargetFilter(allFilters, 'state').value;
    var selectedRaceOptions = getTargetFilter(allFilters, 'race').value;
    var selectedHispanicOptions = getTargetFilter(allFilters, 'hispanic_origin').value;
    var selectedDemographicFilterOptions = selectedRaceOptions.concat(selectedHispanicOptions);

    var allSidebarOptions = [ 'current_year', 'sex', 'race', 'hispanic_origin', 'age_group' ].reduce(function (allOptions, key) {
        return allOptions.concat(getTargetFilter(allFilters, key).autoCompleteOptions.map(function (autoCompleteOption) {
            return autoCompleteOption.key;
        }));
    }, []);

    var sidebarSuppressionRules = selectedStateOptions
        .reduce(function (options, state) {
            if (~Object.keys(stateSuppressionIndex).indexOf(state)) {
                var selectedSuppressedOption = stateSuppressionIndex[state].some(function (suppressedOption) {
                    return ~selectedDemographicFilterOptions.indexOf(suppressedOption);
                });
                options = options.concat(selectedSuppressedOption ? allSidebarOptions : stateSuppressionIndex[state]);
            }
            if (isARSuppressionRequired && state === 'AR') {
                var arkansasSuppressedOptions = [ 'Asian or Pacific Islander', 'Hispanic', 'Non-Hispanic', 'Invalid' ];
                var selectedSuppressedAROption = arkansasSuppressedOptions.some(function (suppressedOption) {
                    return ~selectedDemographicFilterOptions.indexOf(suppressedOption);
                });
                options = options.concat(selectedSuppressedAROption ? allSidebarOptions : arkansasSuppressedOptions);
            }
            return options;
        }, [])
        .reduce(function (unique, option) {
            if (!~unique.indexOf(option)) return unique.concat([[option]]);
            return unique;
        }, [])
    sidebarSuppressionRules.forEach(function (rule) {
        searchTree(sidebarTotals, rule, { countKey: 'cancer_incidence', suppressionValue: 'suppressed' }, []);
    });
}

function applySidebarCountLimitSuppressions (sidebarTotals, countKey) {
    [ 'sex', 'race', 'hispanic_origin', 'age_group' ].forEach(function (key) {
        sidebarTotals[key].forEach(function (option) {
            option[countKey] = option[countKey] < 16 ? 'suppressed' : option[countKey];
        });
    });
}

function createPopIndex  (tree, popKey) {
    var index = {};
    map_tree(tree, '');
    return index;
    function map_tree (tree, path) {
        if (path && !index[path]) index[path.slice(0, -1)] = tree[popKey];
        for (var prop in tree) {
            if (Array.isArray(tree[prop])) {
                tree[prop].forEach(function (option) {
                    map_tree(option, `${ path }${ prop }.${ option.name }.`);
                });
            }
        }
    }
}

function attachPopulation (root, index, path) {
    if (path) {
        root.pop = Object.keys(index).sort().reduce(function (prev, key) {
            var contains = key.split('.').every(function (prop) {
                return !!~path.split('.').indexOf(prop);
            });
            if (contains) return index[key];
            return prev;
        }, null) || 'n/a';
    }
    for (var property in root) {
        if (Array.isArray(root[property])) {
            root[property].forEach(function (option) {
                attachPopulation(option, index, `${ path }${ property }.${ option.name }.`);
            });
        }
    }
}

function applyPopulationSpecificSuppression (root, countKey) {
    if (root.pop < 50000 && root[countKey]) {
        root[countKey] = 'suppressed';
    }
    for (var property in root) {
        if (Array.isArray(root[property])) {
            root[property].forEach(function (option) {
                applyPopulationSpecificSuppression(option, countKey);
            });
        }
    }
}

/**
 * Rounds the number with specified precision
 * @param number
 * @param precision
 * @returns {number}
 */
function round(number, precision) {
    var multiplier = Math.pow(10, precision || 0);
    var num = Math.round(number * multiplier) / multiplier;
    return num.toFixed(precision);
}

module.exports.populateDataWithMappings = populateDataWithMappings;
module.exports.populateWonderDataWithMappings = populateWonderDataWithMappings;
module.exports.populateYRBSData = populateYRBSData;
module.exports.mergeAgeAdjustedRates = mergeAgeAdjustedRates;
module.exports.mergeWonderResponseWithInfantESData = mergeWonderResponseWithInfantESData;
module.exports.applySuppressions = applySuppressions;
module.exports.applyYRBSSuppressions = applyYRBSSuppressions;
module.exports.applyBRFSSuppression = applyBRFSSuppression;
module.exports.applyPRAMSuppressions = applyPRAMSuppressions;
module.exports.getAllOptionValues = getAllOptionValues;
module.exports.getSelectedGroupByOptions = getSelectedGroupByOptions;
module.exports.getTargetFilter = getTargetFilter;
module.exports.getTargetFilterValue = getTargetFilterValue;
module.exports.mapAndGroupOptionResults = mapAndGroupOptionResults;
module.exports.getAllSelectedFilterOptions = getAllSelectedFilterOptions;
module.exports.getAllFilterOptions = getAllFilterOptions;
module.exports.suppressStateTotals = suppressStateTotals;
module.exports.isFilterApplied = isFilterApplied;
module.exports.findAllAppliedFilters = findAllAppliedFilters;
module.exports.findIndexByKeyAndValue = findIndexByKeyAndValue;
module.exports.hasFilterApplied = hasFilterApplied;
module.exports.recursivelySuppressOptions = recursivelySuppressOptions;
module.exports.searchTree = searchTree;
module.exports.createCancerIncidenceSuppressionRules = createCancerIncidenceSuppressionRules;
module.exports.applyCustomSuppressions = applyCustomSuppressions;
module.exports.applyCustomMapSuppressions = applyCustomMapSuppressions;
module.exports.applyCustomSidebarTotalSuppressions = applyCustomSidebarTotalSuppressions;
module.exports.applySidebarCountLimitSuppressions = applySidebarCountLimitSuppressions;
module.exports.attachPopulation = attachPopulation;
module.exports.createPopIndex = createPopIndex;
module.exports.applyPopulationSpecificSuppression = applyPopulationSpecificSuppression;
module.exports.addMissingFilterOptions = addMissingFilterOptions;
module.exports.round = round;
