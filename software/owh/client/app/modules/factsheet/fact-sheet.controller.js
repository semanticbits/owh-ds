(function(){
    angular
        .module('owh.fact-sheet')
        .controller('FactSheetController', FactSheetController);

    FactSheetController.$inject = ['$scope', '$state', 'factSheetService', '$filter'];

    function FactSheetController($scope, $state, factSheetService, $filter) {
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

        function prepareTableHeaders(headers, cssClass){
            var tableHeaders = [];
            angular.forEach(headers, function(eachHeaderText){
                tableHeaders.push({text: eachHeaderText, style: cssClass ? cssClass : 'tableHeader', border: [false, false, false, true], fillColor: '#dddddd'})
            });
            return tableHeaders;
        }

        function prepareTableBody(data, cssClass){
            var tableBody = [];
            angular.forEach(data, function(eachRecord){
                if(angular.isArray(eachRecord)) {
                    var eachRow = [];
                    angular.forEach(eachRecord, function(value){
                         eachRow.push({text: value, style: cssClass ? cssClass : 'table', border: [true, true, true, true]})
                    });
                    tableBody.push(eachRow);
                }
                else {
                    tableBody.push({
                        text: eachRecord,
                        style: cssClass ? cssClass : 'table',
                        border: [false, false, true, true]
                    })
                }
            });
            return tableBody;
        }

        function prepareAllTablesData(){
            var allTablesData = {};
            //Prepare bridgeRace data
            var bridgeRaceTableOneData = [];
            bridgeRaceTableOneData.push('Number');
            bridgeRaceTableOneData.push($filter('number')(fsc.factSheet.totalGenderPop));
            angular.forEach(fsc.factSheet.race, function(race){
                bridgeRaceTableOneData.push($filter('number')(race.bridge_race));
            });
            var bridgeRaceTableTwoData = [];
            bridgeRaceTableTwoData.push('Number');
            bridgeRaceTableTwoData.push($filter('number')(fsc.factSheet.ageGroups[0].bridge_race));
            bridgeRaceTableTwoData.push($filter('number')(fsc.factSheet.ageGroups[1]["15-44 years"][0].bridge_race));
            bridgeRaceTableTwoData.push($filter('number')(fsc.factSheet.ageGroups[1]["15-44 years"][1].bridge_race));
            bridgeRaceTableTwoData.push($filter('number')(fsc.factSheet.ageGroups[2].bridge_race));
            bridgeRaceTableTwoData.push($filter('number')(fsc.factSheet.ageGroups[3].bridge_race));
            bridgeRaceTableTwoData.push($filter('number')(fsc.factSheet.ageGroups[4].bridge_race));
            allTablesData.bridgeRaceTable1 = {
                headerData: ['Racial Distributions of Residents*', 'Total', 'Black, non-Hispanic**', 'White, non-Hispanic', 'American Indian', 'Asian/Pacific Islander', 'Hispanic'],
                bodyData: bridgeRaceTableOneData
            };
            allTablesData.bridgeRaceTable2 = {
                headerData: ['Age Distributions of Residents', '10-14', '15-19', '20-44', '45-64', '65-84', '85+'],
                bodyData: bridgeRaceTableOneData
            };
            //Detail Mortality
            var detailsMortalityData = [];
            angular.forEach(fsc.factSheet.detailMortalityData, function(eachRecord){
                detailsMortalityData.push([eachRecord.causeOfDeath, eachRecord.data.deaths ? $filter('number')(eachRecord.data.deaths): "", eachRecord.data.ageAdjustedRate ? eachRecord.data.ageAdjustedRate : ""]);
            });
            allTablesData.detailMortality = {
                headerData: ['Cause of Death', 'Number of Deaths', 'Age-Adjusted Death Rate (per 100,000)'],
                bodyData: detailsMortalityData
            };
            //Infant Mortality
            allTablesData.infantMortality = {
                headerData: ['Deaths', 'Births', 'Death Rate'],
                bodyData: [$filter('number')(fsc.factSheet.infantMortalityData.infant_mortality), $filter('number')(fsc.factSheet.infantMortalityData.births), $filter('number')(fsc.factSheet.infantMortalityData.deathRate)]
            };
            //PRAMS
            var pramsTableOneData = [];
            angular.forEach(fsc.factSheet.prams.pregnantWoment, function(eachRecord){
                pramsTableOneData.push([eachRecord.question, eachRecord.data]);
            });
            var pramsTableTwoData = [];
            angular.forEach(fsc.factSheet.prams.women, function(eachRecord){
                pramsTableTwoData.push([eachRecord.question, eachRecord.data]);
            });
            allTablesData.pramsTable1 = {
                bodyData: pramsTableOneData
            };
            allTablesData.pramsTable2 = {
                bodyData: pramsTableTwoData
            };
            //BRFSS
            var brfssData = [];
            angular.forEach(fsc.factSheet.brfss, function(eachRecord){
               brfssData.push([eachRecord.question, eachRecord.data]);
            });
            allTablesData.brfss = {
                bodyData: brfssData
            };
            //YRBS
            var yrbsData = [];
            angular.forEach(fsc.factSheet.yrbs, function(eachRecord){
                yrbsData.push([eachRecord.question, eachRecord.data]);
            });
            allTablesData.yrbs = {
                bodyData: yrbsData
            };
            //Natality
            allTablesData.natality = {
                bodyData: [["Births", $filter('number')(fsc.factSheet.natalityData.births)],
                    ["Total Population", $filter('number')(fsc.factSheet.natalityData.population)],
                    ["Birth Rates (per 100,000)", fsc.factSheet.natalityData.birthRate],
                    ["Female  Population (Ages 15 to 44)", $filter('number')(fsc.factSheet.natalityData.femalePopulation)],
                    ["Fertility Rates (per 100,000)", fsc.factSheet.natalityData.fertilityRate],
                ]
            };
            //Tuberculosis
            var tbHeaderData = [];
            var tbData = [];
            tbHeaderData.push("Total Cases (Rates)");
            angular.forEach(fsc.factSheet.tuberculosis, function(eachRecord, index){
                if(index > 0 && eachRecord.name != 'Unknown') {
                    tbHeaderData.push(eachRecord.name);
                }
            });
            angular.forEach(fsc.factSheet.tuberculosis, function(eachRecord){
                if(eachRecord.name != 'Unknown') {
                    tbData.push(eachRecord.displayValue);
                }
            });
            allTablesData.tb = {
                headerData:  tbHeaderData,
                bodyData: tbData
            };
            //STD
            var stdHeaderData = [];
            var stdData = [];
            stdHeaderData.push("Disease");
            stdHeaderData.push("Total Cases (Rates)");
            angular.forEach(fsc.factSheet.stdData[0].data, function(eachHeader, index){
                if(index > 0 && eachHeader.name != 'Unknown') {
                    stdHeaderData.push(eachHeader.name);
                }
            });
            angular.forEach(fsc.factSheet.stdData, function(eachRecord){
                var eachRow = [];
                eachRow.push(eachRecord.disease);
                angular.forEach(eachRecord.data, function(data){
                    if(data.name != 'Unknown') {
                        eachRow.push(data.displayValue);
                    }
                });
                stdData.push(eachRow);
            });
            //Add missing empty cells
            for(i=stdData[stdData.length-1].length; i< stdData[0].length; i++) {
                stdData[stdData.length-1][i] = "";
            }
            allTablesData.std = {
                headerData:  stdHeaderData,
                bodyData: stdData
            };
            //HIV/AIDS
            var hivHeaderData = [];
            var hivData = [];
            hivHeaderData.push("Indicator");
            hivHeaderData.push("Total Cases (Rates)");
            angular.forEach(fsc.factSheet.hivAIDSData[0].data, function(eachHeader, index){
                if(index > 0 && eachHeader.name != 'Unknown') {
                    hivHeaderData.push(eachHeader.name);
                }
            });
            angular.forEach(fsc.factSheet.hivAIDSData, function(eachRecord) {
                var eachRow = [];
                eachRow.push(eachRecord.disease);
                angular.forEach(eachRecord.data, function(data){
                    if(data.name != 'Unknown') {
                        eachRow.push(data.displayValue);
                    }
                });
                hivData.push(eachRow);
            });
            allTablesData.hiv = {
                headerData:  hivHeaderData,
                bodyData: hivData
            };

            //Cancer
            var cancerData = [];
            angular.forEach(fsc.factSheet.cancerData, function(eachRecord) {
                var eachRow = [];
                eachRow.push(eachRecord.site);
                eachRow.push($filter('number')(eachRecord.pop));
                eachRow.push($filter('number')(eachRecord.count));
                eachRow.push(eachRecord.incident_rate);
                eachRow.push($filter('number')(eachRecord.deaths));
                eachRow.push(eachRecord.mortality_rate);
                cancerData.push(eachRow);
            });
            allTablesData.cancer = {
                headerData:  ["Cancer Site", "Population", "Count", "Incidence Crude Rates (per 100,000)", "Deaths", "Mortality Crude Rates (per 100,000)"],
                bodyData: cancerData
            };



            return allTablesData;
        }

        function exportFactSheet() {
            var allTablesData = prepareAllTablesData();
            var hivTableData = prepareTableBody(allTablesData.hiv.bodyData);
            hivTableData.unshift(prepareTableHeaders(allTablesData.hiv.headerData));
            var stdTableData = prepareTableBody(allTablesData.std.bodyData);
            stdTableData.unshift(prepareTableHeaders(allTablesData.std.headerData));
            var cancerTableData = prepareTableBody(allTablesData.cancer.bodyData);
            cancerTableData.unshift(prepareTableHeaders(allTablesData.cancer.headerData));
            var lightHorizontalLines = {
                hLineColor: 'gray',
                vLineColor: 'gray'
            };
            var pdfDefinition = {
                styles: {
                    "state-heading": {
                        fontSize: 16,
                        alignment: 'center'
                    },
                    heading: {
                        fontSize: 10,
                        bold: true,
                        decoration: 'underline',
                        margin: [0, 10, 0, 0]
                    },
                    underline: {
                        decoration: 'underline'
                    },
                    "tableHeader": {
                        bold: true
                    },
                    table: {
                        margin: [0, 2, 0, 2]
                    },
                    'info': {
                        fontSize: 6,
                        italics: true,
                        margin: [0, -1, 0, 0]
                    }
                },
                defaultStyle: {
                    fontSize: 8
                }
            };
            pdfDefinition.content = [
                {text: fsc.state, style: 'state-heading'},
                {text: "Population in "+fsc.state, style: 'heading'},
                {text: "Total state population: "+fsc.factSheet.totalGenderPop+ " ("+fsc.factSheet.gender[0].bridge_race+" females; "+fsc.factSheet.gender[1].bridge_race+ " males)"},
                {
                    style: 'table',
                    table: {
                        headerRows: 1,
                        widths: $.map( allTablesData.bridgeRaceTable1.headerData, function (d, i) {
                            return '*';
                        } ),
                        body: [
                            prepareTableHeaders(allTablesData.bridgeRaceTable1.headerData),
                            prepareTableBody(allTablesData.bridgeRaceTable1.bodyData)
                        ]
                    },
                    layout: lightHorizontalLines
                },
                {
                    style: 'table',
                    table: {
                        headerRows: 1,
                        widths: $.map( allTablesData.bridgeRaceTable2.headerData, function (d, i) {
                            return '*';
                        } ),
                        body: [
                            prepareTableHeaders(allTablesData.bridgeRaceTable2.headerData),
                            prepareTableBody(allTablesData.bridgeRaceTable2.bodyData)
                        ]
                    },
                    layout: lightHorizontalLines
                },
                {text: 'Sources: 2015, NCHS National Vital Statistics System , * Racial/ethnic groups may not sum to total', style: 'info'},
                {text: 'Mortality',  style: 'heading'},
                {
                    style: 'table',
                    table: {
                        headerRows: 1,
                        widths: $.map( allTablesData.detailMortality.headerData, function (d, i) {
                            return '*';
                        } ),
                        body: angular.extend(prepareTableHeaders(allTablesData.detailMortality.headerData), prepareTableBody(allTablesData.detailMortality.bodyData))

                    },
                    layout: lightHorizontalLines
                },
                {text: 'Source: 2015, NCHS National Vital Statistics System', style: 'info'},
                {text: 'Infant Mortality: (All Causes, Not gender-specific)', style: 'heading'},
                {
                    style: 'table',
                    table: {
                        headerRows: 1,
                        widths: $.map( allTablesData.infantMortality.headerData, function (d, i) {
                            return '*';
                        } ),
                        body: [
                            prepareTableHeaders(allTablesData.infantMortality.headerData),
                            prepareTableBody(allTablesData.infantMortality.bodyData)
                        ]
                    },
                    layout: lightHorizontalLines
                },
               {text: 'Source: 2014  NCHS National Vital Statistics System', style: 'info'},
                {text: 'Prenatal Care and Pregnancy Risk (Percent)', style: 'heading'},
                {text: 'Pregnant women:', style: 'underline'},
                {
                    style: 'table',
                    table: {
                        widths: $.map( allTablesData.pramsTable1.bodyData[0], function (d, i) {
                            return '*';
                        } ),
                        body: prepareTableBody(allTablesData.pramsTable1.bodyData)
                    },
                    layout: lightHorizontalLines
                },
                {text: 'Women:', style: 'underline'},
                {
                    style: 'table',
                    table: {
                        widths: $.map( allTablesData.pramsTable2.bodyData[0], function (d, i) {
                            return '*';
                        } ),
                        body: prepareTableBody(allTablesData.pramsTable2.bodyData)
                    },
                    layout: lightHorizontalLines
                },
                {text: 'Sources: 2009, CDC PRAMS', style: 'info'},
                {text: 'Behavioral Risk Factors (Percent)',  pageBreak: 'before', style: 'heading'},
                {
                    style: 'table',
                    table: {
                        widths: $.map( allTablesData.brfss.bodyData[0], function (d, i) {
                            return '*';
                        } ),
                        body: prepareTableBody(allTablesData.brfss.bodyData)
                    },
                    layout: lightHorizontalLines
                },
                {text: 'Source:  2015, CDC BRFSS; † 2009, CDC BRFSS', style: 'info'},
                {text: 'Teen Health (Percent teenage population unless otherwise specified)', style: 'heading'},
                {
                    style: 'table',
                    table: {
                        widths: $.map( allTablesData.yrbs.bodyData[0], function (d, i) {
                            return '*';
                        } ),
                        body: prepareTableBody(allTablesData.yrbs.bodyData)
                    },
                    layout: lightHorizontalLines
                },
                {text: 'Sources: 2015, YRBS; NA - Data not available or suppressed , NR - Data not reported', style: 'info'},
                {text: 'Birth Outcomes', style: 'heading'},
                {
                    style: 'table',
                    table: {
                        widths: $.map( allTablesData.natality.bodyData[0], function (d, i) {
                            return '*';
                        } ),
                        body: prepareTableBody(allTablesData.natality.bodyData)
                    },
                    layout: lightHorizontalLines
                },
                {text: 'Sources:  2015, NCHS National Vital Statistics System', style: 'info'},
                {text: 'Tuberculosis (Number of new annual reported infections and rate per 100,000)', style: 'heading'},
                {text: 'Population: '+fsc.factSheet.tuberculosis[0].pop},
                {
                    style: 'table',
                    table: {
                        widths: $.map( allTablesData.tb.headerData, function (d, i) {
                            return '*';
                        } ),
                        body: [
                            prepareTableHeaders(allTablesData.tb.headerData),
                            prepareTableBody(allTablesData.tb.bodyData)
                        ]
                    },
                    layout: lightHorizontalLines
                },
                {text: 'Source: 2015, Estimated Data from the CDC NCHHSTP Atlas', style: 'info'},
                {text: 'Sexually Transmitted Infections (Number of new annual reported infections and rate per 100,000)', pageBreak: 'before', style: 'heading'},
                {text: 'Population: '+fsc.factSheet.stdData[0].data[0].pop},
                {
                    style: 'table',
                    table: {
                        widths: $.map( allTablesData.std.headerData, function (d, i) {
                            return '*';
                        } ),
                        body: stdTableData
                    },
                    layout: lightHorizontalLines
                },
                {text: 'Source: 2015, Estimated Data from the CDC NCHHSTP Atlas', style: 'info'},
                {text: 'HIV/AIDS (Number of new annual reported infections and rate per 100,000)', style: 'heading'},
                {text: 'Population: '+fsc.factSheet.hivAIDSData[0].data[0].pop},
                {
                    style: 'table',
                    table: {
                        widths: $.map( allTablesData.hiv.headerData, function (d, i) {
                            return '*';
                        } ),
                        body: hivTableData
                    },
                    layout: lightHorizontalLines
                },
                {text: 'Source: 2015, Estimated Data from the CDC NCHHSTP Atlas, *2014', style: 'info'},
                {text: 'Cancer Statistics', style: 'heading'},
                {text: 'Cancer Incidence and Mortality:'},
                {
                    style: 'table',
                    table: {
                        widths: $.map( allTablesData.cancer.headerData, function (d, i) {
                            return '*';
                        } ),
                        body: cancerTableData
                    },
                    layout: lightHorizontalLines
                },
                {text: 'Sources: 2014, NPCR Cancer Statistics, † Female only, †† Male only', style: 'info'}

            ];
            pdfMake.createPdf(pdfDefinition).download(fsc.state+"-factsheet.pdf");
        }
        function getStateName(key) {
            return fsc.states[key];
        }
    }
}());