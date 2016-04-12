var ConnMan = require('connman-api');
var led = require(__dirname + '/led')
var logger = require(__dirname + '/logger');
var EventEmitter = require('events').EventEmitter; 
var connman = new ConnMan(true);
var wifi;
var ssid;
var password;
var serviceData;
var service;
var wlan0_info;
var event = new EventEmitter(); 

exports.on = function(opt,callback){
    if(opt == 'init'){
        connman.init(function(){
             logger.info("connman init ......")
            wifi = connman.technologies['WiFi'];
            callback();
        });
    }
    if(opt == 'status'){
        connman.getServices(function(err, services) {
            for(var service_obj in services){
              //   logger.info(services[service_obj]);
                if(services[service_obj].Type == 'wifi')
                {
                     if(services[service_obj].IPv4.Address != null)
                     {
                         //  logger.info(services[service_obj]);
                         wlan0_info = services[service_obj]
                         break;
                     }
                }
            }
            callback(err,wlan0_info);
        });        
    }
    if(opt == 'sta'){
        ssid = arguments[1];
        password = arguments[2];
        callback = arguments[3];
        var lastStatus = '';
        var scanCounter= 0; 
         event.on('sta_scan', function() { 
            wifi.scan(function(){
               event.emit('confirm'); 
            }); 
             logger.info('scan ....'); 
        });  
        event.on('confirm', function() { 
            wifi.getServices(function(err, services) {
                if(err) return  logger.info(err);
                for(var serviceName in services) {
                    if(services[serviceName].Name == ssid) {
                        serviceData = services[serviceName];
                         logger.info("found network '"+ssid+"'");
                        event.emit('getWifiObject');
                        break;
                    }
                }
                if (!serviceData) {
                     logger.info("no serviceData ....");
                    scanCounter++;
                    if(scanCounter == 3)
                    {
                        scanCounter =0;
                        callback('failure');
                    }
                    else
                        event.emit('sta_scan'); 
                }
            });
        }); 
        event.on('getWifiObject', function() {
            connman.getService(serviceData.serviceName, function(err, ser) {
                if(err) {                
                         logger.info(err);
                         logger.info("getService error");
                        event.emit('sta_scan'); 
                    }
                    
                service = ser;   
                 logger.info(service.name);
                event.emit('Connecting');
            });        
        });  
        event.on('Connecting', function() {
            service.connect(function(err, agent) {
                if (err){
                     logger.info(err);
                    event.emit('sta_scan'); 
                }
                var failed = false;
                 logger.info(connman.enableAgent);
                if(connman.enableAgent) {
                  agent.on('Release', function() {
                       logger.info('Release');
                  });
                  agent.on('ReportError', function(path, err) {
                       logger.info('ReportError:');
                       logger.info(err);
                      failed = true;
                      /* connect-failed */
                      /* invalid-key */
                  });
                  agent.on('RequestBrowser', function(path, url) {
                       logger.info('RequestBrowser');
                  });
                  /* Initializing Agent for connecting access point */
                  agent.on('RequestInput', function(path, dict, callback) {
                       logger.info(dict);

                      if ('Passphrase' in dict) {
                          callback({ 'Passphrase': password });
                          event.emit('PropertyChanged');
                          return;
                      }

                      callback({});
                  });
                  agent.on('Cancel', function() {
                       logger.info('Cancel');
                       callback("failure");
                  });
                  event.emit('PropertyChanged');
                }
            });        
        });   
        event.on('PropertyChanged', function() {
             logger.info("PropertyChanged");
            // listen for service property changes
            service.on('PropertyChanged', function(name, value) {
                // logger.info(name + '=' + value);
                if (name == 'State') {
                    switch(value) {
                    case 'failure':
                        lastStatus =  value;
                        callback(lastStatus);
                        event.emit('last');
                        break;
                    case 'association':
                         logger.info('Associating ...');
                        break;
                    case 'configuration':
                         logger.info('Configuring ...');
                        break;
                    case 'online':
                    case 'ready':
                        lastStatus =  value;
                        callback(lastStatus);
                        event.emit('last');
                        break;
                    }
                }
            });         
        });  
        event.on('last', function() {
         //   callback(lastStatus);
        });
        event.emit('sta_scan'); 
    } 
    if(opt == 'scan'){
        event.on('scan', function() {
            if(wifi == undefined) wifi = connman.technologies['WiFi'];
            wifi.scan(function(){
               event.emit('list'); 
            }); 
             logger.info('connman scan ....'); 
        });  
        event.on('list', function() { 
            wifi.getServices(function(err, services) {
                 logger.info('connman list ....'); 
                var isScan = false;
                if(err) return  logger.info(err);
                for(var serviceName in services) {
                    if(services[serviceName].Name != null){
                        isScan = true;
                         logger.info(services[serviceName].Name);
                        callback(err,services);
                        break;
                    }
                }
                if(isScan == false){
                        event.emit('scan');
                }
            }); 
        });     
        event.emit('scan');             
    }
}