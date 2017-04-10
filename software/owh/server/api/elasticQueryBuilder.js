const util = require('util');
var merge = require('merge');

var prepareCensusAggregationQuery = function(aggregations) {
    var censusQuery = { size: 0};
    censusQuery.aggregations = {};
    if (aggregations['nested']) {
        if (aggregations['nested']['table'] && aggregations['nested']['table'].length > 0) {
            censusQuery.aggregations = merge(censusQuery.aggregations, generateNestedCensusAggQuery(aggregations['nested']['table'], 'group_table_'));
        }
    }
    return censusQuery;
};

var generateNestedCensusAggQuery = function(aggregations, groupByKeyStart) {
    var aggQuery = generateCensusAggregationQuery(aggregations[0], groupByKeyStart);
    if(aggregations.length > 1) {
        aggQuery[Object.keys(aggQuery)[0]].aggregations = generateNestedCensusAggQuery(aggregations.slice(1), groupByKeyStart);
    }else{
        aggQuery[Object.keys(aggQuery)[0]].aggregations = {
            "pop": {
                "sum": {
                    "field": "pop"
                }
            }
        };
    }
    return aggQuery;
};

var generateCensusAggregationQuery = function( aggQuery, groupByKeyStart ) {
    groupByKeyStart = groupByKeyStart ? groupByKeyStart : '';
    var query = {};
    query[ groupByKeyStart + aggQuery.key] = {
        "terms": {
            "field": aggQuery.queryKey,
            "size": aggQuery.size
        }
    };
    return query;
};

var prepareAggregationQuery = function(aggregations, countQueryKey) {
    var elasticQuery = {};
    elasticQuery.aggregations = {};
    //build array for
    if(aggregations['simple']) {
        for (var i = 0; i < aggregations['simple'].length; i++) {
            elasticQuery.aggregations = merge(elasticQuery.aggregations, generateAggregationQuery(aggregations['simple'][i], undefined, countQueryKey));
        }
    }
    if (aggregations['nested']) {
        if (aggregations['nested']['table'] && aggregations['nested']['table'].length > 0) {
            elasticQuery.aggregations = merge(elasticQuery.aggregations, generateNestedAggQuery(aggregations['nested']['table'], 'group_table_', countQueryKey));
        }
        if (aggregations['nested']['charts']) {
            for(var index in aggregations['nested']['charts']) {
                elasticQuery.aggregations = merge(elasticQuery.aggregations, generateNestedAggQuery(aggregations['nested']['charts'][index], 'group_chart_' + index + '_', countQueryKey));
            }
        }
        if (aggregations['nested']['maps']) {
            for(var index in aggregations['nested']['maps']) {
                elasticQuery.aggregations = merge(elasticQuery.aggregations, generateNestedAggQuery(aggregations['nested']['maps'][index], 'group_maps_' + index + '_', countQueryKey, true));
            }
        }
    }
    console.log(JSON.stringify(elasticQuery));
    return elasticQuery;
};

var generateNestedAggQuery = function(aggregations, groupByKeyStart, countQueryKey) {
    var aggQuery = generateAggregationQuery(aggregations[0], groupByKeyStart, countQueryKey);
    if(aggregations.length > 1) {
        aggQuery[Object.keys(aggQuery)[0]].aggregations = generateNestedAggQuery(aggregations.slice(1), groupByKeyStart, countQueryKey);
    }
    return aggQuery;
};

var generateAggregationQuery = function( aggQuery, groupByKeyStart, countQueryKey ) {
    groupByKeyStart = groupByKeyStart ? groupByKeyStart : '';
    var query = {};

    //for bridge race sex data
    if(countQueryKey == 'pop') {
        query[ groupByKeyStart + aggQuery.key] = getTermQuery(aggQuery);
        query[ groupByKeyStart + aggQuery.key].aggregations=getPopulationSumQuery();
        merge(query, getPopulationSumQuery());
    } else {//for yrbs and mortality
        query[ groupByKeyStart + aggQuery.key] = getTermQuery(aggQuery);
    }
    return query;
};

