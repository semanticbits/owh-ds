import os
from owh.etl.common.etl import ETL
import logging
logger = logging.getLogger('yrbs_etl')


class YrbsETL (ETL):
    """
        Loads YRBS metadata into ES
    """
    def __init__(self, configFile):
        ETL.__init__(self, configFile)

    def perform_etl(self):
        """Load yrbs metadata data"""
        self.updateDsMetadata()

    def updateDsMetadata(self):
        self.loadDataSetMetaData('mental_health', '1991', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '1993', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '1995', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '1997', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '1999', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '2001', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '2003', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '2005', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '2007', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '2009', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '2011', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '2013', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_1991_2013.json'))
        self.loadDataSetMetaData('mental_health', '2015', os.path.join(self.dataDirectory, 'data_mapping', 'yrbs_2015.json'))

    def validate_etl(self):
        return True


if __name__ == "__main__":
    # Perform ETL
    etl = YrbsETL(file(os.path.join(os.path.dirname(__file__), "config.yaml"), 'r'))
    etl.execute()
