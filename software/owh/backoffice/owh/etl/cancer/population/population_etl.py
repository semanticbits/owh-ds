import os
from owh.etl.common.etl import ETL
import logging
from owh.etl.common.datafile_parser import DataFileParser
logger = logging.getLogger('incident_etl')

class CancerPopulationETL (ETL):
    """
        Loads cancer population data into ES db
    """
    def __init__(self, configFile):
        ETL.__init__(self, configFile)
        self.create_index(os.path.join(os.path.dirname(__file__), "es_mapping"
                             ,self.config['elastic_search']['type_mapping']), True)

    def perform_etl(self):
        """Load the cancer population data"""
        record_count = 0
        self.initialCount = self.get_record_count()

        for f in os.listdir(self.dataDirectory):
            if not os.path.isfile(os.path.join(self.dataDirectory, f)) or f.endswith(".zip") :
                continue

            file_path = os.path.join(self.dataDirectory, f)
            logger.info("Processing file: %s", f)

            # get the corresponding data mapping file
            config_file = os.path.join(self.dataDirectory, 'data_mapping', 'population.json')

            if not config_file:
                logger.warn("No mapping available for data file %s, skipping", file_path)
                continue

            cancer_population_parser =  DataFileParser(file_path, config_file)
            cancer_population_parser.parseNextLine() # skip the header line

            while True:
                record  = cancer_population_parser.parseNextLine()
                if not record:
                    break
                if (record['current_year'] == '1999' or record['state'] == 'Puerto Rico'
                    or record['state'] == 'Katrina-Rita'): # 1999 year's, Puerto Rico and Katrina-Rita records
                    continue
                record_count += 1
                self.batchRepository.persist({"index": {"_index": self.config['elastic_search']['index'],
                                                        "_type": self.config['elastic_search']['type'],
                                                        "_id": record_count}})
                self.batchRepository.persist(record)

            self.batchRepository.flush()
            self.refresh_index()
        self.metrics.insertCount = record_count
        #self.updateDsMetadata()
        logger.info("*** Processed %s records from cancer population data file", self.metrics.insertCount)

    def updateDsMetadata(self):
        for y in range(2000, 2014):
            self.loadDataSetMetaData('cancer_population', str(y), os.path.join(self.dataDirectory, 'data_mapping', 'population.json'))

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
    etl = CancerPopulationETL(file(os.path.join(os.path.dirname(__file__), "config.yaml"), 'r'))
    etl.execute()
