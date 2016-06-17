import { Query } from "./Query"
import { Operators } from './Operators'

var JsonQuery = {
  new(records, opts = {}){
    var q = new Query(records, opts);
    q.operators = Operators;
    return q;
  },

  addOperator(name, fn){
    if(name && fn){
      Operators[name] = fn;
    }
  }
}

module.exports = JsonQuery;
