var logger = require('../config/logging');
var request = require('request');
var xmlbuilder = require('xmlbuilder');
var X2JS = require('x2js');
var inspect = require('util').inspect;
var q = require('q');
var config = require('../config/config');

var wonderParamCodeMap = {
    'D77': {
        'race': {
            "key": 'D77.V8',
            "values": {
                "White": '2106-3',
                "Black": '2054-5',
                "American Indian": '1002-5',
                "Asian or Pacific Islander": 'A-PI',
                "Other (Puerto Rico only)": false
            }
        },
        'gender': {
            "key": 'D77.V7',
            "values": {
                "Female": 'F',
                "Male": 'M',
            }
        },
        //Map wonder query has 'sex' as filed name so added this entry to get right key 'D77.V7' for sex
        'sex': {
            "key": 'D77.V7',
            "values": {
                "Female": 'F',
                "Male": 'M',
            }
        },
        'hispanicOrigin': {
            'key': 'D77.V17',
            'values': {
                'Hispanic': '2135-2',
                'Non-Hispanic': '2186-2'
            }
        },
        'year':'D77.V1',// Use this mapping for filtering param
        'year-group':'D77.V1-level1', // Use this mapping for grouping param
        'agegroup':'D77.V51',
        'weekday':'D77.V24',
        'autopsy': {
            "key": 'D77.V20',
            "values": {
                'Yes': 'Y',
                'No': 'N',
                'Unknown': 'U'
            }
        },
        'placeofdeath':'D77.V21',
        'month':'D77.V1-level2',
        'ucd-chapter-10':'D77.V2',
        'state-group':'D77.V9-level1', // Use this mapping for grouping param
        //Map wonder query has 'states' as filed name so added this entry to get right key 'D77.V9-level1' for states
        'states-group':'D77.V9-level1', // Use this mapping for grouping param
        'state': { // Use this for filtering param
            "key":'D77.V9',
            "values":{
                "AL":"01",
                "AK":"02",
                "AZ":"04",
                "AR":"05",
                "CA":"06",
                "CO":"08",
                "CT":"09",
                "DE":"10",
                "DC":"11",
                "FL":"12",
                "GA":"13",
                "HI":"15",
                "ID":"16",
                "IL":"17",
                "IN":"18",
                "IA":"19",
                "KS":"20",
                "KY":"21",
                "LA":"22",
                "ME":"23",
                "MD":"24",
                "MA":"25",
                "MI":"26",
                "MN":"27",
                "MS":"28",
                "MO":"29",
                "MT":"30",
                "NE":"31",
                "NV":"32",
                "NH":"33",
                "NJ":"34",
                "NM":"35",
                "NY":"36",
                "NC":"37",
                "ND":"38",
                "OH":"39",
                "OK":"40",
                "OR":"41",
                "PA":"42",
                "RI":"44",
                "SC":"45",
                "SD":"46",
                "TN":"47",
                "TX":"48",
                "UT":"49",
                "VT":"50",
                "VA":"51",
                "WA":"53",
                "WV":"54",
                "WI":"55",
                "WY":"56"
            }
        },
        'census-region': 'D77.V10',
        'census-region|census_region-group':'D77.V10-level1',
        'census-region|census_division-group':'D77.V10-level2',
        'hhs-region': 'D77.V27',
        'hhs-region-group': 'D77.V27-level1',
    },
    "D69": {
        'year_of_death': 'D69.V9',
        'sex': {
            'key': 'D69.V3',
            'values': {
                "Female": 'F',
                "Male": 'M'
            }
        },
        'infant_age_at_death': {
            'key': 'D69.V13',
            'values': {
                'Under 1 hour': '01',
                '1-23 hours': '02',
                '1-6 days': '03',
                '7-27 days': '04',
                '28 days and over': '05'
            }
        },
        'race': {
            "key": 'D69.V2',
            "values": {
                "White": '2106-3',
                "Black": '2054-5',
                "American Indian or Alaska Native": '1002-5',
                "Asian or Pacific Islander": 'A-PI'
            }
        },
        'hispanic_origin': {
            'key': 'D69.V4',
            'values': {
                'hispanic_origin': '2148-5',
                'Puerto Rican': '2180-8',
                'Cuban': '2182-4',
                'Central or South American': '4',
                'Other and Unknown Hispanic': '5',
                'Non-Hispanic White': '6',
                'Non-Hispanic Black': '7',
                'Non-Hispanic Other Races': '8',
                'Origin unknown or not stated': '9'
            }
        },
        'mother_age_5_interval': {
            'key': 'D69.V1',
            'values': {
                'Under 15 years': '15',
                '15-19 years': '15-19',
                '20-24 years': '20-24',
                '25-29 years': '25-29',
                '30-34 years': '30-34',
                '35-39 years': '35-39',
                '40-44 years': '40-44',
                '45-49 years': '45-49',
                '50-54 years': '50+'
            }
        },
        'marital_status': {
            'key': 'D69.V11',
            'values': {
                'Married': '1',
                'Unmarried': '2',
                'Unknown or not Stated': '9'
            }
        },
        'mother_education': {
            'key': 'D69.V5',
            'values': {
                //'0 – 8 years': '',
                //'9 – 11 years': '',
                //'12 years': '',
                //'13 – 15 years': '',
                //'16 years and over': '',
                //'Not stated': '',
                '8th grade or less': '1',
                '9th through 12th grade with no diploma': '2',
                'High school graduate or GED completed': '3',
                'Some college credit, but not a degree': '4',
                'Associate degree (AA,AS)': '5',
                'Bachelor’s degree (BA, AB, BS)': '6',
                'Master’s degree (MA, MS, MEng, MEd, MSW, MBA)': '7',
                'Doctorate (PhD, EdD) or Professional Degree (MD, DDS, DVM, LLB, JD)': '8',
                'Unknown': 'Unk',
                'Not on certificate': '999'
            }
        },
        'gestation_recode11': {
            'key': 'D69.V24',
            'values': {
                'Under 20 weeks': '01',
                '20 - 27 weeks': '02',
                '28 - 31 weeks': '03',
                '32 - 33 weeks': '04',
                '34 - 36 weeks': '05',
                '37 - 38 weeks': '06',
                '39 weeks': '07',
                '40 weeks': '08',
                '41 weeks': '09',
                '42 weeks and over': '10',
                'Unknown': '11'
            }
        },
        'gestation_recode10': {
            'key': 'D69.V6',
            'values': {
                'Under 20 weeks':'01',
                '20 - 27 weeks':'02',
                '28 - 31 weeks':'03',
                '32 - 35 weeks':'04',
                '36 weeks':'05',
                '37 - 39 weeks':'06',
                '40 weeks':'07',
                '41 weeks':'08',
                '42 weeks and over':'09',
                'Unknown':'10',
            }
        },
        'gestation_weekly': {
            'key': 'D69.V25',
            'values': {
                '17 weeks':'17',
                '18 weeks':'18',
                '19 weeks':'19',
                '20 weeks':'20',
                '21 weeks':'21',
                '22 weeks':'22',
                '23 weeks':'23',
                '24 weeks':'24',
                '25 weeks':'25',
                '26 weeks':'26',
                '27 weeks':'27',
                '28 weeks':'28',
                '29 weeks':'29',
                '30 weeks':'30',
                '31 weeks':'31',
                '32 weeks':'32',
                '33 weeks':'33',
                '34 weeks':'34',
                '35 weeks':'35',
                '36 weeks':'36',
                '37 weeks':'37',
                '38 weeks':'38',
                '39 weeks':'39',
                '40 weeks':'40',
                '41 weeks':'41',
                '42 weeks':'42',
                '43 weeks':'43',
                '44 weeks':'44',
                '45 weeks':'45',
                '46 weeks':'46',
                '47 weeks':'47',
                'Unknown':'99'
            }
        },
        'prenatal_care': {
            'key': 'D69.V7',
            'values': {
                'No prenatal care':'00',
                '1st month':'01',
                '2nd month':'02',
                '3rd month':'03',
                '4th month':'04',
                '5th month':'05',
                '6th month':'06',
                '7th month':'07',
                '8th month': '08',
                '9th month': '09',
                '10th month': '10',
                'Unknown or not stated': '98',
                'Not on certificate': '99'
            }
        },
        'birth_weight': {
            'key': 'D69.V8',
            'values': {
                '499 grams or less':'01',
                '500 - 999 grams':'02',
                '1000 - 1499 grams':'03',
                '1500 - 1999 grams':'04',
                '2000 - 2499 grams':'05',
                '2500 - 2999 grams':'06',
                '3000 - 3499 grams':'07',
                '3500 - 3999 grams':'08',
                '4000 - 4499 grams':'09',
                '4500 - 4999 grams':'10',
                '5000 - 8165 grams':'11',
                'Not Stated': '12'
            }
        },
        'birth_plurality': {
            'key': 'D69.V15',
            'values': {
                'Single':'1',
                'Twin':'2',
                'Triplet':'3',
                'Quadruplet':'4',
                'Quintuplet or higher':'5'
            }
        },
        'live_birth': {
            'key': 'D69.V12',
            'values': {
                '1st child born alive to mother':'01',
                '2nd child born alive to mother':'02',
                '3rd child born alive to mother':'03',
                '4th child born alive to mother':'04',
                '5th child born alive to mother':'05',
                '6th child born alive to mother':'06',
                //'7th child born alive to mother':'',
                //'8 or more live births': '',
                'Unknown or not stated': '99'
            }
        },
        'birth_place': {
            'key': 'D69.V21',
            'values': {
                'In Hospital':'1',
                //'Freestanding Birthing Center':'',
                //'Clinic / Doctor’s Office':'',
                //'Residence':'',
                //'Other':'',
                'Unknown':'3'
            }
        },
        'delivery_method': {
            'key': 'D69.V22',
            'values': {
                'Cesarean':'2',
                'Vaginal':'1',
                'Not stated':'9'
                //'Unknown':''
            }
        },
        'medical_attendant': {
            'key': 'D69.V20',
            'values': {
                'Doctor of Medicine (MD)':'1',
                'Doctor of Osteopathy (DO)':'2',
                'Certified Nurse Midwife (CNM)':'3',
                'Other Midwife':'4',
                'Other':'5',
                'Unknown or not stated':'9'
            }
        },
        'state': {
            'key': 'D69.V10',
            'values':{
                "AL":"01",
                "AK":"02",
                "AZ":"04",
                "AR":"05",
                "CA":"06",
                "CO":"08",
                "CT":"09",
                "DE":"10",
                "DC":"11",
                "FL":"12",
                "GA":"13",
                "HI":"15",
                "ID":"16",
                "IL":"17",
                "IN":"18",
                "IA":"19",
                "KS":"20",
                "KY":"21",
                "LA":"22",
                "ME":"23",
                "MD":"24",
                "MA":"25",
                "MI":"26",
                "MN":"27",
                "MS":"28",
                "MO":"29",
                "MT":"30",
                "NE":"31",
                "NV":"32",
                "NH":"33",
                "NJ":"34",
                "NM":"35",
                "NY":"36",
                "NC":"37",
                "ND":"38",
                "OH":"39",
                "OK":"40",
                "OR":"41",
                "PA":"42",
                "RI":"44",
                "SC":"45",
                "SD":"46",
                "TN":"47",
                "TX":"48",
                "UT":"49",
                "VT":"50",
                "VA":"51",
                "WA":"53",
                "WV":"54",
                "WI":"55",
                "WY":"56"
            }
        },
        'states': {
            'key': 'D69.V10',
            'values':{
                "AL":"01",
                "AK":"02",
                "AZ":"04",
                "AR":"05",
                "CA":"06",
                "CO":"08",
                "CT":"09",
                "DE":"10",
                "DC":"11",
                "FL":"12",
                "GA":"13",
                "HI":"15",
                "ID":"16",
                "IL":"17",
                "IN":"18",
                "IA":"19",
                "KS":"20",
                "KY":"21",
                "LA":"22",
                "ME":"23",
                "MD":"24",
                "MA":"25",
                "MI":"26",
                "MN":"27",
                "MS":"28",
                "MO":"29",
                "MT":"30",
                "NE":"31",
                "NV":"32",
                "NH":"33",
                "NJ":"34",
                "NM":"35",
                "NY":"36",
                "NC":"37",
                "ND":"38",
                "OH":"39",
                "OK":"40",
                "OR":"41",
                "PA":"42",
                "RI":"44",
                "SC":"45",
                "SD":"46",
                "TN":"47",
                "TX":"48",
                "UT":"49",
                "VT":"50",
                "VA":"51",
                "WA":"53",
                "WV":"54",
                "WI":"55",
                "WY":"56"
            }
        },
        'states-group':'D69.V10-level1'
    },
    "D31": {
        'year_of_death': 'D31.V9',
        'sex': {
            'key': 'D31.V3',
            'values': {
                "Female": 'F',
                "Male": 'M'
            }
        },
        'infant_age_at_death': {
            'key': 'D31.V13',
            'values': {
                'Under 1 hour': '01',
                '1-23 hours': '02',
                '1-6 days': '03',
                '7-27 days': '04',
                '28 days and over': '05'
            }
        },
        'race': {
            "key": 'D31.V2',
            "values": {
                "White": '2106-3',
                "Black": '2054-5',
                "American Indian or Alaska Native": '1002-5',
                "Asian or Pacific Islander": 'A-PI'
            }
        },
        'hispanic_origin': {
            'key': 'D31.V4',
            'values': {
                'hispanic_origin': '2148-5',
                'Puerto Rican': '2180-8',
                'Cuban': '2182-4',
                'Central or South American': '4',
                'Other and Unknown Hispanic': '5',
                'Non-Hispanic White': '6',
                'Non-Hispanic Black': '7',
                'Non-Hispanic Other Races': '8',
                'Origin unknown or not stated': '9'
            }
        },
        'mother_age_5_interval': {
            'key': 'D31.V1',
            'values': {
                'Under 15 years': '15',
                '15-19 years': '15-19',
                '20-24 years': '20-24',
                '25-29 years': '25-29',
                '30-34 years': '30-34',
                '35-39 years': '35-39',
                '40-44 years': '40-44',
                '45-49 years': '45-49',
                '50-54 years': '50+'
            }
        },
        'marital_status': {
            'key': 'D31.V11',
            'values': {
                'Married': '1',
                'Unmarried': '2',
                'Unknown or not Stated': '9'
            }
        },
        'mother_education': {
            'key': 'D31.V5',
            'values': {
                '0 – 8 years': '19176',
                '9 – 11 years': '19177',
                '12 years': '19178',
                '13 – 15 years': '19179',
                '16 years and over': '16+',
                'Not stated': 'NR'
            }
        },
        'gestation_recode11': {
            'key': 'D31.V24',
            'values': {
                'Under 20 weeks': '01',
                '20 - 27 weeks': '02',
                '28 - 31 weeks': '03',
                '32 - 33 weeks': '04',
                '34 - 36 weeks': '05',
                '37 - 38 weeks': '06',
                '39 weeks': '07',
                '40 weeks': '08',
                '41 weeks': '09',
                '42 weeks and over': '10',
                'Unknown': '11'
            }
        },
        'gestation_recode10': {
            'key': 'D31.V6',
            'values': {
                'Under 20 weeks':'01',
                '20 - 27 weeks':'02',
                '28 - 31 weeks':'03',
                '32 - 35 weeks':'04',
                '36 weeks':'05',
                '37 - 39 weeks':'06',
                '40 weeks':'07',
                '41 weeks':'08',
                '42 weeks and over':'09',
                'Unknown':'10',
            }
        },
        'gestation_weekly': {
            'key': 'D31.V25',
            'values': {
                '17 weeks':'17',
                '18 weeks':'18',
                '19 weeks':'19',
                '20 weeks':'20',
                '21 weeks':'21',
                '22 weeks':'22',
                '23 weeks':'23',
                '24 weeks':'24',
                '25 weeks':'25',
                '26 weeks':'26',
                '27 weeks':'27',
                '28 weeks':'28',
                '29 weeks':'29',
                '30 weeks':'30',
                '31 weeks':'31',
                '32 weeks':'32',
                '33 weeks':'33',
                '34 weeks':'34',
                '35 weeks':'35',
                '36 weeks':'36',
                '37 weeks':'37',
                '38 weeks':'38',
                '39 weeks':'39',
                '40 weeks':'40',
                '41 weeks':'41',
                '42 weeks':'42',
                '43 weeks':'43',
                '44 weeks':'44',
                '45 weeks':'45',
                '46 weeks':'46',
                '47 weeks':'47',
                'Unknown':'99'
            }
        },
        'prenatal_care': {
            'key': 'D31.V7',
            'values': {
                'No prenatal care':'00',
                '1st month':'01',
                '2nd month':'02',
                '3rd month':'03',
                '4th month':'04',
                '5th month':'05',
                '6th month':'06',
                '7th month':'07',
                '8th month': '08',
                '9th month': '09',
                '10th month': '10',
                'Unknown or not stated': '98',
                'Not on certificate': '99'
            }
        },
        'birth_weight': {
            'key': 'D31.V8',
            'values': {
                '499 grams or less':'01',
                '500 - 999 grams':'02',
                '1000 - 1499 grams':'03',
                '1500 - 1999 grams':'04',
                '2000 - 2499 grams':'05',
                '2500 - 2999 grams':'06',
                '3000 - 3499 grams':'07',
                '3500 - 3999 grams':'08',
                '4000 - 4499 grams':'09',
                '4500 - 4999 grams':'10',
                '5000 - 8165 grams':'11',
                'Not Stated': '12'
            }
        },
        'birth_plurality': {
            'key': 'D31.V15',
            'values': {
                'Single':'1',
                'Twin':'2',
                'Triplet':'3',
                'Quadruplet':'4',
                'Quintuplet or higher':'5'
            }
        },
        'live_birth': {
            'key': 'D31.V12',
            'values': {
                '1st child born alive to mother':'01',
                '2nd child born alive to mother':'02',
                '3rd child born alive to mother':'03',
                '4th child born alive to mother':'04',
                '5th child born alive to mother':'05',
                '6th child born alive to mother':'06',
                'Unknown or not stated': '99'
            }
        },
        'birth_place': {
            'key': 'D31.V21',
            'values': {
                'In Hospital':'1',
                'Unknown':'3'
            }
        },
        'delivery_method': {
            'key': 'D31.V22',
            'values': {
                'Cesarean':'2',
                'Vaginal':'1',
                'Not stated':'9'
            }
        },
        'medical_attendant': {
            'key': 'D31.V20',
            'values': {
                'Doctor of Medicine (MD)':'1',
                'Doctor of Osteopathy (DO)':'2',
                'Certified Nurse Midwife (CNM)':'3',
                'Other Midwife':'4',
                'Other':'5',
                'Unknown or not stated':'9'
            }
        },
        'state': {
            'key': 'D31.V10',
            'values':{
                "AL":"01",
                "AK":"02",
                "AZ":"04",
                "AR":"05",
                "CA":"06",
                "CO":"08",
                "CT":"09",
                "DE":"10",
                "DC":"11",
                "FL":"12",
                "GA":"13",
                "HI":"15",
                "ID":"16",
                "IL":"17",
                "IN":"18",
                "IA":"19",
                "KS":"20",
                "KY":"21",
                "LA":"22",
                "ME":"23",
                "MD":"24",
                "MA":"25",
                "MI":"26",
                "MN":"27",
                "MS":"28",
                "MO":"29",
                "MT":"30",
                "NE":"31",
                "NV":"32",
                "NH":"33",
                "NJ":"34",
                "NM":"35",
                "NY":"36",
                "NC":"37",
                "ND":"38",
                "OH":"39",
                "OK":"40",
                "OR":"41",
                "PA":"42",
                "RI":"44",
                "SC":"45",
                "SD":"46",
                "TN":"47",
                "TX":"48",
                "UT":"49",
                "VT":"50",
                "VA":"51",
                "WA":"53",
                "WV":"54",
                "WI":"55",
                "WY":"56"
            }
        },
        'states': {
            'key': 'D31.V10',
            'values':{
                "AL":"01",
                "AK":"02",
                "AZ":"04",
                "AR":"05",
                "CA":"06",
                "CO":"08",
                "CT":"09",
                "DE":"10",
                "DC":"11",
                "FL":"12",
                "GA":"13",
                "HI":"15",
                "ID":"16",
                "IL":"17",
                "IN":"18",
                "IA":"19",
                "KS":"20",
                "KY":"21",
                "LA":"22",
                "ME":"23",
                "MD":"24",
                "MA":"25",
                "MI":"26",
                "MN":"27",
                "MS":"28",
                "MO":"29",
                "MT":"30",
                "NE":"31",
                "NV":"32",
                "NH":"33",
                "NJ":"34",
                "NM":"35",
                "NY":"36",
                "NC":"37",
                "ND":"38",
                "OH":"39",
                "OK":"40",
                "OR":"41",
                "PA":"42",
                "RI":"44",
                "SC":"45",
                "SD":"46",
                "TN":"47",
                "TX":"48",
                "UT":"49",
                "VT":"50",
                "VA":"51",
                "WA":"53",
                "WV":"54",
                "WI":"55",
                "WY":"56"
            }
        },
        'states-group':'D31.V10-level1'
    },
    "D18": {
        'year_of_death': 'D18.V9',
        'sex': {
            'key': 'D18.V3',
            'values': {
                "Female": 'F',
                "Male": 'M'
            }
        },
        'infant_age_at_death': {
            'key': 'D18.V13',
            'values': {
                'Under 1 hour': '01',
                '1-23 hours': '02',
                '1-6 days': '03',
                '7-27 days': '04',
                '28 days and over': '05'
            }
        },
        'race': {
            "key": 'D18.V2',
            "values": {
                "White": '2106-3',
                "Black": '2054-5',
                "American Indian or Alaska Native": '1002-5',
                "Asian or Pacific Islander": 'A-PI'
            }
        },
        'hispanic_origin': {
            'key': 'D18.V4',
            'values': {
                'hispanic_origin': '2148-5',
                'Puerto Rican': '2180-8',
                'Cuban': '2182-4',
                'Central or South American': '4',
                'Other and Unknown Hispanic': '5',
                'Non-Hispanic White': '6',
                'Non-Hispanic Black': '7',
                'Non-Hispanic Other Races': '8',
                'Origin unknown or not stated': '9'
            }
        },
        'mother_age_5_interval': {
            'key': 'D18.V1',
            'values': {
                'Under 15 years': '15',
                '15-19 years': '15-19',
                '20-24 years': '20-24',
                '25-29 years': '25-29',
                '30-34 years': '30-34',
                '35-39 years': '35-39',
                '40-44 years': '40-44',
                '45-49 years': '45-49',
                '50-54 years': '50+'
            }
        },
        'marital_status': {
            'key': 'D18.V11',
            'values': {
                'Married': '1',
                'Unmarried': '2',
                'Unknown or not Stated': '9'
            }
        },
        'mother_education': {
            'key': 'D18.V5',
            'values': {
                '0 – 8 years': '19176',
                '9 – 11 years': '19177',
                '12 years': '19178',
                '13 – 15 years': '19179',
                '16 years and over': '16+',
                'Not stated': 'NR'
            }
        },
        'gestation_recode11': {
            'key': 'D18.V24',
            'values': {
                'Under 20 weeks': '01',
                '20 - 27 weeks': '02',
                '28 - 31 weeks': '03',
                '32 - 33 weeks': '04',
                '34 - 36 weeks': '05',
                '37 - 38 weeks': '06',
                '39 weeks': '07',
                '40 weeks': '08',
                '41 weeks': '09',
                '42 weeks and over': '10',
                'Unknown': '11'
            }
        },
        'gestation_recode10': {
            'key': 'D18.V6',
            'values': {
                'Under 20 weeks':'01',
                '20 - 27 weeks':'02',
                '28 - 31 weeks':'03',
                '32 - 35 weeks':'04',
                '36 weeks':'05',
                '37 - 39 weeks':'06',
                '40 weeks':'07',
                '41 weeks':'08',
                '42 weeks and over':'09',
                'Unknown':'10',
            }
        },
        'gestation_weekly': {
            'key': 'D18.V25',
            'values': {
                '17 weeks':'17',
                '18 weeks':'18',
                '19 weeks':'19',
                '20 weeks':'20',
                '21 weeks':'21',
                '22 weeks':'22',
                '23 weeks':'23',
                '24 weeks':'24',
                '25 weeks':'25',
                '26 weeks':'26',
                '27 weeks':'27',
                '28 weeks':'28',
                '29 weeks':'29',
                '30 weeks':'30',
                '31 weeks':'31',
                '32 weeks':'32',
                '33 weeks':'33',
                '34 weeks':'34',
                '35 weeks':'35',
                '36 weeks':'36',
                '37 weeks':'37',
                '38 weeks':'38',
                '39 weeks':'39',
                '40 weeks':'40',
                '41 weeks':'41',
                '42 weeks':'42',
                '43 weeks':'43',
                '44 weeks':'44',
                '45 weeks':'45',
                '46 weeks':'46',
                '47 weeks':'47',
                'Unknown':'99'
            }
        },
        'prenatal_care': {
            'key': 'D18.V7',
            'values': {
                'No prenatal care':'00',
                '1st month':'01',
                '2nd month':'02',
                '3rd month':'03',
                '4th month':'04',
                '5th month':'05',
                '6th month':'06',
                '7th month':'07',
                '8th month': '08',
                '9th month': '09',
                '10th month': '10',
                'Unknown or not stated': '98',
                'Not on certificate': '99'
            }
        },
        'birth_weight': {
            'key': 'D18.V8',
            'values': {
                '499 grams or less':'01',
                '500 - 999 grams':'02',
                '1000 - 1499 grams':'03',
                '1500 - 1999 grams':'04',
                '2000 - 2499 grams':'05',
                '2500 - 2999 grams':'06',
                '3000 - 3499 grams':'07',
                '3500 - 3999 grams':'08',
                '4000 - 4499 grams':'09',
                '4500 - 4999 grams':'10',
                '5000 - 8165 grams':'11',
                'Not Stated': '12'
            }
        },
        'birth_plurality': {
            'key': 'D18.V15',
            'values': {
                'Single':'1',
                'Twin':'2',
                'Triplet':'3',
                'Quadruplet':'4',
                'Quintuplet or higher':'5'
            }
        },
        'live_birth': {
            'key': 'D18.V12',
            'values': {
                '1st child born alive to mother':'01',
                '2nd child born alive to mother':'02',
                '3rd child born alive to mother':'03',
                '4th child born alive to mother':'04',
                '5th child born alive to mother':'05',
                '6th child born alive to mother':'06',
                'Unknown or not stated': '99'
            }
        },
        'birth_place': {
            'key': 'D18.V21',
            'values': {
                'In Hospital':'1',
                'Unknown':'3'
            }
        },
        'delivery_method': {
            'key': 'D18.V22',
            'values': {
                'Cesarean':'2',
                'Vaginal':'1',
                'Not stated':'9'
            }
        },
        'medical_attendant': {
            'key': 'D18.V20',
            'values': {
                'Doctor of Medicine (MD)':'1',
                'Doctor of Osteopathy (DO)':'2',
                'Certified Nurse Midwife (CNM)':'3',
                'Other Midwife':'4',
                'Other':'5',
                'Unknown or not stated':'9'
            }
        },
        'state': {
            'key': 'D18.V10',
            'values':{
                "AL":"01",
                "AK":"02",
                "AZ":"04",
                "AR":"05",
                "CA":"06",
                "CO":"08",
                "CT":"09",
                "DE":"10",
                "DC":"11",
                "FL":"12",
                "GA":"13",
                "HI":"15",
                "ID":"16",
                "IL":"17",
                "IN":"18",
                "IA":"19",
                "KS":"20",
                "KY":"21",
                "LA":"22",
                "ME":"23",
                "MD":"24",
                "MA":"25",
                "MI":"26",
                "MN":"27",
                "MS":"28",
                "MO":"29",
                "MT":"30",
                "NE":"31",
                "NV":"32",
                "NH":"33",
                "NJ":"34",
                "NM":"35",
                "NY":"36",
                "NC":"37",
                "ND":"38",
                "OH":"39",
                "OK":"40",
                "OR":"41",
                "PA":"42",
                "RI":"44",
                "SC":"45",
                "SD":"46",
                "TN":"47",
                "TX":"48",
                "UT":"49",
                "VT":"50",
                "VA":"51",
                "WA":"53",
                "WV":"54",
                "WI":"55",
                "WY":"56"
            }
        },
        'states': {
            'key': 'D18.V10',
            'values':{
                "AL":"01",
                "AK":"02",
                "AZ":"04",
                "AR":"05",
                "CA":"06",
                "CO":"08",
                "CT":"09",
                "DE":"10",
                "DC":"11",
                "FL":"12",
                "GA":"13",
                "HI":"15",
                "ID":"16",
                "IL":"17",
                "IN":"18",
                "IA":"19",
                "KS":"20",
                "KY":"21",
                "LA":"22",
                "ME":"23",
                "MD":"24",
                "MA":"25",
                "MI":"26",
                "MN":"27",
                "MS":"28",
                "MO":"29",
                "MT":"30",
                "NE":"31",
                "NV":"32",
                "NH":"33",
                "NJ":"34",
                "NM":"35",
                "NY":"36",
                "NC":"37",
                "ND":"38",
                "OH":"39",
                "OK":"40",
                "OR":"41",
                "PA":"42",
                "RI":"44",
                "SC":"45",
                "SD":"46",
                "TN":"47",
                "TX":"48",
                "UT":"49",
                "VT":"50",
                "VA":"51",
                "WA":"53",
                "WV":"54",
                "WI":"55",
                "WY":"56"
            }
        },
        'states-group':'D18.V10-level1'
    }

};

