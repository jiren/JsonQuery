/*
 * JsonQuery
 * 0.0.2 (2016-06-17)
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Copyright 2011-2016 Jiren Patel[jirenpatel@gmail.com]
 *
 */

!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.JsonQuery=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Aggregator = undefined;

var _FieldAccessor = _dereq_('./FieldAccessor');

var Aggregator = exports.Aggregator = {
  uniq: function uniq(records, field) {
    var uniqRecords = [],
        keyMap = {},
        record;

    for (var i = 0, l = records.length; i < l; i++) {
      record = records[i];

      if (!keyMap[record[field]]) {
        uniqRecords.push(record);
        keyMap[record[field]] = true;
      }
    }

    return uniqRecords;
  },
  groupBy: function groupBy(records, field) {
    var result = {},
        record,
        value;

    for (var i = 0, l = records.length; i < l; i++) {
      record = records[i];
      value = record[field];

      if (!result[value]) {
        result[value] = [];
      }

      result[value].push(record);
    }

    return result;
  },
  order: function order(records, options) {
    var weight = options.direction == 'desc' ? 1 : -1,
        field = options.field,
        v1,
        v2;

    return records.slice(0).sort(function (r1, r2) {
      v1 = _FieldAccessor.FieldAccessor.get(field, r2);
      v2 = _FieldAccessor.FieldAccessor.get(field, r1);;

      return (v1 < v2 ? -1 : v1 > v2 ? 1 : 0) * weight;
    });
  },
  sum: function sum(records, field) {
    var result = 0,
        value;

    for (var i = 0, l = records.length; i < l; i++) {
      value = _FieldAccessor.FieldAccessor.get(field, records[i]);

      if (value) {
        result = result + value;
      }
    }

    return result;
  }
};

},{"./FieldAccessor":3}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEFAULT = exports.DEFAULT = {
  id: 'id',
  latitude: 'latitude',
  longitude: 'longitude'
};

},{}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getValuesFromArray(paths, arr) {
  return arr.map(function (obj) {
    return getValue(paths, obj);
  });
}

function getValue(paths, obj) {
  var currentValue = obj,
      i = 0,
      l = paths.length;

  for (i = 0; i < l; i++) {
    currentValue = currentValue[paths[i]];

    if (!currentValue) {
      return currentValue;
    } else if (Array.isArray(currentValue) && i < l) {
      return getValuesFromArray(paths.slice(i + 1, l), currentValue);
    }
  }

  if (Array.isArray(currentValue)) {
    currentValue = [].concat.apply([], currentValue);
  }

  return currentValue;
}

function findByPath(accessor, obj) {
  var paths = accessor.split('.'),
      value;

  if (paths.length == 1) {
    return obj[accessor];
  }

  value = getValue(paths, obj);

  if (Array.isArray(value)) {
    value = [].concat.apply([], value);
  }

  return value;
  //return getValue(paths, obj);
}

var FieldAccessor = exports.FieldAccessor = {
  get: findByPath
};

},{}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Finder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _FieldAccessor = _dereq_('./FieldAccessor');

var _Util = _dereq_('./Util');

var Util = _interopRequireWildcard(_Util);

