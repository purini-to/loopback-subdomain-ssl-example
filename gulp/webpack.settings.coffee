"use strict"

webpack = require("gulp-webpack").webpack
BowerWebpackPlugin = require "bower-webpack-plugin"
path = require "path"

settings = require "./settings"

module.exports = {
  cache: true
  # entryポイントを指定、複数指定できます
  entry:
    app: "#{settings.src}/app.js"

  # 出力先の設定
  output:
    path: path.join(__dirname, "../#{settings.js.dist}")
    publicPath: "/build/"
    filename: "[name].js"
    chunkFilename: "[chunkhash].js"

  # ファイル名の解決を設定
  resolve:
    root: [path.join(__dirname, "bower_components")]
    moduleDirectories: ["bower_components"]
    extensions: ["", ".js", ".coffee", ".webpack.js", ".web.js"]

  # CoffeeScriptをJsにコンパイルする
  # Cssはベンダープレフィックスを付与する
  # StylusはCssにコンパイルしてベンダープレフィックスを付与する
  # JadeはHtmlにコンパイルする
  # Vueコンポーネントは各langに合わせてコンパイルする
  # 他にもフォントやSVGを読み込む
  module:
    loaders: [
      { test: /\.js$/, loader: "ng-annotate!babel?experimental&optional=selfContained" }
      { test: /\.css$/, loader: "style!css!autoprefixer-loader?browsers=last 2 version" }
      { test: /\.styl$/, loader: "style!css!autoprefixer-loader?browsers=last 2 version!stylus" }
      { test: /\.jade$/, loader: "jade" }
      { test: /\.woff(\d+)?$/, loader: 'url?prefix=font/&limit=5000&mimetype=application/font-woff' }
      { test: /\.ttf$/, loader: 'file?prefix=font/' }
      { test: /\.eot$/, loader: 'file?prefix=font/' }
      { test: /\.svg$/, loader: 'file?prefix=font/' }
    ]

  # webpack用の各プラグイン
  plugins: [
    # bower.jsonにあるパッケージをrequire出来るように
    new BowerWebpackPlugin()
  ]
}
