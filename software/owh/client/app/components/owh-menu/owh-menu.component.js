'use strict';

(function() {
    angular.module('owh')
        .component('owhMenu', {
            templateUrl: 'app/components/owh-menu/owhMenu.html',
            controller: MenuController,
            controllerAs: 'mc',
            bindings:{
                showMeOptions: '<',
                onPrimaryFilter:'&',
                onViewFilter:'&',
                categoryName: '&',
                tableName: '&',
                selectedFilter: '<',
                filterValues: '<',
                searchResults: '&'
            }
        });

    MenuController.$inject = ['$scope','$log','$q','$timeout','utilService'];

    function MenuController($scope, $log, $q, $timeout, utilService) {
        var mc = this;
        mc.displayCategory = false;
        mc.showMenu = showMenu;
        mc.showCategory = showCategory;
        mc.changeFilter = changeFilter;
        mc.goForward = goForward;
        mc.goBackward = goBackward;
        mc.updateGroupByFilter = updateGroupByFilter;
        mc.updateFilterByText = updateFilterByText;
        mc.getSelectedFilterTitles = getSelectedFilterTitles;
        mc.groupByFiltersUpdated = groupByFiltersUpdated;

        mc.$onChanges = function() {
            var filters = [];
            if(['number_of_deaths', 'crude_death_rates',
                    'age-adjusted_death_rates'].indexOf(mc.selectedFilter.tableView) !== -1) {
                filters = mc.showMeOptions.deaths;
            } else {
                filters = mc.showMeOptions[mc.selectedFilter.key];
            }
            angular.forEach(filters, function(filter) {
                if(filter.key === mc.selectedFilter.tableView) {
                    mc.selectedShowFilter = filter;
                }
            });
        };
        function showMenu() {
            mc.displayMenu = !mc.displayMenu;
        }

        function showCategory() {
            mc.displayCategory = !mc.displayCategory;
        }

        function goForward() {
            window.history.forward();
        }

        function goBackward(){
            window.history.back();
        }

        function updateGroupByFilter(filter) {
            if(filter.groupBy) {
                filter.groupBy = false;
            }

            else {
                filter.groupBy = filter.defaultGroup;
            }

            mc.searchResults({});
        }

        function getSelectedFilterTitles() {
            var titles = [];

           for (var x = 0; x < mc.selectedFilter.allFilters.length; x++) {
               titles.push(mc.selectedFilter.allFilters[x].title);
           }

           return titles;
        }

        function updateFilterByText(text) {
            //text = text || document.getElementById("filterAdd").value;

            for (var x = 0; x < mc.selectedFilter.allFilters.length; x++) {
                if (text == mc.selectedFilter.allFilters[x].title) {
                    mc.updateGroupByFilter(mc.selectedFilter.allFilters[x]);
                }
            }
            mc.searchResults({});
        }

        function groupByFiltersUpdated(added) {
            var selectedFilterKeys = utilService.getValuesByKey(mc.selectedFilter.value, 'key');
            angular.forEach(mc.selectedFilter.allFilters, function(eachGroupByFilter) {
                if(!eachGroupByFilter.donotshowOnSearch && selectedFilterKeys.indexOf(eachGroupByFilter.key) < 0) {
                    eachGroupByFilter.groupBy = false;
                }
            });
            if(added && utilService.isValueNotEmpty(mc.selectedFilter.value)) {
                mc.selectedFilter.value[mc.selectedFilter.value.length - 1].groupBy =
                    mc.selectedFilter.value[mc.selectedFilter.value.length - 1].defaultGroup;
            }
            if(mc.selectedFilter.initiated) {
                mc.searchResults({});
            }
        }
        function changeFilter(filterKey) {
            mc.displayMenu = false;
            mc.onPrimaryFilter({newFilter:filterKey})
        }
    }
}());