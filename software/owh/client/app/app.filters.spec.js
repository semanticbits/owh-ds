'use strict';

/*group of common test goes here as describe*/
describe('OWH Filters: ', function(){
    var toUpperCase,toLowerCase,genderTitle;

    beforeEach(module('owh'));
    beforeEach(inject(function(_ToUpperCaseFilter_,_ToLowerCaseFilter_,_GenderTitleFilter_) {
        toUpperCase = _ToUpperCaseFilter_;
        toLowerCase = _ToLowerCaseFilter_;
        genderTitle = _GenderTitleFilter_;
    }));

    it('Should convert to upper case', inject(function() {
        expect(toUpperCase('hello')).toBe('HELLO');
        expect(toUpperCase('Hello')).toBe('HELLO');
        expect(toUpperCase(undefined)).toBe('');
    }));

    it('Should convert to lower case', inject(function() {
        expect(toLowerCase('HELLO')).toBe('hello');
        expect(toLowerCase('Hello')).toBe('hello');
        expect(toLowerCase(undefined)).toBe('');
    }));

    it('Should convert to genderTitle', inject(function() {
        expect(genderTitle("Male")).toBe('Male');
        expect(genderTitle("Female")).toBe('Female');
        expect(genderTitle("X")).toBe('X');
        expect(toLowerCase(undefined)).toBe('');
    }));
});
