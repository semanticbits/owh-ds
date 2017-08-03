(function(){
    angular
        .module('owh.about')
        .controller('AboutController', AboutController);

    AboutController.$inject = [];

    function AboutController() {
        var ac = this;
        ac.itrRange = itrRange;

        ac.dataSets = [
                {
                    datasetKey:'deaths',
                    label:'Detailed Mortality',
                    icon:'mortality-icon.svg',
                    description:'Browse detailed information regarding mortality and population counts in the United States, across groupings of race, gender and age. Data are based on death certificates for U.S residents.'
                },
                {
                    datasetKey:'mental_health',
                    label:'Youth Risk Behaviour',
                    icon:'yrbss-icon.svg',
                    description:'Consider data collected from middle school and high school surveys to gain insight into national, state and local youth risk behaviors.'
                },
                {
                    datasetKey:'bridge_race',
                    label:'Bridged-Race Populations',
                    icon:'yrbss-icon.svg',
                    description:'Based on Census estimates of U.S national, state and county residents, examine populations across factors including age, race and ethnicity.'
                },
                {
                    datasetKey:'natality',
                    label:'Natality',
                    icon:'natality-icon.svg',
                    description:'Explore information regarding births across the country, including trends and data based on maternal education, socioeconomic background and risk factors.'
                },
                {
                    datasetKey:'prams',
                    label:'Pregnancy Risk Assessment',
                    icon:'prams-icon.svg',
                    description:'Collection of data available by state and year for a variety of risk factors, such as physical abuse, breastfeeding, and pregnancy intention.'
                },
                {
                    datasetKey:'brfss',
                    label:'Behavioural Risk Factors',
                    icon:'brfss-icon.svg',
                    description:'Collection of data from a state-based surveillance system in all 50 states and the District of Columbia for information on health risk behaviors, clinical preventive health practices, and health care access, primarily related to chronic disease and injury.'
                },
                {
                    datasetKey:'cancer_incident',
                    label:'Cancer Statistics',
                    icon:'disease-icon.svg',
                    description:'Compare cancer incidence and death statistics across ages, race, gender and year, as well as by cancer centers across the country.'
                },
                {
                    datasetKey:'infant_mortality',
                    label:'Linked Birth/Infant Deaths',
                    icon:'infant-mortality-icon.svg',
                    description:'View meaningful statistics on infant mortality and the various factors, such as maternal ethnicity and county of residence, that can potentially contribute to such an occurrence.'
                },
                {
                    datasetKey:'tb',
                    label:'Tuberculosis',
                    icon:'tuberculosis-icon.svg',
                    description:'Browse information on reported cases of TB across the country and how it impacts specific states.'
                },
                {
                    datasetKey:'std',
                    label:'Sexually Transmitted Diseases',
                    icon:'std-icon.svg',
                    description:'Search STD case reports for women in order to gain insight on disease incidence rates, the number of cases reported, and which STDs most commonly affect women.'
                },
                {
                    datasetKey:'aids',
                    label:'HIV/AIDS',
                    icon:'aids-hiv-icon.svg',
                    description:'Learn about reported cases of AIDS and the corresponding response of health departments across the country. View information on survival rates and risk factors that contributed to AIDS-related deaths.'
                }
            ];

        ac.topics = [

        ];

        function itrRange(step) {
            step = step || 1;
            var input = [];
            for (var i = 0; i < ac.dataSets.length; i += step) {
                input.push(i);
            }
            return input;
        }
    }
}());