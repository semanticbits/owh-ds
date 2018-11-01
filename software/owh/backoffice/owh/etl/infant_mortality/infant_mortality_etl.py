import json
import os
from random import randint
from owh.etl.common.etl import ETL
import logging
from owh.etl.common.datafile_parser import DataFileParser

logger = logging.getLogger('infant_mortality_etl')

class InfantMortalityETL (ETL):

    def __init__(self, configFile):
        ETL.__init__(self, configFile)
        # if 'action' is specified then set, else default to replace
        self.action = self.config.get('action', 'replace')

        self.create_index(os.path.join(os.path.dirname(__file__), "es_mapping"
                           ,self.config['elastic_search']['type_mapping'])
                           ,self.action == 'replace')
    def perform_etl(self):
        """Load infant mortality metadata data"""
        self.updateDsMetadata()

    def updateDsMetadata(self):
        logger.info("*** Loading infant deaths Metadata ***")
        self.loadDataSetMetaData('infant_mortality', '2000', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2000_2002.json'))
        self.loadDataSetMetaData('infant_mortality', '2001', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2000_2002.json'))
        self.loadDataSetMetaData('infant_mortality', '2002', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2000_2002.json'))
        self.loadDataSetMetaData('infant_mortality', '2003', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2003_2006.json'))
        self.loadDataSetMetaData('infant_mortality', '2004', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2003_2006.json'))
        self.loadDataSetMetaData('infant_mortality', '2005', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2003_2006.json'))
        self.loadDataSetMetaData('infant_mortality', '2006', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2003_2006.json'))
        self.loadDataSetMetaData('infant_mortality', '2007', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2007_2016.json'))
        self.loadDataSetMetaData('infant_mortality', '2008', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2007_2016.json'))
        self.loadDataSetMetaData('infant_mortality', '2009', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2007_2016.json'))
        self.loadDataSetMetaData('infant_mortality', '2010', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2007_2016.json'))
        self.loadDataSetMetaData('infant_mortality', '2011', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2007_2016.json'))
        self.loadDataSetMetaData('infant_mortality', '2012', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2007_2016.json'))
        self.loadDataSetMetaData('infant_mortality', '2013', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2007_2016.json'))
        self.loadDataSetMetaData('infant_mortality', '2014', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2007_2016.json'))
        self.loadDataSetMetaData('infant_mortality', '2015', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2007_2016.json'))
        self.loadDataSetMetaData('infant_mortality', '2016', os.path.join(self.dataDirectory, 'data_mapping', 'infant_2007_2016.json'))
        logger.info("*** Metadata Loaded successfully ***")

    def validate_etl(self):
        return True

if __name__ == "__main__":
    # Perform ETL
    indexer = InfantMortalityETL(file(os.path.join(os.path.dirname(__file__), "config.yaml"), 'r'))
    indexer.execute()
