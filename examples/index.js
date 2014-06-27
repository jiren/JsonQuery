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

  demoHelper();
});

function printField(data, field){
  $.each(data, function(){
    console.log(this[field]);  
  })
};

function demoHelper(){
  $('#query-form').submit(function(e){
    var query = $("#query").val();
    var fullQuery = "mDb.where("+ query + ")";

    $("#query-text pre").text(fullQuery);

    try {
      var result = eval(fullQuery);
      var formated_json = JSON.stringify(result, undefined, 2);
      $('#result h4').text("Found : " + result.length);
      $('#result pre').text(formated_json);
    }catch(err) {
      $('#result h4').text("");
      $('#result pre').html("<div class='alert alert-danger'> ERROR:" + err.message + "</div>");
    }

    e.preventDefault();
  });
};

