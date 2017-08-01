(function(){
    angular
        .module('owh.description')
        .controller('DescriptionController', DescriptionController);

    DescriptionController.$inject = ['$scope', 'searchFactory', '$stateParams', 'utilService'];

    function DescriptionController($scope, searchFactory, $stateParams, utilService) {
        var dsc = this;
        var root = document.getElementsByTagName('html')[0];

        var desInfo = [{
                key: 'natality', title: 'label.filter.natality', yrsAvail: '2000-2015', topics: 'Births, Babies, Birth Rates, Fertility Rates, Prenatal Care',
                filters: [
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""}
                ]
            }];


        root.removeAttribute('class');
       //For intial search call

        dsc.getFilterInfo = function() {
            return desInfo[key];
        }
    }
}());