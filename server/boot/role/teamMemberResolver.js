module.exports = function(app) {
  var Role = app.models.Role;

  Role.registerResolver('teamMember', function(role, context, cb) {
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // if the target model is not project
    if (context.modelName !== 'team') {
      return reject();
    }

    // do not allow anonymous users
    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    context.model.findById(context.modelId, function(err, team) {
      if (err || !team) return reject();

      team.users.findById(userId, function(err, user) {
        if (err) {
          console.error(err);
          return cb(null, false);
        }
        cb(null, user); // true = is a team member
      });
    });
  });
};
