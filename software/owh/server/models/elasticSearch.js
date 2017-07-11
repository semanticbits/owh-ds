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
     configuration.apiVersion = '1.5';
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

ElasticClient.prototype.mergeWithCensusData = function(data, censusData, countKey){
    mergeCensusRecursively(data.data.nested.table, censusData.data.nested.table, countKey);
    mergeCensusRecursively(data.data.nested.charts, censusData.data.nested.charts, countKey);
};


function mergeCensusRecursively(mort, census, countKey) {
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
            mergeCensusRecursively(mort[prop], census[prop], countKey);
        }
    }
}


ElasticClient.prototype.aggregateDeaths = function(query, isStateSelected){
    var self = this;
    var deferred = Q.defer();
    if(query[1]){
        logger.debug("Mortality ES Query: "+ JSON.stringify( query[0]));
        logger.debug("Census ES Query: "+ JSON.stringify( query[1]));
        var promises = [
            this.executeMultipleESQueries(query[0], mortality_index, mortality_type),
            this.aggregateCensusDataQuery(query[1], census_rates_index, census_rates_type, 'pop'),
            this.executeMultipleESQueries(query[2], mortality_index, mortality_type)
        ];
        if(query.wonderQuery) {
            logger.debug("Wonder Query: "+ JSON.stringify(query.wonderQuery));
            promises.push(new wonder('D76').invokeWONDER(query.wonderQuery));
        }
        Q.all(promises).then( function (respArray) {
            var data = searchUtils.populateDataWithMappings(respArray[0], 'deaths');
            var mapData = searchUtils.populateDataWithMappings(respArray[2], 'deaths');
            data.data.nested.maps = mapData.data.nested.maps;
            self.mergeWithCensusData(data, respArray[1], 'pop');
            if(query.wonderQuery) {
                searchUtils.mergeAgeAdjustedRates(data.data.nested.table, respArray[2].table);
                //Loop through charts array and merge age ajusted rates from response
                data.data.nested.charts.forEach(function(chart, index){
                    searchUtils.mergeAgeAdjustedRates(chart, respArray[2].charts[index]);
                });
            }
            if (isStateSelected) {
                searchUtils.applySuppressions(data, 'deaths');
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
            var data = searchUtils.populateDataWithMappings(resp, 'deaths');
            if (isStateSelected) {
                searchUtils.applySuppressions(data, 'deaths');
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
ElasticClient.prototype.aggregateCensusData = function(query, isStateSelected) {
    var self = this;
    var deferred = Q.defer();
    if(query[1]) {
        logger.debug("ES Query for bridge race table and charts: "+ JSON.stringify( query[0]));
        logger.debug("ES Query for bridge race map: "+ JSON.stringify( query[2]));
        var promises = [
            this.executeMultipleESQueries(query[0], census_index, census_type),
            this.executeMultipleESQueries(query[2], census_index, census_type)
        ];
        Q.all(promises).then( function (resp) {
            var data = searchUtils.populateDataWithMappings(resp[0], 'bridge_race', 'pop');
            var mapData = searchUtils.populateDataWithMappings(resp[1], 'bridge_race', 'pop');
            data.data.nested.maps = mapData.data.nested.maps;
            if (isStateSelected) {
                searchUtils.applySuppressions(data, 'bridge_race');
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
                searchUtils.applySuppressions(results, 'bridge_race');
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
ElasticClient.prototype.aggregateNatalityData = function(query, isStateSelected){
    //get tge elastic search client for natality index
    var self = this;
    var deferred = Q.defer();
    if(query[1]) {
        logger.debug("Natality ES Query: "+ JSON.stringify( query[0]));
        logger.debug("Census Rates ES Query: "+ JSON.stringify( query[1]));
        var promises = [
            this.executeMultipleESQueries(query[0], natality_index, natality_type),
            this.aggregateCensusDataQuery(query[1], census_rates_index, census_rates_type, 'pop')
        ];
        Q.all(promises).then( function (resp) {

            var data = searchUtils.populateDataWithMappings(resp[0], 'natality');
            self.mergeWithCensusData(data, resp[1], 'pop');
            if (isStateSelected) {
                searchUtils.applySuppressions(data, 'natality');
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
            var data = searchUtils.populateDataWithMappings(resp, 'natality');
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    return deferred.promise;
};

ElasticClient.prototype.aggregateInfantMortalityData = function (query, isStateSelected) {
    var self = this;
    var deferred = Q.defer();
    if(query[1]) {
        logger.debug("Infant Mortality ES Query: "+ JSON.stringify( query[0]));
        logger.debug("Census Rates ES Query: "+ JSON.stringify( query[1]));
        var promises = [
            this.executeESQuery(infant_mortality_index, infant_mortality_type, query[0]),
            this.aggregateCensusDataQuery(query[1], natality_index, natality_type, 'doc_count')
        ];
        Q.all(promises).then( function (resp) {
            var data = searchUtils.populateDataWithMappings(resp[0], 'infant_mortality');
            self.mergeWithCensusData(data, resp[1], 'doc_count');
            isStateSelected && searchUtils.applySuppressions(data, 'infant_mortality');
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });

    }
    else {
        logger.debug("Infant Mortality ES Query: "+ JSON.stringify( query[0]));
        this.executeESQuery(infant_mortality_index, infant_mortality_type, query[0])
            .then(function (response) {
                var data = searchUtils.populateDataWithMappings(response, 'infant_mortality');
                isStateSelected && searchUtils.applySuppressions(data, 'infant_mortality');
                deferred.resolve(data);
            }, function (error) {
                logger.error(error.message);
                deferred.reject(error);
            });
    }
    return deferred.promise;
};

ElasticClient.prototype.aggregateDiseaseData = function (query, diseaseName, indexName, indexType, isStateSelected) {
    var self = this;
    var deferred = Q.defer();
    if(query[1]) {
        logger.debug("ES Query for "+ diseaseName+ " :"+ JSON.stringify( query[0]));
        logger.debug("ES Query for "+ diseaseName+ " to get population count:"+ JSON.stringify( query[1]));
        logger.debug("ES Query for "+ diseaseName+ " Map Query:"+ JSON.stringify( query[2]));
        logger.debug("ES Query for "+ diseaseName+ " Chart Query Array :"+ JSON.stringify( query[3]));
        var promises = [
            this.executeESQuery(indexName, indexType, query[0]),
            this.executeESQuery(indexName, indexType, query[2])
        ];
        //Add all population queries to promise
        query[1].forEach(function(eachQuery){
            //Using aggregateCensusDataQuery method to get STD population data
            promises.push(self.aggregateCensusDataQuery(eachQuery, indexName, indexType, 'pop'));
        });
        //Add all chart queries to promise
        query[3].forEach(function(chartQuery){
            promises.push(self.executeESQuery(indexName, indexType, chartQuery));
        });
        Q.all(promises).then( function (resp) {
            var data = searchUtils.populateDataWithMappings(resp[0], diseaseName, 'cases');
            var mapData = searchUtils.populateDataWithMappings(resp[1], diseaseName, 'cases');
            //get each chart query response and populate data with mappings
            for(i=0; i< query[3].length; i++ ){
                //chart response index depends on population query array length
                var respIndex = i + 3 + (query[1].length-1);
                var chartData = searchUtils.populateDataWithMappings(resp[respIndex], diseaseName, 'cases');
                data.data.nested.charts.push(chartData.data.nested.charts[i]);
            }
            data.data.nested.maps = mapData.data.nested.maps;
            //merge all population queries and call mergeWithCensusData method
            var populationResponse;
            for(i=0; i< query[1].length; i++) {
                //Merging all population response
                //When i == 0 prepare 'populationResponse' and then merge 'x.data.nested.charts' into 'populationResponse' variable
                i == 0 ? populationResponse = resp[i+2] : populationResponse.data.nested.charts.push(resp[i + 2].data.nested.charts[i-1]);
            }
            self.mergeWithCensusData(data, populationResponse, 'pop');
            isStateSelected && searchUtils.applySuppressions(data, indexType, 4);
            deferred.resolve(data);
        }, function (err) {
            logger.error(err.message);
            deferred.reject(err);
        });
    }
    else {
        logger.debug("ES Query for "+ diseaseName+ " :"+ JSON.stringify( query[0]));
        this.executeESQuery(indexName, indexType, query[0]).then(function (response) {
            var data = searchUtils.populateDataWithMappings(response, diseaseName, 'cases');
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
    client.create({
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
    var query = {"size": 1000,"filter":{"and":{"filters":[{"term":{"dataset":dataset}}]}}};
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

ElasticClient.prototype.getCountForYearByFilter = function (year, filter, option) {
    var client = this.getClient();
    var target = {};
    target[filter] = option;
    return client.count({
        index: infant_mortality_index,
        type: infant_mortality_type,
        body: {
            query: {
                bool: {
                    must: [
                        { match: { 'year_of_death': year } },
                        { match: target }
                    ]
                }
            }
        }
    }).then(function (data) {
        return data;
    }).catch(function (error) {
        logger.error('Failed to get count for ', filter, ' ', error);
        return error;
    });
};

module.exports = ElasticClient;
