'use strict';

/**
 * アプリ準備完了時の実行クラス
 */
export default class AppRun {
  /**
   * モデルの初期値登録とログイン失敗時のハンドラーを作成
   * @param  {[type]} $rootScope   最上位のスコープ
   * @param  {[type]} $state       ui-routerオブジェクト
   * @param  {[type]} UserModel    ユーザー情報モデル
   * @param  {[type]} errorHandler エラーハンドラー作成オブジェクト
   */
  constructor($rootScope, $state, userModel, errorHandler) {
    $rootScope.$on('$stateChangeStart', (e, toState, toParams,
      fromState, fromParams) => {
      // authプロパティが存在しなければチェックせずに終了
      if (!toState.auth) return;
      // ログインしていなければ
      if (!userModel.isLogged()) {
        var info = userModel.getStorageToken();
        //遷移を止める
        e.preventDefault();
        // クッキーにアクセストークンがなければログインページに遷移
        if (!info || !info.token) return $state.go('login');
        // クッキーにアクセストークンがある場合はユーザー情報を取得する
        userModel.findAccessToken(info.token).then((token) => {
          return userModel.findById();
        }).then((result) => {
          $state.go(toState.name);
        }).catch((err) => {
          $state.go('login');
        });
      }
    });
  }
  /**
   * インスタンス生成を行う
   * @param  {[type]} $rootScope   最上位のスコープ
   * @param  {[type]} $state       ui-routerオブジェクト
   * @param  {[type]} $localStorage   ローカルストレージサービス
   * @param  {[type]} $sessionStorage セッションストレージサービス
   * @param  {[type]} UserModel    ユーザー情報モデル
   * @param  {[type]} errorHandler エラーハンドラー作成オブジェクト
   */
  static activate($rootScope, $state, userModel, errorHandler) {
    AppRun.instance = new AppRun($rootScope, $state, userModel, errorHandler);
    return AppRun.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
AppRun.activate.$inject = [
  '$rootScope',
  '$state',
  'userModel',
  'errorHandler'
];
