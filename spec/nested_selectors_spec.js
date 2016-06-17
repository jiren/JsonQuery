describe("Nested Objects", function(){
  var Service;
  var Movies;

  beforeEach(function(){
    jasmine.addMatchers(customMatchers);

    Movie = JsonQuery.new(movies_data);
    Service = JsonQuery.new(services_data);
  });

  describe("equal", function(){
    it("with equal operator - object -> array", function(){
      services = Service.where({'service_categories.category_id': 31}).all;
      
      expect(2).toBe(services.length);

      services.forEach(function(service){
        expect(service.service_categories[0].category_id).toBe(31);
      });

    });

    it("with equal operator - object -> object", function(){
      var name = "Jeffery O'Conner I";
      services = Service.where({'nonprofit.name': name}).all;

      expect(2).toBe(services.length);

      services.forEach(function(service){
        expect(service.nonprofit.name).toBe(name);
      });

    });

    it("with equal operator - object -> array -> object", function(){
      var id = '12'
      services = Service.where({'nonprofit.nonprofit_categories.to_param': id}).all;

      expect(2).toBe(services.length);

      services.forEach(function(service){
        expect(service.nonprofit.nonprofit_categories[0].to_param).toBe(id);
      });

    });

    it("with equal operator - array", function(){
      var id = 70964;
      services = Service.where({'user_ids': id}).all;

      expect(1).toBe(services.length);

      services.forEach(function(service){
        expect(service.user_ids).toContain(id);
      });

    });

    /*
    it("with $aeq operator - array", function(){
      var genres = ["Adventure","Western"];
      var movies = Movie.where({ "genre.$aeq": genres }).all;

      expect(movies.length).toBe(2);

      movies.forEach(function(movie){
        expect(movie.genres).toBeIn(genres);
      });
    });
    */
  })
});
