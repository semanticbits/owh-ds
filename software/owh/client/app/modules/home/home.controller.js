(function(){
    angular
        .module('owh.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'searchFactory', '$state', '$rootScope'];

    function HomeController($scope, searchFactory, $state, $rootScope) {
        var hc = this;
        hc.showPhaseTwoWarningModal = showPhaseTwoWarningModal;
        hc.toggleSlideUp = toggleSlideUp;
        hc.toggleSlideDown = toggleSlideDown;
        var root = document.getElementsByTagName( 'html' )[0]; // '0' to assign the first (and only `HTML` tag)
        root.setAttribute( 'class', 'parallax' );
        $rootScope.acceptDUR = false;

        function showPhaseTwoWarningModal(message) {
            searchFactory.showPhaseTwoModal(message);
        }

        function toggleSlideUp(id) {
            jQuery('#' + id).slideUp();
        }

        function toggleSlideDown(id) {
            jQuery('#' + id).slideDown();
        }

        $scope.redirectToMortalityPage = function(){
            $rootScope.acceptDUR = false;
            $state.go('search');
        }
    }
}());