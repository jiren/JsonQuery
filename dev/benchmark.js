
function BenchMark(label, iterations, fns, context){
  var t1 = new Date(), time;

  while(iterations--){
    fns.call(context)
  }

  time = (new Date()) - t1;

  dispalyBenchMake(time)
}

function dispalyBenchMake(time, label){
  var h3 = document.createElement( 'h3' );
  h3.innerText = label + ' : ' + time + ' ms'

  document.getElementsByTagName('body')[0].appendChild(h3)
}
