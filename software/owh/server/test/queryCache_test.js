var qc = require('../api/queryCache');
var expect = require("expect.js");

describe("Query Cache", function () {

    var queryCache;
    beforeEach(function () {
        queryCache = new qc();
    });

    it("cache query", function () {
        return queryCache.cacheQuery('1f7a679a3f9d7c425b36503d59d56b23123', 'mortality',
            {
                'queryJSON': ['query string'],
                'resultData': ['result string'],
                'sideFilterResults': ['side filter results']
            });
    });

    it("get cached query", function () {
        return queryCache.getCachedQuery('1f7a679a3f9d7c425b36503d59d56b23123').then(function (resp) {
            var result = resp._source;
            expect(result.queryID).to.eql('1f7a679a3f9d7c425b36503d59d56b23123');
            expect(result.dataset).to.eql('mortality');
            expect(JSON.parse(result.queryJSON)).to.eql(['query string']);
            expect(JSON.parse(result.resultJSON)).to.eql(['result string']);
            expect(JSON.parse(result.sideFilterResults)).to.eql(['side filter results']);
        });
    });


    it("cache large query", function (done) {
        queryCache.cacheQuery('1f7a679a3f9d7c425b36503d59d56b23-large', 'mortality',
            {
                "queryJSON": {"key":"deaths","allFilters":[{"key":"agegroup","title":"label.filter.agegroup","queryKey":"age_5_interval","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.demographics","filterType":"slider","autoCompleteOptions":[{"key":"0-4years","title":"0 - 4 years","min":1,"max":5},{"key":"5-9years","title":"5 - 9 years","min":6,"max":10},{"key":"10-14years","title":"10 - 14 years","min":11,"max":15},{"key":"15-19years","title":"15 - 19 years","min":16,"max":20},{"key":"20-24years","title":"20 - 24 years","min":21,"max":25},{"key":"25-29years","title":"25 - 29 years","min":26,"max":30},{"key":"30-34years","title":"30 - 34 years","min":31,"max":35},{"key":"35-39years","title":"35 - 39 years","min":36,"max":40},{"key":"40-44years","title":"40 - 44 years","min":41,"max":45},{"key":"45-49years","title":"45 - 49 years","min":46,"max":50},{"key":"50-54years","title":"50 - 54 years","min":51,"max":55},{"key":"55-59years","title":"55 - 59 years","min":56,"max":60},{"key":"60-64years","title":"60 - 64 years","min":61,"max":65},{"key":"65-69years","title":"65 - 69 years","min":66,"max":70},{"key":"70-74years","title":"70 - 74 years","min":71,"max":75},{"key":"75-79years","title":"75 - 79 years","min":76,"max":80},{"key":"80-84years","title":"80 - 84 years","min":81,"max":85},{"key":"85-89years","title":"85 - 89 years","min":86,"max":90},{"key":"90-94years","title":"90 - 94 years","min":91,"max":95},{"key":"95-99years","title":"95 - 99 years","min":96,"max":100},{"key":"100years and over","title":">100","min":101,"max":105},{"key":"Age not stated","title":"Age not stated","min":-5,"max":0}],"showChart":true,"sliderOptions":{"from":-5,"to":105,"step":5,"threshold":0,"scale":["Not stated",0,"",10,"",20,"",30,"",40,"",50,"",60,"",70,"",80,"",90,"",100,">100"],"modelLabels":{"105":">100","-5":"Not stated"},"css":{"background":{"background-color":"#ccc"},"before":{"background-color":"#ccc"},"default":{"background-color":"white"},"after":{"background-color":"#ccc"},"pointer":{"background-color":"#914fb5"},"range":{"background-color":"#914fb5"}}},"sliderValue":"-5;105","defaultGroup":"row"},{"key":"hispanicOrigin","title":"label.filter.hispanicOrigin","queryKey":"hispanic_origin","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.demographics","autoCompleteOptions":[{"key":"Central American","title":"Central American"},{"key":"Central and South American","title":"Central and South American"},{"key":"Cuban","title":"Cuban"},{"key":"Dominican","title":"Dominican"},{"key":"Latin American","title":"Latin American"},{"key":"Mexican","title":"Mexican"},{"key":"Non-Hispanic","title":"Non-Hispanic"},{"key":"Other Hispanic","title":"Other Hispanic"},{"key":"Puerto Rican","title":"Puerto Rican"},{"key":"South American","title":"South American"},{"key":"Spaniard","title":"Spaniard"},{"key":"Unknown","title":"Unknown"}],"defaultGroup":"row"},{"key":"race","title":"label.filter.race","queryKey":"race","primary":false,"value":[],"groupBy":"row","type":"label.filter.group.demographics","showChart":true,"defaultGroup":"column","autoCompleteOptions":[{"key":"American Indian","title":"American Indian"},{"key":"Asian or Pacific Islander","title":"Asian or Pacific Islander"},{"key":"Black","title":"Black"},{"key":"Other (Puerto Rico only)","title":"Other (Puerto Rico only)"},{"key":"White","title":"White"}]},{"key":"gender","title":"label.filter.gender","queryKey":"sex","primary":false,"value":[],"groupBy":"column","type":"label.filter.group.demographics","groupByDefault":"column","showChart":true,"autoCompleteOptions":[{"key":"Female","title":"Female"},{"key":"Male","title":"Male"}],"defaultGroup":"column"},{"key":"year","title":"label.filter.year","queryKey":"current_year","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.year.month","defaultGroup":"row"},{"key":"month","title":"label.filter.month","queryKey":"month_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.year.month","defaultGroup":"row","autoCompleteOptions":[{"key":"January","title":"January"},{"key":"February","title":"February"},{"key":"March","title":"March"},{"key":"April","title":"April"},{"key":"May","title":"May"},{"key":"June","title":"June"},{"key":"July","title":"July"},{"key":"August","title":"August"},{"key":"September","title":"September"},{"key":"October","title":"October"},{"key":"November","title":"November"},{"key":"December","title":"December"}]},{"key":"weekday","title":"label.filter.weekday","queryKey":"week_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","autoCompleteOptions":[{"key":"Sunday","title":"Sunday"},{"key":"Monday","title":"Monday"},{"key":"Tuesday","title":"Tuesday"},{"key":"Wednesday","title":"Wednesday"},{"key":"Thursday","title":"Thursday"},{"key":"Friday","title":"Friday"},{"key":"Saturday","title":"Saturday"},{"key":"Unknown","title":"Unknown"}],"defaultGroup":"row"},{"key":"autopsy","title":"label.filter.autopsy","queryKey":"autopsy","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","autoCompleteOptions":[{"key":"Yes","title":"Yes"},{"key":"No","title":"No"},{"key":"Unknown","title":"Unknown"}],"defaultGroup":"row"},{"key":"placeofdeath","title":"label.filter.pod","queryKey":"place_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","autoCompleteOptions":[{"key":"Decedent’s home","title":"Decedent’s home"},{"key":"Hospital, clinic or Medical Center - Patient status unknown","title":"Hospital, clinic or Medical Center-  Patient status unknown"},{"key":"Hospital, Clinic or Medical Center - Dead on Arrival","title":"Hospital, Clinic or Medical Center-  Dead on Arrival"},{"key":"Hospital, clinic or Medical Center - Inpatient","title":"Hospital, clinic or Medical Center-  Inpatient"},{"key":"Hospital, Clinic or Medical Center - Outpatient or admitted to Emergency Room","title":"Hospital, Clinic or Medical Center-  Outpatient or admitted to Emergency Room"},{"key":"Nursing home/long term care","title":"Nursing home/long term care"},{"key":"Place of death unknown","title":"Place of death unknown"},{"key":"Other","title":"Other"}],"defaultGroup":"row"},{"key":"ucd-chapter-10","title":"label.filter.ucd.icd.chapter","queryKey":"ICD_10_code.path","primary":true,"value":[],"groupBy":false,"type":"label.filter.group.ucd","groupKey":"ucd","autoCompleteOptions":[],"aggregationKey":"ICD_10_code.code"},{"key":"ucd-icd-10-113","title":"label.filter.icd10.113","queryKey":"ICD_113_code","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.ucd","groupKey":"ucd","autoCompleteOptions":[],"disableFilter":true},{"key":"ucd-icd-10-130","title":"label.filter.icd10.130","queryKey":"ICD_130_code","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.ucd","groupKey":"ucd","autoCompleteOptions":[],"disableFilter":true},{"key":"mcd-chapter-10","title":"label.filter.mcd.icd.chapter","queryKey":"record_axis_condn","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.mcd","groupKey":"mcd","autoCompleteOptions":[],"disableFilter":true},{"key":"mcd-icd-10-113","title":"label.filter.mcd.cause.list","queryKey":"record_axis_condn","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.mcd","groupKey":"mcd","autoCompleteOptions":[],"disableFilter":true},{"key":"mcd-icd-10-130","title":"label.filter.mcd.cause.list.infant","queryKey":"record_axis_condn","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.mcd","groupKey":"mcd","autoCompleteOptions":[],"disableFilter":true}],"sideFilters":[{"filterGroup":false,"collapse":false,"allowGrouping":true,"filters":{"key":"year","title":"label.filter.year","queryKey":"current_year","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.year.month","defaultGroup":"row"}},{"filterGroup":false,"collapse":true,"allowGrouping":true,"filters":{"key":"race","title":"label.filter.race","queryKey":"race","primary":false,"value":[],"groupBy":"row","type":"label.filter.group.demographics","showChart":true,"defaultGroup":"column","autoCompleteOptions":[{"key":"American Indian","title":"American Indian"},{"key":"Asian or Pacific Islander","title":"Asian or Pacific Islander"},{"key":"Black","title":"Black"},{"key":"Other (Puerto Rico only)","title":"Other (Puerto Rico only)"},{"key":"White","title":"White"}]}},{"filterGroup":false,"collapse":true,"allowGrouping":true,"filters":{"key":"gender","title":"label.filter.gender","queryKey":"sex","primary":false,"value":[],"groupBy":"column","type":"label.filter.group.demographics","groupByDefault":"column","showChart":true,"autoCompleteOptions":[{"key":"Female","title":"Female"},{"key":"Male","title":"Male"}],"defaultGroup":"column"}},{"filterGroup":false,"collapse":true,"allowGrouping":true,"filters":{"key":"agegroup","title":"label.filter.agegroup","queryKey":"age_5_interval","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.demographics","filterType":"slider","autoCompleteOptions":[{"key":"0-4years","title":"0 - 4 years","min":1,"max":5},{"key":"5-9years","title":"5 - 9 years","min":6,"max":10},{"key":"10-14years","title":"10 - 14 years","min":11,"max":15},{"key":"15-19years","title":"15 - 19 years","min":16,"max":20},{"key":"20-24years","title":"20 - 24 years","min":21,"max":25},{"key":"25-29years","title":"25 - 29 years","min":26,"max":30},{"key":"30-34years","title":"30 - 34 years","min":31,"max":35},{"key":"35-39years","title":"35 - 39 years","min":36,"max":40},{"key":"40-44years","title":"40 - 44 years","min":41,"max":45},{"key":"45-49years","title":"45 - 49 years","min":46,"max":50},{"key":"50-54years","title":"50 - 54 years","min":51,"max":55},{"key":"55-59years","title":"55 - 59 years","min":56,"max":60},{"key":"60-64years","title":"60 - 64 years","min":61,"max":65},{"key":"65-69years","title":"65 - 69 years","min":66,"max":70},{"key":"70-74years","title":"70 - 74 years","min":71,"max":75},{"key":"75-79years","title":"75 - 79 years","min":76,"max":80},{"key":"80-84years","title":"80 - 84 years","min":81,"max":85},{"key":"85-89years","title":"85 - 89 years","min":86,"max":90},{"key":"90-94years","title":"90 - 94 years","min":91,"max":95},{"key":"95-99years","title":"95 - 99 years","min":96,"max":100},{"key":"100years and over","title":">100","min":101,"max":105},{"key":"Age not stated","title":"Age not stated","min":-5,"max":0}],"showChart":true,"sliderOptions":{"from":-5,"to":105,"step":5,"threshold":0,"scale":["Not stated",0,"",10,"",20,"",30,"",40,"",50,"",60,"",70,"",80,"",90,"",100,">100"],"modelLabels":{"105":">100","-5":"Not stated"},"css":{"background":{"background-color":"#ccc"},"before":{"background-color":"#ccc"},"default":{"background-color":"white"},"after":{"background-color":"#ccc"},"pointer":{"background-color":"#914fb5"},"range":{"background-color":"#914fb5"}}},"sliderValue":"-5;105","defaultGroup":"row"}},{"filterGroup":false,"collapse":true,"allowGrouping":true,"groupBy":false,"filters":{"key":"hispanicOrigin","title":"label.filter.hispanicOrigin","queryKey":"hispanic_origin","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.demographics","autoCompleteOptions":[{"key":"Central American","title":"Central American"},{"key":"Central and South American","title":"Central and South American"},{"key":"Cuban","title":"Cuban"},{"key":"Dominican","title":"Dominican"},{"key":"Latin American","title":"Latin American"},{"key":"Mexican","title":"Mexican"},{"key":"Non-Hispanic","title":"Non-Hispanic"},{"key":"Other Hispanic","title":"Other Hispanic"},{"key":"Puerto Rican","title":"Puerto Rican"},{"key":"South American","title":"South American"},{"key":"Spaniard","title":"Spaniard"},{"key":"Unknown","title":"Unknown"}],"defaultGroup":"row"}},{"filterGroup":false,"collapse":true,"allowGrouping":true,"filters":{"key":"autopsy","title":"label.filter.autopsy","queryKey":"autopsy","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","autoCompleteOptions":[{"key":"Yes","title":"Yes"},{"key":"No","title":"No"},{"key":"Unknown","title":"Unknown"}],"defaultGroup":"row"}},{"filterGroup":false,"collapse":true,"allowGrouping":true,"filters":{"key":"placeofdeath","title":"label.filter.pod","queryKey":"place_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","autoCompleteOptions":[{"key":"Decedent’s home","title":"Decedent’s home"},{"key":"Hospital, clinic or Medical Center - Patient status unknown","title":"Hospital, clinic or Medical Center-  Patient status unknown"},{"key":"Hospital, Clinic or Medical Center - Dead on Arrival","title":"Hospital, Clinic or Medical Center-  Dead on Arrival"},{"key":"Hospital, clinic or Medical Center - Inpatient","title":"Hospital, clinic or Medical Center-  Inpatient"},{"key":"Hospital, Clinic or Medical Center - Outpatient or admitted to Emergency Room","title":"Hospital, Clinic or Medical Center-  Outpatient or admitted to Emergency Room"},{"key":"Nursing home/long term care","title":"Nursing home/long term care"},{"key":"Place of death unknown","title":"Place of death unknown"},{"key":"Other","title":"Other"}],"defaultGroup":"row"}},{"filterGroup":false,"collapse":true,"allowGrouping":true,"filters":{"key":"weekday","title":"label.filter.weekday","queryKey":"week_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","autoCompleteOptions":[{"key":"Sunday","title":"Sunday"},{"key":"Monday","title":"Monday"},{"key":"Tuesday","title":"Tuesday"},{"key":"Wednesday","title":"Wednesday"},{"key":"Thursday","title":"Thursday"},{"key":"Friday","title":"Friday"},{"key":"Saturday","title":"Saturday"},{"key":"Unknown","title":"Unknown"}],"defaultGroup":"row"}},{"filterGroup":false,"collapse":true,"allowGrouping":true,"filters":{"key":"month","title":"label.filter.month","queryKey":"month_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.year.month","defaultGroup":"row","autoCompleteOptions":[{"key":"January","title":"January"},{"key":"February","title":"February"},{"key":"March","title":"March"},{"key":"April","title":"April"},{"key":"May","title":"May"},{"key":"June","title":"June"},{"key":"July","title":"July"},{"key":"August","title":"August"},{"key":"September","title":"September"},{"key":"October","title":"October"},{"key":"November","title":"November"},{"key":"December","title":"December"}]}},{"filterGroup":false,"collapse":true,"filters":{"key":"ucd-filters","title":"label.filter.ucd","queryKey":"","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.ucd","filterType":"conditions","groupOptions":[{"key":"row","title":"Row","tooltip":"Select to view as rows on data table"},{"key":false,"title":"Off","tooltip":"Select to hide on data table"}],"autoCompleteOptions":[{"key":"ucd-chapter-10","title":"label.filter.ucd.icd.chapter","queryKey":"ICD_10_code.path","primary":true,"value":[],"groupBy":false,"type":"label.filter.group.ucd","groupKey":"ucd","autoCompleteOptions":[],"aggregationKey":"ICD_10_code.code"}]},"autoCompleteOptions":[]},{"filterGroup":false,"collapse":true,"filters":{"key":"mcd-filters","title":"label.filter.mcd","queryKey":"","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.mcd","filterType":"conditions","groupOptions":[],"autoCompleteOptions":[{"key":"mcd-chapter-10","title":"label.filter.mcd.icd.chapter","queryKey":"record_axis_condn","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.mcd","groupKey":"mcd","autoCompleteOptions":[],"disableFilter":true}]},"autoCompleteOptions":[]}]},
                "resultJSON": {"simple":{"group_table_race":[{"name":"White","deaths":31771296,"undefined":[{"name":"Female","deaths":16088007},{"name":"Male","deaths":15683289}]},{"name":"Black","deaths":4374470,"undefined":[{"name":"Male","deaths":2227092},{"name":"Female","deaths":2147378}]},{"name":"Asian or Pacific Islander","deaths":703842,"undefined":[{"name":"Male","deaths":367670},{"name":"Female","deaths":336172}]},{"name":"American Indian","deaths":217181,"undefined":[{"name":"Male","deaths":118412},{"name":"Female","deaths":98769}]}],"group_chart_0_gender":[{"name":"Female","deaths":18670326,"undefined":[{"name":"White","deaths":16088007},{"name":"Black","deaths":2147378},{"name":"Asian or Pacific Islander","deaths":336172},{"name":"American Indian","deaths":98769}]},{"name":"Male","deaths":18396463,"undefined":[{"name":"White","deaths":15683289},{"name":"Black","deaths":2227092},{"name":"Asian or Pacific Islander","deaths":367670},{"name":"American Indian","deaths":118412}]}]},"nested":{"table":{"race":[{"name":"American Indian","deaths":217181,"gender":[{"name":"Female","deaths":98769,"pop":28544528,"ageAdjustedRate":"557.9","standardPop":32250198},{"name":"Male","deaths":118412,"pop":28645741,"ageAdjustedRate":"754.4","standardPop":32369216}],"pop":57190269,"ageAdjustedRate":"647.7","standardPop":64619414},{"name":"Asian or Pacific Islander","deaths":703842,"gender":[{"name":"Female","deaths":336172,"pop":121309960,"ageAdjustedRate":"368.3","standardPop":137270512},{"name":"Male","deaths":367670,"pop":112325576,"ageAdjustedRate":"524.1","standardPop":127115817}],"pop":233635536,"ageAdjustedRate":"435.2","standardPop":264386329},{"name":"Black","deaths":4374470,"gender":[{"name":"Female","deaths":2147378,"pop":317237591,"ageAdjustedRate":"807.4","standardPop":359386608},{"name":"Male","deaths":2227092,"pop":289840863,"ageAdjustedRate":"1,193.3","standardPop":328414017}],"pop":607078454,"ageAdjustedRate":"967.6","standardPop":687800625},{"name":"White","deaths":31771296,"gender":[{"name":"Female","deaths":16088007,"pop":1828192603,"ageAdjustedRate":"660.1","standardPop":2070887962},{"name":"Male","deaths":15683289,"pop":1787480522,"ageAdjustedRate":"922.5","standardPop":2024924546}],"pop":3615673125,"ageAdjustedRate":"777.0","standardPop":4095812508}]},"charts":[{"gender":[{"name":"Female","deaths":18670326,"race":[{"name":"White","deaths":16088007},{"name":"Black","deaths":2147378},{"name":"Asian or Pacific Islander","deaths":336172},{"name":"American Indian","deaths":98769}]},{"name":"Male","deaths":18396463,"race":[{"name":"White","deaths":15683289},{"name":"Black","deaths":2227092},{"name":"Asian or Pacific Islander","deaths":367670},{"name":"American Indian","deaths":118412}]}]}],"maps":{"states":[{"name":"VT","deaths":743220,"sex":[{"name":"Female","deaths":373872},{"name":"Male","deaths":369348}]},{"name":"UT","deaths":743113,"sex":[{"name":"Female","deaths":374276},{"name":"Male","deaths":368837}]},{"name":"MS","deaths":742660,"sex":[{"name":"Female","deaths":374468},{"name":"Male","deaths":368192}]},{"name":"SD","deaths":742537,"sex":[{"name":"Female","deaths":374284},{"name":"Male","deaths":368253}]},{"name":"TX","deaths":742489,"sex":[{"name":"Female","deaths":375056},{"name":"Male","deaths":367433}]},{"name":"NH","deaths":742418,"sex":[{"name":"Female","deaths":373966},{"name":"Male","deaths":368452}]},{"name":"CT","deaths":742384,"sex":[{"name":"Female","deaths":374351},{"name":"Male","deaths":368033}]},{"name":"MN","deaths":742336,"sex":[{"name":"Female","deaths":374023},{"name":"Male","deaths":368313}]},{"name":"MA","deaths":742184,"sex":[{"name":"Female","deaths":373656},{"name":"Male","deaths":368528}]},{"name":"NJ","deaths":742155,"sex":[{"name":"Female","deaths":374178},{"name":"Male","deaths":367977}]},{"name":"KS","deaths":742152,"sex":[{"name":"Female","deaths":373243},{"name":"Male","deaths":368909}]},{"name":"MI","deaths":742038,"sex":[{"name":"Female","deaths":374193},{"name":"Male","deaths":367845}]},{"name":"FL","deaths":741992,"sex":[{"name":"Female","deaths":373676},{"name":"Male","deaths":368316}]},{"name":"AL","deaths":741929,"sex":[{"name":"Female","deaths":373344},{"name":"Male","deaths":368585}]},{"name":"ID","deaths":741860,"sex":[{"name":"Female","deaths":373112},{"name":"Male","deaths":368748}]},{"name":"VA","deaths":741767,"sex":[{"name":"Female","deaths":373093},{"name":"Male","deaths":368674}]},{"name":"MO","deaths":741757,"sex":[{"name":"Female","deaths":373064},{"name":"Male","deaths":368693}]},{"name":"MD","deaths":741750,"sex":[{"name":"Female","deaths":373487},{"name":"Male","deaths":368263}]},{"name":"HI","deaths":741645,"sex":[{"name":"Female","deaths":373416},{"name":"Male","deaths":368229}]},{"name":"NE","deaths":741627,"sex":[{"name":"Female","deaths":373141},{"name":"Male","deaths":368486}]},{"name":"PA","deaths":741617,"sex":[{"name":"Female","deaths":373580},{"name":"Male","deaths":368037}]},{"name":"OR","deaths":741571,"sex":[{"name":"Female","deaths":373456},{"name":"Male","deaths":368115}]},{"name":"DE","deaths":741566,"sex":[{"name":"Female","deaths":373802},{"name":"Male","deaths":367764}]},{"name":"AZ","deaths":741544,"sex":[{"name":"Female","deaths":373573},{"name":"Male","deaths":367971}]},{"name":"LA","deaths":741538,"sex":[{"name":"Female","deaths":373121},{"name":"Male","deaths":368417}]},{"name":"OK","deaths":741512,"sex":[{"name":"Female","deaths":373688},{"name":"Male","deaths":367824}]},{"name":"AR","deaths":741486,"sex":[{"name":"Female","deaths":373740},{"name":"Male","deaths":367746}]},{"name":"ME","deaths":741296,"sex":[{"name":"Female","deaths":373225},{"name":"Male","deaths":368071}]},{"name":"MT","deaths":741100,"sex":[{"name":"Female","deaths":373419},{"name":"Male","deaths":367681}]},{"name":"WI","deaths":741071,"sex":[{"name":"Female","deaths":372801},{"name":"Male","deaths":368270}]},{"name":"OH","deaths":741017,"sex":[{"name":"Female","deaths":372743},{"name":"Male","deaths":368274}]},{"name":"WA","deaths":741005,"sex":[{"name":"Female","deaths":373774},{"name":"Male","deaths":367231}]},{"name":"ND","deaths":740939,"sex":[{"name":"Female","deaths":374078},{"name":"Male","deaths":366861}]},{"name":"IL","deaths":740889,"sex":[{"name":"Female","deaths":372932},{"name":"Male","deaths":367957}]},{"name":"WV","deaths":740881,"sex":[{"name":"Female","deaths":373497},{"name":"Male","deaths":367384}]},{"name":"IA","deaths":740877,"sex":[{"name":"Female","deaths":372861},{"name":"Male","deaths":368016}]},{"name":"TN","deaths":740763,"sex":[{"name":"Female","deaths":373820},{"name":"Male","deaths":366943}]},{"name":"SC","deaths":740719,"sex":[{"name":"Female","deaths":373608},{"name":"Male","deaths":367111}]},{"name":"WY","deaths":740615,"sex":[{"name":"Female","deaths":372664},{"name":"Male","deaths":367951}]},{"name":"NM","deaths":740459,"sex":[{"name":"Female","deaths":372710},{"name":"Male","deaths":367749}]},{"name":"NV","deaths":740385,"sex":[{"name":"Female","deaths":372231},{"name":"Male","deaths":368154}]},{"name":"NC","deaths":740360,"sex":[{"name":"Female","deaths":373201},{"name":"Male","deaths":367159}]},{"name":"AK","deaths":740313,"sex":[{"name":"Female","deaths":373515},{"name":"Male","deaths":366798}]},{"name":"CO","deaths":740308,"sex":[{"name":"Female","deaths":372596},{"name":"Male","deaths":367712}]},{"name":"NY","deaths":740238,"sex":[{"name":"Female","deaths":373500},{"name":"Male","deaths":366738}]},{"name":"CA","deaths":740134,"sex":[{"name":"Female","deaths":371845},{"name":"Male","deaths":368289}]},{"name":"RI","deaths":740085,"sex":[{"name":"Female","deaths":372920},{"name":"Male","deaths":367165}]},{"name":"GA","deaths":739847,"sex":[{"name":"Female","deaths":372147},{"name":"Male","deaths":367700}]},{"name":"IN","deaths":739448,"sex":[{"name":"Female","deaths":372114},{"name":"Male","deaths":367334}]},{"name":"KY","deaths":739193,"sex":[{"name":"Female","deaths":373266},{"name":"Male","deaths":365927}]}]}}},
                "sideFilterResults": {"data":{"simple":{"placeofdeath":[{"name":"Hospital, clinic or Medical Center - Inpatient","deaths":13079218},{"name":"Decedent's home","deaths":9531295},{"name":"Nursing home/long term care","deaths":7940085},{"name":"Hospital, Clinic or Medical Center - Outpatient or admitted to Emergency Room","deaths":2633673},{"name":"Other","deaths":2273247},{"name":"Hospice facility","deaths":1091501},{"name":"Hospital, Clinic or Medical Center - Dead on Arrival","deaths":316703},{"name":"Place of death unknown","deaths":165470},{"name":"Hospital, Clinic or Medical Center - Patient status unknown","deaths":35597}],"hispanicOrigin":[{"name":"Non–Hispanic","deaths":34926053},{"name":"Mexican","deaths":1155470},{"name":"Puerto Rican","deaths":260772},{"name":"Other Hispanic","deaths":213544},{"name":"Cuban","deaths":197080},{"name":"Unknown","deaths":94819},{"name":"Central American","deaths":74461},{"name":"Central and South American","deaths":63457},{"name":"South American","deaths":41511},{"name":"Dominican","deaths":29494},{"name":"Spaniard","deaths":5971},{"name":"Latin American","deaths":4157}],"race":[{"name":"White","deaths":31771296},{"name":"Black","deaths":4374470},{"name":"Asian or Pacific Islander","deaths":703842},{"name":"American Indian","deaths":217181}],"gender":[{"name":"Female","deaths":18670326},{"name":"Male","deaths":18396463}],"month":[{"name":"January","deaths":3464050},{"name":"December","deaths":3345731},{"name":"March","deaths":3314583},{"name":"February","deaths":3109668},{"name":"October","deaths":3068160},{"name":"April","deaths":3056378},{"name":"November","deaths":3055392},{"name":"May","deaths":3038446},{"name":"July","deaths":2941181},{"name":"August","deaths":2925163},{"name":"June","deaths":2878725},{"name":"September","deaths":2869312}],"year":[{"name":"2014","deaths":2626418},{"name":"2013","deaths":2596993},{"name":"2012","deaths":2543279},{"name":"2011","deaths":2515458},{"name":"2008","deaths":2471984},{"name":"2010","deaths":2468435},{"name":"2003","deaths":2448288},{"name":"2005","deaths":2448017},{"name":"2002","deaths":2443387},{"name":"2009","deaths":2437163},{"name":"2006","deaths":2426264},{"name":"2007","deaths":2423712},{"name":"2001","deaths":2416425},{"name":"2000","deaths":2403351},{"name":"2004","deaths":2397615}],"weekday":[{"name":"Saturday","deaths":5367503},{"name":"Friday","deaths":5344867},{"name":"Monday","deaths":5300217},{"name":"Thursday","deaths":5266918},{"name":"Wednesday","deaths":5266837},{"name":"Tuesday","deaths":5262950},{"name":"Sunday","deaths":5256353},{"name":"Unknown","deaths":1144}],"ucd-filters":[],"mcd-filters":[],"autopsy":[{"name":"No","deaths":24174400},{"name":"Unknown","deaths":3314646},{"name":"Yes","deaths":2314576}],"agegroup":[{"name":"80-84years","deaths":5435697},{"name":"85-89years","deaths":5428786},{"name":"75-79years","deaths":4471378},{"name":"90-94years","deaths":3755974},{"name":"70-74years","deaths":3472174},{"name":"65-69years","deaths":2796964},{"name":"60-64years","deaths":2378520},{"name":"55-59years","deaths":1980982},{"name":"50-54years","deaths":1569719},{"name":"95-99years","deaths":1476328},{"name":"45-49years","deaths":1112465},{"name":"40-44years","deaths":727998},{"name":"0-4years","deaths":467671},{"name":"35-39years","deaths":467563},{"name":"30-34years","deaths":342647},{"name":"100 years and over","deaths":312742},{"name":"25-29years","deaths":298474},{"name":"20-24years","deaths":291468},{"name":"15-19years","deaths":183520},{"name":"10-14years","deaths":51759},{"name":"5-9years","deaths":40357},{"name":"Age not started","deaths":3603}]},"nested":{"table":{},"charts":[],"maps":{}}},"pagination":{"total":37066789}}
            }).then(function () {

            queryCache.getCachedQuery('1f7a679a3f9d7c425b36503d59d56b23-large').then(function (resp) {
                var result = resp._source;
                expect(result.queryID).to.eql('1f7a679a3f9d7c425b36503d59d56b23-large');
                expect(result.dataset).to.eql('mortality');
                expect(JSON.parse(result.queryJSON)).to.eql({
                    "key": "deaths",
                    "allFilters": [{
                        "key": "agegroup",
                        "title": "label.filter.agegroup",
                        "queryKey": "age_5_interval",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.demographics",
                        "filterType": "slider",
                        "autoCompleteOptions": [{
                            "key": "0-4years",
                            "title": "0 - 4 years",
                            "min": 1,
                            "max": 5
                        }, {"key": "5-9years", "title": "5 - 9 years", "min": 6, "max": 10}, {
                            "key": "10-14years",
                            "title": "10 - 14 years",
                            "min": 11,
                            "max": 15
                        }, {"key": "15-19years", "title": "15 - 19 years", "min": 16, "max": 20}, {
                            "key": "20-24years",
                            "title": "20 - 24 years",
                            "min": 21,
                            "max": 25
                        }, {"key": "25-29years", "title": "25 - 29 years", "min": 26, "max": 30}, {
                            "key": "30-34years",
                            "title": "30 - 34 years",
                            "min": 31,
                            "max": 35
                        }, {"key": "35-39years", "title": "35 - 39 years", "min": 36, "max": 40}, {
                            "key": "40-44years",
                            "title": "40 - 44 years",
                            "min": 41,
                            "max": 45
                        }, {"key": "45-49years", "title": "45 - 49 years", "min": 46, "max": 50}, {
                            "key": "50-54years",
                            "title": "50 - 54 years",
                            "min": 51,
                            "max": 55
                        }, {"key": "55-59years", "title": "55 - 59 years", "min": 56, "max": 60}, {
                            "key": "60-64years",
                            "title": "60 - 64 years",
                            "min": 61,
                            "max": 65
                        }, {"key": "65-69years", "title": "65 - 69 years", "min": 66, "max": 70}, {
                            "key": "70-74years",
                            "title": "70 - 74 years",
                            "min": 71,
                            "max": 75
                        }, {"key": "75-79years", "title": "75 - 79 years", "min": 76, "max": 80}, {
                            "key": "80-84years",
                            "title": "80 - 84 years",
                            "min": 81,
                            "max": 85
                        }, {"key": "85-89years", "title": "85 - 89 years", "min": 86, "max": 90}, {
                            "key": "90-94years",
                            "title": "90 - 94 years",
                            "min": 91,
                            "max": 95
                        }, {
                            "key": "95-99years",
                            "title": "95 - 99 years",
                            "min": 96,
                            "max": 100
                        }, {
                            "key": "100years and over",
                            "title": ">100",
                            "min": 101,
                            "max": 105
                        }, {"key": "Age not stated", "title": "Age not stated", "min": -5, "max": 0}],
                        "showChart": true,
                        "sliderOptions": {
                            "from": -5,
                            "to": 105,
                            "step": 5,
                            "threshold": 0,
                            "scale": ["Not stated", 0, "", 10, "", 20, "", 30, "", 40, "", 50, "", 60, "", 70, "", 80, "", 90, "", 100, ">100"],
                            "modelLabels": {"105": ">100", "-5": "Not stated"},
                            "css": {
                                "background": {"background-color": "#ccc"},
                                "before": {"background-color": "#ccc"},
                                "default": {"background-color": "white"},
                                "after": {"background-color": "#ccc"},
                                "pointer": {"background-color": "#914fb5"},
                                "range": {"background-color": "#914fb5"}
                            }
                        },
                        "sliderValue": "-5;105",
                        "defaultGroup": "row"
                    }, {
                        "key": "hispanicOrigin",
                        "title": "label.filter.hispanicOrigin",
                        "queryKey": "hispanic_origin",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.demographics",
                        "autoCompleteOptions": [{
                            "key": "Central American",
                            "title": "Central American"
                        }, {
                            "key": "Central and South American",
                            "title": "Central and South American"
                        }, {"key": "Cuban", "title": "Cuban"}, {
                            "key": "Dominican",
                            "title": "Dominican"
                        }, {"key": "Latin American", "title": "Latin American"}, {
                            "key": "Mexican",
                            "title": "Mexican"
                        }, {"key": "Non-Hispanic", "title": "Non-Hispanic"}, {
                            "key": "Other Hispanic",
                            "title": "Other Hispanic"
                        }, {"key": "Puerto Rican", "title": "Puerto Rican"}, {
                            "key": "South American",
                            "title": "South American"
                        }, {"key": "Spaniard", "title": "Spaniard"}, {"key": "Unknown", "title": "Unknown"}],
                        "defaultGroup": "row"
                    }, {
                        "key": "race",
                        "title": "label.filter.race",
                        "queryKey": "race",
                        "primary": false,
                        "value": [],
                        "groupBy": "row",
                        "type": "label.filter.group.demographics",
                        "showChart": true,
                        "defaultGroup": "column",
                        "autoCompleteOptions": [{
                            "key": "American Indian",
                            "title": "American Indian"
                        }, {"key": "Asian or Pacific Islander", "title": "Asian or Pacific Islander"}, {
                            "key": "Black",
                            "title": "Black"
                        }, {
                            "key": "White",
                            "title": "White"
                        }]
                    }, {
                        "key": "gender",
                        "title": "label.filter.gender",
                        "queryKey": "sex",
                        "primary": false,
                        "value": [],
                        "groupBy": "column",
                        "type": "label.filter.group.demographics",
                        "groupByDefault": "column",
                        "showChart": true,
                        "autoCompleteOptions": [{"key": "Female", "title": "Female"}, {"key": "Male", "title": "Male"}],
                        "defaultGroup": "column"
                    }, {
                        "key": "year",
                        "title": "label.filter.year",
                        "queryKey": "current_year",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.year.month",
                        "defaultGroup": "row"
                    }, {
                        "key": "month",
                        "title": "label.filter.month",
                        "queryKey": "month_of_death",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.year.month",
                        "defaultGroup": "row",
                        "autoCompleteOptions": [{"key": "January", "title": "January"}, {
                            "key": "February",
                            "title": "February"
                        }, {"key": "March", "title": "March"}, {"key": "April", "title": "April"}, {
                            "key": "May",
                            "title": "May"
                        }, {"key": "June", "title": "June"}, {"key": "July", "title": "July"}, {
                            "key": "August",
                            "title": "August"
                        }, {"key": "September", "title": "September"}, {
                            "key": "October",
                            "title": "October"
                        }, {"key": "November", "title": "November"}, {"key": "December", "title": "December"}]
                    }, {
                        "key": "weekday",
                        "title": "label.filter.weekday",
                        "queryKey": "week_of_death",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.weekday.autopsy.pod",
                        "autoCompleteOptions": [{"key": "Sunday", "title": "Sunday"}, {
                            "key": "Monday",
                            "title": "Monday"
                        }, {"key": "Tuesday", "title": "Tuesday"}, {
                            "key": "Wednesday",
                            "title": "Wednesday"
                        }, {"key": "Thursday", "title": "Thursday"}, {
                            "key": "Friday",
                            "title": "Friday"
                        }, {"key": "Saturday", "title": "Saturday"}, {"key": "Unknown", "title": "Unknown"}],
                        "defaultGroup": "row"
                    }, {
                        "key": "autopsy",
                        "title": "label.filter.autopsy",
                        "queryKey": "autopsy",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.weekday.autopsy.pod",
                        "autoCompleteOptions": [{"key": "Yes", "title": "Yes"}, {
                            "key": "No",
                            "title": "No"
                        }, {"key": "Unknown", "title": "Unknown"}],
                        "defaultGroup": "row"
                    }, {
                        "key": "placeofdeath",
                        "title": "label.filter.pod",
                        "queryKey": "place_of_death",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.weekday.autopsy.pod",
                        "autoCompleteOptions": [{
                            "key": "Decedent’s home",
                            "title": "Decedent’s home"
                        }, {
                            "key": "Hospital, clinic or Medical Center - Patient status unknown",
                            "title": "Hospital, clinic or Medical Center-  Patient status unknown"
                        }, {
                            "key": "Hospital, Clinic or Medical Center - Dead on Arrival",
                            "title": "Hospital, Clinic or Medical Center-  Dead on Arrival"
                        }, {
                            "key": "Hospital, clinic or Medical Center - Inpatient",
                            "title": "Hospital, clinic or Medical Center-  Inpatient"
                        }, {
                            "key": "Hospital, Clinic or Medical Center - Outpatient or admitted to Emergency Room",
                            "title": "Hospital, Clinic or Medical Center-  Outpatient or admitted to Emergency Room"
                        }, {
                            "key": "Nursing home/long term care",
                            "title": "Nursing home/long term care"
                        }, {"key": "Place of death unknown", "title": "Place of death unknown"}, {
                            "key": "Other",
                            "title": "Other"
                        }],
                        "defaultGroup": "row"
                    }, {
                        "key": "ucd-chapter-10",
                        "title": "label.filter.ucd.icd.chapter",
                        "queryKey": "ICD_10_code.path",
                        "primary": true,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.ucd",
                        "groupKey": "ucd",
                        "autoCompleteOptions": [],
                        "aggregationKey": "ICD_10_code.code"
                    }, {
                        "key": "ucd-icd-10-113",
                        "title": "label.filter.icd10.113",
                        "queryKey": "ICD_113_code",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.ucd",
                        "groupKey": "ucd",
                        "autoCompleteOptions": [],
                        "disableFilter": true
                    }, {
                        "key": "ucd-icd-10-130",
                        "title": "label.filter.icd10.130",
                        "queryKey": "ICD_130_code",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.ucd",
                        "groupKey": "ucd",
                        "autoCompleteOptions": [],
                        "disableFilter": true
                    }, {
                        "key": "mcd-chapter-10",
                        "title": "label.filter.mcd.icd.chapter",
                        "queryKey": "record_axis_condn",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.mcd",
                        "groupKey": "mcd",
                        "autoCompleteOptions": [],
                        "disableFilter": true
                    }, {
                        "key": "mcd-icd-10-113",
                        "title": "label.filter.mcd.cause.list",
                        "queryKey": "record_axis_condn",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.mcd",
                        "groupKey": "mcd",
                        "autoCompleteOptions": [],
                        "disableFilter": true
                    }, {
                        "key": "mcd-icd-10-130",
                        "title": "label.filter.mcd.cause.list.infant",
                        "queryKey": "record_axis_condn",
                        "primary": false,
                        "value": [],
                        "groupBy": false,
                        "type": "label.filter.group.mcd",
                        "groupKey": "mcd",
                        "autoCompleteOptions": [],
                        "disableFilter": true
                    }],
                    "sideFilters": [{
                        "filterGroup": false,
                        "collapse": false,
                        "allowGrouping": true,
                        "filters": {
                            "key": "year",
                            "title": "label.filter.year",
                            "queryKey": "current_year",
                            "primary": false,
                            "value": [],
                            "groupBy": false,
                            "type": "label.filter.group.year.month",
                            "defaultGroup": "row"
                        }
                    }, {
                        "filterGroup": false,
                        "collapse": true,
                        "allowGrouping": true,
                        "filters": {
                            "key": "race",
                            "title": "label.filter.race",
                            "queryKey": "race",
                            "primary": false,
                            "value": [],
                            "groupBy": "row",
                            "type": "label.filter.group.demographics",
                            "showChart": true,
                            "defaultGroup": "column",
                            "autoCompleteOptions": [{
                                "key": "American Indian",
                                "title": "American Indian"
                            }, {
                                "key": "Asian or Pacific Islander",
                                "title": "Asian or Pacific Islander"
                            }, {"key": "Black", "title": "Black"}, {
                                "key": "Other (Puerto Rico only)",
                                "title": "Other (Puerto Rico only)"
                            }, {"key": "White", "title": "White"}]
                        }
                    }, {
                        "filterGroup": false,
                        "collapse": true,
                        "allowGrouping": true,
                        "filters": {
                            "key": "gender",
                            "title": "label.filter.gender",
                            "queryKey": "sex",
                            "primary": false,
                            "value": [],
                            "groupBy": "column",
                            "type": "label.filter.group.demographics",
                            "groupByDefault": "column",
                            "showChart": true,
                            "autoCompleteOptions": [{"key": "Female", "title": "Female"}, {
                                "key": "Male",
                                "title": "Male"
                            }],
                            "defaultGroup": "column"
                        }
                    }, {
                        "filterGroup": false,
                        "collapse": true,
                        "allowGrouping": true,
                        "filters": {
                            "key": "agegroup",
                            "title": "label.filter.agegroup",
                            "queryKey": "age_5_interval",
                            "primary": false,
                            "value": [],
                            "groupBy": false,
                            "type": "label.filter.group.demographics",
                            "filterType": "slider",
                            "autoCompleteOptions": [{
                                "key": "0-4years",
                                "title": "0 - 4 years",
                                "min": 1,
                                "max": 5
                            }, {"key": "5-9years", "title": "5 - 9 years", "min": 6, "max": 10}, {
                                "key": "10-14years",
                                "title": "10 - 14 years",
                                "min": 11,
                                "max": 15
                            }, {
                                "key": "15-19years",
                                "title": "15 - 19 years",
                                "min": 16,
                                "max": 20
                            }, {
                                "key": "20-24years",
                                "title": "20 - 24 years",
                                "min": 21,
                                "max": 25
                            }, {
                                "key": "25-29years",
                                "title": "25 - 29 years",
                                "min": 26,
                                "max": 30
                            }, {
                                "key": "30-34years",
                                "title": "30 - 34 years",
                                "min": 31,
                                "max": 35
                            }, {
                                "key": "35-39years",
                                "title": "35 - 39 years",
                                "min": 36,
                                "max": 40
                            }, {
                                "key": "40-44years",
                                "title": "40 - 44 years",
                                "min": 41,
                                "max": 45
                            }, {
                                "key": "45-49years",
                                "title": "45 - 49 years",
                                "min": 46,
                                "max": 50
                            }, {
                                "key": "50-54years",
                                "title": "50 - 54 years",
                                "min": 51,
                                "max": 55
                            }, {
                                "key": "55-59years",
                                "title": "55 - 59 years",
                                "min": 56,
                                "max": 60
                            }, {
                                "key": "60-64years",
                                "title": "60 - 64 years",
                                "min": 61,
                                "max": 65
                            }, {
                                "key": "65-69years",
                                "title": "65 - 69 years",
                                "min": 66,
                                "max": 70
                            }, {
                                "key": "70-74years",
                                "title": "70 - 74 years",
                                "min": 71,
                                "max": 75
                            }, {
                                "key": "75-79years",
                                "title": "75 - 79 years",
                                "min": 76,
                                "max": 80
                            }, {
                                "key": "80-84years",
                                "title": "80 - 84 years",
                                "min": 81,
                                "max": 85
                            }, {
                                "key": "85-89years",
                                "title": "85 - 89 years",
                                "min": 86,
                                "max": 90
                            }, {
                                "key": "90-94years",
                                "title": "90 - 94 years",
                                "min": 91,
                                "max": 95
                            }, {
                                "key": "95-99years",
                                "title": "95 - 99 years",
                                "min": 96,
                                "max": 100
                            }, {
                                "key": "100years and over",
                                "title": ">100",
                                "min": 101,
                                "max": 105
                            }, {"key": "Age not stated", "title": "Age not stated", "min": -5, "max": 0}],
                            "showChart": true,
                            "sliderOptions": {
                                "from": -5,
                                "to": 105,
                                "step": 5,
                                "threshold": 0,
                                "scale": ["Not stated", 0, "", 10, "", 20, "", 30, "", 40, "", 50, "", 60, "", 70, "", 80, "", 90, "", 100, ">100"],
                                "modelLabels": {"105": ">100", "-5": "Not stated"},
                                "css": {
                                    "background": {"background-color": "#ccc"},
                                    "before": {"background-color": "#ccc"},
                                    "default": {"background-color": "white"},
                                    "after": {"background-color": "#ccc"},
                                    "pointer": {"background-color": "#914fb5"},
                                    "range": {"background-color": "#914fb5"}
                                }
                            },
                            "sliderValue": "-5;105",
                            "defaultGroup": "row"
                        }
                    }, {
                        "filterGroup": false,
                        "collapse": true,
                        "allowGrouping": true,
                        "groupBy": false,
                        "filters": {
                            "key": "hispanicOrigin",
                            "title": "label.filter.hispanicOrigin",
                            "queryKey": "hispanic_origin",
                            "primary": false,
                            "value": [],
                            "groupBy": false,
                            "type": "label.filter.group.demographics",
                            "autoCompleteOptions": [{
                                "key": "Central American",
                                "title": "Central American"
                            }, {
                                "key": "Central and South American",
                                "title": "Central and South American"
                            }, {"key": "Cuban", "title": "Cuban"}, {
                                "key": "Dominican",
                                "title": "Dominican"
                            }, {"key": "Latin American", "title": "Latin American"}, {
                                "key": "Mexican",
                                "title": "Mexican"
                            }, {"key": "Non-Hispanic", "title": "Non-Hispanic"}, {
                                "key": "Other Hispanic",
                                "title": "Other Hispanic"
                            }, {"key": "Puerto Rican", "title": "Puerto Rican"}, {
                                "key": "South American",
                                "title": "South American"
                            }, {"key": "Spaniard", "title": "Spaniard"}, {"key": "Unknown", "title": "Unknown"}],
                            "defaultGroup": "row"
                        }
                    }, {
                        "filterGroup": false,
                        "collapse": true,
                        "allowGrouping": true,
                        "filters": {
                            "key": "autopsy",
                            "title": "label.filter.autopsy",
                            "queryKey": "autopsy",
                            "primary": false,
                            "value": [],
                            "groupBy": false,
                            "type": "label.filter.group.weekday.autopsy.pod",
                            "autoCompleteOptions": [{"key": "Yes", "title": "Yes"}, {
                                "key": "No",
                                "title": "No"
                            }, {"key": "Unknown", "title": "Unknown"}],
                            "defaultGroup": "row"
                        }
                    }, {
                        "filterGroup": false,
                        "collapse": true,
                        "allowGrouping": true,
                        "filters": {
                            "key": "placeofdeath",
                            "title": "label.filter.pod",
                            "queryKey": "place_of_death",
                            "primary": false,
                            "value": [],
                            "groupBy": false,
                            "type": "label.filter.group.weekday.autopsy.pod",
                            "autoCompleteOptions": [{
                                "key": "Decedent’s home",
                                "title": "Decedent’s home"
                            }, {
                                "key": "Hospital, clinic or Medical Center - Patient status unknown",
                                "title": "Hospital, clinic or Medical Center-  Patient status unknown"
                            }, {
                                "key": "Hospital, Clinic or Medical Center - Dead on Arrival",
                                "title": "Hospital, Clinic or Medical Center-  Dead on Arrival"
                            }, {
                                "key": "Hospital, clinic or Medical Center - Inpatient",
                                "title": "Hospital, clinic or Medical Center-  Inpatient"
                            }, {
                                "key": "Hospital, Clinic or Medical Center - Outpatient or admitted to Emergency Room",
                                "title": "Hospital, Clinic or Medical Center-  Outpatient or admitted to Emergency Room"
                            }, {
                                "key": "Nursing home/long term care",
                                "title": "Nursing home/long term care"
                            }, {"key": "Place of death unknown", "title": "Place of death unknown"}, {
                                "key": "Other",
                                "title": "Other"
                            }],
                            "defaultGroup": "row"
                        }
                    }, {
                        "filterGroup": false,
                        "collapse": true,
                        "allowGrouping": true,
                        "filters": {
                            "key": "weekday",
                            "title": "label.filter.weekday",
                            "queryKey": "week_of_death",
                            "primary": false,
                            "value": [],
                            "groupBy": false,
                            "type": "label.filter.group.weekday.autopsy.pod",
                            "autoCompleteOptions": [{"key": "Sunday", "title": "Sunday"}, {
                                "key": "Monday",
                                "title": "Monday"
                            }, {"key": "Tuesday", "title": "Tuesday"}, {
                                "key": "Wednesday",
                                "title": "Wednesday"
                            }, {"key": "Thursday", "title": "Thursday"}, {
                                "key": "Friday",
                                "title": "Friday"
                            }, {"key": "Saturday", "title": "Saturday"}, {"key": "Unknown", "title": "Unknown"}],
                            "defaultGroup": "row"
                        }
                    }, {
                        "filterGroup": false,
                        "collapse": true,
                        "allowGrouping": true,
                        "filters": {
                            "key": "month",
                            "title": "label.filter.month",
                            "queryKey": "month_of_death",
                            "primary": false,
                            "value": [],
                            "groupBy": false,
                            "type": "label.filter.group.year.month",
                            "defaultGroup": "row",
                            "autoCompleteOptions": [{"key": "January", "title": "January"}, {
                                "key": "February",
                                "title": "February"
                            }, {"key": "March", "title": "March"}, {"key": "April", "title": "April"}, {
                                "key": "May",
                                "title": "May"
                            }, {"key": "June", "title": "June"}, {"key": "July", "title": "July"}, {
                                "key": "August",
                                "title": "August"
                            }, {"key": "September", "title": "September"}, {
                                "key": "October",
                                "title": "October"
                            }, {"key": "November", "title": "November"}, {"key": "December", "title": "December"}]
                        }
                    }, {
                        "filterGroup": false,
                        "collapse": true,
                        "filters": {
                            "key": "ucd-filters",
                            "title": "label.filter.ucd",
                            "queryKey": "",
                            "primary": false,
                            "value": [],
                            "groupBy": false,
                            "type": "label.filter.group.ucd",
                            "filterType": "conditions",
                            "groupOptions": [{
                                "key": "row",
                                "title": "Row",
                                "tooltip": "Select to view as rows on data table"
                            }, {"key": false, "title": "Off", "tooltip": "Select to hide on data table"}],
                            "autoCompleteOptions": [{
                                "key": "ucd-chapter-10",
                                "title": "label.filter.ucd.icd.chapter",
                                "queryKey": "ICD_10_code.path",
                                "primary": true,
                                "value": [],
                                "groupBy": false,
                                "type": "label.filter.group.ucd",
                                "groupKey": "ucd",
                                "autoCompleteOptions": [],
                                "aggregationKey": "ICD_10_code.code"
                            }]
                        },
                        "autoCompleteOptions": []
                    }, {
                        "filterGroup": false,
                        "collapse": true,
                        "filters": {
                            "key": "mcd-filters",
                            "title": "label.filter.mcd",
                            "queryKey": "",
                            "primary": false,
                            "value": [],
                            "groupBy": false,
                            "type": "label.filter.group.mcd",
                            "filterType": "conditions",
                            "groupOptions": [],
                            "autoCompleteOptions": [{
                                "key": "mcd-chapter-10",
                                "title": "label.filter.mcd.icd.chapter",
                                "queryKey": "record_axis_condn",
                                "primary": false,
                                "value": [],
                                "groupBy": false,
                                "type": "label.filter.group.mcd",
                                "groupKey": "mcd",
                                "autoCompleteOptions": [],
                                "disableFilter": true
                            }]
                        },
                        "autoCompleteOptions": []
                    }]
                });
                expect(JSON.parse(result.resultJSON)).to.eql({
                    "simple": {
                        "group_table_race": [{
                            "name": "White",
                            "deaths": 31771296,
                            "undefined": [{"name": "Female", "deaths": 16088007}, {"name": "Male", "deaths": 15683289}]
                        }, {
                            "name": "Black",
                            "deaths": 4374470,
                            "undefined": [{"name": "Male", "deaths": 2227092}, {"name": "Female", "deaths": 2147378}]
                        }, {
                            "name": "Asian or Pacific Islander",
                            "deaths": 703842,
                            "undefined": [{"name": "Male", "deaths": 367670}, {"name": "Female", "deaths": 336172}]
                        }, {
                            "name": "American Indian",
                            "deaths": 217181,
                            "undefined": [{"name": "Male", "deaths": 118412}, {"name": "Female", "deaths": 98769}]
                        }],
                        "group_chart_0_gender": [{
                            "name": "Female",
                            "deaths": 18670326,
                            "undefined": [{"name": "White", "deaths": 16088007}, {
                                "name": "Black",
                                "deaths": 2147378
                            }, {"name": "Asian or Pacific Islander", "deaths": 336172}, {
                                "name": "American Indian",
                                "deaths": 98769
                            }]
                        }, {
                            "name": "Male",
                            "deaths": 18396463,
                            "undefined": [{"name": "White", "deaths": 15683289}, {
                                "name": "Black",
                                "deaths": 2227092
                            }, {"name": "Asian or Pacific Islander", "deaths": 367670}, {
                                "name": "American Indian",
                                "deaths": 118412
                            }]
                        }]
                    },
                    "nested": {
                        "table": {
                            "race": [{
                                "name": "American Indian",
                                "deaths": 217181,
                                "gender": [{
                                    "name": "Female",
                                    "deaths": 98769,
                                    "pop": 28544528,
                                    "ageAdjustedRate": "557.9",
                                    "standardPop": 32250198
                                }, {
                                    "name": "Male",
                                    "deaths": 118412,
                                    "pop": 28645741,
                                    "ageAdjustedRate": "754.4",
                                    "standardPop": 32369216
                                }],
                                "pop": 57190269,
                                "ageAdjustedRate": "647.7",
                                "standardPop": 64619414
                            }, {
                                "name": "Asian or Pacific Islander",
                                "deaths": 703842,
                                "gender": [{
                                    "name": "Female",
                                    "deaths": 336172,
                                    "pop": 121309960,
                                    "ageAdjustedRate": "368.3",
                                    "standardPop": 137270512
                                }, {
                                    "name": "Male",
                                    "deaths": 367670,
                                    "pop": 112325576,
                                    "ageAdjustedRate": "524.1",
                                    "standardPop": 127115817
                                }],
                                "pop": 233635536,
                                "ageAdjustedRate": "435.2",
                                "standardPop": 264386329
                            }, {
                                "name": "Black",
                                "deaths": 4374470,
                                "gender": [{
                                    "name": "Female",
                                    "deaths": 2147378,
                                    "pop": 317237591,
                                    "ageAdjustedRate": "807.4",
                                    "standardPop": 359386608
                                }, {
                                    "name": "Male",
                                    "deaths": 2227092,
                                    "pop": 289840863,
                                    "ageAdjustedRate": "1,193.3",
                                    "standardPop": 328414017
                                }],
                                "pop": 607078454,
                                "ageAdjustedRate": "967.6",
                                "standardPop": 687800625
                            }, {
                                "name": "White",
                                "deaths": 31771296,
                                "gender": [{
                                    "name": "Female",
                                    "deaths": 16088007,
                                    "pop": 1828192603,
                                    "ageAdjustedRate": "660.1",
                                    "standardPop": 2070887962
                                }, {
                                    "name": "Male",
                                    "deaths": 15683289,
                                    "pop": 1787480522,
                                    "ageAdjustedRate": "922.5",
                                    "standardPop": 2024924546
                                }],
                                "pop": 3615673125,
                                "ageAdjustedRate": "777.0",
                                "standardPop": 4095812508
                            }]
                        },
                        "charts": [{
                            "gender": [{
                                "name": "Female",
                                "deaths": 18670326,
                                "race": [{"name": "White", "deaths": 16088007}, {
                                    "name": "Black",
                                    "deaths": 2147378
                                }, {"name": "Asian or Pacific Islander", "deaths": 336172}, {
                                    "name": "American Indian",
                                    "deaths": 98769
                                }]
                            }, {
                                "name": "Male",
                                "deaths": 18396463,
                                "race": [{"name": "White", "deaths": 15683289}, {
                                    "name": "Black",
                                    "deaths": 2227092
                                }, {"name": "Asian or Pacific Islander", "deaths": 367670}, {
                                    "name": "American Indian",
                                    "deaths": 118412
                                }]
                            }]
                        }],
                        "maps": {
                            "states": [{
                                "name": "VT",
                                "deaths": 743220,
                                "sex": [{"name": "Female", "deaths": 373872}, {"name": "Male", "deaths": 369348}]
                            }, {
                                "name": "UT",
                                "deaths": 743113,
                                "sex": [{"name": "Female", "deaths": 374276}, {"name": "Male", "deaths": 368837}]
                            }, {
                                "name": "MS",
                                "deaths": 742660,
                                "sex": [{"name": "Female", "deaths": 374468}, {"name": "Male", "deaths": 368192}]
                            }, {
                                "name": "SD",
                                "deaths": 742537,
                                "sex": [{"name": "Female", "deaths": 374284}, {"name": "Male", "deaths": 368253}]
                            }, {
                                "name": "TX",
                                "deaths": 742489,
                                "sex": [{"name": "Female", "deaths": 375056}, {"name": "Male", "deaths": 367433}]
                            }, {
                                "name": "NH",
                                "deaths": 742418,
                                "sex": [{"name": "Female", "deaths": 373966}, {"name": "Male", "deaths": 368452}]
                            }, {
                                "name": "CT",
                                "deaths": 742384,
                                "sex": [{"name": "Female", "deaths": 374351}, {"name": "Male", "deaths": 368033}]
                            }, {
                                "name": "MN",
                                "deaths": 742336,
                                "sex": [{"name": "Female", "deaths": 374023}, {"name": "Male", "deaths": 368313}]
                            }, {
                                "name": "MA",
                                "deaths": 742184,
                                "sex": [{"name": "Female", "deaths": 373656}, {"name": "Male", "deaths": 368528}]
                            }, {
                                "name": "NJ",
                                "deaths": 742155,
                                "sex": [{"name": "Female", "deaths": 374178}, {"name": "Male", "deaths": 367977}]
                            }, {
                                "name": "KS",
                                "deaths": 742152,
                                "sex": [{"name": "Female", "deaths": 373243}, {"name": "Male", "deaths": 368909}]
                            }, {
                                "name": "MI",
                                "deaths": 742038,
                                "sex": [{"name": "Female", "deaths": 374193}, {"name": "Male", "deaths": 367845}]
                            }, {
                                "name": "FL",
                                "deaths": 741992,
                                "sex": [{"name": "Female", "deaths": 373676}, {"name": "Male", "deaths": 368316}]
                            }, {
                                "name": "AL",
                                "deaths": 741929,
                                "sex": [{"name": "Female", "deaths": 373344}, {"name": "Male", "deaths": 368585}]
                            }, {
                                "name": "ID",
                                "deaths": 741860,
                                "sex": [{"name": "Female", "deaths": 373112}, {"name": "Male", "deaths": 368748}]
                            }, {
                                "name": "VA",
                                "deaths": 741767,
                                "sex": [{"name": "Female", "deaths": 373093}, {"name": "Male", "deaths": 368674}]
                            }, {
                                "name": "MO",
                                "deaths": 741757,
                                "sex": [{"name": "Female", "deaths": 373064}, {"name": "Male", "deaths": 368693}]
                            }, {
                                "name": "MD",
                                "deaths": 741750,
                                "sex": [{"name": "Female", "deaths": 373487}, {"name": "Male", "deaths": 368263}]
                            }, {
                                "name": "HI",
                                "deaths": 741645,
                                "sex": [{"name": "Female", "deaths": 373416}, {"name": "Male", "deaths": 368229}]
                            }, {
                                "name": "NE",
                                "deaths": 741627,
                                "sex": [{"name": "Female", "deaths": 373141}, {"name": "Male", "deaths": 368486}]
                            }, {
                                "name": "PA",
                                "deaths": 741617,
                                "sex": [{"name": "Female", "deaths": 373580}, {"name": "Male", "deaths": 368037}]
                            }, {
                                "name": "OR",
                                "deaths": 741571,
                                "sex": [{"name": "Female", "deaths": 373456}, {"name": "Male", "deaths": 368115}]
                            }, {
                                "name": "DE",
                                "deaths": 741566,
                                "sex": [{"name": "Female", "deaths": 373802}, {"name": "Male", "deaths": 367764}]
                            }, {
                                "name": "AZ",
                                "deaths": 741544,
                                "sex": [{"name": "Female", "deaths": 373573}, {"name": "Male", "deaths": 367971}]
                            }, {
                                "name": "LA",
                                "deaths": 741538,
                                "sex": [{"name": "Female", "deaths": 373121}, {"name": "Male", "deaths": 368417}]
                            }, {
                                "name": "OK",
                                "deaths": 741512,
                                "sex": [{"name": "Female", "deaths": 373688}, {"name": "Male", "deaths": 367824}]
                            }, {
                                "name": "AR",
                                "deaths": 741486,
                                "sex": [{"name": "Female", "deaths": 373740}, {"name": "Male", "deaths": 367746}]
                            }, {
                                "name": "ME",
                                "deaths": 741296,
                                "sex": [{"name": "Female", "deaths": 373225}, {"name": "Male", "deaths": 368071}]
                            }, {
                                "name": "MT",
                                "deaths": 741100,
                                "sex": [{"name": "Female", "deaths": 373419}, {"name": "Male", "deaths": 367681}]
                            }, {
                                "name": "WI",
                                "deaths": 741071,
                                "sex": [{"name": "Female", "deaths": 372801}, {"name": "Male", "deaths": 368270}]
                            }, {
                                "name": "OH",
                                "deaths": 741017,
                                "sex": [{"name": "Female", "deaths": 372743}, {"name": "Male", "deaths": 368274}]
                            }, {
                                "name": "WA",
                                "deaths": 741005,
                                "sex": [{"name": "Female", "deaths": 373774}, {"name": "Male", "deaths": 367231}]
                            }, {
                                "name": "ND",
                                "deaths": 740939,
                                "sex": [{"name": "Female", "deaths": 374078}, {"name": "Male", "deaths": 366861}]
                            }, {
                                "name": "IL",
                                "deaths": 740889,
                                "sex": [{"name": "Female", "deaths": 372932}, {"name": "Male", "deaths": 367957}]
                            }, {
                                "name": "WV",
                                "deaths": 740881,
                                "sex": [{"name": "Female", "deaths": 373497}, {"name": "Male", "deaths": 367384}]
                            }, {
                                "name": "IA",
                                "deaths": 740877,
                                "sex": [{"name": "Female", "deaths": 372861}, {"name": "Male", "deaths": 368016}]
                            }, {
                                "name": "TN",
                                "deaths": 740763,
                                "sex": [{"name": "Female", "deaths": 373820}, {"name": "Male", "deaths": 366943}]
                            }, {
                                "name": "SC",
                                "deaths": 740719,
                                "sex": [{"name": "Female", "deaths": 373608}, {"name": "Male", "deaths": 367111}]
                            }, {
                                "name": "WY",
                                "deaths": 740615,
                                "sex": [{"name": "Female", "deaths": 372664}, {"name": "Male", "deaths": 367951}]
                            }, {
                                "name": "NM",
                                "deaths": 740459,
                                "sex": [{"name": "Female", "deaths": 372710}, {"name": "Male", "deaths": 367749}]
                            }, {
                                "name": "NV",
                                "deaths": 740385,
                                "sex": [{"name": "Female", "deaths": 372231}, {"name": "Male", "deaths": 368154}]
                            }, {
                                "name": "NC",
                                "deaths": 740360,
                                "sex": [{"name": "Female", "deaths": 373201}, {"name": "Male", "deaths": 367159}]
                            }, {
                                "name": "AK",
                                "deaths": 740313,
                                "sex": [{"name": "Female", "deaths": 373515}, {"name": "Male", "deaths": 366798}]
                            }, {
                                "name": "CO",
                                "deaths": 740308,
                                "sex": [{"name": "Female", "deaths": 372596}, {"name": "Male", "deaths": 367712}]
                            }, {
                                "name": "NY",
                                "deaths": 740238,
                                "sex": [{"name": "Female", "deaths": 373500}, {"name": "Male", "deaths": 366738}]
                            }, {
                                "name": "CA",
                                "deaths": 740134,
                                "sex": [{"name": "Female", "deaths": 371845}, {"name": "Male", "deaths": 368289}]
                            }, {
                                "name": "RI",
                                "deaths": 740085,
                                "sex": [{"name": "Female", "deaths": 372920}, {"name": "Male", "deaths": 367165}]
                            }, {
                                "name": "GA",
                                "deaths": 739847,
                                "sex": [{"name": "Female", "deaths": 372147}, {"name": "Male", "deaths": 367700}]
                            }, {
                                "name": "IN",
                                "deaths": 739448,
                                "sex": [{"name": "Female", "deaths": 372114}, {"name": "Male", "deaths": 367334}]
                            }, {
                                "name": "KY",
                                "deaths": 739193,
                                "sex": [{"name": "Female", "deaths": 373266}, {"name": "Male", "deaths": 365927}]
                            }]
                        }
                    }
                });
                expect(JSON.parse(result.sideFilterResults)).to.eql({
                    "data": {
                        "simple": {
                            "placeofdeath": [{
                                "name": "Hospital, clinic or Medical Center - Inpatient",
                                "deaths": 13079218
                            }, {"name": "Decedent's home", "deaths": 9531295}, {
                                "name": "Nursing home/long term care",
                                "deaths": 7940085
                            }, {
                                "name": "Hospital, Clinic or Medical Center - Outpatient or admitted to Emergency Room",
                                "deaths": 2633673
                            }, {"name": "Other", "deaths": 2273247}, {
                                "name": "Hospice facility",
                                "deaths": 1091501
                            }, {
                                "name": "Hospital, Clinic or Medical Center - Dead on Arrival",
                                "deaths": 316703
                            }, {
                                "name": "Place of death unknown",
                                "deaths": 165470
                            }, {
                                "name": "Hospital, Clinic or Medical Center - Patient status unknown",
                                "deaths": 35597
                            }],
                            "hispanicOrigin": [{"name": "Non–Hispanic", "deaths": 34926053}, {
                                "name": "Mexican",
                                "deaths": 1155470
                            }, {"name": "Puerto Rican", "deaths": 260772}, {
                                "name": "Other Hispanic",
                                "deaths": 213544
                            }, {"name": "Cuban", "deaths": 197080}, {
                                "name": "Unknown",
                                "deaths": 94819
                            }, {"name": "Central American", "deaths": 74461}, {
                                "name": "Central and South American",
                                "deaths": 63457
                            }, {"name": "South American", "deaths": 41511}, {
                                "name": "Dominican",
                                "deaths": 29494
                            }, {"name": "Spaniard", "deaths": 5971}, {"name": "Latin American", "deaths": 4157}],
                            "race": [{"name": "White", "deaths": 31771296}, {
                                "name": "Black",
                                "deaths": 4374470
                            }, {"name": "Asian or Pacific Islander", "deaths": 703842}, {
                                "name": "American Indian",
                                "deaths": 217181
                            }],
                            "gender": [{"name": "Female", "deaths": 18670326}, {"name": "Male", "deaths": 18396463}],
                            "month": [{"name": "January", "deaths": 3464050}, {
                                "name": "December",
                                "deaths": 3345731
                            }, {"name": "March", "deaths": 3314583}, {
                                "name": "February",
                                "deaths": 3109668
                            }, {"name": "October", "deaths": 3068160}, {
                                "name": "April",
                                "deaths": 3056378
                            }, {"name": "November", "deaths": 3055392}, {"name": "May", "deaths": 3038446}, {
                                "name": "July",
                                "deaths": 2941181
                            }, {"name": "August", "deaths": 2925163}, {"name": "June", "deaths": 2878725}, {
                                "name": "September",
                                "deaths": 2869312
                            }],
                            "year": [{"name": "2014", "deaths": 2626418}, {"name": "2013", "deaths": 2596993}, {
                                "name": "2012",
                                "deaths": 2543279
                            }, {"name": "2011", "deaths": 2515458}, {"name": "2008", "deaths": 2471984}, {
                                "name": "2010",
                                "deaths": 2468435
                            }, {"name": "2003", "deaths": 2448288}, {"name": "2005", "deaths": 2448017}, {
                                "name": "2002",
                                "deaths": 2443387
                            }, {"name": "2009", "deaths": 2437163}, {"name": "2006", "deaths": 2426264}, {
                                "name": "2007",
                                "deaths": 2423712
                            }, {"name": "2001", "deaths": 2416425}, {"name": "2000", "deaths": 2403351}, {
                                "name": "2004",
                                "deaths": 2397615
                            }],
                            "weekday": [{"name": "Saturday", "deaths": 5367503}, {
                                "name": "Friday",
                                "deaths": 5344867
                            }, {"name": "Monday", "deaths": 5300217}, {
                                "name": "Thursday",
                                "deaths": 5266918
                            }, {"name": "Wednesday", "deaths": 5266837}, {
                                "name": "Tuesday",
                                "deaths": 5262950
                            }, {"name": "Sunday", "deaths": 5256353}, {"name": "Unknown", "deaths": 1144}],
                            "ucd-filters": [],
                            "mcd-filters": [],
                            "autopsy": [{"name": "No", "deaths": 24174400}, {
                                "name": "Unknown",
                                "deaths": 3314646
                            }, {"name": "Yes", "deaths": 2314576}],
                            "agegroup": [{"name": "80-84years", "deaths": 5435697}, {
                                "name": "85-89years",
                                "deaths": 5428786
                            }, {"name": "75-79years", "deaths": 4471378}, {
                                "name": "90-94years",
                                "deaths": 3755974
                            }, {"name": "70-74years", "deaths": 3472174}, {
                                "name": "65-69years",
                                "deaths": 2796964
                            }, {"name": "60-64years", "deaths": 2378520}, {
                                "name": "55-59years",
                                "deaths": 1980982
                            }, {"name": "50-54years", "deaths": 1569719}, {
                                "name": "95-99years",
                                "deaths": 1476328
                            }, {"name": "45-49years", "deaths": 1112465}, {
                                "name": "40-44years",
                                "deaths": 727998
                            }, {"name": "0-4years", "deaths": 467671}, {
                                "name": "35-39years",
                                "deaths": 467563
                            }, {"name": "30-34years", "deaths": 342647}, {
                                "name": "100 years and over",
                                "deaths": 312742
                            }, {"name": "25-29years", "deaths": 298474}, {
                                "name": "20-24years",
                                "deaths": 291468
                            }, {"name": "15-19years", "deaths": 183520}, {
                                "name": "10-14years",
                                "deaths": 51759
                            }, {"name": "5-9years", "deaths": 40357}, {"name": "Age not started", "deaths": 3603}]
                        }, "nested": {"table": {}, "charts": [], "maps": {}}
                    }, "pagination": {"total": 37066789}
                });
            });
            done();
        });
    });
})