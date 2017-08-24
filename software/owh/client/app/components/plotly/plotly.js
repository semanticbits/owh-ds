(function() {
    'use strict';
    angular
        .module('owh')
        .component('plotly',
            {
                controller: PlotlyController,
                controllerAs: 'plotly',
                template: "<div></div>",
                bindings: {
                    barmode: '<',
                    plotlyData: '<',
                    plotlyLayout: '<',
                    plotlyOptions: '<'
                }
            });

    PlotlyController.$inject = ['$element'];

    function PlotlyController($element){
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
    }
       
}());
