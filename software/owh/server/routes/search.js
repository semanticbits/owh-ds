var result = require('../models/result');
var elasticSearch = require('../models/elasticSearch');
var queryBuilder = require('../api/elasticQueryBuilder');
var wonder = require("../api/wonder");
var yrbs = require("../api/yrbs");
var searchUtils = require('../api/utils');
var logger = require('../config/logging')
var qc = require('../api/queryCache');
var dsmetadata = require('../api/dsmetadata');
var Q = require('q');

var queryCache = new qc();

var searchRouter = function(app, rConfig) {
    app.post('/search', function (req, res) {
        var q = req.body.q;
        logger.debug("Incoming RAW query: ", JSON.stringify(q));
        var queryId = req.body.qID;
        if (queryId) {
            queryCache.getCachedQuery(queryId).then(function (r) {
                if(r) {
                   logger.info("Retrieved query results for query ID " + queryId + " from query cache");
                    var resData = {};
                    resData.queryJSON = JSON.parse(r._source.queryJSON);
                    resData.resultData = JSON.parse(r._source.resultJSON);
                    resData.sideFilterResults = JSON.parse(r._source.sideFilterResults);
                    res.send(new result('OK', resData, "success"));
                }else{
                     logger.info("Query with ID " + queryId + " not in cache, executing query");
                    if (q) {
                        res.connection.setTimeout(0); // To avoid the post callback being called multiple times when the search method takes long time
                        search(q).then(function (resp) {
                            queryCache.cacheQuery(queryId, q.key, resp);
                            res.send(new result('OK', resp, "success"));
                        }, function (err) {
                            res.send(new result('Error executing query', err, "failed"));
                        });
                    } else {
                        res.send(new result('No query data present in request, unable to run query', q , "failed"));
                    }
                }
            });
        } else {
            logger.warn('Query ID not present, query failed');
            res.send(new result('Query ID not present', null, "failed"));
        }
    });

    app.get('/yrbsQuestionsTree/:years', function (req, res) {
        var years = req.params.years.split(',');
        new yrbs().getQuestionsTreeByYears(years).then(function (response) {
            res.send(new result('OK', response, "success"));
        });
    });

    app.get('/pramsQuestionsTree', function (req, res) {
        new yrbs().getPramsQuestionsTree().then(function(response) {
            res.send(new result('OK', response, "success"));
        });
    });

    app.get('/dsmetadata/:dataset', function(req, res) {
        var dataset = req.params.dataset
        var years = req.query.years?req.query.years.split(','):[];
        new dsmetadata().getDsMetadata(dataset, years).then( function (resp) {
            res.send( new result('OK', resp, "success") );
        }, function (err) {
            res.send(new result('Error retrieving dataset metadata', err, "failed"));
        });
    });
};


function search(q) {
    var deferred = Q.defer();
    var preparedQuery = queryBuilder.buildAPIQuery(q);
    console.log('preparedQuery', preparedQuery);
    var finalQuery = '';
    var stateFilter = {};
    q.sideFilters.forEach(function(category) {
        category.sideFilters.forEach(function(filter) {
            if(filter.key === 'state') {
                stateFilter = filter;
            }
        })
    });

    var isStateSelected = queryBuilder.isFilterApplied(stateFilter);

    logger.debug("Incoming query: ", JSON.stringify(preparedQuery));
    if (preparedQuery.apiQuery.searchFor === "deaths") {
        finalQuery = queryBuilder.buildSearchQuery(preparedQuery.apiQuery, true);
        var sideFilterQuery = queryBuilder.buildSearchQuery(queryBuilder.addCountsToAutoCompleteOptions(q), true);
        finalQuery.wonderQuery = preparedQuery.apiQuery;
        new elasticSearch().aggregateDeaths(sideFilterQuery, isStateSelected).then(function (sideFilterResults) {
            new elasticSearch().aggregateDeaths(finalQuery, isStateSelected).then(function (response) {
                var resData = {};
                resData.queryJSON = q;
                resData.resultData = response.data;
                resData.sideFilterResults = sideFilterResults;
                deferred.resolve(resData);
            });
        });
    } else if (preparedQuery.apiQuery.searchFor === "mental_health") {
        preparedQuery['pagination'] = {from: 0, size: 10000};
        preparedQuery.apiQuery['pagination'] = {from: 0, size: 10000};
        new yrbs().invokeYRBSService(preparedQuery.apiQuery).then(function (response) {
            var resData = {};
            resData.queryJSON = q;
            resData.resultData = response;
            resData.sideFilterResults = [];
            deferred.resolve(resData);
        });
    } else if(preparedQuery.apiQuery.searchFor === "prams") {
        preparedQuery['pagination'] = {from: 0, size: 10000};
        preparedQuery.apiQuery['pagination'] = {from: 0, size: 10000};
        new yrbs().invokeYRBSService(preparedQuery.apiQuery).then(function (response) {
            var resData = {};
            resData.queryJSON = q;
            resData.resultData = response;
            resData.sideFilterResults = [];
            deferred.resolve(resData);
        });
    } else if (preparedQuery.apiQuery.searchFor === "bridge_race") {
        finalQuery = queryBuilder.buildSearchQuery(preparedQuery.apiQuery, true);

        //build query for total counts that will be displyed in side filters
        var sideFilterTotalCountQuery = queryBuilder.addCountsToAutoCompleteOptions(q);
        sideFilterTotalCountQuery.countQueryKey = 'pop';
        var sideFilterQuery = queryBuilder.buildSearchQuery(sideFilterTotalCountQuery, true);

        new elasticSearch().aggregateCensusData(sideFilterQuery[0], isStateSelected).then(function (sideFilterResults) {
            new elasticSearch().aggregateCensusData(finalQuery[0], isStateSelected).then(function (response) {
                var resData = {};
                resData.queryJSON = q;
                resData.resultData = response.data;
                resData.resultData.headers = preparedQuery.headers;
                resData.sideFilterResults = sideFilterResults;
                deferred.resolve(resData);
            });
        });
    } else if (preparedQuery.apiQuery.searchFor === "natality") {
        finalQuery = queryBuilder.buildSearchQuery(preparedQuery.apiQuery, true);

        var sideFilterQuery = queryBuilder.buildSearchQuery(queryBuilder.addCountsToAutoCompleteOptions(q), true);
        new elasticSearch().aggregateNatalityData(sideFilterQuery).then(function (sideFilterResults) {
            if(q.tableView === 'fertility_rates' && finalQuery[1]) {
                var query1 = JSON.stringify(finalQuery[1]);
                //For Natality Fertility Rates add mother's age filter
                finalQuery[1] = queryBuilder.addFiltersToCalcFertilityRates(JSON.parse(query1));
            }
            new elasticSearch().aggregateNatalityData(finalQuery).then(function (response) {
                var resData = {};
                resData.queryJSON = q;
                resData.resultData = response.data;
                resData.resultData.headers = preparedQuery.headers;
                resData.sideFilterResults = sideFilterResults;
                deferred.resolve(resData);
            });
        });

    }
    return  deferred.promise;
};

module.exports = searchRouter;

