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
                runOnFilterChange: '<'
            }
        });

    sideFilterController.$inject=['ModalService', 'utilService', 'searchFactory', 'SearchService', '$q'];

    function sideFilterController(ModalService, utilService, searchFactory, SearchService, $q){
        var sfc = this;
        sfc.getOptionCountPercentage = getOptionCountPercentage;
        sfc.getOptionCount = getOptionCount;
        sfc.showModal = showModal;
        sfc.showMCDModal = showMCDModal;
        sfc.clearSelection = clearSelection;
        sfc.clearMCDSelection = clearMCDSelection;
        sfc.updateGroupValue = updateGroupValue;
        sfc.getFilterOrder = getFilterOrder;
        sfc.isVisible = isVisible;
        sfc.isSubOptionSelected = isSubOptionSelected;
        sfc.filterGroup = filterGroup;
        sfc.isOptionDisabled = isOptionDisabled;
        sfc.isOptionSelected = isOptionSelected;
        sfc.getShowHideOptionCount = getShowHideOptionCount;
        sfc.onFilterValueChange = onFilterValueChange;

        sfc.$onChanges = function(changes) {
            if(changes.filters.currentValue) {
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

        function isSubOptionSelected(group, option) {
            if(!group.value){
                    return false;
            }else {
                   for(var i = 0; i < group.value.length; i++) {
                        for(var j = 0; j < option.options.length; j++) {
                            if(group.value[i] === option.options[j].key) {
                                return true;
                            }
                        }
                    }
            }
            
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

        function showModal(selectedFilter, allFilters) {
            var deferred = $q.defer();
            angular.forEach(allFilters, function(eachFilter) {
                if (eachFilter.key !== selectedFilter.key){
                    clearSelection(eachFilter)
                }
            });
            var showTree = selectedFilter.key === 'ucd-chapter-10' || selectedFilter.key === 'mcd-chapter-10' || selectedFilter.key === 'question';
            if(!showTree) {
                searchFactory.showPhaseTwoModal('label.mcd.impl.next');
            }else {
                // Just provide a template url, a controller and call 'showModal'.
                ModalService.showModal({
                    templateUrl: "app/partials/owhModal.html",
                    controllerAs: 'mc',
                    controller: function ($scope, close) {
                        var mc = this;
                        mc.codeKey = selectedFilter.key;
                        mc.entityName = selectedFilter.key === 'question' ? 'Question' : 'Cause(s) of Death';
                        mc.modelHeader = selectedFilter.key === 'question' ? 'label.select.question' : 'label.cause.death';

                        mc.optionValues = selectedFilter.selectedNodes ? selectedFilter.selectedNodes : selectedFilter.selectedValues;

                        mc.questions = selectedFilter.questions;
                        mc.close = close;
                    }
                }).then(function (modal) {
                    // The modal object has the element built, if this is a bootstrap modal
                    // you can call 'modal' to show it, if it's a custom modal just show or hide
                    // it as you need to.
                    modal.element.show();
                    modal.close.then(function (result) {
                        //remove all elements from array
                        if (!selectedFilter.selectedValues || !selectedFilter.selectedNodes) {
                            //selected nodes and their child nodes, which will be sent to backend for query
                            selectedFilter.selectedValues = [];
                            //selected nodes
                            selectedFilter.selectedNodes = [];
                        }
                        selectedFilter.selectedValues.length = 0;
                        selectedFilter.selectedNodes.length = 0;

                        //To reflect the selected causes
                        angular.forEach(modal.controller.optionValues, function (eachOption, index) {
                            //get child nodes, if any and add to selected values
                            if (eachOption.childNodes && eachOption.childNodes.length > 0) {
                                angular.forEach(eachOption.childNodes, function (childNode, index) {
                                    selectedFilter.selectedValues.push(childNode);
                                });
                            } else {
                                selectedFilter.selectedValues.push(eachOption);
                            }

                            selectedFilter.selectedNodes.push(eachOption);
                        });
                        selectedFilter.value = utilService.getValuesByKey(selectedFilter.selectedValues, 'id');
                        modal.element.hide();

                        deferred.resolve(selectedFilter);

                        //  Run the filter call back only if runOnFilterChange is true
                        if(sfc.runOnFilterChange) {
                            sfc.onFilter();
                        }
                    });
                });
            }

            return deferred.promise;
        }

        function showMCDModal(selectedFilter, allFilters, propertyKey) {
            if (!selectedFilter.selectedValues) {
                selectedFilter.selectedValues = {};
            }

            if (!selectedFilter.selectedNodes) {
                selectedFilter.selectedNodes = {};
            }

            if (!selectedFilter.value) {
                selectedFilter.value = {};
            }

            sfc.showModal({
                key: selectedFilter.key,
                selectedValues: selectedFilter.selectedValues[propertyKey],
                selectedNodes: selectedFilter.selectedNodes[propertyKey],
                value: selectedFilter.value[propertyKey]
            }, allFilters).then(function (filter) {
                selectedFilter.selectedValues[propertyKey] = filter.selectedValues;
                selectedFilter.selectedNodes[propertyKey] = filter.selectedNodes;
                selectedFilter.value[propertyKey] = filter.value;
            });
        }

        function clearSelection(filter, resetGroupBy) {
            if(resetGroupBy) {
                filter.groupBy = false;
            }

            //remove all elements from array
            filter.selectedNodes.length = 0;
            filter.selectedValues.length = 0;
            filter.value.length = 0;

            //  Run the filter call back only if runOnFilterChange is true
            if(sfc.runOnFilterChange) {
                sfc.onFilter();
            }
        }

        function clearMCDSelection(filter, resetGroupBy, propertyKey) {
            if(resetGroupBy) {
                filter.groupBy = false;
            }

            //remove all elements from array
            filter.selectedNodes[propertyKey].length = 0;
            filter.selectedValues[propertyKey].length = 0;
            filter.value[propertyKey].length = 0;

            //  Run the filter call back only if runOnFilterChange is true
            if(sfc.runOnFilterChange) {
                sfc.onFilter();
            }
        }

        //remove all elements from array for all select
        function updateGroupValue(sideFilter, category) {
            var group = sideFilter.filterGroup ? sideFilter : sideFilter.filters;
            if(group.filterType === 'checkbox'){
                if ( group.allChecked === false ) {
                    // When All is unchecked, select all other values
                    angular.forEach(group.autoCompleteOptions, function(option){
                        group.value.push(option.key)
                    });
                } else {
                    // When All is selected, unselect individual values
                    group.value.length = 0;
                }
            }else {
                if (group.allChecked === true) {
                    group.value = '';
                }
            }

            sfc.onFilterValueChange(sideFilter, category);
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
            // Run the filter call back only if runOnFilterChange is true
            if(sfc.runOnFilterChange) {
                sfc.onFilter();
            }
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
    }
}());
