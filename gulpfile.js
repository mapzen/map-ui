'use strict';

var fs = require('fs');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var cssimport = require('gulp-cssimport');
var cssnano = require('gulp-cssnano');
var cssBase64 = require('gulp-css-base64');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var mustache = require('gulp-mustache');
var s3 = require('gulp-s3-upload')(); // load access keys from ~/.aws/credentials

gulp.task('default', ['js']);

gulp.task('watch', function() {
  gulp.watch('src/**/*', ['default']);
});

gulp.task('css', ['copy-images'], function () {
  return gulp.src('src/main.css')
    .pipe(cssimport())
    .pipe(cssBase64({
      extensionsAllowed: ['.png']
    }))
    .pipe(cssnano({
      zindex: false // Do not allow postcss to rebase z-index values
    }))
    .pipe(rename({
      basename: 'mapzen-ui',
      extname: '.min.css'
    }))
    .pipe(gulp.dest('dist/ui/'));
});

gulp.task('js', ['css'], function () {
  var b = browserify({
    entries: 'src/main.js',
    debug: true
  });

  var cssText = fs.readFileSync('dist/ui/mapzen-ui.min.css');
  // The resulting minified CSS has mixed quotation marks.
  // Since the js we're embedding in uses single quotes, we
  // must escape all instances of single quotes here
  cssText = cssText.toString().replace(/'/g, "\\'");

  return b
    // Global transform allows shimming of dependencies as well
    .transform({ global: true }, 'browserify-shim')
    .bundle()
    .pipe(source('src/main.js'))
    .pipe(buffer())
    // Copy of unminified JS
    .pipe(mustache({
      cssText: cssText
    }))
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

// Copy leaflet geocoder plugin images to one place so that the image-inliner
// can find everything easily.
gulp.task('copy-images', function () {
  return gulp.src('node_modules/leaflet-geocoder-mapzen/dist/images/*.png')
    .pipe(gulp.dest('src/images/'));
});

gulp.task('publish', function () {
  var s3bucket;
  if (gutil.env.target === "prod") {
    s3bucket = process.env.MAPZEN_PROD_BUCKET;
  } else {
    s3bucket = process.env.MAPZEN_DEV_BUCKET;
  }
  return gulp.src('dist/ui/**')
    .pipe(s3({
      Bucket: s3bucket,
      ACL: 'public-read',
      keyTransform: function (relative_filename) {
        return 'common/ui/' + relative_filename;
      }
    }));
});
