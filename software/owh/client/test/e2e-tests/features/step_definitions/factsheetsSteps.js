var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var _ = require('lodash');

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


    this.Given(/^I click on downloadFactSheetLink$/, function () {
        return fsp.downloadFactSheetLink.click();
    });
    this.Then(/^generated data should be displayed on same factsheets page$/, function (next) {
        //browser.wait()
        expect(element(by.className('state-heading')).isDisplayed()).to.eventually.equal(true);
        expect(element(by.className('state-heading')).getText()).to.eventually.equal("Maryland - Minority Health");
        expect(element(by.tagName('h3')).getText()).to.eventually.equal("Maryland - Minority Health");
        expect(element(by.className('bridge-race-heading')).getText()).to.eventually.equal("Population in Maryland");
        fsp.getTableHeaders('bridge-race-table1').then(function (headers) {
            expect(headers[0]).to.contains('Racial distributions of minority residents*');
            expect(headers[1]).to.contains('Total');
            expect(headers[2]).to.contains('Black, non-Hispanic');
            expect(headers[3]).to.contains('American Indian');
            expect(headers[4]).to.contains('Asian or Pacific Islander');
            expect(headers[5]).to.contains('Hispanic');
        });
        fsp.getTableCellData('bridge-race-table1', 0, 1).then(function (data) {
            expect(data).to.contains('2,353,855');
        });

        fsp.getTableCellData('bridge-race-table1', 0, 2).then(function (data) {
            expect(data).to.contains('1,820,087');
        });
        fsp.getTableCellData('bridge-race-table1', 0, 3).then(function (data) {
            expect(data).to.contains('39,697');
        });
        fsp.getTableCellData('bridge-race-table1', 0, 4).then(function (data) {
            expect(data).to.contains('424,047');
        });
        fsp.getTableCellData('bridge-race-table1', 0, 5).then(function (data) {
            expect(data).to.contains('572,373');
        });
        fsp.getTableHeaders('detail-mortality-table').then(function (headers) {
            expect(headers[0]).to.contains('Cause of Death');
            expect(headers[1]).to.contains('Measure');
            expect(headers[2]).to.contains('American Indian or Alaska Native');
            expect(headers[3]).to.contains('Asian or Pacific Islander');
            expect(headers[4]).to.contains('Black or African American');
            expect(headers[5]).to.contains('Hispanic');
        });
        fsp.getTableCellData('detail-mortality-table', 0, 1).then(function (data) {
            expect(data).to.contains('Number of deaths');
        });
        fsp.getTableHeaders('infant-mortality-table').then(function (headers) {
            expect(headers[0]).to.contains('Measure');
            expect(headers[1]).to.contains('American Indian or Alaska Native');
            expect(headers[2]).to.contains('Asian or Pacific Islander');
            expect(headers[3]).to.contains('Black or African American');
            expect(headers[4]).to.contains('Hispanic');
        });
        fsp.getTableCellData('infant-mortality-table', 0, 1).then(function (data) {
            expect(data).to.contains('Suppressed');
        });

        fsp.getTableHeaders('prams-table-1').then(function (headers) {
            expect(headers[0]).to.contains('Question');
            expect(headers[1]).to.contains('Black, Non-Hispanic');
            expect(headers[2]).to.contains('Hispanic');
            expect(headers[3]).to.contains('Other, Non- Hispanic');
        });

        fsp.getTableCellData('prams-table-1', 0, 0).then(function (data) {
            expect(data).to.contains('Smoking cigarettes during the last three months of pregnancy');
            //expect(data).to.contains('9.1%');
        });

        fsp.getTableHeaders('brfss-table').then(function (headers) {
            expect(headers[0]).to.contains('Question');
            expect(headers[1]).to.contains('American Indian or Alaskan Native, non-Hispanic');
            expect(headers[2]).to.contains('Asian, non-Hispanic');
            expect(headers[3]).to.contains('Black, non-Hispanic');
            expect(headers[4]).to.contains('Hispanic');
            expect(headers[5]).to.contains('Multiracial non-Hispanic');
            expect(headers[6]).to.contains('Native Hawaiian or other Pacific Islander, non-Hispanic');
            expect(headers[7]).to.contains('Other, non-Hispanic');
        });

        fsp.getTableCellData('brfss-table', 0, 0).then(function (data) {
            expect(data).to.contains('Weight classification by Body Mass Index (BMI) : Obese (bmi 30.0 - 99.8)');
            // getElementById("tableid_goes_here").rows[i].cells[j]            expect(data[1]).to.contains('29.8%');
        });
        fsp.getTableHeaders('yrbs-table').then(function (headers) {
            expect(headers[0]).to.contains('Question');
            expect(headers[1]).to.contains('American Indian or Alaska Native');
            expect(headers[2]).to.contains('Asian');
            expect(headers[3]).to.contains('Black or African American');
            expect(headers[4]).to.contains('Hispanic or Latino');
            expect(headers[5]).to.contains('Multiple Race');
            expect(headers[6]).to.contains('Native Hawaiian or Other Pacific Islander');
        });

        fsp.getTableCellData('yrbs-table', 0, 1).then(function (data) {
            expect(data).to.contains('29.5%');
        });
        fsp.getTableHeaders('natality-table').then(function (headers) {
            expect(headers[0]).to.contains('Measure');
            expect(headers[1]).to.contains('American Indian or Alaska Native');
            expect(headers[2]).to.contains('Asian or Pacific Islander');
            expect(headers[3]).to.contains('Black or African American');

        });

        fsp.getTableCellData('natality-table', 0, 1).then(function (data) {
            expect(data).to.contains('279');
        });

        fsp.getTableHeaders('tb-table').then(function (headers) {
            expect(headers[0]).to.contains('Measure');
            expect(headers[1]).to.contains('American Indian or Alaska Native');
            expect(headers[2]).to.contains('Asian');
            expect(headers[3]).to.contains('Black or African American');
            expect(headers[4]).to.contains('Hispanic or Latino');
            expect(headers[5]).to.contains('Multiple races');
            expect(headers[6]).to.contains('Native Hawaiian or Other Pacific Islander');

        });
        fsp.getTableCellData('tb-table', 0, 1).then(function (data) {
            expect(data).to.contains('0');
        });
        fsp.getTableHeaders('std-table').then(function (headers) {
            expect(headers[0]).to.contains('Disease');
            expect(headers[1]).to.contains('Measure');
            expect(headers[2]).to.contains('American Indian or Alaska Native');
            expect(headers[3]).to.contains('Asian');
            expect(headers[4]).to.contains('Black or African American');
            expect(headers[5]).to.contains('Hispanic or Latino');
            expect(headers[6]).to.contains('Multiple races');
            expect(headers[7]).to.contains('Native Hawaiian or Other Pacific Islander');

        });
        fsp.getTableCellData('std-table', 0, 2).then(function (data) {
            expect(data).to.contains('36');
        });
        fsp.getTableHeaders('hiv-table').then(function (headers) {
            expect(headers[0]).to.contains('Indicator');
            expect(headers[1]).to.contains('Measure');
            expect(headers[2]).to.contains('American Indian or Alaska Native');
            expect(headers[3]).to.contains('Asian');
            expect(headers[4]).to.contains('Black or African American');
            expect(headers[5]).to.contains('Hispanic or Latino');
            expect(headers[6]).to.contains('Multiple races');
            expect(headers[7]).to.contains('Native Hawaiian or Other Pacific Islander');

        });
        fsp.getTableCellData('hiv-table', 0, 2).then(function (data) {
            expect(data).to.contains('2');
        });
        fsp.getTableHeaders('cancer-table').then(function (headers) {
            expect(headers[0]).to.contains('Cancer Site');
            expect(headers[1]).to.contains('Measure');
            expect(headers[2]).to.contains('American Indian or Alaska Native');
            expect(headers[3]).to.contains('Asian or Pacific Islander');
            expect(headers[4]).to.contains('Black');
            expect(headers[5]).to.contains('Hispanic');
        });
        fsp.getTableCellData('cancer-table', 0, 2).then(function (data) {
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
            .find(function (p) {
                return p.State === state
            });

        fsp.getTableCellData('bridge-race-table1', 0, 1).then(function (data) {
            expect(data).to.contains((p.Total));
        });
        fsp.getTableCellData('bridge-race-table1', 0, 2).then(function (data) {
            expect(data).to.contains((p.Black));
        });

        next();
    });

       //pdf download
    this.Then(/^I select <state> and fact sheet type "([^"]*)" and generated data downloaded file defined in "([^"]*)"$/, function (factType, csvFile, table, next) {
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.downloadFactSheetLink.click();
            browser.sleep(1000);
        });
        next();
    });

