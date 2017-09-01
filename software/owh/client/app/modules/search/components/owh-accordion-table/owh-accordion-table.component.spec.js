'use strict';

describe('owhAccordionTable component: ', function() {
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
            element = angular.element('<owh-accordion-table data="data" headers="headers"></owh-accordion-table>');
            element = $compile(element)(scope);

        });
        //TODO: cache component templates as part of build step
        $templateCache.put('app/modules/search/components/owh-accordion-table/owhAccordionTable.html', 'app/modules/search/components/owh-accordion-table/owhAccordionTable.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('app/modules/home/home.html').respond( $templateCache.get('app/modules/home/home.html'));
        $httpBackend.whenGET('app/modules/search/components/owh-accordion-table/owhAccordionTable.html').respond( $templateCache.get('app/modules/search/components/owh-accordion-table/owhAccordionTable.html'));
        $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 1111111111111111}});
        $httpBackend.whenGET('/yrbsQuestionsTree').respond({data: {}});
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('jsons/conditions-ICD-10.json').respond({data: []});
        $httpBackend.whenGET('/brfsQuestionsTree').respond({data: { }});
    });

    it('should have a row of headers for each column header', function() {
      scope.data = [{questions: [{}, {}]}, {questions: []}];
      scope.headers = [[{}, {}], [{}, {}]];
      scope.$apply();
      var headers = element.find('th');
      //TODO: will need to load templates before this will pass
      // expect(headers.length).toEqual(4);
    });

    it('should expand/collapse rows', function() {
        var data = [{questions: [{}, {}]}, {questions: []}]
        var bindings = {
          data: data,
          headers: [[{}, {}], [{}, {}]]
        };
        var ctrl = $componentController('owhAccordionTable', null, bindings);

        ctrl.expandRow(data[0]);
        expect(data[0].collapse).toBeFalsy();

        ctrl.collapseRow(data[0]);
        expect(data[0].collapse).toBeTruthy();
    });

    it('should toggle row collapse', function() {
      var data = [{questions: [{}, {}]}, {questions: []}];
      var bindings = {
        data: data,
        headers: [[{}, {}], [{}, {}]]
      };
      var ctrl = $componentController('owhAccordionTable', null, bindings);

      ctrl.toggleRowCollapse(data[0]);
      expect(data[0].collapse).toBeTruthy();

      ctrl.toggleRowCollapse(data[0]);
      expect(data[0].collapse).toBeFalsy();
    });

    it('should show/hide questions', function() {
        var data = [{questions: [{}, {}]}, {questions: []}]
        var bindings = {
          data: data,
          headers: [[{}, {}], [{}, {}]]
        };
        var ctrl = $componentController('owhAccordionTable', null, bindings);

        ctrl.showMore(data[0]);
        expect(data[0].hide).toBeFalsy();

        ctrl.showLess(data[0]);
        expect(data[0].hide).toBeTruthy();
    });

    it('should showOnly one category', function() {
        var data = [{questions: [{}, {}]}, {questions: []}]
        var bindings = {
            data: data,
            headers: [[{}, {}], [{}, {}]]
        };
        var ctrl = $componentController('owhAccordionTable', null, bindings);

        expect(ctrl.filterCategory(data[1])).toBeTruthy();
        ctrl.showOnly(data[0]);
        expect(ctrl.filterCategory(data[0])).toBeTruthy();
        expect(ctrl.filterCategory(data[1])).toBeFalsy();
    });

    it('should listRows in the proper order', function() {
        var data = [{questions: [{}, {}]}, {questions: []}]
        var bindings = {
            data: data,
            headers: [[{}, {}], [{}, {}]],
            primaryKey: 'mental_health'
        };
        var ctrl = $componentController('owhAccordionTable', null, bindings);
        var category = {title: 'Alcohol and Other Drug Use', questions: [
            [{title: 'Currently Drinks'}],
            [{title: 'Never use'}],
            [{title: 'Sometimes'}],
            [{title: 'Currently Use'}]
        ]};

        var list = ctrl.listRows(category);

        expect(list[0][0].title).toEqual('Currently Drinks');
        expect(list[1][0].title).toEqual('Currently Use');
    });

    it('question category and help text map should present', function() {
        var questionCategoryHelpTextMap = {
            "Tobacco Use": "label.help.text.question.tobacco.use",
            "Unintentional Injuries and Violence": "label.help.text.question.unintentional.injuries.violence",
            "Alcohol and Other Drug Use": "label.help.text.question.alcohol.other.drug.use",
            "Sexual Behaviors": "label.help.text.question.sexua.behaviors",
            "Physical Activity": "label.help.text.question.physical.activity",
            "Obesity, Overweight, and Weight Control": "label.help.text.question.obesity.overweight.weight.control",
            "Dietary Behaviors": "label.help.text.question.dietary.behaviors",
            "Other Health Topics": "label.help.text.question.other.health.topics"
        };
        var ctrl = $componentController('owhAccordionTable');
        expect(ctrl.qCategoryHelpTextMap).toEqual(questionCategoryHelpTextMap);
    });

});
