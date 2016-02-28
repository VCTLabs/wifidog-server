var express = require('express');
var router = express.Router();
var gw_address = '';
var gw_port = '';
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send('hello world');
});
/* GET ping . */
router.get('/ping', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  
  res.send('Pong');
});
/* GET ping . */
router.get('/login', function(req, res, next) {
    gw_address = req.query.gw_address;
    gw_port     = req.query.gw_port;
  res.render('index', { title: 'WIFI authentication' });
});

router.post('/login/config',function(req,res){
    var token = '';
    console.log("Form (form querystring):" + req.query.form);
    //var wlan0_info = JSON.parse(ssid_list);
    console.log(req.body.ssid);
    console.log(req.body.password);
    var crypt = require('crypto');
    token = crypt.randomBytes( 64 ).toString('hex');
    //res.render('starter', { title: 'Simple getting starter' });  
    //console.log('http://' + gw_address + ':' + gw_port + '/wifidog/auth?token=' + token );
    res.redirect( 'http://' + gw_address + ':' + gw_port + '/wifidog/auth?token=' + token );
});
router.get('/auth', function(req, res, next) {
    
});
module.exports = router;
