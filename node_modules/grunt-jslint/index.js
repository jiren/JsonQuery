
module.exports = process.env.JSLINT_COV
  ? require('./lib-cov/jslint')
  : require('./lib/jslint');
