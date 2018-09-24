var Q = require('q');
var logger = require('../config/logging');
var config = require('../config/config');
var request = require('request');
var searchUtils = require('../api/utils');
var cahcedQuestions = null;
var cachedPramsBasicQuestions = null;
var cachedPramsAdvanceQuestions = null;
var cachedBRFSQuestions = {};
function yrbs() {
}

//Mapping response key values from the data set to display values
const responseKeyMap = {
    true:'YES',
    false:'NO'
}
/**
 * Invoke YRBS service for each selected question, merge the results and return a single result in the form
 * {"table":{"question":[{"name":"question 1","mental_health":"0.8136<br><br/><nobr>(0.7696-0.8508)</nobr><br/>8757",
                         "q2":[{"name:"Male", "mental_health":"0.8136<br><br/><nobr>(0.7696-0.8508)</nobr><br/>8757", "grade":[{name, mental_health: },...]},
 *                             {"name:"Female", "mental_health":"0.8136<br><br/><nobr>(0.7696-0.8508)</nobr><br/>8757", "grade":[{name, mental_health: },...]}
 * }
 * YRBS service currently takes only one question per invocation, so multiple parallel invocations are made for each question selected by the user
 * and the results are merges to form a single response
 * @param apiQuery
 * @returns {*}
 */