/**
 * Init wonder API with dataset id
 * @param dbID
 */
function wonder(dbID) {
    this.dbID = dbID;
}

/**
 * To request wonder query with given request xml
 * @param dbID
 * @param req
 * @return promise
 */
function requestWonder(dbID, req) {
    var defer = q.defer();
    request.post({url: config.wonder.url + dbID, form: {request_xml: req}}, function (error, response, body) {
        result = {};
        if (!error && body.indexOf('Processing Error') == -1) {
            result = processWONDERResponse(body, dbID);
            //logger.debug("Age adjusted rates: " + JSON.stringify(result));
            defer.resolve(result);
        } else {
            logger.error("WONDER Error: " + (error ? error : body) + "\nRequest: " + JSON.stringify(req));
            defer.reject('Error invoking WONDER API');
        }
    }, function (error) {
        logger.error("WONDER Error: " + error);
        defer.reject('Error invoking WONDER API');
    });
    return defer.promise;
}
/**
 * Invoke WONDER rest API
 * @param query Query from the front end
 * @result processed result from WONDER in the following format
 * { table:{
  American Indian or Alaska Native:{
    Female:{ ageAdjustedRate:'514.1'  },
    Male:{ ageAdjustedRate:'685.4'  },
    Total:{ ageAdjustedRate:'594.1' }
  },
  'Asian or Pacific Islander':{
    Female:{ ageAdjustedRate:'331.1' },
    Male:{ ageAdjustedRate:'462.0' },
    Total:{ ageAdjustedRate:'388.3' }
  },
  'Black or African American':{
    Female:{ ageAdjustedRate:'713.3'  },
    Male:{ ageAdjustedRate:'1,034.0'  },
    Total:{ ageAdjustedRate:'849.3' }
  },
  White:{
    Female:{ ageAdjustedRate:'617.6' },
    Male:{ ageAdjustedRate:'853.4' },
    Total:{ ageAdjustedRate:'725.4' }
  },
  Total:{ ageAdjustedRate:'724.6' } },
  charts: [{ Female:
     { 'American Indian or Alaska Native': [Object],
       'Asian or Pacific Islander': [Object],
       'Black or African American': [Object],
       White: [Object],
       Total: [Object] },
    Male:
     { 'American Indian or Alaska Native': [Object],
       'Asian or Pacific Islander': [Object],
       'Black or African American': [Object],
       White: [Object],
       Total: [Object] },
    Total: { ageAdjustedRate: '733.1', standardPop: 321418820 }
    }]
  }

  The attribute are nested in the same order the attributed specified in grouping
  in the input query
}
 *
 */
