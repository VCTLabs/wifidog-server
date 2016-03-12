var ConnMan = require('connman-api');

var connman = new ConnMan();
connman.init(function() {

	connman.getAllTechnologyInfo(function(err, technologies) {
		console.log(technologies);
		process.exit();
	});

});
