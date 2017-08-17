var logger = require('../config/logging');
var request = require('request');
var xmlbuilder = require('xmlbuilder');
var X2JS = require('x2js');
var inspect = require('util').inspect;
var q = require('q');
var config = require('../config/config');

var wonderParamCodeMap = {
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
}

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
            result = processWONDERResponse(body);
            logger.debug("Age adjusted rates: " + JSON.stringify(result));
            defer.resolve(result);
        } else {
            logger.error("WONDER Error: " + (error ? error : body));
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
        reqArray.push(createWONDERRquest(query.query, query.aggregations.nested.table));
        if(query.aggregations.nested.charts) {
            query.aggregations.nested.charts.forEach(function (chart) {
                reqArray.push(createWONDERRquest(query.query, chart));
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
              respArray.splice(0, 1);
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
function processWONDERResponse(response){
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
            addValueToResult(keys, rate,pop, result);
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
function createWONDERRquest(filter, groupParams){
    var request = xmlbuilder.create('request-parameters', {version: '1.0', encoding: 'UTF-8'});
    addParamToWONDERReq(request, 'accept_datause_restrictions', 'true');
    addParamToWONDERReq(request,'apix_project',config.wonder.apix_project);
    addParamToWONDERReq(request,'apix_token', config.wonder.apix_token);
    request.com("Measures");
    addMeasures(request);
    request.com("Groups");
    addGroupParams(request, groupParams);
    request.com("Filters");
    addFilterParams(request, filter);
    request.com("Options");
    addOptionParams(request);
    var reqStr = request.end({pretty:true});
    //logger.info("WONDER Request:",reqStr);
    return reqStr;
};

function addGroupParams(wreq, groups){
    if(groups){
        for (var i =1; i <= groups.length; i++){
            var gParam = wonderParamCodeMap[groups[i-1].key+'-group'];
            if(!gParam ){
                gParam = wonderParamCodeMap[groups[i-1].key];
            }
            if(typeof gParam === 'object') {
                gParam = gParam['key'];
            }
            addParamToWONDERReq(wreq,'B_'+i, gParam);
        }
    }
};

function addFilterParams (wreq, query){
    // Add mandatory advanced filter options
    addParamToWONDERReq(wreq,'V_D77.V19', '*All*');
    addParamToWONDERReq(wreq,'V_D77.V5', '*All*');

    var mcdSet1 = [], mcdSet2 = [];

    var statefound = false;
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
                if (key == 'state') {
                    statefound = true;
                }
                p = wonderParamCodeMap[key];
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

                addParamToWONDERReq(wreq,'F_'+p, v);
            }
        }
    }
    if(!statefound){
        // If state filter is not selected then add mandatory state filter
        addParamToWONDERReq(wreq,'F_D77.V9', '*All*');
    }

    if (mcdSet1.length < 1) {
        mcdSet1 = [''];
    }

    if (mcdSet2.length < 1) {
        mcdSet2 = [''];
    }

    addParamToWONDERReq(wreq, 'V_D77.V13', mcdSet1);
    addParamToWONDERReq(wreq, 'V_D77.V13_AND', mcdSet2);
};

function addMeasures(wreq) {
    // Even though we dont need the first 3, it is mandatory for WONDER
    addParamToWONDERReq(wreq,'M_1', 'D77.M1');
    addParamToWONDERReq(wreq,'M_2', 'D77.M2');
    addParamToWONDERReq(wreq,'M_3', 'D77.M3');

    // M4 is standard age adjusted rate
    addParamToWONDERReq(wreq,'M_4', 'D77.M4');
};

function addOptionParams(wreq){
    addParamToWONDERReq(wreq,'O_V10_fmode', 'freg');
    addParamToWONDERReq(wreq, 'O_V13_fmode', 'fadv');
    addParamToWONDERReq(wreq,'O_V1_fmode', 'freg');
    addParamToWONDERReq(wreq,'O_V27_fmode', 'freg');
    addParamToWONDERReq(wreq,'O_V2_fmode', 'freg');
    addParamToWONDERReq(wreq,'O_V9_fmode', 'freg');
    addParamToWONDERReq(wreq,'O_V7_fmode', 'freg');
    addParamToWONDERReq(wreq,'O_V8_fmode', 'freg');
    addParamToWONDERReq(wreq,'O_V17_fmode', 'freg');
    addParamToWONDERReq(wreq,'O_aar', 'aar_std');
    addParamToWONDERReq(wreq,'O_aar_pop', '0000');
    addParamToWONDERReq(wreq,'O_age', 'D77.V5'); // Age adjusted rate by 10 year interval
    addParamToWONDERReq(wreq,'O_javascript', 'off');
    addParamToWONDERReq(wreq,'O_location', 'D77.V9');
    addParamToWONDERReq(wreq,'O_precision', '1');
    addParamToWONDERReq(wreq,'O_rate_per', '100000');
    addParamToWONDERReq(wreq,'O_show_totals', 'true');
    addParamToWONDERReq(wreq,'O_ucd', 'D77.V2');
    addParamToWONDERReq(wreq, 'O_mcd', 'D77.V13');
    addParamToWONDERReq(wreq,'O_urban', 'D77.V19');
    addParamToWONDERReq(wreq,'O_all_labels', 'true');
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

function findChildElementByName(node, name){
    for (child in node){
        if(child === name){
            return  node[child];
        }
    }
}

function getGroupAttributes(query){
    var groups = []
    if(query.aggregations.nested.table){
        for (var i =1; i <= query.aggregations.nested.table.length; i++){
            groups.push(wonderParamCodeMap[query.aggregations.nested.table[i-1].key]);
        }
    }
}

module.exports = wonder;