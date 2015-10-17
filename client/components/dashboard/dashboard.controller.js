'use strict';

/**
 * ダッシュボード画面のコントローラー
 */
export default class DashboardController {
  /**
   * モデルの初期値登録とログイン失敗時のハンドラーを作成
   * @param  {[type]} $state       ui-routerオブジェクト
   * @param  {[type]} User         LoopbackのユーザーAPI
   * @param  {[type]} UserModel    ユーザー情報モデル
   * @param  {[type]} errorHandler エラーハンドラー作成オブジェクト
   */
  constructor($state, User, UserModel, errorHandler) {
    this.state = $state;
    this.User = User;
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
    this.User.login(this.account).$promise.then(this.tranDashboard.bind(this))
      .catch(this.loginFailedHandler);
  }

  /**
   * ダッシュボード画面へ遷移する
   * @param  {[type]} result ログイン成功オブジェクト
   */
  tranDashboard(result) {
    this.user = result.user;
    this.state.go('newAccount');
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
  'User',
  'userModel',
  'errorHandler'
];
