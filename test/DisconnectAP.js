var ConnMan = require('connman-api');

var connman = new ConnMan();
connman.init(function() {

	connman.Wifi.disconnect(function() {
		console.log('disconnected');
		process.exit();
	});
	
});
