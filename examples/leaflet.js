$(document).ready(function(){
  var Place = JsonQuery(places, {'latitude': 'geometry.location.lat', 'longitude': 'geometry.location.lng'});

  LefletMap.init(37.782479, -122.440465, Place);

  queryHelper(Place);

  Place.onResult = function(records, criteria){
    if($.isArray(records)){
      LefletMap.updateMarkers(records);
    }

    if(criteria['near']){
      LefletMap.setHereMarker(criteria['near'].lat, criteria['near'].lng)
    }

  };

  window.Place = Place;
});

var LefletMap = {

  map: null,
  markers: {},
  here_marker: null,

  init: function(lat, lng, Model){
    var self = this;

    this.map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap </a> <a href="http://github.com/jiren/JsonQuery">JsonQuery</a>'
    }).addTo(this.map);

    // MapBox
    /*
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a> <strong>JsonQuery</strong>',
        id: 'examples.map-i86knfo3'
      }).addTo(this.map);
    */

    $.each(Model.all, function(){
      self.addMarker(this);
    });

    this.setCenterPoint();
    this.$distance = $('#distance');
  },

  addMarker: function(place){
    var self = this;
    var marker = L.marker([place.geometry.location.lat, place.geometry.location.lng]).addTo(self.map);
    marker.place = place;

    marker.on('mouseover', function(){
      var t;

      if(this.place._distance){
        t = 'Distance: ' + Number((this.place._distance).toFixed(2)) + ' km';
      }else{
        t = 'Run Query';
      }

      self.$distance.text(t);

    });

    marker.bindPopup("<b>"+ place.name +"</b><br>"+ place.vicinity);

    self.markers[place.id] = marker
  },

  updateMarkers: function(records){
    var self = this;

    $.each(self.markers, function(){ this.setOpacity(0) })
    $.each(records, function(){
      self.markers[this.id].setOpacity(1);
    });

    //Set map center
    if(records.length) self.setCenterPoint();
  },

  setCenterPoint: function(){
    var lat = 0, lng = 0; count = 0;

    //Calculate approximate center point.
    for(id in this.markers){
      var m = this.markers[id];

      if(m.options.opacity > 0){
        lat += m._latlng.lat;
        lng += m._latlng.lng;
        count++;
      }
    }

    if(count > 0){
      this.map.panTo(new L.LatLng(lat/count, lng/count));
    }
  },

  setHereMarker: function(lat, lng){
    var latlng = new L.LatLng(lat, lng);

    if(!this.here_marker){
     var icon = L.icon({
       iconUrl: 'assets/here_marker.png', 
       iconSize: [40, 40],
       popupAnchor:  [0, -10]
     });

     this.here_marker = L.marker([lat, lng], {icon: icon}).addTo(this.map);
     this.here_marker.bindPopup("You are here.");
    }

    this.here_marker.setLatLng(latlng);
    this.map.panTo(latlng);


  }

};
