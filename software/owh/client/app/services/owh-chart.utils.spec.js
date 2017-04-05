'use strict';

/*group of common test goes here as describe*/
describe('chart utils', function(){
    var chartUtils, shareUtils, searchFactory, diferred, closeDeferred, givenModalDefaults, ModalService, $rootScope, $scope, controllerProvider,
        filter1, filter2, filter3, data1, data2, primaryFilter, postFixToTooltip,
        horizontalStackExpectedResult1, horizontalStackExpectedResult2,
        verticalStackExpectedResult, horizontalBarExpectedResult,
        verticalBarExpectedResult1, verticalBarExpectedResult2,
        horizontalStackNoDataExpectedResult, verticalBarNoDataExpectedResult, lineChartFilter, lineChartExpectedResult,
        lineChartData, pieChartData, pieChartExpectedResult, pieChartWithpostFixToTooltipExpectedResult,
        expandedGraphExpectedResult, elementVisible, thenFunction, $httpBackend, $templateCache;

    beforeEach(module('owh'));
    beforeEach(function() {
        //$templateCache.put('app/partials/expandedGraphModal.html', 'app/partials/expandedGraphModal.html');
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
    });

    beforeEach(inject(function ($injector, _$rootScope_, $controller, _$q_, _$templateCache_) {
        closeDeferred = _$q_.defer();
        diferred = _$q_.defer();
        controllerProvider = $controller;
        $rootScope  = _$rootScope_;
        $scope = $rootScope.$new();
        $templateCache = _$templateCache_;
        chartUtils = $injector.get('chartUtilService');
        shareUtils = $injector.get('shareUtilService');
        searchFactory = $injector.get('searchFactory');
        $httpBackend = $injector.get('$httpBackend');
        filter1 = __fixtures__['app/services/fixtures/owh.chart.utils/filter1'];
        filter2 = __fixtures__['app/services/fixtures/owh.chart.utils/filter2'];
        filter3 = __fixtures__['app/services/fixtures/owh.chart.utils/filter3'];

        data1 = __fixtures__['app/services/fixtures/owh.chart.utils/data1'];
        data2 = __fixtures__['app/services/fixtures/owh.chart.utils/data2'];

        pieChartData = __fixtures__['app/services/fixtures/owh.chart.utils/pieChartData'];

        primaryFilter = {"key":"deaths", "chartAxisLabel":"Deaths"};

        lineChartFilter =  __fixtures__['app/services/fixtures/owh.chart.utils/lineChartFilter'];
        lineChartData = __fixtures__['app/services/fixtures/owh.chart.utils/lineChartData'];
        lineChartExpectedResult = __fixtures__['app/services/fixtures/owh.chart.utils/lineChartExpectedResults'];

        horizontalStackExpectedResult1 = __fixtures__['app/services/fixtures/owh.chart.utils/horizontalStackExpectedResult1'];
        horizontalStackExpectedResult2 = __fixtures__['app/services/fixtures/owh.chart.utils/horizontalStackExpectedResult2'];

        verticalStackExpectedResult = __fixtures__['app/services/fixtures/owh.chart.utils/verticalStackExpectedResult'];
        horizontalBarExpectedResult = __fixtures__['app/services/fixtures/owh.chart.utils/horizontalBarExpectedResult'];

        verticalBarExpectedResult1 = __fixtures__['app/services/fixtures/owh.chart.utils/verticalBarExpectedResult1'];
        verticalBarExpectedResult2 = __fixtures__['app/services/fixtures/owh.chart.utils/verticalBarExpectedResult2'];

        horizontalStackNoDataExpectedResult = __fixtures__['app/services/fixtures/owh.chart.utils/horizontalStackNoDataExpectedResult'];
        verticalBarNoDataExpectedResult = __fixtures__['app/services/fixtures/owh.chart.utils/verticalBarNoDataExpectedResult'];

        pieChartExpectedResult = __fixtures__['app/services/fixtures/owh.chart.utils/pieChartExpectedResult'];
        pieChartWithpostFixToTooltipExpectedResult = __fixtures__['app/services/fixtures/owh.chart.utils/pieChartWithpostFixToTooltipExpectedResult'];

        expandedGraphExpectedResult = __fixtures__['app/services/fixtures/owh.chart.utils/expandedGraphExpectedResult'];

        postFixToTooltip = 'data';

        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 1111111111111111}});
        $httpBackend.whenGET('/yrbsQuestionsTree/2015').respond({data: { }});
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
    }));

    it('test chart utils horizontalStack', function () {
        var result = chartUtils.horizontalStack(filter1, filter2, data1, primaryFilter, postFixToTooltip);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(horizontalStackExpectedResult1));

        expect(result.options.chart.x({label: 'x label'})).toEqual('x label');
        expect(result.options.chart.y({value: 'y value'})).toEqual('y value');
        expect(result.options.chart.xAxis.tickFormat('1,234')).toEqual(null);
        expect(result.options.chart.xAxis.tickFormat(1234)).toEqual(null);

        expect(result.options.chart.yAxis.tickFormat('1,234')).toEqual(null);
        expect(result.options.chart.yAxis.tickFormat(1234)).toEqual(null);

        expect(result.options.chart.valueFormat('1,234')).toEqual('1,234');
        expect(result.options.chart.valueFormat(1234)).toEqual('1234');

        expect(result.options.chart.tooltip.contentGenerator({value: 1234, series: [{color: 'red', value: 1234}]})).toEqual("<div class='usa-grid-full'<div class='usa-width-one-whole' style='padding: 10px; font-weight: bold'>1234</div><div class='usa-width-one-whole nvtooltip-value'><i class='fa fa-square' style='color:red'></i>&nbsp;&nbsp;&nbsp;undefined&nbsp;&nbsp;&nbsp;1,234data</div></div>");
    });

    it('test chart utils verticalStack', function () {
        var result = chartUtils.verticalStack(filter1, filter2, data1, primaryFilter);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(verticalStackExpectedResult));

        expect(result.options.chart.x({x: 'x label'})).toEqual('x label');
        expect(result.options.chart.y({y: 'y value'})).toEqual('y value');
        expect(result.options.chart.xAxis.tickFormat('1,234')).toEqual(null);
        expect(result.options.chart.xAxis.tickFormat(1234)).toEqual(null);

        expect(result.options.chart.yAxis.tickFormat('1,234')).toEqual(null);
        expect(result.options.chart.yAxis.tickFormat(1234)).toEqual(null);

        expect(result.options.chart.valueFormat('1,234')).toEqual('1,234');
        expect(result.options.chart.valueFormat(1234)).toEqual('1234');

        expect(result.options.chart.tooltip.contentGenerator({value: 1234, series: [{color: 'red', value: 1234}]})).toEqual("<div class='usa-grid-full'<div class='usa-width-one-whole' style='padding: 10px; font-weight: bold'>1234</div><div class='usa-width-one-whole nvtooltip-value'><i class='fa fa-square' style='color:red'></i>&nbsp;&nbsp;&nbsp;undefined&nbsp;&nbsp;&nbsp;1,234</div></div>");
    });

    it('test chart utils horizontalBar', function () {
        var result = chartUtils.horizontalBar(filter1, filter2, data1, primaryFilter);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(horizontalBarExpectedResult));
    });

    it('test chart utils verticalBar', function () {
        var result = chartUtils.verticalBar(filter1, filter2, data1, primaryFilter);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(verticalBarExpectedResult1));
    });

    it('test chart utils horizontalStack without data', function () {
        var result = chartUtils.horizontalStack(filter1, filter2, undefined, primaryFilter, postFixToTooltip);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(horizontalStackNoDataExpectedResult));
    });

    it('test chart utils verticalBar without data', function () {
        var result = chartUtils.verticalBar(filter1, filter2, undefined, primaryFilter);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(verticalBarNoDataExpectedResult));
    });

    it('test chart utils horizontalStack without gender filter', function () {
        var result = chartUtils.horizontalStack(filter2, filter3, data2, primaryFilter, postFixToTooltip);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(horizontalStackExpectedResult2));
    });
    it('test chart utils verticalBar without gender filter', function () {
        var result = chartUtils.verticalBar(filter2, filter3, data2, primaryFilter);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(verticalBarExpectedResult2));
    });

    it('test chart utils lineChart', function () {
        var result = chartUtils.lineChart(lineChartData, lineChartFilter, {key:'current_year'});
        expect(JSON.stringify(result)).toEqual(JSON.stringify(lineChartExpectedResult));
        result.data();
        expect(result.options.chart.x({x: 'x label'})).toEqual('x label');
        expect(result.options.chart.y({y: 'y value'})).toEqual('y value');

        expect(result.options.chart.xAxis.tickFormat(1234)).toEqual(null);

        expect(result.options.chart.yAxis.tickFormat(1234)).toEqual(null);
        console.log(result.options.chart.tooltip.contentGenerator({value: 1234, series: [{color: 'red', value: 1234}]}));
        expect(result.options.chart.tooltip.contentGenerator({value: 1234, series: [{color: 'red', value: 1234}]})).toEqual("<div class='usa-grid-full'<div class='usa-width-one-whole' style='padding: 10px; font-weight: bold'>1234</div><div class='usa-width-one-whole nvtooltip-value'><i class='fa fa-square' style='color:red'></i>&nbsp;&nbsp;&nbsp;undefined&nbsp;&nbsp;&nbsp;1,234</div></div>");

    });

    it('test showExpandedGraph for lineChart', function () {
        chartUtils.showExpandedGraph([lineChartExpectedResult]);
    });

    it('test chart utils pieChart', function () {
        var result = chartUtils.pieChart(pieChartData, filter2, primaryFilter);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(pieChartExpectedResult));
    });

    it('test chart utils pieChart with postFixToTooltip', function () {
        var result = chartUtils.pieChart(pieChartData, filter2, primaryFilter, postFixToTooltip);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(pieChartWithpostFixToTooltipExpectedResult));

        expect(result.options.chart.x({label: 'x label'})).toEqual('x label');
        expect(result.options.chart.y({value: 'y value'})).toEqual('y value');

        expect(result.options.chart.color({label: 'label'}, 1)).toEqual(d3.scale.category20()(1));

        expect(result.options.chart.tooltip.contentGenerator({value: 1234, series: [{color: 'red', value: 1234}]})).toEqual("<div class='usa-grid-full'<div class='usa-width-one-whole nvtooltip-value'><i class='fa fa-square' style='color:red'></i>&nbsp;&nbsp;&nbsp;undefined&nbsp;&nbsp;&nbsp;1,234data</div></div>");
    });

    it('test chart utils pieChart for gender filter', function () {
        var result = chartUtils.pieChart(pieChartData, filter1, primaryFilter, postFixToTooltip);

        expect(result.options.chart.color({label: 'Male'}, 1)).toEqual('#009aff');
        expect(result.options.chart.color({label: 'Female'}, 1)).toEqual('#fe66ff');
    });

    it('test chart utils showExpandedGraph', function () {
        chartUtils.showExpandedGraph([pieChartExpectedResult]);
    });

    it('test chart utils showExpandedGraph with multiple charts', function () {
        chartUtils.showExpandedGraph([verticalBarExpectedResult1, horizontalStackExpectedResult1]);
        var ctrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise, shareUtilService: shareUtils});
        ctrl.element = givenModalDefaults.element;
        thenFunction(ctrl);
        expect(elementVisible).toBeTruthy();
        closeDeferred.resolve({});
        $scope.$apply();
        expect(elementVisible).toBeFalsy();
    });

    it('test chart utils showExpandedGraph with multiple charts for agegroup.autopsy and gender.placeofdeath', function () {
        horizontalStackExpectedResult1.title = 'label.title.agegroup.autopsy';
        verticalBarExpectedResult1.title = 'label.title.gender.placeofdeath';
        chartUtils.showExpandedGraph([verticalBarExpectedResult1, horizontalStackExpectedResult1],'graph title');
        var ctrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise, shareUtilService: shareUtils});
        expect(ctrl.graphTitle).toEqual('graph title');
    });

    it('test chart utils showExpandedGraph with multiple charts for yrbsSex.yrbsRace and yrbsGrade', function () {
        horizontalStackExpectedResult1.title = 'label.title.yrbsSex.yrbsRace';
        pieChartExpectedResult.title = 'label.graph.yrbsGrade';
        chartUtils.showExpandedGraph([horizontalStackExpectedResult1, pieChartExpectedResult]);
        var ctrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise, shareUtilService: shareUtils});
        expect(JSON.stringify(ctrl.chartData)).toEqual(JSON.stringify(expandedGraphExpectedResult));
    });

    it('test chart utils showExpandedGraph with multiple charts for gender.hispanicOrigin and race.hispanicOrigin', function () {
        horizontalStackExpectedResult1.title = 'label.title.race.hispanicOrigin';
        verticalBarExpectedResult1.title = 'label.title.gender.hispanicOrigin';
        chartUtils.showExpandedGraph([verticalBarExpectedResult1, horizontalStackExpectedResult1]);
        var ctrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise, shareUtilService: shareUtils});
        expect(ctrl.graphTitle).toEqual('label.graph.expanded');
    });

    it('test chart utils showExpandedGraph for bulletChart', function () {
        horizontalStackExpectedResult1.options.chart.type = 'bulletChart';
        chartUtils.showExpandedGraph([horizontalStackExpectedResult1], 'graph title', 'graph sub title');
        spyOn(shareUtils, 'shareOnFb');
        var ctrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise, shareUtilService: shareUtils});
        expect(ctrl.graphSubTitle).toEqual('graph sub title');
        ctrl.showFbDialog();
        expect(shareUtils.shareOnFb).toHaveBeenCalled();
    });

    it('test chart utils showExpandedGraph for getChartName', function () {
        var ctrl = controllerProvider(givenModalDefaults.controller,
            { $scope: $scope, close: closeDeferred.promise});
        var chartName = ctrl.getChartName(['yrbsSex','yrbsGrade']);
        expect(chartName).toEqual('Sex and Grade');

        var chartName = ctrl.getChartName(['yrbsGrade']);
        expect(chartName).toEqual('Grade');
    });

    it('test chart utils showExpandedGraph for getYrbsChartData', function () {

        spyOn(searchFactory, 'prepareQuestionChart').and.returnValue(diferred.promise);

        var ctrl = controllerProvider(givenModalDefaults.controller,
            { $scope: $scope, close: closeDeferred.promise, shareUtilService: shareUtils, searchFactory: searchFactory});

        ctrl.primaryFilters = {key:"mental health", value:[]};
        ctrl.selectedQuestion = {key:'Currently smoked', qKey:'qbe23', 'title':"Currently smoked"};

        ctrl.getYrbsChartData(['yrbsSex','yrbsGrade']);

        diferred.resolve({chartData:horizontalBarExpectedResult});
        $scope.$apply()
    });

});
