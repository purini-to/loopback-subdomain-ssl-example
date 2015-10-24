'use strict';

/**
 * アプリ準備完了時の実行クラス
 */
export default class TeamAppRun {
  /**
   * モデルの初期値登録とログイン失敗時のハンドラーを作成
   * @param  {[type]} $rootScope    最上位のスコープ
   * @param  {[type]} $state        ui-routerオブジェクト
   * @param  {[type]} $location     ロケーション情報サービス
   * @param  {AppConstant} constant アプリケーション定数
   * @param  {[User]} Restangular   REST APIサービス
   * @param  {[type]} UserModel     ユーザー情報モデル
   * @param  {[type]} errorHandler  エラーハンドラー作成オブジェクト
   */
  constructor($rootScope, $state, $location, constant,
      Restangular, userModel, errorHandler) {
      var transRootDomain = function () {
        var url = `${$location.protocol()}://${constant.domain}`;
        location.href = `${url}:${$location.port()}`;
      };
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
          if (!info || !info.token) return transRootDomain();
          Restangular.setDefaultRequestParams({
            'access_token': info.token
          });
          // クッキーにアクセストークンがある場合はユーザー情報を取得する
          userModel.findAccessToken(info.token).then((token) => {
            return userModel.findById();
          }).then((result) => {
            $state.go(toState.name, toParams);
          }).catch((err) => {
            transRootDomain();
          });
        }
      });
    }
    /**
     * インスタンス生成を行う
     * @param  {[type]} $rootScope   最上位のスコープ
     * @param  {[type]} $state       ui-routerオブジェクト
     * @param  {[type]} $location     ロケーション情報サービス
     * @param  {AppConstant} constant アプリケーション定数
     * @param  {[User]} Restangular REST APIサービス
     * @param  {[type]} UserModel    ユーザー情報モデル
     * @param  {[type]} errorHandler エラーハンドラー作成オブジェクト
     */
  static activate($rootScope, $state, $location, constant, Restangular,
    userModel, errorHandler) {
    TeamAppRun.instance = new TeamAppRun($rootScope, $state,
      $location, constant, Restangular, userModel, errorHandler);
    return TeamAppRun.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
TeamAppRun.activate.$inject = [
  '$rootScope',
  '$state',
  '$location',
  'constant',
  'Restangular',
  'userModel',
  'errorHandler'
];
