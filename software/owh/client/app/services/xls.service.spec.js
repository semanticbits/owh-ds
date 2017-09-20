'use strict';

describe('xlsService', function(){
    var xlsService;
    var mixedData = {
        "headers": [
            [
                {
                    "title": "Female",
                    "colspan": 1,
                    "rowspan": 1,
                    "isData": true
                },
                {
                    "title": "Male",
                    "colspan": 1,
                    "rowspan": 1,
                    "isData": true
                },
                {
                    "title": "Number of Deaths",
                    "colspan": 1,
                    "rowspan": 1,
                    "isData": true
                }
            ]
        ],
        "rowHeadersLength": 0,
        "data": [
            [
                {
                    "title": "50,390",
                    "percentage": "31.9",
                    "isCount": true,
                    "rowspan": 1,
                    "colspan": 1
                },
                {
                    "title": "107,460",
                    "percentage": "68.1",
                    "isCount": true,
                    "rowspan": 1,
                    "colspan": 1
                },
                {
                    "title": "157,850",
                    "percentage": 1.2358582892934038,
                    "isCount": true,
                    "rowspan": 1,
                    "colspan": 1,
                    "isBold": true
                }
            ]
        ],
        "calculatePercentage":true
    };
    beforeEach(module('owh'));

    beforeEach(inject(function ($injector) {
        xlsService = $injector.get('xlsService');
    }));

    describe('getSheetFromArray', function() {
        it('should return proper xls worksheet object', function () {
            var sheetArray = [[{title: 1}, {title: 2}, {title: 3}], [{title: 'data1'}, null, {title: 'data3'}], [{title: 'data4'}, {title: 'data5'}, {title: 'data6'}]];
            var ws = xlsService.getSheetFromArray(sheetArray);

            expect(ws['A1'].v).toEqual(1);
            expect(ws['B2']).toBeUndefined();
            expect(ws['C3'].v).toEqual('data6');
        });

        it('should properly account for horizontally merged cells', function () {
            /*
            [   1   ]
            [2][3][4]
             */
            var sheetArray = [[{title: 1, colspan: 3, rowspan: 1}], [{title: 2, colspan: 1, rowspan: 1}, {title: 3, colspan: 1, rowspan: 1}, {title: 4, colspan: 1, rowspan: 1}]];
            var ws = xlsService.getSheetFromArray(sheetArray);

            var mergedCell = {s: {c: 0, r: 0}, e: {c: 2, r: 0}};
            expect(ws['!merges']).toContain(mergedCell);
        });

        it('should properly account for vertically merged cells', function () {
           /*
            |  |[2]
            | 1|[3]
            |  |[4]
             */
            var sheetArray = [[{title: 1, colspan: 1, rowspan: 3}, {title: 2, colspan: 1, rowspan: 1}], [{title: 3, colspan: 1, rowspan: 1}], [{title: 4, colspan: 1, rowspan: 1}]];
            var ws = xlsService.getSheetFromArray(sheetArray);

            var mergedCell = {s: {c: 0, r: 0}, e: {c: 0, r: 2}};
            expect(ws['!merges']).toContain(mergedCell);
        });

        it('should convert strings to numbers if possible when the flag is passed', function () {
            var sheetArray = [[{title: 1}, {title: 2}, {title: 3}], [{title: 'data1'}, null, {title: 'data3'}], [{title: 'data4'}, {title: 'data5'}, {title: '12,420'}]];
            var ws = xlsService.getSheetFromArray(sheetArray, true);

            expect(ws['A1'].v).toEqual(1);
            expect(ws['B2']).toBeUndefined();
            expect(ws['C3'].v).toEqual(12420);
            expect(ws['C3'].t).toEqual('n');
        });
    });

    describe('getSheetArrayFromMixedTable', function() {
        it('should return the proper sheet json from a mixed table object', function () {
            var mixedTable = {
                headers: [[{title: 'header1', colspan: 1, rowspan: 1}, {title: 'header2', colspan: 1, rowspan: 1}]],
                data: [
                    [{title: 'data1', colspan: 1, rowspan: 1}, {title: 'data2', colspan: 1, rowspan: 1}],
                    [{title: 'data3', colspan: 1, rowspan: 1}, {title: 'data4', colspan: 1, rowspan: 1}]
                ],
                rowHeaders: [{}]
            };
            var sheetArray = xlsService.getSheetArrayFromMixedTable(mixedTable);

            expect(sheetArray[0]).toEqual([{title: 'header1', colspan: 1, rowspan: 1}, {title: 'header2', colspan: 1, rowspan: 1}]);
            expect(sheetArray[2]).toEqual([{title: 'data3', colspan: 1, rowspan: 1}, {title: 'data4', colspan: 1, rowspan: 1}]);
        });

        it('should account for merge cells and pad accordingly', function () {
            /*
             [1][2][3]
             | || |[4]
             |a||b|[5]
             | |[6][7]
             */
            var mixedTable = {
                headers: [[{title: '1', colspan: 1, rowspan: 1}, {title: '2', colspan: 1, rowspan: 1}, {title: '3', colspan: 1, rowspan: 1}]],
                data: [
                    [{title: 'a', colspan: 1, rowspan: 3}, {title: 'b', colspan: 1, rowspan: 2}, {title: '4', colspan: 1, rowspan: 1}],
                    [{title: '5', colspan: 1, rowspan: 1}],
                    [{title: '6', colspan: 1, rowspan: 1}, {title: '7', colspan: 1, rowspan: 1}]
                ],
                rowHeadersLength: 3
            };
            var sheetArray = xlsService.getSheetArrayFromMixedTable(mixedTable);

            expect(sheetArray[2]).toEqual([{title: "", colspan: 2, rowspan: 1}, {title: '5', colspan: 1, rowspan: 1}]);
            expect(sheetArray[3]).toEqual([{title: "", colspan: 1, rowspan: 1}, {title: "6", colspan: 1, rowspan: 1}, {title: '7', colspan: 1, rowspan: 1}]);
        });

        it('should pad column headers properly', function () {
            /*
            | || || |[d]| |
            |a||b||c|[e]|g|
            | || || |[f]| |
             */
            var mixedTable = {
                headers: [
                    [{ title: 'a', colspan: 1, rowspan: 3 }, { title: 'b', colspan: 1, rowspan: 3 }, { title: 'c', colspan: 1, rowspan: 3 }, { title: 'd', colspan: 1, rowspan: 1, isData: true }, { title: 'g', colspan: 1, rowspan: 3, isData: true }],
                    [{title: 'e', colspan: 1, rowspan: 1}],
                    [{title: 'f', colspan: 1, rowspan: 1}]
                ],
                data: [[]],
                rowHeadersLength: 3
            };
            var sheetArray = xlsService.getSheetArrayFromMixedTable(mixedTable);

            expect(sheetArray[1]).toEqual([{ title: "", colspan: 1, rowspan: 1 }, { title: "", colspan: 1, rowspan: 1 }, { title: "", colspan: 1, rowspan: 1 }, { title: 'e', colspan: 1, rowspan: 1 }]);
        });

        it('should extend column headers properly to account for percentages', function() {
            /*
             | |[b]| |
             |a|[c]|d|
             */
            var mixedTable = {
                headers: [
                    [{title: 'a', colspan: 1, rowspan: 2}, {title: 'b', colspan: 1, rowspan: 1}, {title: 'd', colspan: 1, rowspan: 2}],
                    [{title: 'c', colspan: 1, rowspan: 1}]
                ],
                data: [[]],
                rowHeadersLength: 1,
                calculatePercentage: true
            };
            var sheetArray = xlsService.getSheetArrayFromMixedTable(mixedTable);

            expect(sheetArray[0]).toEqual([{title: "a", colspan: 1, rowspan: 2}, {title: 'b', colspan: 2, rowspan: 1}, {title: 'd', colspan: 1, rowspan: 2}]);
        });

        it('should extend Total row to account for percentage columns', function() {
            /*
            [a][b][c][d][e]
            [Total     ][1]
             */
            var mixedTable = {
                headers: [
                    [{title: 'a', colspan: 1, rowspan: 2}, {title: 'b', colspan: 1, rowspan: 1}, {title: 'c', colspan: 1, rowspan: 1}, {title: 'd', colspan: 1, rowspan: 1}, {title: 'e', colspan: 1, rowspan: 1}]
                ],
                data: [[{title: 'Total', colspan: 3, rowspan: 1}, {title: "1", colspan: 1, rowspan: 1}]],
                rowHeadersLength: 1,
                calculatePercentage: true
            };
            var sheetArray = xlsService.getSheetArrayFromMixedTable(mixedTable);

            expect(sheetArray[1]).toEqual([{title: "Total", colspan: 6, rowspan: 1}, {title: "1", colspan: 1, rowspan: 1}]);
        })
    });

    describe('getCSVFromSheet', function () {
        it('should return the proper csv string from xls worksheet object', function () {
            var ws = {'A1': {v: 1, t: 'n'}, 'A2': {v: 'test', t: 's'}, '!ref': 'A1:A2'};
            var csv = xlsService.getCSVFromSheet(ws);

            expect(csv).toEqual('1\ntest\n');
        });

        it('should repeat horizontally merged cells in the csv', function () {
            /*
              [   1   ]
              [2][3][4]
             */
            var ws = {'A1': {v: 1, t: 'n'}, 'A2': {v: 2, t: 'n'}, 'B2': {v: 3, t: 'n'}, 'C2': {v: 4, t: 'n'}, '!ref': 'A1:C2', '!merges': [{s: {c: 0, r: 0}, e: {c: 2, r: 0}}]};
            var csv = xlsService.getCSVFromSheet(ws, [[]]);

            expect(csv).toEqual('1,1,1\n2,3,4\n');
        });

        it('should repeat vertically merged cells in the csv', function () {
            /*
             |  |[2]
             | 1|[3]
             |  |[4]
             */
            var ws = {'A1': {v: 1, t: 'n'}, 'B1': {v: 2, t: 'n'}, 'B2': {v: 3, t: 'n'}, 'B3': {v: 4, t: 'n'}, '!ref': 'A1:B3', '!merges': [{s: {c: 0, r: 0}, e: {c: 0, r: 2}}]};
            var csv = xlsService.getCSVFromSheet(ws, [[], [], []]);

            expect(csv).toEqual('1,2\n1,3\n1,4\n');
        });

        it('should repeat merged cells marked as row headers without repeating data cells', function () {
            /*
            [1][2][3][ 9]
            | |[4][5][10]
            |a|[6][7][11]
            | |[  8 ][12]
             */
            var ws = {
                'A1': {v: 1, t: 'n'},
                'B1': {v: 2, t: 'n'},
                'C1': {v: 3, t: 'n'},
                'D1': {v: 9, t: 'n'},
                'A2': {v: 'a', t: 's'},
                'B2': {v: 4, t: 'n'},
                'C2': {v: 5, t: 'n'},
                'D2': {v: 10, t: 'n'},
                'B3': {v: 6, t: 'n'},
                'C3': {v: 7, t: 'n'},
                'D3': {v: 11, t: 'n'},
                'B4': {v: 8, t: 'n'},
                'D4': {v: 12, t: 'n'},
                '!ref': 'A1:D4',
                '!merges': [{s: {c: 0, r: 1}, e: {c: 0, r: 3}}, {s: {c: 1, r: 3}, e: {c: 2, r: 3}}]
            }
            var csv = xlsService.getCSVFromSheet(ws, [[]], 2);

            expect(csv).toEqual('1,2,3,9\na,4,5,10\na,6,7,11\na,8,,12\n');
        })
    });

    it('exportCSVFromMixedTable should call out to saveAs with the proper filename', function () {
        spyOn(window, 'saveAs');
        var mixedTable = {
            headers: [[{title: 'header1', colspan: 1, rowspan: 1}, {title: 'header2', colspan: 1, rowspan: 1}]],
            data: [
                [{title: 'data1', colspan: 1, rowspan: 1}, {title: 'data2', colspan: 1, rowspan: 1}],
                [{title: 'data3', colspan: 1, rowspan: 1}, {title: 'data4', colspan: 1, rowspan: 1}]
            ],
            rowHeaders: [{}]
        };
        var filename = 'testname';
        xlsService.exportCSVFromMixedTable(mixedTable, "datasetKey", "view", filename);

        expect(window.saveAs).toHaveBeenCalled();
        expect(window.saveAs.calls.argsFor(0)[1]).toEqual(filename + '.csv');
    });

    it('exportXLSFromMixedTable should call out to saveAs with the proper filename', function () {
        spyOn(window, 'saveAs');
        var mixedTable = {
            headers: [[{title: 'header1', colspan: 1, rowspan: 1}, {title: 'header2', colspan: 1, rowspan: 1}]],
            data: [
                [{title: 'data1', colspan: 1, rowspan: 1}, {title: 'data2', colspan: 1, rowspan: 1}],
                [{title: 'data3', colspan: 1, rowspan: 1}, {title: 'data4', colspan: 1, rowspan: 1}]
            ],
            rowHeaders: [{}]
        };
        var filename = 'testnameXLS';
        xlsService.exportXLSFromMixedTable(mixedTable, "datasetKey", "view", filename);

        expect(window.saveAs).toHaveBeenCalled();
        expect(window.saveAs.calls.argsFor(0)[1]).toEqual(filename + '.xlsx');
    });

    it('should show numbers and percentages in exported csv', function () {
        var sheetArray = xlsService.getSheetArrayFromMixedTable(mixedData)
        var result = xlsService.getSheetFromArray(sheetArray);
        expect(result['A1'].v).toEqual('Female');
        expect(result['B1'].v).toEqual('% of Female Deaths');
        expect(result['C1'].v).toEqual('Male');
        expect(result['D1'].v).toEqual('% of Male Deaths');
        expect(result['E1'].v).toEqual('Number of Deaths');
        expect(result['A2'].v).toEqual('50,390');
        expect(result['A2'].t).toEqual('s');
        expect(result['B2'].v).toEqual('31.9');
        expect(result['B2'].t).toEqual('s');
        expect(result['C2'].v).toEqual('107,460');
        expect(result['C2'].t).toEqual('s');
        expect(result['D2'].v).toEqual('68.1');
        expect(result['D2'].t).toEqual('s');
        expect(result['E2'].v).toEqual('157,850');
        expect(result['E2'].t).toEqual('s');
    });

    it('should show numbers and percentages in exported xsl', function () {
        var sheetArray = xlsService.getSheetArrayFromMixedTable(mixedData)
        var result = xlsService.getSheetFromArray(sheetArray, true);
        expect(result['A1'].v).toEqual('Female');
        expect(result['B1'].v).toEqual('% of Female Deaths');
        expect(result['C1'].v).toEqual('Male');
        expect(result['D1'].v).toEqual('% of Male Deaths');
        expect(result['E1'].v).toEqual('Number of Deaths');
        expect(result['A2'].v).toEqual(50390);
        expect(result['A2'].t).toEqual('n');
        expect(result['B2'].v).toEqual(31.9);
        expect(result['B2'].t).toEqual('n');
        expect(result['C2'].v).toEqual(107460);
        expect(result['C2'].t).toEqual('n');
        expect(result['D2'].v).toEqual(68.1);
        expect(result['D2'].t).toEqual('n');
        expect(result['E2'].v).toEqual(157850);
        expect(result['E2'].t).toEqual('n');
    });

    it('should show numbers only in exported csv if calculatepercentage set to false', function () {
        mixedData.calculatePercentage = false;
        var sheetArray = xlsService.getSheetArrayFromMixedTable(mixedData)
        var result = xlsService.getSheetFromArray(sheetArray);
        expect(result['A1'].v).toEqual('Female');
        expect(result['B1'].v).toEqual('Male');
        expect(result['C1'].v).toEqual('Number of Deaths');
        expect(result['A2'].v).toEqual('50,390');
        expect(result['A2'].t).toEqual('s');
        expect(result['B2'].v).toEqual('107,460');
        expect(result['B2'].t).toEqual('s');
        expect(result['C2'].v).toEqual('157,850');
        expect(result['C2'].t).toEqual('s');
    });

    it('should show numbers only in exported xsl if calculatepercentage set to false', function () {
        mixedData.calculatePercentage = false;
        var sheetArray = xlsService.getSheetArrayFromMixedTable(mixedData)
        var result = xlsService.getSheetFromArray(sheetArray, true);
        expect(result['A1'].v).toEqual('Female');
        expect(result['B1'].v).toEqual('Male');
        expect(result['C1'].v).toEqual('Number of Deaths');
        expect(result['A2'].v).toEqual(50390);
        expect(result['A2'].t).toEqual('n');
        expect(result['B2'].v).toEqual(107460);
        expect(result['B2'].t).toEqual('n');
        expect(result['C2'].v).toEqual(157850);
        expect(result['C2'].t).toEqual('n');
    });

});
