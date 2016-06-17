describe("Where", function(){
  var Movie;

  beforeEach(function(){
    jasmine.addMatchers(customMatchers);

    Movie = JsonQuery.new(movies_data_10);
  });

  describe("equal", function(){
    it("with default equal operator", function(){
      movies = Movie.where({'year': 1967}).all;

      expect(movies.length).toBe(1);
      expect(movies[0].year).toBe(1967);
    });

    it("with $eq operator", function(){
      movies = Movie.where({'year.$eq': 1967}).all;

      expect(movies.length).toBe(1);
      expect(movies[0].year).toBe(1967);
    });

    it("with $ne operator", function(){
      movies = Movie.where({'rating.$ne': 8.7}).all;

      expect(movies.length).toBe(9);

      movies.forEach(function(m){
        expect(m.rating).not.toBe(8.7);
      })
    });
  });

  describe("like", function(){
    it("with $li operator with regex", function(){
      movies = Movie.where({'name.$li': /Time/i}).all;

      expect(movies.length).toBe(1)
      expect(movies[0].name).toContain("Time");

      movies = Movie.where({'director.$li': /Wilder/i}).all;

      expect(movies.length).toBe(1)
      expect(movies[0].director).toContain("Wilder");
    });

    it("with $li without case sensitiveness", function(){
      movies = Movie.where({'name.$li': /terminator/i}).all;

      expect(movies.length).toBe(1)
      expect(movies[0].name).toContain("Terminator");
    });
  });

  describe("range", function(){
    it("with $bt operator", function(){
      movies = Movie.where({'year.$bt': [1991, 1993]}).all;

      expect(movies.length).toBe(1);

      movies.forEach(function(m){
        expect(m.year).toBeIn([1991, 1993]);
      });

    });
  });

  describe("grether/less then", function(){
    it("with $lt operator", function(){
      movies = Movie.where({'rating.$lt': 8.4}).all;

      expect(movies.length).toBe(3);

      movies.forEach(function(m){
        expect(m.rating).toBeLessThan(8.4);
      });
    });

    it("with $gt operator", function(){
      movies = Movie.where({'rating.$gt': 8.4}).all;

      expect(movies.length).toBe(2);

      movies.forEach(function(m){
        expect(m.rating).toBeGreaterThan(8.4);
      });
    });
  });

  describe("include", function(){
    it("with $in operator for number", function(){
      var years = [1968, 1991, 2015];
      movies = Movie.where({'year.$in': years}).all;

      expect(movies.length).toBe(2);

      movies.forEach(function(m){
        expect(years).toContain(m.year);
      });
    });

    it("with $in operator for string", function(){
      var actors = ['Henry Fonda', 'Tyrone Power'];
      movies = Movie.where({'actor.$in': actors}).all;

      expect(movies.length).toBe(2);

      movies.forEach(function(m){
        expect(actors).toContain(m.actor);
      });
    });

    it("with not in $ni operator", function(){
      var ratings = [8.6, 8.7, 8.3];
      movies = Movie.where({'rating.$ni': ratings}).all;

      expect(movies.length).toBe(7);

      movies.forEach(function(m){
        expect(ratings).not.toContain(m.rating);
      });
    });
  });

  describe("combine criterias", function(){
    it("with multiple operators", function(){
      movies = Movie.where({'year.$bt': [1960, 1992], 'rating.$in': [8.2, 7.7], 'actor.$li': /Newman/}).all;

      movies.forEach(function(m){
        expect(m.year).toBeIn([1960, 1992]);
        expect([8.2, 7.7]).toContain(m.rating);
        expect(m.actor).toContain("Newman");
      });

    });
  });

  describe('Date Selectors', function(){
    it('equal for time field', function(){
      var d = new Date("1968-06-27T20:53:51.331Z");
      var movies = Movie.where({'date': d}).all;

      expect(1).toBe(movies.length);

      movies.forEach(function(m){
        expect(new Date(m.date).getTime()).toBe(d.getTime());
      })
    });

    it('$be for time field', function(){
      var d1 = new Date("1968-06-27T20:53:51.331Z");
      var d2 = new Date("1974-09-01T17:01:44.883Z");
      var movies = Movie.where({'date.$bt': [d1, d2]}).all;

      expect(movies.length).toBe(2);

      movies.forEach(function(m){
        expect(new Date(m.date).getTime()).toBeIn([d1.getTime(), d2.getTime()]);
      });
    });

    it('equal for date field', function(){
      var Service = JsonQuery.new(services_data);
      var d = new Date("2011-08-15");
      var services = Service.where({'start_date': d}).all;

      services.forEach(function(s){
        expect(new Date(s.start_date).getTime()).toBe(d.getTime())
      });
    });
  });

});
