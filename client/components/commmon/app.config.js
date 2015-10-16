'use strict';

/**
 * アプリケーション設定を行う
 */
export default class AppConfig {
  /**
   * HTML5のヒストリモードを使用する
   * @param  {[type]} $locationProvider ロケーション管理設定
   */
  constructor($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} $locationProvider ロケーション管理設定
   * @return {AppConfig}                   アプリケーション設定クラスのインスタンス
   */
  static activate($locationProvider) {
    AppConfig.instance = new AppConfig($locationProvider);
    return AppConfig.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
AppConfig.activate.$inject = ['$locationProvider'];