wonder.prototype.invokeWONDER = function (query){
    var defer = q.defer();
    var promises = [];
    var dbID = this.dbID;
    // If no aggregations then return empty result
    if(query.aggregations.nested.table.length == 0){
        defer.resolve({});
    }else {
        var reqArray = [];
        reqArray.push(createWONDERRquest(query.query, query.aggregations.nested.table, dbID));
        if(query.aggregations.nested.maps){
            reqArray.push(createWONDERRquest(query.query, query.aggregations.nested.maps[0], dbID));
        }
        if(query.aggregations.nested.charts) {
            query.aggregations.nested.charts.forEach(function (chart) {
                reqArray.push(createWONDERRquest(query.query, chart, dbID));
            });
        }
        reqArray.forEach(function(req){
            promises.push(requestWonder(dbID, req));
        });
    }
    q.all(promises).then( function (respArray) {
          var result = {};
          if(respArray.length > 0) {
              result.table = respArray[0];
              result.maps = respArray[1];
              respArray.splice(0, 2);
              result.charts = respArray;
          }
          defer.resolve(result);
    }, function (err) {
        logger.error(err.message);
        defer.reject(err);
    });
   return defer.promise;
};



/**
 * Parse WONDER response and extract the age adjusted death date data
 * @param response raw WONDER response
 * @returns age adjust death data by the specified gropings
 */
