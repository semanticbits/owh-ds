import os
from random import randint
from owh.etl.common.etl import ETL
import logging
from owh.etl.common.datafile_parser import DataFileParser
logger = logging.getLogger('census_etl')

class CensusETL (ETL):
    """
        Loads Bridge race census data into ES db
    """
    def __init__(self, configFile):
        ETL.__init__(self, configFile)
        self.create_index(os.path.join(os.path.dirname(__file__), "es_mapping"
                             ,self.config['elastic_search']['type_mapping']), True)
        self.savedreccount = 0
        self.processreccount = 0

    def _persistStateRecords(self, stateAggregatedRecods):
        """
            Persist aggregrated state census data ino
        """
        for key, value in stateAggregatedRecods.iteritems():
            self.savedreccount += 1
            self.batchRepository.persist({"index": {"_index": self.config['elastic_search']['index'], "_type": self.config['elastic_search']['type'], "_id": self.savedreccount}})
            self.batchRepository.persist(value)
        self.batchRepository.flush()

    def perform_etl(self):
        """Perform the mortality ETL"""
        counter = 0
        for f in os.listdir(self.dataDirectory):
            if not f.endswith(".txt"):
                continue
            file_path = os.path.join(self.dataDirectory, f)
            logger.info("Processing file: %s", f)
            year = 0
            if f.startswith("pcen_v"):
                year = int(f[6:10]) #pcen_v2011_y11.txt
            if year >= 2012: # data file for year 2011 to 2015
                config_file =  os.path.join(self.dataDirectory, 'data_mapping', 'pcen_v2012_15_y1215.json')
            else:
                config_file =  os.path.join(self.dataDirectory, 'data_mapping', f.replace(".txt", ".json"))
            censusParser = DataFileParser(file_path, config_file)
            stateAggregatedRecods = {}
            curState = None
            while True:
                record  = censusParser.parseNextLine()
                if not record:
                    # reached end of the file, persist the aggregated data and break
                    self._persistStateRecords(stateAggregatedRecods)
                    break;
                #when pop up column is not union, then record is not an array, so creating a empty array and appending value to array
                if isinstance(record, list) != True:
                    recordArray = []
                    recordArray.append(record)
                    record = recordArray
                self.processreccount += 1
                newState = record[0]['state']
                if curState != newState:
                     # once the state id changes, persist the current state records, and start aggregating next state data
                     curState = newState
                     self._persistStateRecords(stateAggregatedRecods)
                     stateAggregatedRecods = {}

                for row in record:
                    aggkey = '{:4s}{:1s}{:1s}{:1s}{:2s}'.format(row['current_year'],row['sex'],row['race'],row['ethnicity_group'],row['age'])
                    # if the key is not yet in the aggdata, add the key and data, else aggr population
                    if not stateAggregatedRecods.has_key(aggkey):
                        stateAggregatedRecods[aggkey] = row
                        stateAggregatedRecods[aggkey]['pop'] = int(stateAggregatedRecods[aggkey]['pop'])
                    else:
                        stateAggregatedRecods[aggkey]['pop'] += int(row['pop'])
            self.refresh_index()
        self.metrics.insertCount = self.savedreccount
        logger.info("*** Processed %s records from all census data files", self.processreccount)


    def validate_etl(self):
        """ Validate the ETL"""
        if self.metrics.insertCount != self.get_record_count():
            self.metrics.message = "Number of records in the DB (%d) not same as the number of records inserted (%d)" % (self.get_record_count(), self.metrics.insertCount)
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
    etl = CensusETL(file(os.path.join(os.path.dirname(__file__), "config.yaml"), 'r'))
    etl.execute()
