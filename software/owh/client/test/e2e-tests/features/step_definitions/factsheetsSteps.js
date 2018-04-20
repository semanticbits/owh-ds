var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var factsheetsDefinitionsWrapper = function () {

    this.setDefaultTimeout(600000);

    var fsp = require('../support/factsheets.po')

    this.When(/^I navigate to factsheets page$/, function () {
        return fsp.getFactSheetLink.click();
    });

    this.Then(/^I should get factsheets page$/, function () {
        expect(fsp.pageHeading.isDisplayed()).to.eventually.equal(true);
        expect(fsp.pageDescription.isDisplayed()).to.eventually.equal(true);
        expect(fsp.stateSelectBox.isDisplayed()).to.eventually.equal(true);
        return expect(fsp.generateFactSheetLink.isDisplayed()).to.eventually.equal(true);
    });

    this.When(/^I click on generate fact sheet link$/, function () {

       return fsp.generateFactSheetLink.click();
    });

    this.Then(/^generated data should be displayed on same factsheets page$/, function (next) {
        //browser.wait()
        expect(element(by.className('state-heading')).isDisplayed()).to.eventually.equal(true);
        expect(element(by.className('state-heading')).getText()).to.eventually.equal("Maryland - Minority Health");
        expect(element(by.tagName('h3')).getText()).to.eventually.equal("Maryland - Minority Health");
        expect(element(by.className('bridge-race-heading')).getText()).to.eventually.equal("Population in Maryland");
        fsp.getTableHeaders('bridge-race-table1').then(function(headers) {
            expect(headers[0]).to.contains('Racial Distributions of Residents*');
            expect(headers[1]).to.contains('Total');
            expect(headers[2]).to.contains('Black, non-Hispanic');
            expect(headers[3]).to.contains('American Indian');
            expect(headers[4]).to.contains('Asian/Pacific Islander');
            expect(headers[5]).to.contains('Hispanic');
        });
        fsp.getTableCellData('bridge-race-table1', 0,1).then(function(data){
            expect(data).to.contains('2,353,855');
        });

        fsp.getTableCellData('bridge-race-table1', 0,2).then(function(data){
            expect(data).to.contains('1,820,087');
        });
        fsp.getTableCellData('bridge-race-table1', 0,3).then(function(data){
            expect(data).to.contains('39,697');
        });
        fsp.getTableCellData('bridge-race-table1', 0,4).then(function(data){
            expect(data).to.contains('424,047');
        });
        fsp.getTableCellData('bridge-race-table1', 0,5).then(function(data){
            expect(data).to.contains('572,373');
        });


        fsp.getTableHeaders('detail-mortality-table').then(function(headers){
            expect(headers[0]).to.contains('Cause of Death');
            expect(headers[1]).to.contains('Measure');
            expect(headers[2]).to.contains('Black or African American');
            expect(headers[3]).to.contains('Asian or Pacific Islander');
            expect(headers[4]).to.contains('American Indian or Alaska Native');
            expect(headers[5]).to.contains('Hispanic');
        });
        fsp.getTableCellData('detail-mortality-table', 0,1).then(function(data){
             expect(data).to.contains('Number of deaths');
        });
        fsp.getTableHeaders('infant-mortality-table').then(function(headers){
            expect(headers[0]).to.contains('Measure');
            expect(headers[1]).to.contains('American Indian or Alaska Native');
            expect(headers[2]).to.contains('Asian or Pacific Islander');
            expect(headers[3]).to.contains('Black or African American');
            expect(headers[4]).to.contains('Hispanic');
        });
        fsp.getTableCellData('infant-mortality-table', 0,1).then(function(data){
            expect(data).to.contains('Suppressed');
        });

        fsp.getTableHeaders('prams-table-1').then(function(headers){
            expect(headers[0]).to.contains('Question');
            expect(headers[1]).to.contains('Black, Non-Hispanic');
            expect(headers[2]).to.contains('Hispanic');
            expect(headers[3]).to.contains('Other, Non- Hispanic');
        });

        fsp.getTableCellData('prams-table-1',0,0).then(function(data){
          expect(data).to.contains('Smoking cigarettes during the last three months of pregnancy');
          //expect(data).to.contains('9.1%');
        });

        fsp.getTableHeaders('brfss-table').then(function(headers){
            expect(headers[0]).to.contains('Question');
            expect(headers[1]).to.contains('American Indian or Alaskan Native, non-Hispanic');
            expect(headers[2]).to.contains('Asian, non-Hispanic');
            expect(headers[3]).to.contains('Black, non-Hispanic');
            expect(headers[4]).to.contains('Hispanic');
            expect(headers[5]).to.contains('Multiracial non-Hispanic');
            expect(headers[6]).to.contains('Native Hawaiian or other Pacific Islander, non-Hispanic');
            expect(headers[7]).to.contains('Other, non-Hispanic');
        });

       fsp.getTableCellData('brfss-table', 0,0).then(function(data){
            expect (data).to.contains('Were Obese (BMI 30.0 - 99.8)');
          // getElementById("tableid_goes_here").rows[i].cells[j]            expect(data[1]).to.contains('29.8%');
        });
        fsp.getTableHeaders('yrbs-table').then(function(headers){
            expect(headers[0]).to.contains('Question');
            expect(headers[1]).to.contains('American Indian or Alaska Native');
            expect(headers[2]).to.contains('Asian');
            expect(headers[3]).to.contains('Black or African American');
            expect(headers[4]).to.contains('Hispanic or Latino');
            expect(headers[5]).to.contains('Multiple Race');
            expect(headers[6]).to.contains('Native Hawaiian or Other Pacific Islander');

        });

        fsp.getTableCellData('yrbs-table',0,1).then(function(data){
            expect(data).to.contains('29.5%');

        });
        fsp.getTableHeaders('natality-table').then(function(headers){
            expect(headers[0]).to.contains('Measure');
            expect(headers[1]).to.contains('American Indian or Alaska Native');
            expect(headers[2]).to.contains('Asian or Pacific Islander');
            expect(headers[3]).to.contains('Black or African American');

        });

        fsp.getTableCellData('natality-table', 0,1).then(function(data){
            expect(data).to.contains('279');
        });

        fsp.getTableHeaders('tb-table').then(function(headers){
            expect(headers[0]).to.contains('Measure');
            expect(headers[1]).to.contains('American Indian or Alaska Native');
            expect(headers[2]).to.contains('Asian');
            expect(headers[3]).to.contains('Black or African American');
            expect(headers[4]).to.contains('Hispanic or Latino');
            expect(headers[5]).to.contains('Multiple races');
            expect(headers[6]).to.contains('Native Hawaiian or Other Pacific Islander');

        });
        fsp.getTableCellData('tb-table', 0,1).then(function(data){
            expect(data).to.contains('0');
        });
        fsp.getTableHeaders('std-table').then(function(headers){
            expect(headers[0]).to.contains('Disease');
            expect(headers[1]).to.contains('Measure');
            expect(headers[2]).to.contains('American Indian or Alaska Native');
            expect(headers[3]).to.contains('Asian');
            expect(headers[4]).to.contains('Black or African American');
            expect(headers[5]).to.contains('Hispanic or Latino');
            expect(headers[6]).to.contains('Multiple races');
            expect(headers[7]).to.contains('Native Hawaiian or Other Pacific Islander');

        });
        fsp.getTableCellData('std-table', 0,2).then(function(data){
            expect(data).to.contains('36');
        });
        fsp.getTableHeaders('hiv-table').then(function(headers){
            expect(headers[0]).to.contains('Indicator');
            expect(headers[1]).to.contains('Measure');
            expect(headers[2]).to.contains('American Indian or Alaska Native');
            expect(headers[3]).to.contains('Asian');
            expect(headers[4]).to.contains('Black or African American');
            expect(headers[5]).to.contains('Hispanic or Latino');
            expect(headers[6]).to.contains('Multiple races');
            expect(headers[7]).to.contains('Native Hawaiian or Other Pacific Islander');

        });
        fsp.getTableCellData('hiv-table', 0, 2).then(function(data){
            expect(data).to.contains('2');
        });
        fsp.getTableHeaders('cancer-table').then(function(headers){
            expect(headers[0]).to.contains('Cancer Site');
            expect(headers[1]).to.contains('Measure');
            expect(headers[2]).to.contains('American Indian or Alaska Native');
            expect(headers[3]).to.contains('Asian or Pacific Islander');
            expect(headers[4]).to.contains('Black');
            expect(headers[5]).to.contains('Hispanic');
        });
        fsp.getTableCellData('cancer-table', 0, 2).then(function(data){
            expect(data).to.contains('39,007');
        }).then(next);

    });

    this.When(/^I select state "([^"]*)" from state selectbox$/, function (arg1, next) {
        element(by.id('state')).element(by.cssContainingText('option', arg1)).click()
            .then(next);
    });


    this.When(/^I select fact sheet type "([^"]*)"$/, function (factsheetType) {
        return fsp.selectFactSheetType(factsheetType);
    });



    this.Then(/^For "([^"]*)" the generated population data as defined in "([^"]*)" file$/, function (state, csvFile, next) {
        //    "csvjson": "^5.0.0",
       var populations = fsp.loadCsvFile(csvFile);
       // console.log("populations", populations)
       var p = populations
           .find(function(p) { return p.State === state});

        fsp.getTableCellData('bridge-race-table1', 0,1).then(function(data){
            expect(data).to.contains((p.Total));
        });
        fsp.getTableCellData('bridge-race-table1', 0,2).then(function(data){
            expect(data).to.contains((p.Black));
        });

        next();
    });


    this.Then(/^For <state> and type "([^"]*)" the generated population data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
        table.rows().forEach(function (row) {

            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();

            var populations = fsp.loadCsvFile(csvFile);
            // console.log("populations", populations)
            var p = populations
                .find(function(p) { return p.State === state});
            fsp.getTableCellData('bridge-race-table1', 0,1).then(function(data){
                expect(data).to.contains((p.Total));
            });
            fsp.getTableCellData('bridge-race-table1', 0,2).then(function(data){
                expect(data).to.contains((p.Black));
            });
            fsp.getTableCellData('bridge-race-table1', 0,3).then(function(data){
                expect(data).to.contains(p['AmericanIndian']);
            });
            fsp.getTableCellData('bridge-race-table1', 0,4).then(function(data){
                expect(data).to.contains(p['Asian']);
            });
            fsp.getTableCellData('bridge-race-table1', 0,5).then(function(data){
                expect(data).to.contains((p.Hispanic));
            });
            console.log('state =', state)
        });
        next();
    });

    //Infant Mortality data-set
    this.Then(/^For <state> and type "([^"]*)" the generated Infant Mortality data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
        // Write code here that turns the phrase above into concrete actions
        table.rows().forEach(function(row){
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option',state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('infant-mortality-table').then(function(headers){
                expect(headers[0]).to.contains('Measure');
                expect(headers[1]).to.contains('American Indian or Alaska Native');
                expect(headers[2]).to.contains('Asian or Pacific Islander');
                expect(headers[3]).to.contains('Black or African American');
                expect(headers[4]).to.contains('Hispanic');
            });
            var infantMortality = fsp.loadCsvFile(csvFile);

            var imList = infantMortality
                .filter(function(im){return im.State === state});
           imList.forEach(function(item,i) {
               fsp.getTableCellData('infant-mortality-table',i,0).then(function(data){
             expect(data).to.contains(item.Measure);

             });

         fsp.getTableCellData('infant-mortality-table',i,1).then(function(data){
             expect(data).to.contains(item['American Indian or Alaska Native']);

         });
         fsp.getTableCellData('infant-mortality-table',i,2).then(function(data){
             expect(data).to.contains(item['Asian or Pacific Islander']);

         });
         fsp.getTableCellData('infant-mortality-table',i,3).then(function(data){
             expect(data).to.contains(item['Black or African American']);
         });
         fsp.getTableCellData('infant-mortality-table',i,4).then(function(data){
             expect(data).to.contains(item['Hispanic']);
         });
           });
            //console.log('state =', state);
        });

       next();
    });

    // Tuberculosis dataset-factsheet
    this.Then(/^For <state> and type "([^"]*)" the generated Tuberculosis data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
        // Write code here that turns the phrase above into concrete actions
        table.rows().forEach(function(row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('tb-factsheet').then(function (headers) {
                expect(headers[0]).to.contains('Measure');
                expect(headers[1]).to.contains('American Indian or Alaska Native');
                expect(headers[2]).to.contains('Asian');
                expect(headers[3]).to.contains('Black or African American');
                expect(headers[4]).to.contains('Hispanic or Latino');
                expect(headers[5]).to.contains('Multiple races');
                expect(headers[6]).to.contains('Native Hawaiian or Other Pacific Islander');
            });

            var tuberculosis = fsp.loadCsvFile(csvFile);
            var tbData = tuberculosis
                 .filter(function(tb){return tb.State === state});
                    tbData.forEach(function(item,i) {
                        fsp.getTableCellData('tb-factsheet',i,0).then(function(data){
                            expect(data).to.contains(item.Measure);
                        });

                        fsp.getTableCellData('tb-factsheet',i,1).then(function(data){
                            expect(data).to.contains(item['American Indian or Alaska Native']);
                        });
                        fsp.getTableCellData('tb-factsheet',i,2).then(function(data){
                            expect(data).to.contains(item.Asian);
                        });
                        fsp.getTableCellData('tb-factsheet',i,3).then(function(data){
                            expect(data).to.contains(item['Black or African American']);
                        });
                        fsp.getTableCellData('tb-factsheet',i,4).then(function(data){
                            expect(data).to.contains(item['Hispanic or Latino']);
                        });
                        fsp.getTableCellData('tb-factsheet',i,5).then(function(data){
                            expect(data).to.contains(item['Multiple races']);
                        });
                        fsp.getTableCellData('tb-factsheet',i,6).then(function(data){
                            expect(data).to.contains(item['Native Hawaiian or Other Pacific Islander']);
                        });
                    });
            });
       next();
    });
