'use strict';

describe("Search controller: ", function () {
    var searchController, $scope, $controller, $httpBackend, $injector, $templateCache, $rootScope,
        searchResultsResponse, $searchFactory, $q, filters, shareUtilService, $compile;

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

            searchController= $controller('SearchController',{$scope:$scope});
            $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
            $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
            $httpBackend.whenGET('app/partials/home/home.html').respond( $templateCache.get('app/partials/home/home.html'));
            $httpBackend.whenPOST('/search').respond( $templateCache.get('app/partials/marker-template.html'));
            $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 11111}});
            $httpBackend.whenGET('/yrbsQuestionsTree/2015').respond({});
            $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
            $httpBackend.whenGET('app/modules/home/home.html').respond({});
            searchResultsResponse = __fixtures__['app/modules/search/fixtures/search.factory/searchResultsResponse'];
            $searchFactory = searchFactory;
            filters = $searchFactory.getAllFilters();
            shareUtilService = $injector.get('shareUtilService');
        });
    });

    it("Should execute showExpandedGraph",function() {
        var chartUtilService= {
            showExpandedGraph: function(){}
        };
        var searchController= $controller('SearchController',{$scope:$scope, chartUtilService:chartUtilService});
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

    it("downloadCSV should prepare mixedTable and call out to xlsService",inject(function(utilService, xlsService) {
        spyOn(utilService, 'prepareMixedTableData').and.returnValue({});
        spyOn(xlsService, 'exportCSVFromMixedTable');
        var searchController= $controller('SearchController',{$scope:$scope});
        searchController.filters = {selectedPrimaryFilter: {data: {}, value: []} };
        searchController.downloadCSV();

        expect(xlsService.exportCSVFromMixedTable).toHaveBeenCalled();
        expect(utilService.prepareMixedTableData).toHaveBeenCalled();
    }));

    it('downloadCSV should call out with the proper filename', inject(function(utilService, xlsService) {
        spyOn(utilService, 'prepareMixedTableData').and.returnValue({});
        spyOn(xlsService, 'exportCSVFromMixedTable');
        var searchController= $controller('SearchController',{$scope:$scope});
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
        var searchController= $controller('SearchController',{$scope:$scope});
        searchController.filters = {selectedPrimaryFilter: {data: {}} };
        searchController.downloadXLS();

        expect(xlsService.exportXLSFromMixedTable).toHaveBeenCalled();
        expect(utilService.prepareMixedTableData).toHaveBeenCalled();
    }));

    it('changeViewFilter should set the tableView and call out to search', function() {
        var searchController= $controller('SearchController',{$scope:$scope});
        spyOn(searchController, 'search');
        searchController.filters = {selectedPrimaryFilter: {data: {}, allFilters: [], sideFilters: []}};
        searchController.changeViewFilter({key: 'number_of_deaths'});

        expect(searchController.tableView).toEqual('number_of_deaths');
        expect(searchController.search).toHaveBeenCalled();
    });

    it('changeViewFilter should replace ethnicity queryKey and options for crude_death_rates', function() {
        var searchController= $controller('SearchController',{$scope:$scope});
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

    it('changeViewFilter should disable 2000, 2001, 2002 years for birth_rates', function() {
        var searchController= $controller('SearchController',{$scope:$scope});
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
        var searchController= $controller('SearchController',{$scope:$scope});
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

    it('filterUtilities for yrbs should perform proper functions', function() {
        var searchController= $controller('SearchController',{$scope:$scope});


        searchController.filterUtilities['mental_health'][0].options[0].onChange(true);

        expect(searchController.showConfidenceIntervals).toBeTruthy();

        searchController.filterUtilities['mental_health'][0].options[0].onChange(false);

        expect(searchController.showConfidenceIntervals).toBeFalsy();

        searchController.filterUtilities['mental_health'][0].options[1].onChange(true);

        expect(searchController.showUnweightedFrequency).toBeTruthy();

        searchController.filterUtilities['mental_health'][0].options[1].onChange(false);

        expect(searchController.showUnweightedFrequency).toBeFalsy();
    });

    it("search results by queryID", inject(function(searchFactory) {
         var searchController= $controller('SearchController',{$scope:$scope, searchFactory: searchFactory});
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

        var searchController= $controller('SearchController',{$scope:$scope, shareUtilService: shareUtilService});
        spyOn(shareUtilService, 'shareOnFb');
        searchController.showFbDialog('testIndex', 'Census race estimates', 'X$Tsdfdsf1324345');
        $scope.$apply();
    }));

    it('should generate hashcode for the default query if no queryID found', inject(function(searchFactory) {
        var stateParams = {
            queryID: '',
            primaryFilterKey: 'deaths'
        };

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

        var searchController= $controller('SearchController',
            {
                $scope:$scope,
                searchFactory: searchFactory,

            });
        spyOn(searchController, 'search');
        searchController.filters.selectedPrimaryFilter = searchController.filters.search[1]; //select YRBS
        searchController.switchToYRBSBasic();
        expect(searchController.filters.selectedPrimaryFilter.showBasicSearchSideMenu).toEqual(true);
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].filters.filterType).toEqual('radio');
        expect(searchController.search).toHaveBeenCalledWith(true);

    }));

    it('switch to YRBS advanced filter', inject(function(searchFactory) {

        var searchController= $controller('SearchController',
            {
                $scope:$scope,
                searchFactory: searchFactory,

            });
        spyOn(searchController, 'search');
        searchController.filters.selectedPrimaryFilter = searchController.filters.search[1]; //select YRBS
        searchController.switchToYRBSAdvanced();
        expect(searchController.filters.selectedPrimaryFilter.showBasicSearchSideMenu).toEqual(false);
        expect(searchController.filters.selectedPrimaryFilter.sideFilters[0].filters.filterType).toEqual('checkbox');
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
            "target":{"feature":{"properties":{}}},"_map":{}},
            "leafletObject":{"_map":{}}};
        var popupopenData = {"leafletEvent":{"popup":{"options":{"offset":123}}},"target":{}};
        $rootScope.$broadcast('leafletDirectiveGeoJson.mouseover', mouseoverData);
        $rootScope.$broadcast('leafletDirectiveMap.popupopen', popupopenData);
        $rootScope.$broadcast('leafletDirectiveMap.popupclose', {});
        $rootScope.$broadcast('leafletDirectiveGeoJson.mouseout', {});
        $rootScope.$broadcast('leafletDirectiveMap.mouseout', {});
        //$scope.$digest();
    }));
});
