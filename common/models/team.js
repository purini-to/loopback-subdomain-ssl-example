var teamCon = require('../../server/boot/socket/teamNameSpace/connection');

module.exports = function(Team) {
  Team.validatesUniquenessOf('name', {
    message: 'name is not unique'
  });

  /**
   * ユーザー作成前にパスワードのハッシュ化を行う
   * 既にバリデーション処理でOKとなっている
   * @param  {UserModel}   user ユーザーのモデル
   * @param  {next} next 次の処理を行うコールバック関数
   */
  Team.observe('after save', function(team, next) {
    if (team.instance) {
      var app = team.Model.app;
      var Channel = app.models.Channel;
      teamCon(app, team.instance, app.io);
      Channel.create({
        name: 'general',
        teamId: team.instance.id
      }).then(function() {
        next();
      });
    } else {
      next();
    }
  });
};
