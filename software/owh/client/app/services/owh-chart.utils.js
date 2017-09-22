(function(){
    'use strict';
    angular
        .module('owh.services')
        .service('chartUtilService', chartUtilService);

    chartUtilService.$inject = ['$window', '$dateParser', '$filter', '$translate','utilService', 'ModalService'];

    function chartUtilService($window, $dateParser, $filter, $translate, utilService, ModalService) {
        var service = {
            horizontalStack: horizontalStack,
            verticalStack: verticalStack,
            pieChart: plotlyPieChart,
            plotlyPieChart: plotlyPieChart,
            horizontalBar:	horizontalBar,
            verticalBar: verticalBar,
            //bulletBar: bulletBar,
            HorizontalChart : horizontalChart,
            verticalChart : verticalChart,
            lineChart : plotlyLineChart,
            multiLineChart: plotlyMultiLineChart,
            showExpandedGraph: showExpandedGraph,
            getColorPallete: getColorPallete
        };
        return service;


        function getAbbreviation(label){
            var chartAbbreviations = {'All races/ethnicities':'All races',
            'American Indian/Alaska Native':'AI/AN',
            'Black/African American':'Black',
            'Native Hawaiian/Other Pacific Islander':'NHOPI',
            'Hispanic/Latino':'Hispanic',
            'American Indian or Alaska Native':'AI/AN',
            'Asian or Pacific Islander':'API',
            'Black or African American':'Black',
            'Native Hawaiian or Other Pacific Islander':'NHOPI',
            'Multiple Race':'MultiRace',
            'Non Hispanic':'Non Hisp.',
            'Hispanic or Latino':'Hispanic',
            'Central and South American':'C/SA',
            'Central American':'C American',
            'Cuban':'Cuban',
            'Dominican':'Dominican',
            'Latin American':'L American',
            'Mexican':'Mexican',
            'Puerto Rican':'P Rican',
            'South American':'S American',
            'Spaniard':'Spaniard',
            'Other Hispanic':'Other',
            'Decedent’s home':'Home',
            'Hospital, Clinic or Medical Center-  Dead on Arrival':'Hosp-Dead',
            'Hospital, Clinic or Medical Center-  Inpatient':'Hosp-Inpatient',
            'Hospital, Clinic or Medical Center-  Outpatient or admitted to Emergency Room':'Hosp-Outpatient',
            'Hospital, Clinic or Medical Center-  Patient status unknown':'Hosp-Unknown',
            'Nursing home/long term care':'N Home',
            'Hospice facility':'Hospice',
            'Place of death unknown':'Unknown',
            'Under 20 weeks':'Under 20w',
            '20 - 27 weeks':'20-27w',
            '28 - 31 weeks':'28-31w',
            '32 - 35 weeks':'32-35w',
            '37 - 39 weeks':'37-39w',
            '17 weeks':'17w',
            '18 weeks':'18w',
            '19 weeks':'19w',
            '20 weeks':'20w',
            '21 weeks':'21w',
            '22 weeks':'22w',
            '23 weeks':'23w',
            '24 weeks':'24w',
            '25 weeks':'25w',
            '26 weeks':'26w',
            '27 weeks':'27w',
            '28 weeks':'28w',
            '29 weeks':'29w',
            '30 weeks':'30w',
            '31 weeks':'31w',
            '32 weeks':'32w',
            '33 weeks':'33w',
            '34 weeks':'34w',
            '35 weeks':'35w',
            '36 weeks':'36w',
            '37 weeks':'37w',
            '38 weeks':'38w',
            '39 weeks':'39w',
            '40 weeks':'40w',
            '41 weeks':'41w',
            '42 weeks':'42w',
            '43 weeks':'43w',
            '44 weeks':'44w',
            '45 weeks':'45w',
            '46 weeks':'46w',
            '47 weeks':'47w',
            '42 weeks and over':'42w+',
            '100 - 199 grams':'100-199gm',
            '200 - 299 grams':'200-299gm',
            '300 - 399 grams':'300-399gm',
            '400 - 499 grams':'400-499gm',
            '500 - 599 grams':'500-599gm',
            'Quadruplet':'Quadr',
            'Quintuplet or higher':'Quin or High',
            '1st child born alive to mother':'1st',
            '2nd child born alive to mother':'2nd',
            '3rd child born alive to mother':'3rd',
            '4th child born alive to mother':'4th',
            '5th child born alive to mother':'5th',
            '6th child born alive to mother':'6th',
            '7th child born alive to mother':'7th',
            '8 or more live births':'8th or more',
            'In Hospital':'In Hosp',
            'Freestanding Birthing Center':'FBC',
            'Clinic / Doctor’s Office':'Clinic/DO',
            'Doctor of Medicine (MD)':'MD',
            'Doctor of Osteopathy (DO)':'DO',
            'Certified Nurse Midwife (CNM)':'CNM',
            'Other Midwife':'Midwife',
            'Unknown or not stated':'Unknown',
            'Unknown or Not Stated':'Unknown',
            'Ages 13 years and older':'13+',
            'Age 15 and older':'15+',
            '0 – 8 years':'0-8y',
            '9 – 11 years':'9-11y',
            '12 years':'12y',
            '13 – 15 years':'13-15y',
            '16 years and over':'16y+',
            '8th grade or less':'8th or less',
            '9th through 12th grade with no diploma':'9-12',
            'High school graduate or GED completed':'High school/GED',
            'Some college credit, but not a degree':'Some college',
            'Associate degree (AA,AS)':'AA,AS',
            'Bachelor’s degree (BA, AB, BS)':'Bachelor’s',
            'Master’s degree (MA, MS, MEng, MEd, MSW, MBA)':'Master’s',
            'Doctorate (PhD, EdD) or Professional Degree (MD, DDS, DVM, LLB, JD)':'PHD,EdD',
            'Sunday':'Sun',
            'Monday':'Mon',
            'Tuesday':'Tue',
            'Wednesday':'Wed',
            'Thursday':'Thur',
            'Friday':'Fri',
            'Saturday':'Sat',
            'January':'Jan',
            'February':'Feb',
            'March':'Mar',
            'April':'Apr',
            'May':'May',
            'June':'Jun',
            'July':'Jul',
            'August':'Aug',
            'September':'Sep',
            'October':'Oct',
            'November':'Nov',
            'December':'Dec',
            'Census Region 1: Northeast':'CENS-R1',
            'Division 1: New England':'CENS-D1',
            'Division 2: Middle Atlantic':'CENS-D2',
            'Census Region 2: Midwest':'CENS-R2',
            'Division 3: East North Central':'CENS-D3',
            'Division 4: West North Central':'CENS-D4',
            'Census Region 3: South':'CENS-R3',
            'Division 5: South Atlantic':'CENS-D5',
            'Division 6: East South Central':'CENS-D6',
            'Division 7: West South Central':'CENS-D7',
            'Census Region 4: West':'CENS-R4',
            'Division 8: Mountain':'CENS-D8',
            'Division 9: Pacific':'CENS-D9',
            'HHS Region #1  CT, ME, MA, NH, RI, VT':'HHS1',
            'HHS Region #2  NJ, NY':'HHS2',
            'HHS Region #3  DE, DC, MD, PA, VA, WV':'HHS3',
            'HHS Region #4  AL, FL, GA, KY, MS, NC, SC, TN':'HHS4',
            'HHS Region #5  IL, IN, MI, MN, OH, WI':'HHS5',
            'HHS Region #6  AR, LA, NM, OK, TX':'HHS6',
            'HHS Region #7  IA, KS, MO, NE':'HHS7',
            'HHS Region #8  CO, MT, ND, SD, UT, WY':'HHS8',
            'HHS Region #9  AZ, CA, HI, NV':'HHS9',
            'HHS Region #10  AK, ID, OR, WA':'HHS10',
            'Alabama':'AL',
            'Alaska':'AK',
            'Arizona':'AZ',
            'Arkansas':'AR',
            'California':'CA',
            'Colorado':'CO',
            'Connecticut':'CT',
            'Delaware':'DE',
            'District of Columbia':'DC',
            'Florida':'FL',
            'Georgia':'GA',
            'Hawaii':'HI',
            'Idaho':'ID',
            'Illinois':'IL',
            'Indiana':'IN',
            'Iowa':'IA',
            'Kansas':'KS',
            'Kentucky':'KY',
            'Louisiana':'LA',
            'Maine':'ME',
            'Maryland':'MD',
            'Massachusetts':'MA',
            'Michigan':'MI',
            'Minnesota':'MN',
            'Mississippi':'MS',
            'Missouri':'MO',
            'Montana':'MT',
            'Nebraska':'NE',
            'Nevada':'NV',
            'New Hampshire':'NH',
            'New Jersey':'NJ',
            'New Mexico':'NM',
            'New York':'NY',
            'North Carolina':'NC',
            'North Dakota':'ND',
            'Ohio':'OH',
            'Oklahoma':'OK',
            'Oregon':'OR',
            'Pennsylvania':'PA',
            'Rhode Island':'RI',
            'South Carolina':'SC',
            'South Dakota':'SD',
            'Tennessee':'TN',
            'Texas':'TX',
            'Utah':'UT',
            'Vermont':'VT',
            'Virginia':'VA',
            'Washington':'WA',
            'West Virginia':'WV',
            'Wisconsin':'WI',
            'Wyoming':'WY',
            '1st month':'1st',
            '2nd month':'2nd',
            '3rd month':'3rd',
            '4th month':'4th',
            '5th month':'5th',
            '6th month':'6th',
            '7th month':'7th',
            '8th month':'8th',
            '9th month':'9th',
            '10th month':'10th',
            'Age not stated': 'Not stated',
            '100+ years':'100+',
            '95 - 99 years':'95-99',
            '90 - 94 years':'90-94',
            '85 - 89 years':'85-89',
            '80 - 84 years':'80-84',
            '75 - 79 years':'75-79',
            '70 - 74 years':'70-74',
            '65 - 69 years':'65-69',
            '60 - 64 years':'60-64',
            '55 - 59 years':'55-59',
            '50 - 54 years':'50-54',
            '45 - 49 years':'45-49',
            '40 - 44 years':'40-44',
            '35 - 39 years':'35-39',
            '30 - 34 years':'30-34',
            '25 - 29 years':'25-29',
            '20 - 24 years':'20-24',
            '15 - 19 years':'15-19',
            '10 - 14 years':'10-14',
            '5 - 9 years':'5-9',
            '1 - 4 years':'1-4',
            '< 1 year':'<1',
            '50 years and over':'50+ years',
            'Under 15 years':'< 15 years',
            'Unknown or Missing':'Unknown',
            'Primary and Secondary Syphilis':'Syphilis',
            'Early Latent Syphilis': 'EL Syphilis',
            'Congenital Syphilis':'C Syphilis',
            'All transmission categories':'All',
            'Heterosexual contact':'Heterosexual',
            'Injection drug use':'Injection',
            'Male-to-male sexual contact':'Male-to-male',
            'Male-to-male sexual contact and injection drug use':'M-to-M/Inject',
            '600 - 699 grams':'600-699gm',
            '700 - 799 grams':'700-799gm',
            '800 - 899 grams':'800-899gm',
            '900 - 999 grams':'900-999gm',
            '1000 - 1099 grams':'1000-1099gm',
            '1100 - 1199 grams':'1100-1199gm',
            '1200 - 1299 grams':'1200-1299gm',
            '1300 - 1399 grams':'1300-1399gm',
            '1400 - 1499 grams':'1400-1499gm',
            '1500 - 1599 grams':'1500-1599gm',
            '1600 - 1699 grams':'1600-1699gm',
            '1700 - 1799 grams':'1700-1799gm',
            '1800 - 1899 grams':'1800-1899gm',
            '1900 - 1999 grams':'1900-1999gm',
            '2000 - 2099 grams':'2000-2099gm',
            '2100 - 2199 grams':'2100-2199gm',
            '2200 - 2299 grams':'2200-2299gm',
            '2300 - 2399 grams':'2300-2399gm',
            '2400 - 2499 grams':'2400-2499gm',
            '2500 - 2599 grams':'2500-2599gm',
            '2600 - 2699 grams':'2600-2699gm',
            '2700 - 2799 grams':'2700-2799gm',
            '2800 - 2899 grams':'2800-2899gm',
            '2900 - 2999 grams':'2900-2999gm',
            '3000 - 3099 grams':'3000-3099gm',
            '3100 - 3199 grams':'3100-3199gm',
            '3200 - 3299 grams':'3200-3299gm',
            '3300 - 3399 grams':'3300-3399gm',
            '3400 - 3499 grams':'3400-3499gm',
            '3500 - 3599 grams':'3500-3599gm',
            '3600 - 3699 grams':'3600-3699gm',
            '3700 - 3799 grams':'3700-3799gm',
            '3800 - 3899 grams':'3800-3899gm',
            '3900 - 3999 grams':'3900-3999gm',
            '4000 - 4099 grams':'4000-4099gm',
            '4100 - 4199 grams':'4100-4199gm',
            '4200 - 4299 grams':'4200-4299gm',
            '4300 - 4399 grams':'4300-4399gm',
            '4400 - 4499 grams':'4400-4499gm',
            '4500 - 4599 grams':'4500-4599gm',
            '4600 - 4699 grams':'4600-4699gm',
            '4700 - 4799 grams':'4700-4799gm',
            '4800 - 4899 grams':'4800-4899gm',
            '4900 - 4999 grams':'4900-4999gm',
            '5000 - 5099 grams':'5000-5099gm',
            '5100 - 5199 grams':'5100-5199gm',
            '5200 - 5299 grams':'5200-5299gm',
            '5300 - 5399 grams':'5300-5399gm',
            '5400 - 5499 grams':'5400-5499gm',
            '5500 - 5599 grams':'5500-5599gm',
            '5600 - 5699 grams':'5600-5699gm',
            '5700 - 5799 grams':'5700-5799gm',
            '5800 - 5899 grams':'5800-5899gm',
            '5900 - 5999 grams':'5900-5999gm',
            '6000 - 6099 grams':'6000-6099gm',
            '6100 - 6199 grams':'6100-6199gm',
            '6200 - 6299 grams':'6200-6299gm',
            '6300 - 6399 grams':'6300-6399gm',
            '6400 - 6499 grams':'6400-6499gm',
            '6500 - 6599 grams':'6500-6599gm',
            '6600 - 6699 grams':'6600-6699gm',
            '6700 - 6799 grams':'6700-6799gm',
            '6800 - 6899 grams':'6800-6899gm',
            '6900 - 6999 grams':'6900-6999gm',
            '7000 - 7099 grams':'7000-7099gm',
            '7100 - 7199 grams':'7100-7199gm',
            '7200 - 7299 grams':'7200-7299gm',
            '7300 - 7399 grams':'7300-7399gm',
            '7400 - 7499 grams':'7400-7499gm',
            '7500 - 7599 grams':'7500-7599gm',
            '7600 - 7699 grams':'7600-7699gm',
            '7700 - 7799 grams':'7700-7799gm',
            '7800 - 7899 grams':'7800-7899gm',
            '7900 - 7999 grams':'7900-7999gm',
            '8000 - 8099 grams':'8000-8099gm',
            '8100 - 8165 grams':'8100-8165gm',
            '1499 grams or less':'<1500gm',
            '1500 - 2499 grams':'1500-2499gm',
            '2500 grams or more':'2500gm+',
            '499 grams or less':'<500gm',
            '500 - 999 grams':'500-999gm',
            '1000 - 1499 grams':'1000-1499gm',
            '1500 - 1999 grams':'1500-1999gm',
            '2000 - 2499 grams':'2000-2499gm',
            '2500 - 2999 grams':'2500-2999gm',
            '3000 - 3499 grams':'3000-3499gm',
            '3500 - 3999 grams':'3500-3999gm',
            '4000 - 4499 grams':'4000-4499gm',
            '4500 - 4999 grams':'4500-4999gm',
            '5000 - 8165 grams':'5000-8165gm'
            };
                var abbrv = chartAbbreviations[label];
                return abbrv?abbrv:label;
        }

        // plotly layout for quick view
        function quickChartLayout(){
                return {
                    width: $window.innerWidth * 0.32,
                    autosize: true,
                    showlegend: true,
                    legend : {orientation: "h",
                        y: 1.25,
                        x: .4,
                    },
                    xaxis: {visible: true, titlefont:{size: 15}, exponentformat: 'auto', tickangle: 45, showline: true, gridcolor: '#bdbdbd', showticklabels: true, fixedrange: true},
                    yaxis: {visible: true, titlefont:{size: 15}, exponentformat: 'auto', tickangle: 45, ticksuffix: '   ',showline: true,gridcolor: '#bdbdbd', showticklabels: true, fixedrange: true},
                    margin : {l:100, r:10, b:100, t:50}
                }       
        }

        function getColorPallete(){
             return ["#ED93CB", "#65c2ff", "#FFCC9A", "#56b783", "#FF9F4A", "#fdac5c", "#61B861", "#B2E7A7 ", "#DB5859", "#FFB2B0 ", "#AF8DCE", "#D4C4E0 ", "#A98078", "#D3B5AF", "#64D7D6", "#44558F", "#FFE495", "#1684A7 ", "#7577CD", "#6A759B", "#F6EC72", "#F97300 ", "#FD6378", "#390050", "#970747"]
        }
        
        function getSelectedOptionTitlesOfFilter(filter) {
            var options = [];
            //filters options with checkboxes
            if (angular.isArray(filter.value)) {
                angular.forEach(filter.value, function (optionKey) {
                    var option = utilService.findByKeyAndValue(filter.autoCompleteOptions, 'key', optionKey);
                    options.push(option.title);
                });
            } else {//for filters with radios
                var option = utilService.findByKeyAndValue(filter.autoCompleteOptions, 'key', filter.value);
                options.push(option.title);
            }

            return options.join(', ');
        }

        function getLongChartTitle(primaryFilter, filter1, filter2){
             var chartVars;
             if (filter2){
                chartVars= $translate.instant(filter1.title) + ' and ' + $translate.instant(filter2.title);
             }else{
                chartVars= $translate.instant(filter1.title);
             }
            
            var measure;
            if(primaryFilter.key == 'mental_health' || primaryFilter.key == 'prams' ||primaryFilter.key == 'brfss'){ //Dont use tableView for stats datasets, as tableView captures topics and not views 
                measure = $translate.instant('chart.title.measure.'+primaryFilter.key);       
                chartVars= $translate.instant(filter1.title);
            }else{
                measure= $translate.instant('chart.title.measure.'+(primaryFilter.tableView?primaryFilter.tableView:primaryFilter.key) + (primaryFilter.chartView?('.'+primaryFilter.chartView):''));
            }
            var statefilter;
            var yearfilter;
            angular.forEach(primaryFilter.allFilters, function(filter){
                if (filter.key === 'state' || filter.key === 'yrbsState'){
                     if(Array.isArray(filter.value) && filter.value.length > 3){
                         statefilter = 'selected States';
                     } else if(filter.value.length > 0){
                         statefilter = getSelectedOptionTitlesOfFilter(filter);
                     } else {
                         statefilter = 'US'
                     }
                } else if (filter.key === 'year' || filter.key === 'current_year' || filter.key === 'year_of_death'){
                     if(Array.isArray(filter.value) && filter.value.length > 3){
                       yearfilter = 'selected Years';
                     }else if(filter.value.length > 0){
                        yearfilter = getSelectedOptionTitlesOfFilter(filter);
                     } else{
                        yearfilter = filter.autoCompleteOptions[filter.autoCompleteOptions.length-1].title+ ' - ' + filter.autoCompleteOptions[0].title ;
                     }
                } 
            });

            return measure+ ' by ' + chartVars + ' in '+ statefilter+' for '+yearfilter;
        }

        function horizontalStack(filter1, filter2, data, primaryFilter, postFixToTooltip) {
            return plotlyHorizontalChart(filter1, filter2, data, primaryFilter, true, postFixToTooltip);
        }

        function verticalStack(filter1, filter2, data, primaryFilter) {
            return plotlyVerticalChart(filter1, filter2, data, primaryFilter, true);
        }

        function horizontalBar(filter1, filter2, data, primaryFilter, postFixToTooltip) {
            return plotlyHorizontalChart(filter1, filter2, data, primaryFilter, false, postFixToTooltip);
        }

        function verticalBar(filter1, filter2, data, primaryFilter) {
            return plotlyVerticalChart(filter1, filter2, data, primaryFilter, false);
        }

        /**
         * Get chart axis value from given data Object
         * @param filter
         * @param data
         * @returns {Number}
         */
        function getValueFromData(filter, data) {
            if(filter.tableView == "crude_death_rates" || filter.tableView == "birth_rates"
                || filter.tableView == "fertility_rates" || filter.chartView == "disease_rate" 
                || filter.tableView === 'crude_cancer_incidence_rates' || filter.tableView === 'crude_cancer_death_rates') {
                if(data[filter.key] >= 0) { // calculate rate if count is available, else return the notavailable or suppressed value
                    return !isNaN(data['pop']) ? Math.round(data[filter.key] / data['pop'] * 1000000) / 10 : -2;
                }else {
                    return data[filter.key] ;
                }
            }
            else if(filter.chartView == "infant_death_rate") {
                if(!isNaN(data['deathRate'])) {
                    return $filter('number')(data['deathRate'], 1)
                }
                else {
                    return data['deathRate'] === 'suppressed' ? -1 : -2;
                }
            }
            else if(data['ageAdjustedRate'] && filter.tableView == "age-adjusted_death_rates"){
                var ageAdjustedRate = parseFloat(data['ageAdjustedRate'].replace(/,/g, ''));
                //parsing string to return floating point number
                return ageAdjustedRate == NaN ? data['ageAdjustedRate'] : ageAdjustedRate ;
            }
            else {
                if(filter.tableView === 'number_of_infant_deaths' && data[filter.key] === 'suppressed' ) {
                    return -1;
                }
                else {
                    return data[filter.key];
                }
            }
        }

        /**
         * To get right chart label for given table view
         * @param tableView
         * @param chartLabel
         * @return String chart label
         */
        function getAxisLabel(tableView, chartLabel){
            switch (tableView) {
                case "crude_death_rates":
                    return "Crude Death Rates";
                    break;
                case "age-adjusted_death_rates":
                    return "Age Adjusted Death Rates";
                    break;
                case "birth_rates":
                    return "Birth Rates";
                    break;
                case "fertility_rates":
                    return "Fertility Rates";
                    break;
                case "crude_cancer_death_rates":
                    return "Cancer Death Rates";
                    break;
                case "crude_cancer_incidence_rates":
                    return "Cancer Incidence Rates";
                    break;          
                default:
                    return chartLabel;
            }
        }

        function plotlyHorizontalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip){
            var chartdata = horizontalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip);
            var colors = getColorPallete();    
            var layout = quickChartLayout();
            layout.xaxis.title = getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel)
            layout.yaxis.title = $translate.instant(filter2.title);
            layout.margin.b = 50;
            var longtitle = getLongChartTitle(primaryFilter, filter1, filter2);
            layout.barmode = (stacked && longtitle.indexOf('Rates') < 0)?'stack':'bar';
            var plotydata = [];
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var trace = chartdata.data[i];
                // The additional white space on the name is added as a hack for fixing the legend string getting cut off issue
                var reg = {namelong: trace.key + '     ', name: getAbbreviation(trace.key) + '     ', x: [], y: [], ylong:[], text: [], orientation: 'h',  hoverinfo: 'none', type: 'bar',  marker :{color: colors[i%colors.length]}};
                for (var j = trace.values.length - 1 ; j >=0 ; j-- ){
                    var value  = trace.values[j];
                    reg.y.push(getAbbreviation(value.label));
                    reg.ylong.push(value.label);
                    reg.x.push(value.value < 0?0:value.value);
                    reg.text.push(getSuppressedCount(value.value, primaryFilter));
                }
                plotydata.push(reg);
            }
            if(plotydata.length > 7){
                layout.legend = {
                    orientation: "v",
                    x: 1.01,
                    y: .4,
                };
                layout.margin.r = 100;
                layout.margin.t = 50;
            }
            return { charttype:chartdata.options.chart.type, title: chartdata.title, longtitle: longtitle, dataset: chartdata.dataset, data:plotydata, layout: layout, options: {displayModeBar: false}};
        }

        function plotlyVerticalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip){
            var chartdata = verticalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip);
            var layout = quickChartLayout();
            layout.margin.l = 75;
            layout.xaxis.title = $translate.instant(filter2.title);
            layout.yaxis.title = getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel);
            var colors = getColorPallete();    
            var longtitle = getLongChartTitle(primaryFilter, filter1, filter2);
            layout.barmode = (stacked && longtitle.indexOf('Rates') < 0) ?'stack':'bar';
            var plotydata = [];
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var trace = chartdata.data[i];
                // The additional white space on the name is added as a hack for fixing the legend string getting cut off issue
                var reg = {namelong: trace.key+ '     ', name: getAbbreviation(trace.key)+ '     ', xlong:[], x: [], y: [], text: [], orientation: 'v', type: 'bar', hoverinfo: 'none', marker :{color: colors[i%colors.length]}};
                for (var j = trace.values.length - 1 ; j >=0 ; j-- ){
                    var value  = trace.values[j];
                    reg.x.push(getAbbreviation(value.x));
                    reg.xlong.push(value.x);
                    reg.y.push(value.y < 0 ? 0:value.y);
                    reg.text.push(getSuppressedCount(value.y, primaryFilter));

                }
                plotydata.push(reg);
            }
            if(plotydata.length > 7){
                layout.legend = {
                    orientation: "v",
                    x: 1.01,
                    y: .4,
                };
            }
            return { charttype:chartdata.options.chart.type, title:chartdata.title, longtitle: longtitle, dataset: chartdata.dataset, data:plotydata, layout: layout, options: {displayModeBar: false}};
        }

        function plotlyLineChart(data, filter, primaryFilter){
            var chartdata = lineChart (data, filter, primaryFilter);
            var layout = quickChartLayout();
            layout.xaxis.title = "Year";
            layout.yaxis.title = "Population";
            layout.xaxis.type = "category";
            var colors = getColorPallete();    
            var linedata = chartdata.data();
            var plotydata = {namelong: linedata[0].key, name: getAbbreviation(linedata[0].key), xlong: [], x: [], y: [], text:[], type: 'scatter', hoverinfo: 'none', marker :{color: colors[i%colors.length]}};
            for (var i = linedata[0].values.length -1 ; i >= 0 ; i-- ){
                var value  = linedata[0].values[i];
                plotydata.x.push(getAbbreviation(value.x));
                plotydata.xlong.push(value.x);
                plotydata.y.push(value.y < 0 ? 0:value.y);
                plotydata.text.push(getSuppressedCount(value.y, primaryFilter));
            }
            return { charttype:chartdata.options.chart.type, title: chartdata.title, longtitle: getLongChartTitle(primaryFilter, filter), dataset: chartdata.dataset, data:[plotydata], layout: layout, options: {displayModeBar: false}};
        }

        function plotlyMultiLineChart(filter1, filter2, data, primaryFilter){
            var layout = quickChartLayout();
            layout.margin.b = 50;
            layout.margin.l = 50;
            layout.xaxis.title = $translate.instant(filter2.title);
            layout.xaxis.type = "category";
            layout.yaxis.title = getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel);

            var colors = getColorPallete();    
            var plotlydata = [];
            angular.forEach(utilService.getSelectedAutoCompleteOptions(filter1), function (primaryOption,index) {
                    var eachPrimaryData = utilService.findByKeyAndValue(data[filter1.key], 'name', primaryOption.key);

                    var plotlyseries= {namelong: primaryOption.title, name: getAbbreviation(primaryOption.title), xlong: [], x: [], y: [], text:[], type: 'scatter', hoverinfo: 'none', marker :{color: colors[index%colors.length]}};
                    if(eachPrimaryData && eachPrimaryData[filter2.key]) {
                        angular.forEach(utilService.getSelectedAutoCompleteOptions(filter2) , function (secondaryOption,j) {
                            if (!secondaryOption.disabled) {
                                var eachSecondaryData = utilService.findByKeyAndValue(eachPrimaryData[filter2.key], 'name', secondaryOption.key);
                                var value = undefined;
                                if (eachSecondaryData) {
                                    value = getValueFromData(primaryFilter, eachSecondaryData);
                                }
                                if (value !== undefined) {
                                    plotlyseries.x.push(getAbbreviation(secondaryOption.key));
                                    plotlyseries.xlong.push(secondaryOption.key);
                                    plotlyseries.y.push(value < 0 ? 0:value);
                                    plotlyseries.text.push(getSuppressedCount(value, primaryFilter));
                                }
                            }
                        });
                        plotlydata.push(plotlyseries);
                    }
                });
            return { charttype:'multiLineChart', title: $translate.instant("label.title."+filter1.key+"."+filter2.key), longtitle: getLongChartTitle(primaryFilter, filter1, filter2), dataset: primaryFilter.key, data:plotlydata, layout: layout, options: {displayModeBar: false}};
        }

        // The pie chart is displayed as bar chart        
        function  plotlyPieChart(data, filter, primaryFilter, postFixToTooltip ) {
            var chartdata  = pieChart(data, filter, primaryFilter, postFixToTooltip);
            var colors = getColorPallete();    
            var layout = quickChartLayout(chartdata);
            layout.xaxis.title = getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel);
            layout.yaxis.title = $translate.instant(filter.title);
            layout.yaxis.type = "category";
            var plotydata = [];
            for (var i = chartdata.data.length -1 ; i >= 0 ; i-- ){
                var trace = chartdata.data[i];
                // The additional white space on the name is added as a hack for fixing the legend string getting cut off issue
                var reg = {namelong: trace.label, name: getAbbreviation(trace.label) + '     ', x: [], ylong: [], y: [], text: [], orientation: 'h', type: 'bar', hoverinfo: 'none', marker :{color: colors[i%colors.length]}};
                    reg.y.push(getAbbreviation(trace.label));
                    reg.ylong.push(trace.label);
                    reg.x.push(trace.value<0?0:trace.value);
                    reg.text.push(getSuppressedCount(trace.value, primaryFilter));
                
                plotydata.push(reg);
            }
            if(plotydata.length > 7){
                layout.legend = {
                    orientation: "v",
                    x: 1.01,
                    y: .4,
                };
            }
            return { charttype:chartdata.options.chart.type, title: chartdata.title, longtitle: getLongChartTitle(primaryFilter, filter, null), dataset: chartdata.dataset, data:plotydata, layout: layout, options: {displayModeBar: false}};

        }

        /*Multi Bar Horizontal Chart*/
        function horizontalChart(filter1, filter2, data, primaryFilter, stacked, postFixToTooltip) {

            postFixToTooltip = postFixToTooltip ? postFixToTooltip : '';
            var chartData = {
                data: [],
                dataset: primaryFilter.key,
                title:  $translate.instant(filter1.title) + ' and ' + $translate.instant(filter2.title),
                options: {
                    "chart": {
                        "type": "multiBarHorizontalChart",
                        stacked: stacked && primaryFilter.tableView && primaryFilter.tableView.indexOf('rate') < 0,
                        "xAxis": {
                            "axisLabel": getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel)
                        },
                        "yAxis": {
                            "axisLabel": $translate.instant(filter2.title)
                        }
                    }
                }
            };
            var multiChartBarData = [];

            if (primaryFilter.key == 'mental_health'
                || primaryFilter.key === 'prams' || primaryFilter.key === 'brfss') {

                var getBarValues = function (barData, filter) {
                    var barValues = [];
                    angular.forEach(utilService.getSelectedAutoCompleteOptions(filter), function (option,index) {
                        //get data for series
                        var eachPrimaryData = utilService.findByKeyAndValue(barData, 'name', option.key);
                        //skip missing data for prams chart
                        if(primaryFilter.key === 'prams' && !eachPrimaryData) {
                            return;
                        }
                        //set data to series values
                        barValues.push({"label":option.title, "value":
                            (eachPrimaryData &&  eachPrimaryData[primaryFilter.key]) ?
                                parseFloat(eachPrimaryData[primaryFilter.key].mean) : 0});

                    });
                    return barValues;
                };
                //if primary and secondary filters are same i.e. Single filter
                if (filter1.queryKey == filter2.queryKey) {
                    var seriesDataObj = {};
                    //series name
                    seriesDataObj["key"] = primaryFilter.chartAxisLabel;
                    //collect series values
                    var question = data.question[0];
                    var questionArray = [];
                    angular.forEach(data.question, function(pramsQuestion) {
                        if(pramsQuestion.name === primaryFilter.allFilters[4].value[0]) {
                            question = pramsQuestion;
                        }
                    });

                    angular.forEach(question, function(response, responseKey) {
                        if(typeof response === 'object' && responseKey != -1) {
                            question = response;
                            var seriesDataObj = {};
                            seriesDataObj["key"] = primaryFilter.chartAxisLabel;
                            seriesDataObj["key"] += ' - ' + responseKey;
                            seriesDataObj["values"] = getBarValues(question[filter1.queryKey], filter1);
                            multiChartBarData.push(seriesDataObj);
                        }
                    });


                } else {//for two filters
                    angular.forEach(utilService.getSelectedAutoCompleteOptions(filter1), function (primaryOption,index) {
                        var seriesDataObj = {};
                        var question = data.question[0];
                        question = data.question[1][0];
                        angular.forEach(data.question[1], function(response) {
                            if(typeof response === 'object') {
                                question = response;
                            }
                        });
                        var eachPrimaryData = utilService.findByKeyAndValue(question[filter1.queryKey], 'name', primaryOption.key);
                        if(!eachPrimaryData) {
                            return;
                        }
                        //Set name to series
                        seriesDataObj["key"] = primaryOption.title;

                        //collect series values
                        seriesDataObj["values"] = getBarValues(eachPrimaryData[filter2.queryKey], filter2);
                        multiChartBarData.push(seriesDataObj);
                    });
                }

            } else if(data && data[filter1.key]) {
                angular.forEach(utilService.getSelectedAutoCompleteOptions(filter1), function (primaryOption,index) {
                    var primaryDataObj = {};
                    var eachPrimaryData = utilService.findByKeyAndValue(data[filter1.key], 'name', primaryOption.key);

                    primaryDataObj["key"] = primaryOption.title;
                  
                    primaryDataObj["values"] = [];
                    if(eachPrimaryData) {
                        primaryDataObj[primaryFilter.key] = getValueFromData(primaryFilter, eachPrimaryData);
                    }
                    if(eachPrimaryData && eachPrimaryData[filter2.key]) {
                        angular.forEach(utilService.getSelectedAutoCompleteOptions(filter2) , function (secondaryOption,j) {
                            if (!secondaryOption.disabled) {
                                var eachSecondaryData = utilService.findByKeyAndValue(eachPrimaryData[filter2.key], 'name', secondaryOption.key);
                                var value = undefined;
                                if (eachSecondaryData) {
                                    value = getValueFromData(primaryFilter, eachSecondaryData);
                                }
                                if (value !== undefined) {
                                    primaryDataObj.values.push({ "label": secondaryOption.title, "value": value });
                                }
                            }
                        });
                        multiChartBarData.push(primaryDataObj);
                    }
                });
            }

            chartData.data = multiChartBarData;
            return chartData;
        }

        /*Vertical Stacked Chart*/
        function verticalChart(filter1, filter2, data, primaryFilter, stacked) {

            var chartData = {
                data: [],
                dataset: primaryFilter.key,
                title: $translate.instant(filter1.title) + ' and ' + $translate.instant(filter2.title),
                options: {
                    "chart": {
                        "type": "multiBarChart",
                        "stacked": stacked,
                        "xAxis": {
                            "axisLabel": $translate.instant(filter2.title)
                        },
                        "yAxis": {
                            "axisLabel": getAxisLabel(primaryFilter.tableView, primaryFilter.chartAxisLabel)
                        }
                    }
                }
            };

            var multiBarChartData = [];
            if(data && data[filter1.key]){
                angular.forEach(utilService.getSelectedAutoCompleteOptions(filter1), function (primaryOption,index) {
                    var eachPrimaryData = utilService.findByKeyAndValue(data[filter1.key], 'name', primaryOption.key);
                    var primaryObj = {};
                    primaryObj["key"] = primaryOption.title;
                    primaryObj["values"] = [];

                    if(eachPrimaryData && eachPrimaryData[filter2.key]) {
                        var secondaryArrayData = utilService.sortByKey(eachPrimaryData[filter2.key], 'name');
                        angular.forEach(utilService.getSelectedAutoCompleteOptions(filter2), function (secondaryOption,j) {
                            var eachSecondaryData = utilService.findByKeyAndValue(secondaryArrayData, 'name', secondaryOption.key);
                            var yAxisValue = undefined;
                            if(eachSecondaryData &&  eachSecondaryData[primaryFilter.key]) {
                                yAxisValue =  getValueFromData(primaryFilter, eachSecondaryData);
                            }

                            if (yAxisValue !== undefined) {
                                primaryObj.values.push(
                                    { x : secondaryOption.title, y : yAxisValue }
                                );
                            }

                        });
                        multiBarChartData.push(primaryObj);
                    }
                });
            }
            chartData.data = multiBarChartData;
            return chartData;
        }

        function lineChart(data, filter, primaryFilter) {

            var chartData = {
                data: [],
                dataset: primaryFilter.key,
                title: $translate.instant(filter.title),
                options: {
                    "chart": {
                        "type": "lineChart",
                        "xAxis": {
                            "axisLabel": "Year",
                        },
                        "yAxis": {
                            "axisLabel": "Population",
                        },
                    }
                }
            };

            chartData.data = function () {
                var lineData = [];
                angular.forEach(utilService.getSelectedAutoCompleteOptions(filter), function(eachOption) {
                    var eachRow = utilService.findByKeyAndValue(data, 'name', eachOption.key);
                    var yAxisValue = undefined;
                    if(eachRow) {
                        yAxisValue =  getValueFromData(primaryFilter, eachRow);
                    }
                    if (yAxisValue !== undefined) {
                        lineData.push({x: eachOption.title, y: yAxisValue});
                    }
                });

                //Line chart data should be sent as an array of series objects.
                return [
                    {
                        values: lineData,      //values - represents the array of {x,y} data points
                        key: 'Population', //key  - the name of the series.
                        color: '#ff7f0e',  //color - optional: choose your own line color.
                        strokeWidth: 2,
                        classed: 'nvd3-dashed-line'
                    }
                ];
            };

            return chartData;
        }

        /*Prepare pie chart for single filter*/
        function pieChart( data, filter, primaryFilter, postFixToTooltip ) {
            postFixToTooltip = postFixToTooltip ? postFixToTooltip : '';
            var chartData = {
                data: [],
                dataset: primaryFilter.key,
                title:  $translate.instant(filter.title),
                options: {
                    chart: {
                        type: 'pieChart',
                        yAxis: {
                            axisLabel: $translate.instant("label.filter."+filter.key),
                            
                        },
                        xAxis: {
                            axisLabel: $translate.instant('chart.title.measure.'+(primaryFilter.tableView?primaryFilter.tableView:primaryFilter.key)),                            
                        }
                    }}
            };
            angular.forEach(utilService.getSelectedAutoCompleteOptions(filter), function(eachOption) {
                var eachRow = utilService.findByKeyAndValue(data, 'name', eachOption.key);
                var value = undefined;
                if(eachRow) {
                    value =  getValueFromData(primaryFilter, eachRow);
                }

                if (value !== undefined) {
                    chartData.data.push({label: eachOption.title, value: value});
                }
            });
            return chartData;
        }

        function countBars(data, stacked) {
            if(stacked){
                return data[0].x.length
            }                
            else {
                 return data[0].x.length * data.length;
            }
        }


        /*Show expanded graphs with whole set of features*/
        function showExpandedGraph(chartData, tableView, graphTitle, graphSubTitle,
                                   chartTypes, primaryFilters, selectedQuestion, selectedFiltersTxt ) {
            
            /**
             * Update chart dimensions and data
             */
            var updateChart = function (chartdata, tableView) {

                graphTitle = graphTitle ? graphTitle : (chartData.length > 1? 'label.graph.expanded': chartData[0].title);
                var expandedChartData = [];
                angular.forEach(chartdata, function(eachChartData) {
                       var layout = utilService.clone(eachChartData.layout);
                       var plotlydata = utilService.clone(eachChartData.data);
                       plotlydata.forEach(function (data) {
                           data.name = data.namelong;
                           if (data.xlong){
                               data.x = data.xlong;
                           }else {
                               data.y = data.ylong;
                           }
                       });
                        // Set chart title
                       layout.title = eachChartData.longtitle;
                       layout.width = 1000;
                       layout.height = 750;
                       layout.showlegend= true;
                       if(eachChartData.charttype !== "multiLineChart") {
                           layout.legend = {
                               orientation: "v",
                               x: 1.01,
                               y: .4,
                           }
                           ;
                       }else {
                           layout.legend ={orientation: "h",
                               y: 1.15,
                               x: .4,
                           };
                           // layout.legend
                       }
                       layout.legend.traceorder = 'reversed';

                       layout.margin = {l:200, r:10, b:200, t:150};
                       layout.xaxis.visible= true;
                       layout.yaxis.visible= true;
                       layout.yaxis.exponentformat = 'none'
                       layout.xaxis.exponentformat = 'none'
                       layout.xaxis.showticklabels= true;
                       layout.yaxis.showticklabels= true;

                        // Update charts width/height based on the number of bars
                       if (eachChartData.charttype === "multiBarChart") {
                           layout.width = Math.max(1000, countBars(eachChartData.data,layout.barmode === 'stack') * 25);
                       }
                       else if (eachChartData.charttype === "multiBarHorizontalChart") {
                            layout.height = Math.max(750, countBars(eachChartData.data,layout.barmode === 'stack') * 25);
                       }
                       if(tableView && tableView.indexOf('rate') >= 0) {
                            layout.barmode = 'bar';
                       }

                    expandedChartData.push({layout:layout, dataset:eachChartData.dataset, data: plotlydata, longtitle: eachChartData.longtitle, charttype: eachChartData.charttype});

                });

                return expandedChartData;
            }

            // Just provide a template url, a controller and call 'showModal'.
            ModalService.showModal({
                templateUrl: "app/partials/expandedGraphModal.html",
                controllerAs: 'eg',
                controller: function ($scope, close, shareUtilService, searchFactory) {
                    var eg = this;
                    eg.chartData = updateChart(chartData, tableView);
                    eg.graphTitle = graphTitle;
                    eg.graphSubTitle = graphSubTitle;
                    eg.chartTypes = chartTypes;
                    eg.primaryFilters = primaryFilters;
                    eg.selectedQuestion = selectedQuestion;
                    eg.close = close;
                    eg.selectedFiltersTxt = selectedFiltersTxt;
                    eg.barmode = eg.chartData[0].layout.barmode;

                    eg.showFbDialog = function(svgIndex, title, section, description) {
                        shareUtilService.shareOnFb(svgIndex, title, section, description);
                    };
              

                    /**
                     * get the display name for chart
                     * @param chartType
                     * @returns {*}
                     */
                    eg.getChartName = function (chartType) {
                        var chartNames = {'yrbsSex&yrbsRace':'Sex and Race', 'yrbsSex&yrbsGrade':'Sex and Grade',
                            'yrbsGrade&yrbsRace': 'Grade and Race', 'yrbsRace': 'Race', 'race': 'Race/Ethnicity',
                            'yrbsSex': 'Sex', 'yrbsGrade': 'Grade', 'year': 'Year', 'state': 'State', 'yrbsState': 'State',
                            'income':'Household Income', 'education':'Education Attained', 'age_group':'Age group', 'sex':'Sex'};

                        if (chartType.length == 1) {
                            return chartNames[chartType[0]];
                        } else {
                            return chartNames[chartType[0]+'&'+chartType[1]];
                        }
                    };

                    /**
                     * Get data for specified chart and update it
                     * @param chartType
                     */
                    eg.getYrbsChartData = function (chartType) {
                        searchFactory.prepareQuestionChart(eg.primaryFilters,
                            eg.selectedQuestion, chartType).then(function (response) {
                            eg.chartData = updateChart([response.chartData]);
                            eg.activeTab = eg.getChartName(chartType);
                        });
                    }
                },
                size:650
            }).then(function (modal) {
                // The modal object has the element built, if this is a bootstrap modal
                // you can call 'modal' to show it, if it's a custom modal just show or hide
                // it as you need to.
                modal.element.show();
                modal.close.then(function (result) {
                    modal.element.hide();
                });
            });

            
        }

        /**
         * If state filter is selected and count is equals 0- return Suppressed
         * Else return actual count
         */
        function getSuppressedCount(count, primaryFilter) {
            if (count == -1){
                 return 'Suppressed';
            }else if (count == -2){
                 return 'Not Available';
            } else {
               return $filter('number')(count);
            }
            
        }
    }
}());
