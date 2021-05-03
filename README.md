# OWH-DS [![Build Status](https://travis-ci.org/semanticbits/owh-ds.svg?branch=develop)](https://travis-ci.org/semanticbits/owh-ds) [![Code Climate](https://codeclimate.com/github/semanticbits/owh-ds/badges/gpa.svg)](https://codeclimate.com/github/semanticbits/owh-ds) [![Test Coverage](https://codeclimate.com/github/semanticbits/owh-ds/badges/coverage.svg)](https://codeclimate.com/github/semanticbits/owh-ds/coverage) [![Issue Count](https://codeclimate.com/github/semanticbits/owh-ds/badges/issue_count.svg)](https://codeclimate.com/github/semanticbits/owh-ds)

## Checkout code
```
mkdir -p /usr/local/owh-ds/application/
cd /usr/local/owh-ds/application/
git clone git@github.com:semanticbits/owh-ds.git
git checkout develop
cd /owh-ds/software/owh
```
## Install dependencies
Install both client and server dependencies
```
cd /owh-ds/software/owh/client/
npm install
npm install --dev
cd /owh-ds/software/owh/server/
npm install
npm install --dev

````

## Run the test cases
### Karma
```
cd owh-ds/software/owh/client
nohup npm run-script test-single-run > nohup.out &
```
### Protractor(Selenium test cases)
Start node server and run selenium test cases
```
cd owh-ds/software/owh/server
nohup npm run-script start > nohup.out &
cd owh-ds/software/owh/client
nohup npm run-script protractor > nohup.out &
```
### Run server test cases
Install istanbul globally and run specs. You can also use istanbul that we installed as dependencies, need to specify istanbul path

```
cd owh-ds/software/owh/server
istanbul cover node_modules/mocha/bin/_mocha -- -R spec --recursive test

```

## Install ElasticSearch and Load OWH data sets
Below steps are to load YRBS and Mortality data sets(few years data) into local Elasticsearch service.

1. Download and run elasticsearch 
   * https://www.elastic.co/downloads/elasticsearch

2. To load YRBS sample data(For few years)
    1. Download YRBS sample data https://s3.amazonaws.com/owh-data/YRBS/Sample-data/yrbs-sample-data.rar
    2. Go to local checked out owh-ds codebase software/owh/backoffice/yrbs_indexer.py file update INPUT_FILES_DIR with above downloaded folder path
    3. Update ES_HOST to 127.0.0.1
    4. Install boto and elasticsearch python libraries using python pip. If you are using windows pip.exe script available in python installation folder
       * https://www.elastic.co/guide/en/elasticsearch/client/python-api/current/index.html
    5. Go to folder .../software/owh/backoffice and run yrbs_indexer.py. Creating indexes may take more than hour. 

3. To load Mortality data
    1. Download data set from here
        * Hit this link http://www.cdc.gov/nchs/data_access/vitalstatsonline.htm
        * Scroll down and go to ‘Mortality Multiple Cause Files’ section and download U.S. Data (.zip files)
        * Extract both the zips in a folder and update this folder path in mortality_indexer.py file
    2. Update ES_HOST in software/owh/backoffice/mortality_indexer.py file. 
    3. And run mortality_indexer.py. Creating indexes may take more than hour.

4. Environment variable NODE_ENV
    1. Create environment variable NODE_ENV and set value to 'dev'. As per elasticsearch configuration(elasticsearch.js), local running elasticsearch service
       will be used, if NODE_ENV value set to either 'test' or 'dev'

## Files and importance
1. package.json - nodeJS root file and it has all dependencies and start-up scripts
2. karma.conf.js - Unit test cases configuration file
3. protractor.conf.js - Selenium test cases using Protractor. 

## Run the application
### Development
To start the application run below script.
```
cd /owh-ds/software/owh/server/
nohup npm run-script start > nohup.out &

```


