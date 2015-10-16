'use strict';

const DEFAULT = {
  PRIMARY: {
    COLOR: 'blue-grey',
  },
  ACCENT: {
    COLOR: 'teal',
    HUES: {
      'default': 'A400',
    },
  },
  WARN: {
    COLOR: 'pink',
  },
};

/**
 * アプリケーションのマテリアルデザインテーマ設定を行う
 */
export default class AppTheming {
  /**
   * アプリケーションのテーマカラーを設定する
   * @param  {[type]} $mdThemingProvider マテリアルデザイン設定管理
   */
  constructor($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette(DEFAULT.PRIMARY.COLOR)
      .accentPalette(DEFAULT.ACCENT.COLOR, DEFAULT.ACCENT.HUES)
      .warnPalette(DEFAULT.WARN.COLOR);
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} $mdThemingProvider マテリアルデザイン設定管理
   * @return {AppTheming}                マテリアルデザイン設定クラスのインスタンス
   */
  static activate($mdThemingProvider) {
    AppTheming.instance = new AppTheming($mdThemingProvider);
    return AppTheming.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
AppTheming.activate.$inject = ['$mdThemingProvider'];
