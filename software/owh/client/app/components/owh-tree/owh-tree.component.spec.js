'use strict';

describe('owhTree component: ', function() {
    var $rootScope, $injector, $templateCache, $scope;
    var $httpBackend, $compile, $http, $componentController;


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
        });
        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');
        $templateCache.put('app/components/owh-tree/owhTree.html', 'app/components/owh-tree/owhTree.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/partials/marker-template.html').respond( $templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('app/components/owh-tree/owhTree.html').respond( $templateCache.get('app/components/owh-tree/owhTree.html'));
        $httpBackend.whenGET('/getFBAppID').respond({data: { fbAppID: 1111111111111111}});
        $httpBackend.whenGET('/yrbsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('jsons/conditions-ICD-10.json').respond({data: []});
        $httpBackend.whenGET('/brfsQuestionsTree').respond({data: { }});

    });


    it('Should render the tree ', inject(function(){
        var element = angular.element('<owh-tree code-key="codeKey" option-values="optionValues"></owh-tree>');
        element = $compile(element)($scope);
        $scope.optionValue = [{"key": "Y455", "title": "4-Aminophenol derivatives (Y45.5)"},
            {"key": "Q991", "title": "46,XX true hermaphrodite (Q99.1)"}
        ];
        $scope.codeKey = "ucd-chapter-10";
        $scope.$apply();
        var ucd_tree = element.find("div#ucd-chapter-10");
        expect(ucd_tree).toBeDefined();
    }));

    it('Should have controller', inject(function ($httpBackend, $location) {
        var bindings = {};
        var ctrl = $componentController('owhTree', {$scope: $scope}, bindings);
        expect(ctrl).toBeDefined();
    }));

    it('Should call ac function', inject(function ($httpBackend, $location) {
        var bindings = {};
        var ctrl = $componentController('owhTree', {$scope: $scope}, bindings);
        expect(ctrl.ac()).toBe(true);
    }));

    it('Should call error function', inject(function ($httpBackend, $location) {
        var ctrl = $componentController('owhTree', {$scope: $scope}, null);
        expect(ctrl.treeEventsObj).toBeDefined();
        ctrl.treeConfig.core.error({});
    }));


    it('Should call JSTREE call back functions', inject(function ($httpBackend, $location) {
        var optionValues = [{"key": "Y455", "title": "4-Aminophenol derivatives (Y45.5)"},
            {"key": "Q991", "title": "46,XX true hermaphrodite (Q99.1)"}
        ];
        var codeKey = 'ucd-chapter-10';
        var bindings = {optionValues: optionValues, codeKey: codeKey};

        var ctrl = $componentController('owhTree', {$scope: $scope}, bindings);
        expect(ctrl.treeEventsObj).toBeDefined();
        ctrl.treeInstance = {jstree:function(){}};
        ctrl.treeEventsObj.ready();
    }));

    it('Should call select call back functions', inject(function ($timeout) {
        var ctrl = $componentController('owhTree', {$scope: $scope});
        expect(ctrl.treeEventsObj).toBeDefined();

        /*Dummy jstree object*/
        ctrl.treeInstance = {jstree:function(){
            return  {
                get_selected:function() {
                    return [{"id": "Q991", "text": "46,XX true hermaphrodite (Q99.1)", children:[]}]
                }
            }
        }};
        ctrl.treeEventsObj.select_node({});
        ctrl.treeEventsObj.deselect_node({});

        // flush timeout(s) for all code under test.
        $timeout.flush();
        expect(ctrl.optionValues[0].text).toEqual("46,XX true hermaphrodite (Q99.1)");
    }));

    it('Should call select call back functions for yrbs leaf questions', inject(function ($timeout) {
        var ctrl = $componentController('owhTree', {$scope: $scope});
        expect(ctrl.treeEventsObj).toBeDefined();

        /*Dummy jstree object*/
        ctrl.treeInstance = {jstree:function(){
            return  {
                get_selected:function() {
                    return [{"id": "qn14", "text": "Carried a gun(on at least 1 day during the 30 days before the survey)", children:[]}]
                }
            }
        }};
        ctrl.treeEventsObj.select_node({});
        $timeout.flush();
        expect(ctrl.optionValues[0].text).toEqual("Carried a gun(on at least 1 day during the 30 days before the survey)");
    }));

    it('Should call select call back functions for yrbs parent node questions', inject(function ($timeout) {
        var ctrl = $componentController('owhTree', {$scope: $scope});
        expect(ctrl.treeEventsObj).toBeDefined();

        /*Dummy jstree object*/
        ctrl.entityName = 'Question';
        ctrl.treeInstance = {jstree:function(){
            return  {
                get_selected:function() {
                    return [{"id": "j1_1", "text": "Unintentional Injuries",  children:["qn21", "qn18"]}];
                },
                get_json: function (id) {
                    return {"id": "j1_1", "text": "Unintentional Injuries",
                        children:[{"id": "qn21", "text": "Were ever physically forced", "parent":"j1_1", "children": [] },
                                  { "id": "qn18", "text": "Were in a physical fight", "parent":"j1_1", "children": []}]};
                }
            }
        }};
        ctrl.treeEventsObj.select_node({});
        $timeout.flush();

        expect(ctrl.optionValues[0].text).toEqual("Unintentional Injuries");
    }));

    it('Should call search function', inject(function ($timeout) {
        var optionValues = [
            {"id": "Y455", "text": "4-Aminophenol derivatives (Y45.5)"}
        ];
        var codeKey = 'ucd-chapter-10';
        var bindings = {optionValues: optionValues, codeKey: codeKey};

        var ctrl = $componentController('owhTree', {$scope: $scope}, bindings);

        var element = angular.element('<input id="search_text" type="text" value="abc"/>');
        element.appendTo(document.body);
        $compile(element)($scope);
        $scope.$digest();

        expect(ctrl.treeEventsObj).toBeDefined();

        /*Dummy jstree object*/
        ctrl.treeInstance = {jstree:function(){
            return  {
                search:function() {
                    return [{"id": "Q991", "text": "46,XX true hermaphrodite (Q99.1)"}]
                },
                clear_search:function () {}
            }
        }};
        ctrl.searchTree({});
        $timeout.flush();
        element.remove();
    }));


    it('Should call jstree clear function', inject(function ($timeout) {
        var optionValues = [
            {"id": "Y455", "text": "4-Aminophenol derivatives (Y45.5)"}
        ];
        var codeKey = 'ucd-chapter-10';
        var bindings = {optionValues: optionValues, codeKey: codeKey};

        var ctrl = $componentController('owhTree', {$scope: $scope}, bindings);

        var element = angular.element('<input id="search_text" type="text"  value="a"/>');
        element.appendTo(document.body);
        $compile(element)($scope);
        $scope.$digest();


        expect(ctrl.treeEventsObj).toBeDefined();

        /*Dummy jstree object*/
        ctrl.treeInstance = {jstree:function(){
            return  {
                search:function() {
                    return [{"id": "Q991", "text": "46,XX true hermaphrodite (Q99.1)"}]
                },
                clear_search:function () {}
            }
        }};

        ctrl.searchTree({});
        $timeout.flush();
    }));

});
