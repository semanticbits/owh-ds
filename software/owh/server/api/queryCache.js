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
    var resultCopy = JSON.parse(JSON.stringify(result));
    var queryCache = {dataset: dataset, queryID: queryId};
    queryCache.data = JSON.stringify(resultCopy.queryJSON);

    var chartCache = {dataset: dataset, queryID: queryId};
    chartCache.data = resultCopy.resultData.nested.charts;

    var resultCache = {dataset: dataset, queryID: queryId};
    resultCache.data = resultCopy.resultData;
    resultCache.data.nested.charts = [];

    var sideFilterCache = {dataset: dataset, queryID: queryId};
    sideFilterCache.data = resultCopy.sideFilterResults;

    var deferred = Q.defer();
    var es = new elasticSearch();
    var indexTypes = ['queryData', 'tableData', 'chartsData', 'sideFilterData'];
    [queryCache, resultCache, chartCache, sideFilterCache].forEach(function (cache, index) {
        es.insertQueryData(cache, indexTypes[index]).then(function (resp){
            logger.info("Query with " + queryId + " added to query cache");
            deferred.resolve(resp);
        }, function (err) {
            logger.warn("Unable to add query "+ queryId + " to query cache");
            deferred.reject(err);
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