var teamCon = require('./socket/teamNameSpace/connection');

module.exports = function(app) {
  app.on('started', function() {
    app.io = require('socket.io').listen(app.server);
    var Team = app.models.Team;
    Team.find().then(function(teams) {
      for (var team in teams) {
        teamCon(app, team, app.io);
      }
    });
  });
};
