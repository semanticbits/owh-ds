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
    OWHTableController.$inject = ['$scope', '$rootScope', '$filter', '$timeout'];
    function OWHTableController($scope, $rootScope, $filter, $timeout) {
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

        function getRateVisibility(deaths, pop) {
            if(deaths === 'suppressed' || pop === 'suppressed') {
                return 'suppressed';
            }
            if(!pop) {
                return 'na';
            }
            if(deaths < 20) {
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
                        cell += '<label class="custom-label owh-table__cell-content">';
                            cell += '<div>';
                        if(['crude_death_rates', 'age-adjusted_death_rates', 'birth_rates', 'fertility_rates'].indexOf(otc.tableView) >= 0) {
                            cell += '<div id="crudeRateDiv" class="owh-table__left-col ' + (row.length > 5 ? 'usa-width-one-half' : 'usa-width-one-third') + '">';
                            if(rowIndex === 0) {
                                var rateLabel = { 'crude_death_rates': 'Crude Death Rates', 'age-adjusted_death_rates': 'Age Adjusted Death Rates' }[otc.tableView] || 'Rate';
                                cell += '<label class="owh-table__label">' + rateLabel + '</label>';
                            }
                            var rateVisibility = getRateVisibility(column.title, column.pop);
                            if(otc.tableView === 'age-adjusted_death_rates') {
                                cell += '<span>' + (column.ageAdjustedRate ? column.ageAdjustedRate : 'Not Available') + '</span>';
                            }
                            else {
                                cell += '<span>'
                                if(rateVisibility === 'visible') {
                                    cell += $filter('number')(column.title / column.pop * 100000, 1);
                                } else if (rateVisibility === 'suppressed') {
                                    cell += 'Suppressed';
                                } else if (rateVisibility === 'na') {
                                    cell += 'Not Applicable'
                                } else if (rateVisibility === 'unreliable') {
                                    cell += 'Unreliable';
                                }
                                cell += '</span>';
                            }
                            cell += '</div>';
                            cell += '<div id="curdeDeathsPopuDiv" class="' + (row.length > 5 ? 'usa-width-one-half' : 'usa-width-one-third') + '">';
                            cell += '<div>';
                            if(rowIndex === 0) {
                                if(otc.tableView === 'birth_rates' || otc.tableView === 'fertility_rates') {
                                    cell += '<label class="owh-table__label">Births</label>';
                                }
                                else {
                                    cell += '<label class="owh-table__label">Deaths</label>';
                                }
                            }
                            cell += '<span>';
                            if(column.title === 'suppressed') {
                                cell += 'Suppressed';
                            } else {
                                cell += $filter('number')(column.title);
                            }
                            cell += '</span>';
                            cell += '</div>';
                            cell += '<div>';
                            if(rowIndex === 0) {
                                if(otc.tableView == 'fertility_rates') {
                                    cell += '<label class="owh-table__label">Female Population</label>';
                                }
                                else {
                                    cell += '<label class="owh-table__label">Population</label>';
                                }
                            }
                            if(otc.tableView !== 'age-adjusted_death_rates') {
                                cell += '<span>';
                                if(column.pop) {
                                    cell += $filter('number')(column.pop);
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



                        } else if(otc.tableView === 'number_of_deaths' || otc.tableView === 'bridge_race' || otc.tableView === 'number_of_infant_deaths') {
                            if(column.title === 'suppressed') {
                                cell += '<span>Suppressed</span>';
                            } else if(column.title === 'Not Available') {
                                cell += '<span>Not Available</span>';
                            } else {
                                cell += '<span class="count-value">' + $filter('number')(column.title) + '</span>';
                                if(colIndex !== row.length - 1 && column.percentage  > 0 && otc.showPercentage) {
                                    cell += '<span class="count-value"> (' + $filter('number')(column.percentage, 1) + '%)</span>';
                                }
                            }
                        } else if(otc.tableView === 'number_of_births') {
                          cell += '<span class="count-value">' + $filter('number')(column.title) + '</span>';
                          if(colIndex !== row.length - 1 && column.percentage  > 0 && otc.showPercentage) {
                            cell += '<span class="count-value"> (' + $filter('number')(column.percentage, 1) + '%)</span>';
                          }
                        }

                            cell+= '</div>';
                        cell += '</label>';
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
