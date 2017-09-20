'use strict';
(function() {
    angular
        .module('owh')
        .component('owhTableCell', {
            templateUrl: 'app/components/owh-table/owhTableCell.html',
            controller: OWHTableCellController,
            controllerAs: 'otcc',
            bindings: {
                cell: '<',
                tableView: '@',
                rowIndex: '<',
                colIndex: '<',
                row: '<'
            }
        });
    OWHTableCellController.$inject = ['$scope', 'utilService', '$rootScope'];
    function OWHTableCellController($scope, $rootScope) {
        var otcc = this;
        otcc.isNumber = angular.isNumber;
        
        otcc.getRateVisibility = function(deaths, pop) {
            if(deaths === 'suppressed' || pop === 'suppressed') {
                return 'suppressed';
            }
            if(!pop) {
                return 'na';
            }
            if(deaths < 20) {
                return 'unreliable';
            }
            return 'visible';
        }
    }
}());
