
'use strict';

var util = require('./util');

module.exports = function (report) {
  var xml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<jslint>'
  ];

  Object.keys(report.files).forEach(function (file) {
    var issues = report.files[file];

    xml.push('<file name="' + file + '">');

    issues.forEach(function (issue) {
      var reason = util.message(issue),
        evidence = issue.evidence || '';

      xml.push([
        '<issue',
        ' line="' + issue.line + '"',
        ' char="' + issue.character + '"',
        ' reason="' + util.escapeForXml(reason) + '"',
        ' evidence="' + util.escapeForXml(evidence) + '"',
        '/>'
      ].join(''));
    });

    xml.push('</file>');
  });

  xml.push('</jslint>');

  return xml.join('\n');
};
