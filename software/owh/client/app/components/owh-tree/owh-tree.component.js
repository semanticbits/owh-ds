'use strict';(function(){    angular        .module('owh')        .component("owhTree",{            templateUrl: 'app/components/owh-tree/owhTree.html',            controller: TreeController,            controllerAs: 'tc',            bindings:{                codeKey : "=",                optionValues : "=",                entityName : "=",                submitClose : '&'            }        });    TreeController.$inject=['$scope','$compile','$timeout','utilService'];    function TreeController($scope, $compile, $timeout, utilService){        var tc = this;        tc.ac = function(){            return true;        };        tc.removeNode = removeNode;        tc.treeConfig = {            core : {                error: function(error) {                    console.log('sideFilterController: error from js tree - ' + angular.toJson(error));                },                'themes':{                    "theme" : "expand_collapse",                    "icons":false                },                expand_selected_onload:true,                multiple:true,                get_selected:true            },            "search": {                "show_only_matches" : true            },            plugins : [ "search", "themes", "checkbox" ]        };        tc.treeEventsObj = {            'select_node': selectedNodeCB,            'ready': readyCB,            'deselect_node': deSelectedNodeCB        };        /*onReady select the default selected causes*/        function readyCB() {            angular.forEach(tc.optionValues,function(value, index){                tc.treeInstance.jstree('select_node', value.id);            });        }        /*onSelecting causes update the values with selected causes*/        function selectedNodeCB(obj) {            selectCodes(obj);        }        /*onDeselecting causes update the values with selected causes*/        function deSelectedNodeCB(obj) {            selectCodes(obj);        }        /*Search js tree */        tc.searchTree = function(elem) {            //var to = false;            //if (to) {            //    clearTimeout(to);            //}            //to =                $timeout(function () {                var searchString = jQuery('#search_text').val();                if(searchString.length>1) {                    getTreeInstance().search(searchString);                } else {                    getTreeInstance().clear_search();                }            }, 250);        };        /*Helper functions starts*/        function getTreeInstance() {            return tc.treeInstance.jstree(true);        }        function selectCodes(obj) {            $timeout(function() {                tc.selectedNodes =  getTreeInstance().get_selected(true);                tc.optionValues = [];                tc.parentIds = [];                var parentNodes = [];                angular.forEach(tc.selectedNodes,function(selectedNode, index){                    var childNodes = [];                    //For YRBS Questions                    if (tc.entityName == 'Question') {                        //get the node with it's child nodes                        var parentNode = getTreeInstance().get_json(selectedNode.id);                        //get all child nodes of a selected node                        angular.forEach(parentNode.children, function (childNode, index) {                            childNodes.push({id:childNode.id, text:childNode.text});                        });                    }                    //if parent is not already selected, add this node                    if (tc.parentIds.indexOf(selectedNode.parent) == -1) {                        tc.optionValues.push({id:selectedNode.id, text:selectedNode.text, childNodes: childNodes});                        tc.parentIds.push(selectedNode.id);                    }                    //remove all children, if parent has already been selected                    if(selectedNode.children.length > 0 && tc.optionValues.length > 0) {                        angular.forEach(selectedNode.children, function (childNode, childIndex) {                            removeSelectedOption(childNode);                        });                    }                });            },250);        }        /**         * This funtion is used to remove the selected option         * @param optionId         */        function removeSelectedOption(optionId) {            for (var i= 0; i < tc.optionValues.length; i++) {                if (tc.optionValues[i].id == optionId) {                    tc.optionValues.splice(i, 1);                    break;                }            }        }        /*Helper functions Ends*/        /*        * To remove node from selected nodes list        * */        function removeNode(nodeId) {            $timeout(function() {                var node = getTreeInstance().get_node(nodeId);                getTreeInstance().deselect_node(node);            }, 250)        }    }}());