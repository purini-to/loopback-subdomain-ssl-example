'use strict';

/**
 * API設定を行う
 */
export default class AppApi {
  /**
   * APIのベースURLを設定
   * @param  {[type]} RestangularProvider REST APIサービス管理設定
   */
  constructor(RestangularProvider) {
    RestangularProvider.setBaseUrl('/api/');
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} RestangularProvider REST APIサービス管理設定
   * @return {AppApi} アプリケーション設定クラスのインスタンス
   */
  static activate(RestangularProvider) {
    AppApi.instance = new AppApi(RestangularProvider);
    return AppApi.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
AppApi.activate.$inject = ['RestangularProvider'];
