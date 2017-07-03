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


        function exportChart(chart, title) {
            getBase64ForSvg(chart).then(function(response){
                    var link = document.createElement("a");
                    var now = new Date();
                    link.download = title+'_'+ $filter('date')(now,'yyyyMMdd-hhmmss')+'.png';
                    link.href = response.replace("image/png", "image/octet-stream");
                    document.body.appendChild(link);
                    link.click();
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

            var image = new Image;
            image.src = imgSrc;
            var deferred = $q.defer();
            image.onload = function() {
                canvas.width = (image.width + 100);
                canvas.height = image.height;
                var context = canvas.getContext("2d");
                context.drawImage(image, 0, 0);
                var canvasdata = canvas.toDataURL("image/png");
                deferred.resolve(canvasdata);
            };
            return deferred.promise;
        }
    }
}());
