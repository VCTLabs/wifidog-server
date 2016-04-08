var child_process = require('child_process');
last = child_process.exec('pgrep -f udhcpd.conf',function(err) {
  // console.log(err); 
});

last.stdout.on('data', function (data) {
    console.log('get It:::'+data);
});
