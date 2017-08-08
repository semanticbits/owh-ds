'use strict';

describe("Description Controller: ", function(){

    var $controller, descriptionController, $scope;

    beforeEach( function() {
        module('owh');
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $scope= _$rootScope_.$new();
            descriptionController= $controller('DescriptionController',{$scope:$scope, $stateParams: {dataSetKey:'natality'}});
        });
    });

    it("Should get Dataset Details", function() {
        var details = descriptionController.getDataSetDetails();
        expect(details.key).toEqual("natality");
        expect(details.title).toEqual("Natality");
        expect(details.image).toEqual("natality-icon.svg");

         descriptionController= $controller('DescriptionController',{$scope:$scope, $stateParams: {dataSetKey:'deaths'}});

        details = descriptionController.getDataSetDetails();
        expect(details.key).toEqual("deaths");
        expect(details.title).toEqual("Detailed Mortality");
        expect(details.image).toEqual("mortality-icon.svg");
    });

    it("Should redirectToMortalityPage", function() {
        var scope = {
            redirectToMortalityPage: function () {

            }
        };
        descriptionController = $controller('DescriptionController',{ $scope:scope, $stateParams: {dataSetKey:'deaths'}});
        scope.redirectToMortalityPage();
    });

    it("Should scrollToElement", function() {
        descriptionController.scrollToElement();
    });
});