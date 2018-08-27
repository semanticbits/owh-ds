'use strict';

describe('owhToggleSwitch component: ', function() {
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
        $templateCache.put('app/partials/owh-toggle-switch/owhToggleSwitch.html', 'app/partials/owh-toggle-switch/owhToggleSwitch.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('app/partials/owh-toggle-switch/owhToggleSwitch.html').respond( $templateCache.get('app/partials/owh-toggle-switch/owhToggleSwitch.html'));
        $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 1111111111111111}});
        $httpBackend.whenGET('/yrbsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('/pramsBasicQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('/pramsAdvancesQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('jsons/ucd-conditions-ICD-10.json').respond({data: []});
        $httpBackend.whenGET('jsons/mcd-conditions-ICD-10.json').respond({data: []});
        $httpBackend.whenGET('/getGoogAnalyInfo').respond({data: { }});
        $httpBackend.whenGET('/brfsQuestionsTree/true').respond({data: { }});
        $httpBackend.whenGET('/brfsQuestionsTree/false').respond({data: { }});
    });


    it('Should call onChange on value change', inject(function ($httpBackend, $location) {
        var onChange =  jasmine.createSpy('searchResults');
        var bindings = {model:"modelValue", onChange:onChange};
        var ctrl = $componentController('owhToggleSwitch', {$scope: $scope}, bindings);
        expect(ctrl).toBeDefined();
        ctrl.model = "oldValue";
        $scope.$digest();
        ctrl.model = "newValue";
        $scope.$digest();
        expect(onChange).toHaveBeenCalled();
    }));

});

