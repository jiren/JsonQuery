
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

function queryHelper(model, onResult){
  $('#query-form').submit(function(e){
    var queryString = $("#query").val();
    var result, formated_json;
    var query;

    try {
      var t1 = new Date(),
          result = eval(queryString),
          time_taken = new Date() - t1;

      if(result.criteria){
        result = result.exec();
        $('#query').val(queryString + '.exec()');
      }

      var formated_json = JSON.stringify(result, undefined, 2),
          count;

      if($.isPlainObject(result)){
        count = Object.keys(result).length; 
      }else{
        count = result.length;
      } 

      updateResult("Found : " + count +  ' in ' + time_taken  + ' ms', formated_json);

      if(onResult){
        onResult(result);
      }

    }catch(err) {
      updateResult(null, null, err);
      console.log(err);
    }

    e.preventDefault();
  });

  //Set Sample model
  $("#all-records").on('click', function(e){
     updateResult('All Records', JSON.stringify(model.all, undefined, 2));

     if(onResult){
       onResult(model.all);
     }
     e.stopPropagation();
  });

  $("#all-records").trigger('click');

  $('a[data-q]').on('click', function(e){
    var query = QUERIES[$(this).data('q')];

    $('#helpbox-modal').modal('hide')
    $("#query").val(query);
    $('#query-form').submit();

    e.preventDefault();
  });

};
