$(document).ready(function(){
 
  /*
  mDb = JsonQuery(Movies, ['name', 'rating', 'year']);
  console.log(mDb.schema);

  window.mDb = mDb;
  */

  $.each(Services, function(){
   var c = this.service_categories[0];

   if(c){
    this.service_categories.push({category_id: (c.category_id + 200), to_param: (c.to_param + 200)})
   }
  })

  sDb = JsonQuery(Services);
  console.log(sDb.schema);

  window.sDb = sDb;
});

function printField(data, field){
  $.each(Services, function(){
    console.log(this[field]);  
  })
};
