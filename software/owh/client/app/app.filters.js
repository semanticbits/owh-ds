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
        });
}());
