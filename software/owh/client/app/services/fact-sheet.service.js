(function(){
    'use strict';
    angular
        .module('owh.services')
        .service('factSheetService', factSheetService);

    factSheetService.$inject = ["$q", "SearchService"];

    function factSheetService ($q, SearchService) {
        var service = {
            prepareFactSheetForState: prepareFactSheetForState
        };

        return service;

        function prepareFactSheetForState(state, fsType, queryID) {
            var deferred = $q.defer();
            SearchService.getFactSheetForState(state, fsType, queryID).then(function (response) {
                var fsData = response.data;
                deferred.resolve(fsData);
            });
            return deferred.promise;
        }
    }
}());
