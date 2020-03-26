var elasticsearch = require('elasticsearch');
var searchUtils = require('../api/utils');
var elasticQueryBuilder = require('../api/elasticQueryBuilder');
const util = require('util');
var wonder = require("../api/wonder");
var Q = require('q');
var logger = require('../config/logging');
var config = require('../config/config');
var _host = config.elastic_search.url;
var _index= "owh";
var mortality_index = "owh_mortality";
var mortality_type = "mortality";
var natality_index = "owh_natality";
var natality_type = "natality";
var census_index="owh_census";
var census_rates_index="owh_census_rates";
var census_type="census";
var census_rates_type="census_rates";
var infant_mortality_index = "owh_infant_mortality";
var infant_mortality_type = "infant_mortality";
var cancer_incidence_index = "owh_cancer_incidence";
var cancer_incidence_type = "cancer_incidence";
var cancer_mortality_index = "owh_cancer_mortality";
var cancer_mortality_type = "cancer_mortality";
var cancer_population_index = "owh_cancer_population";
var cancer_population_type = "cancer_population";

//@TODO to work with my local ES DB I changed mapping name to 'queryResults1', revert before check in to 'queryResults'
var _queryIndex = "owh_querycache";
var _queryType = "queryData";
var mental_health_type = "yrbs";
var dsmetadata_index = "owh_dsmetadata";
var dsmetadata_type = "dsmetadata";

var ElasticClient = function() {

};

ElasticClient.prototype.getClient = function(database) {
    //elastic search client configuration
    /*return new elasticsearch.Client({
        host: _host+'/'+database
    });*/

     var configuration = {};
     configuration.apiVersion = '6.6';
    /* configuration.log = [{
     type: 'stdio',
     levels: ['info', 'debug', 'error', 'warning']
     }];*/
    if(database) {
        configuration.host = _host + '/' + database;
    }
    else {
        configuration.host = _host;
    }
    //elastic search client configuration
    return new elasticsearch.Client(configuration);

};

ElasticClient.prototype.aggregateCensusDataQuery = function(query, index, type, countkey){
    var deferred = Q.defer();
    this.executeESQuery(index, type, query).then(function (resp) {
        deferred.resolve(searchUtils.populateDataWithMappings(resp, countkey));
    });
    return deferred.promise;
};

ElasticClient.prototype.executeESQuery = function(index, type, query){
    var client = this.getClient(index);
    var deferred = Q.defer();
    client.search({
        index:type,
        body:query,
        request_cache:true
    }).then(function (resp) {
        deferred.resolve(resp);
    }, function (err) {
        logger.error(err.message);
        deferred.reject(err);
    });

    return deferred.promise;
};


ElasticClient.prototype.executeMultipleESQueries = function(query, index, type){
    var deferred = Q.defer();
    var queryPromises = [];
    var aggrs = query.aggregations;
    for (var aggr in aggrs){
        var newQ = {size: 0, query: query.query, aggregations:{}};
        newQ.aggregations[aggr] = aggrs[aggr];
        var p = this.executeESQuery(index, type, newQ);
        queryPromises.push(p);
    }

    Q.all(queryPromises).then(function(resp){
        var mergedResult = resp[0];
        for (var i =1; i< resp.length; i++){
            for (var key in resp[i].aggregations){
                mergedResult.aggregations[key] = resp[i].aggregations[key];
            }
        }
        deferred.resolve(mergedResult);
    });

    return deferred.promise;
};

ElasticClient.prototype.mergeWithCensusData = function(data, censusData, censusTotalData, countKey){
    this.mergeCensusRecursively(data.data.nested.table, censusData.data.nested.table, countKey);
    if(censusTotalData)
        this.mergeCensusRecursively(data.data.nested.tableCounts, censusTotalData.data.nested.tableCounts, countKey);
    this.mergeCensusRecursively(data.data.nested.charts, censusData.data.nested.charts, countKey);
    this.mergeCensusRecursively(data.data.nested.maps, censusData.data.nested.maps, countKey);
};


