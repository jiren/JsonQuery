(function(window) {

  'use strict';

  var JsonQuery = function(records, opts){
    return new _JsonQuery(records, opts || {});
  };

  window.JsonQuery = JsonQuery;

  JsonQuery.VERSION = '0.0.2'

  if(!Object.defineProperty){
    Object.defineProperty = function(obj, name, opts){
      obj[name] = opts.get
    }
  }

  /* inject src/util.js */
  /* inject src/jq.js */
  /* inject src/query.js */
  /* inject src/ie_fix.js */

})(this);