//Population racial distribution
    this.Then(/^For <state> and type "([^"]*)" the generated population racial distributions data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
        table.rows().forEach(function (row) {

            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('bridge-race-table1').then(function (headers) {
                expect(headers[0]).to.contains('Racial distributions of minority residents*');
                expect(headers[1]).to.contains('Total');
                expect(headers[2]).to.contains('Black, non-Hispanic');
                expect(headers[3]).to.contains('American Indian');
                expect(headers[4]).to.contains('Asian or Pacific Islander');
                expect(headers[5]).to.contains('Hispanic');
            });

            var populations = fsp.loadCsvFile(csvFile);
            var p = populations
                .find(function (p) {
                    return p.State === state
                });
            fsp.getTableCellData('bridge-race-table1', 0, 1).then(function (data) {
                expect(data).to.contains((p.Total));
            });
            fsp.getTableCellData('bridge-race-table1', 0, 2).then(function (data) {
                expect(data).to.contains((p.Black));
            });
            fsp.getTableCellData('bridge-race-table1', 0, 3).then(function (data) {
                expect(data).to.contains(p['AmericanIndian']);
            });
            fsp.getTableCellData('bridge-race-table1', 0, 4).then(function (data) {
                expect(data).to.contains(p['Asian']);
            });
            fsp.getTableCellData('bridge-race-table1', 0, 5).then(function (data) {
                expect(data).to.contains((p.Hispanic));
            });
            console.log('state =', state)
        });
        next();
    });
    //Population Age Distribution
    this.Then(/^For <state> and type "([^"]*)" the generated population data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {

        table.rows().forEach(function (row) {

            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();

            fsp.getTableHeaders('bridge-race-table2').then(function (headers) {
                expect(headers[0]).to.contains('Age distributions of minority residents');
                expect(headers[1]).to.contains('10-14');
                expect(headers[2]).to.contains('15-19');
                expect(headers[3]).to.contains('20-44');
                expect(headers[4]).to.contains('45-64');
                expect(headers[5]).to.contains('65-84');
                expect(headers[6]).to.contains('85+');
            });

            var populations = fsp.loadCsvFile(csvFile);
            var p = populations
                .find(function (p) {
                    return p.State === state
                });
            fsp.getTableCellData('bridge-race-table2', 0, 0).then(function (data) {
                expect(data).to.contains(p['Age']);
            });
            fsp.getTableCellData('bridge-race-table2', 0, 1).then(function (data) {
                expect(data).to.contains(p['10-14']);
            });
            fsp.getTableCellData('bridge-race-table2', 0, 2).then(function (data) {
                expect(data).to.contains(p['15-19']);
            });
            fsp.getTableCellData('bridge-race-table2', 0, 3).then(function (data) {
                expect(data).to.contains(p['20-44']);
            });
            fsp.getTableCellData('bridge-race-table2', 0, 4).then(function (data) {
                expect(data).to.contains((p['45-64']));
            });
            fsp.getTableCellData('bridge-race-table2', 0, 5).then(function (data) {
                expect(data).to.contains((p['65-84']));
            });
            fsp.getTableCellData('bridge-race-table2', 0, 6).then(function (data) {
                expect(data).to.contains((p['85+']));
            });
            console.log('state =', state)
        });
        next();

    });


    //Infant Mortality data-set
    this.Then(/^For <state> and type "([^"]*)" the generated Infant Mortality data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
        // Write code here that turns the phrase above into concrete actions
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('infant-mortality-table').then(function (headers) {
                expect(headers[0]).to.contains('Measure');
                expect(headers[1]).to.contains('American Indian or Alaska Native');
                expect(headers[2]).to.contains('Asian or Pacific Islander');
                expect(headers[3]).to.contains('Black or African American');
                expect(headers[4]).to.contains('Hispanic');
            });
            var infantMortality = fsp.loadCsvFile(csvFile);

            var imList = infantMortality
                .filter(function (im) {
                    return im.State === state
                });
            imList.forEach(function (item, i) {

                    fsp.getTableCellData('infant-mortality-table', i, 0).then(function (data) {
                        expect(data).to.contains(item.Measure);

                    });

                fsp.getTableCellData('infant-mortality-table', i, 1).then(function (data) {
                    expect(data).to.contains(item['American Indian or Alaska Native']);

                });
                fsp.getTableCellData('infant-mortality-table', i, 2).then(function (data) {
                    expect(data).to.contains(item['Asian or Pacific Islander']);

                });
                fsp.getTableCellData('infant-mortality-table', i, 3).then(function (data) {
                    expect(data).to.contains(item['Black or African American']);
                });
                fsp.getTableCellData('infant-mortality-table', i, 4).then(function (data) {
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
        table.rows().forEach(function (row) {
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
                .filter(function (tb) {
                    return tb.State === state
                });
            tbData.forEach(function (item, i) {
                fsp.getTableCellData('tb-factsheet', i, 0).then(function (data) {
                    expect(data).to.contains(item.Measure);
                });

                fsp.getTableCellData('tb-factsheet', i, 1).then(function (data) {
                    expect(data).to.contains(item['American Indian or Alaska Native']);
                });
                fsp.getTableCellData('tb-factsheet', i, 2).then(function (data) {
                    expect(data).to.contains(item.Asian);
                });
                fsp.getTableCellData('tb-factsheet', i, 3).then(function (data) {
                    expect(data).to.contains(item['Black or African American']);
                });
                fsp.getTableCellData('tb-factsheet', i, 4).then(function (data) {
                    expect(data).to.contains(item['Hispanic or Latino']);
                });
                fsp.getTableCellData('tb-factsheet', i, 5).then(function (data) {
                    expect(data).to.contains(item['Multiple races']);
                });
                fsp.getTableCellData('tb-factsheet', i, 6).then(function (data) {
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

    //Behavioral Risk data set
    this.Then(/^For <state> and type "([^"]*)" the generated Behavioral Risk data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
            table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('brfss-table').then(function (headers) {
                expect(headers[0]).to.contains('Question');
                expect(headers[1]).to.contains('American Indian or Alaskan Native, non-Hispanic');
                expect(headers[2]).to.contains('Asian, non-Hispanic');
                expect(headers[3]).to.contains('Black, non-Hispanic');
                expect(headers[4]).to.contains('Hispanic');
                expect(headers[5]).to.contains('Multiracial non-Hispanic');
                expect(headers[6]).to.contains('Native Hawaiian or other Pacific Islander, non-Hispanic');
                expect(headers[7]).to.contains('Other, non-Hispanic');
            });
            var behavioral_risk_dataset = fsp.loadCsvFile(csvFile);
            var brfssData = behavioral_risk_dataset
                .filter(function (br) {
                    return br.state === state
                });

                brfssData.forEach(function (item, i) {
                fsp.getTableCellData('brfss-table', i,0).then(function (data) {
                    expect(data).to.contains(item.Question);
                });
                fsp.getTableCellData('brfss-table', i, 1).then(function (data) {
                    expect(data).to.contains(item.AmericanIndian);
                });
                fsp.getTableCellData('brfss-table', i, 2).then(function (data) {
                    expect(data).to.contains(item.Asian);
                    console.log("behaviour",(item.Asian));
                });
                fsp.getTableCellData('brfss-table', i, 3).then(function (data) {
                    expect(data).to.contains(item.Black);
                });
                fsp.getTableCellData('brfss-table', i, 4).then(function (data) {
                    expect(data).to.contains(item.Hispanic);
                });
                fsp.getTableCellData('brfss-table', i, 5).then(function (data) {
                        expect(data).to.contains(item.Multiracial);
                    });
                fsp.getTableCellData('brfss-table', i, 6).then(function (data) {
                    expect(data).to.contains(item.NativeHawaiian);
                });
                fsp.getTableCellData('brfss-table', i, 7).then(function (data) {
                    expect(data).to.contains(item.OthernonHispanic);
                });
            });
        });

        next();
    });

   //Teen health- dataset

    this.Then(/^For <state> and type "([^"]*)" the generated teen health data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('yrbs-table').then(function (headers) {
                expect(headers[0]).to.contains('Question');
                expect(headers[1]).to.contains('American Indian or Alaska Native');
                expect(headers[2]).to.contains('Asian');
                expect(headers[3]).to.contains('Black or African American');
                expect(headers[4]).to.contains('Hispanic or Latino');
                expect(headers[5]).to.contains('Multiple Race');
                expect(headers[6]).to.contains('Native Hawaiian or Other Pacific Islander');
            });
            var teen_dataset = fsp.loadCsvFile(csvFile);
            var teenData = teen_dataset
                .filter(function (th) {
                    return th.state === state
                });

            teenData.forEach(function (item, i) {
                fsp.getTableCellData('yrbs-table', i, 0).then(function (data) {
                    expect(data).to.contains(item.Question);
                });
                fsp.getTableCellData('yrbs-table', i, 1).then(function (data) {
                    expect(data).to.contains(item.AmericanIndian);
                });
                fsp.getTableCellData('yrbs-table', i, 2).then(function (data) {
                    expect(data).to.contains(item.Asian);
                });
                fsp.getTableCellData('yrbs-table', i, 3).then(function (data) {
                    expect(data).to.contains(item.Black);
                });
                fsp.getTableCellData('yrbs-table', i, 4).then(function (data) {
                    expect(data).to.contains(item.Hispanic);
                });
                fsp.getTableCellData('yrbs-table', i, 5).then(function (data) {
                    expect(data).to.contains(item.MultipleRace);
                });
                fsp.getTableCellData('yrbs-table', i, 6).then(function (data) {
                    expect(data).to.contains(item.NativeHawaiian);
                });

            });

        });
        next();

    });


    //Sexually Transmitted Infections

    this.Then(/^For <state> and type "([^"]*)" the generated STD data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('std-table').then(function (headers) {
                expect(headers[0]).to.contains('Disease');
                expect(headers[1]).to.contains('Measure');
                expect(headers[2]).to.contains('American Indian or Alaska Native');
                expect(headers[3]).to.contains('Asian');
                expect(headers[4]).to.contains('Black or African American');
                expect(headers[5]).to.contains('Hispanic or Latino');
                expect(headers[6]).to.contains('Multiple races');
                expect(headers[7]).to.contains('Native Hawaiian or Other Pacific Islander');
            });
            var std_dataset = fsp.loadCsvFile(csvFile);
            var stdStateData = std_dataset
                .filter(function (stdRow) {
                    return stdRow.state === state
                });

           var diseaseData = _.groupBy(stdStateData, function (o) {
               return o['Disease'];
                
            })
            Object.keys(diseaseData).forEach(function (disease, bodyIndex) {

                var casesAndRates= diseaseData[disease];
                casesAndRates.forEach(function (item,i) {
                    console.log('currrent kk', bodyIndex, i, item);

                    //case - measure - measure
                    fsp.getTableBodyCellData('std-table',bodyIndex,i,1-i).then(function (data) {
                        expect(data).to.contains(item['Measure']);

                    });

                    fsp.getTableBodyCellData('std-table',bodyIndex,i,2-i).then(function (data) {
                        expect(data).to.contains(item['AmericanIndian']);

                    });

                    fsp.getTableBodyCellData('std-table',bodyIndex,i,3-i).then(function (data) {
                        expect(data).to.contains(item['Asian']);

                    });
                    fsp.getTableBodyCellData('std-table',bodyIndex,i,4-i).then(function (data) {
                        expect(data).to.contains(item['Black']);

                    });
                    fsp.getTableBodyCellData('std-table',bodyIndex,i,5-i).then(function (data) {
                        expect(data).to.contains(item['Hispanic']);

                    });
                    fsp.getTableBodyCellData('std-table',bodyIndex,i,6-i).then(function (data) {
                        expect(data).to.contains(item['Multipleraces']);

                    });
                    fsp.getTableBodyCellData('std-table',bodyIndex,i,7-i).then(function (data) {
                        expect(data).to.contains(item['NativeHawaiian']);

                    });

                });
            });

        });
        next();
   });


    //Mortality - Dataset Fact sheet

    this.Then(/^For <state> and type "([^"]*)" the generated Mortality data as defined in "([^"]*)" file$/, function (factType, csvFile, table,next) {
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('detail-mortality-table').then(function (headers) {
                expect(headers[0]).to.contains('Cause of Death');
                expect(headers[1]).to.contains('Measure');
                expect(headers[2]).to.contains('American Indian or Alaska Native');
                expect(headers[3]).to.contains('Asian or Pacific Islander');
                expect(headers[4]).to.contains('Black or African American');
                expect(headers[5]).to.contains('Hispanic');
            });

            var mortalityDataset = fsp.loadCsvFile(csvFile);
            var mortalityStateData = mortalityDataset
                .filter(function (mortalityRow) {
                    return mortalityRow.state === state
                });

            var causeOfDeathData = _.groupBy(mortalityStateData, function (o) {
                return o['CauseofDeath'];
            })
            Object.keys(causeOfDeathData).forEach(function (causeOfDeath, bodyIndex) {

                var totalAndAgeRates = causeOfDeathData[causeOfDeath];
                totalAndAgeRates.forEach(function (item, i) {

                    fsp.getTableBodyCellData('detail-mortality-table', bodyIndex, i, 1-i).then(function (data) {
                        //console.log("currentitem",i,data);
                        expect(data).to.contains(item['Measure']);

                    });

                    fsp.getTableBodyCellData('detail-mortality-table',bodyIndex,i,2-i).then(function (data) {
                        expect(data).to.contains(item['AmericanIndian']);

                    });

                    fsp.getTableBodyCellData('detail-mortality-table',bodyIndex,i,3-i).then(function (data) {
                        expect(data).to.contains(item['AsianorPacific']);

                    });
                    fsp.getTableBodyCellData('detail-mortality-table',bodyIndex,i,4-i).then(function (data) {
                        expect(data).to.contains(item['BlackorAfrican']);

                    });
                    fsp.getTableBodyCellData('detail-mortality-table',bodyIndex,i,5-i).then(function (data) {
                        expect(data).to.contains(item['Hispanic']);

                    });
                });
            });

        });
        next();
    });

    //HIV-AIDS Data set
    this.Then(/^For <state> and type "([^"]*)" the generated HIV\-AIDS data as defined in "([^"]*)" file$/, function (factType, csvFile, table,next) {
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('hiv-table').then(function (headers) {
                expect(headers[0]).to.contains('Indicator');
                expect(headers[1]).to.contains('Measure');
                expect(headers[2]).to.contains('American Indian or Alaska Native');
                expect(headers[3]).to.contains('Asian');
                expect(headers[4]).to.contains('Black or African American');
                expect(headers[5]).to.contains('Hispanic or Latino');
                expect(headers[6]).to.contains('Multiple races');
                expect(headers[7]).to.contains('Native Hawaiian or Other Pacific Islander');
            });
            var hivDataset = fsp.loadCsvFile(csvFile);
            var hivStateData = hivDataset
                .filter(function (hivStateRow) {
                    return hivStateRow.state === state
                });

            var indicatorData = _.groupBy(hivStateData, function (o) {
                return o['Indicator'];
            })
            Object.keys(indicatorData).forEach(function (indicator, bodyIndex) {

                var casesAndRates = indicatorData[indicator];
                casesAndRates.forEach(function (item,i) {
                    //console.log('currrent kk', bodyIndex, i, item);

                    // measure
                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 1 - i).then(function (data) {
                        expect(data).to.contains(item['Measure']);

                    });

                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 2 - i).then(function (data) {
                        expect(data).to.contains(item['AmericanIndian']);

                    });

                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 3 - i).then(function (data) {
                        expect(data).to.contains(item['Asian']);

                    });
                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 4 - i).then(function (data) {
                        expect(data).to.contains(item['BlackorAfrican']);

                    });
                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 5 - i).then(function (data) {
                        expect(data).to.contains(item['Hispanic']);

                    });
                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 6 - i).then(function (data) {
                        expect(data).to.contains(item['Multipleraces']);

                    });

                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 7 - i).then(function (data) {
                        expect(data).to.contains(item['NativeHawaiian']);

                    });

                });
            });

        });
       next();
    });




};
module.exports = factsheetsDefinitionsWrapper;