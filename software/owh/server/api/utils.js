var Aggregation = require('../models/aggregation');
var merge = require('merge');

var populateDataWithMappings = function(resp, countKey, countQueryKey) {
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
            total: resp.hits.total
        }
    };
    if(resp.aggregations) {
        var data = resp.aggregations;
        Object.keys(data).forEach(function (key) {
            var dataKey = '';
            if (key.indexOf('group_table_') > -1) {
                var groupKeyRegex = /group_table_/;
                dataKey = key.split(groupKeyRegex)[1];
                result.data.nested.table[dataKey] = populateAggregatedData(data[key].buckets, countKey, 1, undefined, countQueryKey, groupKeyRegex);
            }
            if (key.indexOf('group_chart_') > -1) {
                var keySplits = key.split("_");
                var groupKeyRegex = /group_chart_\d_/;
                dataKey = key.split(groupKeyRegex)[1];
                var dataIndex = Number(keySplits[2]);
                var aggData = {};
                aggData[dataKey] = populateAggregatedData(data[key].buckets, countKey, 3, undefined, countQueryKey, groupKeyRegex);
                result.data.nested.charts[dataIndex] = aggData;
            }
            if (key.indexOf('group_maps_') > -1) {
                var keySplits = key.split("_");
                dataKey = keySplits[3];
                var dataIndex = Number(keySplits[2]);
                var aggData = {};
                // console.log("dataIndex: "+JSON.stringify(data[key].buckets));
                aggData[dataKey] = populateAggregatedData(data[key].buckets, countKey, 3, true);
                // console.log("data");
                // console.log(dataIndex);
                // console.log(dataKey);
                result.data.nested.maps[dataKey]= aggData[dataKey];
                // console.log("done");
            } else {
                result.data.simple[key] = populateAggregatedData(data[key].buckets, countKey, undefined, undefined, countQueryKey);
            }
        });
    }
    // console.log(JSON.stringify(result));
    return result;
};

var populateAggregatedData = function(buckets, countKey, splitIndex, map, countQueryKey, regex) {
    var result = [];
    for(var index in buckets) {
        // console.log(buckets[index]);
        //ignoring key -9 for blank data.
        if (buckets[index].key!=='-9') {
            var aggregation = new Aggregation(buckets[index], countKey, countQueryKey);

            aggregation[countKey] = aggregation[countKey];
            var innerObjKey = isValueHasGroupData(buckets[index]);
            // take from pop.value instead of doc_count for census data
            if(countKey === 'pop') {
                aggregation = {name: buckets[index]['key']};
                if(buckets[index]['pop']) {
                    aggregation[countKey] = buckets[index]['pop'].value;
                } else {
                    aggregation[countKey] = sumBucketProperty(buckets[index][innerObjKey], 'pop');

                }
            }
            if(countKey === 'bridge_race') {
                aggregation = {name: buckets[index]['key']};
                if(buckets[index]['group_count_pop']) {
                    aggregation[countKey] = buckets[index]['group_count_pop'].value;
                } else {
                    aggregation[countKey] = sumBucketProperty(buckets[index][innerObjKey], 'group_count_pop');
                }
            }
            if( innerObjKey ) {
                //if you want to split group key by regex
                if (regex && (regex.test('group_table_') || regex.test('group_chart_'))) {
                    aggregation[innerObjKey.split(regex)[1]] =  populateAggregatedData(buckets[index][innerObjKey].buckets,
                        countKey, splitIndex, map, countQueryKey, regex);
                } else {//by default split group key by underscore and retrieve key based on index
                    //adding slice and join because some keys are delimited by underscore so need to be reconstructed
                    aggregation[innerObjKey.split("_").slice(splitIndex).join('_')] =  populateAggregatedData(buckets[index][innerObjKey].buckets, countKey, splitIndex, map, countQueryKey);
                }

            }

            result.push(aggregation);
        }
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
function suppressCounts (obj, countKey, dataType, suppressKey, maxValue) {
    var key = suppressKey ? suppressKey : countKey;
    var value = maxValue ? maxValue : 10;
    for (var property in obj) {
        if (property === 'name') {
            continue;
        }
        //keep the track of data types
        if (['table', 'charts', 'maps'].indexOf(property) != -1) {
            dataType = property;
        }

        if (obj[property].constructor === Object) {
            suppressCounts(obj[property], countKey, dataType, suppressKey, maxValue);
        } else if (obj[property].constructor === Array) {
            obj[property].forEach(function(arrObj) {
                suppressCounts(arrObj, countKey, dataType, suppressKey, maxValue);
            });
        } else if(obj[countKey] != undefined && obj[countKey] < value) {
            if(dataType == 'maps' || dataType == 'charts') {//for chart and map set suppressed values to 0
                obj[countKey] = 0;
            }
            else if(countKey === 'std' && obj[countKey] === 0) {
                obj[countKey] = 'na';
            }
            else {//for table data set to suppressed
                obj[key] = 'suppressed';
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
                    if(dataType == 'maps' || dataType == 'charts') {//for chart and map set suppressed values to 0
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
function applyYRBSSuppressions(obj, countKey, suppressKey, isSexFiltersSelected ) {
    var dataType;
    var maxValue = isSexFiltersSelected ? 30 : 100;
    suppressCounts(obj.data, countKey, dataType, suppressKey, maxValue);
    suppressTotalCounts(obj.data, countKey, dataType, suppressKey);
};
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
        "WY": "Wyoming"
    };

    for(var key in mort) {
        if(key !== 'natality' && key !== 'deaths' && key !== 'name' && key !== 'pop' && key !== 'ageAdjustedRate' && key !== 'standardPop') {
            for(var i = 0; i < mort[key].length; i++) {
                var age = rates[mort[key][i].name];
                if(!age) {
                    age = rates[keyMap[mort[key][i].name]];
                }
                if(age) {
                    if (!age['ageAdjustedRate']) { // Nested result. go to the leaf node recursively
                        if (age['Total']) { // If there is a subtotal, assign subtotal value
                            mort[key][i]['ageAdjustedRate'] = age['Total'].ageAdjustedRate;
                            mort[key][i]['standardPop'] = age['Total'].standardPop;
                        }
                        mergeAgeAdjustedRates(mort[key][i], age);
                    }else {
                        mort[key][i]['ageAdjustedRate'] = age.ageAdjustedRate;
                        mort[key][i]['standardPop'] = age.standardPop;
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
    return [ "Both sexes", "All races/ethnicities", "All age groups", "National" ];
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

function getYearFilter (filters) {
    var yearFilter = filters.find(function (filter) {
        return filter.key === 'year_of_death'
    });
    if (!yearFilter) return [];
    if (yearFilter.allChecked) {
        return yearFilter.autoCompleteOptions.map(function (option) {
            return option.key;
        });
    }
    return yearFilter.value
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

module.exports.populateDataWithMappings = populateDataWithMappings;
module.exports.populateYRBSData = populateYRBSData;
module.exports.mergeAgeAdjustedRates = mergeAgeAdjustedRates;
module.exports.applySuppressions = applySuppressions;
module.exports.applyYRBSSuppressions = applyYRBSSuppressions;
module.exports.getAllOptionValues = getAllOptionValues;
module.exports.getSelectedGroupByOptions = getSelectedGroupByOptions;
module.exports.getYearFilter = getYearFilter;
module.exports.mapAndGroupOptionResults = mapAndGroupOptionResults;
