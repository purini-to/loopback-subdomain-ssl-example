var path = require('path');

module.exports = function(app) {
  app.get('/[^api][^\.]+$', function(req, res, next) {
    res.set('Content-Type', 'text/html')
      .sendfile(path.join(__dirname + '../../../public/index.html'));
  });
};
