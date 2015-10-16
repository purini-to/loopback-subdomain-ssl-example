'use strict';

import './login.styl';

/**
 * ログイン画面のコントローラー
 */
export default class LoginController {
  /**
   * モデルの初期値登録とログイン失敗時のハンドラーを作成
   * @param  {[type]} $state       ui-routerオブジェクト
   * @param  {[type]} User         LoopbackのユーザーAPI
   * @param  {[type]} errorHandler エラーハンドラー作成オブジェクト
   */
  constructor($state, User, errorHandler) {
    this.state = $state;
    this.User = User;
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
    this.loginFailedHandler = errorHandler.errorStatusHandler(401, (err) => {
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
    this.User.login(this.account).$promise.then(this.tranDashboard)
      .catch(this.loginFailedHandler);
  }

  /**
   * ダッシュボード画面へ遷移する
   * @param  {[type]} result ログイン成功オブジェクト
   */
  tranDashboard(result) {
    console.log(result);
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
  'errorHandler'
];
