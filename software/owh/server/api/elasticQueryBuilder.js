const util = require('util');
var merge = require('merge');

var prepareCensusAggregationQuery = function(aggregations, datasetName) {
    var censusQuery = { size: 0};
    censusQuery.aggregations = {};
    if (aggregations['nested']) {
        if (aggregations['nested']['table'] && aggregations['nested']['table'].length > 0) {
            aggregations['nested']['table'] = aggregations['nested']['table'].filter(function (filter) {
                return !~[ 'site', 'childhood_cancer' ].indexOf(filter.key);
            });
            censusQuery.aggregations = merge(censusQuery.aggregations, generateNestedCensusAggQuery(aggregations['nested']['table'], 'group_table_'));
        }
      if (datasetName != 'std' && datasetName != 'tb' && datasetName != 'aids' &&  aggregations['nested']['charts']) {
            for(var index in aggregations['nested']['charts']) {
                censusQuery.aggregations = merge(censusQuery.aggregations, generateNestedCensusAggQuery(aggregations['nested']['charts'][index], 'group_chart_' + index + '_'));
            }
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
    //To handle infant_mortality year filter
    if(aggQuery.queryKey == 'year_of_death'){
        aggQuery.queryKey = 'current_year';
    }
    query[ groupByKeyStart + aggQuery.key] = {
        "terms": {
            "field": aggQuery.queryKey,
            "size": aggQuery.size
        }
    };
    return query;
};

var prepareAggregationQuery = function(aggregations, countQueryKey, datasetName) {
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
        if (datasetName != 'std' && datasetName != 'tb' && datasetName != 'aids' && aggregations['nested']['charts']) {
            for(var index in aggregations['nested']['charts']) {
                elasticQuery.aggregations = merge(elasticQuery.aggregations, generateNestedAggQuery(aggregations['nested']['charts'][index], 'group_chart_' + index + '_', countQueryKey));
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
    }else if(countQueryKey == 'cases') {
        query[ groupByKeyStart + aggQuery.key] = getTermQuery(aggQuery);
        query[ groupByKeyStart + aggQuery.key].aggregations=getCasesSumQuery();
        merge(query, getCasesSumQuery());
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
 * prepare cases sum query
 * @returns {{group_count_cases: {sum: {field: string}}}}
 */
function getCasesSumQuery() {
    return {
        "group_count_cases": {
            "sum": {
                "field": "cases"
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

/**
 * Common function to build a search query
 * @param params
 * @param isAggregation
 * @param allOptionValues -> List of All option values for STD, TB, HIV-AIDS filters
 * @return {[]}
 */
var buildSearchQuery = function(params, isAggregation, allOptionValues) {
    var userQuery = params.query ? params.query : {};
    var elasticQuery = {};
    var  searchQueryArray = [];
    var censusQuery = undefined;
    if ( isAggregation ){
        elasticQuery.size = 0;
        elasticQuery = merge(elasticQuery, prepareAggregationQuery(params.aggregations, params.countQueryKey, params.searchFor));
        if(params.aggregations['nested'] && params.aggregations['nested']['table']){
            censusQuery = prepareCensusAggregationQuery(params.aggregations , params.searchFor);
        }

    } else {
        elasticQuery.from = params.pagination.from;
        elasticQuery.size = params.pagination.size;
    }
    elasticQuery.query = {};
    elasticQuery.query.filtered = {};

    /*
    * For STD, TB, HIV-AIDS
    * If user select groupBy column / row for any filter then this logic will remove 'All' filter from filter query
    * So that data table display all options for that filter
    */
    if((params.searchFor == 'std' || params.searchFor == 'tb' || params.searchFor == 'aids') && params.aggregations['nested'] && params.aggregations['nested']['table']) {
        params.aggregations['nested']['table'].forEach(function (aggregation) {
            Object.keys(userQuery).forEach(function(key){
                var eachObject = userQuery[key];
                if(eachObject.queryKey && eachObject.queryKey == aggregation.queryKey && allOptionValues.indexOf(eachObject.value) > -1){
                    delete userQuery[key];
                }
            });
        });
    }
    //build top level bool queries
    var primaryQuery = buildTopLevelBoolQuery(groupByPrimary(userQuery, true), true);
    var filterQuery = buildTopLevelBoolQuery(groupByPrimary(userQuery, false), false);
    //check if primary query is empty
    elasticQuery.query.filtered.query = primaryQuery;
    elasticQuery.query.filtered.filter = filterQuery;
    if(censusQuery) {
        var clonedUserQuery = clone(userQuery);
        if (clonedUserQuery['ICD_10_code']) delete clonedUserQuery['ICD_10_code'];
        if (clonedUserQuery['ICD_130_code']) delete clonedUserQuery['ICD_130_code'];
        if (clonedUserQuery['infant_age_at_death']) delete clonedUserQuery['infant_age_at_death'];
        if (clonedUserQuery['cancer_site']) delete clonedUserQuery['cancer_site'];
        if(clonedUserQuery['year_of_death']) {
            //Infant mortality index has column 'year_of_death', should match with natality index column in Elastic Search
            //So that we can query natality index for Birth counts.
            clonedUserQuery['year_of_death'].queryKey = 'current_year';
        }
        var clonedPrimaryQuery = buildTopLevelBoolQuery(groupByPrimary(clonedUserQuery, true), true);
        var clonedFilterQuery = buildTopLevelBoolQuery(groupByPrimary(clonedUserQuery, false), false);

        censusQuery.query = {};
        censusQuery.query.filtered = {};

        censusQuery.query.filtered.query = clonedPrimaryQuery;
        censusQuery.query.filtered.filter = clonedFilterQuery;
    }
    //prepare query for map
    var  mapQuery = buildMapQuery(params.aggregations, params.countQueryKey, primaryQuery, filterQuery, params.searchFor);
    searchQueryArray.push(elasticQuery);
    //Prepare chart query for disease datasets 'std', 'tb' and 'aids'.
    if(params.searchFor == 'std' || params.searchFor == 'tb' || params.searchFor == 'aids') {
        var chartQueryArray = buildChartQuery(params.aggregations, params.countQueryKey, primaryQuery, filterQuery, censusQuery, params.searchFor);
        console.log(chartQueryArray)
        if (!params.filterCountsQuery) {
            var mapPopQuery = getPopulationQueryForMap(params.aggregations);
            mapPopQuery.query = mapQuery.query;
            chartQueryArray[0].splice(0, 0, mapPopQuery );
        }
        //'Population' query
        searchQueryArray.push(chartQueryArray[0]);
        searchQueryArray.push(mapQuery);
        //Chart 'Cases' query
        searchQueryArray.push(chartQueryArray[1]);
    }
    else {
        searchQueryArray.push(censusQuery);
        searchQueryArray.push(mapQuery);
    }

    return searchQueryArray;
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
            var filter = a[i];
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
    if (a) {
        return (a.value.length > 0 && a.value != 'National') || a.groupBy === 'row' || a.groupBy === 'column';
    }
    return false;
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
    if(primaryFilter.key === 'mental_health'
        || primaryFilter.key === 'prams'
        || primaryFilter.key === 'brfss'){
        if(primaryFilter.showBasicSearchSideMenu) {
            apiQuery.basicSearch = true;
        }
        if(primaryFilter.isChartorMapQuery) {
            apiQuery.isChartorMapQuery = true;
        }
    }
    var sortedFilters = sortByKey(clone(primaryFilter.allFilters), getAutoCompleteOptionsLength);
    sortedFilters.forEach(function (eachFilter) {
        if (eachFilter.groupBy) {
            var eachGroupQuery = getGroupQuery(eachFilter);
            var splitFilters = [eachFilter];
            var splitGroupQueries = [eachGroupQuery];

            if (eachFilter.queryType === "compound") {
                var secondGroupQuery = clone(eachGroupQuery);

                var secondFilter = clone(eachFilter);
                var secondOptions = [];
                secondFilter.autoCompleteOptions.forEach(function (option) {
                    option.options.forEach(function (subOption) {
                        secondOptions.push(subOption);
                    });
                });
                secondFilter.autoCompleteOptions = secondOptions;

                var split = eachFilter.queryKeys;

                eachFilter.key += "|" + split[0];
                eachGroupQuery.key += "|" + split[0];
                eachGroupQuery.queryKey = split[0];

                secondFilter.key += "|" + split[1];
                secondGroupQuery.key += "|" + split[1];
                secondGroupQuery.queryKey = split[1];

                splitGroupQueries.push(secondGroupQuery);
                splitFilters.push(secondFilter);
            }

            for (var i = 0; i < splitFilters.length; i++) {
                eachFilter = splitFilters[i];
                eachGroupQuery = splitGroupQueries[i];

                if (eachFilter.groupBy === 'row') {
                    //user defined aggregations for rendering table
                    rowAggregations.push(eachGroupQuery);
                    headers.rowHeaders.push(eachFilter);
                }
                else if (eachFilter.groupBy === 'column') {
                    columnAggregations.push(eachGroupQuery);
                    headers.columnHeaders.push(eachFilter);
                }
            }
        }

        if (eachFilter.key === 'mcd-chapter-10') {
            var set1Filter = clone(eachFilter);
            var set2Filter = clone(eachFilter);

            set1Filter.value = set1Filter.value.set1 || [];
            set2Filter.value = set2Filter.value.set2 || [];

            var set1FilterQuery = buildFilterQuery(set1Filter);
            if (set1FilterQuery) {
                set1FilterQuery.set = "set1";
                apiQuery.query[set1Filter.queryKey + ".set1"] = set1FilterQuery;
            }

            var set2FilterQuery = buildFilterQuery(set2Filter);
            if (set2FilterQuery) {
                set2FilterQuery.set = "set2";
                apiQuery.query[set2Filter.queryKey + ".set2"] = set2FilterQuery;
            }
        }
        else {
            var eachFilterQuery = buildFilterQuery(eachFilter);
            if(eachFilterQuery) {
                apiQuery.query[eachFilter.queryKey] = eachFilterQuery;
            }
        }
    });
    if (primaryFilter.key === 'prams' || primaryFilter.key === 'brfss') {
        getPramsQueryForAllYearsAndQuestions(primaryFilter, apiQuery)
    }
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

/**
 * Prepare query for PRAMS Years and Questions
 * @param primaryFilter
 * @param apiQuery
 */
function getPramsQueryForAllYearsAndQuestions(primaryFilter, apiQuery) {
    primaryFilter.sideFilters.forEach(function(category) {
        category.sideFilters.forEach(function(filter) {
            if(filter.filters.key === 'topic'
                && apiQuery.query['question.path'].value.length > filter.filters.questions.length) {
                apiQuery.query['question.path'].value = filter.filters.questions;
            } else if (filter.filters.key === 'year') {
                apiQuery.query['year'] = getFilterQuery(filter.filters);
                if(filter.filters.value.length == 0) {
                    apiQuery.query['year'].value = getFilterOptionValues(filter.filters.autoCompleteOptions);
                }
            }
        });
    });
}

/**
 * Get all options as array of values
 * @param filterOptions
 */
function getFilterOptionValues(filterOptions) {
    return filterOptions.map(function(option) {
        return option.key;
    });
}

function clone(a) {
    return JSON.parse(JSON.stringify(a));
}

function sortByKey(array, key, asc) {
    return array.sort(function(a, b) {
        var x = typeof(key) === 'function' ? key(a) : a[key];
        var y = typeof(key) === 'function' ? key(b) : b[key];
        if(asc===undefined || asc === true) {
            return ((x < y) ? -1 : ((x > y) ? 1 : (a.key < b.key)? 1: -1));
        }else {
            return ((x > y) ? -1 : ((x < y) ? 1 : (a.key < b.key)? -1: 1));
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
        filter.questions.forEach( function(q) {
          if(q.children){
              filter.value = filter.value.concat(q.children.map(function (it) { return it.id;}));
          }else{
              filter.value.push(q.id);
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
        queryKey: filter.queryType === 'compound' ? filter.queryKeys[1] : (filter.aggregationKey ? filter.aggregationKey : filter.queryKey),
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
    if(queryString.indexOf('mother_age_1year_interval') < 0 && queryString.indexOf('mother_age_5year_interval') < 0 ) {
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
    "gender&state": "horizontalStack",
    "gender&hhs-region": "horizontalStack",
    "race&hhs-region": "horizontalStack",
    "sex&race": "verticalBar",
    "sex&ethnicity": "verticalBar",
    "sex&agegroup": "horizontalStack",
    "sex&state": "verticalBar",
    "sex&hhs-region": "horizontalStack",
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
    "hispanic_origin&prenatal_care": "horizontalStack",
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
    "eclampsia&tobacco_use": "horizontalStack",

    "sex&age_group": "horizontalBar",
    "age_group&race": "horizontalBar",
    "age_group&state": "horizontalBar",

    "sex&infant_age_at_death": "horizontalStack",
    "sex&mother_age_5_interval": "horizontalStack",
    "race&mother_age_5_interval": "horizontalStack",
    "sex&gestation_recode11": "horizontalStack",
    "race&gestation_recode11": "horizontalStack",
    "sex&gestation_recode10": "horizontalStack",
    "race&gestation_recode10": "horizontalStack",
    "sex&gestation_weekly": "horizontalStack",
    "race&gestation_weekly": "horizontalStack",
    "sex&year_of_death": "multiLineChart",
    "race&year_of_death": "multiLineChart",
    "ethnicity&year_of_death": "multiLineChart",
    "marital_status&year_of_death": "multiLineChart",
    "mother_age&year_of_death": "multiLineChart",
    "mother_education&year_of_death": "mulitLineChart",
    "gestation_recode1&year_of_death": "multiLineChart",
    "prenatal_care&year_of_death": "horizontalStack",
    "birth_weight&year_of_death": "mulitLineChart",
    "birth_plurality&year_of_death": "mulitLineChart",
    "live_birth&year_of_death": "mulitLineChart",
    "birth_place&year_of_death": "mulitLineChart",
    "delivery_method&year_of_death": "mulitLineChart",
    "medical_attendant&year_of_death": "mulitLineChart",
    "ucd&year_of_death": "mulitLineChart"
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
    primaryFilter.sideFilters.forEach(function (category) {
        category.sideFilters.forEach(function (eachSideFilter) {
            filters = filters.concat(eachSideFilter.filterGroup ? eachSideFilter.filters : [eachSideFilter.filters]);
        });
    });
    filters.forEach(function (eachFilter) {
        var aggregation = getGroupQuery(eachFilter);
        if (aggregation.queryKey.indexOf('|') >= 0) {
            aggregation.queryKey = aggregation.queryKey.split('|')[1];
        }
        apiQuery.aggregations.simple.push(aggregation);
    });
    //if(query) {
    var filterQuery = buildAPIQuery(primaryFilter).apiQuery.query;
    apiQuery.query = filterQuery;
    //}
    return apiQuery;
}

/**
 * This function is used to prepare aggregation query for map
 * @param aggregations
 * @param countQueryKey
 * @param primaryQuery
 * @param filterQuery
 * @param datasetName
 * @return {undefined}
 */
function buildMapQuery(aggregations, countQueryKey, primaryQuery, filterQuery, datasetName) {

    var mapQuery = undefined;

    if (aggregations['nested'] && aggregations['nested']['maps']) {
        mapQuery = { "size":0, aggregations: {} };
        //prepare aggregations
        for(var index in aggregations['nested']['maps']) {
            if(datasetName == 'deaths' || datasetName == 'cancer_incident' || datasetName == 'cancer_mortality') {
                mapQuery.aggregations = generateNestedCensusAggQuery(aggregations['nested']['maps'][index], 'group_maps_' + index + '_');
            }
            else {
                mapQuery.aggregations = generateNestedAggQuery(aggregations['nested']['maps'][index], 'group_maps_' + index + '_', countQueryKey, true);
            }
        }
        //add quey criteria
        mapQuery.query = {filtered:{}};
        mapQuery.query.filtered.query = clone(primaryQuery);
        mapQuery.query.filtered.filter = clone(filterQuery);

        var mustFilters = mapQuery.query.filtered.filter.bool.must;
        //We need data for all the states to prepare map,
        //so if user selects any state, remove it from criteria
        mustFilters.forEach(function(filter, index) {
            if(filter.bool.should[0].term.state) {
                mustFilters.splice(index, 1);
            }
        });
    }

    return mapQuery;
}

/**
 * This buildChartQuery method prepares population query for each chart and prepares cases query for each chart
 * For each chart aggregation add appropriate filters to avoid adding 'All' values[Ex: Both sexes, 'All age groups' etc...]
 * @param aggregations
 * @param countQueryKey
 * @param primaryQuery
 * @param filterQuery
 * @param censusQuery
 * @returns List of 'Population query' and 'Cases query'
 */
function buildChartQuery(aggregations, countQueryKey, primaryQuery, filterQuery, censusQuery, datasetName) {
    var chartCasesQueryArray = [];
    //censusQuery value could be 'undefined' or population query with table aggregation
    var chartPopulationQueryArray = censusQuery ? [censusQuery] : censusQuery;
    //filter and it's 'All' value map
    var filterAllValueMap = {"sex":"Both sexes", "race_ethnicity": "All races/ethnicities", "age_group": "All age groups", "state": "National", "transmission": "No stratification"};
    if (aggregations['nested'] && aggregations['nested']['charts']) {
        //Get selected aggregation query keys
        var selectedFilterKeys = [];
        aggregations['nested']['charts'].forEach(function(eachChart){
            eachChart.forEach(function(eachFilter){
                if(selectedFilterKeys.indexOf(eachFilter.queryKey) < 0 ) {
                    selectedFilterKeys.push(eachFilter.queryKey);
                }
            })
        });
        //Prepare aggregation query
       for(var index in aggregations['nested']['charts']) {
           var chartCasesQuery = { "size":0, aggregations: {} };
           var filterKeys = clone(selectedFilterKeys);
           //for each aggregation prepare one chart query
           chartCasesQuery.aggregations = generateNestedAggQuery(aggregations['nested']['charts'][index], 'group_chart_' + index + '_', countQueryKey, true);
           //add query criteria to chart cases query
           chartCasesQuery.query = {filtered:{}};
           chartCasesQuery.query.filtered.query = clone(primaryQuery);
           chartCasesQuery.query.filtered.filter = clone(filterQuery);
           //For each aggregation find out what are the keys that are not included in aggregation and add a boolean filter query for that key
           //For example if user selected three filters 'sex', 'race' and 'age_group' then we will have three aggregation queries
           // 1. sex and race aggregation  -> for this aggregation query we add 'age_group -> All age groups' boolean filter
           // 2. sex and age_group -> for this aggregation query we add 'race -> All races/ethinicities' boolean filter
           // 3. age_group and race -> for this aggregation query we add 'sex -> Both sexes' boolean filter
           aggregations['nested']['charts'][index].forEach(function(eachFilter){
               var filterIndex = filterKeys.indexOf(eachFilter.queryKey);
               filterKeys.splice(filterIndex, 1);
           });
           /**
            * For TB and AIDS charts
            * Transmission don't have chartType so add 'transmission' to filterKey so that if user select 'No stratification' for 'transmission' then
            * we can add filter query for 'transmission'
            */
           (datasetName === 'tb' || datasetName === 'aids') && filterKeys.push("transmission");
           //Get mustFilter to add filter query
           var mustFilters = chartCasesQuery.query.filtered.filter.bool.must;
           filterKeys.forEach(function(eachKey){
               var isFilterQueryPresent = false;
               //check if 'eachKey' already present in must filter
               //That means if user selected other than 'sex -> Both sexes', 'race -> All races/ethnicities', 'age_group -> All age groups' and 'state -> National' filters then 'isKeyPresent' set to 'true'
               for(var i in mustFilters){
                   if(mustFilters[i].bool.should[0].term[eachKey] != undefined) {
                       isFilterQueryPresent = true;
                       break;
                   }
               }
               //If filter value available meaning if filter is 'sex', 'race', 'ageGroup' or 'state'
               if(!isFilterQueryPresent && filterAllValueMap[eachKey]) {
                   var boolQuery = buildBoolQuery(eachKey, [filterAllValueMap[eachKey]]);
                   !isEmptyObject(boolQuery) && mustFilters.push(boolQuery);
               }
           });
           //Add prepared each chart query to array
           chartCasesQueryArray.push(chartCasesQuery);
           //If censusQuery has table aggregation then prepare population query for each chart also
           if(censusQuery) {
               var populationQuery = { "size":0, aggregations: {} };
               populationQuery.aggregations = generateNestedCensusAggQuery(aggregations['nested']['charts'][index], 'group_chart_' + index + '_');
               //chart filter query for population  is same as chart cases query
               populationQuery.query = chartCasesQuery.query;
               chartPopulationQueryArray.push(populationQuery);
           }
       }
    }
    //List of 'Population query' and 'Cases query'
    return [chartPopulationQueryArray, chartCasesQueryArray];
}

function getPopulationQueryForMap(aggregations) {
    var populationQuery = { "size":0, aggregations: {} };
    populationQuery.aggregations = generateNestedCensusAggQuery(aggregations['nested']['maps'][0], 'group_maps_' + 0 + '_');
    return populationQuery
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
