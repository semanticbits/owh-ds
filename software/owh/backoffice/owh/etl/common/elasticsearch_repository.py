__author__ = "Biju Joseph"

import logging

import elasticsearch
import time
from elasticsearch.helpers import bulk, scan
from repositories import Repository

logger = logging.getLogger('elastic')
logging.getLogger('elasticsearch').setLevel("WARN")
INDEX_SETTINGS = {
     "settings": {
        "refresh_interval" : "-1"
     }
}

class ElasticSearchRepository(Repository, object):
    """ A facade that provides functionality to index objects in ElasticSearch
    Attributes:
        host_name: the host name
        port: the port
        doctype: the name of the document type
    """
    def __init__(self, esConfig):
        """ Initializes the repo  """
        if esConfig and 'host' in esConfig and 'port' in esConfig and 'index' in esConfig and 'type' in esConfig :
            self.es = elasticsearch.Elasticsearch([{'host': esConfig['host'], 'port': esConfig['port']}])
            self.index_name = esConfig['index']
            Repository.__init__(self,esConfig['type'])
        else:
            logger.error ("One or more elastic search configuration not specified, unable to initialize elastic search")
            raise ValueError("One or more elastic search configuration not specified")

    def create_mappings(self, mapping):
        """
        Will create the mapping ONLY if the type is not present in the index.
        :param mapping:
        """
        if not self.es.indices.exists_type(index=self.index_name, doc_type=self.name):
            self.es.indices.put_mapping(index=self.index_name, doc_type=self.name, body=mapping)


    def create_index(self, mapping):
        """
        Will create the index
        Args:
            mapping:
        """
        if self.es.indices.exists(self.index_name):
            logging.info('Index %s already exists', self.index_name)
            return

        try:
            # Create the index
            logging.info('Creating index %s', self.index_name)
            self.es.indices.create(index= self.index_name, body=INDEX_SETTINGS, ignore=400)
            logging.info('Index created successfully. Waiting for shard allocations..')
            time.sleep(10)
            #specify the mapping
            self.create_mappings(mapping)
            self.es.indices.clear_cache(index=self.index_name)
        except Exception as e:
            logging.fatal('Error creating index  [%s] for doctype [%s]', self.index_name, self.name)
            logging.error(e)
            raise

    def delete_index(self):
        """
        Will delete the index
        """
        try:
            self.es.indices.delete(index=self.index_name)
            logging.info('Deleted index %s', self.index_name)
        except elasticsearch.ElasticsearchException:
            logging.info('Unable to delete index %s', self.index_name)

    def recreate_index(self, mappings):
        self.delete_index()
        self.create_index(mappings)

    def load(self, selector):
        """
        Will returnt the document identified by the ID in selector
        """
        return self.es.get(index=self.index_name, doc_type=self.name, id=selector)

    def persist(self, obj):
        """
        Will persist objects into the index
        Args:
            obj: an array of json objects that supports es bulk format

        Returns:
            The elastic search response object
        """
        res = self.es.bulk(index= self.index_name, body= obj, request_timeout = 30)
        return res

    def refresh_index(self):
        """Refresh the index"""
        return self.es.indices.refresh(index=self.index_name)

    def search(self, criteria, sort, pagination):
        return self.es.search(index=self.index_name, body=criteria)

    def count_records(self):
        return self.es.count(index=self.index_name, doc_type=self.name)['count']

    def get_record_by_id(self, id):
        return self.es.get(index=self.index_name, doc_type=self.name, id=id)

    def delete_records_by_query(self, q):
        """Delete records in the index matching the given query"""
        # FIXME: The delete function is not working as expected, the results vary by ES version
        # in 1.5.x, the delete action doesn't work at all, in 2.4.x it delete more records than specified
        # will need to use a newer version of ES
        # set the elasticsearh log to WARN to avoid too many logs from the scan
        logging.getLogger('elasticsearch').setLevel("WARN")
        bulk_deletes = []
        for result in scan(self.es,
           query=q,
           index=self.index_name,
           doc_type=self.name,
           _source=True,
           track_scores=False,
           scroll='5m'):
            logger.info(result)
            result['_op_type'] = 'delete'
            bulk_deletes.append(result)
        result = bulk(self.es, bulk_deletes)
        logging.getLogger('elasticsearch').setLevel("INFO")
        self.refresh_index()
        return result

    def delete_records_for_year(self, year):
        """Delete records with attribute current_year = year"""

        logger.warn("Deleting data for year %d", year)
        query={"query":{"match": {"current_year": str(year)}}}
        return self.delete_records_by_query(query)
