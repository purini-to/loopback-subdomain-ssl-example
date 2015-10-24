var path = require('path');

module.exports = function(app) {
  app.get('/[^api][^\.]+$', function(req, res, next) {
    if (req.subdomain) {
      var filePath = __dirname + '../../../public/components/team/team.html';
      res.set('Content-Type', 'text/html')
        .sendfile(path.join(filePath));
    } else {
      res.set('Content-Type', 'text/html')
        .sendfile(path.join(__dirname + '../../../public/index.html'));
    }
    // next();
  });
};
