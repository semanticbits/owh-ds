var factSheet = require('../api/factSheet');
var expect = require("expect.js");

describe("Fact sheet", function () {

    this.timeout(80000);

    it("prepare FactSheet for MD state health", function (done){
        new factSheet().prepareFactSheet('MD', 'State Health').then(function (resp) {
            expect(resp.totalGenderPop).to.eql(6004692);
            expect(resp.state).to.eql("MD");
            expect(resp.fsType).to.eql("State Health");
            //Bridge Race data
            expect(resp.gender[0].name).to.eql("Female");
            expect(resp.gender[0].bridge_race).to.eql(3093874);
            expect(resp.ageGroups[0].name).to.eql("10-14 years");
            expect(resp.ageGroups[0].bridge_race).to.eql(372893);
            //Infant
            expect(resp.infantMortalityData.infant_mortality).to.eql(478);
            //TB
            expect(resp.tuberculosis[0].displayValue).to.eql("221");
            //std
            expect(resp.stdData[3].disease).to.eql("Early Latent Syphilis");
            expect(resp.stdData[3].data[0].pop).to.eql(6006401);
            expect(resp.stdData[3].data[0].displayValue).to.eql("598");
            expect(resp.stdData[3].data[0].rate).to.eql("10.0");
            //hiv
            expect(resp.hivAIDSData[3].disease).to.eql("HIV Diagnoses");
            expect(resp.hivAIDSData[3].data[0].name).to.eql("All races/ethnicities");
            expect(resp.hivAIDSData[3].data[0].displayValue).to.eql("1,104");
            expect(resp.hivAIDSData[3].data[0].rate).to.eql("21.8");
            //detail mortality
            expect(resp.detailMortalityData[0].causeOfDeath).to.eql("Diseases of heart");
            expect(resp.detailMortalityData[0].data.deaths).to.eql(11390);
            //Natality
            expect(resp.natalityData.births).to.eql(73136);
            expect(resp.natalityData.population).to.eql(6016447);
            //cancer
            expect(resp.cancerData[0].site).to.eql("Breast");
            expect(resp.cancerData[0].count).to.eql(4869);
            expect(resp.cancerData[0].mortality_rate).to.eql(14);
            //yrbs
            expect(resp.yrbs[2].question).to.eql("Currently use marijuana");
            expect(resp.yrbs[2].data).to.eql("18.8%");
            //brfss
            expect(resp.brfss[1].question).to.eql("Do you have any kind of health care coverage?");
            expect(resp.brfss[1].data).to.eql("91.6%");
            //prams
            expect(resp.prams[0].question).to.eql("In the 12 months before your baby was born  you were in a physical fight");
            expect(resp.prams[0].data).to.eql("5.1%");
            done();
        })
    });
});