(function(){
  'use strict';

  angular.module('owh', [
    'ui.router',
    'ngAria',
    'ngResource',
    'ngSanitize',
    'pascalprecht.translate',
    'ui-leaflet',
    'dateParser',
    'ui.select',
    'nvd3',
    'ngJsTree',
    'checklist-model',
    'angularAwesomeSlider',
    'angularModalService',
    'owh.filters',
    'owh.services',
    'owh.home',
    'owh.search',
    'owh.description',
    'owh.fact-sheet'
  ]);
}());