function processWONDERResponse(response, dbID){
    var x = new X2JS();
    var respJson = x.xml2js(response);
    var datatable = findChildElementByName(findChildElementByName(respJson.page, 'response'), 'data-table');
    //console.log(inspect(datatable, {depth : null, colors : true} ));
    result = {}
    if(datatable) {
        for (r in datatable.r) {
            row = datatable.r[r];
            cell = row.c;
            var keys = []
            for (i = 0; i <= cell.length - 4; i++) {
                if ('_l' in cell[i]) {
                    keys.push(cell[i]._l);
                } else if ('_c' in cell[i]) {
                    keys.push('Total');
                }
            }
            var rate;
            var valCell = cell[cell.length - 1];
            if ('_v' in valCell) {
                rate = valCell._v;
            } else {
                rate = valCell._dt;
            }

            var pop;
            valCell = cell[cell.length - 3];
            if ('_v' in valCell) {
                pop = valCell._v;
            } else {
                pop = valCell._dt;
            }
            if (pop != 'Not Applicable') {
                pop = parseInt(pop.replace(/,/g, ''));
            }

            if(dbID === 'D69' || dbID === 'D31' || dbID === 'D18') {
                var births;
                valCell = cell[cell.length - 2];
                if ('_v' in valCell) {
                    births = valCell._v;
                } else {
                    births = valCell._dt;
                }
                if (births != 'Not Applicable') {
                    births = parseInt(births.replace(/,/g, ''));
                }
                addValueToResultForInfant(keys, rate, pop, births, result);
            }
            else {
                addValueToResult(keys, rate, pop, result);
            }
        }
    }
    return result;
}

