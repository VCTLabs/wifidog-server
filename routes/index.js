var express = require('express');
var router = express.Router();
var connman = require(__dirname + '/../lib/connman');
var wifidog = require(__dirname + '/../lib/wifidog');
var logger = require(__dirname + '/../lib/logger');
var led = require(__dirname + '/../lib/led');
var config = require(__dirname+ "/../config");
var EventEmitter = require('events').EventEmitter; 
var fs = require('fs');
var gw_address = '';
var gw_port = '';
var ssid;
var password;
var event = new EventEmitter(); 
var errorCode;
/* GET home page. */
router.get('/', function(req, res, next) {
     res.redirect( 'http://192.168.8.1/bone101/Support/bone101/' );
});
/* GET ping . */
router.get('/ping', function(req, res, next) {
  
  res.send('Pong');
});
/* GET ping . */
router.get('/login', function(req, res, next) {
    gw_address = req.query.gw_address;
    gw_port     = req.query.gw_port;
    led.on("ok");
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    fs.readFile(config.admin.file, 'utf8', function (err, data) {
        if(data !=""){
            res.render('begin', { title: 'WIFI authentication' });
        }
        else{
             res.render('index', { title: 'WIFI authentication' });
        }
    });  
});
/*for web browser test*/
router.post('/config',function(req,res){

     logger.info(req.body);
    res.send("hello word");
   // res.render('starter', { title: 'Simple getting starter' });
});
/*wifidog post ssid and password*/
router.post('/login/config',function(req,res,next){

});
/*wifidog post ssid and password*/
router.post('/login/done',function(req,res){
     wifidog.on('off');
     res.redirect( 'http://192.168.8.1/bone101/Support/bone101/' );
});

/*for web browser test*/
router.post('/last',function(req,res){
      logger.info('last.......');
     res.render('BB_logo', { title: 'Show logo' }); 
});
/*wifidog tell you are ready.*/
router.post('/login/admin',function(req,res){
    logger.info('admin.......');
    res.render('index', { title: 'WIFI authentication' });
});
router.get('/auth', function(req, res, next) {
    
});

module.exports = router;
