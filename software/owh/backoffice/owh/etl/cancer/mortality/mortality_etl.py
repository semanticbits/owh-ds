import os
import json
from owh.etl.common.etl import ETL
import logging
from owh.etl.common.datafile_parser import DataFileParser
logger = logging.getLogger('incident_etl')

class CancerMortalityETL (ETL):
    """
        Loads cancer mortality data into ES db
    """
    def __init__(self, configFile):
        ETL.__init__(self, configFile)
        self.create_index(os.path.join(os.path.dirname(__file__), "es_mapping"
                             ,self.config['elastic_search']['type_mapping']), True)
        self._load_cancer_site_mappings()

    def _load_cancer_site_mappings(self):
        with open(os.path.join(os.path.dirname(__file__),"es_mapping/cancer-site-mappings.json")) as jf:
            self.cancer_site_mappings = json.load(jf, encoding="utf8")

    def process_cancer_sites(self, record):
        print record['cancer_site']
        if record['cancer_site'] == '26000':# to separate male/female breast cancer sites
            if record['sex'] == 'Male':
                record['cancer_site'] = '26000-Male'
            else:
                record['cancer_site'] = '26000-Female'

        site_hierarchy = []
        if record['cancer_site']:
            site_hierarchy  = self.cancer_site_mappings[record['cancer_site']]
        record['cancer_site'] = {'code': record['cancer_site'], 'path': site_hierarchy}

    def perform_etl(self):
        """Load the cancer mortality data"""
        record_count = 0
        self.initialCount = self.get_record_count()

        for f in os.listdir(self.dataDirectory):
            if not os.path.isfile(os.path.join(self.dataDirectory, f)) or f.endswith(".zip") :
                continue

            file_path = os.path.join(self.dataDirectory, f)
            logger.info("Processing file: %s", f)

            # get the corresponding data mapping file
            config_file = os.path.join(self.dataDirectory, 'data_mapping', 'mortality.json')

            if not config_file:
                logger.warn("No mapping available for data file %s, skipping", file_path)
                continue

            cancer_mortality_parser =  DataFileParser(file_path, config_file)
            cancer_mortality_parser.parseNextLine() # skip the header line

            while True:
                record  = cancer_mortality_parser.parseNextLine()
                if not record:
                    break
                if (record['current_year'] == '1999' or record['state'] == 'Puerto Rico' ): # skip invalid CBSA records/ 1999 year's records
                    continue

                self.process_cancer_sites(record)

                record_count += 1
                self.batchRepository.persist({"index": {"_index": self.config['elastic_search']['index'],
                                                        "_type": self.config['elastic_search']['type'],
                                                        "_id": record_count}})
                self.batchRepository.persist(record)

            self.batchRepository.flush()
            self.refresh_index()
        self.metrics.insertCount = record_count
        self.updateDsMetadata()
        logger.info("*** Processed %s records from cancer mortality data file", self.metrics.insertCount)

    def updateDsMetadata(self):
        for y in range(2000, 2014):
            self.loadDataSetMetaData('cancer_mortality', str(y), os.path.join(self.dataDirectory, 'data_mapping', 'mortality.json'))

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
    etl = CancerMortalityETL(file(os.path.join(os.path.dirname(__file__), "config.yaml"), 'r'))
    etl.execute()
