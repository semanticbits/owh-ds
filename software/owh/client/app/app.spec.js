'use strict';

describe('angular-ui-route', function() {

    var $rootScope, $state, $injector,$location,$templateCache, state_name = '/', $scope;
    var $httpBackend;

    beforeEach(function() {
        module('owh');
        inject(function(_$rootScope_, _$state_, _$injector_, _$templateCache_,_$location_) {
            $rootScope  = _$rootScope_;
            $state      = _$state_;
            $injector   = _$injector_;
            $location = _$location_;
            $templateCache = _$templateCache_;
            $scope = $rootScope.$new();
            $httpBackend = $injector.get('$httpBackend');
        });
        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');
        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 1111111111111111}});
        $httpBackend.whenGET('/yrbsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('jsons/conditions-ICD-10.json').respond({data: []});
    });
    describe('Testing success response ', function () {
        beforeEach(function() {

        });

        function goTo(url) {
            $location.url(url);
            $rootScope.$digest();
        }

        describe('when empty, ', function () {
            it('should go to the home page', function () {
                goTo('');
                $httpBackend.flush();
                expect($state.current.name).toEqual('home');
            });
        });
    });
});
