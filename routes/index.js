var express = require('express');
var router = express.Router();
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
  res.render('index', { title: 'WIFI authentication' });
});

router.post('/config',function(req,res){
    console.log("Form (form querystring):" + req.query.form);
    //var wlan0_info = JSON.parse(ssid_list);
    console.log(req.body.ssid);
    console.log(req.body.password);
    console.log(req.body.boardname);
    res.render('starter', { title: 'Simple getting starter' });  
});
module.exports = router;