/**
 * Preapare term query
 * @param aggQuery
 * @returns {{terms: {field: *, size: *}}}
 */
function getTermQuery(aggQuery) {
    return {
        "terms": {
            "field": aggQuery.queryKey,
            "size": aggQuery.size
        }
    }
}

/**
 * prepare population sum query
 * @returns {{group_count_pop: {sum: {field: string}}}}
 */
function getPopulationSumQuery() {
    return {
        "group_count_pop": {
            "sum": {
                "field": "pop"
            }
        }
    }
}

/**
 * Builds a search query
 * @param params
 * @param isAggregation
 * @returns {{}}
 */
var buildSearchQuery = function(params, isAggregation) {
    var userQuery = params.query ? params.query : {};
    var elasticQuery = {};
    var censusQuery = undefined;
    if ( isAggregation ){
        elasticQuery.size = 0;
        elasticQuery = merge(elasticQuery, prepareAggregationQuery(params.aggregations, params.countQueryKey));
        if(params.aggregations['nested'] && params.aggregations['nested']['table']){
            censusQuery = prepareCensusAggregationQuery(params.aggregations);
        }

    } else {
        elasticQuery.from = params.pagination.from;
        elasticQuery.size = params.pagination.size;
    }
    elasticQuery.query = {};
    elasticQuery.query.filtered = {};
    //build top level bool queries
    var primaryQuery = buildTopLevelBoolQuery(groupByPrimary(userQuery, true), true);
    var filterQuery = buildTopLevelBoolQuery(groupByPrimary(userQuery, false), false);
    //check if primary query is empty
    elasticQuery.query.filtered.query = primaryQuery;
    elasticQuery.query.filtered.filter = filterQuery;
    if(censusQuery) {
        censusQuery.query = {};
        censusQuery.query.filtered = {};

        censusQuery.query.filtered.query = primaryQuery;
        censusQuery.query.filtered.filter = filterQuery;
    }
    return [elasticQuery, censusQuery];
};

//build top-level bool query
var buildTopLevelBoolQuery = function(filters, isQuery) {
    var topLevelBoolQuery = {
        bool: {
            must: []
        }
    };
    for (var i=0 in filters) { //primary filters
        var path = filters[i].queryKey;
        var boolQuery = buildBoolQuery(path, filters[i].value, isQuery, filters[i].caseChange, filters[i].dataType);
        if(!isEmptyObject(boolQuery)) {
            topLevelBoolQuery.bool.must.push(boolQuery);
        }
    }
    return topLevelBoolQuery;
};

var buildBoolQuery = function(path, value, isQuery, isCaseChange, dataType) {
    var boolQuery = {};
    boolQuery.bool = {};
    //if(value)
    if (path && path !== "" ){
        if (util.isArray(path)){
            for (var i=0 in path) {
                if (dataType === 'date'){
                    boolQuery.bool['should'] = buildDateQuery(path[i], value)
                } else if(isQuery) {
                    boolQuery.bool['should'] = buildMatchQuery(path[i], value, isCaseChange)
                } else {
                    boolQuery.bool['should'] = buildTermQuery(path[i], value, isCaseChange)
                }
            }
        } else if(typeof path === 'string') {
            if (dataType === 'date'){
                boolQuery.bool['should'] = buildDateQuery(path, value, isCaseChange)
            } else if (isQuery){
                boolQuery.bool['should'] = buildMatchQuery(path, value, isCaseChange)
            } else {
                boolQuery.bool['should'] = buildTermQuery(path, value, isCaseChange)
            }
        }
    }
    return boolQuery;
};

