var ConnMan = require('connman-api');
var async = require('async');
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
            console.log('list ....'); 
            if(err) return console.log(err);
            for(var serviceName in services) {
                console.log(services[serviceName].Name);
            }
            event.emit('scan'); 
        }); 
    });     

    event.emit('scan');
});
