var bunyan = require('bunyan');
var config = require('./config');
module.exports = bunyan.createLogger({
    // Writes daily rotating logs in folder $OWH_HOME/logs
    name: 'owh',
    streams: [
        { // Log to file
            type: 'rotating-file',
            path: config.OWH_HOME+'/logs/owh.log',
            period: '1d',
            count: 10,
            level: config.logging.level
        },
        { // Log to STDOUT
            level: config.logging.level,
            stream: process.stdout
        }
    ]
});