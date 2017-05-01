import json
import os
from random import randint
from owh.etl.common.etl import ETL
import logging
from owh.etl.common.fixedwidthfile_parser import FixedWidthFileParser

logger = logging.getLogger('infant_mortality_etl')


class InfantMortalityETL (ETL):

    def __init__(self, configFile):
        ETL.__init__(self, configFile)
        # if 'action' is specified then set, else default to replace
        self.action = self.config.get('action', 'replace')

        self.create_index(os.path.join(os.path.dirname(__file__), "es_mapping"
                           ,self.config['elastic_search']['type_mapping'])
                           ,self.action == 'replace')
        #self._load_icd_code_mappings()

    def _load_icd_code_mappings(self):
        with open(os.path.join(os.path.dirname(__file__),"es_mapping/conditions-ICD-10-mappings.json")) as jf:
            self.icd_10_code_mappings = json.load(jf, encoding="utf8")

    def _check_blanks(self, record):
        for key, value in record.iteritems():
            if value == '':  # check for blank
                record[key] = '_BLANK_'

    def _process_conditions(self, record, condn_axis, condn_col_prefix):
        condcount = record[condn_axis]
        conditions = []
        for i in range(1,21):
            condcolname = '%s%d' % (condn_col_prefix, i)
            if record[condcolname]:
                conditions.append(record[condcolname])
            del record[condcolname]
        record[condn_axis[:-6]] = conditions

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
            logger.info("Processing file: %s", file_path)
            if f.startswith("MULT"):
                year = int(f[4:8])  # e.g. MULT2011
            else:
                year = 2000 + int(f[4:6])  # e.g Mort01us

            if year <= 2015 and year >= 2003:   # data file for year 2003 to 2014
                config_file =  os.path.join(self.dataDirectory, 'data_mapping', 'mortality_mapping_03-15.json')
            elif year <= 2002 and year >= 2000:
                config_file =  os.path.join(self.dataDirectory, 'data_mapping', 'mortality_mapping_00-02.json')
            else:
                logger.warn("No mapping available for data file %s, skipping", file_path)
                continue
            # load dataset metadata
            self.loadDataSetMetaData('deaths', str(year), config_file)
            # delete records for the year if action is update
            # FIXME: The delete function is not working as expected, the results vary by ES version
            # in 1.5.x, the delete action doesn't work at all, in 2.4.x it delete more records than specified
            # because of these we can not use update action for now
            if (self.action == 'update'):
                deleteCount += self.esRepository.delete_records_for_year(year)[0]
            mortalityParser = FixedWidthFileParser(file_path, config_file)
            while True:
                record  = mortalityParser.parseNextLine()
                if not record:
                    break

                if(record['residence'] == '4'):
                    logger.info ("Skipping foreign resident")
                    continue

                del record['residence']
                recordCount += 1
                self._process_conditions(record,'entity_axis_condn_count', 'EAC')
                self._process_conditions(record,'record_axis_condn_count', 'RAC')

                icdcode = record['ICD_10_code'].upper()
                if (icdcode):
                    record['ICD_10_code'] = {'code': icdcode, 'path':self.icd_10_code_mappings[icdcode]}
                else:
                    record['ICD_10_code'] = self._check_blanks(icdcode)

                #add ethnicity group based on hispanic_origin
                if(record['hispanic_origin'] == 'Unknown' or record['hispanic_origin'] == 'Non-Hispanic'):
                    record['ethnicity_group'] = record['hispanic_origin']
                else:
                    record['ethnicity_group'] = 'Hispanic'

                self._check_blanks(record)
                self.batchRepository.persist({"index": {"_index": self.config['elastic_search']['index'], "_type": self.config['elastic_search']['type'], "_id": recordCount}})
                self.batchRepository.persist(record)

            self.batchRepository.flush()
            self.refresh_index()
        self.metrics.insertCount=recordCount
        self.metrics.deleteCount=deleteCount


    def validate_etl(self):
        """ Validate the ETL"""
        expectedCount = (self.initialCount - self.metrics.deleteCount + self.metrics.insertCount)
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
    indexer = MortalityIndexer(file(os.path.join(os.path.dirname(__file__), "config.yaml"), 'r'))
    indexer.execute()
