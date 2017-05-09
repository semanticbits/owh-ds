(function(){
    'use strict';
    angular
        .module('owh.services')
        .service('chartUtilService', chartUtilService);

    chartUtilService.$inject = ['$dateParser', '$filter', '$translate','utilService', 'ModalService'];

    function chartUtilService( $dateParser, $filter, $translate, utilService, ModalService ) {
        var service = {
            horizontalStack: horizontalStack,
            verticalStack: verticalStack,
            pieChart: pieChart,
            horizontalBar:	horizontalBar,
            verticalBar: verticalBar,
            //bulletBar: bulletBar,
            HorizontalChart : horizontalChart,
            verticalChart : verticalChart,
            lineChart : lineChart,
            showExpandedGraph: showExpandedGraph
        };
        return service;

        function horizontalStack(filter1, filter2, data, primaryFilter, postFixToTooltip) {
            return horizontalChart(filter1, filter2, data, primaryFilter, true, postFixToTooltip);
        }

        function verticalStack(filter1, filter2, data, primaryFilter) {
            return verticalChart(filter1, filter2, data, primaryFilter, true);
        }

        function horizontalBar(filter1, filter2, data, primaryFilter, postFixToTooltip) {
            return horizontalChart(filter1, filter2, data, primaryFilter, false, postFixToTooltip);
        }

        function verticalBar(filter1, filter2, data, primaryFilter) {
            return verticalChart(filter1, filter2, data, primaryFilter, false);
        }

        /**
         * Get chart axis value from given data Object
         * @param primaryFilter
         * @param eachPrimaryData
         * @returns {Number}
         */
        function getValueFromData(primaryFilter, eachPrimaryData) {
            return  primaryFilter.tableView == "crude_death_rates" ? parseFloat($filter('number')(eachPrimaryData[primaryFilter.key] / eachPrimaryData['pop'] * 100000, 1)) : eachPrimaryData[primaryFilter.key];
        }

        /*Multi Bar Horizontal Chart*/
        function horizontalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip) {
            postFixToTooltip = postFixToTooltip ? postFixToTooltip : '';
            if(primaryFilter.tableView == "crude_death_rates") {
                primaryFilter.chartAxisLabel = "Crude Death Rates";
            }

            var chartData = {
                data: [],
                title: "label.title."+filter1.key+"."+filter2.key,
                options: {
                    "chart": {
                        "type": "multiBarHorizontalChart",
                        "height": 250,
                        "width": 0,
                        "margin": {
                            "top": 5,
                            "right": 5,
                            "bottom": 45,
                            "left": 45
                        },
                        showLegend: false,
                        showControls: false,
                        showValues: false,
                        showXAxis:true,
                        showYAxis:true,
                        stacked: stacked,
                        "duration": 500,
                        x: function(d){return d.label;},
                        y: function(d){return d.value;},
                        "xAxis": {
                            "axisLabelDistance": -20,
                            "axisLabel": $translate.instant(filter2.title),
                            tickFormat:function () {
                                return null;
                            },
                            "showMaxMin": false
                        },
                        "yAxis": {
                            "axisLabel": primaryFilter.chartAxisLabel,
                            tickFormat:function () {
                                return null;
                            }
                        },
                        valueFormat:function (n){
                            if(isNaN(n)){ return n; }
                            else if (primaryFilter.key == 'mental_health' || primaryFilter.key === 'prams') {
                                return d3.format(',.1f')(n);(n);
                            } else {
                                return d3.format('d')(n);
                            }
                        },
                        useInteractiveGuideline: false,
                        interactive: false,
                        tooltip: {
                            contentGenerator: function(d) {
                                var html = "<div class='usa-grid-full'"+
                                    "<div class='usa-width-one-whole' style='padding: 10px; font-weight: bold'>"+ d.value+"</div>" +
                                    "<div class='usa-width-one-whole nvtooltip-value'>";
                                    d.series.forEach(function(elem){
                                        html += "<i class='fa fa-square' style='color:"+elem.color+"'></i>" +
                                            "&nbsp;&nbsp;&nbsp;"+elem.key+"&nbsp;&nbsp;&nbsp;"
                                            + getCount(elem.value, primaryFilter) + postFixToTooltip + "</div>";
                                    });
                                    html += "</div>";
                                return html;
                            }
                        }
                    }
                }
            };
            var multiChartBarData = [];

            if (primaryFilter.key == 'mental_health' || primaryFilter.key === 'prams') {

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
                    if(primaryFilter.key === 'prams') {
                        var questionArray = [];
                        angular.forEach(data.question, function(pramsQuestion) {
                            if(pramsQuestion.name === primaryFilter.allFilters[4].value[0]) {
                                question = pramsQuestion;
                            }
                        });
                        // question = data.question[1][0];
                        // questionArray = question[0];
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
                    } else {
                        seriesDataObj["values"] = getBarValues(question[filter1.queryKey], filter1);
                        multiChartBarData.push(seriesDataObj);
                    }

                } else {//for two filters
                    angular.forEach(utilService.getSelectedAutoCompleteOptions(filter1), function (primaryOption,index) {
                        var seriesDataObj = {};
                        var question = data.question[0];
                        if(primaryFilter.key === 'prams') {
                            question = data.question[1][0];
                            angular.forEach(data.question[1], function(response) {
                                if(typeof response === 'object') {
                                    question = response;
                                }
                            });
                        }
                        var eachPrimaryData = utilService.findByKeyAndValue(question[filter1.queryKey], 'name', primaryOption.key);
                        if(!eachPrimaryData) {
                            return;
                        }
                        //Set name to series
                        seriesDataObj["key"] = primaryOption.title;
                        if(filter1.queryKey === 'sex') {
                            seriesDataObj["color"] = primaryOption.key === 'Male' ?  "#009aff" : "#fe66ff";
                        }

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
                    if(filter1.key === 'gender') {
                        primaryDataObj["color"] = primaryOption.key === 'Male' ?  "#009aff" : "#fe66ff";
                    }
                    primaryDataObj["values"] = [];
                    if(eachPrimaryData) {
                        primaryDataObj[primaryFilter.key] = getValueFromData(primaryFilter, eachPrimaryData);
                    }
                    if(eachPrimaryData && eachPrimaryData[filter2.key]) {
                        angular.forEach(utilService.getSelectedAutoCompleteOptions(filter2) , function (secondaryOption,j) {
                            var eachSecondaryData = utilService.findByKeyAndValue(eachPrimaryData[filter2.key], 'name', secondaryOption.key);
                            var value = 0;
                            if(eachSecondaryData &&  eachSecondaryData[primaryFilter.key]) {
                                value = getValueFromData(primaryFilter, eachSecondaryData);
                            }
                            primaryDataObj.values.push({"label":secondaryOption.title, "value": value});
                        });
                        multiChartBarData.push(primaryDataObj);
                    }else{
                        angular.forEach(utilService.getSelectedAutoCompleteOptions(filter2), function (secondaryOption,j) {
                            primaryDataObj.values.push(
                                { label : secondaryOption.title, value : 0 }
                            );
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
                title: "label.title."+filter1.key+"."+filter2.key,
                options: {
                    "chart": {
                        "type": "multiBarChart",
                        "height": 250,
                        "width": 0,
                        "margin": {
                            "top": 5,
                            "right": 5,
                            "bottom": 45,
                            "left": 45
                        },
                        showMaxMin: false,
                        showLegend: false,
                        showControls: false,
                        showValues: false,
                        showXAxis:true,
                        showYAxis:true,
                        reduceXTicks:false,
                        //wrapLabels:true,
                        legend:{
                            width:200,
                            expanded:true
                        },
                        staggerLabels:true,
                        rotateLabels:70,
                        x: function(d){return d.x;},
                        y: function(d){return d.y;},
                        "clipEdge": true,
                        "duration": 500,
                        "stacked": stacked,
                        "xAxis": {
                            "axisLabelDistance": -20,
                            "axisLabel": $translate.instant(filter2.title),
                            margin: {
                                top:60
                            },
                            tickFormat:function () {
                                return null;
                            }
                        },
                        "yAxis": {
                            "axisLabelDistance": -20,
                            "axisLabel": primaryFilter.chartAxisLabel,
                            tickFormat:function () {
                               return null;
                            }
                        },
                        valueFormat:function (n){
                            if(isNaN(n)){ return n; }
                            return d3.format('d')(n);
                        },useInteractiveGuideline: false,
                        interactive: false,
                        tooltip: {
                            contentGenerator: function(d) {
                                var html = "<div class='usa-grid-full'"+
                                    "<div class='usa-width-one-whole' style='padding: 10px; font-weight: bold'>"+ d.value+"</div>" +
                                    "<div class='usa-width-one-whole nvtooltip-value'>";
                                d.series.forEach(function(elem){
                                    html += "<i class='fa fa-square' style='color:"+elem.color+"'></i>" +
                                        "&nbsp;&nbsp;&nbsp;"+elem.key+"&nbsp;&nbsp;&nbsp;"
                                        +getCount(elem.value, primaryFilter)+"</div>";
                                });
                                html += "</div>";
                                return html;
                            }
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
                    if(filter1.key === 'gender') {
                        primaryObj["color"] = primaryOption.key === 'Male' ?  "#009aff" : "#fe66ff";
                    }

                    if(eachPrimaryData && eachPrimaryData[filter2.key]) {
                        var secondaryArrayData = utilService.sortByKey(eachPrimaryData[filter2.key], 'name');
                        angular.forEach(utilService.getSelectedAutoCompleteOptions(filter2), function (secondaryOption,j) {
                            var eachSecondaryData = utilService.findByKeyAndValue(secondaryArrayData, 'name', secondaryOption.key);
                            var yAxisValue = 0;
                            if(eachSecondaryData &&  eachSecondaryData[primaryFilter.key]) {
                                yAxisValue =  getValueFromData(primaryFilter, eachSecondaryData);
                            }
                            primaryObj.values.push(
                                { x : secondaryOption.title, y : yAxisValue }
                            );
                        });
                        multiBarChartData.push(primaryObj);
                    }else{
                        angular.forEach(utilService.getSelectedAutoCompleteOptions(filter2), function (secondaryOption,j) {
                            primaryObj.values.push(
                                { x : secondaryOption.title, y : 0 }
                            );
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
                title: "label.graph."+filter.key,
                options: {
                    "chart": {
                        "type": "lineChart",
                        "height": 250,
                        "width": 300,
                        "margin": {
                            "top": 5,
                            "right": 5,
                            "bottom": 16,
                            "left": 50
                        },
                        showMaxMin: false,
                        showLegend: false,
                        showControls: false,
                        showValues: false,
                        showXAxis:true,
                        showYAxis:true,
                        reduceXTicks:false,
                        legend:{
                            width:200,
                            expanded:true
                        },
                        staggerLabels:true,
                        rotateLabels:70,
                        styles: {
                            classes: {
                                'with-3d-shadow': true,
                                'with-transitions': true,
                                gallery: false

                            }
                        },
                        interactive: true,
                        x: function(d){return d.x;},
                        y: function(d){return d.y;},
                        "xAxis": {
                            "axisLabelDistance": -20,
                            "axisLabel": "Year",
                            tickFormat:function (d) {
                                return null;
                            }
                        },
                        "yAxis": {
                            "axisLabelDistance": -20,
                            "axisLabel": "Population",
                            tickFormat:function (d) {
                                return null;
                            }
                        },
                        tooltip: {
                            contentGenerator: function(d) {
                                var html = "<div class='usa-grid-full'"+
                                    "<div class='usa-width-one-whole' style='padding: 10px; font-weight: bold'>"+ d.value+"</div>" +
                                    "<div class='usa-width-one-whole nvtooltip-value'>";
                                d.series.forEach(function(elem){
                                    html += "<i class='fa fa-square' style='color:"+elem.color+"'></i>" +
                                        "&nbsp;&nbsp;&nbsp;"+elem.key+"&nbsp;&nbsp;&nbsp;"
                                        +getCount(elem.value, primaryFilter) + "</div>";
                                });
                                html += "</div>";
                                return html;
                            }
                        }
                    }
                }
            };

            chartData.data = function () {
                var lineData = [];
                angular.forEach(utilService.getSelectedAutoCompleteOptions(filter), function(eachOption) {
                    var eachRow = utilService.findByKeyAndValue(data, 'name', eachOption.key);
                    var yAxisValue = 0;
                    if(eachRow) {
                        yAxisValue =  getValueFromData(primaryFilter, eachRow);
                    }
                    lineData.push({x: eachOption.title, y: yAxisValue});
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

            var color = d3.scale.category20();
            var chartData = {
                data: [],
                title: "label.graph."+filter.key,
                options: {
                    chart: {
                        type: 'pieChart',
                        "height": 250,
                        "width": 250,
                        "margin": {
                            "top": 5,
                            "right": 5,
                            "bottom": 5,
                            "left": 5
                        },
                        x: function(d){ return d.label; },
                        y: function(d){ return d.value; },
                        showValues: false,
                        showLabels: false,
                        transitionDuration: 250,
                        showLegend: false,
                        legend: {
                            margin:{}
                        },
                        labelThreshold: 0.01,
                        labelSunbeamLayout: true,
                        styles: {
                            classes: {
                                'with-3d-shadow': true,
                                'with-transitions': true,
                                gallery: false

                            }
                        },
                        color:function (d, i) {
                            if(filter.key==='gender') {
                                return d.label === 'Male' ?  "#009aff" : "#fe66ff";
                            }else {
                                return color(i);
                            }
                        },useInteractiveGuideline: false,
                        interactive: false,
                        tooltip: {
                            contentGenerator: function(d) {
                                var html = "<div class='usa-grid-full'"+
                                    "<div class='usa-width-one-whole nvtooltip-value'>";
                                d.series.forEach(function(elem){
                                    html += "<i class='fa fa-square' style='color:"+elem.color+"'></i>" +
                                        "&nbsp;&nbsp;&nbsp;"+elem.key+"&nbsp;&nbsp;&nbsp;"
                                        +getCount(elem.value, primaryFilter) + postFixToTooltip + "</div>";
                                });
                                html += "</div>";
                                return html;
                            }
                        }
                    }}
            };
            angular.forEach(utilService.getSelectedAutoCompleteOptions(filter), function(eachOption) {
                var eachRow = utilService.findByKeyAndValue(data, 'name', eachOption.key);
                var value = 0;
                if(eachRow) {
                    value =  getValueFromData(primaryFilter, eachRow);
                }
                chartData.data.push({label: eachOption.title, value: value});
            });
            return chartData;
        }

        /*Show expanded graphs with whole set of features*/
        function showExpandedGraph(chartData, graphTitle, graphSubTitle,
                                   chartTypes, primaryFilters, selectedQuestion) {

            /**
             * Update chart dimensions and data
             */
            var updateChart = function (chartData) {
                var allExpandedChartDatas = [];
                graphTitle = graphTitle ? graphTitle : (chartData.length > 1? 'label.graph.expanded': chartData[0].title);
                angular.forEach(chartData, function(eachChartData) {
                    var expandedChartData = angular.copy(eachChartData);
                    /*Update chartData options*/
                    expandedChartData.options.chart.height = 500;
                    expandedChartData.options.chart.width = 750;
                    expandedChartData.options.chart.showLegend = true;
                    expandedChartData.options.chart.showControls = true;
                    expandedChartData.options.chart.showValues = true;
                    expandedChartData.options.chart.showXAxis = true;
                    expandedChartData.options.chart.showYAxis = true;

                    if (eachChartData.options.chart.type !== 'pieChart') {
                        expandedChartData.options.chart.xAxis.tickFormat = function (d) {
                            if (isNaN(d)) {
                                return d;
                            }
                            return d3.format(',f')(d);
                        };
                        expandedChartData.options.chart.yAxis.tickFormat = function (d) {
                            if (isNaN(d)) {
                                return d;
                            }
                            return d3.format(',f')(d);
                        };
                        expandedChartData.options.chart.yAxis.axisLabelDistance = 10;
                        expandedChartData.options.chart.xAxis.axisLabelDistance = 120;
                    }
                    if(eachChartData.options.chart.type === 'multiBarHorizontalChart') {
                        expandedChartData.options.chart.margin.top = 20;
                        expandedChartData.options.chart.margin.right = 40;
                        expandedChartData.options.chart.margin.bottom = 120;
                        if(expandedChartData.title === 'label.title.agegroup.autopsy' ||
                            expandedChartData.title === 'label.title.race.hispanicOrigin') {
                            expandedChartData.options.chart.margin.left =
                                (expandedChartData.title === 'label.title.race.hispanicOrigin')?160:100;
                            expandedChartData.options.chart.height = 550;
                            expandedChartData.options.chart.showValues = false;
                        } if(expandedChartData.title === 'label.title.yrbsSex.yrbsRace' ) {
                            expandedChartData.options.chart.margin.left = 210;
                        } else {
                            expandedChartData.options.chart.margin.left = 200;
                        }
                    } else if(eachChartData.options.chart.type === 'multiBarChart') {
                        expandedChartData.options.chart.xAxis.axisLabelDistance = 70;
                        expandedChartData.options.chart.margin.top = 20;
                        expandedChartData.options.chart.margin.right = 20;
                        expandedChartData.options.chart.margin.bottom = 120;
                        expandedChartData.options.chart.margin.left = 120;
                        if(expandedChartData.title === 'label.title.gender.placeofdeath') {
                            expandedChartData.options.chart.wrapLabels=true;
                            expandedChartData.options.chart.rotateLabels=0;
                            expandedChartData.options.chart.margin.bottom = 110;
                            expandedChartData.options.chart.staggerLabels = false;
                        }else if (expandedChartData.title==='label.title.gender.hispanicOrigin' ||
                            expandedChartData.title==='label.title.agegroup.hispanicOrigin' ) {
                            expandedChartData.options.chart.yAxis.axisLabelDistance = 30;
                            expandedChartData.options.chart.height = 600;
                            expandedChartData.options.chart.margin.bottom = 200;
                        }
                    } else if (eachChartData.options.chart.type === 'pieChart') {
                        if(expandedChartData.title === 'label.graph.yrbsGrade') {
                            expandedChartData.options.chart.legend.margin.right = 130;
                            expandedChartData.options.chart.legend.margin.top = 30;
                        }
                    } else if (eachChartData.options.chart.type === 'lineChart') {
                        expandedChartData.options.chart.margin.left = 85;
                        expandedChartData.options.chart.margin.bottom = 50;
                        expandedChartData.options.chart.xAxis.axisLabelDistance = 5;
                        expandedChartData.options.chart.yAxis.axisLabelDistance = 20;
                    }
                    allExpandedChartDatas.push(expandedChartData);
                });
                return allExpandedChartDatas;
            };

            // Just provide a template url, a controller and call 'showModal'.
            ModalService.showModal({
                templateUrl: "app/partials/expandedGraphModal.html",
                controllerAs: 'eg',
                controller: function ($scope, close, shareUtilService, searchFactory) {
                    var eg = this;
                    eg.chartData = updateChart(chartData);
                    eg.graphTitle = graphTitle;
                    eg.graphSubTitle = graphSubTitle;
                    eg.chartTypes = chartTypes;
                    eg.primaryFilters = primaryFilters;
                    eg.selectedQuestion = selectedQuestion;
                    eg.close = close;
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
                            'yrbsGrade&yrbsRace': 'Grade and Race', 'yrbsRace': 'Race',
                            'yrbsSex': 'Sex', 'yrbsGrade': 'Grade', 'year': 'Year', 'state': 'State'};

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
        function getCount(count, primaryFilter) {
            if (count == 0 && primaryFilter.applySuppression) {
                var stateFilter = utilService.findFilterByKeyAndValue(primaryFilter.sideFilters, 'key', 'state');
                var isStateFilter = utilService.isFilterApplied(stateFilter);
                return isStateFilter? 'Suppressed': $filter('number')(count);
            }
            return $filter('number')(count);
        }
    }
}());
