import { FieldAccessor } from './FieldAccessor'
import * as Util from './Util' 
import { GeoUtil } from './GeoUtil'

export class Finder{
  constructor(operators, opts){
    this.operators = operators;
    this.opts = opts;
  }

  getOperator(condition){
    var arr = condition.split('.$');

    return {
      field: arr[0],
      operatorFn: this.operators[arr[1] || 'eq']
    }
  }

  isDate(obj){
    obj = Array.isArray(obj) ? obj[0] : obj;
    return Util.getType(obj) == 'date';
  }

  findAll(records, field, cValue, operatorFn){
    var result = [],
        i = 0,
        l = records.length,
        isValueDate = this.isDate(cValue), 
        rValue;

    if(isValueDate){
      cValue = Util.toTime(cValue);
    }

    for(i = 0; i < l; i++){
      rValue = FieldAccessor.get(field, records[i]);

      if(rValue && isValueDate){
        rValue = Util.toTime(rValue);
      }

      if(this.checkConditon(rValue, cValue, operatorFn)){
        result.push(records[i]);
      }
    }

    return result;
  }

  checkConditon(rValue, cValue, operatorFn){
    if(!Array.isArray(rValue)){
      return operatorFn(rValue, cValue);
    }

    for(var i = 0, l = rValue.length; i < l; i++){
      if(operatorFn(rValue[i], cValue)){
        return true;
      }
    }

    return false;
  }

  buildCriteriaOpts(criteria){
    var criteriaOpts = [];

    for(var qPath in criteria){
      var opts = this.getOperator(qPath);
      opts.value = criteria[qPath];

      if(this.isDate(opts.value)){
        opts.isValueDate = true;
        opts.value = Util.getTime(opts.value);
      }

      criteriaOpts.push(opts);
    }

    return criteriaOpts;
  }


  findWithLimit(records, criteria, limit, offset){
    var result = [],
        criteriaOpts = this.buildCriteriaOpts(criteria),
        rValue,
        matched,
        record,
        _limit,
        i = limit == -1 ? -(records.length - 1) : 0, 
        l = limit == -1 ? 1 : records.length,
        cI, 
        cL = criteriaOpts.length,
        opts,
        matchCount = 0;

    if(limit){
      _limit = Math.abs(limit);
    }

    for(i; i < l; i++){
      matched = true;
      record = records[Math.abs(i)];

      for(cI = 0; cI < cL; cI++){
        opts = criteriaOpts[cI];
        rValue = FieldAccessor.get(opts.field, record);

        if(opts.isValueDate){
          rValue = Util.toTime(rValue);
        }

        matched = matched && this.checkConditon(rValue, opts.value, opts.operatorFn);
      }

      if(matched){
        matchCount++;

        if(!offset || (matchCount > offset)){
          result.push(record);
        }

        if(result.length == _limit){
          break;
        }
      }
    }

    return result;
  }

  where(records, criteria, limit, offset){
    var result = records, opts, qPath; 

    if(limit){
      return this.findWithLimit(result, criteria, limit, offset)
    }

    for(qPath in criteria){
      opts = this.getOperator(qPath);
      result = this.findAll(result, opts.field, criteria[qPath], opts.operatorFn);
    }

    return result;
  }

  near(records, opts){
    var result = [],
        { latitude, longitude, distance, unit } = opts;

    if(unit == 'mile'){
      distance = GeoUtil.mileToKm(distance);
    }

    for(let i = 0, l = records.length; i < l; i++){
      records[i]._distance_ = GeoUtil.calculateDistance(latitude, 
                                        FieldAccessor.get(this.opts.latitude, records[i]), 
                                        longitude,
                                        FieldAccessor.get(this.opts.longitude, records[i]));

      if(records[i]._distance_ <= distance){
        result.push(records[i]);
      }
    }    
      
    result.sort(function(a, b){
      return (a._distance_ < b._distance_ ? -1 : a._distance_ > b._distance_ ? 1 : 0);
    })
   
    return result; 
  }

  static find(records, field, value){
    for(let i = 0, l = records.length; i < l; i++){
      if(FieldAccessor.get(field, records[i]) == value){
        return records[i];
      }
    }

    return null;
  }

}
