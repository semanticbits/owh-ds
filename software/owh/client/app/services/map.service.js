(function(){
    'use strict';
    angular
        .module('owh')
        .service('mapService', mapService);

    mapService.$inject = ['$rootScope', '$timeout', 'utilService', 'leafletData',
        '$translate', '$filter', '$templateCache', '$compile'];

    //service to provide utilities for leaflet geographical map
    function mapService($rootScope, $timeout, utilService, leafletData,
                        $translate, $filter, $templateCache, $compile) {
        var service = {
            updateStatesDeaths: updateStatesDeaths,
            getMapTitle: getMapTitle,
            addScaleControl: addScaleControl,
            highlightFeature: highlightFeature,
            resetHighlight: resetHighlight,
            setInitialView: setInitialView,
            getTotalLabel: getTotalLabel,
            attachEventsForMap: attachEventsForMap
        };

        //builds marker popup.
        var mapPopup = L.popup({autoPan:false, closeButton:false});
        var currentFeature = {};

        return service;

        /*
         Update mapData
         */
        function updateStatesDeaths(primaryFilter, data, totalCount, mapOptions) {
            var years = getSelectedYears(primaryFilter);
            //update states info with trials data
            var stateDeathTotals = [];
            angular.forEach($rootScope.states.features, function(feature) {
                var state;
                //in yrbs Arizona has different fips code
                if(primaryFilter.key === 'mental_health' && feature.properties.abbreviation === 'AZ') {
                    state = utilService.findByKeyAndValue(data.states, 'name', 'AZB');
                } else {
                    state = utilService.findByKeyAndValue(data.states, 'name', feature.properties.abbreviation);
                }
                if (utilService.isValueNotEmpty(state)){
                    feature.properties.sex = state.sex;
                    if(primaryFilter.tableView === 'crude_death_rates' || primaryFilter.tableView === 'crude_cancer_incidence_rates' || primaryFilter.tableView === 'crude_cancer_death_rates') {
                        //calculate male and female rate
                        angular.forEach(feature.properties.sex, function(eachGender){
                            eachGender['rate'] = eachGender[primaryFilter.key] < 20 ? 'Unreliable' : $filter('number')(eachGender[primaryFilter.key]/eachGender['pop'] * 1000000 / 10, 1);
                        });
                        var crudeDeathRate = isNaN(state[primaryFilter.key]) ? state[primaryFilter.key] : Math.round(state[primaryFilter.key]/state['pop'] * 1000000) / 10 ;
                        feature.properties.rate = crudeDeathRate;
                        stateDeathTotals.push(crudeDeathRate);
                    }
                    else if(primaryFilter.tableView === 'age-adjusted_death_rates') {
                        //calculate male and female rate
                        angular.forEach(feature.properties.sex, function(eachGender){
                            eachGender['rate'] = eachGender['ageAdjustedRate'];
                        });
                        feature.properties.rate = state['ageAdjustedRate'];
                        stateDeathTotals.push(state['ageAdjustedRate']);
                    }
                    else if (primaryFilter.showRates) {
                        if(primaryFilter.tableView === 'number_of_infant_deaths') {
                            var suppressTotal = false;
                            angular.forEach(feature.properties.sex, function(eachGender){
                                if(eachGender[primaryFilter.key] < 20 || eachGender['deathRate'].indexOf('Unreliable') > 0) {
                                    eachGender['rate'] = 'Unreliable';
                                }
                                else if(eachGender['deathRate'] === 'suppressed') {
                                    suppressTotal = true;
                                    eachGender['rate'] = eachGender['deathRate'];
                                }
                                else if(eachGender['deathRate'] === 'na') {
                                    eachGender['rate'] = eachGender['deathRate'];
                                }
                                else {
                                    eachGender['rate'] = $filter('number')(eachGender['deathRate'],1);
                                }
                            });
                            //For Total
                            if(suppressTotal || state['deathRate'] === 'suppressed') {
                                feature.properties.rate = 'suppressed';
                                stateDeathTotals.push('suppressed');
                            }
                            else if(state['deathRate'] === 'na') {
                                feature.properties.rate = state['deathRate'];
                                stateDeathTotals.push(state['deathRate']);
                            }
                            else {
                                feature.properties.rate = $filter('number')(state['deathRate'], 1);
                                stateDeathTotals.push($filter('number')(state['deathRate'], 1));
                            }

                        }
                        else {
                            //calculate male and female rate
                            angular.forEach(feature.properties.sex, function (eachGender) {
                                eachGender['rate'] = $filter('number')(Math.round((eachGender[primaryFilter.key]) / eachGender['pop'] * 1000000) / 10, 1);
                            });

                            var rate = Math.round(feature.properties.sex[0][primaryFilter.key] / feature.properties.sex[0]['pop'] * 1000000) / 10;
                            feature.properties.rate = rate;
                            stateDeathTotals.push(rate);
                        }
                    } else if(['std', 'tb', 'aids'].indexOf(primaryFilter.key) != -1) {
                        //for disease datasets, use both sexes to decide intervals
                        stateDeathTotals.push(state.sex[0][primaryFilter.key]);
                    } else if(primaryFilter.key === 'mental_health' ) {
                        var res = utilService.findByKeyAndValue(state.responses, 'rKey', data.selectedResponse);
                        if (angular.isDefined(res)) {
                            feature.properties.response = res;
                            stateDeathTotals.push(res.rData.mean);
                        } else {
                            feature.properties.response = "NA";
                            stateDeathTotals.push('NA');
                        }
                        feature.properties.isDisabled = false;
                    } else {
                        stateDeathTotals.push(state[primaryFilter.key]);
                    }
                    feature.properties.showRates = primaryFilter.showRates;
                    feature.properties[primaryFilter.key] =  state[primaryFilter.key];
                } else {
                    feature.properties.isDisabled = true;
                    feature.properties.sex = undefined;
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
            var yearFilter = utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', 'current_year') || utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', 'year') || utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', 'year_of_death');
            if (yearFilter) {
                return utilService.isValueNotEmpty(yearFilter.value) ? yearFilter.value : 'All';
            }
        }

        //generate labels for map legend labels
        function getLabels(minValue, maxValue) {
            return utilService.generateMapLegendLabels(minValue, maxValue);
        }

        //get map feature colors
        function getColor(d, ranges) {

            if (d == -1) {
                return '#D3D3D3';
            }
            return d >= ranges[6] ? '#aa7ed4' :
                   d >= ranges[5] ? '#5569de' :
                   d >= ranges[4] ? '#6f9af1' :
                   d >= ranges[3] ? '#8bd480' :
                   d >= ranges[2] ? '#ea8484' :
                   d >= ranges[1] ? '#f3af60' : '#fff280';
        }

        //return map feature styling configuration parameters
        function getStyleFunction(primaryFilter) {
            var ranges = utilService.generateMapLegendRanges(primaryFilter.mapData.mapMinValue,
                primaryFilter.mapData.mapMaxValue);
            return function style(feature) {
                var total = getTotal(primaryFilter, feature);
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


        function getTotal(primaryFilter, feature) {
            if(primaryFilter.tableView === 'crude_death_rates'
                || primaryFilter.tableView === 'age-adjusted_death_rates'
                || primaryFilter.tableView === 'crude_cancer_incidence_rates'
                || primaryFilter.tableView === 'crude_cancer_death_rates'
                || primaryFilter.showRates) {
                return feature.properties.rate;
            } else if (primaryFilter.key  === 'mental_health') {
                if (feature.properties.isDisabled) {
                    return -1;
                }
                if (feature.properties.response.rData) {
                    return feature.properties.response.rData.mean;
                } else {
                    return feature.properties.response;
                }
            } else if (['tb', 'std', 'aids'].indexOf(primaryFilter.key) != -1) {
                return feature.properties.sex[0][primaryFilter.key];
            } else {
                return feature.properties[primaryFilter.key];
            }
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
                    map.customControl = this;
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
            }
            else if(primaryFilter.key === 'aids' || primaryFilter.key === 'std') {
                //To get selected disease title and show as map title
                var diseaseFilter =  utilService.findByKeyAndValue(primaryFilter.allFilters, 'key', 'disease');
                var indicatorName = utilService.findByKeyAndValue(diseaseFilter.autoCompleteOptions, 'key', diseaseFilter.value).title;
                measure= $translate.instant('chart.title.measure.'+(primaryFilter.tableView?primaryFilter.tableView:primaryFilter.key)+'.'+ indicatorName.split(' ').join('') + (primaryFilter.chartView?('.'+primaryFilter.chartView):''));
            }
            else{
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
                std:'Total', tb:'Total', aids:'Total', number_of_infant_deaths: 'Total'
            };
            return totalLableMap[key];
        }

        /**
         * To attach required events to map and add scale control
         * @param map
         */
        function attachEventsForMap(map, primaryFilter) {
            map.invalidateSize();
            map.eachLayer(function (layer){
                if(layer.feature) {
                    layer.off("mouseover");
                    layer.off("mouseout");
                    layer.on("mouseover", function (event) {
                        var isStatData = ['mental_health', 'prams', 'brfss'].indexOf(primaryFilter.key) != -1;
                        if(primaryFilter && event.target.feature) {
                            buildMarkerPopup(event.latlng.lat, event.latlng.lng, event.target.feature.properties,
                                event.target._map, primaryFilter.key, event.containerPoint, isStatData);
                            if(!L.Browser.ie) {
                                highlightFeature(event.target._map._layers[event.target._leaflet_id]);
                            }
                        }
                        angular.element('#minimizedMap').addClass('unset-position');
                    });
                    layer.on("mouseout", function (event) {
                        mapPopup._close();
                        if(!L.Browser.ie) {
                            resetHighlight(event);
                        }
                        angular.element('#minimizedMap').removeClass('unset-position');
                    });
                }
            });

            map.whenReady(function (event) {
                if(primaryFilter && !map.customControl) {
                    var mapScaleControl = addScaleControl(primaryFilter.mapData);
                    event.addControl(new mapScaleControl());
                }
            });
        }

        function buildMarkerPopup(lat, lng, properties, map, key, markerPosition, isStatDta) {
            if(currentFeature.properties !== properties || !mapPopup._isOpen) {
                var childScope = $rootScope.$new();
                childScope.lat = lat;
                childScope.lng = lng;
                childScope.properties = properties;
                childScope.key = key;
                childScope.isStatDta = isStatDta;
                childScope.totalLabel = getTotalLabel(properties.tableView);
                var ele = angular.element('<div></div>');
                ele.html($templateCache.get('app/partials/marker-template.html'));
                var compileEle = $compile(ele.contents())(childScope);
                $timeout(function () {
                    mapPopup
                        .setContent(compileEle[0])
                        .setLatLng(L.latLng(lat, lng)).openOn(map);
                }, 1);
            } else {
                mapPopup
                    .setLatLng(L.latLng(lat, lng));
            }

            var rotatePopup = function () {
                map.on("popupopen", function (evt, args) {

                    var popup = evt.popup;

                    var popupHeight = angular.element('#chart_us_map').find('.leaflet-popup-content').height()
                        || angular.element('#expanded_us_map').find('.leaflet-popup-content').height();

                    //keep track of old position of popup
                    if(!popup.options.oldOffset) {
                        popup.options.oldOffset = popup.options.offset;
                    }

                    if(markerPosition.y < 180) {
                        //change position if popup does not fit into map-container
                        popup.options.offset = new L.Point(10, popupHeight + 50);
                        angular.element('#chart_us_map').addClass('reverse-popup');
                        angular.element('#expanded_us_map').addClass('reverse-popup');
                    } else {
                        //revert position
                        popup.options.offset = popup.options.oldOffset;
                        angular.element('#chart_us_map').removeClass('reverse-popup');
                        angular.element('#expanded_us_map').removeClass('reverse-popup');
                    }
                });
                //on popupclose reset pop up position
                map.on("popupclose", function (evt, args) {
                    $('#chart_us_map').removeClass('reverse-popup');
                    $('#expanded_us_map').removeClass('reverse-popup');
                })
            };
            rotatePopup();
        }
    }
}());
