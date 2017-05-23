__author__ = "Gopal Unnikrishnan"
import logging
import json
import csv

logger = logging.getLogger('fwfparser')

class DataFileParser:
    """
     Parses a data file that contains data in fixed with columns.
     A datamapping per the syntax defined at https://projects.semanticbits.com/confluence/display/OWH/Data+mapping+file defines the content of the data file and used in the parsing of the data
     Args:
        datafile: path to the data file to be parsed
        datamappingfile: Path to datamapping file in the format specified above
    """
    def __init__(self, datafile, datamappingfile):
        """
        Initializes the parser
        """

        with open(datamappingfile) as fmap:
            self.dataconfig = json.load(fmap)
            self.columnconfigs = self.dataconfig['columns']

        if (self.dataconfig['datafiletype'] == 'csv'):
            self.filereader = CSVFileReader(datafile)
        elif (self.dataconfig['datafiletype'] == 'fwf'):
            self.filereader = FixedWidthFileReader(datafile)

    def parseNextLine(self):
        """
            Read and parse the next non empty line. Empty lines are skipped, so a single parseNextLine could read more
            than one row from the data file if the lines are emtpy

            Returns:
                A dict containg the parsed and processed value, if there are no union type columns in the mapping, a list
                of dict otherwise. The processing depends on the data column type specified in the mapping file.

                If the the data mapping contains union type, then result will contains as many dicts are there are fields.
        """
        hasUnion = False
        result = []
        if self.filereader.nextLine() == None: # Return None once EOF is reached
            return None

        row = {}
        for config in self.columnconfigs :
            if(config['type'] == 'simple'):
                row[config['column']] = self._simple_value(config)
            elif (config['type'] == 'map'):
                row[config['column']] = self._map_value(config)
            elif (config['type'] == 'range'):
                 row[config['column']] = self._get_range_value(config)
            elif (config['type'] == 'split'):
                for col in config['columns']:
                    value = self._get_value(config)
                    if config['mappings'].has_key(value):
                        row[col] = config['mappings'].get(value).get(col)
                    else:
                        row[col] = None
            elif (config['type'] == 'union'):
                hasUnion = True
                for field in config['fields']:
                    value = self._get_value(field)
                    row[config['column']] = value
                    row[config['index_column']] = field['index_value']
                    result.append(row.copy())
        if ( not hasUnion):
            result = row
        return result

    def _get_value(self, columnConfig):
        return self.filereader.getColumnValue(columnConfig).strip()

    def _parse_value(self, value):
        if value is None:
            return value
        elif not value.isdigit():
            return value
        elif "." in value:
            return float(value)
        else:
            return int(value)

    def _simple_value(self, config):
            return self._get_value(config)

    def _map_value(self, config):
        if config['mappings']:
            return config['mappings'].get(self._get_value(config))
        else:
            return None

    def _get_range_value(self, config):
        mappings = config['mappings']
        value = self._get_value(config)
        if config['mappings'].has_key(value):
            return mappings.get(value)
        else:
            for key in mappings.keys():
                if "-" in key:
                    ranges = key.split("-")
                    if self._parse_value(value) >= self._parse_value(ranges[0]) \
                            and self._parse_value(value) <= self._parse_value(ranges[1]):
                        return  mappings.get(key)
            return None




class DataFileReader:

    def nextLine(self):
        """
            Advance cursor to next line and return the line, returns None if no more lines are present
        """
        raise NotImplementedError("")

    def getColumnValue(self, columnConfig):
        """
            Get the value of the column defined by the columnConfig
        """
        raise NotImplementedError("")

class CSVFileReader (DataFileReader):
    """
        Reader for CSV file
    """
    def __init__(self, datafile):
        self.csvreader = csv.reader(open(datafile, 'rb'))

    def nextLine(self):
        try:
            self.line = self.csvreader.next()
        except StopIteration: #Catch EOF
            self.line = None

        if (self.line != None and len(self.line) == 0): # Skip empty lines
            self.nextLine()

        return self.line

    def getColumnValue(self, columnConfig):
        if (columnConfig['column_index'] != None):
            if(self.line != None):
                return self.line[columnConfig['column_index']]
            else:
                raise Exception ("End of the file reached, no more data available")
        else:
            raise Exception ("column_index attribute not found on the column config")


class FixedWidthFileReader ( DataFileReader):
    """
        Reader for fixed width file
    """
    def __init__(self, datafile):
        self.line = None
        self.filereader = self.datafile = open(datafile, 'rb')

    def nextLine(self):
        self.line = self.filereader.readline()
        if(self.line == ""):
            self.filereader.close()
            self.line = None
        elif(self.line.strip() == ''): # Skip empty lines
            self.nextLine()
        return self.line

    def getColumnValue(self, columnConfig):
        if (columnConfig['start'] and columnConfig['stop']):
            if(self.line):
                return self.line[columnConfig['start'] - 1:columnConfig['stop']]
            else:
                raise Exception ("End of the file reached, no more data available")
        else:
            raise Exception ("start and stop attributes not found on the column config")




