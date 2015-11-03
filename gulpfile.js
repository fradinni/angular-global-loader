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
  return gulp.src('./*.less')
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
  return gulp.src('./*.html')
    .pipe(templateCache({
      module: 'fradinni.' + moduleName
    }))
    .pipe(gulp.dest('./.tmp/'));
});

gulp.task('concat', ['less', 'minify-css', 'template-cache'], function() {
  return gulp.src(['./*.js', '!./gulpfile.js', './.tmp/*.js'])
    .pipe(concat('angular-global-loader.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-js', ['concat'], function() {
  return gulp.src('./dist/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['minify-js']);

gulp.task('dev', ['dist'], function() {
  watch(['./*.js', '!gulpfile.js', './*.less', './*.html'], batch(function (events, done) {
      gulp.start('dist', done);
  }));
});

gulp.task('default', ['dev']);
