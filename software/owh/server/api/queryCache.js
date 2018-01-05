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
    var insertQuery = {};
    insertQuery.queryJSON = JSON.stringify(result.queryJSON);
    insertQuery.resultJSON = JSON.stringify(result.resultData);
    insertQuery.sideFilterResults = JSON.stringify(result.sideFilterResults);
    insertQuery.dataset = dataset;
    insertQuery.lastupdated = new Date();
    insertQuery.queryID = queryId;
    var deferred = Q.defer();
    new elasticSearch().insertQueryData(insertQuery).then(function (resp){
        logger.info("Qeury with " + queryId + " added to query cache");
        deferred.resolve(resp);
    }, function (err) {
        logger.warn("Unable to add query "+ hashCode + " to query cache");
        deferred.reject(err);
    })
    .catch(function(err){
        logger.error("Unable to add query "+ hashCode + " to query cache");
        deferred.reject(err);
    });
    return deferred.promise;
}

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