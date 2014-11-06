'use strict';

var path = require('path'),
  vows = require('vows'),
  assert = require('assert'),
  jslint = require('..');

var suite = vows.describe('templates');

suite.addBatch({
  'sanity': {
    topic: function () {
      return jslint.reporters;
    },
    'should be an object': function (templates) {
      assert.isObject(templates);
    },
    'should have multiple keys': function (templates) {
      assert.ok(Object.keys(templates).length);
    },
    'should contain an "errorsOnly" template': function (templates) {
      assert.include(templates, 'errorsOnly');
    },
    'should contain an "standard" template': function (templates) {
      assert.include(templates, 'standard');
    },
    'should contain an "jslint" template': function (templates) {
      assert.include(templates, 'jslint');
    },
    'should contain a "checkstyle" template': function (templates) {
      assert.include(templates, 'checkstyle');
    },
    'should contain an "junit" template': function (templates) {
      assert.include(templates, 'junit');
    }
  }
});

suite.export(module);
