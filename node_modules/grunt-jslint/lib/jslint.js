
'use strict';

var fs = require('fs');
var vm = require('vm');
var path = require('path');
var resolve = path.resolve;
var nodelint = require('jslint/lib/nodelint');

var jslint = module.exports;

/**
 * The `JSLINT` function
 *
 * @api public
 * @param {String} source
 * @param {Object} options
 */

var JSLINT;

/**
 * Expose the current version of JSLint
 *
 * @api public
 * @type {String}
 */

jslint.edition = '';

/**
 * Load (or reload) the actual jslint linter module
 *
 * @api public
 * @param {String} edition
 * @param {Function} [cb]
 */

function loadJSLint(edition, cb) {
  JSLINT = jslint.JSLINT = nodelint.load(edition);
  jslint.edition = JSLINT.edition;

  if (cb) {
    cb(null, jslint.edition);
  }
}

/**
 * Expose `loadJSLint`.
 */

jslint.loadJSLint = loadJSLint;

// default - can be overridden by setting 'edition' in grunt options
loadJSLint('latest');


/**
 * Run `JSLINT` on the given `files`
 *
 * @api public
 * @param {Array} files
 * @param {Object} opts
 * @param {Function} cb
 */

jslint.runner = function (files, opts, cb) {
  var pending = files.length;
  var report = {
    files: {},
    failures: 0,
    file_count: files.length,
    files_in_violation: 0
  };
  var done = false;

  if (opts.edition) {
    loadJSLint(opts.edition);
  }

  files.forEach(function (file) {
    jslint.validate(file, opts, function (err, violations) {
      if (done) { return; }

      if (err) {
        done = true;
        return cb(err);
      }

      report.files[file] = violations;

      if (violations.length) {
        report.failures += violations.length;
        report.files_in_violation += 1;
      }

      pending -= 1;
      if (!pending) {
        done = true;
        cb(null, report);
      }
    });
  });
};

/**
 * Run `JSLINT` on the given `file`
 *
 * @api public
 * @param {String} files
 * @param {Object} opts
 * @param {Function} cb
 */

jslint.preprocessScript = function preprocessScript(source, stripShebang) {
  if (source.charCodeAt(0) === 0xFEFF) {
    source = source.slice(1);
  }

  if (stripShebang) {
    // remove shebang lines for executable files
    //   e.g. `#!/usr/bin/env node`
    /*jslint regexp: true*/
    source = source.replace(/^\#\!.*/, '');
    /*jslint regexp: false*/
  }

  return source;
};

jslint.validate = function (file, opts, cb) {
  var directives = opts.directives || {};

  // `predef` is obnoxious
  if (directives.globals) {
    directives.predef = directives.globals;
    delete directives.globals;
  }

  fs.readFile(file, 'utf8', function (err, source) {
    if (err) {
      return cb(err);
    }

    source = jslint.preprocessScript(source, opts.shebang);

    JSLINT(source, directives);

    var violations = JSLINT.errors;
    var res = [];

    violations.forEach(function (violation) {
      if (!violation) {
        return;
      }

      violation.file = file;
      res.push(violation);
    });

    return cb(null, res);
  });
};

/**
 * All available reporters
 *
 * @api private
 * @type {Object}
 */

jslint.reporters = require('./reporters');
