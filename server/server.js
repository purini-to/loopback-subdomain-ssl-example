var loopback = require('loopback');
var boot = require('loopback-boot');
var config = require('./config.json');

var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');

var app = module.exports = loopback();

// サブドメインの設定
var reg = new RegExp('^(.*).' + config.host, 'g');
app.get('/[^api][^\.]+$', function(req, res, next) {
  req.subdomain = req.host.replace(reg, '$1');
  if (req.subdomain === config.host) delete req.subdomain;
  next();
});

// boot scripts mount components like REST API
boot(app, __dirname);

var sslConfig = app.get('ssl');
var createSslOptions = function() {
  var keyPath = path.join(__dirname, sslConfig.key);
  var certPath = path.join(__dirname, sslConfig.cert);
  return {
    key: fs.readFileSync(keyPath).toString(),
    cert: fs.readFileSync(certPath).toString()
  };
};

var listenReport = function(protocol, port) {
  var portStr = (port === 80 || port === 443) ? '' : ':' + app.get('port');
  var baseUrl = protocol + app.get('host') + portStr;

  app.emit('started', baseUrl);
  console.log('Web server listening at: %s%s', baseUrl, '/');
  if (app.get('loopback-component-explorer')) {
    var explorerPath = app.get('loopback-component-explorer').mountPath;
    console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
  }
};

app.start = function() {
  var server = null;
  var sslOnly = (sslConfig);

  if (sslOnly) {
    var options = createSslOptions();
    var port = app.get('port');
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }
  server.listen(app.get('port'), function() {
    var protocol = (sslOnly) ? 'https://' : 'http://';
    listenReport(protocol, app.get('port'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
