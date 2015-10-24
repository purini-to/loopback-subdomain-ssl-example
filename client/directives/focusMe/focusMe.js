'use strict';

/**
 * タイムアウト管理設定
 */
const TIMEOUT = new WeakMap();

/**
 * フォーカスを設定するディレクティブ
 */
export default class FocusMe {
  /**
   * 属性指定のみ有効
   * フォーカス設定関数を作成
   * @param  {[type]} $timeout タイムアウト管理設定
   */
  constructor($timeout) {
    this.restrict = 'A';
    this.scope = {focusMe: '='};
    TIMEOUT.set(this, function(element) {
      $timeout(() => element.focus(), 400);
    });
  }

  /**
   * 属性の値を監視し、真の場合はフォーカスを設定する
   * @param  {[type]} scope   スコープ
   * @param  {[type]} element エレメント
   * @param  {[type]} attrs   属性
   */
  link(scope, element, attrs) {
    scope.$watch('focusMe', (value) => {
      if (value === true) TIMEOUT.get(FocusMe.instance)(element[0]);
    });
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} $timeout タイムアウト管理設定
   * @return {FocusMe}         フォーカス設定ディレクティブのインスタンス
   */
  static activate($timeout) {
    FocusMe.instance = new FocusMe($timeout);
    return FocusMe.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
FocusMe.activate.$inject = ['$timeout'];
