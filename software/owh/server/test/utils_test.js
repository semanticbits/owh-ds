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
        expect(result.data.nested.charts[0].race[1].hispanicOrigin[1].deaths).equal(-1);
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

    it("Apply suppression for prams basic search", function (done) {
       var result = [{"name":"qn365","no":{"sitecode":[{"name":"AR","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"CO","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"DE","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"GA","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"HI","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"MA","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"MD","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"ME","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"MI","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"MN","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"MO","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"NE","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"NJ","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"NM","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"NY","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"OK","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"OR","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"PA","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"RI","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"XX","prams":{"mean":"99.6","ci_l":"97.6","ci_u":"99.9","count":94}},{"name":"UT","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"VT","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"WA","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"WI","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"WV","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"WY","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"YC","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}}],"prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},"yes":{"sitecode":[{"name":"AR","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"CO","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"DE","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"GA","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"HI","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"MA","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"MD","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"ME","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"MI","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"MN","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"MO","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"NE","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"NJ","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"NM","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"NY","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"OK","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"OR","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"PA","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"RI","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"XX","prams":{"mean":"0.4","ci_l":"0.1","ci_u":"2.4","count":1}},{"name":"UT","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"VT","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"WA","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"WI","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"WV","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"WY","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}},{"name":"YC","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}}],"prams":{"mean":"0","ci_l":"0","ci_u":"0","count":null}}}];

       searchUtils.applyPRAMSuppressions({data: result}, 'count', 'mean', false, true);
        expect(result[0].no.sitecode[0].name).equal("AR");
        expect(result[0].no.sitecode[0].prams.mean).equal("suppressed");

        expect(result[0].no.sitecode[1].name).equal("CO");
        expect(result[0].no.sitecode[1].prams.mean).equal("suppressed");
        done();
    });

    it("Apply suppression for prams advance search", function (done) {
       var result = [{"name":"pd_comp","No":{"sitecode":[{"name":"AK","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":0,"sampleSize":0,"se":null}},{"name":"AL","prams":{"mean":"96.3","ci_l":"2.3","ci_u":"100.0","count":841,"sampleSize":875,"se":0.0197}},{"name":"AR","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":0,"sampleSize":0,"se":null}},{"name":"CO","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":0,"sampleSize":0,"se":null}},{"name":"CT","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":0,"sampleSize":0,"se":null}},{"name":"DE","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":0,"sampleSize":0,"se":null}},{"name":"GA","prams":{"mean":"0","ci_l":"0","ci_u":"0","count":0,"sampleSize":0,"se":null}}],"prams":{"mean":"2.8","ci_l":"1.8","ci_u":"4.4","count":171,"sampleSize":5977,"se":0.0056}}}];

       searchUtils.applyPRAMSuppressions({data: result}, 'count', 'mean', false, false);
        expect(result[0].No.sitecode[0].name).equal("AK");
        expect(result[0].No.sitecode[0].prams.mean).equal("suppressed");
        expect(result[0].No.sitecode[0].prams.sampleSize).equal(0);

        expect(result[0].No.sitecode[1].name).equal("AL");
        expect(result[0].No.sitecode[1].prams.mean).equal("96.3");
        expect(result[0].No.sitecode[1].prams.sampleSize).equal(875);
        done();
    });

    it("Apply suppression for brfss advance search", function (done) {
       var result = [{"name":"x_rfbing5","no":{"race":[{"name":"AI/AN","brfss":{"mean":"89.1","ci_l":"73.4","ci_u":"96.0","count":97,"sampleSize":106,"se":0.0533}},{"name":"Asian","brfss":{"mean":"94.7","ci_l":"72.8","ci_u":"99.2","count":32,"sampleSize":34,"se":0.0467}},{"name":"Black","brfss":{"mean":"87.3","ci_l":"84.9","ci_u":"89.4","count":1694,"sampleSize":1880,"se":0.0114}},{"name":"Hispanic","brfss":{"mean":"86.6","ci_l":"75.1","ci_u":"93.2","count":82,"sampleSize":93,"se":0.0445}},{"name":"Multiracial non-Hispanic","brfss":{"mean":"89.0","ci_l":"76.1","ci_u":"95.3","count":70,"sampleSize":77,"se":0.0458}},{"name":"NHOPI","brfss":{"mean":"100.0","ci_l":"0","ci_u":"0","count":4,"sampleSize":4,"se":0}},{"name":"Other Race","brfss":{"mean":"85.9","ci_l":"62.2","ci_u":"95.7","count":48,"sampleSize":51,"se":0.0789}},{"name":"White","brfss":{"mean":"88.8","ci_l":"87.5","ci_u":"90.0","count":4721,"sampleSize":5161,"se":0.0064}}],"brfss":{"mean":"88.4","ci_l":"87.3","ci_u":"89.4","count":6822,"sampleSize":7487,"se":0.0055}},"yes":{"race":[{"name":"AI/AN","brfss":{"mean":"10.9","ci_l":"4.0","ci_u":"26.6","count":9,"sampleSize":106,"se":0.0533}},{"name":"Asian","brfss":{"mean":"5.3","ci_l":"0.8","ci_u":"27.2","count":2,"sampleSize":34,"se":0.0467}},{"name":"Black","brfss":{"mean":"12.7","ci_l":"10.6","ci_u":"15.1","count":186,"sampleSize":1880,"se":0.0114}},{"name":"Hispanic","brfss":{"mean":"13.4","ci_l":"6.8","ci_u":"24.9","count":11,"sampleSize":93,"se":0.0445}},{"name":"Multiracial non-Hispanic","brfss":{"mean":"11.0","ci_l":"4.7","ci_u":"23.9","count":7,"sampleSize":77,"se":0.0458}},{"name":"NHOPI","brfss":{"mean":"0","ci_l":"0","ci_u":"0","count":0,"sampleSize":4,"se":0}},{"name":"Other Race","brfss":{"mean":"14.1","ci_l":"4.3","ci_u":"37.8","count":3,"sampleSize":51,"se":0.0789}},{"name":"White","brfss":{"mean":"11.2","ci_l":"10.0","ci_u":"12.5","count":440,"sampleSize":5161,"se":0.0064}}],"brfss":{"mean":"11.6","ci_l":"10.6","ci_u":"12.7","count":665,"sampleSize":7487,"se":0.0055}}}];

       searchUtils.applyBRFSSuppression({data: result}, 'count', 'mean', false, false);
        console.log(result[0].yes.race);
        expect(result[0].yes.race[0].name).equal("AI/AN");
        expect(result[0].yes.race[0].brfss.mean).equal('suppressed');
        expect(result[0].yes.race[0].brfss.sampleSize).equal(106);

        expect(result[0].yes.race[1].name).equal("Asian");
        expect(result[0].yes.race[1].brfss.mean).equal("suppressed");
        expect(result[0].yes.race[1].brfss.sampleSize).equal(34);

        expect(result[0].yes.race[2].name).equal("Black");
        expect(result[0].yes.race[2].brfss.mean).equal('12.7');
        expect(result[0].yes.race[2].brfss.se).equal(0.0114);
        expect(result[0].yes.race[2].brfss.sampleSize).equal(1880);
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

    describe('.getTargetFilter', function () {
        it('should return an object for the target filter', function () {
            var mock = [
               { key: 'year_of_death', autoCompleteOptions: [{ key: '2015', title: '2015' }, { key: '2014', title: '2014' }], allChecked: false, value: [ '2014' ] },
               { key: 'sex', autoCompleteOptions: [{ key: 'Male', title: 'Male'}, { key: 'Female', title: 'Female' }], allChecked: false }
            ];
            expect(searchUtils.getTargetFilter(mock, 'year_of_death')).to.eql(mock[0]);
        });
    });

    describe('.getTargetFilterValue', function () {
        it('should return an array of values for the target filter', function () {
            var mock = [
               { key: 'year_of_death', autoCompleteOptions: [{ key: '2015', title: '2015' }, { key: '2014', title: '2014' }], allChecked: false, value: [ '2014' ] },
               { key: 'sex', autoCompleteOptions: [{ key: 'Male', title: 'Male'}, { key: 'Female', title: 'Female' }], allChecked: false }
            ];
            var expected = [ '2014' ];
            expect(searchUtils.getTargetFilterValue(mock, 'year_of_death')).to.eql(expected);
        });

        it('should not return any other filter', function () {
            var mock = [{ key: 'sex', autoCompleteOptions: [{ key: 'Male', title: 'Male'}, { key: 'Female', title: 'Female' }], allChecked: false }];
            expect(searchUtils.getTargetFilterValue(mock, 'year_of_death')).to.be.empty();
        });

        it('should return all autoCompleteOptions when allChecked is true', function () {
            var mock = [{ key: 'year_of_death', autoCompleteOptions: [{ key: '2015', title: '2015' }, { key: '2014', title: '2014' }], allChecked: true, value: [] }];
            var expected = [ '2015', '2014' ];
            expect(searchUtils.getTargetFilterValue(mock, 'year_of_death')).to.eql(expected);
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

    it('add missing options for aggregation results using populateDataWithMappings method', function(done){
        var resp = {"took":2,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":3,"max_score":0,"hits":[]},"aggregations":{"group_table_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Black","doc_count":3,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Male","doc_count":2},{"key":"Female","doc_count":1}]}}]},"group_chart_0_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Male","doc_count":2,"group_chart_0_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Black","doc_count":2}]}},{"key":"Female","doc_count":1,"group_chart_0_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Black","doc_count":1}]}}]}}};
        var countKey = "deaths";
        var countQueryKey = undefined;
        var allSelectedFilterOptions = {"race":{"options":["American Indian","Asian or Pacific Islander","Black","White"]},"gender":{"options":["Female","Male"]}};
        var query = {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0}}}},"group_chart_0_gender":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[{"bool":{"should":[{"match":{"ICD_10_code.path":"A16-A19"}}]}}]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"state":"DC"}}]}}]}}}}};
        var result = searchUtils.populateDataWithMappings(resp, countKey, countQueryKey, allSelectedFilterOptions, query);
        expect(result.data.nested.table.race[0].name).to.equal('American Indian');
        expect(result.data.nested.table.race[0].deaths).to.equal(0);
        expect(result.data.nested.table.race[0].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[0].gender[0].deaths).to.equal(0);
        expect(result.data.nested.table.race[0].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[0].gender[1].deaths).to.equal(0);

        expect(result.data.nested.table.race[1].name).to.equal('Asian or Pacific Islander');
        expect(result.data.nested.table.race[1].deaths).to.equal(0);
        expect(result.data.nested.table.race[1].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[1].gender[0].deaths).to.equal(0);
        expect(result.data.nested.table.race[1].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[1].gender[1].deaths).to.equal(0);

        expect(result.data.nested.table.race[2].name).to.equal('Black');
        expect(result.data.nested.table.race[2].deaths).to.equal(3);
        expect(result.data.nested.table.race[2].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[2].gender[0].deaths).to.equal(1);
        expect(result.data.nested.table.race[2].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[2].gender[1].deaths).to.equal(2);

        expect(result.data.nested.table.race[3].name).to.equal('White');
        expect(result.data.nested.table.race[3].deaths).to.equal(0);
        expect(result.data.nested.table.race[3].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[3].gender[0].deaths).to.equal(0);
        expect(result.data.nested.table.race[3].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[3].gender[1].deaths).to.equal(0);

        done();
    });

    it('add missing options for aggregation results using populateDataWithMappings method - crude death rates', function(done){
        var resp = {"took":1,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":125,"max_score":0,"hits":[]},"aggregations":{"group_table_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"White","doc_count":112,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Female","doc_count":60},{"key":"Male","doc_count":52}]}},{"key":"Black","doc_count":13,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Female","doc_count":9},{"key":"Male","doc_count":4}]}}]},"group_chart_0_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Female","doc_count":69,"group_chart_0_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"White","doc_count":60},{"key":"Black","doc_count":9}]}},{"key":"Male","doc_count":56,"group_chart_0_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"White","doc_count":52},{"key":"Black","doc_count":4}]}}]}}};
        var countKey = "deaths";
        var countQueryKey = undefined;
        var allSelectedFilterOptions = {"race":{"options":["American Indian","Asian or Pacific Islander","Black","White"]},"gender":{"options":["Female","Male"]}};
        var query = {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0}}}},"group_chart_0_gender":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"ethnicity_group":"Hispanic"}}]}},{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"state":"DC"}}]}}]}}}}};
        var result = searchUtils.populateDataWithMappings(resp, countKey, countQueryKey, allSelectedFilterOptions, query);
        expect(result.data.nested.table.race[0].name).to.equal('American Indian');
        expect(result.data.nested.table.race[0].deaths).to.equal(0);
        expect(result.data.nested.table.race[0].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[0].gender[0].deaths).to.equal(0);
        expect(result.data.nested.table.race[0].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[0].gender[1].deaths).to.equal(0);

        expect(result.data.nested.table.race[1].name).to.equal('Asian or Pacific Islander');
        expect(result.data.nested.table.race[1].deaths).to.equal(0);
        expect(result.data.nested.table.race[1].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[1].gender[0].deaths).to.equal(0);
        expect(result.data.nested.table.race[1].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[1].gender[1].deaths).to.equal(0);

        expect(result.data.nested.table.race[2].name).to.equal('Black');
        expect(result.data.nested.table.race[2].deaths).to.equal(13);
        expect(result.data.nested.table.race[2].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[2].gender[0].deaths).to.equal(9);
        expect(result.data.nested.table.race[2].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[2].gender[1].deaths).to.equal(4);

        expect(result.data.nested.table.race[3].name).to.equal('White');
        expect(result.data.nested.table.race[3].deaths).to.equal(112);
        expect(result.data.nested.table.race[3].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[3].gender[0].deaths).to.equal(60);
        expect(result.data.nested.table.race[3].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[3].gender[1].deaths).to.equal(52);
        done();
    });

    it('add missing options for aggregation results using populateDataWithMappings method - Age adjusted rates', function(done){
        var resp = {"took":8,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":460,"max_score":0,"hits":[]},"aggregations":{"group_table_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"White","doc_count":398,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Male","doc_count":230},{"key":"Female","doc_count":168}]}},{"key":"Black","doc_count":53,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Female","doc_count":27},{"key":"Male","doc_count":26}]}},{"key":"Asian or Pacific Islander","doc_count":7,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Female","doc_count":4},{"key":"Male","doc_count":3}]}},{"key":"American Indian","doc_count":2,"group_table_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Male","doc_count":2}]}}]},"group_chart_0_gender":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Male","doc_count":261,"group_chart_0_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"White","doc_count":230},{"key":"Black","doc_count":26},{"key":"Asian or Pacific Islander","doc_count":3},{"key":"American Indian","doc_count":2}]}},{"key":"Female","doc_count":199,"group_chart_0_race":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"White","doc_count":168},{"key":"Black","doc_count":27},{"key":"Asian or Pacific Islander","doc_count":4}]}}]}}};
        var countKey = "deaths";
        var countQueryKey = undefined;
        var allSelectedFilterOptions = {"race":{"options":["American Indian","Asian or Pacific Islander","Black","White"]},"gender":{"options":["Female","Male"]}};
        var query = {"size":0,"aggregations":{"group_table_race":{"terms":{"field":"race","size":0},"aggregations":{"group_table_gender":{"terms":{"field":"sex","size":0}}}},"group_chart_0_gender":{"terms":{"field":"sex","size":0},"aggregations":{"group_chart_0_race":{"terms":{"field":"race","size":0}}}}},"query":{"filtered":{"query":{"bool":{"must":[]}},"filter":{"bool":{"must":[{"bool":{"should":[{"term":{"ethnicity_group":"Hispanic"}}]}},{"bool":{"should":[{"term":{"current_year":"2015"}}]}},{"bool":{"should":[{"term":{"state":"AL"}},{"term":{"state":"DC"}}]}}]}}}}};
        var result = searchUtils.populateDataWithMappings(resp, countKey, countQueryKey, allSelectedFilterOptions, query);
        expect(result.data.nested.table.race[0].name).to.equal('American Indian');
        expect(result.data.nested.table.race[0].deaths).to.equal(2);
        expect(result.data.nested.table.race[0].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[0].gender[0].deaths).to.equal(0);
        expect(result.data.nested.table.race[0].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[0].gender[1].deaths).to.equal(2);

        expect(result.data.nested.table.race[1].name).to.equal('Asian or Pacific Islander');
        expect(result.data.nested.table.race[1].deaths).to.equal(7);
        expect(result.data.nested.table.race[1].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[1].gender[0].deaths).to.equal(4);
        expect(result.data.nested.table.race[1].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[1].gender[1].deaths).to.equal(3);

        expect(result.data.nested.table.race[2].name).to.equal('Black');
        expect(result.data.nested.table.race[2].deaths).to.equal(53);
        expect(result.data.nested.table.race[2].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[2].gender[0].deaths).to.equal(27);
        expect(result.data.nested.table.race[2].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[2].gender[1].deaths).to.equal(26);

        expect(result.data.nested.table.race[3].name).to.equal('White');
        expect(result.data.nested.table.race[3].deaths).to.equal(398);
        expect(result.data.nested.table.race[3].gender[0].name).to.equal('Female');
        expect(result.data.nested.table.race[3].gender[0].deaths).to.equal(168);
        expect(result.data.nested.table.race[3].gender[1].name).to.equal('Male');
        expect(result.data.nested.table.race[3].gender[1].deaths).to.equal(230);
        done();
    });

    it("get all selected filter options - In this case user group by filters 'gender' and 'race' and selected year '2015' and state 'District of columbia'", function(done){
        var query = {"key":"deaths","tableView":"number_of_deaths","allFilters":[{"key":"agegroup","title":"label.filter.agegroup","queryKey":"age_5_interval","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.demographics","filterType":"slider","autoCompleteOptions":[],"showChart":true,"sliderOptions":{},"sliderValue":"-10;105","defaultGroup":"row","helpText":"label.help.text.mortality.age"},{"key":"hispanicOrigin","title":"label.filter.hispanicOrigin","queryKey":"hispanic_origin","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.demographics","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"row","helpText":"label.help.text.mortality.ethnicity","allChecked":true,"filterLength":13},{"key":"race","title":"label.filter.race","queryKey":"race","primary":false,"value":[],"groupBy":"row","type":"label.filter.group.demographics","showChart":true,"defaultGroup":"column","filterType":"checkbox","autoCompleteOptions":[{"key":"American Indian","title":"American Indian or Alaska Native","disabled":false},{"key":"Asian or Pacific Islander","title":"Asian or Pacific Islander","disabled":false},{"key":"Black","title":"Black or African American","disabled":false},{"key":"White","title":"White","disabled":false}],"helpText":"label.help.text.mortality.race","allChecked":true,"filterLength":4},{"key":"gender","title":"label.filter.gender","queryKey":"sex","primary":false,"value":[],"groupBy":"column","type":"label.filter.group.demographics","groupByDefault":"column","showChart":true,"filterType":"checkbox","autoCompleteOptions":[{"key":"Female","title":"Female","disabled":false},{"key":"Male","title":"Male","disabled":false}],"defaultGroup":"column","helpText":"label.help.text.mortality.sex","allChecked":true},{"key":"year","title":"label.filter.year","queryKey":"current_year","primary":false,"value":["2015"],"groupBy":false,"type":"label.filter.group.year.month","filterType":"checkbox","autoCompleteOptions":[{"key":"2015","title":"2015"},{"key":"2014","title":"2014"},{"key":"2013","title":"2013"},{"key":"2012","title":"2012"},{"key":"2011","title":"2011"},{"key":"2010","title":"2010"},{"key":"2009","title":"2009"},{"key":"2008","title":"2008"},{"key":"2007","title":"2007"},{"key":"2006","title":"2006"},{"key":"2005","title":"2005"},{"key":"2004","title":"2004"},{"key":"2003","title":"2003"},{"key":"2002","title":"2002"},{"key":"2001","title":"2001"},{"key":"2000","title":"2000"}],"defaultGroup":"row","helpText":"label.help.text.mortality.year","allChecked":false,"filterLength":16},{"key":"month","title":"label.filter.month","queryKey":"month_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.year.month","defaultGroup":"row","filterType":"checkbox","autoCompleteOptions":[],"helpText":"label.help.text.mortality.month","allChecked":true},{"key":"weekday","title":"label.filter.weekday","queryKey":"week_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"row","helpText":"label.help.text.mortality.day","allChecked":true},{"key":"autopsy","title":"label.filter.autopsy","queryKey":"autopsy","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"row","helpText":"label.help.text.mortality.autopsy","allChecked":true},{"key":"placeofdeath","title":"label.filter.pod","queryKey":"place_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"row","helpText":"label.help.text.mortality.pod","allChecked":true},{"key":"state","title":"label.filter.state","queryKey":"state","primary":false,"value":["DC"],"groupBy":false,"type":"label.filter.group.location","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"column","displaySearchBox":true,"displaySelectedFirst":true,"helpText":"label.help.text.mortality.state","allChecked":false},{"key":"census-region","title":"label.filter.censusRegion","queryKey":"census_region|census_division","primary":false,"value":[],"queryType":"compound","titles":["label.filter.censusRegion","label.filter.censusDivision"],"queryKeys":["census_region","census_division"],"groupBy":false,"type":"label.filter.group.location","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"column","displaySearchBox":true,"displaySelectedFirst":false,"helpText":"label.help.text.mortality.state","allChecked":true},{"key":"hhs-region","title":"label.filter.HHSRegion","queryKey":"hhs_region","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.location","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"column","displaySearchBox":true,"displaySelectedFirst":true,"helpText":"label.help.text.mortality.state","allChecked":true},{"key":"ucd-chapter-10","title":"label.filter.ucd","queryKey":"ICD_10_code","primary":true,"value":[],"groupBy":false,"type":"label.filter.group.ucd","groupKey":"ucd","autoCompleteOptions":[],"filterType":"conditions","selectTitle":"select.label.filter.ucd","updateTitle":"update.label.filter.ucd","aggregationKey":"ICD_10_code.path","groupOptions":[{"key":"row","title":"Row","tooltip":"Select to view as rows on data table"},{"key":false,"title":"Off","tooltip":"Select to hide on data table"}],"helpText":"label.help.text.mortality.ucd"},{"key":"mcd-chapter-10","title":"label.filter.mcd","queryKey":"ICD_10_code","primary":false,"value":{"set1":[],"set2":[]},"groupBy":false,"type":"label.filter.group.mcd","groupKey":"mcd","autoCompleteOptions":[],"filterType":"conditions","selectTitle":"select.label.filter.mcd","updateTitle":"update.label.filter.mcd","aggregationKey":"record_axis_condn.path","groupOptions":[{"key":"row","title":"Row","tooltip":"Select to view as rows on data table"},{"key":false,"title":"Off","tooltip":"Select to hide on data table"}],"helpText":"label.help.text.mortality.mcd"}],"sideFilters":[]};
       var allOptions = searchUtils.getAllSelectedFilterOptions(query);
        expect(allOptions.gender).to.not.equal(undefined);
        expect(allOptions.gender.options.length).to.equal(2);
        expect(allOptions.gender.options[0]).to.equal('Female');
        expect(allOptions.gender.options[1]).to.equal('Male');
        expect(allOptions.race).to.not.equal(undefined);
        expect(allOptions.race.options.length).to.equal(4);
        expect(allOptions.race.options[0]).to.equal('American Indian');
        expect(allOptions.race.options[1]).to.equal('Asian or Pacific Islander');
        expect(allOptions.race.options[2]).to.equal('Black');
        expect(allOptions.race.options[3]).to.equal('White');
        done();
    });

    it("get all selected filter options - In this case user group by filters 'gender' and 'race' and selected gender 'Female', year '2015' and state 'District of columbia'", function(done){
        var query = {"key":"deaths","tableView":"number_of_deaths","allFilters":[{"key":"agegroup","title":"label.filter.agegroup","queryKey":"age_5_interval","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.demographics","filterType":"slider","autoCompleteOptions":[],"showChart":true,"sliderOptions":{},"sliderValue":"-10;105","defaultGroup":"row","helpText":"label.help.text.mortality.age"},{"key":"hispanicOrigin","title":"label.filter.hispanicOrigin","queryKey":"hispanic_origin","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.demographics","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"row","helpText":"label.help.text.mortality.ethnicity","allChecked":true,"filterLength":13},{"key":"race","title":"label.filter.race","queryKey":"race","primary":false,"value":[],"groupBy":"row","type":"label.filter.group.demographics","showChart":true,"defaultGroup":"column","filterType":"checkbox","autoCompleteOptions":[{"key":"American Indian","title":"American Indian or Alaska Native","disabled":false},{"key":"Asian or Pacific Islander","title":"Asian or Pacific Islander","disabled":false},{"key":"Black","title":"Black or African American","disabled":false},{"key":"White","title":"White","disabled":false}],"helpText":"label.help.text.mortality.race","allChecked":true,"filterLength":4},{"key":"gender","title":"label.filter.gender","queryKey":"sex","primary":false,"value":["Female"],"groupBy":"column","type":"label.filter.group.demographics","groupByDefault":"column","showChart":true,"filterType":"checkbox","autoCompleteOptions":[{"key":"Female","title":"Female","disabled":false},{"key":"Male","title":"Male","disabled":false}],"defaultGroup":"column","helpText":"label.help.text.mortality.sex","allChecked":true},{"key":"year","title":"label.filter.year","queryKey":"current_year","primary":false,"value":["2015"],"groupBy":false,"type":"label.filter.group.year.month","filterType":"checkbox","autoCompleteOptions":[{"key":"2015","title":"2015"},{"key":"2014","title":"2014"},{"key":"2013","title":"2013"},{"key":"2012","title":"2012"},{"key":"2011","title":"2011"},{"key":"2010","title":"2010"},{"key":"2009","title":"2009"},{"key":"2008","title":"2008"},{"key":"2007","title":"2007"},{"key":"2006","title":"2006"},{"key":"2005","title":"2005"},{"key":"2004","title":"2004"},{"key":"2003","title":"2003"},{"key":"2002","title":"2002"},{"key":"2001","title":"2001"},{"key":"2000","title":"2000"}],"defaultGroup":"row","helpText":"label.help.text.mortality.year","allChecked":false,"filterLength":16},{"key":"month","title":"label.filter.month","queryKey":"month_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.year.month","defaultGroup":"row","filterType":"checkbox","autoCompleteOptions":[],"helpText":"label.help.text.mortality.month","allChecked":true},{"key":"weekday","title":"label.filter.weekday","queryKey":"week_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"row","helpText":"label.help.text.mortality.day","allChecked":true},{"key":"autopsy","title":"label.filter.autopsy","queryKey":"autopsy","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"row","helpText":"label.help.text.mortality.autopsy","allChecked":true},{"key":"placeofdeath","title":"label.filter.pod","queryKey":"place_of_death","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.weekday.autopsy.pod","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"row","helpText":"label.help.text.mortality.pod","allChecked":true},{"key":"state","title":"label.filter.state","queryKey":"state","primary":false,"value":["DC"],"groupBy":false,"type":"label.filter.group.location","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"column","displaySearchBox":true,"displaySelectedFirst":true,"helpText":"label.help.text.mortality.state","allChecked":false},{"key":"census-region","title":"label.filter.censusRegion","queryKey":"census_region|census_division","primary":false,"value":[],"queryType":"compound","titles":["label.filter.censusRegion","label.filter.censusDivision"],"queryKeys":["census_region","census_division"],"groupBy":false,"type":"label.filter.group.location","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"column","displaySearchBox":true,"displaySelectedFirst":false,"helpText":"label.help.text.mortality.state","allChecked":true},{"key":"hhs-region","title":"label.filter.HHSRegion","queryKey":"hhs_region","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.location","filterType":"checkbox","autoCompleteOptions":[],"defaultGroup":"column","displaySearchBox":true,"displaySelectedFirst":true,"helpText":"label.help.text.mortality.state","allChecked":true},{"key":"ucd-chapter-10","title":"label.filter.ucd","queryKey":"ICD_10_code","primary":true,"value":[],"groupBy":false,"type":"label.filter.group.ucd","groupKey":"ucd","autoCompleteOptions":[],"filterType":"conditions","selectTitle":"select.label.filter.ucd","updateTitle":"update.label.filter.ucd","aggregationKey":"ICD_10_code.path","groupOptions":[{"key":"row","title":"Row","tooltip":"Select to view as rows on data table"},{"key":false,"title":"Off","tooltip":"Select to hide on data table"}],"helpText":"label.help.text.mortality.ucd"},{"key":"mcd-chapter-10","title":"label.filter.mcd","queryKey":"ICD_10_code","primary":false,"value":{"set1":[],"set2":[]},"groupBy":false,"type":"label.filter.group.mcd","groupKey":"mcd","autoCompleteOptions":[],"filterType":"conditions","selectTitle":"select.label.filter.mcd","updateTitle":"update.label.filter.mcd","aggregationKey":"record_axis_condn.path","groupOptions":[{"key":"row","title":"Row","tooltip":"Select to view as rows on data table"},{"key":false,"title":"Off","tooltip":"Select to hide on data table"}],"helpText":"label.help.text.mortality.mcd"}],"sideFilters":[]};
        var allOptions = searchUtils.getAllSelectedFilterOptions(query);
        expect(allOptions.gender).to.not.equal(undefined);
        expect(allOptions.gender.options.length).to.equal(1);
        expect(allOptions.gender.options[0]).to.equal('Female');
        expect(allOptions.race).to.not.equal(undefined);
        expect(allOptions.race.options.length).to.equal(4);
        expect(allOptions.race.options[0]).to.equal('American Indian');
        expect(allOptions.race.options[1]).to.equal('Asian or Pacific Islander');
        expect(allOptions.race.options[2]).to.equal('Black');
        expect(allOptions.race.options[3]).to.equal('White');
        done();
    });

    it("get all filter options with suboptions ", function(done){
        var query = {"key":"deaths","tableView":"number_of_deaths","allFilters":[{"key":"hispanicOrigin","title":"label.filter.hispanicOrigin","queryKey":"hispanic_origin","primary":false,"value":[],"groupBy":false,"type":"label.filter.group.demographics","filterType":"checkbox","autoCompleteOptions":[
            {"key":"Hispanic","title":"Hispanic", options:[
            {"key":"Central American","title":"Central American"},
            {"key":"Central and South American","title":"Central and South American"},
            {"key":"Cuban","title":"Cuban"},
            {"key":"Dominican","title":"Dominican"},
            {"key":"Latin American","title":"Latin American"},
            {"key":"Mexican","title":"Mexican"},
            {"key":"Other Hispanic","title":"Other Hispanic"},
            {"key":"Puerto Rican","title":"Puerto Rican"},
            {"key":"South American","title":"South American"},
            {"key":"Spaniard","title":"Spaniard"}]},
            {"key":"Unknown","title":"Unknown"},
            {"key":"Non-Hispanic","title":"Non-Hispanic"},],"defaultGroup":"row","helpText":"label.help.text.mortality.ethnicity","allChecked":true,"filterLength":13}],"sideFilters":[]};
        var allOptions = searchUtils.getAllFilterOptions(query);
        expect(allOptions.hispanicOrigin).to.not.equal(undefined);
        expect(allOptions.hispanicOrigin.options.length).to.equal(13);
        expect(allOptions.hispanicOrigin.options[0]).to.equal('Hispanic');
        expect(allOptions.hispanicOrigin.options[12]).to.equal('Non-Hispanic');
        expect(allOptions.hispanicOrigin.options[10]).to.equal('Spaniard');
        done();
    });

    it("get all selected filter options with suboptions ", function(done){
        var query = {"key":"deaths","tableView":"number_of_deaths","allFilters":[{"key":"hispanicOrigin","title":"label.filter.hispanicOrigin","queryKey":"hispanic_origin","primary":false,"value":['Hispanic', 'Cuban','Puerto Rican', 'Unknown' ],"groupBy":true,"type":"label.filter.group.demographics","filterType":"checkbox","autoCompleteOptions":[
            {"key":"Hispanic","title":"Hispanic", options:[
                {"key":"Central American","title":"Central American"},
                {"key":"Central and South American","title":"Central and South American"},
                {"key":"Cuban","title":"Cuban"},
                {"key":"Dominican","title":"Dominican"},
                {"key":"Latin American","title":"Latin American"},
                {"key":"Mexican","title":"Mexican"},
                {"key":"Other Hispanic","title":"Other Hispanic"},
                {"key":"Puerto Rican","title":"Puerto Rican"},
                {"key":"South American","title":"South American"},
                {"key":"Spaniard","title":"Spaniard"}]},
            {"key":"Unknown","title":"Unknown"},
            {"key":"Non-Hispanic","title":"Non-Hispanic"},],"defaultGroup":"row","helpText":"label.help.text.mortality.ethnicity","filterLength":13}],"sideFilters":[]};
        var allOptions = searchUtils.getAllSelectedFilterOptions(query, 'deaths');
        expect(allOptions.hispanicOrigin).to.not.equal(undefined);
        expect(allOptions.hispanicOrigin.options.length).to.equal(4);
        expect(allOptions.hispanicOrigin.options[0]).to.equal('Hispanic');
        expect(allOptions.hispanicOrigin.options[2]).to.equal('Puerto Rican');
        expect(allOptions.hispanicOrigin.options[3]).to.equal('Unknown');
        done();
    });

    it('get all filter options for STD', function(done){
        var q = {"key":"std","title":"label.filter.std","primary":true,"value":[],"header":"Sexually Transmitted Diseases/Infections","allFilters":[{"key":"current_year","title":"label.filter.year","queryKey":"current_year","primary":false,"value":"2015","defaultValue":"2015","groupBy":false,"filterType":"radio","defaultGroup":"column","autoCompleteOptions":[{"key":"2015","title":"2015"},{"key":"2014","title":"2014"},{"key":"2013","title":"2013"},{"key":"2012","title":"2012"},{"key":"2011","title":"2011"},{"key":"2010","title":"2010"},{"key":"2009","title":"2009"},{"key":"2008","title":"2008"},{"key":"2007","title":"2007"},{"key":"2006","title":"2006"},{"key":"2005","title":"2005"},{"key":"2004","title":"2004"},{"key":"2003","title":"2003"},{"key":"2002","title":"2002"},{"key":"2001","title":"2001"},{"key":"2000","title":"2000"}],"doNotShowAll":true,"helpText":"label.std.help.text.year"},{"key":"disease","title":"label.filter.disease","queryKey":"disease","primary":false,"value":"Chlamydia","defaultValue":"Chlamydia","groupBy":false,"filterType":"radio","defaultGroup":"row","autoCompleteOptions":[{"key":"Chlamydia","title":"Chlamydia"},{"key":"Gonorrhea","title":"Gonorrhea"},{"key":"Primary and Secondary Syphilis","title":"Primary and Secondary Syphilis"},{"key":"Early LatentSyphilis","title":"Early Latent Syphilis"},{"key":"Congenital Syphilis","title":"Congenital Syphilis"}],"doNotShowAll":true,"helpText":"label.std.help.text.disease"},{"key":"state","title":"label.filter.state","queryKey":"state","primary":false,"value":"National","defaultValue":"National","groupBy":false,"filterType":"radio","displaySearchBox":true,"displaySelectedFirst":true,"autoCompleteOptions":[{"key":"National","title":"National"},{"key":"AL","title":"Alabama"},{"key":"AK","title":"Alaska"},{"key":"AZ","title":"Arizona"},{"key":"AR","title":"Arkansas"},{"key":"CA","title":"California"},{"key":"CO","title":"Colorado"},{"key":"CT","title":"Connecticut"},{"key":"DE","title":"Delaware"},{"key":"DC","title":"District of Columbia"},{"key":"FL","title":"Florida"},{"key":"GA","title":"Georgia"},{"key":"HI","title":"Hawaii"},{"key":"ID","title":"Idaho"},{"key":"IL","title":"Illinois"},{"key":"IN","title":"Indiana"},{"key":"IA","title":"Iowa"},{"key":"KS","title":"Kansas"},{"key":"KY","title":"Kentucky"},{"key":"LA","title":"Louisiana"},{"key":"ME","title":"Maine"},{"key":"MD","title":"Maryland"},{"key":"MA","title":"Massachusetts"},{"key":"MI","title":"Michigan"},{"key":"MN","title":"Minnesota"},{"key":"MS","title":"Mississippi"},{"key":"MO","title":"Missouri"},{"key":"MT","title":"Montana"},{"key":"NE","title":"Nebraska"},{"key":"NV","title":"Nevada"},{"key":"NH","title":"New Hampshire"},{"key":"NJ","title":"New Jersey"},{"key":"NM","title":"New Mexico"},{"key":"NY","title":"New York"},{"key":"NC","title":"North Carolina"},{"key":"ND","title":"North Dakota"},{"key":"OH","title":"Ohio"},{"key":"OK","title":"Oklahoma"},{"key":"OR","title":"Oregon"},{"key":"PA","title":"Pennsylvania"},{"key":"RI","title":"Rhode Island"},{"key":"SC","title":"South Carolina"},{"key":"SD","title":"South Dakota"},{"key":"TN","title":"Tennessee"},{"key":"TX","title":"Texas"},{"key":"UT","title":"Utah"},{"key":"VT","title":"Vermont"},{"key":"VA","title":"Virginia"},{"key":"WA","title":"Washington"},{"key":"WV","title":"West Virginia"},{"key":"WI","title":"Wisconsin"},{"key":"WY","title":"Wyoming"}],"doNotShowAll":true,"defaultGroup":"row","helpText":"label.std.help.text.state"},{"key":"age_group","title":"label.filter.agegroup","queryKey":"age_group","primary":false,"value":"All age groups","defaultValue":"All age groups","groupBy":false,"filterType":"radio","defaultGroup":"row","autoCompleteOptions":[{"key":"All age groups","title":"All age groups"},{"key":"0-14","title":"0-14"},{"key":"15-19","title":"15-19"},{"key":"20-24","title":"20-24"},{"key":"25-29","title":"25-29"},{"key":"30-34","title":"30-34"},{"key":"35-39","title":"35-39"},{"key":"40-44","title":"40-44"},{"key":"45-54","title":"45-54"},{"key":"55-64","title":"55-64"},{"key":"65+","title":"65+"},{"key":"Unknown","title":"Unknown"}],"doNotShowAll":true,"helpText":"label.std.help.text.age.group"},{"key":"race","title":"label.yrbs.filter.race","queryKey":"race_ethnicity","primary":false,"value":"All races/ethnicities","defaultValue":"All races/ethnicities","groupBy":"row","filterType":"radio","defaultGroup":"row","autoCompleteOptions":[{"key":"All races/ethnicities","title":"All races/ethnicities"},{"key":"American Indian or Alaska Native","title":"American Indian or Alaska Native"},{"key":"Asian","title":"Asian"},{"key":"Black or African American","title":"Black or African American"},{"key":"Hispanic or Latino","title":"Hispanic or Latino"},{"key":"Native Hawaiian or Other PacificIslander","title":"Native Hawaiian or Other Pacific Islander"},{"key":"White","title":"White"},{"key":"Multiple races","title":"Multiple races"},{"key":"Unknown","title":"Unknown"}],"doNotShowAll":true,"helpText":"label.std.help.text.race.ethnicity"},{"key":"sex","title":"label.filter.gender","queryKey":"sex","primary":false,"value":"Both sexes","defaultValue":"Both sexes","groupBy":"column","defaultGroup":"column","filterType":"radio","autoCompleteOptions":[{"key":"Both sexes","title":"Both sexes"},{"key":"Female","title":"Female"},{"key":"Male","title":"Male"}],"doNotShowAll":true,"helpText":"label.std.help.text.sex"}],"showMap":true,"mapData":{},"chartAxisLabel":"Cases","tableView":"std","countLabel":"Number of Cases","chartViewOptions":[{"key":"cases","title":"Cases","axisLabel":"Cases","tooltip":"Select to view as cases on charts"},{"key":"disease_rate","title":"Rates","axisLabel":"Rates","tooltip":"Select to view as rates on charts"}],"chartView":"cases","runOnFilterChange":true,"applySuppression":true,"countQueryKey":"cases","sideFilters":[]};
        var allOptions = searchUtils.getAllFilterOptions(q);
        expect(allOptions.current_year).to.not.equal(undefined);
        expect(allOptions.current_year.options.length).to.equal(16);
        expect(allOptions.disease.options.length).to.equal(5);
        expect(allOptions.disease.options[0]).to.equal('Chlamydia');
        //including National
        expect(allOptions.state.options.length).to.equal(52);
        expect(allOptions.age_group.options.length).to.equal(12);
        expect(allOptions.race.options.length).to.equal(9);
        expect(allOptions.race.options[3]).to.equal('Black or African American');
        expect(allOptions.race.options[8]).to.equal('Unknown');
        expect(allOptions.sex.options.length).to.equal(3);
        expect(allOptions.sex.options[0]).to.equal('Both sexes');
        done();
    });

    it('should suppress state counts when it comes down to specified value', function (done) {
        var stateData = [{"name":"CA","deaths":10},{"name":"TX","deaths":11},{"name":"FL","deaths":5},{"name":"OH","deaths":431},{"name":"IL","deaths":430},{"name":"PA","deaths":420},{"name":"TN","deaths":6}];

        searchUtils.suppressStateTotals(stateData, 'deaths', 10);

        //10 & above should not be suppressed
        expect(stateData[0]['deaths']).to.equal(10);
        expect(stateData[1]['deaths']).to.equal(11);
        //FL count is 5 < 10, should be suppressed
        expect(stateData[2]['deaths']).to.equal('suppressed');
        done();
    })

    describe('.isFilterApplied', function () {
        it('should return a boolean', function () {
            expect(searchUtils.isFilterApplied({ value: [], groupBy: false })).to.be.a('boolean');
        });

        it('should return true when there is a value', function () {
            expect(searchUtils.isFilterApplied({ value: [ '2014' ], groupBy: false })).to.be.ok();
        });

        it('should return true when groupBy is truthy', function () {
            expect(searchUtils.isFilterApplied({ value: [], groupBy: 'row' })).to.be.ok();
        });

        it('should work when value is not an array', function () {
            expect(searchUtils.isFilterApplied({ value: '', groupBy: false })).to.not.be.ok();
            expect(searchUtils.isFilterApplied({ value: '2014', groupBy: false })).to.be.ok();
        });
    });

    describe('.findAllAppliedFilters', function () {
        var mock
        before(function () {
            mock = [
              { key: 'current_year', value: [ '2015' ], groupBy: false },
              { key: 'state', value: [], groupBy: false },
              { key: 'race', value: [], groupBy: 'row' },
              { key: 'sex', value: [], groupBy: 'column' }
            ]
        });

        it('should return an array', function () {
            expect(searchUtils.findAllAppliedFilters(mock, [])).to.be.a('array');
        });

        it('should return the keys of applied filters', function () {
            expect(searchUtils.findAllAppliedFilters(mock, [])).to.eql([ 'current_year', 'race', 'sex' ]);
        });

        it('should be able to ignore keys passed in', function () {
            expect(searchUtils.findAllAppliedFilters(mock.slice(0, 2), [ 'current_year', 'state' ])).to.be.empty();
        });
    });

    describe('.hasFilterApplied', function () {
        var mock;
        before(function () {
            mock = [
              { key: 'current_year', value: [ '2015' ], groupBy: false },
              { key: 'state', value: [], groupBy: false },
              { key: 'race', value: [], groupBy: 'row' },
              { key: 'sex', value: [], groupBy: 'column' }
            ];
        });

        it('should return a boolean', function () {
            expect(searchUtils.hasFilterApplied(mock, [ 'current_year' ])).to.be.a('boolean');
        });

        it('should return true when allFilters has a target filter applied', function () {
            expect(searchUtils.hasFilterApplied(mock, [ 'current_year' ])).to.be(true);
            expect(searchUtils.hasFilterApplied(mock, [ 'current_year', 'race' ])).to.be(true);
        });

        it('should return false when allFilters does not have a target filter applied', function () {
            expect(searchUtils.hasFilterApplied(mock, [ 'state' ])).to.be(false);
        });
    });

    describe('.recursivelySuppressOptions', function () {
        it('should change each of the countKey values to suppressed', function () {
            var mock = { filter: [{ name: 'option 1', countKey: 1234 }, { name: 'option 2', countKey: 12345 }] }
            searchUtils.recursivelySuppressOptions(mock, 'countKey', 'suppressed');
            mock.filter.map(function (option) {
              expect(option.countKey).to.eql('suppressed');
            });
        });

        it('should work with deeply nested trees', function () {
            var mock = { filter1: [{ name: 'option', countKey: 1234, filter2: [{ name: 'option2', countKey: 123 }, { name: 'option3', countKey: 234 }] }] };
            searchUtils.recursivelySuppressOptions(mock, 'countKey', 'suppressed');
            expect(mock.filter1[0].countKey).to.eql('suppressed');
            expect(mock.filter1[0].filter2[0].countKey).to.eql('suppressed');
            expect(mock.filter1[0].filter2[1].countKey).to.eql('suppressed');
        });

        it('should leave unmatching properties untouched', function () {
            var mock = { filter1: [{ name: 'option', filter2: [{ name: 'option2' }, { name: 'option3' }] }] };
            searchUtils.recursivelySuppressOptions(mock, 'countKey', 'suppressed');
            expect(mock).to.eql(mock);
        });

        it('should change the countKey value to the suppressionValue', function () {
            var mock = { filter1: [{ name: 'option', countKey: 1234, filter2: [{ name: 'option2', countKey: 123 }, { name: 'option3', countKey: 234 }] }] };
            searchUtils.recursivelySuppressOptions(mock, 'countKey', 'suppressed value')
            expect(mock.filter1[0].countKey).to.eql('suppressed value');
            expect(mock.filter1[0].filter2[0].countKey).to.eql('suppressed value');
            expect(mock.filter1[0].filter2[1].countKey).to.eql('suppressed value');
        });
    });

    describe('.searchTree', function () {
        it('should change the value of countKey to suppressed when options match rule and leave unmatched portions unchanged', function () {
            var mock = { filter1: [{ name: 'option', countKey: 1234, filter2: [{ name: 'option2', countKey: 123 }, { name: 'option3', countKey: 234 }] }] };
            var rule = [ 'option', 'option2' ];
            searchUtils.searchTree(mock, rule, { countKey: 'countKey', suppressionValue: 'suppressed' }, []);
            expect(mock.filter1[0].filter2[0].countKey).to.eql('suppressed');
            expect(mock.filter1[0].filter2[1].countKey).to.eql(234);
        });

        it('should not change the value of countKey when rule does not match', function () {
            var mock = { filter1: [{ name: 'option', countKey: 1234, filter2: [{ name: 'option2', countKey: 123 }, { name: 'option3', countKey: 234 }] }] };
            var rule = [ 'option', 'non-option' ];
            searchUtils.searchTree(mock, rule, { countKey: 'countKey', suppressionValue: 'suppressed' }, []);
            expect(mock).to.eql(mock);
        });

        it('should suppress all options within the tree once a match is found', function () {
            var mock = { filter1: [{ name: 'option', countKey: 1234, filter2: [{ name: 'option2', countKey: 123 }, { name: 'option3', countKey: 234 }] }] };
            var rule = [ 'option' ];
            searchUtils.searchTree(mock, rule, { countKey: 'countKey', suppressionValue: 'suppressed' }, []);
            expect(mock.filter1[0].countKey).to.eql('suppressed');
            expect(mock.filter1[0].filter2[0].countKey).to.eql('suppressed');
            expect(mock.filter1[0].filter2[1].countKey).to.eql('suppressed');
        });
    });

    describe('.createCancerIncidenceSuppressionRules', function () {
        it('should return an array', function () {
            expect(searchUtils.createCancerIncidenceSuppressionRules([], [])).to.be.a('array');
        });

        it('should add addtional rules when given years 2013 and/or 2014', function () {
            var rules = searchUtils.createCancerIncidenceSuppressionRules([], []).length;
            var additionalRules = searchUtils.createCancerIncidenceSuppressionRules([ '2013' ], []).length;
            expect(additionalRules).to.be.greaterThan(rules);
        });

        it('should add single properties when specific states are selected', function () {
            var rules = searchUtils.createCancerIncidenceSuppressionRules([], [ 'NJ' ]);
            expect(rules[rules.length - 1]).to.eql([ 'American Indian/Alaska Native' ]);
        });
    });

    describe('.applyCustomSuppressions', function () {
        it('should suppress the countKey value in each chart and the table', function () {
            var data = {
              table: { filter1: [{ name: 'option', countKey: 1234, filter2: [{ name: 'option2', countKey: 123 }, { name: 'option3', countKey: 234 }] }] },
              charts: [{ filter1: [{ name: 'option', countKey: 1234, filter2: [{ name: 'option2', countKey: 123 }, { name: 'option3', countKey: 234 }] }] }]
            };
            var rules = [[ 'option', 'option2']];
            searchUtils.applyCustomSuppressions(data, rules, 'countKey');
            expect(data.table.filter1[0].filter2[0].countKey).to.eql('suppressed');
            expect(data.charts[0].filter1[0].filter2[0].countKey).to.eql(-1);
        });
    });

    describe('.createPopIndex', function () {
        var pop
        before(function () {
            pop = require('./data/cancer_data').population;
        });

        it('should create return an object', function () {
            expect(searchUtils.createPopIndex(pop, 'cancer_population')).to.be.an('object');
        });

        it('should create a key for each node in the tree', function () {
            var actual = searchUtils.createPopIndex(pop, 'cancer_population');
            [
              'race.White.sex.Female',
              'race.White.sex.Male',
              'race.Black.sex.Female',
              'race.Black.sex.Male',
              'race.American Indian/Alaska Native.sex.Female',
              'race.American Indian/Alaska Native.sex.Male',
              'race.Asian or Pacific Islander.sex.Female',
              'race.Asian or Pacific Islander.sex.Male'
            ].forEach(function (key) {
                expect(Object.keys(actual)).to.contain(key);
            });
        });
    });

    describe('.attachPopulation', function () {
        var root, pop;
        before(function () {
            root = require('./data/cancer_data').incidence;
            pop = searchUtils.createPopIndex(require('./data/cancer_data').population, 'cancer_population');
        });

        it('should attach the pop property to the root that has a matching path', function () {
            searchUtils.attachPopulation(root, pop, '');
            expect(root.race[0].sex[0].pop).to.eql(126445081);
            expect(root.race[0].pop).to.eql(250529673);
        });

        it('should attach an "n/a" to non-existent paths', function () {
            searchUtils.attachPopulation(root, pop, '');
            expect(root.race[3].sex[0].pop).to.eql('n/a');
            expect(root.race[3].pop).to.eql('n/a');
        });

    });

    describe('.applyPopulationSpecificSuppression', function () {
        var mock;
        before(function () {
            mock = { filter1: [{ name: 'option', countKey: 1234, pop: 60000, filter2: [{ name: 'option2', countKey: 123, pop: 55000 }, { name: 'option3', countKey: 234, pop: 5000 }] }] };
        });
        after(function () {
            mock = null;
        });

        it('should change the countKey value to suppressed when the pop value is less than 50000', function () {
            searchUtils.applyPopulationSpecificSuppression(mock, 'countKey');
            expect(mock.filter1[0].filter2[1].countKey).to.eql('suppressed');
        });

        it('should not change the countKey value when the pop is greater than 50000', function () {
            searchUtils.applyPopulationSpecificSuppression(mock, 'countKey');
            expect(mock.filter1[0].countKey).to.eql(1234);
        });
    });

    describe('suppression for cancer mortality', function () {

        it('should suppress all Kaposi sarkoma details', function () {
            var data = {"table":{"race":[{"name":"American Indian/Alaska Native","cancer_mortality":"suppressed","site":[{"name":"31010-31040","cancer_mortality":69,"sex":[{"name":"Female","cancer_mortality":32,"pop":2248348},{"name":"Male","cancer_mortality":37,"pop":2267184}],"pop":4515532},{"name":"36020","cancer_mortality":"suppressed","sex":[{"name":"Female","cancer_mortality":"suppressed","pop":2248348},{"name":"Male","cancer_mortality":"suppressed","pop":2267184}],"pop":4515532}],"pop":4515532},{"name":"Asian or Pacific Islander","cancer_mortality":"suppressed","site":[{"name":"31010-31040","cancer_mortality":376,"sex":[{"name":"Female","cancer_mortality":184,"pop":10183290},{"name":"Male","cancer_mortality":192,"pop":9362812}],"pop":19546102},{"name":"36020","cancer_mortality":"suppressed","sex":[{"name":"Female","cancer_mortality":"suppressed","pop":10183290},{"name":"Male","cancer_mortality":"suppressed","pop":9362812}],"pop":19546102}],"pop":19546102},{"name":"Black","cancer_mortality":"suppressed","site":[{"name":"31010-31040","cancer_mortality":1122,"sex":[{"name":"Female","cancer_mortality":543,"pop":23075345},{"name":"Male","cancer_mortality":579,"pop":21240749}],"pop":44316094},{"name":"36020","cancer_mortality":"suppressed","sex":[{"name":"Female","cancer_mortality":"suppressed","pop":23075345},{"name":"Male","cancer_mortality":"suppressed","pop":21240749}],"pop":44316094}],"pop":44316094},{"name":"White","cancer_mortality":"suppressed","site":[{"name":"31010-31040","cancer_mortality":14430,"sex":[{"name":"Female","cancer_mortality":6219,"pop":126445081},{"name":"Male","cancer_mortality":8211,"pop":124084592}],"pop":250529673},{"name":"36020","cancer_mortality":"suppressed","sex":[{"name":"Female","cancer_mortality":"suppressed","pop":126445081},{"name":"Male","cancer_mortality":35,"pop":124084592}],"pop":250529673}],"pop":250529673}]},"charts":[{"sex":[{"name":"Female","cancer_mortality":6991,"race":[{"name":"American Indian/Alaska Native","cancer_mortality":32,"pop":2248348},{"name":"Asian or Pacific Islander","cancer_mortality":184,"pop":10183290},{"name":"Black","cancer_mortality":546,"pop":23075345},{"name":"White","cancer_mortality":6229,"pop":126445081}],"pop":161952064},{"name":"Male","cancer_mortality":9064,"race":[{"name":"American Indian/Alaska Native","cancer_mortality":37,"pop":2267184},{"name":"Asian or Pacific Islander","cancer_mortality":193,"pop":9362812},{"name":"Black","cancer_mortality":588,"pop":21240749},{"name":"White","cancer_mortality":8246,"pop":124084592}],"pop":156955337}]}],"maps":{"states":[{"name":"AL","cancer_mortality":291,"sex":[{"name":"Female","cancer_mortality":129,"pop":"n/a"},{"name":"Male","cancer_mortality":162,"pop":"n/a"}],"pop":"n/a"},{"name":"AK","cancer_mortality":"suppressed","sex":[{"name":"Female","cancer_mortality":"suppressed","pop":"n/a"},{"name":"Male","cancer_mortality":"suppressed","pop":"n/a"}],"pop":"n/a"},{"name":"AZ","cancer_mortality":362,"sex":[{"name":"Female","cancer_mortality":154,"pop":"n/a"},{"name":"Male","cancer_mortality":208,"pop":"n/a"}],"pop":"n/a"},{"name":"AR","cancer_mortality":168,"sex":[{"name":"Female","cancer_mortality":73,"pop":"n/a"},{"name":"Male","cancer_mortality":95,"pop":"n/a"}],"pop":"n/a"},{"name":"CA","cancer_mortality":1755,"sex":[{"name":"Female","cancer_mortality":744,"pop":"n/a"},{"name":"Male","cancer_mortality":1011,"pop":"n/a"}],"pop":"n/a"},{"name":"CO","cancer_mortality":243,"sex":[{"name":"Female","cancer_mortality":120,"pop":"n/a"},{"name":"Male","cancer_mortality":123,"pop":"n/a"}],"pop":"n/a"},{"name":"CT","cancer_mortality":190,"sex":[{"name":"Female","cancer_mortality":78,"pop":"n/a"},{"name":"Male","cancer_mortality":112,"pop":"n/a"}],"pop":"n/a"},{"name":"DE","cancer_mortality":43,"sex":[{"name":"Female","cancer_mortality":20,"pop":"n/a"},{"name":"Male","cancer_mortality":23,"pop":"n/a"}],"pop":"n/a"},{"name":"DC","cancer_mortality":"suppressed","sex":[{"name":"Female","cancer_mortality":"suppressed","pop":"n/a"},{"name":"Male","cancer_mortality":"suppressed","pop":"n/a"}],"pop":"n/a"},{"name":"FL","cancer_mortality":1123,"sex":[{"name":"Female","cancer_mortality":480,"pop":"n/a"},{"name":"Male","cancer_mortality":643,"pop":"n/a"}],"pop":"n/a"},{"name":"GA","cancer_mortality":482,"sex":[{"name":"Female","cancer_mortality":215,"pop":"n/a"},{"name":"Male","cancer_mortality":267,"pop":"n/a"}],"pop":"n/a"},{"name":"HI","cancer_mortality":48,"sex":[{"name":"Female","cancer_mortality":23,"pop":"n/a"},{"name":"Male","cancer_mortality":25,"pop":"n/a"}],"pop":"n/a"},{"name":"ID","cancer_mortality":106,"sex":[{"name":"Female","cancer_mortality":43,"pop":"n/a"},{"name":"Male","cancer_mortality":63,"pop":"n/a"}],"pop":"n/a"},{"name":"IL","cancer_mortality":613,"sex":[{"name":"Female","cancer_mortality":273,"pop":"n/a"},{"name":"Male","cancer_mortality":340,"pop":"n/a"}],"pop":"n/a"},{"name":"IN","cancer_mortality":327,"sex":[{"name":"Female","cancer_mortality":144,"pop":"n/a"},{"name":"Male","cancer_mortality":183,"pop":"n/a"}],"pop":"n/a"},{"name":"IA","cancer_mortality":174,"sex":[{"name":"Female","cancer_mortality":72,"pop":"n/a"},{"name":"Male","cancer_mortality":102,"pop":"n/a"}],"pop":"n/a"},{"name":"KS","cancer_mortality":170,"sex":[{"name":"Female","cancer_mortality":70,"pop":"n/a"},{"name":"Male","cancer_mortality":100,"pop":"n/a"}],"pop":"n/a"},{"name":"KY","cancer_mortality":237,"sex":[{"name":"Female","cancer_mortality":94,"pop":"n/a"},{"name":"Male","cancer_mortality":143,"pop":"n/a"}],"pop":"n/a"},{"name":"LA","cancer_mortality":206,"sex":[{"name":"Female","cancer_mortality":100,"pop":"n/a"},{"name":"Male","cancer_mortality":106,"pop":"n/a"}],"pop":"n/a"},{"name":"ME","cancer_mortality":106,"sex":[{"name":"Female","cancer_mortality":42,"pop":"n/a"},{"name":"Male","cancer_mortality":64,"pop":"n/a"}],"pop":"n/a"},{"name":"MD","cancer_mortality":272,"sex":[{"name":"Female","cancer_mortality":112,"pop":"n/a"},{"name":"Male","cancer_mortality":160,"pop":"n/a"}],"pop":"n/a"},{"name":"MA","cancer_mortality":348,"sex":[{"name":"Female","cancer_mortality":154,"pop":"n/a"},{"name":"Male","cancer_mortality":194,"pop":"n/a"}],"pop":"n/a"},{"name":"MI","cancer_mortality":551,"sex":[{"name":"Female","cancer_mortality":239,"pop":"n/a"},{"name":"Male","cancer_mortality":312,"pop":"n/a"}],"pop":"n/a"},{"name":"MN","cancer_mortality":287,"sex":[{"name":"Female","cancer_mortality":116,"pop":"n/a"},{"name":"Male","cancer_mortality":171,"pop":"n/a"}],"pop":"n/a"},{"name":"MS","cancer_mortality":193,"sex":[{"name":"Female","cancer_mortality":91,"pop":"n/a"},{"name":"Male","cancer_mortality":102,"pop":"n/a"}],"pop":"n/a"},{"name":"MO","cancer_mortality":313,"sex":[{"name":"Female","cancer_mortality":125,"pop":"n/a"},{"name":"Male","cancer_mortality":188,"pop":"n/a"}],"pop":"n/a"},{"name":"MT","cancer_mortality":60,"sex":[{"name":"Female","cancer_mortality":28,"pop":"n/a"},{"name":"Male","cancer_mortality":32,"pop":"n/a"}],"pop":"n/a"},{"name":"NE","cancer_mortality":104,"sex":[{"name":"Female","cancer_mortality":45,"pop":"n/a"},{"name":"Male","cancer_mortality":59,"pop":"n/a"}],"pop":"n/a"},{"name":"NV","cancer_mortality":141,"sex":[{"name":"Female","cancer_mortality":53,"pop":"n/a"},{"name":"Male","cancer_mortality":88,"pop":"n/a"}],"pop":"n/a"},{"name":"NH","cancer_mortality":89,"sex":[{"name":"Female","cancer_mortality":40,"pop":"n/a"},{"name":"Male","cancer_mortality":49,"pop":"n/a"}],"pop":"n/a"},{"name":"NJ","cancer_mortality":453,"sex":[{"name":"Female","cancer_mortality":193,"pop":"n/a"},{"name":"Male","cancer_mortality":260,"pop":"n/a"}],"pop":"n/a"},{"name":"NM","cancer_mortality":89,"sex":[{"name":"Female","cancer_mortality":35,"pop":"n/a"},{"name":"Male","cancer_mortality":54,"pop":"n/a"}],"pop":"n/a"},{"name":"NY","cancer_mortality":899,"sex":[{"name":"Female","cancer_mortality":397,"pop":"n/a"},{"name":"Male","cancer_mortality":502,"pop":"n/a"}],"pop":"n/a"},{"name":"NC","cancer_mortality":486,"sex":[{"name":"Female","cancer_mortality":234,"pop":"n/a"},{"name":"Male","cancer_mortality":252,"pop":"n/a"}],"pop":"n/a"},{"name":"ND","cancer_mortality":40,"sex":[{"name":"Female","cancer_mortality":18,"pop":"n/a"},{"name":"Male","cancer_mortality":22,"pop":"n/a"}],"pop":"n/a"},{"name":"OH","cancer_mortality":636,"sex":[{"name":"Female","cancer_mortality":267,"pop":"n/a"},{"name":"Male","cancer_mortality":369,"pop":"n/a"}],"pop":"n/a"},{"name":"OK","cancer_mortality":205,"sex":[{"name":"Female","cancer_mortality":87,"pop":"n/a"},{"name":"Male","cancer_mortality":118,"pop":"n/a"}],"pop":"n/a"},{"name":"OR","cancer_mortality":257,"sex":[{"name":"Female","cancer_mortality":99,"pop":"n/a"},{"name":"Male","cancer_mortality":158,"pop":"n/a"}],"pop":"n/a"},{"name":"PA","cancer_mortality":679,"sex":[{"name":"Female","cancer_mortality":301,"pop":"n/a"},{"name":"Male","cancer_mortality":378,"pop":"n/a"}],"pop":"n/a"},{"name":"RI","cancer_mortality":66,"sex":[{"name":"Female","cancer_mortality":24,"pop":"n/a"},{"name":"Male","cancer_mortality":42,"pop":"n/a"}],"pop":"n/a"},{"name":"SC","cancer_mortality":270,"sex":[{"name":"Female","cancer_mortality":118,"pop":"n/a"},{"name":"Male","cancer_mortality":152,"pop":"n/a"}],"pop":"n/a"},{"name":"SD","cancer_mortality":52,"sex":[{"name":"Female","cancer_mortality":18,"pop":"n/a"},{"name":"Male","cancer_mortality":34,"pop":"n/a"}],"pop":"n/a"},{"name":"TN","cancer_mortality":382,"sex":[{"name":"Female","cancer_mortality":159,"pop":"n/a"},{"name":"Male","cancer_mortality":223,"pop":"n/a"}],"pop":"n/a"},{"name":"TX","cancer_mortality":1098,"sex":[{"name":"Female","cancer_mortality":504,"pop":"n/a"},{"name":"Male","cancer_mortality":594,"pop":"n/a"}],"pop":"n/a"},{"name":"UT","cancer_mortality":118,"sex":[{"name":"Female","cancer_mortality":53,"pop":"n/a"},{"name":"Male","cancer_mortality":65,"pop":"n/a"}],"pop":"n/a"},{"name":"VT","cancer_mortality":"suppressed","sex":[{"name":"Female","cancer_mortality":"suppressed","pop":"n/a"},{"name":"Male","cancer_mortality":22,"pop":"n/a"}],"pop":"n/a"},{"name":"VA","cancer_mortality":380,"sex":[{"name":"Female","cancer_mortality":199,"pop":"n/a"},{"name":"Male","cancer_mortality":181,"pop":"n/a"}],"pop":"n/a"},{"name":"WA","cancer_mortality":378,"sex":[{"name":"Female","cancer_mortality":166,"pop":"n/a"},{"name":"Male","cancer_mortality":212,"pop":"n/a"}],"pop":"n/a"},{"name":"WV","cancer_mortality":116,"sex":[{"name":"Female","cancer_mortality":49,"pop":"n/a"},{"name":"Male","cancer_mortality":67,"pop":"n/a"}],"pop":"n/a"},{"name":"WI","cancer_mortality":341,"sex":[{"name":"Female","cancer_mortality":149,"pop":"n/a"},{"name":"Male","cancer_mortality":192,"pop":"n/a"}],"pop":"n/a"},{"name":"WY","cancer_mortality":"suppressed","sex":[{"name":"Female","cancer_mortality":"suppressed","pop":"n/a"},{"name":"Male","cancer_mortality":19,"pop":"n/a"}],"pop":"n/a"}]}};

            var rules = [["36020"]];//Kaposi sarcoma
            searchUtils.applyCustomSuppressions(data, rules, 'cancer_mortality');

            //other cancer sites should not be suppressed
            expect(data.table.race[0].site[0].name).to.eql('31010-31040');
            expect(data.table.race[0].site[0].cancer_mortality).to.eql(69);
            expect(data.table.race[1].site[0].name).to.eql('31010-31040');
            expect(data.table.race[1].site[0].cancer_mortality).to.eql(376);
            expect(data.table.race[2].site[0].name).to.eql('31010-31040');
            expect(data.table.race[2].site[0].cancer_mortality).to.eql(1122);
            expect(data.table.race[3].site[0].name).to.eql('31010-31040');
            expect(data.table.race[3].site[0].cancer_mortality).to.eql(14430);

            //other cancer sites should not be suppressed
            expect(data.table.race[0].site[1].name).to.eql('36020');
            expect(data.table.race[0].site[1].cancer_mortality).to.eql('suppressed');
            expect(data.table.race[1].site[1].name).to.eql('36020');
            expect(data.table.race[1].site[1].cancer_mortality).to.eql('suppressed');
            expect(data.table.race[2].site[1].name).to.eql('36020');
            expect(data.table.race[2].site[1].cancer_mortality).to.eql('suppressed');
            expect(data.table.race[3].site[1].name).to.eql('36020');
            expect(data.table.race[3].site[1].cancer_mortality).to.eql('suppressed');
        });

    });
});
