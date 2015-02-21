var each = function(objs, callback, context){
  if (objs.length === +objs.length) {
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
};

var eachWithBreak = function(objs, callback, context){
  for (var i = 0, l = objs.length; i < l; i++) {
    if(callback.call(context, objs[i], i) === false){
      return;
    }
  }
};

