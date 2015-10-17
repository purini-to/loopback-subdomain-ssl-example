'use strict';

import BaseValidate from './baseValidate';

/**
 * Loopbackのユニークバリデーションクラス
 */
export default class Uniqueness extends BaseValidate {
  /**
   * uniqueness属性に指定された値が真の場合は、フォーマットエラーとする
   * @param  {[type]} scope スコープ
   * @param  {[type]} elem  エレメント
   * @param  {[type]} attrs 属性
   * @param  {[type]} ctrl  コントローラー
   */
  link(scope, elem, attrs, ctrl) {
    super.link('uniqueness', scope, elem, attrs, ctrl);
  }

  /**
   * インスタンス生成を行う
   * @return {Format}         一意設定ディレクティブのインスタンス
   */
  static activate() {
    Uniqueness.instance = new Uniqueness();
    return Uniqueness.instance;
  }
}
