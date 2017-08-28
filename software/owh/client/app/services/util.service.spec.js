'use strict';

/*group of common test goes here as describe*/
describe('utilService', function(){
    var utils, list, tableData, multipleColumnsTableData, noColumnsTableData, noRowsTableData,
        multipleColumnsTableDataWithUnmatchedColumns, singleValuedTableData, $q, $scope, filterUtils;

    beforeEach(module('owh'));

    beforeEach(inject(function ($injector,_$rootScope_, _$state_, _$q_) {
        utils = $injector.get('utilService');
        filterUtils = $injector.get('filterUtils');
        $q = _$q_;
        $scope= _$rootScope_.$new();
        var $httpBackend = $injector.get('$httpBackend');
        list = [
            {key: '1', title: 'Sunday', show: true},
            {key: '2', title: 'Monday', show: true},
            {key: '3', title: 'Tuesday', show: true},
            {key: '4', title: 'Wednesday'},
            {key: '5', title: 'Thursday'},
            {key: '6', title: 'Friday'},
            {key: '7', title: 'Saturday'},
            {key: '9', title: 'Unknown'}
        ];
        tableData = __fixtures__['app/services/fixtures/util.service/tableData'];

        multipleColumnsTableData = __fixtures__['app/services/fixtures/util.service/multipleColumnsTableData'];

        multipleColumnsTableDataWithUnmatchedColumns = __fixtures__['app/services/fixtures/util.service/multipleColumnsTableDataWithUnmatchedColumns'];

        noColumnsTableData = __fixtures__['app/services/fixtures/util.service/noColumnsTableData'];

        noRowsTableData = __fixtures__['app/services/fixtures/util.service/noRowsTableData'];

        singleValuedTableData = __fixtures__['app/services/fixtures/util.service/noRowsTableData'];

        $httpBackend.whenGET('app/i18n/messages-en.json').respond({});
        $httpBackend.whenGET('app/partials/marker-template.html').respond( {});
        $httpBackend.whenGET('/getFBAppID').respond({});
        $httpBackend.whenGET('/yrbsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('/pramsQuestionsTree').respond({data: { }});
        $httpBackend.whenGET('app/modules/home/home.html').respond({data: { }});
        $httpBackend.whenGET('jsons/conditions-ICD-10.json').respond({data: []});
    }));

    it('test utils isValueNotEmpty for undefined', function () {
        expect(utils.isValueNotEmpty(undefined)).toBeFalsy();
    });

    it('test utils isValueNotEmpty for null', function () {
        expect(utils.isValueNotEmpty(null)).toBeFalsy();
    });

    it('test utils isValueNotEmpty for object', function () {
        expect(utils.isValueNotEmpty({a: 1})).toBeTruthy();
        expect(utils.isValueNotEmpty({})).toBeFalsy();
    });

    it('test utils isValueNotEmpty for array', function () {
        expect(utils.isValueNotEmpty(['1', '2'])).toBeTruthy();
        expect(utils.isValueNotEmpty([])).toBeFalsy();
    });

    it('test utils isValueNotEmpty for string', function () {
        expect(utils.isValueNotEmpty('1')).toBeTruthy();
        expect(utils.isValueNotEmpty('')).toBeFalsy();
    });

    it('test utils isValuesNotEmptyInArray', function () {
        expect(utils.isValuesNotEmptyInArray(['1'])).toBeTruthy();
        expect(utils.isValuesNotEmptyInArray(['1', ''])).toBeTruthy();
        expect(utils.isValuesNotEmptyInArray([])).toBeFalsy();
        expect(utils.isValuesNotEmptyInArray([''])).toBeFalsy();
    });

    it('test utils isDateString', function () {
        expect(utils.isDateString("11/12/2016")).toBeTruthy();
        expect(utils.isDateString("Invalid date")).toBeFalsy();
    });

    it('test utils convertDateToString', function () {
        var result = utils.convertDateToString(new Date('12/12/2015'), 'yyyy-MM-dd');
        expect(result).toEqual('2015-12-12');
    });

    it('test utils findFilterByKeyAndValue', function () {
        //if found
        var filters = [{"key":"state","value":["AK"],"autoCompleteOptions":[{"key":"AL"},{"key":"AK"}]}];
        var stateFilter = utils.findFilterByKeyAndValue(filters, 'key', 'state');
        expect(stateFilter.key).toEqual('state');

        //not found
        var filter = utils.findFilterByKeyAndValue(filters, 'key', 'race');
        expect(filter).toEqual(null);
    });

    it('test utils isFilterApplied', function () {
        //if filter applied
        var filter = {"key":"state","value":["AK"],"autoCompleteOptions":[{"key":"AL"},{"key":"AK"}]};
        var isFilterApplied = utils.isFilterApplied(filter);
        expect(isFilterApplied).toEqual(true);

        filter = {"key":"state","value":["AK"], groupBy:'row', "autoCompleteOptions":[{"key":"AL"},{"key":"AK"}]};
        isFilterApplied = utils.isFilterApplied(filter);
        expect(isFilterApplied).toEqual(true);

        //not applied
        filter = {"key":"state","value":[], groupBy:false, "autoCompleteOptions":[{"key":"AL"},{"key":"AK"}]};
        isFilterApplied = utils.isFilterApplied(filter);
        expect(isFilterApplied).toEqual(false);
    });

    it('test utils formatDateString', function () {
        expect(utils.formatDateString('11/12/2016', 'MM/dd/yyyy', 'yyyy-MM-dd')).toEqual('2016-11-12');
    });

    it('test utils findByKeyAndValue', function () {
        var result = utils.findByKeyAndValue(list, 'title', 'Sunday');
        expect(result).toEqual({key: '1', title: 'Sunday', show: true});
    });

    it('test utils findByKeyAndValue to return null', function () {
        var result = utils.findByKeyAndValue(list, 'title', 'Sunday1');
        expect(result).toEqual(null);
    });

    it('test utils findIndexByKeyAndValue', function () {
        var result = utils.findIndexByKeyAndValue(list, 'title', 'Sunday');
        expect(result).toEqual(0);
    });

    it('test utils findIndexByKeyAndValue to return -1', function () {
        var result = utils.findIndexByKeyAndValue(list, 'title', 'Sunday1');
        expect(result).toEqual(-1);
    });

    it('test utils sortByKey', function () {
        var result = utils.sortByKey(list, 'title');
        expect(result[0].title).toEqual('Friday');
    });

    it('test utils sortByKey asc', function () {
        var result = utils.sortByKey(list, 'title', true);
        expect(result[0].title).toEqual('Friday');
    });

    it('test utils sortByKey desc', function () {
        var result = utils.sortByKey(list, 'title', false);
        expect(result[0].title).toEqual('Wednesday');
    });

    it('test utils sortByKey with key as function', function () {
        var result = utils.sortByKey(list, function(obj) {return obj.title});
        expect(result[0].title).toEqual('Friday');
    });

    it('test utils sortByKey with duplicates in list', function () {
        list.push(list[list.length - 1]);
        var result = utils.sortByKey(list, 'title');
        expect(result[0].title).toEqual('Friday');
    });

    it('test utils sortByKey desc with duplicates in list', function () {
        list.push(list[list.length - 1]);
        var result = utils.sortByKey(list, 'title', false);
        expect(result[0].title).toEqual('Wednesday');
    });

    it('test utils findByKey', function () {
        var result = utils.findByKey(list, 'show');
        expect(result).toEqual({key: '1', title: 'Sunday', show: true});
    });

    it('test utils findByKey to return null', function () {
        var result = utils.findByKey(list, 'title1');
        expect(result).toEqual(null);
    });

    it('test utils findAllByKeyAndValue expecting multiple results', function () {
        var result = utils.findAllByKeyAndValue(list, 'show', true);
        expect(result.length).toEqual(3);
        expect(result[0].key).toEqual('1');
    });

    it('test utils findAllByKeyAndValue expecting single results', function () {
        var result = utils.findAllByKeyAndValue(list, 'title', 'Sunday');
        expect(result).toEqual([{key: '1', title: 'Sunday', show: true}]);
    });

    it('test utils findAllNotContainsKeyAndValue', function () {
        var result = utils.findAllNotContainsKeyAndValue(list, 'show', true);
        expect(result.length).toEqual(5);
        expect(result[0].key).toEqual('4');
    });

    it('test utils findAllByKeyAndValuesArray', function () {
        var result = utils.findAllByKeyAndValuesArray(list, 'key', ['1', '2']);
        expect(result.length).toEqual(2);
        expect(result[0].key).toEqual('1');
    });

    it('test utils updateAllByKeyAndValue', function () {
        var result = utils.findAllByKeyAndValue(list, 'show', true);
        expect(result.length).toEqual(3);

        utils.updateAllByKeyAndValue(list, 'show', true);

        result = utils.findAllByKeyAndValue(list, 'show', true);
        expect(result.length).toEqual(8);
    });

    it('test utils numberWithCommas', function () {
        expect(utils.numberWithCommas(121212)).toEqual("121,212");
    });

    it('test utils getValueFromOptions', function () {
        expect(utils.getValueFromOptions(list, 'key', '1', 'title')).toEqual('Sunday');
        expect(utils.getValueFromOptions(list, 'key', '10', 'title')).toEqual('10');
        expect(utils.getValueFromOptions(list, 'key', '10', 'title', 'Not Specified')).toEqual('Not Specified');
        expect(utils.getValueFromOptions(undefined, 'key', '10', 'title', 'Not Specified')).toEqual('Not Specified');
    });

    it('test utils prepareMixedTableData', function () {
        var result = utils.prepareMixedTableData(tableData.headers, tableData.data, tableData.countKey, tableData.totalCount, tableData.countLabel, tableData.calculatePercentage, tableData.calculateRowTotal);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(tableData.expectedResult));
    });

    it('test utils prepareMixedTableData for multiple column headers', function () {
        var result = utils.prepareMixedTableData(multipleColumnsTableData.headers, multipleColumnsTableData.data, multipleColumnsTableData.countKey, multipleColumnsTableData.totalCount, multipleColumnsTableData.countLabel, multipleColumnsTableData.calculatePercentage, multipleColumnsTableData.calculateRowTotal);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(multipleColumnsTableData.expectedResult));
    });

    it('test utils prepareMixedTableData for multiple column headers with unmatched columns', function () {
        var result = utils.prepareMixedTableData(multipleColumnsTableDataWithUnmatchedColumns.headers,
            multipleColumnsTableDataWithUnmatchedColumns.data, multipleColumnsTableDataWithUnmatchedColumns.countKey,
            multipleColumnsTableDataWithUnmatchedColumns.totalCount, multipleColumnsTableDataWithUnmatchedColumns.countLabel,
            multipleColumnsTableDataWithUnmatchedColumns.calculatePercentage, multipleColumnsTableDataWithUnmatchedColumns.calculateRowTotal);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(multipleColumnsTableDataWithUnmatchedColumns.expectedResult));
    });

    it('test utils prepareMixedTableData for no column headers', function () {
        var result = utils.prepareMixedTableData(noColumnsTableData.headers, noColumnsTableData.data, noColumnsTableData.countKey, noColumnsTableData.totalCount, noColumnsTableData.countLabel, noColumnsTableData.calculatePercentage, noColumnsTableData.calculateRowTotal);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(noColumnsTableData.expectedResult));
    });

    it('test utils prepareMixedTableData for no row headers and with calculatePercentage', function () {
        var result = utils.prepareMixedTableData(noRowsTableData.headers, noRowsTableData.data, noRowsTableData.countKey, noRowsTableData.totalCount, noRowsTableData.countLabel, noRowsTableData.calculatePercentage, noRowsTableData.calculateRowTotal);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(noRowsTableData.expectedResult));
    });

    it('test utils prepareMixedTableData for no row headers and without calculatePercentage', function () {
        var result = utils.prepareMixedTableData(singleValuedTableData.headers, singleValuedTableData.data, singleValuedTableData.countKey, singleValuedTableData.totalCount, singleValuedTableData.countLabel, singleValuedTableData.calculatePercentage, singleValuedTableData.calculateRowTotal);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(singleValuedTableData.expectedResult));
    });

    it('test utils prepareMixedTableData for numbers and percentages', function () {
        //Implementation pending
        var result = utils.prepareMixedTableData(tableData.headers, tableData.data, tableData.countKey,
            tableData.totalCount, tableData.countLabel, tableData.calculatePercentage, tableData.calculateRowTotal);
        expect(result).not.toBe(null);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(tableData.expectedResult));
    });

    it('should not calculate percentages for suppressed counts', function () {
        var tableData = __fixtures__['app/services/fixtures/util.service/mortalitySuppressedCountTable'];
        var result = utils.prepareMixedTableData(tableData.headers, tableData.data,
            'deaths', "suppressed", tableData.countLabel, true, tableData.calculateRowTotal);
        var row = result.data[0];
        expect(row[1].percentage).toEqual(undefined);
        expect(row[2].percentage).toEqual(undefined);
    });

    it('test utils prepareMixedTableData for std row and column headers', function () {
        var stdHeadersAndData = __fixtures__['app/services/fixtures/util.service/stdHeadersAndData'];
        var result = utils.prepareMixedTableData(stdHeadersAndData.headers, stdHeadersAndData.data, 'std', 1, undefined, true, undefined, ["pop"], ["Both sexes", "All races/ethnicities", "All age groups", "National"]);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(stdHeadersAndData.expectedResults));
    });

    it('test utils concatenateByKey', function () {
        expect(utils.concatenateByKey(list, 'title', ',')).toEqual("Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Unknown");
        expect(utils.concatenateByKey(list, 'key')).toEqual("1, 2, 3, 4, 5, 6, 7, 9");
    });

    it('test utils getValuesByKeyIncludingKeyAndValue', function () {
        expect(utils.getValuesByKeyIncludingKeyAndValue(list, 'title', 'show', true)).toEqual([ 'Sunday', 'Monday', 'Tuesday' ]);
    });

    it('test utils getValuesByKeyExcludingKeyAndValue', function () {
        expect(utils.getValuesByKeyExcludingKeyAndValue(list, 'title', 'show', true)).toEqual([ 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Unknown' ]);
    });

    it('test utils getMinAndMaxValue', function () {
        expect(utils.getMinAndMaxValue([3, 1, 7, 2, 9, 5])).toEqual({ minValue: 1, maxValue: 9 });
    });

    it('test utils generateMapLegendLabels', function () {
        expect(utils.generateMapLegendLabels(10000, 70000)).toEqual([ '> 40,000', '> 34,000', '> 28,000', '> 22,000', '> 16,000', '> 10,000', '< 10,000' ]);
        expect(utils.generateMapLegendLabels(10000, 10490)).toEqual([ '> 10,500', '> 10,400', '> 10,300', '> 10,200', '> 10,100', '> 10,000', '< 10,000' ]);
    });

    it('refreshFilterAndOptions options should set filter option correctly - with category property ', inject(function(SearchService) {
        var deferred = $q.defer();
        var filters= [
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:"row",
                filters: {key: 'year', title: 'label.filter.year', queryKey:"year", primary: false, value: [2000, 2014], groupBy: 'row',
                    type:"label.filter.group.year", showChart: true, defaultGroup:"column",
                    autoCompleteOptions: []}
            },
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:false,
                filters: {key: 'race', title: 'label.filter.race', queryKey:"race", primary: false, value: [], groupBy: 'row',
                    type:"label.filter.group.demographics", showChart: true, defaultGroup:"column",
                    autoCompleteOptions: [{key:'White','title':'White'}]}
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,groupBy:true,
                filters: {key: 'gender', title: 'label.filter.gender', queryKey:"sex", primary: false, value: [], groupBy: 'column',
                    type:"label.filter.group.demographics", groupByDefault: 'column', showChart: true,
                    autoCompleteOptions: [
                        {key:'F',title:'Female'},
                        {key:'M',title:'Male'}
                    ], defaultGroup:"column"
                }
            },
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:false,
                filters: {key: 'ethnicity', title: 'label.filter.ethnicity', queryKey:"ethnicity", primary: false, value: ['Hispanic'], groupBy: 'row',
                    type:"label.filter.group.ethnicity", showChart: true, defaultGroup:"column",
                    autoCompleteOptions: [{key:'Hispanic','title':'Hispanic'},{key:'Non-Hispanic','title':'Non-Hispanic'}]}
            }
        ];

        var categories = [{"category":"Birth Characteristics","sideFilters":filters}];

        spyOn(SearchService, 'getDsMetadata').and.returnValue(deferred.promise);

        utils.refreshFilterAndOptions({ queryKey: "year", value: ["2000"]}, categories, 'deaths');
        expect(SearchService.getDsMetadata).toHaveBeenCalledWith("deaths","2000");
        deferred.resolve({"status":"OK","data":{"sex":["M"],"ethnicity":[]}});
        $scope.$apply();
        expect(filters[0].disabled).toBeFalsy();
        expect(filters[0].groupBy).toEqual("row");
        expect(filters[1].disabled).toBeTruthy();
        expect(filters[1].groupBy).toBeFalsy();
        expect(filters[2].disabled).toBeFalsy();
        expect(filters[2].filters.autoCompleteOptions[0].disabled).toBeTruthy();
        expect(filters[2].filters.autoCompleteOptions[1].disabled).toBeFalsy();
        expect(filters[3].disabled).toBeFalsy();
    }));


    it('refreshFilterAndOptions options should set filter option correctly - without category property ', inject(function(SearchService) {

        var deferred = $q.defer();
        var filters= [
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:"row",
                filters: {key: 'year', title: 'label.filter.year', queryKey:"year", primary: false, value: [2000, 2014], groupBy: 'row',
                    type:"label.filter.group.year", showChart: true, defaultGroup:"column",
                    autoCompleteOptions: []}
            },
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:false,
                filters: {key: 'race', title: 'label.filter.race', queryKey:"race", primary: false, value: [], groupBy: 'row',
                    type:"label.filter.group.demographics", showChart: true, defaultGroup:"column",
                    autoCompleteOptions: [{key:'White','title':'White'}]}
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,groupBy:true,
                filters: {key: 'gender', title: 'label.filter.gender', queryKey:"sex", primary: false, value: [], groupBy: 'column',
                    type:"label.filter.group.demographics", groupByDefault: 'column', showChart: true,
                    autoCompleteOptions: [
                        {key:'F',title:'Female'},
                        {key:'M',title:'Male'}
                    ], defaultGroup:"column"
                }
            },
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:false,
                filters: {key: 'ethnicity', title: 'label.filter.ethnicity', queryKey:"ethnicity", primary: false, value: ['Hispanic'], groupBy: 'row',
                    type:"label.filter.group.ethnicity", showChart: true, defaultGroup:"column",
                    autoCompleteOptions: [{key:'Hispanic','title':'Hispanic'},{key:'Non-Hispanic','title':'Non-Hispanic'}]}
            }
        ];

        var categories = [{"sideFilters":filters}];

        spyOn(SearchService, 'getDsMetadata').and.returnValue(deferred.promise);

        utils.refreshFilterAndOptions({ queryKey: "year", value: ["2000"]}, categories, 'deaths');
        expect(SearchService.getDsMetadata).toHaveBeenCalledWith("deaths","2000");
        deferred.resolve({"status":"OK","data":{"sex":["M"],"ethnicity":[]}});
        $scope.$apply();
        expect(filters[0].disabled).toBeFalsy();
        expect(filters[0].groupBy).toEqual("row");
        expect(filters[1].disabled).toBeTruthy();
        expect(filters[1].groupBy).toBeFalsy();
        expect(filters[2].disabled).toBeFalsy();
        expect(filters[2].filters.autoCompleteOptions[0].disabled).toBeTruthy();
        expect(filters[2].filters.autoCompleteOptions[1].disabled).toBeFalsy();
        expect(filters[3].disabled).toBeFalsy();
    }));

    it('refreshFilterAndOptions options should set filter option correctly - for Crude Death Rates ', inject(function(SearchService) {
        var deferred = $q.defer();
        var filters= [
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:"row",
                filters: {key: 'year', title: 'label.filter.year', queryKey:"year", primary: false, value: [2015], groupBy: 'row',
                    type:"label.filter.group.year", showChart: true, defaultGroup:"column",
                    autoCompleteOptions: []}
            },
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:false,
                filters: {key: 'race', title: 'label.filter.race', queryKey:"race", primary: false, value: [], groupBy: 'row',
                    type:"label.filter.group.demographics", showChart: true, defaultGroup:"column",
                    autoCompleteOptions: [{key:'White','title':'White'}]}
            },
           {
                filterGroup: false, collapse: true, allowGrouping: true,groupBy:true,
                filters: {key: 'gender', title: 'label.filter.gender', queryKey:"sex", primary: false, value: [], groupBy: 'column',
                    type:"label.filter.group.demographics", groupByDefault: 'column', showChart: true,
                    autoCompleteOptions: [
                        {key:'Female',title:'Female'},
                        {key:'Male',title:'Male'}
                    ], defaultGroup:"column"
                }
            },
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:false,
                filters: {key: 'hispanicOrigin', title: 'label.filter.hispanicOrigin', queryKey:"ethnicity_group", primary: false, value: [], groupBy: 'row',
                    type:"label.filter.group.demographics", defaultGroup:"row", filterType: 'checkbox',
                    autoCompleteOptions: [{key:'Hispanic','title':'Hispanic'},{key:'Non-Hispanic','title':'Non-Hispanic'}]}
            }
        ];

        var categories = [{"sideFilters":filters}];

        spyOn(SearchService, 'getDsMetadata').and.returnValue(deferred.promise);

        utils.refreshFilterAndOptions({ queryKey: "year", value: ["2015"]}, categories, 'deaths');
        expect(SearchService.getDsMetadata).toHaveBeenCalledWith("deaths","2015");
        deferred.resolve({"status":"OK","data":{"sex":["Male","Female"],"hispanic_origin":["Dominican","Latin American","Central American","Cuban","Spaniard","Other Hispanic","South American","Non-Hispanic","Puerto Rican","Unknown","Mexican","Central and South American"],"race":["White","Black","American Indian","Asian or Pacific Islander"]}});
        $scope.$apply();
        //Year
        expect(filters[0].disabled).toBeFalsy();
        expect(filters[0].groupBy).toEqual("row");
        //Race
        expect(filters[1].disabled).toBeFalsy();
        expect(filters[1].groupBy).toBeFalsy();
        //Gender
        expect(filters[2].disabled).toBeFalsy();
        expect(filters[2].filters.autoCompleteOptions[0].disabled).toBeFalsy();
        expect(filters[2].filters.autoCompleteOptions[1].disabled).toBeFalsy();
        //Ethnicity
        expect(filters[3].disabled).toBeFalsy();
        //Hispanic
        expect(filters[3].filters.autoCompleteOptions[0].disabled).toBeFalsy();
        //Non-Hispanic
        expect(filters[3].filters.autoCompleteOptions[1].disabled).toBeFalsy();
    }));

    it('refreshFilterAndOptions options should set filter option correctly - for Age Adjusted Death Rates ', inject(function(SearchService) {
        var deferred = $q.defer();
        var filters= [
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:"row",
                filters: {key: 'year', title: 'label.filter.year', queryKey:"year", primary: false, value: [2015], groupBy: 'row',
                    type:"label.filter.group.year", showChart: true, defaultGroup:"column",
                    autoCompleteOptions: []}
            },
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:false,
                filters: {key: 'race', title: 'label.filter.race', queryKey:"race", primary: false, value: [], groupBy: 'row',
                    type:"label.filter.group.demographics", showChart: true, defaultGroup:"column",
                    autoCompleteOptions: [{key:'White','title':'White'}]}
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,groupBy:true,
                filters: {key: 'gender', title: 'label.filter.gender', queryKey:"sex", primary: false, value: [], groupBy: 'column',
                    type:"label.filter.group.demographics", groupByDefault: 'column', showChart: true,
                    autoCompleteOptions: [
                        {key:'Female',title:'Female'},
                        {key:'Male',title:'Male'}
                    ], defaultGroup:"column"
                }
            },
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:false,
                filters: {key: 'hispanicOrigin', title: 'label.filter.hispanicOrigin', queryKey:"ethnicity_group", primary: false, value: [], groupBy: 'row',
                    type:"label.filter.group.demographics", defaultGroup:"row", filterType: 'checkbox',
                    autoCompleteOptions: [{key:'Hispanic','title':'Hispanic'},{key:'Non-Hispanic','title':'Non-Hispanic'}]}
            }
        ];

        var categories = [{"sideFilters":filters}];

        spyOn(SearchService, 'getDsMetadata').and.returnValue(deferred.promise);

        utils.refreshFilterAndOptions({ queryKey: "year", value: ["2015"]}, categories, 'deaths');
        expect(SearchService.getDsMetadata).toHaveBeenCalledWith("deaths","2015");
        deferred.resolve({"status":"OK","data":{"sex":["Male","Female"],"hispanic_origin":["Dominican","Latin American","Central American","Cuban","Spaniard","Other Hispanic","South American","Non-Hispanic","Puerto Rican","Unknown","Mexican","Central and South American"],"race":["White","Black","American Indian","Asian or Pacific Islander"]}});
        $scope.$apply();
        //Year
        expect(filters[0].disabled).toBeFalsy();
        expect(filters[0].groupBy).toEqual("row");
        //Race
        expect(filters[1].disabled).toBeFalsy();
        expect(filters[1].groupBy).toBeFalsy();
        //Gender
        expect(filters[2].disabled).toBeFalsy();
        expect(filters[2].filters.autoCompleteOptions[0].disabled).toBeFalsy();
        expect(filters[2].filters.autoCompleteOptions[1].disabled).toBeFalsy();
        //Ethnicity
        expect(filters[3].disabled).toBeFalsy();
        //Hispanic
        expect(filters[3].filters.autoCompleteOptions[0].disabled).toBeFalsy();
        //Non-Hispanic
        expect(filters[3].filters.autoCompleteOptions[1].disabled).toBeFalsy();
    }));

    it("refresh filter options when user selected one year age filter options", inject(function(SearchService) {
        var deferred = $q.defer();
        var singleYearAgeOptions =  [
            { "key": "Under 15 years", "title": "Under 15 years" },
            { "key": "15 years", "title": "15 years" },
            { "key": "16 years", "title": "16 years" },
            { "key": "17 years", "title": "17 years" },
            { "key": "18 years", "title": "18 years" },
            { "key": "19 years", "title": "19 years" },
            { "key": "20 years", "title": "20 years" },
            { "key": "21 years", "title": "21 years" },
            { "key": "22 years", "title": "22 years" },
            { "key": "23 years", "title": "23 years" },
            { "key": "24 years", "title": "24 years" },
            { "key": "25 years", "title": "25 years" },
            { "key": "26 years", "title": "26 years" },
            { "key": "27 years", "title": "27 years" },
            { "key": "28 years", "title": "28 years" },
            { "key": "29 years", "title": "29 years" },
            { "key": "30 years", "title": "30 years" },
            { "key": "31 years", "title": "31 years" },
            { "key": "32 years", "title": "32 years" },
            { "key": "33 years", "title": "33 years" },
            { "key": "34 years", "title": "34 years" },
            { "key": "35 years", "title": "35 years" },
            { "key": "36 years", "title": "36 years" },
            { "key": "37 years", "title": "37 years" },
            { "key": "38 years", "title": "38 years" },
            { "key": "39 years", "title": "39 years" },
            { "key": "40 years", "title": "40 years" },
            { "key": "41 years", "title": "41 years" },
            { "key": "42 years", "title": "42 years" },
            { "key": "43 years", "title": "43 years" },
            { "key": "44 years", "title": "44 years" },
            { "key": "45 years", "title": "45 years" },
            { "key": "46 years", "title": "46 years" },
            { "key": "47 years", "title": "47 years" },
            { "key": "48 years", "title": "48 years" },
            { "key": "49 years", "title": "49 years" },
            { "key": "50-54 years", "title": "50 years and over"}
        ];
        var ageR9Options =  [
            { "key": "Under 15 years", "title": "Under 15 years" },
            { "key": "15-19 years", "title": "15-19 years" },
            { "key": "20-24 years", "title": "20-24 years" },
            { "key": "25-29 years", "title": "25-29 years" },
            { "key": "30-34 years", "title": "30-34 years" },
            { "key": "35-39 years", "title": "35-39 years" },
            { "key": "40-44 years", "title": "40-44 years" },
            { "key": "45-49 years", "title": "45-49 years" },
            { "key": "50-54 years", "title": "50 years and over" }
        ];
        var filters= [
            {
                filterGroup: false,
                collapse: true,
                allowGrouping: true,
                filters:   {key: 'mother_age_1year_interval', title: 'label.chart.mother_age.single.year.group', queryKey:"mother_age_1year_interval", primary: false, value: ["Under 15 years", "15 years", "44 years", "45 years"],
                    defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: singleYearAgeOptions, helpText:"label.help.text.mother.one.year.age", disableAgeOptions: ["Under 15 years", "45 years", "46 years", "47 years", "48 years", "49 years", "50-54 years"]},

            },
            {
                filterGroup: false,
                collapse: true,
                allowGrouping: true,
                filters: {key: 'mother_age_5year_interval', title: 'label.chart.mother_age.five.year.group', queryKey:"mother_age_5year_interval", primary: false, value: [],
                    defaultGroup:'column', groupBy: false, filterType: "checkbox", autoCompleteOptions: ageR9Options,
                    helpText:"label.help.text.mother.five.year.age", disableAgeOptions: ["Under 15 years", "45-49 years", "50-54 years" ]},

            }
        ];
        var categories = [{category: "Mother's Age", "sideFilters":filters}];
        spyOn(SearchService, 'getDsMetadata').and.returnValue(deferred.promise);

        utils.refreshFilterAndOptions({ queryKey: "mother_age_1year_interval", value: ["Under 15 years", "15 years", "44 years", "45 years"]}, categories, 'natality', 'fertility_rates');
        expect(SearchService.getDsMetadata).toHaveBeenCalledWith("natality", "Under 15 years,15 years,44 years,45 years");
        deferred.resolve({"status":"OK","data":{}});
        $scope.$apply();
        //'Under 15 years' and '45 years' should be removed from value array
        expect(filters[0].filters.value.length).toEqual(2);
        expect(filters[0].filters.value[0]).toEqual("15 years");
        expect(filters[0].filters.value[1]).toEqual("44 years");
        //<15 and > 44 filters should be disabled
        expect(filters[0].filters.autoCompleteOptions[0].key).toEqual("Under 15 years");
        expect(filters[0].filters.autoCompleteOptions[0].disabled).toBeTruthy();
        expect(filters[0].filters.autoCompleteOptions[1].key).toEqual("15 years");
        expect(filters[0].filters.autoCompleteOptions[1].disabled).toBeFalsy();
        expect(filters[0].filters.autoCompleteOptions[30].key).toEqual("44 years");
        expect(filters[0].filters.autoCompleteOptions[30].disabled).toBeFalsy();
        expect(filters[0].filters.autoCompleteOptions[31].key).toEqual("45 years");
        expect(filters[0].filters.autoCompleteOptions[31].disabled).toBeTruthy();
        expect(filters[0].filters.autoCompleteOptions[32].key).toEqual("46 years");
        expect(filters[0].filters.autoCompleteOptions[32].disabled).toBeTruthy();
        expect(filters[0].filters.autoCompleteOptions[33].key).toEqual("47 years");
        expect(filters[0].filters.autoCompleteOptions[33].disabled).toBeTruthy();
        expect(filters[0].filters.autoCompleteOptions[34].key).toEqual("48 years");
        expect(filters[0].filters.autoCompleteOptions[34].disabled).toBeTruthy();
        expect(filters[0].filters.autoCompleteOptions[35].key).toEqual("49 years");
        expect(filters[0].filters.autoCompleteOptions[35].disabled).toBeTruthy();
        expect(filters[0].filters.autoCompleteOptions[36].key).toEqual("50-54 years");
        expect(filters[0].filters.autoCompleteOptions[36].disabled).toBeTruthy();

    }));

    it("refresh filter options when user selected five year age filter options", inject(function(SearchService) {
        var deferred = $q.defer();
        var singleYearAgeOptions =  [
            { "key": "Under 15 years", "title": "Under 15 years" },
            { "key": "15 years", "title": "15 years" },
            { "key": "16 years", "title": "16 years" },
            { "key": "17 years", "title": "17 years" },
            { "key": "18 years", "title": "18 years" },
            { "key": "19 years", "title": "19 years" },
            { "key": "20 years", "title": "20 years" },
            { "key": "21 years", "title": "21 years" },
            { "key": "22 years", "title": "22 years" },
            { "key": "23 years", "title": "23 years" },
            { "key": "24 years", "title": "24 years" },
            { "key": "25 years", "title": "25 years" },
            { "key": "26 years", "title": "26 years" },
            { "key": "27 years", "title": "27 years" },
            { "key": "28 years", "title": "28 years" },
            { "key": "29 years", "title": "29 years" },
            { "key": "30 years", "title": "30 years" },
            { "key": "31 years", "title": "31 years" },
            { "key": "32 years", "title": "32 years" },
            { "key": "33 years", "title": "33 years" },
            { "key": "34 years", "title": "34 years" },
            { "key": "35 years", "title": "35 years" },
            { "key": "36 years", "title": "36 years" },
            { "key": "37 years", "title": "37 years" },
            { "key": "38 years", "title": "38 years" },
            { "key": "39 years", "title": "39 years" },
            { "key": "40 years", "title": "40 years" },
            { "key": "41 years", "title": "41 years" },
            { "key": "42 years", "title": "42 years" },
            { "key": "43 years", "title": "43 years" },
            { "key": "44 years", "title": "44 years" },
            { "key": "45 years", "title": "45 years" },
            { "key": "46 years", "title": "46 years" },
            { "key": "47 years", "title": "47 years" },
            { "key": "48 years", "title": "48 years" },
            { "key": "49 years", "title": "49 years" },
            { "key": "50-54 years", "title": "50 years and over"}
        ];
        var ageR9Options =  [
            { "key": "Under 15 years", "title": "Under 15 years" },
            { "key": "15-19 years", "title": "15-19 years" },
            { "key": "20-24 years", "title": "20-24 years" },
            { "key": "25-29 years", "title": "25-29 years" },
            { "key": "30-34 years", "title": "30-34 years" },
            { "key": "35-39 years", "title": "35-39 years" },
            { "key": "40-44 years", "title": "40-44 years" },
            { "key": "45-49 years", "title": "45-49 years" },
            { "key": "50-54 years", "title": "50 years and over" }
        ];
        var filters= [
            {
                filterGroup: false,
                collapse: true,
                allowGrouping: true,
                filters:   {key: 'mother_age_1year_interval', title: 'label.chart.mother_age.single.year.group', queryKey:"mother_age_1year_interval", primary: false, value: [],
                    defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: singleYearAgeOptions, helpText:"label.help.text.mother.one.year.age", disableAgeOptions: ["Under 15 years", "45 years", "46 years", "47 years", "48 years", "49 years", "50-54 years"]},

            },
            {
                filterGroup: false,
                collapse: true,
                allowGrouping: true,
                filters: {key: 'mother_age_5year_interval', title: 'label.chart.mother_age.five.year.group', queryKey:"mother_age_5year_interval", primary: false, value: ["Under 15 years", "20-24 years", "45-49 years"],
                    defaultGroup:'column', groupBy: false, filterType: "checkbox", autoCompleteOptions: ageR9Options,
                    helpText:"label.help.text.mother.five.year.age", disableAgeOptions: ["Under 15 years", "45-49 years", "50-54 years" ]},

            }
        ];
        var categories = [{category: "Mother's Age", "sideFilters":filters}];
        spyOn(SearchService, 'getDsMetadata').and.returnValue(deferred.promise);

        utils.refreshFilterAndOptions({ queryKey: "mother_age_5year_interval", value: ["Under 15 years", "20-24 years", "45-49 years"]}, categories, 'natality', 'fertility_rates');
        expect(SearchService.getDsMetadata).toHaveBeenCalledWith("natality", "Under 15 years,20-24 years,45-49 years");
        deferred.resolve({"status":"OK","data":{}});
        $scope.$apply();
        //'Under 15 years' and '45 years' should be removed from value array
        expect(filters[1].filters.value.length).toEqual(1);
        expect(filters[1].filters.value[0]).toEqual("20-24 years");
        //<15 and > 44 filters should be disabled
        expect(filters[1].filters.autoCompleteOptions[0].key).toEqual("Under 15 years");
        expect(filters[1].filters.autoCompleteOptions[0].disabled).toBeTruthy();
        expect(filters[1].filters.autoCompleteOptions[1].key).toEqual("15-19 years");
        expect(filters[1].filters.autoCompleteOptions[1].disabled).toBeFalsy();
        expect(filters[1].filters.autoCompleteOptions[6].key).toEqual("40-44 years");
        expect(filters[1].filters.autoCompleteOptions[6].disabled).toBeFalsy();
        expect(filters[1].filters.autoCompleteOptions[7].key).toEqual("45-49 years");
        expect(filters[1].filters.autoCompleteOptions[7].disabled).toBeTruthy();
        expect(filters[1].filters.autoCompleteOptions[8].key).toEqual("50-54 years");
        expect(filters[1].filters.autoCompleteOptions[8].disabled).toBeTruthy();
    }));

    it('Should generate appropriate selected filters text', function () {
        var filters= [
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:"row",
                key: 'year', title: 'label.filter.year', queryKey:"year", primary: false, value: ['2000', '2014'],
                type:"label.filter.group.year", showChart: true, defaultGroup:"column",
                autoCompleteOptions: [{key:'2000','title':'2000'},{key:'2010','title':'2010'},{key:'2014','title':'2014'}]
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,groupBy:true,
                key: 'gender', title: 'label.filter.gender', queryKey:"sex", primary: false, value: ['M'],
                type:"label.filter.group.demographics", groupByDefault: 'column', showChart: true,
                autoCompleteOptions: [
                    {key:'F',title:'Female'},
                    {key:'M',title:'Male'}
                ], defaultGroup:"column"

            },
            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:false,
                key: 'race', title: 'label.filter.race', queryKey:"race", primary: false, value: ['White', 'Asian'],
                type:"label.filter.group.demographics", showChart: true, defaultGroup:"column",
                autoCompleteOptions: [{key:'White','title':'White'},{key:'Black','title':'Black'},{key:'Asian','title':'Asian'}]
            },

            {
                filterGroup: false, collapse: false, allowGrouping: true, groupBy:false,
                key: 'ethnicity', title: 'label.filter.ethnicity', queryKey:"ethnicity", primary: false, value: [],
                type:"label.filter.group.ethnicity", showChart: true, defaultGroup:"column",
                autoCompleteOptions: [{key:'Hispanic','title':'Hispanic'},{key:'Non-Hispanic','title':'Non-Hispanic'}]
            }
        ];
        var sort  = ['year', 'race', 'gender','ethnicity'];

        expect(utils.getSelectedFiltersText(filters, sort)).toEqual ('label.filter.year: 2000, 2014| label.filter.race: White, Asian| label.filter.gender: Male');
    });

    it('STD: Disease filter option "Congenital Syphilis" on change', inject(function(filterUtils){
        var filters = {};
        filters.groupOptions = [
            {key:'column',title:'Column', tooltip:'Select to view as columns on data table'},
            {key:'row',title:'Row', tooltip:'Select to view as rows on data table'},
            {key: false,title:'Off', tooltip:'Select to hide on data table'}
        ];
        filters.sideFilters = [
            {
                filterGroup: false, collapse: true, allowGrouping: true, groupBy: false,
                groupOptions: filters.groupOptions,
                refreshFiltersOnChange: true,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'disease')
            },
            {
                filterGroup: false,
                collapse: false,
                allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'current_year')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'sex')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'race')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'age_group')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'state')
            }
        ];
        var categories = [filters];

        //with default filter optoins
        utils.stdFilterChange({ queryKey: "disease", value: "Chlamydia"}, categories);
        //Disease -> Congenital Syphilis should not be disable by default
        expect(filters.sideFilters[0].filters.autoCompleteOptions[4].disabled).toBeFalsy();
        //Sex
        angular.forEach(filters.sideFilters[2].filters.autoCompleteOptions, function(option, index){
            if(index == 0){
                expect(option.disabled).toEqual(undefined);
            }
            else {
                expect(option.disabled).toBeFalsy();
            }
        });
        //Race/Ethinicity
        angular.forEach(filters.sideFilters[3].filters.autoCompleteOptions, function(option, index){
            if(index == 0){
                expect(option.disabled).toEqual(undefined);
            }
            else {
                expect(option.disabled).toBeFalsy();
            }
        });
        //Age Group
        angular.forEach(filters.sideFilters[4].filters.autoCompleteOptions, function(option, index){
            if(index == 0){
                expect(option.disabled).toEqual(undefined);
            }
            else {
                expect(option.disabled).toBeFalsy();
            }
        });

        //When user select Disease -> Congenital Syphilis, then Sex, Race/Ethnicity and Age Group filters should be disabled
        utils.stdFilterChange({ queryKey: "disease", value: "Congenital Syphilis"}, categories);
        //Sex
        angular.forEach(filters.sideFilters[2].filters.autoCompleteOptions, function(option, index){
            if(index == 0){
                expect(option.disabled).toEqual(undefined);
            }
            else {
                expect(option.disabled).toBeTruthy();
            }
        });
        //Race/Ethinicity
        angular.forEach(filters.sideFilters[3].filters.autoCompleteOptions, function(option, index){
            if(index == 0){
                expect(option.disabled).toEqual(undefined);
            }
            else {
                expect(option.disabled).toBeTruthy();
            }
        });
        //Age Group
        angular.forEach(filters.sideFilters[4].filters.autoCompleteOptions, function(option, index){
            if(index == 0){
                expect(option.disabled).toEqual(undefined);
            }
            else {
                expect(option.disabled).toBeTruthy();
            }
        });

        //When user select Disease -> Chlamydia, then Sex, Race/Ethnicity and Age Group filters should be enabled
        utils.stdFilterChange({ queryKey: "disease", value: "Chlamydia"}, categories);
        //Sex
        angular.forEach(filters.sideFilters[2].filters.autoCompleteOptions, function(option, index){
            if(index == 0){
                expect(option.disabled).toEqual(undefined);
            }
            else {
                expect(option.disabled).toBeFalsy();
            }
        });
        //Race/Ethinicity
        angular.forEach(filters.sideFilters[3].filters.autoCompleteOptions, function(option, index){
            if(index == 0){
                expect(option.disabled).toEqual(undefined);
            }
            else {
                expect(option.disabled).toBeFalsy();
            }
        });
        //Age Group
        angular.forEach(filters.sideFilters[4].filters.autoCompleteOptions, function(option, index){
            if(index == 0){
                expect(option.disabled).toEqual(undefined);
            }
            else {
                expect(option.disabled).toBeFalsy();
            }
        });

        //When user select Sex -> Female then Disease -> Congenital Syphilis option should be disabled
        utils.stdFilterChange({ queryKey: "sex", value: "Female"}, categories);
        //Disease -> Congenital Syphilis should be disabled
        expect(filters.sideFilters[0].filters.autoCompleteOptions[4].disabled).toBeTruthy();


        //When user select Race/Ethinicity -> Asian then Disease -> Congenital Syphilis option should be disabled
        utils.stdFilterChange({ queryKey: "race", value: "Asian"}, categories);
        //Disease -> Congenital Syphilis should be disabled
        expect(filters.sideFilters[0].filters.autoCompleteOptions[4].disabled).toBeTruthy();


        //When user select Age group -> 0-4 then Disease -> Congenital Syphilis option should be disabled
        utils.stdFilterChange({ queryKey: "age_group", value: "0-14"}, categories);
        //Disease -> Congenital Syphilis should be disabled
        expect(filters.sideFilters[0].filters.autoCompleteOptions[4].disabled).toBeTruthy();

    }));

    it('STD: Refresh filter options on year change - year set to 2015', inject(function(SearchService, filterUtils) {
        var deferred = $q.defer();
        var filters = {};
        filters.groupOptions = [
            {key: 'column', title: 'Column', tooltip: 'Select to view as columns on data table'},
            {key: 'row', title: 'Row', tooltip: 'Select to view as rows on data table'},
            {key: false, title: 'Off', tooltip: 'Select to hide on data table'}
        ];
        filters.sideFilters = [
            {
                filterGroup: false, collapse: true, allowGrouping: true, groupBy: false,
                groupOptions: filters.groupOptions,
                refreshFiltersOnChange: true,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'disease')
            },
            {
                filterGroup: false,
                collapse: false,
                allowGrouping: true,
                groupOptions: filters.groupOptions,
                refreshFiltersOnChange: true,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'current_year')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'sex')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'race')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'age_group')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'state')
            }
        ];
        var categories = [filters];
       spyOn(SearchService, 'getDsMetadata').and.returnValue(deferred.promise);
        //For year 2015
        utils.stdFilterChange({queryKey: "current_year", value: "2015"}, categories);
        expect(SearchService.getDsMetadata).toHaveBeenCalledWith("std",["2015"]);
        deferred.resolve({"status":"OK","data":{"current_year":null,"suppression_cases":null,"pop":null,"disease":["Acute Viral Hepatitis  A","Tuberculosis","Acute Viral Hepatitis  C","Acute Viral Hepatitis  B","Early Latent Syphilis","Congenital Syphilis","HIV, stage 3 (AIDS)","Persons living with HIV, stage 3 (AIDS)","HIV, stage 3 (AIDS) deaths","HIV deaths","HIV diagnoses","Chlamydia","Persons living with diagnosed HIV","Primary and Secondary Syphilis","Gonorrhea"],"sex":["Male","Both sexes","Female"],"race_ethnicity":["Other","American Indian or Alaska Native","All races/ethnicities","Black or African American","Asian","Native Hawaiian or Other Pacific Islander","Hispanic or Latino","Multiple races","White","Asian or Pacific Islander","Unknown"],"cases":null,"suppression_rate":null},"pagination":{}});
        $scope.$apply();
        //Race/Ethnicity filter should be enabled
        expect(filters.sideFilters[3].disabled).toBeFalsy();
    }));

    it('STD: Refresh filter options on year change - year set to 2006', inject(function(SearchService, filterUtils) {
        var deferred = $q.defer();
        var filters = {};
        filters.groupOptions = [
            {key: 'column', title: 'Column', tooltip: 'Select to view as columns on data table'},
            {key: 'row', title: 'Row', tooltip: 'Select to view as rows on data table'},
            {key: false, title: 'Off', tooltip: 'Select to hide on data table'}
        ];
        filters.sideFilters = [
            {
                filterGroup: false, collapse: true, allowGrouping: true, groupBy: false,
                groupOptions: filters.groupOptions,
                refreshFiltersOnChange: true,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'disease')
            },
            {
                filterGroup: false,
                collapse: false,
                allowGrouping: true,
                groupOptions: filters.groupOptions,
                refreshFiltersOnChange: true,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'current_year')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'sex')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'race')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'age_group')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'state')
            }
        ];
        var categories = [filters];
        spyOn(SearchService, 'getDsMetadata').and.returnValue(deferred.promise);
        //For year 2016
        utils.stdFilterChange({queryKey: "current_year", value: "2006"}, categories);
        expect(SearchService.getDsMetadata).toHaveBeenCalledWith("std",["2006"]);
        deferred.resolve({"status":"OK","data":{"disease":["Acute Viral Hepatitis  A","Tuberculosis","Acute Viral Hepatitis  C","Acute Viral Hepatitis  B","Early Latent Syphilis","Congenital Syphilis","HIV, stage 3 (AIDS)","Persons living with HIV, stage 3 (AIDS)","HIV, stage 3 (AIDS) deaths","HIV deaths","HIV diagnoses","Chlamydia","Persons living with diagnosed HIV","Primary and Secondary Syphilis","Gonorrhea"],"suppression_cases":null,"sex":["Male","Both sexes","Female"],"suppression_rate":null},"pagination":{}});
        $scope.$apply();
        //Race/Ethnicity filter should be disabled
        expect(filters.sideFilters[3].disabled).toBeTruthy();
    }));

    it('STD: Disease filter option "Early Latent Syphilis" on change', inject(function(filterUtils, $filter) {
        var filters = {};
        filters.groupOptions = [
            {key: 'column', title: 'Column', tooltip: 'Select to view as columns on data table'},
            {key: 'row', title: 'Row', tooltip: 'Select to view as rows on data table'},
            {key: false, title: 'Off', tooltip: 'Select to hide on data table'}
        ];
        filters.sideFilters = [
            {
                filterGroup: false, collapse: true, allowGrouping: true, groupBy: false,
                groupOptions: filters.groupOptions,
                refreshFiltersOnChange: true,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'disease')
            },
            {
                filterGroup: false,
                collapse: false,
                allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'current_year')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'sex')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'race')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'age_group')
            },
            {
                filterGroup: false, collapse: true, allowGrouping: true,
                groupOptions: filters.groupOptions,
                filters: utils.findByKeyAndValue(filterUtils.getSTDDataFilters(), 'key', 'state')
            }
        ];
        var categories = [filters];
        //if user select 'Disease' -> 'Early Latent Syphilis'
        //Then disabled year 2000, 2001, 2002
        utils.stdFilterChange({queryKey: "disease", value: "Early Latent Syphilis"}, categories);
        var yearSideFilter = $filter('filter')(filters.sideFilters, {filters : {key: 'year'}})[0];
        var year_2000 = utils.findByKeyAndValue(yearSideFilter.filters.autoCompleteOptions, 'key', '2000');
        var year_2001 = utils.findByKeyAndValue(yearSideFilter.filters.autoCompleteOptions, 'key', '2001');
        var year_2002 = utils.findByKeyAndValue(yearSideFilter.filters.autoCompleteOptions, 'key', '2002');
        expect(year_2000.disabled).toBeTruthy();
        expect(year_2001.disabled).toBeTruthy();
        expect(year_2002.disabled).toBeTruthy();
    }));

    describe('Aids Filter Change:', function () {
        var mockFilters;

        beforeEach(function () {
           mockFilters = {};
           mockFilters.sideFilters = [
               {
                   filters: utils.findByKeyAndValue(filterUtils.getAIDSFilters(), 'key', 'disease')
               },
               {
                   filters: utils.findByKeyAndValue(filterUtils.getAIDSFilters(), 'key', 'current_year')
               },
               {
                   filters: utils.findByKeyAndValue(filterUtils.getAIDSFilters(), 'key', 'sex')
               },
               {
                   filters: utils.findByKeyAndValue(filterUtils.getAIDSFilters(), 'key', 'race')
               },
               {
                   filters: utils.findByKeyAndValue(filterUtils.getAIDSFilters(), 'key', 'age_group')
               },
               {
                   filters: utils.findByKeyAndValue(filterUtils.getAIDSFilters(), 'key', 'transmission')
               }
           ]
        });

        afterEach(function () {
            mockFilters = null;
        });

        it('Should disable the proper disease filters when 2000 is selected', function () {
            utils.aidsFilterChange({ key: 'current_year', value: '2000' }, [mockFilters]);
            expect(utils.findByKeyAndValue(mockFilters.sideFilters[0].filters.autoCompleteOptions, 'key', 'HIV diagnoses').disabled).toBeTruthy();
            expect(utils.findByKeyAndValue(mockFilters.sideFilters[0].filters.autoCompleteOptions, 'key', 'HIV deaths').disabled).toBeTruthy();
            expect(utils.findByKeyAndValue(mockFilters.sideFilters[0].filters.autoCompleteOptions, 'key', 'Persons living with diagnosed HIV').disabled).toBeTruthy();
        });

        it('Should disable the proper year filters when HIV, stage 3 (AIDS) deaths is selected', function () {
            utils.aidsFilterChange({ key: 'disease', value: 'HIV, stage 3 (AIDS) deaths' }, [mockFilters]);
            expect(utils.findByKeyAndValue(mockFilters.sideFilters[1].filters.autoCompleteOptions, 'key', '2015').disabled).toBeTruthy();
        });

        it('Should disable the proper year filters when HIV deaths is selected', function () {
            utils.aidsFilterChange({ key: 'disease', value: 'HIV deaths' }, [mockFilters]);
            expect(utils.findByKeyAndValue(mockFilters.sideFilters[1].filters.autoCompleteOptions, 'key', '2015').disabled).toBeTruthy();
            expect(utils.findByKeyAndValue(mockFilters.sideFilters[1].filters.autoCompleteOptions, 'key', '2000').disabled).toBeTruthy();
            expect(utils.findByKeyAndValue(mockFilters.sideFilters[1].filters.autoCompleteOptions, 'key', '2005').disabled).toBeTruthy();
            expect(utils.findByKeyAndValue(mockFilters.sideFilters[1].filters.autoCompleteOptions, 'key', '2003').disabled).toBeTruthy();
        });

        it('Should enable all demographic filters when less than two demographic filter values are selected', function () {
            mockFilters.sideFilters[2].filters.value = 'Female';
            utils.aidsFilterChange(mockFilters.sideFilters[2], [mockFilters]);
            expect(mockFilters.sideFilters[3].disabled).toBeFalsy();
            expect(mockFilters.sideFilters[4].disabled).toBeFalsy();
            expect(mockFilters.sideFilters[5].disabled).toBeFalsy();
        });

        it('Should disable all remaining demographic filters when two demographic filter values are selected', function () {
            mockFilters.sideFilters[2].filters.value = 'Female';
            mockFilters.sideFilters[3].filters.value = 'American Indian or Alaska Native';
            utils.aidsFilterChange(mockFilters.sideFilters[3], [mockFilters]);
            expect(mockFilters.sideFilters[4].disabled).toBeTruthy();
            expect(mockFilters.sideFilters[5].disabled).toBeTruthy();
        });

    });

    describe('infant year filter change', function(){
        var categories;
        beforeEach(function () {
            categories = [{"category":"Infant Characteristics", "sideFilters": [{filters: utils.findByKeyAndValue(filterUtils.getInfantMortalityDataFilters(), 'key', 'year_of_death')}]}];
        });

        it('Should keep years which on in same range if user selected multiple years - 2014(D69) and 2006(D31)', function(){
            //In this case user first selected year '2014' then selected year '2006', so we should delete year '2014' and keep '2006'
            //So that query can hit only one wonder database. In this case database ID D31 for years 2003 - 2006.
            var yearSideFilter = categories[0].sideFilters[0].filters;
            yearSideFilter.value.push("2006");
            utils.infantMortalityFilterChange(yearSideFilter, categories);
            expect(yearSideFilter.value.length).toEqual(1);
            expect(yearSideFilter.value[0]).toEqual("2006");
        });
        it('Should keep years which on in same range if user selected multiple years - 2014(D69) and 2013(D69)', function(){
            //In this case user first selected year '2014' then selected year '2013', so we should keep both '2014' and '2013'
            //Because those are in range 2007 - 2014(D69). So that query can hit only one wonder database.
            var yearSideFilter = categories[0].sideFilters[0].filters;
            yearSideFilter.value.push("2013");
            utils.infantMortalityFilterChange(yearSideFilter, categories);
            expect(yearSideFilter.value.length).toEqual(2);
            expect(yearSideFilter.value[0]).toEqual("2014");
            expect(yearSideFilter.value[1]).toEqual("2013");
        });
        it('Should keep years which on in same range if user selected multiple years - 2006(D31) and 2002(D18)', function(){
            //In this case user first selected year '2006' then selected year '2002', so we should delete '2014' and keep '2002
            //Because both selected years are in different range, so we are keeping latest selected year.
            //So '2002' is in range 200 - 2003 which is comes under wonder database D18
            var yearSideFilter = categories[0].sideFilters[0].filters;
            yearSideFilter.value.push("2002");
            utils.infantMortalityFilterChange(yearSideFilter, categories);
            expect(yearSideFilter.value.length).toEqual(1);
            expect(yearSideFilter.value[0]).toEqual("2002");
        });
        it('Should set to default year if user unselect all years', function(){
            //By default year 2014 selected, if user un check '2014'
            var yearSideFilter = categories[0].sideFilters[0].filters;
            yearSideFilter.value = [];
            //Then default value '2014' should be set
            utils.infantMortalityFilterChange(yearSideFilter, categories);
            expect(yearSideFilter.value.length).toEqual(1);
            expect(yearSideFilter.value[0]).toEqual("2014");
        });
    });

});
