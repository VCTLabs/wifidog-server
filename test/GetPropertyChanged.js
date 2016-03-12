var ConnMan = require('connman-api');

var connman = new ConnMan();
connman.init(function() {
	connman.on('PropertyChanged', function(name, value) {
		console.log('[Manager]', name, value);
	});
});
