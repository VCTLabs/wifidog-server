var ConnMan = require('connman-api');
var async = require('async');
var targetNetwork = 'Xiaomi_9AC8';
var EventEmitter = require('events').EventEmitter; 
var connman = new ConnMan(true);
var wifi; 
var serviceData;
var service;
var event = new EventEmitter(); 
connman.init(function() {
    wifi = connman.technologies.WiFi; 
     event.on('scan', function() { 
        wifi.scan(function(){
           event.emit('list'); 
        }); 
        console.log('scan ....'); 
    });  
    event.on('list', function() { 
        wifi.getServices(function(err, services) {
            if(err) return console.log(err);
            for(var serviceName in services) {
                if(services[serviceName].Name == targetNetwork) {
                    serviceData = services[serviceName];
                    console.log("found network '"+targetNetwork+"'");
                    event.emit('getWifiObject');
                    break;
                }
            }
            if (!serviceData) {
                event.emit('scan'); 
            }
        });
    }); 
    event.on('getWifiObject', function() {
        connman.getService(serviceData.serviceName, function(err, ser) {
            if(err) { 
                event.emit('scan'); 
                console.log(err);
                }
                
            service = ser;   
            console.log(service.name);
            event.emit('Connecting');
        });        
    });  
    event.on('Connecting', function() {
        service.connect(function(err, agent) {
            if (err){
                event.emit('scan'); 
                console.log(err);
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
                      callback({ 'Passphrase': 'qqqqqqqq9' });
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
                    event.emit('scan');
                    break;
                case 'association':
                    console.log('Associating ...');
                    break;
                case 'configuration':
                    console.log('Configuring ...');
                    break;
                case 'online':
                case 'ready':
                    console.log('Connected');
                    event.emit('disconnect');
                    break;
                }
            }
        });        
    });   
    event.on('disconnect', function() {
        service.disconnect(function() {
            console.log('disconnected');
            event.emit('scan');
        });       
    });   
    event.emit('scan');     
});