var buildMatchQuery = function(path, value, isCaseChange) {
    var matchQuery = [];
    if (util.isArray(value)) {
        for (var i=0 in value) {
            var eachMatchQuery = {match: {}};
            eachMatchQuery.match[path] = isCaseChange ? value[i].toLowerCase() : value[i] ;
            matchQuery.push(eachMatchQuery);
        }
    } else {
        var eachMatchQuery = {match: {}};
        eachMatchQuery.match[path] =  isCaseChange ?  value.toLowerCase() : value ;
        matchQuery.push(eachMatchQuery);
    }
    return matchQuery;
};

var buildTermQuery = function(path, value, isCaseChange) {
    var termQuery = [];
    if (util.isArray(value)) {
        for (var i=0 in value) {
            var eachMatchQuery = {term: {}};
            eachMatchQuery.term[path] = isCaseChange ? value[i].toLowerCase() : value[i] ;
            termQuery.push(eachMatchQuery);
        }
    } else {
        var eachMatchQuery = {term: {}};
        eachMatchQuery.term[path] = isCaseChange ? value.toLowerCase() : value ;
        termQuery.push(eachMatchQuery);
    }
    return termQuery;
};

var buildDateQuery = function(path, value, isCaseChange) {
    var termQuery = [];
    if (!util.isObject(value)) {
        value = {
            from: value,
            to: value
        };
    }

    var eachMatchQuery = {range: {}};
    eachMatchQuery.range[path] = {
        gte: value.from,
        lte: value.to ? value.to : 'now'
    };
    termQuery.push(eachMatchQuery);

    return termQuery;
};

var groupByPrimary = function(filterQuery, primaryValue) {
    var filters = [];
    for (var key in filterQuery) {
        if (filterQuery[key].primary === primaryValue) {
            filters.push(filterQuery[key])
        }
    }
    return filters;
};


var isEmptyObject = function(obj) {
    return !Object.keys(obj).length;
};


/**
 * Find the filter in array by key and value
 * @param a
 * @param key
 * @param value
 * @returns {*}
 */
function findFilterByKeyAndValue(a, key, value) {
    if (a) {
        for (var i = 0; i < a.length; i++) {
            var filter = a[i].filters;
            if ( filter[key] && filter[key] === value ) {return a[i];}
        }
    }
    return null;
}

/**
 * Finds if the specified filter is applied or not
 * @param a
 * @param key
 * @param value
 * @returns {*}
 */
function isFilterApplied(a) {
    if (a && a.filters) {
        return a.filters.value.length > 0;
    }
    return false;
}

/**
 * Finds and returns all objects in array of objects that not contains the key and value
 * @param a
 * @param key
 * @param value
 * @returns {Array}
 */
function findAllNotContainsKeyAndValue(a, key, value) {
    var result = [];
    for (var i = 0; i < a.length; i++) {
        if (a[i][key] !== value) {
            result.push(a[i]);
        }
    }
    return result;
}

/**
 * get the array with key
 * @param data
 * @param key
 * @param includeKey
 * @param includeValue
 * @returns {Array}
 */
function getValuesByKeyIncludingKeyAndValue(data, key, includeKey, includeValue) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
        if(data[i][includeKey] === includeValue) {
            values.push(data[i][key]);
        }
    }
    return values;
}

/**
 * get the array with key
 * @param data
 * @param key
 * @returns {Array}
 */
function getValuesByKeyExcludingKeyAndValue(data, key, excludeKey, excludeValue) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
        if(data[i][excludeKey] != excludeValue) {
            values.push(data[i][key]);
        }
    }
    return values;
}


