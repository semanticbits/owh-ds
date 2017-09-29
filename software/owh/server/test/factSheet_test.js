var factSheet = require('../api/factSheet');
var expect = require("expect.js");

describe("Fact sheet", function () {

    this.timeout(80000);

    it("prepare FactSheet", function (done){
        new factSheet().prepareFactSheet('MD', 'State Health').then(function (resp) {
            expect(resp.totalGenderPop).to.eql(6006401);
            expect(resp.state).to.eql("MD");
            //Bridge Race data
            expect(resp.gender[0].name).to.eql("Female");
            expect(resp.gender[0].bridge_race).to.eql(3095316);
            expect(resp.ageGroups[0].name).to.eql("10-14 years");
            expect(resp.ageGroups[0].bridge_race).to.eql(374419);
            //Infant
            expect(resp.infantMortalityData.infant_mortality).to.eql(480);
            //TB
            expect(resp.tuberculosis[5].displayValue).to.eql("2 (1.5)");
            //std
            expect(resp.stdData[3].disease).to.eql("Early Latent Syphilis");
            expect(resp.stdData[3].data[0].pop).to.eql(5976407);
            expect(resp.stdData[3].data[0].displayValue).to.eql("594 (9.9)");
            //hiv
            expect(resp.hivAIDSData[3].disease).to.eql("HIV Diagnoses");
            expect(resp.hivAIDSData[3].data[2].name).to.eql("Asian");
            expect(resp.hivAIDSData[3].data[2].displayValue).to.eql("18 (5.5)");
            //detail mortality
            expect(resp.detailMortalityData[0].causeOfDeath).to.eql("Total (all ages)");
            expect(resp.detailMortalityData[0].data.deaths).to.eql(47247);
            //Natality
            expect(resp.natalityData.births).to.eql(73616);
            expect(resp.natalityData.population).to.eql(6006401);
            //cancer
            expect(resp.cancerData[0].site).to.eql("Breast");
            expect(resp.cancerData[0].count).to.eql(4791);
            expect(resp.cancerData[0].mortality_rate).to.eql(14.6);
            //yrbs
            expect(resp.yrbs[2].question).to.eql("Currently use marijuana");
            expect(resp.yrbs[2].data).to.eql("18.8%");
            //brfss
            expect(resp.brfss[1].question).to.eql("Adults who are current smokers");
            expect(resp.brfss[1].data).to.eql("15.1%");
            //prams
            expect(resp.prams.pregnantWoment[0].question).to.eql("Smoking cigarettes during the last three months of pregnancy");
            expect(resp.prams.pregnantWoment[0].data).to.eql("7.0%");
            expect(resp.prams.women[0].question).to.eql("With one or more previous live births who reported unintended pregnancy");
            expect(resp.prams.women[0].data).to.eql("46.7%");
            done();
        })
    });
});