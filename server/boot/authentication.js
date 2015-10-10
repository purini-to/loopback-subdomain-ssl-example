module.exports = function enableAuthentication(server) {
  // enable authentication
  server.enableAuth();

  var tokenSettings = {
    model: server.models.accessToken,
    currentUserLiteral: 'me',
  };
  server.use(server.loopback.token(tokenSettings));
};
