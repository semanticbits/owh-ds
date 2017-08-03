(function(){
    angular
        .module('owh.description')
        .controller('DescriptionController', DescriptionController);

    DescriptionController.$inject = ['$scope', 'searchFactory', '$stateParams', 'utilService'];

    function DescriptionController($scope, searchFactory, $stateParams, utilService) {
        var dc = this;
        dc.getDataSetDetails = getDataSetDetails;
        dc.datasetInfo = {
                natality: {
                    title: 'label.filter.natality',
                    image: '../images/icons/natality-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: 'Births, Babies, Birth Rates, Fertility Rates, Prenatal Care',
                    dataDescription:'label.data.dsc.natality',
                    suppression:'label.supp.natality',
                    source: 'label.source.natality',
                    filters: [
                        {name: "Births", dsc: "The birth counts in the data represent births that occurred in the 50 United States and the district of Columbia, for the legal place of residence of the decedent."},
                        {name: "Birth Rates", dsc: "Birth rates are calculated as the number of births divided by total population in the given year(s)."},
                        {name: "Fertility Rates", dsc: "Fertility rates are calculated as the number of births divided by the number of females age 15 - 44 years old in the given year(s)"},
                        {name: "Population", dsc: "The population estimates are bridged-race estimates based on Bureau of the Census estimates of total U.S., State, and county resident populations"},
                        {name: "Year", dsc: "label.help.text.year"},
                        {name: "Sex", dsc: "label.help.text.sex"},
                        {name: "Month", dsc: "label.help.text.month"},
                        {name: "Weekday", dsc: "label.help.text.week.day"},
                        {name: "Gestational Age", dsc: "label.help.text.gestational.age"},
                        {name: "Month Prenatal Care Began", dsc: "label.help.text.prenatal.care"},
                        {name: "Birth Weight", dsc: "label.help.text.birth.weight"},
                        {name: "Plurality or Multiple Birth", dsc: "label.help.text.birth.plurality"},
                        {name: "Live Birth Order", dsc: "label.help.text.live.birth.order"},
                        {name: "Birth Place", dsc: "label.help.text.birth.place"},
                        {name: "Delivery Method", dsc: "label.help.text.delivery.method"},
                        {name: "Medical Attendant", dsc: "label.help.text.medical.attendant"},
                        {name: "Ethnicity", dsc: "label.help.text.ethnicity"},
                        {name: "Race", dsc: "label.help.text.race"},
                        {name: "Marital Status", dsc: "label.help.text.marital.status"},
                        {name: "Age of Mother", dsc: "label.help.text.infantmort.age.group"},
                        {name: "Education", dsc: "label.help.text.mother.education"},
                        {name: "Anemia", dsc: "label.help.text.anemia"},
                        {name: "Cardiac Disease", dsc: "label.help.text.cardiac.disease"},
                        {name: "Chronic Hypertension", dsc: "label.help.text.chronic.hypertension"},
                        {name: "Diabetics", dsc: "label.help.text.diabetes"},
                        {name: "Eclampsia", dsc: "label.help.text.eclampsia"},
                        {name: "Hydramnios / Oligohydramnios", dsc: "label.help.text.hydramnios.oligohydramnios"},
                        {name: "Incompetent Cervix", dsc: "label.help.text.incomplete.cervix"},
                        {name: "Lung Disease", dsc: "label.help.text.lung.disease"},
                        {name: "Pregnancy Associated Hypertension", dsc: "label.help.text.pregnancy.hypertension"},
                        {name: "Tobacco Use", dsc: "label.help.text.tobacco.use"},
                        {name: "State", dsc: "label.help.text.natality.state"},
                        {name: "Census Regions", dsc: "label.help.text.census.regions"},
                        {name: "HHS Regions", dsc: "label.help.text.hhs.regions"}
                    ]
                },
                deaths: {
                    title: 'label.filter.mortality',
                    image: '../images/icons/mortality-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: 'Multiple Causes of Death, Cancer, Diabetes, Deaths, Sexually Transmitted Diseases, Tuberculosis, Alcohol and Other Drug Use, Obesity, Overweight, Weight Control, Tobacco Use, HIV/AIDS, Prostate Cancer, Population Data',
                    dataDescription: 'label.data.dsc.mortality',
                    suppression: 'label.supp.mortality',
                    source: 'label.source.mortality',
                    filters: [
                        {name: "Deaths", dsc: ""},
                        {name: "Crude Death Rates", dsc: ""},
                        {name: "Age Adjusted Death Rates", dsc: ""},
                        {name: "Population", dsc: ""},
                        {name: "Year", dsc: ""},
                        {name: "Sex", dsc: ""},
                        {name: "Race", dsc: ""},
                        {name: "Ethnicity", dsc: ""},
                        {name: "Age", dsc: ""},
                        {name: "Autopsy", dsc: ""},
                        {name: "Place of Death", dsc: ""},
                        {name: "Weekday", dsc: ""},
                        {name: "Month", dsc: ""},
                        {name: "UCD", dsc: ""},
                        {name: "MCD", dsc: ""},
                        {name: "State", dsc: ""},
                        {name: "Census Regions", dsc: "label.help.text.census.regions"},
                        {name: "HHS Regions", dsc: "label.help.text.hhs.regions"}
                    ]
                },
                bridge_race: {
                    title: 'label.bridged.race',
                    image: '../images/icons/bridged-race-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: 'Births, Babies, Birth Rates, Fertility Rates, Prenatal Care',
                    dataDescription: '',
                    suppression: '',
                    source: '',
                filters: [
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""}
                ]
            },
                std: {
                    title: 'label.filter.std',
                    image: '../images/icons/std-icon.svg',
                    yrsAvail: '2000-2015',
                    topics: 'Births, Babies, Birth Rates, Fertility Rates, Prenatal Care',
                    dataDescription: '',
                    suppression: '',
                    source: '',
                filters: [
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""},
                    {name: "", dsc: ""}
                ]
            }
        };

        function getDataSetDetails() {
            return dc.datasetInfo[$stateParams.dataSetKey]
        }
    }
}());