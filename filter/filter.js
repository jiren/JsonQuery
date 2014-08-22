
(function(window) {

  'use strict';

  var FilterJS = function(data, container, view, options) {
    return new _FilterJS(data, container, view, options);
  };

  FilterJS.VERSION = '2.0.0';

  $.fn.filterjs = function(data, view, options) {
    var $this = $(this);
    if ($this.data('fjs')) return;
    $this.data('fjs', new _FilterJS(data, $this, view, options));
  };

  window.FilterJS = FilterJS;

  var _FilterJS = function(records, container, view, options) {
    this.records = records;
    this.view = view;
    this.$container = $(container);
    this.opts = options || {};
    this.filters = [];

    this.search_fields = this.opts.search_fields;
    this.render(records);

    return this;
  };

  var F = _FilterJS.prototype;

  F.addFilter = function(opts){
    this.filters.push(opts);
  };

  F.render = function(records){
  };

  F.filter = function(){
  };

  F.search = function(q){
  };

  F.execCallback = function(name){
  };

  F.renderResult = function(records){
  };



}
