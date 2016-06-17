var gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  header = require('gulp-header'),
  rename = require('gulp-rename'),
  browserify = require('gulp-browserify'),
  del = require('del'),
  fs = require("fs"),
  eslint = require('gulp-eslint'),
  browserSync = require('browser-sync').create();

var pkg = require('./package.json'),
    paths = {
      srcEntryPoint: "./src/JsonQuery.js",
      scripts: './src/**/*.js',
      spec: './spec',
      dist: './dist',
      outfile: 'json_query',
      headerTemplate: './header-template.txt'
    };

var LICENSE_TEMPLATE = fs.readFileSync('./header-template.txt', 'utf8');

gulp.task('clean', function(cb) {
  del([paths.dist], cb);
});

gulp.task("minify", ['scripts'], function(){
  var outfile = paths.dist + '/' + paths.outfile + '.js'

  return gulp.src(outfile)
    .pipe(rename(paths.outfile + '.min.js'))  
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(header(LICENSE_TEMPLATE, { pkg: pkg }))
    .pipe(gulp.dest(paths.dist));
})

gulp.task('scripts', ['lint'], function() {
  return gulp.src(paths.srcEntryPoint)
    .pipe(browserify({
      transform: ['babelify'],
      standalone: 'JsonQuery'
    }))
    .pipe(rename(paths.outfile + '.js'))
    .pipe(header(LICENSE_TEMPLATE, { pkg : pkg } ))
    .pipe(gulp.dest(paths.dist))
});

gulp.task('lint', function() {
  gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.formatEach())
    .pipe(eslint.result(function (result) {
        console.log('ESLint: ' + result.filePath + " # Warnings:" + result.warningCount  + " # Errors: " + result.errorCount);
        console.log('# Messages: ' + result.messages);
    }));
});

gulp.task('build', ['clean', 'minify']);

gulp.task('scripts-watch', ['clean', 'scripts'], browserSync.reload);

gulp.task('serve', ['scripts'], function () {
  browserSync.init({
    server: {
      baseDir: paths.spec,
      index: 'SpecRunner.html',
      routes: {
        '/dist/json_query.js': './dist/json_query.js'
      }
    }
  });

  gulp.watch(paths.scripts, ['scripts-watch']);
});

gulp.task('default', ['clean', 'serve']);
