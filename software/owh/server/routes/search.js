var result = require('../models/result');
var elasticSearch = require('../models/elasticSearch');
var queryBuilder = require('../api/elasticQueryBuilder');
var wonder = require("../api/wonder");
var yrbs = require("../api/yrbs");
var searchUtils = require('../api/utils');
var logger = require('../config/logging')
var qc = require('../api/queryCache');
var dsmetadata = require('../api/dsmetadata');
var factSheet = require('../api/factSheet');
var minorityFactSheet = require('../api/minorityFactSheet');
var womenHealthFactSheet = require('../api/womensHealthFactsheet');
var womensOfReproductiveAgeHealthFactsheet = require('../api/womensOfReproductiveAgeHealthFactsheet');
var Q = require('q');
var config = require('../config/config');
var svgtopng = require('svg2png');
var fs = require('fs');

var queryCache = new qc();

var searchRouter = function(app, rConfig) {
    app.post('/validateCachedQuery', function (req, res) {
        var queryId = req.sanitize(req.body.qID);
        if (queryId) {
            queryCache.getCachedQuery(queryId).then(function (r) {
                if(r && !config.disableQueryCache) {
                    logger.info("Retrieved query results for query ID " + queryId + " from query cache");
                    res.send(new result('OK', {}, "success"));
                }
                else if(req.body.fsType) {
                    logger.info("Query with ID " + queryId + " not in cache, executing query");
                    res.send(new result('FAILED', 'Query ID not present', "failed"));
                } else{
                    logger.warn('Query ID not present, query failed');
                    res.send(new result('FAILED', 'Query ID not present', "failed"));
                }
            });
        } else {
            logger.warn('Query ID not present, query failed');
            res.send(new result('FAILED', 'Query ID not present', "failed"));
        }
    });
    app.post('/search', function (req, res) {
        var q = req.body.q;
        logger.debug("Incoming RAW query: ", JSON.stringify(q));
        var queryId = req.sanitize(req.body.qID);
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

    app.get('/pramsBasicQuestionsTree', function (req, res) {
        new yrbs().getPramsBasicQuestionsTree().then(function(response) {
            res.send(new result('OK', response, "success"));
        });
    });

    app.get('/pramsAdvancesQuestionsTree', function (req, res) {
        new yrbs().getPramsAdvanceQuestionsTree().then(function(response) {
            res.send(new result('OK', response, "success"));
        });
    });

    app.get('/brfsQuestionsTree/:precomputed', function (req, res) {
        var isPrecomputed = JSON.parse(req.params.precomputed);
        new yrbs().getBRFSQuestionsTree(isPrecomputed).then(function(response) {
            res.send(new result('OK', response, "success"));
        });
    });

    app.post('/factsheet', function (req, res) {
       var queryId = req.sanitize(req.body.qID);
        if (queryId) {
            queryCache.getCachedQuery(queryId).then(function (r) {
                if(r && !config.disableQueryCache) {
                    logger.info("Retrieved query results for query ID " + queryId + " from query cache");
                    var resData = {};
                    resData.queryJSON = JSON.parse(r._source.queryJSON);
                    resData.resultData = JSON.parse(r._source.resultJSON);
                    res.send(new result('OK', resData, "success"));
                }
                else if(req.body.fsType) {
                    logger.info("Query with ID " + queryId + " not in cache, executing query");
                    var state = req.sanitize(req.body.state);
                    var fsType = req.sanitize(req.body.fsType);
                    res.connection.setTimeout(0);
                    if (fsType === 'Minority Health') {
                        new minorityFactSheet().prepareFactSheet(state, fsType).then(function(response) {
                            if(!config.disableQueryCache) {
                                var resData = {};
                                resData.queryJSON = {};
                                resData.resultData = response;
                                queryCache.cacheQuery(queryId, 'fact_sheets', resData);
                            }
                            res.send(new result('OK', resData, "success"));
                        });
                    } else if (fsType === "Women and Girls Health") {
                        var sex = req.sanitize(req.body.sex);
                        new womenHealthFactSheet().prepareFactSheet(state, fsType, sex).then(function(response) {
                            if(!config.disableQueryCache) {
                                var resData = {};
                                resData.queryJSON = {};
                                resData.resultData = response;
                                queryCache.cacheQuery(queryId, 'fact_sheets', resData);
                            }
                            res.send(new result('OK', resData, "success"));
                        });
                    } else if (fsType === "Women of Reproductive Age Health") {
                        var sex = req.sanitize(req.body.sex);
                        new womensOfReproductiveAgeHealthFactsheet().prepareFactSheet(state, fsType, sex).then(function(response) {
                            if(!config.disableQueryCache) {
                                var resData = {};
                                resData.queryJSON = {};
                                resData.resultData = response;
                                queryCache.cacheQuery(queryId, 'fact_sheets', resData);
                            }
                            res.send(new result('OK', resData, "success"));
                        });
                    } else {
                        new factSheet().prepareFactSheet(state, fsType).then(function(response) {
                            if(!config.disableQueryCache) {
                                var resData = {};
                                resData.queryJSON = {};
                                resData.resultData = response;
                                queryCache.cacheQuery(queryId, 'fact_sheets', resData);
                            }
                            res.send(new result('OK', resData, "success"));
                        });
                    }
                }
                else{
                    logger.warn('Query ID not present, query failed');
                    res.send(new result('Query ID not present', null, "failed"));
                }
            });
        } else {
            logger.warn('Query ID not present, query failed');
            res.send(new result('Query ID not present', null, "failed"));
        }


    });

    app.get('/dsmetadata/:dataset', function(req, res) {
        var dataset = req.sanitize(req.params.dataset);
        var years = req.query.years?req.sanitize(req.query.years).split(','):[];
        new dsmetadata().getDsMetadata(dataset, years).then( function (resp) {
            res.send( new result('OK', resp, "success") );
        }, function (err) {
            res.send(new result('Error retrieving dataset metadata', err, "failed"));
        });
    });


    app.post('/svgtopng', function (req, res) {
        //../client/app/images/state-shapes/
        if(Array.isArray(req.body.svg)) {
            var imageDataArray = [];
            req.body.svg.forEach(function(eachSVGFile){
                var svgData = fs.readFileSync(eachSVGFile, 'utf8');
                var png = svgtopng.sync(svgData, {width: 150, height: 150});
                var response = 'data:image/png;base64,' + new Buffer(png, 'binary').toString('base64');
                imageDataArray.push(response);
            });
            res.send(new result('OK', imageDataArray, "success"));
        }
        else {
            svgtopng(req.body.svg).then(function (png) {
                var response = 'data:image/png;base64,' + new Buffer(png, 'binary').toString('base64');
                res.send(new result('OK', response, "success"));
            }).catch(function (err) {
                console.log(err);
                res.send(new result('Error converting to PNG: ' + err));
            });
        }
    });

    app.get('/getGoogAnalyInfo', function (req, res) {
        if(config.googleAnalytics) {
            var trackingID = config.googleAnalytics.trackingID;
            if(trackingID) {
                res.send(new result('OK', {trackingID: trackingID}, "success"));
            }
            else {
                res.send(new result('TrackingID not found in external configuration', {}, "failed"));
            }
        }
        else {
            res.send(new result('Google Analytics related information not found in external configuration', {}, "failed"));
        }
    });
};


function search(q) {
    var deferred = Q.defer();
    var preparedQuery = queryBuilder.buildAPIQuery(q);
    var finalQuery = '';

    var stateFilter = queryBuilder.findFilterByKeyAndValue(q.allFilters, 'key', 'state');
    var censusRegion = queryBuilder.findFilterByKeyAndValue(q.allFilters, 'key', 'census-region');
    var hhsRegion = queryBuilder.findFilterByKeyAndValue(q.allFilters, 'key', 'hhs-region');
    var isStateSelected = queryBuilder.isFilterApplied(stateFilter) || queryBuilder.isFilterApplied(censusRegion) || queryBuilder.isFilterApplied(hhsRegion);

    logger.debug("Incoming query: ", JSON.stringify(preparedQuery));
    if (preparedQuery.apiQuery.searchFor === "deaths") {
        finalQuery = queryBuilder.buildSearchQuery(preparedQuery.apiQuery, true);
        //Get all selected filter options
        var allSelectedFilterOptions = searchUtils.getAllSelectedFilterOptions(q);
        var allFilterOptions = searchUtils.getAllFilterOptions(q);
        logger.debug("Detail Mortality - selected filters and filter options: ", JSON.stringify(allSelectedFilterOptions));
        logger.debug("Detail Mortality - All Filters and filter options: ", JSON.stringify(allFilterOptions));
        var sideFilterQuery = queryBuilder.buildSearchQuery(queryBuilder.addCountsToAutoCompleteOptions(q), true);
        // Invoke WONDER only for age_adjusted_rates view
        if(q.tableView == 'age-adjusted_death_rates') {
            finalQuery.wonderQuery = preparedQuery.apiQuery;
        }
        new elasticSearch().aggregateDeaths(sideFilterQuery, isStateSelected, allFilterOptions).then(function (sideFilterResults) {
            new elasticSearch().aggregateDeaths(finalQuery, isStateSelected, allSelectedFilterOptions).then(function (response) {
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
    } else if(preparedQuery.apiQuery.searchFor === "prams"
        || preparedQuery.apiQuery.searchFor === "brfss") {
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
        var allSelectedFilterOptions = searchUtils.getAllSelectedFilterOptions(q);
        var allFilterOptions = searchUtils.getAllFilterOptions(q);
        logger.debug("Bridge Race - Selected filters and filter options: ", JSON.stringify(allSelectedFilterOptions));
        logger.debug("Bridge Race - All Filters and filter options: ", JSON.stringify(allFilterOptions));
        //build query for total counts that will be displyed in side filters
        var sideFilterTotalCountQuery = queryBuilder.addCountsToAutoCompleteOptions(q);
        sideFilterTotalCountQuery.countQueryKey = 'pop';
        var sideFilterQuery = queryBuilder.buildSearchQuery(sideFilterTotalCountQuery, true);

        new elasticSearch().aggregateCensusData(sideFilterQuery, isStateSelected).then(function (sideFilterResults) {
            new elasticSearch().aggregateCensusData(finalQuery, isStateSelected, allSelectedFilterOptions).then(function (response) {
                var resData = {};
                resData.queryJSON = q;
                resData.resultData = response.data;
                resData.resultData.headers = preparedQuery.headers;
                resData.sideFilterResults = sideFilterResults;
                deferred.resolve(resData);
            });
        });
    } else if (preparedQuery.apiQuery.searchFor === "natality") {
        preparedQuery.apiQuery.view = q.tableView;
        finalQuery = queryBuilder.buildSearchQuery(preparedQuery.apiQuery, true);
        var allSelectedFilterOptions = searchUtils.getAllSelectedFilterOptions(q);
        var allFilterOptions = searchUtils.getAllFilterOptions(q);
        logger.debug("Natality - Selected filters and filter options: ", JSON.stringify(allSelectedFilterOptions));
        logger.debug("Natality - All Filters and filter options: ", JSON.stringify(allFilterOptions));
        var sideFilterQuery = queryBuilder.buildSearchQuery(queryBuilder.addCountsToAutoCompleteOptions(q), true);
        var mapQuery = JSON.stringify(finalQuery[4]);
        //keep a copy for census rates query
        finalQuery[5] = mapQuery;
        new elasticSearch().aggregateNatalityData(sideFilterQuery, isStateSelected, allFilterOptions).then(function (sideFilterResults) {
            if(q.tableView === 'fertility_rates' && finalQuery[2]) {
                var censusQuery = JSON.stringify(finalQuery[2]);
                var censusCountQuery = JSON.stringify(finalQuery[3]);
                //For Natality Fertility Rates add mother's age filter
                finalQuery[2] = queryBuilder.addFiltersToCalcFertilityRates(JSON.parse(censusQuery));
                finalQuery[3] = queryBuilder.addFiltersToCalcFertilityRates(JSON.parse(censusCountQuery));
                finalQuery[5] = queryBuilder.addFiltersToCalcFertilityRates(JSON.parse(mapQuery));
            }
            new elasticSearch().aggregateNatalityData(finalQuery, isStateSelected, allSelectedFilterOptions).then(function (response) {
                var resData = {};
                resData.queryJSON = q;
                resData.resultData = response.data;
                resData.resultData.headers = preparedQuery.headers;
                resData.sideFilterResults = sideFilterResults;
                deferred.resolve(resData);
            });
        });

    } else if (preparedQuery.apiQuery.searchFor === 'infant_mortality') {
        var selectedYears = searchUtils.getTargetFilterValue(q.allFilters, 'year_of_death');
        var groupByOptions = searchUtils.getSelectedGroupByOptions(q.allFilters);
        var options = selectedYears.reduce(function (prev, year) {
            var clone = JSON.parse(JSON.stringify(groupByOptions));
            return prev.concat(clone.map(function (option) {
                option.year = year;
                return option;
            }));
        }, []);

        var es = new elasticSearch();
        var promises = [
            es.aggregateInfantMortalityData(preparedQuery.apiQuery, isStateSelected, selectedYears)
        ];
      Q.all(promises).then(function (response) {
            var resData = {};
            resData.queryJSON = q;
            resData.resultData = response[0].data;
            resData.resultData.headers = preparedQuery.headers;
            resData.sideFilterResults = {data: [], pagination: {}};
            deferred.resolve(resData);
        }).catch(function (error) {
            logger.error('Infant Mortality ElasticSearch ', error);
            deferred.reject(error);
        });
    } else if (preparedQuery.apiQuery.searchFor === 'std' ||
        preparedQuery.apiQuery.searchFor === 'tb' ||
        preparedQuery.apiQuery.searchFor === 'aids') {
        var allSelectedFilterOptions = searchUtils.getAllSelectedFilterOptions(q, preparedQuery.apiQuery.searchFor);
        var allFilterOptions = searchUtils.getAllFilterOptions(q);
        logger.debug(preparedQuery.apiQuery.searchFor +" - Selected filters and filter options: ", JSON.stringify(allSelectedFilterOptions));
        logger.debug(preparedQuery.apiQuery.searchFor +" -  All Filters and filter options: ", JSON.stringify(allFilterOptions));
        finalQuery = queryBuilder.buildSearchQuery(preparedQuery.apiQuery, true, searchUtils.getAllOptionValues());
        sideFilterTotalCountQuery = queryBuilder.addCountsToAutoCompleteOptions(q);
        sideFilterTotalCountQuery.countQueryKey = 'cases';
        sideFilterTotalCountQuery.filterCountsQuery = true;
        sideFilterQuery = queryBuilder.buildSearchQuery(sideFilterTotalCountQuery, true);
        var indexName, indexType;
        if (preparedQuery.apiQuery.searchFor === 'std') {
            indexName = 'owh_std'; indexType = 'std';
        } else if (preparedQuery.apiQuery.searchFor === 'tb') {
            indexName = 'owh_tb'; indexType = 'tb';
        } else if (preparedQuery.apiQuery.searchFor === 'aids') {
            indexName = 'owh_aids'; indexType = 'aids';
        }
        new elasticSearch().aggregateDiseaseData(sideFilterQuery, preparedQuery.apiQuery.searchFor, indexName, indexType, isStateSelected, allFilterOptions).then(function (sideFilterResults) {
            new elasticSearch().aggregateDiseaseData(finalQuery, preparedQuery.apiQuery.searchFor, indexName, indexType, isStateSelected, allSelectedFilterOptions).then(function (response) {
                var resData = {};
                resData.queryJSON = q;
                resData.resultData = response.data;
                resData.resultData.headers = preparedQuery.headers;
                resData.sideFilterResults = sideFilterResults;
                deferred.resolve(resData);
            });
        });
    } else if (preparedQuery.apiQuery.searchFor === 'cancer_incidence'
        || preparedQuery.apiQuery.searchFor === 'cancer_mortality') {
        var allFilterOptions = searchUtils.getAllFilterOptions(q);
        var allSelectedFilterOptions = searchUtils.getAllSelectedFilterOptions(q);
        logger.debug("Cancer -  All Filters and filter options: ", JSON.stringify(allFilterOptions));
        logger.debug("Cancer - Selected filters and filter options: ", JSON.stringify(allSelectedFilterOptions));

        finalQuery = queryBuilder.buildSearchQuery(preparedQuery.apiQuery, true);
        var dataset = preparedQuery.apiQuery.searchFor;
        var sideFilterQuery = queryBuilder.buildSearchQuery(queryBuilder.addCountsToAutoCompleteOptions(q), true);
        var es = new elasticSearch();
        Q.all([
            es.aggregateCancerData(sideFilterQuery, dataset, allFilterOptions),
            es.aggregateCancerData(finalQuery, dataset, allSelectedFilterOptions)
        ]).spread(function (sideFilterResults, results) {
            var resData = {};
            resData.queryJSON = q;
            searchUtils.applySuppressions(results, dataset, 16);

            var isStateFilterApplied = searchUtils.isFilterApplied(stateFilter);
            var appliedFilters = searchUtils.findAllAppliedFilters(q.allFilters, [ 'current_year', 'state' ]);
            if (dataset === 'cancer_incidence' && isStateFilterApplied && appliedFilters.length) {
                var years = searchUtils.getTargetFilterValue(q.allFilters, 'current_year');
                var stateGroupBy = searchUtils.getTargetFilter(q.allFilters, 'state').groupBy;
                var statesSelected = searchUtils.getTargetFilterValue(q.allFilters, 'state');
                var rules = searchUtils.createCancerIncidenceSuppressionRules(years, statesSelected, stateGroupBy);
                searchUtils.applyCustomSuppressions(results.data.nested, rules, 'cancer_incidence');
            }

            if (dataset === 'cancer_incidence') {
                searchUtils.applyCustomMapSuppressions(results.data.nested.maps, q.allFilters);
                searchUtils.applyCustomSidebarTotalSuppressions(sideFilterResults.data.simple, q.allFilters);
            }

            var hasDemographicFilters = searchUtils.hasFilterApplied(q.allFilters, [ 'race', 'hispanic_origin' ]);
            if (dataset === 'cancer_incidence' && hasDemographicFilters) {
                searchUtils.applyPopulationSpecificSuppression(results.data.nested.table, 'cancer_incidence');
            }

            if(dataset === 'cancer_mortality') {
                var cancerSiteFilter = searchUtils.getTargetFilter(q.allFilters, 'site');
                const kaposiSarcoma = '36020';
                //if only kaposi sarcoma is selected
                if(cancerSiteFilter.value.length == 1 && cancerSiteFilter.value[0] == kaposiSarcoma) {
                    searchUtils.applySuppressions(sideFilterResults, dataset, Infinity);
                    searchUtils.applySuppressions(results, dataset, Infinity);
                } else if(cancerSiteFilter.value.indexOf(kaposiSarcoma) != -1) {//if kaposi sarcoma and some other cacncer site is selected
                    var rules = [[kaposiSarcoma]];//Kaposi sarcoma
                    searchUtils.applyCustomSuppressions(results.data.nested, rules, 'cancer_mortality');
                }
            }

            searchUtils.applySidebarCountLimitSuppressions(sideFilterResults.data.simple, dataset);

            resData.resultData = results.data;
            resData.resultData.headers = preparedQuery.headers;
            resData.sideFilterResults = sideFilterResults;
            deferred.resolve(resData);
        });
    };
    return  deferred.promise;
};

module.exports = searchRouter;
