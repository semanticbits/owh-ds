'use strict';

describe("FactSheet Controller: ", function() {

    var $controller, factSheetController, $scope, $factSheetService, $injector, factsheetServiceReponse;

    beforeEach( function() {
        module('owh');
        //module('pdfMake');
        inject(function (_$controller_, _$rootScope_, _$injector_, factSheetService) {
            $controller = _$controller_;
            $scope= _$rootScope_.$new();
            $injector   = _$injector_;
            factSheetController= $controller('FactSheetController',{$scope:$scope});
            $factSheetService = factSheetService;
            factsheetServiceReponse = __fixtures__['app/modules/factsheet/fixtures/factsheetServiceResponse'];
        });

    });

    it("get factsheet", inject(function(SearchService, $q) {
         var deferred = $q.defer();
         var response = {data:"4dcdd1323203ffe625cac68900edc1b5"};
         deferred.resolve(response);
         spyOn(SearchService, 'generateHashCode').and.returnValue(deferred.promise);
         factSheetController.getFactSheet("AL");
         expect(SearchService.generateHashCode).toHaveBeenCalled();
    }));

     it('if no query ID found in the URL, show default factsheets page', inject(function(SearchService) {
        var stateParams = {
            queryID: ''
        };
        $controller('FactSheetController',
        {
            $scope:$scope,
            $stateParams: stateParams
        });
        spyOn(SearchService, "generateHashCode").and.returnValue({
            then: function(){}
        });
        expect(SearchService.generateHashCode).not.toHaveBeenCalled();
    }));

   /* it("export factsheet", function(done){
        factSheetController.state = "MaryLand";
        factSheetController.factSheet = factsheetServiceReponse;
        var documentDefinition = factSheetController.exportFactSheet();
        expect(documentDefinition.content).not.toBeNull();
        expect(documentDefinition.content[0].text).toEqual("MaryLand");
        expect(documentDefinition.content[5].text).toEqual("Sources: 2015, NCHS National Vital Statistics System , * Racial/ethnic groups may not sum to total");
        expect(documentDefinition.content[10].table).not.toBeNull();
        expect(documentDefinition.content[10].table.body[0][0].text).toEqual("Deaths");
        expect(documentDefinition.content[10].table.body[0][0].style).toEqual("tableHeader");
        expect(documentDefinition.content[10].table.body[0][0].border).toEqual([false, false, false, true]);
        expect(documentDefinition.content[10].table.body[0][0].fillColor).toEqual("#dddddd");
        expect(documentDefinition.content[10].table.body[1][0].text).toEqual("480");
        expect(documentDefinition.content[10].table.body[1][0].style).toEqual("table");
        expect(documentDefinition.content[10].table.body[1][0].border).toEqual([false, false, true, true]);
        expect(documentDefinition.content[10].table.body[1][1].text).toEqual("73,921");
        expect(documentDefinition.content[31].text).toEqual("Sexually Transmitted Infections (Number of new annual reported infections and rate per 100,000)");
        expect(documentDefinition.content[31].style).toEqual("heading");
        expect(documentDefinition.content[35].text).toEqual("HIV/AIDS (Number of new annual reported infections and rate per 100,000)");
        expect(documentDefinition.content[35].style).toEqual("heading");
        done();
    })*/

});