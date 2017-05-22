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
            var natalityFilters = filterUtils.getNatalityDataFilters();
            expect(natalityFilters[0].key).toEqual('hispanic_origin');
            expect(natalityFilters[1].key).toEqual('state');
            expect(natalityFilters[2].key).toEqual('mother_age_1year_interval');
            expect(natalityFilters[3].key).toEqual('mother_age_5year_interval');
            expect(natalityFilters[4].key).toEqual('race');
            expect(natalityFilters[5].key).toEqual('marital_status');
        });
    });

    describe('test infant mortality filters', function() {
        it('when I call getInfantMortalityDataFilters, I should get infant mortality filters', function () {
            var InfantMortalityData= filterUtils.getInfantMortalityDataFilters();
            expect(InfantMortalityData[0].key).toEqual('year_of_death');
            expect(InfantMortalityData[1].key).toEqual('sex');
            expect(InfantMortalityData[2].key).toEqual('infant_age_at_death');
            expect(InfantMortalityData[3].key).toEqual('race');
            expect(InfantMortalityData[4].key).toEqual('hispanic_origin');
            expect(InfantMortalityData[5].key).toEqual('mother_age_5_interval');
            expect(InfantMortalityData[6].key).toEqual('marital_status');
            expect(InfantMortalityData[7].key).toEqual('mother_education');
        });
    });
});