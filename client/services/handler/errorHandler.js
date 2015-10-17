'use strict';

/**
 * エラー処理クラス
 * バリデーションエラー等のフラグ設定を行う
 */
export default class ErrorHandler {
  /**
   * ステータスに応じたバリデーション処理を行う関数を作成する
   * @param  {Number} status     ステータスコード
   * @param  {Object|Function} validation バリデーションオブジェクト|バリデーション関数
   * @return {Throw}            エラーオブジェクト
   */
  factoryStatusHandle(status, validation) {
    return function(err) {
      if (err.status === status) {
        if (typeof validation === 'function') return validation(err);
        var codes = err.data.error.details.codes;
        for (var type in codes) {
          if (codes.hasOwnProperty(type)) {
            var kind = codes[type];
            validation[type][kind] = true;
          }
        }
        return err;
      } else {
        console.error(err);
        throw err;
      }
    };
  }

  /**
   * インスタンス生成を行う
   * @return {ErrorHandler}         エラー処理設定クラスのインスタンス
   */
  static activate() {
    ErrorHandler.instance = new ErrorHandler();
    return ErrorHandler.instance;
  }
}