var _GeoUtil = _dereq_('./GeoUtil');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Finder = exports.Finder = function () {
  function Finder(operators, opts) {
    _classCallCheck(this, Finder);

    this.operators = operators;
    this.opts = opts;
  }

  _createClass(Finder, [{
    key: 'getOperator',
    value: function getOperator(condition) {
      var arr = condition.split('.$');

      return {
        field: arr[0],
        operatorFn: this.operators[arr[1] || 'eq']
      };
    }
  }, {
    key: 'isDate',
    value: function isDate(obj) {
      obj = Array.isArray(obj) ? obj[0] : obj;
      return Util.getType(obj) == 'date';
    }
  }, {
    key: 'findAll',
    value: function findAll(records, field, cValue, operatorFn) {
      var result = [],
          i = 0,
          l = records.length,
          isValueDate = this.isDate(cValue),
          rValue;

      if (isValueDate) {
        cValue = Util.toTime(cValue);
      }

      for (i = 0; i < l; i++) {
        rValue = _FieldAccessor.FieldAccessor.get(field, records[i]);

        if (rValue && isValueDate) {
          rValue = Util.toTime(rValue);
        }

        if (this.checkConditon(rValue, cValue, operatorFn)) {
          result.push(records[i]);
        }
      }

      return result;
    }
  }, {
    key: 'checkConditon',
    value: function checkConditon(rValue, cValue, operatorFn) {
      if (!Array.isArray(rValue)) {
        return operatorFn(rValue, cValue);
      }

      for (var i = 0, l = rValue.length; i < l; i++) {
        if (operatorFn(rValue[i], cValue)) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: 'buildCriteriaOpts',
    value: function buildCriteriaOpts(criteria) {
      var criteriaOpts = [];

      for (var qPath in criteria) {
        var opts = this.getOperator(qPath);
        opts.value = criteria[qPath];

        if (this.isDate(opts.value)) {
          opts.isValueDate = true;
          opts.value = Util.getTime(opts.value);
        }

        criteriaOpts.push(opts);
      }

      return criteriaOpts;
    }
  }, {
    key: 'findWithLimit',
    value: function findWithLimit(records, criteria, limit, offset) {
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

      if (limit) {
        _limit = Math.abs(limit);
      }

      for (i; i < l; i++) {
        matched = true;
        record = records[Math.abs(i)];

        for (cI = 0; cI < cL; cI++) {
          opts = criteriaOpts[cI];
          rValue = _FieldAccessor.FieldAccessor.get(opts.field, record);

          if (opts.isValueDate) {
            rValue = Util.toTime(rValue);
          }

          matched = matched && this.checkConditon(rValue, opts.value, opts.operatorFn);
        }

        if (matched) {
          matchCount++;

          if (!offset || matchCount > offset) {
            result.push(record);
          }

          if (result.length == _limit) {
            break;
          }
        }
      }

      return result;
    }
  }, {
    key: 'where',
    value: function where(records, criteria, limit, offset) {
      var result = records,
          opts,
          qPath;

      if (limit) {
        return this.findWithLimit(result, criteria, limit, offset);
      }

      for (qPath in criteria) {
        opts = this.getOperator(qPath);
        result = this.findAll(result, opts.field, criteria[qPath], opts.operatorFn);
      }

      return result;
    }
  }, {
    key: 'near',
    value: function near(records, opts) {
      var result = [];
      var latitude = opts.latitude;
      var longitude = opts.longitude;
      var distance = opts.distance;
      var unit = opts.unit;


      if (unit == 'mile') {
        distance = _GeoUtil.GeoUtil.mileToKm(distance);
      }

      for (var i = 0, l = records.length; i < l; i++) {
        records[i]._distance_ = _GeoUtil.GeoUtil.calculateDistance(latitude, _FieldAccessor.FieldAccessor.get(this.opts.latitude, records[i]), longitude, _FieldAccessor.FieldAccessor.get(this.opts.longitude, records[i]));

        if (records[i]._distance_ <= distance) {
          result.push(records[i]);
        }
      }

      result.sort(function (a, b) {
        return a._distance_ < b._distance_ ? -1 : a._distance_ > b._distance_ ? 1 : 0;
      });

      return result;
    }
  }], [{
    key: 'find',
    value: function find(records, field, value) {
      for (var i = 0, l = records.length; i < l; i++) {
        if (_FieldAccessor.FieldAccessor.get(field, records[i]) == value) {
          return records[i];
        }
      }

      return null;
    }
  }]);

  return Finder;
}();

},{"./FieldAccessor":3,"./GeoUtil":5,"./Util":8}],5:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

//Geocoding
var GeoUtil = exports.GeoUtil = {
  toRad: function toRad(value) {
    return value * Math.PI / 180;
  },
  calculateDistance: function calculateDistance(lat1, lat2, lng1, lng2) {
    var dLat = this.toRad(lat2 - lat1),
        dLon = this.toRad(lng2 - lng1),
        lat1 = this.toRad(lat1),
        lat2 = this.toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 6371; // 6371 Earth radius in km
  },
  mileToKm: function mileToKm(distance) {
    return 1.60934 * distance;
  }
};

},{}],6:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Conditional operators to check condition
 * 
 * @param {object} rv - Record value
 * @param {object} cv - Condition value
