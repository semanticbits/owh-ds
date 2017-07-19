
describe('OWH menu component: ', function() {
    var $rootScope, $injector, $templateCache, $scope;
    var $httpBackend, $compile, $http, $componentController;


    beforeEach(function() {
        module('owh');
        inject(function(_$rootScope_, _$state_, _$injector_, _$templateCache_,_$location_, _$compile_, _$http_, _$componentController_ ) {
            $rootScope  = _$rootScope_;
            $injector   = _$injector_;
            $templateCache = _$templateCache_;
            $compile = _$compile_;
            $http = _$http_;
            $scope = $rootScope.$new();
            $httpBackend = $injector.get('$httpBackend');
            $componentController = _$componentController_;
        });
        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');
        $templateCache.put('app/partials/home/home.html', 'app/partials/home/home.html');
        $templateCache.put('app/partials/owhSearch.html', 'app/partials/owhSearch.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('app/partials/owhSearch.html').respond( $templateCache.get('app/partials/owhSearch.html'));
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
    });

    it('Should have controller', inject(function ($httpBackend, $location) {
        var showMeOptions = {
            deaths: [{key: 'number_of_deaths', title: 'Number of Deaths'}]
        };
        var bindings = {showMeOptions:showMeOptions};
        var ctrl = $componentController('owhMenu', null, bindings);
        expect(ctrl).toBeDefined();
    }));

    it('show menu', inject(function ($httpBackend, $location) {
        var showMeOptions = {
            deaths: [{key: 'number_of_deaths', title: 'Number of Deaths'}]
        };
        var bindings = {showMeOptions:showMeOptions};
        var ctrl = $componentController('owhMenu', null, bindings);
        ctrl.showMenu();
        expect(ctrl.displayMenu).toEqual(true);
    }));

    it('show showCategory', inject(function ($httpBackend, $location) {
        var showMeOptions = {
            deaths: [{key: 'number_of_deaths', title: 'Number of Deaths'}]
        };
        var bindings = {showMeOptions:showMeOptions};
        var ctrl = $componentController('owhMenu', null, bindings);
        ctrl.showCategory();
        expect(ctrl.displayCategory).toEqual(true);
    }));

    it("goForward", function () {
        var fwd = spyOn(history, 'forward');
        var ctrl = $componentController('owhMenu', null, {});
        ctrl.goForward();
        expect(fwd).toHaveBeenCalled();
    });

    it("goBackward", function () {
        var back = spyOn(history, 'back');
        var ctrl = $componentController('owhMenu', null, {});
        ctrl.goBackward();
        expect(back).toHaveBeenCalled();
    });

    it("should updateGroupByFilter", function () {
        var searchResults =  jasmine.createSpy('searchResults');
        var filter = {groupBy:false, defaultGroup:'column'};
        var bindings = { searchResults:searchResults, tableView: 'crude_death_rates' };
        var ctrl = $componentController('owhMenu', null, bindings);
        ctrl.updateGroupByFilter(filter);
        expect(filter.groupBy).toEqual("column");

        ctrl.updateGroupByFilter(filter);
        expect(filter.groupBy).toEqual(false);

    });

    it("should updateGroupByFilter", function () {
        var onPrimaryFilter =  jasmine.createSpy('onPrimaryFilter');
        var bindings = { onPrimaryFilter:onPrimaryFilter, tableView: 'crude_death_rates' };
        var ctrl = $componentController('owhMenu', null, bindings);
        ctrl.changeFilter();
        expect(onPrimaryFilter).toHaveBeenCalled();
    });

    it('Should call groupByFiltersUpdated function', inject(function ($httpBackend, $location) {
        var searchResults =  jasmine.createSpy('searchResults');
        var allMortalityFilters = [
            {key: 'agegroup', title: 'label.filter.agegroup', queryKey:"age_5_interval",
                primary: false, value: [], groupBy: false, type:"label.filter.group.demographics",
                filterType: 'slider', autoCompleteOptions: [], showChart: true,
                sliderOptions: [], sliderValue: '-5;105', timer: undefined, defaultGroup:"row"},
            {key: 'hispanicOrigin', title: 'label.filter.hispanicOrigin', queryKey:"hispanic_origin",
                primary: false, value: [], groupBy: false, type:"label.filter.group.demographics",
                autoCompleteOptions: [], defaultGroup:"row"}
        ];

        var showMeOptions = {
            deaths: [{key: 'crude_death_rates', title: 'Crude Death Rates'}]
        };
        var filters= {selectedPrimaryFilter: {
            key: 'deaths', title: 'label.filter.mortality', primary: true, value: [allMortalityFilters[0]], header:"Mortality",
            allFilters: allMortalityFilters, searchResults: [], showMap:true,
            countLabel: 'Number of Deaths', mapData:{}, initiated:true ,
            tableView:'number_of_deaths'}
        };


        var bindings = { showMeOptions:showMeOptions, selectedFilter:filters.selectedPrimaryFilter,
            searchResults:searchResults, tableView: 'crude_death_rates' };
        var ctrl = $componentController('owhMenu', null, bindings);
        ctrl.$onChanges();
        expect(ctrl).toBeDefined();
        ctrl.groupByFiltersUpdated(true);
        expect(searchResults).toHaveBeenCalled();

       var titles = ctrl.getSelectedFilterTitles();

        expect(titles[0]).toEqual('label.filter.agegroup');
        expect(titles[1]).toEqual('label.filter.hispanicOrigin');
    }));
});