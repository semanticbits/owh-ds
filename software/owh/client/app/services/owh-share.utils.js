(function(){
    'use strict';
    angular
        .module('owh.services')
        .service('shareUtilService', shareUtilService);

    shareUtilService.$inject = ['SearchService', '$q', '$filter', 'utilService'];

    function shareUtilService(SearchService, $q, $filter) {
        var service = {
            shareOnFb: shareOnFb,
            exportChart: exportChart
        };
        return service;


        /**
         * Exports chart as PDF or PNG
         * @param chart
         * @param title
         * @param format
         */
        function exportChart(chart, title, format, chartdata, primaryFilters, selectedFiltersTxt) {
            selectedFiltersTxt = selectedFiltersTxt?selectedFiltersTxt:'None';
            var charttitle = primaryFilters.chartAxisLabel + ' by ' + title;
            var filename = charttitle + '_' + $filter('date')(new Date(), 'yyyyMMdd-hhmmss');
            if(format != 'PPT') {
                getBase64ForSvg(chart).then(function (response) {
                    if (format == 'PNG') {
                        var link = document.createElement("a");
                        link.download = filename + '.png';
                        link.href = response.replace("image/png", "image/octet-stream");
                        document.body.appendChild(link);
                        link.click();

                    } else {
                        var doc = new jsPDF('l');
                        doc.text(30, 25, charttitle);
                        doc.addImage(response, 'PNG', 60, 30);
                        doc.save(filename + '.pdf');
                    }
                });
            }else {
                var pptx = new PptxGenJS();
                pptx.setLayout('LAYOUT_4x3');
                var slide = pptx.addNewSlide();
                slide.addShape(pptx.shapes.RECTANGLE, { x:'2%', y:'2%', w:'96%', h:'96%', line_size:1.5, line: '000000' });
                if(chartdata.options.chart.type == "multiBarHorizontalChart" || chartdata.options.chart.type == "multiBarChart"){
                    addBarChart(pptx, slide, charttitle, chartdata);
                } else if (chartdata.options.chart.type == "pieChart"){
                    addPieChart(pptx, slide, charttitle, chartdata);
                } else if (chartdata.options.chart.type == "lineChart"){
                    addLineChart(pptx, slide, charttitle, chartdata);
                }

                addFooter(pptx, slide, selectedFiltersTxt);
                addNotesSlide(pptx, chartdata.dataset, selectedFiltersTxt);
                pptx.save(filename);
            }
        }

        function shareOnFb(svgIndex, title, section, description, data) {
            section = section ? section : 'Mortality';
            description = description ? description : "Discover, search, and explore women's health data";
            if(data) {
                uploadImage(data, title, section, description);
            } else {
                getBase64ForSvg(svgIndex).then(function(response){
                    uploadImage(response, title, section, description);
                });
            }
        }
        function uploadImage(response, title, section, description){
            SearchService.uploadImage(response).then(function(response){
                //TODO:remove once tested on DEV
                console.log(response.data.appURL+'fb/'+response.data.imageId);
                FB.ui({
                    method: 'feed',
                    name: 'OWH ' + section + ' '+ $filter('translate')(title),
                    link: response.data.appURL,
                    picture: response.data.appURL+'fb/'+response.data.imageId,
                    caption: 'OWH Digital Services Visualization',
                    description: description,
                    message: 'OWH Mortality graph',
                    display:'popup'
                });
            });
        }
        /**
         * Converts svg to png base64 content
         * @returns {*}
         */
        function getBase64ForSvg(buttonId) {
            var html = d3.select("#" + buttonId + " svg")
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .node().parentNode.innerHTML;
            var imgSrc = 'data:image/svg+xml;base64,'+ btoa(html);
            var canvas = document.createElement('canvas');

            var image = new Image();
            image.src = imgSrc;
            var deferred = $q.defer();
            image.onload = function() {
                canvas.width = (image.width+50);
                canvas.height = image.height+50;
                canvas.getContext("2d").drawImage(image,20,20);
                if (canvas.msToBlob) { //for IE
                    try {
                        deferred.resolve(canvas.msToBlob());
                    }catch (err){
                        console.log('"Exception on canvas.msToBlob');
                    }
                }else{ //for other browsers
                    deferred.resolve(canvas.toDataURL("image/png"));
                }
            };
            return deferred.promise;
        }

        // Adds a pie chart to a ppt
        function addPieChart(pptx, slide, title, chartdata){
            var dataChartBar = [{labels: [], values: []}];
            for (var i = chartdata.data.length - 1 ; i >=0 ; i-- ){
                dataChartBar[0].labels.push(chartdata.data[i].label);
                dataChartBar[0].values.push(chartdata.data[i].value);
            }

            slide.addChart( pptx.charts.PIE, dataChartBar, { x:.2, y:.2, w:'95%', h:'85%',
                showLegend: true, legendPos: 't',
                showLabel: false,
                showTitle: true, title: title, titleFontSize: 20,
                showValue: true,dataLabelFontSize:8
            } );
        }

        // Adds a line chart to a ppt
        function addLineChart(pptx, slide, title, chartdata){
            var dataLines = [];
            var data = chartdata.data();
            for (var i = data.length - 1 ; i >=0 ; i-- ){
                var line = {name: data[i].key, labels: [], values: []}
                dataLines.push(line);
                for (var j = data[i].values.length -1; j >=0 ; j--){
                    line.labels.push(data[i].values[j].x);
                    line.values.push(data[i].values[j].y);
                }
            }

            slide.addChart( pptx.charts.LINE, dataLines, { x:.2, y:.2, w:'95%', h:'85%',
                showLegend: true, legendPos: 't',
                showLabel: false,
                showTitle: true, title: title, titleFontSize: 20,
                showValue: true,dataLabelFontSize:8, dataLabelPosition: 't'
            } );
        }

        // Adds a bar chart to a ppt
        function addBarChart(pptx, slide, title, chartdata){
            var dataChartBar = [];
            var colors = [];
            // Traverse the data in reverse order so that the bars order match in the UI and generate PPT.
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var region = chartdata.data[i];
                var reg = {name: region.key, labels: [], values: []};
                for (var j = region.values.length - 1 ; j >=0 ; j-- ){
                    var value  = region.values[j];
                    reg.labels.push(chartdata.options.chart.type == "multiBarHorizontalChart"?value.label:value.x);
                    reg.values.push(value.y?value.y:value.value)
                }
                dataChartBar.push(reg);
            }
            slide.addChart( pptx.charts.BAR, dataChartBar, { x:.2, y:.2, w:'95%', h:'85%',
                showLegend: true, legendPos: 't',
                showLabel: true,
                showTitle: true, title: title, titleFontSize: 20,
                barGrouping:chartdata.options.chart.stacked?'stacked':'clustered',
                showValue: false,dataLabelFontSize:8,dataLabelPosition: 'outEnd',
                //chartColors: colors
                barDir: chartdata.options.chart.type == "multiBarHorizontalChart"?'bar':'col'
            } );
        }

        function addFooter(pptx, slide, selectedFiltersTxt ){
            slide.addShape(pptx.shapes.LINE, { x:'2%', y:'92%', w:'96%', h:0, line:'000000', line_size:1.5 });
            slide.addText('This graph is downloaded form Health Information Gateway(HIG) using the query parameters: '+ selectedFiltersTxt, {x:'2%', y:'93%', w:'95%', font_size: 9});
        }

        function addNotesSlide(pptx, dataset, selectedFiltersTxt){
            var slide = pptx.addNewSlide();
            slide.addShape(pptx.shapes.RECTANGLE, { x:'2%', y:'2%', w:'96%', h:'96%', line_size:1.5, line: '000000'});
            slide.addText('Notes: ', {x:'4%', y:'10%', w:'20%', font_size: 18, bold: true, underline:true});
            slide.addText('Datasource: ', {x:'5%', y:'15%', w:'20%', font_size: 12});
            slide.addText($filter('translate')('datadoc.datasource.'+dataset), {x:'20%', y:'15%', w:'75%', h:'15%', font_size: 11, valign: 'top', autoFit: true});
            slide.addText('Query parameters: ', {x:'5%', y:'35%', w:'20%', font_size: 12});
            slide.addText(selectedFiltersTxt,{x:'20%', y:'35%', w:'75%', font_size: 11, valign: 'top', autoFit: true})
            slide.addText('Generated at:',{x:'5%', y:'40%', w:'20%', font_size: 12})
            slide.addText($filter('date')(new Date(),'short'), {x:'20%', y:'40%', w:'75%', font_size: 11, valign: 'top', autoFit: true});
            slide.addText('Suggested citation: ', {x:'5%', y:'45%', w:'20%', font_size: 12});
            slide.addText($filter('translate')('datadoc.citation.'+dataset), {x:'20%', y:'45%', w:'75%', h:'10%', font_size: 11, valign: 'top', autoFit: true});
            slide.addText('Notes: ', {x:'5%', y:'50%', w:'20%', font_size: 12});
            slide.addText($filter('translate')('datadoc.notes.'+dataset), {x:'20%', y:'50%', w:'75%', h:'45%', font_size: 10, valign: 'top', autoFit: true});
            addFooter(pptx, slide, selectedFiltersTxt);
        }
    }
}());
