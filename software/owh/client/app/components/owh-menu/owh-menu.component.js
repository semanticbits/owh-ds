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
                isBasicSearch: '<',
                searchResults: '&',
                imageSource: '&'
            }
        });

    MenuController.$inject = ['$scope','$log','$q','$timeout','utilService'];

    function MenuController($scope, $log, $q, $timeout, utilService) {
        var mc = this;
        mc.displayCategory = false;
        mc.isMenuOpen = false;
        mc.showMenu = showMenu;
        mc.showCategory = showCategory;
        mc.changeFilter = changeFilter;
        mc.goForward = goForward;
        mc.goBackward = goBackward;
        mc.updateGroupByFilter = updateGroupByFilter;
        mc.updateFilterByText = updateFilterByText;
        mc.getSelectedFilterTitles = getSelectedFilterTitles;
        mc.groupByFiltersUpdated = groupByFiltersUpdated;
        mc.excludeDisabled = function (filter) { return !(filter.disableFilter || mc.selectedFilter.value.some(function(val){return val.key === filter.key})) }

        var imagePaths = {
          deaths: '../images/icons/detailed-mortality-icon.svg',
          mental_health: '../images/icons/yrbss-icon.svg',
          bridge_race: '../images/icons/bridged-race-icon.svg',
          natality: '../images/icons/natality-icon.svg',
          prams: '../images/icons/prams-icon.svg',
          infant_mortality: '../images/icons/infant-mortality-icon.svg',
          std: '../images/icons/std-icon.svg',
          tb: '../images/icons/tuberculosis-icon.svg',
          aids: '../images/icons/aids-hiv-icon.svg',
          cancer_incident: '../images/icons/cancer-incidence-icon.svg',
          cancer_mortality: '../images/icons/cancer-mortality-icon.svg',
          brfss: '../images/icons/brfss-icon.svg'
        };

        mc.$onChanges = function() {
            var filters = [];
            if(['number_of_deaths', 'crude_death_rates',
                    'age-adjusted_death_rates'].indexOf(mc.selectedFilter.tableView) !== -1) {
                filters = mc.showMeOptions.deaths;
            } else if (mc.selectedFilter.key === 'prams' || mc.selectedFilter.key === 'brfss') {
                if(mc.isBasicSearch) {
                    filters = mc.showMeOptions[mc.selectedFilter.key][0].basic;
                } else {
                    filters = mc.showMeOptions[mc.selectedFilter.key][1].advance;
                }
            } else {
                filters = mc.showMeOptions[mc.selectedFilter.key];
            }
            angular.forEach(filters, function(filter) {
                if(filter.key === mc.selectedFilter.tableView) {
                    mc.selectedShowFilter = filter;
                }
            });
            mc.imageSource = imagePaths[mc.selectedFilter.key];
        };
        function showMenu() {
            mc.displayMenu = !mc.displayMenu;
        }

        function showCategory() {
            mc.isMenuOpen = !mc.isMenuOpen
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

        function groupByFiltersUpdated(item, added) {
            // For BRFSS Allow only one breakout filter other than state, question and year
            if (mc.selectedFilter.key === 'brfss'){
                mc.selectedFilter.value = mc.selectedFilter.value.filter(function(val){
                    return val.key === 'state' || val.key === 'question' || val.key === 'year' || val.key === item.key;
                  }
                );
            }
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
