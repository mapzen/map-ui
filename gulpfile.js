'use strict'

require('dotenv').load()

var browserify = require('browserify')
var buffer = require('vinyl-buffer')
var gulp = require('gulp')
var gutil = require('gulp-util')
var jsonminify = require('gulp-jsonminify')
var minifyCSS = require('gulp-minify-css')
var rename = require('gulp-rename')
var source = require('vinyl-source-stream')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var s3 = require('gulp-s3-upload')({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

gulp.task('default', ['css', 'js-bug', 'js', 'images', 'json'])

gulp.task('css', function () {
  return gulp.src(['src/**/*.css', '!src/**/vendor/**'])
    .pipe(minifyCSS({ keepSpecialComments: 0 }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('dist/'))
})

gulp.task('js-bug', function () {
  return gulp.src(['src/components/bug/bug.js'])
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist/components/bug/'))
})

gulp.task('js', function () {
  var b = browserify({
    entries: 'src/main.js',
    debug: true
  })

  return b.bundle()
    .pipe(source('src/main.js'))
    .pipe(buffer())
    // Copy of unminified JS
    .pipe(rename({
      dirname: '',
      basename: 'mapzen-ui',
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(sourcemaps.init({ loadMaps: true }))
      // Add transformation tasks to the pipeline here.
      .pipe(uglify())
      .pipe(rename({
        dirname: '',
        basename: 'mapzen-ui',
        extname: '.min.js'
      }))
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/'))
})

gulp.task('json', function () {
  return gulp.src('src/**/*.json')
    .pipe(jsonminify())
    .pipe(gulp.dest('dist/'))
})

gulp.task('images', function () {
  return gulp.src('src/**/*.png')
    .pipe(gulp.dest('dist/'))
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
