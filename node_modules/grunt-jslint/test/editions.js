'use strict';

var path = require('path'),
  vows = require('vows'),
  assert = require('assert'),
  jslint = require('..'),
  validate = jslint.validate,
  suite = vows.describe('editions');

function getFixture(file) {
  return path.join(__dirname, 'fixtures', file);
}

suite.addBatch({
  'es5 feature with latest': {
    topic: function () {
      var file = getFixture('es5.js'),
        opts = {
          directives: {
          }
        };

      jslint.loadJSLint('latest', function () {
        validate(file, opts, this.callback);
      }.bind(this));
    },
    'should not error': function (err, report) {
      assert.ifError(err);
    },
    'should be a modern edition': function (err, report) {
      assert.ok(jslint.edition > '2014-01-01');
    },
    'should have one violation': function (err, report) {
      assert.lengthOf(report, 1);
    }
  }
}).addBatch({
  'es5 feature with ancient': {
    topic: function () {
      var file = getFixture('es5.js'),
        opts = {
          directives: {
          }
        };

      jslint.loadJSLint('2013-02-03', function () {
        validate(file, opts, this.callback);
      }.bind(this));
    },
    'should not error': function (err, report) {
      assert.ifError(err);
    },
    'should be a correct edition': function (err, report) {
      assert.ok(jslint.edition === '2013-02-03');
    },
    'should have one violation': function (err, report) {
      assert.lengthOf(report, 1);
    }
  }
}).addBatch({
  'es5=false with older edition': {
    topic: function () {
      var file = getFixture('es5.js'),
        opts = {
          directives: {
            es5: false
          }
        };

      jslint.loadJSLint('2013-08-26', function () {
        validate(file, opts, this.callback);
      }.bind(this));
    },
    'should not error': function (err, report) {
      assert.ifError(err);
    },
    'should be a correct edition': function (err, report) {
      assert.ok(jslint.edition === '2013-08-26');
    },
    'should have one violation': function (err, report) {
      assert.lengthOf(report, 1);
    }
  }
}).addBatch({
  'es5=true with older edition': {
    topic: function () {
      var file = getFixture('es5.js'),
        opts = {
          directives: {
            es5: true
          }
        };

      jslint.loadJSLint('2013-08-26', function () {
        validate(file, opts, this.callback);
      }.bind(this));
    },
    'should not error': function (err, report) {
      assert.ifError(err);
    },
    'should be a correct edition': function (err, report) {
      assert.ok(jslint.edition === '2013-08-26');
    },
    'should have no violations': function (err, report) {
      assert.lengthOf(report, 0);
    }
  }
}).addBatch({
  'load specific path': {
    topic: function () {
      var file = getFixture('es5.js'),
        opts = {
          directives: {
            es5: true
          }
        };

      jslint.loadJSLint('node_modules/jslint/lib/jslint-2013-08-26.js', function () {
        validate(file, opts, this.callback);
      }.bind(this));

    },
    'should not error': function (err, report) {
      assert.ifError(err);
    },
    'should be a correct edition': function (err, report) {
      assert.ok(jslint.edition === '2013-08-26');
    },
    'should have no violations': function (err, report) {
      assert.lengthOf(report, 0);
    }
  }
});

suite.export(module);
