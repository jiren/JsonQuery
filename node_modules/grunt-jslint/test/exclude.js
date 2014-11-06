'use strict';

var vows = require('vows'),
  suite = vows.describe('exclude'),
  jslint = require('../tasks/jslint.js'),
  assert = require('assert');

function makeMockGrunt() {
  var mockGrunt = {
    file: {
    },
    overrides: {
    }
  };

  mockGrunt.file.expand = function (a) {

    if (mockGrunt.overrides[a]) {
      return mockGrunt.overrides[a];
    }

    return a;
  };

  return mockGrunt;
}

suite.addBatch({
  'exclude works with literal paths': {
    topic: function () {
      var files = ['a', 'b', 'c'],
        excludedFiles = ['b'],
        mockGrunt = makeMockGrunt();

      files = jslint.expandAndExclude(mockGrunt, files, excludedFiles);
      this.callback(null, files);
    },
    'should remove excluded file': function (err, files) {
      assert.deepEqual(['a', 'c'], files);
    }
  },

  'exclude works with globbed paths': {
    topic: function () {
      var files = ['./js/**/*.js'],
        excludedFiles = ['./js/bundle*.js'],
        mockGrunt = makeMockGrunt();

      mockGrunt.overrides = {
        './js/**/*.js': [
          './js/foo.js'
        ]
      };

      files = jslint.expandAndExclude(mockGrunt, files, excludedFiles);
      this.callback(null, files);
    },
    'should succeed even if excluded files is empty array': function (err, files) {
      assert.deepEqual(['./js/foo.js'], files);
    }
  },

  'exclude works with globbed paths (2)': {
    topic: function () {
      var files = ['./js/**/*.js'],
        excludedFiles = [],
        mockGrunt = makeMockGrunt();

      mockGrunt.overrides = {
        './js/**/*.js': [
          './js/foo.js',
          './js/bundle.min.js'
        ]
      };

      files = jslint.expandAndExclude(mockGrunt, files, excludedFiles);
      this.callback(null, files);
    },
    'should match all expanded files when excluded files is empty array': function (err, files) {
      assert.deepEqual(['./js/foo.js', './js/bundle.min.js'], files);
    }
  },

  'exclude works with globbed paths (3)': {
    topic: function () {
      var files = ['./js/**/*.js'],
        excludedFiles = ['./js/bundle*.js'],
        mockGrunt = makeMockGrunt();

      mockGrunt.overrides = {
        './js/**/*.js': [
          './js/foo.js',
          './js/bundle.min.js'
        ],
        './js/bundle*.js': [
          './js/bundle.min.js'
        ]
      };

      files = jslint.expandAndExclude(mockGrunt, files, excludedFiles);
      this.callback(null, files);
    },
    'should exclude files after expansion': function (err, files) {
      assert.deepEqual(['./js/foo.js'], files);
    }
  },

  'exclude is not dog slow': {
    topic: function () {
      var files = [],
        excludedFiles = [],
        includedFiles = [],
        i,
        s,
        t,
        mockGrunt = makeMockGrunt();

      for (i = 0; i < 1000; i += 1) {
        s = String(i);
        if (i % 2) {
          excludedFiles.push(s);
        } else {
          includedFiles.push(s);
        }
        files.push(s);
      }

      t = process.hrtime();
      files = jslint.expandAndExclude(mockGrunt, files, excludedFiles);
      t = process.hrtime(t);

      this.callback(null, files, includedFiles, t);
    },

    'should excluded files without taking forever': function (err, files, includedFiles) {
      assert.deepEqual(includedFiles, files);
    },
    'should have short duration': function (err, files, includedFiles, t) {
      var microseconds = 1.0e6 * t[0] + t[1] / 1000;
      assert.ok(microseconds < 2000);
    }
  }
});

suite.export(module);
