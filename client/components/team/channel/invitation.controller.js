'use strict';

const CREATE_SUCCESS_MESSAGE = '招待を送信しました';

/**
 * 招待送信画面のコントローラー
 */
export default class InvitationController {
  /**
   * 招待対象の入力値の初期化を行う
   * @param  {[type]} $mdDialog    ダイアログサービス
   * @param  {[type]} $mdToast     トーストサービス
   * @param  {[type]} $document    htmlドキュメントサービス
   * @param  {[type]} teamModel    チーム情報
   * @param  {[type]} invitationModel    招待情報
   * @param  {[type]} errorHandler エラーハンドラーサービス
   */
  constructor($mdDialog, $mdToast, $document, teamModel,
  invitationModel, errorHandler) {
    this.data = {
      email: '',
      message: '',
      teamId: teamModel.team.id
    };
    this.toast = $mdToast;
    this.document = $document;
    this.dialog = $mdDialog;
    this.team = teamModel;
    this.invitation = invitationModel;
    this.processing = false;
  }

  /**
   * 招待を送信します
   * @return {Promise} 招待送信のプロミス
   */
  send() {
    if (this.processing) return;
    this.processing = true;
    var data = this.data;
    this.invitation.send(data).then((result) => {
      this.dialog.hide(result);
      this.toast.show(
        this.toast.simple()
        .content(CREATE_SUCCESS_MESSAGE)
        .parent(this.document[0].querySelector('.view-container'))
        .position('bottom left')
        .hideDelay(3000)
      );
      return result;
    }).catch((err) => {
      console.error(err);
    }).finally((result) => this.processing = false);
  }

  /**
   * ダイアログを閉じます
   */
  cancel() {
    this.dialog.cancel();
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
InvitationController.$inject = [
  '$mdDialog',
  '$mdToast',
  '$document',
  'teamModel',
  'invitationModel',
  'errorHandler',
];
