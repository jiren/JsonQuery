
'use strict';

var red = require('./util').color.red;
var standard = require('./standard');

module.exports = function (report) {
  return standard(report, true);
};
