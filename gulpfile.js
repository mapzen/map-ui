'use strict';

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jsonminify = require('gulp-jsonminify');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var s3 = require('gulp-s3-upload')(); // load access keys from ~/.aws/credentials

gulp.task('default', ['css', 'js-bug', 'js', 'images', 'json']);

gulp.task('css', function () {
  return gulp.src(['src/**/*.css', '!src/**/vendor/**'])
    .pipe(cssnano())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('dist/ui/'));
});

gulp.task('js-bug', function () {
  return gulp.src(['src/components/bug/bug.js'])
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist/ui/components/bug/'));
});

gulp.task('js', function () {
  var b = browserify({
    entries: 'src/main.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('src/main.js'))
    .pipe(buffer())
    // Copy of unminified JS
    .pipe(rename({
      dirname: '',
      basename: 'mapzen-ui',
    }))
    .pipe(gulp.dest('dist/ui/'))
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
    .pipe(gulp.dest('dist/ui/'));
});

gulp.task('json', function () {
  return gulp.src('src/**/*.json')
    .pipe(jsonminify())
    .pipe(gulp.dest('dist/ui/'));
});

gulp.task('images', function () {
  return gulp.src('src/**/*.png')
    .pipe(gulp.dest('dist/ui/'));
});

gulp.task('publish', function () {
  var s3bucket;
  if (gutil.env.target === "prod") {
    s3bucket = process.env.MAPZEN_PROD_BUCKET;
  } else {
    s3bucket = process.env.MAPZEN_DEV_BUCKET;
  }
  return gulp.src('dist/**')
    .pipe(s3({
      Bucket: s3bucket,
      ACL: 'public-read',
      keyTransform: function (relative_filename) {
        return 'common/' + relative_filename;
      }
    }));
});
