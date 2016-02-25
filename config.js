// Log files
var config = {}
config.logger = {};
config.logger.errorFile = __dirname + '/log/error.log';
config.logger.consoleFile = __dirname + '/log/console.log';
config.logger.maxFileSize = 1000000;
config.logger.maxFiles = 1;
// Make the configuration parameters available.
module.exports = config;