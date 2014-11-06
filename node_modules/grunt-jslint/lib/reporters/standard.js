
'use strict';

var util = require('./util');
var red = util.color.red;

module.exports = function (report, errorsOnly) {
  var buf = '';

  Object.keys(report.files).forEach(function (file) {
    var issues = report.files[file];

    if (!issues.length) {
      if (!errorsOnly) {
        buf += util.color.green('PASS');
        buf += '\t' + file + '\n';
      }
      return;
    }

    buf += red('FAIL') + '\t';
    buf += file + ' (' + issues.length + ')\n';
    issues.forEach(function (issue) {
      buf += red(file + ':' + issue.line);
      if (issue.character) {
        buf += red(':' + issue.character);
      }
      buf += '\t';
      buf += util.message(issue) + '\n';
    });
  });

  if (report.failures) {
    buf += red([
      '\n',
      '# JSLint failed, ',
      report.failures + ' ',
      'violations in ',
      report.files_in_violation + '.  ',
      report.file_count + ' ',
      'files scanned.'
    ].join(''));
  }

  return buf + '\n';
};