ElasticClient.prototype.mergeCensusRecursively =  function(mort, census, countKey) {
    // sort arrays by name, before merging, so that the values for the matching
    var sortFn = function (a, b){
        if (a.name > b.name) { return 1; }
        if (a.name < b.name) { return -1; }
        return 0;
    };

    if (Array.isArray(mort)){
        mort.sort(sortFn);
    }

    if (Array.isArray(census)){
        census.sort(sortFn);
    }
    if (census && census.states) {
        //remove national from state list
        var index  = searchUtils.findIndexByKeyAndValue(census.states, 'name', 'National');
        index != -1 ? census.states.splice(index, 1):'';
    }

    if(census && census[countKey] && typeof census[countKey] === 'number') {
        //For 'population' and 'births'(for infrant mortality) we are using 'pop' variable only
        // so that no need change logic in UI to display 'population'/'births' and rates
        mort.pop = census[countKey];
    }
    if(typeof mort === 'string' || typeof mort === 'number') {
        return;
    }

    if(census) {
        for (var prop in mort) {
            if(!mort.hasOwnProperty(prop)) continue;
            this.mergeCensusRecursively(mort[prop], census[prop], countKey);
        }
    }
};


ElasticClient.prototype.aggregateDeaths = function(query, isStateSelected, allSelectedFilterOptions){
    var self = this;
    var deferred = Q.defer();
    if(query[1]){
        logger.debug("Mortality ES Query: "+ JSON.stringify( query[0]));
        logger.debug("Mortality ES Query table total: "+ JSON.stringify( query[1]));
        logger.debug("Census ES Query: "+ JSON.stringify( query[2]));
        logger.debug("Census ES Query table total: "+ JSON.stringify( query[3]));
        logger.debug("Map ES Query: "+ JSON.stringify( query[4]));
        var promises = [
            this.executeMultipleESQueries(query[0], mortality_index, mortality_type),
            this.executeMultipleESQueries(query[1], mortality_index, mortality_type),
            this.aggregateCensusDataQuery(query[2], census_rates_index, census_rates_type, 'pop'),
            this.aggregateCensusDataQuery(query[3], census_rates_index, census_rates_type, 'pop'),
            this.executeMultipleESQueries(query[4], mortality_index, mortality_type),
            //To get population count for MAP
            this.aggregateCensusDataQuery(query[5], census_rates_index, census_rates_type, 'pop')
        ];
        //TODO: check and fix with latest hotfix changes
        if(query.wonderQuery) {
            logger.debug("Wonder Query: "+ JSON.stringify(query.wonderQuery));
            promises.push(new wonder('D77').invokeWONDER(query.wonderQuery));
            //if state is selected, remove it as we need data for all state to show on map
            if (query.wonderQuery.query.state !== 'undefined') {
                var mwQuery = JSON.parse(JSON.stringify(query.wonderQuery));
                delete mwQuery.query.state
                promises.push(new wonder('D77').invokeWONDER(mwQuery));
            }
        }
        Q.all(promises).then( function (respArray) {
            var data = searchUtils.populateDataWithMappings(respArray[0], 'deaths', undefined, allSelectedFilterOptions, query[0]);
            var dataCounts = searchUtils.populateDataWithMappings(respArray[1], 'deaths', undefined, allSelectedFilterOptions, query[1]);
            var mapData = searchUtils.populateDataWithMappings(respArray[4], 'deaths', undefined, allSelectedFilterOptions, query[4]);
            data.data.nested.maps = mapData.data.nested.maps;
            data.data.nested.tableCounts = dataCounts.data.nested.tableCounts;
            self.mergeWithCensusData(data, respArray[2], respArray[3], 'pop');
            this.mergeCensusRecursively(data.data.nested.maps, respArray[5].data.nested.maps, 'pop');
            data.data.simple.grandTotals = {ageAdjustedRate : 'Not available', standardPop: 'Not available'};
            if(query.wonderQuery) {
                respArray[6].table && searchUtils.mergeAgeAdjustedRates(data.data.nested.table, respArray[6].table);
                respArray[6].tableCounts && searchUtils.mergeAgeAdjustedRates(data.data.nested.tableCounts, respArray[6].tableCounts);
                if(respArray[6].table['Total']) {
                    data.data.simple.grandTotals = {ageAdjustedRate: respArray[6].table['Total'].ageAdjustedRate,
                        standardPop: respArray[6].table['Total'].standardPop};
                }
                //Loop through charts array and merge age ajusted rates from response
                if(respArray[6].charts) {
                    data.data.nested.charts.forEach(function (chart, index) {
                        searchUtils.mergeAgeAdjustedRates(chart, respArray[6].charts[index]);
                    });
                }
                //Merge Age Adjusted results for Map
                if(respArray[7].maps) {//if state is selected
                    searchUtils.mergeAgeAdjustedRates(data.data.nested.maps, respArray[7].maps);
                } else if (respArray[6].maps) {//if no state is selected
                    searchUtils.mergeAgeAdjustedRates(data.data.nested.maps, respArray[6].maps);
                }
            }
            if (isStateSelected) {
                searchUtils.applySuppressions(data, 'deaths');
            } else {
                searchUtils.applySuppressions(mapData, 'deaths');
            }
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    else {
        logger.debug("Mortality ES Query: "+ JSON.stringify( query[0]));
        this.executeESQuery(mortality_index, mortality_type,query[0]).then(function (resp) {
            var data = searchUtils.populateDataWithMappings(resp, 'deaths', undefined, allSelectedFilterOptions);
            if (isStateSelected) {
                searchUtils.applySuppressions(data, 'deaths');
            } else if (data.data.simple.state) {
                searchUtils.suppressStateTotals(data.data.simple.state, 'deaths', 10);
            }

            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    return deferred.promise;
};

/**
 * This method is used to get the bridge race data(census) based on passed in query
 */
ElasticClient.prototype.aggregateCensusData = function(query, isStateSelected, allSelectedFilterOptions) {
    var self = this;
    var deferred = Q.defer();
    if(query[2]) {
        logger.debug("ES Query for bridge race table and charts: "+ JSON.stringify( query[0]));
        logger.debug("ES Query for bridge race map: "+ JSON.stringify( query[2]));
        var promises = [
            this.executeMultipleESQueries(query[0], census_index, census_type),
            this.executeMultipleESQueries(query[1], census_index, census_type),
            this.executeMultipleESQueries(query[4], census_index, census_type)
        ];
        Q.all(promises).then( function (resp) {
            var data = searchUtils.populateDataWithMappings(resp[0], 'bridge_race', 'pop', allSelectedFilterOptions, query[0]);
            var dataCounts = searchUtils.populateDataWithMappings(resp[1], 'bridge_race', 'pop', allSelectedFilterOptions, query[1]);
            var mapData = searchUtils.populateDataWithMappings(resp[2], 'bridge_race', 'pop', allSelectedFilterOptions, query[4]);
            data.data.nested.maps = mapData.data.nested.maps;
            data.data.nested.tableCounts = dataCounts.data.nested.tableCounts;
            if (isStateSelected) {
                searchUtils.applySuppressions(data, 'bridge_race', 0);
            } else {
                searchUtils.applySuppressions(mapData, 'bridge_race', 0);
            }
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    else {
        logger.debug("ES Query for side filter counts :"+ JSON.stringify( query[0]));
        this.executeESQuery(census_index, census_type, query[0]).then(function (response) {
            var results = searchUtils.populateDataWithMappings(response, 'bridge_race', 'pop');
            if (isStateSelected) {
                searchUtils.applySuppressions(results, 'bridge_race', 0);
            }
            deferred.resolve(results);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    return deferred.promise;
};

/**
 * This method is used to fetch the natality data
 */
ElasticClient.prototype.aggregateNatalityData = function(query, isStateSelected, allSelectedFilterOptions){
    //get tge elastic search client for natality index
    var self = this;
    var deferred = Q.defer();
    if(query[2]) {
        logger.debug("Natality ES Query: "+ JSON.stringify( query[0]));
        logger.debug("Census Rates ES Query: "+ JSON.stringify( query[2]));
        var promises = [
            this.executeMultipleESQueries(query[0], natality_index, natality_type),
            this.executeMultipleESQueries(query[1], natality_index, natality_type),
            this.aggregateCensusDataQuery(query[2], census_rates_index, census_rates_type, 'pop'),
            this.aggregateCensusDataQuery(query[3], census_rates_index, census_rates_type, 'pop'),
            this.executeMultipleESQueries(query[4], natality_index, natality_type),
            this.aggregateCensusDataQuery(query[5], census_rates_index, census_rates_type, 'pop')
        ];
        Q.all(promises).then( function (resp) {

            var data = searchUtils.populateDataWithMappings(resp[0], 'natality', undefined, allSelectedFilterOptions, query[0]);
            var dataCounts = searchUtils.populateDataWithMappings(resp[1], 'natality', undefined, allSelectedFilterOptions, query[0]);
            data.data.nested.tableCounts = dataCounts.data.nested.tableCounts;
            self.mergeWithCensusData(data, resp[2], resp[3], 'pop');
            var mapData = searchUtils.populateDataWithMappings(resp[4], 'natality', undefined, allSelectedFilterOptions, query[4]);
            data.data.nested.maps = mapData.data.nested.maps;
            this.mergeCensusRecursively(data.data.nested.maps, resp[5].data.nested.maps, 'pop');
            //apply supression on whole data if state selected
            if (isStateSelected) {
                searchUtils.applySuppressions(data, 'natality');
            } else {
                //apply suppression only on map data
                searchUtils.applySuppressions(mapData, 'natality');
            }
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    else {
        logger.debug("Natality ES Query: "+ JSON.stringify( query[0]));
        this.executeESQuery(natality_index, natality_type, query[0]).then(function (resp) {;
            var data = searchUtils.populateDataWithMappings(resp, 'natality', undefined, allSelectedFilterOptions);
            if (isStateSelected) {
                searchUtils.applySuppressions(data, 'natality');
            } else if (data.data.simple.state) {
                searchUtils.suppressStateTotals(data.data.simple.state, 'natality', 10);
            }

            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    return deferred.promise;
};

ElasticClient.prototype.aggregateInfantMortalityData = function (query, isStateSelected, selectedYears) {
    var self = this;
    var deferred = Q.defer();
    var dbID;
    //Based on selected year choose wonder database ID
    var selectedYear = selectedYears[0];
    if(selectedYear <= '2017' && selectedYear >= '2007') {
        dbID = 'D69';
    }
    else if(selectedYear <= '2006' && selectedYear >= '2003') {
        dbID = 'D31'
    }
    else if(selectedYear <= '2002' && selectedYear >= '2000') {
        dbID = 'D18'
    }
    logger.debug("Executing wonder query against database ", dbID);
    var promises = [];
    if(dbID) {
        logger.debug("Invoking wonder query with this query JSON: ", JSON.stringify(query));
        promises.push(new wonder(dbID).invokeWONDER(query));
        Q.all(promises).then(function (resp) {
            var data = searchUtils.populateWonderDataWithMappings(resp[0], 'infant_mortality', undefined, query, isStateSelected);
            isStateSelected && searchUtils.applySuppressions(data, 'infant_mortality');
            deferred.resolve(data);

        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    return deferred.promise;
};

ElasticClient.prototype.aggregateDiseaseData = function (query, diseaseName, indexName, indexType, isStateSelected, allSelectedFilterOptions) {
    var self = this;
    var deferred = Q.defer();
    if(query[1]) {
        logger.debug("ES Query for "+ diseaseName+ " :"+ JSON.stringify( query[0]));
        logger.debug("ES Count Query for "+ diseaseName+ " :"+ JSON.stringify( query[1]));
        logger.debug("ES Query for "+ diseaseName+ " to get population count:"+ JSON.stringify( query[2]));
        logger.debug("ES Query for "+ diseaseName+ " Map Query:"+ JSON.stringify( query[3]));
        logger.debug("ES Query for "+ diseaseName+ " Chart Query Array :"+ JSON.stringify( query[4]));
        var promises = [
            this.executeESQuery(indexName, indexType, query[0]),
            this.executeESQuery(indexName, indexType, query[1]),
            this.executeESQuery(indexName, indexType, query[3])
        ];
        //Add all population queries to promise
        query[2].forEach(function(eachQuery){
            //Using aggregateCensusDataQuery method to get STD population data
            promises.push(self.aggregateCensusDataQuery(eachQuery, indexName, indexType, 'pop'));
        });
        //Add all chart queries to promise
        query[4].forEach(function(chartQuery){
            promises.push(self.executeESQuery(indexName, indexType, chartQuery));
        });
        promises.push(self.aggregateCensusDataQuery(query[5], indexName, indexType, 'pop'));
        Q.all(promises).then( function (resp) {
            var data = searchUtils.populateDataWithMappings(resp[0], diseaseName, 'cases', allSelectedFilterOptions, query[0]);
            var dataCounts = searchUtils.populateDataWithMappings(resp[1], diseaseName, 'cases', allSelectedFilterOptions, query[1]);
            var mapData = searchUtils.populateDataWithMappings(resp[2], diseaseName, 'cases', allSelectedFilterOptions, query[3]);
            //get each chart query response and populate data with mappings
            for(i=0; i< query[4].length; i++ ){
                //chart response index depends on population query array length
                var respIndex = i + 4 + (query[2].length-1);
                var chartData = searchUtils.populateDataWithMappings(resp[respIndex], diseaseName, 'cases');
                data.data.nested.charts.push(chartData.data.nested.charts[i]);
            }
            data.data.nested.maps = mapData.data.nested.maps;
            //merge all population queries and call mergeWithCensusData method
            var populationResponse;
            for(i=0; i< query[2].length; i++) {
                //Merging all population response
                //When i == 0 prepare 'populationResponse' and then merge 'x.data.nested.charts' into 'populationResponse' variable
                if(i == 0) {
                    populationResponse = resp[i+3]
                } else if(i == 1) {
                    populationResponse.data.nested.table = resp[i + 3].data.nested.table;
                } else {
                    populationResponse.data.nested.charts.push(resp[i + 3].data.nested.charts[i-2]);
                }
            }
            data.data.nested.tableCounts = dataCounts.data.nested.tableCounts;
            var censusTotalData = resp[query[2].length+query[4].length+3];
            self.mergeWithCensusData(data, populationResponse, censusTotalData, 'pop');
            /*TODO: commented for now. Once ATLAS gives go ahead will remove completely
            if (diseaseName === 'std') {
                var threshold = 4;
                if (isStateSelected) {
                    searchUtils.applySuppressions(data, indexType, threshold)
                } else {
                    searchUtils.applySuppressions(mapData, indexType, threshold)
                }
            } else if (diseaseName === 'aids') {
                searchUtils.applySuppressions(data, indexType, 0);
            }*/
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    else {
        logger.debug("ES Query for "+ diseaseName+ " :"+ JSON.stringify( query[0]));
        this.executeESQuery(indexName, indexType, query[0]).then(function (response) {
            var data = searchUtils.populateDataWithMappings(response, diseaseName, 'cases', allSelectedFilterOptions);
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    return deferred.promise;
};

ElasticClient.prototype.getQueryCache = function(query){
    var client = this.getClient(_queryIndex);
    var deferred = Q.defer();

    client.search({
       index: _queryType,
       body: query,
       request_cache:true
    }).then(function (resp){
        if(resp.hits.hits.length > 0) {
            deferred.resolve(resp.hits.hits[0])
        }else{
            deferred.resolve(null);
        }
    }, function(err){
        logger.error("While searching for queryData object ", err.message);
        deferred.reject(err);
    });
    return deferred.promise;
};


/**
 *
 * @param query
 * @returns {*}
 */
ElasticClient.prototype.insertQueryData = function (query) {
    var client = this.getClient();
    var deferred = Q.defer();
    client.index({
        index: _queryIndex,
        type: _queryType,
        body: query
    }).then(function (resp){
        deferred.resolve(resp);
    }, function(err){
        logger.error("Failed to insert record in queryResults ", err.message);
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * Retrieve data set metadata for the given dataset and year
 * @param dataset
 * @param years
 * @returns {*|promise}
 */
ElasticClient.prototype.getDsMetadata = function (dataset, years) {
    var query = {"size": 2147483647,"filter":{"and":{"filters":[{"term":{"dataset":dataset}}]}}};
    if (years && years.length > 0){
        var yearfilter = [];
        for (var year in years) {
            yearfilter.push({"term": {"year": years[year]}});
        }
        query.filter.and.filters.push({"or": yearfilter});
    }
    logger.debug("DS metadata ES query: ", JSON.stringify(query));
    var client = this.getClient();
    var deferred = Q.defer();
    client.search({
        index: dsmetadata_index,
        type: dsmetadata_type,
        body: query
    }).then(function (resp){
        logger.info("Successfully completed ds metadata ES query execution.");
        deferred.resolve(resp);
    }, function(err){
        logger.error("Failed to retrieve ds metadata ", err.message);
        deferred.reject(err);
    });
    return deferred.promise;
};

ElasticClient.prototype.aggregateCancerData = function (query, cancer_index, allSelectedFilterOptions) {
    var index = cancer_index === cancer_incidence_type ? cancer_incidence_index : cancer_mortality_index;
    var type = cancer_index === cancer_incidence_type ? cancer_incidence_type : cancer_mortality_type;
    var promises = [ this.executeESQuery(index, type, query[0]), this.executeESQuery(index, type, query[1]) ];

    logger.debug("Cancer ES Query for " + index + " :" + JSON.stringify(query[0]));

    if (query[2]) promises.push(this.executeESQuery(cancer_population_index, cancer_population_type, query[2]));
    if (query[3]) promises.push(this.executeESQuery(cancer_population_index, cancer_population_type, query[3]));
    if (query[4]) {
        promises.push(this.executeESQuery(index, type, query[4]));
        promises.push(this.executeESQuery(cancer_population_index, cancer_population_type, query[5]));
    }

    return Q.all(promises).spread(function (queryResponse, tableCountsResponse, populationResponse,
                                            tableCountsPopulationResponse, mapResponse, populationMapResponse) {
        var data = searchUtils.populateDataWithMappings(queryResponse, type, undefined, allSelectedFilterOptions, query[0]);
        var dataCounts = searchUtils.populateDataWithMappings(tableCountsResponse, type, undefined, allSelectedFilterOptions, query[1]);
        data.data.nested.tableCounts = dataCounts.data.nested.tableCounts;
        var pop = searchUtils.populateDataWithMappings(populationResponse, cancer_population_type);
        var tableCountsPopulation = searchUtils.populateDataWithMappings(tableCountsPopulationResponse, cancer_population_type);
        var popIndex = searchUtils.createPopIndex(pop.data.nested.table, cancer_population_type);
        var popCountsIndex = searchUtils.createPopIndex(tableCountsPopulation.data.nested.tableCounts, cancer_population_type);
        searchUtils.attachPopulation(data.data.nested.table, popIndex, '');
        searchUtils.attachPopulation(data.data.nested.tableCounts, popCountsIndex, '');
        if (data.data.nested.charts.length) {
            data.data.nested.charts.forEach(function (chart, idx) {
                var eachPopIndex = searchUtils.createPopIndex(pop.data.nested.charts[idx], cancer_population_type);
                searchUtils.attachPopulation(chart, eachPopIndex, '');
            });
        }
        if (mapResponse && populationMapResponse) {
            var mapData = searchUtils.populateDataWithMappings(mapResponse, type, undefined, allSelectedFilterOptions, query[2]);
            var popMapData = searchUtils.populateDataWithMappings(populationMapResponse, cancer_population_type);
            var popMapIndex = searchUtils.createPopIndex(popMapData.data.nested.maps, cancer_population_type);
            searchUtils.attachPopulation(mapData.data.nested.maps, popMapIndex, '');
            data.data.nested.maps = mapData.data.nested.maps;
        }
        return data;
    }).catch(function (error) {
        logger.debug('Error fetching cancer data', error);
        return error
    });
};

module.exports = ElasticClient;
