'use strict';

(function() {
    angular.module('owh')
        .component('owhMenu', {
            templateUrl: 'app/components/owh-menu/owhMenu.html',
            controller: MenuController,
            controllerAs: 'mc',
            bindings:{
                filters: '=',
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
        mc.displayMenu = false;
        mc.displayTopic = false;
        mc.displayCategory = false;
        mc.displayFilter = false;
        mc.showMenu = showMenu;
        mc.showTopic = showTopic;
        mc.showCategory = showCategory;
        mc.showFilter = showFilter;
        mc.goForward = goForward;
        mc.goBackward = goBackward;
        mc.updateGroupByFilter = updateGroupByFilter;
        mc.updateFilterByText = updateFilterByText;
        mc.getSelectedFilterTitles = getSelectedFilterTitles;
        mc.groupByFiltersUpdated = groupByFiltersUpdated;

        mc.$onChanges = function() {
            var filters = [];
            if(mc.selectedFilter.key === 'prams') {
                filters = mc.showMeOptions.prams;
            }
            else if(['number_of_deaths', 'crude_death_rates', 'age-adjusted_death_rates'].indexOf(mc.selectedFilter.tableView) !== -1) {
                filters = mc.showMeOptions.deaths;
            }
            else if (mc.selectedFilter.key === 'natality'){
                filters = mc.showMeOptions.natality;
            } else if (mc.selectedFilter.key === 'mental_health'){
                filters = mc.showMeOptions.mental_health;
            }
            angular.forEach(filters, function(filter) {
                if(filter.key === mc.selectedFilter.tableView) {
                    mc.selectedShowFilter = filter;
                }
            });
        }
        function showMenu() {
            mc.displayMenu = !mc.displayMenu;
        }

        function showTopic() {
            mc.displayTopic = !mc.displayTopic;
            mc.displayCategory = false;
            mc.displayFilter = false;
        }

        function showCategory() {
            mc.displayCategory = !mc.displayCategory;
        }

        function showFilter() {
            mc.displayFilter = !mc.displayFilter;
            mc.displayCategory = false;
            mc.displayTopic = false;
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
    }
}());