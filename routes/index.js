var express = require('express');
var router = express.Router();
var connman = require(__dirname + '/../lib/connman');
var wifidog = require(__dirname + '/../lib/wifidog');
var led = require(__dirname + '/../lib/led');
var gw_address = '';
var gw_port = '';
var ssid;
var password;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('hello world');
});
/* GET ping . */
router.get('/ping', function(req, res, next) {
  
  res.send('Pong');
});
/* GET ping . */
router.get('/login', function(req, res, next) {
    gw_address = req.query.gw_address;
    gw_port     = req.query.gw_port;
    led.on("config");
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    console.log(req.query);
    res.render('index', { title: 'WIFI authentication' });
});
/*for web browser test*/
router.post('/config',function(req,res){

    console.log(ssid);
    console.log(password);
    res.render('starter', { title: 'Simple getting starter' });
});
/*wifidog post ssid and password*/
router.post('/login/config',function(req,res){
    var token = '';
    console.log("Form (form querystring):" + req.query.form);
    ssid = req.body.ssid;
    password = req.body.password;
    console.log(ssid);
    console.log(password);
    
    res.render('starter', { title: 'Simple getting starter' });  
    //console.log('http://' + gw_address + ':' + gw_port + '/wifidog/auth?token=' + token );
    //res.redirect( 'http://' + gw_address + ':' + gw_port + '/wifidog/auth?token=' + token );
});
/*for web browser test*/
router.post('/last',function(req,res){
     console.log('last.......');
     res.render('BB_logo', { title: 'Show logo' }); 
});
/*wifidog tell you are ready.*/
router.post('/login/last',function(req,res){
   // wifidog.on('off');
    led.on("ok");

    res.render('BB_logo', { title: 'Show logo' }); 
    if(ssid !=null && password != null){
        connman.on('sta',ssid,password,function(err){
            console.log(err);
        });
    }
});
router.get('/auth', function(req, res, next) {
    
});

module.exports = router;
