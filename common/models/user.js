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
   * @param  {next} next 次の処理を行うコールバック関数
   * @param  {UserModel}   user ユーザーのモデル
   */
  User.beforeCreate = function(next, user) {
    var password = user.password;
    var salt = bcrypt.genSaltSync(this.constructor.settings.saltWorkFactor);
    user.password = bcrypt.hashSync(user.password, salt);
    next();
  };
};
