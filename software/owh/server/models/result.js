'use strict';
var Result = function( status, data, pagination, message ) {
    this.status = status;
    this.data = data;
    if(pagination) {
        this.pagination = {};
        this.pagination.total = pagination.total;
        this.pagination.from = pagination.from;
        this.pagination.size = pagination.size;
    }
    this.messages = message;
};

module.exports = Result;
