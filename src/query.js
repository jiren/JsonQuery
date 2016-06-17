import { DEFAULT } from './Defaults'
import { Finder } from './Finder'
import { Aggregator } from './Aggregator'

export class Query{
  constructor(records, opts){
    this.records = records;
    this.criteria = {};
    this.opts = opts;

    for(var field in DEFAULT){  
      this.opts[field] = opts[field] || DEFAULT[field];
    }
  }

  _addCriteria(type, query){
    if(!this.criteria[type]){
      this.criteria[type] = query;
    }else{
      for(var c in query){
        this.criteria[type][c] = query[c];
      }
    }

    return this;
  }

  where(query){
    if(!query){
      throw new TypeError("Must required criteria i.e where({ name: 'Test')")
    }

    return this._addCriteria('where', query);
  }  

  get all(){
    var result = this.records,
        finder = new Finder(this.operators, this.opts),
        criteria = this.criteria;

    if(criteria['where'] || criteria['limit']){
      result = finder.where(result, criteria['where'], criteria['limit'], criteria['offset']);
    }

    if(criteria['uniq']){
      result = Aggregator.uniq(result, criteria['uniq']);
    }

    if(criteria['near']){
      result = finder.near(result, criteria['near']);
    }
  
    if(criteria['order']){
      result = Aggregator.order(result, criteria['order']);
    }
    
    if(criteria['groupBy']){
      result = Aggregator.groupBy(result, criteria['groupBy']);
    }

    this.criteria = {};

    return result;
  }

  get first(){
    this.criteria['limit'] = 1;
    return this.all[0];
  }

  get last(){
    this.criteria['limit'] = -1;
    return this.all[0];
  }

  find(field, value){
    if(arguments.length > 2){
      throw new TypeError("To many argument. i.e find(10). i.e find('rating', 8.4)");
    }

    if(arguments.length == 1){
      value = field;
      field = this.opts.id;
    }

    return Finder.find(this.records, field, value);
  }

  limit(value){
    this.criteria['limit'] = value
    return this;
  }

  offset(value){
    this.criteria['offset'] = value;
    return this;
  }

  pluck(...args){
    var result = this.all;

    if(args.length == 0){
      throw new TypeError("Must required fields. i.e pluck('name'), pluck('contact_number', 'address', 'email')");
    }

    if(args.length == 1){
      return result.map( r => { return r[args[0]] } );
    }

    return result.map( r => {
      return args.map( a => { return r[a]})
    })    
  }

  uniq(field){
    if(field){
      this.criteria['uniq'] = field;
    }
    return this;
  }

  groupBy(field){
    if(field){
      this.criteria['groupBy'] = field;
    }

    return this;
  }

  desc(field){
    if(field){
      this.criteria['order'] = {field: field, direction: 'desc'};
    }else{
      throw new TypeError("Must required argument field i.e desc('name')")
    }

    return this;
  }

  asc(field){
    if(field){
      this.criteria['order'] = {field: field, direction: 'asc'};
    }else{
      throw new TypeError("Must required argument field i.e asc('name')")
    }

    return this;
  }

  sum(field){
    if(!field){
      throw new TypeError("Must required argument field i.e sum('name')")
    }

    return Aggregator.sum(this.all, field);
  }

  near(latitude, longitude, distance, unit = 'km'){
    this.criteria['near'] = {latitude: latitude, longitude: longitude, distance: distance, unit: unit};
    return this;
  }

  each(callback){
    if(!callback){
      throw new TypeError("Required callback function")
    }

    var result = this.all;

    for(let i = 0, l = result.length; i < l; i++){
      callback(result[i], i);
    }
  }

  toJQ(){
    var q = new Query(this.all, this.opts);
    q.operators = this.operators;
    return q;
  }

}
