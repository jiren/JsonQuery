(function(window) {

  'use strict';

  var JsonQuery = function(records){
      return new _JsonQuery(records);
  };

  window.JsonQuery = JsonQuery;

  JsonQuery.VERSION = '0.0.1'

  var nativeForEach = Array.prototype.forEach;
  var each = function(objs, callback, context){
    if(objs.forEach === nativeForEach){
      objs.forEach(callback, context);
    }else if (objs.length === +objs.length) {
      for (var i = 0, l = objs.length; i < l; i++) {
        callback.call(context, objs[i], i);
      }
    }else{
      for (var key in objs) {
        if (hasOwnProperty.call(objs, key)) {
          callback.call(context, objs[key], key);
        }
      }
    }
  }

  var _JsonQuery = function(records){
    this.records = records || [];
    this.schema = {};
    this.getFns = {};
    this.buildSchema(this.records[0])
    this.buildPropGetters(this.records[0]);
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

  JQ.buildPropGetters = function(record){
    var selector, type, propFn, rVal;

    for(selector in this.schema){
      type = this.schema[selector];

      if(type != 'Array' && type != 'Object'){
        this.getFns[selector] = this.buildGetPropFn(selector);
      }

      propFn = this.getFns[selector];
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

    if(this.getFns[field]){
      return this.getFns[field];
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
    lte: function(v1, v2){ return v1 <= v2},
    gt: function(v1, v2){ return v1 > v2},
    gte: function(v1, v2){ return v1 >= v2},
    in: function(v1, v2){ return v2.indexOf(v1) > -1},
    ni: function(v1, v2){ return v2.indexOf(v1) == -1},
    li: function(v, regx) { return regx.test(v)},
    bt: function(v1, v2){ return (v1 > v2[0] && v1 < v2[1])}
  };

  // rVal = Record Value
  // cVal = Condition Value
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


  JQ._findAll = function(records, qField, cVal, cOpt){
    var result = [],
        cFn,
        rVal,
        qFn = this.getFns[qField], arrayCFn;

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

    each(records, function(v){
      rVal = qFn(v);

      if(cFn(rVal, cVal, arrayCFn)) {
        result.push(v);
      }
    });

    return result;
  };

  each(['where', 'groupBy', 'select', 'pluck', 'limit', 'offset', 'order'], function(c){
    JQ[c] = function(query){
      var q = new Query(this, this.records);
      q[c](query)
      return q;
    };
  });

  Object.defineProperty(JQ, 'count', {
    get: function(){
       return this.records.length;
    }
  });

  Object.defineProperty(JQ, 'first', {
    get: function(){
           return this.records[0];
         }
  });

  Object.defineProperty(JQ, 'last', {
    get: function(){
           return this.records[this.records.length - 1];
         }
  });

  Object.defineProperty(JQ, 'all', {
    get: function(){
      return this.records;
    }
  });

  var execWhere = function(query, records){
    var q, criteria, result;

    for(q in query){
      criteria = this.jQ.getCriteria(q);
      result = this.jQ._findAll(result || records, criteria.field, query[q], criteria.operator);
    }

   return result;
  };

  var execGroupBy = function(field, records){
    var fn = this.jQ.getFns[field], v, result = {}, i = 0, l = records.length;

    each(records, function(r){
      v = fn(r);
      (result[v] || (result[v] = [])).push(r);
    });

    return result;
  };

  var execOrder = function(orders, records){
    var fn,
        direction,
        _records = records.slice(0);

    for(var i = 0, l = orders.length; i < l; i++){
      fn = this.jQ.getFns[orders[i].field],
        direction = orders[i].direction == 'asc' ? 1 : -1;

      _records.sort(function(r1,r2){
        var a = fn(r1), b = fn(r2);

        return (a < b ? -1 : a > b ? 1 : 0)*direction;
      })
    }

    return _records;
  };

  var execSelect = function(fields, records){
    var self = this, result = [], getFn;

    each(fields, function(f){
      getFn = self.jQ.getFns[f];

      each(records, function(r, i){
        (result[i] || (result[i] = {}))[f] = getFn(r);
      });
    });

    return result;
  };

  var execPluck = function(field, records){
    var getFn = this.jQ.getFns[field], result = [];

    each(records, function(r){
      result.push(getFn(r));
    });

    return result;
  };

  var Query = function(jQ, records){
    this.jQ = jQ;
    this.records = records;
    this.criteria = {};
    return this;
  };

  var Q = Query.prototype;

  Q.each = function(callback, context){
    each(this.exec() || [], callback, context)
  };

  Q.exec = Q.toArray = function(callback){
    var result, c;

    if(this.criteria['all']){
      result = this.records;
    }

    if(this.criteria['where']){
      result = execWhere.call(this, this.criteria['where'], result || this.records);
    }

    if(this.criteria['order']){
      result = execOrder.call(this, this.criteria['order'], result || this.records);
    }

    if(this.criteria['select']){
      result = execSelect.call(this, this.criteria['select'], result || this.records);
    }

    if(this.criteria['pluck']){
      result = execPluck.call(this, this.criteria['pluck'], result || this.records);
    }

    if(this.criteria['limit']){
      result = (result || this.records).slice(this.criteria['offset'] || 0, (this.criteria['offset'] || 0) + this.criteria['limit']);
    }

    if(this.criteria['group_by']){
      result = execGroupBy.call(this, this.criteria['group_by'], result || this.records);
    }

    if(callback){
      each(result || this.records, callback);
    };

    return result;
  }

  var addToCriteria = function(type, query){
    var c;

    if(!this.criteria[type]){
      this.criteria[type] = {};
    }

    for(c in query){
      this.criteria[type][c] = query[c];
    }

    return this;
  };

  Q.where = function(query){
    return addToCriteria.call(this, 'where', query);
  };

  Q.groupBy = function(field){
    this.criteria['group_by'] = field;
    return this;
  };

  Q.select = function(){
    this.criteria['select'] = arguments;
    return this;
  };

  Q.pluck = function(field){
    this.criteria['pluck'] = field;
    return this;
  };

  Q.limit = function(l){
    this.criteria['limit'] = l;
    return this;
  };

  Q.offset = function(o){
    this.criteria['offset'] = o;
    return this;
  };

  Q.order = function(criteria){
    var field;
    this.criteria['order'] = this.criteria['order'] || [];

    for(field in criteria){
      this.criteria['order'].push({field: field, direction: criteria[field]});
    }

    return this;
  };

  Object.defineProperty(Q, 'count', {
    get: function(){
      var r = this.exec();

      if(this.jQ.getDataType(r) == 'Array'){
        return this.exec().length;
      }else{
        return Object.keys(r).length;
      }
    }
  });

  Object.defineProperty(Q, 'first', {
    get: function(){
           return this.exec()[0];
         }
  });

  Object.defineProperty(Q, 'last', {
    get: function(){
           var r = this.exec();
           return r[r.length - 1];
         }
  });

})(this);

