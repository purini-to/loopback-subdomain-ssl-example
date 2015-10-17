'use strict';

import BaseValidate from './baseValidate';

/**
 * Loopbackのフォーマットバリデーションクラス
 */
export default class Format extends BaseValidate {
  /**
   * format属性に指定された値が真の場合は、フォーマットエラーとする
   * @param  {[type]} scope スコープ
   * @param  {[type]} elem  エレメント
   * @param  {[type]} attrs 属性
   * @param  {[type]} ctrl  コントローラー
   */
  link(scope, elem, attrs, ctrl) {
    super.link('format', scope, elem, attrs, ctrl);
  }

  /**
   * インスタンス生成を行う
   * @return {Format}         フォーマット設定ディレクティブのインスタンス
   */
  static activate() {
    Format.instance = new Format();
    return Format.instance;
  }
}
