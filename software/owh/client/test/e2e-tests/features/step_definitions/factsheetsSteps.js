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
    //Maryland - Minority fact sheet
    this.Then(/^generated data should be displayed on same factsheets page$/, function (next) {
        //browser.wait()
        expect(element(by.className('state-heading')).isDisplayed()).to.eventually.equal(true);
        expect(element(by.className('state-heading')).getText()).to.eventually.equal("Maryland - Minority Health");
        expect(element(by.tagName('h3')).getText()).to.eventually.equal("Maryland - Minority Health");
        expect(element(by.className('bridge-race-heading')).getText()).to.eventually.equal("Population in Maryland");
        fsp.getTableHeaders('bridge-race-table1').then(function (headers) {
            expect(headers[0]).to.contains('Racial distributions of minority residents*');
            expect(headers[1]).to.contains('American Indian or Alaska Native');
            expect(headers[2]).to.contains('Asian or Pacific Islander');
            expect(headers[3]).to.contains('Black or African American');
            expect(headers[4]).to.contains('Hispanic');

        });
        fsp.getTableCellData('bridge-race-table1', 0, 1).then(function (data) {
            expect(data).to.contains('17,938');
        });

        fsp.getTableCellData('bridge-race-table1', 0, 2).then(function (data) {
            expect(data).to.contains('411,071');
        });
        fsp.getTableCellData('bridge-race-table1', 0, 3).then(function (data) {
            expect(data).to.contains('1,820,087');
        });
        fsp.getTableCellData('bridge-race-table1', 0, 4).then(function (data) {
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
            expect(headers[2]).to.contains('Other, Non- Hispanic');
            expect(headers[3]).to.contains('Hispanic');
        });

        fsp.getTableCellData('prams-table-1', 0, 0).then(function (data) {
            expect(data).to.contains('Smoking cigarettes during the last three months of pregnancy');
        });

        fsp.getTableHeaders('brfss-table').then(function (headers) {
            expect(headers[0]).to.contains('Question');
            expect(headers[1]).to.contains('American Indian or Alaskan Native, non-Hispanic');
            expect(headers[2]).to.contains('Asian, non-Hispanic');
            expect(headers[3]).to.contains('Black, non-Hispanic');
            expect(headers[4]).to.contains('Native Hawaiian or other Pacific Islander, non-Hispanic');
            expect(headers[5]).to.contains('Multiracial non-Hispanic');
            expect(headers[6]).to.contains('Other, non-Hispanic');
            expect(headers[7]).to.contains('Hispanic');
        });

        fsp.getTableCellData('brfss-table', 0, 0).then(function (data) {
            expect(data).to.contains('Obese (Body Mass Index 30.0 - 99.8)');
        });
        fsp.getTableHeaders('yrbs-table').then(function (headers) {
            expect(headers[0]).to.contains('Question');
            expect(headers[1]).to.contains('American Indian or Alaska Native');
            expect(headers[2]).to.contains('Asian');
            expect(headers[3]).to.contains('Black or African American');
            expect(headers[4]).to.contains('Native Hawaiian or Other Pacific Islander');
            expect(headers[5]).to.contains('Multiple Race');
            expect(headers[6]).to.contains('Hispanic or Latino');

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
            expect(headers[4]).to.contains('Native Hawaiian or Other Pacific Islander');
            expect(headers[5]).to.contains('Multiple races');
            expect(headers[6]).to.contains('Hispanic or Latino');

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
            expect(headers[5]).to.contains('Native Hawaiian or Other Pacific Islander');
            expect(headers[6]).to.contains('Multiple races');
            expect(headers[7]).to.contains('Hispanic or Latino');

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
            expect(headers[5]).to.contains('Native Hawaiian or Other Pacific Islander');
            expect(headers[6]).to.contains('Multiple races');
            expect(headers[7]).to.contains('Hispanic or Latino');

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
            expect(data).to.contains('17,865');
        }).then(next);

    });

    this.When(/^I select state "([^"]*)" from state selectbox$/, function (arg1, next) {
        element(by.id('state')).element(by.cssContainingText('option', arg1)).click()
            .then(next);
    });



    this.When(/^I select fact sheet type "([^"]*)"$/, function (factsheetType) {
        return fsp.selectFactSheetType(factsheetType);
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

