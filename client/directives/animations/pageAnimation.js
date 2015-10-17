'use strict';

/**
 * ページ遷移時のアニメーションを設定するディレクティブ
 */
export default class PageAnimation {
  /**
   * 属性指定のみ有効
   */
  constructor() {
    this.restrict = 'A';
  }

  /**
   * スコープに名前を登録する
   * @param  {[type]} scope   スコープ
   * @param  {[type]} element エレメント
   */
  link(scope, element) {
    let listener = (event, toState) => {
      let name = toState.name;
      scope.name = name;
    };

    scope.$on('$stateChangeSuccess', listener);
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} $timeout タイムアウト管理設定
   * @return {PageAnimation}   ページ遷移アニメーション設定ディレクティブのインスタンス
   */
  static activate() {
    PageAnimation.instance = new PageAnimation();
    return PageAnimation.instance;
  }
}
