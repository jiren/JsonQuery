import { FieldAccessor } from './FieldAccessor'

export const Aggregator = {
  uniq(records, field){
    var uniqRecords = [],
        keyMap = {},
        record;

    for(var i = 0, l = records.length; i < l; i++){
      record = records[i];

      if(!keyMap[record[field]]){
        uniqRecords.push(record);
        keyMap[record[field]] = true
      }
    }

    return uniqRecords;
  },

  groupBy(records, field){
    var result = {}, record, value;

    for(var i = 0, l = records.length; i < l; i++){
      record = records[i];
      value = record[field];

      if(!result[value]){
        result[value] = [];
      }

      result[value].push(record);
    }
    
    return result;
  },

  order(records, options){
    var weight = options.direction == 'desc' ? 1 : -1,
        field = options.field,
        v1, v2;

    return records.slice(0).sort(function(r1,r2){
      v1 = FieldAccessor.get(field, r2);
      v2 = FieldAccessor.get(field, r1);;

      return (v1 < v2 ? -1 : v1 > v2 ? 1 : 0)*weight;
    })
  },

  sum(records, field){
    var result = 0, value;

    for(var i = 0, l = records.length; i < l; i++){
      value = FieldAccessor.get(field, records[i])
      
      if(value){
        result = result + value;
      }
    }

    return result;
  }
}
