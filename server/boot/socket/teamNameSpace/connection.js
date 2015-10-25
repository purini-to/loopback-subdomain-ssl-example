module.exports = function(app, team, io) {
  var Team = app.models.Team;
  var Channel = app.models.Channel;

  var nameSpace = '/' + team.name;
  var teamNs = io.of(nameSpace);
  teamNs.on('connection', function(socket) {
    // あとは普通通りにSocket.IOの実装をすすめる
    console.log('connect...' + team.name);
    require('./team')(app, team, teamNs, socket);
    socket.on('disconnect', function() {
      console.log('disconnect...' + team.name);
    });
  });
  Channel.on('add:channel' + team.id, function(channel) {
    console.log(team.name, channel);
    if (channel.teamId === team.id) {
      teamNs.emit('add:channel', channel);
    }
  });
};
