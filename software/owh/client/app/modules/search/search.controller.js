(function(){
    angular
        .module('owh.search')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', 'utilService', 'searchFactory', '$rootScope',
        '$templateCache', '$compile', '$filter', 'leafletData', '$timeout', 'chartUtilService', 'shareUtilService',
        '$stateParams', '$state', 'xlsService', '$window', 'mapService'];

    function SearchController($scope, utilService, searchFactory, $rootScope,
                                 $templateCache, $compile, $filter, leafletData, $timeout, chartUtilService,
                                 shareUtilService, $stateParams, $state, xlsService, $window, mapService) {

        var sc = this;
        sc.downloadCSV = downloadCSV;
        sc.downloadXLS = downloadXLS;
        sc.showPhaseTwoGraphs = showPhaseTwoGraphs;
        sc.showExpandedGraph = showExpandedGraph;
        sc.search = search;
        sc.changeViewFilter = changeViewFilter;
        sc.getQueryResults = getQueryResults;
        sc.changePrimaryFilter = changePrimaryFilter;
        sc.updateCharts = updateCharts;
        sc.getChartTitle = getChartTitle;
        sc.skipRefresh = false;
        sc.switchToYRBSBasic = switchToYRBSBasic;
        sc.switchToYRBSAdvanced = switchToYRBSAdvanced;
        sc.showFbDialog = showFbDialog;
        sc.onChartViewChange = onChartViewChange;
        sc.getSearchFilter = getSearchFilter;
        sc.getOptionName = getOptionName;

        var root = document.getElementsByTagName( 'html' )[0]; // '0' to assign the first (and only `HTML` tag)
        root.removeAttribute('class');

        sc.sideMenu = {visible: true};
        sc.mapOptions = {selectedMapSize: 'big'};
        //For intial search call
        if($stateParams.selectedFilters == null) {
            sc.filters = searchFactory.getAllFilters();
            sc.filters.primaryFilters = utilService.findAllByKeyAndValue(sc.filters.search, 'primary', true);
            sc.filters.selectedPrimaryFilter = utilService.findByKeyAndValue(sc.filters.primaryFilters, 'key', $stateParams.primaryFilterKey);
        }
        //If user change filter then we are re routing search call and setting 'selectedFilters' and 'allFilters' params at line
        else {
            sc.filters = $stateParams.allFilters;
            sc.filters.primaryFilters = utilService.findAllByKeyAndValue(sc.filters.search, 'primary', true);
            sc.filters.selectedPrimaryFilter = $stateParams.selectedFilters;

        }
        sc.filterUtilities = sc.filters.filterUtilities;
        sc.selectedMapSize = 'big';
        sc.showMeOptions = {
            deaths: [
                {key: 'number_of_deaths', title: 'Number of Deaths'},
                {key: 'crude_death_rates', title: 'Crude Death Rates'},
                {key: 'age-adjusted_death_rates', title: 'Age Adjusted Death Rates'}],
            natality: [
                {key: 'number_of_births', title: 'Number of Births'},
                {key: 'birth_rates', title: 'Birth Rates'},
                {key: 'fertility_rates', title: 'Fertility Rates'}],
            prams: [
                {key: 'delivery', title: 'Delivery'},
                {key: 'demographics', title: 'Demographics'},
                {key: 'family_planning', title: 'Family Planning'},
                {key: 'flu', title: 'Flu'},
                {key: 'infant_health', title: 'Infant Health'},
                {key: 'maternal_behavior', title: 'Maternal Behavior/Health'},
                {key: 'maternal_experiences', title: 'Maternal Experiences'},
                {key: 'prenatal_care', title: 'Prenatal Care'},
                {key: 'insurance_medicaid_services', title: 'Insurance/Medicaid/Services'}],
            mental_health: [
                {key: 'Alcohol and Other Drug Use', title: 'Alcohol and Other Drug Use'},
                {key: 'Dietary Behaviors', title: 'Dietary Behaviors'},
                {key: 'Obesity, Overweight, and Weight Control', title: 'Obesity, Overweight, and Weight Control'},
                {key: 'Physical Activity', title: 'Physical Activity'},
                {key: 'Sexual Behaviors', title: 'Sexual Behaviors'},
                {key: 'Tobacco Use', title: 'Tobacco Use'},
                {key: 'Unintentional Injuries and Violence', title: 'Unintentional Injuries and Violence'},
                {key: 'Other Health Topics', title: 'Other Health Topics'}]
        };
        sc.sort = {
            "label.filter.mortality": ['year', 'gender', 'race', 'hispanicOrigin', 'agegroup', 'autopsy', 'placeofdeath', 'weekday', 'month', 'state', 'ucd-chapter-10', 'mcd-chapter-10'],
            "label.risk.behavior": ['year', 'yrbsSex', 'yrbsRace', 'yrbsGrade', 'sexid', 'sexpart', 'yrbsState', 'question'],
            "label.census.bridge.race.pop.estimate": ['current_year', 'sex', 'race', 'ethnicity', 'agegroup', 'state'],
            "label.filter.natality": ['current_year', 'month', 'weekday', 'sex', 'gestational_age_r10', 'prenatal_care',
                'birth_weight', 'birth_weight_r4', 'birth_weight_r12', 'birth_plurality', 'live_birth', 'birth_place',
                'delivery_method', 'medical_attendant', 'race', 'hispanic_origin', 'marital_status',
                'mother_education', 'mother_age_1year_interval', 'mother_age_5year_interval',
                'anemia', 'cardiac_disease', 'chronic_hypertension', 'diabetes', 'eclampsia', 'hydramnios_oligohydramnios',
                'incompetent_cervix', 'lung_disease', 'pregnancy_hypertension', 'tobacco_use'],
            "label.filter.infant_mortality": ['year_of_death', 'sex', 'infant_age_at_death', 'race', 'hispanic_origin', 'marital_status',
                'mother_age_5_interval', 'mother_education', 'gestational_age_r11', 'gestational_age_r10', 'gestation_weekly',
                'prenatal_care', 'birth_weight', 'birth_plurality', 'live_birth', 'birth_place', 'delivery_method', 'medical_attendant',
                'ucd-chapter-10', 'state'],
            "label.prams.title": [],
            "label.filter.std": [],
            "label.filter.tb": [],
            "label.filter.aids": [],
            "label.filter.cancer_incident": []
        };

        sc.optionsGroup = {
            "number_of_deaths": {
                "hispanicOrigin": [
                    'Non-Hispanic',
                    {
                        "options": ['Central and South American', 'Central American', 'Cuban', 'Dominican', 'Latin American', 'Mexican', 'Puerto Rican', 'South American', 'Spaniard', 'Other Hispanic'],
                        "title": "Hispanic",
                        "key": "Hispanic"
                    },
                    'Unknown'
                ],
                "race": ['American Indian', 'Asian or Pacific Islander', 'Black', 'White'],
                "year": ['2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000', '1999', '1997','1995','1993','1991' ]
            },
            "crude_death_rates": {
                "hispanicOrigin": ['Non-Hispanic', 'Hispanic', 'Unknown'],
                "race": ['American Indian', 'Asian or Pacific Islander', 'Black', 'White'],
                "year": ['2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000']
            },
            "age-adjusted_death_rates": {
                "hispanicOrigin": ['Non-Hispanic', 'Hispanic', 'Unknown'],
                "race": ['American Indian', 'Asian or Pacific Islander', 'Black', 'White'],
                "year": ['2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000']
            },
            number_of_births: {},
            number_of_infant_deaths: {},
            birth_rates: {},
            fertility_rates: {},
            bridge_race:{},
            std:{},
            disease_rate:{},
            tb:{},
            aids: {},
            cancer_incident: {},
            mental_health:{},
            natality:{},
            prams:{},
            delivery: {
                "topic": ['cat_45', 'cat_39', 'cat_0']
            },
            demographics: {
                "topic": ['cat_15', 'cat_38']
            },
            family_planning: {
                "topic": ['cat_31', 'cat_20', 'cat_28', 'cat_11']
            },
            flu: {
                "topic": ['cat_3', 'cat_5', 'cat_8', 'cat_7']
            },
            infant_health: {
                "topic": ['cat_43', 'cat_1', 'cat_24', 'cat_19', 'cat_14', 'cat_25', 'cat_6']
            },
            maternal_behavior: {
                "topic": ['cat_2', 'cat_13', 'cat_34', 'cat_12', 'cat_18', 'cat_9', 'cat_17', 'cat_35', 'cat_23', 'cat_10', 'cat_22', 'cat_26']
            },
            maternal_experiences: {
                "topic": ['cat_29', 'cat_33', 'cat_42', 'cat_27']
            },
            prenatal_care: {
                "topic": ['cat_37', 'cat_30', 'cat_4', 'cat_40', 'cat_36', 'cat_16']
            },
            insurance_medicaid_services: {
                "topic": ['cat_32', 'cat_21', 'cat_44']
            }

        };
        //show certain filters for different table views
        //add availablefilter for birth_rates
        sc.availableFilters = {
            'crude_death_rates': ['year', 'gender', 'race', 'hispanicOrigin', 'agegroup', 'state', 'ucd-chapter-10'],
            'age-adjusted_death_rates': ['year', 'gender', 'race', 'hispanicOrigin', 'state', 'ucd-chapter-10', 'mcd-chapter-10'],
            'birth_rates': ['current_year', 'race', 'state'],
            'fertility_rates': ['current_year', 'race', 'mother_age_1year_interval', 'mother_age_5year_interval', 'state']
        };
        sc.queryID = $stateParams.queryID;
        sc.tableView = $stateParams.tableView ? $stateParams.tableView : sc.showMeOptions.deaths[0].key;
        //this flags whether to cache the incoming filter query
        sc.cacheQuery = $stateParams.cacheQuery;
        sc.tableName = null;

        function changePrimaryFilter(newFilter) {
            sc.tableData = {};
            sc.filters.selectedPrimaryFilter = searchFactory.getPrimaryFilterByKey(newFilter);
            sc.tableView = sc.filters.selectedPrimaryFilter.tableView;
            sc.search(true);
        }

        function getSearchFilter(filterName) {
            return searchFactory.getPrimaryFilterByKey(filterName).header;
        }

        function getOptionName(filterName, opt) {
            var i;

            if (filterName == "prams") {
                for (i = 0; i < sc.showMeOptions.prams.length; i++) {
                    if (sc.showMeOptions.prams[i].key == opt) {
                        return sc.showMeOptions.prams[i];
                    }
                }
            }

            else if (filterName == "natality") {
                for (i = 0; i < sc.showMeOptions.natality.length; i++) {
                    if (sc.showMeOptions.natality[i].key == opt) {
                        return sc.showMeOptions.natality[i];
                    }
                }
            }

            else if (filterName == "deaths") {
                for (i = 0; i < sc.showMeOptions.deaths.length; i++) {
                    if (sc.showMeOptions.deaths[i].key == opt) {
                        return sc.showMeOptions.deaths[i];
                    }
                }
            }

            else {
                return null;
            }
        }

        function setDefaults() {
            var yearFilter = utilService.findByKeyAndValue(sc.filters.selectedPrimaryFilter.allFilters, 'key', 'year');
            yearFilter.value.push('2015');

            var pramsFilter = utilService.findByKeyAndValue(sc.filters.primaryFilters, 'key', 'prams');
            angular.forEach(pramsFilter.sideFilters[0].sideFilters, function(filter){
                if(filter.filters.key === 'topic') {
                    filter.filters.autoCompleteOptions = sc.filters.pramsTopicOptions;
                    searchFactory.groupAutoCompleteOptions(filter.filters, sc.optionsGroup['delivery']);
                }
            });
        }

        if(sc.queryID === '') {
            //queryID is empty, run the default query
            setDefaults();
            search(true);
        } else if(sc.queryID) {
            // queryID is present, try to get the cached query
            // Disable SelectedPrimaryFilter watch so that the dataset change events is not trigger
            // while updating the view with the cached result
            getQueryResults(sc.queryID).then(function (response) {
                if (!response.data) {
                    if(!sc.cacheQuery) {
                        // redirect to default query if we were tryint to retrieve a cached query
                        // and was not found in the cache
                        $window.alert('Query ' + sc.queryID + ' could not be found');
                        $state.go('search', {
                            queryID: ''
                        });
                    } else {
                        //run a search, if user was not trying retrieve a cached query
                        search(false);
                    }

                }
                // Enable the SelectedPrimaryFilter watch
            });

        }

        function search(isFilterChanged) {
            if(sc.filters.selectedPrimaryFilter.key === 'prams' || sc.filters.selectedPrimaryFilter.key === 'mental_health') {
                angular.forEach(sc.filters.selectedPrimaryFilter.sideFilters[0].sideFilters, function(filter) {
                    if(filter.filters.key === 'topic') {
                        filter.filters.questions = [];
                        if(filter.filters.value.length === 0) {
                            angular.forEach(filter.filters.autoCompleteOptions, function (option) {
                                angular.forEach($rootScope.pramsQuestions, function(pramsCat) {
                                    if(option.key === pramsCat.id) {
                                        angular.forEach(pramsCat.children, function(question) {
                                            filter.filters.questions.push(question.id);
                                        });
                                    }
                                });
                            });
                        } else {
                            angular.forEach(filter.filters.value, function(cat) {
                                angular.forEach($rootScope.pramsQuestions, function(pramsCat) {
                                    if(cat === pramsCat.id) {
                                        angular.forEach(pramsCat.children, function(question) {
                                            filter.filters.questions.push(question.id);
                                        });
                                    }
                                });
                            });
                        }
                    } else if (filter.filters.key === 'question'){
                        if(sc.filters.selectedPrimaryFilter.key === 'mental_health') {
                            filter.filters.questions = searchFactory.getYrbsQuestionsForTopic(sc.tableView);
                        } else if(sc.filters.selectedPrimaryFilter.key === 'prams'){
                            filter.filters.questions = searchFactory.getPramsQuestionsForTopics(sc.optionsGroup[sc.tableView].topic);
                        }
                    }
                });
            }
            if(isFilterChanged) {
                //filters changed
                searchFactory.generateHashCode(sc.filters.selectedPrimaryFilter).then(function(hash) {
                    //after generating query hash, redirect and flag
                    $state.go('search', {
                        queryID: hash,
                        allFilters: sc.filters,
                        selectedFilters: sc.filters.selectedPrimaryFilter,
                        primaryFilterKey: sc.filters.selectedPrimaryFilter.key,
                        tableView: sc.tableView,
                        cacheQuery: true
                    });
                });
            } else {
                primaryFilterChanged(sc.filters.selectedPrimaryFilter, sc.queryID);
            }
        }

        /*
        * To populate autoCompleteOptions from $rootScope
        * When we refresh search page, below listener populate autoCompleteOptions value with $rootScope.questionsList
         */
        $scope.$on('yrbsQuestionsLoadded', function() {
            sc.filters.yrbsBasicFilters[4].autoCompleteOptions = $rootScope.questionsList;
            sc.filters.yrbsAdvancedFilters[4].autoCompleteOptions = $rootScope.questionsList;
        });

        $scope.$on('pramsQuestionsLoaded', function() {
            var questionFilter = utilService.findFilterByKeyAndValue(sc.filters.pramsFilters, 'key', 'question');
            questionFilter.autoCompleteOptions = $rootScope.pramsQuestionsList;
        });


        /**************************************************/
        var mapExpandControl = mapService.addExpandControl(sc.mapOptions, sc.filters.selectedPrimaryFilter);

        var mapShareControl = mapService.addShareControl();

        /**************************************************/
        //US-states map
        var mapOptions = {
            usa: {
                lat: 35,
                lng: -97,
                zoom: 3.9
            },
            legend: {},
            defaults: {
                tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                scrollWheelZoom: true,
                minZoom: 3,
                maxZoom: 5
            },
            markers: {},
            events: {
                map: {
                    enable: ['click'],
                    logic: 'emit'
                }
            },
            controls: {
                custom: []
            },
            isMap:true
        };

        var mortalityFilter = utilService.findByKeyAndValue(sc.filters.primaryFilters, 'key', 'deaths');
        var bridgeRaceFilter = utilService.findByKeyAndValue(sc.filters.primaryFilters, 'key', 'bridge_race');
        var stdFilter = utilService.findByKeyAndValue(sc.filters.primaryFilters, 'key', 'std');
        var tbFilter = utilService.findByKeyAndValue(sc.filters.primaryFilters, 'key', 'tb');
        var aidsFilter = utilService.findByKeyAndValue(sc.filters.primaryFilters, 'key', 'aids');

        angular.extend(mortalityFilter.mapData, mapOptions);
        angular.extend(bridgeRaceFilter.mapData, mapOptions);
        angular.extend(stdFilter.mapData, mapOptions);
        angular.extend(tbFilter.mapData, mapOptions);
        angular.extend(aidsFilter.mapData, mapOptions);

        function updateCharts() {
            angular.forEach(sc.filters.selectedPrimaryFilter.chartData, function (chartData) {
                angular.forEach(chartData, function (chart) {
                    if (!chart.isMap) {
                        $timeout(function () {
                            chart.api.update();
                        }, 250);
                    }
                });
            });
        }

        //fit leaflet map to container
        $timeout(function(){
            leafletData.getMap().then(function(map) {
                map.invalidateSize();
            });
        }, 1700);

        function getQueryResults(queryID) {
            return searchFactory.getQueryResults(queryID).then(function (response) {
               //if queryID exists in owh_querycache index, then update data that are required to display search results
                if (response.data) {
                    var result = searchFactory.updateFiltersAndData(sc.filters, response, sc.optionsGroup, sc.mapOptions);
                    sc.tableView = result.tableView;
                    sc.tableData = result.tableData;
                    sc.filters.selectedPrimaryFilter = result.primaryFilter;
                }
                return response;
            });
        }



        function changeViewFilter(selectedFilter) {
            sc.tableView = selectedFilter.key;
            searchFactory.removeDisabledFilters(sc.filters.selectedPrimaryFilter, selectedFilter.key, sc.availableFilters);
            angular.forEach(sc.filters.selectedPrimaryFilter.allFilters, function(filter) {
                if(filter.key === 'hispanicOrigin') {
                    if(selectedFilter.key === 'crude_death_rates' || selectedFilter.key === 'age-adjusted_death_rates') {
                        filter.queryKey = 'ethnicity_group';
                        filter.autoCompleteOptions = sc.filters.ethnicityGroupOptions;
                    } else {
                        filter.queryKey = 'hispanic_origin';
                        filter.autoCompleteOptions = sc.filters.hispanicOptions;
                    }
                }
            });
            angular.forEach(sc.filters.selectedPrimaryFilter.sideFilters, function(category) {
                angular.forEach(category.sideFilters, function(filter) {
                    if (filter.filters.key === 'hispanicOrigin') {
                        if (selectedFilter.key === 'crude_death_rates' || selectedFilter.key === 'age-adjusted_death_rates') {
                            filter.filters.queryKey = 'ethnicity_group';
                            filter.filters.autoCompleteOptions = sc.filters.ethnicityGroupOptions;
                        } else {
                            filter.filters.queryKey = 'hispanic_origin';
                            filter.filters.autoCompleteOptions = sc.filters.hispanicOptions;
                        }
                    }

                    if (filter.filters.key === 'topic') {
                        //clear selected topics on class change
                        filter.filters.value = [];
                        filter.filters.autoCompleteOptions = sc.filters.pramsTopicOptions;
                        searchFactory.groupAutoCompleteOptions(filter.filters, sc.optionsGroup[selectedFilter.key]);
                    } else if (filter.filters.key === 'question') {
                        // Clear questions selection and update questions list on class/topic change for PRAMS and YRBS datasets
                        filter.filters.value = [];
                        filter.filters.selectedValues = [];
                        filter.filters.selectedNodes = [];
                    }
                });
            });
            //we can change mapping here
            sc.filters.selectedPrimaryFilter.tableView = selectedFilter.key;
            var selectedYears = utilService.findByKeyAndValue(sc.filters.selectedPrimaryFilter.allFilters,'key', 'current_year');
            if(selectedYears != null) {
                //Always set calculateRate to true, because when user switches view from 'show me' drop down, values get reset.
                angular.forEach(selectedYears.autoCompleteOptions, function (eachObject) {
                    eachObject.disabled = false;
                });
                //Check if user selected year's 2000, 2001, 2002 and remove these years from selected year's list
                //And disable these years in side filters for birth_rates and fertility_rates
                if (sc.filters.selectedPrimaryFilter.tableView == 'birth_rates' || sc.filters.selectedPrimaryFilter.tableView == 'fertility_rates') {
                    //Remove years 2000, 2001, 2002 from selected lists
                    angular.forEach(sc.filters.selectedPrimaryFilter.birthAndFertilityRatesDisabledYears, function (year) {
                        var index = selectedYears.value.indexOf(year);
                        if (index >= 0) {
                            selectedYears.value.splice(index, 1);
                        }
                    });
                    //Disable 2000, 2001, 2002 in side filters
                    angular.forEach(selectedYears.autoCompleteOptions, function (eachObject) {
                        if (sc.filters.selectedPrimaryFilter.birthAndFertilityRatesDisabledYears.indexOf(eachObject.key) !== -1) {
                            eachObject.disabled = true;
                        }
                    });
                }
                /**
                 * When user switch back from birth_rates to number_of_births view,
                 * we need to enable Sex filter with group by 'column'
                 * Why only 'sex' ? because for 'number_of_births' view we have enabled group by for year, race, sex
                 * when user switch to 'brith_rates' we are disabling 'sex' filter(not year, race), so we need enable sex filter group when
                 * user switch to 'number_of_births' view.
                 */
                if(sc.filters.selectedPrimaryFilter.tableView == 'number_of_births') {
                   searchFactory.setFilterGroupBy(sc.filters.selectedPrimaryFilter.allFilters, 'sex', 'column');
                }
            }

            // Don't trigger search automatically for advaced search
            if(sc.filters.selectedPrimaryFilter.runOnFilterChange) {
                sc.search(true);
            }

        }

        function downloadCSV() {
            var data = searchFactory.getMixedTable(sc.filters.selectedPrimaryFilter, sc.optionsGroup, sc.tableView);
            addRowHeaders(data, sc.filters.selectedPrimaryFilter);
            var filename = xlsService.getFilename(sc.filters.selectedPrimaryFilter);
            xlsService.exportCSVFromMixedTable(data, filename);
        }

        function downloadXLS() {
            var data = searchFactory.getMixedTable(sc.filters.selectedPrimaryFilter, sc.optionsGroup, sc.tableView);
            addRowHeaders(data, sc.filters.selectedPrimaryFilter);
            var filename = xlsService.getFilename(sc.filters.selectedPrimaryFilter);
            xlsService.exportXLSFromMixedTable(data, filename);
        }

        function addRowHeaders(mixedTable, selectedFilter) {
            //add row headers so we can properly repeat row header merge cells, and also for adding % columns
            mixedTable.rowHeaders = [];
            angular.forEach(selectedFilter.value, function(filter, idx) {
                if(filter.groupBy === 'row') {
                    mixedTable.rowHeaders.push(filter);
                }
            });
        }



        /**
         * This method getting called when filters changed
         * This function get
         * @param newFilter
         * @param queryID
         */
        function primaryFilterChanged(newFilter, queryID) {
            utilService.updateAllByKeyAndValue(sc.filters.search, 'initiated', false);
            return sc.filters.selectedPrimaryFilter.searchResults(sc.filters.selectedPrimaryFilter, queryID).then(function(response) {
                var result = searchFactory.updateFiltersAndData(sc.filters, response, sc.optionsGroup, sc.mapOptions);
                sc.tableView = result.tableView;
                sc.tableData = result.tableData;
                sc.filters.selectedPrimaryFilter = result.primaryFilter;
            });
        }

        function showPhaseTwoGraphs(text) {
            searchFactory.showPhaseTwoModal(text);
        }

        //builds marker popup.
        sc.mapPopup = L.popup({autoPan:false, closeButton:false});
        sc.currentFeature = {};
        function buildMarkerPopup(lat, lng, properties, map, tableView, markerPosition) {
            var childScope = $scope.$new();
            childScope.lat = lat;
            childScope.lng = lng;
            childScope.properties = properties;
            childScope.tableView = tableView;
            var ele = angular.element('<div></div>');
            ele.html($templateCache.get('app/partials/marker-template.html'));
            var compileEle = $compile(ele.contents())(childScope);
            if(sc.currentFeature.properties !== properties || !sc.mapPopup._isOpen) {
                sc.mapPopup
                    .setContent(compileEle[0])
                    .setLatLng(L.latLng(lat, lng)).openOn(map);
            } else {
                sc.mapPopup
                    .setLatLng(L.latLng(lat, lng));
            }

            var rotatePopup = function () {
                $scope.$on("leafletDirectiveMap.popupopen", function (evt, args) {

                    var popup = args.leafletEvent.popup;

                    var popupHeight = angular.element('#chart_us_map').find('.leaflet-popup-content').height();

                    //keep track of old position of popup
                    if(!popup.options.oldOffset) {
                        popup.options.oldOffset = popup.options.offset;
                    }

                    if(markerPosition.y < 180) {
                        //change position if popup does not fit into map-container
                        popup.options.offset = new L.Point(10, popupHeight + 110);
                        angular.element('#chart_us_map').addClass('reverse-popup')
                    } else {
                        //revert position
                        popup.options.offset = popup.options.oldOffset;
                        angular.element('#chart_us_map').removeClass('reverse-popup')
                    }
                });
                //on popupclose reset pop up position
                $scope.$on("leafletDirectiveMap.popupclose", function (evt, args) {
                    $('#chart_us_map').removeClass('reverse-popup')
                })
            };

            rotatePopup();

        }
        $scope.$on("leafletDirectiveGeoJson.mouseover", function (event, args) {
            var leafEvent = args.leafletEvent;
            buildMarkerPopup(leafEvent.latlng.lat, leafEvent.latlng.lng, leafEvent.target.feature.properties,
                args.leafletObject._map, sc.filters.selectedPrimaryFilter.key, leafEvent.containerPoint);
            sc.currentFeature = leafEvent.target.feature;
            mapService.highlightFeature(args.leafletObject._map._layers[leafEvent.target._leaflet_id])

        });
        $scope.$on("leafletDirectiveGeoJson.mouseout", function (event, args) {
            sc.mapPopup._close();
            mapService.resetHighlight(args);
        });
        $scope.$on("leafletDirectiveMap.mouseout", function (event, args) {
            sc.mapPopup._close();
        });

        $scope.$on("leafletDirectiveMap.load", function (event, args) {
            var mapScaleControl = mapService.addScaleControl(sc.filters.selectedPrimaryFilter.mapData);
            args.leafletObject.addControl(new mapExpandControl());
            args.leafletObject.addControl(new mapShareControl());
            args.leafletObject.addControl(new mapScaleControl());
        });

        /*Show expanded graphs with whole set of features*/
        function showExpandedGraph(chartData) {
            var tableView = sc.filters.selectedPrimaryFilter.chartView || sc.filters.selectedPrimaryFilter.tableView;
            chartUtilService.showExpandedGraph([chartData], tableView);
        }

        function getChartTitle(title) {
            var filters = title.split('.');
            filters = filters.slice(2);
            if (filters.length > 1) {
                return $filter('translate')('label.chart.' + filters[0]) + ' and ' + $filter('translate')('label.chart.' + filters[1]);
            } else {
                return $filter('translate')('label.chart.' + filters[0]);
            }
        }

        /**
         * Switch to YRBS basic filter
         */
        function switchToYRBSBasic(){
            sc.filters.selectedPrimaryFilter.showBasicSearchSideMenu = true;
            sc.filters.selectedPrimaryFilter.runOnFilterChange = true;
            sc.filters.selectedPrimaryFilter.allFilters = sc.filters.yrbsBasicFilters;
            sc.filters.selectedPrimaryFilter.sideFilters = sc.filters.search[1].basicSideFilters;
            sc.search(true);
        }

        /**
         * Switch to YRBS advanced filter
         */
        function switchToYRBSAdvanced(){
            sc.filters.selectedPrimaryFilter.showBasicSearchSideMenu = false;
            sc.filters.selectedPrimaryFilter.runOnFilterChange = false;
            sc.filters.selectedPrimaryFilter.allFilters = sc.filters.yrbsAdvancedFilters;
            sc.filters.selectedPrimaryFilter.sideFilters = sc.filters.search[1].advancedSideFilters;
            sc.search(true);
        }

        /**
         * Shows facebook share dialog box
         */
        function showFbDialog(svgIndex, title, data) {
            shareUtilService.shareOnFb(svgIndex, title, undefined, undefined, data);
        }

        /**
         * For STD, TB and HIV
         * To change Visualizations data based on selected view.
         * @param tableView
         */
        function onChartViewChange(chartView) {
            var selectedPrimaryFilter = sc.filters.selectedPrimaryFilter;
            var chartOption = utilService.findByKeyAndValue(selectedPrimaryFilter.chartViewOptions, 'key', chartView);
            selectedPrimaryFilter.chartAxisLabel = chartOption.axisLabel;
            selectedPrimaryFilter.chartView = chartOption.key;
            selectedPrimaryFilter.chartData = searchFactory.prepareChartData(sc.filters.selectedPrimaryFilter.headers, sc.filters.selectedPrimaryFilter.nestedData, sc.filters.selectedPrimaryFilter);
        }
    }
}());
