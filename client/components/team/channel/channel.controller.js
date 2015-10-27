'use strict';

/**
 * チャンネル画面のコントローラー
 */
export default class ChannelController {
  /**
   * 各サービスをインスタンス変数に設定
   * @param  {[type]} $state       ステートサービス
   * @param  {[type]} $mdSidenav   サイドナビサービス
   * @param  {[type]} $stateParams ステートパラメータサービス
   * @param  {[type]} $timeout     タイムアウトサービス
   * @param  {[type]} userModel    ユーザー情報モデル
   * @param  {[type]} teamModel    チーム情報モデル
   * @param  {[type]} channelModel チャンネル情報モデル
   * @param  {[type]} errorHandler エラーハンドラーサービス
   */
  constructor($state, $mdSidenav, $stateParams, $timeout, userModel, teamModel,
    channelModel, errorHandler) {
    this.state = $state;
    this.sideNav = $mdSidenav;
    this.user = userModel;
    this.team = teamModel;
    this.channel = channelModel;
    this.errorHandler = errorHandler;
    this.isOpenSearchbox = false;
    this.isInputMessageFocus = false;
    this.processing = false;
    this.scrollUpdate = false;
    channelModel.hookAddMessage((data) => {
      this.scrollUpdate = 'goBottom';
    });
    var channelName = $stateParams.channelName;
    var channel = teamModel.team.channels.find((item) => {
      return item.name === channelName;
    });
    channelModel.findMessages(channel);
    this.clearMessage();
  }

  /**
   * サイドメニューをトグル表示切替する
   */
  toggleSideNavOpen() {
    this.sideNav('sideNav').toggle();
  }

  /**
   * メッセージを送信する
   */
  send() {
    if (this.processing) return;
    this.processing = true;
    var data = this.message;
    this.channel.sendMessage(data).then((message) => {
      this.clearMessage();
    }).finally((result) => this.processing = false);
  }

  /**
   * メッセージを初期化します
   */
  clearMessage() {
    this.message = {
      text: '',
      contentType: 0,
      contentMetaData: {},
    };
  }

  /**
   * 現在のメッセージが前メッセージの続きか判定します
   * @param  {Integer}  index 現在のメッセージのインデックス
   * @return {Boolean}  true:続き  |  false:続きではない
   */
  isContinuation(index) {
    if(index === 0) return false;
    var pre = index - 1;
    var target = this.channel.channel.messages[index];
    var preTarget = this.channel.channel.messages[pre];
    var l = target.userId;
    var lp = preTarget.userId;
    var dateL = new Date(target.createdAt).getTime();
    var dateLp = new Date(preTarget.createdAt).getTime();
    var diff = (dateL - dateLp) / (1000 * 60);
    return l === lp && diff < 5;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
ChannelController.$inject = [
  '$state',
  '$mdSidenav',
  '$stateParams',
  '$timeout',
  'userModel',
  'teamModel',
  'channelModel',
  'errorHandler'
];
