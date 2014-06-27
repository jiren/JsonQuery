$(document).ready(function(){
 
  var mDb = JsonQuery(Movies);
  //console.log(mDb.schema);

  window.mDb = mDb;

  //Add some sample data for array queries
  $.each(Services, function(){
   var c = this.service_categories[0];

   if(c){
    this.service_categories.push({category_id: (c.category_id + 200), to_param: (c.to_param + 200)})
   }
  })

  var sDb = JsonQuery(Services);
  //console.log(sDb.schema);

  window.sDb = sDb;

  demoHelper(Movies, 'mDb');
});

//For debugging
function printField(data, field){
  $.each(data, function(){
    console.log(this[field]);  
  })
};

function demoHelper(jsonData, dbVarName){
  $('#query-form').submit(function(e){
    var query = $("#query").val();
    var fullQuery = dbVarName + ".where("+ query + ")";
    var result, formated_json;
    var $ele = $("#result");

    $("#query-text pre").text(fullQuery);

    try {
      var result = eval(fullQuery);
      var formated_json = JSON.stringify(result, undefined, 2);
      $ele.find('h4').text("Found : " + result.length);
      $ele.find('pre').text(formated_json);
    }catch(err) {
      $ele.find('h4').text("");
      $ele.find('pre').html("<div class='alert alert-danger'> ERROR:" + err.message + "</div>");
    }

    $('#query-text, #result').show();
    $ele.fadeOut().fadeIn();

    e.preventDefault();
  });

  //Set Sample jsonData
  $("#view-movies-data").on('click', function(e){
     var $ele = $("#result");

     $ele.find('h4').text("All Movies");
     $ele.find('pre').text(JSON.stringify(jsonData, undefined, 2));
     $ele.fadeOut().fadeIn();

     $('#result').show();
     $('#query-text').hide();
     e.stopPropagation();
  })

};
