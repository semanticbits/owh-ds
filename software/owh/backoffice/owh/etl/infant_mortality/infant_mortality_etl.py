import json
import os
from random import randint
from owh.etl.common.etl import ETL
import logging
from owh.etl.common.fixedwidthfile_parser import FixedWidthFileParser

logger = logging.getLogger('infant_mortality_etl')

data_mapping_configs = {'LinkPE00USNum.dat':'link_num_2000_2002.json', 'LinkPE01USNum.dat':'link_num_2000_2002.json',
                        'LinkPE02USNum.dat':'link_num_2000_2002.json', 'LinkPE03USNum.dat': 'link_num_2003.json',
                        'LinkPE04USNum.dat':'link_num_2004.json', 'VS05LINK.USNUMPUB': 'link_num_2005_2006.json',
                        'VS06LINK.USNUMPUB':'link_num_2005_2006.json', 'VS07LINK.USNUMPUB': 'link_num_2007_2008.json',
                        'VS08LINK.USNUMPUB':'link_num_2007_2008.json', 'VS09LINK.USNUMPUB':'link_num_2009_2013.json',
                        'VS10LINK.USNUMPUB':'link_num_2009_2013.json', 'VS11LINK.USNUMPUB':'link_num_2009_2013.json',
                        'VS12LINK.USNUMPUB':'link_num_2009_2013.json', 'VS13LINK.USNUMPUB':'link_num_2009_2013.json'}

class InfantMortalityETL (ETL):

    def __init__(self, configFile):
        ETL.__init__(self, configFile)
        # if 'action' is specified then set, else default to replace
        self.action = self.config.get('action', 'replace')

        self.create_index(os.path.join(os.path.dirname(__file__), "es_mapping"
                           ,self.config['elastic_search']['type_mapping'])
                           ,self.action == 'replace')
        self._load_icd_code_mappings()

    def _load_icd_code_mappings(self):
        with open(os.path.join(os.path.dirname(__file__),"es_mapping/conditions-ICD-10-mappings.json")) as jf:
            self.icd_10_code_mappings = json.load(jf, encoding="utf8")

    def _check_blanks(self, record):
        for key, value in record.iteritems():
            if value == '':  # check for blank
                record[key] = '_BLANK_'



    def perform_etl(self):
        """Perform the infant mortality ETL"""
        recordCount = 0
        deleteCount = 0
        self.initialCount = self.get_record_count()
        files = os.listdir(self.dataDirectory)
        files.sort()
        for f in files:
            if not os.path.isfile(os.path.join(self.dataDirectory, f)) or f.endswith(".zip") :
                continue

            file_path = os.path.join(self.dataDirectory, f)
            logger.info("Processing file: %s", f)

            # get the corresponding data mapping file
            config_file = os.path.join(self.dataDirectory, 'data_mapping', data_mapping_configs[f])

            if not config_file:
                logger.warn("No mapping available for data file %s, skipping", file_path)
                continue

            parser = FixedWidthFileParser(file_path, config_file)
            record = []
            while True:
                record  = parser.parseNextLine()
                if not record:
                    break

                if(record['residence'] == '4'):
                    logger.info ("Skipping foreign resident")
                    continue

                del record['residence']
                recordCount += 1

                icdcode = record['ICD_10_code'].upper()
                if (icdcode):
                    record['ICD_10_code'] = {'code': icdcode, 'path':self.icd_10_code_mappings[icdcode]}
                else:
                    record['ICD_10_code'] = self._check_blanks(icdcode)

                self._check_blanks(record)
                self.batchRepository.persist({"index": {"_index": self.config['elastic_search']['index'], "_type": self.config['elastic_search']['type'], "_id": recordCount}})
                self.batchRepository.persist(record)

            self.batchRepository.flush()
            self.refresh_index()
        self.metrics.insertCount=recordCount
        self.updateDsMetadata()
        logger.info("*** Processed %s records from all infant mortality data files", self.metrics.insertCount)


    def updateDsMetadata(self):
        logger.info("*** Loading infant deaths Metadata ***")
        self.loadDataSetMetaData('infant_mortality', '2000', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2000_2002.json'))
        self.loadDataSetMetaData('infant_mortality', '2001', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2000_2002.json'))
        self.loadDataSetMetaData('infant_mortality', '2002', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2000_2002.json'))
        self.loadDataSetMetaData('infant_mortality', '2003', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2003.json'))
        self.loadDataSetMetaData('infant_mortality', '2004', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2004.json'))
        self.loadDataSetMetaData('infant_mortality', '2005', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2005_2006.json'))
        self.loadDataSetMetaData('infant_mortality', '2006', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2005_2006.json'))
        self.loadDataSetMetaData('infant_mortality', '2007', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2007_2008.json'))
        self.loadDataSetMetaData('infant_mortality', '2008', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2007_2008.json'))
        self.loadDataSetMetaData('infant_mortality', '2009', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2007_2008.json'))
        self.loadDataSetMetaData('infant_mortality', '2010', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2007_2008.json'))
        self.loadDataSetMetaData('infant_mortality', '2011', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2007_2008.json'))
        self.loadDataSetMetaData('infant_mortality', '2012', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2007_2008.json'))
        self.loadDataSetMetaData('infant_mortality', '2013', os.path.join(self.dataDirectory, 'data_mapping', 'link_num_2007_2008.json'))
        logger.info("*** Metadata Loaded successfully ***")

    def validate_etl(self):
        """ Validate the ETL"""
        expectedCount = (self.initialCount + self.metrics.insertCount)
        if expectedCount != self.get_record_count():
            self.metrics.message = "Number of records in the DB (%d) not same as the number of records expected (%d)" % (self.get_record_count(), expectedCount)
            return False
        if self.get_record_by_id(1) is None:
            self.metrics.message = "Record 1 is None"
            return False
        if self.get_record_by_id(self.get_record_count()) is None:
            self.metrics.message = "Last record is None"
            return False
        return True

if __name__ == "__main__":
    # Perform ETL
    indexer = InfantMortalityETL(file(os.path.join(os.path.dirname(__file__), "config.yaml"), 'r'))
    indexer.execute()
