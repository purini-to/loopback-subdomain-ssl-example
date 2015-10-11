var requireDir = require('require-dir');

/**
 * 再帰的に関数が見つかるまで探索を行う
 * 関数が見つかったら関数の実行を行う
 * @param  {object} importObj 探索対象
 * @param  {object} app       loopbackアプリケーション
 */
var deepImport = function (importObj, app) {
  Object.keys(importObj).forEach(function (key) {
    if (typeof importObj[key] !== 'function') {
      deepImport(importObj[key], app);
    } else {
      importObj[key](app);
    }
  });
};

module.exports = function (app) {
  var imports = requireDir('./role', {recurse: true});
  deepImport(imports, app);
};
