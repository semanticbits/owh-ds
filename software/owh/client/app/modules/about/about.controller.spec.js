describe("About Controller: ", function(){

    var $controller, aboutController, $scope;

    beforeEach( function() {
        module('owh');
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $scope= _$rootScope_.$new();
            aboutController = $controller('AboutController',{$scope:$scope});
        });
    });
});