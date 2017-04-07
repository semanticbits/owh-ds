var elasticSearch = require('../models/elasticSearch');
var Q = require('q');
var logger = require('../config/logging');

/**
 * Query dsnmeatadata for the given dataset and years and return a merged set of
 * filters and options common across the selected years
 * @param app
 * @param rConfig
 */

function dsmetadata() {}

dsmetadata.prototype.getDsMetadata = function (dataset, years) {
    var deferred = Q.defer();
    var self = this;
    new elasticSearch().getDsMetadata(dataset,years).then(function (resp) {
        deferred.resolve(self.processDsMetadataQueryResponse(resp));
    });
    return deferred.promise;
}


/**
 * Process the result and created a combined filter -pv list for all the selected years
 * Returns a result of the form
 *  {'race':['Asian', 'White'], 'ethnicity':['Hispanic', Not Hispanic], 'age': null}
 * @param esResp
 */
dsmetadata.prototype.processDsMetadataQueryResponse = function (esResp){
    var hits = esResp.hits.hits;
    var result = {};
    var filterByYear = {};
    for(var h in hits){
        var filter = hits[h]._source;
        var fname = filter.filter_name;
        var year = filter.year;
        if(!(fname in result)){
            result[fname] = filter.permissible_values;
        } else if (result[fname]){
            if(filter.permissible_values) {
                // get intersection of PVs
                result[fname] = result[fname].filter(item => filter.permissible_values.indexOf(item) != -1);
            }
            else {
                result[fname] = null;
            }
        }

        if(!(year in filterByYear)) {
            filterByYear[year] = [fname];
        }else{
            filterByYear[year].push(fname);
        }
    }

    // Remove all filters that are not present in all years and filter options list empty
    for (f in result){
        if (result[f] && result[f].length == 0){
            delete result[f];
        }

        for (y in filterByYear) {
            if (filterByYear[y].indexOf(f) < 0) {
                delete result[f];
            }
        }
    }
    logger.debug("processing metadata query response completed.");
    return result;
}

module.exports = dsmetadata;