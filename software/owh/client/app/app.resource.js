//TODO change to api.service.js and move to app/services
(function(){
  'use strict';

  angular
      .module('owh')
      .factory('API', api);

  api.$inject = ['$resource', '$rootScope'];

  //API for data calls
  function api ($resource, $rootScope) {
    return $resource('/', getParamDefaults(), getActions($rootScope));
  }

  //default parameters will go here..
  var getParamDefaults = function() {
    return {
      id:'@id'
    };
  };

  //default actions and methods will go here..
  var getActions = function() {
    return {
      'search' : {
        method : 'POST',
        url: '/search'
      },
      'upload' : {
        method : 'POST',
        url: '/fb/upload'
      },
      'fetch' : {
        method : 'GET',
        url: '/fb/'
      },
      'generateHashCode' : {
        method : 'POST',
        url: '/generateHashCode'
      },
      'getFBAppID' : {
        method : 'GET',
        url: '/getFBAppID'
      },
      'getYRBSQuestionsTree' : {
        method : 'GET',
        url: '/yrbsQuestionsTree/:years'
      },
      'getPRAMSQuestionsTree': {
          method: 'GET',
          url: '/pramsQuestionsTree'
      },
      'getDsMetadata' : {
        method : 'GET',
        url: '/dsmetadata/:dataset'
      }
    }
  }
}());
