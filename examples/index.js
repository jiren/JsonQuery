$(document).ready(function(){

  var Movie = JsonQuery(movies);
  //console.log(Movies.schema);

  window.Movie = Movie;

  //Add some sample data for array queries
  $.each(services, function(){
   var c = this.service_categories[0];

   if(c){
    this.service_categories.push({category_id: (c.category_id + 200), to_param: (c.to_param + 200)})
   }
  })

  var Service = JsonQuery(services);

  window.Service = Service;

  demoHelper(Movie, 'Movie');
});

//For debugging
function printField(data, field){
  $.each(data, function(){
    console.log(this[field]);
  })
};

window.log = function(v) { console.log(v) };

function demoHelper(model, dbVarName){
  $('#query-form').submit(function(e){
    var query = $("#query").val();
    var fullQuery = query //dbVarName + ".where("+ query + ")";
    var result, formated_json;
    var $ele = $("#result");

    $("#query-text pre").text(fullQuery);

    var time_taken;

    try {
      var t1 = new Date();
      var result = eval(fullQuery);
      time_taken = new Date() - t1;
      var formated_json = JSON.stringify(result, undefined, 2);

      if(result.toString() == "[object Object]" && result.criteria){
        $ele.find('h4').text("Execute Query using 'exec()'");
        $ele.find('pre').text(fullQuery + '.exec()');
      }else{
        if(time_taken){
          $ele.find('h4').text("Found : " + result.length + ' in ' + time_taken  + ' ms');
        }
        $ele.find('pre').text(formated_json);
      }
    }catch(err) {
      $ele.find('h4').text("");
      $ele.find('pre').html("<div class='alert alert-danger'> ERROR:" + err.message + "</div>");
      log(err);
    }

    //$('#query-text, #result').show();
    $ele.fadeOut().fadeIn();

    e.preventDefault();
  });

  //Set Sample model
  $("#view-movies-data").on('click', function(e){
     var $ele = $("#result");

     $ele.find('h4').text("All Movies");
     $ele.find('pre').text(JSON.stringify(model.all, undefined, 2));
     $ele.fadeOut().fadeIn();

     $('#result').show();
     $('#query-text').hide();
     e.stopPropagation();
  })

  $("#view-movies-data").trigger('click');

};
