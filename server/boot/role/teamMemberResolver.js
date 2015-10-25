/**
 * ユーザーIDを取得する
 * @param  {[type]}   context コンテキスト
 * @return {Integer}          ユーザーID
 */
function findUserByToken(context) {
  var userId = context.accessToken.userId;
  return userId;
}

/**
 * 捜査対象のチームにユーザーが所属しているか検証する
 * @param  {[type]}   context コンテキスト
 * @param  {Function} cb      判定コールバック
 * @param  {Function} ecb     エラー時のコールバック
 */
function verificationByTeam(context, cb, ecb) {
  var userId = findUserByToken(context);
  if (!userId) return ecb();

  context.model.findById(context.modelId, function(err, team) {
    if (err || !team) return ecb();

    team.users.findById(userId, function(err, user) {
      if (err) {
        console.error(err);
        return cb(null, false);
      }
      cb(null, user); // true = is a team member
    });
  });
}

/**
 * チャンネルのチームがユーザーの所属チームか検証する
 * @param  {[type]}   context コンテキスト
 * @param  {Function} cb      判定コールバック
 * @param  {Function} ecb     エラー時のコールバック
 */
function verificationByChannel(context, cb, ecb) {
  var userId = findUserByToken(context);
  if (!userId) return ecb();

  context.model.findById(context.modelId, function(err, channel) {
    if (err || !channel) return ecb();

    channel.team(channel.teamId, function(err, team) {
      if (err || !team) return ecb();

      team.users.findById(userId, function(err, user) {
        if (err) {
          console.error(err);
          return cb(null, false);
        }
        cb(null, user); // true = is a team member
      });
    });
  });
}

module.exports = function(app) {
  var Role = app.models.Role;

  Role.registerResolver('teamMember', function(role, context, cb) {
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // if the target model is not project
    if (context.modelName === 'team') {
      verificationByTeam(context, cb, reject);
    } else if (context.modelName === 'channel') {
      verificationByChannel(context, cb, reject);
    } else {
      return reject();
    }

  });
};
