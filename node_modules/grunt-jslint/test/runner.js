/*jslint unparam:true*/

'use strict';

var path = require('path'),
  vows = require('vows'),
  assert = require('assert'),
  runner = require('..').runner;

var suite = vows.describe('runner');

/**
 * Validate an issue
 *
 * @param  {Object} issue
 */
function validateIssue(issue) {
  assert.ok(issue.id);
  assert.ok(issue.raw);
  assert.ok(issue.evidence);
  assert.ok(issue.line);
  assert.ok(issue.character);
  assert.ok(issue.reason);
  assert.ok(issue.file);
}

var tests = {
  'should not error': function (err, report) {
    assert.ifError(err);
  },
  'should pass a report Object': function (err, report) {
    assert.isObject(report);
  },
  'report should contain number of failures': function (err, report) {
    assert.ok(report.failures);
  },
  'report should contain number of files': function (err, report) {
    assert.ok(report.file_count);
  },
  'report should contain number of files in violation': function (err, report) {
    assert.ok(report.files_in_violation);
  },
  'report should contain a "files" object': function (err, report) {
    assert.isObject(report.files);
  },
  'files object should contain multiple keys': function (err, report) {
    var count = Object.keys(report.files).length;

    assert.ok(count);
    assert.equal(report.file_count, count);
    assert.equal(report.files_in_violation, count);
  },
  'each key in the files object should be an Array of issues': function (err, report) {
    var files = Object.keys(report.files);

    files.forEach(function (file) {

      file = report.files[file];

      assert.isArray(file);

    });
  },
  'each issue contained in a file should hold all required properties': function (err, report) {
    var files = Object.keys(report.files);

    files.forEach(function (file) {

      file = report.files[file];

      file.forEach(validateIssue);

    });
  }
};

/**
 * Create a vows batch
 *
 * @param  {String}   title The title
 * @param  {Function} topic The topic
 * @return {Object}         The batch
 */
function createBatch(title, topic) {
  var vow,
    batch = {};

  batch[title] = {};
  batch[title].topic = topic;

  for (vow in tests) {
    if (tests.hasOwnProperty(vow)) {
      batch[title][vow] = tests[vow];
    }
  }
  return batch;
}

suite.addBatch(createBatch('multiple files', function () {
  var files = [
      path.join(__dirname, 'fixtures', 'sloppy.js'),
      path.join(__dirname, 'fixtures', 'white.js')
    ],
    directives = {};

  runner(files, directives, this.callback);
}));

suite.addBatch(createBatch('single file', function () {
  var files = [
      path.join(__dirname, 'fixtures', 'sloppy.js')
    ],
    directives = {};

  runner(files, directives, this.callback);
}));

suite.addBatch(createBatch('multiple directives', function () {
  var files = [
      path.join(__dirname, 'fixtures', 'sloppy.js'),
      path.join(__dirname, 'fixtures', 'white.js')
    ],
    directives = {
      'nomen': true,
      'browser': true,
      'node': false,
      'white': false
    };

  runner(files, directives, this.callback);
}));

suite.addBatch(createBatch('single directive', function () {
  var files = [
      path.join(__dirname, 'fixtures', 'sloppy.js'),
      path.join(__dirname, 'fixtures', 'white.js')
    ],
    directives = {
      'nomen': true
    };

  runner(files, directives, this.callback);
}));



suite.export(module);
