(function () {
    'use strict';
    angular
        .module('owh')
        .component('listSelectedFilters', {
                templateUrl: 'app/components/list-selected-filter-options/listSelectedFilters.html',
                controller: ListAppliedFiltersController,
                controllerAs: 'lfc',
                bindings:{
                    filters: "<",
                    sort: '<'
                }
        });

    ListAppliedFiltersController.$inject = ['utilService'];
    
    function ListAppliedFiltersController(utilService) {

        var lfc = this;
        lfc.getFilterOrder = getFilterOrder;
        lfc.getSelectedOptionTitlesOfFilter = getSelectedOptionTitlesOfFilter;
        lfc.appliedFilters = getAppliedFilters();

        //Determines the filter's display order
        function getFilterOrder(filter) {
            return lfc.sort.indexOf(filter.key);
        }

        //Returns applied filters
        function getAppliedFilters() {
            var appliedFilters = [];
            angular.forEach(lfc.filters, function(filter){
                (filter.value.length > 0 && filter.key != 'question') && appliedFilters.push(filter)
            });
            return appliedFilters;
        }

        //get selected options' titles of a filter
        function getSelectedOptionTitlesOfFilter(filter) {
            var options = [];
            //filters options with checkboxes
            if (angular.isArray(filter.value)) {
                angular.forEach(filter.value, function (optionKey) {
                    var option = utilService.findByKeyAndValueRecursive(filter.autoCompleteOptions, 'key', optionKey, "options");
                    option&&options.push(option.title);
                });
            } else {//for filters with radios
                var option = utilService.findByKeyAndValue(filter.autoCompleteOptions, 'key', filter.value);
                options.push(option.title);
            }

            return options.join(', ');
        }
    }
}());