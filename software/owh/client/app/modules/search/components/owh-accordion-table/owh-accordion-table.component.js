'use strict';
(function() {
    angular
        .module('owh.search')
        .component('owhAccordionTable', {
            templateUrl: 'app/modules/search/components/owh-accordion-table/owhAccordionTable.html',
            controller: OWHAccordionTableController,
            controllerAs: 'oatc',
            bindings: {
                data: '<',
                headers: '<',
                showCi: '<',
                showUf: '<',
                showCharts:'<',
                primaryKey: '<'
            }
        });
    OWHAccordionTableController.$inject = ['$scope', 'utilService', '$rootScope'];
    function OWHAccordionTableController($scope, utilService, $rootScope) {
        var oatc = this;
        oatc.categoryFilter = null;
        oatc.isShowCounts = isShowCounts;

        var questionDefaults = {
            "Tobacco Use": [/^Currently Used E/, /^Currently Used C/], // SP
            "Unintentional Injuries and Violence": [/^Seriously/, /^Rode with/],
            "Alcohol and Other Drug Use": [/^Currently D/, /^Currently U/],
            "Sexual Behaviors": [/^Were/, /^Did/],
            "Physical Activity": [/^Watched/, /^Did/],
            "Obesity, Overweight, and Weight Control": [/^Had/, /^Were/],
            "Dietary Behaviors": [/^Drank A Can, Bottle, Or Glass Of A/, /^Drank A Can, Bottle, Or Glass Of S/],
            "Other Health Topics": [/^Did Not H/, /^Did Not S/]
        };

        oatc.qCategoryHelpTextMap = {
             "Tobacco Use": "label.help.text.question.tobacco.use",
             "Unintentional Injuries and Violence": "label.help.text.question.unintentional.injuries.violence",
             "Alcohol and Other Drug Use": "label.help.text.question.alcohol.other.drug.use",
             "Sexual Behaviors": "label.help.text.question.sexua.behaviors",
             "Physical Activity": "label.help.text.question.physical.activity",
             "Obesity, Overweight, and Weight Control": "label.help.text.question.obesity.overweight.weight.control",
             "Dietary Behaviors": "label.help.text.question.dietary.behaviors",
             "Other Health Topics": "label.help.text.question.other.health.topics"
        };

        oatc.collapseRow = function(row) {
            row.collapse = true;
        };

        oatc.expandRow = function(row) {
            row.collapse = false;
        };

        oatc.toggleRowCollapse = function(row) {
            if(row.collapse) {
                oatc.expandRow(row);
            } else {
                oatc.collapseRow(row);
            }
        };

        oatc.showMore = function(row) {
            row.hide = false;
        };

        oatc.showLess = function(row) {
            row.hide = true;
        };

        oatc.filterCategory = function(value, index, array) {
            if (oatc.categoryFilter == null) {
                return true;
            } else if (value == oatc.categoryFilter) {
                return true;
            } else {
                return false;
            }
        }

        oatc.showOnly = function(category) {
            oatc.categoryFilter = category;
        };

        oatc.listRows = function(catagory) {
            var rows = [], firstRow = [];
            if(oatc.primaryKey === 'mental_health') {
                if (catagory.title in questionDefaults) {

                    for (var i = 0; i < catagory.questions.length; ) {
                        var question = catagory.questions[i],
                            defaults = questionDefaults[catagory.title];

                        if (question[0].title.search(defaults[0]) == 0) {
                            firstRow = [question, catagory.questions[i+1]];
                            i = i + 2;

                        } else if (question[0].title.search(defaults[1]) == 0) {
                            firstRow = [question, catagory.questions[i+1]];
                            i = i + 2;

                        } else {
                            rows.push(question);
                            i++;
                        }
                    }
                }
                if (firstRow.length > 0) {
                    rows.splice(0, 0, firstRow[0]);
                    rows.splice(1, 0, firstRow[1]);
                }
                return rows;
            } else {
                return catagory.questions;
            }
        };

        oatc.containsSupp = function() {
            var suppressed = false;
            for (var i = 0; i < oatc.data.length; i++) {
                for (var j = 0; j < oatc.listRows(oatc.data[i]).length; j++) {
                    for (var k = 0; k < oatc.listRows(oatc.data[i])[j].length; k++) {
                        if (oatc.listRows(oatc.data[i])[j].title.mean === 'suppressed') {
                            suppressed = true;
                        }
                    }
                }
            }

            return suppressed;
        };

        function isShowCounts(mean) {
            //for YRBS show counts all the time
            if(oatc.primaryKey === 'mental_health') {
                return true;
            } else {
                return mean != 'suppressed' && mean != 'na';
            }
        }
    }
}());
