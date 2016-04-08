process.env.DISPLAY = ':0';
process.env.DBUS_SESSION_BUS_ADDRESS = 'unix:path=/run/dbus/system_bus_socket';

var logger = require(__dirname + '/logger');
var wifidog = require(__dirname + '/wifidog');
var connman = require(__dirname + '/connman');
var led = require(__dirname + '/led');
var button = require(__dirname + '/button');
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
            console.log(err); 
        });
        last.stdout.on('data', function (data) {
            console.log("last pid:"+last.pid); 
            console.log("pid:"+data); 
            if(data != last.pid){
                console.log("hostapd is running");
                apFlag = true; 
            }
            if(apFlag == false && data == last.pid){
                console.log("hostapd start");
                hostapd.enable(options,function(err){
                });
            }
        });
    });
    event.on('startWifiDog', function() { 
        console.log("startWifiDog"); 
        wifidog.on('on');
    });
    event.on('scanWifi', function() { 
        connman.on('scan',function(err, services){
            ssid_list = services;
            console.log("scan Wifi");
            io.emit('ssid_list', ssid_list);
            //console.log(services);
        });  
    });
    event.on('lanStatus', function() { 
        connman.on('status',function(err,IPv4){
            if(IPv4 != null){
                lan_info = IPv4;
                io.emit('lan_info', lan_info);
            }
        });
    });
    connman.on('init',function(){
        connman.on('status',function(err,IPv4){
            if(IPv4 == null || config.button.isUsed == 0){
                event.emit('startAp');
            }else{
                lan_info = IPv4;
            }
        });
    });   
    if(config.button.isUsed == 1){
        button.on('on',function(){
            var last = child_process.exec('pgrep -f hostapd.conf',function(err) {
            // console.log(err); 
            });
            last.stdout.on('data', function (data) {
                console.log(data); 
                if(data == null){
                    //event.emit('startAp'); 
                }
            });
        });
    }
   event.emit('startWifiDog');    
    io.on('connection', function(socket) {
        console.log("connect!.............");
        event.emit('scanWifi'); 
        event.emit('lanStatus'); 
        io.emit('ssid_list', ssid_list);
        io.emit('lan_info', lan_info);
    }); 
};
