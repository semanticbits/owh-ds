(function(){
    'use strict';
    angular
        .module('owh.services')
        .service('factSheetService', factSheetService);

    factSheetService.$inject = ["$q", "SearchService"];

    function factSheetService ($q, SearchService) {
        var service = {
            prepareFactSheetForState: prepareFactSheetForState,
            prepareFactSheetForNation: prepareFactSheetForNation,
            prepareWomenFactSheetMenData: prepareWomenFactSheetMenData
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

        function prepareFactSheetForNation(fsType, queryID) {
            var deferred = $q.defer();
            //state - undefined will fetch nation data.
            SearchService.getFactSheetForState(undefined, fsType, queryID).then(function (response) {
                var fsData = response.data;
                deferred.resolve(fsData);
            });
            return deferred.promise;
        }

        function prepareWomenFactSheetMenData(state, fsType, queryID) {
            var deferred = $q.defer();
            //state - undefined will fetch nation data.
            SearchService.getFactSheetForState(state, fsType, queryID, 'male').then(function (response) {
                var fsData = response.data;
                deferred.resolve(fsData);
            });
            return deferred.promise;
        }
    }
}());
