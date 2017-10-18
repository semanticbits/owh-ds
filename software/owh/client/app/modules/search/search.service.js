(function(){
    angular
        .module('owh.search')
        .service('SearchService', SearchService);

    SearchService.$inject = ["$q", "API"];

    function SearchService($q, API){
        var service = {
            searchResults : searchResults,
            uploadImage : uploadImage,
            generateHashCode : generateHashCode,
            getDsMetadata: getDsMetadata,
            SVGtoPNG:SVGtoPNG,
            getFactSheetForState:getFactSheetForState
        };
        return service;

        function searchResults(primaryFilter, queryID) {
            var deferred = $q.defer();
            API.search({q:primaryFilter, qID:queryID}).$promise.then(onComplete).catch(onFailed);
            function onComplete(response) { deferred.resolve(response); }
            function onFailed(error) { deferred.reject(error) }
            return deferred.promise;
        }

        function uploadImage(data) {
            var deferred = $q.defer();
            API.upload({q:{data:data}}).$promise.then(onComplete).catch(onFailed);
            function onComplete(response) { deferred.resolve(response); }
            function onFailed(error) { deferred.reject(error) }
            return deferred.promise;
        }

        function generateHashCode(query) {
            var deferred = $q.defer();
            API.generateHashCode({q:query}).$promise.then(onComplete).catch(onFailed);
            function onComplete(response) { deferred.resolve(response); }
            function onFailed(error) { deferred.reject(error) }
            return deferred.promise;
        }

        function getDsMetadata(dataset, years) {
            var deferred = $q.defer();
            API.getDsMetadata({dataset:dataset, years:years}).$promise.then(onComplete).catch(onFailed);
            function onComplete(response) { deferred.resolve(response); }
            function onFailed(error) { deferred.reject(error) }
            return deferred.promise;
        }

        function SVGtoPNG(svg) {
            var deferred = $q.defer();
            API.convertSVGtoPNG({svg:svg}).$promise.then(onComplete).catch(onFailed);
            function onComplete(response) { deferred.resolve(response); }
            function onFailed(error) { deferred.reject(error) }
            return deferred.promise;
        }

        function getFactSheetForState(state, fsType, queryID) {
            var deferred = $q.defer();
            API.getFactSheet({state:state, fsType:fsType, qID: queryID}).$promise.then(onComplete).catch(onFailed);
            function onComplete(response) {
                deferred.resolve(response);
            }
            function onFailed(error) {
                deferred.reject(error)
            }
            return deferred.promise;
        }
    }

}());