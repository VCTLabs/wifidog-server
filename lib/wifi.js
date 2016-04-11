process.env.DISPLAY = ':0';
process.env.DBUS_SESSION_BUS_ADDRESS = 'unix:path=/run/dbus/system_bus_socket';

var logger = require(__dirname + '/logger');
var wifidog = require(__dirname + '/wifidog');
var connman = require(__dirname + '/connman');
var led = require(__dirname + '/led');
//var button = require(__dirname + '/button');
var hostapd = require(__dirname + '/hostapd');
var config = require(__dirname+ "/../config");

var child_process = require('child_process');
var EventEmitter = require('events').EventEmitter; 
var path = require('fs');
var ssid_list;
var lan_info;
var event = new EventEmitter(); 

module.exports = function(io) {
    event.on('startAp', function() { 
       var options = config.hostapd; 
       var apFlag = false;
       var file = options.interface + '-hostapd.conf';
        var last = child_process.exec('pgrep -f "hostapd -B ' + file + '"',function(err) {
            logger.info(err); 
        });
        last.stdout.on('data', function (data) {
             logger.info("last pid:"+last.pid); 
             logger.info("pid:"+data); 
            if(data != last.pid){
                 logger.info("hostapd is running");
                apFlag = true; 
            }
            if(apFlag == false && data == last.pid){
                 logger.info("hostapd start");
                hostapd.enable(options,function(err){
                });
            }
        });
    });
    event.on('startWifiDog', function() { 
         logger.info("startWifiDog"); 
        wifidog.on('on');
    });
    event.on('scanWifi', function() { 
         logger.info("scanWifi ...");
        connman.on('scan',function(err, services){
            ssid_list = services;
             logger.info("scan ...");
            io.emit('ssidList', ssid_list);
           //  logger.info(ssid_list);
        });  
    });
    event.on('lanStatus', function() { 
         logger.info("lanStatus ...");
        connman.on('status',function(err,IPv4){
            if(IPv4 != null){
                lan_info = IPv4;
                io.emit('lan_info', lan_info);
            }
        });
    });
    connman.on('init',function(){
        // connman.on('status',function(err,IPv4){
            // if(IPv4 == null || config.button.isUsed == 0){
                // event.emit('startAp');
            // }else{
                // lan_info = IPv4;
            // }
             event.emit('startAp');
             led.on("start");
        // });
        // event.emit('scanWifi');    
    });   
    // if(config.button.isUsed == 1){
        // button.on('on',function(){
            // var last = child_process.exec('pgrep -f hostapd.conf',function(err) {
            // logger.info(err); 
            // });
            // last.stdout.on('data', function (data) {
                //  logger.info(data); 
                // if(data == null){
                    //event.emit('startAp'); 
                // }
            // });
        // });
    // }
   event.emit('startWifiDog');
   

    io.on('connection', function(socket) {
         logger.info("connect!.............");
        //event.emit('scanWifi');
        io.emit('ssidList', ssid_list);
        io.emit('lan_info', lan_info);
        socket.on("scanWifi",function(message) {
             logger.info("websocket.....");
            event.emit('scanWifi');
            event.emit('lanStatus');
        });
        socket.on("getLanInfo",function(message) {
             logger.info("getLanInfo.....");
            event.emit('lanStatus');
        });
        socket.on("configWifi",function(message) {
             logger.info("configWifi.....");
             logger.info(message)            
            connman.on('sta',message.ssid,message.password,function(status){ 
                     logger.info(status);
                    if(status == "ready")
                    {                       
                        event.emit('lanStatus');
                        led.on("ok");
                    }
                    if(status == "failure")
                        led.on("error");
                    io.emit('wifiResult', status);
                });       
            //event.emit('lanStatus');
        });
    }); 
};
