'use strict';

describe('Constants', function () {
    var owhConstant;

    beforeEach(module('owh'));

    beforeEach( inject(function (_Constant_) {
        owhConstant =_Constant_;
    }));

    it('should return constants',function(){
        expect(owhConstant.SUPPRESS_CODE).toEqual(-1);
        expect(owhConstant.NA_CODE).toEqual(-2);
        expect(owhConstant.DISABLED_CODE).toEqual(-3);
        expect(owhConstant.SUPPRESS_VAL).toEqual('Suppressed');
        expect(owhConstant.NO_DATA).toEqual('Not Available');
        expect(owhConstant.NOT_APPLICABLE).toEqual('Not Applicable');
    });

});