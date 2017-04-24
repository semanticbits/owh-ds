'use strict';

describe('filterUtils', function(){
    var filterUtils, utilService;

    beforeEach(module('owh'));

    beforeEach(inject(function ($injector) {
        filterUtils = $injector.get('filterUtils');
        utilService = $injector.get('utilService');
    }));

    describe('test getBridgeDataFilters', function() {
        it('when I call getBridgeDataFilters, I should get bridge race filters', function () {
            var bridgeRaceFilters = filterUtils.getBridgeDataFilters();
            expect(bridgeRaceFilters[0].key).toEqual('current_year');
            expect(bridgeRaceFilters[1].key).toEqual('sex');
            expect(bridgeRaceFilters[2].key).toEqual('agegroup');
            expect(bridgeRaceFilters[3].key).toEqual('race');
            expect(bridgeRaceFilters[5].autoCompleteOptions[0].title).toEqual('Alabama');
            expect(bridgeRaceFilters[5].autoCompleteOptions[1].title).toEqual('Alaska');
        });

        it('should provide me correct slider intervals', function () {

            var bridgeRaceFilters = filterUtils.getBridgeDataFilters();
            //Slider lower and upper bounds
            expect(bridgeRaceFilters[2].sliderOptions.from).toEqual(0);
            expect(bridgeRaceFilters[2].sliderOptions.to).toEqual(85);

            bridgeRaceFilters[2].sliderOptions.callback('5;19');

            var ageGroupFilter = utilService.findByKeyAndValue(bridgeRaceFilters, 'key', 'agegroup');
            expect(ageGroupFilter.value).toEqual(['5-9 years', '10-14 years', '15-19 years']);
        });
    });

    describe('test natality filters', function() {
        it('when I call getNatalityDataFilters, I should get natality filters', function () {
            var bridgeRaceFilters = filterUtils.getNatalityDataFilters();
            expect(bridgeRaceFilters[0].key).toEqual('hispanic_origin');
            expect(bridgeRaceFilters[1].key).toEqual('mother_age_1year_interval');
            expect(bridgeRaceFilters[2].key).toEqual('mother_age_5year_interval');
            expect(bridgeRaceFilters[3].key).toEqual('race');
            expect(bridgeRaceFilters[4].key).toEqual('marital_status');
        });
    });
});