'use strict';

describe('factSheetService', function(){
    var factSheetService, SearchService;

    beforeEach(module('owh'));

    beforeEach(inject(function ($injector) {
        factSheetService = $injector.get('factSheetService');
        SearchService = $injector.get('SearchService');
    }));

    it('prepareFactSheetForState', inject(function (SearchService) {
        spyOn(SearchService, "getFactSheetForState").and.returnValue({
            then: function(){}
        });
        factSheetService.prepareFactSheetForState('AK', 'State Health', null);
        expect(SearchService.getFactSheetForState).toHaveBeenCalled();
    }));

});