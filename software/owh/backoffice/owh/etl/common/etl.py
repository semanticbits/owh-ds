import yaml
import logging
import datetime
import logging.config
import os
import boto
import json
from zipfile import ZipFile

logging.config.fileConfig(os.path.join(os.path.dirname(__file__),'logging.conf'))

from owh.etl.common.elasticsearch_repository import ElasticSearchRepository
from owh.etl.common.repositories import BatchRepository

logger = logging.getLogger('etl')

class ETLMetrics:
    def __init__(self):
        self.status = None
        self.startTime  = 0
        self.endTime  = 0
        self.duration = 0
        self.insertCount = 0
        self.updateCount=0
        self.deleteCount=0
        self.message=None

class ETL :
    """Base ETL implemetation class that provides the common framework for the ETL implementation.
       All dataset specific ETL implementation class should extend from this class and implement the following abstract methods
        perform_etl() - dataset specific ETL implementation
        validate_etl() - validation of a completed ETL
       The contrete ETL implemetation should also instatiate the ETL impl and invoke the execute() method to
       trigger the execution of the ETL
    """
    def __init__(self, configFile):
        """Initialize the ETL"""
        self.metrics = ETLMetrics()
        self.config = yaml.safe_load(configFile)
        logging.getLogger('elasticsearch').setLevel("WARN") # To avoid too many logs from elasticsearch module
        logger.debug("Loaded configuration: %s", yaml.dump(self.config))
        if 'elastic_search' in self.config and 'bulk_load_size' in self.config['elastic_search']:
            self.esRepository = ElasticSearchRepository(self.config['elastic_search'])
            self.batchRepository = BatchRepository(self.config['elastic_search']['bulk_load_size'], self.esRepository)
        else:
            raise ValueError("Elastic search configuration not specified", yaml.dump(self.config))

    def get_record_count(self):
        """Gets the total number records of the type loaded by the ETL"""
        return self.esRepository.count_records()

    def get_record_by_id(self, id):
        """Retrieve a record with the specified id from the index user by the ETL"""
        return self.esRepository.get_record_by_id(id)

    def refresh_index(self):
        """Refresh the index for this ETL,
           This method will be automatically called after perform_etl completes.
           Needs to be explicitly called if indexed needs to be refreshed sooner"""
        self.esRepository.refresh_index()

    def _create_data_dir(self):
        """Create work directory and set the dataDirectory property"""
        self.dataDirectory = 'WORK/' + datetime.datetime.now().strftime('%Y%m%d.%H%M%S')+'/'
        if not os.path.exists(self.dataDirectory):
            os.makedirs(self.dataDirectory)

    def retrieve_data_files(self):
        """Retrieve data files from AWS bucket and unpack all downloaded files with extension .zip into the same folder where the file is downloaded to"""
        logger.info("Retrieving data files")
        self._create_data_dir()
        if not (self.config['data_file'] and 'aws_access_key_id' in self.config['data_file'] and 'aws_secret_access_key' in self.config['data_file']
                     and 'aws_s3_bucket_name' in self.config['data_file'] and 'aws_s3_directory' in self.config['data_file']):
            raise ValueError ("AWS S3 configuration not provided", yaml.dump(self.config))

        # connect to the bucket
        conn = boto.connect_s3(self.config['data_file']['aws_access_key_id'],self.config['data_file']['aws_secret_access_key'])
        bucket = conn.get_bucket(self.config['data_file']['aws_s3_bucket_name'])

        # dowload the files
        bucket_list = bucket.list()
        awsDataDirectory=self.config['data_file']['aws_s3_directory']
        if not awsDataDirectory.endswith('/'):
            awsDataDirectory += '/'
        for file in bucket_list:
            remotePath = str(file.key)
            if remotePath.startswith(awsDataDirectory):
                logger.debug("Processing remote file: %s", remotePath)
                remoteStrippedPath = remotePath.replace(awsDataDirectory, '', 1)
                localPath = self.dataDirectory + remoteStrippedPath
                localDir = os.path.dirname(localPath)
                if remoteStrippedPath:
                    if remoteStrippedPath.endswith('/'):
                        if not os.path.exists(localDir):
                            os.makedirs(localDir)
                    else:
                        logger.info("Downloading file remote file '%s' to '%s'", remotePath, localPath)
                        file.get_contents_to_filename(localPath)
                        if remoteStrippedPath.endswith('.zip'):
                            logger.info("Unzipping file %s", localPath)
                            ZipFile(localPath).extractall(localDir)

    def create_index(self, mappingFile, recreate_index):
        if recreate_index:
            with open(mappingFile, "r") as mapping:
                self.esRepository.recreate_index(json.load(mapping))
        else:
            with open(mappingFile, "r") as mapping:
                self.esRepository.create_mappings(json.load(mapping))

    def _print_metrics(self):
        """Print the metrics of the ETL"""
        logger.info("""
        Status : %s
        Message: %s
        Start time: %s
        End Time: %s
        Duration: %s
        Insert Count: %s
        Update Count: %s
        Delete Count: %s
        """, self.metrics.status,self.metrics.message, self.metrics.startTime, self.metrics.endTime, self.metrics.duration,self.metrics.insertCount, self.metrics.updateCount, self.metrics.deleteCount)

    def perform_etl(self):
        """ This abstract method must be implemented by the concrete subclasses to perform the ETL specific to the dataset"""
        raise NotImplementedError("ETL.performETL must be implemented by dataset specific ETL subclass")

    def validate_etl(self):
        """ This abstract method must be implemented by concrete ETL class implemenation specific to the dataset.
         Implementation of the this method should perform some validation of the data loaded.
         Some proposed validations are
            1. Validate the counts of recods created/updated/deleted
            2. Validation of a random record by checking that all mandatory attributes are set have valid values in the expected range
        """
        raise NotImplementedError("ETL.valuidateETL must be implemented by dataset specific ETL subclass")

    def insertDsMetadataRecord(self, datasetname, year, filter, pvs):
        self.batchRepository.persist({"index": {"_index": 'owh_dsmetadata', "_type": 'dsmetadata'}})
        self.batchRepository.persist({'dataset':datasetname, 'year': year, 'filter_name':filter, 'permissible_values':pvs})

    def loadDataSetMetaData(self, datasetname, year, datamapping):
         """
            Load the dataset metadata for the specified year and dataset
         """
         metadataESConfig = {'host': self.config['elastic_search']['host'], 'port': self.config['elastic_search']['port'],
                             'index': 'owh_dsmetadata', 'type': 'dsmetadata'}
         esRepository = ElasticSearchRepository(metadataESConfig)
         esRepository.create_index(json.load(open(os.path.join(os.path.dirname(__file__), 'es_mapping','dataset-metadata-mapping.json')))) # Create owh_dsmetadata index and mapping if doesn't exist

         batchRepository = BatchRepository(100, self.esRepository)

         # Delete existing mapping for the given dataset and year
         esRepository.delete_records_by_query({"query": {"bool" : {"must" : [{"term": {"dataset":datasetname }},{"term": {"year":year}}]}}})

         with open(datamapping) as datamap:
             metadata = json.load(datamap)['columns']

         for config in metadata :
             if(config['type'] == 'simple'):
                 self.insertDsMetadataRecord(datasetname, year,config['column'],None)
             elif (config['type'] == 'map' or  config['type'] == 'range'):
                 self.insertDsMetadataRecord(datasetname, year,config['column'],config['mappings'].values())
             elif (config['type'] == 'split'):
                 for col in config['columns']:
                     self.insertDsMetadataRecord(datasetname, year,col,list(set(m[col] for m in config['mappings'].values())))

         #insert region metadata record
         if (datasetname in ['deaths', 'natality', 'bridge_race', 'cancer_incident', 'cancer_mortality', 'infant_mortality']):
            self.insertDsMetadataRecord(datasetname, year,'census_region',None)
            self.insertDsMetadataRecord(datasetname, year,'hhs_region',None)
            self.insertDsMetadataRecord(datasetname, year,'census_division',None)
         self.batchRepository.flush()
         self.refresh_index()

    def loadRegionData(self, record):
        """ To load Census Region and HHS Region data """
        #constructing a map with states and regions/divisions
        stateRegionDictionary = {}
        stateRegionDictionary['CT'] = {'census_region': "CENS-R1", 'census_division': "CENS-D1", 'hhs_region':"HHS-1"}
        stateRegionDictionary['ME'] = {'census_region': "CENS-R1", 'census_division': "CENS-D1", 'hhs_region':"HHS-1"}
        stateRegionDictionary['MA'] = {'census_region': "CENS-R1", 'census_division': "CENS-D1", 'hhs_region':"HHS-1"}
        stateRegionDictionary['NH'] = {'census_region': "CENS-R1", 'census_division': "CENS-D1", 'hhs_region':"HHS-1"}
        stateRegionDictionary['RI'] = {'census_region': "CENS-R1", 'census_division': "CENS-D1", 'hhs_region':"HHS-1"}
        stateRegionDictionary['VT'] = {'census_region': "CENS-R1", 'census_division': "CENS-D1", 'hhs_region':"HHS-1"}
        stateRegionDictionary['NJ'] = {'census_region': "CENS-R1", 'census_division': "CENS-D2", 'hhs_region':"HHS-2"}
        stateRegionDictionary['NY'] = {'census_region': "CENS-R1", 'census_division': "CENS-D2", 'hhs_region':"HHS-2"}
        stateRegionDictionary['PA'] = {'census_region': "CENS-R1", 'census_division': "CENS-D2", 'hhs_region':"HHS-3"}

        stateRegionDictionary['IL'] = {'census_region': "CENS-R2", 'census_division': "CENS-D3", 'hhs_region':"HHS-5"}
        stateRegionDictionary['IN'] = {'census_region': "CENS-R2", 'census_division': "CENS-D3", 'hhs_region':"HHS-5"}
        stateRegionDictionary['MI'] = {'census_region': "CENS-R2", 'census_division': "CENS-D3", 'hhs_region':"HHS-5"}
        stateRegionDictionary['OH'] = {'census_region': "CENS-R2", 'census_division': "CENS-D3", 'hhs_region':"HHS-5"}
        stateRegionDictionary['WI'] = {'census_region': "CENS-R2", 'census_division': "CENS-D3", 'hhs_region':"HHS-5"}
        stateRegionDictionary['IA'] = {'census_region': "CENS-R2", 'census_division': "CENS-D4", 'hhs_region':"HHS-7"}
        stateRegionDictionary['KS'] = {'census_region': "CENS-R2", 'census_division': "CENS-D4", 'hhs_region':"HHS-7"}
        stateRegionDictionary['MN'] = {'census_region': "CENS-R2", 'census_division': "CENS-D4", 'hhs_region':"HHS-5"}
        stateRegionDictionary['MO'] = {'census_region': "CENS-R2", 'census_division': "CENS-D4", 'hhs_region':"HHS-7"}
        stateRegionDictionary['NE'] = {'census_region': "CENS-R2", 'census_division': "CENS-D4", 'hhs_region':"HHS-7"}
        stateRegionDictionary['ND'] = {'census_region': "CENS-R2", 'census_division': "CENS-D4", 'hhs_region':"HHS-8"}
        stateRegionDictionary['SD'] = {'census_region': "CENS-R2", 'census_division': "CENS-D4", 'hhs_region':"HHS-8"}

        stateRegionDictionary['DE'] = {'census_region': "CENS-R3", 'census_division': "CENS-D5", 'hhs_region':"HHS-3"}
        stateRegionDictionary['DC'] = {'census_region': "CENS-R3", 'census_division': "CENS-D5", 'hhs_region':"HHS-3"}
        stateRegionDictionary['FL'] = {'census_region': "CENS-R3", 'census_division': "CENS-D5", 'hhs_region':"HHS-4"}
        stateRegionDictionary['GA'] = {'census_region': "CENS-R3", 'census_division': "CENS-D5", 'hhs_region':"HHS-4"}
        stateRegionDictionary['MD'] = {'census_region': "CENS-R3", 'census_division': "CENS-D5", 'hhs_region':"HHS-3"}
        stateRegionDictionary['NC'] = {'census_region': "CENS-R3", 'census_division': "CENS-D5", 'hhs_region':"HHS-4"}
        stateRegionDictionary['SC'] = {'census_region': "CENS-R3", 'census_division': "CENS-D5", 'hhs_region':"HHS-4"}
        stateRegionDictionary['VA'] = {'census_region': "CENS-R3", 'census_division': "CENS-D5", 'hhs_region':"HHS-3"}
        stateRegionDictionary['WV'] = {'census_region': "CENS-R3", 'census_division': "CENS-D5", 'hhs_region':"HHS-3"}
        stateRegionDictionary['AL'] = {'census_region': "CENS-R3", 'census_division': "CENS-D6", 'hhs_region':"HHS-4"}
        stateRegionDictionary['KY'] = {'census_region': "CENS-R3", 'census_division': "CENS-D6", 'hhs_region':"HHS-4"}
        stateRegionDictionary['MS'] = {'census_region': "CENS-R3", 'census_division': "CENS-D6", 'hhs_region':"HHS-4"}
        stateRegionDictionary['TN'] = {'census_region': "CENS-R3", 'census_division': "CENS-D6", 'hhs_region':"HHS-4"}
        stateRegionDictionary['AR'] = {'census_region': "CENS-R3", 'census_division': "CENS-D7", 'hhs_region':"HHS-6"}
        stateRegionDictionary['LA'] = {'census_region': "CENS-R3", 'census_division': "CENS-D7", 'hhs_region':"HHS-6"}
        stateRegionDictionary['OK'] = {'census_region': "CENS-R3", 'census_division': "CENS-D7", 'hhs_region':"HHS-6"}
        stateRegionDictionary['TX'] = {'census_region': "CENS-R3", 'census_division': "CENS-D7", 'hhs_region':"HHS-6"}

        stateRegionDictionary['AZ'] = {'census_region': "CENS-R4", 'census_division': "CENS-D8", 'hhs_region':"HHS-9"}
        stateRegionDictionary['CO'] = {'census_region': "CENS-R4", 'census_division': "CENS-D8", 'hhs_region':"HHS-8"}
        stateRegionDictionary['ID'] = {'census_region': "CENS-R4", 'census_division': "CENS-D8", 'hhs_region':"HHS-10"}
        stateRegionDictionary['MT'] = {'census_region': "CENS-R4", 'census_division': "CENS-D8", 'hhs_region':"HHS-8"}
        stateRegionDictionary['NV'] = {'census_region': "CENS-R4", 'census_division': "CENS-D8", 'hhs_region':"HHS-9"}
        stateRegionDictionary['NM'] = {'census_region': "CENS-R4", 'census_division': "CENS-D8", 'hhs_region':"HHS-6"}
        stateRegionDictionary['UT'] = {'census_region': "CENS-R4", 'census_division': "CENS-D8", 'hhs_region':"HHS-8"}
        stateRegionDictionary['WY'] = {'census_region': "CENS-R4", 'census_division': "CENS-D8", 'hhs_region':"HHS-8"}
        stateRegionDictionary['AK'] = {'census_region': "CENS-R4", 'census_division': "CENS-D9", 'hhs_region':"HHS-10"}
        stateRegionDictionary['CA'] = {'census_region': "CENS-R4", 'census_division': "CENS-D9", 'hhs_region':"HHS-9"}
        stateRegionDictionary['HI'] = {'census_region': "CENS-R4", 'census_division': "CENS-D9", 'hhs_region':"HHS-9"}
        stateRegionDictionary['OR'] = {'census_region': "CENS-R4", 'census_division': "CENS-D9", 'hhs_region':"HHS-10"}
        stateRegionDictionary['WA'] = {'census_region': "CENS-R4", 'census_division': "CENS-D9", 'hhs_region':"HHS-10"}
        if ('state' in record):
            record.update(stateRegionDictionary[record['state']])

    def execute(self):
        """Execute the ETL process"""
        try:
            self.metrics.startTime = datetime.datetime.now()
            logger.info("Starting ETL")
            if  not ('local_directory' in self.config['data_file'] and self.config['data_file']['local_directory']):
                logger.info("Retriving input data files for ETL from AWS S3 bucket specified")
                self.retrieve_data_files()
                logger.info("Data files retreival complete")
            else:
                self.dataDirectory = self.config['data_file']['local_directory']
                logger.info("Using local directory %s for data files, skipping data files retrieval from AWS S3", self.config['data_file']['local_directory'])
            logger.info("Starting transfromation and load")
            self.perform_etl()
            self.refresh_index()
            logger.info("Transfromation and Load completed")
            logger.info("Validating ETL")
            if not self.validate_etl():
                self.metrics.status='FAILED'
                logger.error("ETL validation FIALED, below is the metrics from the ETL")
            else:
                self.metrics.status = "SUCCESS"
                logger.info("ETL completed successfully, below is the metrics from the ETL")
            self.metrics.endTime = datetime.datetime.now()
            self.metrics.duration = self.metrics.endTime - self.metrics.startTime
            self._print_metrics()
        except Exception as e:
            logger.fatal("Exception running ETL: %s", e)
            logger.fatal(e)
            self.metrics.status = "ERROR"
            self.metrics.message = "Exception running ETL: %s" % e
            raise