yrbs.prototype.invokeYRBSService = function(apiQuery){
    var self = this;
    var yrbsquery = this.buildYRBSQueries(apiQuery);
    var deferred = Q.defer();
    var queryPromises = [];
    var startTime = new Date().getTime();
    logger.info("Invoking YRBS service for "+yrbsquery.length+" questions");
    logger.info("Invoking stats service with query ", JSON.stringify(yrbsquery));
    for (var q in yrbsquery){
        queryPromises.push(invokeYRBS(yrbsquery[q]));
    }

    Q.all(queryPromises).then(function(resp){
        var duration = new Date().getTime() - startTime;
        logger.info("YRBS service response received for all "+yrbsquery.length+" questions, duration(s)="+ duration/1000);
        var data = self.processYRBSReponses(resp, apiQuery.basicSearch, apiQuery.searchFor);
        //if 'Sexual Identity' or 'Sex of Sexual Contacts' option(s) selected
        var isSexualOrientationSelected = 'sexid' in apiQuery.query || 'sexpart' in apiQuery.query;
        //if only groupBy 'row' or 'column' selected for 'Sexual Identity' or 'Sex of Sexual Contacts' filters
        apiQuery.aggregations.nested.table.forEach(function(filter){
            if(filter.key == 'sexid' || filter.key == 'sexpart'){
                isSexualOrientationSelected = true;
            }
        });
        if(apiQuery.searchFor == 'mental_health') {
            searchUtils.applyYRBSSuppressions({data: data.table.question}, 'count', 'mean', isSexualOrientationSelected, apiQuery.isChartorMapQuery);
        } else if(apiQuery.searchFor == 'brfss') {
            searchUtils.applyBRFSSuppression({data: data.table.question}, 'count', 'mean', apiQuery.isChartorMapQuery, apiQuery.basicSearch);
        } else if(apiQuery.searchFor == 'prams') {
            searchUtils.applyPRAMSuppressions({data: data.table.question}, 'count', 'mean', apiQuery.isChartorMapQuery, apiQuery.basicSearch);
        }
        deferred.resolve(data);
    }, function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
};

/**
 * Build query for YRBS service.
 * YRBS service takes only one question at a time, so this method builds one query per each question selected
 * and return an array of query string for YRBS service call
 */
yrbs.prototype.buildYRBSQueries = function (apiQuery){
    var queries = [];
    var useStateDataset = false;
    var aggrsKeys  = [];
    for (var i = 0; i<apiQuery.aggregations.nested.table.length; i++ ){
        var agg = apiQuery.aggregations.nested.table[i];
        if (agg.queryKey != 'question.key'){
            aggrsKeys.push(agg.queryKey);
        }
    }


    // Grouping needs to be always in the following order Sex (sex), Grade (grade),
    // Race (race) and  Year (year), state (sitecode)
    var sortedKeys = [];
    if(aggrsKeys.indexOf('sex') >= 0){
        sortedKeys.push('sex');
    }
    if(aggrsKeys.indexOf('grade') >= 0){
        sortedKeys.push('grade');
    }
    if(aggrsKeys.indexOf('sexid') >= 0){
        sortedKeys.push('sexid');
    }
    if(aggrsKeys.indexOf('sexpart') >= 0){
        sortedKeys.push('sexpart');
    }
    if(aggrsKeys.indexOf('race') >= 0){
        sortedKeys.push('race');
    }
    if(aggrsKeys.indexOf('age') >= 0){
        sortedKeys.push('age');
    }
    if(aggrsKeys.indexOf('education') >= 0){
        sortedKeys.push('education');
    }if(aggrsKeys.indexOf('income') >= 0){
        sortedKeys.push('income');
    }
    if(aggrsKeys.indexOf('birth_weight') >= 0){
        sortedKeys.push('birth_weight');
    }
    if(aggrsKeys.indexOf('marital_status') >= 0){
        sortedKeys.push('marital_status');
    }
    if(aggrsKeys.indexOf('maternal_age_18to44') >= 0){
        sortedKeys.push('maternal_age_18to44');
    }
    if(aggrsKeys.indexOf('maternal_age_18to44grp') >= 0){
        sortedKeys.push('maternal_age_18to44grp');
    }
    if(aggrsKeys.indexOf('maternal_age_3lvl') >= 0){
        sortedKeys.push('maternal_age_3lvl');
    }
    if(aggrsKeys.indexOf('maternal_age_4lvl') >= 0){
        sortedKeys.push('maternal_age_4lvl');
    }
    if(aggrsKeys.indexOf('maternal_education') >= 0){
        sortedKeys.push('maternal_education');
    }
    if(aggrsKeys.indexOf('maternal_race') >= 0){
        sortedKeys.push('maternal_race');
    }
    if(aggrsKeys.indexOf('medicaid_recip') >= 0){
        sortedKeys.push('medicaid_recip');
    }
    if(aggrsKeys.indexOf('mother_hispanic') >= 0){
        sortedKeys.push('mother_hispanic');
    }
    if(aggrsKeys.indexOf('preg_intend') >= 0){
        sortedKeys.push('preg_intend');
    }
    if(aggrsKeys.indexOf('prenatal_care') >= 0){
        sortedKeys.push('prenatal_care');
    }
    if(aggrsKeys.indexOf('prev_live_births') >= 0){
        sortedKeys.push('prev_live_births');
    }
    if(aggrsKeys.indexOf('smoked_3mo_pre_preg') >= 0){
        sortedKeys.push('smoked_3mo_pre_preg');
    }
    if(aggrsKeys.indexOf('smoked_last_tri') >= 0){
        sortedKeys.push('smoked_last_tri');
    }
    if(aggrsKeys.indexOf('wic_during_preg') >= 0){
        sortedKeys.push('wic_during_preg');
    }
    if(aggrsKeys.indexOf('year') >= 0){
        sortedKeys.push('year');
    }
    if(aggrsKeys.indexOf('sitecode') >= 0){
        sortedKeys.push('sitecode');
    }
    var v = null;
    if (sortedKeys.length > 0) {
       v = 'v=' + sortedKeys.join(',');
    }

    if('query' in apiQuery){
        // Build filter params
        var f = '';
        for (q in apiQuery.query){
            if(q != 'question.path' && q != 'topic' && q != 'breakout' && 'value' in  apiQuery.query[q] && apiQuery.query[q].value) {
                f += (q + ':');
                if(apiQuery.query[q].value instanceof  Array) {
                    f += apiQuery.query[q].value.join(',') + '|';
                }else {
                    f += apiQuery.query[q].value + '|';
                }
            }
        }
        f = f.slice(0,f.length - 1);

        if('question.path' in apiQuery.query) {
            var selectedQs = apiQuery.query['question.path'].value;
            for (var i = 0; i < selectedQs.length; i++) {
                var qry = config.yrbs.queryUrl+'?'; //Base url
                if(apiQuery.searchFor === 'mental_health') {
                    qry += 'd=yrbss&'; // yrbs dataset
                } else if(apiQuery.searchFor === 'prams') {
                    apiQuery.basicSearch ? qry += 'd=prams&' : qry += 'd=prams_p2011&'; // prams dataset
                } else if(apiQuery.searchFor === 'brfss') {
                    apiQuery.basicSearch ? qry += 'd=brfss_pre2011&' : qry += 'd=brfss&'; // brfss dataset
                }
                if(apiQuery.basicSearch) {
                    qry +='s=1&';
                } else {
                    qry +='s=0&';
                }
                qry += 'q=' + selectedQs[i]; // Question param
                qry += (v ? ('&' + v) : ''); // Group param
                qry += (f ? ('&f=' + f) : ''); // Filter param
                queries.push(qry);
            }
        }
    }

    return queries;
}


/**
 * Process YRBS service response for all questions and create response for the front end in the form given below
 * @param response
 * @returns {{table: {question: Array}, maxQuestion: string}}
 */
yrbs.prototype.processYRBSReponses = function(response, precomputed, key){
    var questions = []
    for (r in response){
        if (response[r] && 'results' in response[r]) {
            questions.push(this.processQuestionResponse(response[r], precomputed, key));
        } else{
            logger.warn("Error response from YRBS: "+JSON.stringify(response[r]));
        }
    }
    var finalResp = {'table': {'question':questions}};
    logger.debug("YRBS Response: "+ JSON.stringify(finalResp));
    return finalResp;
};

/**
 * Parse a response from YRBS for a single question and generate response for the frontend
 * @param response
 * @returns {{name: (Array|string|string|string|string|COLORS_ON.question|*), mental_health}}
 */
yrbs.prototype.processQuestionResponse = function(response, precomputed, key){
    var q = {"name" :response.q};
    var precompgroups = [];
    if(precomputed) {
        for (var v in response.vars) {
            if (!(response.vars[v] in response.filter)) {
                precompgroups.push(response.vars[v]);
            }
        }
    }
    for (var i in  response.results){
        var r = response.results[i];
        var responseKey = responseKeyMap[r.response]?responseKeyMap[r.response]:r.response;

        // skip NA responses for PRAMS
        if (responseKey == 'nan') {
            continue;
        }

        if(!q[responseKey]) {
            q[responseKey] = {};
        }

        if(isTotalCell(r, precompgroups, precomputed)){
            q[responseKey][key]= resultCellObject(r, key);
        }else if(!isSubTotalCell(r, precompgroups, precomputed)){
            var cell = q[responseKey];
            if (key === 'mental_health') {
                cell = getCellDataForYRBSS(cell, r, response);
            } else if (key === 'prams') {
                cell = getCellDataForPramsFilters(cell, r, response);
            } else if (key === 'brfss') {
                cell = getCellDataForBRFSS(cell, r, response);
            }

            cell[key] = resultCellObject(r, key);

            // If the result has only one column then there is no separate total column value available in pre-computed results
            // so assign the cell result to total as well
            if(precomputed && q[responseKey][key] == undefined ){
                q[responseKey][key] = cell[key];
            }
        }
    }
    return q;
};

function getCellDataForYRBSS(cell, r, response) {
    //Need to maintain the following order
    //filters with least options first i.e. ascending order based on number of filter options
    if ('sex' in r && response.vars.indexOf('sex') != -1) {
        cell = getResultCell(cell, 'sex', r.sex);
    }
    if ('grade' in r && response.vars.indexOf('grade') != -1) {
        cell = getResultCell(cell, 'grade', r.grade);
    }
    if ('sexpart' in r && response.vars.indexOf('sexpart') != -1) {
        cell = getResultCell(cell, 'sexpart', r.sexpart);
    }
    if ('sexid' in r && response.vars.indexOf('sexid') != -1) {
        cell = getResultCell(cell, 'sexid', r.sexid);
    }

    if ('race' in r && response.vars.indexOf('race') != -1) {
        cell = getResultCell(cell, 'race', r.race);
    }
    if ('year' in r && response.vars.indexOf('year') != -1) {
        cell = getResultCell(cell, 'year', r.year);
    }
    if ('sitecode' in r && response.vars.indexOf('sitecode') != -1) {
        cell = getResultCell(cell, 'sitecode', r.sitecode);
    }
    return cell;
}

function getCellDataForPramsFilters(cell, r, response) {
    //Need to maintain the following order
    //filters with least options first i.e. ascending order based on number of filter options
    if ('maternal_age_18to44' in r && response.vars.indexOf('maternal_age_18to44') != -1) {
        cell = getResultCell(cell, 'maternal_age_18to44', r['maternal_age_18to44']);
    }
    if ('wic_during_preg' in r && response.vars.indexOf('wic_during_preg') != -1) {
        cell = getResultCell(cell, 'wic_during_preg', r['wic_during_preg']);
    }
    if ('smoked_last_tri' in r && response.vars.indexOf('smoked_last_tri') != -1) {
        cell = getResultCell(cell, 'smoked_last_tri', r['smoked_last_tri']);
    }
    if ('smoked_3mo_pre_preg' in r && response.vars.indexOf('smoked_3mo_pre_preg') != -1) {
        cell = getResultCell(cell, 'smoked_3mo_pre_preg', r['smoked_3mo_pre_preg']);
    }
    if ('prev_live_births' in r && response.vars.indexOf('prev_live_births') != -1) {
        cell = getResultCell(cell, 'prev_live_births', r['prev_live_births']);
    }
    if ('preg_intend' in r && response.vars.indexOf('preg_intend') != -1) {
        cell = getResultCell(cell, 'preg_intend', r['preg_intend']);
    }
    if ('mother_hispanic' in r && response.vars.indexOf('mother_hispanic') != -1) {
        cell = getResultCell(cell, 'mother_hispanic', r['mother_hispanic']);
    }
    if ('medicaid_recip' in r && response.vars.indexOf('medicaid_recip') != -1) {
        cell = getResultCell(cell, 'medicaid_recip', r['medicaid_recip']);
    }
    if ('marital_status' in r && response.vars.indexOf('marital_status') != -1) {
        cell = getResultCell(cell, 'marital_status', r.marital_status);
    }
    if ('birth_weight' in r && response.vars.indexOf('birth_weight') != -1) {
        cell = getResultCell(cell, 'birth_weight', r.birth_weight);
    }
    if ('year' in r && response.vars.indexOf('year') != -1) {
        cell = getResultCell(cell, 'year', r.year);
    }
    if ('maternal_education' in r && response.vars.indexOf('maternal_education') != -1) {
        cell = getResultCell(cell, 'maternal_education', r['maternal_education']);
    }
    if ('maternal_age_3lvl' in r && response.vars.indexOf('maternal_age_3lvl') != -1) {
        cell = getResultCell(cell, 'maternal_age_3lvl', r['maternal_age_3lvl']);
    }
    if ('maternal_race' in r && response.vars.indexOf('maternal_race') != -1) {
        cell = getResultCell(cell, 'maternal_race', r['maternal_race']);
    }
    if ('maternal_age_4lvl' in r && response.vars.indexOf('maternal_age_4lvl') != -1) {
        cell = getResultCell(cell, 'maternal_age_4lvl', r['maternal_age_4lvl']);
    }
    if ('prenatal_care' in r && response.vars.indexOf('prenatal_care') != -1) {
        cell = getResultCell(cell, 'prenatal_care', r['prenatal_care']);
    }
    if ('maternal_age_18to44grp' in r && response.vars.indexOf('maternal_age_18to44grp') != -1) {
        cell = getResultCell(cell, 'maternal_age_18to44grp', r['maternal_age_18to44grp']);
    }
    if ('income' in r && response.vars.indexOf('income') != -1) {
        cell = getResultCell(cell, 'income', r.income);
    }
    if ('sitecode' in r && response.vars.indexOf('sitecode') != -1) {
        cell = getResultCell(cell, 'sitecode', r.sitecode);
    }
    return cell;
}

function getCellDataForBRFSS(cell, r, response) {
    //Need to maintain the following order
    //filters with least options first i.e. ascending order based on number of filter options
    if ('sex' in r && response.vars.indexOf('sex') != -1) {
        cell = getResultCell(cell, 'sex', r.sex);
    }
    if ('education' in r && response.vars.indexOf('education') != -1) {
        cell = getResultCell(cell, 'education', r.education);
    }
    if ('year' in r && response.vars.indexOf('year') != -1) {
        cell = getResultCell(cell, 'year', r.year);
    }
    if ('income' in r && response.vars.indexOf('income') != -1) {
        cell = getResultCell(cell, 'income', r.income);
    }
    if ('race' in r && response.vars.indexOf('race') != -1) {
        cell = getResultCell(cell, 'race', r.race);
    }
    if ('age' in r && response.vars.indexOf('age') != -1) {
        cell = getResultCell(cell, 'age', r.age);
    }
    if ('sitecode' in r && response.vars.indexOf('sitecode') != -1) {
        cell = getResultCell(cell, 'sitecode', r.sitecode);
    }
    return cell;
}


function isTotalCell(cell, groupings, precomputed){
    if(precomputed) {
        // Total cell if all grouping attributes have value "Total"
        if(groupings.length == 0){
            return false;
        }
        for (var g in groupings) {
            if (cell[groupings[g]] != "Total") {
                return false;
            }
        }
        return true;
    }else {
        return cell.level == 0;
    }
}

function isSubTotalCell(cell, groupings, precomputed){
    if(precomputed) {
        // Subtotal cell if atleast one grouping attributes have value "Total"
        for (var g in groupings) {
            if (cell[groupings[g]] == "Total") {
                return true;
            }
        }
        return false;
    }else {
        // If level != 0 and cell level is < number of grouping attrs
        return cell.level != 0 && cell.level < groupings.length;
    }
}

function getResultCell (currentcell, cellkey, cellvalue){
    var cell;
    if(!(cellkey  in currentcell)) {
        cell = currentcell[cellkey] = [];
    }
    cell = currentcell[cellkey];
    for (i in cell){
        if (cell[i].name == cellvalue){
            return cell[i];
        }
    }
    var newcell = {'name':cellvalue.toString()};
    cell.push(newcell);
    return newcell;
}

function resultCellObject (response, key) {
    var prec = 1;
    var result = {
        mean: toRoundedPercentage(response.mean, prec, key),
        ci_l: toRoundedPercentage(response.ci_l, prec, key),
        ci_u: toRoundedPercentage(response.ci_u, prec, key)
    };
    if(key == 'mental_health') {
        result.count = response.sample_size;
    } else {
        result.count = response.count;
        result.sampleSize = response.sample_size;
        result.se = response.se;
    }
    return result;
}

function toRoundedPercentage(num, prec, dataset){
    if (!isNaN(num)){
        if(num > 0) {
            if(dataset === 'prams') {
                return searchUtils.round(num * 100, prec);
            } else {
                return (num * 100).toFixed(prec);
            }
        } else {
            return '0';
        }
    }else {
        return num;
    }

}
/**
 * Invoke the YRBS service with a single query and get response.
 * Return null if there is an error invoking YRBS or parsing the YRBS response
 * @param query in for q=q8&v=q2,q3,raceeth
 * @returns raw response from YRBS service
 */
function invokeYRBS (query){
    var deferred = Q.defer();
    request(query ,function (error, response, body)  {
        if (!error) {
            try{
                var result = JSON.parse(body);
                logger.debug ("Received response from YRBS API for query "+query);
                deferred.resolve(result);
            }catch(e){
                logger.error("Error response from YRBS API for query "+query+": "+body);
                deferred.resolve(null);
            }
        }else {
            logger.error("Error invoking YRBS service for query "+query+": "+error);
            deferred.resolve(null);
        }
    });
    return deferred.promise;
};

/**
 * Get YRBS questions from question service dynamically. *
 * @returns {*|promise}
 */
yrbs.prototype.getYRBSQuestionsTree = function () {
    var deferred = Q.defer();
    if(cahcedQuestions){
        logger.info("Returning cached questions");
        deferred.resolve(cahcedQuestions);
    } else {
        invokeYRBS(config.yrbs.questionsUrl + '?d=yrbss').then(function (response) {
            logger.info("Getting questions from yrbs service");
            var data = prepareQuestionTree(response.questions, false);
            if (data.questionsList.length > 0) {
                cahcedQuestions = {questionTree: data.questionTree, questionsList: data.questionsList};
            }
            deferred.resolve(cahcedQuestions);
        });
    }
    return deferred.promise;
};

/**
 * Get questions for PRAMS
 * @returns {*\promise}
 */
    yrbs.prototype.getPramsBasicQuestionsTree = function () {
    var deferred = Q.defer();
    if(cachedPramsBasicQuestions) {
        logger.info("Returning cached PRAMS questions");
        deferred.resolve(cachedPramsBasicQuestions);
    } else {
        invokeYRBS(config.yrbs.questionsUrl + '?d=prams').then(function(response) {
            logger.info("Getting PRAMS questions from YRBS service");
            var data = prepareQuestionTree(response.questions, true);
            // Cache the result only if it is valid
            if (data.questionsList.length > 0) {
                cachedPramsBasicQuestions = {questionTree: data.questionTree, questionsList: data.questionsList};
            }
            deferred.resolve(cachedPramsBasicQuestions);
        });
    }
    return deferred.promise;
};

/**
* Get questions for PRAMS
* @returns {*\promise}
*/
yrbs.prototype.getPramsAdvanceQuestionsTree = function () {
    var deferred = Q.defer();
    if(cachedPramsAdvanceQuestions) {
        logger.info("Returning cached PRAMS questions");
        deferred.resolve(cachedPramsAdvanceQuestions);
    } else {
        invokeYRBS(config.yrbs.questionsUrl + '?d=prams_p2011').then(function(response) {
            logger.info("Getting PRAMS questions from YRBS service");
            var data = prepareQuestionTree(response.questions, true);
            // Cache the result only if it is valid
            if (data.questionsList.length > 0) {
                cachedPramsAdvanceQuestions = {questionTree: data.questionTree, questionsList: data.questionsList};
            }
            deferred.resolve(cachedPramsAdvanceQuestions);
        });
    }
    return deferred.promise;
};

/**
 * Get questions for BRFS
 * @returns {*\promise}
 */
yrbs.prototype.getBRFSQuestionsTree = function (precomputed) {
    var deferred = Q.defer();
    var dset = precomputed? 'brfss_pre2011' : 'brfss';
    if(cachedBRFSQuestions[dset]) {
        logger.info("Returning cached BRFS questions");
        deferred.resolve(cachedBRFSQuestions[dset]);
    } else {
        invokeYRBS(config.yrbs.questionsUrl + '?d='+dset).then(function(response) {
            logger.info("Getting BRFS questions from stats service");
            var data = prepareQuestionTree(response.questions, true);
            // Cache the result only if it is valid
            if (data.questionsList.length > 0) {
                cachedBRFSQuestions[dset] = {questionTree: data.questionTree, questionsList: data.questionsList};
            }
            deferred.resolve(cachedBRFSQuestions[dset]);
        });
    }
    return deferred.promise;
};

/**
 * Prepare YRBS question tree based on question categories
 * @param questionList
 * @param years
 */
function prepareQuestionTree(questions,  prams) {
    logger.info("Preparing questions tree");
    var qCategoryMap = {};
    var questionTree = [];
    var questionsList = [];
    var catCount = 0;
    var questionKeys = [];
    //sort prams questions based on qKey
    if(prams) {
        questions = questions.sort(function(q1, q2) {
            var x = q1.qid, y = q2.qid;
            return x < y ? -1 : x > y ? 1 : 0;
        })
    }
    //iterate through questions
    for (var i = 0; i < questions.length; i++) {
        var quesObj = questions[i];
        var qCategory = prams? quesObj.subtopic : quesObj.topic;
        if (qCategory && qCategoryMap[qCategory] == undefined) {
            qCategoryMap[qCategory] = {id: 'cat_' + catCount, text: qCategory, children: []};
            catCount = catCount + 1;
        }

        if (quesObj.description !== undefined) {
            var question = {text:quesObj.question +"("+quesObj.description+")", id:quesObj.qid, years: quesObj.year};
            qCategoryMap[qCategory].children.push(question);
            //capture all questions into questionsList

            if (quesObj.description) {
                questionsList.push({key : quesObj.question, qkey : quesObj.qid,
                    title : quesObj.question +"("+quesObj.description+")", years: quesObj.year});
            }

            else {
                questionsList.push({key : quesObj.question, qkey : quesObj.qid,
                    title : quesObj.question, years: quesObj.year});
            }

        } else if(prams) {
            //skip duplicate question keys
            if(questionKeys.indexOf(quesObj.qid) >= 0) {
                continue;
            }
            var question = {text:quesObj.question, id: quesObj.qid, years: quesObj.year};
            qCategoryMap[qCategory].children.push(question);
            questionsList.push({key: quesObj.question, qkey: quesObj.qid,
                title: quesObj.question, years: quesObj.year});
            questionKeys.push(quesObj.qid);
        }
    }

    for (var category in qCategoryMap) {
       // Sort questions alphabetically
       qCategoryMap[category].children = sortByKey(qCategoryMap[category].children, 'text', true);
       questionTree.push(qCategoryMap[category]);
    }
    // Sort the categories in the tree
    questionTree = sortByKey(questionTree,"text",true);
    questionsList = sortByKey(questionsList,"qkey",true);
    return {questionTree:questionTree, questionsList: questionsList};
}

/**
 * To sort questions
 * @param array
 * @param key
 * @param asc
 * @returns {*}
 */
function sortByKey(array, key, asc) {
    logger.info("Sorting questions in alphabetical order...");
    return array.sort(function(a, b) {
        var x = typeof(key) === 'function' ? key(a) : a[key];
        var y = typeof(key) === 'function' ? key(b) : b[key];
        if(asc===undefined || asc === true) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }else {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

module.exports = yrbs;