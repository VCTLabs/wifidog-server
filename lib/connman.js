var ConnMan = require('connman-api');
var led = require(__dirname + '/led')
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
            console.log("connman init ......")
            wifi = connman.technologies['WiFi'];
            callback();
        });
    }
    if(opt == 'state'){
        connman.getServices(function(err, services) {
            for(var service_obj in services){
                //console.log(services[service_obj].Type);
                if(services[service_obj].Type == 'wifi')
                {
                     //console.log(services[service_obj].IPv4.Address);
                     if(services[service_obj].IPv4.Address != null)
                     {
                         wlan0_info = services[service_obj].IPv4.Address 
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
         event.on('sta_scan', function() { 
            wifi.scan(function(){
               event.emit('confirm'); 
            }); 
            console.log('scan ....'); 
        });  
        event.on('confirm', function() { 
            wifi.getServices(function(err, services) {
                if(err) return console.log(err);
                for(var serviceName in services) {
                    if(services[serviceName].Name == ssid) {
                        serviceData = services[serviceName];
                        console.log("found network '"+ssid+"'");
                        event.emit('getWifiObject');
                        break;
                    }
                }
                if (!serviceData) {
                    console.log("no serviceData ....");
                    event.emit('sta_scan'); 
                }
            });
        }); 
        event.on('getWifiObject', function() {
            connman.getService(serviceData.serviceName, function(err, ser) {
                if(err) {                
                        console.log(err);
                        console.log("getService error");
                        event.emit('sta_scan'); 
                    }
                    
                service = ser;   
                console.log(service.name);
                event.emit('Connecting');
            });        
        });  
        event.on('Connecting', function() {
            service.connect(function(err, agent) {
                if (err){
                    console.log(err);
                    event.emit('sta_scan'); 
                }
                var failed = false;
                console.log(connman.enableAgent);
                if(connman.enableAgent) {
                  agent.on('Release', function() {
                      console.log('Release');
                  });
                  agent.on('ReportError', function(path, err) {
                      console.log('ReportError:');
                      console.log(err);
                      failed = true;
                      /* connect-failed */
                      /* invalid-key */
                  });
                  agent.on('RequestBrowser', function(path, url) {
                      console.log('RequestBrowser');
                  });
                  /* Initializing Agent for connecting access point */
                  agent.on('RequestInput', function(path, dict, callback) {
                      console.log(dict);

                      if ('Passphrase' in dict) {
                          callback({ 'Passphrase': password });
                          event.emit('PropertyChanged');
                          return;
                      }

                      callback({});
                  });
                  agent.on('Cancel', function() {
                      console.log('Cancel');
                  });
                  event.emit('PropertyChanged');
                }
            });        
        });   
        event.on('PropertyChanged', function() {
            console.log("PropertyChanged");
            // listen for service property changes
            service.on('PropertyChanged', function(name, value) {
                console.log(name + '=' + value);
                if (name == 'State') {
                    switch(value) {
                    case 'failure':
                        lastStatus =  value;
                        callback(lastStatus);
                        event.emit('last');
                        break;
                    case 'association':
                        console.log('Associating ...');
                        break;
                    case 'configuration':
                        console.log('Configuring ...');
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
       // wifi = connman.technologies.WiFi; 
        event.on('scan', function() { 
            wifi.scan(function(){
               event.emit('list'); 
            }); 
            console.log('scan ....'); 
        });  
        event.on('list', function() { 
            wifi.getServices(function(err, services) {
                console.log('list ....'); 
                var isScan = false;
                if(err) return console.log(err);
                for(var serviceName in services) {
                    if(services[serviceName].Name != null){
                        isScan = true;
                    }
                }
                if(isScan == true)
                        callback(err,services);
                    else
                        event.emit('scan'); 
            }); 
        });     
        event.emit('scan');             
    }
}