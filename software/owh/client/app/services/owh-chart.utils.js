(function(){
    'use strict';
    angular
        .module('owh.services')
        .service('chartUtilService', chartUtilService);

    chartUtilService.$inject = ['$window', '$dateParser', '$filter', '$translate','utilService', 'ModalService'];

    function chartUtilService($window, $dateParser, $filter, $translate, utilService, ModalService) {
        var service = {
            horizontalStack: horizontalStack,
            verticalStack: verticalStack,
            pieChart: plotlyPieChart,
            plotlyPieChart: plotlyPieChart,
            horizontalBar:	horizontalBar,
            verticalBar: verticalBar,
            //bulletBar: bulletBar,
            HorizontalChart : horizontalChart,
            verticalChart : verticalChart,
            lineChart : plotlyLineChart,
            multiLineChart: plotlyMultiLineChart,
            showExpandedGraph: showExpandedGraph,
            getColorPallete: getColorPallete
        };
        return service;

        // plotly layout for quick view
        function quickChartLayout(){
                return {
                    width: $window.innerWidth * 0.32,
                    autosize: true,
                    showlegend: false,
                    margin: {l:20, r:10, b:20, t:20},
                    xaxis: {visible: true, titlefont:{size: 15}, exponentformat: 'none', tickangle: 45, showline: true, gridcolor: '#bdbdbd', showticklabels: false, fixedrange: true},
                    yaxis: {visible: true, titlefont:{size: 15}, exponentformat: 'none', tickangle: 45, ticksuffix: '   ',showline: true,gridcolor: '#bdbdbd', showticklabels: false, fixedrange: true}
                }       
        }

        function getColorPallete(){
             return ["#ED93CB", "#65c2ff", "#FFCC9A", "#56b783", "#FF9F4A", "#FFCC9A", "#61B861", "#B2E7A7 ", "#DB5859", "#FFB2B0 ", "#AF8DCE", "#D4C4E0 ", "#A98078", "#D3B5AF", "#64D7D6", "#44558F", "#FFE495", "#1684A7 ", "#7577CD", "#6A759B", "#F6EC72", "#F97300 ", "#FD6378", "#390050", "#970747"]
        }
        
        function getSelectedOptionTitlesOfFilter(filter) {
            var options = [];
            //filters options with checkboxes
            if (angular.isArray(filter.value)) {
                angular.forEach(filter.value, function (optionKey) {
                    var option = utilService.findByKeyAndValue(filter.autoCompleteOptions, 'key', optionKey);
                    options.push(option.title);
                });
            } else {//for filters with radios
                var option = utilService.findByKeyAndValue(filter.autoCompleteOptions, 'key', filter.value);
                options.push(option.title);
            }

            return options.join(', ');
        }

        function getLongChartTitle(primaryFilter, filter1, filter2){
             var chartVars;
             if (filter2){
                chartVars= $translate.instant(filter1.title) + ' and ' + $translate.instant(filter2.title);
             }else{
                chartVars= $translate.instant(filter1.title);
             }
            
            var measure;
            if(primaryFilter.key == 'mental_health' || primaryFilter.key == 'prams' ||primaryFilter.key == 'brfss'){ //Dont use tableView for stats datasets, as tableView captures topics and not views 
                measure = $translate.instant('chart.title.measure.'+primaryFilter.key);       
                chartVars= $translate.instant(filter1.title);
            }else{
                measure= $translate.instant('chart.title.measure.'+(primaryFilter.tableView?primaryFilter.tableView:primaryFilter.key) + (primaryFilter.chartView?('.'+primaryFilter.chartView):''));
            }
            var statefilter;
            var yearfilter;
            angular.forEach(primaryFilter.allFilters, function(filter){
                if (filter.key === 'state' || filter.key === 'yrbsState'){
                     if(Array.isArray(filter.value) && filter.value.length > 3){
                         statefilter = 'selected States';
                     } else if(filter.value.length > 0){
                         statefilter = getSelectedOptionTitlesOfFilter(filter);
                     } else {
                         statefilter = 'US'
                     }
                } else if (filter.key === 'year' || filter.key === 'current_year' || filter.key === 'year_of_death'){
                     if(Array.isArray(filter.value) && filter.value.length > 3){
                       yearfilter = 'selected Years';
                     }else if(filter.value.length > 0){
                        yearfilter = getSelectedOptionTitlesOfFilter(filter);
                     } else{
                        yearfilter = filter.autoCompleteOptions[filter.autoCompleteOptions.length-1].title+ ' - ' + filter.autoCompleteOptions[0].title ;
                     }
                } 
            });

            return measure+ ' by ' + chartVars + ' in '+ statefilter+' for '+yearfilter;
        }

        function horizontalStack(filter1, filter2, data, primaryFilter, postFixToTooltip) {
            return plotlyHorizontalChart(filter1, filter2, data, primaryFilter, true, postFixToTooltip);
        }

        function verticalStack(filter1, filter2, data, primaryFilter) {
            return plotlyVerticalChart(filter1, filter2, data, primaryFilter, true);
        }

        function horizontalBar(filter1, filter2, data, primaryFilter, postFixToTooltip) {
            return plotlyHorizontalChart(filter1, filter2, data, primaryFilter, false, postFixToTooltip);
        }

        function verticalBar(filter1, filter2, data, primaryFilter) {
            return plotlyVerticalChart(filter1, filter2, data, primaryFilter, false);
        }

        /**
         * Get chart axis value from given data Object
         * @param filter
         * @param data
         * @returns {Number}
         */
        function getValueFromData(filter, data) {
            if(filter.tableView == "crude_death_rates" || filter.tableView == "birth_rates"
                || filter.tableView == "fertility_rates" || filter.chartView == "disease_rate" 
                || filter.tableView === 'crude_cancer_incidence_rates' || filter.tableView === 'crude_cancer_death_rates') {
                if(data[filter.key] >= 0) { // calculate rate if count is available, else return the notavailable or suppressed value
                    return !isNaN(data['pop']) ? Math.round(data[filter.key] / data['pop'] * 1000000) / 10 : -2;
                }else {
                    return data[filter.key] ;
                }
            }
            else if(filter.chartView == "infant_death_rate") {
                return !isNaN(data['pop']) ? $filter('number')(data['deathRate'], 1): -2;
            }
            else if(data['ageAdjustedRate'] && filter.tableView == "age-adjusted_death_rates"){
                var ageAdjustedRate = parseFloat(data['ageAdjustedRate'].replace(/,/g, ''));
                //parsing string to return floating point number
                return ageAdjustedRate == NaN ? data['ageAdjustedRate'] : ageAdjustedRate ;
            }
            else {
                return data[filter.key];
            }
        }

        /**
         * To get right chart label for given table view
         * @param tableView
         * @param chartLabel
         * @return String chart label
         */
        function getAxisLabel(tableView, chartLabel){
            switch (tableView) {
                case "crude_death_rates":
                    return "Crude Death Rates";
                    break;
                case "age-adjusted_death_rates":
                    return "Age Adjusted Death Rates";
                    break;
                case "birth_rates":
                    return "Birth Rates";
                    break;
                case "fertility_rates":
                    return "Fertility Rates";
                    break;
                case "crude_cancer_death_rates":
                    return "Cancer Death Rates";
                    break;
                case "crude_cancer_incidence_rates":
                    return "Cancer Incidence Rates";
                    break;          
                default:
                    return chartLabel;
            }
        }

        function plotlyHorizontalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip){
            var chartdata = horizontalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip);
            var colors = getColorPallete();    
            var layout = quickChartLayout();
            layout.xaxis.title = getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel)
            layout.yaxis.title = $translate.instant(filter2.title);
            var longtitle = getLongChartTitle(primaryFilter, filter1, filter2);
            layout.barmode = (stacked && longtitle.indexOf('Rates') < 0)?'stack':'bar';
            var plotydata = [];
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var trace = chartdata.data[i];
                // The additional white space on the name is added as a hack for fixing the legend string getting cut off issue
                var reg = {name: trace.key + '     ', x: [], y: [], text: [], orientation: 'h',  hoverinfo: 'none', type: 'bar',  marker :{color: colors[i%colors.length]}};
                for (var j = trace.values.length - 1 ; j >=0 ; j-- ){
                    var value  = trace.values[j];
                    reg.y.push(value.label);
                    reg.x.push(value.value < 0?0:value.value);
                    reg.text.push(getSuppressedCount(value.value, primaryFilter));
                }
                plotydata.push(reg);
            }
            return { charttype:chartdata.options.chart.type, title: chartdata.title, longtitle: longtitle, dataset: chartdata.dataset, data:plotydata, layout: layout, options: {displayModeBar: false}};
        }

        function plotlyVerticalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip){
            var chartdata = verticalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip);
            var layout = quickChartLayout();
            layout.xaxis.title = $translate.instant(filter2.title);
            layout.yaxis.title = getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel);
            var colors = getColorPallete();    
            var longtitle = getLongChartTitle(primaryFilter, filter1, filter2);
            layout.barmode = (stacked && longtitle.indexOf('Rates') < 0) ?'stack':'bar';
            var plotydata = [];
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var trace = chartdata.data[i];
                // The additional white space on the name is added as a hack for fixing the legend string getting cut off issue
                var reg = {name: trace.key+ '     ', x: [], y: [], text: [], orientation: 'v', type: 'bar', hoverinfo: 'none', marker :{color: colors[i%colors.length]}};
                for (var j = trace.values.length - 1 ; j >=0 ; j-- ){
                    var value  = trace.values[j];
                    reg.x.push(value.x);
                    reg.y.push(value.y < 0 ? 0:value.y);
                    reg.text.push(getSuppressedCount(value.y, primaryFilter));

                }
                plotydata.push(reg);
            }
            return { charttype:chartdata.options.chart.type, title:chartdata.title, longtitle: longtitle, dataset: chartdata.dataset, data:plotydata, layout: layout, options: {displayModeBar: false}};
        }

        function plotlyLineChart(data, filter, primaryFilter){
            var chartdata = lineChart (data, filter, primaryFilter);
            var layout = quickChartLayout();
            layout.xaxis.title = "Year";
            layout.yaxis.title = "Population";
            var colors = getColorPallete();    
            var linedata = chartdata.data();
            var plotydata = {name: linedata[0].key, x: [], y: [], text:[], type: 'scatter', hoverinfo: 'none', marker :{color: colors[i%colors.length]}};
            for (var i = linedata[0].values.length -1 ; i >= 0 ; i-- ){
                var value  = linedata[0].values[i];
                plotydata.x.push(value.x);
                plotydata.y.push(value.y < 0 ? 0:value.y);
                plotydata.text.push(getSuppressedCount(value.y, primaryFilter));
            }
            return { charttype:chartdata.options.chart.type, title: chartdata.title, longtitle: getLongChartTitle(primaryFilter, filter), dataset: chartdata.dataset, data:[plotydata], layout: layout, options: {displayModeBar: false}};
        }

        function plotlyMultiLineChart(filter1, filter2, data, primaryFilter){
            var layout = quickChartLayout();
            layout.xaxis.title = $translate.instant(filter2.title);
            layout.yaxis.title = getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel);

            var colors = getColorPallete();    
            var plotlydata = [];
            angular.forEach(utilService.getSelectedAutoCompleteOptions(filter1), function (primaryOption,index) {
                    var eachPrimaryData = utilService.findByKeyAndValue(data[filter1.key], 'name', primaryOption.key);

                    var plotlyseries= {name: primaryOption.key, x: [], y: [], text:[], type: 'scatter', hoverinfo: 'none', marker :{color: colors[index%colors.length]}};
                    if(eachPrimaryData && eachPrimaryData[filter2.key]) {
                        angular.forEach(utilService.getSelectedAutoCompleteOptions(filter2) , function (secondaryOption,j) {
                            if (!secondaryOption.disabled) {
                                var eachSecondaryData = utilService.findByKeyAndValue(eachPrimaryData[filter2.key], 'name', secondaryOption.key);
                                var value = undefined;
                                if (eachSecondaryData) {
                                    value = getValueFromData(primaryFilter, eachSecondaryData);
                                }
                                if (value !== undefined) {
                                    plotlyseries.x.push(secondaryOption.key);
                                    plotlyseries.y.push(value < 0 ? 0:value);
                                    plotlyseries.text.push(getSuppressedCount(value, primaryFilter));
                                }
                            }
                        });
                        plotlydata.push(plotlyseries);
                    }
                });
            return { charttype:'multiLineChart', title: $translate.instant("label.title."+filter1.key+"."+filter2.key), longtitle: getLongChartTitle(primaryFilter, filter1, filter2), dataset: primaryFilter.key, data:plotlydata, layout: layout, options: {displayModeBar: false}};
        }

        // The pie chart is displayed as bar chart        
        function  plotlyPieChart(data, filter, primaryFilter, postFixToTooltip ) {
            var chartdata  = pieChart(data, filter, primaryFilter, postFixToTooltip);
            var colors = getColorPallete();    
            var layout = quickChartLayout(chartdata);
            layout.xaxis.title = getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel);
            layout.yaxis.title = $translate.instant(filter.title);
            var plotydata = [];
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var trace = chartdata.data[i];
                // The additional white space on the name is added as a hack for fixing the legend string getting cut off issue
                var reg = {name: trace.label + '     ', x: [], y: [], text: [], orientation: 'h', type: 'bar', hoverinfo: 'none', marker :{color: colors[i%colors.length]}};
                    reg.y.push(trace.label); 
                    reg.x.push(trace.value<0?0:trace.value);
                    reg.text.push(getSuppressedCount(trace.value, primaryFilter));
                
                plotydata.push(reg);
            }
            return { charttype:chartdata.options.chart.type, title: chartdata.title, longtitle: getLongChartTitle(primaryFilter, filter, null), dataset: chartdata.dataset, data:plotydata, layout: layout, options: {displayModeBar: false}};

        }

        /*Multi Bar Horizontal Chart*/
        function horizontalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip) {

            postFixToTooltip = postFixToTooltip ? postFixToTooltip : '';
            var chartData = {
                data: [],
                dataset: primaryFilter.key,
                title:  $translate.instant(filter1.title) + ' and ' + $translate.instant(filter2.title),
                options: {
                    "chart": {
                        "type": "multiBarHorizontalChart",
                        stacked: stacked && primaryFilter.tableView && primaryFilter.tableView.indexOf('rate') < 0,
                        "xAxis": {
                            "axisLabel": getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel)
                        },
                        "yAxis": {
                            "axisLabel": $translate.instant(filter2.title)
                        }
                    }
                }
            };
            var multiChartBarData = [];

            if (primaryFilter.key == 'mental_health'
                || primaryFilter.key === 'prams' || primaryFilter.key === 'brfss') {

                var getBarValues = function (barData, filter) {
                    var barValues = [];
                    angular.forEach(utilService.getSelectedAutoCompleteOptions(filter), function (option,index) {
                        //get data for series
                        var eachPrimaryData = utilService.findByKeyAndValue(barData, 'name', option.key);
                        //skip missing data for prams chart
                        if(primaryFilter.key === 'prams' && !eachPrimaryData) {
                            return;
                        }
                        //set data to series values
                        barValues.push({"label":option.title, "value":
                            (eachPrimaryData &&  eachPrimaryData[primaryFilter.key]) ?
                                parseFloat(eachPrimaryData[primaryFilter.key].mean) : 0});

                    });
                    return barValues;
                };
                //if primary and secondary filters are same i.e. Single filter
                if (filter1.queryKey == filter2.queryKey) {
                    var seriesDataObj = {};
                    //series name
                    seriesDataObj["key"] = primaryFilter.chartAxisLabel;
                    //collect series values
                    var question = data.question[0];
                    var questionArray = [];
                    angular.forEach(data.question, function(pramsQuestion) {
                        if(pramsQuestion.name === primaryFilter.allFilters[4].value[0]) {
                            question = pramsQuestion;
                        }
                    });

                    angular.forEach(question, function(response, responseKey) {
                        if(typeof response === 'object' && responseKey != -1) {
                            question = response;
                            var seriesDataObj = {};
                            seriesDataObj["key"] = primaryFilter.chartAxisLabel;
                            seriesDataObj["key"] += ' - ' + responseKey;
                            seriesDataObj["values"] = getBarValues(question[filter1.queryKey], filter1);
                            multiChartBarData.push(seriesDataObj);
                        }
                    });


                } else {//for two filters
                    angular.forEach(utilService.getSelectedAutoCompleteOptions(filter1), function (primaryOption,index) {
                        var seriesDataObj = {};
                        var question = data.question[0];
                        question = data.question[1][0];
                        angular.forEach(data.question[1], function(response) {
                            if(typeof response === 'object') {
                                question = response;
                            }
                        });
                        var eachPrimaryData = utilService.findByKeyAndValue(question[filter1.queryKey], 'name', primaryOption.key);
                        if(!eachPrimaryData) {
                            return;
                        }
                        //Set name to series
                        seriesDataObj["key"] = primaryOption.title;

                        //collect series values
                        seriesDataObj["values"] = getBarValues(eachPrimaryData[filter2.queryKey], filter2);
                        multiChartBarData.push(seriesDataObj);
                    });
                }

            } else if(data && data[filter1.key]) {
                angular.forEach(utilService.getSelectedAutoCompleteOptions(filter1), function (primaryOption,index) {
                    var primaryDataObj = {};
                    var eachPrimaryData = utilService.findByKeyAndValue(data[filter1.key], 'name', primaryOption.key);

                    primaryDataObj["key"] = primaryOption.title;
                  
                    primaryDataObj["values"] = [];
                    if(eachPrimaryData) {
                        primaryDataObj[primaryFilter.key] = getValueFromData(primaryFilter, eachPrimaryData);
                    }
                    if(eachPrimaryData && eachPrimaryData[filter2.key]) {
                        angular.forEach(utilService.getSelectedAutoCompleteOptions(filter2) , function (secondaryOption,j) {
                            if (!secondaryOption.disabled) {
                                var eachSecondaryData = utilService.findByKeyAndValue(eachPrimaryData[filter2.key], 'name', secondaryOption.key);
                                var value = undefined;
                                if (eachSecondaryData) {
                                    value = getValueFromData(primaryFilter, eachSecondaryData);
                                }
                                if (value !== undefined) {
                                    primaryDataObj.values.push({ "label": secondaryOption.title, "value": value });
                                }
                            }
                        });
                        multiChartBarData.push(primaryDataObj);
                    }
                });
            }

            chartData.data = multiChartBarData;
            return chartData;
        }

        /*Vertical Stacked Chart*/
        function verticalChart(filter1, filter2, data, primaryFilter, stacked) {

            var chartData = {
                data: [],
                dataset: primaryFilter.key,
                title: $translate.instant(filter1.title) + ' and ' + $translate.instant(filter2.title),
                options: {
                    "chart": {
                        "type": "multiBarChart",
                        "stacked": stacked,
                        "xAxis": {
                            "axisLabel": $translate.instant(filter2.title)
                        },
                        "yAxis": {
                            "axisLabel": getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel)
                        }
                    }
                }
            };

            var multiBarChartData = [];
            if(data && data[filter1.key]){
                angular.forEach(utilService.getSelectedAutoCompleteOptions(filter1), function (primaryOption,index) {
                    var eachPrimaryData = utilService.findByKeyAndValue(data[filter1.key], 'name', primaryOption.key);
                    var primaryObj = {};
                    primaryObj["key"] = primaryOption.title;
                    primaryObj["values"] = [];

                    if(eachPrimaryData && eachPrimaryData[filter2.key]) {
                        var secondaryArrayData = utilService.sortByKey(eachPrimaryData[filter2.key], 'name');
                        angular.forEach(utilService.getSelectedAutoCompleteOptions(filter2), function (secondaryOption,j) {
                            var eachSecondaryData = utilService.findByKeyAndValue(secondaryArrayData, 'name', secondaryOption.key);
                            var yAxisValue = undefined;
                            if(eachSecondaryData &&  eachSecondaryData[primaryFilter.key]) {
                                yAxisValue =  getValueFromData(primaryFilter, eachSecondaryData);
                            }

                            if (yAxisValue !== undefined) {
                                primaryObj.values.push(
                                    { x : secondaryOption.title, y : yAxisValue }
                                );
                            }

                        });
                        multiBarChartData.push(primaryObj);
                    }
                });
            }
            chartData.data = multiBarChartData;
            return chartData;
        }

        function lineChart(data, filter, primaryFilter) {

            var chartData = {
                data: [],
                dataset: primaryFilter.key,
                title: $translate.instant(filter.title),
                options: {
                    "chart": {
                        "type": "lineChart",
                        "xAxis": {
                            "axisLabel": "Year",
                        },
                        "yAxis": {
                            "axisLabel": "Population",
                        },
                    }
                }
            };

            chartData.data = function () {
                var lineData = [];
                angular.forEach(utilService.getSelectedAutoCompleteOptions(filter), function(eachOption) {
                    var eachRow = utilService.findByKeyAndValue(data, 'name', eachOption.key);
                    var yAxisValue = undefined;
                    if(eachRow) {
                        yAxisValue =  getValueFromData(primaryFilter, eachRow);
                    }
                    if (yAxisValue !== undefined) {
                        lineData.push({x: eachOption.title, y: yAxisValue});
                    }
                });

                //Line chart data should be sent as an array of series objects.
                return [
                    {
                        values: lineData,      //values - represents the array of {x,y} data points
                        key: 'Population', //key  - the name of the series.
                        color: '#ff7f0e',  //color - optional: choose your own line color.
                        strokeWidth: 2,
                        classed: 'nvd3-dashed-line'
                    }
                ];
            };

            return chartData;
        }

        /*Prepare pie chart for single filter*/
        function pieChart( data, filter, primaryFilter, postFixToTooltip ) {
            postFixToTooltip = postFixToTooltip ? postFixToTooltip : '';
            var chartData = {
                data: [],
                dataset: primaryFilter.key,
                title:  $translate.instant(filter.title),
                options: {
                    chart: {
                        type: 'pieChart',
                        yAxis: {
                            axisLabel: $translate.instant("label.filter."+filter.key),
                            
                        },
                        xAxis: {
                            axisLabel: $translate.instant('chart.title.measure.'+(primaryFilter.tableView?primaryFilter.tableView:primaryFilter.key)),                            
                        }
                    }}
            };
            angular.forEach(utilService.getSelectedAutoCompleteOptions(filter), function(eachOption) {
                var eachRow = utilService.findByKeyAndValue(data, 'name', eachOption.key);
                var value = undefined;
                if(eachRow) {
                    value =  getValueFromData(primaryFilter, eachRow);
                }

                if (value !== undefined) {
                    chartData.data.push({label: eachOption.title, value: value});
                }
            });
            return chartData;
        }

        function countBars(data, stacked) {
            if(stacked){
                return data[0].x.length
            }                
            else {
                 return data[0].x.length * data.length;
            }
        }


        /*Show expanded graphs with whole set of features*/
        function showExpandedGraph(chartData, tableView, graphTitle, graphSubTitle,
                                   chartTypes, primaryFilters, selectedQuestion, selectedFiltersTxt ) {
            
            /**
             * Update chart dimensions and data
             */
            var updateChart = function (chartdata, tableView) {

                graphTitle = graphTitle ? graphTitle : (chartData.length > 1? 'label.graph.expanded': chartData[0].title);
                var expandedChartData = [];
                angular.forEach(chartdata, function(eachChartData) {
                        var layout = utilService.clone(eachChartData.layout);
                        // Set chart title
                       layout.title = eachChartData.longtitle;
                       layout.width = 1000;
                       layout.height = 750;
                       layout.showlegend= true;
                       if(eachChartData.charttype !== "multiLineChart") {
                           layout.legend = {
                               orientation: "v",
                               x: 1.01,
                               y: .4,
                           }
                           ;
                       }else {
                           layout.legend ={orientation: "h",
                               y: 1.15,
                               x: .4,
                           };
                           // layout.legend
                       }
                       layout.legend.traceorder = 'reversed';

                       layout.margin = {l:200, r:10, b:200, t:150};
                       layout.xaxis.visible= true;
                       layout.yaxis.visible= true;
                       layout.xaxis.showticklabels= true;
                       layout.yaxis.showticklabels= true;

                        // Update charts width/height based on the number of bars
                       if (eachChartData.charttype === "multiBarChart") {
                           layout.width = Math.max(1000, countBars(eachChartData.data,layout.barmode === 'stack') * 25);
                       }
                       else if (eachChartData.charttype === "multiBarHorizontalChart") {
                            layout.height = Math.max(750, countBars(eachChartData.data,layout.barmode === 'stack') * 25);
                       }
                       if(tableView && tableView.indexOf('rate') >= 0) {
                            layout.barmode = 'bar';
                       }

                    expandedChartData.push({layout:layout, dataset:eachChartData.dataset, data: eachChartData.data, longtitle: eachChartData.longtitle, charttype: eachChartData.charttype});

                });

                return expandedChartData;
            }

            // Just provide a template url, a controller and call 'showModal'.
            ModalService.showModal({
                templateUrl: "app/partials/expandedGraphModal.html",
                controllerAs: 'eg',
                controller: function ($scope, close, shareUtilService, searchFactory) {
                    var eg = this;
                    eg.chartData = updateChart(chartData, tableView);
                    eg.graphTitle = graphTitle;
                    eg.graphSubTitle = graphSubTitle;
                    eg.chartTypes = chartTypes;
                    eg.primaryFilters = primaryFilters;
                    eg.selectedQuestion = selectedQuestion;
                    eg.close = close;
                    eg.selectedFiltersTxt = selectedFiltersTxt;
                    eg.barmode = eg.chartData[0].layout.barmode;

                    eg.showFbDialog = function(svgIndex, title, section, description) {
                        shareUtilService.shareOnFb(svgIndex, title, section, description);
                    };
              

                    /**
                     * get the display name for chart
                     * @param chartType
                     * @returns {*}
                     */
                    eg.getChartName = function (chartType) {
                        var chartNames = {'yrbsSex&yrbsRace':'Sex and Race', 'yrbsSex&yrbsGrade':'Sex and Grade',
                            'yrbsGrade&yrbsRace': 'Grade and Race', 'yrbsRace': 'Race', 'race': 'Race/Ethnicity',
                            'yrbsSex': 'Sex', 'yrbsGrade': 'Grade', 'year': 'Year', 'state': 'State', 'yrbsState': 'State',
                            'income':'Household Income', 'education':'Education Attained', 'age_group':'Age group', 'sex':'Sex'};

                        if (chartType.length == 1) {
                            return chartNames[chartType[0]];
                        } else {
                            return chartNames[chartType[0]+'&'+chartType[1]];
                        }
                    };

                    /**
                     * Get data for specified chart and update it
                     * @param chartType
                     */
                    eg.getYrbsChartData = function (chartType) {
                        searchFactory.prepareQuestionChart(eg.primaryFilters,
                            eg.selectedQuestion, chartType).then(function (response) {
                            eg.chartData = updateChart([response.chartData]);
                            eg.activeTab = eg.getChartName(chartType);
                        });
                    }
                },
                size:650
            }).then(function (modal) {
                // The modal object has the element built, if this is a bootstrap modal
                // you can call 'modal' to show it, if it's a custom modal just show or hide
                // it as you need to.
                modal.element.show();
                modal.close.then(function (result) {
                    modal.element.hide();
                });
            });

            
        }

        /**
         * If state filter is selected and count is equals 0- return Suppressed
         * Else return actual count
         */
        function getSuppressedCount(count, primaryFilter) {
            if (count == -1){
                 return 'Suppressed';
            }else if (count == -2){
                 return 'Not Available';
            } else {
               return $filter('number')(count);
            }
            
        }
    }
}());
