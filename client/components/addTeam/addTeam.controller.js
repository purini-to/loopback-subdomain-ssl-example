'use strict';

/**
 * チーム追加画面のコントローラー
 */
export default class AddTeamController {
  /**
   * モデルの初期値登録とログイン失敗時のハンドラーを作成
   * @param  {[type]} $state       ui-routerオブジェクト
   * @param  {[type]} UserModel    ユーザー情報モデル
   * @param  {[type]} errorHandler エラーハンドラー作成オブジェクト
   */
  constructor($state, UserModel, errorHandler) {
    this.team = {
      name: ''
    };
    this.validate = {
      name: {
        uniqueness: false
      }
    };
    this.state = $state;
    this.user = UserModel;
    this.errorHandler = errorHandler;
    /**
     * チーム追加がエラー時の処理
     */
    this.addTeamFailedHandler = errorHandler
      .factoryStatusHandle(422, this.validate);
  }

  /**
   * チーム追加処理
   */
  addTeam() {
    this.user.addTeam(this.team).then((team) => {
      this.state.go('dashboard');
    }).catch(this.addTeamFailedHandler);
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
AddTeamController.$inject = [
  '$state',
  'userModel',
  'errorHandler'
];
