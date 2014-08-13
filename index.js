$(document).ready(function(){

  var Movie = JsonQuery(movies);
  //console.log(Movies.schema);

  window.Movie = Movie;

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

function updateResult(title, result, error){
  var $ele = $("#result");

  if(!error){
    $ele.find('h4').text(title);
    $ele.find('pre').text(result);
  }else{
    $ele.find('h4').text('');
    $ele.find('pre').html("<div class='alert alert-danger'> ERROR:" + error.message + "</div>");
  }

  $ele.fadeOut().fadeIn();
};

function demoHelper(model, dbVarName){
  $('#query-form').submit(function(e){
    var query = $("#query").val();
    var query = query //dbVarName + ".where("+ query + ")";
    var result, formated_json;

    try {
      var t1 = new Date(),
          result = eval(query),
          time_taken = new Date() - t1,
          formated_json = JSON.stringify(result, undefined, 2);

      if(result.criteria){
        result = result.exec();
        $('#query').val(query + '.exec()');
      }

      updateResult("Found : " + (result.length || 1) + ' in ' + time_taken  + ' ms', formated_json);
    }catch(err) {
      updateResult(null, null, err);
      log(err);
    }

    e.preventDefault();
  });

  //Set Sample model
  $("#view-movies-data").on('click', function(e){
     updateResult('All Movie', JSON.stringify(model.all, undefined, 2));

     $('#result').show();
     $('#query-text').hide();
     e.stopPropagation();
  })

  $("#view-movies-data").trigger('click');

  $('a[data-q]').on('click', function(e){
    var query = QUERIES[$(this).data('q')];

    $('#helpbox-modal').modal('hide')
    $("#query").val(query);
    $('#query-form').submit();

    e.preventDefault();
  });

};
