var Aggregation = function(bucket, countKey, countQueryKey) {
    this.name = bucket['key'];
    this[countKey] = countQueryKey && bucket["group_count_" + countQueryKey] ? bucket["group_count_" + countQueryKey].value : bucket['doc_count'];
};

module.exports = Aggregation;
