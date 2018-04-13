var csvjson = require('csvjson');
var fs = require('fs');
var path = require('path');

var FactsheetsPage = function() {
    var fsp = this;

    fsp.pageHeading = element(by.id('pageHeading'));
    fsp.getFactSheetLink = element(by.css('a[href*="factsheets"]'));
    fsp.pageDescription = element(by.id('pageDescription'));
    fsp.stateSelectBox = element(by.id('state'));
    //fsp.generateFactSheetLink = element(by.id('generateFactSheetLink'));
    fsp.generateFactSheetLink =  element(by.css('[ng-click="fsc.getFactSheet(fsc.state, fsc.fsType);"]'));
    fsp.downloadFactSheetLink = element(by.id('downloadFactSheetLink'));

// Select Fact sheet types
    fsp.selectFactSheetType = function (typeName) {
        element(by.id("type")).click();
        return element(by.cssContainingText('option', typeName)).click();
    };
    //Click on Generate fact sheet
   // fsp.generateFactSheetLink = function () {
       //element(by.css('[ng-click="fsc.getFactSheet(fsc.state, fsc.fsType);"]')).click();

      // return element(by.css('option', state,type));
 //};

    fsp.getTableHeaders = function(tableClassName) {
        return element(by.className(tableClassName)).element(by.tagName('thead')).all(by.tagName('th')).getText();
    };
    fsp.getTableCellData = function(tableClassName, row, column) {
        return element(by.className(tableClassName)).element(by.tagName('tbody')).all(by.tagName('tr')).get(row).all(by.tagName('td')).get(column).getText();
    };
    fsp.getTableRowData = function(tableClassName, row) {
        return element(by.className(tableClassName)).all(by.tagName('tr')).get(row).all(by.tagName('td')).getText();
    };

    fsp.loadCsvFile = function (fileName) {
        var data = fs.readFileSync(path.join(__dirname, './factsheet_dataset/' + fileName), { encoding : 'utf8'});
        return csvjson.toObject(data, {quote:'"'});
    }



};
module.exports = new FactsheetsPage;
