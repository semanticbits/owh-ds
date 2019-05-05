'use strict';

(function () {
    angular
        .module('owh')
        .constant('Constant', {
            SUPPRESS_CODE: -1,
            NA_CODE: -2,
            DISABLED_CODE: -3,
            SUPPRESS_VAL: 'Suppressed',
            NO_DATA: 'Not Available',
            NOT_APPLICABLE: 'Not Applicable'
        });
}());