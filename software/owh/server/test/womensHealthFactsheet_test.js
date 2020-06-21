var factSheet = require('../api/womensHealthFactsheet');
var expect = require("expect.js");

describe("Women's Health Fact sheet", function () {

    this.timeout(80000);

    it("prepare FactSheet for VA Women's and Girls' Health", function (done){
        new factSheet().prepareFactSheet('VA', "women_health").then(function (resp) {
            expect(resp.state).to.eql("VA");
            expect(resp.fsType).to.eql("women_health");
            expect(resp.race[0].name).to.eql('Black');
            expect(resp.race[0].bridge_race).to.eql("870522");
            expect(resp.race[1].name).to.eql('White');
            expect(resp.race[1].bridge_race).to.eql("2706062");
            expect(resp.race[2].name).to.eql('American Indian');
            expect(resp.race[2].bridge_race).to.eql("24204");
            expect(resp.race[3].name).to.eql('Asian or Pacific Islander');
            expect(resp.race[4].name).to.eql('Hispanic');
            //std
            expect(resp.stdData[3].disease).to.eql("Early Latent Syphilis");
            expect(resp.stdData[3].data.std).to.eql("96");
            //hiv
            expect(resp.hivAIDSData[3].disease).to.eql("HIV Diagnoses");
            expect(resp.hivAIDSData[3].data.aids).to.eql("167");

            //detail mortality
            expect(resp.detailMortalityData[0].causeOfDeath).to.eql("Diseases of heart");
            expect(resp.detailMortalityData[0].data.deaths).to.eql(6586);
            //cancer
            expect(resp.cancerData[0].site).to.eql("Breast");
            expect(resp.cancerData[0].mortality.cancer_mortality).to.eql(1110);
            expect(resp.cancerData[0].mortality.pop).to.eql(4275622);
            //yrbs
            expect(resp.yrbs[3].question).to.eql("Currently use marijuana");
            expect(resp.yrbs[3].data).to.eql("14.9");
            //brfss
            expect(resp.brfss[1].question).to.eql("Adults who are current smokers");
            expect(resp.brfss[1].data).to.eql("13.7");
            //prams
            expect(resp.prams[1].question).to.eql("Was your baby seen by a doctor  nurse or other health care provider in the first week after he or she left the hospital?");
            expect(resp.prams[1].data).to.eql("Not applicable");
            done();
        })
    });
});