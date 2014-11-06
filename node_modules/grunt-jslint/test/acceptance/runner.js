
'use strict';

var spawn = require('win-spawn');
var path = require('path');
var assert = require('better-assert');
var which = require('which');

var grunt = which.sync('grunt');
var EXAMPLES_DIR = path.join(__dirname, '..', '..', 'examples');

/**
 * Run an acceptance test defined by `opts`.
 *
 * Examples
 *
 *    var runner = require('./acceptance-runner');
 *    
 *    // a passing test
 *    var test = {
 *      example: 'all',
 *      errors: 0
 *    };
 *    runner(test);
 *    
 *    // a failing test with a custom grunt task
 *    var test = {
 *      example: 'custom-edition',
 *      errors: 2,
 *      task: 'foo'
 *    };
 *    runner(test);
 *
 *    // a test with a custom message
 *    var test = {
 *      example: 'deprecation',
 *      message: 'grunt-jslint\'s interface has changed since 0.2.x'
 *    };
 *    runner(test);
 *    
 *
 * @api public
 * @param {Object} opts
 */


module.exports = function runner(opts) {
  var task = opts.task || 'jslint';
  var directory = path.join(EXAMPLES_DIR, opts.example);
  var child = spawn(grunt, [task], { cwd: directory });
  var out = '';

  child.on('close', function (code) {
    if (opts.message) {
      assert(-1 !== out.indexOf(opts.message));
    } else if (opts.errors) {
      assert(0 !== code);
      assert(-1 !== out.indexOf('JSLint failed, ' + opts.errors + ' violations'));
    } else {
      assert(0 === code);
      assert(-1 !== out.indexOf('Done, without errors.'));
    }
  });

  child.stdout.on('data', function (data) {
    out += String(data);
    if (-1 !== process.argv.indexOf('--verbose')) {
      process.stdout.write(data);
    }
  });
};
