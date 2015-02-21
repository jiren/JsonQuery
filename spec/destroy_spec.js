describe("Destroy", function(){
  var Movies;

  beforeEach(function(){
    jasmine.addMatchers(customMatchers);

    Movie = JsonQuery(movies_destroy_data);
  });

  describe("destroy", function(){
    it("remove records", function(){
      Movie.where({year: 1968}).destroy()

      expect(95).toBe(Movie.count);
    });
  });
});
