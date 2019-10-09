(function () {
    'use strict';

    angular
        .module('owh.services').
        service('filterUtils', filterUtils);

    filterUtils.$inject = ['utilService', '$timeout', 'cancerService'];

    /**
     * This utility service is used to prepare the OWH search filters.
     */
    function filterUtils(utilService, $timeout, cancerService) {
        //filter options
        var yearOptions = [
            { "key": "2017", "title": "2017"},
            { "key": "2016", "title": "2016"},
            { "key": "2015", "title": "2015"},
            { "key": "2014", "title": "2014"},
            { "key": "2013", "title": "2013"},
            { "key": "2012", "title": "2012"},
            { "key": "2011", "title": "2011"},
            { "key": "2010", "title": "2010"},
            { "key": "2009", "title": "2009"},
            { "key": "2008", "title": "2008"},
            { "key": "2007", "title": "2007"},
            { "key": "2006", "title": "2006"},
            { "key": "2005", "title": "2005"},
            { "key": "2004", "title": "2004"},
            { "key": "2003", "title": "2003"},
            { "key": "2002", "title": "2002"},
            { "key": "2001", "title": "2001"},
            { "key": "2000", "title": "2000"}
        ];

        var monthOptions = [
            { "key": "January", "title": "January" },
            { "key": "February", "title": "February" },
            { "key": "March", "title": "March" },
            { "key": "April", "title": "April" },
            { "key": "May", "title": "May" },
            { "key": "June", "title": "June" },
            { "key": "July", "title": "July" },
            { "key": "August", "title": "August" },
            { "key": "September", "title": "September" },
            { "key": "October", "title": "October" },
            { "key": "November", "title": "November" },
            { "key": "December", "title": "December" }
        ];

        var weekDayOptions = [
            { "key": "Sunday", "title": "Sunday" },
            { "key": "Monday", "title": "Monday" },
            { "key": "Tuesday", "title": "Tuesday" },
            { "key": "Wednesday", "title": "Wednesday" },
            { "key": "Thursday", "title": "Thursday" },
            { "key": "Friday", "title": "Friday" },
            { "key": "Saturday", "title": "Saturday" },
            { "key": "Unknown",  "title": "Unknown" }
        ];

        var prenatalCareMonthOptions = [
            { "key": "No prenatal care", "title": "No prenatal care" },
            { "key": "1st month", "title": "1st month" },
            { "key": "2nd month", "title": "2nd month" },
            { "key": "3rd month", "title": "3rd month" },
            { "key": "4th month", "title": "4th month" },
            { "key": "5th month", "title": "5th month" },
            { "key": "6th month", "title": "6th month" },
            { "key": "7th month", "title": "7th month" },
            { "key": "8th month", "title": "8th month" },
            { "key": "9th month", "title": "9th month" },
            { "key": "10th month", "title": "10th month" },
            { "key": "Unknown or not stated", "title": "Unknown or not stated" },
            { "key": "Not on certificate", "title": "Not on certificate" }
        ];

        var genderOptions =  [
            { "key": "Female", "title": "Female" },
            { "key": "Male", "title": "Male" }
        ];

        var raceOptions =  [
            { "key": "American Indian", "title": "American Indian or Alaska Native" },
            { "key": "Asian or Pacific Islander", "title": "Asian or Pacific Islander" },
            { "key": "Black", "title": "Black or African American" },
            { "key": "White", "title": "White" }
        ];

        var hispanicOptions =  [
            { "key": "Mexican", "title": "Mexican" },
            { "key": "Puerto Rican", "title": "Puerto Rican" },
            { "key": "Cuban", "title": "Cuban" },
            { "key": "Central or South American", "title": "Central or South American" },
            { "key": "Other and Unknown Hispanic", "title": "Other and Unknown Hispanic" },
            { "key": "Non-Hispanic", "title": "Non-Hispanic" },
            { "key": "Non-Hispanic White", "title": "Non-Hispanic White" },
            { "key": "Non-Hispanic Black", "title": "Non-Hispanic Black" },
            { "key": "Non-Hispanic Other Races", "title": "Non-Hispanic Other Races" },
            { "key": "Origin unknown or not stated", "title": "Origin unknown or not stated" }
        ];

        var singleYearAgeOptions =  [
            { "key": "Under 15 years", "title": "Under 15 years" },
            { "key": "15 years", "title": "15 years" },
            { "key": "16 years", "title": "16 years" },
            { "key": "17 years", "title": "17 years" },
            { "key": "18 years", "title": "18 years" },
            { "key": "19 years", "title": "19 years" },
            { "key": "20 years", "title": "20 years" },
            { "key": "21 years", "title": "21 years" },
            { "key": "22 years", "title": "22 years" },
            { "key": "23 years", "title": "23 years" },
            { "key": "24 years", "title": "24 years" },
            { "key": "25 years", "title": "25 years" },
            { "key": "26 years", "title": "26 years" },
            { "key": "27 years", "title": "27 years" },
            { "key": "28 years", "title": "28 years" },
            { "key": "29 years", "title": "29 years" },
            { "key": "30 years", "title": "30 years" },
            { "key": "31 years", "title": "31 years" },
            { "key": "32 years", "title": "32 years" },
            { "key": "33 years", "title": "33 years" },
            { "key": "34 years", "title": "34 years" },
            { "key": "35 years", "title": "35 years" },
            { "key": "36 years", "title": "36 years" },
            { "key": "37 years", "title": "37 years" },
            { "key": "38 years", "title": "38 years" },
            { "key": "39 years", "title": "39 years" },
            { "key": "40 years", "title": "40 years" },
            { "key": "41 years", "title": "41 years" },
            { "key": "42 years", "title": "42 years" },
            { "key": "43 years", "title": "43 years" },
            { "key": "44 years", "title": "44 years" },
            { "key": "45 years", "title": "45 years" },
            { "key": "46 years", "title": "46 years" },
            { "key": "47 years", "title": "47 years" },
            { "key": "48 years", "title": "48 years" },
            { "key": "49 years", "title": "49 years" },
            { "key": "50-54 years", "title": "50 years and over"}
        ];

        var ageR9Options =  [
            { "key": "Under 15 years", "title": "Under 15 years" },
            { "key": "15-19 years", "title": "15-19 years" },
            { "key": "20-24 years", "title": "20-24 years" },
            { "key": "25-29 years", "title": "25-29 years" },
            { "key": "30-34 years", "title": "30-34 years" },
            { "key": "35-39 years", "title": "35-39 years" },
            { "key": "40-44 years", "title": "40-44 years" },
            { "key": "45-49 years", "title": "45-49 years" },
            { "key": "50-54 years", "title": "50 years and over" }
        ];


        var gestationalAgeAtBirth =  [
            { "key": "Under 20 weeks", "title": "Under 20 weeks" },
            { "key": "20 - 27 weeks", "title": "20 - 27 weeks" },
            { "key": "28 - 31 weeks", "title": "28 - 31 weeks" },
            { "key": "32 - 35 weeks", "title": "32 - 35 weeks" },
            { "key": "36 weeks", "title": "36 weeks" },
            { "key": "37 - 39 weeks", "title": "37 - 39 weeks" },
            { "key": "40 weeks", "title": "40 weeks" },
            { "key": "41 weeks", "title": "41 weeks" },
            { "key": "42 weeks and over", "title": "42 weeks and over" },
            { "key": "Not stated", "title": "Not stated" }
        ];

        var maritalStatusOptions = [
            {key:'Married', title:'Married'},
            {key:'Unmarried', title:'Unmarried'},
            {key:'Unknown or not Stated', title:'Unknown or not Stated'}
        ];

        var educationOptions = [
            {key:'0 - 8 years', title:'0 - 8 years'},
            {key:'9 - 11 years', title:'9 - 11 years'},
            {key:'12 years', title:'12 years'},
            {key:'13 - 15 years', title:'13 - 15 years'},
            {key:'16 years and over', title:'16 years and over'},
            {key:'Not stated', title:'Not stated'},
            {key:'8th grade or less', title:'8th grade or less'},
            {key:'9th through 12th grade with no diploma', title:'9th through 12th grade with no diploma'},
            {key:'High school graduate or GED completed', title:'High school graduate or GED completed'},
            {key:'Some college credit, but not a degree', title:'Some college credit, but not a degree'},
            {key:'Associate degree (AA,AS)', title:'Associate degree (AA,AS)'},
            {key:'Bachelor’s degree (BA, AB, BS)', title:'Bachelor’s degree (BA, AB, BS)'},
            {key:'Master’s degree (MA, MS, MEng, MEd, MSW, MBA)', title:'Master’s degree (MA, MS, MEng, MEd, MSW, MBA)'},
            {key:'Doctorate (PhD, EdD) or Professional Degree (MD, DDS, DVM, LLB, JD)', title:'Doctorate (PhD, EdD) or Professional Degree (MD, DDS, DVM, LLB, JD)'},
            {key:'Unknown', title:'Unknown'},
            {key:'Not on certificate', title:'Not on certificate'}
        ];

        var birthWeightOptions = [
            {key:'100 - 199 grams', title:'100 - 199 grams'},
            {key:'200 - 299 grams', title:'200 - 299 grams'},
            {key:'300 - 399 grams', title:'300 - 399 grams'},
            {key:'400 - 499 grams', title:'400 - 499 grams'},
            {key:'500 - 599 grams', title:'500 - 599 grams'},
            {key:'600 - 699 grams', title:'600 - 699 grams'},
            {key:'700 - 799 grams', title:'700 - 799 grams'},
            {key:'800 - 899 grams', title:'800 - 899 grams'},
            {key:'900 - 999 grams', title:'900 - 999 grams'},
            {key:'1000 - 1099 grams', title:'1000 - 1099 grams'},
            {key:'1100 - 1199 grams', title:'1100 - 1199 grams'},
            {key:'1200 - 1299 grams', title:'1200 - 1299 grams'},
            {key:'1300 - 1399 grams', title:'1300 - 1399 grams'},
            {key:'1400 - 1499 grams', title:'1400 - 1499 grams'},
            {key:'1500 - 1599 grams', title:'1500 - 1599 grams'},
            {key:'1600 - 1699 grams', title:'1600 - 1699 grams'},
            {key:'1700 - 1799 grams', title:'1700 - 1799 grams'},
            {key:'1800 - 1899 grams', title:'1800 - 1899 grams'},
            {key:'1900 - 1999 grams', title:'1900 - 1999 grams'},
            {key:'2000 - 2099 grams', title:'2000 - 2099 grams'},
            {key:'2100 - 2199 grams', title:'2100 - 2199 grams'},
            {key:'2200 - 2299 grams', title:'2200 - 2299 grams'},
            {key:'2300 - 2399 grams', title:'2300 - 2399 grams'},
            {key:'2400 - 2499 grams', title:'2400 - 2499 grams'},
            {key:'2500 - 2599 grams', title:'2500 - 2599 grams'},
            {key:'2600 - 2699 grams', title:'2600 - 2699 grams'},
            {key:'2700 - 2799 grams', title:'2700 - 2799 grams'},
            {key:'2800 - 2899 grams', title:'2800 - 2899 grams'},
            {key:'2900 - 2999 grams', title:'2900 - 2999 grams'},
            {key:'3000 - 3099 grams', title:'3000 - 3099 grams'},
            {key:'3100 - 3199 grams', title:'3100 - 3199 grams'},
            {key:'3200 - 3299 grams', title:'3200 - 3299 grams'},
            {key:'3300 - 3399 grams', title:'3300 - 3399 grams'},
            {key:'3400 - 3499 grams', title:'3400 - 3499 grams'},
            {key:'3500 - 3599 grams', title:'3500 - 3599 grams'},
            {key:'3600 - 3699 grams', title:'3600 - 3699 grams'},
            {key:'3700 - 3799 grams', title:'3700 - 3799 grams'},
            {key:'3800 - 3899 grams', title:'3800 - 3899 grams'},
            {key:'3900 - 3999 grams', title:'3900 - 3999 grams'},
            {key:'4000 - 4099 grams', title:'4000 - 4099 grams'},
            {key:'4100 - 4199 grams', title:'4100 - 4199 grams'},
            {key:'4200 - 4299 grams', title:'4200 - 4299 grams'},
            {key:'4300 - 4399 grams', title:'4300 - 4399 grams'},
            {key:'4400 - 4499 grams', title:'4400 - 4499 grams'},
            {key:'4500 - 4599 grams', title:'4500 - 4599 grams'},
            {key:'4600 - 4699 grams', title:'4600 - 4699 grams'},
            {key:'4700 - 4799 grams', title:'4700 - 4799 grams'},
            {key:'4800 - 4899 grams', title:'4800 - 4899 grams'},
            {key:'4900 - 4999 grams', title:'4900 - 4999 grams'},
            {key:'5000 - 5099 grams', title:'5000 - 5099 grams'},
            {key:'5100 - 5199 grams', title:'5100 - 5199 grams'},
            {key:'5200 - 5299 grams', title:'5200 - 5299 grams'},
            {key:'5300 - 5399 grams', title:'5300 - 5399 grams'},
            {key:'5400 - 5499 grams', title:'5400 - 5499 grams'},
            {key:'5500 - 5599 grams', title:'5500 - 5599 grams'},
            {key:'5600 - 5699 grams', title:'5600 - 5699 grams'},
            {key:'5700 - 5799 grams', title:'5700 - 5799 grams'},
            {key:'5800 - 5899 grams', title:'5800 - 5899 grams'},
            {key:'5900 - 5999 grams', title:'5900 - 5999 grams'},
            {key:'6000 - 6099 grams', title:'6000 - 6099 grams'},
            {key:'6100 - 6199 grams', title:'6100 - 6199 grams'},
            {key:'6200 - 6299 grams', title:'6200 - 6299 grams'},
            {key:'6300 - 6399 grams', title:'6300 - 6399 grams'},
            {key:'6400 - 6499 grams', title:'6400 - 6499 grams'},
            {key:'6500 - 6599 grams', title:'6500 - 6599 grams'},
            {key:'6600 - 6699 grams', title:'6600 - 6699 grams'},
            {key:'6700 - 6799 grams', title:'6700 - 6799 grams'},
            {key:'6800 - 6899 grams', title:'6800 - 6899 grams'},
            {key:'6900 - 6999 grams', title:'6900 - 6999 grams'},
            {key:'7000 - 7099 grams', title:'7000 - 7099 grams'},
            {key:'7100 - 7199 grams', title:'7100 - 7199 grams'},
            {key:'7200 - 7299 grams', title:'7200 - 7299 grams'},
            {key:'7300 - 7399 grams', title:'7300 - 7399 grams'},
            {key:'7400 - 7499 grams', title:'7400 - 7499 grams'},
            {key:'7500 - 7599 grams', title:'7500 - 7599 grams'},
            {key:'7600 - 7699 grams', title:'7600 - 7699 grams'},
            {key:'7700 - 7799 grams', title:'7700 - 7799 grams'},
            {key:'7800 - 7899 grams', title:'7800 - 7899 grams'},
            {key:'7900 - 7999 grams', title:'7900 - 7999 grams'},
            {key:'8000 - 8099 grams', title:'8000 - 8099 grams'},
            {key:'8100 - 8165 grams', title:'8100 - 8165 grams'},
            {key:'Not stated', title:'Not Stated'}
        ];

        var birthWeightR12Options = [
            {key:'499 grams or less', title:'499 grams or less'},
            {key:'500 - 999 grams', title:'500 - 999 grams'},
            {key:'1000 - 1499 grams', title:'1000 - 1499 grams'},
            {key:'1500 - 1999 grams', title:'1500 - 1999 grams'},
            {key:'2000 - 2499 grams', title:'2000 - 2499 grams'},
            {key:'2500 - 2999 grams', title:'2500 - 2999 grams'},
            {key:'3000 - 3499 grams', title:'3000 - 3499 grams'},
            {key:'3500 - 3999 grams', title:'3500 - 3999 grams'},
            {key:'4000 - 4499 grams', title:'4000 - 4499 grams'},
            {key:'4500 - 4999 grams', title:'4500 - 4999 grams'},
            {key:'5000 - 8165 grams', title:'5000 - 8165 grams'},
            {key:'Not Stated', title:'Not Stated'}
        ];

        var birthWeightR4Options = [
            {key:'1499 grams or less', title:'1499 grams or less'},
            {key:'1500 - 2499 grams', title:'1500 - 2499 grams'},
            {key:'2500 - 8165 grams', title:'2500 grams or more'},
            {key:'Unknown or not stated', title:'Unknown or not stated'}
        ];
        var birthPluralityOptions = [
            {key:'Single', title:'Single'},
            {key:'Twin', title:'Twin'},
            {key:'Triplet', title:'Triplet'},
            {key:'Quadruplet', title:'Quadruplet'},
            {key:'Quintuplet or higher', title:'Quintuplet or higher'}
        ];

        var liveBirthOrderOptions = [
            {key:'1st child born alive to mother', title:'1st child born alive to mother'},
            {key:'2nd child born alive to mother', title:'2nd child born alive to mother'},
            {key:'3rd child born alive to mother', title:'3rd child born alive to mother'},
            {key:'4th child born alive to mother', title:'4th child born alive to mother'},
            {key:'5th child born alive to mother', title:'5th child born alive to mother'},
            {key:'6th child born alive to mother', title:'6th child born alive to mother'},
            {key:'7th child born alive to mother', title:'7th child born alive to mother'},
            {key:'8 or more live births', title:'8 or more live births'},
            {key:'Unknown or not stated', title:'Unknown or not stated'}
        ];

        var birthPlaceOptions = [
            {key:'In Hospital', title:'In Hospital'},
            {key:'Freestanding Birthing Center', title:'Freestanding Birthing Center'},
            {key:'Clinic / Doctor’s Office', title:'Clinic / Doctor’s Office'},
            {key:'Residence', title:'Residence'},
            {key:'Other', title:'Other'},
            {key:'Unknown', title:'Unknown'}
        ];

        var deliveryMethodOptions = [
            {key:'Cesarean', title:'Cesarean'},
            {key:'Vaginal', title:'Vaginal'},
            {key:'Not stated', title:'Not stated'}
        ];

        var medicalAttendantOptions = [
            {key:'Doctor of Medicine (MD)', title:'Doctor of Medicine (MD)'},
            {key:'Doctor of Osteopathy (DO)', title:'Doctor of Osteopathy (DO)'},
            {key:'Certified Nurse Midwife (CNM)', title:'Certified Nurse Midwife (CNM)'},
            {key:'Other Midwife', title:'Other Midwife'},
            {key:'Other', title:'Other'},
            {key:'Unknown or not stated', title:'Unknown or not stated'}
        ];
        var anemiaOptions = [
            {key:'Yes', title:'Yes'},
            {key:'No', title:'No'},
            {key:'Unknown', title:'Unknown'},
            {key:'Not on certificate', title:'Not on certificate'}
        ];

        var cardiacDiseaseOptions = [
            {key:'Yes', title:'Yes'},
            {key:'No', title:'No'},
            {key:'Unknown', title:'Unknown'},
            {key:'Not on certificate', title:'Not on certificate'}
        ];

        var chronicHypertensionOptions = [
            {key:'Yes', title:'Yes'},
            {key:'No', title:'No'},
            {key:'Unknown', title:'Unknown'},
            {key:'Not on certificate', title:'Not on certificate'}
        ];
        var pregnancyHypertensionOptions = [
            {key:'Yes', title:'Yes'},
            {key:'No', title:'No'},
            {key:'Unknown', title:'Unknown'},
            {key:'Not on certificate', title:'Not on certificate'}
        ];

        var diabetesOptions = [
            {key:'Yes', title:'Yes'},
            {key:'No', title:'No'},
            {key:'Unknown', title:'Unknown'},
            {key:'Not on certificate', title:'Not on certificate'}
        ];

        var eclampsiaOptions = [
            {key:'Yes', title:'Yes'},
            {key:'No', title:'No'},
            {key:'Unknown', title:'Unknown'},
            {key:'Not on certificate', title:'Not on certificate'}
        ];

        var hydraOligoOptions = [
            {key:'Yes', title:'Yes'},
            {key:'No', title:'No'},
            {key:'Unknown', title:'Unknown'},
            {key:'Not on certificate', title:'Not on certificate'}
        ];

        var incompetentCervixOptions = [
            {key:'Yes', title:'Yes'},
            {key:'No', title:'No'},
            {key:'Unknown', title:'Unknown'},
            {key:'Not on certificate', title:'Not on certificate'}
        ];

        var lungDiseaseOptions = [
            {key:'Yes', title:'Yes'},
            {key:'No', title:'No'},
            {key:'Unknown', title:'Unknown'},
            {key:'Not on certificate', title:'Not on certificate'}
        ];

        var tobaccoOptions = [
            {key:'Yes', title:'Yes'},
            {key:'No', title:'No'},
            {key:'Not stated', title:'Not Stated'},
            {key:'Not on certificate', title:'Not on certificate'}
        ];

        var stateOptions =  [
            { "key": "AL", "title": "Alabama" },
            { "key": "AK", "title": "Alaska" },
            { "key": "AZ", "title": "Arizona" },
            { "key": "AR", "title": "Arkansas" },
            { "key": "CA", "title": "California" },
            { "key": "CO", "title": "Colorado" },
            { "key": "CT", "title": "Connecticut" },
            { "key": "DE", "title": "Delaware" },
            { "key": "DC", "title": "District of Columbia" },
            { "key": "FL", "title": "Florida" },
            { "key": "GA", "title": "Georgia" },
            { "key": "HI", "title": "Hawaii" },
            { "key": "ID", "title": "Idaho" },
            { "key": "IL", "title": "Illinois" },
            { "key": "IN", "title": "Indiana"},
            { "key": "IA", "title": "Iowa" },
            { "key": "KS", "title": "Kansas" },
            { "key": "KY", "title": "Kentucky" },
            { "key": "LA", "title": "Louisiana" },
            { "key": "ME", "title": "Maine" },
            { "key": "MD", "title": "Maryland" },
            { "key": "MA", "title": "Massachusetts" },
            { "key": "MI", "title": "Michigan" },
            { "key": "MN", "title": "Minnesota" },
            { "key": "MS", "title": "Mississippi" },
            { "key": "MO", "title": "Missouri" },
            { "key": "MT", "title": "Montana" },
            { "key": "NE", "title": "Nebraska" },
            { "key": "NV", "title": "Nevada" },
            { "key": "NH", "title": "New Hampshire" },
            { "key": "NJ", "title": "New Jersey" },
            { "key": "NM", "title": "New Mexico" },
            { "key": "NY", "title": "New York" },
            { "key": "NC", "title": "North Carolina" },
            { "key": "ND", "title": "North Dakota" },
            { "key": "OH", "title": "Ohio" },
            { "key": "OK", "title": "Oklahoma" },
            { "key": "OR", "title": "Oregon" },
            { "key": "PA", "title": "Pennsylvania" },
            { "key": "RI", "title": "Rhode Island" },
            { "key": "SC", "title": "South Carolina" },
            { "key": "SD", "title": "South Dakota" },
            { "key": "TN", "title": "Tennessee" },
            { "key": "TX", "title": "Texas" },
            { "key": "UT", "title": "Utah" },
            { "key": "VT", "title": "Vermont" },
            { "key": "VA", "title": "Virginia" },
            { "key": "WA", "title": "Washington" },
            { "key": "WV", "title": "West Virginia" },
            { "key": "WI", "title": "Wisconsin" },
            { "key": "WY", "title": "Wyoming" }
        ];

        var diseaseStateOptions = [
            {"key": "National", "title": "National"},
            {"key": "AL", "title": "Alabama"},
            {"key": "AK", "title": "Alaska"},
            {"key": "AZ", "title": "Arizona"},
            {"key": "AR", "title": "Arkansas"},
            {"key": "CA", "title": "California"},
            {"key": "CO", "title": "Colorado"},
            {"key": "CT", "title": "Connecticut"},
            {"key": "DE", "title": "Delaware"},
            {"key": "DC", "title": "District of Columbia"},
            {"key": "FL", "title": "Florida"},
            {"key": "GA", "title": "Georgia"},
            {"key": "HI", "title": "Hawaii"},
            {"key": "ID", "title": "Idaho"},
            {"key": "IL", "title": "Illinois"},
            {"key": "IN", "title": "Indiana"},
            {"key": "IA", "title": "Iowa"},
            {"key": "KS", "title": "Kansas"},
            {"key": "KY", "title": "Kentucky"},
            {"key": "LA", "title": "Louisiana"},
            {"key": "ME", "title": "Maine"},
            {"key": "MD", "title": "Maryland"},
            {"key": "MA", "title": "Massachusetts"},
            {"key": "MI", "title": "Michigan"},
            {"key": "MN", "title": "Minnesota"},
            {"key": "MS", "title": "Mississippi"},
            {"key": "MO", "title": "Missouri"},
            {"key": "MT", "title": "Montana"},
            {"key": "NE", "title": "Nebraska"},
            {"key": "NV", "title": "Nevada"},
            {"key": "NH", "title": "New Hampshire"},
            {"key": "NJ", "title": "New Jersey"},
            {"key": "NM", "title": "New Mexico"},
            {"key": "NY", "title": "New York"},
            {"key": "NC", "title": "North Carolina"},
            {"key": "ND", "title": "North Dakota"},
            {"key": "OH", "title": "Ohio"},
            {"key": "OK", "title": "Oklahoma"},
            {"key": "OR", "title": "Oregon"},
            {"key": "PA", "title": "Pennsylvania"},
            {"key": "RI", "title": "Rhode Island"},
            {"key": "SC", "title": "South Carolina"},
            {"key": "SD", "title": "South Dakota"},
            {"key": "TN", "title": "Tennessee"},
            {"key": "TX", "title": "Texas"},
            {"key": "UT", "title": "Utah"},
            {"key": "VT", "title": "Vermont"},
            {"key": "VA", "title": "Virginia"},
            {"key": "WA", "title": "Washington"},
            {"key": "WV", "title": "West Virginia"},
            {"key": "WI", "title": "Wisconsin"},
            {"key": "WY", "title": "Wyoming"}
        ];

        var censusRegionOptions = [
            {
                key: "CENS-R1",
                title: "Census Region 1: Northeast",
                group: true,
                options: [
                    {
                        key: "CENS-D1",
                        title: "Division 1: New England",
                        parentFilterOptionKey: "CENS-R1",
                    },
                    {
                        key: "CENS-D2",
                        title: "Division 2: Middle Atlantic",
                        parentFilterOptionKey: "CENS-R1",
                    },
                ]
            },
            {
                key: "CENS-R2",
                title: "Census Region 2: Midwest",
                group: true,
                options: [
                    {
                        key: "CENS-D3",
                        title: "Division 3: East North Central",
                        parentFilterOptionKey: "CENS-R2",
                    },
                    {
                        key: "CENS-D4",
                        title: "Division 4: West North Central",
                        parentFilterOptionKey: "CENS-R2",
                    },
                ]
            },
            {
                key: "CENS-R3",
                title: "Census Region 3: South",
                group: true,
                options: [
                    {
                        key: "CENS-D5",
                        title: "Division 5: South Atlantic",
                        parentFilterOptionKey: "CENS-R3",
                    },
                    {
                        key: "CENS-D6",
                        title: "Division 6: East South Central",
                        parentFilterOptionKey: "CENS-R3",
                    },
                    {
                        key: "CENS-D7",
                        title: "Division 7: West South Central",
                        parentFilterOptionKey: "CENS-R3",
                    },
                ]
            },
            {
                key: "CENS-R4",
                title: "Census Region 4: West",
                group: true,
                options: [
                    {
                        key: "CENS-D8",
                        title: "Division 8: Mountain",
                        parentFilterOptionKey: "CENS-R4",
                    },
                    {
                        key: "CENS-D9",
                        title: "Division 9: Pacific",
                        parentFilterOptionKey: "CENS-R4",
                    },
                ]
            },
        ];

        var hhsOptions = [
            { "key": "HHS-1", "title": "HHS Region #1  CT, ME, MA, NH, RI, VT" },
            { "key": "HHS-2", "title": "HHS Region #2  NJ, NY" },
            { "key": "HHS-3", "title": "HHS Region #3  DE, DC, MD, PA, VA, WV" },
            { "key": "HHS-4", "title": "HHS Region #4  AL, FL, GA, KY, MS, NC, SC, TN" },
            { "key": "HHS-5", "title": "HHS Region #5  IL, IN, MI, MN, OH, WI" },
            { "key": "HHS-6", "title": "HHS Region #6  AR, LA, NM, OK, TX" },
            { "key": "HHS-7", "title": "HHS Region #7  IA, KS, MO, NE" },
            { "key": "HHS-8", "title": "HHS Region #8  CO, MT, ND, SD, UT, WY" },
            { "key": "HHS-9", "title": "HHS Region #9  AZ, CA, HI, NV" },
            { "key": "HHS-10", "title": "HHS Region #10  AK, ID, OR, WA" }
        ];

        var diseaseYearOptions = [
            {"key": "2016", "title": "2016"},
            {"key": "2015", "title": "2015"},
            {"key": "2014", "title": "2014"},
            {"key": "2013", "title": "2013"},
            {"key": "2012", "title": "2012"},
            {"key": "2011", "title": "2011"},
            {"key": "2010", "title": "2010"},
            {"key": "2009", "title": "2009"},
            {"key": "2008", "title": "2008"},
            {"key": "2007", "title": "2007"},
            {"key": "2006", "title": "2006"},
            {"key": "2005", "title": "2005"},
            {"key": "2004", "title": "2004"},
            {"key": "2003", "title": "2003"},
            {"key": "2002", "title": "2002"},
            {"key": "2001", "title": "2001"},
            {"key": "2000", "title": "2000"}
        ];
        var stdAgeGroupOptions = [
            {"key": "All age groups", "title": "All age groups"},
            {"key": "0-14", "title": "0-14"},
            {"key": "15-19", "title": "15-19"},
            {"key": "20-24", "title": "20-24"},
            {"key": "25-29", "title": "25-29"},
            {"key": "30-34", "title": "30-34"},
            {"key": "35-39", "title": "35-39"},
            {"key": "40-44", "title": "40-44"},
            {"key": "45-54", "title": "45-54"},
            {"key": "55-64", "title": "55-64"},
            {"key": "65+", "title": "65+"},
            {"key": "Unknown", "title": "Unknown"}
        ];
        var diseaseRaceOptions = [
            {"key": "All races/ethnicities", "title": "All races/ethnicities"},
            {"key": "American Indian or Alaska Native", "title": "American Indian or Alaska Native"},
            {"key": "Asian", "title": "Asian"},
            {"key": "Black or African American", "title": "Black or African American"},
            {"key": "Hispanic or Latino", "title": "Hispanic or Latino"},
            {"key": "Native Hawaiian or Other Pacific Islander", "title": "Native Hawaiian or Other Pacific Islander"},
            {"key": "White", "title": "White"},
            {"key": "Multiple races", "title": "Multiple races"},
            {"key": "Unknown", "title": "Unknown"}

        ];
        var diseaseGenderOptions = [
            {"key": "Both sexes", "title": "Both sexes"},
            {"key": "Female", "title": "Female"},
            {"key": "Male", "title": "Male"}
        ];

        var gestationalGroup1 = [
            { key: "Under 20 weeks", title: "Under 20 weeks" },
            { key: "20 - 27 weeks", title: "20 - 27 weeks" },
            { key: "28 - 31 weeks", title: "28 - 31 weeks" },
            { key: "32 - 33 weeks", title: "32 - 33 weeks" },
            { key: "34 - 36 weeks", title: "34 - 36 weeks" },
            { key: "37 - 38 weeks", title: "37 - 38 weeks" },
            { key: "39 weeks", title: "39 weeks" },
            { key: "40 weeks", title: "40 weeks" },
            { key: "41 weeks", title: "41 weeks" },
            { key: "42 weeks and over", title: "42 weeks and over" },
            { key: "Unknown", title: "Unknown" }
        ];

        var gestationalGroup2 = [
            { key: "Under 20 weeks" , title: "Under 20 weeks" },
            { key: "20 - 27 weeks" , title: "20 - 27 weeks" },
            { key: "28 - 31 weeks" , title: "28 - 31 weeks" },
            { key: "32 - 35 weeks" , title: "32 - 35 weeks" },
            { key: "36 weeks" , title: "36 weeks" },
            { key: "37 - 39 weeks" , title: "37 - 39 weeks" },
            { key: "40 weeks" , title: "40 weeks" },
            { key: "41 weeks" , title: "41 weeks" },
            { key: "42 weeks and over" , title: "42 weeks and over" },
            { key: "Unknown" , title: "Unknown" }
        ];

        var gestationWeekly = [
            { key: "17 weeks", title: "17 weeks" },
            { key: "18 weeks", title: "18 weeks" },
            { key: "19 weeks", title: "19 weeks" },
            { key: "20 weeks", title: "20 weeks" },
            { key: "21 weeks", title: "21 weeks" },
            { key: "22 weeks", title: "22 weeks" },
            { key: "23 weeks", title: "23 weeks" },
            { key: "24 weeks", title: "24 weeks" },
            { key: "25 weeks", title: "25 weeks" },
            { key: "26 weeks", title: "26 weeks" },
            { key: "27 weeks", title: "27 weeks" },
            { key: "28 weeks", title: "28 weeks" },
            { key: "29 weeks", title: "29 weeks" },
            { key: "30 weeks", title: "30 weeks" },
            { key: "31 weeks", title: "31 weeks" },
            { key: "32 weeks", title: "32 weeks" },
            { key: "33 weeks", title: "33 weeks" },
            { key: "34 weeks", title: "34 weeks" },
            { key: "35 weeks", title: "35 weeks" },
            { key: "36 weeks", title: "36 weeks" },
            { key: "37 weeks", title: "37 weeks" },
            { key: "38 weeks", title: "38 weeks" },
            { key: "39 weeks", title: "39 weeks" },
            { key: "40 weeks", title: "40 weeks" },
            { key: "41 weeks", title: "41 weeks" },
            { key: "42 weeks", title: "42 weeks" },
            { key: "43 weeks", title: "43 weeks" },
            { key: "44 weeks", title: "44 weeks" },
            { key: "45 weeks", title: "45 weeks" },
            { key: "46 weeks", title: "46 weeks" },
            { key: "47 weeks", title: "47 weeks" },
            { key: "Unknown", title: "Unknown"}
        ];

        var cancerRaceOptions = [
            { key: 'American Indian/Alaska Native', title: 'American Indian/Alaska Native' },
            { key: 'Asian or Pacific Islander', title: 'Asian or Pacific Islander' },
            { key: 'Black', title: 'Black' },
            { key: 'White', title: 'White' },
            { key: 'Unknown', title: 'Unknown' }
        ];

        var cancerHispanicOptions = [
            { key: 'Non-Hispanic', title: 'Non-Hispanic' },
            { key: 'Hispanic', title: 'Hispanic' },
            { key: 'Invalid', title: 'Unknown or Missing' },
            { key: 'Unknown', title: 'Unknown' }
        ];

        var cancerAgeGroups = [
            { key: '00 years', title: '< 1 years' },
            { key: '01-04 years', title: '01-04 years' },
            { key: '05-09 years', title: '05-09 years' },
            { key: '10-14 years', title: '10-14 years' },
            { key: '15-19 years', title: '15-19 years' },
            { key: '20-24 years', title: '20-24 years' },
            { key: '25-29 years', title: '25-29 years' },
            { key: '30-34 years', title: '30-34 years' },
            { key: '35-39 years', title: '35-39 years' },
            { key: '40-44 years', title: '40-44 years' },
            { key: '45-49 years', title: '45-49 years' },
            { key: '50-54 years', title: '50-54 years' },
            { key: '55-59 years', title: '55-59 years' },
            { key: '60-64 years', title: '60-64 years' },
            { key: '65-69 years', title: '65-69 years' },
            { key: '70-74 years', title: '70-74 years' },
            { key: '75-79 years', title: '75-79 years' },
            { key: '80-84 years', title: '80-84 years' },
            { key: '85+ years', title: '85+ years' }
        ];

        return {
            getBridgeDataFilters: getBridgeDataFilters,
            getNatalityDataFilters: getNatalityDataFilters,
            getInfantMortalityDataFilters: getInfantMortalityDataFilters,
            getSTDDataFilters: getSTDDataFilters,
            getAllOptionValues: getAllOptionValues,
            getTBDataFilters: getTBDataFilters,
            getAIDSFilters: getAIDSFilters,
            cancerIncidenceFilters: cancerIncidenceFilters,
            cancerMortalityFilters: cancerMortalityFilters
        };

        function getBridgeDataFilters() {

            //bridge data filter options
            var censusYearsOptions = [
                { "key": "2018", "title": "2018" },
                { "key": "2017", "title": "2017" },
                { "key": "2016", "title": "2016" },
                { "key": "2015", "title": "2015" },
                { "key": "2014", "title": "2014" },
                { "key": "2013", "title": "2013" },
                { "key": "2012", "title": "2012" },
                { "key": "2011", "title": "2011" },
                { "key": "2010", "title": "2010" },
                { "key": "2009", "title": "2009" },
                { "key": "2008", "title": "2008" },
                { "key": "2007", "title": "2007" },
                { "key": "2006", "title": "2006" },
                { "key": "2005", "title": "2005" },
                { "key": "2004", "title": "2004" },
                { "key": "2003", "title": "2003" },
                { "key": "2002", "title": "2002" },
                { "key": "2001", "title": "2001" },
                { "key": "2000", "title": "2000" }
            ];

            var censusGenderOptions =  [
                { "key": "Female", "title": "Female" },
                { "key": "Male", "title": "Male" }
            ];

            var censusRaceOptions =  [
                { "key": "American Indian", "title": "American Indian or Alaska Native" },
                { "key": "Asian or Pacific Islander", "title": "Asian or Pacific Islander" },
                { "key": "Black", "title": "Black or African American" },
                { "key": "White", "title": "White" }
            ];

            var censusHispanicOriginOptions =  [
                { "key": "Non-Hispanic", "title": "Non Hispanic" },
                { "key": "Hispanic", "title": "Hispanic or Latino" }
            ];

            var censusAgeOptions = [
                {key:'0-4 years', title:'0 - 4 years', min: 0, max: 4},
                {key:'5-9 years', title:'5 - 9 years', min: 5, max: 9},
                {key:'10-14 years', title:'10 - 14 years', min: 10, max: 14},
                {key:'15-19 years', title:'15 - 19 years', min: 15, max: 19},
                {key:'20-24 years', title:'20 - 24 years', min: 20, max: 24},
                {key:'25-29 years', title:'25 - 29 years', min: 25, max: 29},
                {key:'30-34 years', title:'30 - 34 years', min: 30, max: 34},
                {key:'35-39 years', title:'35 - 39 years', min: 35, max: 39},
                {key:'40-44 years', title:'40 - 44 years', min: 40, max: 44},
                {key:'45-49 years', title:'45 - 49 years', min: 45, max: 49},
                {key:'50-54 years', title:'50 - 54 years', min: 50, max: 54},
                {key:'55-59 years', title:'55 - 59 years', min: 55, max: 59},
                {key:'60-64 years', title:'60 - 64 years', min: 60, max: 64},
                {key:'65-69 years', title:'65 - 69 years', min: 65, max: 69},
                {key:'70-74 years', title:'70 - 74 years', min: 70, max: 74},
                {key:'75-79 years', title:'75 - 79 years', min: 75, max: 79},
                {key:'80-84 years', title:'80 - 84 years', min: 80, max: 84},
                {key:'85+ years', title:'85+ years', min: 85, max: 105}
            ];

            var ageSliderOptions =  {
                from: 0,
                to: 90,
                step: 5,
                threshold: 0,
                scale: [0, '', 10, '', 20, '', 30, '', 40, '', 50, '', 60, '', 70, '', 80, '>85', ''],
                modelLabels: {85: '', 90: '>85'},
                css: {
                    background: {'background-color': '#ccc'}, before: {'background-color': '#ccc'},
                    default: {'background-color': 'white'}, after: {'background-color': '#ccc'},
                    pointer: {'background-color': '#914fb5'}, range: {"background-color": "#914fb5"}
                },
                callback: function(value, release) {
                    var self = this;
                    var values = value.split(';');
                    var minValue = Number(values[0]);
                    var maxValue = Number(values[1]);
                    var ageGroupFilter = utilService.findByKeyAndValue(bridgeDataFilters, 'key', 'agegroup');

                    var prevValue = angular.copy(ageGroupFilter.value);
                    ageGroupFilter.value = [];
                    // set the values list only if the slider selection is different from the default
                    if(! (minValue == 0  && maxValue == 85)) {
                        angular.forEach(ageGroupFilter.autoCompleteOptions, function(eachOption) {
                            if((eachOption.min <= minValue && eachOption.max > minValue)
                                || (eachOption.min >= minValue && eachOption.max <= maxValue)
                                || (eachOption.min <= maxValue && eachOption.max >= maxValue)) {
                                ageGroupFilter.value.push(eachOption.key);
                            }
                        });
                    }

                    if(!ageGroupFilter.timer && !angular.equals(prevValue, ageGroupFilter.value)) {
                        ageGroupFilter.timer = $timeout(function() {
                            ageGroupFilter.timer=undefined;
                            self.search();
                        }, 2000);
                    }
                }
            };

            //prepare filter definitions
            var bridgeDataFilters = [
                {key: 'current_year', title: 'label.filter.yearly.estimate', queryKey:"current_year",
                    primary: false, value: ['2018'], defaultGroup:'row', groupBy: false, filterType: 'checkbox',
                    autoCompleteOptions: censusYearsOptions, refreshFiltersOnChange: true, helpText:"label.help.text.bridged-race.year" },
                {key: 'sex', title: 'label.filter.gender', queryKey:"sex", primary: false, value: [],
                    defaultGroup:'column', groupBy: 'column', filterType: 'checkbox',
                    autoCompleteOptions: censusGenderOptions, helpText:"label.help.text.bridged-race.gender"},

                {key: 'agegroup', title: 'label.filter.agegroup', queryKey:"age_5_interval", primary: false, value:[],
                    groupBy: false, filterType: 'slider', autoCompleteOptions: censusAgeOptions,
                    sliderOptions: ageSliderOptions, sliderValue: '-5;105', timer: undefined,
                    defaultGroup:"row", helpText:"label.help.text.bridged-race.agegroup"},

                {key: 'race', title: 'label.filter.race', queryKey:"race",primary: false, defaultGroup:'column',
                    groupBy: 'row', filterType: 'checkbox',autoCompleteOptions: censusRaceOptions,
                    value:[], helpText:"label.help.text.bridged-race.race"},
                {key: 'ethnicity', title: 'label.filter.hispanicOrigin', queryKey:"ethnicity_group",primary: false,
                    defaultGroup:'row', groupBy: false, filterType: 'checkbox',autoCompleteOptions: censusHispanicOriginOptions,
                    value:[], helpText:"label.help.text.bridged-race.ethnicity"},
                {key: 'state', title: 'label.filter.state', queryKey:"state",primary: false, value:[], defaultGroup:'row',
                    groupBy: false, filterType: 'checkbox',autoCompleteOptions: stateOptions,
                    displaySearchBox:true, displaySelectedFirst:true, helpText:"label.help.text.bridged-race.state"},
                    {
                        key: 'census-region', title: 'label.filter.censusRegion', queryKey: "census_region|census_division", primary: false, value: [],
                        queryType: "compound", titles: ['label.filter.censusRegion', 'label.filter.censusDivision'], queryKeys: ["census_region", "census_division"],
                        groupBy: false, type: "label.filter.group.location", filterType: 'checkbox',
                        autoCompleteOptions: censusRegionOptions, defaultGroup: "column",
                        displaySearchBox: true, displaySelectedFirst: false, helpText: 'label.help.text.bridged-race.state'
                    }
                ];

            return bridgeDataFilters;
        }

        function getNatalityDataFilters() {
            //prepare filter definitions
            var natalityFilters = [
                {key: 'hispanic_origin', title: 'label.filter.hispanicOrigin', queryKey:"hispanic_origin",
                    primary: false, value: [], defaultGroup:'row', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: hispanicOptions, helpText:"label.help.text.ethnicity"},
                {key: 'state', title: 'label.filter.state', queryKey:"state",primary: false, value:[], defaultGroup:'row',
                    groupBy: false, filterType: 'checkbox', displaySearchBox:true, displaySelectedFirst:true,
                    autoCompleteOptions: stateOptions, helpText:"label.help.text.natality.state"},
                {
                    key: 'census-region', title: 'label.filter.censusRegion', queryKey: "census_region|census_division", primary: false, value: [],
                    queryType: "compound", titles: ['label.filter.censusRegion', 'label.filter.censusDivision'], queryKeys: ["census_region", "census_division"],
                    groupBy: false, type: "label.filter.group.location", filterType: 'checkbox',
                    autoCompleteOptions: censusRegionOptions, defaultGroup: "column",
                    displaySearchBox: true, displaySelectedFirst: false, helpText: 'label.help.text.mortality.state'
                },
                {
                    key: 'hhs-region', title: 'label.filter.HHSRegion', queryKey: "hhs_region", primary: false, value: [],
                    groupBy: false, type: "label.filter.group.location", filterType: 'checkbox',
                    autoCompleteOptions: hhsOptions, defaultGroup: "column",
                    displaySearchBox: true, displaySelectedFirst: true, helpText: 'label.help.text.mortality.state'
                },
                {key: 'mother_age_1year_interval', title: 'label.chart.mother_age.single.year.group', queryKey: "mother_age_1year_interval", primary: false, value: [],
                    defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: singleYearAgeOptions, helpText:"label.help.text.mother.one.year.age", disableAgeOptions: ["Under 15 years", "45 years", "46 years", "47 years", "48 years", "49 years", "50-54 years"]},

                {key: 'mother_age_5year_interval', title: 'label.chart.mother_age.five.year.group', queryKey:"mother_age_5year_interval", primary: false, value: [],
                    defaultGroup:'column', groupBy: false, filterType: "checkbox", autoCompleteOptions: ageR9Options,
                    helpText:"label.help.text.mother.five.year.age", disableAgeOptions: ["Under 15 years", "45-49 years", "50-54 years" ]},

                {key: 'race', title: 'label.filter.race', queryKey:"race", primary: false, value: [],
                    defaultGroup:'column', groupBy: 'row', filterType: "checkbox",
                    autoCompleteOptions: raceOptions, helpText:"label.help.text.race"},

                {key: 'marital_status', title: 'label.filter.maritalStatus', queryKey:"marital_status", primary: false,
                    value: [], defaultGroup:'column', groupBy:false, filterType: "checkbox",
                    autoCompleteOptions: maritalStatusOptions, helpText:"label.help.text.marital.status"},

                {key: 'mother_education', title: 'label.filter.education', queryKey:"mother_education", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: educationOptions, helpText:"label.help.text.mother.education"},

                {key: 'current_year', title: 'label.filter.year', queryKey:"current_year", primary: false, value: ["2017"], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: yearOptions, helpText:"label.help.text.year"},

                {key: 'month', title: 'label.filter.month', queryKey:"month", primary: false, value: [], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: monthOptions, helpText:"label.help.text.month"},

                {key: 'weekday', title: 'label.filter.weekday', queryKey:"weekday", primary: false, value: [], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: weekDayOptions, helpText:"label.help.text.week.day"},

                {key: 'sex', title: 'label.filter.gender', queryKey:"sex", primary: false, value: [], defaultGroup:'column', groupBy: 'column',
                    filterType: "checkbox", autoCompleteOptions: genderOptions, helpText:"label.help.text.sex"},
                {key: 'gestational_age_r10', title: 'label.filter.gestational.birth.age', queryKey:"gestational_age_r10",
                    primary: false, value: [], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: gestationalAgeAtBirth,
                    helpText:"label.help.text.gestational.age"},
                {key: 'prenatal_care', title: 'label.filter.monthPrenatalCareBegan', queryKey:"prenatal_care",
                    primary: false, value: [], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: prenatalCareMonthOptions,
                    helpText:"label.help.text.prenatal.care"},

                {key: 'birth_weight', title: 'label.filter.birthWeight', queryKey:"birth_weight", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox", autoCompleteOptions: birthWeightOptions,
                    helpText:"label.help.text.birth.weight"},
                {key: 'birth_weight_r4', title: 'label.filter.birth_weight.r4', queryKey:"birth_weight_r4", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox", autoCompleteOptions: birthWeightR4Options},
                {key: 'birth_weight_r12', title: 'label.chart.birth_weight.r12', queryKey:"birth_weight_r12", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox", autoCompleteOptions: birthWeightR12Options},

                {key: 'birth_plurality', title: 'label.filter.plurality', queryKey:"birth_plurality", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: birthPluralityOptions, helpText:"label.help.text.birth.plurality"},

                {key: 'live_birth', title: 'label.filter.liveBirthOrder', queryKey:"live_birth", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: liveBirthOrderOptions, helpText:"label.help.text.live.birth.order"},

                {key: 'birth_place', title: 'label.filter.birthPlace', queryKey:"birth_place", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: birthPlaceOptions, helpText:"label.help.text.birth.place"},

                {key: 'delivery_method', title: 'label.filter.deliveryMethod', queryKey:"delivery_method", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: deliveryMethodOptions, helpText:"label.help.text.delivery.method"},

                {key: 'medical_attendant', title: 'label.filter.medicalAttendant', queryKey:"medical_attendant", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: medicalAttendantOptions, helpText:"label.help.text.medical.attendant"},

                {key: 'anemia', title: 'label.filter.anemia', queryKey:"anemia", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox", autoCompleteOptions: anemiaOptions,
                    helpText:"label.help.text.anemia"},
                {key: 'cardiac_disease', title: 'label.filter.cardiac.disease', queryKey:"cardiac_disease", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox", autoCompleteOptions: cardiacDiseaseOptions,
                    helpText:"label.help.text.cardiac.disease"},
                {key: 'chronic_hypertension', title: 'label.filter.chronicHypertension', queryKey:"chronic_hypertension", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: chronicHypertensionOptions, helpText:"label.help.text.chronic.hypertension"},

                {key: 'diabetes', title: 'label.filter.diabetes', queryKey:"diabetes", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: diabetesOptions, helpText:"label.help.text.diabetes"},

                {key: 'pregnancy_hypertension', title: 'label.filter.pregnancy.hypertension', queryKey:"pregnancy_hypertension", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: pregnancyHypertensionOptions, helpText:"label.help.text.pregnancy.hypertension"},

                {key: 'eclampsia', title: 'label.filter.eclampsia', queryKey:"eclampsia", primary: false, value: [],
                    defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: eclampsiaOptions, helpText:"label.help.text.eclampsia"},

                {key: 'hydramnios_oligohydramnios', title: 'label.filter.hydramnios.oligohydramnios', queryKey:"hydramnios_oligohydramnios", primary: false, value: [],
                    defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: hydraOligoOptions, helpText:"label.help.text.hydramnios.oligohydramnios"},

                {key: 'incompetent_cervix', title: 'label.filter.incompetent.cervix', queryKey:"incompetent_cervix", primary: false, value: [],
                    defaultGroup:'column', groupBy: false, filterType: "checkbox",autoCompleteOptions: incompetentCervixOptions,
                    helpText:"label.help.text.incomplete.cervix"},
                {key: 'lung_disease', title: 'label.filter.lung.disease', queryKey:"lung_disease", primary: false, value: [],
                    defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: lungDiseaseOptions, helpText:"label.help.text.lung.disease"},

                {key: 'tobacco_use', title: 'label.filter.tobacco.use', queryKey:"tobacco_use", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: tobaccoOptions, helpText:"label.help.text.tobacco.use"},

                {key: 'gestation_recode11', title: 'label.filter.natality.gestation_recode11', queryKey:"gestation_recode11",
                    primary: false, value: [], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: gestationalGroup1,
                    helpText:"label.help.text.gestational.group.two"},

                {key: 'gestation_recode10', title: 'label.filter.natality.gestation_recode10', queryKey:"gestation_recode10",
                    primary: false, value: [], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: gestationalGroup2,
                    helpText:"label.help.text.gestational.group.one"},

                {key: 'gestation_weekly', title: 'label.filter.natality.gestation_weekly', queryKey:"gestation_weekly",
                    primary: false, value: [], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: gestationWeekly,
                    helpText:"label.help.text.gestational.weekly"}
            ];

            return natalityFilters;
        }
        function getInfantMortalityDataFilters () {
            var infantGestationalGroup1 = [
                { key: "Under 20 weeks", title: "Under 20 weeks" },
                { key: "20-27 weeks", title: "20 - 27 weeks" },
                { key: "28-31 weeks", title: "28 - 31 weeks" },
                { key: "32-33 weeks", title: "32 - 33 weeks" },
                { key: "34-36 weeks", title: "34 - 36 weeks" },
                { key: "37-38 weeks", title: "37 - 38 weeks" },
                { key: "39 weeks", title: "39 weeks" },
                { key: "40 weeks", title: "40 weeks" },
                { key: "41 weeks", title: "41 weeks" },
                { key: "42 or more weeks", title: "42 weeks and over" },
                { key: "Unknown", title: "Unknown" }
            ];

            var infantGestationalGroup2 = [
                { key: "Under 20 weeks" , title: "Under 20 weeks" },
                { key: "20-27 weeks" , title: "20 - 27 weeks" },
                { key: "28-31 weeks" , title: "28 - 31 weeks" },
                { key: "32-35 weeks" , title: "32 - 35 weeks" },
                { key: "36 weeks" , title: "36 weeks" },
                { key: "37-39 weeks" , title: "37 - 39 weeks" },
                { key: "40 weeks" , title: "40 weeks" },
                { key: "41 weeks" , title: "41 weeks" },
                { key: "42 weeks or more" , title: "42 weeks and over" },
                { key: "Unknown" , title: "Unknown" }
            ];

            var infantHispanicOptions =  [
                { "key": "Mexican", "title": "Mexican" },
                { "key": "Puerto Rican", "title": "Puerto Rican" },
                { "key": "Cuban", "title": "Cuban" },
                { "key": "Central or South American", "title": "Central or South American" },
                { "key": "Other and Unknown Hispanic", "title": "Other and Unknown Hispanic" },
                { "key": "Non-Hispanic White", "title": "Non-Hispanic White" },
                { "key": "Non-Hispanic Black", "title": "Non-Hispanic Black" },
                { "key": "Non-Hispanic other races", "title": "Non-Hispanic Other Races" },
                { "key": "Origin unknown or not stated", "title": "Origin unknown or not stated" }
            ];
            var infantAgeR9Options =  [
                { "key": "Under 15 years", "title": "Under 15 years" },
                { "key": "15-19 years", "title": "15-19 years" },
                { "key": "20-24 years", "title": "20-24 years" },
                { "key": "25-29 years", "title": "25-29 years" },
                { "key": "30-34 years", "title": "30-34 years" },
                { "key": "35-39 years", "title": "35-39 years" },
                { "key": "40-44 years", "title": "40-44 years" },
                { "key": "45-49 years", "title": "45-49 years" },
                { "key": "50 years and over", "title": "50 years and over" }
            ];

            var infantDeathAge = [
                { key: "Under 1 hour", title: "Under 1 hour" },
                { key: "1 - 23 hours", title: "1-23 hours" },
                { key: "1 - 6 days", title: "1-6 days" },
                { key: "7 - 27 days", title: "7-27 days" },
                { key: "28 - 364 days", title: "28 days and over" }
            ];

            var infantRaceOptions = [
                { "key": "American Indian or Alaska Native", "title": "American Indian or Alaska Native" },
                { "key": "Asian or Pacific Islander", "title": "Asian or Pacific Islander" },
                { "key": "Black or African American", "title": "Black or African American" },
                { "key": "White", "title": "White" },
                { "key": "Chinese", "title": "Chinese" },
                { "key": "Filipino", "title": "Filipino" },
                { "key": "Hawaiian", "title": "Hawaiian" },
                { "key": "Japanese", "title": "Japanese" },
                { "key": "Other Asian", "title": "Other Asian" }
            ];

            var infantEducationOptions = [
                {key:'0 -  8 years', title:'0 – 8 years'},
                {key:'9 - 11 years', title:'9 – 11 years'},
                {key:'12 years', title:'12 years'},
                {key:'13 - 15 years', title:'13 – 15 years'},
                {key:'16 years and over', title:'16 years and over'},
                {key:'Not stated/Not on certificate', title:'Not stated/Not on certificate'},
                {key:'8th grade or less', title:'8th grade or less'},
                {key:'9th through 12th grade with no diploma', title:'9th through 12th grade with no diploma'},
                {key:'High school graduate or GED completed', title:'High school graduate or GED completed'},
                {key:'Some college credit, but not a degree', title:'Some college credit, but not a degree'},
                {key:'Associate degree (AA, AS)', title:'Associate degree (AA,AS)'},
                {key:"Bachelor's degree (BA, AB, BS)", title:"Bachelor's degree (BA, AB, BS)"},
                {key:"Master's degree (MA, MS)", title:"Master's degree (MA, MS)"},
                {key:'Doctorate (PHD, EdD) or Professional Degree (MD, DDS, DVM, LLB, JD)', title:'Doctorate (PHD, EdD) or Professional Degree (MD, DDS, DVM, LLB, JD)'},
                {key:'Unknown/Not on certificate', title:'Unknown/Not on certificate'}
            ];
            var infantPrenatalCareMonthOptions = [
                { "key": "No prenatal care", "title": "No prenatal care" },
                { "key": "1st month", "title": "1st month" },
                { "key": "2nd month", "title": "2nd month" },
                { "key": "3rd month", "title": "3rd month" },
                { "key": "4th month", "title": "4th month" },
                { "key": "5th month", "title": "5th month" },
                { "key": "6th month", "title": "6th month" },
                { "key": "7th month", "title": "7th month" },
                { "key": "8th month", "title": "8th month" },
                { "key": "9th month", "title": "9th month" },
                { "key": "10th month", "title": "10th month" },
                { "key": "Not stated/Not on certificate", "title": "Not stated/Not on certificate"}
            ];
            var infantBirthWeightR12Options = [
                {key:'499 grams or less', title:'499 grams or less'},
                {key:'500 - 999 grams', title:'500 - 999 grams'},
                {key:'1000 - 1499 grams', title:'1000 - 1499 grams'},
                {key:'1500 - 1999 grams', title:'1500 - 1999 grams'},
                {key:'2000 - 2499 grams', title:'2000 - 2499 grams'},
                {key:'2500 - 2999 grams', title:'2500 - 2999 grams'},
                {key:'3000 - 3499 grams', title:'3000 - 3499 grams'},
                {key:'3500 - 3999 grams', title:'3500 - 3999 grams'},
                {key:'4000 - 4499 grams', title:'4000 - 4499 grams'},
                {key:'4500 - 4999 grams', title:'4500 - 4999 grams'},
                {key:'5000 - 8165 grams', title:'5000 - 8165 grams'},
                {key:'Not stated', title:'Not Stated'}
            ];
            var infantLiveBirthOrderOptions = [
                {key:'1st child born alive to mother', title:'1st child born alive to mother'},
                {key:'2nd child born alive to mother', title:'2nd child born alive to mother'},
                {key:'3rd child born alive to mother', title:'3rd child born alive to mother'},
                {key:'4th child born alive to mother', title:'4th child born alive to mother'},
                {key:'5th child born alive to mother', title:'5th child born alive to mother'},
                {key:'6th child and over born alive to mother', title:'6th child and over born alive to mother'},
                {key:'Unknown or not stated', title:'Unknown or not stated'}
            ];

            var infantBirthPlaceOptions = [
                {key:'In Hospital', title:'In Hospital'},
                {key:'Not in Hospital', title:'Not in Hospital'},
                {key:'Unknown or Not Stated', title:'Unknown or Not Stated'}
            ];

            var infantDeliveryMethodOptions = [
                {key:'Cesarean', title:'Cesarean'},
                {key:'Vaginal', title:'Vaginal'},
                {key:'Not Stated', title:'Not stated'}
            ];

            var infantMedicalAttendantOptions = [
                {key:'Doctor of Medicine(MD)', title:'Doctor of Medicine (MD)'},
                {key:'Doctor of Osteopathy(DO)', title:'Doctor of Osteopathy (DO)'},
                {key:'Certified Nurse Midwife(CNM)', title:'Certified Nurse Midwife (CNM)'},
                {key:'Other Midwife', title:'Other Midwife'},
                {key:'Other', title:'Other'},
                {key:'Unknown or not stated', title:'Unknown or not stated'}
            ];

            var infantMaritalStatusOptions = [
                {key:'Married', title:'Married'},
                {key:'Unmarried', title:'Unmarried'},
                {key:'Unknown or not Stated', title:'Unknown or not Stated'}
            ];
            var infantDeathYearOptions = [
                { "key": "2017", "title": "2017"},
                { "key": "2016", "title": "2016"},
                { "key": "2015", "title": "2015"},
                { "key": "2014", "title": "2014"},
                { "key": "2013", "title": "2013"},
                { "key": "2012", "title": "2012"},
                { "key": "2011", "title": "2011"},
                { "key": "2010", "title": "2010"},
                { "key": "2009", "title": "2009"},
                { "key": "2008", "title": "2008"},
                { "key": "2007", "title": "2007"},
                { "key": "2006", "title": "2006"},
                { "key": "2005", "title": "2005"},
                { "key": "2004", "title": "2004"},
                { "key": "2003", "title": "2003"},
                { "key": "2002", "title": "2002"},
                { "key": "2001", "title": "2001"},
                { "key": "2000", "title": "2000"}
            ];

            return [
                // Infant Characteristics
                {key: 'year_of_death', title: 'label.filter.year', queryKey:"year_of_death", primary: false, value: ["2017"],
                    defaultGroup:'column', groupBy: false, filterType: "checkbox", doNotShowAll: true, defaultValue: ["2017"],
                    autoCompleteOptions: infantDeathYearOptions, helpText:"label.help.text.infantmort.year",
                    D69Years: ['2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],
                    D31Years: ['2003', '2004', '2005', '2006'], D18Years: ['2000', '2001', '2002']},

                {key: 'sex', title: 'label.filter.gender', queryKey:"sex", primary: false, value: [],
                    defaultGroup:'column', groupBy: 'column', filterType: "checkbox",
                    autoCompleteOptions: genderOptions, helpText:"label.help.text.infantmort.sex"},

                {key: 'infant_age_at_death', title: 'label.filter.infant_age_at_death', queryKey: 'infant_age_at_death', primary: false,
                    value: [], defaultGroup: 'column', groupBy: false, filterType: 'checkbox',
                    autoCompleteOptions: infantDeathAge, helpText: 'label.help.text.infantmort.age.death'},

                // Maternal Characteristics
                {key: 'race', title: 'label.filter.race', queryKey:"race", primary: false, value: [],
                    defaultGroup:'column', groupBy: 'row', filterType: "checkbox",
                    autoCompleteOptions: infantRaceOptions, helpText:"label.help.text.race"},

                {key: 'hispanic_origin', title: 'label.filter.hispanicOrigin', queryKey:"hispanic_origin",
                    primary: false, value: [], defaultGroup:'row', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: infantHispanicOptions, helpText:"label.help.text.ethnicity"},

                {key: 'mother_age_5_interval', title: 'label.filter.age_of_mother', queryKey:"mother_age_5_interval",
                    primary: false, value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: infantAgeR9Options, helpText:"label.help.text.infantmort.age.group"},

                {key: 'marital_status', title: 'label.filter.maritalStatus', queryKey:"marital_status", primary: false,
                    value: [], defaultGroup:'column', groupBy:false, filterType: "checkbox",
                    autoCompleteOptions: infantMaritalStatusOptions, helpText:"label.help.text.marital.status"},

                {key: 'mother_education', title: 'label.filter.education', queryKey:"mother_education", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: infantEducationOptions, helpText:"label.help.text.mother.education"},

                // Birth Characteristics
                {key: 'gestation_recode11', title: 'label.filter.infant_mortality.gestation_recode11', queryKey:"gestation_recode11",
                    primary: false, value: [], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: infantGestationalGroup1,
                    helpText:"label.help.text.gestational.group.one"},

                {key: 'gestation_recode10', title: 'label.filter.infant_mortality.gestation_recode10', queryKey:"gestation_recode10",
                    primary: false, value: [], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: infantGestationalGroup2,
                    helpText:"label.help.text.gestational.group.two"},

                {key: 'gestation_weekly', title: 'label.filter.infant_mortality.gestation_weekly', queryKey:"gestation_weekly",
                    primary: false, value: [], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: gestationWeekly,
                    helpText:"label.help.text.gestational.weekly"},

                {key: 'prenatal_care', title: 'label.filter.monthPrenatalCareBegan', queryKey:"prenatal_care",
                    primary: false, value: [], defaultGroup:'column', groupBy: false,
                    filterType: "checkbox", autoCompleteOptions: infantPrenatalCareMonthOptions,
                    helpText:"label.help.text.prenatal.care"},

                {key: 'birth_weight', title: 'label.filter.birthWeight', queryKey:"birth_weight_r12", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: infantBirthWeightR12Options, helpText: "label.help.text.birth.weight"},

                {key: 'birth_plurality', title: 'label.filter.plurality', queryKey:"birth_plurality", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: birthPluralityOptions, helpText:"label.help.text.birth.plurality"},

                {key: 'live_birth', title: 'label.filter.liveBirthOrder', queryKey:"live_birth", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: infantLiveBirthOrderOptions, helpText:"label.help.text.live.birth.order"},

                {key: 'birth_place', title: 'label.filter.birthPlace', queryKey:"birth_place", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: infantBirthPlaceOptions, helpText:"label.help.text.birth.place"},

                {key: 'delivery_method', title: 'label.filter.deliveryMethod', queryKey:"delivery_method", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: infantDeliveryMethodOptions, helpText:"label.help.text.delivery.method"},

                {key: 'medical_attendant', title: 'label.filter.medicalAttendant', queryKey:"medical_attendant", primary: false,
                    value: [], defaultGroup:'column', groupBy: false, filterType: "checkbox",
                    autoCompleteOptions: infantMedicalAttendantOptions, helpText:"label.help.text.medical.attendant"},

                // Location
                {key: 'state', title: 'label.filter.state', queryKey: 'state', primary: false,
                    value: [], defaultGroup: 'column', groupBy: false, filterType: 'checkbox',
                    autoCompleteOptions: stateOptions, helpText: 'label.help.text.state',
                    displaySearchBox: true, displaySelectedFirst: true}
            ]
        }

        /**
         * To prepare all STD side filters
         * @return STD side filters array
         */
        function getSTDDataFilters() {
            var stdDiseaseOptions = [
                {"key": "Chlamydia", "title": "Chlamydia"},
                {"key": "Gonorrhea", "title": "Gonorrhea"},
                {"key": "Primary and Secondary Syphilis", "title": "Primary and Secondary Syphilis"},
                {"key": "Early Latent Syphilis", "title": "Early Latent Syphilis"},
                {"key": "Congenital Syphilis", "title": "Congenital Syphilis"}
            ];

            return [
                {
                    key: 'current_year',
                    title: 'label.filter.year',
                    queryKey: "current_year",
                    primary: false,
                    value: "2016",
                    defaultValue: "2016",
                    groupBy: false,
                    filterType: 'radio',defaultGroup:"column",
                    autoCompleteOptions: diseaseYearOptions,
                    doNotShowAll: true,
                    helpText: "label.std.help.text.year"
                },
                {
                    key: 'disease',
                    title: 'label.filter.disease',
                    queryKey: "disease",
                    primary: false,
                    value: 'Chlamydia',
                    defaultValue: "Chlamydia",
                    groupBy: false,
                    filterType: 'radio',defaultGroup:"row",
                    autoCompleteOptions: stdDiseaseOptions,
                    doNotShowAll: true,
                    helpText: "label.std.help.text.disease"
                },

                {
                    key: 'state', title: 'label.filter.state', queryKey: "state", primary: false,
                    value: 'National', defaultValue: "National",
                    groupBy: false, filterType: 'radio', displaySearchBox: true, displaySelectedFirst: true,
                    autoCompleteOptions: diseaseStateOptions,
                    doNotShowAll: true,defaultGroup:"row",
                    helpText: "label.std.help.text.state"
                },

                {
                    key: 'age_group',
                    title: 'label.filter.agegroup',
                    queryKey: "age_group",
                    primary: false,
                    value: 'All age groups',
                    defaultValue: 'All age groups',
                    groupBy: false,
                    filterType: 'radio',defaultGroup:"row",
                    autoCompleteOptions: stdAgeGroupOptions,
                    doNotShowAll: true,
                    helpText: "label.std.help.text.age.group"
                },

                {
                    key: 'race',
                    title: 'label.yrbs.filter.race',
                    queryKey: "race_ethnicity",
                    primary: false,
                    value: 'All races/ethnicities',
                    defaultValue: 'All races/ethnicities',
                    groupBy: "row",
                    filterType: 'radio',
                    defaultGroup:"row",
                    autoCompleteOptions: diseaseRaceOptions,
                    doNotShowAll: true,
                    helpText: "label.std.help.text.race.ethnicity"
                },

                {
                    key: 'sex',
                    title: 'label.filter.gender',
                    queryKey: "sex",
                    primary: false,
                    value: 'Both sexes',
                    defaultValue: 'Both sexes',
                    groupBy: "column",
                    defaultGroup:"column",
                    filterType: 'radio',
                    autoCompleteOptions: diseaseGenderOptions,
                    doNotShowAll: true,
                    helpText: "label.std.help.text.sex"
                }
                ]

        }

        /**
         * To prepare all TB side filters
         * @return TB side filters array
         */
        function getTBDataFilters() {
            var tbAgeGroupOptions = [
                {"key": "All age groups", "title": "All age groups"},
                {"key": "0-4", "title": "0-4"},
                {"key": "05-14", "title": "05-14"},
                {"key": "15-24", "title": "15-24"},
                {"key": "25-34", "title": "25-34"},
                {"key": "35-44", "title": "35-44"},
                {"key": "45-54", "title": "45-54"},
                {"key": "55-64", "title": "55-64"},
                {"key": "65+", "title": "65+"}
            ];

            var years = [
                {"key": "2017", "title": "2017"},
                {"key": "2016", "title": "2016"},
                {"key": "2015", "title": "2015"},
                {"key": "2014", "title": "2014"},
                {"key": "2013", "title": "2013"},
                {"key": "2012", "title": "2012"},
                {"key": "2011", "title": "2011"},
                {"key": "2010", "title": "2010"},
                {"key": "2009", "title": "2009"},
                {"key": "2008", "title": "2008"},
                {"key": "2007", "title": "2007"},
                {"key": "2006", "title": "2006"},
                {"key": "2005", "title": "2005"},
                {"key": "2004", "title": "2004"},
                {"key": "2003", "title": "2003"},
                {"key": "2002", "title": "2002"},
                {"key": "2001", "title": "2001"},
                {"key": "2000", "title": "2000"}
            ];

            var countryOfBirth =  [
                {key: 'No stratification', title: 'All countries of birth'},
                {key: 'Foreign-born', title: 'Foreign-born'},
                {key: 'US-born', title: 'US-born'}
            ];

            return [
                {
                    key: 'current_year',
                    title: 'label.filter.year',
                    queryKey: "current_year",
                    primary: false,
                    value: "2017",
                    groupBy: false,
                    filterType: 'radio',defaultGroup:"row",
                    autoCompleteOptions: years,
                    doNotShowAll: true,
                    helpText: "label.help.text.tb.year"
                },
                {
                    key: 'age_group',
                    title: 'label.filter.agegroup',
                    queryKey: "age_group",
                    primary: false,
                    value: 'All age groups',
                    groupBy: false,
                    filterType: 'radio',defaultGroup:"row",
                    autoCompleteOptions: tbAgeGroupOptions,
                    doNotShowAll: true,
                    helpText: "label.std.help.text.age.group"
                },
                {
                    key: 'race',
                    title: 'label.yrbs.filter.race',
                    queryKey: "race_ethnicity",
                    primary: false,
                    value: 'All races/ethnicities',
                    groupBy: "row",
                    filterType: 'radio',defaultGroup:"row",
                    autoCompleteOptions: diseaseRaceOptions,
                    doNotShowAll: true,
                    helpText: "label.help.text.tb.race"
                },
                {
                    key: 'sex',
                    title: 'label.filter.gender',
                    queryKey: "sex",
                    primary: false,
                    value: 'Both sexes',
                    groupBy: "column",
                    filterType: 'radio',defaultGroup:"column",
                    autoCompleteOptions: diseaseGenderOptions,
                    doNotShowAll: true,
                    helpText: "label.help.text.tb.sex"
                },
                {
                    key: 'state', title: 'label.filter.state', queryKey: "state",
                    primary: false, value: 'National',
                    groupBy: false, filterType: 'radio',defaultGroup:"row",
                    displaySearchBox: true, displaySelectedFirst: true,
                    autoCompleteOptions: diseaseStateOptions,
                    doNotShowAll: true,
                    helpText: "label.help.text.tb.state"
                },
                {
                    key: 'transmission', title: 'label.tb.filter.countryOfBirth', queryKey: "transmission",
                    primary: false, value: 'No stratification',
                    groupBy: false, filterType: 'radio', defaultGroup:"column",
                    autoCompleteOptions: countryOfBirth,
                    doNotShowAll: true,
                    helpText: "label.help.text.tb.countryOfBirth"
                }
            ]

        }

        function getAIDSFilters () {
            var aidsDiseaseOptions = [
                { key: 'HIV, stage 3 (AIDS)', title: 'AIDS Diagnoses' },
                { key: 'HIV, stage 3 (AIDS) deaths', title: 'AIDS Deaths' },
                { key: 'Persons living with HIV, stage 3 (AIDS)', title: 'AIDS Prevalence' },
                { key: 'HIV diagnoses', title: 'HIV Diagnoses' },
                { key: 'HIV deaths', title: 'HIV Deaths' },
                { key: 'Persons living with diagnosed HIV', title: 'HIV Prevalence' }
            ];

            var aidsRaceOptions = [
                { key: 'All races/ethnicities', title: 'All races/ethnicities' },
                { key: 'American Indian or Alaska Native', title: 'American Indian/Alaska Native' },
                { key: 'Asian', title: 'Asian' },
                { key: 'Black or African American', title: 'Black/African American' },
                { key: 'Hispanic or Latino', title: 'Hispanic/Latino' },
                { key: 'Multiple races', title: 'Multiple races' },
                { key: 'Native Hawaiian or Other Pacific Islander', title: 'Native Hawaiian/Other Pacific Islander' },
                { key: 'White', title: 'White' }
            ];

            var aidsAgeGroupOptions = [
                { key: 'All age groups', title: 'Ages 13 years and older' },
                { key: '13-24', title: '13-24' },
                { key: '25-34', title: '25-34' },
                { key: '35-44', title: '35-44' },
                { key: '45-54', title: '45-54' },
                { key: '55+', title: '55+' }
            ];

            var aidsTransmissionOptions = [
                { key: 'No stratification', title: 'All transmission categories' },
                { key: 'Heterosexual contact', title: 'Heterosexual contact' },
                { key: 'Injection drug use', title: 'Injection drug use' },
                { key: 'Male-to-Male sexual contact', title: 'Male-to-male sexual contact' },
                { key: 'Male-to-male sexual contact and injection drug use', title: 'Male-to-male sexual contact and injection drug use' },
                { key: 'Other', title: 'Other' }
            ];
            var yearOpt = [
                {"key": "2017", "title": "2017"},
                {"key": "2016", "title": "2016"},
                {"key": "2015", "title": "2015"},
                {"key": "2014", "title": "2014"},
                {"key": "2013", "title": "2013"},
                {"key": "2012", "title": "2012"},
                {"key": "2011", "title": "2011"},
                {"key": "2010", "title": "2010"},
                {"key": "2009", "title": "2009"},
                {"key": "2008", "title": "2008"},
                {"key": "2007", "title": "2007"},
                {"key": "2006", "title": "2006"},
                {"key": "2005", "title": "2005"},
                {"key": "2004", "title": "2004"},
                {"key": "2003", "title": "2003"},
                {"key": "2002", "title": "2002"},
                {"key": "2001", "title": "2001"},
                {"key": "2000", "title": "2000"}
            ];

            return [
                {
                    key: 'disease',
                    title: 'label.filter.indicator',
                    queryKey: 'disease',
                    primary: false,
                    value: 'HIV, stage 3 (AIDS)',
                    groupBy: false,
                    filterType: 'radio',
                    defaultGroup:"row",
                    autoCompleteOptions: aidsDiseaseOptions,
                    doNotShowAll: true,
                    helpText: 'label.help.text.disease'
                },
                {
                    key: 'state',
                    title: 'label.filter.state',
                    queryKey: 'state',
                    primary: false,
                    value: 'National',
                    groupBy: false,
                    filterType: 'radio',
                    defaultGroup:"row",
                    displaySearchBox: true,
                    displaySelectedFirst: true,
                    autoCompleteOptions: diseaseStateOptions,
                    doNotShowAll: true,
                    helpText: 'label.std.help.text.state'
                },
                {
                    key: 'current_year',
                    title: 'label.filter.year',
                    queryKey: 'current_year',
                    primary: false,
                    value: '2016',
                    groupBy: false,
                    filterType: 'radio',
                    defaultGroup:"row",
                    autoCompleteOptions: yearOpt,
                    doNotShowAll: true,
                    helpText: 'label.help.text.hiv.year'
                },
                {
                    key: 'race',
                    title: 'label.yrbs.filter.race',
                    queryKey: 'race_ethnicity',
                    primary: false,
                    value: 'All races/ethnicities',
                    groupBy: 'row',
                    defaultGroup:"row",
                    filterType: 'radio',
                    autoCompleteOptions: aidsRaceOptions,
                    doNotShowAll: true,
                    helpText: 'label.std.help.text.race.ethnicity'
                },
                {
                    key: 'sex',
                    title: 'label.filter.gender',
                    queryKey: "sex",
                    primary: false,
                    value: 'Both sexes',
                    groupBy: 'column',
                    defaultGroup:"column",
                    filterType: 'radio',
                    autoCompleteOptions: diseaseGenderOptions,
                    doNotShowAll: true,
                    helpText: 'label.help.text.tb.sex'
                },
                {
                    key: 'age_group',
                    title: 'label.filter.agegroup',
                    queryKey: 'age_group',
                    primary: false,
                    value: 'All age groups',
                    groupBy: false,
                    defaultGroup:"row",
                    filterType: 'radio',
                    autoCompleteOptions: aidsAgeGroupOptions,
                    doNotShowAll: true,
                    helpText: 'label.help.text.hiv.agegroup'
                },
                {
                    key: 'transmission',
                    title: 'label.filter.transmission',
                    queryKey: 'transmission',
                    primary: false,
                    value: 'No stratification',
                    groupBy: false,
                    defaultGroup:"row",
                    filterType: 'radio',
                    autoCompleteOptions: aidsTransmissionOptions,
                    doNotShowAll: true,
                    helpText: 'label.help.text.transmission'
                }
            ]
        }

        /**
         * STD, TB and HIV-AIDS filters has different types of All values
         * To show data table data in proper order, we need this list
         * @return Side filters All option values
         */
        function getAllOptionValues() {
            return ["Both sexes", "All races/ethnicities", "All age groups", "National", "No stratification"]
        }

        function cancerIncidenceFilters () {
            return [
                {
                    key: 'current_year',
                    title: 'label.filter.year',
                    queryKey: 'current_year',
                    primary: false,
                    value: [ '2016' ],
                    groupBy: false,
                    filterType: 'checkbox',
                    autoCompleteOptions: yearOptions,
                    defaultGroup: 'column',
                    helpText: 'label.help.text.cancer_incidence.year'
                },
                {
                    key: 'sex',
                    title: 'label.filter.gender',
                    queryKey: 'sex',
                    primary: false,
                    value: [],
                    groupBy: 'column',
                    filterType: 'checkbox',
                    autoCompleteOptions: genderOptions,
                    defaultGroup: 'column',
                    helpText: 'label.help.text.cancer_incidence.sex'
                },
                {
                    key: 'race',
                    title: 'label.filter.race',
                    queryKey: 'race',
                    primary: false,
                    value: [],
                    groupBy: 'row',
                    filterType: 'checkbox',
                    autoCompleteOptions: cancerRaceOptions,
                    defaultGroup: 'row',
                    helpText: 'label.help.text.cancer_incidence.race'
                },
                {
                    key: 'hispanic_origin',
                    title: 'label.filter.hispanicOrigin',
                    queryKey: 'hispanic_origin',
                    primary: false,
                    value: [],
                    groupBy: false,
                    filterType: 'checkbox',
                    autoCompleteOptions: cancerHispanicOptions.slice(0, -1),
                    defaultGroup: 'row',
                    helpText: 'label.help.text.cancer_incidence.hispanic_origin'
                },
                {
                    key: 'age_group',
                    title: 'label.filter.agegroup',
                    queryKey: 'age_group',
                    primary: false,
                    value: [],
                    groupBy: false,
                    filterType: 'checkbox',
                    autoCompleteOptions: cancerAgeGroups,
                    disableAll: false,
                    defaultGroup: 'row',
                    helpText: 'label.help.text.cancer_incidence.age_group'
                },
                {
                    key: 'site',
                    title: 'label.filter.cancer_site',
                    queryKey: 'cancer_site',
                    primary: false,
                    value: [],
                    groupBy: false,
                    filterType: 'site',
                    selectTitle: 'label.cancer_site.select',
                    updateTitle: 'label.cancer_site.update',
                    autoCompleteOptions: cancerService.getCancerSiteListFor('cancer_incidence'),
                    tree: cancerService.getCancerSitesFor('cancer_incidence'),
                    aggregationKey: 'cancer_site.path',
                    defaultGroup:'row',
                    helpText: 'label.help.text.cancer_incidence.cancer_site'
                },
                {
                    key: 'childhood_cancer',
                    title: 'label.filter.childhood_cancer',
                    queryKey: 'childhood_cancer',
                    primary: false,
                    value: [],
                    groupBy: false,
                    filterType: 'site',
                    selectTitle: 'label.childhood_cancer.select',
                    updateTitle: 'label.childhood_cancer.update',
                    autoCompleteOptions: cancerService.getChildhoodCancersList(),
                    tree: cancerService.getChildhoodCancers(),
                    aggregationKey: 'childhood_cancer.path',
                    defaultGroup:'row',
                    helpText: 'label.help.text.childhood_cancer'
                },
                {
                    key: 'state',
                    title: 'label.filter.state',
                    queryKey: 'state',
                    primary: false,
                    value: [],
                    groupBy: false,
                    filterType: 'checkbox',
                    displaySearchBox: true,
                    displaySelectedFirst: true,
                    autoCompleteOptions: (function (states) {
                        states.forEach(function (state) {
                            if (state.key === 'KS') {
                                state.disabled = true;
                                return state;
                            }
                        })
                        return states;
                    })(utilService.clone(stateOptions)),
                    defaultGroup:'column',
                    helpText: 'label.help.text.cancer_incidence.state'
                }
            ]
        }

        function cancerMortalityFilters () {
            return [
                {
                    key: 'current_year',
                    title: 'label.filter.year',
                    queryKey: 'current_year',
                    primary: false,
                    value: [ '2016' ],
                    groupBy: false,
                    filterType: 'checkbox',
                    autoCompleteOptions: yearOptions,
                    defaultGroup:"column",
                    helpText: 'label.help.text.cancer_mortality.year'
                },
                {
                    key: 'sex',
                    title: 'label.filter.gender',
                    queryKey: 'sex',
                    primary: false,
                    value: [],
                    groupBy: 'column',
                    defaultGroup:"column",
                    filterType: 'checkbox',
                    autoCompleteOptions: genderOptions,
                    helpText: 'label.help.text.cancer_mortality.sex'
                },
                {
                    key: 'race',
                    title: 'label.filter.race',
                    queryKey: 'race',
                    primary: false,
                    value: [],
                    groupBy: 'row',
                    defaultGroup:"row",
                    filterType: 'checkbox',
                    autoCompleteOptions: cancerRaceOptions.slice(0, -1),
                    helpText: 'label.help.text.cancer_mortality.race'
                },
                {
                    key: 'hispanic_origin',
                    title: 'label.filter.hispanicOrigin',
                    queryKey: 'hispanic_origin',
                    primary: false,
                    value: [],
                    groupBy: false,
                    defaultGroup:"row",
                    filterType: 'checkbox',
                    autoCompleteOptions: cancerHispanicOptions.slice(0, 2).concat(cancerHispanicOptions.slice(-1)),
                    helpText: 'label.help.text.cancer_mortality.hispanic_origin'
                },
                {
                    key: 'age_group',
                    title: 'label.filter.agegroup',
                    queryKey: 'age_group',
                    primary: false,
                    value: [],
                    groupBy: false,
                    defaultGroup:"row",
                    filterType: 'checkbox',
                    autoCompleteOptions: cancerAgeGroups,
                    helpText: 'label.help.text.cancer_mortality.age_group'
                },
                {
                    key: 'site',
                    title: 'label.filter.cancer_site',
                    queryKey: 'cancer_site',
                    primary: false,
                    value: [],
                    groupBy: false,
                    filterType: 'site',
                    selectTitle: 'label.cancer_site.select',
                    updateTitle: 'label.cancer_site.update',
                    autoCompleteOptions: cancerService.getCancerSiteListFor(),
                    tree: cancerService.getCancerSitesFor(),
                    aggregationKey: 'cancer_site.path',
                    defaultGroup:'row',
                    helpText: 'label.help.text.cancer_mortality.cancer_site'
                },
                {
                    key: 'state',
                    title: 'label.filter.state',
                    queryKey: 'state',
                    primary: false,
                    value: [],
                    groupBy: false,
                    filterType: 'checkbox',
                    displaySearchBox: true,
                    displaySelectedFirst: true,
                    autoCompleteOptions: stateOptions,
                    doNotShowAll: true,
                    defaultGroup:"row",
                    helpText: 'label.help.text.cancer_mortality.state'
                }
            ]
        }
    }

}());
