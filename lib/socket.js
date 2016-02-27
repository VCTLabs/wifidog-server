var exec = require('child_process').exec; 
var logger = require(__dirname + '/logger');
var fs = require('fs');
module.exports = function(io) {
    var wlan0_info = [];
    exec('ifconfig wlan0 up', function(err,stdout,stderr){
        if(err) {
            logger.error(stderr);
        }
    });
    exec('iw wlan0 scan', function(err,stdout,stderr){
        if(err) {
            logger.error(stderr);
        } 
        console.log("iw wlan0 scan > log/wlan0");
        var data = stdout;
        wlan0_info = [];
        while(data.length > 1)
        {
            var section = '';
            var item={};
            if(data.indexOf('wlan0') != -1)
            {
                section = data.substring(0,data.indexOf('wlan0')+5);
                data = data.substring(data.indexOf('wlan0')+5);
            }
            else{
                section = data;
                data = '';
            }
            if(section.indexOf('signal:') != -1)
            {
                var signal = section.substring(section.indexOf('signal:')+8,
                                               section.indexOf('last seen:')).slice(0,-2);
                var ssid = section.substring(section.indexOf('SSID:')+6,
                                               section.indexOf('Supported rates:')).slice(0,-2);    
                item['ssid']    =ssid;
                item['signal']  = signal;
                console.log(ssid+' '+signal);
                if(ssid.length > 0)
                    wlan0_info.push(item);
            }
        }
        io.emit('wlan0_info', JSON.stringify(wlan0_info));
        console.log(JSON.stringify(wlan0_info));
    });
    io.on('connection', function(socket) {
        console.log("connect!.............");
        //io.emit('hello', "haha");
        socket.on("rescan_wlan0_info",function(msg){
            exec('iw wlan0 scan', function(err,stdout,stderr){
                if(err) {
                    logger.error(stderr);
                } 
                console.log("iw wlan0 scan > log/wlan0");
                var data = stdout;
                wlan0_info = [];
                while(data.length > 1)
                {
                    var section = '';
                    var item={};
                    if(data.indexOf('wlan0') != -1)
                    {
                        section = data.substring(0,data.indexOf('wlan0')+5);
                        data = data.substring(data.indexOf('wlan0')+5);
                    }
                    else{
                        section = data;
                        data = '';
                    }
                    if(section.indexOf('signal:') != -1)
                    {
                        var signal = section.substring(section.indexOf('signal:')+8,
                                                       section.indexOf('last seen:')).slice(0,-2);
                        var ssid = section.substring(section.indexOf('SSID:')+6,
                                                       section.indexOf('Supported rates:')).slice(0,-2);    
                        item['ssid']    =ssid;
                        item['signal']  = signal;
                        console.log(ssid+' '+signal);
                        if(ssid.length > 0)
                            wlan0_info.push(item);
                    }
                }
                io.emit('wlan0_info', JSON.stringify(wlan0_info));
                console.log(JSON.stringify(wlan0_info));
            });
            console.log(msg);
        });
        io.emit('wlan0_info', JSON.stringify(wlan0_info));
    }); 
};
