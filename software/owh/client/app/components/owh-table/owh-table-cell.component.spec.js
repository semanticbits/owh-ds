'use strict';

describe('owhTableCell component: ', function() {
    var $rootScope, $injector, $templateCache, $scope;
    var $httpBackend, $compile, $http, $componentController;
    var element, scope;


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
            scope = $rootScope.$new();
            element = angular.element('<owh-table-cell cell="cell" row-index="rowIndex" col-index="colIndex" row="row" table-view="tableView"></owh-table-cell>');
            element = $compile(element)(scope);
        });
        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');
        $templateCache.put('app/components/owh-table/owhTableCell.html', 'app/components/owh-table/owhTableCell.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('app/components/owh-table/owhTableCell.html').respond( $templateCache.get('app/components/owh-table/owhTableCell.html'));
    });

    it('should getRateVisibility', function() {
        var bindings = {};
        var ctrl = $componentController('owhTableCell', null, bindings);

        var visible = ctrl.getRateVisibility('suppressed', 100);
        expect(visible).toEqual('suppressed');

        visible = ctrl.getRateVisibility(200, null);
        expect(visible).toEqual('na');

        visible = ctrl.getRateVisibility(14, 400000);
        expect(visible).toEqual('unreliable');

        visible = ctrl.getRateVisibility(24, 2400000);
        expect(visible).toEqual('visible');
    });
});

