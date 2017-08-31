(function(){
    angular
        .module('owh.fact-sheet')
        .controller('FactSheetController', FactSheetController);

    FactSheetController.$inject = ['$scope', '$state', 'factSheetService'];

    function FactSheetController($scope, $state, factSheetService) {
        var fsc = this;
        fsc.fsTypes = {
            minority_health: 'Minority Health',
            womens_health: "Women's Health",
            state_health: "State Health"};
        fsc.states = {
            "AL": "Alabama",
            "AK": "Alaska",
            "AZ": "Arizona",
            "AR": "Arkansas",
            "CA": "California",
            "CO": "Colorado",
            "CT": "Connecticut",
            "DE": "Delaware",
            "DC": "District of Columbia",
            "FL": "Florida",
            "GA": "Georgia",
            "HI": "Hawaii",
            "ID": "Idaho",
            "IL": "Illinois",
            "IN": "Indiana",
            "IA": "Iowa",
            "KS": "Kansas",
            "KY": "Kentucky",
            "LA": "Louisiana",
            "ME": "Maine",
            "MD": "Maryland",
            "MA": "Massachusetts",
            "MI": "Michigan",
            "MN": "Minnesota",
            "MS": "Mississippi",
            "MO": "Missouri",
            "MT": "Montana",
            "NE": "Nebraska",
            "NV": "Nevada",
            "NH": "New Hampshire",
            "NJ": "New Jersey",
            "NM": "New Mexico",
            "NY": "New York",
            "NC": "North Carolina",
            "ND": "North Dakota",
            "OH": "Ohio",
            "OK": "Oklahoma",
            "OR": "Oregon",
            "PA": "Pennsylvania",
            "RI": "Rhode Island",
            "SC": "South Carolina",
            "SD": "South Dakota",
            "TN": "Tennessee",
            "TX": "Texas",
            "UT": "Utah",
            "WA": "Washington",
            "WV": "West Virginia",
            "WI": "Wisconsin",
            "WY": "Wyoming"
        };

        fsc.getFactSheet = getFactSheet;
        fsc.exportFactSheet = exportFactSheet;
        fsc.getStateName = getStateName;

        function getFactSheet(state, fsType) {
            factSheetService.prepareFactSheetForState(state, fsType).then(function (response) {
                fsc.factSheet = response;
            })
        }

        function exportFactSheet() {
            var doc = new jsPDF();
            var specialElementHandlers = {
                '#editor': function (element, renderer) {
                    return true;
                }
            };
            doc.fromHTML($('#factsheet_content').html(), 15, 15, {
                'width': 370,
                'elementHandlers': specialElementHandlers
            });
            doc.save('sample-file.pdf');
        }
        function getStateName(key) {
            return fsc.states[key];
        }
    }
}());