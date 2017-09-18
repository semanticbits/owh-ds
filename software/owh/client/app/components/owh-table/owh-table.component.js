'use strict';
(function() {
    angular
        .module('owh')
        .component('owhTable', {
            templateUrl: 'app/components/owh-table/owhTable.html',
            controller: OWHTableController,
            controllerAs: 'otc',
            bindings: {
                tableData: '<',
                showPercentage: '<',
                tableView: '@',
                rowspanThreshold: '<'
            }
        });
    OWHTableController.$inject = ['$scope', '$rootScope', '$filter', '$timeout', '$translate'];
    function OWHTableController($scope, $rootScope, $filter, $timeout, $translate) {
        var otc = this;
        otc.compileTable = compileTable;

        otc.$postLink = function() {
            $timeout(function() {
                fitHeaderColumns();
            });
        };

        otc.$onChanges = function() {
            otc.compileTable(otc.tableData);
        };

        var $scroll = $('#clusterize-table');
        var $content = $('#content-area');
        var $headers = $("#headers-table");

        /**
         * Makes header columns equal width to content columns
         */
        var fitHeaderColumns = (function() {
            var prevWidth = [];
            return function() {
                var $firstRow = $content.find('tr:not(.clusterize-extra-row):first');
                var columnsWidth = [];
                $firstRow.children().each(function() {
                    columnsWidth.push($(this).width());
                });
                if (columnsWidth.toString() == prevWidth.toString() && $headers.find('tr').length === 0) return;

                var $headerRows = $headers.find('tr');
                var headerRowLength = $headerRows.length;
                var setWidthCount = 0;
                $headers.find('tr').each(function(j) {
                    var headerLength = $(this).children().length;
                    $(this).children().each(function(i) {
                        //only set length if last row or has rowspan, don't set length on last header
                        if(($(this).attr('rowspan') > 1 || j === headerRowLength - 1) && i !== headerLength - 1) {
                            $(this).width(columnsWidth[setWidthCount]);
                            setWidthCount++;
                        }
                    });
                });
                prevWidth = columnsWidth;
                //make sure scroll area is same width as other tables
                $scroll.width($headers.width());
            }
        })();

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

        function compileTable(table) {

            /**
             * Keep header equal width to tbody
             */
            var setHeaderWidth = function() {
                $headers.width($content.width());
            };

            /**
             * Set left offset to header to keep equal horizontal scroll position
             */
            var setHeaderLeftMargin = function(scrollLeft) {
                $headers.css('margin-left', -scrollLeft);
            };

            var getTableCell = function(column, row, colIndex, rowIndex, flatten) {
                var classes = '';
                if(column.isBold) {
                    classes += ' bold-class';
                }
                if(column.isCount) {
                    classes += ' text-right';
                }
                var cell = '<td class="' + classes + '" colspan="' + column.colspan + '" rowspan="' + (flatten ? 1 : column.rowspan) + '">'
                    if(column.isCount) {
                        cell += '<div class="custom-div owh-table__cell-content">';
                            cell += '<div>';
                        if(['crude_death_rates', 'age-adjusted_death_rates', 'birth_rates', 'fertility_rates', 'std', 'tb', 'aids', 'disease_rate', 'number_of_infant_deaths', 'crude_cancer_incidence_rates', 'crude_cancer_death_rates'].indexOf(otc.tableView) >= 0) {
                            cell += '<div id="crudeRateDiv" class="owh-table__left-col usa-width-one-half">'
                            if(rowIndex === 0) {
                                var rateLabel = { 'crude_death_rates': 'Crude Death Rate', 'age-adjusted_death_rates': 'Age Adjusted Death Rate', 'birth_rates':'Birth Rate', 'fertility_rates':'Fertility Rate' }[otc.tableView] || 'Rate';
                                var tooltip = { 'crude_death_rates': $translate.instant('label.help.text.rate'),
                                        'age-adjusted_death_rates': $translate.instant('label.help.text.rate')}[otc.tableView] || 'Rate';

                                cell += '<span class="owh-table-span" title="'+tooltip+'">' + rateLabel + '</span>';

                            }
                            var rateVisibility = getRateVisibility(column.title, column.pop, otc.tableView);
                            if(otc.tableView === 'age-adjusted_death_rates') {
                                cell += '<span>' + (column.ageAdjustedRate ? column.ageAdjustedRate : 'Not Available') + '</span>';
                            }
                            else {
                                cell += '<span>'
                                if(rateVisibility === 'visible') {
                                    cell += otc.tableView === 'number_of_infant_deaths' ? $filter('number')(column.deathRate, 1) : $filter('number')(column.title / column.pop * 100000, 1) ;
                                }
                                else if (rateVisibility === 'suppressed') {
                                    cell += 'Suppressed';
                                } else if (rateVisibility === 'na') {
                                    cell += 'Not Applicable'
                                } else if (rateVisibility === 'unreliable') {
                                    cell += 'Unreliable';
                                }
                                cell += '</span>';
                            }
                            cell += '</div>';
                            cell += '<div id="curdeDeathsPopuDiv" class="usa-width-one-half">';
                            cell += '<div>';
                            if(rowIndex === 0) {
                                if(otc.tableView === 'birth_rates' || otc.tableView === 'fertility_rates') {
                                    cell += '<span class="owh-table-span">Births</span>';
                                }
                                else if(otc.tableView === 'std' || otc.tableView === 'tb' || otc.tableView === 'aids' || otc.tableView === 'disease_rate') {
                                    cell += '<span class="owh-table-span">Cases</span>';
                                }
                                else if(otc.tableView === 'crude_cancer_incidence_rates') {
                                    cell += '<span class="owh-table-span">Incidence</span>';
                                }
                                else if(otc.tableView === 'number_of_infant_deaths') {
                                    cell += '<span class="owh-table-span">Infant Deaths</span>';
                                }
                                else {
                                    var deaths = $translate.instant('label.help.text.deaths');
                                    cell += '<span class="owh-table-span" title="'+deaths+'">Deaths</span>';
                                }
                            }
                            cell += '<span>';
                            if(column.title === 'suppressed') {
                                cell += 'Suppressed';
                            }
                            else if(column.title === 'na') {
                                cell += 'Not Available';
                            }else {
                                cell += $filter('number')(column.title);
                            }
                            cell += '</span>';
                            cell += '</div>';
                            cell += '<div>';
                            if(rowIndex === 0) {
                                if(otc.tableView == 'fertility_rates') {
                                    cell += '<span class="owh-table-span">Female Population</span>';
                                }
                                else if(otc.tableView == 'number_of_infant_deaths') {
                                    cell += '<span class="owh-table-span">Births</span>';
                                }
                                else {
                                    var pop = $translate.instant('label.help.text.pop');
                                    cell += '<span class="owh-table-span" title="'+pop+'">Population</span>';
                                }
                            }
                            if(otc.tableView !== 'age-adjusted_death_rates') {
                                cell += '<span>';
                                if(column.pop && column.pop !== 'n/a') {
                                    cell += column.pop === 'suppressed' ? 'Suppressed' : $filter('number')(column.pop);
                                } else {
                                    cell += 'Not Available';
                                }
                                cell += '</span>';
                            } else {
                                cell += '<span>';
                                if(column.standardPop && angular.isNumber(column.standardPop)) {
                                    cell += $filter('number')(column.standardPop);
                                } else {
                                    cell += 'Not Available';
                                }
                                cell += '</span>';
                            }
                            cell += '</div>';



                        } else if (otc.tableView === 'number_of_deaths' ||
                                   otc.tableView === 'bridge_race' ||
                                   otc.tableView === 'number_of_births' ||
                                   otc.tableView === 'cancer_incident' ||
                                   otc.tableView === 'cancer_mortality') {
                            if(column.title === 'suppressed') {
                                cell += '<span>Suppressed</span>';
                            } else if(column.title === 'na') {
                                cell += '<span>Not Available</span>';
                            } else {
                                cell += '<span class="count-value">' + $filter('number')(column.title) + '</span>';
                                if(colIndex !== row.length - 1 && column.percentage  > 0 && otc.showPercentage) {
                                    cell += '<span class="count-value" title="Row Percentage"> (' + $filter('number')(column.percentage, 1) + '%)</span>';
                                }
                            }
                        } else if (otc.tableView === 'number_of_infant_deaths') {
                            cell += (function (count) {
                                if (count === 'suppressed') return '<span>Suppressed</span>';
                                if (count < 20) return '<span>Unreliable</span>';
                                if (isNaN(parseInt(count))) return count;
                                var result = '<span class="count-value">' + $filter('number')(count) + '</span>';
                                if (colIndex !== row.length - 1 && column.percentage  > 0) {
                                    result += '<span class="count-value" title="Row Percentage"> (' + $filter('number')(column.percentage, 1) + '%)</span>';
                                }
                                return result;
                            })(column.title);
                        }
                        cell+= '</div>';
                        cell += '</div>';
                    } else {
                        cell += column.title;
                    }
                    cell += '</td>';
                return cell;
            };

            var data = [];
            if(table && table.data && table.data.length > 0) {
                //find out how long the first merge cell is
                var maxRowspan = 0;
                if (Array.isArray(table.data[0])){
                   maxRowspan = table.data[0][0].rowspan;
                }
                var newCells = [];
                angular.forEach(table.data, function(eachRow, rowIndex) {
                    var row = '<tr>';
                    //is max rowspan is above threshold, use repeating logic
                    if(maxRowspan > otc.rowspanThreshold) {
                        for(var i = 0; i < newCells.length; i++) {
                            if(newCells[i].rowspan > 1) {
                                row += getTableCell(newCells[i], eachRow, i, rowIndex, true);
                                newCells[i].rowspan--;
                            }
                        }
                    }

                    angular.forEach(eachRow, function(eachColumn, colIndex){
                        //add row, flatten depending on rowspan threshold
                        row += getTableCell(eachColumn, eachRow, colIndex, rowIndex, maxRowspan > otc.rowspanThreshold);
                        //if row has rowspan and maxRowspan is above threshold, then populate newCells array
                        if(eachColumn.rowspan > 1 && maxRowspan > otc.rowspanThreshold) {
                            var newCell = false;
                            for(var j = 0; j < newCells.length; j++) {
                                //replace newCell
                                if(newCells[j].rowspan <= 1) {
                                    newCells[j] = eachColumn;
                                    break;
                                }
                                //otherwise if end is reached, flag for pushing new cell onto array
                                if(j === newCells.length - 1) {
                                    newCell = true;
                                }
                            }
                            //if array is empty or flag is set, add newCell to array
                            if(newCells.length === 0 || newCell) {
                                newCells.push(eachColumn);
                            }
                        }
                    });
                    row += '</tr>';
                    data.push(row);
                });

                var clusterize = new Clusterize({
                    rows: data,
                    scrollId: 'clusterize-table',
                    contentId: 'content-area',
                    callbacks: {
                        clusterChanged: function() {
                            fitHeaderColumns();
                            setHeaderWidth();
                        }
                    }
                });

                /**
                 * Update header columns width on window resize
                 */
                $(window).resize(fitHeaderColumns);

                /**
                 * Update header left offset on scroll
                 */
                $scroll.on('scroll', (function() {
                    var prevScrollLeft = 0;
                    return function() {
                        var scrollLeft = $(this).scrollLeft();
                        if (scrollLeft == prevScrollLeft) return;
                        prevScrollLeft = scrollLeft;

                        setHeaderLeftMargin(scrollLeft);
                    }
                }()));
            }

        }
    }
}());
