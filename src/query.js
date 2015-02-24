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

  if(this.criteria['or']){
    result = result.concat(execWhere.call(this, this.criteria['or'], this.records));
    result = execUniq.call(this, [this.jQ.id], result);
  }

  if(this.criteria['order']){
    result = execOrder.call(this, this.criteria['order'], result || this.records);
  }

  if(this.criteria['near']){
    result = execNear.call(this, this.criteria['near'], result || this.records);
  }

  if(this.criteria['uniq']){
    result = execUniq.call(this, this.criteria['uniq'], result || this.records);
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

  if(!result){
    result = this.records;
  }

  if(callback){
    each(result, callback);
  }

  if(this.jQ.onResult){
    this.jQ.onResult(result, this.criteria);
  }

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

Q.or = function(query){
  return addToCriteria.call(this, 'or', query);
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
    this.criteria['order'].push({field: field, direction: criteria[field].toLowerCase()});
  }

  return this;
};

Q.uniq = function(){
  this.criteria['uniq'] = (arguments.length > 0 ? arguments : true);
  return this;
};

Object.defineProperty(Q, 'count', {
  get: function(){
    this.criteria['count'] = true;
    var r = this.exec();

    if(getDataType(r) == 'Array'){
      return this.exec().length;
    }else{
      return Object.keys(r).length;
    }
  }
});

Object.defineProperty(Q, 'all', {
  get: function(){
    this.criteria['all'] = true;
    return this.exec();
  }
});

Object.defineProperty(Q, 'first', {
  get: function(){
    this.criteria['first'] = true;
    return this.exec()[0];
  }
});

Object.defineProperty(Q, 'last', {
  get: function(){
    this.criteria['last'] = true;
    var r = this.exec();
    return r[r.length - 1];
  }
});

//Geocoding
var GEO = {
  redius: 6371,
  toRad: function(v){
    return v * Math.PI / 180;
  }
};

var calculateDistance = function(lat1, lat2, lng1, lng2){
  var dLat = GEO.toRad(lat2 - lat1),
      dLon = GEO.toRad(lng2 - lng1),
      lat1 = GEO.toRad(lat1),
      lat2 = GEO.toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);

  return (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))) * GEO.redius;
};

var execNear = function(opts, records){
  var result = [],
      self = this,
      unit_c = opts.unit == 'mile' ? 0.6214 : 1,
      latFn = self.jQ.getterFns[self.jQ.lat],
      lngFn = self.jQ.getterFns[self.jQ.lng];

  each(records, function(r){
    r._distance = calculateDistance(latFn(r), opts.lat, lngFn(r), opts.lng) * unit_c;

    if(r._distance <= opts.distance){
      result.push(r);
    }
  });

  result.sort(function(a, b){
    return (a._distance < b._distance ? -1 : a._distance > b._distance ? 1 : 0);
  })

  return result;
};

Q.near = function(lat, lng, distance, unit){
  this.criteria['near'] = {lat: lat, lng: lng, distance: distance, unit: (unit || 'km')};
  return this;
};

//Helpers
Q.map = Q.collect = function(fn){
  var result = [], out;

  this.exec(function(r){
    if(out = fn(r)){
      result.push(out);
    }
  })
  return result;
};

Q.sum = function(field){
  var result = 0,
      group,
      getFn = this.jQ.getterFns[field];

  if(this.criteria['group_by']){
    group = true;
    result = {};
  }

  this.exec(function(r, i){
    if(group){
      result[i] = 0;

      each(r, function(e){
        result[i] = result[i] + (getFn(e) || 0);
      })
    }else{
      result = result + (getFn(r) || 0);
    }
  });

  return result;
};

Q.toJQ = function(){
  var q = JsonQuery(this.all, {schema: true});
  q.schema = this.jQ.schema;
  q.getterFns = this.jQ.getterFns;

  return q;
};

Q.destroy_all = Q.destroy = function(){
  var marked_records = this.all;

  each(marked_records, function(r, i){
    r._destroy_ = true;
  });

  this.records = this.jQ.records = this.records.filter(function(r){
    return !r._destroy_; 
  });

  return marked_records;
};

Q.update_all = Q.update = function(attrs){
  if(!attrs){
    return false;
  }

  var updated_count = 0;

  each(this.all, function(r){
    each(attrs, function(value, key){
      r[key] = value;
    });
    updated_count = updated_count + 1;
  });
  
  return updated_count;
};
