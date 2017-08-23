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
var config = require('../config/config');

var queryCache = new qc();

var searchRouter = function(app, rConfig) {
    app.post('/search', function (req, res) {
        var q = req.body.q;
        logger.debug("Incoming RAW query: ", JSON.stringify(q));
        var queryId = req.body.qID;
        if (queryId) {
            queryCache.getCachedQuery(queryId).then(function (r) {
                if(r && !config.disableQueryCache) {
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
                            if(!config.disableQueryCache) {
                                queryCache.cacheQuery(queryId, q.key, resp);
                            }
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

    app.get('/yrbsQuestionsTree', function (req, res) {
        new yrbs().getYRBSQuestionsTree().then(function (response) {
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
    var finalQuery = '';

    var stateFilter = queryBuilder.findFilterByKeyAndValue(q.allFilters, 'key', 'state');
    var isStateSelected = queryBuilder.isFilterApplied(stateFilter);

    logger.debug("Incoming query: ", JSON.stringify(preparedQuery));
    if (preparedQuery.apiQuery.searchFor === "deaths") {
        finalQuery = queryBuilder.buildSearchQuery(preparedQuery.apiQuery, true);
        var sideFilterQuery = queryBuilder.buildSearchQuery(queryBuilder.addCountsToAutoCompleteOptions(q), true);
        // Invoke WONDER only for age_adjusted_rates view
        if(q.tableView == 'age-adjusted_death_rates') {
            finalQuery.wonderQuery = preparedQuery.apiQuery;
        }
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

        new elasticSearch().aggregateCensusData(sideFilterQuery, isStateSelected).then(function (sideFilterResults) {
            new elasticSearch().aggregateCensusData(finalQuery, isStateSelected).then(function (response) {
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
        new elasticSearch().aggregateNatalityData(sideFilterQuery, isStateSelected).then(function (sideFilterResults) {
            if(q.tableView === 'fertility_rates' && finalQuery[1]) {
                var query1 = JSON.stringify(finalQuery[1]);
                //For Natality Fertility Rates add mother's age filter
                finalQuery[1] = queryBuilder.addFiltersToCalcFertilityRates(JSON.parse(query1));
            }
            new elasticSearch().aggregateNatalityData(finalQuery, isStateSelected).then(function (response) {
                var resData = {};
                resData.queryJSON = q;
                resData.resultData = response.data;
                resData.resultData.headers = preparedQuery.headers;
                resData.sideFilterResults = sideFilterResults;
                deferred.resolve(resData);
            });
        });

    } else if (preparedQuery.apiQuery.searchFor === 'infant_mortality') {
        finalQuery = queryBuilder.buildSearchQuery(preparedQuery.apiQuery, true);
        //Get all selected filter options
        var allSelectedFilterOptions = searchUtils.getAllSelectedFilterOptions(q, preparedQuery.apiQuery.query);
        var sideFilterQuery = queryBuilder.buildSearchQuery(queryBuilder.addCountsToAutoCompleteOptions(q), true);
        var selectedYears = searchUtils.getYearFilter(q.allFilters);
        var groupByOptions = searchUtils.getSelectedGroupByOptions(q.allFilters);
        var options = selectedYears.reduce(function (prev, year) {
            var clone = JSON.parse(JSON.stringify(groupByOptions));
            return prev.concat(clone.map(function (option) {
                option.year = year;
                return option;
            }));
        }, []);
        var es = new elasticSearch();
        /*var optionPromises = options.map(function (option) {
            return es.getCountForYearByFilter(option.year, option.filter, option.key);
        });*/
        var promises = [
            es.aggregateInfantMortalityData([finalQuery,preparedQuery.apiQuery], isStateSelected, allSelectedFilterOptions, selectedYears)
        ];
        //promises = promises.concat(optionPromises);

        Q.all(promises).then(function (response) {
            //var optionResults = Array.prototype.slice.call(arguments, 2);
            //var lineChartData = searchUtils.mapAndGroupOptionResults(options, optionResults);
            var resData = {};
            resData.queryJSON = q;
            resData.resultData = response[0].data;
            //resData.resultData.nested.lineCharts = lineChartData;
            resData.resultData.headers = preparedQuery.headers;
            resData.sideFilterResults = {data: [], pagination: {}}//sideFilterResults;
            deferred.resolve(resData);
        }).catch(function (error) {
            logger.error('Infant Mortality ElasticSearch ', error);
            deferred.reject(error);
        });
    } else if (preparedQuery.apiQuery.searchFor === 'std' ||
        preparedQuery.apiQuery.searchFor === 'tb' ||
        preparedQuery.apiQuery.searchFor === 'aids') {
        finalQuery = queryBuilder.buildSearchQuery(preparedQuery.apiQuery, true, searchUtils.getAllOptionValues());
        sideFilterTotalCountQuery = queryBuilder.addCountsToAutoCompleteOptions(q);
        sideFilterTotalCountQuery.countQueryKey = 'cases';
        sideFilterQuery = queryBuilder.buildSearchQuery(sideFilterTotalCountQuery, true);
        var indexName, indexType;
        if (preparedQuery.apiQuery.searchFor === 'std') {
            indexName = 'owh_std'; indexType = 'std';
        } else if (preparedQuery.apiQuery.searchFor === 'tb') {
            indexName = 'owh_tb'; indexType = 'tb';
        } else if (preparedQuery.apiQuery.searchFor === 'aids') {
            indexName = 'owh_aids'; indexType = 'aids';
        }
        new elasticSearch().aggregateDiseaseData(sideFilterQuery, preparedQuery.apiQuery.searchFor, indexName, indexType, isStateSelected).then(function (sideFilterResults) {
            new elasticSearch().aggregateDiseaseData(finalQuery, preparedQuery.apiQuery.searchFor, indexName, indexType, isStateSelected).then(function (response) {
                var resData = {};
                resData.queryJSON = q;
                resData.resultData = response.data;
                resData.resultData.headers = preparedQuery.headers;
                resData.sideFilterResults = sideFilterResults;
                deferred.resolve(resData);
            });
        });
    } else if (preparedQuery.apiQuery.searchFor === 'cancer_incident' || preparedQuery.apiQuery.searchFor === 'cancer_mortality') {
        finalQuery = queryBuilder.buildSearchQuery(preparedQuery.apiQuery, true);
        var sideFilterQuery = queryBuilder.buildSearchQuery(queryBuilder.addCountsToAutoCompleteOptions(q), true);
        var es = new elasticSearch();
        Q.all([
            es.aggregateCancerData(sideFilterQuery, preparedQuery.apiQuery.searchFor),
            es.aggregateCancerData(finalQuery, preparedQuery.apiQuery.searchFor)
        ]).spread(function (sideFilterResults, results) {
            var resData = {};
            resData.queryJSON = q;
            searchUtils.applySuppressions(results, preparedQuery.apiQuery.searchFor, 16);
            var isStateFilterApplied = searchUtils.isFilterApplied(stateFilter);
            var appliedFilters = searchUtils.findAllAppliedFilters(q.allFilters);
            if (preparedQuery.apiQuery.searchFor === 'cancer_incident' && isStateFilterApplied && appliedFilters.length) {
                var rules = searchUtils.createCancerIncidenceSuppressionRules()
                searchUtils.applyCustomSuppressions(results.data.nested, rules, preparedQuery.apiQuery.searchFor);
            }
            resData.resultData = results.data;
            resData.resultData.headers = preparedQuery.headers;
            resData.sideFilterResults = sideFilterResults;
            deferred.resolve(resData);
        });
    };
    return  deferred.promise;
};

module.exports = searchRouter;
