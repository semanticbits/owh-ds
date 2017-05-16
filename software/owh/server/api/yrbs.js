var Q = require('q');
var logger = require('../config/logging');
var config = require('../config/config');
var request = require('request');

var cahcedQuestions = null;
var cachedPramsQuestions = null;
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
    for (var q in yrbsquery){
        queryPromises.push(invokeYRBS(yrbsquery[q]));
    }

    Q.all(queryPromises).then(function(resp){
        var duration = new Date().getTime() - startTime;
        logger.info("YRBS service response received for all "+yrbsquery.length+" questions, duration(s)="+ duration/1000);
        deferred.resolve(self.processYRBSReponses(resp, apiQuery.yrbsBasic, apiQuery.searchFor));
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


    // Grouping needs to be always in the following order Sex (sex), Grade (grade), Race (race) and  Year (year), state (sitecode)
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
            if(q != 'question.path' && q != 'breakout' && 'value' in  apiQuery.query[q] && apiQuery.query[q].value) {
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
                    qry += 'd=yrbss&' // yrbs dataset
                } else if(apiQuery.searchFor === 'prams') {
                    qry += 'd=prams&' // yrbs dataset
                }
                if(apiQuery.yrbsBasic || apiQuery.searchFor === 'prams'){
                    qry +='s=1&';
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
        if(!q[responseKey]) {
            q[responseKey] = {};
        }

        if(isTotalCell(r, precompgroups, precomputed)){
            q[responseKey][key]= resultCellObject(r);
        }else if(!isSubTotalCell(r, precompgroups, precomputed)){
            var cell = q[responseKey];
            // The result table is always nested in the order Sex (sex), Grade (grade), Race (race7) and  Year (year)
            // so nest the results in that order
            if ('sex' in r) {
                cell = getResultCell(cell, 'sex', r.sex);
            }
            if ('grade' in r) {
                cell = getResultCell(cell, 'grade', r.grade);
            }
            if ('sexid' in r) {
                cell = getResultCell(cell, 'sexid', r.sexid);
            }

            if ('sexpart' in r) {
                cell = getResultCell(cell, 'sexpart', r.sexpart);
            }
            if ('race' in r) {
                cell = getResultCell(cell, 'race', r.race);
            }

            // Prams filters
            if ('year' in r) {
                cell = getResultCell(cell, 'year', r.year);
            }
            if ('sitecode' in r) {
                cell = getResultCell(cell, 'sitecode', r.sitecode);
            }

            cell[key] = resultCellObject(r);

            // If the result has only one column then there is no separate total column value available in pre-computed results
            // so assign the cell result to total as well
            if(precomputed && q[responseKey][key] == undefined ){
                q[responseKey][key] = cell[key];
            }
        }
    }
    return q;
};


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

function resultCellObject (response) {
    var prec = 1;
    return {
        mean: toRoundedPercentage(response.mean, prec),
        ci_l: toRoundedPercentage(response.ci_l, prec),
        ci_u: toRoundedPercentage(response.ci_u, prec),
        count: response.count
    };
}

function toRoundedPercentage(num, prec){
    if (!isNaN(num)){
        if(num > 0) {
            return (num * 100).toFixed(prec);
        }else {
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
            var data = prepareQuestionTree(response, false);
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
yrbs.prototype.getPramsQuestionsTree = function () {
    var deferred = Q.defer();
    if(cachedPramsQuestions) {
        logger.info("Returning cached PRAMS questions");
        deferred.resolve(cachedPramsQuestions);
    } else {
        invokeYRBS(config.yrbs.questionsUrl + '?d=prams').then(function(response) {
            logger.info("Getting PRAMS questions from YRBS service");
            var data = prepareQuestionTree(response.questions, true);
            // Cache the result only if it is valid
            if (data.questionsList.length > 0) {
                cachedPramsQuestions = {questionTree: data.questionTree, questionsList: data.questionsList};
            }
            deferred.resolve(cachedPramsQuestions);
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
        var keys = Object.keys(questions);
        keys.sort();
        var newQuestions = {};
        for(var i = 0; i < keys.length; i++) {
            newQuestions[keys[i]] = questions[keys[i]];
        }
        questions = newQuestions;
    }
    //iterate through questions
    for (var qKey in questions) {
        var quesObj = questions[qKey];
        var qCategory = quesObj.topic?quesObj.topic:'No Topic'; //Default the topic if not specified
        if(prams) {
            qCategory = quesObj.subtopic;
        }
        if (qCategory && qCategoryMap[qCategory] == undefined) {
            qCategoryMap[qCategory] = {id:'cat_'+catCount, text:qCategory, children:[]};
            catCount = catCount + 1;
        } else {
            if(prams) {
                //skip duplicate question keys
                if(questionKeys.indexOf(qKey) >= 0) {
                    continue;
                }
                var question = {text:quesObj.question, id: qKey};
                qCategoryMap[qCategory].children.push(question);
                questionsList.push({key: quesObj.question, qkey: qKey, title: quesObj.question});
                questionKeys.push(qKey);
            } else {
                // Select only those questions starting with qn
                if(qKey.indexOf("qn") >= 0) {
                    var question = {text: quesObj.question, id: qKey};
                    qCategoryMap[qCategory].children.push(question);
                    //capture all questions into questionsList
                    questionsList.push({key: quesObj.question, qkey: qKey, title: quesObj.question});
                }
            }
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