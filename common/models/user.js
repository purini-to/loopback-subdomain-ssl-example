var bcrypt = require('bcrypt-nodejs');

module.exports = function(User) {
  // バリデーション処理
  User.validatesLengthOf('password', {
    min: 5,
    message: {
      min: 'Password is too short. Min length 5'
    }
  });

  /**
   * パスワードのバリデーション時にハッシュ化された文字列で検証しているバグあり
   * 一時対応として、セッターでプレイン文字列を詰めるように修正
   * @param  {string} plain パスワードの文字列
   */
  User.setter.password = function(plain) {
    this.$password = plain;
  };
  /**
   * ユーザー作成前にパスワードのハッシュ化を行う
   * 既にバリデーション処理でOKとなっている
   * @param  {UserModel}   user ユーザーのモデル
   * @param  {next} next 次の処理を行うコールバック関数
   */
  User.observe('persist', function (user, next) {
    var _user = (user.isNewInstance) ? user.currentInstance : user.data;
    var password = _user.password;
    var salt = bcrypt.genSaltSync(User.settings.saltWorkFactor);
    _user.password = bcrypt.hashSync(password, salt);
    next();
  });
};
