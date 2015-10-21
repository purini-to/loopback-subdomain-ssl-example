'use strict';

require('./login.styl');

/**
 * アクセストークンの最長時間(日)
 * 90日
 * @type {Integer}
 */
const NINETY_DAY = 60 * 60 * 24 * 90;

/**
 * ログイン画面のコントローラー
 */
export default class LoginController {
  /**
   * モデルの初期値登録とログイン失敗時のハンドラーを作成
   * @param  {[type]} $state       ui-routerオブジェクト
   * @param  {[type]} UserModel    ユーザー情報モデル
   * @param  {[type]} errorHandler エラーハンドラー作成オブジェクト
   */
  constructor($state, UserModel, errorHandler) {
    this.state = $state;
    this.user = UserModel;
    this.errorHandler = errorHandler;
    this.account = {
      email: '',
      password: ''
    };
    this.remain = false;
    this.validate = {
      faildedLogin: false
    };
    /**
     * ログイン失敗処理
     * 401エラーの場合は、ログイン失敗フラグを設定する
     * @param  {Integer} 401  ステータスコード
     * @param  {Function} function ステータスコードに一致したエラー時の処理関数
     * @return {Throw}      エラーオブジェクト
     */
    this.loginFailedHandler = errorHandler.factoryStatusHandle(401, (err) => {
      this.validate.faildedLogin = true;
      return err;
    });
  }

  /**
   * ログイン処理
   * 成功した場合は、ダッシュボード画面へ遷移する
   * 失敗した場合は、ログイン失敗処理を実行する
   */
  login() {
    this.validate.faildedLogin = false;
    delete this.account.ttl;
    if (this.remain) this.account.ttl = NINETY_DAY;
    this.user.login(this.account, this.remain)
      .then((token) => {
        return this.user.findById();
      }).then(this.user.saveStorageToken(this.remain))
      .then((result) => {
        this.tranDashboard();
        return result;
      }).catch(this.loginFailedHandler);
  }

  /**
   * チーム追加画面へ遷移する
   */
  tranAddTeam() {
    this.state.go('addTeam');
  }

  /**
   * ダッシュボード画面へ遷移する
   */
  tranDashboard() {
    this.state.go('dashboard');
  }

  /**
   * アカウント作成画面へ遷移する
   */
  tranNewAcount() {
    this.state.go('newAccount');
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
LoginController.$inject = [
  '$state',
  'userModel',
  'errorHandler'
];