//Births-Minority health dataset factsheet
    this.Then(/^For <state> and type "([^"]*)" the generated Births data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('natality-table').then(function (headers) {
                expect(headers[0]).to.contains('Measure');
                expect(headers[1]).to.contains('American Indian or Alaska Native');
                expect(headers[2]).to.contains('Asian or Pacific Islander');
                expect(headers[3]).to.contains('Black or African American');
            });
            var birth = fsp.loadCsvFile(csvFile);
            //console.log(birth);
            var birthData = birth
                .filter(function (br) {
                    return br.state === state
                });

            birthData.forEach(function (item, i) {
                fsp.getTableCellData('natality-table', i, 0).then(function (data) {
                    expect(data).to.contains(item.Measure);
                   // console.log(item.Measure);
                });
                fsp.getTableCellData('natality-table', i, 1).then(function (data) {
                    expect(data).to.contains(item['American Indian or Alaska Native']);
                });
                fsp.getTableCellData('natality-table', i, 2).then(function (data) {
                    expect(data).to.contains(item['Asian or Pacific Islander']);
                });

                fsp.getTableCellData('natality-table', i, 3).then(function (data) {

                        expect(data).to.contains(item['Black or African American']);
                });
            });
            //console.log('state =', state);
        });
        next();
    });

    };

module.exports = factsheetsDefinitionsWrapper;