function buildAPIQuery(primaryFilter) {
   var apiQuery = {
        searchFor: primaryFilter.key,
        countQueryKey: primaryFilter.countQueryKey,
        query: {},
        aggregations: {
            simple: [],
            nested: {
                table: [],
                charts: [],
                maps:[]
            }
        }
    };
    //var defaultAggregations = [];
    var rowAggregations = [];
    var columnAggregations = [];
    var headers = {
        rowHeaders: [],
        columnHeaders: [],
        chartHeaders: []
    };
    if(primaryFilter.searchFor) {
        apiQuery = primaryFilter;
    }

    // For YRBS query capture the basisc/advanced search view
    if(primaryFilter.key === 'mental_health' && primaryFilter.showBasicSearchSideMenu) {
        apiQuery.yrbsBasic =  true;
    }
    var sortedFilters = sortByKey(clone(primaryFilter.allFilters), getAutoCompleteOptionsLength);
    sortedFilters.forEach  (function(eachFilter) {
        if(eachFilter.groupBy) {
            var eachGroupQuery = getGroupQuery(eachFilter);
            if ( eachFilter.groupBy === 'row' ) {
                //user defined aggregations for rendering table
                rowAggregations.push(eachGroupQuery);
                headers.rowHeaders.push(eachFilter);
            } else if( eachFilter.groupBy === 'column' ) {
                columnAggregations.push(eachGroupQuery);
                headers.columnHeaders.push(eachFilter);
            }
        }
        var eachFilterQuery = buildFilterQuery(eachFilter);
        if(eachFilterQuery) {
            apiQuery.query[eachFilter.queryKey] = eachFilterQuery;
        }
    });
    primaryFilter.sideFilters.forEach(function(filter) {
       if(filter.filters.key === 'topic') {
           apiQuery.query['question.path'].value = filter.filters.questions;
       }
    });
    apiQuery.aggregations.nested.table = rowAggregations.concat(columnAggregations);
    var result = prepareChartAggregations(headers.rowHeaders.concat(headers.columnHeaders), apiQuery.searchFor);
    headers.chartHeaders = result.chartHeaders;
    apiQuery.aggregations.nested.charts = result.chartAggregations;
    apiQuery.aggregations.nested.maps = prepareMapAggregations();
    //apiQuery.aggregations.nested = apiQuery.aggregations.nested.concat(defaultAggregations);
    //headers = headers.concat(defaultHeaders);
    return {
        apiQuery: apiQuery,
        headers: headers
    };
}

function clone(a) {
    return JSON.parse(JSON.stringify(a));
}

