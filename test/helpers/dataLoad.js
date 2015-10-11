// テンプレートキーの値
var TEMPLATE_KEY = '${template}';

/**
 * jasmineテストオブジェクトの説明再帰的に検索し、配列として取得する
 * @param  {Object} spec   jasmineテストオブジェクト
 * @param  {Array} result 戻り値の元となる初期値
 * @return {Array}        説明の配列（親順）
 */
var deepSearchDiscription = function (spec, result) {
  if (spec.suite) {
    result = deepSearchDiscription(spec.suite, result);
  } else if (spec.parentSuite) {
    result = deepSearchDiscription(spec.parentSuite, result);
  }
  if (spec.description) {
    result.push(spec.description);
  }
  return result;
};

/**
 * Jsonファイルを指定して、読み込み関数を取得するファクトリ関数
 * @param  {Json} json Jsonオブジェクト
 * @return {Function}      テストパターン毎にデータを取得する関数
 */
module.exports = function loadJson(json) {
  // テンプレートだけハッシュとして保持しておく
  var template = json.template;
  delete json.template;
  return function (spec, type) {
    var result = deepSearchDiscription(spec, []);
    // 説明を元にJsonデータを検索する
    var data = result.reduce(function (p, c) {
      if (!p[c]) console.error('Not Found Json Data :', result);
      return p[c];
    }, json);
    // 種別があったら種別の値を取得
    if (data[type]) {
      data = data[type];
    }
    // 値がテンプレートの場合は、キャッシュから取得
    if (data[TEMPLATE_KEY]) {
      data = template[data[TEMPLATE_KEY]];
    }

    return data;
  };
};
