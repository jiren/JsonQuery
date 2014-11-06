
'use strict';

var util = require('./util');
var path = require('path');

module.exports = function (report) {
  var xml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<testsuites>',
    '  <testsuite>'
  ];

  Object.keys(report.files).forEach(function (file) {
    var parts = file.split(/[\\\/]/).filter(function (part) { return part; });
    var classname = parts.join('.').replace(/\.js$/i, '').replace(/-/g, '_');
    var filename = path.basename(file, '.js');
    var failures = report.files[file];

    if (failures.length) {
      failures.forEach(function (failure) {
        var name = filename
                 + ':'
                 + failure.line
                 + ':'
                 + (failure.character || '');

        xml.push([
          '<testcase classname="' + classname + '" name="' + name + '">',
          '  <failure message="' + util.message(failure) + '" />',
          '</testcase>'
        ].join('\n'));
      });
    } else {
      xml.push([
        '<testcase classname="' + classname + '" name="' + filename + ':0:0"></testcase>'
      ].join('\n'));
    }
  });

  xml = xml.concat([
    '  </testsuite>',
    '</testsuites>'
  ]);

  return xml.join('\n');
};
