'use strict';
(function() {
    angular
        .module('owh').directive('loading', loadingDirective);
    loadingDirective.$inject = ['$http', '$rootScope'];

    function loadingDirective($http, $rootScope) {
        var directive = {
            restrict: 'A',
            link: link
        };
        function link(scope, element, attrs) {
            //create spinner
            if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
            {
                element.append('<div class="ie-loading"><div class="loading-message">Loading...</div></div>');
            } else {
                var spinner = new Spinner({radius:20, width:8, length: 10, color:'#6f399a'}).spin();
                element.append(spinner.el);
            }


            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (value) {
                if (value) {
                    $rootScope.requestProcessing = true;
                    element.removeClass('ng-hide');
                } else {
                    $rootScope.requestProcessing = false;
                    element.addClass('ng-hide');
                }
            });
        }
        return directive;
    }
}());