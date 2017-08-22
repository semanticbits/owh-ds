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
        $httpBackend.whenGET('jsons/conditions-ICD-10.json').respond({data: []});
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
            var legendInterval = legend.childNodes[0].childNodes[0].childNodes[0];
            legendInterval.dispatchEvent(evt);

            //style changed
            expect(map._layers[0].style).toEqual({"color":"#333333","weight":2.6,"opacity":1,"fillOpacity":0.9});
            //no style change for polygon which does not match event target
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

        it('should calculate rates for crude death rates', inject(function ($rootScope, utilService){
            var primaryFilters = {"tableView":"crude_death_rates", "key":"deaths","title":"label.filter.mortality","primary":true, "mapData": {}, "value":[{"key":"year","title":"label.filter.year","queryKey":"current_year","primary":false,"value":["2015"],"groupBy":false,"type":"label.filter.group.year.month","filterType":"checkbox","autoCompleteOptions":[{"key":"2015","title":"2015"},{"key":"2014","title":"2014"},{"key":"2013","title":"2013"},{"key":"2012","title":"2012"},{"key":"2011","title":"2011"},{"key":"2010","title":"2010"},{"key":"2009","title":"2009"},{"key":"2008","title":"2008"},{"key":"2007","title":"2007"},{"key":"2006","title":"2006"},{"key":"2005","title":"2005"},{"key":"2004","title":"2004"},{"key":"2003","title":"2003"},{"key":"2002","title":"2002"},{"key":"2001","title":"2001"},{"key":"2000","title":"2000"}],"defaultGroup":"row","helpText":"label.help.text.mortality.year"}]};
            var mapResponseData = {"states":[{"name":"AK","deaths":4316,"sex":[{"name":"Female","deaths":1866,"pop":349407},{"name":"Male","deaths":2450,"pop":389025}],"pop":738432},{"name":"AL","deaths":51909,"sex":[{"name":"Female","deaths":25306,"pop":2505795},{"name":"Male","deaths":26603,"pop":2353184}],"pop":4858979},{"name":"AR","deaths":31617,"sex":[{"name":"Female","deaths":15304,"pop":1515348},{"name":"Male","deaths":16313,"pop":1462856}],"pop":2978204},{"name":"AZ","deaths":54299,"sex":[{"name":"Female","deaths":25401,"pop":3436575},{"name":"Male","deaths":28898,"pop":3391490}],"pop":6828065},{"name":"CA","deaths":259206,"sex":[{"name":"Female","deaths":126124,"pop":19701750},{"name":"Male","deaths":133082,"pop":19443068}],"pop":39144818},{"name":"CO","deaths":36349,"sex":[{"name":"Female","deaths":17659,"pop":2712811},{"name":"Male","deaths":18690,"pop":2743763}],"pop":5456574},{"name":"CT","deaths":30535,"sex":[{"name":"Female","deaths":15870,"pop":1839139},{"name":"Male","deaths":14665,"pop":1751747}],"pop":3590886},{"name":"DC","deaths":4871,"sex":[{"name":"Female","deaths":2375,"pop":353627},{"name":"Male","deaths":2496,"pop":318601}],"pop":672228},{"name":"DE","deaths":8582,"sex":[{"name":"Female","deaths":4208,"pop":488125},{"name":"Male","deaths":4374,"pop":457809}],"pop":945934},{"name":"FL","deaths":191737,"sex":[{"name":"Female","deaths":90998,"pop":10368733},{"name":"Male","deaths":100739,"pop":9902539}],"pop":20271272},{"name":"GA","deaths":79942,"sex":[{"name":"Female","deaths":39415,"pop":5234978},{"name":"Male","deaths":40527,"pop":4979882}],"pop":10214860},{"name":"HI","deaths":11053,"sex":[{"name":"Female","deaths":5243,"pop":706231},{"name":"Male","deaths":5810,"pop":725372}],"pop":1431603},{"name":"IA","deaths":29600,"sex":[{"name":"Female","deaths":15036,"pop":1571873},{"name":"Male","deaths":14564,"pop":1552026}],"pop":3123899},{"name":"ID","deaths":13026,"sex":[{"name":"Female","deaths":6176,"pop":826183},{"name":"Male","deaths":6850,"pop":828747}],"pop":1654930},{"name":"IL","deaths":106872,"sex":[{"name":"Female","deaths":53990,"pop":6545500},{"name":"Male","deaths":52882,"pop":6314495}],"pop":12859995},{"name":"IN","deaths":62713,"sex":[{"name":"Female","deaths":31423,"pop":3357815},{"name":"Male","deaths":31290,"pop":3261865}],"pop":6619680},{"name":"KS","deaths":26664,"sex":[{"name":"Female","deaths":13451,"pop":1458008},{"name":"Male","deaths":13213,"pop":1453633}],"pop":2911641},{"name":"KY","deaths":46564,"sex":[{"name":"Female","deaths":22577,"pop":2245998},{"name":"Male","deaths":23987,"pop":2179094}],"pop":4425092},{"name":"LA","deaths":43716,"sex":[{"name":"Female","deaths":20880,"pop":2386915},{"name":"Male","deaths":22836,"pop":2283809}],"pop":4670724},{"name":"MA","deaths":57806,"sex":[{"name":"Female","deaths":29895,"pop":3498304},{"name":"Male","deaths":27911,"pop":3296118}],"pop":6794422},{"name":"MD","deaths":47247,"sex":[{"name":"Female","deaths":23489,"pop":3095316},{"name":"Male","deaths":23758,"pop":2911085}],"pop":6006401},{"name":"ME","deaths":14479,"sex":[{"name":"Female","deaths":7268,"pop":678071},{"name":"Male","deaths":7211,"pop":651257}],"pop":1329328},{"name":"MI","deaths":95140,"sex":[{"name":"Female","deaths":47515,"pop":5044428},{"name":"Male","deaths":47625,"pop":4878148}],"pop":9922576},{"name":"MN","deaths":42800,"sex":[{"name":"Female","deaths":21704,"pop":2759730},{"name":"Male","deaths":21096,"pop":2729864}],"pop":5489594},{"name":"MO","deaths":59871,"sex":[{"name":"Female","deaths":29488,"pop":3098627},{"name":"Male","deaths":30383,"pop":2985045}],"pop":6083672},{"name":"MS","deaths":31783,"sex":[{"name":"Female","deaths":15395,"pop":1540483},{"name":"Male","deaths":16388,"pop":1451850}],"pop":2992333},{"name":"MT","deaths":9942,"sex":[{"name":"Female","deaths":4688,"pop":513619},{"name":"Male","deaths":5254,"pop":519330}],"pop":1032949},{"name":"NC","deaths":89133,"sex":[{"name":"Female","deaths":44589,"pop":5150777},{"name":"Male","deaths":44544,"pop":4892025}],"pop":10042802},{"name":"ND","deaths":6223,"sex":[{"name":"Female","deaths":3038,"pop":368074},{"name":"Male","deaths":3185,"pop":388853}],"pop":756927},{"name":"NE","deaths":16740,"sex":[{"name":"Female","deaths":8414,"pop":951022},{"name":"Male","deaths":8326,"pop":945168}],"pop":1896190},{"name":"NH","deaths":11984,"sex":[{"name":"Female","deaths":5982,"pop":672952},{"name":"Male","deaths":6002,"pop":657656}],"pop":1330608},{"name":"NJ","deaths":72271,"sex":[{"name":"Female","deaths":37151,"pop":4585897},{"name":"Male","deaths":35120,"pop":4372116}],"pop":8958013},{"name":"NM","deaths":17685,"sex":[{"name":"Female","deaths":8155,"pop":1051688},{"name":"Male","deaths":9530,"pop":1033421}],"pop":2085109},{"name":"NV","deaths":22879,"sex":[{"name":"Female","deaths":10424,"pop":1440294},{"name":"Male","deaths":12455,"pop":1450551}],"pop":2890845},{"name":"NY","deaths":153628,"sex":[{"name":"Female","deaths":78530,"pop":10184278},{"name":"Male","deaths":75098,"pop":9611513}],"pop":19795791},{"name":"OH","deaths":118188,"sex":[{"name":"Female","deaths":59692,"pop":5926893},{"name":"Male","deaths":58496,"pop":5686530}],"pop":11613423},{"name":"OK","deaths":39422,"sex":[{"name":"Female","deaths":19045,"pop":1974214},{"name":"Male","deaths":20377,"pop":1937124}],"pop":3911338},{"name":"OR","deaths":35705,"sex":[{"name":"Female","deaths":17698,"pop":2035807},{"name":"Male","deaths":18007,"pop":1993170}],"pop":4028977},{"name":"PA","deaths":132598,"sex":[{"name":"Female","deaths":67475,"pop":6538129},{"name":"Male","deaths":65123,"pop":6264374}],"pop":12802503},{"name":"RI","deaths":10163,"sex":[{"name":"Female","deaths":5265,"pop":544349},{"name":"Male","deaths":4898,"pop":511949}],"pop":1056298},{"name":"SC","deaths":47198,"sex":[{"name":"Female","deaths":22977,"pop":2517178},{"name":"Male","deaths":24221,"pop":2378968}],"pop":4896146},{"name":"SD","deaths":7731,"sex":[{"name":"Female","deaths":3763,"pop":426493},{"name":"Male","deaths":3968,"pop":431976}],"pop":858469},{"name":"TN","deaths":66570,"sex":[{"name":"Female","deaths":32837,"pop":3382838},{"name":"Male","deaths":33733,"pop":3217461}],"pop":6600299},{"name":"TX","deaths":189654,"sex":[{"name":"Female","deaths":91535,"pop":13831324},{"name":"Male","deaths":98119,"pop":13637790}],"pop":27469114},{"name":"UT","deaths":17334,"sex":[{"name":"Female","deaths":8462,"pop":1488819},{"name":"Male","deaths":8872,"pop":1507100}],"pop":2995919},{"name":"VA","deaths":65577,"sex":[{"name":"Female","deaths":32737,"pop":4258228},{"name":"Male","deaths":32840,"pop":4124765}],"pop":8382993},{"name":"VT","deaths":5919,"sex":[{"name":"Female","deaths":2961,"pop":317516},{"name":"Male","deaths":2958,"pop":308526}],"pop":626042},{"name":"WA","deaths":54595,"sex":[{"name":"Female","deaths":26792,"pop":3585353},{"name":"Male","deaths":27803,"pop":3584998}],"pop":7170351},{"name":"WI","deaths":51264,"sex":[{"name":"Female","deaths":25564,"pop":2903737},{"name":"Male","deaths":25700,"pop":2867600}],"pop":5771337},{"name":"WV","deaths":22752,"sex":[{"name":"Female","deaths":11168,"pop":933068},{"name":"Male","deaths":11584,"pop":911060}],"pop":1844128},{"name":"WY","deaths":4778,"sex":[{"name":"Female","deaths":2228,"pop":287206},{"name":"Male","deaths":2550,"pop":298901}],"pop":586107}]};
            var mapOption = {selectedMapSize:'big'};
            spyOn(utilService, 'getMinAndMaxValue').and.returnValue({"minValue":4316,"maxValue":259206});
            mapService.updateStatesDeaths(primaryFilters, mapResponseData, primaryFilters.searchCount, mapOption);
            expect($rootScope.states.features.length).not.toBeUndefined();
            expect($rootScope.states.features[0].properties.name).toEqual("Arkansas");
            expect($rootScope.states.features[0].properties.abbreviation).toEqual("AR");
            expect($rootScope.states.features[0].properties.rate).toEqual(1061.6);
            expect($rootScope.states.features[0].properties.sex[0].name).toEqual("Female");
            expect($rootScope.states.features[0].properties.sex[0].deaths).toEqual(15304);
            expect($rootScope.states.features[0].properties.sex[0].pop).toEqual(1515348);
            expect($rootScope.states.features[0].properties.sex[0].rate).toEqual("1,009.9");
            expect($rootScope.states.features[0].properties.sex[1].name).toEqual("Male");
            expect($rootScope.states.features[0].properties.sex[1].deaths).toEqual(16313);
            expect($rootScope.states.features[0].properties.sex[1].pop).toEqual(1462856);
            expect($rootScope.states.features[0].properties.sex[1].rate).toEqual("1,115.1");
            expect($rootScope.states.features[0].properties.tableView).toEqual("crude_death_rates");
            expect($rootScope.states.features[0].properties.deaths).toEqual(31617);
        }));

        it('should display rates for age adjusted rates', inject(function ($rootScope, utilService){
            var primaryFilters = {"tableView":"age-adjusted_death_rates", "key":"deaths","title":"label.filter.mortality","primary":true, "mapData": {}, "value":[{"key":"year","title":"label.filter.year","queryKey":"current_year","primary":false,"value":["2015"],"groupBy":false,"type":"label.filter.group.year.month","filterType":"checkbox","autoCompleteOptions":[{"key":"2015","title":"2015"},{"key":"2014","title":"2014"},{"key":"2013","title":"2013"},{"key":"2012","title":"2012"},{"key":"2011","title":"2011"},{"key":"2010","title":"2010"},{"key":"2009","title":"2009"},{"key":"2008","title":"2008"},{"key":"2007","title":"2007"},{"key":"2006","title":"2006"},{"key":"2005","title":"2005"},{"key":"2004","title":"2004"},{"key":"2003","title":"2003"},{"key":"2002","title":"2002"},{"key":"2001","title":"2001"},{"key":"2000","title":"2000"}],"defaultGroup":"row","helpText":"label.help.text.mortality.year"}]};
            var mapResponseData = {"states":[{"name":"AK","deaths":4316,"sex":[{"name":"Female","deaths":1866,"pop":349407,"ageAdjustedRate":"637.7","standardPop":349407},{"name":"Male","deaths":2450,"pop":389025,"ageAdjustedRate":"859.3","standardPop":389025}],"pop":738432,"ageAdjustedRate":"747.4","standardPop":738432},{"name":"AL","deaths":51909,"sex":[{"name":"Female","deaths":25306,"pop":2505795,"ageAdjustedRate":"776.5","standardPop":2505795},{"name":"Male","deaths":26603,"pop":2353184,"ageAdjustedRate":"1,108.6","standardPop":2353184}],"pop":4858979,"ageAdjustedRate":"924.5","standardPop":4858979},{"name":"AR","deaths":31617,"sex":[{"name":"Female","deaths":15304,"pop":1515348,"ageAdjustedRate":"766.9","standardPop":1515348},{"name":"Male","deaths":16313,"pop":1462856,"ageAdjustedRate":"1,056.9","standardPop":1462856}],"pop":2978204,"ageAdjustedRate":"901.8","standardPop":2978204},{"name":"AZ","deaths":54299,"sex":[{"name":"Female","deaths":25401,"pop":3436575,"ageAdjustedRate":"568.2","standardPop":3436575},{"name":"Male","deaths":28898,"pop":3391490,"ageAdjustedRate":"785.9","standardPop":3391490}],"pop":6828065,"ageAdjustedRate":"671.8","standardPop":6828065},{"name":"CA","deaths":259206,"sex":[{"name":"Female","deaths":126124,"pop":19701750,"ageAdjustedRate":"526.5","standardPop":19701750},{"name":"Male","deaths":133082,"pop":19443068,"ageAdjustedRate":"734.4","standardPop":19443068}],"pop":39144818,"ageAdjustedRate":"621.6","standardPop":39144818},{"name":"CO","deaths":36349,"sex":[{"name":"Female","deaths":17659,"pop":2712811,"ageAdjustedRate":"572.6","standardPop":2712811},{"name":"Male","deaths":18690,"pop":2743763,"ageAdjustedRate":"772.8","standardPop":2743763}],"pop":5456574,"ageAdjustedRate":"665.0","standardPop":5456574},{"name":"CT","deaths":30535,"sex":[{"name":"Female","deaths":15870,"pop":1839139,"ageAdjustedRate":"562.6","standardPop":1839139},{"name":"Male","deaths":14665,"pop":1751747,"ageAdjustedRate":"771.3","standardPop":1751747}],"pop":3590886,"ageAdjustedRate":"656.1","standardPop":3590886},{"name":"DC","deaths":4871,"sex":[{"name":"Female","deaths":2375,"pop":353627,"ageAdjustedRate":"616.0","standardPop":353627},{"name":"Male","deaths":2496,"pop":318601,"ageAdjustedRate":"921.3","standardPop":318601}],"pop":672228,"ageAdjustedRate":"748.6","standardPop":672228},{"name":"DE","deaths":8582,"sex":[{"name":"Female","deaths":4208,"pop":488125,"ageAdjustedRate":"633.5","standardPop":488125},{"name":"Male","deaths":4374,"pop":457809,"ageAdjustedRate":"870.5","standardPop":457809}],"pop":945934,"ageAdjustedRate":"741.5","standardPop":945934},{"name":"FL","deaths":191737,"sex":[{"name":"Female","deaths":90998,"pop":10368733,"ageAdjustedRate":"549.0","standardPop":10368733},{"name":"Male","deaths":100739,"pop":9902539,"ageAdjustedRate":"793.6","standardPop":9902539}],"pop":20271272,"ageAdjustedRate":"662.9","standardPop":20271272},{"name":"GA","deaths":79942,"sex":[{"name":"Female","deaths":39415,"pop":5234978,"ageAdjustedRate":"694.2","standardPop":5234978},{"name":"Male","deaths":40527,"pop":4979882,"ageAdjustedRate":"947.9","standardPop":4979882}],"pop":10214860,"ageAdjustedRate":"808.1","standardPop":10214860},{"name":"HI","deaths":11053,"sex":[{"name":"Female","deaths":5243,"pop":706231,"ageAdjustedRate":"476.2","standardPop":706231},{"name":"Male","deaths":5810,"pop":725372,"ageAdjustedRate":"720.7","standardPop":725372}],"pop":1431603,"ageAdjustedRate":"588.2","standardPop":1431603},{"name":"IA","deaths":29600,"sex":[{"name":"Female","deaths":15036,"pop":1571873,"ageAdjustedRate":"618.2","standardPop":1571873},{"name":"Male","deaths":14564,"pop":1552026,"ageAdjustedRate":"857.0","standardPop":1552026}],"pop":3123899,"ageAdjustedRate":"724.6","standardPop":3123899},{"name":"ID","deaths":13026,"sex":[{"name":"Female","deaths":6176,"pop":826183,"ageAdjustedRate":"624.2","standardPop":826183},{"name":"Male","deaths":6850,"pop":828747,"ageAdjustedRate":"842.7","standardPop":828747}],"pop":1654930,"ageAdjustedRate":"727.8","standardPop":1654930},{"name":"IL","deaths":106872,"sex":[{"name":"Female","deaths":53990,"pop":6545500,"ageAdjustedRate":"621.4","standardPop":6545500},{"name":"Male","deaths":52882,"pop":6314495,"ageAdjustedRate":"860.9","standardPop":6314495}],"pop":12859995,"ageAdjustedRate":"728.3","standardPop":12859995},{"name":"IN","deaths":62713,"sex":[{"name":"Female","deaths":31423,"pop":3357815,"ageAdjustedRate":"715.6","standardPop":3357815},{"name":"Male","deaths":31290,"pop":3261865,"ageAdjustedRate":"977.5","standardPop":3261865}],"pop":6619680,"ageAdjustedRate":"833.9","standardPop":6619680},{"name":"KS","deaths":26664,"sex":[{"name":"Female","deaths":13451,"pop":1458008,"ageAdjustedRate":"668.3","standardPop":1458008},{"name":"Male","deaths":13213,"pop":1453633,"ageAdjustedRate":"900.5","standardPop":1453633}],"pop":2911641,"ageAdjustedRate":"774.1","standardPop":2911641},{"name":"KY","deaths":46564,"sex":[{"name":"Female","deaths":22577,"pop":2245998,"ageAdjustedRate":"782.0","standardPop":2245998},{"name":"Male","deaths":23987,"pop":2179094,"ageAdjustedRate":"1,097.9","standardPop":2179094}],"pop":4425092,"ageAdjustedRate":"924.7","standardPop":4425092},{"name":"LA","deaths":43716,"sex":[{"name":"Female","deaths":20880,"pop":2386915,"ageAdjustedRate":"730.7","standardPop":2386915},{"name":"Male","deaths":22836,"pop":2283809,"ageAdjustedRate":"1,046.2","standardPop":2283809}],"pop":4670724,"ageAdjustedRate":"874.2","standardPop":4670724},{"name":"MA","deaths":57806,"sex":[{"name":"Female","deaths":29895,"pop":3498304,"ageAdjustedRate":"581.5","standardPop":3498304},{"name":"Male","deaths":27911,"pop":3296118,"ageAdjustedRate":"814.8","standardPop":3296118}],"pop":6794422,"ageAdjustedRate":"684.8","standardPop":6794422},{"name":"MD","deaths":47247,"sex":[{"name":"Female","deaths":23489,"pop":3095316,"ageAdjustedRate":"594.8","standardPop":3095316},{"name":"Male","deaths":23758,"pop":2911085,"ageAdjustedRate":"843.4","standardPop":2911085}],"pop":6006401,"ageAdjustedRate":"705.7","standardPop":6006401},{"name":"ME","deaths":14479,"sex":[{"name":"Female","deaths":7268,"pop":678071,"ageAdjustedRate":"670.7","standardPop":678071},{"name":"Male","deaths":7211,"pop":651257,"ageAdjustedRate":"916.4","standardPop":651257}],"pop":1329328,"ageAdjustedRate":"783.5","standardPop":1329328},{"name":"MI","deaths":95140,"sex":[{"name":"Female","deaths":47515,"pop":5044428,"ageAdjustedRate":"673.0","standardPop":5044428},{"name":"Male","deaths":47625,"pop":4878148,"ageAdjustedRate":"919.1","standardPop":4878148}],"pop":9922576,"ageAdjustedRate":"784.4","standardPop":9922576},{"name":"MN","deaths":42800,"sex":[{"name":"Female","deaths":21704,"pop":2759730,"ageAdjustedRate":"564.8","standardPop":2759730},{"name":"Male","deaths":21096,"pop":2729864,"ageAdjustedRate":"760.1","standardPop":2729864}],"pop":5489594,"ageAdjustedRate":"653.8","standardPop":5489594},{"name":"MO","deaths":59871,"sex":[{"name":"Female","deaths":29488,"pop":3098627,"ageAdjustedRate":"692.2","standardPop":3098627},{"name":"Male","deaths":30383,"pop":2985045,"ageAdjustedRate":"968.6","standardPop":2985045}],"pop":6083672,"ageAdjustedRate":"816.9","standardPop":6083672},{"name":"MS","deaths":31783,"sex":[{"name":"Female","deaths":15395,"pop":1540483,"ageAdjustedRate":"802.5","standardPop":1540483},{"name":"Male","deaths":16388,"pop":1451850,"ageAdjustedRate":"1,165.0","standardPop":1451850}],"pop":2992333,"ageAdjustedRate":"963.7","standardPop":2992333},{"name":"MT","deaths":9942,"sex":[{"name":"Female","deaths":4688,"pop":513619,"ageAdjustedRate":"649.5","standardPop":513619},{"name":"Male","deaths":5254,"pop":519330,"ageAdjustedRate":"886.9","standardPop":519330}],"pop":1032949,"ageAdjustedRate":"762.7","standardPop":1032949},{"name":"NC","deaths":89133,"sex":[{"name":"Female","deaths":44589,"pop":5150777,"ageAdjustedRate":"676.8","standardPop":5150777},{"name":"Male","deaths":44544,"pop":4892025,"ageAdjustedRate":"928.7","standardPop":4892025}],"pop":10042802,"ageAdjustedRate":"789.9","standardPop":10042802},{"name":"ND","deaths":6223,"sex":[{"name":"Female","deaths":3038,"pop":368074,"ageAdjustedRate":"586.9","standardPop":368074},{"name":"Male","deaths":3185,"pop":388853,"ageAdjustedRate":"825.6","standardPop":388853}],"pop":756927,"ageAdjustedRate":"696.8","standardPop":756927},{"name":"NE","deaths":16740,"sex":[{"name":"Female","deaths":8414,"pop":951022,"ageAdjustedRate":"633.0","standardPop":951022},{"name":"Male","deaths":8326,"pop":945168,"ageAdjustedRate":"867.4","standardPop":945168}],"pop":1896190,"ageAdjustedRate":"739.2","standardPop":1896190},{"name":"NH","deaths":11984,"sex":[{"name":"Female","deaths":5982,"pop":672952,"ageAdjustedRate":"618.8","standardPop":672952},{"name":"Male","deaths":6002,"pop":657656,"ageAdjustedRate":"841.6","standardPop":657656}],"pop":1330608,"ageAdjustedRate":"720.6","standardPop":1330608},{"name":"NJ","deaths":72271,"sex":[{"name":"Female","deaths":37151,"pop":4585897,"ageAdjustedRate":"568.5","standardPop":4585897},{"name":"Male","deaths":35120,"pop":4372116,"ageAdjustedRate":"789.3","standardPop":4372116}],"pop":8958013,"ageAdjustedRate":"666.0","standardPop":8958013},{"name":"NM","deaths":17685,"sex":[{"name":"Female","deaths":8155,"pop":1051688,"ageAdjustedRate":"610.1","standardPop":1051688},{"name":"Male","deaths":9530,"pop":1033421,"ageAdjustedRate":"886.8","standardPop":1033421}],"pop":2085109,"ageAdjustedRate":"741.5","standardPop":2085109},{"name":"NV","deaths":22879,"sex":[{"name":"Female","deaths":10424,"pop":1440294,"ageAdjustedRate":"647.8","standardPop":1440294},{"name":"Male","deaths":12455,"pop":1450551,"ageAdjustedRate":"874.9","standardPop":1450551}],"pop":2890845,"ageAdjustedRate":"757.2","standardPop":2890845},{"name":"NY","deaths":153628,"sex":[{"name":"Female","deaths":78530,"pop":10184278,"ageAdjustedRate":"547.0","standardPop":10184278},{"name":"Male","deaths":75098,"pop":9611513,"ageAdjustedRate":"767.7","standardPop":9611513}],"pop":19795791,"ageAdjustedRate":"644.0","standardPop":19795791},{"name":"OH","deaths":118188,"sex":[{"name":"Female","deaths":59692,"pop":5926893,"ageAdjustedRate":"711.7","standardPop":5926893},{"name":"Male","deaths":58496,"pop":5686530,"ageAdjustedRate":"970.5","standardPop":5686530}],"pop":11613423,"ageAdjustedRate":"828.4","standardPop":11613423},{"name":"OK","deaths":39422,"sex":[{"name":"Female","deaths":19045,"pop":1974214,"ageAdjustedRate":"772.5","standardPop":1974214},{"name":"Male","deaths":20377,"pop":1937124,"ageAdjustedRate":"1,058.2","standardPop":1937124}],"pop":3911338,"ageAdjustedRate":"904.3","standardPop":3911338},{"name":"OR","deaths":35705,"sex":[{"name":"Female","deaths":17698,"pop":2035807,"ageAdjustedRate":"626.8","standardPop":2035807},{"name":"Male","deaths":18007,"pop":1993170,"ageAdjustedRate":"831.2","standardPop":1993170}],"pop":4028977,"ageAdjustedRate":"722.3","standardPop":4028977},{"name":"PA","deaths":132598,"sex":[{"name":"Female","deaths":67475,"pop":6538129,"ageAdjustedRate":"650.5","standardPop":6538129},{"name":"Male","deaths":65123,"pop":6264374,"ageAdjustedRate":"914.3","standardPop":6264374}],"pop":12802503,"ageAdjustedRate":"768.3","standardPop":12802503},{"name":"RI","deaths":10163,"sex":[{"name":"Female","deaths":5265,"pop":544349,"ageAdjustedRate":"604.8","standardPop":544349},{"name":"Male","deaths":4898,"pop":511949,"ageAdjustedRate":"874.6","standardPop":511949}],"pop":1056298,"ageAdjustedRate":"721.9","standardPop":1056298},{"name":"SC","deaths":47198,"sex":[{"name":"Female","deaths":22977,"pop":2517178,"ageAdjustedRate":"711.8","standardPop":2517178},{"name":"Male","deaths":24221,"pop":2378968,"ageAdjustedRate":"991.1","standardPop":2378968}],"pop":4896146,"ageAdjustedRate":"840.0","standardPop":4896146},{"name":"SD","deaths":7731,"sex":[{"name":"Female","deaths":3763,"pop":426493,"ageAdjustedRate":"597.7","standardPop":426493},{"name":"Male","deaths":3968,"pop":431976,"ageAdjustedRate":"855.7","standardPop":431976}],"pop":858469,"ageAdjustedRate":"715.4","standardPop":858469},{"name":"TN","deaths":66570,"sex":[{"name":"Female","deaths":32837,"pop":3382838,"ageAdjustedRate":"759.7","standardPop":3382838},{"name":"Male","deaths":33733,"pop":3217461,"ageAdjustedRate":"1,038.3","standardPop":3217461}],"pop":6600299,"ageAdjustedRate":"886.4","standardPop":6600299},{"name":"TX","deaths":189654,"sex":[{"name":"Female","deaths":91535,"pop":13831324,"ageAdjustedRate":"637.7","standardPop":13831324},{"name":"Male","deaths":98119,"pop":13637790,"ageAdjustedRate":"871.1","standardPop":13637790}],"pop":27469114,"ageAdjustedRate":"745.0","standardPop":27469114},{"name":"UT","deaths":17334,"sex":[{"name":"Female","deaths":8462,"pop":1488819,"ageAdjustedRate":"640.0","standardPop":1488819},{"name":"Male","deaths":8872,"pop":1507100,"ageAdjustedRate":"790.4","standardPop":1507100}],"pop":2995919,"ageAdjustedRate":"712.1","standardPop":2995919},{"name":"VA","deaths":65577,"sex":[{"name":"Female","deaths":32737,"pop":4258228,"ageAdjustedRate":"622.6","standardPop":4258228},{"name":"Male","deaths":32840,"pop":4124765,"ageAdjustedRate":"840.2","standardPop":4124765}],"pop":8382993,"ageAdjustedRate":"721.6","standardPop":8382993},{"name":"VT","deaths":5919,"sex":[{"name":"Female","deaths":2961,"pop":317516,"ageAdjustedRate":"609.3","standardPop":317516},{"name":"Male","deaths":2958,"pop":308526,"ageAdjustedRate":"837.2","standardPop":308526}],"pop":626042,"ageAdjustedRate":"714.7","standardPop":626042},{"name":"WA","deaths":54595,"sex":[{"name":"Female","deaths":26792,"pop":3585353,"ageAdjustedRate":"592.9","standardPop":3585353},{"name":"Male","deaths":27803,"pop":3584998,"ageAdjustedRate":"798.1","standardPop":3584998}],"pop":7170351,"ageAdjustedRate":"687.4","standardPop":7170351},{"name":"WI","deaths":51264,"sex":[{"name":"Female","deaths":25564,"pop":2903737,"ageAdjustedRate":"608.4","standardPop":2903737},{"name":"Male","deaths":25700,"pop":2867600,"ageAdjustedRate":"845.5","standardPop":2867600}],"pop":5771337,"ageAdjustedRate":"715.9","standardPop":5771337},{"name":"WV","deaths":22752,"sex":[{"name":"Female","deaths":11168,"pop":933068,"ageAdjustedRate":"811.6","standardPop":933068},{"name":"Male","deaths":11584,"pop":911060,"ageAdjustedRate":"1,095.1","standardPop":911060}],"pop":1844128,"ageAdjustedRate":"943.4","standardPop":1844128},{"name":"WY","deaths":4778,"sex":[{"name":"Female","deaths":2228,"pop":287206,"ageAdjustedRate":"639.6","standardPop":287206},{"name":"Male","deaths":2550,"pop":298901,"ageAdjustedRate":"863.5","standardPop":298901}],"pop":586107,"ageAdjustedRate":"748.3","standardPop":586107}]};
            var mapOption = {selectedMapSize:'big'};
            spyOn(utilService, 'getMinAndMaxValue').and.returnValue({"minValue":4316,"maxValue":259206});
            mapService.updateStatesDeaths(primaryFilters, mapResponseData, primaryFilters.searchCount, mapOption);
            expect($rootScope.states.features.length).not.toBeUndefined();
            expect($rootScope.states.features[0].properties.name).toEqual("Arkansas");
            expect($rootScope.states.features[0].properties.abbreviation).toEqual("AR");
            expect($rootScope.states.features[0].properties.rate).toEqual('901.8');
            expect($rootScope.states.features[0].properties.sex[0].name).toEqual("Female");
            expect($rootScope.states.features[0].properties.sex[0].deaths).toEqual(15304);
            expect($rootScope.states.features[0].properties.sex[0].pop).toEqual(1515348);
            expect($rootScope.states.features[0].properties.sex[0].ageAdjustedRate).toEqual("766.9");
            expect($rootScope.states.features[0].properties.sex[1].name).toEqual("Male");
            expect($rootScope.states.features[0].properties.sex[1].deaths).toEqual(16313);
            expect($rootScope.states.features[0].properties.sex[1].pop).toEqual(1462856);
            expect($rootScope.states.features[0].properties.sex[1].ageAdjustedRate).toEqual("1,056.9");
            expect($rootScope.states.features[0].properties.tableView).toEqual("age-adjusted_death_rates");
            expect($rootScope.states.features[0].properties.deaths).toEqual(31617);
        }));
    });
});
