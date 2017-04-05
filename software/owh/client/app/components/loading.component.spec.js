'use strict';

describe('Loading component: ', function() {
    var $rootScope, $injector, $templateCache, $scope;
    var $httpBackend, $compile, $http;


    beforeEach(function() {
        module('owh');
        inject(function(_$rootScope_, _$state_, _$injector_, _$templateCache_,_$location_, _$compile_, _$http_) {
            $rootScope  = _$rootScope_;
            $injector   = _$injector_;
            $templateCache = _$templateCache_;
            $compile = _$compile_;
            $http = _$http_;
            $scope = $rootScope.$new();
            $httpBackend = $injector.get('$httpBackend');
        });
        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');
        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 1111111111111111}});
        $httpBackend.whenGET('/yrbsQuestionsTree/2015').respond({data: { }});
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
    });


    it('Request is processing', inject(function ($httpBackend, $location) {
        var element = $compile('<div id="spindiv" data-loading></div>')($scope);
        $scope.$digest();
        expect($rootScope.requestProcessing).toEqual(true);
    }));

    it('Request is processed', inject(function ($httpBackend, $location) {
        $httpBackend.flush();
        var element = $compile('<div id="spindiv" data-loading></div>')($scope);
        $scope.isLoading = undefined;
        $scope.$digest();
        expect($rootScope.requestProcessing).toEqual(false);
    }));

});
