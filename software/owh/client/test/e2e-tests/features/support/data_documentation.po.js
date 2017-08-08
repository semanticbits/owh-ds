var DataSetDocumentationPage = function () {

    var dp = this;

    dp.getDocumentationLink = function () {
        return element(by.id('data_doc_link'));
    }
};

module.exports = new DataSetDocumentationPage;
