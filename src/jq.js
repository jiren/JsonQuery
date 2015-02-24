var _JsonQuery = function(records, opts){
  this.records = records || [];
  this.getterFns = opts.getterFns || {};
  this.lat = opts.latitude || 'latitude';
  this.lng = opts.longitude || 'longitude'
  this.id = opts.id;

  if(this.records.length){
    initSchema(this, records[0], opts.schema);
  }
};

var JQ = _JsonQuery.prototype;

var initSchema = function(context, record, hasSchema){
  context.schema = {};

  if(!context.id){
    context.id = record._id ? '_id' : 'id';
  }

  if(!hasSchema){
    buildSchema.call(context, record);
    buildPropGetters.call(context, record);
  }
};

var getDataType = function(val){
  if(val == null){
    return 'String';
  }

  /*
   * @info Fix for IE 10 & 11
   * @bug Invalid calling object
   */
  var type = Object.prototype.toString.call(val).slice(8, -1);

  if(type == 'String' && val.match(/\d{4}-\d{2}-\d{2}/)){
    return 'Date';
  }

  return type;
};

var buildSchema = function(obj, parentField){
  var field, dataType, fullPath, fieldValue;

  for(field in obj){
    fieldValue = obj[field];
    dataType = getDataType(fieldValue);

    fullPath = parentField ? (parentField + '.' + field) : field;
    this.schema[fullPath] = dataType;

    if(dataType == 'Object'){
      buildSchema.call(this, fieldValue, fullPath);
    }else if(dataType == 'Array'){

      if(['Object', 'Array'].indexOf(getDataType(fieldValue[0])) > -1){
        buildSchema.call(this, obj[field][0], fullPath);
      }else{
        this.schema[fullPath] = getDataType(fieldValue[0]);
      }
    }
  }
};

var parseDate = function(dates){
  if(dates.constructor.name == 'Array'){
    return dates.map(function(d){  return (d ? new Date(d) : null ) });
  }
  return (dates ? new Date(dates) : null);
};

var buildPropGetters = function(record){
  var selector, type, val;

  for(selector in this.schema){
    type = this.schema[selector];

    try{
      if(!this.getterFns[selector]){
        this.getterFns[selector] = buildGetPropFn.call(this, selector, type);
      }

      //Remap if it is array
      val = this.getterFns[selector](record);
      if(getDataType(val) == 'Array'){
        this.schema[selector] = 'Array';
      }
    }catch(err){
      console.log("Error while generating getter function for selector : " + selector + " NOTE: Define manually");
    }
  }
};

var countArrHierarchy = function(schema, nestedPath){
  var lastArr = 0,
      arrCount = 0,
      path,
      pathLength = nestedPath.length - 1;

  for(var i = nestedPath.length - 1; i >= 0; i--){
    path = nestedPath.slice(0, i + 1).join('.');

    if(schema[path] == 'Array' && i < pathLength){
      lastArr = i;
      arrCount = arrCount + 1;
    }
  }
  return (arrCount > 1 ? (lastArr  + 1) : -1);
};

var buildGetPropFn = function(field, type){
  var accessPath = '',
      nestedPath = field.split('.'),
      path,
      lastArr = countArrHierarchy(this.schema, nestedPath),
      prefix,
      accessFnBody;

  for(var i = nestedPath.length - 1; i >= 0; i--){
    path = nestedPath.slice(0, i + 1).join('.');
    prefix = "['" + nestedPath[i] +"']";

    if(this.schema[path] == 'Array'){
      if(lastArr == i){
        accessPath = prefix + (accessPath.length ? ".every(function(r" + i +"){  objs.push(r" + i + accessPath + ")})" : '');
      }else{
        accessPath = prefix + (accessPath.length ? ".map(function(r" + i +"){  return r" + i + accessPath + "})" : '');
      }
    }else{
      accessPath = prefix + accessPath;
    }
  }

  if(lastArr > -1){
    accessFnBody = 'var objs = []; obj' + accessPath + ';' + (this.schema['path'] == 'Date' ?  'return parseDate(objs)'  :  'return objs;');
  }else{
    accessFnBody = 'return ' + (this.schema['path'] == 'Date' ? 'parseDate(obj'+ accessPath +');' : 'obj'+ accessPath +';') ;
  }

  return new Function('obj', accessFnBody);
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
  bt: function(v1, v2){ return (v1 >= v2[0] && v1 <= v2[1])}
};

