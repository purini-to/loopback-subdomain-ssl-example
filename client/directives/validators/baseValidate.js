'use strict';

/**
 * 共通バリデーションクラス
 */
export default class BaseValidate {
  /**
   * 必須属性として'ngModel'を設定
   */
  constructor() {
    this.require = 'ngModel';
  }

  /**
   * バリデーションエラー時に、値が変更になったらエラーを解除する
   * @param  {[type]} scope       スコープ
   * @param  {[type]} attrs       属性
   * @param  {[type]} ctrl        コントローラー
   * @param  {[type]} name        名前
   * @param  {[type]} attrValue   format属性に指定された値
   * @param  {[type]} viewValue   変更された値
   * @return {String}             変更されていた場合は、変更された値
   */
  link(name, scope, elem, attrs, ctrl) {
    var validValue = null;
    // 値に入力があれば実行される関数を登録
    ctrl.$parsers.push((viewValue) => {
      if (!attrs[name]) return viewValue;

      var val = scope.$eval(attrs[name]);
      if (!val) return viewValue;

      if (validValue !== viewValue) {
        ctrl.$setValidity(name, true);
        var objKeys = attrs[name].split('.');
        var i = 0;
        objKeys.reduce(function(p, c) {
          if (i === objKeys.length - 1) {
            p[c] = false;
          }
          i++;
          return p[c];
        }, scope);
        return viewValue;
      }
    });
    // 値の変更を監視する
    scope.$watch(attrs[name], (newValue) => {
      ctrl.$setValidity(name, !newValue);
      if (newValue) {
        validValue = ctrl.$modelValue;
      }
    });
  }
}
