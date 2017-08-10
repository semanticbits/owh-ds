'use strict';

describe('OWH Side filter item component: ', function () {
    var $rootScope, $injector, $templateCache, $scope, filters, closeDeferred, controllerProvider,
        modalService, givenModalDefaults, ModalService, elementVisible, thenFunction, utilService;

    var $httpBackend, $compile, $http, $componentController;

    beforeEach(function () {
        module('owh');

        ModalService = jasmine.createSpy('ModalServiceMock');

        module(function ($provide) {
            ModalService.showModal = function (modalDefaults) {
                givenModalDefaults = modalDefaults;
                givenModalDefaults.element = {
                    show: function () {
                        elementVisible = true
                    },
                    hide: function () {
                        elementVisible = false
                    }
                };
                return {
                    then: function (func) {
                        thenFunction = func;
                    }
                };
            };
            $provide.value('ModalService', ModalService);
        });

        inject(function (_$rootScope_, _$state_, _$injector_, _$templateCache_, _$location_, _$compile_, _$http_,
            _$componentController_, _$q_, _$controller_, _utilService_) {
            $rootScope = _$rootScope_;
            $injector = _$injector_;
            $templateCache = _$templateCache_;
            $compile = _$compile_;
            $http = _$http_;
            $scope = $rootScope.$new();
            $httpBackend = $injector.get('$httpBackend');
            $componentController = _$componentController_;
            //modalService = _ModalService_;
            closeDeferred = _$q_.defer();
            controllerProvider = _$controller_;
            utilService = _utilService_
        });
        $templateCache.put('app/components/owh-side-filter/owhSideFilterItem.html', 'app/components/owh-side-filter/owhSideFilterItem.html');
        $templateCache.put('app/modules/home/home.html', 'app/modules/home/home.html');
        $templateCache.put('app/components/owh-footer/footer.html', 'app/components/owh-footer/footer.html');
        $templateCache.put('app/partials/marker-template.html', 'app/partials/marker-template.html');

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({ hello: 'World' });
        $httpBackend.whenGET('app/components/owh-side-filter/owhSideFilterItem.html').respond($templateCache.get('app/components/owh-side-filter/owhSideFilterItem.html'));
        $httpBackend.whenGET('app/components/owh-footer/footer.html').respond($templateCache.get('app/components/owh-footer/footer.html'));
        $httpBackend.whenGET('app/partials/marker-template.html').respond($templateCache.get('app/partials/marker-template.html'));
        $httpBackend.whenGET('/getFBAppID').respond({ data: { fbAppID: 1111111111111111 } });
        $httpBackend.whenGET('/yrbsQuestionsTree').respond({ data: {} });
        $httpBackend.whenGET('/pramsQuestionsTree').respond({ data: {} });
        $httpBackend.whenGET('jsons/conditions-ICD-10.json').respond({ data: [] });

        function searchResultsFn() {
        }

        filters = {
            selectedPrimaryFilter: {
                key: 'deaths', title: 'label.filter.mortality', primary: true, value: [], header: "Mortality",
                allFilters: [], searchResults: searchResultsFn, showMap: true,
                countLabel: 'Number of Deaths', mapData: {}, initiated: true,
                runOnFilterChange: true,
                sideFilters: [
                    {
                        filterGroup: false, collapse: false, allowGrouping: true, groupBy: false,
                        filters: {
                            key: 'race', title: 'label.filter.race', queryKey: "race", primary: false, value: [], groupBy: 'row',
                            type: "label.filter.group.demographics", showChart: true, defaultGroup: "column",
                            autoCompleteOptions: []
                        }
                    },
                    {
                        filterGroup: false, collapse: true, allowGrouping: true, groupBy: true,
                        filters: {
                            key: 'gender', title: 'label.filter.gender', queryKey: "sex", primary: false, value: [], groupBy: 'column',
                            type: "label.filter.group.demographics", groupByDefault: 'column', showChart: true,
                            autoCompleteOptions: [
                                { key: 'F', title: 'Female' },
                                { key: 'M', title: 'Male' }
                            ], defaultGroup: "column"
                        }
                    }
                ]
            }
        };
    });


    it('Should have the controller', inject(function ($httpBackend, $location) {
        var bindings = { filters: filters };
        var ctrl = $componentController('owhSideFilterItem', null, bindings);
        expect(ctrl).toBeDefined();//<aside>
    }));

    it("should call clearSelection on the filter", inject(function () {
        var bindings = { filters: filters, onFilter: function () { } };

        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        expect(ctrl).toBeDefined();
        var group = angular.copy(filters.selectedPrimaryFilter.sideFilters[0].filters);
        group.selectedValues = ["1", "2"];
        group.selectedNodes = ["1", "2"];
        //If allChecked
        ctrl.clearSelection(group, true);
        expect(group.value.length).toBe(0);
        expect(group.selectedValues.length).toBe(0);

        //Add values to group
        ctrl.clearSelection(group, false);
        expect(group.groupBy).toBe(false);
    }));

    it("Should show tree modal on selecting ucd filters", function () {
        var allFilters = [
            {
                key: 'question', title: 'label.yrbs.filter.question', queryKey: "question.path", aggregationKey: "question.key",
                primary: false, value: [], groupBy: 'row', filterType: 'tree', autoCompleteOptions: [], donotshowOnSearch: true,
                selectTitle: 'select.label.yrbs.filter.question', iconClass: 'fa fa-pie-chart purple-text', selectedValues: [], selectedNodes: []
            },
            {
                key: 'ucd-chapter-10', title: 'label.filter.ucd.icd.chapter', queryKey: "ICD_10_code.path",
                primary: true, value: [], groupBy: false, type: "label.filter.group.ucd", groupKey: "ucd",
                autoCompleteOptions: [], aggregationKey: "ICD_10_code.code", selectedValues: [{ id: "disease1", text: "disease1" }],
                selectedNodes: []
            }
        ];
        var selectedFilter = allFilters[1];
        var bindings = { filters: filters, onFilter: function () { } };
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        expect(ctrl).toBeDefined();

        ctrl.showModal(selectedFilter, allFilters);

        var modalCtrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise });
        modalCtrl.element = givenModalDefaults.element;
        modalCtrl.controller = modalCtrl;
        modalCtrl.optionValues = [{ id: "disease1", text: "disease1" }, { id: "disease2", text: "disease2" }];
        thenFunction(modalCtrl);
        expect(elementVisible).toBeTruthy();
        closeDeferred.resolve({});
        $scope.$apply();
        expect(elementVisible).toBeFalsy();
    });

    it("Should show tree modal on selecting mcd filters set 1", function () {
        var allFilters = [
            {
                key: 'mcd-chapter-10', title: 'label.filter.mcd', queryKey: "ICD_10_code.path",
                primary: false, value: { 'set1': [], 'set2': [] }, groupBy: false, type: "label.filter.group.mcd", groupKey: "mcd",
                autoCompleteOptions: [], filterType: 'conditions', selectTitle: 'select.label.filter.mcd', updateTitle: 'update.label.filter.mcd',
                aggregationKey: "ICD_10_code.path", groupOptions: filters.conditionGroupOptions,
                selectedValues: { set1: [{ id: "disease1", text: "disease1" }], set2: [] }, selectedNodes: { set1: [], set2: [] }
            }
        ];

        var selectedFilter = allFilters[0];
        var bindings = { filters: filters, onFilter: function () { } };
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        expect(ctrl).toBeDefined();

        ctrl.showMCDModal(selectedFilter, allFilters, 'set1');

        var modalCtrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise });
        modalCtrl.element = givenModalDefaults.element;
        modalCtrl.controller = modalCtrl;
        modalCtrl.optionValues = [{ id: "disease1", text: "disease1" }, { id: "disease2", text: "disease2" }];
        thenFunction(modalCtrl);

        expect(elementVisible).toBeTruthy();
        closeDeferred.resolve({});
        $scope.$apply();
        expect(elementVisible).toBeFalsy();
    });

    it("Should show tree modal on selecting YRBS Question filters", function () {
        var allFilters = [
            {
                key: 'question', title: 'label.yrbs.filter.question', queryKey: "question.path", aggregationKey: "question.key",
                primary: false, value: [], groupBy: 'row', filterType: 'tree', autoCompleteOptions: [], donotshowOnSearch: true,
                selectTitle: 'select.label.yrbs.filter.question', iconClass: 'fa fa-pie-chart purple-text',
                selectedValues: [], selectedNodes: []
            }
        ];
        var selectedFilter = allFilters[0];
        var bindings = { filters: filters, onFilter: function () { } };
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        expect(ctrl).toBeDefined();

        ctrl.showModal(selectedFilter, allFilters);

        var modalCtrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise });
        modalCtrl.element = givenModalDefaults.element;
        modalCtrl.controller = modalCtrl;
        modalCtrl.optionValues = [{
            id: "Q1", text: "Question 1", childNodes: [{ id: "qn1", text: "test ques1" },
            { id: "qn2", text: "test ques2" }]
        }, { id: "Q2", text: "Question 2" }];
        thenFunction(modalCtrl);
        expect(elementVisible).toBeTruthy();
        closeDeferred.resolve({});
        $scope.$apply();
        expect(elementVisible).toBeFalsy();
        expect(JSON.stringify(selectedFilter.selectedNodes)).toEqual(JSON.stringify(modalCtrl.optionValues))
        expect(JSON.stringify(selectedFilter.selectedValues)).toEqual(JSON.stringify([{ "id": "qn1", "text": "test ques1" }, { "id": "qn2", "text": "test ques2" }, { "id": "Q2", "text": "Question 2" }]))
    });

    it('Should show tree modal on selecting Cancer Site filter', function () {
        var allFilters = [{ key: 'site', selectedValues: [], selectedNodes: [] }];
        var selectedFilter = allFilters[0];
        var bindings = { filters: filters, onFilter: function () { } };
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        expect(ctrl).toBeDefined();

        ctrl.showModal(selectedFilter, allFilters);

        var modalCtrl = controllerProvider(givenModalDefaults.controller, { $scope: $scope, close: closeDeferred.promise });
        modalCtrl.element = givenModalDefaults.element;
        modalCtrl.controller = modalCtrl;
        modalCtrl.optionValues = [{ id: "site1", text: "Site 1", childNodes: [{ id: "site1.1", text: "Site 1.1" }, { id: "site1.2", text: "Site 1.2" }] }, { id: "site1.3", text: "Site 1.3" }];
        thenFunction(modalCtrl);
        expect(elementVisible).toBeTruthy();
        closeDeferred.resolve({});
        $scope.$apply();
        expect(elementVisible).toBeFalsy();
        expect(JSON.stringify(selectedFilter.selectedNodes)).toEqual(JSON.stringify(modalCtrl.optionValues))
        expect(JSON.stringify(selectedFilter.selectedValues)).toEqual(JSON.stringify([{ id: "site1.1", text: "Site 1.1" }, { id: "site1.2", text: "Site 1.2" }, { id: "site1.3", text: "Site 1.3" }]))
    });

    it("Should show next phase implementation popup on selecting other filters", function () {
        var allFilters = [{
            filterGroup: false, collapse: false, allowGrouping: true, groupBy: false,
            filters: {
                key: 'race', title: 'label.filter.race', queryKey: "race", primary: false, value: [], groupBy: 'row',
                type: "label.filter.group.demographics", showChart: true, defaultGroup: "column", selectedValues: [],
                autoCompleteOptions: []
            }
        }
        ];
        var selectedFilter = allFilters[0],
            bindings = { filters: filters };

        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        expect(ctrl).toBeDefined();

        //Should show next phase implementation
        ctrl.showModal(selectedFilter, allFilters);
    });

    it('should get visibility based on showFilters', function () {
        var showFilters = ['year', 'gender'];
        var bindings = { filters: filters, showFilters: showFilters };
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        var filter = { filters: { key: 'year' } };
        expect(ctrl.isVisible(filter)).toEqual(true);
    });

    it('should return boolean value based on filter option selection', function () {
        var selectedFilterOptions = ['01', '04', '14'];
        var bindings = { filters: filters, showFilters: [] };
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        var filter = { filters: { key: 'year' } };
        expect(ctrl.isOptionSelected({ key: '04', 'title': 'Arizona' }, selectedFilterOptions)).toEqual(true);
        expect(ctrl.isOptionSelected({ key: '44', 'title': 'Arizona' }, selectedFilterOptions)).toEqual(false);
        expect(ctrl.isOptionSelected({ key: '44', 'title': 'Arizona' }, [])).toEqual(false);
    });

    it('should return count display count for show/hide more options link for checkbox', function () {
        var options = ["01", "02", "05", "04", '10', '20', '35', '39', '56'];
        var optionGroup = { filterType: "checkbox", "key": "state", "value": ["01", "02", "05"], "displaySelectedFirst": true };

        var bindings = { filters: filters, showFilters: [] };
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        var filter = { filters: { key: 'year' } };
        //When displaySelectedFirst = true
        //count= total options-(3+selected options)
        expect(ctrl.getShowHideOptionCount(optionGroup, options)).toEqual(3);
        optionGroup.value = [];
        expect(ctrl.getShowHideOptionCount(optionGroup, options)).toEqual(6);

        //When displaySelectedFirst = false
        //count= total options- 3
        optionGroup.displaySelectedFirst = false;
        optionGroup.value = ["01", "02"];
        expect(ctrl.getShowHideOptionCount(optionGroup, options)).toEqual(6);
        optionGroup.value = [];
        expect(ctrl.getShowHideOptionCount(optionGroup, options)).toEqual(6);
    });

    it('should return count display count for show/hide more options link for radio', function () {
        var options = ["01", "02", "05", "04", '10', '20', '35', '39', '56'];
        var optionGroup = { filterType: "radio", "key": "state", "value": "01", "displaySelectedFirst": true };
        var bindings = { filters: filters, showFilters: [] };
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        //When displaySelectedFirst = true and and a non all option is selected
        //count= total options-(3+selected options)
        expect(ctrl.getShowHideOptionCount(optionGroup, options)).toEqual(5);
        optionGroup.value = '';
        expect(ctrl.getShowHideOptionCount(optionGroup, options)).toEqual(6);

        //When displaySelectedFirst = false
        //count= total options- 3
        optionGroup = { "key": "state", "value": "01", "displaySelectedFirst": false };
        expect(ctrl.getShowHideOptionCount(optionGroup, options)).toEqual(6);
    });

    it('filterGroup should properly toggle group keys in value array', function () {
        var bindings = { filters: filters, onFilter: angular.noop };
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        var option = {
            key: 'hispanic',
            options: [
                {
                    key: 'Cuban'
                },
                {
                    key: 'Dominican'
                }
            ]
        };

        var group = {
            value: []
        };

        group.value.push('hispanic');
        ctrl.filterGroup(option, group);

        expect(group.value).toContain('Cuban');
        expect(group.value).toContain('Dominican');

        group.value.splice(0, 1);
        ctrl.filterGroup(option, group);

        expect(group.value.length).toEqual(0);

        group.value.push('hispanic');
        group.value.push('Cuban');
        ctrl.filterGroup(option, group);

        expect(group.value).toContain('Cuban');
        expect(group.value).toContain('Dominican');
    });

    it('isSubOptionSelected should check if group child option is included in value', function () {
        var bindings = { filters: filters };
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);

        var option = {
            options: [
                {
                    key: 'Cuban'
                },
                {
                    key: 'Dominican'
                }
            ]
        };

        var group = {
            value: []
        };

        expect(ctrl.isSubOptionSelected(group, option)).toBeFalsy();

        group.value.push('Cuban');

        expect(ctrl.isSubOptionSelected(group, option)).toBeTruthy();

        group.value = ['Non-Hispanic'];

        expect(ctrl.isSubOptionSelected(group, option)).toBeFalsy();
    });

    it('isOptionDisabled should make sure Unknown and other ethnicity options are mutually exclusive', function () {
        var bindings = { filters: filters };
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);

        var hispanicOption = {
            key: 'Hispanic'
        };

        var unknownOption = {
            key: 'Unknown'
        };

        var nonHispanicOption = {
            key: 'Non-Hispanic'
        };

        var group = {
            key: 'hispanicOrigin',
            value: []
        };

        expect(ctrl.isOptionDisabled(group, unknownOption)).toBeFalsy();
        expect(ctrl.isOptionDisabled(group, hispanicOption)).toBeFalsy();
        expect(ctrl.isOptionDisabled(group, nonHispanicOption)).toBeFalsy();

        group.value.push('Cuban');

        expect(ctrl.isOptionDisabled(group, unknownOption)).toBeTruthy();

        group.value = ['Unknown'];

        expect(ctrl.isOptionDisabled(group, hispanicOption)).toBeTruthy();
    });

    it('updateGroupValue should not call onFilter when runOnFilterUpdate is false', function () {
        var bindings = { filters: filters, onFilter: function () { }, onFilterValueChange: function () { } };
        bindings.filters.selectedPrimaryFilter.runOnFilterChange = false;
        var ctrl = $componentController('owhSideFilterItem', { $scope: $scope }, bindings);
        ctrl.filter = { filters: { value: [] } };

        spyOn(ctrl, 'onFilter');

        ctrl.updateGroupValue();

        expect(ctrl.onFilter).not.toHaveBeenCalled();
    });
});