/**
 * Create a WONDER request from the HIG query
 * @param filter HIG filters from the UI
 * @param groupParams
 * @returns WONDER request
 */
function createWONDERRquest(filter, groupParams, dbID){
    var request = xmlbuilder.create('request-parameters', {version: '1.0', encoding: 'UTF-8'});
    addParamToWONDERReq(request, 'accept_datause_restrictions', 'true');
    addParamToWONDERReq(request,'apix_project',config.wonder.apix_project);
    addParamToWONDERReq(request,'apix_token', config.wonder.apix_token);
    request.com("Measures");
    addMeasures(request, dbID);
    request.com("Groups");
    addGroupParams(request, groupParams, dbID);
    request.com("Filters");
    var locationFilter = addFilterParams(request, filter, dbID);
    request.com("Options");
    addOptionParams(request, locationFilter, dbID);
    var reqStr = request.end({pretty:true});
    //logger.info("WONDER Request:",reqStr);
    return reqStr;
};

function addGroupParams(wreq, groups, dbID){
    if(groups){
        for (var i =1; i <= groups.length; i++){
            var gParam = wonderParamCodeMap[dbID][groups[i-1].key+'-group'];
            if(!gParam ){
                gParam = wonderParamCodeMap[dbID][groups[i-1].key];
            }
            if(typeof gParam === 'object') {
                gParam = gParam['key'];
            }
            addParamToWONDERReq(wreq,'B_'+i, gParam);
        }
    }
};

