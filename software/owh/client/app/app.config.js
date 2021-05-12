(function(){
    'use strict';

    // Declare app level module which depends on views, and components
    angular
        .module('owh')
        .config(appConfig);
    appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$translateProvider'];

    function appConfig($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider ) {

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        //TODO: move these route definitions inside of their respective modules
        //Routes
        $stateProvider.state('home', {
                url:'/',
                templateUrl: 'app/modules/home/home.html',
                controller: 'HomeController',
                controllerAs: 'hc'
        }).state('search', {
                url:'/search/:queryID',
                templateUrl: 'app/modules/search/search.html',
                controller: 'SearchController',
                controllerAs: 'sc',
                params: {primaryFilterKey: 'deaths', allFilters: null, selectedFilters: null, tableView: 'number_of_deaths', cacheQuery: false, queryID: null}
                onEnter: function () {
                    $('html, body').animate({ scrollTop: -10000 }, 100);
                }
        }).state('description',  {
                url:'/description/:dataSetKey',
                templateUrl: 'app/modules/description/description.html',
                controller: 'DescriptionController',
                params: {dataSetKey: null},
                controllerAs: 'dc'
        }).state('factsheets',  {
                url:'/factsheets/:queryID',
                templateUrl: 'app/modules/factsheet/factsheet.html',
                controller: 'FactSheetController',
                controllerAs: 'fsc',
                params: {state: null, fsType: null, cacheQuery: false, queryID: null}
        }).state('404',  {
                url:'/404',
                templateUrl: '404.html'
        });

        $urlRouterProvider.otherwise('/404');

        // configures staticFilesLoader
        $translateProvider.useStaticFilesLoader({
            prefix: 'app/i18n/messages-',
            suffix: '.json'
        });

        // load 'en' table on startup
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('sanitize');
    }
}());
