(function(window) {

  'use strict';

  var JsonQuery = function(data){
      return new _JsonQuery(data);
  };

  window.JsonQuery = JsonQuery;

  JsonQuery.VERSION = '0.0.1'

  var _JsonQuery = function(data){
    this.data = data || [];
    this.schema = {};
    this.getPropFns = {};
    this.buildSchema(this.data[0]) 
    this.buildAccessFns(this.data[0]);
  };

  var JQ = _JsonQuery.prototype;

  JQ.getDataType = function(val){
    return toString.call(val).slice(8, -1)
  };

  JQ.buildSchema = function(d, p){
    var field, v, type, k, dataType;
      
    for(field in d){
      v = d[field];
      k = p ? (p + '.' + field) : field;

      if (v != undefined){

        dataType = this.getDataType(v);

        if (dataType == 'Array'){
          if(this.getDataType(v[0]) == 'Object'){
            this.schema[k] = 'Array';
            this.buildSchema(v[0], k);
          }else{
            this.schema[k] = this.getDataType(v[0]);
          }
        }else if (dataType  == 'Object'){
          this.schema[k] = 'Object';
          this.buildSchema(v, k);
        }else if (dataType  == 'Number'){
          this.schema[k] = 'Number';
        }else if (dataType  == 'Boolean'){
          this.schema[k] = 'Boolean';
        }else if (dataType  == 'String' && v.match(/\d{4}-\d{2}-\d{2}/)){
          this.schema[k] = 'Date';
        }else if (dataType  == 'String'){
          this.schema[k] = 'String';
        }else{
          this.schema[k] = v;
        }
      }else{
        this.schema[k] = v;
      }

    }
  };

  JQ.buildAccessFns = function(record){
    var selector, type, propFn, rVal;

    for(selector in this.schema){
      type = this.schema[selector];

      if(type != 'Array' && type != 'Object'){
        this.getPropFns[selector] = this.buildGetPropFn(selector);
      }
       
      propFn = this.getPropFns[selector];
      if(propFn){
        rVal = propFn(record);
      }else{
        rVal = record[selector];
      }

      this.schema[selector] = this.getDataType(rVal);
    }
  };

  JQ.buildGetPropFn = function(field){
    var i = 0, nestedPath, accessPath = "obj", accessFn, __f, map; 

    if(this.getPropFns[field]){
      return this.getPropFns[field];
    }

    nestedPath = field.split('.');

    for (i = 0; i < nestedPath.length; i++) {
      if(this.schema[nestedPath[i]] == 'Array'){
        map = true;
        accessPath = accessPath + "['" + nestedPath[i] + "']";
      }else{
        if(map){
           accessPath = accessPath + ".map(function(r){ return r['" + nestedPath[i] +"']})"
        }else{
          map = false;
          accessPath =  accessPath +  "['" + nestedPath[i] + "']";
        }
      }
    };

    accessFn = '__f = function(obj){ return '+ accessPath +'; }' ;
    eval(accessFn);
    return __f;
  };

  JQ.operators = {
    eq: function(v1, v2){ return v1 == v2},
    ne: function(v1, v2){ return v1 != v2},
    lt: function(v1, v2){ return v1 < v2},
    gt: function(v1, v2){ return v1 > v2},
    in: function(v1, v2){ return v2.indexOf(v1) > -1},
    ni: function(v1, v2){ return v2.indexOf(v1) == -1},
    li: function(v, regx) { return regx.test(v)},
    bt: function(v1, v2){ return (v1 > v2[0] && v1 < v2[1])}
  };

  JQ.arrayMatcher = function(rVal, cVal, cFn){
     var i = 0, l = rVal.length;

     for(i; i < l; i++){
       if(cFn(rVal[i], cVal)) return true;
     }
  };

  JQ.addCondition = function(name, func){
    this.operators[name] = func;
  };

  JQ.getCriteria = function(criteria){
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

  JQ._findAll = function(records, qField, cVal, cOpt){
    var i = 0, 
        l = records.length, 
        result = [],
        cFn,
        rVal,
        qFn = this.getPropFns[qField], arrayCFn;


    if(cOpt == 'li' && typeof cVal == 'string'){
      cVal = new RegExp(cVal);
    }else if(cOpt == 'eq' && Array.isArray(cVal)){
      cOpt = 'in';  
    }else if(cOpt == 'ne' && Array.isArray(cVal)){
      cOpt = 'ni';
    }

    cFn = this.operators[cOpt];

    if(this.schema[qField] == 'Array'){
      arrayCFn = cFn;
      cFn = this.arrayMatcher;
    }

    for(i; i< l; i++){
      rVal = qFn(records[i]);

      if(cFn(rVal, cVal, arrayCFn)) { 
        result.push(records[i]);
      }
    };

    return result; 
  };

  JQ.where = function(query){
    var result = this.data, c, fieldCondition;

    for(c in query){
      fieldCondition = this.getCriteria(c);
      result = this._findAll(result, fieldCondition.field, query[c], fieldCondition.operator);
    }

    return result;
  };


})(this);

