import os
from owh.etl.common.etl import ETL
import logging
from owh.etl.common.datafile_parser import DataFileParser
logger = logging.getLogger('std_etl')

class STDETL (ETL):
    """
        Loads STD data into ES db
    """
    def __init__(self, configFile):
        ETL.__init__(self, configFile)
        self.create_index(os.path.join(os.path.dirname(__file__), "es_mapping"
                             ,self.config['elastic_search']['type_mapping']), True)

    def perform_etl(self):
        """Load the STD data"""
        record_count = 0
        self.initialCount = self.get_record_count()

        for f in os.listdir(self.dataDirectory):
            if not os.path.isfile(os.path.join(self.dataDirectory, f)) or f.endswith(".zip") :
                continue

            file_path = os.path.join(self.dataDirectory, f)
            logger.info("Processing file: %s", f)

            # get the corresponding data mapping file
            config_file = os.path.join(self.dataDirectory, 'data_mapping', 'std.json')

            if not config_file:
                logger.warn("No mapping available for data file %s, skipping", file_path)
                continue

            std_parser =  DataFileParser(file_path, config_file)
            std_parser.parseNextLine() # skip the header line
            while True:
                record  = std_parser.parseNextLine()
                if not record:
                    break
                if (int(record['current_year']) < 2000): # skip data before year 2000
                    continue
                if (record['state'] == None): # skip county level data and national level data
                    continue
                if (record ['race_ethnicity'] == None or record['age_group'] == None or record['sex'] == None): # Skip 'All' race, sex and age records
                    continue
                if(len(record ['pop']) > 0):
                    record['pop'] = int(record['pop'])
                else:
                    record['pop'] = 0

                if(len(record ['cases']) > 0):
                    record['cases'] = int(record['cases'])
                else:
                    record['cases'] = 0

                # suppression_cases or suppression_rate are equals to '1' means Data suppressed
                # so we are setting cases and pop to -1 when data suppressed.
                if(record['suppression_cases'] == '1'):
                    record['cases'] = -1
                if(record['suppression_rate'] == '1'):
                    record['pop'] = -1
                record_count += 1
                self.batchRepository.persist({"index": {"_index": self.config['elastic_search']['index'],
                                                        "_type": self.config['elastic_search']['type'],
                                                        "_id": record_count}})
                self.batchRepository.persist(record)

            self.batchRepository.flush()
            self.refresh_index()
        self.metrics.insertCount = record_count
        self.updateDsMetadata();
        logger.info("*** Processed %s records from std data file", self.metrics.insertCount)

    def updateDsMetadata(self):
        for y in range(2000, 2016):
            self.loadDataSetMetaData('std', str(y), os.path.join(self.dataDirectory, 'data_mapping', 'std.json'))

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
    etl = STDETL(file(os.path.join(os.path.dirname(__file__), "config.yaml"), 'r'))
    etl.execute()
