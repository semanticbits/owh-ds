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
            expect(bridgeRaceFilters[2].sliderOptions.to).toEqual(90);

            bridgeRaceFilters[2].sliderOptions.callback('5;19');

            var ageGroupFilter = utilService.findByKeyAndValue(bridgeRaceFilters, 'key', 'agegroup');
            expect(ageGroupFilter.value).toEqual(['5-9 years', '10-14 years', '15-19 years']);
        });

        it('should provide me correct slider intervals for single value selection', function () {

            var bridgeRaceFilters = filterUtils.getBridgeDataFilters();

            bridgeRaceFilters[2].sliderOptions.callback('5;5');
            var ageGroupFilter = utilService.findByKeyAndValue(bridgeRaceFilters, 'key', 'agegroup');
            expect(ageGroupFilter.value).toEqual(['5-9 years']);
        });
        it('should provide me correct slider intervals for single interval selection', function () {

            var bridgeRaceFilters = filterUtils.getBridgeDataFilters();

            bridgeRaceFilters[2].sliderOptions.callback('5;10');
            var ageGroupFilter = utilService.findByKeyAndValue(bridgeRaceFilters, 'key', 'agegroup');
            expect(ageGroupFilter.value).toEqual(['5-9 years', '10-14 years']);
        });
    });

    describe('test natality filters', function() {
        it('when I call getNatalityDataFilters, I should get natality filters', function () {
            var natalityFilters = filterUtils.getNatalityDataFilters();
            expect(natalityFilters[0].key).toEqual('hispanic_origin');
            expect(natalityFilters[1].key).toEqual('state');
            expect(natalityFilters[2].key).toEqual('census-region');
            expect(natalityFilters[3].key).toEqual('hhs-region');
            expect(natalityFilters[4].key).toEqual('mother_age_1year_interval');
            expect(natalityFilters[5].key).toEqual('mother_age_5year_interval');
            expect(natalityFilters[6].key).toEqual('race');
            expect(natalityFilters[7].key).toEqual('marital_status');
        });
    });

    describe('test infant mortality filters', function() {
        it('when I call getInfantMortalityDataFilters, I should get infant mortality filters', function () {
            var InfantMortalityData= filterUtils.getInfantMortalityDataFilters();
            expect(InfantMortalityData[0].key).toEqual('year_of_death');
            expect(InfantMortalityData[0].value).toEqual(['2017']);
            expect(InfantMortalityData[1].key).toEqual('sex');
            expect(InfantMortalityData[2].key).toEqual('infant_age_at_death');
            expect(InfantMortalityData[3].key).toEqual('race');
            expect(InfantMortalityData[4].key).toEqual('hispanic_origin');
            expect(InfantMortalityData[5].key).toEqual('mother_age_5_interval');
            expect(InfantMortalityData[6].key).toEqual('marital_status');
            expect(InfantMortalityData[7].key).toEqual('mother_education');
        });
    });

    describe('STD filters -> ', function() {
        it('when I call getSTDDataFilters, I should get all std filters', function () {
            var stdDataFilters= filterUtils.getSTDDataFilters();
            expect(stdDataFilters[0].key).toEqual('current_year');
            expect(stdDataFilters[0].value).toEqual('2016');
            expect(stdDataFilters[0].helpText).toEqual('label.std.help.text.year');
            expect(stdDataFilters[1].key).toEqual('disease');
            expect(stdDataFilters[1].value).toEqual('Chlamydia');
            expect(stdDataFilters[1].helpText).toEqual('label.std.help.text.disease');
            expect(stdDataFilters[2].key).toEqual('state');
            expect(stdDataFilters[2].value).toEqual('National');
            expect(stdDataFilters[2].helpText).toEqual('label.std.help.text.state');
            expect(stdDataFilters[3].key).toEqual('age_group');
            expect(stdDataFilters[3].value).toEqual('All age groups');
            expect(stdDataFilters[3].helpText).toEqual('label.std.help.text.age.group');
            expect(stdDataFilters[3].autoCompleteOptions.length).toEqual(12);
            expect(stdDataFilters[3].autoCompleteOptions[0].key).toEqual("All age groups");
            expect(stdDataFilters[3].autoCompleteOptions[1].key).toEqual("0-14");
            expect(stdDataFilters[3].autoCompleteOptions[2].key).toEqual("15-19");
            expect(stdDataFilters[3].autoCompleteOptions[3].key).toEqual("20-24");
            expect(stdDataFilters[3].autoCompleteOptions[4].key).toEqual("25-29");
            expect(stdDataFilters[3].autoCompleteOptions[5].key).toEqual("30-34");
            expect(stdDataFilters[3].autoCompleteOptions[6].key).toEqual("35-39");
            expect(stdDataFilters[3].autoCompleteOptions[7].key).toEqual("40-44");
            expect(stdDataFilters[3].autoCompleteOptions[8].key).toEqual("45-54");
            expect(stdDataFilters[3].autoCompleteOptions[9].key).toEqual("55-64");
            expect(stdDataFilters[3].autoCompleteOptions[10].key).toEqual("65+");
            expect(stdDataFilters[3].autoCompleteOptions[11].key).toEqual("Unknown");
            expect(stdDataFilters[4].key).toEqual('race');
            expect(stdDataFilters[4].value).toEqual('All races/ethnicities');
            expect(stdDataFilters[4].helpText).toEqual('label.std.help.text.race.ethnicity');
            expect(stdDataFilters[5].key).toEqual('sex');
            expect(stdDataFilters[5].value).toEqual('Both sexes');
            expect(stdDataFilters[5].helpText).toEqual('label.std.help.text.sex');
        });

        it('When I call getAllOptionValues, I should get list of All option values', function() {
            var values = filterUtils.getAllOptionValues();
            expect(values[0]).toEqual("Both sexes");
            expect(values[1]).toEqual("All races/ethnicities");
            expect(values[2]).toEqual("All age groups");
            expect(values[3]).toEqual("National");
        });
    });

    describe('TB filters -> ', function() {
        it('when I call getTBDataFilters, I should get all TB filters', function () {
            var stdDataFilters= filterUtils.getTBDataFilters();
            expect(stdDataFilters[0].key).toEqual('current_year');
            expect(stdDataFilters[0].value).toEqual('2017');
            expect(stdDataFilters[1].key).toEqual('age_group');
            expect(stdDataFilters[2].key).toEqual('race');
            expect(stdDataFilters[2].value).toEqual('All races/ethnicities');
            expect(stdDataFilters[3].key).toEqual('sex');
            expect(stdDataFilters[3].value).toEqual('Both sexes');
            expect(stdDataFilters[4].key).toEqual('state');
            expect(stdDataFilters[4].value).toEqual('National');
            expect(stdDataFilters[5].key).toEqual('transmission');
        });
    });

    describe('cancerIncidenceFilters', function () {
        it('should have keys for current_year, sex, race, hispanic_origin, age_group, site, childhood_cancer, state', function () {
            var actual = filterUtils.cancerIncidenceFilters().map(function (filter) {
                return filter.key;
            });
            var expected = [ 'current_year', 'sex', 'race', 'hispanic_origin', 'age_group', 'site', 'state' ];
            expected.forEach(function (key) {
                expect(actual).toContain(key);
            });
        });
    });

    describe('cancerMortalityFilters', function () {
        it('should have keys for current_year, sex, race, hispanic_origin, age_group, site, childhood_cancer, state', function () {
            var actual = filterUtils.cancerMortalityFilters().map(function (filter) {
                return filter.key;
            });
            var expected = [ 'current_year', 'sex', 'race', 'hispanic_origin', 'age_group', 'site', 'state' ];
            expected.forEach(function (key) {
                expect(actual).toContain(key);
            });
        });
    });
});
