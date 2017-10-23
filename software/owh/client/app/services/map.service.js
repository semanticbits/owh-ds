(function(){
    'use strict';
    angular
        .module('owh')
        .service('mapService', mapService);

    mapService.$inject = ['$rootScope', '$timeout', 'utilService', 'leafletData', 'shareUtilService', '$translate', '$filter'];

    //service to provide utilities for leaflet geographical map
    function mapService($rootScope, $timeout, utilService, leafletData, shareUtilService, $translate, $filter) {
        var service = {
            updateStatesDeaths: updateStatesDeaths,
            getMapTitle: getMapTitle,
            addScaleControl: addScaleControl,
            highlightFeature: highlightFeature,
            resetHighlight: resetHighlight,
            setInitialView: setInitialView,
            getTotalLabel: getTotalLabel
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
                    feature.properties.sex = state.sex;
                    if(primaryFilter.tableView === 'crude_death_rates' || primaryFilter.tableView === 'crude_cancer_incidence_rates' || primaryFilter.tableView === 'crude_cancer_death_rates') {
                        //calculate male and female rate
                        angular.forEach(feature.properties.sex, function(eachGender){
                            eachGender['rate'] = $filter('number')(eachGender[primaryFilter.key]/eachGender['pop'] * 1000000 / 10, 1);
                        });
                        var crudeDeathRate = Math.round(state[primaryFilter.key]/state['pop'] * 1000000) / 10 ;
                        feature.properties.rate = isNaN(crudeDeathRate) ? 'n/a' : crudeDeathRate;
                        stateDeathTotals.push(crudeDeathRate);
                    }
                    else if(primaryFilter.tableView === 'age-adjusted_death_rates') {
                        //calculate male and female rate
                        angular.forEach(feature.properties.sex, function(eachGender){
                            eachGender['rate'] = eachGender['ageAdjustedRate'];
                        });
                        feature.properties.rate = state['ageAdjustedRate'];
                        stateDeathTotals.push(state['ageAdjustedRate']);
                    } else if (primaryFilter.showRates) {
                        //calculate male and female rate
                        angular.forEach(feature.properties.sex, function(eachGender){
                            eachGender['rate'] = $filter('number')(Math.round((eachGender[primaryFilter.key]) / eachGender['pop'] * 1000000) / 10, 1);
                        });

                        var rate = $filter('number')(Math.round(feature.properties.sex[0][primaryFilter.key] / feature.properties.sex[0]['pop'] * 1000000) / 10, 1);
                        feature.properties.rate = rate;
                        stateDeathTotals.push(rate);
                    } else {
                        stateDeathTotals.push(state[primaryFilter.key]);
                    }
                    feature.properties.showRates = primaryFilter.showRates;
                    feature.properties[primaryFilter.key] =  state[primaryFilter.key];
                }
                feature.properties.tableView = primaryFilter.tableView;
                feature.properties.years = angular.isArray(years)? years.join(', ') : years;
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
            return d > ranges[6] ? '#aa7ed4' :
                   d > ranges[5] ? '#5569de' :
                   d > ranges[4] ? '#6f9af1' :
                   d > ranges[3] ? '#8bd480' :
                   d > ranges[2] ? '#ea8484' :
                   d > ranges[1] ? '#f3af60' : '#fff280';
        }

        //return map feature styling configuration parameters
        function getStyleFunction(primaryFilter) {
            var ranges = utilService.generateMapLegendRanges(primaryFilter.mapData.mapMinValue,
                primaryFilter.mapData.mapMaxValue);
            return function style(feature) {
                var total = primaryFilter.tableView === 'crude_death_rates' ||
                            primaryFilter.tableView === 'age-adjusted_death_rates' ||
                            primaryFilter.tableView === 'crude_cancer_incidence_rates' ||
                            primaryFilter.tableView === 'crude_cancer_death_rates' ||
                            primaryFilter.showRates ? feature.properties.rate : feature.properties[primaryFilter.key];
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

                    var colors = ['#aa7ed4', '#5569de','#6f9af1','#8bd480','#ea8484','#f3af60','#fff280'];
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
        function resetHighlight(event) {
            if(event) {
                    var map = event.target._map;
                    map._layers[event.target._leaflet_id].setStyle({weight: 0.8,opacity: 1,color: 'black', fillOpacity: 0.7});
            }
        }

        function setInitialView () {
            leafletData.getMap().then(function (map) {
               map.setView(new L.LatLng(38, 14), 3);
                $timeout(function(){ map.invalidateSize()}, 100);
            });
        }

        function getMapTitle(primaryFilter){
            var measure;
            if(primaryFilter.key == 'mental_health' || primaryFilter.key == 'prams' ||primaryFilter.key == 'brfss'){ //Dont use tableView for stats datasets, as tableView captures topics and not views
                measure = $translate.instant('chart.title.measure.'+primaryFilter.key);
            }else{
                measure= $translate.instant('chart.title.measure.'+(primaryFilter.tableView?primaryFilter.tableView:primaryFilter.key) + (primaryFilter.chartView?('.'+primaryFilter.chartView):''));
            }

            var yearfilter;
            angular.forEach(primaryFilter.allFilters, function(filter){
            if (filter.key === 'year' || filter.key === 'current_year' || filter.key === 'year_of_death'){
                    if(!filter.value || (Array.isArray(filter.value) && filter.value.length != 1)){
                        yearfilter = 'selected years';
                    }else {
                        yearfilter = Array.isArray(filter.value)?filter.value[0]:filter.value;
                    }
                }
            });

            return measure+ ' by Sex' +' for '+yearfilter;
        }

        function getTotalLabel(key) {

            var totalLableMap = {
                number_of_deaths:'Total Deaths', crude_death_rates:'Total',
                'age-adjusted_death_rates':'Total', bridge_race:'Total',
                cancer_incident:'Total', crude_cancer_incidence_rates:'Total',
                cancer_mortality:'Total', crude_cancer_death_rates: 'Total',
                std:'Total', tb:'Total', aids:'Total'
            };
            return totalLableMap[key];
        }
    }
}());
