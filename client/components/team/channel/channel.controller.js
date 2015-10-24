'use strict';

/**
 * チャンネル画面のコントローラー
 */
export default class ChannelController {
  /**
   * 各サービスをインスタンス変数に設定
   * @param  {[type]} $state       ステートサービス
   * @param  {[type]} $mdSidenav   サイドナビサービス
   * @param  {[type]} UserModel    ユーザー情報モデル
   * @param  {[type]} teamModel    チーム情報
   * @param  {[type]} errorHandler エラーハンドラーサービス
   */
  constructor($state, $mdSidenav, UserModel, teamModel, errorHandler) {
    this.state = $state;
    this.sideNav = $mdSidenav;
    this.user = UserModel;
    this.errorHandler = errorHandler;
    this.isOpenSearchbox = false;
  }

  /**
   * サイドメニューをトグル表示切替する
   */
  toggleSideNavOpen() {
    this.sideNav('sideNav').toggle();
  }

  /**
   * 検索入力ボックスをトグル表示切替する
   */
  toggleSearchbox() {
    this.isOpenSearchbox = !this.isOpenSearchbox;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
ChannelController.$inject = [
  '$state',
  '$mdSidenav',
  'userModel',
  'errorHandler'
];
