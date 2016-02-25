var exec = require('child_process').exec; 
var logger = require(__dirname + '/logger');

module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log("connect!.............");
        exec('ifconfig wlan0 up', function(err,stdout,stderr){
                if(err) {
                    logger.error(stderr);
                }
            })
        exec('iw wlan0 scan', function(err,stdout,stderr){
            if(err) {
                logger.error(stderr);
            } else {
                var data = JSON.parse(stdout);
                logger.info(data);
            }
        });
    });
};
