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
        fsc.stateJSON = [
            {id:"AL", text:"Alabama"},
            {id:"AK", text: "Alaska"},
            {id:"AZ", text: "Arizona"},
            {id:"AR", text:"Arkansas"},
            {id:"CA", text:"California"},
            {id:"CO", text:"Colorado"},
            {id:"CT", text:"Connecticut"},
            {id:"DE", text:"Delaware"},
            {id:"DC", text:"District of Columbia"},
            {id:"FL", text:"Florida"},
            {id:"GA", text:"Georgia"},
            {id:"HI", text:"Hawaii"},
            {id:"ID", text:"Idaho"},
            {id:"IL", text:"Illinois"},
            {id:"IN", text:"Indiana"},
            {id:"IA", text:"Iowa"},
            {id:"KS", text:"Kansas"},
            {id:"KY", text:"Kentucky"},
            {id:"LA", text:"Louisiana"},
            {id:"ME", text:"Maine"},
            {id:"MD", text:"Maryland"},
            {id:"MA", text:"Massachusetts"},
            {id:"MI", text:"Michigan"},
            {id:"MN", text:"Minnesota"},
            {id:"MS", text:"Mississippi"},
            {id:"MO", text:"Missouri"},
            {id:"MT", text:"Montana"},
            {id:"NE", text:"Nebraska"},
            {id:"NV", text:"Nevada"},
            {id:"NH", text:"New Hampshire"},
            {id:"NJ", text:"New Jersey"},
            {id:"NM", text:"New Mexico"},
            {id:"NY", text:"New York"},
            {id:"NC", text:"North Carolina"},
            {id:"ND", text:"North Dakota"},
            {id:"OH", text:"Ohio"},
            {id:"OK", text:"Oklahoma"},
            {id:"OR", text:"Oregon"},
            {id:"PA", text:"Pennsylvania"},
            {id:"RI", text:"Rhode Island"},
            {id:"SC", text:"South Carolina"},
            {id:"SD", text:"South Dakota"},
            {id:"TN", text:"Tennessee"},
            {id:"TX", text:"Texas"},
            {id:"UT", text:"Utah"},
            {id:"WA", text:"Washington"},
            {id:"WV", text:"West Virginia"},
            {id:"WI", text:"Wisconsin"},
            {id:"WY", text:"Wyoming"}
        ];

        fsc.getFactSheet = getFactSheet;
        fsc.exportFactSheet = exportFactSheet;
        fsc.getStateName = getStateName;

        function getFactSheet(state, fsType) {
            factSheetService.prepareFactSheetForState(state, fsType).then(function (response) {
                fsc.state = fsc.states[response.state];
                fsc.factSheet = response;
            })
        }

        function exportFactSheet() {
            var docDefinition = {content: []};
            var factSheetPartOneData = null;
            html2canvas(document.getElementsByClassName('factsheet-part1')[0], {
                onrendered: function (canvas) {
                    factSheetPartOneData = canvas.toDataURL();
                }
            });
            html2canvas(document.getElementsByClassName('factsheet-part2')[0], {
                onrendered: function (canvas) {
                    var factSheetPartTwoData = canvas.toDataURL();
                    docDefinition.content.push(
                    {
                        image: factSheetPartOneData,
                        width: 500
                    },
                    {
                        image: factSheetPartTwoData,
                        width: 500
                    }
                    );
                    pdfMake.createPdf(docDefinition).download("factsheet.pdf");
                }
            });
        }
        function getStateName(key) {
            return fsc.states[key];
        }
    }
}());