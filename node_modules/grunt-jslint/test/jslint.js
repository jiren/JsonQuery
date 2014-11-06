'use strict';

var path = require('path'),
  vows = require('vows'),
  assert = require('assert');

var jslint = require('..'),
  validate = jslint.validate,
  suite = vows.describe('validate');

function getFixture(file) {
  return path.join(__dirname, 'fixtures', file);
}

// added for testing edition selection
var initialEdition;

suite.addBatch({

  'metadata': {
    topic: function () {
      this.callback(null, require('..'));
    },
    'should expose the JSLint edition': function (err, jslint) {
      assert.isString(jslint.edition);
      assert.matches(jslint.edition, /\d{4}-\d{2}-\d{2}/);
      // should throw on malformed dates
      assert.instanceOf(new Date(jslint.edition), Date);
    }
  },

  'predef -> globals': {
    'with directives.globals': {
      topic: function () {
        var file = getFixture('globals.js'),
          opts = {
            directives: {
              globals: [ 'someglobal' ]
            }
          };

        validate(file, opts, this.callback);
      },
      'should not error': function (err, report) {
        assert.ifError(err);
      },
      'should not pass violations': function (err, report) {
        assert.lengthOf(report, 0);
      }
    },
    'without directives.globals': {
      topic: function () {
        var file = getFixture('globals.js');

        validate(file, {}, this.callback);
      },
      'should not error': function (err, report) {
        assert.ifError(err);
      },
      'should pass a global violation': function (err, report) {
        var violation = report[0];

        assert.equal(violation.reason, '\'someglobal\' was used before it was defined.');
      }
    }
  },

  'select edition': {
    'with default edition': {
      topic: function () {
        jslint.loadJSLint('latest', this.callback);
      },
      'should not error': function (err, report) {
        assert.ifError(err);
      },
      'should have an edition': function (err, report) {
        initialEdition = report;
        assert.ok(report);
      }
    },
    'with explicit edition': {
      topic: function () {
        jslint.loadJSLint('2013-02-03', this.callback);
      },
      'should not error': function (err, report) {
        assert.ifError(err);
      },
      'should have selected edition': function (err, report) {
        assert.equal('2013-02-03', report);
      }
    },
    'with latest edition': {
      topic: function () {
        jslint.loadJSLint('latest', this.callback);
      },
      'should not error': function (err, report) {
        assert.ifError(err);
      },
      'should be back to default(initial) edition': function (err, report) {
        assert.equal(initialEdition, report);
      }
    },
    'with explicit path': {
      topic: function () {
        jslint.loadJSLint('./node_modules/jslint/lib/jslint-latest.js', this.callback);
      },
      'should not error': function (err, report) {
        assert.ifError(err);
      },
      'should be latest edition': function (err, report) {
        assert.equal(initialEdition, report);
      }
    },
    'via runner': {
      topic: function () {
        var file = getFixture('clean.js');

        jslint.runner([file], {edition: 'latest'}, this.callback);
      },
      'should not error': function (err, report) {
        assert.ifError(err);
      },
      'should have no errors': function (err, report) {
        assert.isObject(report);
        assert.isObject(report.files);
        assert.equal(1, report.file_count);
        assert.equal(0, report.failures);
      }
    }
  },

  'no directives': {
    topic: function () {
      var file = getFixture('white.js');
      validate(file, {}, this.callback);
    },
    'should not error': function (err, report) {
      assert.ifError(err);
    },
    'should pass an Array of issues': function (err, report) {
      assert.isArray(report);
      assert.ok(report.length);
    },
    'should contain required issue properties': function (err, report) {
      report.forEach(function (issue) {
        assert.ok(issue.id);
        assert.ok(issue.raw);
        assert.ok(issue.evidence);
        assert.ok(issue.line);
        assert.ok(issue.character);
        assert.ok(issue.reason);
        assert.ok(issue.file);
      });
    },
    'should report at least 9 issues': function (err, report) {
      // as of 12-21-12, there are 12 issues in this file.  i'm not
      // directly testing each issue, because i believe jslint works as
      // expected.  also, crockford may decide to change his mind
      // regarding one or more of the reported issues in this file.
      assert.ok(report.length >= 9);
    }
  },
  'directives:': {
    'white': {
      topic: function () {
        var file = getFixture('white.js');
        validate(file, {
          'directives': {
            'white': true
          }
        }, this.callback);
      },
      'should not error': function (err, report) {
        assert.ifError(err);
      },
      'should pass an empty Array': function (err, report) {
        assert.isArray(report);
        assert.lengthOf(report, 0);
      }
    },
    'sloppy': {
      topic: function () {
        var file = getFixture('sloppy.js');
        validate(file, {
          'directives': {
            'sloppy': true
          }
        }, this.callback);
      },
      'should not error': function (err, report) {
        assert.ifError(err);
      },
      'should pass an empty Array': function (err, report) {
        assert.isArray(report);
        assert.lengthOf(report, 0);
      }
    }
  },

  'shebang option': {
    topic: function () {
      var file = getFixture('shebang');
      validate(file, { shebang: true }, this.callback);
    },
    'should not error': function (err, report) {
      assert.ifError(err);
    },
    'should pass an empty Array': function (err, report) {
      assert.isArray(report);
      assert.lengthOf(report, 0);
    }
  },

  'preprocessScript strip shebang': {
    topic: function () {
      var source = jslint.preprocessScript('\ufeff#!/usr/bin/env node\nvar x = 1;', true);
      this.callback(null, source);
    },
    'should strip bom and shebang but not newline': function (err, report) {
      assert.ifError(err);
      assert(report === '\nvar x = 1;');
    }
  },
  'preprocessScript no strip shebang': {
    topic: function () {
      var source = jslint.preprocessScript('\ufeff#!/usr/bin/env node\nvar x = 1;', false);
      this.callback(null, source);
    },
    'should strip bom': function (err, report) {
      assert.ifError(err);
      assert(report === '#!/usr/bin/env node\nvar x = 1;');
    }
  },

  'unused option': {
    topic: function () {
      var file = getFixture('unused.js');
      validate(file, {}, this.callback);
    },
    'should not error': function (err, report) {
      assert.ifError(err);
    },
    'should report at least two violations': function (err, report) {
      assert(report.length >= 2);
    },
    'should report on unused parameters': function (err, report) {
      assert.equal(report[0].reason, 'Unused \'c\'.');
    },
    'should report on unused vars': function (err, report) {
      assert.equal(report[1].reason, 'Unused \'b\'.');
    }
  },

  'missing file': {
    topic: function () {
      validate('cats and dogs', {}, this.callback);
    },
    'should error': function (err, report) {
      assert.ok(err instanceof Error);
    }
  }
});

suite.export(module);
