## Introduction 
This folder contains implementation of various data ETLs.

## Directory structure
The ETL code is arranged in python packages. All ETL code is under the package owh.etl.
owh.etl.common package contains all the common code. ETL implementation for each 
dataset is arranged on its own sub package (e.g owh.etl.mortality). The configuration file for each dataset ETL 
is in the corresponding ETL implementation directory. YAML is used for configuration of the ETLs.

The common logging configuration is in owh.etl.common package.

## Implementing a new ETL

To implement a new ETL 
- Create a new sub package under owh.etl correspnding to the name of the dataset 
- Implement a new ETL class extending the base owh.common.ETL class

## Executing an ETL
### Pre-requisites
1. Python 2.7.x (does not work with python 3.x)
2. python module elasticsearch 1.9.0

   To install elasticsearch module run:

   ```pip install "elasticsearch==1.9.0"```


### Steps to execute an ETL

1. Copy the dataset data files and any data mapping files to a directory or AWS S3 bucket
2. Update the configuration file (config.yaml) in the ETL folder with information about the ES DB and dataset folder/S3 bucket.
3. Set PYTHONPATH to include the backoffice directory
4. For the first time only, install boto and yaml python modules (pip install boto pyyaml)
5. Run command:

	```python etl\owh\<dataset_name>\<dataset_name>_etl.py```

	E.g. python etl\owh\mortality\mortality_etl.py
 
