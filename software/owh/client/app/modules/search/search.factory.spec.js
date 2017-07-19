'use strict';

/*group of common test goes here as describe*/
describe('search factory ', function(){
    var searchFactory, utils, $rootScope, $scope, controllerProvider, searchService, deferred, $q,
        primaryFilter, $httpBackend, $templateCache, filters, countsMortalityAutoCompletes,
        searchResponse, searchResponseForAgeGroup, groupGenderResponse, genderGroupHeaders, fourGroupsResponse,
        ModalService, givenModalDefaults, elementVisible, thenFunction, closeDeferred, $timeout, filterUtils, questionsTreeJson;
    module.sharedInjector();

    beforeAll(module('owh'));

    beforeAll(module('app/partials/expandedGraphModal.html'));

    beforeAll(inject(function ($injector, _$rootScope_, $controller, _$q_, _$templateCache_, _SearchService_, _ModalService_, _$timeout_, _filterUtils_) {
        controllerProvider = $controller;
        $rootScope  = _$rootScope_;
        $scope = $rootScope.$new();
        $templateCache = _$templateCache_;
        searchFactory = $injector.get('searchFactory');
        utils = $injector.get('utilService');
        $httpBackend = $injector.get('$httpBackend');
        searchService = _SearchService_;
        ModalService = _ModalService_;
        filterUtils = _filterUtils_
        $timeout = _$timeout_;

        $q = _$q_;
        closeDeferred = _$q_.defer();

        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');
        //$templateCache.put('app/partials/expandedGraphModal.html', 'app/partials/expandedGraphModal.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 1111111111111111}});
        questionsTreeJson = __fixtures__['app/modules/search/fixtures/search.factory/questionsTree'];
        $httpBackend.whenGET('/yrbsQuestionsTree').respond(questionsTreeJson);
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('jsons/conditions-ICD-10.json').respond({data: []});
        $httpBackend.whenGET('/brfsQuestionsTree').respond({data: { }});
        $rootScope.questionsList = questionsTreeJson.questionsList;
        filters = searchFactory.getAllFilters();
        filters.primaryFilters = utils.findAllByKeyAndValue(filters.search, 'primary', true);

        countsMortalityAutoCompletes = __fixtures__['app/modules/search/fixtures/search.factory/countsMortalityAutoCompletes'];

        searchResponse = __fixtures__['app/modules/search/fixtures/search.factory/searchResponse'];
        searchResponseForAgeGroup = __fixtures__['app/modules/search/fixtures/search.factory/searchResponseForAgeGroup'];
        groupGenderResponse = __fixtures__['app/modules/search/fixtures/search.factory/groupGenderResponse'];
        fourGroupsResponse = __fixtures__['app/modules/search/fixtures/search.factory/fourGroupsResponse'];

        genderGroupHeaders = __fixtures__['app/modules/search/fixtures/search.factory/genderGroupHeaders'];
        spyOn(ModalService, 'showModal').and.callFake(function(modalDefaults){
            givenModalDefaults = modalDefaults;
            givenModalDefaults.element = {
                show: function(){
                    elementVisible = true
                },
                hide: function(){
                    elementVisible = false
                }
            };
            return {
                then: function(func) {
                    thenFunction = func;
                }
            };
        });
    }));

    it('showPhaseTwoModal', function () {
        searchFactory.showPhaseTwoModal('Sample message');
        var ctrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise});
        expect(ctrl.message).toEqual('Sample message');
        ctrl.element = givenModalDefaults.element;
        thenFunction(ctrl);
        expect(elementVisible).toBeTruthy();
        closeDeferred.resolve({});
        $scope.$apply();
        expect(elementVisible).toBeFalsy();
    });

    it('sortAutoCompleteOptions should sort autocomplete options based on given sort array', function(){
        var sort = {
            'race': ['1', '2'],
            'gender': ['M', 'F']
        };

        var raceFilter = {
            key: 'race',
            autoCompleteOptions: [{key: '2'}, {key: '1'}]
        };

        var genderFilter = {
            key: 'gender',
            autoCompleteOptions: [{key: 'F'}, {key: 'M'}]
        };

        searchFactory.sortAutoCompleteOptions(raceFilter, sort);
        searchFactory.sortAutoCompleteOptions(genderFilter, sort);

        expect(raceFilter.autoCompleteOptions[0].key).toEqual('1');
        expect(genderFilter.autoCompleteOptions[0].key).toEqual('M');
    });

    it('sortAutoCompleteOptions should sort pre-grouped autocomplete options based on given sort array', function(){
        var sort = {
            "hispanicOrigin": [
                {
                    "options": ['Central and South American', 'Central American', 'Cuban', 'Dominican', 'Latin American', 'Mexican', 'Puerto Rican', 'South American', 'Spaniard', 'Other Hispanic'],
                    "title": "Hispanic",
                    "key": "Hispanic"
                },
                'Non-Hispanic',
                'Unknown'
            ],
            "year": ['2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000']
        };

        var ethnicityFilter = {
            key: 'hispanicOrigin',
            autoCompleteOptions: [
                {key: 'Unknown'},
                {key: 'Non-Hispanic'},
                {
                    key: 'Hispanic',
                    options: [
                        {key: 'Cuban'},
                        {key: 'Dominican'}
                    ]
                }
            ]
        };

        var raceFilter = {
            key: 'race',
            autoCompleteOptions: [
                {key: 'White'},
                {key: 'Black'}
            ]
        };

        searchFactory.sortAutoCompleteOptions(ethnicityFilter, sort);

        expect(ethnicityFilter.autoCompleteOptions[0].key).toEqual('Cuban');
        expect(ethnicityFilter.autoCompleteOptions[2].key).toEqual('Non-Hispanic');

        searchFactory.sortAutoCompleteOptions(raceFilter, sort);

        expect(raceFilter.autoCompleteOptions[0].key).toEqual('White');
    });

    it('groupAutoCompleteOptions should properly group options based on given grouping array', function() {
        var group = {
            "hispanicOrigin": [
                'Non-Hispanic',
                {
                    "options": ['Central and South American', 'Central American', 'Cuban', 'Dominican', 'Latin American', 'Mexican', 'Puerto Rican', 'South American', 'Spaniard', 'Other Hispanic'],
                    "title": "Hispanic",
                    "key": "Hispanic"
                },
                'Unknown'
            ]
        };

        var ethnicityFilter = {
            key: 'hispanicOrigin',
            autoCompleteOptions: [{key: 'Unknown'}, {key: 'Non-Hispanic'}, {key: 'Dominican'}, {key: 'Other Hispanic'}, {key: 'Cuban'}, {key: 'Mexican'}]
        };

        var genderFilter = {
            key: 'gender',
            autoCompleteOptions: [{key: 'F'}, {key: 'M'}]
        };

        searchFactory.groupAutoCompleteOptions(ethnicityFilter, group);
        expect(ethnicityFilter.autoCompleteOptions.length).toEqual(3);

        expect(ethnicityFilter.autoCompleteOptions[1].options[3].key).toEqual('Other Hispanic');

        searchFactory.groupAutoCompleteOptions(genderFilter, group);
        expect(genderFilter.autoCompleteOptions.length).toEqual(2);
    });

    it('groupAutoCompleteOptions should properly group pre-grouped options based on given grouping array', function() {
        var group = {
            "hispanicOrigin": [
                {
                    "options": ['Central and South American', 'Central American', 'Cuban', 'Dominican', 'Latin American', 'Mexican', 'Puerto Rican', 'South American', 'Spaniard', 'Other Hispanic'],
                    "title": "Hispanic",
                    "key": "Hispanic"
                },
                'Non-Hispanic',
                'Unknown'
            ]
        };

        var ethnicityFilter = {
            key: 'hispanicOrigin',
            autoCompleteOptions: [
                {key: 'Unknown'},
                {key: 'Non-Hispanic'},
                {
                    key: 'Hispanic',
                    options: [
                        {key: 'Cuban'},
                        {key: 'Dominican'}
                    ]
                }
            ]
        };

        searchFactory.groupAutoCompleteOptions(ethnicityFilter, group);
        expect(ethnicityFilter.autoCompleteOptions.length).toEqual(3);
    });

    it('removeDisabledFilters should remove values and groupBy for filters not available', function() {
        var allFilters = [
            {
                key: 'year',
                value: ['2014', '2013'],
                groupBy: 'row'
            },
            {
                key: 'agegroup',
                value: ['10', '25'],
                groupBy: 'column'
            }
        ];

        var sideFilters = [
            {
                filters: {
                    key: 'year',
                    value: ['2014', '2013'],
                    groupBy: 'row'
                }
            },
            {
                filters: {
                    key: 'agegroup',
                    value: ['10', '25'],
                    groupBy: 'column'
                }
            }
        ];

        var availableFilters = {
            'crude_death_rates': ['year', 'gender', 'race'],
            'age-adjusted_death_rates': ['year', 'gender', 'race']
        };

        var selectedFilter = {allFilters: allFilters, sideFilters: [{sideFilters: sideFilters}]};

        searchFactory.removeDisabledFilters(selectedFilter, 'age-adjusted_death_rates', availableFilters);

        expect(selectedFilter.allFilters[0].value.length).toEqual(2);
        expect(selectedFilter.allFilters[0].groupBy).toEqual('row');
        expect(selectedFilter.allFilters[1].value.length).toEqual(0);
        expect(selectedFilter.allFilters[1].groupBy).toEqual(false);

        expect(selectedFilter.sideFilters[0].sideFilters[0].filters.value.length).toEqual(2);
        expect(selectedFilter.sideFilters[0].sideFilters[0].filters.groupBy).toEqual('row');
        expect(selectedFilter.sideFilters[0].sideFilters[1].filters.value.length).toEqual(0);
        expect(selectedFilter.sideFilters[0].sideFilters[1].filters.groupBy).toEqual(false);
    });

    it('generateHashCode should call out to search service with a normalized hashQuery', function() {
        spyOn(searchService, "generateHashCode").and.callFake(function() {
            return {
                then: function(){

                }
            };
        });

        var primaryFilter = {
            key: 'deaths',
            tableView: 'number_of_deaths',
            sideFilters: [
                {
                    sideFilters: [
                        {
                            filters: {
                                key: 'race',
                                groupBy: false,
                                value: ['White', 'Black']
                            }
                        },
                        {
                            filters: {
                                key: 'gender',
                                groupBy: 'row',
                                value: ['Male']
                            }
                        }
                    ]
                }

            ]
        }

        searchFactory.generateHashCode(primaryFilter);

        expect(searchService.generateHashCode).toHaveBeenCalled();

        expect(searchService.generateHashCode.calls.argsFor(0)[0].primaryKey).toEqual('deaths');
        expect(searchService.generateHashCode.calls.argsFor(0)[0].tableView).toEqual('number_of_deaths');

        expect(searchService.generateHashCode.calls.argsFor(0)[0].filters[0].key).toEqual('race');
        expect(searchService.generateHashCode.calls.argsFor(0)[0].filters[0].groupBy).toEqual(false);
        expect(searchService.generateHashCode.calls.argsFor(0)[0].filters[0].value).toEqual(['Black', 'White']);

        expect(searchService.generateHashCode.calls.argsFor(0)[0].filters[1].key).toEqual('gender');
        expect(searchService.generateHashCode.calls.argsFor(0)[0].filters[1].groupBy).toEqual('row');
        expect(searchService.generateHashCode.calls.argsFor(0)[0].filters[1].value).toEqual(['Male']);

    });

    describe('TB search ->', function() {
        var response;
        beforeAll(function() {
            //get the filters
            primaryFilter = filters.search[7];
            filters.selectedPrimaryFilter = primaryFilter;
            //prepare mock response
            response = __fixtures__['app/modules/search/fixtures/search.factory/tbDefaultSearchResponse'];
        });

        it('searchTBResults for TB', function(){
            var deferredResults = $q.defer();

            spyOn(searchService, 'searchResults').and.returnValue(deferredResults.promise);

            primaryFilter.searchResults(primaryFilter, '35343dsfvvcxvsd').then(function(result) {
                expect(JSON.stringify(result.data.resultData.nested.table)).toEqual(JSON.stringify(response.data.resultData.nested.table));
                expect(JSON.stringify(result.data.resultData.nested.charts)).toEqual(JSON.stringify(response.data.resultData.nested.charts));
            });

            deferredResults.resolve(response);
            $scope.$apply()
        });

    });

    describe('STD search ->', function() {
        var stdSearchResponse;
        beforeAll(function() {
            stdSearchResponse = __fixtures__['app/modules/search/fixtures/search.factory/stdSearchResponse'];
        });
        beforeEach(function() {
            deferred = $q.defer();
        });
        it('updateFiltersAndData for std response', function(){
            var stdFilters = {primaryFilters: [filters.search[6]]};
            var result = searchFactory.updateFiltersAndData(stdFilters, stdSearchResponse, {'std': {}}, {});
            expect(JSON.stringify(result.primaryFilter.data)).toEqual(JSON.stringify(stdSearchResponse.data.resultData.nested.table));
            var mapGeoData = result.primaryFilter.mapData.geojson.data;
            expect(mapGeoData.features[0].properties.abbreviation).toEqual('AR');
            expect(mapGeoData.features[0].properties.years).toEqual('2015');
            expect(mapGeoData.features[0].properties.sex[0].name).toEqual('Both sexes');
            expect(mapGeoData.features[0].properties.sex[1].name).toEqual('Female');
            expect(mapGeoData.features[0].properties.sex[2].name).toEqual('Male');
        });

        it('searchSTDResults', function(){

            var deferredResults = $q.defer();

            primaryFilter = filters.search[6];
            filters.selectedPrimaryFilter = primaryFilter;

            spyOn(searchService, 'searchResults').and.returnValue(deferredResults.promise);

            primaryFilter.searchResults(primaryFilter, '35343dsfvvcxvsd').then(function(result) {
                expect(JSON.stringify(result.data.resultData.nested.table)).toEqual(JSON.stringify(stdSearchResponse.data.resultData.nested.table));
                expect(JSON.stringify(result.data.resultData.nested.charts)).toEqual(JSON.stringify(stdSearchResponse.data.resultData.nested.charts));
            });

            deferredResults.resolve(stdSearchResponse);
            $scope.$apply()
        });

    });

    describe('BRFSS search ->', function() {
        var response;
        beforeAll(function() {
            response = __fixtures__['app/modules/search/fixtures/search.factory/brfsFilterResponse'];
        });
        beforeEach(function() {
            deferred = $q.defer();
        });
        it('updateFiltersAndData for std response', function(){
            var groupOptions = {
                alcohol_consumption: {
                    "topic": ['cat_12', 'cat_48', 'cat_51', 'cat_52']
                }
            };
            var brfsFilters = {primaryFilters: [filters.search[10]]};
            spyOn(utils, 'getValuesByKeyIncludingKeyAndValue').and.returnValue([]);

            var result = searchFactory.updateFiltersAndData(brfsFilters, response, groupOptions);

            expect(JSON.stringify(result.primaryFilter.data.question)).toEqual(JSON.stringify(response.data.resultData.table.question));
            expect(result.primaryFilter.allFilters[8].questions.length).toEqual(groupOptions.alcohol_consumption.topic.length);
        });

        it('searchBRFSSResults', function(){
            var deferredResults = $q.defer();

            primaryFilter = filters.search[10];
            filters.selectedPrimaryFilter = primaryFilter;

            spyOn(searchService, 'searchResults').and.returnValue(deferredResults.promise);

            primaryFilter.searchResults(primaryFilter, '35343dsfvvcxvsd').then(function(result) {
                expect(JSON.stringify(result.data.resultData.table)).toEqual(JSON.stringify(response.data.resultData.table));
            });

            deferredResults.resolve(response);
            $scope.$apply()

        });
    });

    describe('test with mortality data', function () {
        beforeAll(function() {
            primaryFilter = filters.search[0];
            filters.selectedPrimaryFilter = primaryFilter;
        });
        beforeEach(function() {
            deferred = $q.defer();
        });

        it('updateFiltersAndData without year autocompleters', function () {
            var result = searchFactory.updateFiltersAndData(filters, searchResponse, {'number_of_deaths': {}}, {});
            expect(JSON.stringify(result.primaryFilter.data)).toEqual(JSON.stringify(searchResponse.data.resultData.nested.table));
        });

        it('getAllFilters', function () {
            expect(primaryFilter.key).toEqual('deaths');
        });

        it('addCountsToAutoCompleteOptions', function () {
            spyOn(searchService, 'searchResults').and.returnValue(deferred.promise);
            searchFactory.addCountsToAutoCompleteOptions(primaryFilter);
            deferred.resolve(countsMortalityAutoCompletes);
            $scope.$apply();
            var yearFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'year');
            expect(yearFilter.autoCompleteOptions.length).toEqual(16);
            expect(yearFilter.autoCompleteOptions[0].count).toEqual(2630800);
        });

        it('searchMortalityResults', function () {
            var result = searchFactory.updateFiltersAndData(filters, searchResponse, {'number_of_deaths': {}}, {});
            expect(JSON.stringify(result.primaryFilter.data)).toEqual(JSON.stringify(searchResponse.data.resultData.nested.table));
        });

        it('searchMortalityResults with only one row group', function () {
            var genderFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'gender');
            genderFilter.groupBy = false;

            var result = searchFactory.updateFiltersAndData(filters, searchResponse, {'number_of_deaths': {}}, {});
            expect(JSON.stringify(result.primaryFilter.chartDataFromAPI)).toEqual(JSON.stringify(searchResponse.data.resultData.simple));

            genderFilter.groupBy = 'column';
        });

        it('searchMortalityResults with only one column group', function () {
            var raceFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'race');
            raceFilter.groupBy = false;

            var result = searchFactory.updateFiltersAndData(filters, groupGenderResponse, {'number_of_deaths': {}}, {});
            expect(JSON.stringify(result.primaryFilter.headers)).toEqual(JSON.stringify(genderGroupHeaders));

            raceFilter.groupBy = 'row';
        });

        it('searchMortalityResults with no groups', function () {
            var genderFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'gender');
            genderFilter.groupBy = false;
            primaryFilter.showMap = false;
            var raceFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'race');
            raceFilter.groupBy = 'other';

            var result = searchFactory.updateFiltersAndData(filters, searchResponse, {'number_of_deaths': {}}, {});
            expect(JSON.stringify(result.primaryFilter.maps)).toEqual(JSON.stringify(searchResponse.data.resultData.nested.maps));


            primaryFilter.showMap = true;
            genderFilter.groupBy = 'column';
            raceFilter.groupBy = 'row';
        });

        it('searchMortalityResults with four groups', function () {
            var autopsyFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'autopsy');
            autopsyFilter.groupBy = 'row';
            var yearFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'year');
            autopsyFilter.groupBy = 'column';

            var result = searchFactory.updateFiltersAndData(filters, fourGroupsResponse, {'number_of_deaths': {}}, {});
            expect(JSON.stringify(result.primaryFilter.searchCount)).toEqual(JSON.stringify(fourGroupsResponse.pagination.total));

            autopsyFilter.groupBy = false;
            yearFilter.groupBy = false;
        });

        it('ageSliderOptions callback', function () {
            filters.ageSliderOptions.callback('0;10');
            var agegroupFilter = utils.findByKeyAndValue(filters.allMortalityFilters, 'key', 'agegroup');
            expect(agegroupFilter.value).toEqual([ '0-4years', '5-9years', 'Age not stated' ]);
        });

        //TODO: Need to be fixed
        xit('ageSliderOptions callback selectedPrimaryFilter initiated', function () {
            spyOn(searchService, 'searchResults').and.returnValue(deferred.promise);
            filters.selectedPrimaryFilter.initiated = true;
            filters.ageSliderOptions.callback('0;104');
            var agegroupFilter = utils.findByKeyAndValue(filters.allMortalityFilters, 'key', 'agegroup');
            $timeout.flush();
            expect(agegroupFilter.timer).toBeUndefined();
            filters.selectedPrimaryFilter.initiated = false;
        });

        it('getqueryResults', function(){
            var searchResultsResponse = __fixtures__['app/modules/search/fixtures/search.factory/searchResultsResponse'];
            spyOn(searchService, 'searchResults').and.returnValue(deferred.promise);
            searchFactory.getQueryResults("ae38fb09ec8b6020a9478edc62a271ca").then(function(response) {
                expect(JSON.stringify(response.data.resultData.nested.table)).toEqual(JSON.stringify(searchResultsResponse.data.resultData.nested.table));
                expect(JSON.stringify(response.data.resultData.chartData)).toEqual(JSON.stringify(searchResultsResponse.data.resultData.chartData));
            });
            deferred.resolve(searchResultsResponse);
            $scope.$apply();
        });

        it('mcd filters', function () {
            var mcdFilter = utils.findByKeyAndValue(filters.allMortalityFilters, 'key', 'mcd-chapter-10');
            expect(mcdFilter.disableFilter).toEqual(undefined);
            expect(mcdFilter.queryKey).toEqual('ICD_10_code');
            expect(mcdFilter.filterType).toEqual('conditions');
            expect(mcdFilter.selectTitle).toEqual('select.label.filter.mcd');
            expect(mcdFilter.updateTitle).toEqual('update.label.filter.mcd');
        });
    });

    describe('test with yrbs data', function () {
        var yrbsResponse, raceNoValueHeaders, yrbsChartDeferred;
        beforeAll(function() {
            primaryFilter = filters.search[1];
            filters.selectedPrimaryFilter = primaryFilter;
            yrbsResponse = __fixtures__['app/modules/search/fixtures/search.factory/yrbsResponse'];
            raceNoValueHeaders = __fixtures__['app/modules/search/fixtures/search.factory/raceNoValueHeaders'];
        });
        beforeEach(function() {
            deferred = $q.defer();
            yrbsChartDeferred = $q.defer();
        });

        it('getAllFilters', function () {
            expect(primaryFilter.key).toEqual('mental_health');
            expect(primaryFilter.sideFilters).toBeDefined();
            expect(primaryFilter.sideFilters).toEqual(primaryFilter.basicSideFilters);
            expect(primaryFilter.allFilters).toEqual(filters.yrbsBasicFilters);
        });

        it('searchYRBSResults', function () {
            var result = searchFactory.updateFiltersAndData(filters, yrbsResponse, {'mental_health': {}}, 'mental_health');
            expect(JSON.stringify(result.primaryFilter.data)).toEqual(JSON.stringify(yrbsResponse.data.resultData.table));
        });

        it('searchYRBSResults with only one row group having no value', function () {
            var raceFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'yrbsRace');
            raceFilter.groupBy = 'row';
            raceFilter.value = '';

            var result = searchFactory.updateFiltersAndData(filters, yrbsResponse, {'mental_health': {}}, 'mental_health');
            expect(JSON.stringify(result.primaryFilter.headers)).toEqual(JSON.stringify(raceNoValueHeaders));

            raceFilter.groupBy = 'column';
            raceFilter.value = ['all-races-ethnicities'];
        });

        it('searchYRBSResults with only one row and one column group', function () {
            var genderFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'yrbsSex');
            genderFilter.groupBy = 'column';

            var result = searchFactory.updateFiltersAndData(filters, yrbsResponse, {'mental_health': {}}, 'mental_health');
            expect(result.primaryFilter.headers.columnHeaders.length).toEqual(2);

            genderFilter.groupBy = false;
        });

        it('searchYRBSResults with only one row and one column group with out all value', function () {
            var genderFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'yrbsSex');
            genderFilter.groupBy = 'column';

            var raceFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'yrbsRace');
            raceFilter.value = ['ai_an'];

            var yearFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'year');
            yearFilter.value = ['2015', '2013'];

            spyOn(searchService, 'searchResults').and.returnValue(deferred.promise);
            primaryFilter.searchResults(primaryFilter).then(function() {
                expect(primaryFilter.headers.columnHeaders[0].key).toEqual('yrbsSex');
            });
            deferred.resolve(yrbsResponse);

            genderFilter.groupBy = false;
            raceFilter.value = 'all-races-ethnicities';
            raceFilter.value = ['2015'];
        });

        it('should give me a chart data for single filter with question', function () {
            spyOn(searchService, 'searchResults').and.callFake(function(){
                return yrbsChartDeferred.promise
            });
            var deferred1 = $q.defer();
            spyOn(searchService, 'generateHashCode').and.callFake(function() {
                return deferred1.promise;
            });

            var yrbsMockData = __fixtures__['app/modules/search/fixtures/search.factory/yrbsChartMockData'];
            var selectedQuestion = yrbsMockData.selectedQuestion;
            primaryFilter.value = yrbsMockData.selectedFilters1;

            var questionFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'question');

            questionFilter.onIconClick(selectedQuestion);

            deferred1.resolve('06c2b4848fbbc7f4e0ed60a399d1de21');

            yrbsChartDeferred.resolve(yrbsMockData.chartData1);

            $scope.$apply();

        });


        it('should give me a chart data for two filters with question', function () {
            spyOn(searchService, 'searchResults').and.callFake(function(){
                return yrbsChartDeferred.promise
            });
            var deferred1 = $q.defer();
            spyOn(searchService, 'generateHashCode').and.callFake(function() {
                return deferred1.promise;
            });

            var yrbsMockData = __fixtures__['app/modules/search/fixtures/search.factory/yrbsChartMockData'];
            var selectedQuestion = yrbsMockData.selectedQuestion;
            primaryFilter.value = yrbsMockData.selectedFilters2;
            searchFactory.prepareQuestionChart(primaryFilter,selectedQuestion,
                ['yrbsSex', 'yrbsRace']).then(function (response) {
                expect(response.chartTypes.length).toEqual(3);
                expect(response.chartTypes[0].join()).toEqual('yrbsRace');
                expect(response.chartTypes[1].join('&')).toEqual('yrbsSex&yrbsRace');
                expect(response.chartTypes[2].join()).toEqual('yrbsSex');
            });

            deferred1.resolve('06c2b4848fbbc7f4e0ed60a399d1de21');

            yrbsChartDeferred.resolve(yrbsMockData.chartData2);
        });
    });

    describe('test with bridge race data', function () {
        var response;
        beforeAll(function() {
            //get the filters
            primaryFilter = filters.search[2];
            filters.selectedPrimaryFilter = primaryFilter;
            //prepare mock response
            response = __fixtures__['app/modules/search/fixtures/search.factory/bridgeRaceResponse'];
        });
        beforeEach(function() {
            deferred = $q.defer();
        });

        it('getAllFilters', function () {
            expect(primaryFilter.key).toEqual('bridge_race');
        });

        it('searchCensusInfo', function () {
            spyOn(searchService, 'searchResults').and.returnValue(deferred.promise);
            primaryFilter.searchResults(primaryFilter).then(function() {
                expect(JSON.stringify(primaryFilter.data)).toEqual(JSON.stringify(response.data.resultData.nested.table));
                expect(JSON.stringify(primaryFilter.chartData)).toEqual(JSON.stringify(response.data.resultData.chartData));
            });
            deferred.resolve(response);
        });

        it('test searchCensusInfo for population counts in side filters', function () {
            spyOn(searchService, 'searchResults').and.returnValue(deferred.promise);
            primaryFilter.searchResults(primaryFilter).then(function() {
                primaryFilter.allFilters.forEach(function (eachFilter) {
                    eachFilter.autoCompleteOptions.forEach(function (option) {
                        expect(option.bridge_race).toBeDefined();
                    });
                });
            });
            deferred.resolve(response);
        });

        it('sliderValue is updated', function () {
            var mortalityFilter = utils.findByKeyAndValue(filters.primaryFilters, 'key', 'deaths');
            mortalityFilter.sideFilters[0].sideFilters[0].filters.sliderValue = '-5;105';
            var expectedSliderValue = '10,50';
            searchResponseForAgeGroup.data.queryJSON.sideFilters[0].sideFilters[0].filters.sliderValue = expectedSliderValue;
            searchFactory.updateFiltersAndData(filters, searchResponseForAgeGroup, { 'number_of_deaths': {} }, {});
            expect(mortalityFilter.sideFilters[0].sideFilters[0].filters.sliderValue).toEqual(expectedSliderValue);
        });

    });

    describe('test with natality data', function () {
        var response;
        beforeAll(function() {
            //get the filters
            primaryFilter = filters.search[3];
            filters.selectedPrimaryFilter = primaryFilter;
            //prepare mock response
            response = __fixtures__['app/modules/search/fixtures/search.factory/natalityResponse'];
        });

        beforeEach(function() {
            deferred = $q.defer();
        });

        it('getAllFilters', function () {
            expect(primaryFilter.key).toEqual('natality');
        });

        it('searchNatality', function () {
            var result = searchFactory.updateFiltersAndData(filters, response, {'natality': {}}, 'natality');
            expect(JSON.stringify(result.primaryFilter.data)).toEqual(JSON.stringify(response.data.resultData.nested.table));
        });

        it('set filter group type', function(){
            var allFilters = angular.copy(filters.search[3].allFilters);
            //set sex groupBy off
            var sexFilter = utils.findByKeyAndValue(allFilters, 'key', 'sex');
            sexFilter.groupBy = false;
            searchFactory.setFilterGroupBy(allFilters, 'sex', 'column');
            expect(sexFilter.groupBy).toEqual('column');
        });
    });

    describe('prams search', function () {
        var response;
        beforeAll(function() {
            //get the filters
            primaryFilter = filters.search[4];
            primaryFilter.data = [];
            filters.primaryFilters = [primaryFilter];
            //prepare mock response
            response = __fixtures__['app/modules/search/fixtures/search.factory/pramsFilterResponse'];
        });

        it('updateFiltersAndData for prams', function () {
            var groupOptions = {"delivery":{"topic":['cat_45', 'cat_39', 'cat_0']}};
            spyOn(utils, 'getValuesByKeyIncludingKeyAndValue').and.returnValue([]);
            var result = searchFactory.updateFiltersAndData(filters, response, groupOptions);
            expect(JSON.stringify(result.primaryFilter.data.question)).toEqual(JSON.stringify(response.data.resultData.table.question));
            expect(result.primaryFilter.allFilters[3].questions.length).toEqual(groupOptions.delivery.topic.length);
        });
    });

    describe('updateFilterAndData with Cancer Incidence data', function () {
        var response;
        beforeEach(function () {
            response = __fixtures__['app/modules/search/fixtures/search.factory/cancerIncidenceResponse'];
        });
        it('Should attach result data to the primary filter', function () {
            var mock = { primaryFilters: [ filters.search[9] ] };
            var result = searchFactory.updateFiltersAndData(mock, response, { cancer_incident: {} }, {});
            expect(result.primaryFilter.data).toEqual(response.data.resultData.nested.table);
        });
    });
});
