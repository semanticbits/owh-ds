(function(){
    'use strict';
    angular
        .module('owh.filters', [])
        .filter('ToUpperCase', function() {
            return function(input) {
                input = input || '';
                return input.toUpperCase();
            };
        })
        .filter('ToLowerCase', function() {
            return function(input) {
                input = input || '';
                return input.toLowerCase();
            };
        })
        .filter('GenderTitle', function() {
            return function(input) {
                input = input || '';
                if(input === 'Female') return 'Female';
                if(input === 'Male') return 'Male';
                return input;
            };
        })
        .filter('isArray', function() {
            return function (input) {
                return angular.isArray(input);
            };
        }).filter('capitalize', function() {
            return function(input, all) {
                input = input || '';
                var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
                return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
            }
        });
}());
