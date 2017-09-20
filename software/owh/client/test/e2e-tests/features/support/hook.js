var Cucumber = require('cucumber');
const fs = require('fs');
hooks = function () {
    var outputDir = 'cucumber-test-reports';
    this.After(function(scenario, callback) {
        if (scenario.isFailed()) {
            browser.takeScreenshot().then(function (buffer) {
                scenario.attach(new Buffer(buffer, 'base64'), 'image/png');
                callback();
            }, function(err) {
                callback(err);
            });
        } else {
            callback();
        }
    });

    var createHtmlReport = function(sourceJson) {
        var reporter = require('cucumber-html-reporter');

        var options = {
            theme: 'bootstrap',
            jsonFile: 'cucumber-test-reports/cucumber-test-report.json',
            output: outputDir + '/cucumber_report.html',
            reportSuiteAsScenarios: true,
            name: "Health Information Gateway",
            storeScreenShots: true,
            metadata: {
                "Test Environment": "Develop",
                "Browser": "Firefox 45.9.0",
                "Platform": "Linux"
            }
        };
        reporter.generate(options);
    };

    var JsonFormatter = Cucumber.Listener.JsonFormatter();
    JsonFormatter.log = function(string) {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        var targetJson = outputDir + '/cucumber-test-report.json';
        fs.writeFile(targetJson, string, function(err) {
            if (err) {
                console.log('Failed to save cucumber test results to json file.');
                console.log(err);
            } else {
                createHtmlReport(targetJson);
            }
        });
    };

    this.registerListener(JsonFormatter);
};

module.exports = hooks;