//Population racial distribution- Minority Health
    this.Then(/^For <state> and type "([^"]*)" the generated population racial distributions data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
        table.rows().forEach(function (row) {

            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('bridge-race-table1').then(function (headers) {
                expect(headers[0]).to.contains('Racial distributions of minority residents*');
                expect(headers[1]).to.contains('American Indian or Alaska Native');
                expect(headers[2]).to.contains('Asian or Pacific Islander');
                expect(headers[3]).to.contains('Black or African American');
                expect(headers[4]).to.contains('Hispanic');
            });

            var populations = fsp.loadCsvFile(csvFile);
            var p = populations
                .find(function (p) {
                    return p.state === state
                });
            fsp.getTableCellData('bridge-race-table1', 0,0).then(function (data) {
                expect(data).to.contains(p['Racialdistributions']);
            });
            fsp.getTableCellData('bridge-race-table1', 0,1).then(function (data) {
                expect(data).to.contains(p['American Indian or Alaska Native']);
            });
            fsp.getTableCellData('bridge-race-table1', 0, 2).then(function (data) {
                expect(data).to.contains(p['Asian or Pacific Islander']);
            });
            fsp.getTableCellData('bridge-race-table1', 0, 3).then(function (data) {
                expect(data).to.contains(p['Black or African American']);
            });
            fsp.getTableCellData('bridge-race-table1', 0, 4).then(function (data) {
                expect(data).to.contains(p['Hispanic']);
            });
            //console.log('state =', state)
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
                expect(headers[4]).to.contains('Native Hawaiian or Other Pacific Islander');
                expect(headers[5]).to.contains('Multiple races');
                expect(headers[6]).to.contains('Hispanic or Latino');
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
                    expect(data).to.contains(item['Native Hawaiian or Other Pacific Islander']);
                });
                fsp.getTableCellData('tb-factsheet', i, 5).then(function (data) {
                    expect(data).to.contains(item['Multiple races']);
                });
                fsp.getTableCellData('tb-factsheet', i, 6).then(function (data) {
                    expect(data).to.contains(item['Hispanic or Latino']);
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

    //Behavioral Risk -Minority data set
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
                expect(headers[4]).to.contains('Native Hawaiian or other Pacific Islander, non-Hispanic');
                expect(headers[5]).to.contains('Multiracial non-Hispanic');
                expect(headers[6]).to.contains('Other, non-Hispanic');
                expect(headers[7]).to.contains('Hispanic');
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

   //Teen health dataset- Minority -Health
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
                expect(headers[4]).to.contains('Native Hawaiian or Other Pacific Islander');
                expect(headers[5]).to.contains('Multiple Race');
                expect(headers[6]).to.contains('Hispanic or Latino');
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
                    expect(data).to.contains(item.NativeHawaiian);
                });
                fsp.getTableCellData('yrbs-table', i, 5).then(function (data) {
                    expect(data).to.contains(item.MultipleRace);
                });
                fsp.getTableCellData('yrbs-table', i, 6).then(function (data) {
                    expect(data).to.contains(item.Hispanic);

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
                expect(headers[5]).to.contains('Native Hawaiian or Other Pacific Islander');
                expect(headers[6]).to.contains('Multiple races');
                expect(headers[7]).to.contains('Hispanic or Latino');
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
                    //console.log('currrent kk', bodyIndex, i, item);

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
                        expect(data).to.contains(item['NativeHawaiian']);
                    });

                    fsp.getTableBodyCellData('std-table',bodyIndex,i,6-i).then(function (data) {
                        expect(data).to.contains(item['Multipleraces']);
                    });
                    fsp.getTableBodyCellData('std-table',bodyIndex,i,7-i).then(function (data) {
                        expect(data).to.contains(item['Hispanic']);

                    });

                });
            });

        });
        next();
   });


    //Mortality - Minority-Health Dataset Fact sheet

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
                expect(headers[5]).to.contains('Native Hawaiian or Other Pacific Islander');
                expect(headers[6]).to.contains('Multiple races');
                expect(headers[7]).to.contains('Hispanic or Latino');
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
                        expect(data).to.contains(item['American Indian or Alaska Native']);

                    });

                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 3 - i).then(function (data) {
                        expect(data).to.contains(item['Asian']);

                    });
                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 4 - i).then(function (data) {
                        expect(data).to.contains(item['Black or African American']);

                    });
                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 5 - i).then(function (data) {
                        expect(data).to.contains(item['Native Hawaiian or Other Pacific Islander']);

                    });
                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 6 - i).then(function (data) {
                        expect(data).to.contains(item['Multiple races']);

                    });

                    fsp.getTableBodyCellData('hiv-table', bodyIndex, i, 7 - i).then(function (data) {
                        expect(data).to.contains(item['Hispanic or Latino']);

                    });

                });
            });

        });
       next();
    });

    // Cancer Statistics data set
    this.Then(/^For <state> and type "([^"]*)" the generated Cancer Statistics data as defined in "([^"]*)" file$/, function (factType, csvFile, table,next) {
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();

            fsp.getTableHeaders('cancer-table').then(function (headers) {
                expect(headers[0]).to.contains('Cancer Site');
                expect(headers[1]).to.contains('Measure');
                expect(headers[2]).to.contains('American Indian or Alaska Native');
                expect(headers[3]).to.contains('Asian or Pacific Islander');
                expect(headers[4]).to.contains('Black');
                expect(headers[5]).to.contains('Hispanic');
            });

        var cancerDataset = fsp.loadCsvFile(csvFile);
        var cancerStateData = cancerDataset
            .filter(function (cancerStateRow) {
                return cancerStateRow.state === state
            });


        var cancerSiteData = _.groupBy(cancerStateData, function (o) {
            return o['Cancer Site'];
        });

        Object.keys(cancerSiteData).forEach(function (cancerSite, bodyIndex) {

            var cancerSiteRows = cancerSiteData[cancerSite];

            cancerSiteRows.forEach(function (item, i) {
               //console.log('currrent kk',  i, item);

                var correctionFactor = i %5 ==  0 ? 0 : 1;

                fsp.getTableBodyCellData('cancer-table', bodyIndex, i, 1 - correctionFactor).then(function (data) {
                    expect(data).to.contains(item['Measure']);

                });

                fsp.getTableBodyCellData('cancer-table', bodyIndex, i, 2 - correctionFactor).then(function (data) {
                     expect(data).to.contains(item['American Indian or Alaska Native']);

                });
                 fsp.getTableBodyCellData('cancer-table', bodyIndex, i, 3 - correctionFactor).then(function (data) {
                     expect(data).to.contains(item['Asian or Pacific Islander']);

                 });
                 fsp.getTableBodyCellData('cancer-table', bodyIndex, i, 4 - correctionFactor).then(function (data) {
                     expect(data).to.contains(item['Black']);

                 });
                 fsp.getTableBodyCellData('cancer-table', bodyIndex, i, 5 - correctionFactor).then(function (data) {
                     expect(data).to.contains(item['Hispanic']);

                 });

            });

            });
            });

        next();
    });

    //Prenatal Care and Pregnancy Risk - Minority Health
    this.Then(/^For <state> and type "([^"]*)" the generated Pregenent Women data as defined in "([^"]*)" file$/, function (factType, csvFile, table,next) {

        table.rows().forEach(function (row) {

            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('prams-table-1').then(function (headers) {
                expect(headers[0]).to.contains('Question');
                expect(headers[1]).to.contains('Black, Non-Hispanic');
                expect(headers[2]).to.contains('Other, Non- Hispanic');
                expect(headers[3]).to.contains('Hispanic');
            });
            var pramsDataSet = fsp.loadCsvFile(csvFile);
            var pramsData = pramsDataSet
                .filter(function (p) {
                    return p.state === state
                });
                pramsData.forEach(function (item, i) {
                fsp.getTableCellData('prams-table-1', i, 0).then(function (data) {
                   expect(data).to.contains(item['Question']);
                });

                fsp.getTableCellData('prams-table-1', i, 1).then(function (data) {
                   expect(data).to.contains(item['Black, Non-Hispanic']);
                });
                fsp.getTableCellData('prams-table-1', i, 2).then(function (data) {
                    expect(data).to.contains(item['Other, Non- Hispanic']);
                });
                fsp.getTableCellData('prams-table-1', i,3).then(function (data) {
                    expect(data).to.contains(item['Hispanic']);
                });
            });
        });

        next();
    });
//Womens and Girls health fact sheet
    this.Then(/^For  select <state> and select type is "([^"]*)" then generated population data as defined in "([^"]*)" file$/, function (factType, csvFile, table,next) {
        // Write code here that turns the phrase above into concrete actions
        table.rows().forEach(function (row) {

            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('bridge-race-table1').then(function (headers) {
                expect(headers[0]).to.contains('Racial distributions of female residents');
                expect(headers[1]).to.contains('Black, non-Hispanic');
                expect(headers[2]).to.contains('White, non-Hispanic');
                expect(headers[3]).to.contains('American Indian');
                expect(headers[4]).to.contains('Asian or Pacific Islander');
                expect(headers[5]).to.contains('Hispanic');
            });
            var populationDataset = fsp.loadCsvFile(csvFile);
            var p = populationDataset
                .find(function (p) {
                    return p.state === state
                });
            fsp.getTableCellData('bridge-race-table1', 0,0).then(function (data) {
                expect(data).to.contains(p['Racial distributions of female residents']);
            });
            fsp.getTableCellData('bridge-race-table1', 0, 1).then(function (data) {
                expect(data).to.contains(p['Black']);
            });
            fsp.getTableCellData('bridge-race-table1', 0,2).then(function (data) {
                expect(data).to.contains(p['White']);
            });
            fsp.getTableCellData('bridge-race-table1', 0, 3).then(function (data) {
                expect(data).to.contains(p['American Indian']);
            });
            fsp.getTableCellData('bridge-race-table1', 0, 4).then(function (data) {
                expect(data).to.contains(p['Asian or Pacific Islander']);
            });
            fsp.getTableCellData('bridge-race-table1', 0,5).then(function (data) {
                expect(data).to.contains(p['Hispanic']);
            });

        });

        next();
    });

    //Mortality - Womens Health

    this.Then(/^For  select <state> and select type is "([^"]*)" then generated Mortality data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
        table.rows().forEach(function (row) {

            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();

            fsp.getTableHeaders('detail-mortality-table').then(function (headers) {
                expect(headers[0]).to.contains('Cause of Death');
                expect(headers[1]).to.contains('Age-Adjusted Death Rates (per 100,000 women)');
            });

            var mortalityDataset = fsp.loadCsvFile(csvFile);
            var p = mortalityDataset
                .find(function (p) {
                    return p.state === state
                });
            fsp.getTableCellData('detail-mortality-table', 0, 0).then(function (data) {
                expect(data).to.contains(p['Cause of Death']);
            });
            fsp.getTableCellData('detail-mortality-table', 0, 1).then(function (data) {
                expect(data).to.contains(p['Age-Adjusted Death Rates (per 100,000 women)']);
            });

        });

        next();
    });

    //Prenatal Care and Pregnancy Risk
    this.Then(/^For  select <state> and select type is "([^"]*)" then generated PRAMS data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
            table.rows().forEach(function(row){
                var state = row[0];
                element(by.id('state')).element(by.cssContainingText('option', state)).click();
                fsp.selectFactSheetType(factType);
                fsp.generateFactSheetLink.click();
                fsp.getTableHeaders('prams-table-1').then(function (headers) {
                    expect(headers[0]).to.contains('Survey Question');
                    expect(headers[1]).to.contains('Percentage (Women)');
                });


                var pramsDataSet = fsp.loadCsvFile(csvFile);
                var pramsData = pramsDataSet
                    .filter(function (p) {
                        return p.state === state
                    });
                pramsData.forEach(function (item, i) {
                    fsp.getTableCellData('prams-table-1', i, 0).then(function (data) {
                        expect(data).to.contains(item['Survey Question']);
                    });
                    fsp.getTableCellData('prams-table-1', i, 1).then(function (data) {
                        expect(data).to.contains(item['Percentage (Women)']);
                    });
                });

        });

        next();
    });

    //Behavioral Risk Factors - Womens and Girls Health
    this.Then(/^For  select <state> and select type is "([^"]*)" then generated Behavioral Risk Factors data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {

        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('brfss-table').then(function (headers) {
                expect(headers[0]).to.contains('Survey Question');
                expect(headers[1]).to.contains('Percentage (Women)');
            });
            var behavioral_risk_dataset = fsp.loadCsvFile(csvFile);
            var brfssData = behavioral_risk_dataset
                .filter(function (br) {
                    return br.state === state
                });

            brfssData.forEach(function (item, i) {
                fsp.getTableCellData('brfss-table', i, 0).then(function (data) {
                    expect(data).to.contains(item['Survey Question']);
                });
                fsp.getTableCellData('brfss-table', i, 1).then(function (data) {
                    expect(data).to.contains(item['Percentage (Women)']);
                });
            });
        });

                next();
        });

