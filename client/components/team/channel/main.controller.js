'use strict';

import NewChannelController from './newChannel.controller';

/**
 * メイン画面のコントローラー
 */
export default class MainController {
  /**
   * ログインユーザー情報やチーム情報を設定
   * @param  {[type]} $state       ステートサービス
   * @param  {[type]} $mdDialog    ダイアログサービス
   * @param  {[type]} $mdToast     トーストサービス
   * @param  {[type]} userModel    ユーザー情報
   * @param  {[type]} teamModel    チーム情報
   * @param  {[type]} errorHandler エラーハンドラーサービス
   */
  constructor($state, $mdDialog, $mdToast, userModel, teamModel, errorHandler) {
    this.state = $state;
    this.dialog = $mdDialog;
    this.toast = $mdToast;
    this.user = userModel;
    this.team = teamModel;
  }

  /**
   * チャンネル作成ダイアログを開きます
   * @param  {Event} ev  クリックイベント
   */
  openDialogNewChannel(ev) {
    this.dialog.show({
      controller: NewChannelController,
      controllerAs: 'dl',
      templateUrl: '/components/team/channel/dialogAddChannel.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  }

  /**
   * 画面表示前に実行する処理
   * @return {Object}           resolveオブジェクト
   */
  static resolve() {
    return {
      /**
       * チーム情報を取得する
       * @param  {[type]} $state    ステートサービス
       * @param  {[type]} $location     ロケーション情報サービス
       * @param  {AppConstant} constant アプリケーション定数
       * @param  {teamModel} teamModel チーム情報モデル
       * @return {Promise}           チーム取得プロミス
       */
      userAuth: function($state, $location, constant,
        teamModel) {
        var name = $location.host().replace(`.${constant.domain}`, '');
        return teamModel.findOne({
          where: {
            name: name
          }
        }).catch((err) => {
          console.error(err);
        });
      }
    };
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
MainController.$inject = [
  '$state',
  '$mdDialog',
  '$mdToast',
  'userModel',
  'teamModel',
  'errorHandler',
];
