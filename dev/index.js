document.getElementsByTagName('body')[0].innerText = ''

var parallelEach = function(objs, parallel, callback, context){
  var l = objs.length,
      odd = false; 

  if(parallel && parallel > 1){
    l = Math.floor(objs.length / parallel);
    odd = (objs.length / parallel) == (parallel - 1);
  }

  //console.log('--------------')
  //console.log('Divided Length : ' + l + ' , Odd : ' + odd);


  for (var i = 0; i < l; i++) {
    callback.call(context, objs[i], i);
    //callback.call(context, objs[i+l], l+i);
    //callback.call(context, objs[i+l*2], l+i);
    //callback.call(context, objs[i+l*3], l+i);
  }
};

function run(){
  parallelEach(movies, 1, function(m, i){
    //console.log(m.name)
    console.log(i)
  })
}

BenchMark('parallel#1', 1, run, this);
