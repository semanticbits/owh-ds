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
        $httpBackend.whenGET('/pramsBasicQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('/pramsAdvancesQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('jsons/ucd-conditions-ICD-10.json').respond({data: []});
        $httpBackend.whenGET('jsons/mcd-conditions-ICD-10.json').respond({data: []});
        $httpBackend.whenGET('/getGoogAnalyInfo').respond({data: { }});
        $httpBackend.whenGET('/brfsQuestionsTree/true').respond({data: { }});
        $httpBackend.whenGET('/brfsQuestionsTree/false').respond({data: { }});
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

    describe("Stats map related tests", function () {

        it("should get map data for states", function () {

            var searchDeferred = $q.defer();
            var hashDeferred = $q.defer();

            spyOn(searchService, 'generateHashCode').and.returnValue(hashDeferred.promise);
            spyOn(searchService, 'searchResults').and.returnValue(searchDeferred.promise);

            var yrbsMockData = __fixtures__['app/modules/search/fixtures/search.factory/yrbsChartMockData'];
            var question = {"title":"Currently drank alcohol(at least one drink of alcohol on at least 1 day during the 30 days before the survey)","isCount":false,"rowspan":2,"colspan":1,"key":"Currently drank alcohol","qkey":"qn43","iconClass":"purple-text"};

            var yrbsFilters =  filters.search[1];
            searchFactory.getMapDataForQuestion(yrbsFilters, question).then(function (stateData) {
                expect(stateData[1].name).toEqual('NE');
                expect(stateData[1].responses[0].rKey).toEqual('Yes');
                expect(stateData[1].responses[0].rData.mean).toEqual('22.7');
                expect(stateData[1].responses[0].rData.count).toEqual(1572);

                expect(stateData[1].responses[1].rKey).toEqual('No');
                expect(stateData[1].responses[1].rData.mean).toEqual('77.3');
                expect(stateData[1].responses[1].rData.count).toEqual(1572);
            });


            hashDeferred.resolve('06c2b4848fbbc7f4e0ed60a399d1de21');
            searchDeferred.resolve(yrbsMockData.mapData);
            $scope.$apply();
        });
    });

    describe('BRFSS search ->', function() {
        var response, basicFilters;
        beforeAll(function() {
            response = __fixtures__['app/modules/search/fixtures/search.factory/brfsFilterResponse'];
            basicFilters = __fixtures__['app/modules/search/fixtures/search.factory/brfssBasicFilters'];
        });
        beforeEach(function() {
            deferred = $q.defer();
        });
        it('updateFiltersAndData for brfss response', function(){
            var groupOptions = {
                basic_alcohol_consumption: {
                    "topic": ['cat_20', 'cat_36', 'cat_30', 'cat_21']
                }
            };
            var brfsFilters = {
                primaryFilters: [filters.search[11]],
                brfsBasicFilters: basicFilters
            };
            spyOn(utils, 'getValuesByKeyIncludingKeyAndValue').and.returnValue([]);
            $rootScope.brfsBasicQuestions = [{"id":"cat_20","text":"Aerobic Activity","children":[{"text":"Participated in 150 minutes or more of Aerobic Physical Activity per week (variable calculated from one or more BRFSS questions)","id":"_paindex","years":["2011"]},{"text":"Participated in 150 minutes or more of Aerobic Physical Activity per week (variable calculated from one or more BRFSS questions)","id":"_paindx1","years":["2015","2013"]}]},{"id":"cat_36","text":"Exercise","children":[{"text":"During the past month, did you participate in any physical activities? (variable calculated from one or more BRFSS questions)","id":"_totinda","years":["1996","2001","2015","2005","2003","2013","2007","2010","2004","2002","1998","2009","2008","2000","2011","2012","2016","2014","2006"]}]},{"id":"cat_30","text":"Physical Activity","children":[{"text":"Adults with 20+ minutes of vigorous physical activity three or more days per week (variable calculated from one or more BRFSS questions)","id":"_rfpavig","years":["2009","2007","2001","2005","2003"]},{"text":"Adults with 30+ minutes of any physical activity five or more days per week (variable calculated from one or more BRFSS questions)","id":"_rfregul","years":["1996","1998","2000"]},{"text":"Adults with 30+ minutes of moderate physical activity five or more days per week, or vigorous physical activity for 20+ minutes three or more days per week","id":"_rfpamod","years":["2009","2007","2001","2005","2003"]}]},{"id":"cat_21","text":"Physical Activity Index","children":[{"text":"Participated in enough Aerobic and Muscle Strengthening exercises to meet guidelines (variable calculated from one or more BRFSS questions)","id":"_pastae1","years":["2015","2013"]},{"text":"Participated in enough Aerobic and Muscle Strengthening exercises to meet guidelines (variable calculated from one or more BRFSS questions)","id":"_pastaer","years":["2011"]}]}];

            var result = searchFactory.updateFiltersAndData(brfsFilters, response, groupOptions);
            expect(JSON.stringify(result.primaryFilter.data.question)).toEqual(JSON.stringify(response.data.resultData.table.question));
            expect(result.primaryFilter.allFilters[8].questions.length).toEqual(groupOptions.basic_alcohol_consumption.topic.length);
        });

        it('searchBRFSSResults', function(){
            var deferredResults = $q.defer();

            primaryFilter = filters.search[11];
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

        // it('addCountsToAutoCompleteOptions', function () {
        //     spyOn(searchService, 'searchResults').and.returnValue(deferred.promise);
        //     searchFactory.addCountsToAutoCompleteOptions(primaryFilter);
        //     deferred.resolve(countsMortalityAutoCompletes);
        //     $scope.$apply();
        //     var yearFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'year');
        //     expect(yearFilter.autoCompleteOptions.length).toEqual(16);
        //     expect(yearFilter.autoCompleteOptions[0].count).toEqual(2630800);
        // });
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
            expect(agegroupFilter.value).toEqual([  '1-4years', '5-9years', '10-14years' ]);
        });

        it('ageSliderOptions callback single value selection', function () {
            filters.ageSliderOptions.callback('-5;-5');
            var agegroupFilter = utils.findByKeyAndValue(filters.allMortalityFilters, 'key', 'agegroup');
            expect(agegroupFilter.value).toEqual([  '1 year' ]);
        });

        it('ageSliderOptions callback single interval selection', function () {
            filters.ageSliderOptions.callback('-5;0');
            var agegroupFilter = utils.findByKeyAndValue(filters.allMortalityFilters, 'key', 'agegroup');
            expect(agegroupFilter.value).toEqual([  '1 year', '1-4years' ]);
        });

        it('ageSliderOptions callback not stated selection', function () {
            filters.ageSliderOptions.callback('-10;-10');
            var agegroupFilter = utils.findByKeyAndValue(filters.allMortalityFilters, 'key', 'agegroup');
            expect(agegroupFilter.value).toEqual([  'Age not stated' ]);
        });

        it('ageSliderOptions callback all selection', function () {
            filters.ageSliderOptions.callback('-10;105');
            var agegroupFilter = utils.findByKeyAndValue(filters.allMortalityFilters, 'key', 'agegroup');
            expect(agegroupFilter.value).toEqual([]);
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

        it('invokeStatsService for yrbs', function () {
            $rootScope.questions = [{"id":"cat_5","text":"Alcohol and Other Drug Use","children":[{"text":"Currently drank alcohol(at least one drink of alcohol on at least 1 day during the 30 days before the survey)","id":"qn43"},{"text":"Currently used marijuana(one or more times during the 30 days before the survey)","id":"qn49"},{"text":"Drank alcohol before age 13 years(for the first time other than a few sips)","id":"qn42"},{"text":"Drank five or more drinks of alcohol in a row(within a couple of hours on at least 1 day during the 30 days before the survey)","id":"qn44"},{"text":"Ever drank alcohol(at least one drink of alcohol on at least 1 day during their life)","id":"qn41"},{"text":"Ever injected any illegal drug(used a needle to inject any illegal drug into their body one or more times during their life)","id":"qn58"},{"text":"Ever took prescription drugs without a doctors prescription(such as Oxycontin, Percocet, Vicodin, codeine, Adderall, Ritalin, or Xanax, one or more times during their life)","id":"qn57"},{"text":"Ever took steroids without a doctors prescription(pills or shots, one or more times during their life)","id":"qn56"},{"text":"Ever used cocaine(any form of cocaine, such as powder, crack, or freebase, one or more times during their life)","id":"qn50"},{"text":"Ever used ecstasy(also called \"MDMA,\" one or more times during their life)","id":"qn54"},{"text":"Ever used heroin(also called \"smack,\" \"junk,\" or \"China white,\" one or more times during their life)","id":"qn52"},{"text":"Ever used inhalants(sniffed glue, breathed the contents of aerosol spray cans, or inhaled any paints or sprays to get high, one or more times during their life)","id":"qn51"},{"text":"Ever used marijuana(one or more times during their life)","id":"qn47"},{"text":"Ever used methamphetamines(also called \"speed,\" \"crystal,\" \"crank,\" or \"ice,\" one or more times during their life)","id":"qn53"},{"text":"Ever used synthetic marijuana(also called \"K2\", \"Spice\", \"fake weed\", \"King Kong\", \"Yucatan Fire\", \"Skunk\", or \"Moon Rocks\", one or more times during their life)","id":"qn55"},{"text":"Reported that the largest number of drinks they had in a row was 10 or more(within a couple of hours during the 30 days before the survey)","id":"qn45"},{"text":"Tried marijuana before age 13 years(for the first time)","id":"qn48"},{"text":"Used LSD 1+ times(such as LSD, acid, PCP, angel dust, mescaline, or mushrooms, one or more times during their life)","id":"qnhallucdrug"},{"text":"Usually obtained the alcohol they drank by someone giving it to them(during the 30 days before the survey, among students who currently drank alcohol)","id":"qn46"},{"text":"Usually used marijuana by smoking it in a joint, bong, pipe, or blunt(in a joint, bong, pipe, or blunt during the 30 days before the survey)","id":"qnhowmarijuana"},{"text":"Were offered, sold, or given an illegal drug on school property(during the 12 months before the survey)","id":"qn59"}]},{"id":"cat_0","text":"Dietary Behaviors","children":[{"text":"Ate breakfast on all 7 days(during the 7 days before the survey)","id":"qnbk7day"},{"text":"Ate fruit or drank 100% fruit juices one or more times per day(during the 7 days before the survey)","id":"qnfr1"},{"text":"Ate fruit or drank 100% fruit juices three or more times per day(during the 7 days before the survey)","id":"qnfr3"},{"text":"Ate fruit or drank 100% fruit juices two or more times per day(during the 7 days before the survey)","id":"qnfr2"},{"text":"Ate vegetables one or more times per day(green salad, potatoes (excluding French fries, fried potatoes, or potato chips), carrots, or other vegetables, during the 7 days before the survey)","id":"qnveg1"},{"text":"Ate vegetables three or more times per day(green salad, potatoes (excluding French fries, fried potatoes, or potato chips), carrots, or other vegetables, during the 7 days before the survey)","id":"qnveg3"},{"text":"Ate vegetables two or more times per day(green salad, potatoes (excluding French fries, fried potatoes, or potato chips), carrots, or other vegetables, during the 7 days before the survey)","id":"qnveg2"},{"text":"Did not drink a bottle or glass of plain water(during the 7 days before the survey)","id":"qnwater"},{"text":"Did not drink a can, bottle, or glass of a sports drink(not counting low calorie sports drinks during the 7 days before the survey)","id":"qnsportsdrink"},{"text":"Did not drink a can, bottle, or glass of soda or pop(not counting diet soda or diet pop, during the 7 days before the survey)","id":"qn77"},{"text":"Did not drink milk(during the 7 days before the survey)","id":"qn78"},{"text":"Did not eat breakfast(during the 7 days before the survey)","id":"qn79"},{"text":"Did not eat fruit or drink 100% fruit juices(during the 7 days before the survey)","id":"qnfr0"},{"text":"Did not eat vegetables(green salad, potatoes (excluding French fries, fried potatoes, or potato chips), carrots, or other vegetables, during the 7 days before the survey)","id":"qnveg0"},{"text":"Drank a can, bottle, or glass of a sports drink one or more times per day(not counting low calorie sports drinks during the 7 days before the survey)","id":"qnspdrk1"},{"text":"Drank a can, bottle, or glass of a sports drink three or more times per day(not counting low calorie sports drinks during the 7 days before the survey)","id":"qnspdrk3"},{"text":"Drank a can, bottle, or glass of a sports drink two or more times per day(not counting low calorie sports drinks during the 7 days before the survey)","id":"qnspdrk2"},{"text":"Drank a can, bottle, or glass of soda or pop one or more times per day(not counting diet soda or diet pop, during the 7 days before the survey)","id":"qnsoda1"},{"text":"Drank a can, bottle, or glass of soda or pop three or more times per day(not counting diet soda or diet pop, during the 7 days before the survey)","id":"qnsoda3"},{"text":"Drank a can, bottle, or glass of soda or pop two or more times per day(not counting diet soda or diet pop, during the 7 days before the survey)","id":"qnsoda2"},{"text":"Drank one or more glasses per day of milk(during the 7 days before the survey)","id":"qnmilk1"},{"text":"Drank one or more glasses per day of water(during the 7 days before the survey)","id":"qnwater1"},{"text":"Drank three or more glasses per day of milk(during the 7 days before the survey)","id":"qnmilk3"},{"text":"Drank three or more glasses per day of water(during the 7 days before the survey)","id":"qnwater3"},{"text":"Drank two or more glasses per day of milk(during the 7 days before the survey)","id":"qnmilk2"},{"text":"Drank two or more glasses per day of water(during the 7 days before the survey)","id":"qnwater2"}]},{"id":"cat_6","text":"Obesity, Overweight, and Weight Control","children":[{"text":"Described themselves as slightly or very overweight()","id":"qn69"},{"text":"Were Obese(>= 95th percentile for body mass index, based on sex- and age-specific reference data from the 2000 CDC growth charts)","id":"qnobese"},{"text":"Were Overweight(>= 85th percentile but <95th percentile for body mass index, based on sex- and age-specific reference data from the 2000 CDC growth charts)","id":"qnowt"},{"text":"Were trying to lose weight()","id":"qn70"}]},{"id":"cat_3","text":"Other Health Topics","children":[{"text":"Had 8 or more hours of sleep(on an average school night)","id":"qn88"},{"text":"Had a sunburn(one or more times during the 12 months before the survey, counting even a small part of the skin turning red or hurting for 12 hours or more after being outside in the sun or after using a sunlamp or other indoor tanning device)","id":"qnsunburn"},{"text":"Had ever been told by a doctor or nurse that they had asthma()","id":"qn87"},{"text":"Have to avoid some foods because eating the food could cause an allergic reaction(such as skin rashes, swelling, itching, vomiting, coughing, or trouble breathing)","id":"qnfoodallergy"},{"text":"Saw a dentist(for a check-up, exam, teeth cleaning, or other dental work during the 12 months before the survey)","id":"qn86"},{"text":"Used 1+ times indoor tanning(such as a sunlamp, sunbed, or tanning booth (not counting getting a spray-on tan) one or more times during the 12 months before the survey)","id":"qnindoortanning"}]},{"id":"cat_7","text":"Physical Activity","children":[{"text":"Attended physical education classes on 1 or more days(in an average week when they were in school)","id":"qn83"},{"text":"Attended physical education classes on all 5 days(in an average week when they were in school)","id":"qndlype"},{"text":"Did not participate in at least 60 minutes of physical activity on at least 1 day(doing any kind of physical activity that increased their heart rate and made them breathe hard some of the time during the 7 days before the survey)","id":"qnpa0day"},{"text":"Played on at least one sports team(run by their school or community groups during the 12 months before the survey)","id":"qn84"},{"text":"Played video or computer games or used a computer 3 or more hours per day(for something that was not school work on an average school day)","id":"qn82"},{"text":"Strengthened muscles 3+ of past 7 days(such as, push-ups, sit-ups, or weight lifting, during the 7 days before the survey)","id":"qnmusclestrength"},{"text":"Watched television 3 or more hours per day(on an average school day)","id":"qn81"},{"text":"Were physically active at least 60 minutes per day on 5 or more days(doing any kind of physical activity that increased their heart rate and made them breathe hard some of the time during the 7 days before the survey)","id":"qn80"},{"text":"Were physically active at least 60 minutes per day on all 7 days(doing any kind of physical activity that increased their heart rate and made them breathe hard some of the time during the 7 days before the survey)","id":"qnpa7day"}]},{"id":"cat_2","text":"Sexual Behaviors","children":[{"text":"Did not use any method to prevent pregnancy(during last sexual intercourse, among students who were currently sexually active)","id":"qnbcnone"},{"text":"Drank alcohol or used drugs before last sexual intercourse(before last sexual intercourse, among students who were currently sexually active)","id":"qn64"},{"text":"Ever had sexual intercourse()","id":"qn60"},{"text":"Had sexual intercourse before age 13 years(for the first time)","id":"qn61"},{"text":"Had sexual intercourse with four or more persons(during their life)","id":"qn62"},{"text":"Used a condom(during last sexual intercourse, among students who were currently sexually active)","id":"qn65"},{"text":"Used a shot (e.g., Depo-Provera), patch (e.g., OrthoEvra), or birth control ring (e.g., NuvaRing)(before last sexual intercourse to prevent pregnancy, among students who were currently sexually active)","id":"qnshparg"},{"text":"Used an IUD (e.g., Mirena or ParaGard) or implant (e.g., Implanon or Nexplanon)(before last sexual intercourse to prevent pregnancy, among students who were currently sexually active)","id":"qniudimp"},{"text":"Used birth control pills(before last sexual intercourse to prevent pregnancy, among students who were currently sexually active)","id":"qn66"},{"text":"Used birth control pills; an IUD or implant; or a shot, patch, or birth control ring(before last sexual intercourse to prevent pregnancy, among students who were currently sexually active)","id":"qnothhpl"},{"text":"Used both a condom during and birth control pills; an IUD or implant; or a shot, patch, or birth control ring before last sexual intercourse(before last sexual intercourse to prevent pregnancy, among students who were currently sexually active)","id":"qndualbc"},{"text":"Were currently sexually active(had sexual intercourse with at least one person during the 3 months before the survey)","id":"qn63"},{"text":"Were ever tested for HIV(not counting tests done when donating blood)","id":"qn85"}]},{"id":"cat_1","text":"Tobacco Use","children":[{"text":"Currently frequently smoked cigarettes(on 20 or more days during the 30 days before the survey)","id":"qnfrcig"},{"text":"Currently smoked cigarettes daily(on all 30 days during the 30 days before the survey)","id":"qndaycig"},{"text":"Currently smoked cigarettes or cigars(on at least 1 day during the 30 days before the survey)","id":"qntob2"},{"text":"Currently smoked cigarettes(on at least 1 day during the 30 days before the survey)","id":"qn33"},{"text":"Currently smoked cigars(cigars, cigarillos, or little cigars on at least 1 day during the 30 days before the survey)","id":"qn38"},{"text":"Currently used cigarettes, cigars, or smokeless tobacco(on at least 1 day during the 30 days before the survey)","id":"qntob3"},{"text":"Currently used electronic vapor products(including e-cigarettes, e-cigars, e-pipes, vape pipes, vaping pens, e-hookahs, and hookah pens on at least 1 day during the 30 days before the survey)","id":"qn40"},{"text":"Currently used smokeless tobacco(chewing tobacco, snuff, or dip on at least 1 day during the 30 days before the survey)","id":"qn37"},{"text":"Currently used tobacco(current cigarette, smokeless tobacco, cigar, or electronic vapor products use on at least 1 day during the 30 days before the survey)","id":"qntob4"},{"text":"Ever tried cigarette smoking(even one or two puffs)","id":"qn31"},{"text":"Ever used electronic vapor products(including e-cigarettes, e-cigars, e-pipes, vape pipes, vaping pens, e-hookahs, and hookah pens)","id":"qn39"},{"text":"Smoked a whole cigarette before age 13 years(for the first time)","id":"qn32"},{"text":"Smoked more than 10 cigarettes per day(on the days they smoked during the 30 days before the survey, among students who currently smoked cigarettes)","id":"qn34"},{"text":"Tried to quit smoking cigarettes(during the 12 months before the survey, among students who currently smoked cigarettes)","id":"qn36"},{"text":"Usually obtained their own cigarettes by buying on the internet(during the 30 days before the survey, among students who currently smoked cigarettes and who were aged <18 years)","id":"qncigint"},{"text":"Usually obtained their own cigarettes by buying them in a store or gas station(during the 30 days before the survey, among students who currently smoked cigarettes and who were aged <18 years)","id":"qn35"}]},{"id":"cat_4","text":"Unintentional Injuries and Violence","children":[{"text":"Attempted suicide that resulted in an injury, poisoning, or overdose that had to be treated by a doctor or nurse(during the 12 months before the survey)","id":"qn30"},{"text":"Attempted suicide(one or more times during the 12 months before the survey)","id":"qn29"},{"text":"Carried a gun(on at least 1 day during the 30 days before the survey)","id":"qn14"},{"text":"Carried a weapon on school property(such as, a gun, knife, or club, on at least 1 day during the 30 days before the survey)","id":"qn15"},{"text":"Carried a weapon(such as, a gun, knife, or club, on at least 1 day during the 30 days before the survey)","id":"qn13"},{"text":"Did not go to school because they felt unsafe at school or on their way to or from school(on at least 1 day during the 30 days before the survey)","id":"qn16"},{"text":"Drove when drinking alcohol(in a car or other vehicle one or more times during the 30 days before the survey, among students who had driven a car or other vehicle during the 30 days before the survey)","id":"qn11"},{"text":"Experienced physical dating violence(counting being hit, slammed into something, or injured with an object or weapon on purpose by someone they were dating or going out with one or more times during the 12 months before the survey,  among students who dated or went out with someone during the 12 months before the survey)","id":"qn22"},{"text":"Experienced sexual dating violence(counting kissing, touching, or being physically forced to have sexual intercourse when they did not want to by someone they were dating or going out with one or more times during the 12 months before the survey, among students who dated or went out with someone during the 12 months before the survey)","id":"qn23"},{"text":"Felt sad or hopeless(almost every day for 2 or more weeks in a row so that they stopped doing some usual activities during the 12 months before the survey)","id":"qn26"},{"text":"Made a plan about how they would attempt suicide(during the 12 months before the survey)","id":"qn28"},{"text":"Rarely or never wore a bicycle helmet(among students who had ridden a bicycle during the 12 months before the survey)","id":"qn8"},{"text":"Rarely or never wore a seat belt(when riding in a car driven by someone else)","id":"qn9"},{"text":"Rode with a driver who had been drinking alcohol(in a car or other vehicle one or more times during the 30 days before the survey)","id":"qn10"},{"text":"Seriously considered attempting suicide(during the 12 months before the survey)","id":"qn27"},{"text":"Texted or e-mailed while driving a car or other vehicle(on at least 1 day during the 30 days before the survey, among students who had driven a car or other vehicle during the 30 days before the survey)","id":"qn12"},{"text":"Were bullied on school property(during the 12 months before the survey)","id":"qn24"},{"text":"Were electronically bullied(counting being bullied through e-mail, chat rooms, instant messaging, Web sites, or texting during the 12 months before the survey)","id":"qn25"},{"text":"Were ever physically forced to have sexual intercourse(when they did not want to)","id":"qn21"},{"text":"Were in a physical fight on school property(one or more times during the 12 months before the survey)","id":"qn20"},{"text":"Were in a physical fight(one or more times during the 12 months before the survey)","id":"qn18"},{"text":"Were injured in a physical fight(one or more times during the 12 months before the survey and injuries had to be treated by a doctor or nurse)","id":"qn19"},{"text":"Were threatened or injured with a weapon on school property(such as, a gun, knife, or club, one or more times during the 12 months before the survey)","id":"qn17"}]}];
            var result = searchFactory.updateFiltersAndData(filters, yrbsResponse, {'mental_health': {}}, 'mental_health');
            expect(JSON.stringify(result.primaryFilter.data)).toEqual(JSON.stringify(yrbsResponse.data.resultData.table));
        });

        it('invokeStatsService for yrbs with only one row group having no value', function () {
            var raceFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'yrbsRace');
            raceFilter.groupBy = 'row';
            raceFilter.value = '';

            var result = searchFactory.updateFiltersAndData(filters, yrbsResponse, {'mental_health': {}}, 'mental_health');
            expect(JSON.stringify(result.primaryFilter.headers)).toEqual(JSON.stringify(raceNoValueHeaders));

            raceFilter.groupBy = 'column';
            raceFilter.value = ['all-races-ethnicities'];
        });

        it('invokeStatsService for yrbs with only one row and one column group', function () {
            var genderFilter = utils.findByKeyAndValue(primaryFilter.allFilters, 'key', 'yrbsSex');
            genderFilter.groupBy = 'column';

            var result = searchFactory.updateFiltersAndData(filters, yrbsResponse, {'mental_health': {}}, 'mental_health');
            expect(result.primaryFilter.headers.columnHeaders.length).toEqual(2);

            genderFilter.groupBy = false;
        });

        it('invokeStatsService for yrbs with only one row and one column group with out all value', function () {
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
            raceFilter.value = 'Asian';
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
        var response, basicFilters;
        beforeAll(function() {
            response = __fixtures__['app/modules/search/fixtures/search.factory/pramsFilterResponse'];
            basicFilters = __fixtures__['app/modules/search/fixtures/search.factory/pramsBasicFilters'];
        });

        beforeEach(function() {
            deferred = $q.defer();
        });

        it('updateFiltersAndData for prams', function () {
            var groupOptions = {"delivery":{"topic":['cat_45', 'cat_39', 'cat_0']}};

            spyOn(utils, 'getValuesByKeyIncludingKeyAndValue').and.returnValue([]);
            $rootScope.pramsBasicQuestions = [{"id":"cat_45","text":"Delivery - Method","children":[{"text":"How was your new baby delivered?","id":"qn96"}]},{"id":"cat_39","text":"Delivery - Payment","children":[{"text":"Indicator of no insurance to pay for delivery","id":"qn365"},{"text":"Indicator of whether delivery was paid for by insurance purchased directly","id":"qn366"},{"text":"Indicator of whether delivery was paid for by insurance through an employer","id":"qn367"},{"text":"Indicator of whether delivery was paid for by insurance through the military","id":"qn364"},{"text":"Indicator of whether other sources paid for delivery","id":"qn319"},{"text":"Indicator of whether personal income paid for delivery","id":"qn318"},{"text":"Indicator of whether private insurance paid for delivery","id":"qn317"}]},{"id":"cat_0","text":"Hospital Length of Stay","children":[{"text":"Indicator of baby being discharged from hospital within 48 hours of birth. (for vaginal deliveries only)","id":"qn1"},{"text":"Indicator of baby born in a hospital","id":"qn168"},{"text":"Indicator of mother delivering in a hospital","id":"qn169"}]},{"id":"cat_33","text":"Abuse - Mental","children":[{"text":"(*PCH) During the 12 months before pregnancy  did your husband or partner threaten you  limit your activities against your will  or make you feel unsafe in any other way?","id":"qn231"}]},{"id":"cat_44","text":"WIC","children":[{"text":"During your pregnancy  were you on WIC (Special Supplemental Nutrition Program for Women  Infants and Children)?","id":"qn43"}]}];
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
