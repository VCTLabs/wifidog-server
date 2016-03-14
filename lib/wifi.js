process.env.DISPLAY = ':0';
process.env.DBUS_SESSION_BUS_ADDRESS = 'unix:path=/run/dbus/system_bus_socket';

var exec = require('child_process').exec; 
var logger = require(__dirname + '/logger');
var wifidog = require(__dirname + '/wifidog_dev');
var connman = require(__dirname + '/connman_dev');
var led = require(__dirname + '/led');
var button = require(__dirname + '/button');
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
    function start_ap(){
        console.log("start  ap .......");
        connman.on('scan',function(err,service){
            wlan0_info = service;
            console.log(wlan0_info);
            connman.on('ap',function(err){
                if(err)console.log('start_ap'+err);
                StartwifidogInterval  = setInterval(StartWifidog,1000,'Try to start wifidog');
            });
        });
    }
    connman.on('init',function(){
        connman.on('state',function(err,state){
            if(state == 'true'){
                console.log("connection is fine .......");
                //button.on('on',start_ap);
            }else{
                start_ap();
            }
        });
    });   
    button.on('on',function(){
        start_ap();
        wifidog.on('on');
    });
    io.on('connection', function(socket) {
        console.log("connect!.............");
        //io.emit('hello', "haha");
        io.emit('wlan0_info', wlan0_info);
         //console.log(wlan0_info);
    }); 
};
