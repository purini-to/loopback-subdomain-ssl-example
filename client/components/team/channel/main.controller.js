'use strict';

/**
 * メイン画面のコントローラー
 */
export default class MainController {
   /**
    * ログインユーザー情報やチーム情報を設定
    * @param  {[type]} $state       ステートサービス
    * @param  {[type]} userModel    ユーザー情報
    * @param  {[type]} teamModel    チーム情報
    * @param  {[type]} errorHandler エラーハンドラーサービス
    */
  constructor($state, userModel, teamModel, errorHandler) {
    this.state = $state;
    this.user = userModel;
    this.team = teamModel;
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
       * @param  {userModel} userModel ユーザー情報モデル
       * @param  {teamModel} teamModel チーム情報モデル
       * @return {Promise}           チーム取得プロミス
       */
      userAuth: function($state, userModel, teamModel) {
        return teamModel.findOne({where:{name:'biz4'}}).then((team) => {
          return team;
        }).catch((err) => {console.error(err);});
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
  'userModel',
  'teamModel',
  'errorHandler'
];