function addFilterParams (wreq, query, dbID){
    if(dbID === 'D77') {
        // Add mandatory advanced filter options
        addParamToWONDERReq(wreq, 'V_D77.V19', '*All*');
        addParamToWONDERReq(wreq, 'V_D77.V5', '*All*');
    }

    var mcdSet1 = [], mcdSet2 = [];

    var locationFilter = '';
    if(query){
        for (var k in query){
            var key = query[k].key;
            if (key === 'mcd-chapter-10') {
                logger.debug("Adding filter for '" + k + "' with query <<" + JSON.stringify(query[k]) + ">>");
                var pusher = function () {
                    var values = [];
                    query[k].value.forEach(function (value) {
                        values.push(value);
                    });

                    return values;
                };

                switch (query[k].set) {
                    case 'set1':
                        mcdSet1 = pusher();;
                        break;

                    case 'set2':
                        mcdSet2 = pusher();;
                        break;
                }
            }
            else {
                if (key.indexOf('|') >= 0) key = key.split('|')[0];

                if(dbID === 'D77') {
                    if (key === 'state') {
                        locationFilter = 'D77.V9';
                    }
                    else if (key === 'census-region') {
                        locationFilter = 'D77.V10'
                    }
                    else if (key === 'hhs-region') {
                        locationFilter = 'D77.V27'
                    }
                }
                else if(key === 'state') {
                    locationFilter = true;
                }

                p = wonderParamCodeMap[dbID][key];
                v = query[k].value;
                //make sure values are replaced by proper keys
                if(typeof p === 'object') {
                    if (Array.isArray(v)) {
                        for (var i = 0; i < v.length; i++) {
                            if (p.values[v[i]] !== undefined) {
                                v[i] = p.values[v[i]];
                            }
                        }
                    } else {
                        if (p[v] !== undefined) {
                            v = p[v];
                        }
                    }
                    p = p['key'];
                }
                if((dbID === 'D69' || dbID === 'D31' || dbID === 'D18') && key !== 'state') {
                    addParamToWONDERReq(wreq, 'V_' + p, v);
                }
                else {
                    addParamToWONDERReq(wreq, 'F_' + p, v);
                }
            }
        }
    }
    if(locationFilter === ''){
        // If state filter is not selected then add mandatory state filter
        if(dbID === 'D77') {
            addParamToWONDERReq(wreq, 'F_D77.V9', '*All*');
        }
        else if(dbID === 'D69' || dbID === 'D31' || dbID === 'D18') {
            addParamToWONDERReq(wreq, 'F_'+dbID+'.V10', '*All*');
        }
    }

    if (mcdSet1.length < 1) {
        mcdSet1 = [''];
    }

    if (mcdSet2.length < 1) {
        mcdSet2 = [''];
    }
    if(dbID === 'D77') {
        addParamToWONDERReq(wreq, 'V_D77.V13', mcdSet1);
        addParamToWONDERReq(wreq, 'V_D77.V13_AND', mcdSet2);
    }
    return locationFilter;

};

