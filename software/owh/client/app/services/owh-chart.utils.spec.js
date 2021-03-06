'use strict';

/*group of common test goes here as describe*/
describe('chart utils', function(){
    var chartUtils, shareUtils, searchFactory, diferred, closeDeferred, diferredMapData, givenModalDefaults, ModalService, $rootScope, $scope, controllerProvider,
        filter1, filter2, filter3, data1, data2, censusRatesData, primaryFilter, postFixToTooltip,
        horizontalStackExpectedResult1, horizontalStackExpectedResult2,
        verticalStackExpectedResult, horizontalBarExpectedResult,
        horizontalBarExpectedResultForCurdeDeathRates, multiChartBridgeRaceFilteres,
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
        diferredMapData = _$q_.defer();
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
        multiChartBridgeRaceFilteres = __fixtures__['app/services/fixtures/owh.chart.utils/multiChartBridgeRaceFilteres'];

        postFixToTooltip = 'data';

        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 1111111111111111}});
        $httpBackend.whenGET('/yrbsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('/pramsBasicQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('/pramsAdvancesQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('jsons/ucd-conditions-ICD-10.json').respond({data: []});
        $httpBackend.whenGET('jsons/mcd-conditions-ICD-10.json').respond({data: []});
        $httpBackend.whenGET('/getGoogAnalyInfo').respond({data: { }});
        $httpBackend.whenGET('/brfsQuestionsTree/true').respond({data: { }});
        $httpBackend.whenGET('/brfsQuestionsTree/false').respond({data: { }});
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
        var data = {"sex":[{"name":"Male","infant_mortality":12889,"race":[{"name":"White","infant_mortality":8337,"deathRate":"5.39","pop":1547425},{"name":"Black","infant_mortality":3752,"deathRate":"11.55","pop":324821},{"name":"Asian or Pacific Islander","infant_mortality":605,"deathRate":"4.15","pop":145647},{"name":"American Indian or Alaska Native","infant_mortality":195,"deathRate":"8.55","pop":22808}],"deathRate":"6.32","pop":2040701},{"name":"Female","infant_mortality":10322,"race":[{"name":"White","infant_mortality":6590,"deathRate":"4.48","pop":1472438},{"name":"Black","infant_mortality":3101,"deathRate":"9.82","pop":315741},{"name":"Asian or Pacific Islander","infant_mortality":484,"deathRate":"3.53","pop":137076},{"name":"American Indian or Alaska Native","infant_mortality":146,"deathRate":"6.60","pop":22120}],"deathRate":"5.30","pop":1947375}]};
        var primaryFilter = {"key":"infant_mortality","title":"label.filter.infant_mortality","primary":true,"header":"Infant Mortality","showMap":false,"chartAxisLabel":"Rates","countLabel":"Number of Infant Deaths","tableView":"number_of_infant_deaths","runOnFilterChange":true,"applySuppression":true,"chartView":"infant_death_rate","chartViewOptions":[{"key":"death","title":"Deaths","tooltip":"Select to view as deaths on charts","$$hashKey":"object:4475"},{"key":"infant_death_rate","title":"Rates","tooltip":"Select to view as rates on charts","$$hashKey":"object:4476"}],"$$hashKey":"object:1207","initiated":true,"headers":{"chartHeaders":[{"headers":[{"key":"sex","title":"label.filter.gender","queryKey":"sex","primary":false,"value":[],"defaultGroup":"column","groupBy":"column","filterType":"checkbox","autoCompleteOptions":[{"key":"Female","title":"Female","count":0,"infant_mortality":10251},{"key":"Male","title":"Male","count":0,"infant_mortality":12799}],"helpText":"label.help.text.infantmort.sex","allChecked":true},{"key":"race","title":"label.filter.race","queryKey":"race","primary":false,"value":[],"defaultGroup":"column","groupBy":"row","filterType":"checkbox","autoCompleteOptions":[{"key":"American Indian / Alaskan Native","title":"American Indian / Alaskan Native","count":0,"infant_mortality":340},{"key":"Asian / Pacific Islander","title":"Asian / Pacific Islander","count":0,"infant_mortality":1080},{"key":"Black","title":"Black or African American","count":0,"infant_mortality":6809},{"key":"White","title":"White","count":0,"infant_mortality":14821},{"key":"Chinese","title":"Chinese","count":0,"infant_mortality":0},{"key":"Japanese","title":"Japanese","count":0,"infant_mortality":0},{"key":"Hawaiian","title":"Hawaiian","count":0,"infant_mortality":0},{"key":"Filipino","title":"Filipino","count":0,"infant_mortality":0},{"key":"Other Asian","title":"Other Asian","count":0,"infant_mortality":0}],"helpText":"label.help.text.race","allChecked":true}],"chartType":"horizontalBar"}]},"count":23050};

        var result = chartUtils.horizontalBar(filter1, filter2, data, primaryFilter);
        var barData = result.data;
        expect(barData[1].y[3]).toEqual('AI/AN');
        expect(barData[1].x[3]).toEqual('6.6');

        expect(barData[1].y[2]).toEqual('API');
        expect(barData[1].x[2]).toEqual('3.5');

    });

    it('test chart horizontalBar for PRAMS single filter', function () {
        var filter = {"key":"state","title":"label.prams.filter.state","queryKey":"sitecode","value":["AK"],"autoCompleteOptions":[{"key":"AL","title":"Alabama"},{"key":"AK","title":"Alaska"}]};
        var data = {"question":[{"name":"qn365","-1":{"sitecode":[{"name":"AK","prams":{"mean":"23.0","ci_l":"0","ci_u":"0"}},{"name":"AK","prams":{"mean":"21.0","ci_l":"0","ci_u":"0"}}]},"NO (UNCHECKED)":{"sitecode":[{"name":"AK","prams":{"mean":"97.4","ci_l":"96.0","ci_u":"98.3"}},{"name":"AK","prams":{"mean":"97.1","ci_l":"95.6","ci_u":"98.1"}}]},"YES (CHECKED)":{"sitecode":[{"name":"AK","prams":{"mean":"2.6","ci_l":"1.7","ci_u":"4.0"}},{"name":"AK","prams":{"mean":"2.9","ci_l":"1.9","ci_u":"4.4"}}]}}]};
        var primaryFilter = {key:'prams', chartAxisLabel: 'Percentage', allFilters:[{topic:[]}, {year:[]}, {state:[]}, {ques:[]}, {value:[]}]};
        var expectedOutput = {"charttype":"multiBarHorizontalChart","title":"label.prams.filter.state and label.prams.filter.state","longtitle":"chart.title.measure.prams by label.prams.filter.state in undefined for undefined","dataset":"prams","data":[{"namelong":"Percentage - YES (CHECKED)     ","name":"Percentage - YES (CHECKED)     ","x":[2.6],"y":["AK"],"ylong":["Alaska"],"text":["2.6"],"orientation":"h","hoverinfo":"none","type":"bar","marker":{"color":"#45b7ad"}},{"namelong":"Percentage - NO (UNCHECKED)     ","name":"Percentage - NO (UNCHECKED)     ","x":[97.4],"y":["AK"],"ylong":["Alaska"],"text":["97.4"],"orientation":"h","hoverinfo":"none","type":"bar","marker":{"color":"#FF9F4A"}}],"layout":{"width":128,"autosize":true,"showlegend":true,"legend":{"orientation":"h","y":1.25,"x":0.4},"xaxis":{"visible":true,"titlefont":{"size":15},"exponentformat":"auto","tickangle":45,"showline":true,"gridcolor":"#bdbdbd","showticklabels":true,"fixedrange":true,"title":"Percentage"},"yaxis":{"visible":true,"titlefont":{"size":15},"exponentformat":"auto","tickangle":45,"ticksuffix":"   ","showline":true,"gridcolor":"#bdbdbd","showticklabels":true,"fixedrange":true,"title":"label.prams.filter.state"},"margin":{"l":100,"r":10,"b":50,"t":50},"barmode":"bar"},"options":{"displayModeBar":false}};
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
        var chartData = [{"charttype":"multiBarHorizontalChart","title":"Race and Ethnicity","longtitle":"Population by Race and Ethnicity in US for 2015","dataset":"bridge_race","data":[{"namelong":"White     ","name":"White     ","x":[50632773,201242281],"y":["Hispanic","Non Hisp."],"ylong":["Hispanic or Latino","Non Hispanic"],"text":["50,632,773","201,242,281"],"orientation":"h","hoverinfo":"none","type":"bar","marker":{"color":"#61B861"},"uid":"b4cf63"},{"namelong":"Black or African American     ","name":"Black     ","x":[3085713,41777483],"y":["Hispanic","Non Hisp."],"ylong":["Hispanic or Latino","Non Hispanic"],"text":["3,085,713","41,777,483"],"orientation":"h","hoverinfo":"none","type":"bar","marker":{"color":"#7577CD"},"uid":"c71bb9"},{"namelong":"Asian or Pacific Islander     ","name":"API     ","x":[986160,19116557],"y":["Hispanic","Non Hisp."],"ylong":["Hispanic or Latino","Non Hispanic"],"text":["986,160","19,116,557"],"orientation":"h","hoverinfo":"none","type":"bar","marker":{"color":"#45b7ad"},"uid":"ff4a6f"},{"namelong":"American Indian or Alaska Native     ","name":"AI/AN     ","x":[1888147,2689706],"y":["Hispanic","Non Hisp."],"ylong":["Hispanic or Latino","Non Hispanic"],"text":["1,888,147","2,689,706"],"orientation":"h","hoverinfo":"none","type":"bar","marker":{"color":"#FF9F4A"},"uid":"433e64"}],"layout":{"width":437.12,"autosize":true,"showlegend":true,"legend":{"orientation":"h","y":1.25,"x":0.4},"xaxis":{"visible":true,"titlefont":{"size":15},"exponentformat":"auto","tickangle":45,"showline":true,"gridcolor":"#bdbdbd","showticklabels":true,"fixedrange":true,"title":"Population","type":"linear","range":[0,211833980],"autorange":true},"yaxis":{"visible":true,"titlefont":{"size":15},"exponentformat":"auto","tickangle":45,"ticksuffix":"   ","showline":true,"gridcolor":"#bdbdbd","showticklabels":true,"fixedrange":true,"title":"Ethnicity","type":"category","range":[-0.5,1.5],"autorange":true},"margin":{"l":100,"r":10,"b":50,"t":50},"barmode":"bar"},"options":{"displayModeBar":false},"$$hashKey":"object:6205"}];
        chartUtils.showExpandedGraph(chartData, 'bridge_race', "graph title", "graph sub title",
            'Race Ethnicity', multiChartBridgeRaceFilteres, null, {year:'2015'});
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
        chartUtils.showExpandedGraph([verticalBarExpectedResult1, horizontalStackExpectedResult1], null, 'graph title', "test title", null, multiChartBridgeRaceFilteres);
        var ctrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise, shareUtilService: shareUtils});
        expect(ctrl.graphTitle).toEqual('graph title');
    });

    it('test chart utils showExpandedGraph with multiple charts for gender.hispanicOrigin and race.hispanicOrigin', function () {
        var chartData = [{"charttype":"multiBarChart","title":"Sex and Ethnicity","longtitle":"Number of Deaths by Sex and Ethnicity in US for 2000 - 2015","dataset":"deaths","data":[{"namelong":"Male     ","name":"Male     ","xlong":["Unknown","Other Hispanic","Spaniard","South American","Puerto Rican","Mexican","Latin American","Dominican","Cuban","Central American","Central and South American","Non-Hispanic"],"x":["Unknown","Other","Spaniard","S American","P Rican","Mexican","L American","Dominican","Cuban","C American","C/SA","Non-Hispanic"],"y":[62015,125210,3249,24384,155131,716431,2682,16747,109354,43900,33802,18476962],"text":["62,015","125,210","3,249","24,384","155,131","716,431","2,682","16,747","109,354","43,900","33,802","18,476,962"],"orientation":"v","type":"bar","hoverinfo":"none","marker":{"color":"#45b7ad"},"uid":"3ebc9e"},{"namelong":"Female     ","name":"Female     ","xlong":["Unknown","Other Hispanic","Spaniard","South American","Puerto Rican","Mexican","Latin American","Dominican","Cuban","Central American","Central and South American","Non-Hispanic"],"x":["Unknown","Other","Spaniard","S American","P Rican","Mexican","L American","Dominican","Cuban","C American","C/SA","Non-Hispanic"],"y":[43776,104915,3388,24334,128756,540327,2328,17035,103552,39627,30222,18971292],"text":["43,776","104,915","3,388","24,334","128,756","540,327","2,328","17,035","103,552","39,627","30,222","18,971,292"],"orientation":"v","type":"bar","hoverinfo":"none","marker":{"color":"#FF9F4A"},"uid":"5a2f2c"}],"layout":{"width":437.12,"autosize":true,"showlegend":true,"legend":{"orientation":"h","y":1.25,"x":0.4},"xaxis":{"visible":true,"titlefont":{"size":15},"exponentformat":"auto","tickangle":45,"showline":true,"gridcolor":"#bdbdbd","showticklabels":true,"fixedrange":true,"title":"Ethnicity","type":"category","range":[-0.5,11.5],"autorange":true},"yaxis":{"visible":true,"titlefont":{"size":15},"exponentformat":"auto","tickangle":45,"ticksuffix":"   ","showline":true,"gridcolor":"#bdbdbd","showticklabels":true,"fixedrange":true,"title":"Deaths","type":"linear","range":[0,19969781.05263158],"autorange":true},"margin":{"l":75,"r":10,"b":100,"t":50},"barmode":"bar"},"options":{"displayModeBar":false},"$$hashKey":"object:7476"}];
        var primaryFilters = {showBasicSearchSideMenu: false, showMap: false};
        chartUtils.showExpandedGraph(chartData, 'number_of_deaths', null, null, null, primaryFilters ,null, null);
        var ctrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise, shareUtilService: shareUtils});
        expect(ctrl.graphTitle).toEqual('Sex and Ethnicity');
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

    it('Should get mapdata for a selected yrbss question', function () {
        var ctrl = controllerProvider(givenModalDefaults.controller,
            { $scope: $scope, close: closeDeferred.promise});

        var yrbsMockData = __fixtures__['app/modules/search/fixtures/search.factory/yrbsChartMockData'];
        ctrl.selectedQuestion = {"title":"Currently drank alcohol(at least one drink of alcohol on at least 1 day during the 30 days before the survey)","isCount":false,"rowspan":2,"colspan":1,"key":"Currently drank alcohol","qkey":"qn43","iconClass":"purple-text"};
        var filters = searchFactory.getAllFilters();
        ctrl.primaryFilters =  filters.search[1];
        ctrl.primaryFilters.responses = ['Yes', 'No'];

        spyOn(searchFactory, 'getMapDataForQuestion').and.returnValue(diferredMapData.promise);
        ctrl.getMapData(ctrl.primaryFilters, ctrl.selectedQuestion);

        diferredMapData.resolve(yrbsMockData.stateData);
        $scope.$apply();
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
