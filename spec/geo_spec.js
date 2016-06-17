describe("Geo", function(){
  var Place;

  beforeEach(function(){
    Place = JsonQuery.new(places,  {'latitude': 'geometry.location.lat', 'longitude': 'geometry.location.lng'});
  });

  describe("near", function(){
    it("find by distance", function(){
      var result = Place.near(37.730416, -122.384424, 0.1).all;

      expect(1).toBe(result.length);
      expect('Bayview').toBe(result[0].name)
    });

    it("find by distance with where", function(){
      var result = Place.where({name: 'Mission Pie'}).near(37.730416, -122.384424, 5).all;

      expect(1).toBe(result.length);
      expect('Mission Pie').toBe(result[0].name)
    });
  })
})