//Teen Health - Womens Health
    this.Then(/^For  select <state> and select type is "([^"]*)" then generated Teen Health fact sheet data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {

        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('yrbs-table').then(function (headers) {
                expect(headers[0]).to.contains('Survey Question');
                expect(headers[1]).to.contains('Percentage (Girls)');

            });
            var teen_dataset = fsp.loadCsvFile(csvFile);
            var teenData = teen_dataset
                .filter(function (th) {
                    return th.state === state
                });
            teenData.forEach(function (item, i) {
                fsp.getTableCellData('yrbs-table', i, 0).then(function (data) {
                    expect(data).to.contains(item['Survey Question']);
                });
                fsp.getTableCellData('yrbs-table', i, 1).then(function (data) {
                    expect(data).to.contains(item['Percentage (Girls)']);
                });

            });
        });

        next();
    });

    //Sexually Transmitted Infections- Womens and Girls Health

    this.Then(/^For  select <state> and select type is "([^"]*)" then generated STD fact sheet data as defined in "([^"]*)" file$/, function (factType, csvFile, table, next) {
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('std-table').then(function (headers) {
                expect(headers[0]).to.contains('Disease');
                expect(headers[1]).to.contains('Total Rates (per 100,000 women)');
            });
            var std_dataset = fsp.loadCsvFile(csvFile);
            var stdData = std_dataset
                .filter(function (std) {
                    return std.state === state
                });
            stdData.forEach(function (item, i) {
                fsp.getTableCellData('std-table', i, 0).then(function (data) {
                    expect(data).to.contains(item['Disease']);
                });
                fsp.getTableCellData('std-table', i, 1).then(function (data) {
                    expect(data).to.contains(item['Total Rates (per 100,000 women)']);
                });
            });
        });

       next();
    });

