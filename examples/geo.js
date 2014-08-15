$(document).ready(function(){

  var Place = JsonQuery(places, {'latitude': 'geometry.location.lat', 'longitude': 'geometry.location.lng'});
  window.Place = Place;

  var place = Place.first;

  GoogleMap.init(place.geometry.location.lat, place.geometry.location.lng, Place);

  queryHelper(Place, function(result){
    GoogleMap.updateMarkers(result);
  });
});

var GoogleMap = {

  map: null,
  markers: {},

  init: function(lat, lng, model){
    var self = this;
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(lat, lng)
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    this.infowindow = new google.maps.InfoWindow({ size: new google.maps.Size(50,50) });

    $.each(model.all, function(){
      self.addMarker(this);
    });

    this.setCenterPoint();
  },

  addMarker: function(place){
    var self = this;
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng),
      map: self.map,
      title: place.name
    });

    marker.info_window_content = place.name + '<br/>' + place.vicinity
    self.markers[place.id] = marker

    google.maps.event.addListener(marker, 'click', function() {
      self.infowindow.setContent(marker.info_window_content)
      self.infowindow.open(self.map,marker);
    });
  },

  updateMarkers: function(records){
    var self = this;

    $.each(self.markers, function(){ this.setMap(null); })
    $.each(records, function(){
      self.markers[this.id].setMap(self.map);
    });

    //Set map center
    if(records.length) self.setCenterPoint();
  },

  setCenterPoint: function(){
    var lat = 0, lng = 0; count = 0;

    //Calculate approximate center point.
    for(id in this.markers){
      var m = this.markers[id];

      if(m.map){
        lat += m.getPosition().lat();
        lng += m.getPosition().lng();
        count++;
      }
    }

    if(count > 0){
      this.map.setCenter(new google.maps.LatLng(lat/count,lng/count));
    }
  }

};
