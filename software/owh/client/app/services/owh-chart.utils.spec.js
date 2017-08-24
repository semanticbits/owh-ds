'use strict';

/*group of common test goes here as describe*/
describe('chart utils', function(){
    var chartUtils, shareUtils, searchFactory, diferred, closeDeferred, givenModalDefaults, ModalService, $rootScope, $scope, controllerProvider,
        filter1, filter2, filter3, data1, data2, censusRatesData, primaryFilter, postFixToTooltip,
        horizontalStackExpectedResult1, horizontalStackExpectedResult2,
        verticalStackExpectedResult, horizontalBarExpectedResult,
        horizontalBarExpectedResultForCurdeDeathRates,
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
        censusRatesData = __fixtures__['app/services/fixtures/owh.chart.utils/census-rates-data'];

        pieChartData = __fixtures__['app/services/fixtures/owh.chart.utils/pieChartData'];

        primaryFilter = {"key":"deaths", "chartAxisLabel":"Deaths"};

        lineChartFilter =  __fixtures__['app/services/fixtures/owh.chart.utils/lineChartFilter'];
        lineChartData = __fixtures__['app/services/fixtures/owh.chart.utils/lineChartData'];
        lineChartExpectedResult = __fixtures__['app/services/fixtures/owh.chart.utils/lineChartExpectedResults'];

        horizontalStackExpectedResult1 = __fixtures__['app/services/fixtures/owh.chart.utils/horizontalStackExpectedResult1'];
        horizontalStackExpectedResult2 = __fixtures__['app/services/fixtures/owh.chart.utils/horizontalStackExpectedResult2'];

        verticalStackExpectedResult = __fixtures__['app/services/fixtures/owh.chart.utils/verticalStackExpectedResult'];
        horizontalBarExpectedResult = __fixtures__['app/services/fixtures/owh.chart.utils/horizontalBarExpectedResult'];
        horizontalBarExpectedResultForCurdeDeathRates = __fixtures__['app/services/fixtures/owh.chart.utils/horizontalBarExpectedResultForCurdeDeathRates'];

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
        $httpBackend.whenGET('/yrbsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('jsons/conditions-ICD-10.json').respond({data: []});
    }));

    it('test chart utils horizontalStack', function () {
        var result = chartUtils.horizontalStack(filter1, filter2, data1, primaryFilter, postFixToTooltip);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(horizontalStackExpectedResult1));
    });

    it('test chart utils verticalStack', function () {
        var result = chartUtils.verticalStack(filter1, filter2, data1, primaryFilter);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(verticalStackExpectedResult));
    });

    it('test chart utils horizontalBar', function () {
        var result = chartUtils.horizontalBar(filter1, filter2, data1, primaryFilter);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(horizontalBarExpectedResult));
    });
    it('test chart utils horizontalBar for Crude Death Rates', function () {
        primaryFilter.tableView = 'crude_death_rates';
        var result = chartUtils.horizontalBar(filter1, filter2, censusRatesData, primaryFilter);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(horizontalBarExpectedResultForCurdeDeathRates));
    });

    it('test chart utils horizontalBar for infant death rates', function () {
        var filter1 = {"key":"sex","title":"label.filter.gender","queryKey":"sex","primary":false,"value":[],"defaultGroup":"column","groupBy":"column","filterType":"checkbox","autoCompleteOptions":[{"key":"Female","title":"Female","count":0},{"key":"Male","title":"Male","count":0}],"helpText":"label.help.text.infantmort.sex"};
        var filter2 = {"key":"race","title":"label.filter.race","queryKey":"race","primary":false,"value":[],"defaultGroup":"column","groupBy":"row","filterType":"checkbox","autoCompleteOptions":[{"key":"American Indian or Alaska Native","title":"American Indian or Alaska Native","count":0},{"key":"Asian or Pacific Islander","title":"Asian or Pacific Islander","count":0},{"key":"Black","title":"Black or African American","count":0},{"key":"White","title":"White","count":0}],"helpText":"label.help.text.race"};
        var data = {"sex":[{"name":"Male","infant_mortality":12889,"race":[{"name":"White","infant_mortality":8337,"birthRate":"5.39","pop":1547425},{"name":"Black","infant_mortality":3752,"birthRate":"11.55","pop":324821},{"name":"Asian or Pacific Islander","infant_mortality":605,"birthRate":"4.15","pop":145647},{"name":"American Indian or Alaska Native","infant_mortality":195,"birthRate":"8.55","pop":22808}],"birthRate":"6.32","pop":2040701},{"name":"Female","infant_mortality":10322,"race":[{"name":"White","infant_mortality":6590,"birthRate":"4.48","pop":1472438},{"name":"Black","infant_mortality":3101,"birthRate":"9.82","pop":315741},{"name":"Asian or Pacific Islander","infant_mortality":484,"birthRate":"3.53","pop":137076},{"name":"American Indian or Alaska Native","infant_mortality":146,"birthRate":"6.60","pop":22120}],"birthRate":"5.30","pop":1947375}]};
        var primaryFilter = {"key":"infant_mortality","title":"label.filter.infant_mortality","primary":true,"header":"Infant Mortality","showMap":false,"chartAxisLabel":"Rates","countLabel":"Number of Infant Deaths","tableView":"number_of_infant_deaths","runOnFilterChange":true,"applySuppression":true,"chartView":"infant_death_rate","chartViewOptions":[{"key":"death","title":"Deaths","tooltip":"Select to view as deaths on charts","$$hashKey":"object:4475"},{"key":"infant_death_rate","title":"Rates","tooltip":"Select to view as rates on charts","$$hashKey":"object:4476"}],"$$hashKey":"object:1207","initiated":true,"headers":{"chartHeaders":[{"headers":[{"key":"sex","title":"label.filter.gender","queryKey":"sex","primary":false,"value":[],"defaultGroup":"column","groupBy":"column","filterType":"checkbox","autoCompleteOptions":[{"key":"Female","title":"Female","count":0,"infant_mortality":10251},{"key":"Male","title":"Male","count":0,"infant_mortality":12799}],"helpText":"label.help.text.infantmort.sex","allChecked":true},{"key":"race","title":"label.filter.race","queryKey":"race","primary":false,"value":[],"defaultGroup":"column","groupBy":"row","filterType":"checkbox","autoCompleteOptions":[{"key":"American Indian / Alaskan Native","title":"American Indian / Alaskan Native","count":0,"infant_mortality":340},{"key":"Asian / Pacific Islander","title":"Asian / Pacific Islander","count":0,"infant_mortality":1080},{"key":"Black","title":"Black or African American","count":0,"infant_mortality":6809},{"key":"White","title":"White","count":0,"infant_mortality":14821},{"key":"Chinese","title":"Chinese","count":0,"infant_mortality":0},{"key":"Japanese","title":"Japanese","count":0,"infant_mortality":0},{"key":"Hawaiian","title":"Hawaiian","count":0,"infant_mortality":0},{"key":"Filipino","title":"Filipino","count":0,"infant_mortality":0},{"key":"Other Asian","title":"Other Asian","count":0,"infant_mortality":0}],"helpText":"label.help.text.race","allChecked":true}],"chartType":"horizontalBar"}]},"count":23050};

        var result = chartUtils.horizontalBar(filter1, filter2, data, primaryFilter);
        var barData = result.data;
        expect(barData[1].y[3]).toEqual('American Indian or Alaska Native');
        expect(barData[1].x[3]).toEqual('6.6');

        expect(barData[1].y[2]).toEqual('Asian or Pacific Islander');
        expect(barData[1].x[2]).toEqual('3.5');

    });

    it('test chart horizontalBar for PRAMS single filter', function () {
        var filter = {"key":"state","title":"label.prams.filter.state","queryKey":"sitecode","value":["AK"],"autoCompleteOptions":[{"key":"AL","title":"Alabama"},{"key":"AK","title":"Alaska"}]};
        var data = {"question":[{"name":"qn365","-1":{"sitecode":[{"name":"AK","prams":{"mean":"23.0","ci_l":"0","ci_u":"0"}},{"name":"AK","prams":{"mean":"21.0","ci_l":"0","ci_u":"0"}}]},"NO (UNCHECKED)":{"sitecode":[{"name":"AK","prams":{"mean":"97.4","ci_l":"96.0","ci_u":"98.3"}},{"name":"AK","prams":{"mean":"97.1","ci_l":"95.6","ci_u":"98.1"}}]},"YES (CHECKED)":{"sitecode":[{"name":"AK","prams":{"mean":"2.6","ci_l":"1.7","ci_u":"4.0"}},{"name":"AK","prams":{"mean":"2.9","ci_l":"1.9","ci_u":"4.4"}}]}}]};
        var primaryFilter = {key:'prams', chartAxisLabel: 'Percentage', allFilters:[{topic:[]}, {year:[]}, {state:[]}, {ques:[]}, {value:[]}]};
        var expectedOutput = {"charttype":"multiBarHorizontalChart","title":"label.title.state.state","longtitle":"chart.title.measure.prams by label.filter.state in undefined for undefined","dataset":"prams","data":[{"name":"Percentage - YES (CHECKED)","x":[2.6],"y":["Alaska"],"text":[],"orientation":"h","hoverinfo":"none","type":"bar","marker":{"color":"#fe66ff"}},{"name":"Percentage - NO (UNCHECKED)","x":[97.4],"y":["Alaska"],"text":[],"orientation":"h","hoverinfo":"none","type":"bar","marker":{"color":"#009aff"}}],"layout":{"width":350,"height":300,"showlegend":false,"hovermode":"closest","margin":{"l":20,"r":10,"b":20,"t":20},"xaxis":{"visible":true,"titlefont":{"size":15},"exponentformat":"none","tickangle":45,"showline":true,"gridcolor":"#bdbdbd","showticklabels":false,"title":"Percentage"},"yaxis":{"visible":true,"titlefont":{"size":15},"exponentformat":"none","tickangle":45,"ticksuffix":"   ","showline":true,"gridcolor":"#bdbdbd","showticklabels":false,"title":"label.prams.filter.state"},"barmode":"bar"},"options":{"displayModeBar":false}};
        var result = chartUtils.horizontalBar(filter, filter, data, primaryFilter);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedOutput));
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
        var result = chartUtils.lineChart(lineChartData, lineChartFilter, {key:'deaths'});
        expect(JSON.stringify(result)).toEqual(JSON.stringify(lineChartExpectedResult));
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
        chartUtils.showExpandedGraph([verticalBarExpectedResult1, horizontalStackExpectedResult1], null, 'graph title');
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

    it('test chart utils showExpandedGraph for getChartName', function () {
        var ctrl = controllerProvider(givenModalDefaults.controller,
            { $scope: $scope, close: closeDeferred.promise});
        var chartName = ctrl.getChartName(['yrbsSex','yrbsGrade']);
        expect(chartName).toEqual('Sex and Grade');

        var chartName = ctrl.getChartName(['yrbsGrade']);
        expect(chartName).toEqual('Grade');

        var chartName = ctrl.getChartName(['state']);
        expect(chartName).toEqual('State');

        var chartName = ctrl.getChartName(['year']);
        expect(chartName).toEqual('Year');
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
