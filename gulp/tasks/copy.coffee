"use strict"

gulp = require "gulp"
$ = do require "gulp-load-plugins"

settings = require "../settings"

# src内の必要なファイルをコピーする
gulp.task "copy", ->
  gulp.src settings.assets.src
  .pipe $.plumber()
  .pipe gulp.dest settings.assets.dist
