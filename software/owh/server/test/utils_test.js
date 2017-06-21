var searchUtils = require("../api/utils");
var expect = require("expect.js");
var stdBeforeSuppressionData = require('./data/std_before_suppression_data.json');
var stdAfterSuppressionData = require('./data/std_after_suppression_data.json');

describe("Utils", function(){
    it("Populate results with mappings with aggregation data", function(done){
        var response = {"took":592,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":2630800,"max_score":0,"hits":[]},"aggregations":{"group_table_hispanicOrigin":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"100-199","doc_count":2451125,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"M","doc_count":1232427,"group_table_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"1","doc_count":1036703},{"key":"2","doc_count":155000},{"key":"4","doc_count":31376},{"key":"-9","doc_count":9348}]}},{"key":"F","doc_count":1218698,"group_table_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"1","doc_count":1032222},{"key":"2","doc_count":149107},{"key":"4","doc_count":29566},{"key":"3","doc_count":7803}]}}]}},{"key":"210-219","doc_count":96451,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"M","doc_count":54314,"group_table_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"1","doc_count":53574},{"key":"2","doc_count":305},{"key":"3","doc_count":298},{"key":"4","doc_count":137}]}},{"key":"F","doc_count":42137,"group_table_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"1","doc_count":41619},{"key":"2","doc_count":234},{"key":"3","doc_count":214},{"key":"4","doc_count":70}]}}]}}]},"group_maps_0_states":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"NY","doc_count":53107,"group_maps_0_sex":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"M","doc_count":27003},{"key":"F","doc_count":26104}]}},{"key":"MT","doc_count":53060,"group_maps_0_sex":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"M","doc_count":26800},{"key":"F","doc_count":26260}]}}]},"group_chart_0_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"M","doc_count":1331232,"group_chart_0_hispanicOrigin":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"100-199","doc_count":1232427},{"key":"210-219","doc_count":54314},{"key":"260-269","doc_count":11893},{"key":"280-299","doc_count":8342},{"key":"270-274","doc_count":7832},{"key":"996-999","doc_count":5552},{"key":"221-230","doc_count":3902},{"key":"231-249","doc_count":3052},{"key":"275-279","doc_count":1885},{"key":"220","doc_count":1295},{"key":"250-259","doc_count":394},{"key":"200-209","doc_count":344}]}},{"key":"F","doc_count":1299568,"group_chart_0_hispanicOrigin":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"100-199","doc_count":1218698},{"key":"210-219","doc_count":42137},{"key":"260-269","doc_count":9937},{"key":"270-274","doc_count":7473},{"key":"280-299","doc_count":7222},{"key":"221-230","doc_count":3677},{"key":"996-999","doc_count":3547},{"key":"231-249","doc_count":3057},{"key":"275-279","doc_count":1978},{"key":"220","doc_count":1191},{"key":"250-259","doc_count":357},{"key":"200-209","doc_count":294}]}}]}}}
        var result = searchUtils.populateDataWithMappings(response, 'deaths');
        expect(result).to.have.property('data');
        expect(result.data).to.have.property('simple');
        expect(result.data).to.have.property('nested');
        expect(result.data.nested).to.have.property('table');
        expect(result.data.nested).to.have.property('charts');
        expect(result.data.nested).to.have.property('maps');
        expect(result.data.nested.maps).to.have.property('states');
        expect(result.data.simple).to.have.property('group_table_hispanicOrigin');
        expect(result.data.simple).to.have.property('group_chart_0_gender');
        done()
    });

    it("Populate results with mappings without aggregation data", function(done){
        var response = { "took": 592, "timed_out": false, "_shards": { "total": 5, "successful": 5, "failed": 0 }, "hits": {
            "total": 2630800, "max_score": 0, "hits": [] }};
        var result = searchUtils.populateDataWithMappings(response, 'deaths');
        expect(result).to.have.property('data');
        expect(result.data).to.have.property('simple');
        expect(result.data).to.have.property('nested');
        expect(result.data.nested).to.have.property('table');
        expect(result.data.nested).to.have.property('charts');
        expect(result.data.nested).to.have.property('maps');
        done()
    });

    it('Populate results with populations for multiple row headers', function(done) {
        var response = {hits: {total: 420000}, aggregations: {"group_table_race": {"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"1","doc_count":245616,"group_table_year":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"2010","doc_count":35088,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":17544,"pop":{"value":240819728}},{"key":"M","doc_count":17544,"pop":{"value":235720766}}]}},{"key":"2002","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":118338604}},{"key":"M","doc_count":8772,"pop":{"value":115381931}}]}},{"key":"2003","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":119049621}},{"key":"M","doc_count":8772,"pop":{"value":116075451}}]}},{"key":"2004","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":119757684}},{"key":"M","doc_count":8772,"pop":{"value":116912350}}]}},{"key":"2005","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":120479718}},{"key":"M","doc_count":8772,"pop":{"value":117707377}}]}},{"key":"2006","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":121250204}},{"key":"M","doc_count":8772,"pop":{"value":118555067}}]}},{"key":"2007","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":122027092}},{"key":"M","doc_count":8772,"pop":{"value":119363736}}]}},{"key":"2008","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":122797904}},{"key":"M","doc_count":8772,"pop":{"value":120168475}}]}},{"key":"2009","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":123505997}},{"key":"M","doc_count":8772,"pop":{"value":120882836}}]}},{"key":"2011","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":124776073}},{"key":"M","doc_count":8772,"pop":{"value":122229817}}]}},{"key":"2012","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":125351010}},{"key":"M","doc_count":8772,"pop":{"value":122889479}}]}},{"key":"2013","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":125890706}},{"key":"M","doc_count":8772,"pop":{"value":123494420}}]}},{"key":"2014","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":126484060}},{"key":"M","doc_count":8772,"pop":{"value":124132221}}]}}]}},{"key":"2","doc_count":245616,"group_table_year":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"2010","doc_count":35088,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":17544,"pop":{"value":43470275}},{"key":"M","doc_count":17544,"pop":{"value":39891409}}]}},{"key":"2002","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":19770726}},{"key":"M","doc_count":8772,"pop":{"value":17977698}}]}},{"key":"2003","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":20015421}},{"key":"M","doc_count":8772,"pop":{"value":18194320}}]}},{"key":"2004","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":20277329}},{"key":"M","doc_count":8772,"pop":{"value":18461469}}]}},{"key":"2005","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":20551032}},{"key":"M","doc_count":8772,"pop":{"value":18729699}}]}},{"key":"2006","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":20840468}},{"key":"M","doc_count":8772,"pop":{"value":19016639}}]}},{"key":"2007","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":21142428}},{"key":"M","doc_count":8772,"pop":{"value":19308680}}]}},{"key":"2008","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":21446016}},{"key":"M","doc_count":8772,"pop":{"value":19602943}}]}},{"key":"2009","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":21744516}},{"key":"M","doc_count":8772,"pop":{"value":19887934}}]}},{"key":"2011","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":22288313}},{"key":"M","doc_count":8772,"pop":{"value":20434584}}]}},{"key":"2012","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":22547175}},{"key":"M","doc_count":8772,"pop":{"value":20705129}}]}},{"key":"2013","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":22804565}},{"key":"M","doc_count":8772,"pop":{"value":20967558}}]}},{"key":"2014","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":23075345}},{"key":"M","doc_count":8772,"pop":{"value":21240749}}]}}]}},{"key":"3","doc_count":245616,"group_table_year":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"2010","doc_count":35088,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":17544,"pop":{"value":4183319}},{"key":"M","doc_count":17544,"pop":{"value":4221568}}]}},{"key":"2002","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":1604289}},{"key":"M","doc_count":8772,"pop":{"value":1598182}}]}},{"key":"2003","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":1659114}},{"key":"M","doc_count":8772,"pop":{"value":1652897}}]}},{"key":"2004","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":1716767}},{"key":"M","doc_count":8772,"pop":{"value":1712685}}]}},{"key":"2005","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":1778645}},{"key":"M","doc_count":8772,"pop":{"value":1775711}}]}},{"key":"2006","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":1843293}},{"key":"M","doc_count":8772,"pop":{"value":1844390}}]}},{"key":"2007","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":1911949}},{"key":"M","doc_count":8772,"pop":{"value":1917949}}]}},{"key":"2008","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":1986553}},{"key":"M","doc_count":8772,"pop":{"value":1997376}}]}},{"key":"2009","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":2062396}},{"key":"M","doc_count":8772,"pop":{"value":2078819}}]}},{"key":"2011","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":2156254}},{"key":"M","doc_count":8772,"pop":{"value":2176377}}]}},{"key":"2012","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":2186915}},{"key":"M","doc_count":8772,"pop":{"value":2206836}}]}},{"key":"2013","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":2216645}},{"key":"M","doc_count":8772,"pop":{"value":2236369}}]}},{"key":"2014","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":2248348}},{"key":"M","doc_count":8772,"pop":{"value":2267184}}]}}]}},{"key":"4","doc_count":245616,"group_table_year":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"2010","doc_count":35088,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":17544,"pop":{"value":17120081}},{"key":"M","doc_count":17544,"pop":{"value":15922488}}]}},{"key":"2002","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":6681015}},{"key":"M","doc_count":8772,"pop":{"value":6272748}}]}},{"key":"2003","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":6954880}},{"key":"M","doc_count":8772,"pop":{"value":6506229}}]}},{"key":"2004","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":7225506}},{"key":"M","doc_count":8772,"pop":{"value":6741508}}]}},{"key":"2005","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":7510126}},{"key":"M","doc_count":8772,"pop":{"value":6984291}}]}},{"key":"2006","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":7798682}},{"key":"M","doc_count":8772,"pop":{"value":7231169}}]}},{"key":"2007","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":8084884}},{"key":"M","doc_count":8772,"pop":{"value":7474489}}]}},{"key":"2008","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":8373542}},{"key":"M","doc_count":8772,"pop":{"value":7721157}}]}},{"key":"2009","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":8651166}},{"key":"M","doc_count":8772,"pop":{"value":7957865}}]}},{"key":"2011","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":9206445}},{"key":"M","doc_count":8772,"pop":{"value":8450994}}]}},{"key":"2012","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":9496446}},{"key":"M","doc_count":8772,"pop":{"value":8719633}}]}},{"key":"2013","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":9808709}},{"key":"M","doc_count":8772,"pop":{"value":9008423}}]}},{"key":"2014","doc_count":17544,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"F","doc_count":8772,"pop":{"value":10144311}},{"key":"M","doc_count":8772,"pop":{"value":9315183}}]}}]}}]}}};
        var expectedResult = {data: {nested: {table: {"race":[{"name":"1","pop":3384042327,"year":[{"name":"2010","pop":476540494,"gender":[{"name":"F","pop":240819728},{"name":"M","pop":235720766}]},{"name":"2002","pop":233720535,"gender":[{"name":"F","pop":118338604},{"name":"M","pop":115381931}]},{"name":"2003","pop":235125072,"gender":[{"name":"F","pop":119049621},{"name":"M","pop":116075451}]},{"name":"2004","pop":236670034,"gender":[{"name":"F","pop":119757684},{"name":"M","pop":116912350}]},{"name":"2005","pop":238187095,"gender":[{"name":"F","pop":120479718},{"name":"M","pop":117707377}]},{"name":"2006","pop":239805271,"gender":[{"name":"F","pop":121250204},{"name":"M","pop":118555067}]},{"name":"2007","pop":241390828,"gender":[{"name":"F","pop":122027092},{"name":"M","pop":119363736}]},{"name":"2008","pop":242966379,"gender":[{"name":"F","pop":122797904},{"name":"M","pop":120168475}]},{"name":"2009","pop":244388833,"gender":[{"name":"F","pop":123505997},{"name":"M","pop":120882836}]},{"name":"2011","pop":247005890,"gender":[{"name":"F","pop":124776073},{"name":"M","pop":122229817}]},{"name":"2012","pop":248240489,"gender":[{"name":"F","pop":125351010},{"name":"M","pop":122889479}]},{"name":"2013","pop":249385126,"gender":[{"name":"F","pop":125890706},{"name":"M","pop":123494420}]},{"name":"2014","pop":250616281,"gender":[{"name":"F","pop":126484060},{"name":"M","pop":124132221}]}]},{"name":"2","pop":574392420,"year":[{"name":"2010","pop":83361684,"gender":[{"name":"F","pop":43470275},{"name":"M","pop":39891409}]},{"name":"2002","pop":37748424,"gender":[{"name":"F","pop":19770726},{"name":"M","pop":17977698}]},{"name":"2003","pop":38209741,"gender":[{"name":"F","pop":20015421},{"name":"M","pop":18194320}]},{"name":"2004","pop":38738798,"gender":[{"name":"F","pop":20277329},{"name":"M","pop":18461469}]},{"name":"2005","pop":39280731,"gender":[{"name":"F","pop":20551032},{"name":"M","pop":18729699}]},{"name":"2006","pop":39857107,"gender":[{"name":"F","pop":20840468},{"name":"M","pop":19016639}]},{"name":"2007","pop":40451108,"gender":[{"name":"F","pop":21142428},{"name":"M","pop":19308680}]},{"name":"2008","pop":41048959,"gender":[{"name":"F","pop":21446016},{"name":"M","pop":19602943}]},{"name":"2009","pop":41632450,"gender":[{"name":"F","pop":21744516},{"name":"M","pop":19887934}]},{"name":"2011","pop":42722897,"gender":[{"name":"F","pop":22288313},{"name":"M","pop":20434584}]},{"name":"2012","pop":43252304,"gender":[{"name":"F","pop":22547175},{"name":"M","pop":20705129}]},{"name":"2013","pop":43772123,"gender":[{"name":"F","pop":22804565},{"name":"M","pop":20967558}]},{"name":"2014","pop":44316094,"gender":[{"name":"F","pop":23075345},{"name":"M","pop":21240749}]}]},{"name":"3","pop":55240830,"year":[{"name":"2010","pop":8404887,"gender":[{"name":"F","pop":4183319},{"name":"M","pop":4221568}]},{"name":"2002","pop":3202471,"gender":[{"name":"F","pop":1604289},{"name":"M","pop":1598182}]},{"name":"2003","pop":3312011,"gender":[{"name":"F","pop":1659114},{"name":"M","pop":1652897}]},{"name":"2004","pop":3429452,"gender":[{"name":"F","pop":1716767},{"name":"M","pop":1712685}]},{"name":"2005","pop":3554356,"gender":[{"name":"F","pop":1778645},{"name":"M","pop":1775711}]},{"name":"2006","pop":3687683,"gender":[{"name":"F","pop":1843293},{"name":"M","pop":1844390}]},{"name":"2007","pop":3829898,"gender":[{"name":"F","pop":1911949},{"name":"M","pop":1917949}]},{"name":"2008","pop":3983929,"gender":[{"name":"F","pop":1986553},{"name":"M","pop":1997376}]},{"name":"2009","pop":4141215,"gender":[{"name":"F","pop":2062396},{"name":"M","pop":2078819}]},{"name":"2011","pop":4332631,"gender":[{"name":"F","pop":2156254},{"name":"M","pop":2176377}]},{"name":"2012","pop":4393751,"gender":[{"name":"F","pop":2186915},{"name":"M","pop":2206836}]},{"name":"2013","pop":4453014,"gender":[{"name":"F","pop":2216645},{"name":"M","pop":2236369}]},{"name":"2014","pop":4515532,"gender":[{"name":"F","pop":2248348},{"name":"M","pop":2267184}]}]},{"name":"4","pop":225361970,"year":[{"name":"2010","pop":33042569,"gender":[{"name":"F","pop":17120081},{"name":"M","pop":15922488}]},{"name":"2002","pop":12953763,"gender":[{"name":"F","pop":6681015},{"name":"M","pop":6272748}]},{"name":"2003","pop":13461109,"gender":[{"name":"F","pop":6954880},{"name":"M","pop":6506229}]},{"name":"2004","pop":13967014,"gender":[{"name":"F","pop":7225506},{"name":"M","pop":6741508}]},{"name":"2005","pop":14494417,"gender":[{"name":"F","pop":7510126},{"name":"M","pop":6984291}]},{"name":"2006","pop":15029851,"gender":[{"name":"F","pop":7798682},{"name":"M","pop":7231169}]},{"name":"2007","pop":15559373,"gender":[{"name":"F","pop":8084884},{"name":"M","pop":7474489}]},{"name":"2008","pop":16094699,"gender":[{"name":"F","pop":8373542},{"name":"M","pop":7721157}]},{"name":"2009","pop":16609031,"gender":[{"name":"F","pop":8651166},{"name":"M","pop":7957865}]},{"name":"2011","pop":17657439,"gender":[{"name":"F","pop":9206445},{"name":"M","pop":8450994}]},{"name":"2012","pop":18216079,"gender":[{"name":"F","pop":9496446},{"name":"M","pop":8719633}]},{"name":"2013","pop":18817132,"gender":[{"name":"F","pop":9808709},{"name":"M","pop":9008423}]},{"name":"2014","pop":19459494,"gender":[{"name":"F","pop":10144311},{"name":"M","pop":9315183}]}]}]}}}};
        var result = searchUtils.populateDataWithMappings(response, 'pop');
        expect(JSON.stringify(result.data.nested.table)).equal(JSON.stringify(expectedResult.data.nested.table));
        done();
    });

    it('Merge age adjusted death rates', function(done) {
        var wonderResponse = { 'American Indian or Alaska Native':
            { Female: { ageAdjustedRate: '562.5' },
                Male: { ageAdjustedRate: '760.8' },
                Total: { ageAdjustedRate: '652.8' } },
            'Asian or Pacific Islander':
                { Female: { ageAdjustedRate: '371.3' },
                    Male: { ageAdjustedRate: '530.0' },
                    Total: { ageAdjustedRate: '439.3' } },
            'Black or African American':
                { Female: { ageAdjustedRate: '814.8' },
                    Male: { ageAdjustedRate: '1,205.6' },
                    Total: { ageAdjustedRate: '976.7' } },
            White:
                { Female: { ageAdjustedRate: '662.5' },
                    Male: { ageAdjustedRate: '927.0' },
                    Total: { ageAdjustedRate: '780.1' } },
            Total: { ageAdjustedRate: '789.7' }
        };

        var mortalityResponse = {"race":[{"name":"American Indian","deaths":217457,"gender":[{"name":"Female","deaths":98841,"pop":28544528},{"name":"Male","deaths":118616,"pop":28645741}],"pop":57190269},{"name":"Asian or Pacific Islander","deaths":710612,"gender":[{"name":"Female","deaths":338606,"pop":121309960},{"name":"Male","deaths":372006,"pop":112325576}],"pop":233635536},{"name":"Black","deaths":4381340,"gender":[{"name":"Female","deaths":2150095,"pop":317237591},{"name":"Male","deaths":2231245,"pop":289840863}],"pop":607078454},{"name":"White","deaths":31820569,"gender":[{"name":"Female","deaths":16104129,"pop":1828192603},{"name":"Male","deaths":15716440,"pop":1787480522}],"pop":3615673125}]};
        var result = {"race":[{"name":"American Indian","deaths":217457,"gender":[{"name":"Female","deaths":98841,"pop":28544528,"ageAdjustedRate":"562.5"},{"name":"Male","deaths":118616,"pop":28645741,"ageAdjustedRate":"760.8"}],"pop":57190269,"ageAdjustedRate":"652.8"},{"name":"Asian or Pacific Islander","deaths":710612,"gender":[{"name":"Female","deaths":338606,"pop":121309960,"ageAdjustedRate":"371.3"},{"name":"Male","deaths":372006,"pop":112325576,"ageAdjustedRate":"530.0"}],"pop":233635536,"ageAdjustedRate":"439.3"},{"name":"Black","deaths":4381340,"gender":[{"name":"Female","deaths":2150095,"pop":317237591,"ageAdjustedRate":"814.8"},{"name":"Male","deaths":2231245,"pop":289840863,"ageAdjustedRate":"1,205.6"}],"pop":607078454,"ageAdjustedRate":"976.7"},{"name":"White","deaths":31820569,"gender":[{"name":"Female","deaths":16104129,"pop":1828192603,"ageAdjustedRate":"662.5"},{"name":"Male","deaths":15716440,"pop":1787480522,"ageAdjustedRate":"927.0"}],"pop":3615673125,"ageAdjustedRate":"780.1"}]};
        searchUtils.mergeAgeAdjustedRates(mortalityResponse, wonderResponse);
        expect(JSON.stringify(mortalityResponse)).equal(JSON.stringify(result));
        done();

    });

    it("Apply suppression rules", function (done) {
        var result  ={"data":{"nested":{"table":{"race":[{"name":"American Indian","deaths":19016,"hispanicOrigin":[{"name":"Central American","deaths":20,"gender":[{"name":"Male","deaths":15},{"name":"Female","deaths":5}]},{"name":"Non-Hispanic","deaths":18039,"gender":[{"name":"Male","deaths":9869},{"name":"Female","deaths":8170}]}]},{"name":"Asian or Pacific Islander","deaths":66681,"hispanicOrigin":[{"name":"Central American","deaths":72,"gender":[{"name":"Male","deaths":39},{"name":"Female","deaths":33}]},{"name":"Non-Hispanic","deaths":65277,"gender":[{"name":"Male","deaths":33306},{"name":"Female","deaths":31971}]}]},{"name":"Black","deaths":320072,"hispanicOrigin":[{"name":"Central American","deaths":475,"gender":[{"name":"Female","deaths":250},{"name":"Male","deaths":225}]},{"name":"Non-Hispanic","deaths":315254,"gender":[{"name":"Male","deaths":161850},{"name":"Female","deaths":153404}]}]}]},"charts":[{"race":[{"name":"White","deaths":2306861,"hispanicOrigin":[{"name":"Non-Hispanic","deaths":2123631},{"name":"Central American","deaths":8499}]},{"name":"Black","deaths":320072,"hispanicOrigin":[{"name":"Non-Hispanic","deaths":315254},{"name":"Spaniard","deaths":3}]}]},{"gender":[{"name":"Male","deaths":1373404,"race":[{"name":"White","deaths":1164176},{"name":"Black","deaths":164670}]},{"name":"Female","deaths":1339226,"race":[{"name":"White","deaths":1142685},{"name":"Black","deaths":155402}]}]},{"gender":[{"name":"Male","deaths":1269021,"hispanicOrigin":[{"name":"Non-Hispanic","deaths":1268730},{"name":"Central and South American","deaths":291}]},{"name":"Female","deaths":1339226,"hispanicOrigin":[{"name":"Non-Hispanic","deaths":1253471},{"name":"South American","deaths":3613},{"name":"Central and South American","deaths":276}]}]}],"maps":{"states":[{"name":"CA","deaths":259206,"sex":[{"name":"Male","deaths":133082},{"name":"Female","deaths":126124}]},{"name":"FL","deaths":191737,"sex":[{"name":"Male","deaths":100739},{"name":"Female","deaths":90998}]},{"name":"TX","deaths":189654,"sex":[{"name":"Male","deaths":98119},{"name":"Female","deaths":91535}]}]}}},"pagination":{"total":2712630}}

        searchUtils.applySuppressions(result, 'deaths');
        //for table data initialize suppressed counts to 'suppressed'
        expect(result.data.nested.table.race[0].hispanicOrigin[0].deaths).equal('suppressed');
        expect(result.data.nested.table.race[0].hispanicOrigin[0].gender[1].deaths).equal('suppressed');
        //for chart initialize suppressed counts to 0
        expect(result.data.nested.charts[0].race[1].hispanicOrigin[1].deaths).equal(0);
        done();

    });

    it("Apply suppression rules for yrbs basic search", function (done) {
        var data  = {
            "table": {
                "question": [
                    {
                        "name": "qn10",
                        "race": [
                            {
                                "name": "Am Indian / Alaska Native",
                                "mental_health": {
                                    "mean": "25.3",
                                    "ci_l": "16.8",
                                    "ci_u": "36.2",
                                    "count": 161
                                }
                            },
                            {
                                "name": "Hispanic/Latino",
                                "mental_health": {
                                    "mean": "26.2",
                                    "ci_l": "24.4",
                                    "ci_u": "28.2",
                                    "count": 5101
                                }
                            },
                            {
                                "name": "Native Hawaiian/other PI",
                                "mental_health": {
                                    "mean": "0",
                                    "ci_l": "0",
                                    "ci_u": "0",
                                    "count": 97
                                }
                            },
                            {
                                "name": "Multiple - Non-Hispanic",
                                "mental_health": {
                                    "mean": "19.6",
                                    "ci_l": "15.7",
                                    "ci_u": "24.2",
                                    "count": 738
                                }
                            },
                            {
                                "name": "Black or African American",
                                "mental_health": {
                                    "mean": "21.1",
                                    "ci_l": "17.2",
                                    "ci_u": "25.6",
                                    "count": 1655
                                }
                            },
                            {
                                "name": "White",
                                "mental_health": {
                                    "mean": "17.7",
                                    "ci_l": "15.9",
                                    "ci_u": "19.6",
                                    "count": 6837
                                }
                            },
                            {
                                "name": "Asian",
                                "mental_health": {
                                    "mean": "11.2",
                                    "ci_l": "7.8",
                                    "ci_u": "15.8",
                                    "count": 625
                                }
                            }
                        ],
                        "mental_health": {
                            "mean": "20.0",
                            "ci_l": "18.4",
                            "ci_u": "21.6",
                            "count": 15555
                        }
                    },
                    {
                        "name": "qn11",
                        "race": [
                            {
                                "name": "Native Hawaiian/other PI",
                                "mental_health": {
                                    "mean": "0",
                                    "ci_l": "0",
                                    "ci_u": "0",
                                    "count": 46
                                }
                            },
                            {
                                "name": "Multiple - Non-Hispanic",
                                "mental_health": {
                                    "mean": "8.3",
                                    "ci_l": "5.1",
                                    "ci_u": "13.2",
                                    "count": 381
                                }
                            },
                            {
                                "name": "Black or African American",
                                "mental_health": {
                                    "mean": "6.9",
                                    "ci_l": "5.2",
                                    "ci_u": "9.1",
                                    "count": 748
                                }
                            },
                            {
                                "name": "Asian",
                                "mental_health": {
                                    "mean": "5.4",
                                    "ci_l": "2.7",
                                    "ci_u": "10.8",
                                    "count": 277
                                }
                            },
                            {
                                "name": "White",
                                "mental_health": {
                                    "mean": "7.4",
                                    "ci_l": "5.9",
                                    "ci_u": "9.3",
                                    "count": 4145
                                }
                            },
                            {
                                "name": "Hispanic/Latino",
                                "mental_health": {
                                    "mean": "9.4",
                                    "ci_l": "7.8",
                                    "ci_u": "11.3",
                                    "count": 2584
                                }
                            },
                            {
                                "name": "Am Indian / Alaska Native",
                                "mental_health": {
                                    "mean": "0",
                                    "ci_l": "0",
                                    "ci_u": "0",
                                    "count": 92
                                }
                            }
                        ],
                        "mental_health": {
                            "mean": "7.8",
                            "ci_l": "6.8",
                            "ci_u": "9.0",
                            "count": 8432
                        }
                    }
                ]
            }
        };

        searchUtils.applyYRBSSuppressions({data: data.table.question}, 'count', 'mean', false);
        expect(data.table.question[0].race[2].mental_health.mean).equal('suppressed');
        expect(data.table.question[0].race[2].mental_health.count).equal(97);
        expect(data.table.question[1].race[0].mental_health.mean).equal('suppressed');
        expect(data.table.question[1].race[0].mental_health.count).equal(46);
        done();

    });

    it("Apply suppression rules for yrbs advanced search", function (done) {
        var data  = {
            "table": {
                "question": [
                    {
                        "name": "qn10",
                        "mental_health": {
                            "mean": "20.0",
                            "ci_l": "18.3",
                            "ci_u": "21.8",
                            "count": 12914
                        },
                        "sexpart": [
                            {
                                "name": "Same sex only",
                                "mental_health": {
                                    "mean": "43.5",
                                    "ci_l": "23.8",
                                    "ci_u": "65.4",
                                    "count": 65
                                },
                                "race": [
                                    {
                                        "name": "Multiple - Non-Hispanic",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 2
                                        }
                                    },
                                    {
                                        "name": "Native Hawaiian/other PI",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 0
                                        }
                                    },
                                    {
                                        "name": "Asian",
                                        "mental_health": {
                                            "mean": "20.2",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 3
                                        }
                                    },
                                    {
                                        "name": "White",
                                        "mental_health": {
                                            "mean": "17.7",
                                            "ci_l": "0.5",
                                            "ci_u": "90.3",
                                            "count": 17
                                        }
                                    },
                                    {
                                        "name": "Hispanic/Latino",
                                        "mental_health": {
                                            "mean": "50.9",
                                            "ci_l": "14.8",
                                            "ci_u": "86.0",
                                            "count": 23
                                        }
                                    },
                                    {
                                        "name": "Am Indian / Alaska Native",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 0
                                        }
                                    },
                                    {
                                        "name": "Black or African American",
                                        "mental_health": {
                                            "mean": "60.9",
                                            "ci_l": "0.1",
                                            "ci_u": "100.0",
                                            "count": 17
                                        }
                                    }
                                ]
                            },
                            {
                                "name": "Opposite sex only",
                                "race": [
                                    {
                                        "name": "Hispanic/Latino",
                                        "mental_health": {
                                            "mean": "32.1",
                                            "ci_l": "28.9",
                                            "ci_u": "35.5",
                                            "count": 2141
                                        }
                                    },
                                    {
                                        "name": "Native Hawaiian/other PI",
                                        "mental_health": {
                                            "mean": "20.9",
                                            "ci_l": "9.0",
                                            "ci_u": "41.5",
                                            "count": 35
                                        }
                                    },
                                    {
                                        "name": "Black or African American",
                                        "mental_health": {
                                            "mean": "24.5",
                                            "ci_l": "19.5",
                                            "ci_u": "30.3",
                                            "count": 748
                                        }
                                    },
                                    {
                                        "name": "Multiple - Non-Hispanic",
                                        "mental_health": {
                                            "mean": "26.4",
                                            "ci_l": "19.1",
                                            "ci_u": "35.3",
                                            "count": 337
                                        }
                                    },
                                    {
                                        "name": "White",
                                        "mental_health": {
                                            "mean": "23.3",
                                            "ci_l": "20.6",
                                            "ci_u": "26.2",
                                            "count": 2948
                                        }
                                    },
                                    {
                                        "name": "Am Indian / Alaska Native",
                                        "mental_health": {
                                            "mean": "30.9",
                                            "ci_l": "20.5",
                                            "ci_u": "43.6",
                                            "count": 79
                                        }
                                    },
                                    {
                                        "name": "Asian",
                                        "mental_health": {
                                            "mean": "25.7",
                                            "ci_l": "17.9",
                                            "ci_u": "35.5",
                                            "count": 176
                                        }
                                    }
                                ],
                                "mental_health": {
                                    "mean": "25.6",
                                    "ci_l": "23.4",
                                    "ci_u": "28.0",
                                    "count": 6556
                                }
                            },
                            {
                                "name": "Both Sexes",
                                "race": [
                                    {
                                        "name": "Multiple - Non-Hispanic",
                                        "mental_health": {
                                            "mean": "16.4",
                                            "ci_l": "0.7",
                                            "ci_u": "84.5",
                                            "count": 11
                                        }
                                    },
                                    {
                                        "name": "Black or African American",
                                        "mental_health": {
                                            "mean": "7.8",
                                            "ci_l": "1.8",
                                            "ci_u": "27.7",
                                            "count": 25
                                        }
                                    },
                                    {
                                        "name": "Native Hawaiian/other PI",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 1
                                        }
                                    },
                                    {
                                        "name": "Hispanic/Latino",
                                        "mental_health": {
                                            "mean": "51.3",
                                            "ci_l": "34.4",
                                            "ci_u": "67.9",
                                            "count": 52
                                        }
                                    },
                                    {
                                        "name": "Asian",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 4
                                        }
                                    },
                                    {
                                        "name": "Am Indian / Alaska Native",
                                        "mental_health": {
                                            "mean": "0",
                                            "ci_l": "0",
                                            "ci_u": "0",
                                            "count": 0
                                        }
                                    },
                                    {
                                        "name": "White",
                                        "mental_health": {
                                            "mean": "29.2",
                                            "ci_l": "18.8",
                                            "ci_u": "42.4",
                                            "count": 88
                                        }
                                    }
                                ],
                                "mental_health": {
                                    "mean": "29.1",
                                    "ci_l": "21.6",
                                    "ci_u": "38.1",
                                    "count": 181
                                }
                            },
                            {
                                "name": "Never had sex",
                                "race": [
                                    {
                                        "name": "White",
                                        "mental_health": {
                                            "mean": "12.0",
                                            "ci_l": "9.9",
                                            "ci_u": "14.6",
                                            "count": 2578
                                        }
                                    },
                                    {
                                        "name": "Hispanic/Latino",
                                        "mental_health": {
                                            "mean": "18.4",
                                            "ci_l": "16.1",
                                            "ci_u": "20.8",
                                            "count": 1940
                                        }
                                    },
                                    {
                                        "name": "Am Indian / Alaska Native",
                                        "mental_health": {
                                            "mean": "8.3",
                                            "ci_l": "2.5",
                                            "ci_u": "24.2",
                                            "count": 49
                                        }
                                    },
                                    {
                                        "name": "Multiple - Non-Hispanic",
                                        "mental_health": {
                                            "mean": "10.3",
                                            "ci_l": "6.0",
                                            "ci_u": "17.2",
                                            "count": 220
                                        }
                                    },
                                    {
                                        "name": "Black or African American",
                                        "mental_health": {
                                            "mean": "15.6",
                                            "ci_l": "11.4",
                                            "ci_u": "21.1",
                                            "count": 487
                                        }
                                    },
                                    {
                                        "name": "Native Hawaiian/other PI",
                                        "mental_health": {
                                            "mean": "6.2",
                                            "ci_l": "1.2",
                                            "ci_u": "26.6",
                                            "count": 30
                                        }
                                    },
                                    {
                                        "name": "Asian",
                                        "mental_health": {
                                            "mean": "4.7",
                                            "ci_l": "2.5",
                                            "ci_u": "8.7",
                                            "count": 322
                                        }
                                    }
                                ],
                                "mental_health": {
                                    "mean": "13.4",
                                    "ci_l": "11.5",
                                    "ci_u": "15.4",
                                    "count": 5728
                                }
                            }
                        ]
                    }
                ]
            }
        };

        searchUtils.applyYRBSSuppressions({data: data.table.question}, 'count', 'mean', true);
        //Multiple - Non-Hispanic
        expect(data.table.question[0].sexpart[0].race[0].mental_health.mean).equal('suppressed');
        expect(data.table.question[0].sexpart[0].race[0].mental_health.count).equal(2);
        //Native Hawaiian/other PI
        expect(data.table.question[0].sexpart[0].race[1].mental_health.mean).equal('suppressed');
        expect(data.table.question[0].sexpart[0].race[1].mental_health.count).equal(0);
        //Asian
        expect(data.table.question[0].sexpart[0].race[2].mental_health.mean).equal('suppressed');
        expect(data.table.question[0].sexpart[0].race[2].mental_health.count).equal(3);
        //White
        expect(data.table.question[0].sexpart[0].race[3].mental_health.mean).equal('suppressed');
        expect(data.table.question[0].sexpart[0].race[3].mental_health.count).equal(17);
        //Multiple - Non-Hispanic
        expect(data.table.question[0].sexpart[2].race[0].mental_health.mean).equal('suppressed');
        expect(data.table.question[0].sexpart[2].race[0].mental_health.count).equal(11);
        done();

    });

    it("Get 'All' options values", function(done){
        var values = searchUtils.getAllOptionValues();
        expect(values[0]).equal("Both sexes");
        expect(values[1]).equal("All races/ethnicities");
        expect(values[2]).equal("All age groups");
        expect(values[3]).equal("National");
        done();
    });

    describe('.getSelectedGroupByOptions', function () {
        it('should return a list of options', function () {
            var mock = [
                { key: 'year_of_death', groupBy: 'row', autoCompleteOptions: [{ key: '2015', title: '2015' }, { key: '2014', title: '2014' }] },
                { key: 'sex', groupBy: 'column', autoCompleteOptions: [{ key: 'Male', title: 'Male'}, { key: 'Female', title: 'Female' }] },
                { key: 'race', groupBy: false, autoCompleteOptions: [{ key: 'White', title: 'White'}, { key: 'Black', title: 'Black' }] }
            ];
            var expected = [{ filter: 'sex', key: 'Male', title: 'Male' }, { filter: 'sex', key: 'Female', title: 'Female' }];
            expect(searchUtils.getSelectedGroupByOptions(mock)).to.eql(expected);
        });

        it('should not return the year_of_death filter', function () {
            var mock = [{ key: 'year_of_death', groupBy: 'row', autoCompleteOptions: [{ key: '2015', title: '2015' }, { key: '2014', title: '2014' }] }];
            expect(searchUtils.getSelectedGroupByOptions(mock)).to.be.empty();
        });

        it('should not return filters that have the groupBy property set to false', function () {
            var mock =  [{ key: 'race', groupBy: false, autoCompleteOptions: [{ key: 'White', title: 'White'}, { key: 'Black', title: 'Black' }] }];
            expect(searchUtils.getSelectedGroupByOptions(mock)).to.be.empty();
        });
    });

    describe('.getYearFilter', function () {
        it('should return a list of years', function () {
            var mock = [
               { key: 'year_of_death', autoCompleteOptions: [{ key: '2015', title: '2015' }, { key: '2014', title: '2014' }], allChecked: false, value: [ '2014' ] },
               { key: 'sex', autoCompleteOptions: [{ key: 'Male', title: 'Male'}, { key: 'Female', title: 'Female' }], allChecked: false }
            ];
            var expected = [ '2014' ];
            expect(searchUtils.getYearFilter(mock)).to.eql(expected);
        });

        it('should not return any other filter', function () {
            var mock = [{ key: 'sex', autoCompleteOptions: [{ key: 'Male', title: 'Male'}, { key: 'Female', title: 'Female' }], allChecked: false }];
            expect(searchUtils.getYearFilter(mock)).to.be.empty();
        });

        it('should return all autoCompleteOptions when allChecked is true', function () {
            var mock = [{ key: 'year_of_death', autoCompleteOptions: [{ key: '2015', title: '2015' }, { key: '2014', title: '2014' }], allChecked: true, value: [] }];
            var expected = [ '2015', '2014' ];
            expect(searchUtils.getYearFilter(mock)).to.eql(expected);
        });
    });

    describe('.mapAndGroupOptionResults', function () {
        it('should return a list of options grouped by their keys', function () {
            var options = [
                { key: 'Female', title: 'Female', filter: 'sex', year: '2014' },
                { key: 'Male', title: 'Male', filter: 'sex', year: '2014' },
                { key: 'American Indian / Alaskan Native', title: 'American Indian / Alaskan Native', filter: 'race', year: '2014' },
                { key: 'Asian / Pacific Islander', title: 'Asian / Pacific Islander', filter: 'race', year: '2014' }
            ];
            var optionResults = [
                { count: 10251, _shards: { total: 5, successful: 5, failed: 0 } },
                { count: 12799, _shards: { total: 5, successful: 5, failed: 0 } },
                { count: 340, _shards: { total: 5, successful: 5, failed: 0 } },
                { count: 1080, _shards: { total: 5, successful: 5, failed: 0 } }
            ];
            var expected = [
                [
                    { key: 'Female', title: 'Female', filter: 'sex', year: '2014', count: 10251 },
                    { key: 'Male', title: 'Male', filter: 'sex', year: '2014', count: 12799 }
                ],
                [
                    { key: 'American Indian / Alaskan Native', title: 'American Indian / Alaskan Native', filter: 'race', year: '2014', count: 340 },
                    { key: 'Asian / Pacific Islander', title: 'Asian / Pacific Islander', filter: 'race', year: '2014', count: 1080 }
                ]
            ];
            expect(searchUtils.mapAndGroupOptionResults(options, optionResults)).to.eql(expected)
        });
    });

    it("Apply suppression rule for STD", function(done){
       var result = stdBeforeSuppressionData;
       searchUtils.applySuppressions(result, 'std', 4);
       expect(result.data.nested.table.race[6].name).equal('Native Hawaiian or Other Pacific Islander');
       expect(result.data.nested.table.race[6].std).equal('suppressed');
       expect(result.data.nested.table.race[6].sex[0].name).equal('Both sexes');
       expect(result.data.nested.table.race[6].sex[0].std).equal('suppressed');
       expect(result.data.nested.table.race[6].sex[0].pop).equal(2264);
       expect(result.data.nested.table.race[6].sex[1].name).equal('Female');
       expect(result.data.nested.table.race[6].sex[1].std).equal('suppressed');
       expect(result.data.nested.table.race[6].sex[1].pop).equal(1096);
       expect(result.data.nested.table.race[6].sex[2].name).equal('Male');
       //Cases not available
       expect(result.data.nested.table.race[6].sex[2].std).equal('na');
       expect(result.data.nested.table.race[6].sex[2].pop).equal(1168);
       //Unknown cases should not be 'Not Available'
        expect(result.data.nested.table.race[7].name).equal('Unknown');
        expect(result.data.nested.table.race[7].std).equal(15506);
        expect(result.data.nested.table.race[7].sex[0].name).equal("Both sexes");
        expect(result.data.nested.table.race[7].sex[0].std).equal(7818);
        expect(result.data.nested.table.race[7].sex[1].name).equal("Female");
        expect(result.data.nested.table.race[7].sex[1].std).equal(5769);
        expect(result.data.nested.table.race[7].sex[2].name).equal("Male");
        expect(result.data.nested.table.race[7].sex[2].std).equal(1919);

       done();
    });
});