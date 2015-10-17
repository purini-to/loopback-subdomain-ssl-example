'use strict';

/**
 * アプリケーション独自のバリデーションディレクティブ
 */
export default class AppValidators {
  /**
   * 属性指定の有効
   * 必須属性として'ngModel'を設定
   * appValidatorsに指定されたものはスコープを共有する
   */
  constructor() {
    this.restrict = 'A';
    this.require = 'ngModel';
    this.scope = {
      appValidators: '='
    };
  }

  /**
   * バリデーションチェックを行う
   * @param  {[type]} scope   スコープ
   * @param  {[type]} element エレメント
   * @param  {[type]} attrs   属性
   * @param  {[type]} ctrl    コントローラー
   */
  link(scope, element, attrs, ctrl) {
    var validators = scope.appValidators || {};
    angular.forEach(validators, function(val, key) {
      ctrl.$validators[key] = val;
    });
  }

  /**
   * インスタンス生成を行う
   * @return {Format}         バリデーションディレクティブのインスタンス
   */
  static activate() {
    AppValidators.instance = new AppValidators();
    return AppValidators.instance;
  }
}
