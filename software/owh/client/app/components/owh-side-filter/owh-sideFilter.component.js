'use strict';
(function(){
    angular
        .module('owh')
        .component("owhSideFilter",{
            templateUrl: 'app/components/owh-side-filter/owhSideFilter.html',
            controller: sideFilterController,
            controllerAs: 'sfc',
            bindings:{
                //TODO: change to one-way binding and bubble filter changes up with event bindings
                filters : "<",
                groupOptions: "<",
                primaryKey: "@",
                onFilter: '&',
                sort: '<',
                showFilters: '<',
                utilities: '<',
                runOnFilterChange: '<',
                showCi: '<'
            }
        });

    sideFilterController.$inject=['ModalService', 'utilService', 'searchFactory', 'SearchService', '$q'];

    function sideFilterController(ModalService, utilService, searchFactory, SearchService, $q){
        var sfc = this;
        sfc.getFilterOrder = getFilterOrder;
        sfc.isVisible = isVisible;
        sfc.onFilterValueChange = onFilterValueChange;
        sfc.changeSelectedFilter = changeSelectedFilter;

        sfc.$onChanges = function(changes) {
            if(changes.filters && changes.filters.currentValue) {
                angular.forEach(changes.filters.currentValue, function(category) {
                    angular.forEach(category.sideFilters, function(filter) {
                        //iterate through filter options and add counts
                        angular.forEach(filter.filters.autoCompleteOptions, function (option) {
                            option.count = getOptionCount(option);
                            if (option.options) {
                                angular.forEach(option.options, function (subOption) {
                                    subOption.count = getOptionCount(subOption);
                                });
                            }
                        });
                    });
                });
            }
        };

        function isOptionDisabled(group, option) {
            if(group.key === 'hispanicOrigin') {
                //check if unknown is selected
                if(group.value && group.value.indexOf('Unknown') >= 0) {
                    //if unknown is selected then disable all other hispanic options
                    if(option.key !== 'Unknown') {
                        return true;
                    }
                } else {
                    //else, if other option is selected disable unknown
                    if(group.value && group.value.length > 0 && option.key === 'Unknown') {
                        return true;
                    }
                }
            }
            return false || option.disabled;
        }

        function filterGroup(option, group) {
            //check if group option is added
            if(group.value.indexOf(option.key) >= 0) {
                //clear group options, and then add subOptions to value
                clearGroupOptions(option, group);
                angular.forEach(option.options, function(subOption) {
                    if(group.value.indexOf(subOption.key)<0)
                        group.value.push(subOption.key);
                });
            } else {
                //else, clear group options
                clearGroupOptions(option, group);
            }

            //  Run the filter call back only if runOnFilterChange is true
            if(sfc.runOnFilterChange) {
                sfc.onFilter();
            }
        }

        function clearGroupOptions(option, group) {
            angular.forEach(option.options, function(subOption) {
                if(group.value.indexOf(subOption.key) >= 0) {
                    group.value.splice(group.value.indexOf(subOption.key), 1);
                }
            });
        }

        function getOptionCountPercentage(option) {
            var countKey = sfc.primaryKey;
            var countPercentKey = countKey + 'Percentage';
            return option && option[countPercentKey] ? option[countPercentKey] : 0
        }

        function getOptionCount(option) {
            var countKey = sfc.primaryKey;
            //check if group option
            if(option.options) {
                var count = 0;
                angular.forEach(option.options, function(subOption) {
                    count+= (subOption[countKey] ? subOption[countKey] : 0);
                });
                return count;
            } else {
                return option && option[countKey] ? option[countKey] : 0
            }

        }

        function onFilterValueChange(filter, category){
            //clear values for other filters for exclusive categories
            if(category != undefined && category.exclusive) {
                angular.forEach(category.sideFilters, function(sideFilter) {
                    if(filter !== sideFilter) {
                        sideFilter.filters.value = [];
                        sideFilter.filters.groupBy = false;
                    }
                });
            }
            // Update the filter options if refreshFiltersOnChange is true
            if (filter.refreshFiltersOnChange){
                utilService.refreshFilterAndOptions(filter.filters, sfc.filters, sfc.primaryKey);
            }
            setTimeout(function() {
                filter.onFilterChange && filter.onFilterChange(filter.filters, sfc.filters);
                // Run the filter call back only if runOnFilterChange is true
                if(sfc.runOnFilterChange) {
                    sfc.onFilter();
                }
            }, 10);
        }



        //called to determine order of side filters, looks at sort array passed in
        function getFilterOrder(filter) {
            return sfc.sort.indexOf(filter.filters.key);
        }

        function isVisible(filter) {
            if(!sfc.showFilters) {
                return true;
            }
            return sfc.showFilters.indexOf(filter.filters.key) >= 0;
        }

        /**
         * Check if option is vailable in selected option's list
         * @param option
         * @param selectedOptions
         * @returns {boolean}
         */
        function isOptionSelected(option, selectedOptions) {
            return selectedOptions?selectedOptions.indexOf(option.key) != -1:false;
        }

        /**
         * Calculate the count of number of option to be shown or hidden in 'show more/less link' in side filters
         * If displaySelectedFirst flag is not set, display only first 3 options
         * else display selected options + first 3 not selected options
         */
        function getShowHideOptionCount(optionGroup, options) {
            var cnt =  options.length - 3;
            if(optionGroup.displaySelectedFirst){
                if(optionGroup.filterType === 'checkbox'){
                    cnt -= optionGroup.value.length;
                }else if (optionGroup.value){ // if radio and non- all option is selected
                    cnt -= 1;
                }
            }
            return cnt?cnt:0;
        }

        function changeSelectedFilter(filter, category) {
            // Select group by settingd from the previously selected filter
            if(category.selectedFilter) {
                category.sideFilters.forEach(function(f){
                    if(f.filters.key == category.selectedFilter){
                        filter.filters.groupBy = f.filters.groupBy;
                    }
                });
            }

            category.selectedFilter = filter.filters.key;

            // If the category is exclusive, we would need to re-run the query
            if (category.exclusive) {
                sfc.onFilterValueChange(filter, category);
            }
        }
    }
}());
