var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var routes = require(__dirname + '/routes/index');
var users = require(__dirname + '/routes/users');
var ping = require(__dirname + '/routes/ping');

var app = express();
var b = require('bonescript');
app['bonescript'] = b;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.disable('etag');
// uncomment after placing your favicon in /public
app.use(favicon('/var/lib/cloud9/favicon.ico')); // move when bone101 moves to /usr/share/bone101
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/ping', ping);
app.use('/users', users);

// Add bone101 and bonescript
app.get('/bonescript.js', b.socketJSReqHandler);
app.use('/bone101/static', express.static('/var/lib/cloud9/static')); // to be removed when bone101 is statically moved to /usr/share/bone101
app.use('/bone101', express.static('/var/lib/cloud9/bone101')); // to be updated when bone101 is moved to /usr/share/bone101
// var serverEmitter = new events.EventEmitter();
// Note: socket.io listners need to be installed with b.addSocketListeners(server, serverEmitter);
// to be done in bin/www, since socket.io is already used there

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
