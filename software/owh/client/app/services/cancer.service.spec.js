'use strict';

describe('cancer.service', function(){
    var cancerService;

    beforeEach(module('owh'));

    beforeEach(inject(function ($injector) {
        cancerService = $injector.get('cancerService');
    }));

    it('should return an object with properties that are functions', function () {
        expect(cancerService).toEqual(jasmine.any(Object));
        Object.keys(cancerService).forEach(function (property) {
            var methods = [ 'getCancerSitesFor', 'getCancerSiteListFor', 'getChildhoodCancers', 'getChildhoodCancersList' ];
            expect(methods).toContain(property);
        });
    });

    describe('getSites', function () {
        it('should be a function', function () {
            expect(cancerService.getCancerSitesFor).toEqual(jasmine.any(Function));
        });

        it('should return an array', function () {
            expect(cancerService.getCancerSiteListFor('cancer_incidence')).toEqual(jasmine.any(Array));
        });
    });

    describe('getList', function () {
        it('should be a function', function () {
            expect(cancerService.getCancerSiteListFor).toEqual(jasmine.any(Function));
        });

        it('should return an array', function () {
            expect(cancerService.getCancerSiteListFor('cancer_incidence')).toEqual(jasmine.any(Array));
        });
    });

    describe('getChildhoodCancers', function () {
        it('should be a function', function () {
            expect(cancerService.getChildhoodCancers).toEqual(jasmine.any(Function));
        });

        it('should return an array', function () {
            expect(cancerService.getChildhoodCancers()).toEqual(jasmine.any(Array));
        });
    });

    describe('getChildhoodCancersList', function () {
        it('should be a function', function () {
            expect(cancerService.getChildhoodCancersList).toEqual(jasmine.any(Function));
        });

        it('should return an array', function () {
            expect(cancerService.getChildhoodCancersList()).toEqual(jasmine.any(Array));
        });
    });
});
