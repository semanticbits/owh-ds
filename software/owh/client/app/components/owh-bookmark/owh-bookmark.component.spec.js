'use strict';
describe('bookmark component: ', function() {
    var $rootScope, $injector, $templateCache, $scope, $window;
    var $httpBackend, $compile, $http, $componentController;


    beforeEach(function() {
        module('owh', function($provide) {
            var mockedWindowObject = {sidebar: true, navigator:{userAgent:'Firefox'}};
            $provide.value('$window', mockedWindowObject);
        });

        inject(function(_$rootScope_, _$injector_, _$templateCache_,_$location_, _$compile_, _$http_, _$componentController_, _$window_ ) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $injector   = _$injector_;
            $templateCache = _$templateCache_;
            $compile = _$compile_;
            $http = _$http_;
            $httpBackend = $injector.get('$httpBackend');
            $componentController = _$componentController_;
        });
        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');
        $templateCache.put('app/components/owh-bookmark/bookmark.html', 'app/components/owh-bookmark/bookmark.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('app/components/owh-bookmark/bookmark.html').respond( $templateCache.get('app/components/owh-bookmark/bookmark.html'));
        $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 11111}});
        $httpBackend.whenGET('/yrbsQuestionsTree/2015').respond({data: { }});
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
    });


    it('should show bookmark button', inject(function () {
        var element = angular.element('<owh-bookmark table-view="number_of_deaths"></owh-bookmark>');
        element = $compile(element)($scope);
        $scope.$apply();
        var bookmarkBtn = element.find("#bookmark-button");
        expect(bookmarkBtn).toBeDefined();
    }));

    it('should have controller', inject(function () {
        var bindings = {tableView:'test'};
        var ctrl = $componentController('owhBookmark', {$scope: $scope}, bindings);
        expect(ctrl).toBeDefined();
    }));

    it('test isFirefoxBrowser', inject(function () {
        var bindings = {tableView:'test'};
        var ctrl = $componentController('owhBookmark', {$scope: $scope}, bindings);
        expect(ctrl).toBeDefined();
        expect(ctrl.isFirefoxBrowser()).toBeTruthy();
    }));

    it('test showBookmarkAlert', inject(function () {
        var bindings = {tableView:'test'};
        var ctrl = $componentController('owhBookmark', {$scope: $scope}, bindings);
        expect(ctrl).toBeDefined();
        ctrl.showBookmarkAlert()
    }));
});