*/
var Operators = exports.Operators = {
  /* Equal */

  eq: function eq(rv, cv) {
    return rv == cv;
  },


  /* Not Equal */
  ne: function ne(rv, cv) {
    return rv != cv;
  },


  /* Less than */
  lt: function lt(rv, cv) {
    return rv < cv;
  },


  /* Less than equal */
  lte: function lte(rv, cv) {
    return rv <= cv;
  },


  /* Greather than */
  gt: function gt(rv, cv) {
    return rv > cv;
  },


  /* Greather than equal */
  gte: function gte(rv, cv) {
    return rv >= cv;
  },


  /* Array include */
  in: function _in(rv, cv) {
    return cv.indexOf(rv) > -1;
  },


  /* Array not in  */
  ni: function ni(rv, cv) {
    return cv.indexOf(rv) == -1;
  },


  /** 
   * Regular Expression 
   * @param {object} rv - Record value
   * @param {RegExp} cv - Condition value
   */
  li: function li(rv, cv) {
    return cv.test(rv);
  },


  /**
   * Range between.
   * @param {object} rv - Record value
   * @param {Array}  range - Condition value
   */
  bt: function bt(rv, range) {
    return rv >= range[0] && rv <= range[1];
  }
};

},{}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Query = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Defaults = _dereq_('./Defaults');

var _Finder = _dereq_('./Finder');

var _Aggregator = _dereq_('./Aggregator');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Query = exports.Query = function () {
  function Query(records, opts) {
    _classCallCheck(this, Query);

    this.records = records;
    this.criteria = {};
    this.opts = opts;

    for (var field in _Defaults.DEFAULT) {
      this.opts[field] = opts[field] || _Defaults.DEFAULT[field];
    }
  }

  _createClass(Query, [{
    key: '_addCriteria',
    value: function _addCriteria(type, query) {
      if (!this.criteria[type]) {
        this.criteria[type] = query;
      } else {
        for (var c in query) {
          this.criteria[type][c] = query[c];
        }
      }

      return this;
    }
  }, {
    key: 'where',
    value: function where(query) {
      if (!query) {
        throw new TypeError("Must required criteria i.e where({ name: 'Test')");
      }

      return this._addCriteria('where', query);
    }
  }, {
    key: 'find',
    value: function find(field, value) {
      if (arguments.length > 2) {
        throw new TypeError("To many argument. i.e find(10). i.e find('rating', 8.4)");
      }

      if (arguments.length == 1) {
        value = field;
        field = this.opts.id;
      }

      return _Finder.Finder.find(this.records, field, value);
    }
  }, {
    key: 'limit',
    value: function limit(value) {
      this.criteria['limit'] = value;
      return this;
    }
  }, {
    key: 'offset',
    value: function offset(value) {
      this.criteria['offset'] = value;
      return this;
    }
  }, {
    key: 'pluck',
    value: function pluck() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = this.all;

      if (args.length == 0) {
        throw new TypeError("Must required fields. i.e pluck('name'), pluck('contact_number', 'address', 'email')");
      }

      if (args.length == 1) {
        return result.map(function (r) {
          return r[args[0]];
        });
      }

      return result.map(function (r) {
        return args.map(function (a) {
          return r[a];
        });
      });
    }
  }, {
    key: 'uniq',
    value: function uniq(field) {
      if (field) {
        this.criteria['uniq'] = field;
      }
      return this;
    }
  }, {
    key: 'groupBy',
    value: function groupBy(field) {
      if (field) {
        this.criteria['groupBy'] = field;
      }

      return this;
    }
  }, {
    key: 'desc',
    value: function desc(field) {
      if (field) {
        this.criteria['order'] = { field: field, direction: 'desc' };
      } else {
        throw new TypeError("Must required argument field i.e desc('name')");
      }

      return this;
    }
  }, {
    key: 'asc',
    value: function asc(field) {
      if (field) {
        this.criteria['order'] = { field: field, direction: 'asc' };
      } else {
        throw new TypeError("Must required argument field i.e asc('name')");
      }

      return this;
    }
  }, {
    key: 'sum',
    value: function sum(field) {
      if (!field) {
        throw new TypeError("Must required argument field i.e sum('name')");
      }

      return _Aggregator.Aggregator.sum(this.all, field);
    }
  }, {
    key: 'near',
    value: function near(latitude, longitude, distance) {
      var unit = arguments.length <= 3 || arguments[3] === undefined ? 'km' : arguments[3];

      this.criteria['near'] = { latitude: latitude, longitude: longitude, distance: distance, unit: unit };
      return this;
    }
  }, {
    key: 'each',
    value: function each(callback) {
      if (!callback) {
        throw new TypeError("Required callback function");
      }

      var result = this.all;

      for (var i = 0, l = result.length; i < l; i++) {
        callback(result[i], i);
      }
    }
  }, {
    key: 'toJQ',
    value: function toJQ() {
      var q = new Query(this.all, this.opts);
      q.operators = this.operators;
      return q;
    }
  }, {
    key: 'all',
    get: function get() {
      var result = this.records,
          finder = new _Finder.Finder(this.operators, this.opts),
          criteria = this.criteria;

      if (criteria['where'] || criteria['limit']) {
        result = finder.where(result, criteria['where'], criteria['limit'], criteria['offset']);
      }

      if (criteria['uniq']) {
        result = _Aggregator.Aggregator.uniq(result, criteria['uniq']);
      }

      if (criteria['near']) {
        result = finder.near(result, criteria['near']);
      }

      if (criteria['order']) {
        result = _Aggregator.Aggregator.order(result, criteria['order']);
      }

      if (criteria['groupBy']) {
        result = _Aggregator.Aggregator.groupBy(result, criteria['groupBy']);
      }

      this.criteria = {};

      return result;
    }
  }, {
    key: 'first',
    get: function get() {
      this.criteria['limit'] = 1;
      return this.all[0];
    }
  }, {
    key: 'last',
    get: function get() {
      this.criteria['limit'] = -1;
      return this.all[0];
    }
  }]);

  return Query;
}();

},{"./Aggregator":1,"./Defaults":2,"./Finder":4}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.eachProp = eachProp;
exports.toTime = toTime;
exports.toObj = toObj;
exports.getType = getType;
function eachProp(objs, callback, context) {
  for (var key in objs) {
    if (hasOwnProperty.call(objs, key)) {
      callback.call(context, objs[key], key);
    }
  }
}

