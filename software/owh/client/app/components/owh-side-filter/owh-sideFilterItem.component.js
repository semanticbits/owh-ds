'use strict';
(function () {
    angular
        .module('owh')
        .component("owhSideFilterItem", {
            templateUrl: 'app/components/owh-side-filter/owhSideFilterItem.html',
            controller: sideFilterItemController,
            controllerAs: 'sfic',
            bindings: {
                filter: "<",
                groupOptions: "<",
                runOnFilterChange: "<",
                onFilter: "&",
                onFilterValueChange: "&"
            }
        });

    sideFilterItemController.$inject = ['ModalService', 'utilService', 'searchFactory', 'SearchService', '$q'];

    function sideFilterItemController(ModalService, utilService, searchFactory, SearchService, $q) {
        var sfic = this;
        sfic.showModal = showModal;
        sfic.showMCDModal = showMCDModal;
        sfic.clearSelection = clearSelection;
        sfic.clearMCDSelection = clearMCDSelection;
        sfic.updateGroupValue = updateGroupValue;
        sfic.isVisible = isVisible;
        sfic.isSubOptionSelected = isSubOptionSelected;
        sfic.filterGroup = filterGroup;
        sfic.isOptionDisabled = isOptionDisabled;
        sfic.isOptionSelected = isOptionSelected;
        sfic.getShowHideOptionCount = getShowHideOptionCount;

        function isOptionDisabled(group, option) {
            if (group.key === 'hispanicOrigin') {
                //check if unknown is selected
                if (group.value && group.value.indexOf('Unknown') >= 0) {
                    //if unknown is selected then disable all other hispanic options
                    if (option.key !== 'Unknown') {
                        return true;
                    }
                } else {
                    //else, if other option is selected disable unknown
                    if (group.value && group.value.length > 0 && option.key === 'Unknown') {
                        return true;
                    }
                }
            }
            return false || option.disabled;
        }

        function filterGroup(option, group) {
            //check if group option is added
            if (group.value.indexOf(option.key) >= 0) {
                //clear group options, and then add subOptions to value
                clearGroupOptions(option, group);
                angular.forEach(option.options, function (subOption) {
                    group.value.push(subOption.key);
                });
            } else {
                //else, clear group options
                clearGroupOptions(option, group);
            }

            //  Run the filter call back only if runOnFilterChange is true
            if (sfic.runOnFilterChange) {
                sfic.onFilter();
            }
        }

        function clearGroupOptions(option, group) {
            angular.forEach(option.options, function (subOption) {
                if (group.value.indexOf(subOption.key) >= 0) {
                    group.value.splice(group.value.indexOf(subOption.key), 1);
                }
            });
        }

        function isSubOptionSelected(group, option) {
            if (!group.value) {
                return false;
            } else {
                for (var i = 0; i < group.value.length; i++) {
                    for (var j = 0; j < option.options.length; j++) {
                        if (group.value[i] === option.options[j].key) {
                            return true;
                        }
                    }
                }
            }
        }

        function showModal(selectedFilter, allFilters) {
            var deferred = $q.defer();
            angular.forEach(allFilters, function (eachFilter) {
                if (eachFilter.key !== selectedFilter.key) {
                    clearSelection(eachFilter)
                }
            });
            var showTree = selectedFilter.key === 'ucd-chapter-10' ||
                           selectedFilter.key === 'mcd-chapter-10' ||
                           selectedFilter.key === 'question' ||
                           selectedFilter.key === 'site' ||
                           selectedFilter.key === 'childhood_cancer';
            if (!showTree) {
                searchFactory.showPhaseTwoModal('label.mcd.impl.next');
            } else {
                // Just provide a template url, a controller and call 'showModal'.
                ModalService.showModal({
                    templateUrl: "app/partials/owhModal.html",
                    controllerAs: 'mc',
                    controller: function ($scope, close) {
                        var mc = this;
                        mc.codeKey = selectedFilter.key;

                        mc.entityName = {
                            question: 'Question',
                            'ucd-chapter-10': 'Cause(s) of Death',
                            'mcd-chapter-10': 'Cause(s) of Death',
                            site: 'cancer site(s)',
                            'childhood_cancer': 'childhood cancer(s)'
                        }[selectedFilter.key];

                        mc.modelHeader = {
                            question: 'label.select.question',
                            'ucd-chapter-10': 'label.cause.death',
                            'mcd-chapter-10': 'label.cause.death',
                            site: 'label.select.cancer_site',
                            'childhood_cancer': 'label.select.childhood_cancer'
                        }[selectedFilter.key];

                        mc.optionValues = selectedFilter.selectedNodes ? selectedFilter.selectedNodes : selectedFilter.selectedValues;

                        mc.questions = selectedFilter.questions;
                        mc.tree = selectedFilter.tree;
                        mc.close = close;
                    }
                }).then(function (modal) {
                    // The modal object has the element built, if this is a bootstrap modal
                    // you can call 'modal' to show it, if it's a custom modal just show or hide
                    // it as you need to.
                    modal.element.show();
                    modal.close.then(function (result) {
                        if (result) {
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
                            if(selectedFilter.key === 'ucd-chapter-10' || selectedFilter.key === 'mcd-chapter-10'){
                                selectedFilter.autoCompleteOptions = selectedFilter.selectedValues.map(function(val){return {key:val.id, title:val.text}});
                            }
                            modal.element.hide();

                            deferred.resolve(selectedFilter);

                            //  Run the filter call back only if runOnFilterChange is true
                            if (sfic.runOnFilterChange) {
                                sfic.onFilterValueChange();
                                sfic.onFilter();
                            }
                        }
                        else {
                            deferred.resolve(null);
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

            sfic.showModal({
                key: selectedFilter.key,
                selectedValues: selectedFilter.selectedValues[propertyKey],
                selectedNodes: selectedFilter.selectedNodes[propertyKey],
                value: selectedFilter.value[propertyKey]
            }, allFilters).then(function (filter) {
                if (filter) {
                    selectedFilter.selectedValues[propertyKey] = filter.selectedValues;
                    selectedFilter.selectedNodes[propertyKey] = filter.selectedNodes;
                    selectedFilter.value[propertyKey] = filter.value;
                    if(selectedFilter.key === 'mcd-chapter-10'){
                        if(selectedFilter.selectedValues.set1) {
                            selectedFilter.autoCompleteOptions = selectedFilter.selectedValues.set1.map(function (val) {
                                return {key: val.id, title: val.text}
                            });
                        }
                        if(selectedFilter.selectedValues.set2) {
                            selectedFilter.autoCompleteOptions = selectedFilter.autoCompleteOptions.concat(selectedFilter.selectedValues.set2.map(function (val) {
                                return {key: val.id, title: val.text}
                            }));
                        }
                    }
                }
            });
        }

        function clearSelection(filter, resetGroupBy) {
            if (resetGroupBy) {
                filter.groupBy = false;
            }

            //remove all elements from array
            filter.selectedNodes.length = 0;
            filter.selectedValues.length = 0;
            filter.value.length = 0;
            if(filter.key === 'ucd-chapter-10') {
                filter.autoCompleteOptions = utilService.getICD10ChaptersForUCD();
            }
            if(filter.key === 'mcd-chapter-10') {
                filter.autoCompleteOptions = utilService.getICD10ChaptersForMCD();
            }

            //  Run the filter call back only if runOnFilterChange is true
            if (sfic.runOnFilterChange) {
                sfic.onFilterValueChange();
                sfic.onFilter();
            }
        }

        function clearMCDSelection(filter, resetGroupBy, propertyKey) {
            if (resetGroupBy) {
                filter.groupBy = false;
            }

            //remove all elements from array
            filter.selectedNodes[propertyKey].length = 0;
            filter.selectedValues[propertyKey].length = 0;
            filter.value[propertyKey].length = 0;
            filter.autoCompleteOptions = utilService.getICD10ChaptersForMCD();
            //  Run the filter call back only if runOnFilterChange is true
            if (sfic.runOnFilterChange) {
                sfic.onFilter();
            }
        }

        //remove all elements from array for all select
        function updateGroupValue() {
            var group = sfic.filter.filterGroup ? sfic.filter : sfic.filter.filters;
            if (group.filterType === 'checkbox') {
                if (group.allChecked === false) {
                    // When All is unchecked, select all other values
                    angular.forEach(group.autoCompleteOptions, function (option) {
                        group.value.push(option.key);
                    });
                } else {
                    // When All is selected, unselect individual values
                    group.value.length = 0;
                }
            } else {
                if (group.allChecked === true) {
                    group.value = '';
                }
            }

            sfic.onFilterValueChange();
        }

        function isVisible(filter) {
            if (!sfic.showFilters) {
                return true;
            }
            return sfic.showFilters.indexOf(filter.filters.key) >= 0;
        }

        /**
         * Check if option is vailable in selected option's list
         * @param option
         * @param selectedOptions
         * @returns {boolean}
         */
        function isOptionSelected(option, selectedOptions) {
            return selectedOptions ? selectedOptions.indexOf(option.key) != -1 : false;
        }

        /**
         * Calculate the count of number of option to be shown or hidden in 'show more/less link' in side filters
         * If displaySelectedFirst flag is not set, display only first 3 options
         * else display selected options + first 3 not selected options
         */
        function getShowHideOptionCount(optionGroup, options) {
            var cnt = options.length - 3;
            if (optionGroup.displaySelectedFirst) {
                if (optionGroup.filterType === 'checkbox') {
                    cnt -= optionGroup.value.length;
                } else if (optionGroup.value) { // if radio and non- all option is selected
                    cnt -= 1;
                }
            }
            return cnt ? cnt : 0;
        }
    }
}());
