var express = require('express');
var router = express.Router();

/* GET ping listing. */
router.get('/ping', function(req, res, next) {
    console.log("ping");
  res.send('Pong');
});

module.exports = router;
