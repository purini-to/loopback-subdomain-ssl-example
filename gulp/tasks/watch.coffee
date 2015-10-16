"use strict"

gulp = require "gulp"
$ = do require "gulp-load-plugins"

settings = require "../settings"

# src内のファイルを監視し、変更があった場合は反映する
gulp.task "watch", ->
  # $.watch settings.watch.webpack, ->
  #   gulp.start "build:webpack"

  $.watch settings.watch.jade, ->
    gulp.start "build:jade"

  $.watch settings.watch.assets, ->
    gulp.start "copy"
