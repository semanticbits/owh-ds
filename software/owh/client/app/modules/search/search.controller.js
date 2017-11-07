(function(){
    angular
        .module('owh.search')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', 'utilService', 'searchFactory', '$rootScope',
        '$templateCache', '$compile', '$filter', 'leafletData', '$timeout', 'chartUtilService', 'shareUtilService',
        '$stateParams', '$state', 'xlsService', '$window', 'mapService', 'ModalService', '$q'];

    function SearchController($scope, utilService, searchFactory, $rootScope,
                                 $templateCache, $compile, $filter, leafletData, $timeout, chartUtilService,
                                 shareUtilService, $stateParams, $state, xlsService, $window, mapService, ModalService, $q) {

        var sc = this;
        sc.downloadCSV = downloadCSV;
        sc.downloadXLS = downloadXLS;
        sc.showPhaseTwoGraphs = showPhaseTwoGraphs;
        sc.showExpandedGraph = showExpandedGraph;
        sc.showExpandedMap = showExpandedMap;
        sc.showFBDialogForMap = showFBDialogForMap;
        sc.search = search;
        sc.changeViewFilter = changeViewFilter;
        sc.getQueryResults = getQueryResults;
        sc.changePrimaryFilter = changePrimaryFilter;
        sc.updateCharts = updateCharts;
        sc.getChartTitle = getChartTitle;
        sc.skipRefresh = false;
        sc.switchToBasicSearch = switchToBasicSearch;
        sc.switchToAdvancedSearch = switchToAdvancedSearch;
        sc.showFbDialog = showFbDialog;
        sc.onChartViewChange = onChartViewChange;
        sc.findNameByKeyAndValue = findNameByKeyAndValue;
        sc.mapService = mapService;
        $scope.redirectToMortalityPage = function(){
           sc.changePrimaryFilter('deaths');
        };

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
                {
                    basic:[
                        {key: 'basic_delivery', title: 'Delivery'},
                        {key: 'basic_demographics', title: 'Demographics'},
                        {key: 'basic_family_planning', title: 'Family Planning'},
                        {key: 'basic_flu', title: 'Flu'},
                        {key: 'basic_infant_health', title: 'Infant Health'},
                        {key: 'basic_maternal_behavior', title: 'Maternal Behavior/Health'},
                        {key: 'basic_maternal_experiences', title: 'Maternal Experiences'},
                        {key: 'basic_prenatal_care', title: 'Prenatal Care'},
                        {key: 'basic_insurance_medicaid_services', title: 'Insurance/Medicaid/Services'}
                    ]
                },
                {
                    advance:[
                        {key: 'advance_delivery', title: 'Delivery'},
                        {key: 'advance_demographics', title: 'Demographics'},
                        {key: 'advance_family_planning', title: 'Family Planning'},
                        {key: 'advance_infant_health', title: 'Infant Health'},
                        {key: 'advance_maternal_behavior', title: 'Maternal Behavior/Health'},
                        {key: 'advance_maternal_experiences', title: 'Maternal Experiences'},
                        {key: 'advance_prenatal_care', title: 'Prenatal Care'},
                        {key: 'advance_insurance_medicaid_services', title: 'Insurance/Medicaid/Services'}
                    ]
                }
            ],
            brfss: [
                {key: 'alcohol_consumption', title: 'Alcohol Consumption'},
                {key: 'cholesterol_awareness', title: 'Cholesterol Awareness'},
                {key: 'chronic_health_indicator', title: 'Chronic Health Indicators'},
                {key: 'colorectal_cancer_screening', title: 'Colorectal Cancer Screening'},
                {key: 'brfs_demographics', title: 'Demographics'},
                {key: 'fruits_vegetables', title: 'Fruits and Vegetables'},
                {key: 'healthcare_access_coverage', title: 'Health Care Access/Coverage'},
                {key: 'health_status', title: 'Health Status'},
                {key: 'hiv_aids', title: 'HIV - AIDS'},
                {key: 'hypertension_awareness', title: 'Hypertension Awareness'},
                {key: 'immunization', title: 'Immunization'},
                {key: 'injury', title: 'Injury'},
                {key: 'oral_health', title: 'Oral Health'},
                {key: 'overweight_and_ovesity', title: 'Overweight and Obesity(BMI)'},
                {key: 'physical_activity', title: 'Physical Activity'},
                {key: 'prostate_cancer', title: 'Prostate Cancer'},
                {key: 'tobbaco_use', title: 'Tobbaco Use'},
                {key: 'womens_health', title: "Women's Health"}
            ],

            mental_health: [
                {key: 'Alcohol and Other Drug Use', title: 'Alcohol and Other Drug Use'},
                {key: 'Dietary Behaviors', title: 'Dietary Behaviors'},
                {key: 'Obesity, Overweight, and Weight Control', title: 'Obesity, Overweight, and Weight Control'},
                {key: 'Physical Activity', title: 'Physical Activity'},
                {key: 'Sexual Behaviors', title: 'Sexual Behaviors'},
                {key: 'Tobacco Use', title: 'Tobacco Use'},
                {key: 'Unintentional Injuries and Violence', title: 'Unintentional Injuries and Violence'},
                {key: 'Other Health Topics', title: 'Other Health Topics'}],
            cancer_incident: [
                { key: 'cancer_incident', title: 'Number of Incidents' },
                { key: 'crude_cancer_incidence_rates', title: 'Crude Incidence Rates' }
            ],
            cancer_mortality: [
                { key: 'cancer_mortality', title: 'Number of Deaths' },
                { key: 'crude_cancer_death_rates', title: 'Crude Death Rates' }
            ]
        };
        sc.sort = {
            "label.filter.mortality": ['year', 'gender', 'race', 'hispanicOrigin', 'agegroup', 'autopsy', 'placeofdeath', 'weekday', 'month', 'state', 'census-region', 'hhs-region', 'ucd-chapter-10', 'mcd-chapter-10'],
            "label.risk.behavior": ['year', 'yrbsSex', 'yrbsRace', 'yrbsGrade', 'sexid', 'sexpart', 'yrbsState', 'question'],
            "label.census.bridge.race.pop.estimate": ['current_year', 'sex', 'race', 'ethnicity', 'agegroup', 'state'],
            "label.filter.natality": ['current_year', 'month', 'weekday', 'sex', 'gestational_age_r10', 'gestation_recode10', 'gestation_recode11', 'gestation_weekly', 'prenatal_care',
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
            "label.brfss.title": [],
            "label.filter.std": [],
            "label.filter.tb": [],
            "label.filter.aids": [],
            "label.filter.cancer_incident": [],
            "label.filter.cancer_mortality": []
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
            cancer_mortality: {},
            mental_health:{},
            natality:{},
            prams:{},
            brfss:{},
            basic_delivery: {
                "topic": ['cat_45', 'cat_39', 'cat_0']
            },
            basic_demographics: {
                "topic": ['cat_15', 'cat_38']
            },
            basic_family_planning: {
                "topic": ['cat_31', 'cat_20', 'cat_28', 'cat_11']
            },
            basic_flu: {
                "topic": ['cat_3', 'cat_5', 'cat_8', 'cat_7']
            },
            basic_infant_health: {
                "topic": ['cat_43', 'cat_1', 'cat_24', 'cat_19', 'cat_14', 'cat_25', 'cat_6']
            },
            basic_maternal_behavior: {
                "topic": ['cat_2', 'cat_13', 'cat_34', 'cat_12', 'cat_18', 'cat_9', 'cat_17', 'cat_35', 'cat_23', 'cat_10', 'cat_22', 'cat_26']
            },
            basic_maternal_experiences: {
                "topic": ['cat_29', 'cat_33', 'cat_42', 'cat_27']
            },
            basic_prenatal_care: {
                "topic": ['cat_37', 'cat_30', 'cat_4', 'cat_40', 'cat_36', 'cat_16']
            },
            basic_insurance_medicaid_services: {
                "topic": ['cat_32', 'cat_21', 'cat_44']
            },
            advance_delivery: {
                "topic": ['cat_26', 'cat_24']
            },
            advance_demographics: {
                "topic": ['cat_22', 'cat_17']
            },
            advance_family_planning: {
                "topic": ['cat_1', 'cat_3', 'cat_2', 'cat_27']
            },
            advance_infant_health: {
                "topic": ['cat_4', 'cat_32', 'cat_5', 'cat_18', 'cat_33']
            },
            advance_maternal_behavior: {
                "topic": ['cat_15', 'cat_21', 'cat_9', 'cat_7', 'cat_6', 'cat_13', 'cat_23', 'cat_14', 'cat_10', 'cat_8', 'cat_31', 'cat_34']
            },
            advance_maternal_experiences: {
                "topic": ['cat_25', 'cat_35']
            },
            advance_prenatal_care: {
                "topic": ['cat_36', 'cat_12', 'cat_29', 'cat_28']
            },
            advance_insurance_medicaid_services: {
                "topic": ['cat_11', 'cat_20', 'cat_38']
            },
            alcohol_consumption: {
                "topic": ['cat_12', 'cat_51', 'cat_53']
            },
            cholesterol_awareness: {
                "topic": ['cat_3', 'cat_52']
            },
            chronic_health_indicator:{
                "topic": ['cat_38', 'cat_32', 'cat_10', 'cat_4', 'cat_0', 'cat_11',
                    'cat_5', 'cat_6', 'cat_7', 'cat_8']
            },
            healthcare_access_coverage: {
                "topic": ['cat_21', 'cat_17', 'cat_9', 'cat_22', 'cat_45']
            },
            colorectal_cancer_screening:{
                "topic": ['cat_42', 'cat_34', 'cat_44', 'cat_35']
            },
            brfs_demographics:{
                "topic": ['cat_1', 'cat_2', 'cat_13','cat_14', 'cat_18', 'cat_19',
                    'cat_20', 'cat_33', 'cat_23', 'cat_24', 'cat_25', 'cat_29']
            },
            fruits_vegetables:{
                "topic": ['cat_43', 'cat_62']
            },
            health_status:{
                "topic": ['cat_54', 'cat_15']
            },
            hiv_aids:{
                "topic": ['cat_16']
            },
            hypertension_awareness:{
                "topic": ['cat_55']
            },
            immunization:{
                "topic": ['cat_41', 'cat_50', 'cat_27', 'cat_26']
            },
            injury:{
                "topic": ['cat_39', 'cat_58']
            },
            oral_health:{
                "topic": ['cat_30', 'cat_37', 'cat_40']
            },
            overweight_and_ovesity:{
                "topic": ['cat_31']
            },
            prostate_cancer:{
                "topic": ['cat_57']
            },
            tobbaco_use:{
                "topic": ['cat_59', 'cat_28', 'cat_60']
            },
            womens_health:{
                "topic": ['cat_46', 'cat_56']
            },
            physical_activity:{
                "topic": ['cat_48', 'cat_61', 'cat_47', 'cat_49']
            }

        };
        //show certain filters for different table views
        //add availablefilter for birth_rates
        sc.availableFilters = {
            'crude_death_rates': ['year', 'gender', 'race', 'hispanicOrigin', 'agegroup', 'state', 'census-region', 'hhs-region', 'ucd-chapter-10', 'mcd-chapter-10'],
            'age-adjusted_death_rates': ['year', 'gender', 'race', 'hispanicOrigin', 'state', 'census-region', 'hhs-region','ucd-chapter-10', 'mcd-chapter-10'],
            'birth_rates': ['current_year', 'race', 'state', 'census-region', 'hhs-region'],
            'fertility_rates': ['current_year', 'race', 'mother_age_1year_interval', 'mother_age_5year_interval', 'state', 'census-region', 'hhs-region']
        };
        sc.queryID = $stateParams.queryID;
        sc.tableView = $stateParams.tableView ? $stateParams.tableView : sc.showMeOptions.deaths[0].key;
        //this flags whether to cache the incoming filter query
        sc.cacheQuery = $stateParams.cacheQuery;
        sc.tableName = null;

        function changePrimaryFilter(newFilter) {
            $rootScope.acceptDUR = false;
            if (newFilter == 'deaths' ||newFilter== 'natality' ||newFilter == 'infant_mortality'){
                showDataUseRestriction().then (function () {
                    sc.tableData = {};
                    sc.filters.selectedPrimaryFilter = searchFactory.getPrimaryFilterByKey(newFilter);
                    sc.tableView = sc.filters.selectedPrimaryFilter.tableView;
                    sc.search(true);
                })
            }else {
                sc.tableData = {};
                sc.filters.selectedPrimaryFilter = searchFactory.getPrimaryFilterByKey(newFilter);
                sc.tableView = sc.filters.selectedPrimaryFilter.tableView;
                sc.search(true);
            }

        }

        function setDefaults() {
            var yearFilter = utilService.findByKeyAndValue(sc.filters.selectedPrimaryFilter.allFilters, 'key', 'year');
            yearFilter.value.push('2015');
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
            if (!$rootScope.acceptDUR  && (sc.filters.selectedPrimaryFilter.key === 'deaths' || sc.filters.selectedPrimaryFilter.key === 'natality' ||sc.filters.selectedPrimaryFilter.key === 'infant_mortality')) {
                showDataUseRestriction().then (function () {
                    search(isFilterChanged);
                }).catch(function () {
                    return
                });
                return;
            }
            if(sc.filters.selectedPrimaryFilter.key === 'prams'
                || sc.filters.selectedPrimaryFilter.key === 'mental_health'
                || sc.filters.selectedPrimaryFilter.key === 'brfss') {

                var statQuestions = searchFactory.getQuestionsByDataset(sc.filters.selectedPrimaryFilter.key,
                                                                        sc.filters.selectedPrimaryFilter.showBasicSearchSideMenu);

                angular.forEach(sc.filters.selectedPrimaryFilter.sideFilters[0].sideFilters, function(filter) {
                    if(filter.filters.key === 'topic') {
                        filter.filters.questions = [];
                        if(filter.filters.value.length === 0) {
                            angular.forEach(filter.filters.autoCompleteOptions, function (option) {
                                angular.forEach(statQuestions, function(pramsCat) {
                                    if(option.key === pramsCat.id) {
                                        angular.forEach(pramsCat.children, function(question) {
                                            filter.filters.questions.push(question.id);
                                        });
                                    }
                                });
                            });
                        } else {
                            angular.forEach(filter.filters.value, function(cat) {
                                angular.forEach(statQuestions, function(pramsCat) {
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
                        } else if(sc.filters.selectedPrimaryFilter.key === 'prams'
                            || sc.filters.selectedPrimaryFilter.key === 'brfss'){
                            filter.filters.questions = searchFactory.getQuestionsByTopics(sc.optionsGroup[sc.tableView].topic, statQuestions);
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

        $scope.$on('pramsBasicQuestionsLoaded', function() {
            var basicQuesFilter = utilService.findFilterByKeyAndValue(sc.filters.pramsBasicFilters, 'key', 'question');
            basicQuesFilter.autoCompleteOptions = $rootScope.pramsBasicQuestionsList;
        });

        $scope.$on('pramsAdvanceQuestionsLoaded', function() {
            var advanceQuesFilter = utilService.findFilterByKeyAndValue(sc.filters.pramsAdvanceFilters, 'key', 'question');
            advanceQuesFilter.autoCompleteOptions = $rootScope.pramsAdvanceQuestionsList;
        });

        $scope.$on('brfsQuestionsLoaded', function() {
            var basicQuesFilter = utilService.findFilterByKeyAndValue(sc.filters.brfsBasicFilters, 'key', 'question');
            basicQuesFilter.autoCompleteOptions = $rootScope.brfsQuestionsList;
            var advanceQuesFilter = utilService.findFilterByKeyAndValue(sc.filters.brfsAdvancedFilters, 'key', 'question');
            advanceQuesFilter.autoCompleteOptions = $rootScope.brfsQuestionsList;
        });

        /**************************************************/
        //US-states map
        var mapOptions = {
            usa: {
                lat: 35,
                lng: -97,
                zoom: 3.3
            },
            legend: {},
            defaults: {
                tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                scrollWheelZoom: false,
                minZoom: 3,
                maxZoom: 3.5
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
        var cancerIncidenceFilter = utilService.findByKeyAndValue(sc.filters.primaryFilters, 'key', 'cancer_incident');
        var cancerMortalityFilter = utilService.findByKeyAndValue(sc.filters.primaryFilters, 'key', 'cancer_mortality');

        angular.extend(mortalityFilter.mapData, mapOptions);
        angular.extend(bridgeRaceFilter.mapData, mapOptions);
        angular.extend(stdFilter.mapData, mapOptions);
        angular.extend(tbFilter.mapData, mapOptions);
        angular.extend(aidsFilter.mapData, mapOptions);
        angular.extend(cancerIncidenceFilter.mapData, mapOptions);
        angular.extend(cancerMortalityFilter.mapData, mapOptions);

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

        function getQueryResults(queryID) {
            var deffered = $q.defer();
            searchFactory.getQueryResults(queryID).then(function (response) {
               //if queryID exists in owh_querycache index, then update data that are required to display search results
                if (response.data) {
                    var dataset = response.data.queryJSON.key;
                    if (!$rootScope.acceptDUR && (dataset === 'deaths' || dataset === 'natality' || dataset === 'infant_mortality')) {
                        showDataUseRestriction().then(function () {
                            var result = searchFactory.updateFiltersAndData(sc.filters, response, sc.optionsGroup, sc.mapOptions);
                            sc.tableView = result.tableView;
                            sc.tableData = result.tableData;
                            sc.filters.selectedPrimaryFilter = result.primaryFilter;
                        }).catch(function () {
                            deffered.reject();
                        });
                    } else {
                        var result = searchFactory.updateFiltersAndData(sc.filters, response, sc.optionsGroup, sc.mapOptions);
                        sc.tableView = result.tableView;
                        sc.tableData = result.tableData;
                        sc.filters.selectedPrimaryFilter = result.primaryFilter;
                        sc.filters.selectedPrimaryFilter.tableView = result.tableView;
                    }
                }
                deffered.resolve(response);
            });
            return deffered.promise;
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
                else if(selectedFilter.key === 'fertility_rates' && filter.key === 'mother_age_1year_interval') {
                    filter.value = utilService.removeValuesFromArray(filter.value, filter.disableAgeOptions);
                }
                else if(selectedFilter.key === 'fertility_rates' && filter.key === 'mother_age_5year_interval') {
                    filter.value = utilService.removeValuesFromArray(filter.value, filter.disableAgeOptions);
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
                        filter.filters.value = [];
                    }

                    // Disable grouping for UCD and MCD filters on crude_death_rates and age_adjusted_rates views in mortality
                    if (filter.filters.key === 'ucd-chapter-10' || filter.filters.key === "mcd-chapter-10"){
                        if(selectedFilter.key === 'crude_death_rates' || selectedFilter.key === 'age-adjusted_death_rates') {
                            filter.allowGrouping = false;
                            filter.filters.groupBy = false;
                        } else if (selectedFilter.key === 'number_of_deaths'){
                            filter.allowGrouping = true;
                        }
                    }

                    if (filter.filters.key === 'topic') {
                        //clear selected topics on class change
                        filter.filters.value = [];
                        if (sc.filters.selectedPrimaryFilter.key == 'prams') {
                            if (sc.filters.selectedPrimaryFilter.showBasicSearchSideMenu) {
                                filter.filters.autoCompleteOptions = sc.filters.pramsPrecTopicOptions;
                            } else {
                                filter.filters.autoCompleteOptions = sc.filters.pramsRawTopicOptions;
                            }
                        } else {
                            filter.filters.autoCompleteOptions = sc.filters.brfsTopicOptions;
                        }
                        searchFactory.groupAutoCompleteOptions(filter.filters, sc.optionsGroup[selectedFilter.key]);
                    } else if (filter.filters.key === 'question') {
                        if(sc.filters.selectedPrimaryFilter.key === 'mental_health') {
                            filter.filters.questions = searchFactory.getYrbsQuestionsForTopic(sc.tableView);
                        } else if(sc.filters.selectedPrimaryFilter.key === 'prams'
                            || sc.filters.selectedPrimaryFilter.key === 'brfss') {
                            var statQuestions = searchFactory.getQuestionsByDataset(sc.filters.selectedPrimaryFilter.key,
                                sc.filters.selectedPrimaryFilter.showBasicSearchSideMenu);
                            filter.filters.questions = searchFactory.getQuestionsByTopics(sc.optionsGroup[sc.tableView].topic, statQuestions);
                        }
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

        function prepareDataForExport() {
            var filters = sc.filters;
            var selectedPrimaryFilter = filters.selectedPrimaryFilter;
            var key = selectedPrimaryFilter.key;

            var data = searchFactory.getMixedTable(selectedPrimaryFilter, sc.optionsGroup, sc.tableView, sc.tableData.calculatePercentage);
            addRowHeadersData(data, selectedPrimaryFilter);

            if (filters.filterUtilities && filters.filterUtilities[key]) {
                data.filterUtilities = {
                    ci: {
                        value: filters.filterUtilities[key][0].options[0].value,
                        title: filters.filterUtilities[key][0].options[0].title
                    },
                    uf: {
                        value: filters.filterUtilities[key][0].options[1].value,
                        title: filters.filterUtilities[key][0].options[1].title
                    }
                };
            }

            var filename = xlsService.getFilename(selectedPrimaryFilter);

            return { data: data, key: key, filename: filename };
        }

        function downloadCSV() {
            var result = prepareDataForExport();
            xlsService.exportCSVFromMixedTable(result.data, result.key, sc.tableView, result.filename);
        }

        function downloadXLS() {
            var result = prepareDataForExport();
            xlsService.exportXLSFromMixedTable(result.data, result.key, sc.tableView, result.filename);
        }

        function addRowHeadersData(mixedTable, selectedFilter) {
            //add row headers so we can properly repeat row header merge cells, and also for adding % columns -- only length is used
            mixedTable.rowHeadersLength = 0;
            angular.forEach(selectedFilter.value, function(filter, idx) {
                if(filter.groupBy === 'row') {
                    mixedTable.rowHeadersLength++;
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
                $timeout(function(){
                    leafletData.getMap('minimizedMap').then(function(map) {
                        attachEventsForMap(map);
                    });
                }, 500);
            });
        }

        //To show and hide minimized Map and Expanded Map
        sc.togglemap = true;

        function showPhaseTwoGraphs(text) {
            searchFactory.showPhaseTwoModal(text);
        };

        //builds marker popup.
        sc.mapPopup = L.popup({autoPan:false, closeButton:false});
        sc.currentFeature = {};
        function buildMarkerPopup(lat, lng, properties, map, key, markerPosition) {
            var childScope = $scope.$new();
            childScope.lat = lat;
            childScope.lng = lng;
            childScope.properties = properties;
            childScope.key = key;
            childScope.totalLabel = mapService.getTotalLabel(properties.tableView);
            var ele = angular.element('<div></div>');
            ele.html($templateCache.get('app/partials/marker-template.html'));
            var compileEle = $compile(ele.contents())(childScope);
            if(sc.currentFeature.properties !== properties || !sc.mapPopup._isOpen) {
                $timeout(function () {
                    sc.mapPopup
                        .setContent(compileEle[0])
                        .setLatLng(L.latLng(lat, lng)).openOn(map);
                }, 100);
            } else {
                sc.mapPopup
                    .setLatLng(L.latLng(lat, lng));
            }

            var rotatePopup = function () {
                map.on("popupopen", function (evt, args) {

                    var popup = evt.popup;

                    var popupHeight = angular.element('#chart_us_map').find('.leaflet-popup-content').height()
                        || angular.element('#expanded_us_map').find('.leaflet-popup-content').height();

                    //keep track of old position of popup
                    if(!popup.options.oldOffset) {
                        popup.options.oldOffset = popup.options.offset;
                    }

                    if(markerPosition.y < 180) {
                        //change position if popup does not fit into map-container
                        popup.options.offset = new L.Point(10, popupHeight + 50);
                        angular.element('#chart_us_map').addClass('reverse-popup');
                        angular.element('#expanded_us_map').addClass('reverse-popup');
                    } else {
                        //revert position
                        popup.options.offset = popup.options.oldOffset;
                        angular.element('#chart_us_map').removeClass('reverse-popup');
                        angular.element('#expanded_us_map').removeClass('reverse-popup');
                    }
                });
                //on popupclose reset pop up position
                map.on("popupclose", function (evt, args) {
                    $('#chart_us_map').removeClass('reverse-popup');
                    $('#expanded_us_map').removeClass('reverse-popup');
                })
            };

            rotatePopup();

        }

        /**
         * To attach required events to map and add scale control
         * @param map
         */
        function attachEventsForMap(map) {
            map.invalidateSize();
            map.eachLayer(function (layer){
                if(layer.feature) {
                    layer.on("mouseover", function (event) {
                        if(sc.filters.selectedPrimaryFilter && event.target.feature) {
                            buildMarkerPopup(event.latlng.lat, event.latlng.lng, event.target.feature.properties,
                                event.target._map, sc.filters.selectedPrimaryFilter.key, event.containerPoint);
                            sc.currentFeature = event.target.feature;
                            mapService.highlightFeature(event.target._map._layers[event.target._leaflet_id]);
                        }
                    });
                    layer.on("mouseout", function (event) {
                        sc.mapPopup._close();
                        mapService.resetHighlight(event);
                    });
                }
            });

            map.whenReady(function (event){
                if(sc.filters.selectedPrimaryFilter && !map.customControl) {
                    var mapScaleControl = mapService.addScaleControl(sc.filters.selectedPrimaryFilter.mapData);
                    event.addControl(new mapScaleControl());
                }
            });
        }


        /*Show expanded graphs with whole set of features*/
        function showExpandedGraph(chartData) {
            var tableView = sc.filters.selectedPrimaryFilter.chartView || sc.filters.selectedPrimaryFilter.tableView;
            chartUtilService.showExpandedGraph([chartData], tableView,null, null, null, sc.filters.selectedPrimaryFilter, null, utilService.getSelectedFiltersText(sc.filters.selectedPrimaryFilter.allFilters, sc.sort[sc.filters.selectedPrimaryFilter.title]));
        }

        /**
         * Exanad Map and show in modal
         * @param data - Map Data
         */
        function showExpandedMap(data) {
            sc.togglemap = !sc.togglemap;
            var mapTitle = sc.mapService.getMapTitle(sc.filters.selectedPrimaryFilter);
            var mapData = angular.copy(data);
            mapData.usa.zoom = 3.9;
            mapData.defaults.maxZoom = 5;
            ModalService.showModal({
                templateUrl: "app/partials/expandedMapModal.html",
                controllerAs: 'eg',
                controller: function ($scope, close) {
                    var eg = this;
                    eg.mapTitle = mapTitle;
                    eg.mapData = mapData;
                    eg.showFBDialogForMap = function(mapID) {
                        showFBDialogForMap(mapID);
                    };
                    eg.close = close;
                },
                size:650
            }).then(function (modal) {
                modal.element.show();
                leafletData.getMap('expandedMap').then(function(map) {
                    attachEventsForMap(map);
                });
                modal.close.then(function (result) {
                    modal.element.hide();
                    sc.togglemap = true;
                    leafletData.getMap('minimizedMap').then(function(map) {
                        attachEventsForMap(map);
                    });

                });
            });
        }

        /**
         * To share map on facebook
         * @param mapID  - Map ID
         */
        function showFBDialogForMap(mapID) {
            leafletData.getMap(mapID).then(function (map) {
                leafletImage(map, function (err, canvas) {
                    shareUtilService.shareOnFb('chart_us_map', 'OWH - Map', undefined, undefined, canvas.toDataURL());
                });
            });
        }

        function getChartTitle(title) {
            // var filters = title.split('.');
            // filters = filters.slice(2);
            // if (filters.length > 1) {
            //     return $filter('translate')('label.chart.' + filters[0]) + ' and ' + $filter('translate')('label.chart.' + filters[1]);
            // } else {
            //     return $filter('translate')('label.chart.' + filters[0]);
            // }
            return title;
        }

        /**
         * Switch to YRBS basic filter
         */
        function switchToBasicSearch(dataset){
            sc.filters.selectedPrimaryFilter.showBasicSearchSideMenu = true;
            sc.filters.selectedPrimaryFilter.runOnFilterChange = true;
            if(dataset === 'mental_health') {
                sc.filters.selectedPrimaryFilter.allFilters = sc.filters.yrbsBasicFilters;
                sc.filters.selectedPrimaryFilter.sideFilters = sc.filters.search[1].basicSideFilters;
            } else if (dataset === 'prams') {
                sc.filters.selectedPrimaryFilter.allFilters = sc.filters.pramsBasicFilters;
                sc.filters.selectedPrimaryFilter.sideFilters = sc.filters.search[4].basicSideFilters[0].sideFilters;
                sc.filters.selectedPrimaryFilter.tableView = 'basic_delivery';
                sc.tableView = 'basic_delivery';
                //reset income filter as there are different sets of income filters for pre-comp and raw data
                sc.filters.selectedPrimaryFilter.allFilters[6].value = '';
                sc.filters.selectedPrimaryFilter.allFilters[0].autoCompleteOptions = sc.filters.pramsPrecTopicOptions;
            } else if (dataset === 'brfss') {
                sc.filters.selectedPrimaryFilter.allFilters = sc.filters.brfsBasicFilters;
                sc.filters.selectedPrimaryFilter.sideFilters = sc.filters.search[11].basicSideFilters[0].sideFilters;
                sc.filters.selectedPrimaryFilter.allFilters[0].autoCompleteOptions = sc.filters.brfsTopicOptions;
                sc.filters.selectedPrimaryFilter.tableView = 'alcohol_consumption';
                sc.tableView = 'alcohol_consumption';
            }

            sc.search(true);
        }

        /**
         * Switch to YRBS advanced filter
         */
        function switchToAdvancedSearch(dataset) {
            sc.filters.selectedPrimaryFilter.showBasicSearchSideMenu = false;
            sc.filters.selectedPrimaryFilter.runOnFilterChange = false;
            if(dataset === 'mental_health') {
                sc.filters.selectedPrimaryFilter.allFilters = sc.filters.yrbsAdvancedFilters;
                sc.filters.selectedPrimaryFilter.sideFilters = sc.filters.search[1].advancedSideFilters;
            } else if (dataset === 'prams') {
                sc.filters.selectedPrimaryFilter.allFilters = sc.filters.pramsAdvanceFilters;
                sc.filters.selectedPrimaryFilter.sideFilters = sc.filters.search[4].advancedSideFilters[0].sideFilters;
                sc.filters.selectedPrimaryFilter.tableView = 'advance_delivery';
                sc.tableView = 'advance_delivery';
                //reset income filter as there are different sets of income filters for pre-comp and raw data
                sc.filters.selectedPrimaryFilter.allFilters[6].value = '';
                sc.filters.selectedPrimaryFilter.allFilters[0].autoCompleteOptions = sc.filters.pramsRawTopicOptions;
            } else if (dataset === 'brfss') {
                sc.filters.selectedPrimaryFilter.allFilters = sc.filters.brfsAdvancedFilters;
                sc.filters.selectedPrimaryFilter.sideFilters = sc.filters.search[11].advancedSideFilters[0].sideFilters;
                sc.filters.selectedPrimaryFilter.allFilters[0].autoCompleteOptions = sc.filters.brfsTopicOptions;
                sc.filters.selectedPrimaryFilter.tableView = 'alcohol_consumption';
                sc.tableView = 'alcohol_consumption';
            }

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
            selectedPrimaryFilter.showRates = (chartView === 'disease_rate');
            mapService.updateStatesDeaths(sc.filters.selectedPrimaryFilter, sc.filters.selectedPrimaryFilter.nestedData.maps, undefined, sc.mapOptions);
            $timeout(function(){
                leafletData.getMap('minimizedMap').then(function(map) {
                    attachEventsForMap(map);
                });
            }, 1700);
        }

        function findNameByKeyAndValue(key) {
            return utilService.findByKeyAndValue(sc.filters.primaryFilters, 'key', key).header;
        }

        sc.dataSourceCategories = [
            {
                dataSources: [
                    createDataSource('label.filter.group.demographics', 'label.demographics.dsc', 'demographics-icon.svg', 'Demographics', [
                        createDataSet('bridge_race', 'label.bridged.race', 'label.bridged.race.dsc')
                    ]),
                    createDataSource('label.filter.disease', 'label.disease.dsc', 'diseases-icon.svg', 'Disease', [
                        createDataSet('cancer_incident', 'label.filter.cancer_incident', 'label.cancer.dsc'),
                        createDataSet('aids', 'label.filter.aids', 'label.aids.dsc'),
                        createDataSet('std', 'label.std', 'label.std.dsc'),
                        createDataSet('tb', 'label.filter.tb', 'label.tb.dsc')
                    ])
                ]
            },
            {
                dataSources: [
                    createDataSource('label.births.family', 'label.births.family.dsc', 'natality-icon.svg', 'Births and Family Planning', [
                        createDataSet('natality', 'label.filter.natality', 'label.natality.dsc'),
                        createDataSet('prams', 'label.prams.title', 'label.prams.dsc')
                    ]),
                    createDataSource('label.health.risk', 'label.health.risk.dsc', 'health-risk-factors-icon.svg', 'Health Status and Risk Factors', [
                        createDataSet('brfss', 'label.brfss.title', 'label.brfs.dsc'),
                        createDataSet('prams', 'label.prams.title', 'label.prams.dsc'),
                        createDataSet('mental_health', 'label.yrbs', 'label.yrbs.dsc')
                    ])
                ]
            },
            {
                dataSources: [
                    createDataSource('label.mortality', 'label.mortality.dsc', 'mortality-icon.svg', 'Mortality', [
                        createDataSet('cancer_mortality', 'label.filter.cancer_mortality', 'label.cancer_mortality.dsc'),
                        createDataSet('deaths', 'label.filter.mortality', 'label.mortality.dsc.two'),
                        createDataSet('infant_mortality', 'label.filter.infant_mortality', 'label.infant.mortality.dsc')
                    ]),
                    createDataSource('label.health.behaviors', 'label.health.behaviors.dsc', 'health-behavior-prevention-icon.svg', 'Health Status and Risk Factors', [
                        createDataSet('brfss', 'label.brfss.title', 'label.brfs.dsc'),
                        createDataSet('prams', 'label.prams.title', 'label.prams.dsc'),
                        createDataSet('mental_health', 'label.yrbs', 'label.yrbs.dsc')
                    ])
                ]
            }
        ];

        function createDataSource(title, description, icon, altText, datasets) {
            return {
                title: $filter('translate')(title),
                description: $filter('translate')(description),
                icon: $filter('translate')(icon),
                altText: altText,
                dataSets: datasets
            };
        }

        function createDataSet(key, title, description) {
            return {
                title: $filter('translate')(title),
                description: $filter('translate')(description),
                switchTo: function ()
                {
                    sc.changePrimaryFilter(key);
                }
            };
        }

        function showDataUseRestriction() {
            var deffered = $q.defer();
            ModalService.showModal({
                templateUrl: "app/partials/datauseRestrictions.html",
                controllerAs: 'dur',
                controller: function ($scope, close) {
                    var dur = this;
                    $rootScope.acceptDUR = false;
                    dur.close = close;
                    dur.accept = function () {
                        dur.close(true);
                    }
                }
            }).then(function (modal) {
                modal.element.show();
                modal.close.then(function (accept) {
                    if(accept === true){     
                        modal.element.hide();
                        $rootScope.acceptDUR = accept;
                        deffered.resolve(accept);
                    }else if (accept === false) {
                        modal.element.hide();
                        $rootScope.acceptDUR = accept;
                        deffered.reject();
                    }else {
                        // Call the showdataUsage again if the modal closes for any reason other than user accepting or cancelling
                        deffered.resolve(showDataUseRestriction());
                    }
                });
            });
            return deffered.promise;
        }

        $timeout(function(){
            leafletData.getMap('minimizedMap').then(function(map) {
                attachEventsForMap(map);
            });
        }, 1000);
    }
}());
