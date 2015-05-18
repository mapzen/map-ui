'use strict'

require('dotenv').load()

var gulp = require('gulp')
var jsonminify = require('gulp-jsonminify')
var minifyCSS = require('gulp-minify-css')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var s3 = require('gulp-s3-upload')({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

gulp.task('default', ['css', 'js', 'images', 'json'])

gulp.task('css', function () {
  return gulp.src('components/**/*.css')
    .pipe(minifyCSS({ keepSpecialComments: 0 }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('dist/components/'))
})

gulp.task('js', function () {
  return gulp.src('components/**/*.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist/components/'))
})

gulp.task('json', function () {
  return gulp.src('components/**/*.json')
    .pipe(jsonminify())
    .pipe(gulp.dest('dist/components'))
})

gulp.task('images', function () {
  return gulp.src('components/**/*.png')
    .pipe(gulp.dest('dist/components/'))
})

gulp.task('publish', function () {
  return gulp.src('dist/**')
    .pipe(s3({
      Bucket: process.env.MAPZEN_ASSET_BUCKET,
      ACL: 'public-read',
      keyTransform: function (relative_filename) {
        return 'ui/' + relative_filename
      }
    }))
})
