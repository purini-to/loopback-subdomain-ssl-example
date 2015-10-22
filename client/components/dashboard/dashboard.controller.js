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
   * @param  {[type]} $location    ロケーション情報サービス
   * @param  {[type]} UserModel    ユーザー情報モデル
   * @param  {[type]} errorHandler エラーハンドラー作成オブジェクト
   */
  constructor($state, $location, UserModel, errorHandler) {
    this.state = $state;
    this.user = UserModel;
    this.location = $location;
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
      var domain = this.location.host();
      var exep = /^(.*?:\/\/)(.*?)\/.*$/;
      var url = this.location.absUrl().replace(exep, `$1${team.name}.$2`);
      location.href = url;
    }
  }

  /**
   * チーム追加画面へ遷移する
   */
  tranAddTeam() {
    this.state.go('addTeam');
  }

  /**
   * 画面表示前に実行する処理
   * @return {Object}           resolveオブジェクト
   */
  static resolve() {
    return {
      /**
       * チーム一覧を取得する
       * チームが存在しない場合は、チーム追加画面へ遷移
       * @param  {[type]} $state    ステートサービス
       * @param  {UserModel} userModel ユーザー情報モデル
       * @return {Promise}           チーム取得プロミス
       */
      teams: function($state, userModel) {
        return userModel.findTeams().then((result) => {
          if (!userModel.teams || userModel.teams.length === 0)
            $state.go('addTeam');
          return result;
        });
      }
    };
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
DashboardController.$inject = [
  '$state',
  '$location',
  'userModel',
  'errorHandler'
];
