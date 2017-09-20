(function(){
    'use strict';
    angular
        .module('owh')
        .component("owhBookmark",{
            templateUrl: 'app/components/owh-bookmark/bookmark.html',
            controller: BookMarkController,
            controllerAs: 'bmc',
            bindings: {
                tableView:"<"
            }
        });

    BookMarkController.$inject = ['$scope', '$location', '$window'];

    function BookMarkController($scope, $location, $window) {

        var bmc = this;
        bmc.isFirefoxBrowser = isFirefoxBrowser;
        bmc.showBookmarkAlert = showBookmarkAlert;

        var bookmarkButton =angular.element("#bookmark-button");
        //get the current url and assign it to bookmark button href
        $(bookmarkButton).attr({
            href: $location.host()+":"+$location.port()+$location.url()
        });

        function isFirefoxBrowser () {
            return (($window.sidebar && $window.navigator.userAgent.indexOf('Firefox') != -1));
        }

        function showBookmarkAlert() {
            alert('Press ' + (navigator.userAgent.indexOf('Mac') != -1 ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
        }
    }
})();
