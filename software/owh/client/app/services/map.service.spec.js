'use strict';

describe('mapService', function(){
    var mapService, $rootScope, $scope, leafletData, deferred, $q, $httpBackend,
        $templateCache, shareUtilService;

    beforeEach(module('owh'));

    beforeEach(inject(function ($injector, _$rootScope_, _$q_, _$templateCache_) {
        mapService = $injector.get('mapService');
        leafletData = $injector.get('leafletData');
        shareUtilService = $injector.get('shareUtilService');
        $rootScope  = _$rootScope_;
        $scope = $rootScope.$new();
        $q = _$q_;
        deferred = $q.defer();
        $httpBackend = $injector.get('$httpBackend');
        $templateCache = _$templateCache_;
        mapService.shareUtilService = shareUtilService;

        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');
        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 1111111111111111}});
        $httpBackend.whenGET('/yrbsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
    }));

    describe('test map custom controls', function() {
        it('should add custom legend', function () {
            var mapData = {mapMinValue:40289400, mapMaxValue:58000};
            var control = mapService.addScaleControl(mapData);
            //test callback
            var mapControl = new control();
            expect(mapControl.options.position).toEqual('bottomleft');
            mapControl.onAdd();
        });

        it('should trigger mouseover & mouseout event', function () {
            var mapData = {mapMinValue:40289400, mapMaxValue:58000};
            var control = mapService.addScaleControl(mapData);
            var mapControl = new control();

            var map = {_layers:[{options:{fillColor:'#190032'}, style:{color: 'black', fillOpacity: 0.7},
                setStyle:function (style) {this.style = style }},
                {options:{fillColor:'#3f007d'}, style:{color: 'black', fillOpacity: 0.7},
                    setStyle:function (style) { this.style = style }}]};

            var legend = mapControl.onAdd(map);

            //mouseover event
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('mouseover', true, true);
            legend.childNodes[0].childNodes[0].append = function (content) {};
            var legendInterval = legend.childNodes[0].childNodes[0].childNodes[0];
            legendInterval.dispatchEvent(evt);

            //style changed
            expect(map._layers[0].style).toEqual({"color":"#333333","weight":2.6,"opacity":1,"fillOpacity":0.9});
            //no style change
            expect(map._layers[1].style).toEqual({color: 'black', fillOpacity: 0.7});

            //mouseout event
            evt = document.createEvent('MouseEvents');
            evt.initEvent('mouseout', true, true);
            legendInterval.dispatchEvent(evt);
            //reset style
            expect(map._layers[0].style).toEqual({weight: 0.8, opacity: 1, color: 'black', fillOpacity: 0.7});

        });

        it('should add share control', function () {
            var mapData = {mapMinValue:40289400, mapMaxValue:58000};
            var control = mapService.addShareControl(mapData);
            var map = {zoomIn:function(){}, zoomOut:function(){},
                getSize:function(){return 12}, eachLayer:function(){}};

            var mapControl = new control();
            expect(mapControl.options.position).toEqual('topright');

            var shareControl = mapControl.onAdd();
            expect(shareControl.title).toEqual('label.share.on.fb');

            spyOn(leafletData, 'getMap').and.returnValue(deferred.promise);
            spyOn(shareUtilService, 'shareOnFb');

            shareControl.onclick();

            deferred.resolve(map);
            $scope.$apply();

        });

        it('should expand map', function () {
            var mapData = {mapData : {mapMinValue:40289400, mapMaxValue:58000}};
            //previous size
            var mapSize = {selectedMapSize:'small'};
            var map = {zoomIn:function(){}, zoomOut:function(){}};

            spyOn(leafletData, 'getMap').and.returnValue(deferred.promise);

            var control = mapService.addExpandControl(mapSize, mapData);
            var mapControl = new control();

            expect(mapControl.options.position).toEqual('topright');
            var expandControl = mapControl.onAdd();
            expandControl.onclick();
            deferred.resolve(map);
            $scope.$apply();
            //new size
            expect(mapSize.selectedMapSize).toEqual('big');
        });

        it('should collapse map', function () {
            var mapData = {mapData : {mapMinValue:40289400, mapMaxValue:58000}};
            //previous size
            var mapSize = {selectedMapSize:'big'};
            var map = {zoomIn:function(){}, zoomOut:function(){}};

            spyOn(leafletData, 'getMap').and.returnValue(deferred.promise);

            var control = mapService.addExpandControl(mapSize, mapData);
            var mapControl = new control();

            expect(mapControl.options.position).toEqual('topright');
            var expandControl = mapControl.onAdd();
            expandControl.onclick();
            deferred.resolve(map);
            $scope.$apply();
            //new size
            expect(mapSize.selectedMapSize).toEqual('small');
        });
    });
});
