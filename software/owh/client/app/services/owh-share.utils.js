(function(){
    'use strict';
    angular
        .module('owh.services')
        .service('shareUtilService', shareUtilService);

    shareUtilService.$inject = ['SearchService', '$q', '$filter'];

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
        function exportChart(chart, title, format) {
            getBase64ForSvg(chart).then(function(response){
                var filename =  title + '_' + $filter('date')(new Date(), 'yyyyMMdd-hhmmss');
                if(format == 'PNG') {
                    var link = document.createElement("a");
                    link.download = filename + '.png';
                    link.href = response.replace("image/png", "image/octet-stream");
                    document.body.appendChild(link);
                    link.click();

                }else {
                    var doc = new jsPDF('l');
                    doc.text(30, 25, title);
                    doc.addImage(response, 'PNG', 60, 30);
                    doc.save(filename + '.pdf');
                }
            });
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
                canvas.width = (image.width + 100);
                canvas.height = image.height;
                canvas.getContext("2d").drawImage(image,0,0);
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
    }
}());
