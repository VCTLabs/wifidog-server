//NOTE: Network.js DBUS needs environment vars below
//from: http://stackoverflow.com/questions/8556777/dbus-php-unable-to-launch-dbus-daemon-without-display-for-x11
process.env.DISPLAY = ':0';
process.env.DBUS_SESSION_BUS_ADDRESS = 'unix:path=/run/dbus/system_bus_socket';


var ConnMan = require('connman-api');

var connman = new ConnMan(true);
var filteredServices = {};
connman.init(function() {

	connman.getServices(function(err, services) {
		for(var serviceName in services){
            console.log(services[serviceName].Name);
            if(services[serviceName].Type == 'wifi')
            {
                 console.log(services[serviceName].IPv4.Address);
                 if(services[serviceName].IPv4.Address != '')
                 {
                      var service = services[serviceName];
                      service.serviceName = serviceName;
                      filteredServices[serviceName] = service;
                    // connman.getService(serviceName, function(err, ser) {
                        // console.log(ser);
                    // });  
                        console.log(filteredServices);
                        filteredServices.disconnect(function(err){
                            console.log(err);
                        });
                     break;
                 }
            }
        }
        console.log('.....')
		process.exit();
	});
});