function addMeasures(wreq, dbID) {
    if(dbID === 'D77') {
        // Even though we dont need the first 3, it is mandatory for WONDER
        addParamToWONDERReq(wreq, 'M_1', 'D77.M1');
        addParamToWONDERReq(wreq, 'M_2', 'D77.M2');
        addParamToWONDERReq(wreq, 'M_3', 'D77.M3');

        // M4 is standard age adjusted rate
        addParamToWONDERReq(wreq, 'M_4', 'D77.M4');
    }
    else if(dbID === 'D69'|| dbID === 'D31' || dbID === 'D18') {
        addParamToWONDERReq(wreq, 'M_1',  dbID+'.M1');
        addParamToWONDERReq(wreq, 'M_2', dbID+'.M2');
        addParamToWONDERReq(wreq, 'M_3', dbID+'.M3');

        //Need to add age adjusted rates
    }
};

function addOptionParams(wreq, locationFilter, dbID){
    if(dbID === 'D77') {
        addParamToWONDERReq(wreq, 'O_V10_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_V13_fmode', 'fadv');
        addParamToWONDERReq(wreq, 'O_V1_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_V27_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_V2_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_V9_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_V7_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_V8_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_V17_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_aar', 'aar_std');
        addParamToWONDERReq(wreq, 'O_aar_pop', '0000');
        addParamToWONDERReq(wreq, 'O_age', 'D77.V5'); // Age adjusted rate by 10 year interval
        addParamToWONDERReq(wreq, 'O_javascript', 'off');
        addParamToWONDERReq(wreq, 'O_location', locationFilter || 'D77.V9');
        addParamToWONDERReq(wreq, 'O_precision', '1');
        addParamToWONDERReq(wreq, 'O_rate_per', '100000');
        addParamToWONDERReq(wreq, 'O_show_totals', 'true');
        addParamToWONDERReq(wreq, 'O_ucd', 'D77.V2');
        addParamToWONDERReq(wreq, 'O_mcd', 'D77.V13');
        addParamToWONDERReq(wreq, 'O_urban', 'D77.V19');
        addParamToWONDERReq(wreq, 'O_all_labels', 'true');
    }
    else if(dbID === 'D69' || dbID === 'D31' || dbID === 'D18' ) {
        addParamToWONDERReq(wreq, 'O_V10_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_V16_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_V19_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_V26_fmode', 'freg');
        addParamToWONDERReq(wreq, 'O_gestation', dbID+'.V24');
        addParamToWONDERReq(wreq, 'O_icd', dbID+'.V16');
        addParamToWONDERReq(wreq, 'O_javascript', 'on');
        addParamToWONDERReq(wreq, 'O_location', dbID+'.V10');
        addParamToWONDERReq(wreq, 'O_precision', '2');
        addParamToWONDERReq(wreq, 'O_rate_per', '1000');
        addParamToWONDERReq(wreq, 'O_show_suppressed', 'true');
        addParamToWONDERReq(wreq, 'O_show_totals', 'true');
        addParamToWONDERReq(wreq, 'O_show_zeros', 'true');
        addParamToWONDERReq(wreq, 'O_timeout', '600');
        addParamToWONDERReq(wreq, 'O_title', 'Default_By_'+dbID+'.V10-level1');
        /*addParamToWONDERReq(wreq, 'V_D69.V1', '*All*');
        addParamToWONDERReq(wreq, 'V_D69.V10', '');*/
        addParamToWONDERReq(wreq, 'action-Send', 'Send');
        addParamToWONDERReq(wreq, 'finder-stage-'+dbID+'.V10', 'codeset');
        addParamToWONDERReq(wreq, 'finder-stage-'+dbID+'.V16', 'codeset');
        addParamToWONDERReq(wreq, 'finder-stage-'+dbID+'.V19', 'codeset');
        addParamToWONDERReq(wreq, 'finder-stage-'+dbID+'.V26', 'codeset');
        addParamToWONDERReq(wreq, 'O_all_labels', 'true');
        addParamToWONDERReq(wreq, 'stage', 'request');
    }
}

