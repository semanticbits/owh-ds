'use strict';
(function(){
    angular
    .module('owh')
    .component("owhExportChart",{
        templateUrl: 'app/components/owh-export-chart/export-chart.html',
        controller: ExportChartController,
        controllerAs: 'ec',
        bindings: {
            chart: '<',
            charttitle: '<',
            chartdata: '<',
            selectedfilterstxt: '<'
        }
    });
    ExportChartController.$inject = ['shareUtilService'];
    function ExportChartController(shareUtilService) {
        var ec = this;
        ec.exportChart = function(format) {
            shareUtilService.exportChart(ec.chart, ec.charttitle, format, ec.chartdata[0],ec.selectedfilterstxt);
        };
    }

}());
