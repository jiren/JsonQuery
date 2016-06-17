var TYPES = {
    'undefined' : 'undefined',
    'number'    : 'number',
    'boolean'   : 'boolean',
    'string'    : 'string',
    'Array'     : 'array',
    'Date'      : 'date',
    'RegExp'    : 'regexp',
    'Null'      : 'null'
}

var TYPE_NAME = Object.prototype.toString;

export function getType(o) {
  return TYPES[typeof o] || TYPES[TYPE_NAME.call(0).slice(8, -1)] || 'object';
}
