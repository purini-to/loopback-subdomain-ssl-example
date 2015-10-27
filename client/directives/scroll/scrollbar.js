'use strict';

require('../../bower_components/perfect-scrollbar/css/perfect-scrollbar.min.css');

/**
 * タイムアウト管理設定
 */
const TIMEOUT = new WeakMap();

/**
 * フォーカスを設定するディレクティブ
 */
export default class Scrollbar {
  constructor($timeout) {
    this.restrict = 'A';
    TIMEOUT.set(this, $timeout);
  }

  link(scope, element, attrs, $timeout) {
    var el = element[0];
    Ps.initialize(el, {
      wheelSpeed: 0.8,
      wheelPropagation: true,
      minScrollbarLength: 20
    });
    if (attrs.scrollbarUpdate) {
      scope.$watch(attrs.scrollbarUpdate, () => {
        TIMEOUT.get(Scrollbar.instance)(() => {
          el.scrollTop = el.scrollHeight;
          Ps.update(el);
        }, 100);
      });
    }
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} $timeout タイムアウト管理設定
   * @return {FocusMe}         フォーカス設定ディレクティブのインスタンス
   */
  static activate($timeout) {
    Scrollbar.instance = new Scrollbar($timeout);
    return Scrollbar.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
Scrollbar.activate.$inject = ['$timeout'];
