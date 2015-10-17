'use strict';

/**
 * アカウント作成成功時のメッセージ
 * @type {String}
 */
const CREATE_SUCCESS_MESSAGE = 'アカウントを作成しました';

/**
 * アカウント作成画面のコントローラー
 */
export default class NewAccountController {
  /**
   * モデルの初期値設定と
   * @param  {[type]} $state       ui-routerオブジェクト
   * @param  {[type]} $mdToast     トースト表示サービス
   * @param  {[type]} $document    htmlドキュメントサービス
   * @param  {[type]} userModel    ユーザーモデル
   * @param  {[type]} errorHandler エラーハンドラー作成オブジェクト
   */
  constructor($state, $mdToast, $document, userModel, errorHandler) {
    this.state = $state;
    this.mdToast = $mdToast;
    this.document = $document;
    this.userModel = userModel;
    this.account = {
      username: '',
      email: '',
      password: ''
    };
    this.passwordConfirm = '';
    this.validate = {
      username: {
        uniqueness: false
      },
      email: {
        format: true,
        uniqueness: true,
      }
    };
    /**
     * アカウント作成失敗処理
     * 重複ユーザー名、またはメールアドレスの場合はフラグを設定
     * メールアドレスが不正な形式の場合はフラグを設定
     */
    this.saveFailedHandler = errorHandler
      .factoryStatusHandle(422, this.validate);
    /**
     * アカウント作成成功時にトーストを表示する
     */
    this.showSaveSuccessToast = () => {
      $mdToast.show(
        $mdToast.simple()
        .content(CREATE_SUCCESS_MESSAGE)
        .parent($document[0].querySelector('.view-container'))
        .position('bottom left')
        .hideDelay(3000)
      );
    };
  }

  /**
   * アカウント作成処理
   * 成功時はトーストを表示し、ログイン画面へ遷移する
   * 失敗時はアカウント作成失敗処理を呼び出す
   */
  save() {
    this.userModel.create(this.account).then((user) => {
      this.showSaveSuccessToast();
      this.state.go('login');
      return user;
    }).catch(this.saveFailedHandler);
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
NewAccountController.$inject = [
  '$state',
  '$mdToast',
  '$document',
  'userModel',
  'errorHandler'
];
