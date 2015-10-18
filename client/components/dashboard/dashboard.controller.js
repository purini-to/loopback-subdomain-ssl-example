'use strict';

import './dashboard.styl';

const COLORS = [
  'deep-purple',
  'light-blue',
  'blue-grey',
  'yellow',
  'deep-orange',
  'pink',
  'indigo',
  'cyan',
  'light-green',
  'amber',
  'brown',
  'purple',
  'blue',
  'green',
  'lime',
  'orange',
  'grey',
  'red',
];

/**
 * ダッシュボード画面のコントローラー
 */
export default class DashboardController {
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
    this.colors = COLORS;
  }

  /**
   * チームのホーム画面へ遷移する
   * @param  {Integer} index 選択したチームのインデックス
   */
  tranTeamHome(index) {
    if (!this.user || !this.user.teams) throw new Error('ユーザー情報またはチーム情報が存在しない');
    if (index < this.user.teams.length) {
      var team = this.user.teams[index];
      console.log(team);
    }
  }

  /**
   * チーム追加画面へ遷移する
   */
  tranAddTeam() {
    this.state.go('addTeam');
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
DashboardController.$inject = [
  '$state',
  'userModel',
  'errorHandler'
];
