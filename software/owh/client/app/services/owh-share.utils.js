(function(){
    'use strict';
    angular
        .module('owh.services')
        .service('shareUtilService', shareUtilService);

    shareUtilService.$inject = ['SearchService', '$q', '$filter', '$window', 'API', 'chartUtilService'];

    function shareUtilService(SearchService, $q, $filter, $window, API, chartUtilService) {
        var service = {
            shareOnFb: shareOnFb,
            exportChart: exportChart
        };
        return service;

        function shareOnFb(svgIndex, title, section, description, data) {
            section = section ? section : 'Mortality';
            description = description ? description : "Discover, search, and explore women's health data";
            if(data) {
                uploadImage(data, title, section, description);
            } else {
                getPNGfromSVG(svgIndex).then(function(response){
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
         * Exports chart as PPT, PDF or PNG
         * @param chart
         * @param title
         * @param format
         */
        function exportChart(chart, title, format, chartdata, primaryFilters, selectedFiltersTxt) {
            selectedFiltersTxt = selectedFiltersTxt?selectedFiltersTxt:'None';
            // var charttitle = primaryFilters.chartAxisLabel + ' by ' + title;
            var charttitle = chartdata.longtitle;
            var filename = charttitle + '_' + $filter('date')(new Date(), 'yyyyMMdd-hhmmss');
            var canvas;
            if(format != 'PPT') {
                getPNGfromSVG(chart).then(function (response) {
                    if (format == 'PNG') {
                        if(isIE()) {
                            getImageCanvasForIE(response).then(function (canvas) {
                                canvas.toBlob(function (blob) {
                                    saveAs(blob, filename + 'file.png');
                                }, "image/png");
                            });
                        } else {
                            var link = document.createElement("a");
                            link.download = filename + 'file.png';
                            link.href = response.replace("image/png", "image/octet-stream");
                            document.body.appendChild(link);
                            link.click();
                        }
                    } else {
                        var doc = new jsPDF('l');
                        doc.rect(5,5,285, 200);
                        doc.addImage(response, 'PNG', 10, 10, 270, 190 );
                        doc.line(5, 190, 290, 190);
                        doc.setFontSize(11);
                        doc.text( 7, 194, doc.splitTextToSize('This graph is downloaded from Health Information Gateway(HIG) using the query parameters: '+ selectedFiltersTxt, 280));
                        doc.addPage();
                        doc.rect(5,5,285, 200);
                        doc.setFontSize(20);
                        doc.setFontType("bold");
                        doc.text(10,15, 'Notes:');
                        doc.setFontSize(12);
                        doc.text(12,22, 'Datasource: ');
                        doc.text(12,70, 'Query parameters: ');
                        doc.text(12,100, 'Generated at:')
                        doc.text(12,110,'Suggested citation: ');
                        doc.text(12,120, 'Notes: ');
                        doc.setFontType("");
                        doc.setFontSize(12);
                        doc.text(60,22,  doc.splitTextToSize($filter('translate')('datadoc.datasource.'+chartdata.dataset), 200));
                        doc.text(60,70, doc.splitTextToSize(selectedFiltersTxt, 200));
                        doc.text(60,100, $filter('date')(new Date(),'short'));
                        doc.text(60,110, doc.splitTextToSize($filter('translate')('datadoc.citation.'+chartdata.dataset),200));
                        doc.text(60,120, doc.splitTextToSize($filter('translate')('datadoc.notes.'+chartdata.dataset),200));
                        doc.save(filename + '.pdf');
                    }
                }, function(err){
                    console.log(err);
                });
            }else {
                var pptx = new PptxGenJS();
                pptx.setLayout('LAYOUT_4x3');
                var slide = pptx.addNewSlide();
                slide.addShape(pptx.shapes.RECTANGLE, { x:'2%', y:'2%', w:'96%', h:'96%', line_size:1.5, line: '000000' });
                if(chartdata.charttype == "multiBarHorizontalChart" || chartdata.charttype == "multiBarChart"){
                    addBarChart(pptx, slide, chartdata.longtitle, chartdata);
                } else if (chartdata.charttype == "pieChart"){
                    addPieChart(pptx, slide, chartdata.longtitle, chartdata);
                } else if (chartdata.charttype == "lineChart" || chartdata.charttype == "multiLineChart"){
                    addLineChart(pptx, slide, chartdata.longtitle, chartdata);
                }

                addFooter(pptx, slide, selectedFiltersTxt);
                addNotesSlide(pptx, chartdata.dataset, selectedFiltersTxt);
                pptx.save(filename);
            }
        }


        /**
         * Converts svg to png base64 content
         * @returns {*}
         */
        function getPNGfromSVG(graphDiv) {
            var div = document.getElementById(graphDiv).children[0];
            if (isIE()){
                var deferred = $q.defer();
                var svg = document.getElementById(graphDiv).children[0].outerHTML;
                SearchService.SVGtoPNG(svg).then(function (resp) {
                    var png = resp.data;
                    deferred.resolve(png);
                }).catch(function (err) {
                    deferred.reject("Unable to generate PNG");
                });
                return deferred.promise;
            } else {
                return Plotly.toImage(div, {format: 'png'});
            }
        }

        // Adds a single variable bar chart to a ppt
        function addPieChart(pptx, slide, title, chartdata){
            var dataChartBar = [];
            // Traverse the data in reverse order so that the bars order match in the UI and generate PPT.
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var region = chartdata.data[i];
                var reg = {name: region.name, labels: [], values: region.x};
                dataChartBar.push(reg);
            }
            slide.addChart( pptx.charts.BAR,dataChartBar, { x:.2, y:.2, w:'95%', h:'85%',
                showLegend: true, legendPos: 't',
                showLabel: false,
                showTitle: true, title: title, titleFontSize: 20,
                barGrouping:'clustered',
                showValue: false,dataLabelFontSize:8,dataLabelPosition: 'outEnd',
                chartColors: chartUtilService.getColorPallete().map(function (color) {
                    return color.substr(1); // strip off the leading #
                }),
                barDir: 'bar'
            } );
        }

        // Adds a line chart to a ppt
        function addLineChart(pptx, slide, title, chartdata){
            var dataLines = [];
            var data = chartdata.data;
            for (var i = data.length - 1 ; i >=0 ; i-- ){
                var line = {name: data[i].name, labels: [], values: []}
                dataLines.push(line);
                for (var j = 0;  j < data[i].x.length ; j++){
                    line.labels.push(data[i].x[j]);
                    line.values.push(data[i].y[j]);
                }
            }

            slide.addChart( pptx.charts.LINE, dataLines, { x:.2, y:.2, w:'95%', h:'85%',
                showLegend: true, legendPos: 't',
                showLabel: false,
                showTitle: true, title: title, titleFontSize: 20,
                showValue: true,dataLabelFontSize:8, dataLabelPosition: 't',
                chartColors: chartUtilService.getColorPallete().map(function (color) {
                    return color.substr(1); // strip off the leading #
                }),
            } );
        }

        // Adds a bar chart to a ppt
        function addBarChart(pptx, slide, title, chartdata){
            var dataChartBar = [];
            // Traverse the data in reverse order so that the bars order match in the UI and generate PPT.
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var region = chartdata.data[i];
                if (chartdata.charttype == 'multiBarHorizontalChart'){
                        var reg = {name: region.name, labels: region.y, values: region.x};
                }else{
                        var reg = {name: region.name, labels: region.x, values: region.y};
                }
                dataChartBar.push(reg);
            }
            slide.addChart( pptx.charts.BAR,dataChartBar, { x:.2, y:.2, w:'95%', h:'85%',
                showLegend: true, legendPos: 't',
                showLabel: true,
                showTitle: true, title: title, titleFontSize: 20,
                barGrouping:chartdata.layout.barmode === 'stack'?'stacked':'clustered',
                showValue: false,dataLabelFontSize:8,dataLabelPosition: 'outEnd',
                chartColors: chartUtilService.getColorPallete().map(function (color) {
                    return color.substr(1); // strip off the leading #
                }),
                barDir: chartdata.charttype == "multiBarHorizontalChart"?'bar':'col'
            } );
        }

        function addFooter(pptx, slide, selectedFiltersTxt ){
            slide.addShape(pptx.shapes.LINE, { x:'2%', y:'92%', w:'96%', h:0, line:'000000', line_size:1.5 });
            slide.addText('This graph is downloaded from Health Information Gateway(HIG) using the query parameters: '+ selectedFiltersTxt, {x:'2%', y:'93%', w:'95%', font_size: 9});
        }

        function addNotesSlide(pptx, dataset, selectedFiltersTxt){
            var slide = pptx.addNewSlide();
            slide.addShape(pptx.shapes.RECTANGLE, { x:'2%', y:'2%', w:'96%', h:'96%', line_size:1.5, line: '000000'});
            slide.addText('Notes: ', {x:'4%', y:'5%', w:'20%', font_size: 18, bold: true, underline:true});
            slide.addText('Datasource: ', {x:'5%', y:'10%', w:'20%', font_size: 12});
            slide.addText($filter('translate')('datadoc.datasource.'+dataset), {x:'20%', y:'10%', w:'75%', h:'15%', font_size: 11, valign: 'top', autoFit: true});
            slide.addText('Query parameters: ', {x:'5%', y:'34%', w:'20%', font_size: 12});
            slide.addText(selectedFiltersTxt,{x:'20%', y:'34%', w:'75%', font_size: 11, valign: 'top', autoFit: true})
            slide.addText('Generated at:',{x:'5%', y:'42%', w:'20%', font_size: 12})
            slide.addText($filter('date')(new Date(),'short'), {x:'20%', y:'42%', w:'75%', font_size: 11, valign: 'top', autoFit: true});
            slide.addText('Suggested citation: ', {x:'5%', y:'46%', w:'20%', font_size: 12});
            slide.addText($filter('translate')('datadoc.citation.'+dataset), {x:'20%', y:'46%', w:'75%', h:'10%', font_size: 11, valign: 'top', autoFit: true});
            slide.addText('Notes: ', {x:'5%', y:'50%', w:'20%', font_size: 12});
            slide.addText($filter('translate')('datadoc.notes.'+dataset), {x:'20%', y:'50%', w:'75%', h:'45%', font_size: 10, valign: 'top', autoFit: true});
            addFooter(pptx, slide, selectedFiltersTxt);
        }

        // Check if the client browser is IE
        function isIE(){
            var ms_ie = false;
            var ua = $window.navigator.userAgent;
            var old_ie = ua.indexOf('MSIE ');
            var new_ie = ua.indexOf('Trident/');

            if ((old_ie > -1) || (new_ie > -1)) {
                ms_ie = true;
            }
            return ms_ie;
        }

        // Paint the imagedata on canvas to regenrate the image data url
        // For some reason the image data url returned from the backend doesn't work on IE
        function getImageCanvasForIE(imgData){
            var deferred = $q.defer();
            var image = new Image();
            image.src = imgData;
            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext('2d').drawImage(image, 0, 0);
                deferred.resolve(canvas);
            };

            return deferred.promise;
        }
    }
}());
