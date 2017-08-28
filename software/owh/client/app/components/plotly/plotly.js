(function() {
    'use strict';
    angular
        .module('owh')
        .component('plotly',
            {
                controller: PlotlyController,
                controllerAs: 'plotly',
                templateUrl: 'app/components/plotly/plotly.html',
                bindings: {
                    barmode: '<',
                    plotlyData: '<',
                    plotlyLayout: '<',
                    plotlyOptions: '<'
                }
            });

    PlotlyController.$inject = ['$scope','$element'];

    function PlotlyController($scope, $element){
        var plotly = this;
        var graph = $element[0].children[0];
        var options ={
                displayModeBar: false,
                transition: {
                    duration: 500,
                    easing: 'cubic-in-out'
                }
            };

        plotly.$onChanges = function () {
            if(plotly.barmode){
                plotly.plotlyLayout.barmode = plotly.barmode;
                Plotly.redraw(graph);
            }
        };

        Plotly.newPlot(graph, plotly.plotlyData, plotly.plotlyLayout, options);

        // For showing tooltip
        graph.on('plotly_hover', function(data){
            var hi = {};
            if(data.points[0].data.type==='bar' && data.points[0].data.orientation === 'h'){
                hi.name = data.points[0].yaxis.title+": "+data.points[0].y;
                hi.points = [];
                data.points.forEach(function (p) {
                    hi.points.push({name:p.data.name, value:p.x.toLocaleString(), color:p.data.marker.color});
                });
            }else { //line or vertical bar
                hi.name = data.points[0].xaxis.title+": "+data.points[0].x;
                hi.points = [];
                data.points.forEach(function (p) {
                    hi.points.push({name:p.data.name, value:p.y.toLocaleString(), color:p.data.marker.color});
                });
            }
            hi.points.sort(function(a, b) {
                if (a.name < b.name) {
                    return -1;
                } else {
                    return 1;
                }
            });
            hi.left = data.event.layerX +'px';
            hi.top = (data.event.layerY) +'px';

            plotly.hoverinfo = hi;
            $scope.$apply();
         }).on('plotly_unhover', function(data){
            plotly.hoverinfo = null;

            $scope.$apply();
        });
    }
       
}());
