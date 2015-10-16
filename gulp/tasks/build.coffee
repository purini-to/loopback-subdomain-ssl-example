"use strict"

gulp = require "gulp"
$ = do require "gulp-load-plugins"
webpack = require 'webpack'
WebpackDevServer = require "webpack-dev-server"

settings = require "../settings"
webpackSettings = require "../webpack.settings"
server = require "../../server/config.json"

# src内のファイルを対象に、webpackを通してdistディレクトリにコンパイルします
gulp.task "build:webpack-dev-server", (callback) ->
  myConfig = Object.create webpackSettings
  myConfig.devtool = 'source-map'
  myConfig.debug = true

  serverUrl = if (server.ssl?) then 'https://' else 'http://'
  serverUrl += "#{server.host}:#{server.port}"

  compiler = webpack myConfig
  new WebpackDevServer(compiler, {
    contentBase: "public"
    publicPath: "/build/"
    proxy: {
      "*": {
        target: serverUrl
        secure: false
      }
    }
    stats: { colors: true }
  }).listen(9000, (err, stats) ->
    if err?
      throw new $.util.PluginError "build:webpack-dev-server", err
    callback()
  )

# src内のファイルを対象に、webpackを通してdistディレクトリにコンパイルします
gulp.task "build:webpack", (callback) ->
  myConfig = Object.create webpackSettings
  myConfig.devtool = 'source-map'
  myConfig.debug = true

  webpack myConfig, (err, stats) ->
    if err?
      throw new $.util.PluginError "build:webpack", err
    $.util.log "[build:webpack]", stats.toString({
      colors: true
    })
    callback()

# src内のファイルを対象に、webpackを通してdistディレクトリにコンパイルします
gulp.task "build:webpack:minify", (callback) ->
  webpack = $.webpack.webpack
  myConfig = Object.create webpackSettings
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify("production")
      }
    })
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
    new webpack.optimize.DedupePlugin()
  )

  gulp.src settings.src
  .pipe $.plumber()
  .pipe $.webpack myConfig, null, (err, stats) ->
    if err?
      throw new $.util.PluginError "build:webpack", err
    $.util.log "[build:webpack]", stats.toString({
      colors: true
    })
  .pipe gulp.dest settings.js.dist

# src内のファイルを対象に、distディレクトリにjadeをコンパイルします
gulp.task "build:jade", ->
  gulp.src settings.html.src
  .pipe $.plumber()
  .pipe $.jade()
  .pipe gulp.dest settings.html.dist

gulp.task "build", ["build:webpack-dev-server", "build:jade"]

gulp.task "build:minify", ["build:webpack:minify", "build:jade"]
