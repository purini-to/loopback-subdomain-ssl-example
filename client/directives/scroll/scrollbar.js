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
    var init = false;
    var chache = 0;
    if (attrs.scrollbarInit) init = scope.$eval(attrs.scrollbarInit);
    if (attrs.scrollbarUpdate) {
      scope.$watch(attrs.scrollbarUpdate, () => {
        TIMEOUT.get(Scrollbar.instance)(() => {
          var scrollArea = el.clientHeight + el.scrollTop;
          var isScrollBeforeBottom = chache > 0;
          if (attrs.scrollbarStopReachStart) {
            var isStop = scope.$eval(attrs.scrollbarStopReachStart);
            isScrollBeforeBottom = isScrollBeforeBottom && !isStop;
          }
          if (init || el.scrollHeight - scrollArea < 200) {
            el.scrollTop = el.scrollHeight;
            Ps.update(el);
            if (init) init = false;
          } else if (isScrollBeforeBottom) {
            el.scrollTop = el.scrollHeight - chache;
            Ps.update(el);
          }
          chache = 0;
        });
      });
    }
    if (attrs.scrollbarReachStart) {
      el.addEventListener('ps-y-reach-start', function() {
        if (chache === 0) {
          chache = el.scrollHeight;
          scope.$eval(attrs.scrollbarReachStart);
        }
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