function toTime(dates) {
  if (Array.isArray(dates)) {
    return dates.map(function (d) {
      return d ? new Date(d).getTime() : null;
    });
  }

  return dates ? new Date(dates).getTime() : null;
};

function toObj(type, value) {
  if (value == null) {
    return value;
  }

  if (type == 'String') {
    return String(value);
  } else if (type == 'Number') {
    return Number(value);
  } else if (type == 'Boolean') {
    return value == 'true' || value == true || value == '1';
  } else if (type == 'Date') {
    return new Date(value);
  } else {
    return value;
  }
}

var TYPES = {
  'undefined': 'undefined',
  'number': 'number',
  'boolean': 'boolean',
  'string': 'string',
  'Array': 'array',
  'Date': 'date',
  'RegExp': 'regexp',
  'Null': 'null'
};

var OBJ_STRING_FN = Object.prototype.toString;

function getType(o) {
  return TYPES[typeof o === 'undefined' ? 'undefined' : _typeof(o)] || TYPES[OBJ_STRING_FN.call(o).slice(8, -1)] || 'object';
}

},{}],9:[function(_dereq_,module,exports){
"use strict";

var _Query = _dereq_("./Query");

var _Operators = _dereq_("./Operators");

var JsonQuery = {
  new: function _new(records) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var q = new _Query.Query(records, opts);
    q.operators = _Operators.Operators;
    return q;
  },
  addOperator: function addOperator(name, fn) {
    if (name && fn) {
      _Operators.Operators[name] = fn;
    }
  }
};

module.exports = JsonQuery;

},{"./Operators":6,"./Query":7}]},{},[9])
(9)
});