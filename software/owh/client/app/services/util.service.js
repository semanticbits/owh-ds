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
            isFilterApplied: isFilterApplied
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
                    if ( a[i][key] && a[i][key] === value ) {return a[i];}
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
                return a.value.length > 0;
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
            if(rowHeaders.length > 0 && countLabel) {
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

        function prepareMixedTableColumnHeaders(columnHeaders, allOptionValues) {
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
                    var colspan = 1;
                    if(columnHeaders.length > 1) {
                        var childColumnHeaderData = prepareMixedTableColumnHeaders(columnHeaders.slice(1), allOptionValues);
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
                if(typeof data[countKey] !== 'undefined' && countKey != 'std' && countKey != 'tb' && countKey !== 'aids') {
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
        function prepareMixedTableColumnData(columnHeaders, data, countKey, totalCount, calculatePercentage, secondaryCountKeys) {
            var tableData = [];
            var percentage ;
            if(calculatePercentage) {
                percentage = 0 ;
            }
            if(columnHeaders && columnHeaders.length > 0) {
                var eachColumnHeader = columnHeaders[0];

                var eachHeaderData = data[eachColumnHeader.key]?data[eachColumnHeader.key]:data[eachColumnHeader.queryKey];
                var eachOptionLength = 0;
                angular.forEach(getSelectedAutoCompleteOptions(eachColumnHeader), function(eachOption, optionIndex) {
                    var matchedData = findByKeyAndValue(eachHeaderData, 'name', eachOption.key);
                    if(matchedData) {
                        if (columnHeaders.length > 1) {
                            var childTableData = prepareMixedTableColumnData(columnHeaders.slice(1), matchedData, countKey, totalCount, calculatePercentage, secondaryCountKeys);
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
         * @param toBeDisabledFilterOption - Specific filter option which needs to be disable
         */
        function enableOrDisableFilterOptions(sideFilters, givenFilters, disabled, toBeDisabledFilterOption){
            for (var f = 0; f < sideFilters.length; f++) {
                var sFilters = sideFilters[f].filters;
                if (givenFilters.indexOf(sFilters.key) >= 0) {
                    var filterOptions = $filter('filter')(sFilters.autoCompleteOptions, {key: "!"+sFilters.defaultValue});
                    angular.forEach(filterOptions, function(option){
                        option.disabled = disabled;
                    });
                    //If filter options are disabled, then set filter value to default value
                    if(disabled){
                        sFilters.value = sFilters.defaultValue;
                    }
                    //else if a specific filter options provided
                    //Verify any one of given filter options selected then disable given filter option
                    else if(toBeDisabledFilterOption) {
                        var found = $filter('filter')(filterOptions, {key: sFilters.value}, true);
                        if (found.length > 0 && !toBeDisabledFilterOption.disabled) {
                            toBeDisabledFilterOption.disabled = true;
                            break;
                        }
                    }
                }
            }
        }
        /**
         * If user selects Disease -> 'Congenital Syphilis' then
         * disable 'Sex', 'Race/Ethnicity' and  'Age Group' filter options except 'Both Sexes', 'All races/ethnicities', 'All age groups' and
         * set Sex -> Both Sexes, Race/Ethnicity -> All races/ethnicities, Age Group -> All age groups.
         * If user selects Sex OR Race/Ethinicity OR Age Group options other than 'Both Sexes' and 'All races/ethnicities' and 'All age groups' then
         * disable Disease -> 'Congenital Syphilis' option
         * @param filterName
         * @param filterValue
         * @param sideFilters
         */
        function refreshDiseaseFilterOptions(filterName, filterValue, sideFilters) {
            //To capture Sex, Race/Ethnicity, Age Group filter options
           // var filterOptions = [];
            var filters = ['sex', 'race', 'age_group'];
            //If user selects Disease -> 'Congenital Syphilis'
            if (filterName === 'disease' && filterValue === 'Congenital Syphilis') {
                enableOrDisableFilterOptions(sideFilters, filters, true);
            }
            else {
                //Get Disease -> 'Congenital Syphilis' option
                var congentialSyphilisOpt = sideFilters[0].filters.autoCompleteOptions[4];
                // Enable disease 'Congenital Syphilis' filter option
                congentialSyphilisOpt.disabled = false;
                enableOrDisableFilterOptions(sideFilters, filters, false, congentialSyphilisOpt);
            }
        }

        /**
         * Enables/disables side filters and filter options based on the dataset metadata
         * @param filter filter to be used for the querying ds metadata
         * @param categories sidefilter categories
         * @param datasetname name of dataset          */
        function refreshFilterAndOptions(filter, categories, datasetname) {
            var sideFilters = [];
            angular.forEach(categories, function (category) {
                sideFilters = sideFilters.concat(category.sideFilters);
            });
            var filterName = filter.queryKey;
            var filterValue = filter.value;
            //For STD and HIV-AIDS
            if(filterName === 'disease' && datasetname === 'std'){
                refreshDiseaseFilterOptions(filterName, filterValue, sideFilters);
            }
            /**
             * Get ds metadata based on selected year and enable/disable sidefilters.
             */
            else {
                var filterValueArray = null;
                if(filterValue) {
                    filterValueArray = angular.isArray(filterValue) ? filterValue.join(',') : [filterValue];
                }
                SearchService.getDsMetadata(datasetname, filterValueArray).then(function (response) {
                    var newFilters = response.data;
                    for (var f=0; f < sideFilters.length; f++) {
                        var fkey = sideFilters[f].filters.queryKey;
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
                                        else if(!fopts[opt].group && fopts[opt].key != 'Hispanic') {
                                            fopts[opt].disabled = true;
                                        }
                                    }
                                }
                            } else {
                                sideFilters[f].filters.value = [];
                                sideFilters[f].filters.groupBy = false;
                                sideFilters[f].disabled = true;
                            }
                        }
                    }
                }, function (error) {
                    angular.element(document.getElementById('spindiv')).addClass('ng-hide');
                    console.log(error);
                });
            }

        }

        function clone (a) {
            return JSON.parse(JSON.stringify(a));
        };
    }
}());
