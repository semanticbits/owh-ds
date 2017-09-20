'use strict';

describe("Search controller: ", function () {
    var searchController, $scope, $controller, $httpBackend, $injector, $templateCache, $rootScope,
        searchResultsResponse, $searchFactory, $q, filters, shareUtilService, $compile, pramsFilters;

    beforeEach(function() {
        module('owh');

        inject(function (_$controller_, _$rootScope_, _$injector_, _$templateCache_, _$q_, searchFactory) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $injector   = _$injector_;
            $scope= _$rootScope_.$new();
            $httpBackend = $injector.get('$httpBackend');
            $compile = $injector.get('$compile');
            $templateCache = _$templateCache_;
            $q = _$q_;

            searchController= $controller('SearchController',{$scope:$scope, $stateParams:{primaryFilterKey:'deaths'}});
            $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
            $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
            $httpBackend.whenGET('app/partials/home/home.html').respond( $templateCache.get('app/partials/home/home.html'));
            $httpBackend.whenPOST('/search').respond( $templateCache.get('app/partials/marker-template.html'));
            $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 11111}});
            $httpBackend.whenGET('/yrbsQuestionsTree').respond({});
            $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
            $httpBackend.whenGET('/brfsQuestionsTree').respond({data: { }});
            $httpBackend.whenGET('app/modules/home/home.html').respond({});
            $httpBackend.whenGET('jsons/conditions-ICD-10.json').respond({data: []});
            searchResultsResponse = __fixtures__['app/modules/search/fixtures/search.factory/searchResultsResponse'];
            pramsFilters = __fixtures__['app/modules/search/fixtures/search.controller/pramsFilters'];
            $searchFactory = searchFactory;
            filters = $searchFactory.getAllFilters();
            shareUtilService = $injector.get('shareUtilService');
            searchController.searchFactory = searchFactory;
            searchController.tableData = {};
        });
    });

    it("Should execute showExpandedGraph",function() {
        var chartUtilService= {
            showExpandedGraph: function(){}
        };
        searchController.chartUtilService = chartUtilService;
        searchController.showExpandedGraph([]);
    });

    //TODO: ignoring for now, but eventually we should re-write this test
    xit("With selectedPrimaryfilter as disease ",function(){

        var stateparams = { primaryFilterKey: "deaths", queryId: "", allFilters: null, selectedFilters: null };
        var primaryFilterChangedFn, searchResultThenFn;
        var allFilters = [
            /*Demographics*/
            {key: 'race', title: 'label.filter.race', queryKey:"race", primary: false, value: [], groupBy: 'row',
                type:"label.filter.group.demographics", showChart: true, defaultGroup:"column",
                autoCompleteOptions: []},
            {key: 'gender', title: 'label.filter.gender', queryKey:"sex", primary: false, value: [], groupBy: 'column',
                type:"label.filter.group.demographics", groupByDefault: 'column', showChart: true,
                autoCompleteOptions: [], defaultGroup:"column"},


            /*Year and Month*/
            {key: 'year', title: 'label.filter.year', queryKey:"current_year",primary: false, value: ['2014'],
                groupBy: false,type:"label.filter.group.year.month", defaultGroup:"row",autoCompleteOptions:[
                    { "key": "2014", "title": "2014" },
                    { "key": "2013", "title": "2013" },
                    { "key": "2012", "title": "2012" }
                ]}
        ];

        function searchResultFn() {
            return {then:function(func){
                searchResultThenFn = func;
            }}
        }
        var maps = {"states":[
            {"name":"NY","deaths":53107,"sex":[{"name":"Male","deaths":27003},{"name":"Female","deaths":26104}]},
            {"name":"MT","deaths":53060,"sex":[{"name":"Male","deaths":26800},{"name":"Female","deaths":26260}]},
            {"name":"WA","deaths":53057,"sex":[{"name":"Male","deaths":26955},{"name":"Female","deaths":26102}]}
        ]};


        //mock searchFactory object
        var searchFactory= {
            updateFilterValues: function(){

            },
            addCountsToAutoCompleteOptions: function(){
                return {then: function(func) {
                    primaryFilterChangedFn= func;
                }};
            },
            getAllFilters:function () {
                return {search:[{
                    key: 'deaths', title: 'label.filter.mortality', primary: true, value: [], header:"Mortality",
                    allFilters: allFilters, searchResults: searchResultFn, showMap:true, chartAxisLabel:'Deaths',
                    countLabel: 'Number of Deaths', mapData:{}, searchCount:30032, maps: maps,
                    sideFilters:[
                        {
                            filterGroup: false, collapse: false, allowGrouping: true,
                            filters: allFilters[0]
                        },
                        {
                            filterGroup: false, collapse: true, allowGrouping: true,
                            filters: allFilters[1]
                        }
                    ]
                },
                    {
                        key: 'mental_health',title: 'label.risk.behavior',primary: true,value: [],
                        header: "Youth risk behavior",allFilters: [],searchResults: searchResultFn,
                        dontShowInlineCharting: true,additionalHeaders: [], countLabel: 'Total',
                        sideFilters: [
                            {
                                filterGroup: false, collapse: false, allowGrouping: false, dontShowCounts: true,
                                filters: allFilters[2]
                            }
                        ]
                    }
                ]}
            },
            showPhaseTwoModal:function (text) {
                return text;
            }
        };

        var searchController= $controller('SearchController',{$scope: $scope, searchFactory:searchFactory, $stateParams:stateparams});
        expect(searchController.filters).toBeDefined();
        expect(searchController.selectedMapSize).toEqual("small");

        //change map size to big
        searchController.selectedMapSize = "big";

        //Call primaryFilterChanged
        // primaryFilterChangedFn();
        // primaryFilterChangedFn();

        // $rootScope.$digest();

        //Call SearchResultFn
        // searchResultThenFn();

        //show phase two graphs
        searchController.showPhaseTwoGraphs("show next graph modal");


        var dummyFeatureObj = {
            properties: {
                totalCount:53100
            }
        };
        //call map style method of map to get the legend colors
        var styleObj = searchController.filters.selectedPrimaryFilter.mapData.geojson.style(dummyFeatureObj);
        expect(styleObj.weight).toBe(2);
        expect(styleObj.color).toEqual("white");


        /*getSelectedYears */
        //getSelectedYears
        var selectedYear = searchController.getSelectedYears();
        expect(selectedYear.length).toEqual(1);

        //If selected year has no value
        searchController.filters.selectedPrimaryFilter.allFilters[2].value="";
        selectedYear = searchController.getSelectedYears();
        expect(selectedYear.length).toEqual(3);


        //yearFilter is empty
        searchController.filters.selectedPrimaryFilter.allFilters=[];
        searchController.getSelectedYears();
        /*getSelectedYears */


        ////Changes the key values from deaths to yrbs
        //// make an initial selection
        //$scope.$apply('sc.filters.selectedPrimaryFilter.key="deaths"');
        //
        //// make another one
        //$scope.$apply('sc.filters.selectedPrimaryFilter.key="mental_health"');



        //on event
        //var args = {leafletEvent:{leafEvent:{latlng:{lat:3434,lng:42234}, target:{feature: {properties:{}}}, _map:{}}}}
        //$rootScope.$broadcast('leafletDirectiveGeoJson.click',event, args);

        //Verify queryID has not empty value
        var queryIdForIntialCall = searchController.queryId;
        expect(queryIdForIntialCall).not.toEqual("");
        //Call search method with filter params
        stateparams.allFilters = searchController.filters;
        stateparams.selectedFilters = searchController.filters.selectedPrimaryFilter;
        var searchController= $controller('SearchController',{$scope: $scope, searchFactory:searchFactory, $stateParams:stateparams});
        expect(searchController.filters).toBeDefined();
        expect(queryIdForIntialCall).not.toEqual("");
        expect(searchController.queryId).not.toEqual(queryIdForIntialCall);
    });

    it("downloadCSV should prepare mixedTable and call out to csvService",inject(function(utilService, xlsService) {
        spyOn(utilService, 'prepareMixedTableData').and.returnValue({});
        spyOn(xlsService, 'exportCSVFromMixedTable');
        searchController.downloadCSV();

        expect(xlsService.exportCSVFromMixedTable).toHaveBeenCalled();
        expect(utilService.prepareMixedTableData).toHaveBeenCalled();
    }));

    it('downloadCSV should call out with the proper filename', inject(function(utilService, xlsService) {
        spyOn(utilService, 'prepareMixedTableData').and.returnValue({});
        spyOn(xlsService, 'exportCSVFromMixedTable');
        searchController.filters = {selectedPrimaryFilter: {data: {}, value: [], header: 'Mortality', allFilters: [
            {
                key: 'year',
                value: ['2014']
            }
        ]} };

        searchController.downloadCSV();

        expect(xlsService.exportCSVFromMixedTable.calls.argsFor(0)).toContain('Mortality_2014_Filtered');

        searchController.filters.selectedPrimaryFilter.allFilters = [{key: 'year', value: ['2013', '2014']}];
        searchController.downloadCSV();

        expect(xlsService.exportCSVFromMixedTable.calls.argsFor(1)).toContain('Mortality_2013-2014_Filtered');

        searchController.filters.selectedPrimaryFilter.allFilters = [{key: 'year', value: []}];
        searchController.downloadCSV();

        expect(xlsService.exportCSVFromMixedTable.calls.argsFor(2)).toContain('Mortality_All_Filtered');
    }));

    it('downloadXLS should prepare mixedTable and call out to xlsService', inject(function(utilService, xlsService) {
        spyOn(utilService, 'prepareMixedTableData').and.returnValue({});
        spyOn(xlsService, 'exportXLSFromMixedTable');
        searchController.filters = {selectedPrimaryFilter: {data: {}} };
        searchController.downloadXLS();

        expect(xlsService.exportXLSFromMixedTable).toHaveBeenCalled();
        expect(utilService.prepareMixedTableData).toHaveBeenCalled();
    }));

    it('changeViewFilter should set the tableView and call out to search when runOnFilterChange is true', function() {
        spyOn(searchController, 'search');
        searchController.filters = {selectedPrimaryFilter: {data: {}, allFilters: [], sideFilters: [], runOnFilterChange:true}};
        searchController.changeViewFilter({key: 'number_of_deaths'});

        expect(searchController.tableView).toEqual('number_of_deaths');
        expect(searchController.search).toHaveBeenCalled();
    });

    it('changeViewFilter should set the tableView and does npt call search when runOnFilterChange is false', function() {
        spyOn(searchController, 'search');
        searchController.filters = {selectedPrimaryFilter: {data: {}, allFilters: [], sideFilters: [], runOnFilterChange:false}};
        searchController.changeViewFilter({key: 'number_of_deaths'});

        expect(searchController.tableView).toEqual('number_of_deaths');
        expect(searchController.search).not.toHaveBeenCalled();
    });

    it('changeViewFilter should replace ethnicity queryKey and options for crude_death_rates', function() {
        spyOn(searchController, 'search');

        var ethnicityFilter = {
            query_key: 'hispanic_origin',
            key: 'hispanicOrigin'
        };

        searchController.filters = {selectedPrimaryFilter: {data: {}, allFilters: [ethnicityFilter], sideFilters: [{filters: ethnicityFilter}]}};
        searchController.filters.ethnicityGroupOptions = [
            {"key": 'hispanic', "title": 'Hispanic'},
            {"key": 'non', "title": "Non-Hispanic"}
        ];
        searchController.filters.hispanicOptions = [
            {
                key: 'Cuban'
            },
            {
                key: 'Dominican'
            }
        ];

        searchController.changeViewFilter({key: 'crude_death_rates'});

        expect(searchController.tableView).toEqual('crude_death_rates');
        expect(searchController.filters.selectedPrimaryFilter.allFilters[0].queryKey).toEqual('ethnicity_group');
        expect(searchController.filters.selectedPrimaryFilter.allFilters[0].autoCompleteOptions[0].key).toEqual('hispanic');
        expect(searchController.filters.selectedPrimaryFilter.allFilters[0].autoCompleteOptions[1].key).toEqual('non');

        searchController.changeViewFilter({key: 'number_of_deaths'});

        expect(searchController.filters.selectedPrimaryFilter.allFilters[0].queryKey).toEqual('hispanic_origin');
        expect(searchController.filters.selectedPrimaryFilter.allFilters[0].autoCompleteOptions[0].key).toEqual('Cuban');
        expect(searchController.filters.selectedPrimaryFilter.allFilters[0].autoCompleteOptions[1].key).toEqual('Dominican');
    });

    it('changeViewFilter should disable ucd mcd grouping for crude_death_rates and age adjusted rate', function() {
        spyOn(searchController, 'search');
        var ucdfilter = {
            query_key: 'ucd-chapter-10',
            key: 'ucd-chapter-10'
        };
        var mcdfilter = {
            query_key: 'mcd-chapter-10',
            key: 'mcd-chapter-10'
        };

        searchController.filters = {selectedPrimaryFilter: {data: {}, allFilters: [ucdfilter, mcdfilter], sideFilters: [{sideFilters:[{allowGrouping: true,filters: ucdfilter},{allowGrouping: true,filters: mcdfilter}]}]}};

        searchController.changeViewFilter({key: 'crude_death_rates'});
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].sideFilters[0].allowGrouping).toEqual(false);
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].sideFilters[1].allowGrouping).toEqual(false);

        searchController.changeViewFilter({key: 'number_of_deaths'});
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].sideFilters[0].allowGrouping).toEqual(true);
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].sideFilters[1].allowGrouping).toEqual(true);

        searchController.changeViewFilter({key: 'age-adjusted_death_rates'});
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].sideFilters[0].allowGrouping).toEqual(false);
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].sideFilters[1].allowGrouping).toEqual(false);
    });

    it('should reset topic filter on changeViewFilter for prams class', function() {
        var utilService = $injector.get('utilService');
        var pramsFilters  =filters.search[4];

        var topicFilter = utilService.findByKeyAndValue(pramsFilters.allFilters, 'key', 'topic');
        topicFilter.value = ['cat_45'];
        searchController.filters = {selectedPrimaryFilter: pramsFilters};
        searchController.changeViewFilter(pramsFilters);
        expect(topicFilter.value).toEqual([]);
    });

    it('should reset question filter on changeViewFilter for prams class', function() {
        var utilService = $injector.get('utilService');
        var pramsFilters  =filters.search[4];

        var questionFilter = utilService.findByKeyAndValue(pramsFilters.allFilters, 'key', 'question');
        questionFilter.value = ['"qn144"'];
        searchController.filters = {selectedPrimaryFilter: pramsFilters};
        searchController.changeViewFilter(pramsFilters);
        expect(questionFilter.value).toEqual([]);
    });

    it('changeViewFilter should disable 2000, 2001, 2002 years for birth_rates', function() {
        spyOn(searchController, 'search');
        var filterUtils = $injector.get('filterUtils');
        var utilService = $injector.get('utilService');
        var yearFilters = utilService.findByKeyAndValue(filterUtils.getNatalityDataFilters(), 'key', 'current_year')

        searchController.filters = {selectedPrimaryFilter: {birthAndFertilityRatesDisabledYears: ['2000', '2001', '2002'], tableView:'birth_rates', data: {}, allFilters: [yearFilters], sideFilters: []}};
        searchController.changeViewFilter({key: 'birth_rates'});

        var selectedYears = utilService.findByKeyAndValue(searchController.filters.selectedPrimaryFilter.allFilters,'key', 'current_year');

        angular.forEach(selectedYears.autoCompleteOptions, function(eachObject){
            if(eachObject.key == '2000' || eachObject.key == '2001' || eachObject.key == '2002') {
                expect(eachObject.disabled).toEqual(true);
            }
            else {
                expect(eachObject.disabled).toEqual(false);
            }
        });
    });

    it('changeViewFilter should disable 2000, 2001, 2002 years for fertility rates', function() {

        spyOn(searchController, 'search');
        var filterUtils = $injector.get('filterUtils');
        var utilService = $injector.get('utilService');
        var yearFilters = utilService.findByKeyAndValue(filterUtils.getNatalityDataFilters(), 'key', 'current_year')

        searchController.filters = {selectedPrimaryFilter: {birthAndFertilityRatesDisabledYears: ['2000', '2001', '2002'], tableView:'birth_rates', data: {}, allFilters: [yearFilters], sideFilters: []}};
        searchController.changeViewFilter({key: 'fertility_rates'});

        var selectedYears = utilService.findByKeyAndValue(searchController.filters.selectedPrimaryFilter.allFilters,'key', 'current_year');

        angular.forEach(selectedYears.autoCompleteOptions, function(eachObject){
            if(eachObject.key == '2000' || eachObject.key == '2001' || eachObject.key == '2002') {
                expect(eachObject.disabled).toEqual(true);
            }
            else {
                expect(eachObject.disabled).toEqual(false);
            }
        });
    });

    it('changeViewFilter method call with one year age filters for fertility rates view', function() {
        spyOn(searchController, 'search');
        var filterUtils = $injector.get('filterUtils');
        var utilService = $injector.get('utilService');
        var oneyearAgeFilter = utilService.findByKeyAndValue(filterUtils.getNatalityDataFilters(), 'key', 'mother_age_1year_interval')
        oneyearAgeFilter.value = ["Under 15 years", "15 years", "44 years", "45 years"];
        searchController.filters = {selectedPrimaryFilter: {tableView:'fertility_rates', data: {}, allFilters: [oneyearAgeFilter], sideFilters: []}};
        searchController.changeViewFilter({key: 'fertility_rates'});
        expect(oneyearAgeFilter.value.length).toEqual(2);
        expect(oneyearAgeFilter.value[0]).toEqual("15 years");
        expect(oneyearAgeFilter.value[1]).toEqual("44 years");
    });

    it('changeViewFilter method call with five year age filters for fertility rates view', function() {
        spyOn(searchController, 'search');
        var filterUtils = $injector.get('filterUtils');
        var utilService = $injector.get('utilService');
        var fiveyearAgeFilter = utilService.findByKeyAndValue(filterUtils.getNatalityDataFilters(), 'key', 'mother_age_5year_interval')
        fiveyearAgeFilter.value = ["Under 15 years", "20-24 years", "45-49 years"];
        searchController.filters = {selectedPrimaryFilter: {tableView:'fertility_rates', data: {}, allFilters: [fiveyearAgeFilter], sideFilters: []}};
        searchController.changeViewFilter({key: 'fertility_rates'});
        expect(fiveyearAgeFilter.value.length).toEqual(1);
        expect(fiveyearAgeFilter.value[0]).toEqual("20-24 years");
    });

    it('filterUtilities for yrbs should perform proper functions', function() {
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
        searchController.filterUtilities = {
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
                        confidenceIntervalOption
                    ]
                }
            ]
        };
        var option1 = searchController.filterUtilities['mental_health'][0].options[0];
        var option2 = searchController.filterUtilities['mental_health'][0].options[1];

        option1.onChange(true, option1);
        expect(option1.value).toBeTruthy();
        option1.onChange(false, option1);
        expect(option1.value).toBeFalsy();
        option2.onChange(true, option2);
        expect(option2.value).toBeTruthy();
        option2.onChange(false, option2);
        expect(option2.value).toBeFalsy();
    });

    it("search results by queryID", inject(function(searchFactory) {
         var utilService = $injector.get('utilService');
         var deferred = $q.defer();
         searchController.filters = filters;
         filters.selectedPrimaryFilter = filters.search[0];
         filters.primaryFilters = utilService.findAllByKeyAndValue(searchController.filters.search, 'primary', true);
         spyOn(searchFactory, 'getQueryResults').and.returnValue(deferred.promise);
         searchController.getQueryResults("ae38fb09ec8b6020a9478edc62a271ca");
         expect(searchController.tableView).toEqual(searchResultsResponse.data.queryJSON.tableView);
         expect(searchController.filters.selectedPrimaryFilter.headers).toEqual(searchResultsResponse.data.resultData.headers);
         expect(searchResultsResponse.data.queryJSON.key).toEqual('deaths');
         deferred.resolve(searchResultsResponse);
    }));

    it('should share image to fb', inject(function () {
        searchController.shareUtilService = shareUtilService;
        spyOn(shareUtilService, 'shareOnFb');
        searchController.showFbDialog('testIndex', 'Census race estimates', 'X$Tsdfdsf1324345');
        $scope.$apply();
    }));

    it('should generate hashcode for the default query if no queryID found', inject(function(searchFactory) {
        var stateParams = {
            queryID: '',
            primaryFilterKey: 'deaths'
        };

        $rootScope.acceptDUR = true;
        spyOn(searchFactory, "generateHashCode").and.returnValue({
            then: function(){}
        });
        var searchController= $controller('SearchController',
            {
                $scope:$scope,
                searchFactory: searchFactory,
                $stateParams: stateParams
            });

        expect(searchFactory.generateHashCode).toHaveBeenCalled();
    }));

    it('switch to YRBS Basic filter', inject(function(searchFactory) {
        spyOn(searchController, 'search');
        searchController.filters.selectedPrimaryFilter = searchController.filters.search[1]; //select YRBS
        searchController.switchToBasicSearch('mental_health');
        expect(searchController.filters.selectedPrimaryFilter.showBasicSearchSideMenu).toEqual(true);
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].sideFilters[0].filters.filterType).toEqual('radio');
        expect(searchController.search).toHaveBeenCalledWith(true);

    }));

    it('switch to YRBS advanced filter', inject(function() {
        spyOn(searchController, 'search');
        searchController.filters.selectedPrimaryFilter = searchController.filters.search[1]; //select YRBS
        searchController.switchToAdvancedSearch('mental_health');
        expect(searchController.filters.selectedPrimaryFilter.showBasicSearchSideMenu).toEqual(false);
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].sideFilters[0].filters.filterType).toEqual('checkbox');
        expect(searchController.search).toHaveBeenCalledWith(true);

    }));

    it('switch to brfss basic filter', inject(function() {
        spyOn(searchController, 'search');
        searchController.filters.selectedPrimaryFilter = searchController.filters.search[11]; //select YRBS
        searchController.switchToBasicSearch('brfss');
        expect(searchController.filters.selectedPrimaryFilter.showBasicSearchSideMenu).toEqual(true);
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].sideFilters[0].filters.filterType).toEqual('checkbox');
        expect(searchController.search).toHaveBeenCalledWith(true);
    }));

    it('switch to brfss advanced filter', inject(function() {
        spyOn(searchController, 'search');
        searchController.filters.selectedPrimaryFilter = searchController.filters.search[11]; //select YRBS
        searchController.switchToAdvancedSearch('brfss');
        expect(searchController.filters.selectedPrimaryFilter.showBasicSearchSideMenu).toEqual(false);
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].sideFilters[0].filters.filterType).toEqual('checkbox');
        expect(searchController.search).toHaveBeenCalledWith(true);

    }));

    it("test all leaflet events", inject(function () {
        var mapService = $injector.get('mapService');
        var filters = {selectedPrimaryFilter:{key:"bridge_race"}};
        searchController.mapService = mapService;
        searchController.filters = filters;
        searchController.currentFeature = {};
        searchController.mapPopup = {
            _close: function () {},
            setContent: function () {return {setLatLng: function () {return {openOn:function () {}}}}}
        };

        var mouseoverData = {"leafletEvent":{"containerPoint":{x:90,y:88},"latlng":{"lat":3434,"lng":42234},
            "target":{"_leaflet_id":123, "feature":{"properties":{}}},
            "_map":{_layers:{"123":{setStyle:function () {}}}}},
            "leafletObject":{"_map":{_layers:{"123":{setStyle:function () {}}}}}};

        var popupopenData = {"leafletEvent":{"popup":{"options":{"offset":123}}},"target":{}};
        $rootScope.$broadcast('leafletDirectiveGeoJson.mouseover', mouseoverData);
        $rootScope.$broadcast('leafletDirectiveMap.popupopen', popupopenData);
        $rootScope.$broadcast('leafletDirectiveMap.popupclose', {});

        var mouseoutData = {"layer":{"_leaflet_id":123},"target":{"_leaflet_id":123,"feature":{"properties":{}},
            "_map":{"_layers":{"123":{"setStyle":function () {}}}}}};
        $rootScope.$broadcast('leafletDirectiveGeoJson.mouseout', mouseoutData);

        mouseoutData = {"leafletEvent":{"containerPoint":{"x":90,"y":88},"latlng":{"lat":3434,"lng":42234},
            "target":{"_leaflet_id":123,"feature":{"properties":{}},
                "_map":{"_layers":{"123":{"setStyle":function () {}}}}}},"leafletObject":{"_map":{"_layers":{"123":{"setStyle":function () {}}}}}};
        $rootScope.$broadcast('leafletDirectiveGeoJson.mouseout', mouseoutData);
        $rootScope.$broadcast('leafletDirectiveMap.mouseout', {});

        var maploadData = {"leafletObject":{addControl:function() {}}};
        $rootScope.$broadcast('leafletDirectiveMap.load', maploadData);

        //$scope.$digest();
    }));

    it("should update prams questions based on change in prams class", inject(function () {
        var topicFilter = pramsFilters.sideFilters[0].sideFilters[0];

        searchController.filters = {selectedPrimaryFilter: pramsFilters};

        $rootScope.pramsQuestions = [
            {
                "id": "cat_45",
                "text": "Delivery - Method",
                "children": [
                    {
                        "text": "Indicator of whether personal income paid for delivery",
                        "id": "qn318"
                    }
                ]
            },
            {
                "id": "cat_39",
                "text": "Delivery - Payment",
                "children": [
                    {
                        "text": "Indicator of no insurance to pay for delivery",
                        "id": "qn365"
                    },
                    {
                        "text": "Indicator of whether delivery was paid for by insurance purchased directly",
                        "id": "qn366"
                    },
                    {
                        "text": "Indicator of whether delivery was paid for by insurance through an employer",
                        "id": "qn367"
                    },
                    {
                        "text": "Indicator of whether delivery was paid for by insurance through the military",
                        "id": "qn364"
                    },
                    {
                        "text": "Indicator of whether other sources paid for delivery",
                        "id": "qn319"
                    }
                ]
            }
        ];
        searchController.search(true);
        //should collect questions from all topics of a class
        expect(topicFilter.filters.questions).toEqual([ 'qn318', 'qn365', 'qn366', 'qn367', 'qn364', 'qn319' ]);
    }));

    it("should update questions based on change in prams topic", inject(function () {
        //select a topic
        var topicFilter = pramsFilters.sideFilters[0].sideFilters[0];
            topicFilter.filters.value = ["cat_39"];

        searchController.filters = {selectedPrimaryFilter: pramsFilters};

        var deferred = $q.defer();

        $rootScope.pramsQuestions = [
            {
                "id": "cat_45",
                "text": "Delivery - Method",
                "children": [
                    {
                        "text": "Indicator of whether personal income paid for delivery",
                        "id": "qn318"
                    }
                ]
            },
            {
                "id": "cat_39",
                "text": "Delivery - Payment",
                "children": [
                    {
                        "text": "Indicator of no insurance to pay for delivery",
                        "id": "qn365"
                    },
                    {
                        "text": "Indicator of whether delivery was paid for by insurance purchased directly",
                        "id": "qn366"
                    },
                    {
                        "text": "Indicator of whether delivery was paid for by insurance through an employer",
                        "id": "qn367"
                    },
                    {
                        "text": "Indicator of whether delivery was paid for by insurance through the military",
                        "id": "qn364"
                    },
                    {
                        "text": "Indicator of whether other sources paid for delivery",
                        "id": "qn319"
                    }
                ]
            }
        ];
        searchController.search(true);
        //should collect questions from selected topic of a class only
        expect(topicFilter.filters.questions).toEqual([ 'qn365', 'qn366', 'qn367', 'qn364', 'qn319' ]);
        //reset topic filter
        topicFilter.filters.value = [];
    }));

    it("should listen for pramsQuestionsLoaded event", inject(function () {

        $rootScope.pramsQuestionsList = [
            {
                "text": "Indicator of whether personal income paid for delivery",
                "id": "qn318"
            },
            {
                "text": "Indicator of no insurance to pay for delivery",
                "id": "qn365"
            }
        ];
        searchController.filters = {pramsFilters: [{},{},{},{},{"key": "question", autoCompleteOptions:[]}]};

        $rootScope.$broadcast('pramsQuestionsLoaded', $rootScope.pramsQuestionsList);
        //should collect questions from selected topic of a class only
        expect(JSON.stringify(searchController.filters.pramsFilters[4].autoCompleteOptions)).toEqual(JSON.stringify($rootScope.pramsQuestionsList));
    }));

    it("should listen for brfsQuestionsLoaded event", inject(function () {

        $rootScope.brfsQuestionsList = [
            {
                "text": "Ever told you that you have a form of depression?",
                "id": "ADDEPEV2"
            },
            {
                "text": "What is your age?",
                "id": "AGE"
            }
        ];
        searchController.filters =  {
            brfsBasicFilters: [{"key": "question", autoCompleteOptions:[]}],
            brfsAdvancedFilters: [{"key": "question", autoCompleteOptions:[]}]
        };

        $rootScope.$broadcast('brfsQuestionsLoaded', $rootScope.brfsQuestionsList);
        //should collect questions from selected topic of a class only
        expect(JSON.stringify(searchController.filters.brfsBasicFilters[0].autoCompleteOptions)).toEqual(JSON.stringify($rootScope.brfsQuestionsList));
        expect(JSON.stringify(searchController.filters.brfsAdvancedFilters[0].autoCompleteOptions)).toEqual(JSON.stringify($rootScope.brfsQuestionsList));
    }));

    it("should listen for yrbsQuestionsLoadded event", inject(function () {

        $rootScope.questionsList = [
            {
                "text": "Indicator of whether personal income paid for delivery",
                "id": "qn318"
            },
            {
                "text": "Indicator of no insurance to pay for delivery",
                "id": "qn365"
            }
        ];

        searchController.filters = {
            yrbsBasicFilters: [{},{},{},{},{"key": "question", autoCompleteOptions:[]}],
            yrbsAdvancedFilters: [{},{},{},{},{"key": "question", autoCompleteOptions:[]}]
        };

        $rootScope.$broadcast('yrbsQuestionsLoadded', $rootScope.pramsQuestionsList);
        expect(JSON.stringify(searchController.filters.yrbsBasicFilters[4].autoCompleteOptions)).toEqual(JSON.stringify($rootScope.questionsList));
        expect(JSON.stringify(searchController.filters.yrbsAdvancedFilters[4].autoCompleteOptions)).toEqual(JSON.stringify($rootScope.questionsList));
    }));

    it("On chart view change for std", inject(function(searchFactory) {
        var deferred = $q.defer();

        var utilService = $injector.get('utilService');
        searchController.filters = filters;
        filters.selectedPrimaryFilter = filters.search[6];
        filters.primaryFilters = utilService.findAllByKeyAndValue(searchController.filters.search, 'primary', true);
        spyOn(searchFactory, 'prepareChartData').and.returnValue(deferred.promise);
        searchController.onChartViewChange('disease_rate');
        expect(searchController.filters.selectedPrimaryFilter.chartAxisLabel).toEqual('Rates');
        expect(searchController.filters.selectedPrimaryFilter.chartView).toEqual('disease_rate');
        searchController.onChartViewChange('cases');
        expect(searchController.filters.selectedPrimaryFilter.chartAxisLabel).toEqual('Cases');
        expect(searchController.filters.selectedPrimaryFilter.chartView).toEqual('cases');
    }));

    it("dataSourceCategories in instialized correctly", inject(function() {
        var categories = searchController.dataSourceCategories;
        expect(categories).not.toBeNull();
        expect(categories.length).toEqual(3);

        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];

            expect(category).not.toBeNull();
            expect(category.dataSources.length).toBeGreaterThan(0);

            for (var j = 0; j < category.dataSources.length; j++) {
                var datasource = category.dataSources[j];

                expect(datasource.title).not.toBeNull();
                expect(datasource.description).not.toBeNull();
                expect(datasource.icon).not.toBeNull();
                expect(datasource.altText).not.toBeNull();
                expect(datasource.dataSets).not.toBeNull();
                expect(datasource.dataSets.length).toBeGreaterThan(0);

                for (var k = 0; k < datasource.dataSets.length; k++) {
                    var dataSet = datasource.dataSets[k];

                    expect(dataSet.title).not.toBeNull();
                    expect(dataSet.description).not.toBeNull();
                    expect(typeof dataSet.switchTo).toEqual('function');
                }
            }
        }
    }));
});
