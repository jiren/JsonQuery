$(document).ready(function(){

  var Place = JsonQuery(places, {'latitude': 'geometry.location.lat', 'longitude': 'geometry.location.lng'});
  window.Place = Place;

  queryHelper(Place);

  var place = places[0];

  GoogleMap.init(place.geometry.location.lat, place.geometry.location.lng, Place.all);

});

function queryHelper(model){
  $('#query-form').submit(function(e){

    var query = $("#query").val(),
        $ele = $("#result"),
        result,
        formated_json,
        time_taken;

    $("#query-text pre").text(query);

    try {
      var t1 = new Date();
      var result = eval(query);
      time_taken = new Date() - t1;
      var formated_json = JSON.stringify(result, undefined, 2);

      if(result.toString() == "[object Object]" && result.criteria){
        $ele.find('h4').text("Execute Query using 'exec()'");
        $ele.find('pre').text(query + '.exec()');
      }else{
        $ele.find('h4').text("Found : " + (result.length || 1) + ' in ' + time_taken  + ' ms');
        $ele.find('pre').text(formated_json);

        GoogleMap.updateMarkers(result);
      }
    }catch(err) {
      $ele.find('h4').text("");
      $ele.find('pre').html("<div class='alert alert-danger'> ERROR:" + err.message + "</div>");
      console.log(err);
    }

    $ele.fadeOut().fadeIn();

    e.preventDefault();
  });

  //Set Sample model
  $("#view-places-data").on('click', function(e){
     var $ele = $("#result");

     $ele.find('h4').text("Places");
     $ele.find('pre').text(JSON.stringify(model.all, undefined, 2));
     $ele.fadeOut().fadeIn();

     $('#result').show();
     $('#query-text').hide();

     e.stopPropagation();
  })

  $("#view-places-data").trigger('click');

};

var GoogleMap = {

  map: null,
  markers: {},

  init: function(lat, lng){
    var self = this;
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(lat, lng)
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    this.infowindow = new google.maps.InfoWindow({ size: new google.maps.Size(50,50) });

    $.each(Place.all, function(){
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
