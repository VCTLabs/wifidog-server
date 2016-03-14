var ConnMan = require('connman-api');
var led = require(__dirname + '/led')
var connman_cmd = require(__dirname + '/connman_cmd_dev');
var async = require('async');
var connman = new ConnMan(true);
var wifi;
var StartwifidogInterval;
var ssid;
var password;
var serviceData;
var service;
var ScanWifiInterval;
var STAInterval;
var TryAgainScanWifiInterval;
var TryAgainNumber;
var wlan0_info
function listAccessPoint(callback){
    function ticker(){
        console.log(" ListWifiAccessPoints ticker....");
        async.series([
            function(next){
                wifi.disableTethering(function(err, res) {
                    next();
                });
            },
            function(next){
                wifi.setProperty('Powered', false, function() {
                    next();
                });
            },
            function(next){
                wifi.setProperty('Powered', true, function() {
                    next();
                });
            },
            function(next){
                wifi.scan(function(err){
                    next(err)
                });
            },
            function(next){
                //connmanctl services
                wifi.getServices(function(err, services) { 
                    //console.log(wlan0_info);
                    for(var a_ssid in services){
                        console.log(services[a_ssid].Name);
                       if(services[a_ssid].Name != null){
                            //clear scan wifi interval
                            clearInterval(ScanWifiInterval);  
                            ScanWifiInterval = null;                              
                            console.log("ListWifiAccessPoints finished!....");
                           // process.exit();
                            wlan0_info = services
                            callback(err,services);
                            break;
                       }
                    }
                });             
            }
        ]);
        // wifi.disableTethering(function(err, res) {
            //connmanctl scan wifi
            // console.log(err);
            // wifi.scan(function(err){
                // if (err) {
                     // console.log(err);
                // }
                //connmanctl services
                // wifi.getServices(function(err, services) { 
                    // var wlan0_info = services;
                    //console.log(wlan0_info);
                    // for(var a_ssid in wlan0_info){
                       // if(wlan0_info[a_ssid].Name != null){
                            //clear scan wifi interval
                            // clearInterval(ScanWifiInterval);  
                            // ScanWifiInterval = null;                              
                            // console.log("ListWifiAccessPoints finished!....");
                            // process.exit();
                            // callback(err,services);
                            // break;
                       // }
                    // }
                // });        
            // }); 
        // });
    }
    ScanWifiInterval = setInterval(ticker,2000,'Get Wifi access points list');
}

exports.on = function(opt,callback){
    if(opt == 'init'){
        connman.init(function(){
            console.log("connman init ......")
            wifi = connman.technologies['WiFi'];
            callback();
        });
    }
    
    if(opt == 'ap'){
       connman.getAllTechnologyInfo(function(err, technologies){
           wifi.enableTethering('beaglebone0000', '11111111', function(err) {
               callback(err);
           });       
       });            
    }
    if(opt == 'state'){
        var is_connect = false;
        connman.getServices(function(err, services) {
            for(var service_obj in services){
                console.log(services[service_obj].Type);
                if(services[service_obj].Type == 'wifi')
                {
                     console.log(services[service_obj].IPv4.Address);
                     if(services[service_obj].IPv4.Address != null)
                     {
                         is_connect = true
                         break;
                     }
                }
            }
            if(is_connect == true) callback(err,'true');
            else callback(err,'false');
            console.log('.....')
        });        
    }
    if(opt == 'sta'){
        ssid = arguments[2];
        password = arguments[3];
        async.series([
            function(next) {
                for(var serviceName in wlan0_info) {
                    if(wlan0_info[serviceName].Name == ssid) {
                        serviceData = wlan0_info[serviceName];
                        console.log("found network '"+ssid+"'");                        
                        next();
                        break;
                    }                    
                }
            },
            function(next) {
                // get wifi service object
                console.log(serviceData.serviceName);

                connman_cmd.on('sta',serviceData.serviceName,password)
                next();
            },
        ],function(err) {
            console.log("connect sequence finished ",err || '');
           // process.exit();
        });
    } 
    if(opt == 'scan'){
         listAccessPoint(callback);               
    }
}