(function(){
    'use strict';
    angular
        .module('owh.services')
        .service('chartUtilService', chartUtilService);

    chartUtilService.$inject = ['$dateParser', '$filter', '$translate','utilService', 'ModalService'];

    function chartUtilService($dateParser, $filter, $translate, utilService, ModalService) {
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
            showExpandedGraph: showExpandedGraph
        };
        return service;

        // plotly layout for quick view
        function quickChartLayout(chartdata){
                return {
                    width: 350,
                    height: 300,
                    showlegend: false,
                    margin: {l:10, r:10, b:10, t:20},
                    xaxis: {visible: false, title: chartdata.options.chart.xAxis.axisLabel,titlefont:{size: 16}, exponentformat: 'none', tickangle: 45, },
                    yaxis: {visible: false, title: chartdata.options.chart.yAxis.axisLabel,titlefont:{size: 16}, exponentformat: 'none', tickangle: -45, ticksuffix: '   '}
                }       
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
                chartVars= $translate.instant("label.title."+filter1.key+ "."+filter2.key);
             }else{
                chartVars= $translate.instant("label.filter."+filter1.key);
             }
              
            var measure = $translate.instant('chart.title.measure.'+(primaryFilter.tableView?primaryFilter.tableView:primaryFilter.key));
            var statefilter;
            var yearfilter;
            angular.forEach(primaryFilter.allFilters, function(filter){
                if (filter.key === 'state'){
                     if(filter.value.length > 3){
                         statefilter = 'selected States';
                     } else if(filter.value.length > 0){
                         statefilter = getSelectedOptionTitlesOfFilter(filter);
                     } else {
                         statefilter = 'US'
                     }
                } else if (filter.key === 'year'){
                     if(filter.value.length > 3){
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
                || filter.tableView == "fertility_rates" || filter.chartView == "disease_rate") {
                return data['pop'] ? Math.round(data[filter.key] / data['pop'] * 1000000) / 10 : 0;
            }
            else if(filter.chartView == "infant_death_rate") {
                return data['pop'] ? $filter('number')(data[filter.key] / data['pop'] * 1000, 1): 0;
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
                default:
                    return chartLabel;
            }
        }


        function plotlyHorizontalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip){
            var chartdata = horizontalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip);

            var layout = quickChartLayout(chartdata);
            layout.barmode = stacked?'stack':'bar';
            var plotydata = [];
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var trace = chartdata.data[i];
                var reg = {name: trace.key, x: [], y: [], text: [], orientation: 'h', type: 'bar', hoverinfo: 'text', hoverlabel:{font:{size:14}}};
                for (var j = trace.values.length - 1 ; j >=0 ; j-- ){
                    var value  = trace.values[j];
                    reg.y.push(value.label);
                    reg.x.push(value.value);
                    reg.text.push(trace.key+':'+value.label+':'+value.value.toLocaleString());
                }
                plotydata.push(reg);
            }
            return { charttype:chartdata.options.chart.type, title: chartdata.title, longtitle: getLongChartTitle(primaryFilter, filter1, filter2), dataset: chartdata.dataset, data:plotydata, layout: layout, options: {displayModeBar: false}};
        }

        function plotlyVerticalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip){
            var chartdata = verticalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip);
            var layout = quickChartLayout(chartdata);
            layout.barmode = stacked?'stack':'bar';
            var plotydata = [];
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var trace = chartdata.data[i];
                var reg = {name: trace.key, x: [], y: [], text: [], orientation: 'v', type: 'bar', hoverinfo: 'text', hoverlabel:{font:{size:14}}};
                for (var j = trace.values.length - 1 ; j >=0 ; j-- ){
                    var value  = trace.values[j];
                    reg.x.push(value.x);
                    reg.y.push(value.y);
                    reg.text.push(trace.key+':'+value.x+':'+value.y.toLocaleString());

                }
                plotydata.push(reg);
            }
            return { charttype:chartdata.options.chart.type, title:chartdata.title, longtitle: getLongChartTitle(primaryFilter, filter1, filter2), dataset: chartdata.dataset, data:plotydata, layout: layout, options: {displayModeBar: false}};
        }

        function plotlyLineChart(data, filter, primaryFilter){
            var chartdata = lineChart (data, filter, primaryFilter);
            var layout = quickChartLayout(chartdata);
            var linedata = chartdata.data();
            var plotydata = {name: linedata[0].key, x: [], y: [], text:[], type: 'scatter', hoverinfo: 'text', hoverlabel:{font:{size:14}}};
            for (var i = linedata[0].values.length -1 ; i >= 0 ; i-- ){
                var value  = linedata[0].values[i];
                plotydata.x.push(value.x);
                plotydata.y.push(value.y);
                plotydata.text.push(linedata[0].key+':'+value.x+':'+value.y.toLocaleString());
            }
            return { charttype:chartdata.options.chart.type, title: chartdata.title, longtitle: getLongChartTitle(primaryFilter, filter), dataset: chartdata.dataset, data:[plotydata], layout: layout, options: {displayModeBar: false}};
        }

        function plotlyMultiLineChart(data, primaryFilter){
            var chartdata = multiLineChart (data, primaryFilter);
            var layout = quickChartLayout(chartdata);
            var linedata = chartdata.data();
            var plotlydata = [];
            for (var j = linedata.length -1 ; j >=0; j-- ){
                var series = linedata[j];
                var plotlyseries= {name: series.key, x: [], y: [], text:[], type: 'scatter', hoverinfo: 'text', hoverlabel:{font:{size:14}}};
                for (var i = series.values.length -1 ; i >= 0 ; i-- ){
                    var value  = series.values[i];
                    plotlyseries.x.push(value.x);
                    plotlyseries.y.push(value.y);
                    plotlyseries.text.push(linedata[0].key+':'+value.x+':'+value.y.toLocaleString());
                }
                plotlydata.push(plotlyseries) ;
            }
            return { charttype:chartdata.options.chart.type, title: chartdata.title, longtitle: getLongChartTitle(primaryFilter), dataset: chartdata.dataset, data:plotlydata, layout: layout, options: {displayModeBar: false}};
        }

        function  plotlyPieChart(data, filter, primaryFilter, postFixToTooltip ) {
            var chartdata  = pieChart(data, filter, primaryFilter, postFixToTooltip);

            var layout = quickChartLayout(chartdata);
            var plotydata = [];
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var trace = chartdata.data[i];
                var reg = {name: trace.label, x: [], y: [], text: [], orientation: 'h', type: 'bar', hoverinfo: 'text', hoverlabel:{font:{size:14}}};
                    reg.y.push(trace.label); 
                    reg.x.push(trace.value);
                    reg.text.push(trace.label+':'+trace.value.toLocaleString());
                
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
                title:  $translate.instant("label.title."+filter1.key+"."+filter2.key),
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
                        stacked: stacked && primaryFilter.tableView && primaryFilter.tableView.indexOf('rate') < 0,
                        "duration": 500,
                        x: function(d){return d.label;},
                        y: function(d){return d.value;},
                        "xAxis": {
                            "axisLabelDistance": -20,
                            "axisLabel": getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel),
                            tickFormat:function () {
                                return null;
                            },
                            "showMaxMin": false
                        },
                        "yAxis": {
                            "axisLabel": $translate.instant(filter2.title),
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
                                        html += "<span class='fa fa-square' style='color:"+elem.color+"'></span>" +
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
                title: $translate.instant("label.title."+filter1.key+"."+filter2.key),
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
                            "axisLabel": getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel),
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
                                    html += "<span class='fa fa-square' style='color:"+elem.color+"'></span>" +
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
                title: $translate.instant("label.graph."+filter.key),
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
                                    html += "<span class='fa fa-square' style='color:"+elem.color+"'></span>" +
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

        function multiLineChart (chart, primaryFilter) {
            return {
                data: function () {
                    var series = chart.data.reduce(function (prev, point) {
                        prev[point.key] = prev[point.key] || [];
                        prev[point.key].push({ x: point.year, y: point.count });
                        return prev;
                    }, {});
                    return Object.keys(series).map(function (key) {
                        return {
                            key: key,
                            values: series[key],
                            color: getRandomColor(),
                            strokeWidth: 2,
                            classed: 'nvd3-dashed-line'
                        };
                    });

                    function getRandomColor () {
                        var letters = '0123456789ABCDEF';
                        var color = '#';
                        for (var i = 0; i < 6; i++ ) {
                            color += letters[Math.floor(Math.random() * 16)];
                        }
                        return color;
                    }
                },
                dataset: primaryFilter.key,
                title: $translate.instant('label.title.' + chart.headers[0].key + '.' + chart.headers[1].key),
                options: {
                    chart: {
                        type: "lineChart",
                        height: 250,
                        width: 300,
                        margin: {
                            top: 5,
                            right: 5,
                            bottom: 16,
                            left: 50
                        },
                        showMaxMin: false,
                        showLegend: false,
                        showControls: false,
                        showValues: false,
                        showXAxis: true,
                        showYAxis: true,
                        reduceXTicks: false,
                        legend:{
                            width: 200,
                            expanded: true
                        },
                        staggerLabels: true,
                        rotateLabels: 70,
                        styles: {
                            classes: {
                                'with-3d-shadow': true,
                                'with-transitions': true,
                                gallery: false
                            }
                        },
                        interactive: true,
                        x: function (d) { return d.x; },
                        y: function (d) { return d.y; },
                        xAxis: {
                            axisLabelDistance: -20,
                            axisLabel: "Year",
                            tickFormat: function (d) {
                                return d;
                            }
                        },
                        yAxis: {
                            axisLabelDistance: -20,
                            axisLabel: primaryFilter.chartAxisLabel,
                            tickFormat: function (d) {
                                return null;
                            }
                        },
                        tooltip: {
                            contentGenerator: function(d) {
                                var html = "<div class='usa-grid-full'" +
                                    "<div class='usa-width-one-whole' style='padding: 10px; font-weight: bold'>" + d.value + "</div>" +
                                    "<div class='usa-width-one-whole nvtooltip-value'>";
                                d.series.forEach(function (elem) {
                                    html += "<i class='fa fa-square' style='color:" + elem.color + "'></i>" +
                                        "&nbsp;&nbsp;&nbsp;" + elem.key + "&nbsp;&nbsp;&nbsp;"
                                        + getCount(elem.value, primaryFilter) + "</div>";
                                });
                                html += "</div>";
                                return html;
                            }
                        }
                    }
                }
            };
        }

        /*Prepare pie chart for single filter*/
        function pieChart( data, filter, primaryFilter, postFixToTooltip ) {
            postFixToTooltip = postFixToTooltip ? postFixToTooltip : '';

            var color = d3.scale.category20();
            var chartData = {
                data: [],
                dataset: primaryFilter.key,
                title:  $translate.instant("label.filter."+filter.key),
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
                        yAxis: {
                            axisLabel: $translate.instant("label.filter."+filter.key),
                            
                        },
                        xAxis: {
                            axisLabel: $translate.instant('chart.title.measure.'+(primaryFilter.tableView?primaryFilter.tableView:primaryFilter.key)),                            
                        },
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
                                    html += "<span class='fa fa-square' style='color:"+elem.color+"'></span>" +
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
                angular.forEach(chartData, function(eachChartData) {
                        var layout = utilService.clone(eachChartData.layout);
                        // Set chart title
                       layout.title = eachChartData.longtitle;
                       layout.width = 1100;
                       layout.height = 750;
                       layout.showlegend= true;
                       layout.legend ={orientation: "v",
                           x: 1.01,
                           y: .5
                       };
                       layout.margin = {l:200, r:250, b:200, t:100};
                       layout.xaxis.visible= true;
                       layout.yaxis.visible= true;

                        // Update charts width/height based on the number of bars
                       if (eachChartData.charttype === "multiBarChart") {
                           layout.width = Math.max(1100, countBars(eachChartData.data,layout.barmode === 'stack') * 25);
                       }
                       else if (eachChartData.charttype === "multiBarHorizontalChart") {
                            layout.height = Math.max(750, countBars(eachChartData.data,layout.barmode === 'stack') * 25);
                       }
                       if(tableView && tableView.indexOf('rate') >= 0) {
                            layout.barmode = 'bar';
                       }

                       // Set margins 
//                         if(eachChartData.charttype === 'multiBarHorizontalChart') {
//                        layout.margin.t = 30;
//                        layout.margin.r = 40;
//                        layout.margin.b = 120;
//                         if(eachChartData.title === 'label.title.agegroup.autopsy' ||
//                             eachChartData.title === 'label.title.race.hispanicOrigin') {
//                            layout.margin.l =
//                                 (eachChartData.title === 'label.title.race.hispanicOrigin')?160:100;
//                            layout.height = 550;
// //                             eachChartData.options.chart.showValues = false;
//                         } if(eachChartData.title === 'label.title.yrbsSex.yrbsRace' ) {
//                            layout.margin.l = 210;
//                         } else {
//                            layout.margin.l = 200;
//                         }
//                     } else if(eachChartData.charttype === 'multiBarChart') {
// //                         eachChartData.options.chart.xAxis.axisLabelDistance = 70;
//                        layout.margin.t = 30;
//                        layout.margin.r = 20;
//                        layout.margin.b = 120;
//                        layout.margin.l = 120;
//                         if(eachChartData.title === 'label.title.gender.placeofdeath') {
// //                             eachChartData.options.chart.wrapLabels=true;
// //                             eachChartData.options.chart.rotateLabels=0;
//                            layout.margin.b = 110;
// //                             eachChartData.options.chart.staggerLabels = false;
//                         }else if (eachChartData.title==='label.title.gender.hispanicOrigin' ||
//                             eachChartData.title==='label.title.agegroup.hispanicOrigin' ) {
// //                             eachChartData.options.chart.yAxis.axisLabelDistance = 30;
//                            layout.height = 600;
//                            layout.margin.b = 200;
//                         }
//                     } else if (eachChartData.charttype === 'pieChart') {
//                         if(eachChartData.title === 'label.graph.yrbsGrade') {
// //                             eachChartData.options.chart.legend.margin.right = 130;
// //                             eachChartData.options.chart.legend.margin.top = 30;
//                         }
//                     } else if (eachChartData.charttype === 'lineChart') {
//                        layout.margin.l = 85;
//                        layout.margin.b = 50;
// //                         eachChartData.options.chart.xAxis.axisLabelDistance = 5;
// //                         eachChartData.options.chart.yAxis.axisLabelDistance = 20;
//
// //                         eachChartData.options.chart.yAxis.tickFormat = function (d) {
// //                             if (isNaN(d)) {
// //                                 return d;
// //                             }
// //                             return d3.format(',f')(d);
// //                         };
//                     }
                    expandedChartData.push({layout:layout, dataset:eachChartData.dataset, data: eachChartData.data, longtitle: eachChartData.longtitle});

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
                var stateFilter = utilService.findFilterByKeyAndValue(primaryFilter.allFilters, 'key', 'state');
                var isStateFilter = utilService.isFilterApplied(stateFilter);
                return isStateFilter? 'Suppressed': $filter('number')(count);
            }
            return $filter('number')(count);
        }
    }
}());
