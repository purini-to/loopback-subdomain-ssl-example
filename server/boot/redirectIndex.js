var path = require('path');

module.exports = function(app) {
  app.get('/[^\.]+$', function(req, res) {
    res.set('Content-Type', 'text/html')
      .sendfile(path.join(__dirname + '../../../public/index.html'));
  });
};
