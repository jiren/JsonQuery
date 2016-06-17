export function eachProp(objs, callback, context){
  for (var key in objs) {
    if (hasOwnProperty.call(objs, key)) {
      callback.call(context, objs[key], key);
    }
  }
}

export function toTime(dates){
  if(Array.isArray(dates)){
    return dates.map(d => d ? new Date(d).getTime() : null);
  }

  return (dates ? new Date(dates).getTime() : null);
};

export function toObj(type, value){
  if(value == null){
    return value;
  }

  if(type == 'String'){
    return String(value);
  }else if(type == 'Number'){
    return Number(value)
  }else if(type == 'Boolean'){
    return (value == 'true' || value == true || value == '1');
  }else if(type == 'Date'){
    return new Date(value)
  }else{
    return value
  }
}

const TYPES = {
    'undefined' : 'undefined',
    'number'    : 'number',
    'boolean'   : 'boolean',
    'string'    : 'string',
    'Array'     : 'array',
    'Date'      : 'date',
    'RegExp'    : 'regexp',
    'Null'      : 'null'
};

const OBJ_STRING_FN = Object.prototype.toString;

export function getType(o) {
  return TYPES[typeof o] || TYPES[OBJ_STRING_FN.call(o).slice(8, -1)] || 'object';
}
