'use strict';

const CREATE_SUCCESS_MESSAGE = 'チャンネルを作成しました';

/**
 * チャンネル作成画面のコントローラー
 */
export default class NewChannelController {
  /**
   * チャンネル入力値の初期化を行う
   * @param  {[type]} $mdDialog    ダイアログサービス
   * @param  {[type]} $mdToast     トーストサービス
   * @param  {[type]} $document    htmlドキュメントサービス
   * @param  {[type]} teamModel    チーム情報
   * @param  {[type]} errorHandler エラーハンドラーサービス
   */
  constructor($mdDialog, $mdToast, $document, teamModel, errorHandler) {
    this.channel = {
      name: '',
      description: ''
    };
    this.toast = $mdToast;
    this.document = $document;
    this.dialog = $mdDialog;
    this.team = teamModel;
  }

  /**
   * チャンネルを作成します
   * @return {Promise} チャンネル保存のプロミス
   */
  save() {
    var data = this.channel;
    this.team.addChannel(data).then((channel) => {
      this.dialog.hide(channel);
      this.toast.show(
        this.toast.simple()
        .content(CREATE_SUCCESS_MESSAGE)
        .parent(this.document[0].querySelector('.view-container'))
        .position('bottom left')
        .hideDelay(3000)
      );
      return channel;
    }).catch((err) => {
      console.error(err);
    });
  }

  /**
   * チャンネル作成ダイアログを閉じます
   */
  cancel() {
    this.dialog.cancel();
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
NewChannelController.$inject = [
  '$mdDialog',
  '$mdToast',
  '$document',
  'teamModel',
  'errorHandler',
];