JQ.addOperator = function(name, fn){
  this.operators[name] = fn;
};

// rVal = Record Value
// cVal = Condition Value
var arrayMatcher = function(rVal, cVal, cFn){
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

JQ.setGetterFn = function(field, fn){
  this.getterFns[field] = fn;
};

JQ.addRecords = function(records){
  if(!records || !records.length){
    return false;
  }

  if(getDataType(records) == 'Array'){
    this.records = this.records.concat(records);
  }else{
    this.records.push(records);
  }

  if(!this.schema){
    initSchema(this, records[0]);
  }

  return true;
};

JQ._findAll = function(records, qField, cVal, cOpt){
  var result = [],
      cFn,
      rVal,
      qFn = this.getterFns[qField], arrayCFn;

  if(cOpt == 'li' && typeof cVal == 'string'){
    cVal = new RegExp(cVal);
  }

  cFn = this.operators[cOpt];

  if(this.schema[qField] == 'Array'){
    arrayCFn = cFn;
    cFn = arrayMatcher;
  }

  each(records, function(v){
    rVal = qFn(v);

    if(cFn(rVal, cVal, arrayCFn)) {
      result.push(v);
    }
  });

  return result;
};

JQ.find = function(field, value){
  var result, qFn;

  if(!value){
    value = field;
    field = this.id;
  }

  qFn = this.getterFns[field];

  eachWithBreak(this.records, function(r){
    if(qFn(r) == value){
      result = r;
      return false;
    }
  });

  return result;
};

each(['where', 'or', 'groupBy', 'select', 'pluck', 'limit', 'offset', 'order', 'uniq', 'near'], function(c){
  JQ[c] = function(query){
    var q = new Query(this, this.records);
    q[c].apply(q, arguments);
    return q;
  };
});

each(['update_all', 'destroy_all'], function(c){
  JQ[c] = function(query){
    var q = new Query(this, this.records);
    return q[c].apply(q, arguments);
  };
});

each(['count', 'first', 'last', 'all'], function(c){
  Object.defineProperty(JQ, c, {
    get: function(){
      return (new Query(this, this.records))[c];
    }
  });
});

var compareObj = function(obj1, obj2, fields){
  for(var i = 0, l = fields.length; i < l; i++){
    if(this.getterFns[fields[i]](obj1) !== this.getterFns[fields[i]](obj2)){
      return false;
    }
  }

  return true;
};

var execWhere = function(query, records){
  var q, criteria, result;

  for(q in query){
    criteria = this.jQ.getCriteria(q);
    result = this.jQ._findAll(result || records, criteria.field, query[q], criteria.operator);
  }

 return result;
};

var execGroupBy = function(field, records){
  var fn = this.jQ.getterFns[field], v, result = {}, i = 0, l = records.length;

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
    fn = this.jQ.getterFns[orders[i].field],
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
    getFn = self.jQ.getterFns[f];

    each(records, function(r, i){
      (result[i] || (result[i] = {}))[f] = getFn(r);
    });
  });

  return result;
};

var execPluck = function(field, records){
  var getFn = this.jQ.getterFns[field], result = [];

  each(records, function(r){
    result.push(getFn(r));
  });

  return result;
};

var execUniq = function(fields, records){
  var result = [], self = this;

  if(getDataType(records[0]) != 'Object'){
    each(records, function(r){
      if(result.indexOf(r) == -1){
        result.push(r);
      }
    });

    return result;
  }

  result.push(records[0]);

  each(records, function(r){
    var present = false;

    for(var i = 0, l = result.length; i < l; i++){
      if(compareObj.call(self.jQ, result[i], r, fields)){
        present = true;
      }
    }

    if(!present){
      result.push(r);
    }
  });

  return result;
};

