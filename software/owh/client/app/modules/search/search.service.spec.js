'use strict';

/*group of common test goes here as describe*/
describe('search service ', function(){
    var searchFactory, utils, $rootScope, $scope, controllerProvider, searchService, deferred, $q,
        primaryFilter, $httpBackend, $templateCache, API,
        searchResponse, groupGenderResponse, genderGroupHeaders, fourGroupsResponse,
        ModalService, givenModalDefaults, elementVisible, thenFunction, closeDeferred, uploadImageDeferred, $timeout;
    module.sharedInjector();

    beforeAll(module('owh'));

    beforeAll(inject(function ($injector, _$rootScope_, $controller, _$q_, _$templateCache_, _SearchService_, _API_, _ModalService_, _$timeout_) {
        controllerProvider = $controller;
        $rootScope  = _$rootScope_;
        $scope = $rootScope.$new();
        $templateCache = _$templateCache_;
        searchFactory = $injector.get('searchFactory');
        utils = $injector.get('utilService');
        $httpBackend = $injector.get('$httpBackend');
        searchService = $injector.get('SearchService');
        ModalService = _ModalService_;
        $timeout = _$timeout_;
        API = _API_;

        $q = _$q_;
        closeDeferred = _$q_.defer();
        uploadImageDeferred = _$q_.defer();
    }));

    describe('test with mortality data', function () {
        var thenFn, failFn;
        beforeEach(function() {
            deferred = $q.defer();
        });

        it('search results', function () {
            var responseFn = {
                $promise: {
                    then:function(func) {
                        thenFn = func;
                        return {
                            catch:function(failFc) {
                                failFn = failFc;
                            }
                        }
                    }
                }
            };
            spyOn(API, 'search').and.returnValue(responseFn);
            searchService.searchResults({});

            //call then function
            thenFn();

            //call then function
            failFn();
        });
    });

    describe('should call uploadImage', function () {
        var thenFn, failFn;
        beforeEach(function() {
            deferred = $q.defer();
        });
        var responseFn = {
            $promise: {
                then:function(func) {
                    thenFn = func;
                    return {
                        catch:function(failFc) {
                            failFn = failFc;
                        }
                    }
                }
            }
        };

        it('Image results', function () {
            spyOn(API, 'upload').and.returnValue(responseFn);
            searchService.uploadImage({});

            //call then function
            thenFn();

            //call then function
            failFn();
        });
    });

    describe('Factsheets', function () {
        beforeEach(function() {
            deferred = $q.defer();
        });

        it('getFactSheetForState', function () {
            var thenFn, failFn;
            var responseFn = {
                $promise: {
                    then:function(func) {
                        thenFn = func;
                        return {
                            catch:function(failFc) {
                                failFn = failFc;
                            }
                        }
                    }
                }
            };
            spyOn(API, 'getFactSheet').and.returnValue(responseFn);
            searchService.getFactSheetForState({'state':'AK', fsType: 'State Health', queryID: ''});
            expect(API.getFactSheet).toHaveBeenCalled();
        });
    });
});
