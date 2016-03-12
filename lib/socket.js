process.env.DISPLAY = ':0';
process.env.DBUS_SESSION_BUS_ADDRESS = 'unix:path=/run/dbus/system_bus_socket';

var exec = require('child_process').exec; 
var logger = require(__dirname + '/logger');
var wifidog = require(__dirname + '/wifidog_dev');
var connman = require(__dirname + '/connman_dev');
var path = require('fs');
var wlan0_info;
var ScanWifiInterval;
var StartwifidogInterval;
module.exports = function(io) {
    function StartWifidog(){
       path.exists('/sys/class/net/tether',function(exists) {
           if(exists == true)
           {
               clearInterval(StartwifidogInterval);
               StartwifidogInterval = null;
               wifidog.on('on');
           }
       });
    }
    connman.on('init',function(){
        function ListWifiAccessPoints(){
            connman.on('scan',function(err,list){
                wlan0_info = list;
                if(wlan0_info != null)
                {
                   //clear scan wifi interval
                   clearInterval(ScanWifiInterval);  
                    ScanWifiInterval = null;                   
                    connman.on('ap',function(err){
                        console.log(err);
                         StartwifidogInterval  = setInterval(StartWifidog,1000,'Try to start wifidog');
                    });
                }
                //console.log(wlan0_info);
            });
        }
        //because of some time scan failed, So we need scan again.
        ScanWifiInterval = setInterval(ListWifiAccessPoints,2000,'Get Wifi access points list');
    });       
    
    io.on('connection', function(socket) {
        console.log("connect!.............");
        //io.emit('hello', "haha");
        io.emit('wlan0_info', wlan0_info);
         //console.log(wlan0_info);
    }); 
    
};
