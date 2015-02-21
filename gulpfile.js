var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  changed = require('gulp-changed'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  download = require("gulp-download"),
  del = require('del'),
  header = require('gulp-header'),
  runSequence = require('run-sequence'),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync'),
  injector = require('gulp-injector');


var pkg = require('./package.json'),
    paths = {
      src: [ 'src/main.js'],
      dist: 'dist'
    },
    scripts = 'src/*.js',
    specs = 'spec/*.js',
    uncompressedJs = 'json_query.js',
    compressedJs = 'json_query.min.js';


var banner = [
   '/*',
   ' * <%= pkg.title || pkg.name %>',
   ' * <%= pkg.version %> (<%= new Date().toISOString().slice(0, 10) %>)',
   ' *',
   ' * Released under the MIT license',
   ' * http://opensource.org/licenses/MIT',
   ' *',
   ' * Copyright 2011-<%= new Date().getFullYear() %> <%= pkg.author.name %>[<%= pkg.author.email %>]',
   ' *',
   ' */',
   ' ',
   ' ' ].join('\n');

gulp.task('clean', function(cb) {
  del([paths.dist], cb);
});

gulp.task('scripts', function() {

 return gulp.src(paths.src)
  .pipe(concat(uncompressedJs))
  .pipe(injector())
  .pipe(header(banner, { pkg: pkg } ))
  .pipe(gulp.dest(paths.dist))
  .pipe(sourcemaps.init())
  .pipe(uglify({preserveComments: 'all'}))
  .pipe(rename(compressedJs))
  .pipe(gulp.dest(paths.dist))

});

gulp.task('watch', function() {
  gulp.watch(scripts, function(cb){
    runSequence('scripts', browserSync.reload)
  });

  gulp.watch(specs, [browserSync.reload])
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./spec",
      index: 'SpecRunner.html',
      routes: {
        '/dist/json_query.js': './dist/json_query.js'
      }
    }
  });
});

gulp.task('build', function(cb){
  runSequence('clean', 'scripts', cb)
});

gulp.task('default', function(cb){
  runSequence('clean', 'scripts', 'watch', 'browser-sync')
});
