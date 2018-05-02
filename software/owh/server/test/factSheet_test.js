var factSheet = require('../api/factSheet');
var expect = require("expect.js");

describe("Fact sheet", function () {

    this.timeout(80000);

    it("prepare FactSheet for MD state health", function (done){
        new factSheet().prepareFactSheet('MD', 'State Health').then(function (resp) {
            expect(resp.totalGenderPop).to.eql(6006401);
            expect(resp.state).to.eql("MD");
            expect(resp.fsType).to.eql("State Health");
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

    it("prepare FactSheet for VA State Health", function (done){
        new factSheet().prepareFactSheet('VA', 'State Health').then(function (resp) {
            expect(resp.totalGenderPop).to.eql(8382993);
            expect(resp.state).to.eql("VA");
            expect(resp.fsType).to.eql("State Health");
            //Bridge Race data
            expect(resp.ageGroups[0].name).to.eql("10-14 years");
            expect(resp.ageGroups[0].bridge_race).to.eql(521486);
            //Infant
            expect(resp.infantMortalityData.infant_mortality).to.eql(584);
            //TB
            expect(resp.tuberculosis[5].displayValue).to.eql("0");
            //std
            expect(resp.stdData[3].disease).to.eql("Early Latent Syphilis");
            expect(resp.stdData[3].data[0].displayValue).to.eql("410 (4.9)");
            //hiv
            expect(resp.hivAIDSData[3].disease).to.eql("HIV Diagnoses");
            expect(resp.hivAIDSData[3].data[2].name).to.eql("Asian");
            expect(resp.hivAIDSData[3].data[2].displayValue).to.eql("25 (5.6)");
            //detail mortality
            expect(resp.detailMortalityData[0].causeOfDeath).to.eql("Total (all ages)");
            expect(resp.detailMortalityData[0].data.deaths).to.eql(65577);
            //Natality
            expect(resp.natalityData.births).to.eql(103303);
            expect(resp.natalityData.population).to.eql(8382993);
            //cancer
            expect(resp.cancerData[0].site).to.eql("Breast");
            expect(resp.cancerData[0].count).to.eql(6520);
            expect(resp.cancerData[0].mortality_rate).to.eql(13.9);
            //yrbs
            expect(resp.yrbs[2].question).to.eql("Currently use marijuana");
            expect(resp.yrbs[2].data).to.eql("16.2%");
            //brfss
            expect(resp.brfss[1].question).to.eql("Adults who are current smokers");
            expect(resp.brfss[1].data).to.eql("16.5%");
            //prams
            expect(resp.prams.pregnantWoment[0].question).to.eql("Smoking cigarettes during the last three months of pregnancy");
            expect(resp.prams.pregnantWoment[0].data).to.eql("Not applicable");
            expect(resp.prams.women[0].question).to.eql("With one or more previous live births who reported unintended pregnancy");
            expect(resp.prams.women[0].data).to.eql("Not applicable");
            done();
        })
    });
    it("prepare FactSheet for VA Women's and Girls' Health", function (done){
        new factSheet().prepareFactSheet('VA', "Women's and Girls' Health").then(function (resp) {
            expect(resp.state).to.eql("VA");
            expect(resp.fsType).to.eql("Women's and Girls' Health");
            //No Total
            expect(resp.race[0].name).to.eql('Black');
            expect(resp.race[1].name).to.eql('White');
            expect(resp.race[2].name).to.eql('American Indian');
            expect(resp.race[3].name).to.eql('Asian or Pacific Islander');
            expect(resp.race[4].name).to.eql('Hispanic');
            //Bridge Race data
            expect(resp.ageGroups[0].name).to.eql("10-14 years");
            expect(resp.ageGroups[0].bridge_race).to.eql(256061);
            //Infant
            expect(resp.infantMortalityData.infant_mortality).to.eql(260);
            //TB
            expect(resp.tuberculosis[5].displayValue).to.eql(0);
            //std
            expect(resp.stdData[3].disease).to.eql("Early Latent Syphilis");
            expect(resp.stdData[3].data[0].displayValue).to.eql("43 (1)");
            //hiv
            expect(resp.hivAIDSData[3].disease).to.eql("HIV Diagnoses");
            expect(resp.hivAIDSData[3].data[2].name).to.eql("Asian");
            expect(resp.hivAIDSData[3].data[2].displayValue).to.eql("4 (1.7)");

            //detail mortality
            expect(resp.detailMortalityData[0].causeOfDeath).to.eql("Total (all ages)");
            expect(resp.detailMortalityData[0].data.deaths).to.eql(32737);
            //Natality
            expect(resp.natalityData.births).to.eql(50378);
            expect(resp.natalityData.population).to.eql(4258228);
            //cancer
            expect(resp.cancerData[0].site).to.eql("Breast");
            expect(resp.cancerData[0].count).to.eql(6471);
            expect(resp.cancerData[0].mortality_rate).to.eql(27.1);
            //yrbs
            expect(resp.yrbs[2].question).to.eql("Currently use marijuana");
            expect(resp.yrbs[2].data).to.eql("14.9%");
            //brfss
            expect(resp.brfss[1].question).to.eql("Adults who are current smokers");
            expect(resp.brfss[1].data).to.eql("14.4%");
            //prams
            expect(resp.prams.pregnantWoment[0].question).to.eql("Smoking cigarettes during the last three months of pregnancy");
            expect(resp.prams.pregnantWoment[0].data).to.eql("Not applicable");
            expect(resp.prams.women[0].question).to.eql("With one or more previous live births who reported unintended pregnancy");
            expect(resp.prams.women[0].data).to.eql("Not applicable");
            done();
        })
    });
});