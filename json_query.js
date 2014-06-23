(function(window) {

  'use strict';

  var JsonQuery = function(data, selectors){
      return new _JsonQuery(data, selectors);
  };

  window.JsonQuery = JsonQuery;

  JsonQuery.VERSION = '0.0.1'

  var _JsonQuery = function(data, selectors){
    this.data = data;
    this.selectors = selectors || [];
    this.getPropFns = {};
    this.buildAccessFns(this.selectors);
    this.selectorMap = {};
    this.schema = {};
  };

  var JQ = _JsonQuery.prototype;

  JQ.buildSchema = function(d, p){
    var field, v, type, k;
    
    for(field in d){
      v = d[field];
      k = p ? (p + '.' + field) : field;

      if (v != undefined){
        if (toString.call(v)  == '[object Array]'){
          this.schema[k] = 'Array';
          this.buildSchema(v[0], k);
        }else if (toString.call(v)  == '[object Object]'){
          this.schema[k] = 'Object';
          this.buildSchema(v, k);
        }else if (toString.call(v)  == '[object Number]'){
          this.schema[k] = 'Number';
        }else if (toString.call(v)  == '[object Boolean]'){
          this.schema[k] = 'Boolean';
        }else if (toString.call(v)  == '[object String]' && v.match(/\d{4}-\d{2}-\d{2}/)){
          this.schema[k] = 'Date';
        }else if (toString.call(v)  == '[object String]'){
          this.schema[k] = 'String';
        }else{
          this.schema[k] = v;
        }
      }else{
        this.schema[k] = v;
      }

    }
  };

  JQ.buildAccessFns = function(selectors){
    var i = 0;

    for(i; i < selectors.length; i++){
      this.getPropFns[selectors[i]] = this.buildGetPropFn(selectors[i]);
    }
  };

  JQ.buildGetPropFn = function(field){
    var i = 0, nestedPath, accessPath = "obj", accessFn, __f; 

    if(this.getPropFns[field]){
      return this.getPropFns[field];
    }

    nestedPath = field.split('.');

    for (i = 0; i < nestedPath.length; i++) {
      accessPath =  accessPath +  "['" + nestedPath[i] + "']";
    };

    accessFn = '__f = function(obj){ return '+ accessPath +'; }' ;
    eval(accessFn);
    return __f;
  };

  JQ.CONDITIONS = {
    eq: function(v1, v2){ return v1 == v2},
    lt: function(v1, v2){ return v1 < v2},
    gt: function(v1, v2){ return v1 > v2},
    in: function(v1, v2){ return v2.indexOf(v1) > -1},
    li: function(v, regx) { return regx.test(v)},
    bt: function(v1, v2){ return (v1 > v2[0] && v1 < v2[1])}
  };

  JQ.addCondition = function(name, func){
    this.CONDITIONS[name] = func;
  };

  JQ.getCondition = function(criteria){
    var fieldCondition = criteria.split('.$');
    
    return {
      field: fieldCondition[0], 
      operator: fieldCondition[1] || 'eq'
    };
  };

  JQ.each = function(records, callback){
    var  i = 0, l = records.length;

    for(i; i < l; i++){
      callback.call(this, records[i]);
    }
  };

  JQ._findAll = function(records, qFn, cVal, cOpt){

    var i = 0, l = records.length, result = [], cFn, v;

    if(cOpt == 'li' && typeof cVal == 'string'){
      cVal = new RegExp(cVal);
    }else if(cOpt == 'eq' && Array.isArray(cVal)){
      cOpt = 'in';  
    }

    cFn = this.CONDITIONS[cOpt];

    for(i; i< l; i++){
      v = qFn(records[i]);

      if(cFn(v, cVal)) { 
        result.push(records[i]);
      }
    };

    return result; 
  };

  JQ.where = function(query){
    var result = this.data, c, fieldCondition;

    for(c in query){
      fieldCondition = this.getCondition(c);
      result = this._findAll(result, this.getPropFns[fieldCondition.field], query[c], fieldCondition.operator);
    }

    return result;
  };


})(this);

