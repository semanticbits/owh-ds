var Q = require('q');
var logger = require('../config/logging');
var elasticSearch = require('../models/elasticSearch');

function queryCache() {
}

/**
 * Get a cached query with the given id
 * returns null if not found or error
 * @param queryId
 */
queryCache.prototype.getCachedQuery = function (queryId) {
    var queryChacheQuery = buildQueryCacheQuery(queryId);
    return new elasticSearch().getQueryCache(queryChacheQuery);
}

/**
 * Cache the give query in cache index
 * @param q
 * @param result
 * @param sideFilterResults
 */
queryCache.prototype.cacheQuery = function (queryId, dataset, result) {
    var resultCopy =  JSON.parse((JSON.stringify(result)));
    var queryCache = {dataset: dataset, datatype:'query', queryID: queryId, lastupdated: new Date()};
    queryCache.dataDoc = JSON.stringify(resultCopy.queryJSON);
    var es = new elasticSearch();

    //for non stats data-sets
    if (resultCopy.resultData.table == undefined) {
        var simpleData = {dataset: dataset, datatype:'simple', queryID: queryId, lastupdated: new Date() };
        simpleData.dataDoc = JSON.stringify(resultCopy.resultData.simple);
        resultCopy.resultData.simple = [];
        es.insertQueryData(simpleData).then(function (resp){
            logger.info("Chart data with " + queryId + " added to query cache");
        }, function (err) {
            logger.warn("Unable to add query "+ queryId + " to query cache");
        });
    }

    var resultCache = {dataset: dataset, datatype:'result', queryID: queryId, lastupdated: new Date()};
    resultCache.dataDoc = JSON.stringify(resultCopy.resultData);

    var sideFilterCache = {dataset: dataset, datatype:'sitefilter', queryID: queryId, lastupdated: new Date()};
    sideFilterCache.dataDoc = JSON.stringify(resultCopy.sideFilterResults);

    [queryCache, resultCache, sideFilterCache].forEach(function (cache) {
        es.insertQueryData(cache).then(function (resp){
            logger.info("Query with " + queryId + " added to query cache");
        }, function (err) {
            logger.warn("Unable to add query "+ queryId + " to query cache");
        });
    });
};

/**
 * Build query cache query sting
 */
function buildQueryCacheQuery (hashcode) {
    var searchQuery = {
        "query": {
            "term": {
                "queryID": hashcode
            }
        }
    }
    return searchQuery;
};


module.exports = queryCache;