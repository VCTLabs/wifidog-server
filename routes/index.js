var express = require('express');
var router = express.Router();
var connman = require(__dirname + '/../lib/connman');
var wifidog = require(__dirname + '/../lib/wifidog');
var led = require(__dirname + '/../lib/led');
var EventEmitter = require('events').EventEmitter; 
var gw_address = '';
var gw_port = '';
var ssid;
var password;
var event = new EventEmitter(); 
var errorCode;
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

    //console.log(req.query);
    res.render('index', { title: 'WIFI authentication' });
});
/*for web browser test*/
router.post('/config',function(req,res){

    console.log(req.body);
    res.send("hello word");
   // res.render('starter', { title: 'Simple getting starter' });
});
/*wifidog post ssid and password*/
router.post('/login/config',function(req,res,next){
//    console.log("Form (form querystring):" + req.query.form);
    // console.log(req.body);
    // ssid = req.body.ssid;
    // password = req.body.password;
    // console.log(ssid);
    // console.log(password);
    // errorCode = 4;
    // event.on("send",function(){
        // if(errorCode == 1)
        // {return res.send("ready"); }
        // else if(errorCode == 2)
        // {return res.send("failure");}
        // else if(errorCode == 3)
         // {return res.send("failure");}
          
    // });
    // if(ssid !=null && password != null){
        // connman.on('sta',ssid,password,function(status){ 
            // console.log(status+errorCode);
            // if(errorCode == 4){
                // if(status == "ready")
                // {
                    // errorCode = 1;
                    // event.emit("send");
                // }
                // if(status == "failure")
                // {
                    // errorCode = 2;
                    // event.emit("send");                    
                // }
            // }       
        // });
    // }else{
        // if(errorCode == 4){
            // errorCode = 3;
            // event.emit("send");
        // }
    // }    

});
/*wifidog post ssid and password*/
router.post('/login/done',function(req,res){
     res.redirect( 'http://192.168.8.1/bone101/Support/bone101/' );
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
});
router.get('/auth', function(req, res, next) {
    
});

module.exports = router;
