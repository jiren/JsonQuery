
'use strict';

/**
 * Excape the given `value` for xml
 *
 * @api private
 * @param {String} value
 * @return {String}
 */

exports.escapeForXml = function (value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Get an xml-safe message for the given `issue`
 *
 * @api private
 * @param {String} issue
 * @return {String}
 */

exports.message = function (issue) {
  var msg = issue.reason || 'Unused variable "' + issue.name + '"';
  return exports.escapeForXml(msg);
};

/**
 * ANSI colors.
 */

exports.color = {

  /**
   * Wrap `str` in red
   *
   * @api private
   * @param {String} str
   * @return {String}
   */

  red: function (str) {
    return [ '\x1B[31m', str, '\x1B[39m' ].join('');
  },

  /**
   * Wrap `str` in green
   *
   * @api private
   * @param {String} str
   * @return {String}
   */

  green: function (str) {
    return [ '\x1B[32m', str, '\x1B[39m' ].join('');
  }
};