function addParamToWONDERReq(request, paramname, paramvalue) {
    var param = request.ele('parameter');
    param.ele('name', paramname);
    if(Array.isArray(paramvalue)) {
        for (var i = 0; i<paramvalue.length; i++){
            if(paramvalue[i] || paramvalue[i] === '') {
                param.ele('value', paramvalue[i]);
            }
        }
    } else {
        if(paramvalue) {
            param.ele('value', paramvalue);
        }
    }
};


function addValueToResult(keys, rate, pop, result){
    if(!(keys[0] in result)){
        result[keys[0]] = {};
    }
    if (keys.length == 1){
        result[keys[0]]['ageAdjustedRate'] = rate;
        result[keys[0]]['standardPop'] = pop;
    } else{
        addValueToResult(keys.slice(1), rate,pop,result[keys[0]]);
    }
}

function addValueToResultForInfant(keys, rate, pop, births, result){
    if(!(keys[0] in result)){
        result[keys[0]] = {};
    }
    if (keys.length == 1){
        result[keys[0]]['deathRate'] = rate;
        result[keys[0]]['infant_mortality'] = pop;
        result[keys[0]]['births'] = births;
    } else{
        addValueToResultForInfant(keys.slice(1), rate,pop,births,result[keys[0]]);
    }
}

function findChildElementByName(node, name){
    for (child in node){
        if(child === name){
            return  node[child];
        }
    }
}


module.exports = wonder;