//TODO: consolidate with search.service.js
//TODO: split out some logic into separate services
//TODO: split json out into separate files
(function(){
    angular
        .module('owh.search')
        .service('searchFactory', searchFactory);

    searchFactory.$inject = ["utilService", "SearchService", "$q", "$translate", "chartUtilService", '$rootScope', '$timeout', '$filter', 'ModalService', '$state', 'filterUtils', 'mapService'];

    function searchFactory( utilService, SearchService, $q, $translate, chartUtilService, $rootScope, $timeout, $filter, ModalService, $state, filterUtils, mapService){
        var service = {
            getAllFilters : getAllFilters,
            queryMortalityAPI: queryMortalityAPI,
            searchMortalityResults: searchMortalityResults,
            showPhaseTwoModal: showPhaseTwoModal,
            generateHashCode: generateHashCode,
            buildAPIQuery: buildAPIQuery,
            sortAutoCompleteOptions: sortAutoCompleteOptions,
            groupAutoCompleteOptions: groupAutoCompleteOptions,
            removeDisabledFilters: removeDisabledFilters,
            getQueryResults: getQueryResults,
            prepareChartData: prepareChartData,
            invokeStatsService: invokeStatsService,
            buildQueryForYRBS: buildQueryForYRBS,
            prepareMortalityResults: prepareMortalityResults,
            prepareQuestionChart: prepareQuestionChart,
            getMapDataForQuestion: getMapDataForQuestion,
            populateSideFilterTotals: populateSideFilterTotals,
            updateFiltersAndData: updateFiltersAndData,
            getMixedTable: getMixedTable,
            setFilterGroupBy: setFilterGroupBy,
            getYrbsQuestionsForTopic: getYrbsQuestionsForTopic,
            getQuestionsByTopics: getQuestionsByTopics,
            getQuestionsByDataset: getQuestionsByDataset,
            getPrimaryFilterByKey: getPrimaryFilterByKey,
            filterQuestionsByTopicsAndYear: filterQuestionsByTopicsAndYear,
            updateSelectedQuestionsForYear: updateSelectedQuestionsForYear

        };
        return service;

        /**
         * Using search results response update filters, table headers and data for search page
         * @param response
         */
        function updateFiltersAndData(filters, response, groupOptions, mapOptions) {
            var primaryFilters = filters.primaryFilters;
            //sets primary filter
            var primaryFilter = utilService.findByKeyAndValue(primaryFilters, 'key', response.data.queryJSON.key);
            if(primaryFilter.key === 'mental_health') {
                if (response.data.queryJSON.showBasicSearchSideMenu) {
                    primaryFilter.allFilters = filters.yrbsBasicFilters;
                    primaryFilter.sideFilters = primaryFilter.basicSideFilters;
                    primaryFilter.showCi = true;
                } else {
                    primaryFilter.allFilters = filters.yrbsAdvancedFilters;
                    primaryFilter.sideFilters = primaryFilter.advancedSideFilters;
                    primaryFilter.showCi = false;
                }
            } else if(primaryFilter.key === 'prams') {
                if (response.data.queryJSON.showBasicSearchSideMenu) {
                    primaryFilter.allFilters = filters.pramsBasicFilters;
                    primaryFilter.sideFilters = primaryFilter.basicSideFilters[0].sideFilters;
                    primaryFilter.showCi = true;
                } else {
                    primaryFilter.allFilters = filters.pramsAdvanceFilters;
                    primaryFilter.sideFilters = primaryFilter.advancedSideFilters[0].sideFilters;
                    primaryFilter.showCi = false;
                }
            } else if(primaryFilter.key === 'brfss') {
                if (response.data.queryJSON.showBasicSearchSideMenu) {
                    primaryFilter.allFilters = filters.brfsBasicFilters;
                    primaryFilter.sideFilters = primaryFilter.basicSideFilters[0].sideFilters;
                    primaryFilter.showCi = true;
                } else {
                    primaryFilter.allFilters = filters.brfsAdvancedFilters;
                    primaryFilter.sideFilters = primaryFilter.advancedSideFilters[0].sideFilters;
                    primaryFilter.showCi = false;
                }
            }
            //sets tableView
            var tableView = response.data.queryJSON.tableView;
            var tableData = {};

            populateSelectedFilters(primaryFilter, response.data.queryJSON.sideFilters);
            //update table headers based on cached query
            primaryFilter.headers = buildAPIQuery(primaryFilter).headers;

            if (primaryFilter.key === 'deaths') {
                primaryFilter.data = response.data.resultData.nested.table;
                primaryFilter.dataCounts = response.data.resultData.nested.tableCounts;
                primaryFilter.searchCount = response.pagination.total;
                primaryFilter.grandTotals = response.data.resultData.simple?response.data.resultData.simple.grandTotals:undefined;
                tableData = getMixedTable(primaryFilter, groupOptions, tableView);
                populateSideFilterTotals(primaryFilter, response.data);
                prepareMortalityResults(primaryFilter, response.data);
                primaryFilter.chartData = prepareChartData(primaryFilter.headers, response.data.resultData.nested, primaryFilter);
                mapService.updateStatesDeaths(primaryFilter, response.data.resultData.nested.maps, primaryFilter.searchCount, mapOptions);
            }
            else if (primaryFilter.key === 'mental_health') {
                primaryFilter.data = response.data.resultData.table;
                tableData = getMixedTable(primaryFilter, groupOptions, tableView);
                primaryFilter.headers = buildQueryForYRBS(primaryFilter, true).headers;
                tableData.data = categorizeQuestions(tableData.data, $rootScope.questions);
               primaryFilter.showBasicSearchSideMenu = response.data.queryJSON.showBasicSearchSideMenu;
                primaryFilter.runOnFilterChange = response.data.queryJSON.runOnFilterChange;
                //update questions based on selected
                var questionFilter = utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', 'question')
                questionFilter.questions = getYrbsQuestionsForTopic(tableView);
                tableData.data = getDataForSelectedTopics(questionFilter.questions, tableData);
            }
            else if (primaryFilter.key === 'prams' ||
                primaryFilter.key === 'brfss') {
                primaryFilter.data = response.data.resultData.table;
                tableData = getMixedTable(primaryFilter, groupOptions, tableView);
                primaryFilter.headers = buildQueryForYRBS(primaryFilter, true).headers;
                primaryFilter.showBasicSearchSideMenu = response.data.queryJSON.showBasicSearchSideMenu;
                var questions = getQuestionsByDataset(primaryFilter.key, primaryFilter.showBasicSearchSideMenu);
                tableData.data = categorizeQuestions(tableData.data, questions);
                primaryFilter.runOnFilterChange = response.data.queryJSON.runOnFilterChange;
                if(response.data.queryJSON) {
                    populateSelectedFilters(primaryFilter, response.data.queryJSON.sideFilters);
                }
                //update questions based on topics
                var topics = groupOptions[tableView].topic;
                var questionFilter = utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', 'question');
                if(primaryFilter.key === 'brfss') {
                    var yearFilter = utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', 'year');
                    questionFilter.questions = filterQuestionsByTopicsAndYear(questions, topics, yearFilter);
                } else {
                    questionFilter.questions = getQuestionsByTopics(topics, questions);
                }
                var topicFilter = utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', 'topic');
                var selectedTopics = [];
                //iff All topics selected
                if(topicFilter.value.length === 0) {
                    selectedTopics = questionFilter.questions;
                } else {//get selected topic objects only
                    selectedTopics = questionFilter.questions.filter(function(obj){
                        return topicFilter.value.indexOf(obj.id) != -1 ;
                    });
                }
                tableData.data = getDataForSelectedTopics(selectedTopics, tableData);
            }
            else if (primaryFilter.key === 'bridge_race') {
                primaryFilter.data = response.data.resultData.nested.table;
                primaryFilter.dataCounts = response.data.resultData.nested.tableCounts;
                tableData = getMixedTable(primaryFilter, groupOptions, tableView);
                populateSideFilterTotals(primaryFilter, response.data);
                primaryFilter.chartData = prepareChartData(response.data.resultData.headers, response.data.resultData.nested, primaryFilter);
                mapService.updateStatesDeaths(primaryFilter, response.data.resultData.nested.maps, primaryFilter.searchCount, mapOptions);
            }
            else if (response.data.queryJSON.key === 'natality') {
                primaryFilter.data = response.data.resultData.nested.table;
                primaryFilter.dataCounts = response.data.resultData.nested.tableCounts;
                populateSideFilterTotals(primaryFilter, response.data);
                primaryFilter.chartData = prepareChartData(primaryFilter.headers, response.data.resultData.nested, primaryFilter);
                tableData = getMixedTable(primaryFilter, groupOptions, tableView);
                mapService.updateStatesDeaths(primaryFilter, response.data.resultData.nested.maps, primaryFilter.searchCount, mapOptions)
            }
            else if (primaryFilter.key === 'infant_mortality') {
                primaryFilter.data = response.data.resultData.nested.table;
                primaryFilter.dataCounts = response.data.resultData.nested.tableCounts;
                primaryFilter.nestedData = response.data.resultData.nested;
                primaryFilter.grandTotals = response.data.resultData.simple?
                    {infant_mortality:response.data.resultData.nested.table.infant_mortality,
                        deathRate: response.data.resultData.nested.table.deathRate,
                        pop: response.data.resultData.nested.table.pop}:undefined;
                populateSideFilterTotals(primaryFilter, response.data);
                primaryFilter.chartData = prepareChartData(primaryFilter.headers, response.data.resultData.nested, primaryFilter);
                var headers = angular.copy(primaryFilter.headers.columnHeaders);
                headers.push.apply(headers, angular.copy(primaryFilter.headers.rowHeaders));
                primaryFilter.countLabel = 'Total';
                angular.forEach(headers, function(columnHeader){
                     if(columnHeader.key === 'state') {
                        primaryFilter.countLabel = null;
                     }
                });
                tableData = getMixedTable(primaryFilter, groupOptions, tableView);
                mapService.updateStatesDeaths(primaryFilter, response.data.resultData.nested.maps, primaryFilter.searchCount, mapOptions);
            }
            else if (response.data.queryJSON.key === 'std' ||
                response.data.queryJSON.key === 'tb' || response.data.queryJSON.key === 'aids') {
                primaryFilter.nestedData = response.data.resultData.nested;
                primaryFilter.data = response.data.resultData.nested.table;
                primaryFilter.dataCounts = response.data.resultData.nested.tableCounts;
                populateSideFilterTotals(primaryFilter, response.data);
                primaryFilter.chartData = prepareChartData(primaryFilter.headers, response.data.resultData.nested, primaryFilter);
                tableData = getMixedTable(primaryFilter, groupOptions, tableView);
                mapService.updateStatesDeaths(primaryFilter, response.data.resultData.nested.maps, primaryFilter.searchCount, mapOptions);
            }
            else if (response.data.queryJSON.key  === 'cancer_incidence' || response.data.queryJSON.key  === 'cancer_mortality') {
                primaryFilter.data = response.data.resultData.nested.table;
                primaryFilter.dataCounts = response.data.resultData.nested.tableCounts;
                populateSideFilterTotals(primaryFilter, response.data);
                tableData = getMixedTable(primaryFilter, groupOptions, tableView);
                primaryFilter.chartData = prepareChartData(primaryFilter.headers, response.data.resultData.nested, primaryFilter);
                mapService.updateStatesDeaths(primaryFilter, response.data.resultData.nested.maps, primaryFilter.searchCount, mapOptions);
            }
            //make sure side filters are in proper order
            angular.forEach(primaryFilter.sideFilters, function (category) {
                angular.forEach(category.sideFilters, function(filter) {
                    groupAutoCompleteOptions(filter.filters, groupOptions[tableView]);
                });
            });
            //using extend to trigger $onChanges
            primaryFilter.sideFilters = angular.extend([], primaryFilter.sideFilters);
            primaryFilter.initiated = true;
            return {
                tableData: tableData,
                tableView: tableView,
                primaryFilter: primaryFilter
            };
        }

        function getDataForSelectedTopics(topics, tableData) {
            var data = [];
            topics.forEach( function( topic ) {
                data.push(utilService.findByKeyAndValue(tableData.data, 'title', topic.text));
            });
            return data;
        }

        /**
         * Update questions based on topics and year
         * @param questionList
         * @param topics
         * @param yearFilter
         * @returns {Array}
         */
        function filterQuestionsByTopicsAndYear(questionList, topics, yearFilter) {
            var questions = [];
            angular.forEach(topics, function (topic) {
                var ques = angular.copy(utilService.findByKeyAndValue(questionList, 'id', topic));
                ques.children = ques.children.filter(function(el) {
                    if (angular.isArray(yearFilter.value)) {
                        var isPresent = false;
                        for (var v in yearFilter.value) {
                            if( el.years.indexOf(yearFilter.value[v]) !== -1) {
                                isPresent = true; break;
                            }
                        }
                        return isPresent;
                    } else {
                        return el.years.indexOf(yearFilter.value) !== -1;
                    }
                });
                questions.push(ques);
            });
            return questions;
        }

        /**
         * Update selected questions for selected year
         * @param quesFilter
         * @param yearFilter
         */
        function updateSelectedQuestionsForYear(quesFilter, yearFilter) {
            if (quesFilter.value) {
                var allQues = quesFilter.autoCompleteOptions;
                //update questions based on selected years
                quesFilter.value = quesFilter.value.filter(function(el) {
                    var ques = utilService.findByKeyAndValue(allQues, 'qkey', el);
                    if (angular.isArray(yearFilter.value)) {
                        var isPresent = false;
                        for (var v in yearFilter.value) {
                            if( ques.years.indexOf(yearFilter.value[v]) !== -1) {
                                isPresent = true;
                                break;
                            }
                        }
                        return isPresent;
                    } else {
                        return ques.years.indexOf(yearFilter.value) !== -1;
                    }
                });

                //update selected question's list
                if (quesFilter.value && quesFilter.value.length > 0) {
                    var selectedNodes = quesFilter.selectedNodes;
                    for (var v in selectedNodes) {
                        selectedNodes[v].childNodes = selectedNodes[v].childNodes.filter(function(aNode) {
                            var ques = utilService.findByKeyAndValue(allQues, 'qkey', aNode.id);
                            if (angular.isArray(yearFilter.value)) {
                                var isPresent = false;
                                for (var v in yearFilter.value) {
                                    if( ques.years.indexOf(yearFilter.value[v]) !== -1) {
                                        isPresent = true;
                                        break;
                                    }
                                }
                                return isPresent;
                            } else {
                                return ques.years.indexOf(yearFilter.value) !== -1;
                            }
                        });
                    }
                } else {
                    quesFilter.selectedNodes = [];
                }
            }
        }

        /**
         * Get the questions based on current data-set
         * @param dataset -> name of data-set
         */
        function getQuestionsByDataset(dataset, isBasicSearch) {
            var questions = [];
            if (dataset === 'prams') {
                isBasicSearch ? questions = $rootScope.pramsBasicQuestions
                    : questions = $rootScope.pramsAdvanceQuestions;
            } else if (dataset === 'brfss') {
                isBasicSearch ? questions = $rootScope.brfsBasicQuestions
                    : questions = $rootScope.brfsAdvanceQuestions;
            }
            return questions;
        }

        /**
         * Update yrbs questions based on topics
         * @param topic
         */
        function getYrbsQuestionsForTopic(topic) {
            if(topic == 'All Health Topics'){
                return $rootScope.questions;
            } else {
                return [utilService.findByKeyAndValue($rootScope.questions, 'text', topic)];
            }
        }

        /**
         * Filter out questions based on topics
         */
        function getQuestionsByTopics(topics, questionList) {
            var questions = [];
            angular.forEach(topics, function (topic) {
                var ques = utilService.findByKeyAndValue(questionList, 'id', topic);
                questions.push(ques);
            });
            return questions;
        }

        function populateSelectedFilters(primaryFilter, updatedSideFilters) {
            var allFilters = primaryFilter.sideFilters[0].sideFilters[0].filters;
            var refreshFiltersOnChange = false;
            //populate side filters based on cached query filters
            angular.forEach(updatedSideFilters, function (category, catIndex) {
                var localCategory = primaryFilter.sideFilters[catIndex];
                if(category.selectedFilter) {
                    localCategory.selectedFilter = category.selectedFilter;
                }

                angular.forEach(category.sideFilters, function(filter, index) {
                    if (localCategory) {
                        refreshFiltersOnChange = refreshFiltersOnChange || localCategory.sideFilters[index].refreshFiltersOnChange;
                    }
                    localCategory.sideFilters[index].filters.value = filter.filters.value;
                    localCategory.sideFilters[index].filters.groupBy = filter.filters.groupBy;

                    if (filter.filters.filterType === 'slider') {
                        localCategory.sideFilters[index].filters.sliderValue = filter.filters.sliderValue;
                    }

                    if (filter.filters.selectedNodes != undefined) {
                        localCategory.sideFilters[index].filters.selectedNodes = filter.filters.selectedNodes;
                        localCategory.sideFilters[index].filters.selectedValues = filter.filters.selectedValues;
                        if(filter.filters.key === 'ucd-chapter-10' ) {
                            // for ucd filters, the autocomplete optios is set to the selected values
                            localCategory.sideFilters[index].filters.autoCompleteOptions = filter.filters.selectedValues.map(function (node) {
                                return {key: node.id, title: node.text}
                            });
                        }else if (filter.filters.key === 'mcd-chapter-10'){
                            // for mcd filters, the autocomplete optios is set to the selected values
                            localCategory.sideFilters[index].filters.autoCompleteOptions = [];
                            if(filter.filters.selectedValues.set1){
                                    localCategory.sideFilters[index].filters.autoCompleteOptions = localCategory.sideFilters[index].filters.autoCompleteOptions.concat(filter.filters.selectedValues.set1.map(function (node) {
                                        return {key: node.id, title: node.text}
                                    }));
                            }
                            if(filter.filters.selectedValues.set2){
                                   localCategory.sideFilters[index].filters.autoCompleteOptions = localCategory.sideFilters[index].filters.autoCompleteOptions.concat(filter.filters.selectedValues.set2.map(function (node) {
                                        return {key: node.id, title: node.text}
                                    }));
                            }
                            if (!filter.filters.selectedValues.set1 && !filter.filters.selectedValues.set2){
                                localCategory.sideFilters[index].filters.autoCompleteOptions = utilService.getICD10ChaptersForMCD();
                            }

                        }
                    }
                    //To un-select selected nodes when user go back from current page
                    else if (localCategory.sideFilters[index].filters.selectedNodes != undefined) {
                        localCategory.sideFilters[index].filters.selectedNodes.length = 0;
                        localCategory.sideFilters[index].filters.selectedValues.length = 0;
                        if(localCategory.sideFilters[index].filters.key === 'ucd-chapter-10') {
                            localCategory.sideFilters[index].filters.autoCompleteOptions = utilService.getICD10ChaptersForUCD();
                        }
                        else if(localCategory.sideFilters[index].filters.key === 'mcd-chapter-10') {
                            localCategory.sideFilters[index].filters.autoCompleteOptions = utilService.getICD10ChaptersForMCD();
                        }
                    }
                    addOrFilterToPrimaryFilterValue(filter.filters, primaryFilter);
                });
            });
            if(refreshFiltersOnChange) {
                utilService.refreshFilterAndOptions(allFilters, primaryFilter.sideFilters, primaryFilter.key, primaryFilter.tableView);
            }
        }

        /*
            Builds table based on primaryFilter and options
         */
        function getMixedTable(selectedFilter, groupOptions, tableView, calculatePercentage){
            var file = selectedFilter.data ? selectedFilter.data : {};
            var dataCounts = selectedFilter.dataCounts ? selectedFilter.dataCounts : {};

            if(selectedFilter.key === 'prams' || selectedFilter.key === 'brfss'
                || selectedFilter.key == 'mental_health') {
                var questions = [];
                angular.forEach(file.question, function(question) {
                    angular.forEach(question, function(response, key) {
                        if(key !== 'name') {
                            responseRow = response;
                            responseRow.name = question.name;
                            responseRow.response = key;
                            questions.push(responseRow);
                        }
                    });
                });
                file = {question: questions};
            }
            var headers = selectedFilter.headers ? selectedFilter.headers : {columnHeaders: [], rowHeaders: []};

            headers.rowHeaders = updateSplitHeaders(headers.rowHeaders);
            headers.columnHeaders = updateSplitHeaders(headers.columnHeaders);

            //make sure row/column headers are in proper order
            angular.forEach(headers.rowHeaders, function(header) {
                sortAutoCompleteOptions(header, groupOptions[tableView]);
            });
            angular.forEach(headers.columnHeaders, function(header) {
                sortAutoCompleteOptions(header, groupOptions[tableView]);
            });
            var countKey = selectedFilter.key;
            var countLabel = selectedFilter.countLabel;
            var totalCount = selectedFilter.count;
            if (calculatePercentage === undefined || calculatePercentage === null) {
                calculatePercentage = (selectedFilter.key === 'deaths' && tableView === 'number_of_deaths') ||
                                      (selectedFilter.key === 'natality' && tableView === 'number_of_births') ||
                                      (selectedFilter.key === 'bridge_race' && tableView === 'bridge_race');
            }
            var calculateRowTotal = selectedFilter.calculateRowTotal;
            var secondaryCountKeys = ['pop', 'ageAdjustedRate', 'standardPop', 'deathRate'];

            var tableData = utilService.prepareMixedTableData(headers, file, dataCounts, countKey, totalCount, countLabel,
                selectedFilter.grandTotals, calculatePercentage, calculateRowTotal, secondaryCountKeys,
                filterUtils.getAllOptionValues(), tableView);

            if (selectedFilter.key === 'prams' ||selectedFilter.key === 'brfss' || selectedFilter.key == 'mental_health') {
                tableData.headers[0].splice(1, 0, { colspan: 1, rowspan: tableData.headers.length, title: "Response", helpText: $filter('translate')('label.help.text.prams.response') });
            }

            return tableData;
        }

        function updateSplitHeaders(headersin) {
            var headers = utilService.clone(headersin);
            var newHeaders = [];
            angular.forEach(headers, function (header, index) {
                header.onIconClick = headersin[index].onIconClick;  // copy the method that doesn't get cloned
                if (header.queryType === "compound") {
                    var newHeader = utilService.clone(header);
                    newHeader.onIconClick = header.onIconClick;
                    var queryKeys = header.queryKeys;
                    var titles = header.titles;

                    header.key += "|" + queryKeys[0];
                    header.queryKey = queryKeys[0];
                    header.title = titles[0];

                    newHeader.key += "|" + queryKeys[1];
                    newHeader.queryKey = queryKeys[1];
                    newHeader.title = titles[1];
                    var subOptions = [];
                    angular.forEach(newHeader.autoCompleteOptions, function (option) {
                        angular.forEach(option.options, function (subOption) {
                            subOptions.push(subOption);
                        });
                    });
                    newHeader.autoCompleteOptions = subOptions;

                    newHeaders.push({ index: index + 1, header: newHeader });
                }
            });

            angular.forEach(newHeaders, function (newHeader) {
                headers.splice(newHeader.index, 0, newHeader.header);
            });

            return headers;
        }

        //takes mixedTable and returns categories array for use with owhAccordionTable
        function categorizeQuestions(data, questions) {
            const QuestionsPerCategory = 2;

            var categories = [];
            angular.forEach(questions, function(questionCategory){
                var questionCount = 0, rowCount = 0;
                var category = {title: questionCategory.text, questions: [], hide: true};
                angular.forEach(questionCategory.children, function(categoryChild) {
                    angular.forEach(data, function(row) {
                        if(row[0].qkey === categoryChild.id) {
                            category.questions.push(row);

                            if (!row[0].isNotQuestionCell) {
                                questionCount++;
                            }

                            if (questionCount <= QuestionsPerCategory) {
                                rowCount++;
                            }
                        }
                    });
                });

                category.questionsCount = questionCount;
                category.rowsToShow = rowCount;

                categories.push(category);
            });

            return categories;
        }

        function removeDisabledFilters(selectedFilter, filterView, availableFilters) {
            if(availableFilters[filterView]) {
                angular.forEach(selectedFilter.allFilters, function(filter, index) {
                    if(availableFilters[filterView].indexOf(filter.key) < 0) {
                        filter.value = [];
                        filter.groupBy = false;
                    }
                });
                angular.forEach(selectedFilter.sideFilters, function(category){
                    angular.forEach(category.sideFilters, function(filter, index) {
                        if(availableFilters[filterView].indexOf(filter.filters.key) < 0) {
                            filter.filters.value = [];
                            filter.filters.groupBy = false;
                        }
                    });
                });
            }
        }

        function groupAutoCompleteOptions(filter, sort) {
            var groupedOptions = [];
            var filterLength = 0;
            //build groupOptions object from autoCompleteOptions
            if(sort && sort[filter.key]) {
                //find corresponding key in sort object
                for(var i = 0; i < sort[filter.key].length; i++) {
                    angular.forEach(filter.autoCompleteOptions, function(option) {
                        //if type string, then just a regular option
                        if(typeof sort[filter.key][i] === 'string') {
                            //not group option
                            if(sort[filter.key][i] === option.key) {
                                filterLength++;
                                groupedOptions.push(option);
                            }
                        } else {
                            //else, group option
                            //check if group option contains the filter option
                            //is same parent group option
                            if(sort[filter.key][i].key === option.key) {
                                groupedOptions.push(option);
                            }
                            //otherwise is child of group option
                            else if(sort[filter.key][i].options.indexOf(option.key) >= 0) {
                                var parentOption = {
                                    key: sort[filter.key][i].key,
                                    title: sort[filter.key][i].title,
                                    group: true,
                                    options: []
                                };
                                //if empty, add option
                                if(groupedOptions.length === 0) {
                                    filterLength++;
                                    groupedOptions.push(parentOption);
                                }
                                //go through already grouped options and find parent option
                                for(var j = 0; j < groupedOptions.length; j++) {
                                    var groupedOption = groupedOptions[j];
                                    if(groupedOption.key === sort[filter.key][i].key) {
                                        filterLength++;
                                        groupedOption.options.push(option);
                                        break;
                                    }
                                    //parent not found, add new group option for parent
                                    if(j === groupedOptions.length - 1) {
                                        filterLength++;
                                        groupedOptions.push(parentOption);
                                    }
                                }
                            }
                        }
                    });
                }
                //sort each group
                angular.forEach(groupedOptions, function(groupedOption, index) {
                    if(groupedOption.options) {
                        groupedOption.options.sort(function(a, b) {
                            return sort[filter.key][index].options.indexOf(a.key) - sort[filter.key][index].options.indexOf(b.key);
                        });
                    }
                });
                filter.autoCompleteOptions = groupedOptions;
                filter.filterLength = filterLength;
            }

        }

        function sortAutoCompleteOptions(filter, sort) {
            var sortedOptions = [];
            var filterLength = 0;
            //build sortedOptions object from autoCompleteOptions
            if(sort && sort[filter.key]) {
                //find corresponding key in sort object
                for(var i = 0; i < sort[filter.key].length; i++) {
                    angular.forEach(filter.autoCompleteOptions, function(option) {
                        //if type string, then just a regular option
                        if(typeof sort[filter.key][i] === 'string' && !option.options) {
                            //not group option
                            if(sort[filter.key][i] === option.key) {
                                filterLength++;
                                sortedOptions.push(option);
                            }
                        } else {
                            //else, group option
                            //is same parent group option
                            if(option.options) {
                                angular.forEach(option.options, function (subOption) {
                                    if (sort[filter.key][i].options && sort[filter.key][i].options.indexOf(subOption.key) >= 0) {
                                        sortedOptions.push(subOption);
                                    }
                                });
                            } else {
                                if (sort[filter.key][i].options && sort[filter.key][i].options.indexOf(option.key) >= 0) {
                                    sortedOptions.push(option);
                                }
                            }
                        }
                    });
                }
                filter.autoCompleteOptions = sortedOptions;
                filter.filterLength = filterLength;
            }
        }

        //Fetch the survey data from stats service
        function invokeStatsService( primaryFilter, queryID ) {
            var deferred = $q.defer();
            queryStatsAPI(primaryFilter, queryID ).then(function(response){
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        //Query Stats API
        function queryStatsAPI( primaryFilter, queryID ) {
            var deferred = $q.defer();
            SearchService.searchResults(primaryFilter, queryID).then(function(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function addOrFilterToPrimaryFilterValue(filter, primaryFilter) {
            var existingFilter = utilService.findByKeyAndValue(primaryFilter.value, 'key', filter.key);
            if (existingFilter) {
                if (filter.groupBy) {
                    existingFilter.groupBy = filter.groupBy;
                }
                else {
                    var filterIndex = primaryFilter.value.indexOf(existingFilter);
                    primaryFilter.value.splice(filterIndex, 1);
                }
            }
            else if (filter.groupBy) {
                primaryFilter.value.push(filter);
            }
        }

        /**
         * Display chart for Selected YRBS Question
         * @param primaryFilter
         * @param question
         */
        function showChartForQuestion(primaryFilter, question) {

            prepareQuestionChart(primaryFilter, question).then(function (response) {
                chartUtilService.showExpandedGraph([response.chartData], null, question.title,
                    null, response.chartTypes, primaryFilter, question, utilService.getSelectedFiltersText(primaryFilter.allFilters, []));
            });

        }

        /**
         * This function is used to build visualization data based on selected filters
         * If chart type is specified, visualization will be built for selected chart type
         * Otherwise visualizations will be decided with different combinations of selected filter
         * @param primaryFilter -> YRBS side filters
         * @param question -> Seleted question for which visualizations needs to be built
         * @param chartType -> Array of keys of selected combination e.g. ['yrbsSex', 'yrbsRace']
         */
        function prepareQuestionChart(primaryFilter, question, chartType ) {
            //make copy of side filters
            var copiedPrimaryFilter = angular.copy(primaryFilter);

            //get the selected side filters
            var selectedFilters = copiedPrimaryFilter.value;

            //possible chart combinations
            var chartMappings = {
                "yrbsSex&yrbsRace": "horizontalBar",
                "yrbsSex&yrbsGrade": "horizontalBar", "yrbsGrade&yrbsRace": "horizontalBar",
                "yrbsSex": "horizontalBar", "yrbsRace": "horizontalBar",
                "race": "horizontalBar", "gender": "horizontalBar",
                "income": "horizontalBar", "age_group": "horizontalBar",
                "education": "horizontalBar", "yrbsGrade": "horizontalBar",
                "yrbsState": "horizontalBar", "year": "horizontalBar",
                "sex": "horizontalBar", "state": "horizontalBar",
                "adequacy": "horizontalBar" , "birth_weight": "horizontalBar",
                "marital_status": "horizontalBar", "maternal_age_groupings": "horizontalBar",
                "maternal_age_years": "horizontalBar", "maternal_age_3": "horizontalBar",
                "maternal_age_4": "horizontalBar", "maternal_education": "horizontalBar",
                "maternal_race": "horizontalBar", "medicaid": "horizontalBar",
                "mother_hispanic": "horizontalBar", "previous_births": "horizontalBar",
                "wic_pregnancy": "horizontalBar", "pregnancy_intendedness": "horizontalBar",
                "smoked_before": "horizontalBar", "smoked_last": "horizontalBar"

            };

            var chartTypes = [];

            //collect all chart combinations
            // Disabling combination charts for now, see OWH-1363
            selectedFilters.forEach( function(selectedPrimaryFilter) {
                var chartType = chartMappings[selectedPrimaryFilter.key];
                if(chartType){
                      chartTypes.push([selectedPrimaryFilter.key]);
                }
                /*//var chartType = chartMappings[selectedPrimaryFilter.key];
                if (selectedPrimaryFilter.key != 'question') {
                    chartTypes.push([selectedPrimaryFilter.key]);
                }*/
            });
            // selectedFilters.forEach( function(selectedPrimaryFilter) {
            //     selectedFilters.forEach( function(selectedSecondaryFilter) {
            //         var chartType;
            //         //for single filter
            //         if (selectedPrimaryFilter === selectedSecondaryFilter) {
            //             chartType = chartMappings[selectedPrimaryFilter.key];
            //             if(chartType) {
            //                 chartTypes.push([selectedPrimaryFilter.key]);
            //             }
            //         } else {//for combinations of two filters
            //             chartType = chartMappings[selectedPrimaryFilter.key + '&' + selectedSecondaryFilter.key];
            //             if(chartType) {
            //                 chartTypes.push([selectedPrimaryFilter.key, selectedSecondaryFilter.key]);
            //             }
            //         }
            //     });
            // });
            // Disabling combination charts for now, see OWH-1363

            //reset all grouping combinations
            utilService.updateAllByKeyAndValue(copiedPrimaryFilter.allFilters, 'groupBy', false);

            //get the question filter and update question filter with selected question
            var questionFilter = utilService.findByKeyAndValue(copiedPrimaryFilter.allFilters, 'key', 'question');
            questionFilter.value = [question.qkey];

            if(copiedPrimaryFilter.key === 'prams' || copiedPrimaryFilter.key === 'brfss') {
                var topicFilter = utilService.findByKeyAndValue(copiedPrimaryFilter.allFilters, 'key', 'topic');
                topicFilter.questions = [question.qkey];
            }

            //if chart type is not specified, select first from possible combinations
            if(!chartType) {
                chartType = chartTypes[0];
            }

            var chartFilters = [];
            //set column groupings on selected chart
            angular.forEach(chartType, function(eachKey) {
                var eachFilter = utilService.findByKeyAndValue(copiedPrimaryFilter.allFilters, 'key', eachKey);
                eachFilter.groupBy = 'column';
                eachFilter.getPercent = true;
                chartFilters.push(eachFilter);
            });
            copiedPrimaryFilter.isChartorMapQuery = true;
            var deferred = $q.defer();
            //calculate query hash
            generateHashCode(copiedPrimaryFilter).then(function (hash) {
                //get the chart data
                SearchService.searchResults(copiedPrimaryFilter, hash).then(function(response) {
                    var chartData;
                    //chart data for single filter
                    if (chartFilters.length == 1) {
                        chartData = chartUtilService.horizontalBar(chartFilters[0],
                            chartFilters[0], response.data.resultData.table, copiedPrimaryFilter, '%');
                    } else {//chart data for two filters
                        chartData = chartUtilService.horizontalBar(chartFilters[0],
                            chartFilters[1], response.data.resultData.table, copiedPrimaryFilter, '%');
                    }
                    deferred.resolve({
                        chartData: chartData,
                        chartTypes : chartTypes
                    });
                });
            });
            return deferred.promise;
        }

        /**
         * Get the responses for all states and prepare them so as to display in map
         * @param primaryFilter
         * @param question
         * @return promise -> Array of state data
         * e.g. [{
         *          name:"AL",
         *          responses:[
         *              {resp:'Yes', data:{mean:39,ci_l:12, ci_u:14, count:1234}}
         *              {resp:'No', data:{mean:49,ci_l:22, ci_u:24, count:1234}}
         *          ]
         *      }]
         */
        function getMapDataForQuestion(primaryFilter, question) {
            //make copy of side filters
            var copiedPrimaryFilter = angular.copy(primaryFilter);
            //reset all grouping combinations
            utilService.updateAllByKeyAndValue(copiedPrimaryFilter.allFilters, 'groupBy', false);
            //get the question filter and update question filter with selected question
            var questionFilter = utilService.findByKeyAndValue(copiedPrimaryFilter.allFilters, 'key', 'question');
            questionFilter.value = [question.qkey];
            if(copiedPrimaryFilter.key === 'prams' || copiedPrimaryFilter.key === 'brfss') {
                var topicFilter = utilService.findByKeyAndValue(copiedPrimaryFilter.allFilters, 'key', 'topic');
                topicFilter.questions = [question.qkey];
            }
            var stateFilter = utilService.findByKeyAndValue(copiedPrimaryFilter.allFilters, 'queryKey', 'sitecode');
            stateFilter.groupBy = 'column';
            stateFilter.getPercent = true;
            stateFilter.value = "";
            var deferred = $q.defer();
            generateHashCode(copiedPrimaryFilter).then(function (hash) {
                //get the chart data
                SearchService.searchResults(copiedPrimaryFilter, hash).then(function(response) {
                    var data = response.data.resultData.table.question[0];
                    delete data.name;
                    var responseTypes = Object.keys(data);
                    primaryFilter.responses = responseTypes;
                    var states = [];
                    //collect responses for all state
                    stateFilter.autoCompleteOptions.forEach(function (state) {
                        var stateResp = [];
                        //collect response for each response type for a state
                        responseTypes.forEach(function (respType) {
                            var rData = utilService.findByKeyAndValue(data[respType].sitecode, 'name', state.key);
                            if(rData) {
                                stateResp.push( {
                                    rKey: respType,
                                    rData: rData[copiedPrimaryFilter.key]
                                });
                            }
                        });
                        //state response for all response types
                        states.push({
                            name:state.key,
                            responses: stateResp
                        });
                    });
                    deferred.resolve(states);
                });
            });
            return deferred.promise;
        }

        function populateSideFilterTotals(primaryFilter, response) {
            primaryFilter.count = response.sideFilterResults.pagination.total;
            angular.forEach(response.sideFilterResults.data.simple, function (eachFilterData, key) {
                //fill auto-completer data with counts
                var filter = utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', key);
                if (filter) {
                    if (filter.autoCompleteOptions) {
                        populateSideFilterTotalsOption(filter.autoCompleteOptions, eachFilterData, primaryFilter);
                    } else {
                        var autoCompleteOptions = [];
                        angular.forEach(eachFilterData, function (eachData) {
                            var eachOption = {key: eachData.name, title: eachData.name};
                            eachOption[primaryFilter.key] = eachData[primaryFilter.key];
                            eachOption['count'] = eachData[primaryFilter.key];
                            eachOption[primaryFilter.key + 'Percentage'] = Number(((eachData[primaryFilter.key] / primaryFilter.count) * 100).toFixed(2));
                            autoCompleteOptions.push(eachOption);
                        });
                        filter.autoCompleteOptions = autoCompleteOptions;
                    }
                    //sort on primary filter key.. so that it will rendered in desc order in side filter
                    //filter.sortedAutoCompleteOptions = utilService.sortByKey(angular.copy(filter.autoCompleteOptions), 'count', false);
                }
            });
        }

        function populateSideFilterTotalsOption(autoCompleteOptions, filterData, primaryFilter) {
            angular.forEach(autoCompleteOptions, function (option) {
                if (option.group) {
                    populateSideFilterTotalsOption(option.options, filterData, primaryFilter);
                }
                else {
                    var optionData = utilService.findByKeyAndValue(filterData, 'name', option.key);
                    if (optionData) {
                        option[primaryFilter.key] = optionData[primaryFilter.key];
                        option['count'] = optionData[primaryFilter.key];
                        option[primaryFilter.key + 'Percentage'] = 0;
                        option[primaryFilter.key + 'Percentage'] = Number(((optionData[primaryFilter.key] / primaryFilter.count) * 100).toFixed(2));
                    } else {
                        option[primaryFilter.key] = 0;
                        option['count'] = 0;
                        option[primaryFilter.key + 'Percentage'] = 0;
                    }
                }
            });
        }

        function prepareMortalityResults(primaryFilter, response) {
            primaryFilter.data = response.resultData.nested.table;
            primaryFilter.calculatePercentage = true;
            primaryFilter.calculateRowTotal = true;
            primaryFilter.chartDataFromAPI = response.resultData.simple;
            primaryFilter.maps = response.resultData.nested.maps;
        }

        function removeSearchResults(ac){
            if(ac){
                for (var i =0; i < ac.length; i++ ){
                    delete ac[i].deaths;
                    delete ac[i].count;
                    delete ac[i].deathsPercentage;
                }
            }
        }
        function createBackendSearchRequest(pFilter){
            var req = {};
            req.key= pFilter.key;
            req.searchFor = pFilter.searchFor;
            req.tableView = pFilter.tableView;
            req.allFilters = []
            for (var i = 0; i< pFilter.allFilters.length; i++){
                var filter = utilService.clone(pFilter.allFilters[i]);
                // Clear autocomplete options for mcd and ucd
                removeSearchResults(filter.autoCompleteOptions);
                req.allFilters.push(filter);
            }
            req.sideFilters = [];
            for (var i = 0; i< pFilter.sideFilters.length; i++){
                var category = utilService.clone(pFilter.sideFilters[i]);
                angular.forEach(category.sideFilters, function(filter, filterIndex) {
                    // Clear autocomplete options for mcd and ucd
                    if( filter.filters.key == "mcd-chapter-10" || filter.filters.key == "ucd-chapter-10" || filter.filters.key == "mcd-filters"){
                        filter.filters.autoCompleteOptions = [];
                    }
                    removeSearchResults(filter.filters.autoCompleteOptions);
                });
                req.sideFilters.push(category);
            }
            return req;
        }


        function searchMortalityResults(primaryFilter, queryID) {
            var deferred = $q.defer();
            queryMortalityAPI(primaryFilter, queryID).then(function(response){
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function generateHashCode(primaryFilter) {
            var deferred = $q.defer();
            var hashQuery = buildHashcodeQuery(primaryFilter);
            SearchService.generateHashCode(hashQuery).then(function(response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }

        function buildHashcodeQuery(primaryFilter) {
            var hashQuery = {
                primaryKey: primaryFilter.key,
                tableView: primaryFilter.tableView,
                filters: [],
                isPrecomputed: primaryFilter.showBasicSearchSideMenu
            };
            angular.forEach(primaryFilter.sideFilters, function(category){
                angular.forEach(category.sideFilters, function(filter) {
                    hashQuery.filters.push({
                        key: filter.filters.key,
                        groupBy: filter.filters.groupBy,
                        value: filter.filters.value instanceof Array ? filter.filters.value.sort() : filter.filters.value
                    });
                });
            });
            return hashQuery;
        }

        /**
         * Get owhquery_cache data using queryID
         * @param queryId
         * @returns {Function}
         */
        function getQueryResults(queryId) {
            var deferred = $q.defer();
            SearchService.searchResults(null,queryId).then(function(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        //search results by grouping
        function queryMortalityAPI( primaryFilter, queryID) {
            var deferred = $q.defer();
            //Passing completed primaryFilters to backend and building query at server side
            SearchService.searchResults(createBackendSearchRequest(primaryFilter), queryID).then(function(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function prepareChartData(headers, nestedData, primaryFilter) {
            var chartData = [];
            if(primaryFilter.showMap) {
                chartData.push(primaryFilter.mapData);
            }
            //When user selects more than one filter
            if( headers.chartHeaders.length > 0 ) {
                angular.forEach(headers.chartHeaders, function(eachChartHeaders, index) {
                    chartData.push(chartUtilService[eachChartHeaders.chartType](eachChartHeaders.headers[0], eachChartHeaders.headers[1], nestedData.charts[index], primaryFilter));
                });
            }else if( ( headers.rowHeaders.length + headers.columnHeaders.length ) === 1 ) {
                var data = nestedData.table;
                var header = (headers.rowHeaders.length === 1) ? headers.rowHeaders[0] : headers.columnHeaders[0];
                var pieData = data[header.key];
                //for current_year dhow line graph
                if (header.key == 'current_year') {
                    chartData.push(chartUtilService.lineChart(pieData, header, primaryFilter));
                } else if (header.key.indexOf("census-region") >= 0) {
                    // TODO: Remove this else if block after fixing server side for charts data for census regions and divisions
                } else {//for other single filters, show pie chart
                    chartData.push(chartUtilService.plotlyPieChart(pieData, header, primaryFilter));
                }
            }

            //prepare charts data to render three charts in a row
            var eachArr = [],chartDataArr=[];
            if(chartData.length>3) {
                angular.forEach(chartData,function(value, index){
                    if((index+1) % 3 === 0 ) {
                        eachArr.push(value);
                        chartDataArr.push(eachArr);
                        eachArr=[];
                    }else if(chartData.length === index+1){
                        eachArr.push(value);
                        chartDataArr.push(eachArr);
                    }else{
                        eachArr.push(value);
                    }
                });
            }else{
                angular.forEach(chartData,function(value, index){
                    eachArr.push(value);
                });
                chartDataArr.push(eachArr);
            }
            return chartDataArr;
        }

        function prepareChartAggregations(headers) {
            var chartHeaders = [];
            var chartAggregations = [];
            angular.forEach(headers, function(eachPrimaryHeader) {
                if(eachPrimaryHeader.key.indexOf("census-region")>=0) {
                    return; // TODO: Remove this if block after fixing server side for charts data for census regions and divisions
                }
                var primaryGroupQuery = getGroupQuery(eachPrimaryHeader);
                angular.forEach(headers, function(eachSecondaryHeader) {
                    if(eachPrimaryHeader.key.indexOf("census-region")>=0) {
                        return; // TODO: Remove this if block after fixing server side for charts data for census regions and divisions
                    }
                        var chartType = $rootScope.chartMappings[eachPrimaryHeader.key + '&' + eachSecondaryHeader.key];
                    if(chartType) {
                        var secondaryGroupQuery = getGroupQuery(eachSecondaryHeader);
                        chartHeaders.push({headers: [eachPrimaryHeader, eachSecondaryHeader], chartType: chartType});
                        chartAggregations.push([primaryGroupQuery, secondaryGroupQuery]);
                    }
                });
            });
            return {
                chartHeaders: chartHeaders,
                chartAggregations: chartAggregations
            }
        }


        function prepareMapAggregations() {
            var chartAggregations = [];
            var primaryGroupQuery = {
                key: "states",
                queryKey: "state",
                size: 100000
            };
            var secondaryGroupQuery = {
                key: "sex",
                queryKey: "sex",
                size: 100000
            };
            chartAggregations.push([primaryGroupQuery, secondaryGroupQuery]);
            return chartAggregations;
        }

        //build grouping query for api
        function buildAPIQuery(primaryFilter) {
            var apiQuery = {
                searchFor: primaryFilter.key,
                countQueryKey: primaryFilter.countQueryKey,
                query: {},
                aggregations: {
                    simple: [],
                    nested: {
                        table: [],
                        charts: [],
                        maps:[]
                    }
                }
            };
            //var defaultAggregations = [];
            var rowAggregations = [];
            var columnAggregations = [];
            var headers = {
                rowHeaders: [],
                columnHeaders: [],
                chartHeaders: []
            };
            //var defaultHeaders = [];
            var sortedFilters = utilService.sortFilters(angular.copy(primaryFilter.allFilters), getAutoCompleteOptionsLength);
            angular.forEach(sortedFilters, function(eachFilter) {
                if(eachFilter.groupBy) {
                    var eachGroupQuery = getGroupQuery(eachFilter);
                    if ( eachFilter.groupBy === 'row' ) {
                        //user defined aggregations for rendering table
                        rowAggregations.push(eachGroupQuery);
                        //For STD, TB, HIV-AIDS, if user set groupBy row and select ["Both sexes", "All races/ethnicities", "All age groups", "National"] filter
                        //then setting filter value to empty, so that all filter options will be appear on visualizations
                        if(filterUtils.getAllOptionValues().indexOf(eachFilter.value) > -1) {
                            eachFilter.value = "" ;
                        }
                        headers.rowHeaders.push(eachFilter);
                    } else if( eachFilter.groupBy === 'column' ) {
                        columnAggregations.push(eachGroupQuery);
                        //For STD, TB, HIV-AIDS, if user set groupBy column and select ["Both sexes", "All races/ethnicities", "All age groups", "National"] filter
                        //then setting filter value to empty, so that all filter options will be appear on table column
                        if(filterUtils.getAllOptionValues().indexOf(eachFilter.value) > -1) {
                            eachFilter.value = "" ;
                        }
                        headers.columnHeaders.push(removeDisabledFilterOptions(eachFilter));
                    }
                }
                var eachFilterQuery = buildFilterQuery(eachFilter);
                if(eachFilterQuery) {
                    apiQuery.query[eachFilter.queryKey] = eachFilterQuery;
                }
            });
            apiQuery.aggregations.nested.table = rowAggregations.concat(columnAggregations);
            var result = prepareChartAggregations(headers.rowHeaders.concat(headers.columnHeaders));
            headers.chartHeaders = result.chartHeaders;
            apiQuery.aggregations.nested.charts = result.chartAggregations;
            apiQuery.aggregations.nested.maps = prepareMapAggregations();
            //apiQuery.aggregations.nested = apiQuery.aggregations.nested.concat(defaultAggregations);
            //headers = headers.concat(defaultHeaders);
            return {
                apiQuery: apiQuery,
                headers: headers
            };
        }

        /**
         * Remove disabled filter options and return new copy of filter
         * @param filter
         * @returns {*|T}
         */
        function removeDisabledFilterOptions(filter) {
            var tempFilter = angular.copy(filter);
            tempFilter.autoCompleteOptions = filter.autoCompleteOptions.filter(function(option) {
                return option.disabled !== true;
            });
            return tempFilter;
        }

        function getGroupQuery(filter/*, isPrimary*/) {
            var groupQuery = {
                key: filter.key,
                queryKey: filter.aggregationKey ? filter.aggregationKey : filter.queryKey,
                getPercent: filter.getPercent,
                size: 100000
            };/*
            if(isPrimary) {
                groupQuery.isPrimary = true;
            }*/
            return groupQuery;
        }

        function buildFilterQuery(filter) {
            //need to calculate value length for group options, as the parent option can count as extra value
            var valueLength = filter.value?filter.value.length:0;
            angular.forEach(filter.autoCompleteOptions, function(option) {
                if(option.options) {
                    if(filter.value && filter.value.indexOf(option.key) >= 0) {
                        valueLength--;
                    }
                }
            });
            if( utilService.isValueNotEmpty(filter.value) && valueLength !== getAutoCompleteOptionsLength(filter)) {
                return getFilterQuery(filter);
            }
            return false;
        }

        function getFilterQuery(filter) {
            var values = [];
            return {
                key: filter.key,
                queryKey: filter.queryKey,
                value: filter.value,
                primary: filter.primary
            };
        }

        function getAutoCompleteOptionsLength(filter) {
            //take into account group options length
            var length = filter.autoCompleteOptions ? filter.autoCompleteOptions.length : 0;
            if (filter.key === 'ucd-chapter-10' || filter.key === 'mcd-chapter-10') {
                return 0 ;
            }
            if(filter.autoCompleteOptions) {
                angular.forEach(filter.autoCompleteOptions, function(option) {
                    if(option.options) {
                        //if value has group option, then don't subtract from calculated length
                        if(filter.value && filter.value.indexOf(option.key) < 0) {
                            length--;
                        }
                        length += option.options.length;
                    }
                });
            }
            return length;
        }

        function buildQueryForYRBS(primaryFilter, dontAddYearAgg) {
            var result = buildAPIQuery(primaryFilter);
            var apiQuery = result.apiQuery;
            var headers = result.headers;
            var resultFilter = headers.columnHeaders.length > 0 ? headers.columnHeaders[0] : headers.rowHeaders[0];
            var resultAggregation = utilService.findByKeyAndValue(apiQuery.aggregations.nested.table, 'key', resultFilter.key);
            resultAggregation.isPrimary = true;
            apiQuery.dataKeys = utilService.findAllNotContainsKeyAndValue(resultFilter.autoCompleteOptions, 'isAllOption', true);
            angular.forEach(headers.columnHeaders.concat(headers.rowHeaders), function(eachFilter) {
                var allValues = utilService.getValuesByKeyIncludingKeyAndValue(eachFilter.autoCompleteOptions, 'key', 'isAllOption', true);
                if(eachFilter.key === resultFilter.key) {
                    if(apiQuery.query[eachFilter.queryKey]) {
                        apiQuery.query[eachFilter.queryKey].value = allValues;
                    }
                } else if(eachFilter.key !== resultFilter.key && eachFilter.key !== 'question') {
                    if(!apiQuery.query[eachFilter.queryKey] || allValues.indexOf(apiQuery.query[eachFilter.queryKey].value) >= 0) {
                        apiQuery.query[eachFilter.queryKey] = getFilterQuery(eachFilter);
                        apiQuery.query[eachFilter.queryKey].value = utilService.getValuesByKeyExcludingKeyAndValue(eachFilter.autoCompleteOptions, 'key', 'isAllOption', true);
                    }
                }
            });
            apiQuery.query.primary_filter = getFilterQuery({key: 'primary_filter', queryKey: 'primary_filter', value: resultFilter.queryKey, primary: false});
            var yearFilter = utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', 'year');
            if(yearFilter.value.length != 1 && !dontAddYearAgg) {
                headers.columnHeaders.push(yearFilter);
                apiQuery.aggregations.nested.table.push(getGroupQuery(yearFilter));
            }
            result.resultFilter = resultFilter;
            return result;
        }


        function queryCensusAPI( primaryFilter, queryID ) {
            var deferred = $q.defer();
            SearchService.searchResults(primaryFilter, queryID).then(function(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        /**
         * Update the total count in side filter options
         * @param primaryFilter
         * @param sideFilterData
         */
        function updateSideFilterCount(primaryFilter, sideFilterData) {
            angular.forEach(sideFilterData, function (eachFilterData, key) {
                //get the filter
                var filter = utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', key);
                if (filter) {
                    //assign total count to all options
                    if (filter.autoCompleteOptions) {
                        angular.forEach(filter.autoCompleteOptions, function (option) {
                            var optionData = utilService.findByKeyAndValue(eachFilterData, 'name', option.key);
                            if (optionData) {
                                option[primaryFilter.key] = optionData[primaryFilter.key];
                            } else {
                                option[primaryFilter.key] = 0;
                            }
                        });
                    }
                }
            });
        }

        /**
         * Search census bridge race population estmation
         */
        function searchCensusInfo(primaryFilter, queryID) {
            var deferred = $q.defer();

            //remove circular JSON
            var query = angular.copy(primaryFilter);
            delete query.mapData;
            delete query.chartData;
            queryCensusAPI(query, queryID).then(function(response){
                //update total population count for side filters
                updateSideFilterCount(primaryFilter, response.data.sideFilterResults.data.simple);
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        function queryNatalityAPI( primaryFilter, queryID ) {
            var deferred = $q.defer();
            SearchService.searchResults(primaryFilter, queryID).then(function(response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        /**
         * Fetch natality data
         */
        function searchNatality(primaryFilter, queryID) {
            var deferred = $q.defer();

            queryNatalityAPI(primaryFilter, queryID).then(function(response){
                //update total count for side filters
                updateSideFilterCount(primaryFilter, response.data.sideFilterResults.data.simple);
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        /**
         * Fetch infant mortality data
         */
        function searchInfantMortality (primaryFilter, queryID) {
            var deferred = $q.defer();

            queryInfantMortality(primaryFilter, queryID).then(function (response) {
                updateSideFilterCount(primaryFilter, response.data.sideFilterResults.data.simple);
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        function queryInfantMortality (primaryFilter, queryID) {
            var deferred = $q.defer();
            SearchService.searchResults(primaryFilter, queryID)
                .then(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        /**
         * Search STD results
         * @param primaryFilter
         * @param queryID
         */
        function searchSTDResults(primaryFilter, queryID){
            var deferred = $q.defer();
            SearchService.searchResults(primaryFilter, queryID).then(function(response) {
                updateSideFilterCount(primaryFilter, response.data.sideFilterResults.data.simple);
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        /**
         * Fetch TB data based on filters
         * @param primaryFilter
         * @param queryID
         */
        function searchTBResults(primaryFilter, queryID){
            var deferred = $q.defer();
            SearchService.searchResults(primaryFilter, queryID).then(function(response) {
                updateSideFilterCount(primaryFilter, response.data.sideFilterResults.data.simple);
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function searchAIDSResults (primaryFilter, queryID) {
            var deferred = $q.defer();
            SearchService.searchResults(primaryFilter, queryID).then(function(response) {
                updateSideFilterCount(primaryFilter, response.data.sideFilterResults.data.simple);
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function searchCancerResults (primaryFilter, queryID) {
            var deferred = $q.defer();
            SearchService.searchResults(primaryFilter, queryID).then(function(response) {
                updateSideFilterCount(primaryFilter, response.data.sideFilterResults.data.simple);
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function getAllFilters() {
            //TODO: consider making these available as angular values, split out into separate file
            var filters = {};
            var confidenceIntervalOption = {
                title: 'Confidence Intervals',
                type: 'toggle',
                value: false,
                onChange: function(value, option) {
                    option.value = value;
                },
                options: [
                    {
                        title: 'label.mortality.search.table.show.percentage.button',
                        key: true
                    },
                    {
                        title: 'label.mortality.search.table.hide.percentage.button',
                        key: false
                    }
                ]
            };
            var sampleSizeOption = {
                title: 'Sample size',
                type: 'toggle',
                value: false,
                onChange: function(value, option) {
                    option.value = value;
                },
                options: [
                    {
                        title: 'label.mortality.search.table.show.percentage.button',
                        key: true
                    },
                    {
                        title: 'label.mortality.search.table.hide.percentage.button',
                        key: false
                    }
                ]
            };

            filters.filterUtilities = {
                'mental_health': [
                    {
                        title: 'Variance',
                        options: [
                            confidenceIntervalOption,
                            {
                                title: 'Unweighted Frequency',
                                type: 'toggle',
                                value: false,
                                onChange: function(value, option) {
                                    option.value = value;
                                },
                                options: [
                                    {
                                        title: 'label.mortality.search.table.show.percentage.button',
                                        key: true
                                    },
                                    {
                                        title: 'label.mortality.search.table.hide.percentage.button',
                                        key: false
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'prams' : [
                    {
                        title: 'Variance',
                        options: [
                            confidenceIntervalOption, sampleSizeOption
                        ]
                    }
                ],
                'brfss' : [
                    {
                        title: 'Variance',
                        options: [
                            confidenceIntervalOption, sampleSizeOption
                        ]
                    }
                ]
            };
            filters.groupOptions = [
                {key:'column',title:'Column', tooltip:'Select to view as columns on data table'},
                {key:'row',title:'Row', tooltip:'Select to view as rows on data table'},
                {key: false,title:'Off', tooltip:'Select to hide on data table'}
            ];
            filters.conditionGroupOptions = [
                {key:'row',title:'Row', tooltip:'Select to view as rows on data table'},
                {key: false,title:'Off', tooltip:'Select to hide on data table'}
            ];
            filters.columnGroupOptions = [
                {key:'column',title:'Column', tooltip:'Select to view as columns on data table'},
                {key: false,title:'Off', tooltip:'Select to hide on data table'}
            ];
            filters.inlineChartingOptions = [
                {key: true,title:'On', tooltip:'Select to view inline charts'},
                {key: false,title:'Off', tooltip:'Select to hide inline charts'}
            ];

            filters.diseaseVizGroupOptions = [
                {key:'cases', title:'Cases', axisLabel:'Cases', tooltip:'Select to view as cases on charts'},
                {key:'disease_rate', title:'Rates', axisLabel:'Rates', tooltip:'Select to view as rates on charts'}
            ];

            filters.deathsRateGroupOptions = [
                {key:'death',title:'Deaths', axisLabel:'Number of Infant Deaths', tooltip:'Select to view as deaths on charts'},
                {key:'infant_death_rate',title:'Rates', axisLabel:'Rates', tooltip:'Select to view as rates on charts'}
            ];

            filters.allowInlineCharting = false;
            //TODO check with @Gopal why mapping json don't have 'Other'
            filters.races = [
                {key: 'American Indian',title: 'American Indian or Alaska Native'},
                {key: 'Asian or Pacific Islander',title: 'Asian or Pacific Islander'},
                {key: 'Black',title: 'Black or African American'},
                {key: 'White',title: 'White'}
            ];
            filters.hispanicOptions = [
                {"key":"Central American","title":"Central American"},
                {"key":"Central and South American","title":"Central and South American"},
                {"key":"Cuban","title":"Cuban"},
                {"key":"Dominican","title":"Dominican"},
                {"key":"Latin American","title":"Latin American"},
                {"key":"Mexican","title":"Mexican"},
                {"key":"Non-Hispanic","title":"Non-Hispanic"},
                {"key":"Other Hispanic","title":"Other Hispanic"},
                {"key":"Puerto Rican","title":"Puerto Rican"},
                {"key":"South American","title":"South American"},
                {"key":"Spaniard","title":"Spaniard"},
                {"key":"Unknown","title":"Unknown"}
            ];

            filters.ethnicityGroupOptions = [
                {"key": 'Hispanic', "title": 'Hispanic'},
                {"key": 'Non-Hispanic', "title": "Non-Hispanic"}
            ];

            filters.weekday = [
                {key: 'Sunday', title: 'Sunday'},
                {key: 'Monday', title: 'Monday'},
                {key: 'Tuesday', title: 'Tuesday'},
                {key: 'Wednesday', title: 'Wednesday'},
                {key: 'Thursday', title: 'Thursday'},
                {key: 'Friday', title: 'Friday'},
                {key: 'Saturday', title: 'Saturday'},
                {key: 'Unknown', title: 'Unknown'}
            ];

            filters.autopsy = [
                {key: 'Yes', title: 'Yes'},
                {key: 'No', title: 'No'},
                {key: 'Unknown', title: 'Unknown'}
            ];

            filters.podOptions = [
                {key:'Decedent’s home',title:'Decedent’s home'},
                {key:'Hospital, Clinic or Medical Center - Dead on Arrival',title:'Hospital, Clinic or Medical Center-  Dead on Arrival'},
                {key:'Hospital, clinic or Medical Center - Inpatient',title:'Hospital, Clinic or Medical Center-  Inpatient'},
                {key:'Hospital, Clinic or Medical Center - Outpatient or admitted to Emergency Room',title:'Hospital, Clinic or Medical Center-  Outpatient or admitted to Emergency Room'},
                {key:'Hospital, Clinic or Medical Center - Patient status unknown',title:'Hospital, Clinic or Medical Center-  Patient status unknown'},
                {key:'Nursing home/long term care',title:'Nursing home/long term care'},
                {key:'Hospice facility',title:'Hospice facility'},
                {key:'Other',title:'Other'},
                {key:'Place of death unknown',title:'Place of death unknown'}
            ];

            filters.maritalStatuses = [
                {key:'M',title:'Married'},
                {key:'S',title:'Never married, single'},
                {key:'W',title:'Widowed'},
                {key:'D',title:'Divorced'},
                {key:'U',title:'Marital Status unknown'}
            ];

            filters.stateOptions =  [
                { "key": "AL", "title": "Alabama" },
                { "key": "AK", "title": "Alaska" },
                { "key": "AZ", "title": "Arizona" },
                { "key": "AR", "title": "Arkansas" },
                { "key": "CA", "title": "California" },
                { "key": "CO", "title": "Colorado" },
                { "key": "CT", "title": "Connecticut" },
                { "key": "DE", "title": "Delaware" },
                { "key": "DC", "title": "District of Columbia" },
                { "key": "FL", "title": "Florida" },
                { "key": "GA", "title": "Georgia" },
                { "key": "HI", "title": "Hawaii" },
                { "key": "ID", "title": "Idaho" },
                { "key": "IL", "title": "Illinois" },
                { "key": "IN", "title": "Indiana"},
                { "key": "IA", "title": "Iowa" },
                { "key": "KS", "title": "Kansas" },
                { "key": "KY", "title": "Kentucky" },
                { "key": "LA", "title": "Louisiana" },
                { "key": "ME", "title": "Maine" },
                { "key": "MD", "title": "Maryland" },
                { "key": "MA", "title": "Massachusetts" },
                { "key": "MI", "title": "Michigan" },
                { "key": "MN", "title": "Minnesota" },
                { "key": "MS", "title": "Mississippi" },
                { "key": "MO", "title": "Missouri" },
                { "key": "MT", "title": "Montana" },
                { "key": "NE", "title": "Nebraska" },
                { "key": "NV", "title": "Nevada" },
                { "key": "NH", "title": "New Hampshire" },
                { "key": "NJ", "title": "New Jersey" },
                { "key": "NM", "title": "New Mexico" },
                { "key": "NY", "title": "New York" },
                { "key": "NC", "title": "North Carolina" },
                { "key": "ND", "title": "North Dakota" },
                { "key": "OH", "title": "Ohio" },
                { "key": "OK", "title": "Oklahoma" },
                { "key": "OR", "title": "Oregon" },
                { "key": "PA", "title": "Pennsylvania" },
                { "key": "RI", "title": "Rhode Island" },
                { "key": "SC", "title": "South Carolina" },
                { "key": "SD", "title": "South Dakota" },
                { "key": "TN", "title": "Tennessee" },
                { "key": "TX", "title": "Texas" },
                { "key": "UT", "title": "Utah" },
                { "key": "VT", "title": "Vermont" },
                { "key": "VA", "title": "Virginia" },
                { "key": "WA", "title": "Washington" },
                { "key": "WV", "title": "West Virginia" },
                { "key": "WI", "title": "Wisconsin" },
                { "key": "WY", "title": "Wyoming" }
            ];

            filters.censusRegionOptions = [
                {
                    key: "CENS-R1",
                    title: "Census Region 1: Northeast",
                    group: true,
                    options: [
                        {
                            key: "CENS-D1",
                            title: "Division 1: New England",
                            parentFilterOptionKey: "CENS-R1"

                        },
                        {
                            key: "CENS-D2",
                            title: "Division 2: Middle Atlantic",
                            parentFilterOptionKey: "CENS-R1"
                        },
                    ]
                },
                {
                    key: "CENS-R2",
                    title: "Census Region 2: Midwest",
                    group: true,
                    options: [
                        {
                            key: "CENS-D3",
                            title: "Division 3: East North Central",
                            parentFilterOptionKey: "CENS-R2",
                        },
                        {
                            key: "CENS-D4",
                            title: "Division 4: West North Central",
                            parentFilterOptionKey: "CENS-R2",
                        },
                    ]
                },
                {
                    key: "CENS-R3",
                    title: "Census Region 3: South",
                    group: true,
                    options: [
                        {
                            key: "CENS-D5",
                            title: "Division 5: South Atlantic",
                            parentFilterOptionKey: "CENS-R3",
                        },
                        {
                            key: "CENS-D6",
                            title: "Division 6: East South Central",
                            parentFilterOptionKey: "CENS-R3",
                        },
                        {
                            key: "CENS-D7",
                            title: "Division 7: West South Central",
                            parentFilterOptionKey: "CENS-R3",
                        },
                    ]
                },
                {
                    key: "CENS-R4",
                    title: "Census Region 4: West",
                    group: true,
                    options: [
                        {
                            key: "CENS-D8",
                            title: "Division 8: Mountain",
                            parentFilterOptionKey: "CENS-R4",
                        },
                        {
                            key: "CENS-D9",
                            title: "Division 9: Pacific",
                            parentFilterOptionKey: "CENS-R4",
                        },
                    ]
                },
            ];

            filters.hhsOptions = [
                { "key": "HHS-1", "title": "HHS Region #1  CT, ME, MA, NH, RI, VT" },
                { "key": "HHS-2", "title": "HHS Region #2  NJ, NY" },
                { "key": "HHS-3", "title": "HHS Region #3  DE, DC, MD, PA, VA, WV" },
                { "key": "HHS-4", "title": "HHS Region #4  AL, FL, GA, KY, MS, NC, SC, TN" },
                { "key": "HHS-5", "title": "HHS Region #5  IL, IN, MI, MN, OH, WI" },
                { "key": "HHS-6", "title": "HHS Region #6  AR, LA, NM, OK, TX" },
                { "key": "HHS-7", "title": "HHS Region #7  IA, KS, MO, NE" },
                { "key": "HHS-8", "title": "HHS Region #8  CO, MT, ND, SD, UT, WY" },
                { "key": "HHS-9", "title": "HHS Region #9  AZ, CA, HI, NV" },
                { "key": "HHS-10", "title": "HHS Region #10  AK, ID, OR, WA" }
            ];

            filters.ageOptions = [
                {key:'1 year',title:'< 1 year', min: -5, max: -1},
                {key:'1-4 years',title:'1 - 4 years', min: 0, max: 4},
                {key:'5-9 years',title:'5 - 9 years', min: 5, max: 9},
                {key:'10-14 years',title:'10 - 14 years', min: 10, max: 14},
                {key:'15-19 years',title:'15 - 19 years', min: 15, max: 19},
                {key:'20-24 years',title:'20 - 24 years', min: 20, max: 24},
                {key:'25-29 years',title:'25 - 29 years', min: 25, max: 29},
                {key:'30-34 years',title:'30 - 34 years', min: 30, max: 34},
                {key:'35-39 years',title:'35 - 39 years', min: 35, max: 39},
                {key:'40-44 years',title:'40 - 44 years', min: 40, max: 44},
                {key:'45-49 years',title:'45 - 49 years', min: 45, max: 49},
                {key:'50-54 years',title:'50 - 54 years', min: 50, max: 54},
                {key:'55-59 years',title:'55 - 59 years', min: 55, max: 59},
                {key:'60-64 years',title:'60 - 64 years', min: 60, max: 64},
                {key:'65-69 years',title:'65 - 69 years', min: 65, max: 69},
                {key:'70-74 years',title:'70 - 74 years', min: 70, max: 74},
                {key:'75-79 years',title:'75 - 79 years', min: 75, max: 79},
                {key:'80-84 years',title:'80 - 84 years', min: 80, max: 84},
                {key:'85-89 years',title:'85 - 89 years', min: 85, max: 89},
                {key:'90-94 years',title:'90 - 94 years', min: 90, max: 94},
                {key:'95-99 years',title:'95 - 99 years', min: 95, max: 99},
                {key:'z100 years and over',title:'100+ years', min: 100, max: 105},
                {key:'Age not stated',title:'Age not stated', min: -10, max: -6}
            ];

            filters.genderOptions=[
                {key:'Female',title:'Female'},
                {key:'Male',title:'Male'}
            ];

            filters.yearOptions = [
                {key: '2019', title: '2019'},
                {key: '2018', title: '2018'},
                {key: '2017', title: '2017'},
                {key: '2016', title: '2016'},
                {key: '2015', title: '2015'},
                {key: '2014', title: '2014'},
                {key: '2013', title: '2013'},
                {key: '2012', title: '2012'},
                {key: '2011', title: '2011'},
                {key: '2010', title: '2010'},
                {key: '2009', title: '2009'},
                {key: '2008', title: '2008'},
                {key: '2007', title: '2007'},
                {key: '2006', title: '2006'},
                {key: '2005', title: '2005'},
                {key: '2004', title: '2004'},
                {key: '2003', title: '2003'},
                {key: '2002', title: '2002'},
                {key: '2001', title: '2001'},
                {key: '2000', title: '2000'}
            ];

            filters.modOptions = [
                {key:'January',title:'January'},
                {key:'February',title:'February'},
                {key:'March',title:'March'},
                {key:'April',title:'April'},
                {key:'May',title:'May'},
                {key:'June',title:'June'},
                {key:'July',title:'July'},
                {key:'August',title:'August'},
                {key:'September',title:'September'},
                {key:'October',title:'October'},
                {key:'November',title:'November'},
                {key:'December',title:'December'}
            ];

            filters.ageSliderOptions = {
                from: -10,
                to: 105,
                step: 5,
                threshold: 0,
                scale: ['Not stated', '<1', '1','', 10, '', 20, '', 30, '', 40, '', 50, '', 60, '', 70, '', 80, '', 90, '', 100, '>100'],
                modelLabels: {'-10': 'Not stated', '-5': '< 1', 0:'1', 105: '>100'},
                css: {
                    background: {'background-color': '#ccc'},
                    before: {'background-color': '#ccc'},
                    default: {'background-color': 'white'},
                    after: {'background-color': '#ccc'},
                    pointer: {'background-color': '#914fb5'},
                    range: {"background-color": "#914fb5"}
                },
                callback: function(value, release) {
                    var self = this;
                    var values = value.split(';');
                    var minValue = Number(values[0]);
                    var maxValue = Number(values[1]);
                    if(maxValue<self.to) maxValue-=1;
                    var agegroupFilter = utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'agegroup');

                    var prevValue = angular.copy(agegroupFilter.value);
                    agegroupFilter.value = [];
                    // set the values list only if the slider selection is different from the default
                    if(! (minValue == -10  && maxValue == 105)){
                        angular.forEach(agegroupFilter.autoCompleteOptions, function(eachOption) {
                            if((eachOption.min <= minValue && eachOption.max > minValue)
                                || (eachOption.min >= minValue && eachOption.max <= maxValue)
                                || (eachOption.min <= maxValue && eachOption.max >= maxValue)) {
                                agegroupFilter.value.push(eachOption.key);
                            }
                        });
                    }

                    if(!agegroupFilter.timer && !angular.equals(prevValue, agegroupFilter.value) && filters.selectedPrimaryFilter.initiated) {
                        agegroupFilter.timer = $timeout(function(){
                            agegroupFilter.timer=undefined;
                            // TODO: We need to call the searchController.search(true) from here, istead of the following lines
                            // generateHashCode(filters.selectedPrimaryFilter).then(function(hash){
                            //     filters.selectedPrimaryFilter.searchResults(filters.selectedPrimaryFilter, hash);
                            // });
                            self.search();

                        }, 2000);
                    }
                }
            };

            filters.yrbsGenderOptions =  [
                { "key": "Female", "title": "Female" },
                { "key": "Male", "title": "Male" }
            ];

            filters.yrbsRaceOptions =  [
                { "key": "Am Indian / Alaska Native", "title": "American Indian or Alaska Native" },
                { "key": "Asian", "title": "Asian" },
                { "key": "Black or African American", "title": "Black or African American" },
                { "key": "Hispanic/Latino", "title": "Hispanic or Latino" },
                { "key": "Native Hawaiian/other PI", "title": "Native Hawaiian or Other Pacific Islander" },
                { "key": "White", "title": "White" },
                { "key": "Multiple - Non-Hispanic", "title": "Multiple Race" }
            ];

            filters.yrbsGradeOptions = [
                { "key": "9th", "title": "9th" },
                { "key": "10th", "title": "10th" },
                { "key": "11th", "title": "11th" },
                { "key": "12th", "title": "12th" }
            ];

            filters.yrbsYearsOptions = [
                { "key": "2017", "title": "2017" },
                { "key": "2015", "title": "2015" },
                { "key": "2013", "title": "2013" },
                { "key": "2011", "title": "2011" },
                { "key": "2009", "title": "2009" },
                { "key": "2007", "title": "2007" },
                { "key": "2005", "title": "2005" },
                { "key": "2003", "title": "2003" },
                { "key": "2001", "title": "2001" },
                { "key": "1999", "title": "1999" },
                { "key": "1997", "title": "1997" },
                { "key": "1995", "title": "1995" },
                { "key": "1993", "title": "1993" },
                { "key": "1991", "title": "1991" }
            ];

            filters.yrbsAdditionalHeaders = [
                { "key": "question", "title": "Question" },
                { "key": "count", "title": "Total" }
            ];

            filters.yrbsStateFilters =  [
                { "key": "AL", "title": "Alabama" },
                { "key": "AK", "title": "Alaska" },
                { "key": "AZB", "title": "Arizona" },
                { "key": "AR", "title": "Arkansas" },
                { "key": "CA", "title": "California" },
                { "key": "CO", "title": "Colorado" },
                { "key": "CT", "title": "Connecticut" },
                { "key": "DE", "title": "Delaware" },
                { "key": "DC", "title": "District of Columbia" },
                { "key": "FL", "title": "Florida" },
                { "key": "GA", "title": "Georgia" },
                { "key": "HI", "title": "Hawaii" },
                { "key": "ID", "title": "Idaho" },
                { "key": "IL", "title": "Illinois" },
                { "key": "IN", "title": "Indiana"},
                { "key": "IA", "title": "Iowa" },
                { "key": "KS", "title": "Kansas" },
                { "key": "KY", "title": "Kentucky" },
                { "key": "LA", "title": "Louisiana" },
                { "key": "ME", "title": "Maine" },
                { "key": "MD", "title": "Maryland" },
                { "key": "MA", "title": "Massachusetts" },
                { "key": "MI", "title": "Michigan" },
                { "key": "MN", "title": "Minnesota" },
                { "key": "MS", "title": "Mississippi" },
                { "key": "MO", "title": "Missouri" },
                { "key": "MT", "title": "Montana" },
                { "key": "NE", "title": "Nebraska" },
                { "key": "NV", "title": "Nevada" },
                { "key": "NH", "title": "New Hampshire" },
                { "key": "NJ", "title": "New Jersey" },
                { "key": "NM", "title": "New Mexico" },
                { "key": "NY", "title": "New York" },
                { "key": "NC", "title": "North Carolina" },
                { "key": "ND", "title": "North Dakota" },
                { "key": "OH", "title": "Ohio" },
                { "key": "OK", "title": "Oklahoma" },
                { "key": "OR", "title": "Oregon" },
                { "key": "PA", "title": "Pennsylvania" },
                { "key": "RI", "title": "Rhode Island" },
                { "key": "SC", "title": "South Carolina" },
                { "key": "SD", "title": "South Dakota" },
                { "key": "TN", "title": "Tennessee" },
                { "key": "TX", "title": "Texas" },
                { "key": "UT", "title": "Utah" },
                { "key": "VT", "title": "Vermont" },
                { "key": "VA", "title": "Virginia" },
                { "key": "WV", "title": "West Virginia" },
                { "key": "WA", "title": "Washington" },
                { "key": "WI", "title": "Wisconsin" },
                { "key": "WY", "title": "Wyoming" }
            ];

            filters.yrbsSexualIdentity = [
                { "key": "Heterosexual", "title": "Heterosexual (straight)" },
                { "key": "Gay or Lesbian", "title": "Gay or Lesbian" },
                { "key": "Bisexual", "title": "Bisexual" },
                { "key": "Not Sure", "title": "Not Sure" }
            ];
            filters.yrbsSexualContact = [
                { "key": "Opposite sex only", "title": "Opposite Sex Only" },
                { "key": "Same sex only", "title": "Same Sex Only" },
                { "key": "Both Sexes", "title": "Both Sexes" },
                { "key": "Never had sex", "title": "No Sexual Contact" }
            ];

            filters.yrbsAdvancedFilters = [
                {key: 'year', title: 'label.yrbs.filter.year', queryKey:"year",primary: false, value: ['2017'], groupBy: false,
                    filterType: 'checkbox', autoCompleteOptions: filters.yrbsYearsOptions, donotshowOnSearch:true, helpText:"label.help.text.yrbs.year" },
                { key: 'yrbsSex', title: 'label.yrbs.filter.sex', queryKey:"sex", primary: false, value: [], groupBy: false,
                    filterType: 'checkbox',autoCompleteOptions: filters.yrbsGenderOptions, defaultGroup:"column", helpText:"label.help.text.yrbs.sex" },
                { key: 'yrbsGrade', title: 'label.yrbs.filter.grade', queryKey:"grade", primary: false, value: [], groupBy: false,
                    filterType: 'checkbox',autoCompleteOptions: filters.yrbsGradeOptions, defaultGroup:"column", helpText:"label.help.text.yrbs.grade"},
                { key: 'yrbsState', title: 'label.yrbs.filter.state', queryKey:"sitecode", primary: false, value: [], groupBy: false,
                    filterType: 'checkbox',autoCompleteOptions: filters.yrbsStateFilters, defaultGroup:"column",
                    displaySearchBox:true, displaySelectedFirst:true, helpText:"label.help.text.yrbs.state" },
                { key: 'yrbsRace', title: 'label.yrbs.filter.race', queryKey:"race", primary: false, value: [], groupBy: 'column',
                    filterType: 'checkbox',autoCompleteOptions: filters.yrbsRaceOptions, defaultGroup:"column", helpText:"label.help.text.yrbs.race.ethnicity"},
                { key: 'sexid', title: 'label.yrbs.sexual.identity', queryKey:"sexid", primary: false, value: [], groupBy: false,
                    filterType: 'checkbox',autoCompleteOptions: filters.yrbsSexualIdentity, defaultGroup:"column"},

                { key: 'sexpart', title: 'label.yrbs.sexual.contact', queryKey:"sexpart", primary: false, value: [], groupBy: false,
                    filterType: 'checkbox',autoCompleteOptions: filters.yrbsSexualContact, defaultGroup:"column"},

                { key: 'question', title: 'label.yrbs.filter.question', queryKey:"question.path", aggregationKey:"question.key", primary: false, value: [], groupBy: 'row',
                    questions: $rootScope.questions,
                    filterType: 'tree', autoCompleteOptions: $rootScope.questionsList, donotshowOnSearch:true, helpText:"label.help.text.yrbs.question",
                    selectTitle: 'select.label.yrbs.filter.question', updateTitle: 'update.label.yrbs.filter.question',  iconClass: 'purple-text',
                    onIconClick: function(question) {
                        showChartForQuestion(filters.selectedPrimaryFilter, question);
                    }
                }
            ];

            filters.yrbsBasicFilters = [
                {key: 'year', title: 'label.yrbs.filter.year', queryKey:"year",primary: false, value: '2017', groupBy: false,defaultGroup:"column",
                    filterType: 'radio',autoCompleteOptions: filters.yrbsYearsOptions, doNotShowAll: true, donotshowOnSearch:true, helpText:"label.help.text.yrbs.year" },
                { key: 'yrbsSex', title: 'label.yrbs.filter.sex', queryKey:"sex", primary: false, value: '', groupBy: false,
                    filterType: 'radio',autoCompleteOptions: filters.yrbsGenderOptions, defaultGroup:"column", helpText:"label.help.text.yrbs.sex" },
                { key: 'yrbsGrade', title: 'label.yrbs.filter.grade', queryKey:"grade", primary: false, value: '', groupBy: false,
                    filterType: 'radio',autoCompleteOptions: filters.yrbsGradeOptions, defaultGroup:"column", helpText:"label.help.text.yrbs.grade" },
                { key: 'yrbsState', title: 'label.yrbs.filter.state', queryKey:"sitecode", primary: false, value: '', groupBy: false,
                    filterType: 'radio',autoCompleteOptions: filters.yrbsStateFilters, defaultGroup:"column",
                    displaySearchBox:true, displaySelectedFirst:true, helpText:"label.help.text.yrbs.state" },
                { key: 'yrbsRace', title: 'label.yrbs.filter.race', queryKey:"race", primary: false, value:'', groupBy: 'column',
                    filterType: 'radio',autoCompleteOptions: filters.yrbsRaceOptions, defaultGroup:"column", helpText:"label.help.text.yrbs.race.ethnicity"},
                { key: 'question', title: 'label.yrbs.filter.question', queryKey:"question.path", aggregationKey:"question.key", primary: false, value: [], groupBy: 'row',
                    //questions to pass into owh-tree
                    questions: $rootScope.questions,
                    filterType: 'tree', autoCompleteOptions: $rootScope.questionsList, donotshowOnSearch:true, helpText:"label.help.text.yrbs.question",
                    selectTitle: 'select.label.yrbs.filter.question', updateTitle: 'update.label.yrbs.filter.question',  iconClass: 'purple-text',
                    onIconClick: function(question) {
                        showChartForQuestion(filters.selectedPrimaryFilter, question);
                    }
                }
            ];


            filters.allMortalityFilters = [
                /*Demographics*/
                {key: 'agegroup', title: 'label.filter.agegroup', queryKey:"age_5_interval",
                    primary: false, value: [], groupBy: false, type:"label.filter.group.demographics",
                    filterType: 'slider', autoCompleteOptions: filters.ageOptions, showChart: true,
                    sliderOptions: filters.ageSliderOptions, sliderValue: '-10;105', timer: undefined, defaultGroup:"row",
                    helpText: 'label.help.text.mortality.age'},
                {key: 'hispanicOrigin', title: 'label.filter.hispanicOrigin', queryKey:"hispanic_origin",
                    primary: false, value: [], groupBy: false, type:"label.filter.group.demographics",
                    filterType: 'checkbox',autoCompleteOptions: filters.hispanicOptions, defaultGroup:"row", helpText: 'label.help.text.mortality.ethnicity'},
                {key: 'race', title: 'label.filter.race', queryKey:"race", primary: false, value: [], groupBy: 'row',
                    type:"label.filter.group.demographics", showChart: true, defaultGroup:"column",
                    filterType: 'checkbox',autoCompleteOptions: filters.races, helpText: 'label.help.text.mortality.race'},
                {key: 'gender', title: 'label.filter.gender', queryKey:"sex", primary: false, value:  [], groupBy: 'column',
                    type:"label.filter.group.demographics", groupByDefault: 'column', showChart: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.genderOptions, defaultGroup:"column", helpText: 'label.help.text.mortality.sex'},


                /*Year and Month*/
                //TODO: consider setting default selected years elsewhere
                {key: 'year', title: 'label.filter.year', queryKey:"current_year",primary: false, value: ['2019'],
                    groupBy: false, type:"label.filter.group.year.month", filterType: 'checkbox',
                    autoCompleteOptions: filters.yearOptions,defaultGroup:"row", helpText: 'label.help.text.mortality.year'},
                {key: 'month', title: 'label.filter.month', queryKey:"month_of_death", primary: false, value: [],
                    groupBy: false,type:"label.filter.group.year.month", defaultGroup:"row",
                    filterType: 'checkbox',autoCompleteOptions: filters.modOptions, helpText: 'label.help.text.mortality.month'},


                /*Weekday, Autopsy, Place of Death */
                {key: 'weekday', title: 'label.filter.weekday', queryKey:"week_of_death",
                    primary: false, value:  [], groupBy: false,type:"label.filter.group.weekday.autopsy.pod",
                    filterType: 'checkbox',autoCompleteOptions: filters.weekday, defaultGroup:"row",
                    helpText: 'label.help.text.mortality.day'},
                {key: 'autopsy', title: 'label.filter.autopsy', queryKey:"autopsy",
                    primary: false, value: [], groupBy: false,type:"label.filter.group.weekday.autopsy.pod",
                    filterType: 'checkbox',autoCompleteOptions: filters.autopsy, defaultGroup:"row",
                    helpText: 'label.help.text.mortality.autopsy'},
                {key: 'placeofdeath', title: 'label.filter.pod', queryKey:"place_of_death",
                    primary: false, value:  [], groupBy: false,type:"label.filter.group.weekday.autopsy.pod",
                    filterType: 'checkbox',autoCompleteOptions: filters.podOptions, defaultGroup:"row",
                    helpText: 'label.help.text.mortality.pod'},

                {key: 'state', title: 'label.filter.state', queryKey:"state", primary: false, value:  [],
                    groupBy: false, type:"label.filter.group.location", filterType: 'checkbox',
                    autoCompleteOptions: filters.stateOptions, defaultGroup:"column",
                    displaySearchBox:true, displaySelectedFirst:true, helpText: 'label.help.text.mortality.state'},
                {
                    key: 'census-region', title: 'label.filter.censusRegion', queryKey: "census_region|census_division", primary: false, value: [],
                    queryType: "compound", titles: ['label.filter.censusRegion','label.filter.censusDivision'], queryKeys: ["census_region", "census_division"],
                    groupBy: false, type: "label.filter.group.location", filterType: 'checkbox',
                    autoCompleteOptions: filters.censusRegionOptions, defaultGroup: "column",
                    displaySearchBox: true, displaySelectedFirst: false, helpText: 'label.help.text.mortality.state'
                },
                {
                    key: 'hhs-region', title: 'label.filter.HHSRegion', queryKey: "hhs_region", primary: false, value: [],
                    groupBy: false, type: "label.filter.group.location", filterType: 'checkbox',
                    autoCompleteOptions: filters.hhsOptions, defaultGroup: "column",
                    displaySearchBox: true, displaySelectedFirst: true, helpText: 'label.help.text.mortality.state'
                },

                /*Underlying Cause of Death*/
                {key: 'ucd-chapter-10', title: 'label.filter.ucd', queryKey:"ICD_10_code",
                    primary: true, value: [], groupBy: false, type:"label.filter.group.ucd", groupKey:"ucd",
                    autoCompleteOptions: utilService.getICD10ChaptersForUCD(), filterType: 'conditions',
                    selectTitle: 'select.label.filter.ucd', updateTitle: 'update.label.filter.ucd',
                    aggregationKey:"ICD_10_code.path", groupOptions: filters.conditionGroupOptions,
                    helpText: 'label.help.text.mortality.ucd'},

                /*Multiple Cause of death*/
                {key: 'mcd-chapter-10', title: 'label.filter.mcd', queryKey:"ICD_10_code",
                    primary: false, value: { 'set1': [], 'set2': []}, groupBy: false, type: "label.filter.group.mcd", groupKey:"mcd",
                    autoCompleteOptions: utilService.getICD10ChaptersForMCD(), filterType: 'conditions',
                    selectTitle: 'select.label.filter.mcd', updateTitle: 'update.label.filter.mcd',
                    aggregationKey: "record_axis_condn.path", groupOptions: filters.conditionGroupOptions,
                    helpText: 'label.help.text.mortality.mcd'}
            ];

            filters.censusFilters = filterUtils.getBridgeDataFilters();
            filters.natalityFilters = filterUtils.getNatalityDataFilters();
            filters.infantMortalityFilters = filterUtils.getInfantMortalityDataFilters();
            filters.stdFilters = filterUtils.getSTDDataFilters();
            filters.tbFilters = filterUtils.getTBDataFilters();
            filters.aidsFilters = filterUtils.getAIDSFilters();
            filters.cancerIncidenceFilters = filterUtils.cancerIncidenceFilters();
            filters.cancerMortalityFilters = filterUtils.cancerMortalityFilters();

            filters.pramsPrecTopicOptions = [
                {"key": "cat_33", "title": "Abuse - Mental"},
                {"key": "cat_29", "title": "Abuse - Physical"},
                {"key": "cat_2", "title": "Alcohol Use"},
                {"key": "cat_31", "title": "Assisted Reproduction"},
                {"key": "cat_43", "title": "Breastfeeding"},
                {"key": "cat_20", "title": "Contraception - Conception"},
                {"key": "cat_28", "title": "Contraception - Postpartum"},
                {"key": "cat_45", "title": "Delivery Method"},
                {"key": "cat_39", "title": "Delivery Payment"},
                {"key": "cat_3", "title": "Flu - H1N1"},
                {"key": "cat_8", "title": "Flu - H1N1 + Seasonal"},
                {"key": "cat_7", "title": "Flu - Morbidity"},
                {"key": "cat_5", "title": "Flu - Seasonal"},
                {"key": "cat_13", "title": "HIV Test"},
                {"key": "cat_0", "title": "Hospital Length of Stay"},
                {"key": "cat_15", "title": "Household Characteristics"},
                {"key": "cat_38", "title": "Income"},
                {"key": "cat_1", "title": "Infant Health Care"},
                {"key": "cat_24", "title": "Injury Prevention"},
                {"key": "cat_32", "title": "Insurance Coverage"},
                {"key": "cat_34", "title": "Maternal Health Care"},
                {"key": "cat_21", "title": "Medicaid"},
                {"key": "cat_12", "title": "Mental Health"},
                {"key": "cat_19", "title": "Morbidity - Infant"},
                {"key": "cat_18", "title": "Morbidity - Maternal"},
                {"key": "cat_9", "title": "Multivitamin Use"},
                {"key": "cat_17", "title": "Obesity"},
                {"key": "cat_35", "title": "Oral Health"},
                {"key": "cat_23", "title": "Preconception Health"},
                {"key": "cat_10", "title": "Preconception Morbidity"},
                {"key": "cat_22", "title": "Pregnancy History"},
                {"key": "cat_11", "title": "Pregnancy Intention"},
                {"key": "cat_14", "title": "Pregnancy Outcome"},
                {"key": "cat_42", "title": "Pregnancy Recognition"},
                {"key": "cat_37", "title": "Prenatal Care - Barriers"},
                {"key": "cat_30", "title": "Prenatal Care - Content"},
                {"key": "cat_4", "title" : "Prenatal Care - Initiation"},
                {"key": "cat_41", "title" : "Prenatal Care - Location"},
                {"key": "cat_40", "title": "Prenatal Care - Payment"},
                {"key": "cat_16", "title": "Prenatal Care - Visits"},
                {"key": "cat_36", "title": "Prenatal Care - Provider"},
                {"key": "cat_25", "title": "Sleep Behaviors"},
                {"key": "cat_6", "title" :  "Smoke Exposure"},
                {"key": "cat_27", "title": "Stress"},
                {"key": "cat_26", "title": "Tobacco Use"},
                {"key": "cat_44", "title": "WIC"}
            ];

            filters.pramsRawTopicOptions = [
                { "key": "cat_25", "title": "Abuse - Physical" },
                { "key": "cat_15", "title": "Alcohol Use" },
                { "key": "cat_1",  "title": "Assisted Reproduction" },
                { "key": "cat_4",  "title": "Breastfeeding" },
                { "key": "cat_3",  "title": "Contraception - Conception" },
                { "key": "cat_2",  "title": "Contraception - Postpartum" },
                { "key": "cat_0",  "title": "Control" },
                { "key": "cat_26", "title": "Delivery - Payment" },
                { "key": "cat_21", "title": "HIV Test" },
                { "key": "cat_19", "title": "Health Insurance - Maternal" },
                { "key": "cat_37", "title": "Home Visitation" },
                { "key": "cat_24", "title": "Hospital Length of Stay" },
                { "key": "cat_22", "title": "Household Characteristics" },
                { "key": "cat_16", "title": "Immunizations" },
                { "key": "cat_17", "title": "Income" },
                { "key": "cat_32", "title": "Infant Health Care" },
                { "key": "cat_11", "title": "Insurance Coverage" },
                { "key": "cat_9",  "title": "Maternal Health Care" },
                { "key": "cat_20", "title": "Medicaid" },
                { "key": "cat_7",  "title": "Mental Health" },
                { "key": "cat_5",  "title": "Morbidity - Infant" },
                { "key": "cat_6",  "title": "Morbidity - Maternal" },
                { "key": "cat_13", "title": "Multivitamin Use" },
                { "key": "cat_23", "title": "Obesity" },
                { "key": "cat_14", "title": "Oral Health" },
                { "key": "cat_10", "title": "Preconception Health" },
                { "key": "cat_8",  "title": "Preconception Morbidity" },
                { "key": "cat_31", "title": "Pregnancy History" },
                { "key": "cat_27", "title": "Pregnancy Intention" },
                { "key": "cat_18", "title": "Pregnancy Outcome" },
                { "key": "cat_36", "title": "Prenatal Care - Content" },
                { "key": "cat_12", "title": "Prenatal Care - Initiation" },
                { "key": "cat_29", "title": "Prenatal Care - Payment" },
                { "key": "cat_28", "title": "Prenatal Care - Visits" },
                { "key": "cat_30", "title": "Prenatal Care -Payment" },
                { "key": "cat_33", "title": "Sleep Behaviors" },
                { "key": "cat_35", "title": "Stress" },
                { "key": "cat_34", "title": "Tobacco Use" },
                { "key": "cat_38", "title": "WIC" }
            ];

            filters.pramsStateOptions = [
                { "key": "AL", "title": "Alabama" },
                { "key": "AK", "title": "Alaska" },
                { "key": "AZ", "title": "Arizona" },
                { "key": "AR", "title": "Arkansas" },
                { "key": "CA", "title": "California" },
                { "key": "CO", "title": "Colorado" },
                { "key": "CT", "title": "Connecticut" },
                { "key": "DE", "title": "Delaware" },
                { "key": "DC", "title": "District of Columbia" },
                { "key": "FL", "title": "Florida" },
                { "key": "GA", "title": "Georgia" },
                { "key": "HI", "title": "Hawaii" },
                { "key": "HD", "title": "Idaho" },
                { "key": "IL", "title": "Illinois" },
                { "key": "IN", "title": "Indiana" },
                { "key": "IA", "title": "Iowa" },
                { "key": "KS", "title": "Kansas" },
                { "key": "KY", "title": "Kentucky" },
                { "key": "LA", "title": "Louisiana" },
                { "key": "ME", "title": "Maine" },
                { "key": "MD", "title": "Maryland" },
                { "key": "MA", "title": "Massachusetts" },
                { "key": "MI", "title": "Michigan" },
                { "key": "MN", "title": "Minnesota" },
                { "key": "MS", "title": "Mississippi" },
                { "key": "MO", "title": "Missouri" },
                { "key": "MT", "title": "Montana" },
                { "key": "NE", "title": "Nebraska" },
                { "key": "NV", "title": "Nevada" },
                { "key": "NH", "title": "New Hampshire" },
                { "key": "NJ", "title": "New Jersey" },
                { "key": "NM", "title": "New Mexico" },
                { "key": "NY", "title": "New York(excluding NYC)" },
                { "key": "NC", "title": "North Carolina" },
                { "key": "ND", "title": "North Dakota" },
                { "key": "OH", "title": "Ohio" },
                { "key": "OK", "title": "Oklahoma" },
                { "key": "OR", "title": "Oregon" },
                { "key": "PA", "title": "Pennsylvania" },
                { "key": "RI", "title": "Rhode Island" },
                { "key": "SC", "title": "South Carolina" },
                { "key": "SD", "title": "South Dakota Tribal" },
                { "key": "TN", "title": "Tennessee" },
                { "key": "TX", "title": "Texas" },
                { "key": "UT", "title": "Utah" },
                { "key": "VT", "title": "Vermont" },
                { "key": "VA", "title": "Virginia" },
                { "key": "WA", "title": "Washington" },
                { "key": "WV", "title": "West Virginia" },
                { "key": "WI", "title": "Wisconsin" },
                { "key": "WY", "title": "Wyoming" }
            ];

            filters.pramsBasicSearchYearOptions = [
                { "key": "2011", "title": "2011" },
                { "key": "2010", "title": "2010" },
                { "key": "2009", "title": "2009" },
                { "key": "2008", "title": "2008" },
                { "key": "2007", "title": "2007" },
                { "key": "2006", "title": "2006" },
                { "key": "2005", "title": "2005" },
                { "key": "2004", "title": "2004" },
                { "key": "2003", "title": "2003" },
                { "key": "2002", "title": "2002" },
                { "key": "2001", "title": "2001" },
                { "key": "2000", "title": "2000" }
            ];

            filters.pramsRawDataYearOptions = [
                { "key": "2014", "title": "2014" },
                { "key": "2013", "title": "2013" },
                { "key": "2012", "title": "2012" }
            ];

            filters.pramsAdequacyOptions = [
                {"key": "adequate pnc", "title": "Adequate PNC"},
                {"key": "inadequate pnc", "title": "Intermediate PNC"},
                {"key": "intermediate pnc", "title": "Inadequate PNC"},
                {"key": "unknown pnc", "title": "Unknown PNC"}
            ];

            filters.precomputedBirthWeightOptions = [
                {"key": "LBW", "title": "LBW (<= 2500g)"},
                {"key": "NBW", "title": "NBW (>2500g)"}
            ];
            filters.rawBirthWeightOptions = [
                {"key": "NBW", "title": "LBW (<= 2500g)"},
                {"key": "LBW", "title": "NBW (>2500g)"}
            ];

            filters.pramsPrecIncomeOptions = {
                pre2004: [
                    {"key": "<$15k", "title": "<=$15,000"},
                    {"key": "<$16k", "title": "<=$15,999"},
                    {"key": "<$16.8k", "title": "<=$16,799"},
                    {"key": "<$17k", "title": "<=$17,000"},
                    {"key": "<$18k", "title": "<=$18,000"},
                    {"key": "$15k-$25k", "title": "$15,000-$24,999"},
                    {"key": "$16k-$25k", "title": "$16,000-$24,999"},
                    {"key": "$16.8k-$25.2k", "title": "$16,800-$25,199"}
                ],
                post2003: [
                    {"key": "<$10k", "title": "Less than $10,000"},
                    {"key": "$10k-$25k", "title": "$10,000 to $24,999"},
                    {"key": "$25k-$50k", "title": "$25,000 to $49,999"},
                    {"key": "$50k plus", "title": "$50,000 or more"}
                ]
            };

            filters.pramsRawDataIncomeOptions = [
                {"key": "<$10k", "title": "Less than $10,000"},
                {"key": "<$15k", "title": "<$15k"},
                {"key": "<$17k", "title": "<$17k"},
                {"key": "<$18k", "title": "<$18k"},
                {"key": "$64k-$77k", "title": "$64k-$77k"},
                {"key": "$65k-$69k", "title": "$65k-$69k"},
                {"key": "$67k-$79k", "title": "$67k-$79k"},
                {"key": "$69k-$84k", "title": "$69k-$84k"},
                {"key": "$77k-$90k", "title": "$77k-$90k"},
                {"key": "$79k plus", "title": "$79k plus"},
                {"key": "$79k-$100k", "title": "$79k-$100k"},
                {"key": "$84k-$98k", "title": "$84k-$98k"},
                {"key": "$90k plus", "title": "$90k plus"},
                {"key": "$98k plus", "title": "$98k plus"}
            ];

            filters.pramsMaritalStatusOptions = [
                {"key": "married", "title": "Married"},
                {"key": "other", "title": "Other"}
            ];

            filters.pramsMaternalAgeGroupingsOptions = [
                {"key": "<18", "title": "Age < 18"},
                {"key": "18-24", "title": "Age 18 - 24"},
                {"key": "25-29", "title": "Age 25 - 29"},
                {"key": "30-44", "title": "Age 30 - 44"},
                {"key": "45 plus", "title": "Age 45+"}
            ];

            filters.pramsMaternalAgeYearsOptions = [
                {"key": "18-44", "title": "Age 18-44"}
            ];

            filters.pramsMaternalAge3Options = [
                {"key": "<20", "title": "< 20 yrs"},
                {"key": "20-29", "title": "20-29 yrs"},
                {"key": "30 plus", "title": "30+ yrs"}
            ];

            filters.pramsMaternalAge4Options = [
                {"key": "<20", "title": "< 20 yrs"},
                {"key": "20-24", "title": "20-24 yrs"},
                {"key": "25-34", "title": "25-34 yrs"},
                {"key": "35 plus", "title": "35+ yrs"}
            ];

            filters.pramsMaternalEducationOptions = [
                {"key": "<12yrs", "title": "<12 yrs"},
                {"key": "12yrs", "title": "12 yrs"},
                {"key": ">12yrs", "title": ">12 yrs"}
            ];

            filters.pramsMaternalRaceOptions = [
                {"key": "White", "title": "White, Non-Hispanic"},
                {"key": "Black", "title": "Black, Non-Hispanic"},
                {"key": "Hispanic", "title": "Hispanic"},
                {"key": "Other Race", "title": "Other, Non- Hispanic"}
            ];

            filters.pramsMedicaidOptions = [
                {"key": "Medicaid", "title": "Medicaid"},
                {"key": "non-Medicaid", "title": "Non-Medicaid"}
            ];
            filters.pramsRawDataMedicaidOptions = [
                {"key": "Yes", "title": "Medicaid"},
                {"key": "No", "title": "Non-Medicaid"}
            ];

            filters.pramsMotherHispanicOptions = [
                {"key": "Hispanic", "title": "Hispanic"},
                {"key": "non-Hispanic", "title": "Non-Hispanic"}
            ];

            filters.pramsPreviousBirthsOptions = [
                {"key": "zero", "title": "0"},
                {"key": "one or more", "title": "1 or more"}
            ];

            filters.pramsWicPregnancyOptions = [
                {"key": "WIC", "title": "WIC"},
                {"key": "non-WIC", "title": "Non-WIC"}
            ];

            filters.pramsPregnancyIntendednessOptions = [
                {"key": "intended", "title": "Intended"},
                {"key": "unintended", "title": "Unintended"}
            ];

            filters.pramsSmokedBeforeOptions = [
                {"key": "non-smoker", "title": "Non-Smoker"},
                {"key": "smoker", "title": "Smoker"}
            ];

            filters.pramsSmokedLastOptions = [
                {"key": "non-smoker", "title": "Non-Smoker"},
                {"key": "smoker", "title": "Smoker"}
            ];

            filters.pramsBasicFilters = [
                {key: 'topic', title: 'label.prams.filter.topic', queryKey:"topic",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsPrecTopicOptions, doNotShowAll: false, helpText: "label.help.text.prams.topic"},
                {key: 'year', title: 'label.prams.filter.year', queryKey:"year",primary: false, value: ['2011'], groupBy: false,defaultGroup:"column",
                    filterType: 'radio',autoCompleteOptions: filters.pramsBasicSearchYearOptions, doNotShowAll: false, helpText: "label.help.text.prams.year"},
                {key: 'state', title: 'label.prams.filter.state', queryKey:"sitecode",primary: false, value: [],
                    displaySearchBox:true, displaySelectedFirst:true, groupBy: 'column',defaultGroup:"column",
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsStateOptions, doNotShowAll: false, helpText: "label.help.text.prams.state"},
                { key: 'question', title: 'label.prams.filter.question', queryKey:"question.path", aggregationKey:"question.key", primary: false, value: [], groupBy: 'row',
                    filterType: 'tree', autoCompleteOptions: $rootScope.pramsBasicQuestionsList, donotshowOnSearch:true,
                    //add questions property to pass into owh-tree component
                    questions: $rootScope.pramsBasicQuestions,
                    selectTitle: 'select.label.yrbs.filter.question', updateTitle: 'update.label.yrbs.filter.question',  iconClass: 'purple-text', helpText: 'label.help.text.prams.question',
                    onIconClick: function(question) {
                        showChartForQuestion(filters.selectedPrimaryFilter, question);
                    }
                },
                {key: 'adequacy', title: 'label.prams.filter.adequacy', queryKey:"prenatal_care",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsAdequacyOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.adequacy"},
                {key: 'birth_weight', title: 'label.prams.filter.birth_weight', queryKey:"birth_weight",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.precomputedBirthWeightOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.weight"},
                {key: 'income', title: 'label.prams.filter.income.post2003', queryKey:"income",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio', allAutoCompleteOptions: filters.pramsPrecIncomeOptions, autoCompleteOptions: filters.pramsPrecIncomeOptions.post2003,
                    doNotShowAll: false, helpText: "label.help.text.prams.breakouts.income"},
                {key: 'marital_status', title: 'label.prams.filter.marital_status', queryKey:"marital_status",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsMaritalStatusOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.marital"},
                {key: 'maternal_age_groupings', title: 'label.prams.filter.maternal_age_groupings', queryKey:"maternal_age_18to44grp",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsMaternalAgeGroupingsOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.age.one"},
                {key: 'maternal_age_years', title: 'label.prams.filter.maternal_age_years', queryKey:"maternal_age_18to44",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsMaternalAgeYearsOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.age.two"},
                {key: 'maternal_age_3', title: 'label.prams.filter.maternal_age_3', queryKey:"maternal_age_3lvl",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsMaternalAge3Options, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.age.three"},
                {key: 'maternal_age_4', title: 'label.prams.filter.maternal_age_4', queryKey:"maternal_age_4lvl",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsMaternalAge4Options, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.age.four"},
                {key: 'maternal_education', title: 'label.prams.filter.maternal_education', queryKey:"maternal_education",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsMaternalEducationOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.edu"},
                {key: 'maternal_race', title: 'label.prams.filter.maternal_race', queryKey:"maternal_race",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsMaternalRaceOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.race"},
                {key: 'medicaid', title: 'label.prams.filter.medicaid', queryKey:"medicaid_recip",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsMedicaidOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.medicaid"},
                {key: 'mother_hispanic', title: 'label.prams.filter.mother_hispanic', queryKey:"mother_hispanic",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsMotherHispanicOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.hispanic"},
                {key: 'previous_births', title: 'label.prams.filter.previous_births', queryKey:"prev_live_births",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsPreviousBirthsOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.births"},
                {key: 'wic_pregnancy', title: 'label.prams.filter.wic_pregnancy', queryKey:"wic_during_preg",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsWicPregnancyOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.wic"},
                {key: 'pregnancy_intendedness', title: 'label.prams.filter.pregnancy_intendedness', queryKey:"preg_intend",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsPregnancyIntendednessOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.intend"},
                {key: 'smoked_before', title: 'label.prams.filter.smoked_before', queryKey:"smoked_3mo_pre_preg",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsSmokedBeforeOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.smoked.before"},
                {key: 'smoked_last', title: 'label.prams.filter.smoked_last', queryKey:"smoked_last_tri",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'radio',autoCompleteOptions: filters.pramsSmokedLastOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.smoked.last"}
            ];
            filters.pramsAdvanceFilters = [
                {key: 'topic', title: 'label.prams.filter.topic', queryKey:"topic",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsRawTopicOptions, doNotShowAll: false, helpText: "label.help.text.prams.topic"},
                {key: 'year', title: 'label.prams.filter.year', queryKey:"year",primary: false, value: ['2014'], groupBy: false,defaultGroup:"column",
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsRawDataYearOptions, doNotShowAll: false, helpText: "label.help.text.prams.year"},
                {key: 'state', title: 'label.prams.filter.state', queryKey:"sitecode",primary: false, value: [],
                    displaySearchBox:true, displaySelectedFirst:true, groupBy: 'column',defaultGroup:"column",
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsStateOptions, doNotShowAll: false, helpText: "label.help.text.prams.state"},
                { key: 'question', title: 'label.prams.filter.question', queryKey:"question.path", aggregationKey:"question.key", primary: false, value: [], groupBy: 'row',
                    filterType: 'tree', autoCompleteOptions: $rootScope.pramsAdvanceQuestionsList, donotshowOnSearch:true,
                    //add questions property to pass into owh-tree component
                    questions: $rootScope.pramsAdvanceQuestions,
                    selectTitle: 'select.label.yrbs.filter.question', updateTitle: 'update.label.yrbs.filter.question',  iconClass: 'purple-text', helpText: 'label.help.text.prams.question',
                    onIconClick: function(question) {
                        showChartForQuestion(filters.selectedPrimaryFilter, question);
                    }
                },
                {key: 'adequacy', title: 'label.prams.filter.adequacy', queryKey:"prenatal_care",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsAdequacyOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.adequacy"},
                {key: 'birth_weight', title: 'label.prams.filter.birth_weight', queryKey:"birth_weight",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.rawBirthWeightOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.weight"},
                {key: 'income', title: 'label.prams.filter.income.post2003', queryKey:"income",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox', autoCompleteOptions: filters.pramsRawDataIncomeOptions,
                    doNotShowAll: false, helpText: "label.help.text.prams.breakouts.income"},
                {key: 'marital_status', title: 'label.prams.filter.marital_status', queryKey:"marital_status",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsMaritalStatusOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.marital"},
                {key: 'maternal_age_groupings', title: 'label.prams.filter.maternal_age_groupings', queryKey:"maternal_age_18to44grp",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsMaternalAgeGroupingsOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.age.one"},
                {key: 'maternal_age_years', title: 'label.prams.filter.maternal_age_years', queryKey:"maternal_age_18to44",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsMaternalAgeYearsOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.age.two"},
                {key: 'maternal_age_3', title: 'label.prams.filter.maternal_age_3', queryKey:"maternal_age_3lvl",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsMaternalAge3Options, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.age.three"},
                {key: 'maternal_age_4', title: 'label.prams.filter.maternal_age_4', queryKey:"maternal_age_4lvl",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsMaternalAge4Options, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.age.four"},
                {key: 'maternal_education', title: 'label.prams.filter.maternal_education', queryKey:"maternal_education",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsMaternalEducationOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.edu"},
                {key: 'maternal_race', title: 'label.prams.filter.maternal_race', queryKey:"maternal_race",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsMaternalRaceOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.race"},
                {key: 'medicaid', title: 'label.prams.filter.medicaid', queryKey:"medicaid_recip",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsRawDataMedicaidOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.medicaid"},
                {key: 'mother_hispanic', title: 'label.prams.filter.mother_hispanic', queryKey:"mother_hispanic",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsMotherHispanicOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.hispanic"},
                {key: 'previous_births', title: 'label.prams.filter.previous_births', queryKey:"prev_live_births",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsPreviousBirthsOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.births"},
                {key: 'wic_pregnancy', title: 'label.prams.filter.wic_pregnancy', queryKey:"wic_during_preg",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsWicPregnancyOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.wic"},
                {key: 'pregnancy_intendedness', title: 'label.prams.filter.pregnancy_intendedness', queryKey:"preg_intend",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsPregnancyIntendednessOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.intend"},
                {key: 'smoked_before', title: 'label.prams.filter.smoked_before', queryKey:"smoked_3mo_pre_preg",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsSmokedBeforeOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.smoked.before"},
                {key: 'smoked_last', title: 'label.prams.filter.smoked_last', queryKey:"smoked_last_tri",primary: false, value: [], groupBy: false,disableFilter: true,
                    filterType: 'checkbox',autoCompleteOptions: filters.pramsSmokedLastOptions, doNotShowAll: false, helpText: "label.help.text.prams.breakouts.smoked.last"}
            ];

            filters.brfsPrecTopicOptions = [
                {"key":"cat_21","title":"Aerobic Activity"},
                {"key":"cat_40","title":"Age"},
                {"key":"cat_50","title":"Alcohol Consumption"},
                {"key":"cat_19","title":"Healthy Days"},
                {"key":"cat_0","title":"All Teeth Removed"},
                {"key":"cat_10","title":"Arthritis"},
                {"key":"cat_2","title":"Asthma"},
                {"key":"cat_1","title":"BMI Categories"},
                {"key":"cat_25","title":"Binge Drinking"},
                {"key":"cat_13","title":"Blood Stool Test"},
                {"key":"cat_42","title":"COPD"},
                {"key":"cat_20","title":"Cardiovascular Disease"},
                {"key":"cat_4","title":"Cholesterol Checked"},
                {"key":"cat_26","title":"Cholesterol High"},
                {"key":"cat_27","title":"Chronic Drinking"},
                {"key":"cat_5","title":"Colonoscopy"},
                {"key":"cat_35","title":"Current Smoker Status"},
                {"key":"cat_8","title":"Dental Visit"},
                {"key":"cat_39","title":"Depression"},
                {"key":"cat_49","title":"Diabetes"},
                {"key":"cat_41","title":"Disability status"},
                {"key":"cat_9","title":"Drink and Drive"},
                {"key":"cat_7","title":"E-Cigarette Use"},
                {"key":"cat_51","title":"Education"},
                {"key":"cat_52","title":"Employment"},
                {"key":"cat_37","title":"Exercise"},
                {"key":"cat_29","title":"Fair or Poor Health"},
                {"key":"cat_16","title":"Five Servings per Day"},
                {"key":"cat_12","title":"Flu Shot"},
                {"key":"cat_14","title":"Fruit Consumption"},
                {"key":"cat_54","title":"HIV Test"},
                {"key":"cat_59","title":"Health Care Cost"},
                {"key":"cat_55","title":"Health Care Coverage"},
                {"key":"cat_48","title":"Hearing"},
                {"key":"cat_28","title":"Heavy Drinking"},
                {"key":"cat_30","title":"High Blood Pressure"},
                {"key":"cat_56","title":"Income"},
                {"key":"cat_57","title":"Internet"},
                {"key":"cat_43","title":"Kidney"},
                {"key":"cat_47","title":"Last Checkup"},
                {"key":"cat_18","title":"Mammogram"},
                {"key":"cat_58","title":"Marital Status"},
                {"key":"cat_3","title":"Number of Children"},
                {"key":"cat_44","title":"Other Cancer"},
                {"key":"cat_53","title":"Overall Health"},
                {"key":"cat_33","title":"PSA Test"},
                {"key":"cat_32","title":"Pap Test"},
                {"key":"cat_60","title":"Personal Care Provider"},
                {"key":"cat_31","title":"Physical Activity"},
                {"key":"cat_22","title":"Physical Activity Index"},
                {"key":"cat_24","title":"Pneumonia Vaccination"},
                {"key":"cat_61","title":"Race"},
                {"key":"cat_62","title":"Rent/Own Home"},
                {"key":"cat_34","title":"Seatbelt Use"},
                {"key":"cat_63","title":"Sex"},
                {"key":"cat_64","title":"Shingle Vaccination"},
                {"key":"cat_15","title":"Sigmoidoscopy"},
                {"key":"cat_45","title":"Skin Cancer"},
                {"key":"cat_66","title":"Smokeless Tobacco"},
                {"key":"cat_36","title":"Smoker Status"},
                {"key":"cat_23","title":"Strength Activity"},
                {"key":"cat_11","title":"Teeth Removed"},
                {"key":"cat_65","title":"Tetanus Shot"},
                {"key":"cat_6","title":"USPSTF Recommendations"},
                {"key":"cat_17","title":"Under 65 Coverage"},
                {"key":"cat_38","title":"Vegetable Consumption"},
                {"key":"cat_67","title":"Veteran Status"},
                {"key":"cat_46","title":"Vision"}
            ];
            filters.brfsAdvanceTopicOptions = [
                {"key":"cat_49","title":"Aerobic Activity"},
                {"key":"cat_1","title":"Age"},
                {"key":"cat_13","title":"Alcohol Consumption"},
                {"key":"cat_48","title":"Healthy Days"},
                {"key":"cat_31","title":"All Teeth Removed"},
                {"key":"cat_39","title":"Arthritis"},
                {"key":"cat_33","title":"Asthma"},
                {"key":"cat_32","title":"BMI Categories"},
                {"key":"cat_53","title":"Binge Drinking"},
                {"key":"cat_43","title":"Blood Stool Test"},
                {"key":"cat_4","title":"COPD"},
                {"key":"cat_10","title":"Cardiovascular Disease"},
                {"key":"cat_3","title":"Cholesterol Checked"},
                {"key":"cat_54","title":"Cholesterol High"},
                {"key":"cat_35","title":"Colonoscopy"},
                {"key":"cat_61","title":"Current Smoker Status"},
                {"key":"cat_38","title":"Dental Visit"},
                {"key":"cat_0","title":"Depression"},
                {"key":"cat_12","title":"Diabetes"},
                {"key":"cat_2","title":"Disability status"},
                {"key":"cat_40","title":"Drink and Drive"},
                {"key":"cat_37","title":"E-Cigarette Use"},
                {"key":"cat_14","title":"Education"},
                {"key":"cat_15","title":"Employment"},
                {"key":"cat_63","title":"Exercise"},
                {"key":"cat_56","title":"Fair or Poor Health"},
                {"key":"cat_42","title":"Flu Shot"},
                {"key":"cat_44","title":"Fruit Consumption"},
                {"key":"cat_17","title":"HIV Test"},
                {"key":"cat_22","title":"Health Care Cost"},
                {"key":"cat_18","title":"Health Care Coverage"},
                {"key":"cat_11","title":"Hearing"},
                {"key":"cat_55","title":"Heavy Drinking"},
                {"key":"cat_57","title":"High Blood Pressure"},
                {"key":"cat_19","title":"Income"},
                {"key":"cat_20","title":"Internet"},
                {"key":"cat_5","title":"Kidney"},
                {"key":"cat_9","title":"Last Checkup"},
                {"key":"cat_47","title":"Mammogram"},
                {"key":"cat_21","title":"Marital Status"},
                {"key":"cat_34","title":"Number of Children"},
                {"key":"cat_6","title":"Other Cancer"},
                {"key":"cat_16","title":"Overall Health"},
                {"key":"cat_59","title":"PSA Test"},
                {"key":"cat_58","title":"Pap Test"},
                {"key":"cat_23","title":"Personal Care Provider"},
                {"key":"cat_50","title":"Physical Activity Index"},
                {"key":"cat_52","title":"Pneumonia Vaccination"},
                {"key":"cat_24","title":"Race"},
                {"key":"cat_25","title":"Rent/Own Home"},
                {"key":"cat_60","title":"Seatbelt Use"},
                {"key":"cat_26","title":"Sex"},
                {"key":"cat_27","title":"Shingle Vaccination"},
                {"key":"cat_45","title":"Sigmoidoscopy"},
                {"key":"cat_7","title":"Skin Cancer"},
                {"key":"cat_29","title":"Smokeless Tobacco"},
                {"key":"cat_62","title":"Smoker Status"},
                {"key":"cat_51","title":"Strength Activity"},
                {"key":"cat_41","title":"Teeth Removed"},
                {"key":"cat_28","title":"Tetanus Shot"},
                {"key":"cat_36","title":"USPSTF Recommendations"},
                {"key":"cat_46","title":"Under 65 Coverage"},
                {"key":"cat_64","title":"Vegetable Consumption"},
                {"key":"cat_30","title":"Veteran Status"},
                {"key":"cat_8","title":"Vision"}
            ];

            filters.brfsPrecYearOptions = [
                { "key": "2019", "title": "2019" },
                { "key": "2018", "title": "2018" },
                { "key": "2017", "title": "2017" },
                { "key": "2016", "title": "2016" },
                { "key": "2015", "title": "2015" },
                { "key": "2014", "title": "2014" },
                { "key": "2013", "title": "2013" },
                { "key": "2012", "title": "2012" },
                { "key": "2011", "title": "2011" },
                { "key": "2010", "title": "2010" },
                { "key": "2009", "title": "2009" },
                { "key": "2008", "title": "2008" },
                { "key": "2007", "title": "2007" },
                { "key": "2006", "title": "2006" },
                { "key": "2005", "title": "2005" },
                { "key": "2004", "title": "2004" },
                { "key": "2003", "title": "2003" },
                { "key": "2002", "title": "2002" },
                { "key": "2001", "title": "2001" },
                { "key": "2000", "title": "2000" }
            ];
            filters.brfsAdvanceYearOptions = [
                { "key": "2019", "title": "2019" },
                { "key": "2018", "title": "2018" },
                { "key": "2017", "title": "2017" },
                { "key": "2016", "title": "2016" },
                { "key": "2015", "title": "2015" },
                { "key": "2014", "title": "2014" },
                { "key": "2013", "title": "2013" },
                { "key": "2012", "title": "2012" },
                { "key": "2011", "title": "2011" }
            ];

            filters.brfsAgeGroupOptions = [
                {"key": "18-24", "title": "Age 18-24"},
                {"key": "25-34", "title": "Age 25-34"},
                {"key": "35-44", "title": "Age 35-44"},
                {"key": "45-54", "title": "Age 45-54"},
                {"key": "55-64", "title": "Age 55-64"},
                {"key": "40-49", "title": "Age 40-49"},
                {"key": "50-59", "title": "Age 50-59"},
                {"key": "60-64", "title": "Age 60-64"},
                {"key": "65+", "title": "Age 65+"},
                {"key": "65-74", "title": "Age 65-74"},
                {"key": "75+", "title": "Age 75+"},
                {"key": "21-30", "title": "Age 21-30"},
                {"key": "31-40", "title": "Age 31-40"},
                {"key": "41-50", "title": "Age 41-50"},
                {"key": "51-60", "title": "Age 51-60"},
                {"key": "61-65", "title": "Age 61-65"},
                {"key": "60-69", "title": "Age 60-69"},
                {"key": "70-74", "title": "Age 70-74"},
                {"key": "70-75", "title": "Age 70-75"}
            ];
            filters.brfsEducationOptions = [
                {"key": "Less than High School", "title": "Less than H.S."},
                {"key": "High School Graduate", "title": "High School or Graduate"},
                {"key": "Attended College/Technical School", "title": "Some post-H.S."},
                {"key": "College/Technical School Graduate", "title": "College graduate"}
            ];
            filters.brfsGenderOptions = [
                {"key": "Male", "title": "Male"},
                {"key": "Female", "title": "Female"}
            ];
            filters.brfsIncomeOptions = [
                {"key": "<$15k", "title": "Less than $15,000"},
                {"key": "$15k-$25k", "title": "$15,000-$25,000"},
                {"key": "$25k-$35k", "title": "$25,000-$35,000"},
                {"key": "$35k-$50k", "title": "$35,000-$49,999"},
                {"key": "$50k plus", "title": "$50,000+"}
            ];

            filters.brfsRaceOptions = [
                {"key": "White", "title": "White, non-Hispanic"},
                {"key": "Black", "title": "Black, non-Hispanic"},
                {"key": "AI/AN", "title": "American Indian or Alaskan Native, non-Hispanic"},
                {"key": "Asian", "title": "Asian, non-Hispanic"},
                {"key": "NHOPI", "title": "Native Hawaiian or other Pacific Islander, non-Hispanic"},
                {"key": "Other Race", "title": "Other, non-Hispanic"},
                {"key": "Multiracial non-Hispanic", "title": "Multiracial, non-Hispanic"},
                {"key": "Hispanic", "title": "Hispanic"}
            ];

            filters.brfsStateOptions = [
                { "key": "AL", "title": "Alabama" },
                { "key": "AK", "title": "Alaska" },
                { "key": "AZ", "title": "Arizona" },
                { "key": "AR", "title": "Arkansas" },
                { "key": "CA", "title": "California" },
                { "key": "CO", "title": "Colorado" },
                { "key": "CT", "title": "Connecticut" },
                { "key": "DE", "title": "Delaware" },
                { "key": "DC", "title": "District of Columbia" },
                { "key": "FL", "title": "Florida" },
                { "key": "GA", "title": "Georgia" },
                { "key": "HI", "title": "Hawaii" },
                { "key": "ID", "title": "Idaho" },
                { "key": "IL", "title": "Illinois" },
                { "key": "IN", "title": "Indiana"},
                { "key": "IA", "title": "Iowa" },
                { "key": "KS", "title": "Kansas" },
                { "key": "KY", "title": "Kentucky" },
                { "key": "LA", "title": "Louisiana" },
                { "key": "ME", "title": "Maine" },
                { "key": "MD", "title": "Maryland" },
                { "key": "MA", "title": "Massachusetts" },
                { "key": "MI", "title": "Michigan" },
                { "key": "MN", "title": "Minnesota" },
                { "key": "MS", "title": "Mississippi" },
                { "key": "MO", "title": "Missouri" },
                { "key": "MT", "title": "Montana" },
                { "key": "NE", "title": "Nebraska" },
                { "key": "NV", "title": "Nevada" },
                { "key": "NH", "title": "New Hampshire" },
                { "key": "NJ", "title": "New Jersey" },
                { "key": "NM", "title": "New Mexico" },
                { "key": "NY", "title": "New York" },
                { "key": "NC", "title": "North Carolina" },
                { "key": "ND", "title": "North Dakota" },
                { "key": "OH", "title": "Ohio" },
                { "key": "OK", "title": "Oklahoma" },
                { "key": "OR", "title": "Oregon" },
                { "key": "PA", "title": "Pennsylvania" },
                { "key": "RI", "title": "Rhode Island" },
                { "key": "SC", "title": "South Carolina" },
                { "key": "SD", "title": "South Dakota" },
                { "key": "TN", "title": "Tennessee" },
                { "key": "TX", "title": "Texas" },
                { "key": "UT", "title": "Utah" },
                { "key": "VT", "title": "Vermont" },
                { "key": "VA", "title": "Virginia" },
                { "key": "WV", "title": "West Virginia" },
                { "key": "WA", "title": "Washington" },
                { "key": "WI", "title": "Wisconsin" },
                { "key": "WY", "title": "Wyoming" }
            ];

            filters.brfsBasicFilters = [
                {
                    key: 'topic', title: 'label.brfss.filter.topic',
                    queryKey:"topic", primary: false,
                    value: [], groupBy: false,
                    filterType: 'checkbox', autoCompleteOptions: filters.brfsPrecTopicOptions,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.topic', disableFilter: true
                },
                {
                    key: 'year', title: 'label.filter.year',
                    queryKey:"year", primary: false,
                    value: '2019', groupBy: false,
                    filterType: 'radio', autoCompleteOptions: filters.brfsPrecYearOptions,
                    doNotShowAll: true, helpText: 'label.help.text.brfss.year', disableFilter: true
                },
                {
                    key: 'sex',
                    title: 'label.filter.gender',
                    queryKey: "sex",
                    primary: false,
                    value: [],
                    groupBy: false,
                    filterType: 'radio',defaultGroup:"column",
                    autoCompleteOptions: filters.brfsGenderOptions,
                    doNotShowAll: false,
                    helpText: 'label.help.text.brfss.sex'
                },
                {
                    key: 'state', title: 'label.brfss.filter.state',
                    queryKey:"sitecode",primary: false, value: ['AL'],
                    groupBy: false, filterType: 'radio',defaultGroup:"column",
                    autoCompleteOptions: filters.brfsStateOptions,
                    displaySearchBox:true, displaySelectedFirst:true,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.state'
                },
                {
                    key: 'race', title: 'label.brfss.filter.race_ethnicity',
                    queryKey:"race", primary: false, value: [],
                    groupBy: 'column', filterType: 'radio',defaultGroup:"column",
                    autoCompleteOptions: filters.brfsRaceOptions,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.race_ethnicity'
                },
                {
                    key: 'age_group', title: 'label.filter.age_group',
                    queryKey:"age",primary: false, value: [],
                    groupBy: false, filterType: 'radio', defaultGroup:"column",
                    autoCompleteOptions: filters.brfsAgeGroupOptions,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.age_group'
                },
                {
                    key: 'education', title: 'label.filter.education.attained',
                    queryKey:"education",primary: false, value: [],
                    groupBy: false, filterType: 'radio',defaultGroup:"column",
                    autoCompleteOptions: filters.brfsEducationOptions,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.education'
                },
                {
                    key: 'income', title: 'label.filter.household.income',
                    queryKey:"income",primary: false, value: [],
                    groupBy: false, filterType: 'radio',defaultGroup:"column",
                    autoCompleteOptions: filters.brfsIncomeOptions,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.income'
                },
                {
                    key: 'question', title: 'label.brfss.filter.question',
                    queryKey:"question.path", aggregationKey:"question.key",
                    primary: false, value: [],
                    groupBy: 'row', filterType: 'tree',
                    autoCompleteOptions: $rootScope.brfsBasicQuestionsList,
                    donotshowOnSearch:true,
                    questions: $rootScope.brfsBasicQuestions,
                    selectTitle: 'label.brfss.select.question',
                    updateTitle: 'label.brfss.update.question',
                    iconClass: 'fa fa-pie-chart purple-text',
                    helpText: 'label.help.text.brfss.question',
                    onIconClick: function(question) {
                        showChartForQuestion(filters.selectedPrimaryFilter, question);
                    }
                }
            ];
            filters.brfsAdvancedFilters = [
                {
                    key: 'topic', title: 'label.brfss.filter.topic',
                    queryKey:"topic",primary: false,
                    value: [], groupBy: false,
                    filterType: 'checkbox', autoCompleteOptions: filters.brfsAdvanceTopicOptions, disableFilter: true,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.topic'
                },
                {
                    key: 'year', title: 'label.filter.year',
                    queryKey:"year", primary: false,
                    value: ['2019'], groupBy: false,
                    filterType: 'checkbox', autoCompleteOptions: filters.brfsAdvanceYearOptions,
                    doNotShowAll: true, helpText: 'label.help.text.brfss.year'
                },
                {
                    key: 'sex',
                    title: 'label.filter.gender',
                    queryKey: "sex",
                    primary: false,
                    value: [],
                    groupBy: false,
                    filterType: 'checkbox',
                    autoCompleteOptions: filters.brfsGenderOptions,
                    doNotShowAll: false,
                    helpText: 'label.help.text.brfss.sex'
                },
                {
                    key: 'state', title: 'label.brfss.filter.state',
                    queryKey:"sitecode",primary: false, value: ['AL'],
                    groupBy: false, filterType: 'checkbox',defaultGroup:"column",
                    autoCompleteOptions: filters.brfsStateOptions,
                    displaySearchBox:true, displaySelectedFirst:true,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.state'
                },
                {
                    key: 'race', title: 'label.brfss.filter.race_ethnicity',
                    queryKey:"race", primary: false, value: [],
                    groupBy: 'column', filterType: 'checkbox',defaultGroup:"column",
                    autoCompleteOptions: filters.brfsRaceOptions,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.race_ethnicity'
                },
                {
                    key: 'age_group', title: 'label.filter.age_group',
                    queryKey:"age",primary: false, value: [],
                    groupBy: false, filterType: 'checkbox',defaultGroup:"column",
                    autoCompleteOptions: filters.brfsAgeGroupOptions,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.age_group'
                },
                {
                    key: 'education', title: 'label.filter.education.attained',
                    queryKey:"education",primary: false, value: [],
                    groupBy: false, filterType: 'checkbox',defaultGroup:"column",
                    autoCompleteOptions: filters.brfsEducationOptions,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.education'
                },
                {
                    key: 'income', title: 'label.filter.household.income',
                    queryKey:"income",primary: false, value: [],
                    groupBy: false, filterType: 'checkbox',defaultGroup:"column",
                    autoCompleteOptions: filters.brfsIncomeOptions,
                    doNotShowAll: false, helpText: 'label.help.text.brfss.income'
                },
                {
                    key: 'question', title: 'label.brfss.filter.question',
                    queryKey:"question.path", aggregationKey:"question.key",
                    primary: false, value: [],
                    groupBy: 'row', filterType: 'tree',
                    autoCompleteOptions: $rootScope.brfsAdvanceQuestionsList,
                    donotshowOnSearch:true,
                    questions: $rootScope.brfsAdvanceQuestions,
                    selectTitle: 'label.brfss.select.question',
                    updateTitle: 'label.brfss.update.question',
                    iconClass: 'fa fa-pie-chart purple-text',
                    helpText: 'label.help.text.brfss.question',
                    onIconClick: function(question) {
                        showChartForQuestion(filters.selectedPrimaryFilter, question);
                    }
                }
            ];

            filters.search = [
                {
                    key: 'deaths', title: 'label.filter.mortality', primary: true, value: [], header:"Detailed Mortality",
                    allFilters: filters.allMortalityFilters, searchResults: searchMortalityResults, showMap: true,
                    chartAxisLabel:'Deaths', countLabel: 'Number of Deaths', mapData:{}, tableView:'number_of_deaths',
                    runOnFilterChange: true, applySuppression:true,
                    sideFilters:[
                        {
                            sideFilters: [

                                {
                                    filterGroup: false,
                                    collapse: false,
                                    allowGrouping: true,
                                    refreshFiltersOnChange: true,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'year')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'race')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'gender')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'agegroup')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true, groupBy: false,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'hispanicOrigin')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'autopsy')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'placeofdeath')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'weekday')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'month')
                                }
                            ]
                        },
                        {
                            exclusive: true,
                            ui: "tabbed",
                            selectedFilter: "state", // defaulting to state
                            sideFilters: [
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'state')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    onFilterChange: utilService.regionFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'census-region')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'hhs-region')
                                }
                            ]
                        },
                        {
                            sideFilters: [
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true, dontShowCounts: true,
                                    onFilterChange: utilService.exclusiveGroupingForMCDAndUCD,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'ucd-chapter-10')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true, dontShowCounts: true,
                                    onFilterChange: utilService.exclusiveGroupingForMCDAndUCD,
                                    filters: utilService.findByKeyAndValue(filters.allMortalityFilters, 'key', 'mcd-chapter-10')
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 'mental_health', title: 'label.risk.behavior', primary: true, value:[], header:"Youth Risk Behavior",
                    searchResults: invokeStatsService, dontShowInlineCharting: true,
                    additionalHeaders:filters.yrbsAdditionalHeaders, countLabel: 'Total', tableView:'Alcohol and Other Drug Use',
                    chartAxisLabel:'Percentage', showMap:true, mapData: {},
                    showBasicSearchSideMenu: true, runOnFilterChange: true, allFilters: filters.yrbsBasicFilters, // Default to basic filter
                    advancedSideFilters: [
                        {
                            sideFilters: [
                                {
                                    filterGroup: false,
                                    collapse: false,
                                    allowGrouping: true,
                                    groupOptions: filters.columnGroupOptions,
                                    dontShowCounts: true,
                                    refreshFiltersOnChange: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsAdvancedFilters, 'key', 'year')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.columnGroupOptions,
                                    dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsAdvancedFilters, 'key', 'yrbsSex')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.columnGroupOptions,
                                    dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsAdvancedFilters, 'key', 'yrbsRace')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.columnGroupOptions,
                                    dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsAdvancedFilters, 'key', 'yrbsGrade')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.columnGroupOptions,
                                    dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsAdvancedFilters, 'key', 'yrbsState')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true, groupOptions: filters.columnGroupOptions, dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsAdvancedFilters, 'key', 'sexid')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true, groupOptions: filters.columnGroupOptions, dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsAdvancedFilters, 'key', 'sexpart')
                                },
                                {
                                    filterGroup: false, collapse: false, allowGrouping: false, dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsAdvancedFilters, 'key', 'question')
                                }
                            ]
                        }
                    ],
                    basicSideFilters: [
                        {

                            sideFilters: [
                                {
                                    filterGroup: false,
                                    collapse: false,
                                    allowGrouping: true,
                                    groupOptions: filters.columnGroupOptions,
                                    dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsBasicFilters, 'key', 'year')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.columnGroupOptions,
                                    dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsBasicFilters, 'key', 'yrbsSex')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.columnGroupOptions,
                                    dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsBasicFilters, 'key', 'yrbsRace')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.columnGroupOptions,
                                    dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsBasicFilters, 'key', 'yrbsGrade')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.columnGroupOptions,
                                    dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.yrbsBasicFilters, 'key', 'yrbsState')
                                },
                                {
                                    filterGroup: false, collapse: false, allowGrouping: false,
                                    filters: utilService.findByKeyAndValue(filters.yrbsBasicFilters, 'key', 'question')
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 'bridge_race', title: 'label.census.bridge.race.pop.estimate', primary: true, value:[], header:"Bridged-Race Population Estimates",
                    allFilters: filters.censusFilters, searchResults: searchCensusInfo, dontShowInlineCharting: true, showMap: true,
                    chartAxisLabel:'Population', countLabel: 'Total', countQueryKey: 'pop', tableView:'bridge_race', mapData: {},
                    runOnFilterChange: true, applySuppression:true,
                    sideFilters:[
                        {
                            sideFilters: [
                                {
                                    filterGroup: false,
                                    collapse: false,
                                    allowGrouping: true,
                                    refreshFiltersOnChange: true,
                                    filters: utilService.findByKeyAndValue(filters.censusFilters, 'key', 'current_year')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true, groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.censusFilters, 'key', 'sex')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true, groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.censusFilters, 'key', 'agegroup')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true, groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.censusFilters, 'key', 'race')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true, groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.censusFilters, 'key', 'ethnicity')
                                }
                            ]
                        },
                        {
                            exclusive: true,
                            ui: 'tabbed',
                            selectedFilter: "state", // defaulting to state
                            sideFilters: [
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true, groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.censusFilters, 'key', 'state')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true, groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.censusFilters, 'key', 'census-region')
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 'natality', title: 'label.filter.natality', primary: true, value:[], header:"Births",
                    allFilters: filters.natalityFilters, searchResults: searchNatality, dontShowInlineCharting: true,
                    chartAxisLabel:'Births', countLabel: 'Total',  countQueryKey: 'pop', tableView:'number_of_births',
                    runOnFilterChange: true, applySuppression:true, showMap: true, mapData: {},
                    birthAndFertilityRatesDisabledYears: ['2000', '2001', '2002'],
                    sideFilters:[
                        {
                            category: 'Birth Characteristics',
                            sideFilters: [

                                {
                                    filterGroup: false,
                                    collapse: false,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'current_year'),
                                    refreshFiltersOnChange: true
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'month')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'weekday')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'sex')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'gestational_age_r10')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'prenatal_care')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'birth_weight')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'birth_weight_r4')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'birth_weight_r12')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'birth_plurality')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'live_birth')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'birth_place')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'delivery_method')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'medical_attendant')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'gestation_recode11')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'gestation_recode10')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'gestation_weekly')
                                }
                            ]
                        },
                        {
                            category: 'Maternal Characteristics',
                            sideFilters: [

                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'race')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'hispanic_origin')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'marital_status')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'mother_education')
                                }
                            ]
                        },
                        {
                            category: "Mother's Age",
                            exclusive: true,
                            sideFilters: [
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'mother_age_1year_interval')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'mother_age_5year_interval')
                                }
                            ]
                        },
                        {
                            category: "Maternal Risk Factors",
                            sideFilters: [

                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'anemia')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'cardiac_disease')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'chronic_hypertension')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'prepregnancy_hypertension')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'gestational_hypertension')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'diabetes')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'prepregnancy_diabetes')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'gestational_diabetes')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'eclampsia')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'hydramnios_oligohydramnios')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'incompetent_cervix')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'lung_disease')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'pregnancy_hypertension')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'tobacco_use')
                                }
                            ]
                        } ,
                        {
                            category: 'Maternal Residence',
                            exclusive: true,
                            ui: "tabbed",
                            selectedFilter: "state", // defaulting to state
                            sideFilters: [
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'state')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'census-region')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.natalityFilters, 'key', 'hhs-region')
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 'prams', title: 'label.prams.title', primary: true, value:[], header:"Pregnancy Risk Assessment",
                    searchResults: invokeStatsService, dontShowInlineCharting: true,
                    additionalHeaders:filters.yrbsAdditionalHeaders, tableView:'basic_delivery',
                    chartAxisLabel:'Percentage', countLabel: 'Total', showMap:true, mapData: {},
                    showBasicSearchSideMenu: true, runOnFilterChange: true, allFilters: filters.pramsBasicFilters, // Default to basic filter
                    advancedSideFilters:[
                        {
                            sideFilters:[
                                {

                                    sideFilters: [
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: false,
                                            dontShowCounts: true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'topic')
                                        },
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts: true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'year')
                                        },
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts: true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'state')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'question')
                                        }
                                    ]
                                },
                                {
                                    category: 'Breakout',
                                    sideFilters: [
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'adequacy')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'birth_weight')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'income')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'marital_status')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'maternal_age_groupings')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'maternal_age_years')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'maternal_age_3')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'maternal_age_4')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'maternal_education')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'maternal_race')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'medicaid')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'mother_hispanic')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'previous_births')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'wic_pregnancy')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'pregnancy_intendedness')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'smoked_before')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsAdvanceFilters, 'key', 'smoked_last')
                                        }
                                    ]

                                }
                            ]
                        }
                    ],
                    basicSideFilters:[
                        {
                            sideFilters:[
                                {

                                    sideFilters: [
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: false,
                                            dontShowCounts: true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'topic')
                                        },
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts: true,
                                            onFilterChange: utilService.pramsFilterChange,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'year')
                                        },
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts: true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'state')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'question')
                                        }
                                    ]
                                },
                                {
                                    category: 'Breakout',
                                    exclusive: true,
                                    sideFilters: [
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'adequacy')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'birth_weight')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'income')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'marital_status')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'maternal_age_groupings')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'maternal_age_years')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'maternal_age_3')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'maternal_age_4')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'maternal_education')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'maternal_race')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'medicaid')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'mother_hispanic')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'previous_births')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'wic_pregnancy')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'pregnancy_intendedness')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'smoked_before')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.pramsBasicFilters, 'key', 'smoked_last')
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 'infant_mortality', title: 'label.filter.infant_mortality', primary: true, value: [], header: 'Infant Mortality',
                    allFilters: filters.infantMortalityFilters, searchResults: searchInfantMortality, showMap: true,
                    chartAxisLabel: 'Number of Infant Deaths', countLabel: 'Total', tableView: 'number_of_infant_deaths',
                    runOnFilterChange: true, applySuppression: true, chartView: 'death', mapData: {},
                    chartViewOptions:filters.deathsRateGroupOptions,
                    sideFilters:[
                        {
                            category: 'Infant Characteristics',
                            sideFilters: [
                                {
                                    filterGroup: false,
                                    collapse: false,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'year_of_death'),
                                    refreshFiltersOnChange: true,
                                    onFilterChange: utilService.infantMortalityFilterChange
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'sex')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'infant_age_at_death')
                                }
                            ]
                        },
                        {
                            category: 'Maternal Characteristics',
                            sideFilters: [
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'race')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'hispanic_origin')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'mother_age_5_interval')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'marital_status')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'mother_education')
                                }

                            ]
                        },
                        {
                            category: "Birth Characteristics",
                            sideFilters: [
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'gestation_recode11')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'gestation_recode10')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'gestation_weekly')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'prenatal_care')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'birth_weight')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'birth_plurality')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'live_birth')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'birth_place')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'delivery_method')
                                },
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'medical_attendant')
                                }
                            ]
                        },
                        {
                            category: 'Location',
                            sideFilters: [
                                {
                                    filterGroup: false,
                                    collapse: true,
                                    allowGrouping: true,
                                    dontShowCounts: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.infantMortalityFilters, 'key', 'state')
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 'std', title: 'label.filter.std', primary: true, value: [], header:"Sexually Transmitted Diseases/Infections",
                    allFilters: filters.stdFilters, searchResults: searchSTDResults, showMap: true,
                    mapData:{}, chartAxisLabel:'Cases', tableView:'std', countLabel: 'Number of Cases',
                    chartViewOptions: filters.diseaseVizGroupOptions, chartView: 'cases',
                    runOnFilterChange: true,  applySuppression: true, countQueryKey: 'cases',
                    sideFilters:[
                        {
                           sideFilters: [


                               {
                                   filterGroup: false, collapse: false, allowGrouping: true, groupBy: false,
                                   groupOptions: filters.groupOptions,
                                  // refreshFiltersOnChange: true,
                                   onFilterChange: utilService.stdFilterChange,
                                   filters: utilService.findByKeyAndValue(filters.stdFilters, 'key', 'disease')
                               },
                               {
                                   filterGroup: false,
                                   collapse: false,
                                   allowGrouping: true,
                                   onFilterChange: utilService.stdFilterChange,
                                   groupOptions: filters.groupOptions,
                                   filters: utilService.findByKeyAndValue(filters.stdFilters, 'key', 'current_year')
                               },
                               {
                                   filterGroup: false, collapse: true, allowGrouping: true,
                                   groupOptions: filters.groupOptions,
                                   onFilterChange: utilService.stdFilterChange,
                                   filters: utilService.findByKeyAndValue(filters.stdFilters, 'key', 'sex')
                               },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.stdFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.stdFilters, 'key', 'race')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.stdFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.stdFilters, 'key', 'age_group')
                                },
                               {
                                   filterGroup: false, collapse: true, allowGrouping: true,
                                   groupOptions: filters.groupOptions,
                                   filters: utilService.findByKeyAndValue(filters.stdFilters, 'key', 'state')
                               }

                            ]
                        }
                    ]
                },

                {
                    key: 'tb', title: 'label.filter.tb', primary: true, value:[], header:"Tuberculosis",
                    allFilters: filters.tbFilters, searchResults: searchTBResults, showMap: true,
                    mapData:{}, chartAxisLabel:'Cases', tableView:'tb', chartView: 'cases', countLabel: 'Number of Cases',
                    chartViewOptions: filters.diseaseVizGroupOptions,
                    runOnFilterChange: true,  applySuppression: false, countQueryKey: 'cases',
                    sideFilters:[
                        {
                            sideFilters: [
                                {
                                    filterGroup: false,
                                    collapse: false,
                                    allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.tbFilters, 'key', 'current_year')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.tbFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.tbFilters, 'key', 'sex')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.tbFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.tbFilters, 'key', 'race')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.tbFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.tbFilters, 'key', 'age_group')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.tbFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.tbFilters, 'key', 'transmission')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.tbFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.tbFilters, 'key', 'state')
                                }

                            ]
                        }
                    ]
                },
                {
                    key: 'aids', title: 'label.filter.aids', primary: true, value:[], header:'HIV/AIDS',
                    allFilters: filters.aidsFilters, searchResults: searchAIDSResults, showMap: true,
                    mapData: {}, chartAxisLabel: 'Cases', tableView: 'aids', chartView: 'cases', countLabel: 'Number of Cases',
                    chartViewOptions: filters.diseaseVizGroupOptions,
                    runOnFilterChange: true, applySuppression: true, countQueryKey: 'cases',
                    sideFilters:[
                        {
                            sideFilters: [
                                {
                                    filterGroup: false, collapse: false, allowGrouping: true, groupBy: false,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.aidsFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.aidsFilters, 'key', 'disease')
                                },
                                {
                                    filterGroup: false, collapse: false, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.aidsFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.aidsFilters, 'key', 'current_year')
                                },
                                {
                                    filterGroup: false, collapse: false, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.aidsFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.aidsFilters, 'key', 'sex')
                                },
                                {
                                    filterGroup: false, collapse: false, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.aidsFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.aidsFilters, 'key', 'race')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.aidsFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.aidsFilters, 'key', 'age_group')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.aidsFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.aidsFilters, 'key', 'transmission')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.aidsFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.aidsFilters, 'key', 'state')
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 'cancer_incidence', title: 'label.filter.cancer_incidence', primary: true, value: [], header: 'Cancer Incidence',
                    allFilters: filters.cancerIncidenceFilters, searchResults: searchCancerResults, showMap: true, countLabel: 'Total Incidence',
                    mapData: {}, chartAxisLabel: 'Incidence', tableView: 'cancer_incidence', runOnFilterChange: true,
                    sideFilters: [
                        {
                            sideFilters: [
                                {
                                    filterGroup: false, collapse: false, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.cancerIncidenceFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.cancerIncidenceFilters, 'key', 'current_year')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.cancerIncidenceFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.cancerIncidenceFilters, 'key', 'sex')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.cancerIncidenceFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.cancerIncidenceFilters, 'key', 'race')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.cancerIncidenceFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.cancerIncidenceFilters, 'key', 'hispanic_origin')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.cancerIncidenceFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.cancerIncidenceFilters, 'key', 'age_group')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.conditionGroupOptions,
                                    onFilterChange: utilService.cancerIncidenceFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.cancerIncidenceFilters, 'key', 'site')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.conditionGroupOptions,
                                    onFilterChange: utilService.cancerIncidenceFilterChange,
                                    filters: utilService.findByKeyAndValue(filters.cancerIncidenceFilters, 'key', 'childhood_cancer')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    onFilterChange: utilService.cancerIncidenceFilterChange,
                                    dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.cancerIncidenceFilters, 'key', 'state')
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 'cancer_mortality', title: 'label.filter.cancer_mortality', primary: true, value: [], header: 'Cancer Mortality',
                    allFilters: filters.cancerMortalityFilters, searchResults: searchCancerResults, showMap: true, countLabel: 'Total Deaths',
                    mapData: {}, chartAxisLabel: 'Deaths', tableView: 'cancer_mortality', runOnFilterChange: true,
                    sideFilters: [
                        {
                            sideFilters: [
                                {
                                    filterGroup: false, collapse: false, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.cancerMortalityFilters, 'key', 'current_year')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.cancerMortalityFilters, 'key', 'sex')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.cancerMortalityFilters, 'key', 'race')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.cancerMortalityFilters, 'key', 'hispanic_origin')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    filters: utilService.findByKeyAndValue(filters.cancerMortalityFilters, 'key', 'age_group')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.conditionGroupOptions,
                                    filters: utilService.findByKeyAndValue(filters.cancerMortalityFilters, 'key', 'site')
                                },
                                {
                                    filterGroup: false, collapse: true, allowGrouping: true,
                                    groupOptions: filters.groupOptions,
                                    dontShowCounts: true,
                                    filters: utilService.findByKeyAndValue(filters.cancerMortalityFilters, 'key', 'state')
                                }
                            ]
                        }
                    ]
                },
                {
                    key: 'brfss', title: 'label.brfss.title', primary: true, value:[],
                    searchResults: invokeStatsService, dontShowInlineCharting: true,
                    additionalHeaders:filters.yrbsAdditionalHeaders, countLabel: 'Total',
                    tableView:'basic_alcohol_consumption',  chartAxisLabel:'Percentage',
                    showBasicSearchSideMenu: true, runOnFilterChange: true, showMap:true, mapData: {},
                    allFilters: filters.brfsBasicFilters, header:"Behavioral Risk Factors",
                    advancedSideFilters:[
                        {
                            sideFilters:[
                                {
                                    sideFilters: [
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: false,
                                            dontShowCounts: true,
                                            filters: utilService.findByKeyAndValue(filters.brfsAdvancedFilters, 'key', 'topic')
                                        },
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts: true,
                                            filters: utilService.findByKeyAndValue(filters.brfsAdvancedFilters, 'key', 'year')
                                        },
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts: true,
                                            filters: utilService.findByKeyAndValue(filters.brfsAdvancedFilters, 'key', 'state')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            filters: utilService.findByKeyAndValue(filters.brfsAdvancedFilters, 'key', 'question')
                                        }
                                    ]
                                },
                                {
                                    category: 'Breakout',
                                    sideFilters: [
                                        {
                                            filterGroup: false, collapse: false,
                                            allowGrouping: true, groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.brfsAdvancedFilters, 'key', 'sex')
                                        },
                                        {
                                            filterGroup: false, collapse: false,
                                            allowGrouping: true, groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.brfsAdvancedFilters, 'key', 'race')
                                        },
                                        {
                                            filterGroup: false, collapse: false,
                                            allowGrouping: true, groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.brfsAdvancedFilters, 'key', 'age_group')
                                        },
                                        {
                                            filterGroup: false, collapse: false,
                                            allowGrouping: true, groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.brfsAdvancedFilters, 'key', 'education')
                                        },
                                        {
                                            filterGroup: false, collapse: false,
                                            allowGrouping: true, groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.brfsAdvancedFilters, 'key', 'income')
                                        }
                                    ]

                                }
                            ]
                        }
                    ],
                    basicSideFilters:[
                        {
                            sideFilters:[
                                {
                                    sideFilters: [
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: false,
                                            dontShowCounts: true,
                                            filters: utilService.findByKeyAndValue(filters.brfsBasicFilters, 'key', 'topic')
                                        },
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: false,
                                            dontShowCounts: true,
                                            filters: utilService.findByKeyAndValue(filters.brfsBasicFilters, 'key', 'year')
                                        },
                                        {
                                            filterGroup: false,
                                            collapse: false,
                                            allowGrouping: true,
                                            groupOptions: filters.columnGroupOptions,
                                            dontShowCounts: true,
                                            filters: utilService.findByKeyAndValue(filters.brfsBasicFilters, 'key', 'state')
                                        },
                                        {
                                            filterGroup: false, collapse: false, allowGrouping: false,
                                            filters: utilService.findByKeyAndValue(filters.brfsBasicFilters, 'key', 'question')
                                        }
                                    ]
                                },
                                {
                                    category: 'Breakout',
                                    sideFilters: [
                                        {
                                            filterGroup: false, collapse: false,
                                            allowGrouping: true, groupOptions: filters.columnGroupOptions,
                                            onFilterChange: utilService.brfsFilterChange,
                                            dontShowCounts:true,
                                            filters: utilService.findByKeyAndValue(filters.brfsBasicFilters, 'key', 'sex')
                                        },
                                        {
                                            filterGroup: false, collapse: false,
                                            allowGrouping: true, groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            onFilterChange: utilService.brfsFilterChange,
                                            filters: utilService.findByKeyAndValue(filters.brfsBasicFilters, 'key', 'race')
                                        },
                                        {
                                            filterGroup: false, collapse: false,
                                            allowGrouping: true, groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            onFilterChange: utilService.brfsFilterChange,
                                            filters: utilService.findByKeyAndValue(filters.brfsBasicFilters, 'key', 'age_group')
                                        },
                                        {
                                            filterGroup: false, collapse: false,
                                            allowGrouping: true, groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            onFilterChange: utilService.brfsFilterChange,
                                            filters: utilService.findByKeyAndValue(filters.brfsBasicFilters, 'key', 'education')
                                        },
                                        {
                                            filterGroup: false, collapse: false,
                                            allowGrouping: true, groupOptions: filters.columnGroupOptions,
                                            dontShowCounts:true,
                                            onFilterChange: utilService.brfsFilterChange,
                                            filters: utilService.findByKeyAndValue(filters.brfsBasicFilters, 'key', 'income')
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ];

            filters.search[1].sideFilters = filters.search[1].basicSideFilters; //Set the default side filters for YRBS to basic
            filters.search[11].sideFilters = filters.search[11].basicSideFilters[0].sideFilters; //Set the default side filters for BRFSS to basic
            filters.search[4].sideFilters = filters.search[4].basicSideFilters[0].sideFilters; //Set the default side filters for PRAMS to basic
            return filters;
        }

        function getPrimaryFilterByKey(key) {
            var allPrimaryFilter = getAllFilters().search;
            var primaryFilter;
            for(var i=0; i < allPrimaryFilter.length; i++) {
                if (allPrimaryFilter[i].key === key) {
                    primaryFilter = allPrimaryFilter[i];
                    break;
                }
            }
            return primaryFilter;
        }

        /*Show will be implemented in phase two modal*/
        function showPhaseTwoModal(message) {
            ModalService.showModal({
                templateUrl: "app/partials/phaseTwo.html",
                controllerAs: 'pt',
                controller: function ($scope, close) {
                    var pt = this;
                    pt.message = message;
                    pt.close = close;
                }
            }).then(function(modal) {
                modal.element.show();

                modal.close.then(function(result) {
                    //remove all elements from array
                    modal.element.hide();
                });
            });
        }

        /**
         * To set filter groupBy to given filter value
         * @param allFilters
         * @param filterValue
         * @param filterGroupType
         */
        function setFilterGroupBy(allFilters, filterValue, filterGroupType){
            var filter = utilService.findByKeyAndValue(allFilters,'key', filterValue);
            filter.groupBy = filterGroupType;
        }
    }

}());
