'use strict';

require('../../bower_components/perfect-scrollbar/css/perfect-scrollbar.min.css');

/**
 * フォーカスを設定するディレクティブ
 */
export default class Scrollbar {
  constructor() {
    this.restrict = 'A';
  }

  link(scope, element, attrs) {
    Ps.initialize(element[0], {
      wheelSpeed: 0.8,
      wheelPropagation: true,
      minScrollbarLength: 20
    });
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} $timeout タイムアウト管理設定
   * @return {FocusMe}         フォーカス設定ディレクティブのインスタンス
   */
  static activate() {
    Scrollbar.instance = new Scrollbar();
    return Scrollbar.instance;
  }
}
