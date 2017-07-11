(function(){
    'use strict';
    angular
        .module('owh')
        .service('mapService', mapService);

    mapService.$inject = ['$rootScope', '$timeout', 'utilService', 'leafletData', 'shareUtilService', '$translate'];

    //service to provide utilities for leaflet geographical map
    function mapService($rootScope, $timeout, utilService, leafletData, shareUtilService, $translate) {
        var service = {
            updateStatesDeaths: updateStatesDeaths,
            addExpandControl: addExpandControl,
            addShareControl: addShareControl,
            addScaleControl: addScaleControl,
            highlightFeature: highlightFeature,
            resetHighlight: resetHighlight,
            setInitialView: setInitialView
        };
        return service;

        /*
         Update mapData
         */
        function updateStatesDeaths(primaryFilter, data, totalCount, mapOptions) {
            var years = getSelectedYears(primaryFilter);
            //update states info with trials data
            var stateDeathTotals = [];
            angular.forEach($rootScope.states.features, function(feature){
                var state = utilService.findByKeyAndValue(data.states, 'name', feature.properties.abbreviation);
                if (utilService.isValueNotEmpty(state)){
                    stateDeathTotals.push(state[primaryFilter.key]);
                    feature.properties.years = angular.isArray(years)? years.join(', ') : years;
                    feature.properties.totalCount = state['deaths']; /*+ (Math.floor((Math.random()*10)+1))*100000;*/
                    feature.properties.sex = state.sex;
                    feature.properties[primaryFilter.key] =  state[primaryFilter.key];
                }
            });
            var minMaxValueObj = utilService.getMinAndMaxValue(stateDeathTotals);
            angular.extend(primaryFilter.mapData, {
                mapMaxValue : minMaxValueObj.maxValue,
                mapMinValue : minMaxValueObj.minValue
            });
            angular.extend(primaryFilter.mapData, {
                geojson: {
                    data: $rootScope.states,
                    style: getStyleFunction(primaryFilter)
                },
                mapTotalCount: totalCount
            });
        }

        function getSelectedYears(primaryFilter) {
            var yearFilter = utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', 'current_year') || utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', 'year');
            if (yearFilter) {
                return utilService.isValueNotEmpty(yearFilter.value) ? yearFilter.value : utilService.getValuesByKey(yearFilter.autoCompleteOptions, 'title');
            }
        }

        //generate labels for map legend labels
        function getLabels(minValue, maxValue) {
            return utilService.generateMapLegendLabels(minValue, maxValue);
        }

        //get map feature colors
        function getColor(d, ranges) {
            // var ranges = utilService.generateMapLegendRanges(sc.filters.selectedPrimaryFilter.mapData.mapMinValue,
            //     sc.filters.selectedPrimaryFilter.mapData.mapMaxValue);
            return d > ranges[6] ? '#190032' :
                d > ranges[5]  ?  '#3f007d':
                d > ranges[4]  ?  '#6a51a3':
                d > ranges[3]  ?  '#9e9ac8':
                d > ranges[2]  ?  '#dadaeb':
                d > ranges[1]  ?  '#efedf5': '#fcfbfd';
        }

        //return map feature styling configuration parameters
        function getStyleFunction(primaryFilter) {
            var ranges = utilService.generateMapLegendRanges(primaryFilter.mapData.mapMinValue,
                primaryFilter.mapData.mapMaxValue);
            return function style(feature) {
                var total = feature.properties[primaryFilter.key];
                return {
                    fillColor: getColor(total, ranges),
                    weight: 0.8,
                    opacity: 1,
                    color: 'black',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            }
        }

        function addExpandControl(mapOptions, primaryFilter) {
            return L.Control.extend({
                options: {
                    position: 'topright'
                },
                onAdd: function (map) {
                    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom fa fa-expand fa-2x purple-icon');
                    container.onclick = function (event) {
                        if (mapOptions.selectedMapSize === "small") {
                            mapOptions.selectedMapSize = "big";
                            resizeUSAMap(true, primaryFilter);
                            angular.element(container).removeClass('fa-expand');
                            angular.element(container).addClass('fa-compress');
                        } else if (mapOptions.selectedMapSize === "big") {
                            mapOptions.selectedMapSize = "small";
                            resizeUSAMap(false, primaryFilter);
                            angular.element(container).removeClass('fa-compress');
                            angular.element(container).addClass('fa-expand');
                        }
                    };
                    return container;
                }
            });
        }

        function resizeUSAMap(isZoomIn, primaryFilter) {
            leafletData.getMap().then(function(map) {
                if(isZoomIn) {
                    angular.element('div.custom-legend').show();
                    map.zoomIn();
                } else {
                    map.zoomOut();
                    angular.element('div.custom-legend').hide();
                }
                $timeout(function(){ map.invalidateSize()}, 1000);
            });

        }

        function addShareControl() {
            return L.Control.extend({
                options: {
                    position: 'topright'
                },
                onAdd: function (map) {
                    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom fa fa-share-alt fa-2x purple-icon');
                    container.title = $translate.instant('label.share.on.fb');
                    container.onclick = function (event) {
                        angular.element(document.getElementById('spindiv')).removeClass('ng-hide');
                        leafletData.getMap().then(function (map) {
                            leafletImage(map, function (err, canvas) {
                                // sc.showFbDialog('chart_us_map', 'OWH - Map', canvas.toDataURL());
                                shareUtilService.shareOnFb('chart_us_map', 'OWH - Map', undefined, undefined, canvas.toDataURL());
                            });
                        });

                    };
                    return container;
                }
            });
        }

        /**
         * Add horizontal Legend
         * @param mapData
         */
        function addScaleControl(mapData) {
            return L.Control.extend({
                options: {
                    position: 'bottomleft'
                },
                onAdd: function (map) {
                    var container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom custom-legend');

                    var colors = ['#190032','#3f007d','#6a51a3', '#9e9ac8','#dadaeb','#efedf5','#fcfbfd'];
                    var labels = getLabels(mapData.mapMinValue, mapData.mapMaxValue);
                    var legendScale = L.DomUtil.create('ul', 'legend-scale', container);
                    var polygons = [];
                    colors.forEach(function(color, index) {
                        var li = L.DomUtil.create('li', '', legendScale);
                        var span = L.DomUtil.create('span', '', li);
                        span.style.background = color;
                        angular.element(li).append(labels[index]);

                        L.DomEvent.on(span, 'mouseover', function(event) {
                            var target = event.target;
                            var color = target.style.background;
                            polygons = getMapPolygonsByColor(map, color);
                            highlightPolygons(polygons);
                        });

                        L.DomEvent.on(span, 'mouseout', function(event) {
                            resetHighlightedPolygons(polygons);
                        });
                    });
                    return container;
                }
            });
        }
        
        function getMapPolygonsByColor(map, color) {
            var polygonList = [];
            //convert background color from rgb to hex
            var ctx = document.createElement('canvas').getContext('2d');
            ctx.strokeStyle = color;
            var hexColor = ctx.strokeStyle;
            //list out matching colored polygons
            angular.forEach(map._layers, function (polygon) {
                if (polygon.options && polygon.options.fillColor == hexColor) {
                    polygonList.push(polygon);
                }
            });
            return polygonList;
        }

        function highlightPolygons(polygons) {
            angular.forEach(polygons, function (polygon) {
                highlightFeature(polygon);
            });
        }

        function resetHighlightedPolygons(polygons) {
            angular.forEach(polygons, function (polygon) {
                polygon.setStyle({weight: 0.8, opacity: 1, color: 'black', fillOpacity: 0.7});
            });
        }

        /**
         * Set feature style
         */
        function highlightFeature(feature) {
            feature.setStyle({'color': '#333333', 'weight': 2.6, 'opacity': 1, fillOpacity: 0.9});
        }

        /**
         * Reset the feature style
         * @param mapObj
         */
        function resetHighlight(mapObj) {
            var layer = mapObj.layer;
            if(layer) {
                var map = mapObj.target._map;
                map._layers[layer._leaflet_id].setStyle({weight: 0.8,opacity: 1,color: 'black', fillOpacity: 0.7});
            } else {
                if(mapObj.leafletEvent) {
                    layer = mapObj.leafletEvent.target;
                    var map = layer._map;
                    map._layers[layer._leaflet_id].setStyle({weight: 0.8,opacity: 1,color: 'black', fillOpacity: 0.7});
                }
            }
        }

        function setInitialView () {
            leafletData.getMap().then(function (map) {
               map.setView(new L.LatLng(38, 14), 3);
                $timeout(function(){ map.invalidateSize()}, 100);
            });
        }
    }
}());
