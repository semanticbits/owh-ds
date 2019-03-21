(function(){
    'use strict';
    angular
        .module('owh')
        .service('xlsService', xlsService);

    xlsService.$inject = [];

    //service to interface with js-xlsx library
    function xlsService() {
        var service = {
            getSheetFromArray: getSheetFromArray,
            getSheetArrayFromMixedTable: getSheetArrayFromMixedTable,
            getCSVFromSheet: getCSVFromSheet,
            exportCSVFromMixedTable: exportCSVFromMixedTable,
            exportXLSFromMixedTable: exportXLSFromMixedTable,
            getFilename: getFilename
        };
        return service;

        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!==s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        //data should have rowHeaders array for csv exporting
        function exportCSVFromMixedTable(data, dataKey, tableView, filename) {
            var sheetArray = getSheetArrayFromMixedTable(data, dataKey, tableView);
            var sheet = getSheetFromArray(sheetArray);
            var csv = getCSVFromSheet(sheet, data.headers, data.rowHeadersLength);
            saveAs(new Blob([s2ab(csv)], {type:"application/octet-stream"}), filename + ".csv");
        }

        function exportXLSFromMixedTable(data, dataKey, tableView, filename) {
            var wb = {SheetNames: [], Sheets: {}};
            var ws_name = filename;
            var sheetJson = getSheetArrayFromMixedTable(data, dataKey, tableView);
            var ws = getSheetFromArray(sheetJson, true);
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
            saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), filename + ".xlsx");
        }

        //returns xls worksheet from array of json rows
        //ex: [[{title: 'test', colspan: 1, rowspan: 1}, {...}, {...}], [{...}, null, {...}] ]
        function getSheetFromArray(data, convertNumbers) {
            var ws = {'!merges': []};
            var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
            //keep track of offsets caused by merged cells
            var cOffsets = {};
            for(var R = 0; R !== data.length; ++R) {
                var rOffset = 0;
                if(!cOffsets[R]) {
                    cOffsets[R] = 0;
                }
                for(var C = 0; C !== data[R].length; ++C) {
                    var cellJson = data[R][C];
                    var newR = R + rOffset;
                    var newC = C + cOffsets[R];
                    if(range.s.r > newR) range.s.r = newR;
                    if(range.s.c > newC) range.s.c = newC;
                    if(range.e.r < newR) range.e.r = newR;
                    if(range.e.c < newC) range.e.c = newC;

                    if(cellJson === null) continue;
                    var cell = getCellFromJson(cellJson, convertNumbers);
                    var cell_ref = XLSX.utils.encode_cell({c:newC,r:newR});

                    if(cellJson.colspan > 1 || cellJson.rowspan > 1) {
                        cOffsets[R] += cellJson.colspan - 1;
                        var mergeCell = {s: {c: newC, r: newR}, e: {c: (newC + cellJson.colspan - 1), r: (newR + cellJson.rowspan - 1)}};
                        ws['!merges'].push(mergeCell);

                    }
                    ws[cell_ref] = cell;
                }
            }
          	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
          	return ws;
        }

        function getCellFromJson(cellJson, convertNumbers) {
            var cell = {v: !(cellJson.title && cellJson.title.mean) ? cellJson.title : cellJson.title.mean };

            if (cell.v % 1 == 0) {
                cell.z = XLSX.SSF._table[3];
            }

            else {
                XLSX.SSF._table[164] = '#.0';
                cell.z = XLSX.SSF._table[164];
            }

            if(typeof cell.v === 'number' && cell.v !== -2) cell.t = 'n';
            else if(typeof cell.v === 'boolean') cell.t = 'b';
            else if(cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else {
                cell.t = 's';
                if(cell.v === 'suppressed') {
                    cell.v = 'Suppressed';
                }
                else if(cell.v === 'na') {
                    cell.v = 'No response';
                } else if(cell.v === -2) {
                    cell.v = 'Not Available';
                }
                else if(convertNumbers) {
                    //check if string is parsable as integer and make sure doesn't contain letters
                    var numberValue = parseFloat(cell.v.replace(',', ''));

                    if(!isNaN(numberValue) && !cell.v.match(/[a-z]/i)) {
                        cell.v = numberValue;
                        cell.t = 'n';
                    }
                }
            }
            return cell;
        }

        //gets json representation of sheet
        function getSheetArrayFromMixedTable(table, dataKey, tableView) {
            if (["prams", "mental_health", "brfss"].indexOf(dataKey) >= 0) {
                transformTableForVariance(table);
            }
            else if (['crude_death_rates', 'age-adjusted_death_rates', 'birth_rates', 'fertility_rates', 'std', 'tb', 'aids',
                'disease_rate', 'number_of_infant_deaths', 'crude_cancer_incidence_rates', 'crude_cancer_death_rates'].indexOf(tableView) >= 0) {
                var rateLabel = { 'crude_death_rates': 'Crude Death Rate', 'age-adjusted_death_rates': 'Age Adjusted Death Rate', 'birth_rates': 'Birth Rate', 'fertility_rates': 'Fertility Rate' }[tableView] || 'Rate';
                var countLabel = { 'birth_rates': 'Births', 'fertility_rates': 'Births', 'std': 'Cases', 'tb': 'Cases', 'aids': 'Cases', 'disease_rate': 'Cases', 'crude_cancer_incidence_rates': 'Incidence', 'number_of_infant_deaths': "Infant Deaths" }[tableView] || 'Deaths';
                var popLabel = { 'number_of_infant_deaths': "Births" }[tableView] || 'Population';
                transformTableForRates(table, rateLabel, popLabel, countLabel, tableView);
            }

            var sheet = [];
            var numOfPercentageColumns = 0;
            angular.forEach(table.headers, function (headerRow, idx) {
                var headers = [];

                if (idx > 0) {
                    // Add padding cells for headers
                    for (var i = 0; i < idx; i++) {
                        table.headers[i].forEach(function (headerCell, j) {
                            if (headerCell.rowspan > idx && !headerCell.isData) {
                                headers.push({ title: "", colspan: 1, rowspan: 1 });
                            }
                        });
                    }
                }

                angular.forEach(headerRow, function (cell, innerIdx) {
                    var colspan = cell.colspan;
                    //check is column header for data column, else add header as normal
                    if (table.calculatePercentage && ((innerIdx >= table.rowHeadersLength && innerIdx < headerRow.length - 1) || idx > 0 || (cell.isData && !cell.isTotal))) {
                        //for the bottom row just add an extra column for every existing one, else double the length
                        if(idx === table.headers.length - 1) {
                            headers.push({title: cell.title, colspan: colspan, rowspan: cell.rowspan});
                            headers.push({title: "% of " +cell.title+" Deaths", colspan: colspan, rowspan: cell.rowspan});
                            numOfPercentageColumns++;
                        } else {
                            headers.push({title: cell.title, colspan: colspan * 2, rowspan: cell.rowspan});
                        }
                    } else {
                        headers.push({title: cell.title, colspan: colspan, rowspan: cell.rowspan});
                    }

                });
                sheet.push(headers);
            });

            //keep track of column offsets so we know how much padding to add to each row
            var colOffsets = {};
            angular.forEach(table.data, function(row, idx) {
                var rowArray = [];

                function getPadding(colOffsets) {
                    var padding = 0;
                    for(var i = 0; i < table.rowHeadersLength - 1; i++) {
                        if(colOffsets[i]) {
                            padding++;
                            colOffsets[i]--;
                        }
                    }
                    return padding;
                }

                function replacePadding(colOffsets) {
                    var paddingIndex = 0;
                    for(var i = 0; i < table.rowHeadersLength; i++) {
                        if(!colOffsets[i]) {
                            var rowspan = row[paddingIndex] ? row[paddingIndex].rowspan : 0;
                            if(rowspan > 0) {
                                colOffsets[i] = rowspan - 1;
                            }
                            paddingIndex++;
                        }
                    }
                    return colOffsets;
                }

                //get padding
                var padding = getPadding(colOffsets);

                // TODO: For OWH-1877 issue #13: Real fix should go around this code. The issue is that some additional unneeded padding cells are being added.
                //add padding as needed to row
                if(table.rowHeadersLength > 1) {
                    if(padding > 0) {
                        rowArray.push({title: "", colspan: padding, rowspan: 1});
                    }
                }

                //replace zero/empty offsets
                replacePadding(colOffsets);

                angular.forEach(row, function(cell, innerIdx) {
                    var colspan = cell.colspan;
                    if(cell.title === 'Total') {
                        colspan += numOfPercentageColumns;
                    }
                    rowArray.push({title: cell.title, colspan: colspan, rowspan: cell.rowspan});
                    //if we have a percentage then add an extra column to display it
                    if (table.calculatePercentage && innerIdx < row.length - 1) {
                        if (cell.title === "Not Available" || cell.title === "suppressed") {
                            rowArray.push({ title: "", colspan: colspan, rowspan: cell.rowspan });
                        }
                        else if (cell.isCount) {
                            rowArray.push({ title: cell.percentage || "", colspan: colspan, rowspan: cell.rowspan });
                        }
                    }
                });
                sheet.push(rowArray);
            });
            return sheet;
        }

        function transformTableForRates(table, ratesLabel, popLabel, countLabel, tableView) {
            // Headers
            var headers = table.headers;
            headers.forEach(function (headerRow) {
                headerRow.forEach(function (headerCell) {
                    if (headerCell.isData || headerCell.title === "Total" || headerCell.title === "Number of Deaths") {
                        headerCell.colspan *= 3;
                    }
                });
            });

            for (var j = 0; j < table.rowHeadersLength; j++) {
                headers[0][j].rowspan++;
            }

            var newHeaderRow = [];
            // Add three header cells for each data column
            headers[headers.length - 1].forEach(function (headerCell, index) {
                if (headerCell.isData && (index !== headers[headers.length - 1].length - 1)) {
                    newHeaderRow.push({ title: ratesLabel, colspan: 1, rowspan: 1 });
                    newHeaderRow.push({ title: popLabel, colspan: 1, rowspan: 1 });
                    newHeaderRow.push({ title: countLabel, colspan: 1, rowspan: 1 });
                }
            });

            // Add them for the total column
            newHeaderRow.push({ title: ratesLabel, colspan: 1, rowspan: 1 });
            newHeaderRow.push({ title: popLabel, colspan: 1, rowspan: 1 });
            newHeaderRow.push({ title: countLabel, colspan: 1, rowspan: 1 });

            headers.push(newHeaderRow);

            var previousRowCellsCount = 0;

            // Data
            table.data.forEach(function (row, i) {
                var newCells = [];

                row.forEach(function (cell, j) {
                    var cell = row[j];

                    if (cell.isCount) {
                        var rateValue;
                        var rateVisibility = getRateVisibility(cell.title, cell.pop, tableView);

                        if (rateVisibility === 'visible') {
                            rateValue = tableView === 'number_of_infant_deaths' ? cell.deathRate : (cell.ageAdjustedRate ? cell.ageAdjustedRate : cell.title / cell.pop * 100000);
                        }
                        else if (rateVisibility === 'suppressed') {
                            rateValue = 'Suppressed';
                        } else if (rateVisibility === 'na') {
                            rateValue = 'Not Applicable'
                        } else if (rateVisibility === 'unreliable') {
                            rateValue = 'Unreliable';
                        }

                        newCells.push({ index: j, cell: { title: rateValue, colspan: 1, rowspan: 1 } });
                        newCells.push({ index: j, cell: { title: cell.pop || "Not Available", colspan: 1, rowspan: 1 } });
                    }
                });

                // Update the colspan of the total row
                if (row[0].title === "Total") {
                    row[0].colspan += previousRowCellsCount - 2;
                }

                previousRowCellsCount = newCells.length;

                // Insert the new cells in appropriate positions in reverse order
                for (var j = previousRowCellsCount - 1; j >= 0; j--) {
                    var newCell = newCells[j];
                    row.splice(newCell.index, 0, newCell.cell);
                }
            });
        }

        function transformTableForVariance(table) {
            var newColumnsCount = 1                                         // For percentage
                                + (table.filterUtilities.ci.value ? 1 : 0)  // For Confidence Interval
                                + (table.filterUtilities.uf.value ? 1 : 0); // For Sample Size (or count)

            if (newColumnsCount < 2) {
                return;
            }

            // Headers
            var headers = table.headers;
            headers.forEach(function (headerRow) {
                headerRow.forEach(function (headerCell) {
                    if (headerCell.isData) {
                        headerCell.colspan *= newColumnsCount;
                    }
                });
            });

            for (var j = 0; j < table.rowHeadersLength + 1; j++) {
                headers[0][j].rowspan++;
            }

            var newHeaderRow = [];
            // Add three header cells for each data column
            headers[headers.length - 1].forEach(function (headerCell) {
                if (headerCell.isData) {
                    newHeaderRow.push({ title: "Percentage of responses", colspan: 1, rowspan: 1 });

                    if (table.filterUtilities.ci.value) {
                        newHeaderRow.push({ title: table.filterUtilities.ci.title, colspan: 1, rowspan: 1 });
                    }

                    if (table.filterUtilities.uf.value) {
                        newHeaderRow.push({ title: table.filterUtilities.uf.title, colspan: 1, rowspan: 1 });
                    }
                }
            });

            headers.push(newHeaderRow);

            // Data
            table.data.forEach(function (row, i) {
                var newCells = [];

                row.forEach(function (cell, j) {
                    var cell = row[j];

                    if (cell.isCount) {
                        if (table.filterUtilities.ci.value) {
                            var ciValue = !cell.title.mean || cell.title.mean === "suppressed" || cell.title.mean === "nr" || cell.title.mean === "na" ? "" : "(" + cell.title.ci_l + " - " + cell.title.ci_u + ")";
                            newCells.push({ index: j + 1, cell: { title: ciValue, colspan: 1, rowspan: 1 } });
                        }

                        if (table.filterUtilities.uf.value) {
                            var countValue = !cell.title.mean || cell.title.mean === "suppressed" || cell.title.mean === "nr" || cell.title.mean === "na" || !cell.title.count ? "" : cell.title.count;
                            newCells.push({ index: j + 1, cell: { title: countValue, colspan: 1, rowspan: 1 } });
                        }
                    }
                });

                // Insert the new cells in appropriate positions in reverse order
                for (var j = newCells.length - 1; j >= 0; j--) {
                    var newCell = newCells[j];
                    row.splice(newCell.index, 0, newCell.cell);
                }
            });
        }

        //helper function to repeat merge cells in header for CSV output
        function padSheetForCSV(sheet, colHeaders, rowHeadersLength) {
            var headerMerges = [];
            // Temporary fix for OWH-1877 issue #13. Real fix should go around the todo comment added above 'TODO: For OWH-1877 issue #13'
            var sheetMerges = (sheet['!merges'] || []).reverse();
            sheetMerges.forEach(function(merge, idx) {
                //only repeat if merge cell is part of headers, use rowHeaders.length - 1 because of Total row
                if(merge.s.r < colHeaders.length || merge.s.c < rowHeadersLength - 1) {
                    var start = sheet[XLSX.utils.encode_cell(merge.s)];
                    for(var r = merge.s.r; r <= merge.e.r; r++) {
                        for(var c = merge.s.c; c <= merge.e.c; c++) {
                            //replace with value from starting cell in range
                            sheet[XLSX.utils.encode_cell({c: c, r: r})] = {v: start.v, t: 's'};
                        }
                    }
                    headerMerges.push(idx);
                }
            });
            angular.forEach(headerMerges, function(el) {
                sheet['!merges'].splice(el, 1);
            });
            return sheet;
        }

        function getCSVFromSheet(sheet, colHeaders, rowHeadersLength) {
            var csv = XLSX.utils.sheet_to_csv(padSheetForCSV(sheet, colHeaders, rowHeadersLength));
            return csv;
        }

        function getFilename(selectedFilter) {
            //get year range
            var yearRange = '';
            angular.forEach(selectedFilter.allFilters, function(filter) {
                if(filter.key === 'year') {
                    if(filter.value.length > 1) {
                        var minYear = parseInt(filter.value[0], 10);
                        var maxYear = parseInt(filter.value[0], 10);
                        angular.forEach(filter.value, function(year) {
                            var yearInt = parseInt(year, 10);
                            if(yearInt < minYear) {
                                minYear = yearInt;
                            }
                            if(yearInt > maxYear) {
                                maxYear = yearInt;
                            }
                        });
                        yearRange = minYear + '-' + maxYear;
                    } else if(filter.value.length === 1) {
                        //only one year selected
                        yearRange = filter.value[0];
                    } else {
                        //use all if none selected
                        yearRange = 'All';
                    }

                }
            });
            return selectedFilter.header + '_' + yearRange + '_Filtered';
        }

        function getRateVisibility(count, pop, tableView) {
            if(count === 'suppressed' || pop === 'suppressed') {
                return 'suppressed';
            }
            if (pop === 'n/a') {
                return 'na'
            }

            //If population value is undefined
            // OR
            //If table view is equals to 'std' OR 'tb' OR 'aids' OR 'disease_rate' and count == 'na'
            //Then @return 'na'
            if(!pop || (['std', 'tb', 'aids', 'disease_rate'].indexOf(tableView) >= 0 && count === 'na')) {
                return 'na';
            }

            //if table view is not equals to 'std' OR 'tb' OR 'aids' OR 'disease_rate' and count < 20
            //Basically we are skipping displaying 'unreliable' string for disease related data sets.
            if(['std', 'tb', 'aids', 'disease_rate'].indexOf(tableView) < 0 && count < 20) {
                return 'unreliable';
            }

            return 'visible';
        }
    }
}());
