//TODO: change to utils.service.js and move to app/services
(function(){
    'use strict';
    angular
        .module('owh.services')
        .service('utilService', utilService);

    utilService.$inject = ['$dateParser', '$filter', '$translate', '$rootScope', 'SearchService'];

    function utilService($dateParser, $filter, $translate, $rootScope, SearchService){

        var service = {
            isValueNotEmpty : isValueNotEmpty,
            isValuesNotEmptyInArray: isValuesNotEmptyInArray,
            isDateString: isDateString,
            convertDateToString: convertDateToString,
            formatDateString: formatDateString,
            findByKey: findByKey,
            sortByKey: sortByKey,
            findByKeyAndValue: findByKeyAndValue,
            findByKeyAndValueRecursive: findByKeyAndValueRecursive,
            findIndexByKeyAndValue: findIndexByKeyAndValue,
            findAllByKeyAndValue: findAllByKeyAndValue,
            findAllNotContainsKeyAndValue: findAllNotContainsKeyAndValue,
            findAllByKeyAndValuesArray: findAllByKeyAndValuesArray,
            updateAllByKeyAndValue: updateAllByKeyAndValue,
            //prepareGroupedTableData: prepareGroupedTableData,
            numberWithCommas: numberWithCommas,
            getValueFromOptions: getValueFromOptions,
            //buildAPIQuery: buildAPIQuery,
            //prepareNestedAccordionData: prepareNestedAccordionData,
            concatenateByKey : concatenateByKey,
            getValuesByKey: getValuesByKey,
            getValuesByKeyExcludingKeyAndValue: getValuesByKeyExcludingKeyAndValue,
            getValuesByKeyIncludingKeyAndValue: getValuesByKeyIncludingKeyAndValue,
            prepareMixedTableData : prepareMixedTableData,
            //prepareYRBSTableData : prepareYRBSTableData,
            generateMapLegendLabels : generateMapLegendLabels,
            generateMapLegendRanges : generateMapLegendRanges,
            getMinAndMaxValue : getMinAndMaxValue,
            getSelectedAutoCompleteOptions: getSelectedAutoCompleteOptions,
            clone: clone,
            refreshFilterAndOptions: refreshFilterAndOptions,
            findFilterByKeyAndValue: findFilterByKeyAndValue,
            isFilterApplied: isFilterApplied,
            stdFilterChange: stdFilterChange,
            aidsFilterChange: aidsFilterChange,
            removeValuesFromArray: removeValuesFromArray,
            getSelectedFiltersText: getSelectedFiltersText,
            tbFilterChange: tbFilterChange
        };

        return service;

        // Util for finding a value is empty or not
        function isValueNotEmpty(value) {
            return angular.isDefined(value) && value !== null && !jQuery.isEmptyObject(value) &&
                (!angular.isString(value) || value != '');
        }

        // Util for finding a value is empty or not
        function isValuesNotEmptyInArray(value) {
            var notEmpty = false;
            if(isValueNotEmpty(value)) {
                angular.forEach(value, function(eachValue, index) {
                    if(notEmpty) {
                        return;
                    }
                    notEmpty = isValueNotEmpty(eachValue);
                });
            }
            return notEmpty;
        }

        // Util for finding a value is date or not
        function isDateString(value) {
            return !isNaN(Date.parse(value));
        }
        // Util for finding a value is empty or not
        function convertDateToString(date, format) {
            return $filter('date')(date, format);
        }
        // Util for finding a value is empty or not
        function formatDateString(dateString, inputFormat, outputFormat) {
            return this.convertDateToString($dateParser(dateString, inputFormat), outputFormat);
        }

        /**
         * Finds and returns the first object in array of objects by using the key and value
         * @param a
         * @param key
         * @param value
         * @returns {*}
         */
        function findByKeyAndValue(a, key, value) {
            if(a){
                for (var i = 0; i < a.length; i++) {
                    var keyValue = extractPropertyValue(a[i], key);
                    if ( keyValue && keyValue === value ) {return a[i];}
                }
            }
            return null;
        }

        function extractPropertyValue(obj, property) {
            var value;

            if (typeof property === 'string') {
                value = obj;
                var properties = property.split('.');
                properties.forEach(function (prop) {
                    value = value[prop];
                });
            }
            else {
                value = obj[property];
            }

            return value;
        }

        /**
         * Finds and returns the first object in array of objects by using the key and value
         * @param array
         * @param key
         * @param value
         * @param childProperty
         * @returns {*}
         */
        function findByKeyAndValueRecursive(array, key, value, childProperty) {
            if (array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i][key] && array[i][key] === value) {
                        return array[i];
                    }

                    if (childProperty && array[i][childProperty]) {
                        var result = findByKeyAndValueRecursive(array[i][childProperty], key, value, childProperty);
                        if (result) return result;
                    }
                }
            }

            return null;
        }

        /**
         * Find the filter in array by key and value
         * @param a
         * @param key
         * @param value
         * @returns {*}
         */
        function findFilterByKeyAndValue(a, key, value) {
            if (a) {
                for (var i = 0; i < a.length; i++) {
                    var filter = a[i];
                    if ( filter[key] && filter[key] === value ) {return a[i];}
                }
            }
            return null;
        }

        /**
         * Finds if the specified filter is applied or not
         * @param a
         * @param key
         * @param value
         * @returns {*}
         */
        function isFilterApplied(a) {
            if (a) {
                return a.value.length > 0 || a.groupBy;
            }
            return false;
        }

        /**
         * Finds and returns the first object index in array of objects by using the key and value
         * @param a
         * @param key
         * @param value
         * @returns {*}
         */
        function findIndexByKeyAndValue(a, key, value) {
            for (var i = 0; i < a.length; i++) {
                if ( a[i][key] && a[i][key] === value ) {return i;}
            }
            return -1;
        }


        function sortByKey(array, key, asc) {
            return array.sort(function(a, b) {
                var x = angular.isFunction(key) ? key(a) : a[key];
                var y = angular.isFunction(key) ? key(b) : b[key];
                if(asc===undefined || asc === true) {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }else {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }

        /**
         * Finds and returns the first object in array of objects by using the key
         * @param a
         * @param key
         * @returns {*}
         */
        function findByKey(a, key) {
            for (var i = 0; i < a.length; i++) {
                if (a[i][key]) {return a[i];}
            }
            return null;
        }

        /**
         * Finds and returns all objects in array of objects by using the key and value
         * @param a
         * @param key
         * @param value
         * @returns {Array}
         */
        function findAllByKeyAndValue(a, key, value) {
            var result = [];
            if(a) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i][key] === value) {
                        result.push(a[i]);
                    }
                }
            }
            return result;
        }

        /**
         * Finds and returns all objects in array of objects that not contains the key and value
         * @param a
         * @param key
         * @param value
         * @returns {Array}
         */
        function findAllNotContainsKeyAndValue(a, key, value) {
            var result = [];
            for (var i = 0; i < a.length; i++) {
                if (a[i][key] !== value) {
                    result.push(a[i]);
                }
            }
            return result;
        }

        /**
         * Finds and returns all objects in array of objects by using the key and value
         * @param a
         * @param key
         * @param values
         * @returns {Array}
         */
        function findAllByKeyAndValuesArray(a, key, values) {
            var result = [];
            for (var i = 0; i < a.length; i++) {
                if (values.indexOf(a[i][key]) >= 0 ) {
                    result.push(a[i]);
                }
            }
            return result;
        }

        /**
         * updates all objects in array of objects by using the key and value
         * @param a
         * @param key
         * @param value
         */
        function updateAllByKeyAndValue(a, key, value) {
            for (var i = 0; i < a.length; i++) {
                a[i][key] = value;
            }
        }

        /*function buildAPIQuery(filters) {
         return {
         query: prepareFilterQuery(filters),
         detail:0
         };
         }

         function prepareFilterQuery(filters) {
         var filter = {};
         var filterQuery = angular.copy(filters);
         angular.forEach(filterQuery, function(searchObject, index) {
         if( angular.isArray(searchObject.value) ){
         var emptyValueIndex = searchObject.value.indexOf('');
         if (emptyValueIndex > -1) {
         searchObject.value.splice(emptyValueIndex, 1);
         }
         }
         if ( isValueNotEmpty(searchObject.value) ) {
         filter[searchObject.queryKey] = {
         exact: searchObject.exact,
         primary: searchObject.primary,
         caseChange: searchObject.caseChange,
         queryKey: searchObject.queryKey,
         value: searchObject.value,
         type: searchObject.type
         };
         }
         });
         return filter;
         }*/

        function numberWithCommas(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function getValueFromOptions(options, key, value, outputKey, defaultValue) {
            defaultValue = defaultValue ? defaultValue : value;
            var matchedOption;
            if(options) {
                matchedOption = findByKeyAndValue(options, key, value);
            }
            return matchedOption ? matchedOption[outputKey] : defaultValue;
        }

        /**
         *
         * @param headers -> row and column header
         * @param data  -> response data
         * @param countKey
         * @param totalCount
         * @param countLabel  -> Ex: Number of Deaths
         * @param calculatePercentage
         * @param calculateRowTotal
         * @param secondaryCountKeys
         * @param allOptionValues  -> List of All option values for STD, TB, HIV-AIDS filters
         * @return Table data and headers
         */
        function prepareMixedTableData(headers, data, countKey, totalCount, countLabel, calculatePercentage,
                                       calculateRowTotal, secondaryCountKeys, allOptionValues) {
            var tableData = {
                headers: prepareMixedTableHeaders(headers, countLabel, allOptionValues),
                data: [],
                calculatePercentage: calculatePercentage
            };
            tableData.data = prepareMixedTableRowData(headers.rowHeaders, headers.columnHeaders, data, countKey,
                totalCount, calculatePercentage, calculateRowTotal, secondaryCountKeys);
            tableData.calculatePercentage = calculatePercentage;
            return tableData;
        }

        function getSelectedAutoCompleteOptions(filter, queryKey) {
            var filterValue = filter.value;
            if(angular.isArray(filterValue)) {
                if(queryKey) {
                    return isValueNotEmpty(filterValue)
                        ? findAllByKeyAndValuesArray(filter.autoCompleteOptions, 'qkey', filter.value)
                        : filter.autoCompleteOptions
                } else {
                    return isValueNotEmpty(filterValue)
                        ? findAllByKeyAndValuesArray(filter.autoCompleteOptions, 'key', filter.value)
                        : filter.autoCompleteOptions
                }
            } else {
                var selectedOption = findByKeyAndValue(filter.autoCompleteOptions, 'key', filterValue);
                return selectedOption ? [selectedOption]: filter.autoCompleteOptions;
            }

        }

        /**
         * This function prepares table headers
         * Ex: Race, Female, Male, Number of Deaths
         * @param headers
         * @param countLabel
         * @returns {*[]}
         */
        function prepareMixedTableHeaders(headers, countLabel, allOptionValues) {
            var tableHeaders = [[]];
            var tableColumnHeaders = prepareMixedTableColumnHeaders(headers.columnHeaders, allOptionValues);
            var tableRowHeaders = prepareMixedTableRowHeaders(headers.rowHeaders, tableColumnHeaders.headers.length);
            var tableHeaders = mergeMixedTableHeaders(tableColumnHeaders, tableRowHeaders, countLabel);

            return tableHeaders;
        }

        function mergeMixedTableHeaders(colHeaders, rowHeaders, countLabel) {
            var tableHeaders = [[]];
            if(colHeaders.headers.length > 0) {
                tableHeaders = colHeaders.headers;
            }
            tableHeaders[0] = rowHeaders.concat(tableHeaders[0]);
            if(rowHeaders.length > 0 && countLabel && (countLabel != 'Number of Cases' || colHeaders.headers.length == 0)) {
                tableHeaders[0].push({
                    title: countLabel,
                    colspan: 1,
                    rowspan: colHeaders.headers.length > 0 ? colHeaders.headers.length : 1
                });
            }
            //mark each data column header as isData to set alignment
            angular.forEach(colHeaders.headers, function(row, index) {
                var skip = (index === 0 ? rowHeaders.length : 0);
                for(var i = skip; i < row.length; i++) {
                    row[i].isData = true;
                }
            });
            return tableHeaders;
        }

        function prepareMixedTableRowHeaders(rowHeaders, colHeight) {
            var tableRowHeaders = [];
            angular.forEach(rowHeaders, function(eachRowHeader) {
                var eachTableRowHeader = {
                    colspan: 1,
                    rowspan: colHeight > 0 ? colHeight : 1,
                    title: $filter('translate')(eachRowHeader.title)
                };
                if(eachRowHeader.helpText) {
                    eachTableRowHeader.helpText = $filter('translate')(eachRowHeader.helpText);
                }
                tableRowHeaders.push(eachTableRowHeader)
            });
            return tableRowHeaders;
        }

        function prepareMixedTableColumnHeaders(columnHeaders, allOptionValues, includeOnly) {
            var tableColumnHeaderData = {
                totalColspan: 0,
                headers: []
            };
            if(columnHeaders.length > 0) {
                var eachColumnHeader = columnHeaders[0];
                tableColumnHeaderData.headers.push([]);
                if(allOptionValues && allOptionValues.indexOf(eachColumnHeader.autoCompleteOptions[0].key) > -1) {
                    eachColumnHeader.autoCompleteOptions.push(eachColumnHeader.autoCompleteOptions.shift());
                }
                angular.forEach(getSelectedAutoCompleteOptions(eachColumnHeader), function(eachOption, optionIndex) {
                    if (!includeOnly || !angular.isArray(includeOnly) || includeOnly.indexOf(eachOption.key) >= 0) {
                        var colspan = 1;
                        if(columnHeaders.length > 1) {
                            var includeKeys = [];
                            if (eachOption.options) {
                                angular.forEach(eachOption.options, function (subOption) {
                                    includeKeys.push(subOption.key);
                                });
                            }

                            var childColumnHeaderData = prepareMixedTableColumnHeaders(columnHeaders.slice(1), allOptionValues, eachOption.options ? includeKeys : undefined);
                            colspan = childColumnHeaderData.totalColspan;
                            angular.forEach(childColumnHeaderData.headers, function(eachChildHeader, childHeaderIndex) {
                                if(optionIndex == 0) {
                                    tableColumnHeaderData.headers.push([]);
                                }
                                tableColumnHeaderData.headers[childHeaderIndex + 1] = tableColumnHeaderData.headers[childHeaderIndex + 1].concat(eachChildHeader);
                            });
                        }
                        tableColumnHeaderData.headers[0].push({
                            title: eachOption.title,
                            colspan: colspan,
                            rowspan: 1,
                            isData: true,
                            helpText: eachOption.title
                        });
                        tableColumnHeaderData.totalColspan += colspan;
                    }
                });

            }
            return tableColumnHeaderData;
        }

        /**
         * This function prepares table row data
         * @param rowHeaders
         * @param columnHeaders
         * @param data
         * @param countKey
         * @param totalCount
         * @param calculatePercentage
         * @param calculateRowTotal
         * @param secondaryCountKey
         * @returns {Array}
         */
        function prepareMixedTableRowData(rowHeaders, columnHeaders, data, countKey, totalCount, calculatePercentage, calculateRowTotal, secondaryCountKeys) {
            var tableData = [];
            /**
             * This if condition prepares data
             * Ex: If we are filtering data by Race and Sex then table have columns like Race, Female, Male, NumberOfDeaths, So this function
             * prepares 'Race' data and Total
             */
            if(rowHeaders && rowHeaders.length > 0) {
                var eachHeader = rowHeaders[0];
                var eachHeaderData = data[eachHeader.key];
                angular.forEach(eachHeader.autoCompleteOptions, function(matchedOption, index) {

                    var key = (countKey === 'mental_health' || countKey === 'prams')?matchedOption.qkey:matchedOption.key;
                    if(countKey === 'prams' || countKey === 'mental_health') {
                        var eachData = findAllByKeyAndValue(eachHeaderData, 'name', key);
                        if(eachData.length === 0) {
                            return;
                        }
                        eachData.sort(function(a, b) {
                            if (a.response < b.response) {
                                return -1;
                            }
                            if (a.response > b.response) {
                                return 1;
                            }
                            return 0;
                        });

                        var questionCellAdded = false;
                        angular.forEach(eachData, function(eachPramsData) {
                            var childTableData = prepareMixedTableRowData(rowHeaders.slice(1), columnHeaders, eachPramsData, countKey, totalCount, calculatePercentage, calculateRowTotal, secondaryCountKeys);
                            if(rowHeaders.length > 1 && calculateRowTotal) {
                                childTableData.push(prepareTotalRow(eachPramsData, countKey, childTableData[0].length, totalCount, secondaryCountKeys));
                            }
                            var responseCell = {
                                title: eachPramsData.response,
                                rowspan: 1,
                                colspan: 1,
                                isCount: false,
                                style: {
                                    color: '#833eb0'
                                }
                            };
                            if(!questionCellAdded) {
                                var eachTableRow = {
                                    title: matchedOption.title,
                                    isCount: false,
                                    rowspan: eachData.length,
                                    colspan: 1,
                                    key: matchedOption.key,
                                    qkey: matchedOption.qkey,
                                    iconClass: eachHeader.iconClass,
                                    onIconClick: eachHeader.onIconClick
                                };
                                childTableData[0].unshift(responseCell);
                                childTableData[0].unshift(eachTableRow);
                                tableData = tableData.concat(childTableData);
                                questionCellAdded = true;
                            } else {
                                var eachTableRow = {
                                    title: '',
                                    isCount: false,
                                    isNotQuestionCell: true,
                                    rowspan: 1,
                                    colspan: 1,
                                    key: matchedOption.key,
                                    qkey: matchedOption.qkey,
                                    style: {
                                        display: "none"
                                    }
                                };
                                childTableData[0].unshift(responseCell);
                                childTableData[0].unshift(eachTableRow);
                                tableData = tableData.concat(childTableData);
                            }
                        });
                    } else {
                        var eachData = findByKeyAndValue(eachHeaderData, 'name', key);
                        if(!eachData) {
                            return;
                        }
                        var childTableData = prepareMixedTableRowData(rowHeaders.slice(1), columnHeaders, eachData, countKey, totalCount, calculatePercentage, calculateRowTotal, secondaryCountKeys);
                        if(rowHeaders.length > 1 && calculateRowTotal) {
                            childTableData.push(prepareTotalRow(eachData, countKey, childTableData[0].length, totalCount, secondaryCountKeys));
                        }
                        var eachTableRow = {
                            title: matchedOption.title,
                            isCount: false,
                            rowspan: childTableData.length,
                            colspan: 1,
                            key: matchedOption.key,
                            qkey: matchedOption.qkey,
                            iconClass: eachHeader.iconClass,
                            onIconClick: eachHeader.onIconClick
                        };
                        childTableData[0].unshift(eachTableRow);
                        tableData = tableData.concat(childTableData);
                    }

                });
            }
            /**
             * This else condition prepares column data
             * Ex: If we are filtering data by Race and Sex then table have columns like Race, Female, Male, NumberOfDeaths, So this function
             * prepares 'NumberOfDeaths' data
             */
            else {
                var count = data[countKey];
                var columnData = prepareMixedTableColumnData(columnHeaders, data, countKey, count, calculatePercentage, secondaryCountKeys);
                if(typeof data[countKey] !== 'undefined' && (columnHeaders.length == 0 || (countKey != 'std' && countKey != 'tb' && countKey !== 'aids'))){
                    columnData.push(prepareCountCell(count, data, countKey, totalCount, calculatePercentage, secondaryCountKeys, true));
                }
                tableData.push(columnData);
            }
            return tableData;
        }

        function prepareCountCell(count, data, countKey, totalCount, calculatePercentage, secondaryCountKeys, bold) {
            var title = Number(count);
            if(isNaN(title)) {
                title = count;
            }
            var cell = {
                title: title,
                percentage: (calculatePercentage && !isNaN(totalCount)) ? (Number(data[countKey]) / totalCount) * 100 : undefined,
                isCount: true,
                rowspan: 1,
                colspan: 1
            };
            if(bold) {
                cell['isBold'] = true;
            }
            //add additional data to the cell, used for population
            if(secondaryCountKeys) {
                angular.forEach(secondaryCountKeys, function(secondaryCountKey) {
                    var secondaryCount = data[secondaryCountKey];
                    cell[secondaryCountKey] = secondaryCount;
                });
            }
            return cell;
        }

        function prepareTotalRow(data, countKey, colspan, totalCount, secondaryCountKeys) {
            var totalArray = [];
            totalArray.push({
                title: 'Total',
                isCount: false,
                rowspan: 1,
                colspan: colspan - 1,
                isBold: true
            });
            var total = data[countKey];
            var cell = {
                title: total,
                percentage: total / totalCount * 100,
                isCount: true,
                rowspan: 1,
                colspan: 1,
                isBold: true
            }
            if(secondaryCountKeys) {
                angular.forEach(secondaryCountKeys, function(secondaryCountKey) {
                    var secondaryCount = data[secondaryCountKey];
                    cell[secondaryCountKey] = secondaryCount;
                });
            }
            totalArray.push(cell);
            return totalArray;
        }

        /**
         * This method prepares column data
         * Ex: If we are filtering data by Race and Sex then table have columns like Race, Female, Male, NumberOfDeaths, So this function
         * prepares 'Female' and 'Male' data
         * @param columnHeaders
         * @param data
         * @param countKey
         * @param totalCount
         * @param calculatePercentage
         * @param secondaryCountKey
         * @returns {Array}
         */
        function prepareMixedTableColumnData(columnHeaders, data, countKey, totalCount, calculatePercentage, secondaryCountKeys, includeOnly) {
            var tableData = [];
            var percentage ;
            if(calculatePercentage) {
                percentage = 0 ;
            }
            if(columnHeaders && columnHeaders.length > 0) {
                var eachColumnHeader = columnHeaders[0];

                var eachHeaderData = data[eachColumnHeader.key]?data[eachColumnHeader.key]:data[eachColumnHeader.queryKey];
                var eachOptionLength = 0;
                angular.forEach(getSelectedAutoCompleteOptions(eachColumnHeader), function (eachOption, optionIndex) {
                    if (!includeOnly || !angular.isArray(includeOnly) || includeOnly.indexOf(eachOption.key) >= 0) {
                        var matchedData = findByKeyAndValue(eachHeaderData, 'name', eachOption.key);
                        if(matchedData) {
                            if (columnHeaders.length > 1) {
                                var includeKeys = [];
                                if (eachOption.options) {
                                    angular.forEach(eachOption.options, function (subOption) {
                                        includeKeys.push(subOption.key);
                                    });
                                }

                                var childTableData = prepareMixedTableColumnData(columnHeaders.slice(1), matchedData, countKey, totalCount, calculatePercentage, secondaryCountKeys, eachOption.options ? includeKeys : undefined);
                                eachOptionLength = childTableData.length;
                                tableData = tableData.concat(childTableData);
                            } else {
                                var count = matchedData[countKey];
                                eachOptionLength = 1;
                                tableData.push(prepareCountCell(count, matchedData, countKey, totalCount, calculatePercentage, secondaryCountKeys, false));
                            }
                        } else {
                            if(eachOptionLength <= 0) {
                                eachOptionLength = getOptionDataLength(columnHeaders.slice(1));
                            }
                            tableData = tableData.concat(getArrayWithDefaultValue(eachOptionLength, {title: 'Not Available', percentage: percentage , isCount: true}));
                        }
                    }
                });
            }
            return tableData;
        }

        function getOptionDataLength(columnHeaders) {
            var optionDataLength = 1;
            angular.forEach(columnHeaders, function(eachColumnHeader) {
                optionDataLength = optionDataLength * getSelectedAutoCompleteOptions(eachColumnHeader).length;
            });
            return optionDataLength;
        }
        function getArrayWithDefaultValue(length, defaultValue) {
            var defaultArray = [];
            for(var i = 0; i < length; i++) {
                defaultArray.push(defaultValue);
            }
            return defaultArray;
        }

        /**
         * Concatenate the array with key
         * @param data
         * @param key
         * @param delimiter
         * @returns {string}
         */
        function concatenateByKey(data, key, delimiter) {
            delimiter = delimiter || ', ';
            return getValuesByKey(data, key).join(delimiter);
        }

        /**
         * get the array with key
         * @param data
         * @param key
         * @returns {Array}
         */
        function getValuesByKey(data, key) {
            var values = [];
            for (var i = 0; i < data.length; i++) {
                values.push(data[i][key]);
            }
            return values;
        }

        /**
         * get the array with key
         * @param data
         * @param key
         * @param includeKey
         * @param includeValue
         * @returns {Array}
         */
        function getValuesByKeyIncludingKeyAndValue(data, key, includeKey, includeValue) {
            var values = [];
            if(data){
                    for (var i = 0; i < data.length; i++) {
                        if(data[i][includeKey] === includeValue) {
                            values.push(data[i][key]);
                        }
                    }
            }
            return values;
        }

        /**
         * get the array with key
         * @param data
         * @param key
         * @returns {Array}
         */
        function getValuesByKeyExcludingKeyAndValue(data, key, excludeKey, excludeValue) {
            var values = [];
            for (var i = 0; i < data.length; i++) {
                if(data[i][excludeKey] != excludeValue) {
                    values.push(data[i][key]);
                }
            }
            return values;
        }


        /*function prepareYRBSTableData(data, headers, groupedFilter, yearFilter, aggKey, isAggAtStart) {
         var tableData = {
         headers: [[]],
         data : []
         };
         /!*tableData.headers[0].push({
         title: 'Year',
         colspan: 1,
         rowspan: 1
         });*!/
         var questionHeaders = findAllByKeyAndValue(headers, 'key', 'question');
         var otherHeaders = findAllNotContainsKeyAndValue(headers, 'key', 'question');
         groupedFilter.autoCompleteOptions = otherHeaders.concat(groupedFilter.autoCompleteOptions);
         groupedFilter.value = [];
         var columnHeaders = [groupedFilter];
         if(yearFilter.value.length > 1) {
         columnHeaders.push(yearFilter)
         }
         var selectedYears = getSelectedAutoCompleteOptions(yearFilter);
         var mixedTableHeaders = {
         rowHeaders: questionHeaders,
         columnHeaders: columnHeaders
         };
         tableData.headers = prepareMixedTableHeaders(mixedTableHeaders);
         var totalTablecolspan = 0;
         if(tableData.headers[0].length > 0) {
         angular.forEach(tableData.headers[0], function(eachHeader) {
         totalTablecolspan += eachHeader.colspan;
         })
         }
         angular.forEach(data.aggData, function(questions, questionCategory){
         var categoryRow = [];
         categoryRow.push({
         title: questionCategory,
         colspan: totalTablecolspan,
         rowspan:1,
         isBold: true
         });
         tableData.data.push(categoryRow);
         angular.forEach(questions, function(years, question){
         var eachTableRow = [];
         eachTableRow.push({
         title: question,
         colspan: 1,
         rowspan: 1
         });
         angular.forEach(selectedYears, function(eachYear) {
         angular.forEach(groupedFilter.autoCompleteOptions, function(eachOption){
         var data = years[eachYear.key] ? years[eachYear.key][eachOption.key] : '';
         eachTableRow.push({
         title: data,
         colspan:1,
         rowspan:1
         });
         });
         });
         tableData.data.push(eachTableRow);
         })
         });
         return tableData;
         }*/


        function getMinAndMaxValue(array) {
            var sortedArray = array.sort(function(a,b) {
                return a-b;
            });
            return { minValue: sortedArray[0], maxValue: sortedArray[sortedArray.length-1] }
        }

        //generate legend counters based on result
        function getLegendCounter(minValue, maxValue) {
            return (maxValue - minValue)/10;
        }

        function generateMapLegendRanges(minValue, maxValue) {
            var counter = getLegendCounter(minValue, maxValue);
            var counterRoundedValue = Math.round(counter/((counter<50)?50:100), 0)*100;
            var minRoundedValue = Math.round(minValue/100, 0)*100;
            var ranges = [];
            ranges.push(minRoundedValue);
            [1, 2, 3, 4, 5, 6].forEach(function(option, index){
                ranges.push(minRoundedValue + (counterRoundedValue*index));
            });
            return ranges;
        }

        function generateMapLegendLabels(minValue, maxValue) {
            var labels = [];
            generateMapLegendRanges(minValue, maxValue).reverse().forEach(function(option, index){
                labels.push('> '+ numberWithCommas(option)) ;
            });
            var lastLabelIndex = labels.length-1;
            labels[lastLabelIndex] = labels[lastLabelIndex].replace('>', '');
            labels[lastLabelIndex] = '<'+ labels[lastLabelIndex];
            return labels;
        }

        /**
         * To enable or disable given filter options
         * @param sideFilters - all side filters
         * @param givenFilters  - Array of filters which filter options to be disabled or enabled
         * @param disabled  - boolean to disable or not
         */
        function enableOrDisableFilterOptions(sideFilters, givenFilters, disabled){
            for (var f = 0; f < sideFilters.length; f++) {
                var sFilters = sideFilters[f].filters;
                if (!sideFilters[f].disabled && givenFilters.indexOf(sFilters.key) >= 0) {
                    var filterOptions = $filter('filter')(sFilters.autoCompleteOptions, {key: "!"+sFilters.defaultValue});
                    angular.forEach(filterOptions, function(option){
                        option.disabled = disabled;
                    });
                    //If filter options are disabled, then set filter value to default value
                    if(disabled){
                        sFilters.value = sFilters.defaultValue;
                    }
                }
            }
        }

        /**
         * Enable or disable filter options based on DS metadata response
         * @param response
         * @param sideFilters
         * @param datasetname
         * @param filterName
         */
        function refreshFiltersWithDSMetadataResponse(response, sideFilters, datasetname, filterName) {
            var newFilters = response.data;
            for (var f = 0; f < sideFilters.length; f++) {
                var fkey = sideFilters[f].filters.queryKey;
                if (fkey.indexOf('|') >= 0) fkey = fkey.split('|')[1];
                if (fkey === 'ethnicity_group' && datasetname == 'deaths') {
                    fkey = 'hispanic_origin';
                }
                if (fkey !== filterName) {
                    if (fkey in newFilters) {
                        sideFilters[f].disabled = false;
                        if (newFilters[fkey]) {
                            var fopts = sideFilters[f].filters.autoCompleteOptions;
                            for (var opt in fopts) {
                                if (newFilters[fkey].indexOf(fopts[opt].key) >= 0) {
                                    fopts[opt].disabled = false;
                                }
                                //below condition only disable filters which are not parent(with no child filters) and
                                // not found in response metadata.
                                else if (!fopts[opt].group && fopts[opt].key != 'Hispanic') {
                                    fopts[opt].disabled = true;
                                }
                            }
                        }
                    } else {
                        if(datasetname === 'std') {
                            sideFilters[f].filters.value = sideFilters[f].filters.defaultValue;
                        }
                        else {
                            sideFilters[f].filters.value = [];
                        }

                        sideFilters[f].filters.groupBy = false;
                        sideFilters[f].disabled = true;
                    }
                }
            }
        }


        /**
         * Remove multiple values from given array
         * @param listOfValues - array of values
         * @param removeFilterOptions - array of values to remove
         * @return {T[]}
         */
        function removeValuesFromArray(listOfValues, removeFilterOptions) {
            angular.forEach(removeFilterOptions, function(eachValue) {
                listOfValues = ($filter('filter')(listOfValues, "!"+eachValue));
            });
            return listOfValues;
        }

        /**
         * Enables/disables side filters and filter options based on the dataset metadata
         * @param filter - filter to be used for the querying ds metadata
         * @param categories - categories sidefilter categories
         * @param datasetname - name of dataset
         * @param tableView - current page table view value
         */
        function refreshFilterAndOptions(filter, categories, datasetname, tableView) {
            var sideFilters = [];
            angular.forEach(categories, function (category) {
                sideFilters = sideFilters.concat(category.sideFilters);
            });
            var filterName = filter.queryKey;
            var filterValue = filter.value;
            var filterValueArray = null;
            if(filterValue) {
                filterValueArray = angular.isArray(filterValue) ? filterValue.join(',') : [filterValue];
            }
            SearchService.getDsMetadata(datasetname, filterValueArray).then(function (response) {
                refreshFiltersWithDSMetadataResponse(response, sideFilters, datasetname, filterName);
                //if natality -> fertility_rates then disable ages <15 and >44 in Age of Mother filters
                if(tableView === "fertility_rates") {
                    //find "Mother's Age" category
                    var motherAgeCategory = findByKeyAndValue(categories, "category", "Mother's Age");
                    var oneYearAgeSideFilter = motherAgeCategory.sideFilters[0];
                    var fiveYearAgeSideFilter = motherAgeCategory.sideFilters[1];
                    oneYearAgeSideFilter.filters.value = removeValuesFromArray(oneYearAgeSideFilter.filters.value, oneYearAgeSideFilter.filters.disableAgeOptions);
                    fiveYearAgeSideFilter.filters.value = removeValuesFromArray(fiveYearAgeSideFilter.filters.value, fiveYearAgeSideFilter.filters.disableAgeOptions);
                    //Disable one year age filter options
                    angular.forEach(oneYearAgeSideFilter.filters.disableAgeOptions, function(eachAgeOption){
                        var sideFilterOption = findByKeyAndValue(oneYearAgeSideFilter.filters.autoCompleteOptions, 'key', eachAgeOption);
                        sideFilterOption.disabled = true;
                    });
                    //Disable five year age filter options
                    angular.forEach(fiveYearAgeSideFilter.filters.disableAgeOptions, function(eachAgeOption){
                        var sideFilterOption = findByKeyAndValue(fiveYearAgeSideFilter.filters.autoCompleteOptions, 'key', eachAgeOption);
                        sideFilterOption.disabled = true;
                    });

                }
            }, function (error) {
                angular.element(document.getElementById('spindiv')).addClass('ng-hide');
                console.log(error);
            });
        }

        function clone (a) {
            return JSON.parse(JSON.stringify(a));
        };

        /**
         * This function gets called on STD filter change
         * Enable/Disable filters based on selected filter
         * @param filter
         * @param categories
         */
        function stdFilterChange(filter, categories) {
            var sideFilters = [];
            var filterValue = filter.value;
            var filterName = filter.queryKey;
            angular.forEach(categories, function (category) {
                sideFilters = sideFilters.concat(category.sideFilters);
            });
            //Disease filter
            var diseaseSideFilter = $filter('filter')(sideFilters, {filters : {key: 'disease'}})[0];
            var congenitalSyphilisOption = findByKeyAndValue(diseaseSideFilter.filters.autoCompleteOptions, 'key', 'Congenital Syphilis');
            var earlyLatentSyphilis = findByKeyAndValue(diseaseSideFilter.filters.autoCompleteOptions, 'key', 'Early Latent Syphilis');
            //State filter
            var stateSideFilter = $filter('filter')(sideFilters, {filters : {key: 'state'}})[0];
            //On year filter option change
            if(filterName == "current_year") {
                //Enable/Disable filters based on metadata
               // utilService.refreshFilterAndOptions(filter, categories, 'std');
                earlyLatentSyphilis.disabled = false;
                var filterValueArray = null;
                if(filterValue) {
                    filterValueArray = angular.isArray(filterValue) ? filterValue.join(',') : [filterValue];
                }
                SearchService.getDsMetadata('std', filterValueArray).then(function (response) {
                    refreshFiltersWithDSMetadataResponse(response, sideFilters, 'std', filterName);
                    //if user select year '2000' - '2002' then disabled 'Disease' -> 'Early Latent Syphilis'
                    if(['2000', '2001', '2002'].indexOf(filterValue) >= 0) {
                        earlyLatentSyphilis.disabled = true;
                    }
                }, function (error) {
                    angular.element(document.getElementById('spindiv')).addClass('ng-hide');
                    console.log(error);
                });
            }
            //On disease filter option change
            else if(filterName == "disease") {
                var isELSFilterSelected = filterValue === 'Early Latent Syphilis';
                //Year filter
                var yearSideFilter = $filter('filter')(sideFilters, {filters : {key: 'year'}})[0];
                //Enable/Disabled 2000 - 2002 year options
                findByKeyAndValue(yearSideFilter.filters.autoCompleteOptions, 'key', '2000').disabled = isELSFilterSelected;
                findByKeyAndValue(yearSideFilter.filters.autoCompleteOptions, 'key', '2001').disabled = isELSFilterSelected;
                findByKeyAndValue(yearSideFilter.filters.autoCompleteOptions, 'key', '2002').disabled = isELSFilterSelected;
                //Enable 'Disease' -> 'Congenital Syphilis' filter option
                congenitalSyphilisOption.disabled = false;
                var filters = ['sex', 'race', 'age_group'];
                //enable 'National' option if year value is not with thin '2007' to '2010' range
                if(['2007', '2008', '2009', '2010'].indexOf(yearSideFilter.filters.value) < 0){
                    findByKeyAndValue(stateSideFilter.filters.autoCompleteOptions, 'key', 'National').disabled = false;
                }
                //If user selects 'Disease' -> 'Congenital Syphilis' then
                //Disable all options for 'Sex', 'Race/Ethinicity', 'Age Groups' except 'Both sexes', 'All races/ethinicities' and 'All age groups' options
                enableOrDisableFilterOptions(sideFilters, filters, filterValue === 'Congenital Syphilis');
            }
            //If user selects any option(other than 'Both sexes', 'All races/ethinicities' and 'All age groups') in 'Sex' OR 'Race' OR 'Age Groups' filter
            //Then disable 'Disease' -> 'Congenital Syphilis' filter option
            else if(filterName == "sex" || filterName == "race_ethnicity" || filterName == "age_group") {
                congenitalSyphilisOption.disabled = filterValue != filter.defaultValue;
            }

        }

        /**
         * This function gets called on TB filter change
         * It enablea/Disablea filters based on selected filter
         * @param filter
         * @param categories
         */
        function tbFilterChange(filter, categories) {
            var filters = [];
            angular.forEach(categories, function (category) {
                filters = filters.concat(category.sideFilters);
            });
            var stateFilter = $filter('filter')(filters, {filters : {key: 'state'}})[0];

            var demographicFilters = ['sex', 'race', 'age_group', 'transmission'];
            var activeFilters = filters.reduce(function (active, filter) {
                var isRestrictedFilter = !!~demographicFilters.indexOf(filter.filters.key);
                var isUnrestrictedValue = !!~['Both sexes', 'All races/ethnicities', 'All age groups', 'No stratification'].indexOf(filter.filters.value);
                if (isRestrictedFilter && !isUnrestrictedValue) {
                    active.push(filter.filters.key);
                }
                return active;
            }, []);
            if (stateFilter.filters.value != 'National' && activeFilters.length >= 1) {
                // Disable remaining demographic filters
                demographicFilters.filter(function (demoFilter) {
                    return !~activeFilters.indexOf(demoFilter)
                }).forEach(function (remainingFilter) {
                    filters.forEach(function (sideFilter) {
                        if(sideFilter.filters.key === remainingFilter) {
                            sideFilter.disabled = true;
                            sideFilter.filters.groupBy = false;
                        }
                    });
                });
            } else {
                // Enable all demographic filters
                demographicFilters.forEach(function (demoFilter) {
                    filters.filter(function (sideFilter) {
                        return sideFilter.filters.key === demoFilter;
                    })[0].disabled = false;
                });
            }
        }

        function aidsFilterChange (filter, categories) {
            var filters = categories[0].sideFilters;
            // Year and Indicator filter restrictions
            var yearFilter = filters.filter(function (sideFilter) {
               return sideFilter.filters.key === 'current_year';
            })[0];
            var diseaseFilter = filters.filter(function (sideFilter) {
                return sideFilter.filters.key === 'disease';
            })[0];
            var disabledFilterCombinations = {
                'HIV, stage 3 (AIDS) deaths': [ '2015' ],
                'Persons living with HIV, stage 3 (AIDS)': [ '2015' ],
                'HIV diagnoses': [ '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007' ],
                'HIV deaths': [ '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2015' ],
                'Persons living with diagnosed HIV': [ '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2015' ],
                '2015': [ 'HIV, stage 3 (AIDS) deaths', 'Persons living with HIV, stage 3 (AIDS)', 'HIV deaths', 'Persons living with diagnosed HIV' ],
                '2007': [ 'HIV diagnoses', 'HIV deaths', 'Persons living with diagnosed HIV' ],
                '2006': [ 'HIV diagnoses', 'HIV deaths', 'Persons living with diagnosed HIV' ],
                '2005': [ 'HIV diagnoses', 'HIV deaths', 'Persons living with diagnosed HIV' ],
                '2004': [ 'HIV diagnoses', 'HIV deaths', 'Persons living with diagnosed HIV' ],
                '2003': [ 'HIV diagnoses', 'HIV deaths', 'Persons living with diagnosed HIV' ],
                '2002': [ 'HIV diagnoses', 'HIV deaths', 'Persons living with diagnosed HIV' ],
                '2001': [ 'HIV diagnoses', 'HIV deaths', 'Persons living with diagnosed HIV' ],
                '2000': [ 'HIV diagnoses', 'HIV deaths', 'Persons living with diagnosed HIV' ]
            };
            var disabledOptions = disabledFilterCombinations[filter.value];
            if (filter.key === 'disease') {
                yearFilter.filters.autoCompleteOptions.forEach(function (option) {
                    option.disabled = disabledOptions && disabledOptions.indexOf(option.key) !== -1;
                });
            } else if (filter.key === 'current_year') {
                diseaseFilter.filters.autoCompleteOptions.forEach(function (option) {
                    option.disabled = disabledOptions && disabledOptions.indexOf(option.key) !== -1;
                });
            }

            // Demographic filter restrictions
            var demographicFilters = ['sex', 'race', 'age_group', 'transmission'];
            var activeFilters = filters.reduce(function (active, filter) {
                var restrictedFilters = !!~demographicFilters.indexOf(filter.filters.key);
                var unrestrictedValues = !!~['Both sexes', 'All races/ethnicities', 'All age groups', 'No stratification'].indexOf(filter.filters.value);
                if (restrictedFilters && !unrestrictedValues) {
                    active.push(filter.filters.key);
                }
                return active;
            }, []);
            if (activeFilters.length >= 2) {
                // Disable remaining demographic filters
                demographicFilters.filter(function (demoFilter) {
                    return !~activeFilters.indexOf(demoFilter)
                }).forEach(function (remainingFilter) {
                    filters.filter(function (sideFilter) {
                        return sideFilter.filters.key === remainingFilter;
                    })[0].disabled = true;
                })
            } else {
                // Enable all demographic filters
                demographicFilters.forEach(function (demoFilter) {
                    filters.filter(function (sideFilter) {
                        return sideFilter.filters.key === demoFilter;
                    })[0].disabled = false;
                })
            }
        }

        function getSelectedFiltersText(filters, sortlist){
            var appliedFilters = [];
            var filterText = ''
            filters.forEach(function(filter){
                (filter.value.length > 0 && filter.key != 'question') && appliedFilters.push(filter);
            });

            appliedFilters.sort(function (a, b) {
                return (sortlist.indexOf(a.key) - sortlist.indexOf(b.key));
            });

            appliedFilters.forEach(function (f) {
                filterText += ($filter('translate')(f.title) + ': ')
                var options = [];
                //filters options with checkboxes
                if (angular.isArray(f.value)) {
                    f.value.forEach(function (optionKey) {
                        var option = findByKeyAndValue(f.autoCompleteOptions, 'key', optionKey);
                        options.push(option.title);
                    });
                } else {//for filters with radios
                    var option = findByKeyAndValue(f.autoCompleteOptions, 'key', f.value);
                    options.push(option.title);
                }
                filterText += options.join(', ');
                filterText += '| '
            });
            return filterText.substring(0, filterText.length -2);
        }

    }
}());
