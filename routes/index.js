var express = require('express');
var router = express.Router();
var connman = require(__dirname + '/../lib/connman_dev');
var wifidog = require(__dirname + '/../lib/wifidog_dev');
var gw_address = '';
var gw_port = '';
var ssid;
var password;
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
    res.render('BB_logo', { title: 'Show logo' }); 
    wifidog.on('off');
    connman.on('sta',function(err){
        console.log(err);
    },ssid,password);
});
router.get('/auth', function(req, res, next) {
    
});
module.exports = router;
