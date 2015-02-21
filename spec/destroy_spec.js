describe("Destroy", function(){
  var Movies;

  beforeEach(function(){
    jasmine.addMatchers(customMatchers);

    Movies = JsonQuery(movies_destroy_data);
  });

  describe("destroy", function(){
    it("remove records", function(){
      Movies.where({year: 1968}).destroy()

      expect(95).toBe(Movies.count);
    });
  });
});