// HIV/AIDS Data set - Women's and Girl's  Health fact sheet
    this.Then(/^For  select <state> and select type is "([^"]*)" then generated HIV\/AIDS fact sheet data as defined in "([^"]*)" file$/, function (factType,csvFile,table,next) {
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('hiv-table').then(function (headers) {
                expect(headers[0]).to.contains('Indicator');
                expect(headers[1]).to.contains('Total Rates (per 100,000 women)');
            });
            var hiv_dataset = fsp.loadCsvFile(csvFile);
            var hivData = hiv_dataset
                .filter(function (hiv) {
                    return hiv.state === state
                });
            hivData.forEach(function (item, i) {
                fsp.getTableCellData('hiv-table', i, 0).then(function (data) {
                    expect(data).to.contains(item['Indicator']);
                });
                fsp.getTableCellData('hiv-table', i, 1).then(function (data) {
                    expect(data).to.contains(item['Total Rates (per 100,000 women)']);
                });
            });
        });
        next();
    });
    //Cancer Statistics - Women's and Girl's  Health fact sheet
    this.Then(/^For  select <state> and select type is "([^"]*)" then generated Cancer Statistics fact sheet data as defined in "([^"]*)" file$/, function (factType,csvFile,table,next) {
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();

            fsp.getTableHeaders('cancer-table').then(function (headers) {
                expect(headers[0]).to.contains('Cancer Site');
                expect(headers[1]).to.contains('Incidence Crude Rates (per 100,000 women)');
                expect(headers[2]).to.contains('Mortality Crude Rates (per 100,000 women)');
            });
            var cancer_dataset = fsp.loadCsvFile(csvFile);
            var cancerData = cancer_dataset
                .filter(function (cancer) {
                    return cancer.state === state
                });
            cancerData.forEach(function (item, i) {
                fsp.getTableCellData('cancer-table', i, 0).then(function (data) {
                    expect(data).to.contains(item['Cancer Site']);
                });
                fsp.getTableCellData('cancer-table', i, 1).then(function (data) {
                    expect(data).to.contains(item['Incidence Crude Rates (per 100,000 women)']);
                });
                fsp.getTableCellData('cancer-table', i, 2).then(function (data) {
                    expect(data).to.contains(item['Mortality Crude Rates (per 100,000 women)']);
                });
            });

        });

        next();
    });

    // pdf download - Women's and Girl's  Health fact sheet
    this.Then(/^For select <state> and select type is "([^"]*)" then generated fact sheet data as defined in "([^"]*)"$/, function (factType,csvFile,table,next) {
        table.rows().forEach(function (row) {
            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.downloadFactSheetLink.click();
            //browser.sleep(1000);

    });
        next();
    });

    // Racial Distribution of Residents - State -Health
    this.Then(/^For select <state> and type "([^"]*)" the generated population racial distributions data as defined in "([^"]*)" file$/, function (factType,csvFile,table,next) {

        table.rows().forEach(function (row) {

            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('bridge-race-table1').then(function (headers) {
                expect(headers[0]).to.contains('Racial Distributions of Residents*');
                expect(headers[1]).to.contains('Total');
                expect(headers[2]).to.contains('Black, non-Hispanic');
                expect(headers[3]).to.contains('White, non-Hispanic');
                expect(headers[4]).to.contains('American Indian or Alaska Native');
                expect(headers[5]).to.contains('Asian or Pacific Islander');
                expect(headers[6]).to.contains('Hispanic');
            });

            var populations = fsp.loadCsvFile(csvFile);
            var p = populations
                .find(function (p) {
                    return p.state === state
                });
            fsp.getTableCellData('bridge-race-table1', 0,0).then(function (data) {
                expect(data).to.contains(p['Racial Distributions of Residents*']);
            });
            fsp.getTableCellData('bridge-race-table1', 0,1).then(function (data) {
                expect(data).to.contains(p['Total']);
            });
            fsp.getTableCellData('bridge-race-table1', 0, 2).then(function (data) {
                expect(data).to.contains(p['Black, non-Hispanic']);
            });
            fsp.getTableCellData('bridge-race-table1', 0, 3).then(function (data) {
                expect(data).to.contains(p['White, non-Hispanic']);
            });
            fsp.getTableCellData('bridge-race-table1', 0, 4).then(function (data) {
                expect(data).to.contains(p['American Indian or Alaska Native']);
            });

            fsp.getTableCellData('bridge-race-table1', 0, 5).then(function (data) {
                expect(data).to.contains(p['Asian or Pacific Islander']);
            });

            fsp.getTableCellData('bridge-race-table1', 0, 6).then(function (data) {
                expect(data).to.contains(p['Hispanic']);
            });
            //console.log('state =', state)
        });
        next();
    });

//Age Distribution of Residents
    this.Then(/^For select <state> and type "([^"]*)" the generated Age Distribution  data as defined in "([^"]*)" file$/, function (factType,csvFile,table,next) {
        table.rows().forEach(function (row) {

            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();
            fsp.getTableHeaders('bridge-race-table2').then(function (headers) {
                expect(headers[0]).to.contains('Age Distributions of Residents');
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
            fsp.getTableCellData('bridge-race-table2', 0,0).then(function (data) {
                expect(data).to.contains(p['Age Distributions of Residents']);
            });
            fsp.getTableCellData('bridge-race-table2', 0,1).then(function (data) {
                expect(data).to.contains(p['10-14']);
            });
            fsp.getTableCellData('bridge-race-table2', 0, 2).then(function (data) {
                expect(data).to.contains(p['15-19']);
            });
            fsp.getTableCellData('bridge-race-table2', 0, 3).then(function (data) {
                expect(data).to.contains(p['20-44']);
            });
            fsp.getTableCellData('bridge-race-table2', 0, 4).then(function (data) {
                expect(data).to.contains(p['45-64']);
            });

            fsp.getTableCellData('bridge-race-table2', 0, 5).then(function (data) {
                expect(data).to.contains(p['65-84']);
            });

            fsp.getTableCellData('bridge-race-table2', 0, 6).then(function (data) {
                expect(data).to.contains(p['85+']);
            });
            //console.log('state =', state)

        });

        next();
    });

// Mortality state Health  fact sheet
    this.Then(/^For select <state> and type "([^"]*)" the generated Mortality fact sheet data as defined in "([^"]*)" file$/, function (factType,csvFile,table,next) {
        table.rows().forEach(function (row) {

            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();

            fsp.getTableHeaders('detail-mortality-table').then(function (headers) {
                expect(headers[0]).to.contains('Cause of Death');
                expect(headers[1]).to.contains('Number of Deaths');
                expect(headers[2]).to.contains('Age-Adjusted Death Rate (per 100,000)');
            });

            var mortalityDataset = fsp.loadCsvFile(csvFile);
            var p = mortalityDataset
                .find(function (p) {
                    return p.state === state
                });
            fsp.getTableCellData('detail-mortality-table', 0, 0).then(function (data) {
                expect(data).to.contains(p['Cause of Death']);
            });
            fsp.getTableCellData('detail-mortality-table', 0, 1).then(function (data) {
                expect(data).to.contains(p['Number of Deaths']);
            });
            fsp.getTableCellData('detail-mortality-table', 0, 2).then(function (data) {
                expect(data).to.contains(p['Age-Adjusted Death Rate (per 100,000)']);
            });

        });

       next();
    });

    //Infant Mortality - State Health fact sheet

    this.Then(/^For select <state> and type "([^"]*)" the generated Infant Mortality fact sheet data as defined in "([^"]*)" file$/, function (factType,csvFile,table,next) {
        table.rows().forEach(function (row) {

            var state = row[0];
            element(by.id('state')).element(by.cssContainingText('option', state)).click();
            fsp.selectFactSheetType(factType);
            fsp.generateFactSheetLink.click();

            fsp.getTableHeaders('infant-mortality-table').then(function (headers) {
                expect(headers[0]).to.contains('Deaths');
                expect(headers[1]).to.contains('Births');
                expect(headers[2]).to.contains('Death rates')
            });

            var mortalityDataset = fsp.loadCsvFile(csvFile);
            var p = mortalityDataset
                .find(function (p) {
                    return p.State === state
                });
            fsp.getTableCellData('infant-mortality-table', 0,0).then(function (data) {
                expect(data).to.contains(p.Deaths);
            });
            fsp.getTableCellData('infant-mortality-table', 0, 1).then(function (data) {
                expect(data).to.contains(p['Births']);
            });
            fsp.getTableCellData('infant-mortality-table', 0, 2).then(function (data) {
                expect(data).to.contains(p['Death rates']);
            });

        });
        next();
    });

};
module.exports = factsheetsDefinitionsWrapper;