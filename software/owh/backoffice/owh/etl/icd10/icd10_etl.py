import json
import os
from random import randint
from owh.etl.common.etl import ETL
import logging
from owh.etl.common.datafile_parser import DataFileParser

logger = logging.getLogger('icd_etl')


class ICDETL (ETL):

    def __init__(self, configFile):
        ETL.__init__(self, configFile)
        self.conditiontree = []
        self.conditionhierarchy = {}
        self.conditionlist = []

    def parseRecord (self, record):
        parts = record.split('(', 1)
        icdid =  parts[0].strip()
        id = icdid.replace('.', '')
        return {'id':id, 'text':parts[1][:-1] + '('+icdid+')', 'path':[id], 'children':[]}

    def addToLists(self, record, addToTree=False):
        if (addToTree):
            self.conditiontree.append(record)
        self.conditionhierarchy[record['id']] = record['path']
        self.conditionlist.append({'key':record['id'], 'title':record['text']})

    def perform_etl(self):
        """Perform the ICD10 ETL"""

        files = os.listdir(self.dataDirectory)
        files.sort()
        recordCount = 0
        for f in files:
            if not os.path.isfile(os.path.join(self.dataDirectory, f)) or f.endswith(".zip") :
                continue

            file_path = os.path.join(self.dataDirectory, f)
            logger.info("Processing file: %s", file_path)
            config_file =  os.path.join(self.dataDirectory, 'data_mapping', 'icd10.json')

            icparser = DataFileParser(file_path, config_file)

            chapter = None
            subchapter = None
            condition = None
            while True:
                record  = icparser.parseNextLine()
                if not record:
                    break
               # logger.info(record)

                recordCount += 1
                if(record['chapter'] != ''):
                    chapter = self.parseRecord(record['chapter'])
                    self.addToLists(chapter, True)
                    continue;
                else:
                    if(record['subchapter'] != ''):
                        subchapter = self.parseRecord(record['subchapter'])
                        chapter['children'].append(subchapter)
                        subchapter['path'].append(chapter['id'])
                        self.addToLists(subchapter)
                        continue;
                    else:
                        if(record['condition'] != ''):
                            condition = self.parseRecord(record['condition'])
                            subchapter['children'].append(condition)
                            condition['path'].append(subchapter['id'])
                            condition['path'].append(chapter['id'])
                            self.addToLists(condition)
                            continue;
                        else:
                            if(record['subcondition'] != ''):
                                subcondition = self.parseRecord(record['subcondition'])
                                condition['children'].append(subcondition)
                                subcondition['path'].append(condition['id'])
                                subcondition['path'].append(subchapter['id'])
                                subcondition['path'].append(chapter['id'])
                                self.addToLists(subcondition)
                                continue;

        logger.info ("Processed %d conditions", recordCount)
        with open('conditions-ICD-10-mappings.json', 'w') as outfile:
            json.dump(self.conditionhierarchy,outfile, sort_keys=True, indent=2, separators=(',', ': '))
            logger.info ("*** Generated ICD10 data file: %s, copy this file to app/client/jsons folder ***",os.getcwd()+'/conditions-ICD-10-mappings.json'),
        with open('conditions-ICD-10.json', 'w') as outfile:
            json.dump({'conditionsICD10': self.conditiontree,'conditionsListICD10': self.conditionlist},outfile, indent=2, separators=(',', ': '))
            logger.info ("*** Generated ICD10 data file: %s, copy this file to es_mapping folder of the mortality and infant_mortality ETLs ***",os.getcwd()+'/conditions-ICD-10.json')

    def validate_etl(self):
        """ Validate the ETL"""
        return True

if __name__ == "__main__":
    # Perform ETL
    indexer = ICDETL(file(os.path.join(os.path.dirname(__file__), "config.yaml"), 'r'))
    indexer.execute()
