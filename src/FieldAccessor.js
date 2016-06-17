function getValuesFromArray(paths, arr){
  return arr.map(obj => {
    return getValue(paths, obj);
  })
}

function getValue(paths, obj){
  var currentValue = obj, 
      i = 0,
      l = paths.length;

  for(i = 0; i < l; i++){
    currentValue = currentValue[paths[i]];

    if(!currentValue){
      return currentValue;
    }else if(Array.isArray(currentValue) && i < l){
      return getValuesFromArray( paths.slice( i + 1, l), currentValue);
    }
  }

  if(Array.isArray(currentValue)){
    currentValue = [].concat.apply([], currentValue);
  }

  return currentValue;
}

function findByPath(accessor, obj){
  var paths = accessor.split('.'), value;

  if(paths.length == 1){
    return obj[accessor];
  }

  value = getValue(paths, obj);

  if(Array.isArray(value)){
    value = [].concat.apply([], value);
  }

  return value;
  //return getValue(paths, obj);
}


export const FieldAccessor = {
  get: findByPath
}
