'use strict';

/**
 * フォーカスを設定するディレクティブ
 */
export default class NgEnter {
  /**
   * 属性指定のみ有効
   */
  constructor() {
    this.restrict = 'A';
  }

  /**
   * Enterキーが押下された際に、イベント処理を実行する
   * Shiftが押下されている場合は、無効となる
   * @param  {[type]} scope   スコープ
   * @param  {[type]} element エレメント
   * @param  {[type]} attrs   属性
   */
  link(scope, element, attrs) {
    element.bind('keydown keypress', (event) => {
      if (event.which === 13 && !event.shiftKey) {
        scope.$apply(() => {
          var e = {
            'event': event
          };
          scope.$eval(attrs.ngEnter, e);
        });
        event.preventDefault();
      }
    });
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} $timeout タイムアウト管理設定
   * @return {FocusMe}         フォーカス設定ディレクティブのインスタンス
   */
  static activate() {
    NgEnter.instance = new NgEnter();
    return NgEnter.instance;
  }
}
