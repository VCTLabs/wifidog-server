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
  res.render('index', { title: 'Express' });
  });


module.exports = router;
