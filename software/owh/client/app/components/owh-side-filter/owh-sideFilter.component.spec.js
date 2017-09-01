'use strict';

describe('OWH Side filter component: ', function() {
    var $rootScope, $injector, $templateCache, $scope, filters,closeDeferred, controllerProvider,
        modalService,givenModalDefaults, ModalService,elementVisible, thenFunction,  utilService;

    var $httpBackend, $compile, $http, $componentController;

    beforeEach(function() {
        module('owh');

        ModalService = jasmine.createSpy('ModalServiceMock');

        module(function ($provide) {
            ModalService.showModal = function(modalDefaults) {
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
            };
            $provide.value('ModalService', ModalService);
        });

        inject(function(_$rootScope_, _$state_, _$injector_, _$templateCache_,_$location_, _$compile_, _$http_,
                        _$componentController_ , _$q_, _$controller_, _utilService_) {
            $rootScope  = _$rootScope_;
            $injector   = _$injector_;
            $templateCache = _$templateCache_;
            $compile = _$compile_;
            $http = _$http_;
            $scope = $rootScope.$new();
            $httpBackend = $injector.get('$httpBackend');
            $componentController = _$componentController_;
            //modalService = _ModalService_;
            closeDeferred = _$q_.defer();
            controllerProvider = _$controller_;
            utilService = _utilService_
        });
        $templateCache.put('app/components/owh-side-filter/owhSideFilter.html', 'app/components/owh-side-filter/owhSideFilter.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');
        $templateCache.put('app/components/owh-footer/footer.html', 'app/components/owh-footer/footer.html');
        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/components/owh-side-filter/owhSideFilter.html').respond( $templateCache.get('app/components/owh-side-filter/owhSideFilter.html'));
        $httpBackend.whenGET('app/components/owh-footer/footer.html').respond( $templateCache.get('app/components/owh-footer/footer.html'));
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 1111111111111111}});
        $httpBackend.whenGET('/yrbsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('jsons/conditions-ICD-10.json').respond({data: []});
        $httpBackend.whenGET('/brfsQuestionsTree').respond({data: { }});

        function searchResultsFn() {

        }
        filters= { selectedPrimaryFilter: {
            key: 'deaths', title: 'label.filter.mortality', primary: true, value: [], header:"Mortality",
            allFilters: [], searchResults: searchResultsFn, showMap:true,
            countLabel: 'Number of Deaths', mapData:{}, initiated:true,
            runOnFilterChange:true,
            sideFilters:[
                {
                    filterGroup: false, collapse: false, allowGrouping: true, groupBy:false,
                    filters: {key: 'race', title: 'label.filter.race', queryKey:"race", primary: false, value: [], groupBy: 'row',
                        type:"label.filter.group.demographics", showChart: true, defaultGroup:"column",
                        autoCompleteOptions: []}
                },
                {
                    filterGroup: false, collapse: true, allowGrouping: true,groupBy:true,
                    filters: {key: 'gender', title: 'label.filter.gender', queryKey:"sex", primary: false, value: [], groupBy: 'column',
                        type:"label.filter.group.demographics", groupByDefault: 'column', showChart: true,
                        autoCompleteOptions: [
                            {key:'F',title:'Female'},
                            {key:'M',title:'Male'}
                        ], defaultGroup:"column"
                    }
                }
            ]
        }
        };
    });


    it('Should have the controller', inject(function ($httpBackend, $location) {
        var bindings = { filters : filters };
        var ctrl = $componentController('owhSideFilter', null, bindings);
        expect(ctrl).toBeDefined();//<aside>
    }));

    it('Should getFilterOrder based on sort binding', function() {
        var sort = ['gender', 'race', 'height'];
        var bindings = {filters : filters, sort: sort};
        var ctrl = $componentController('owhSideFilter', {$scope: $scope}, bindings);
        expect(ctrl.getFilterOrder({filters: {key: 'race'}})).toEqual(1);
        expect(ctrl.getFilterOrder({filters: {key: 'height'}})).toEqual(2);
        expect(ctrl.getFilterOrder({filters: {key: 'iq'}})).toEqual(-1);
    });

    it('should get visibility based on showFilters', function() {
        var showFilters = ['year', 'gender'];
        var bindings = {filters: filters, showFilters: showFilters};
        var ctrl = $componentController('owhSideFilter', {$scope: $scope}, bindings);
        var filter = {filters: {key: 'year'}};
        expect(ctrl.isVisible(filter)).toEqual(true);
    });

    it('onFilterValueChange should not call onFilter or refreshFilterOptions when runFilterchange and refreshFiltersOnChange is false ', function() {
        var bindings = {filters : filters, onFilter: function(){}};
        bindings.filters.selectedPrimaryFilter.runOnFilterChange = false;

        var ctrl = $componentController('owhSideFilter', { $scope: $scope }, bindings);
        spyOn(ctrl, 'onFilter');
        spyOn(utilService, 'refreshFilterAndOptions');
        ctrl.onFilterValueChange({refreshFiltersOnChange: false, filters:{ value: []}}, {exclusive: false});

        expect(ctrl.onFilter).not.toHaveBeenCalled();
        expect(utilService.refreshFilterAndOptions).not.toHaveBeenCalled();
    });

    it('onFilterValueChange should call onFilter and refreshFilterOptions when runFilterchange and refreshFiltersOnChange is true ', function() {
        var bindings = {filters : filters, onFilter: function(){}, runOnFilterChange:true };

        var ctrl = $componentController('owhSideFilter', { $scope: $scope }, bindings);
        ctrl.refreshFilterOptions = function () {};
        spyOn(ctrl, 'onFilter');
        spyOn(utilService, 'refreshFilterAndOptions');
        ctrl.onFilterValueChange({refreshFiltersOnChange: true, filters:{ value: []}}, {exclusive: false});

        expect(ctrl.onFilter).toHaveBeenCalled();
        expect(utilService.refreshFilterAndOptions).toHaveBeenCalled();
    });
});
