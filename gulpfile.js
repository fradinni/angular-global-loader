var gulp = require('gulp');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var path = require('path');

// Set the name of the module according to current directory name
var moduleName = path.basename(__dirname);

gulp.task('less', function () {
  return gulp.src('./src/*.less')
    .pipe(less())
    .pipe(gulp.dest('./.tmp/'));
});

gulp.task('minify-css', function() {
  return gulp.src('./.tmp/*.css')
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('template-cache', function () {
  return gulp.src('./src/*.html')
    .pipe(templateCache({
      module: 'fradinni.' + moduleName,
      root: 'fradinni/angular-global-loader/'
    }))
    .pipe(gulp.dest('./.tmp/'));
});

gulp.task('concat', ['less', 'minify-css', 'template-cache'], function() {
  return gulp.src(['./src/*.js', './.tmp/*.js'])
    .pipe(concat('angular-global-loader.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-js', ['concat'], function() {
  return gulp.src('./dist/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['concat']);

gulp.task('dev', ['dist'], function() {
  watch(['./src/*.js', './src/*.less', './src/*.html'], batch(function (events, done) {
      gulp.start('dist', done);
  }));
});

gulp.task('default', ['dev']);
