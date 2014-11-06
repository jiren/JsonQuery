/*!
 * grunt-jslint
 * https://github.com/stephenmathieson/grunt-jslint
 *
 * Copyright (c) 2013 Stephen Mathieson
 * Licensed under the WTFPL license.
 */

'use strict';

var jslint = require('..');
var pkg = require('../package.json');
var path = require('path');

/**
 * Register the `jslint` task
 *
 * @api private
 * @param {Object} grunt
 */
var gruntJSLint = module.exports = function (grunt) {
  grunt.registerMultiTask('jslint', 'Validate JavaScript files with JSLint', function () {
    var next = this.async();

    if (grunt.config('jslint.files') || grunt.config('jslint.options')) {
      // single-task is deprecated
      return (function deprecation() {
        var err = new Error([
          'grunt-jslint\'s interface has changed',
          'since 0.2.x;',
          'see ' + pkg.homepage + ' for update instructions.'
        ].join(' '));
        next(err);
      }());
    }

    var conf = {
      files: this.filesSrc,
      exclude: this.data.exclude || [],
      options: this.data.options || {},
      directives: this.data.directives || {}
    };

    gruntJSLint.task(grunt, conf, next);
  });
};

/**
 * Expand and exclude files
 *
 * @api private
 * @param {Object} grunt
 * @param {Array} files
 * @param {Array} excludedFiles
 */
function expandAndExclude(grunt, files, excludedFiles) {

  excludedFiles = grunt.file.expand(excludedFiles);

  var exclude = {};
  excludedFiles.forEach(function (e) { exclude[e] = true; });

  files = grunt.file
    .expand(files)
    .filter(function (file) {
      return !exclude[file];
    });

  return files;
}
gruntJSLint.expandAndExclude = expandAndExclude;

/**
 * The actual jslint `task`
 *
 *
 * @api private
 * @param {Object} grunt
 * @param {Object} config
 * @param {Function} next
 */
gruntJSLint.task = function (grunt, config, next) {
  var files = config.files;
  var excludedFiles = config.exclude;
  var options = config.options;

  if (!files || !files.length) {
    grunt.log.error('NO FILES?!?');
    return false;
  }

  if (options.failOnError === undefined) {
    options.failOnError = true;
  }

  files = expandAndExclude(grunt, files, excludedFiles);

  options.directives = config.directives;

  jslint.runner(files, options, function (err, report) {
    var template;

    if (err) {
      grunt.log.error(err);
      return next(false);
    }

    if (options.errorsOnly) {
      template = jslint.reporters.errorsOnly(report);
    } else {
      template = jslint.reporters.standard(report);
    }

    if (options.log) {
      grunt.file.write(options.log, grunt.log.uncolor(template));
    }

    if (options.junit) {
      grunt.file.write(options.junit, jslint.reporters.junit(report));
    }

    if (options.jslintXml) {
      grunt.file.write(options.jslintXml, jslint.reporters.jslint(report));
    }

    if (options.checkstyle) {
      grunt.file.write(options.checkstyle, jslint.reporters.checkstyle(report));
    }

    if (grunt.option('no-color')) {
      template = grunt.log.uncolor(template);
    }

    grunt.log.write(template);

    if (report.failures && options.failOnError) {
      next(false);
    } else {
      next(true);
    }
  });
};
