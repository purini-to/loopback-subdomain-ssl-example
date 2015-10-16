"use strict"

gulp = require 'gulp'
requireDir = require 'require-dir'
requireDir './gulp/tasks', {recurse: true}

gulp.task 'default', ['build', 'copy', 'watch']