function sortByKey(array, key, asc) {
    return array.sort(function(a, b) {
        var x = typeof(key) === 'function' ? key(a) : a[key];
        var y = typeof(key) === 'function' ? key(b) : b[key];
        if(asc===undefined || asc === true) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }else {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

var getGroupQuery = function (filter){
    var groupQuery = {
        key: filter.key,
        queryKey: filter.aggregationKey ? filter.aggregationKey : filter.queryKey,
        getPercent: filter.getPercent,
        size: 0
    };
    return groupQuery;
}

function buildFilterQuery(filter) {
    if(filter.key === 'question' && filter.value.length == 0){
        filter.value = [];
        filter.autoCompleteOptions.forEach( function(q) {
            if(q.qkey.startsWith('qn')) {
                filter.value.push(q.qkey);
            }
        });
        return getFilterQuery(filter);
    }
    else if( isValueNotEmpty(filter.value) && (!util.isArray(filter.value) || filter.value.length !== getAutoCompleteOptionsLength(filter))) {
        return getFilterQuery(filter);
    }
    return false;
}

function getFilterQuery(filter) {
    return {
        key: filter.key,
        queryKey: filter.aggregationKey ? filter.aggregationKey : filter.queryKey,
        value: filter.value,
        primary: filter.primary
    };
}

function isValueNotEmpty(value) {
    return typeof value != 'undefined' && value !== null && !isEmptyObject(value) &&
        (!typeof value === 'String' || value != '');
}

function getAutoCompleteOptionsLength(filter) {
    //get length when options are nested
    var length = filter.autoCompleteOptions ? filter.autoCompleteOptions.length : 0;
    if(filter.autoCompleteOptions) {
        filter.autoCompleteOptions.forEach(function(option) {
            if(option.options) {
                //if value has group option, then don't subtract from calculated length
                if(filter.value.indexOf(option.key) < 0) {
                    length--;
                }
                length += option.options.length;
            }
        });
    }
    return length;
}

function prepareChartAggregations(headers, countKey) {
    var chartHeaders = [];
    var chartAggregations = [];
    headers.forEach( function(eachPrimaryHeader) {
        var primaryGroupQuery = getGroupQuery(eachPrimaryHeader, countKey);
        headers.forEach( function(eachSecondaryHeader) {
            var chartType = chartMappings[eachPrimaryHeader.key + '&' + eachSecondaryHeader.key];
            if(chartType) {
                var secondaryGroupQuery = getGroupQuery(eachSecondaryHeader, countKey);
                chartHeaders.push({headers: [eachPrimaryHeader, eachSecondaryHeader], chartType: chartType});
                chartAggregations.push([primaryGroupQuery, secondaryGroupQuery]);
            }
        });
    });
    return {
        chartHeaders: chartHeaders,
        chartAggregations: chartAggregations
    }
}

/**
 * To calculate Fertility Rates, Filter census rates query with
 * Age filter (15 to 44 years) and Gender (Female)
 * If user don't select any option for Age group related filters in Natality - Fertility Rates page, then Fertility Rates calculation consider
 * all female with age 15 to 44 years population
 * @param topLevelQuery
 * @returns {*}
 */
function addFiltersToCalcFertilityRates(topLevelQuery) {

    var query = topLevelQuery.query.filtered.filter;
    var queryString = JSON.stringify(query);
    //if(['mother_age', 'mother_age_r14', 'mother_age_r8', 'mother_age_r9'].indexOf(queryString) < 0) {
    if(queryString.indexOf('mother_age') < 0 && queryString.indexOf('mother_age_r14') < 0 && queryString.indexOf('mother_age_r8') < 0 && queryString.indexOf('mother_age_r9') < 0 ) {
        var ageValues = ["15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "37", "38", "39", "40", "41", "42", "43", "44"];
        var ageQuery = buildBoolQuery("age", ageValues, false);
        if(!isEmptyObject(ageQuery)) {
            query.bool.must.push(ageQuery);
        }
    }
    var sexQuery = buildBoolQuery("sex", 'Female', false);
    if(!isEmptyObject(sexQuery)) {
        query.bool.must.push(sexQuery);
    }
    topLevelQuery.query.filtered.filter = query;
    return topLevelQuery;
}

var chartMappings = {
    "gender&race": "horizontalStack",
    "race&agegroup": "verticalStack",
    "gender&agegroup":	"horizontalBar",
    "race&hispanicOrigin": "horizontalStack",
    "gender&hispanicOrigin": "verticalBar",
    "agegroup&hispanicOrigin": "verticalStack",
    "race&autopsy": "verticalStack",
    "gender&autopsy": "verticalBar",
    "agegroup&autopsy": "horizontalBar",
    "gender&placeofdeath": "verticalStack",
    "sex&race": "verticalBar",
    "sex&ethnicity": "verticalBar",
    "sex&agegroup": "horizontalStack",
    "sex&state": "verticalBar",
    "sex&region": "verticalBar",
    "race&ethnicity": "horizontalBar",
    "race&agegroup": "horizontalBar",
    "race&state": "horizontalStack",
    "race&region": "verticalBar",
    "ethnicity&agegroup": "horizontalBar",
    "ethnicity&state": "horizontalStack",
    "ethnicity&region": "verticalBar",
    "agegroup&region": "verticalBar",
    "current_year&sex":"horizontalBar",
    "current_year&race":"horizontalBar",
    "current_year&ethnicity":"horizontalBar",
    "current_year&agegroup":"horizontalBar",
    "current_year&state":"horizontalBar",
    "current_year&region":"verticalBar",
    //natality
    "hispanic_origin&race": "horizontalBar",
    "sex&race": "horizontalBar",
    "hispanic_origin&marital_status": "horizontalBar",
    "race&marital_status": "horizontalBar",
    "race&mother_age": "horizontalBar",
    "hispanic_origin&mother_age": "horizontalBar",
    "marital_status&mother_age": "horizontalBar",
    "race&mother_education": "horizontalBar",
    "hispanic_origin&mother_education": "horizontalBar",
    "marital_status&mother_education": "horizontalBar",
    "mother_age&mother_education": "horizontalBar",
    "current_year&marital_status": "horizontalBar",
    "current_year&hispanic_origin": "horizontalBar",
    "current_year&race": "horizontalBar",
    "current_year&mother_age": "horizontalBar",
    "current_year&mother_education": "horizontalBar",
    "hispanic_origin&month": "horizontalBar",
    "race&month": "horizontalBar",
    "marital_statuc&month": "horizontalStack",
    "mother_age&month": "horizontalStack",
    "mother_education&month": "horizontalStack",
    "current_year&month": "horizontalBar",
    "hispanic_origin&weekday": "horizontalStack",
    "race&weekday": "horizontalStack",
    "marital_status&weekday": "horizontalStack",
    "mother_age&weekday": "horizontalStack",
    "mother_education&weekday": "horizontalStack",
    "current_year&weekday": "horizontalStack",
    "month&weekday": "horizontalStack",
    "sex&hispanic_origin": "horizontalStack",
    "sex&marital_status": "horizontalBar",
    "sex&mother_age": "horizontalBar",
    "sex&mother_education": "horizontalBar",
    "current_year&sex": "horizontalBar",
    "sex&month": "horizontalBar",
    "sex&weekday": "horizontalBar",
    //insert gestation age here
    "hispanic_origin&prenatal_care": "lineChart",
    "race&prenatal_care": "horizontalBar",
    "marital_status&prenatal_care": "horizontalBar",
    "mother_age&prenatal_care": "horizontalBar",
    "mother_education&prenatal_care": "horizontalBar",
    "current_year&prenatal_care": "horizontalBar",
    "month&prenatal_care": "horizontalBar",
    "weekday&prenatal_care": "horizontalBar",
    "sex&prenatal_care": "horizontalBar",

    "hispanic_origin&birth_weight": "horizontalStack",
    "race&birth_weight": "horizontalStack",
    "marital_status&birth_weight": "horizontalStack",
    "mother_age&birth_weight": "horizontalStack",
    "mother_education&birth_weight": "horizontalStack",
    "current_year&birth_weight": "horizontalStack",
    "month&birth_weight": "horizontalStack",
    "weekday&birth_weight": "horizontalStack",
    "sex&birth_weight": "horizontalStack",
    "prenatal_care&birth_weight": "horizontalStack",

    "hispanic_origin&birth_plurality": "horizontalStack",
    "race&birth_plurality": "horizontalStack",
    "marital_status&birth_plurality": "horizontalStack",
    "mother_age&birth_plurality": "horizontalStack",
    "mother_education&birth_plurality": "horizontalStack",
    "current_year&birth_plurality": "horizontalStack",
    "month&birth_plurality": "horizontalStack",
    "weekday&birth_plurality": "horizontalStack",
    "sex&birth_plurality": "horizontalStack",
    "prenatal_care&birth_plurality": "horizontalStack",
    "birth_weight&birth_plurality": "horizontalStack",

    "hispanic_origin&live_birth": "horizontalStack",
    "race&live_birth": "horizontalStack",
    "marital_status&live_birth": "horizontalStack",
    "mother_age&live_birth": "horizontalStack",
    "mother_education&live_birth": "horizontalStack",
    "current_year&live_birth": "horizontalStack",
    "month&live_birth": "horizontalStack",
    "weekday&live_birth": "horizontalStack",
    "sex&live_birth": "horizontalStack",
    "prenatal_care&live_birth": "horizontalStack",
    "birth_weight&live_birth": "horizontalStack",
    "birth_plurality&live_birth": "horizontalStack",

    "hispanic_origin&birth_place": "horizontalStack",
    "race&birth_place": "horizontalStack",
    "marital_status&birth_place": "horizontalStack",
    "mother_age&birth_place": "horizontalStack",
    "mother_education&birth_place": "horizontalStack",
    "current_year&birth_place": "horizontalStack",
    "month&birth_place": "horizontalStack",
    "weekday&birth_place": "horizontalStack",
    "sex&birth_place": "horizontalStack",
    "prenatal_care&birth_place": "horizontalStack",
    "birth_weight&birth_place": "horizontalStack",
    "birth_plurality&birth_place": "horizontalStack",
    "live_birth&birth_place": "horizontalStack",

    "hispanic_origin&delivery_method": "horizontalStack",
    "race&delivery_method": "horizontalStack",
    "marital_status&delivery_method": "horizontalStack",
    "mother_age&delivery_method": "horizontalStack",
    "mother_education&delivery_method": "horizontalStack",
    "current_year&delivery_method": "horizontalStack",
    "month&delivery_method": "horizontalStack",
    "weekday&delivery_method": "horizontalStack",
    "sex&delivery_method": "horizontalStack",
    "prenatal_care&delivery_method": "horizontalStack",
    "birth_weight&delivery_method": "horizontalStack",
    "birth_plurality&delivery_method": "horizontalStack",
    "birth_place&delivery_method": "horizontalStack",

    "hispanic_origin&medical_attendant": "horizontalStack",
    "race&medical_attendant": "horizontalStack",
    "marital_status&medical_attendant": "horizontalStack",
    "mother_age&medical_attendant": "horizontalStack",
    "mother_education&medical_attendant": "horizontalStack",
    "current_year&medical_attendant": "horizontalStack",
    "month&medical_attendant": "horizontalStack",
    "weekday&medical_attendant": "horizontalStack",
    "sex&medical_attendant": "horizontalStack",
    "prenatal_care&medical_attendant": "horizontalStack",
    "birth_weight&medical_attendant": "horizontalStack",
    "birth_plurality&medical_attendant": "horizontalStack",
    "birth_place&medical_attendant": "horizontalStack",
    "delivery_method&medical_attendant": "horizontalStack",

    "hispanic_origin&chronic_hypertension": "horizontalStack",
    "race&chronic_hypertension": "horizontalStack",
    "marital_status&chronic_hypertension": "horizontalStack",
    "mother_age&chronic_hypertension": "horizontalStack",
    "mother_education&chronic_hypertension": "horizontalStack",
    "current_year&chronic_hypertension": "horizontalStack",
    "month&chronic_hypertension": "horizontalStack",
    "weekday&chronic_hypertension": "horizontalStack",
    "sex&chronic_hypertension": "horizontalStack",
    "prenatal_care&chronic_hypertension": "horizontalStack",
    "birth_weight&chronic_hypertension": "horizontalStack",
    "birth_plurality&chronic_hypertension": "horizontalStack",
    "birth_place&chronic_hypertension": "verticalStack",
    "delivery_method&chronic_hypertension": "horizontalStack",
    "medical_attendant&chronic_hypertension": "horizontalStack",

    "hispanic_origin&diabetes": "horizontalStack",
    "race&diabetes": "horizontalStack",
    "marital_status&diabetes": "horizontalStack",
    "mother_age&diabetes": "horizontalStack",
    "mother_education&diabetes": "horizontalStack",
    "current_year&diabetes": "horizontalStack",
    "month&diabetes": "horizontalStack",
    "weekday&diabetes": "horizontalStack",
    "sex&diabetes": "horizontalStack",
    "prenatal_care&diabetes": "horizontalStack",
    "birth_weight&diabetes": "horizontalStack",
    "birth_plurality&diabetes": "horizontalStack",
    "birth_place&diabetes": "horizontalStack",
    "delivery_method&diabetes": "horizontalStack",
    "medical_attendant&diabetes": "horizontalStack",
    "chronic_hypertension&diabetes": "horizontalStack",

    "hispanic_origin&eclampsia": "horizontalStack",
    "race&eclampsia": "horizontalStack",
    "marital_status&eclampsia": "horizontalStack",
    "mother_age&eclampsia": "horizontalStack",
    "mother_education&eclampsia": "horizontalStack",
    "current_year&eclampsia": "horizontalStack",
    "month&eclampsia": "horizontalStack",
    "weekday&eclampsia": "horizontalStack",
    "sex&eclampsia": "horizontalStack",
    "prenatal_care&eclampsia": "horizontalStack",
    "birth_weight&eclampsia": "horizontalStack",
    "birth_plurality&eclampsia": "horizontalStack",
    "birth_place&eclampsia": "horizontalStack",
    "delivery_method&eclampsia": "horizontalStack",
    "medical_attendant&eclampsia": "horizontalStack",
    "chronic_hypertension&eclampsia": "horizontalStack",
    "diabetes&eclampsia": "horizontalStack",

    "hispanic_origin&tobacco_use": "horizontalStack",
    "race&tobacco_use": "horizontalStack",
    "marital_status&tobacco_use": "horizontalStack",
    "mother_age&tobacco_use": "horizontalStack",
    "mother_education&tobacco_use": "horizontalStack",
    "current_year&tobacco_use": "horizontalStack",
    "month&tobacco_use": "horizontalStack",
    "weekday&tobacco_use": "horizontalStack",
    "sex&tobacco_use": "horizontalStack",
    "prenatal_care&tobacco_use": "horizontalStack",
    "birth_weight&tobacco_use": "horizontalStack",
    "birth_plurality&tobacco_use": "horizontalStack",
    "birth_place&tobacco_use": "horizontalStack",
    "delivery_method&tobacco_use": "horizontalStack",
    "medical_attendant&tobacco_use": "horizontalStack",
    "chronic_hypertension&tobacco_use": "horizontalStack",
    "diabetes&tobacco_use": "horizontalStack",
    "eclampsia&tobacco_use": "horizontalStack"
};

var prepareMapAggregations = function() {
    var chartAggregations = [];
    var primaryGroupQuery = {
        key: "states",
        queryKey: "state",
        size: 0
    };
    var secondaryGroupQuery = {
        key: "sex",
        queryKey: "sex",
        size: 0
    };
    chartAggregations.push([primaryGroupQuery, secondaryGroupQuery]);
    return chartAggregations;
}

function addCountsToAutoCompleteOptions(primaryFilter) {
   var apiQuery = {
        searchFor: primaryFilter.key,
        aggregations: { simple: [] }
    };
    var filters = [];
    primaryFilter.sideFilters.forEach(function(eachSideFilter) {
        filters = filters.concat(eachSideFilter.filterGroup ? eachSideFilter.filters : [eachSideFilter.filters]);
    });
     filters.forEach(function(eachFilter) {
        apiQuery.aggregations.simple.push(getGroupQuery(eachFilter));
     });
    //if(query) {
        var filterQuery = buildAPIQuery(primaryFilter).apiQuery.query;
        apiQuery.query = filterQuery;
    //}
    return apiQuery;
}

module.exports.prepareAggregationQuery = prepareAggregationQuery;
module.exports.buildSearchQuery = buildSearchQuery;
module.exports.isEmptyObject = isEmptyObject;
module.exports.buildAPIQuery = buildAPIQuery;
module.exports.addFiltersToCalcFertilityRates = addFiltersToCalcFertilityRates;
// module.exports.buildQueryForYRBS = buildQueryForYRBS;
module.exports.addCountsToAutoCompleteOptions = addCountsToAutoCompleteOptions;
module.exports.prepareMapAggregations = prepareMapAggregations;
module.exports.getGroupQuery = getGroupQuery;
module.exports.findFilterByKeyAndValue = findFilterByKeyAndValue;
module.exports.isFilterApplied = isFilterApplied;
module.exports.buildFilterQuery = buildFilterQuery;