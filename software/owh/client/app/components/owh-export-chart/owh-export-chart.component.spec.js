'use strict';

describe('Export chart component: ', function() {
    var $rootScope, $injector, $templateCache, $scope;
    var $httpBackend, $compile, $http, $componentController, shareUtilService;


    beforeEach(function() {
        module('owh');
        inject(function(_$rootScope_, _$state_, _$injector_, _$templateCache_,_$location_, _$compile_, _$http_, _$componentController_, _shareUtilService_ ) {
            $rootScope  = _$rootScope_;
            $injector   = _$injector_;
            $templateCache = _$templateCache_;
            $compile = _$compile_;
            $http = _$http_;
            $scope = $rootScope.$new();
            $httpBackend = $injector.get('$httpBackend');
            $componentController = _$componentController_;
            shareUtilService = _shareUtilService_;
        });
        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');
        $templateCache.put('app/components/owh-footer/footer.html', 'app/components/owh-footer/footer.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('app/components/owh-footer/footer.html').respond( $templateCache.get('app/components/owh-footer/footer.html'));
    });


    it('should export chart', inject(function ($httpBackend, $location) {
        var ctrl = $componentController('owhExportChart', null, {chart:'chart_0', charttitle:'chart title', chartdata: [{}], selectedfilterstxt: 'selected filters', primaryfilters: {}});
        var expChart = spyOn(shareUtilService, 'exportChart');
        ctrl.exportChart('PDF');
        expect(expChart).toHaveBeenCalledWith('chart_0', 'chart title', 'PDF', {}, {}, 'selected filters');
    }));

});
