describe("Where", function(){
  var Movie;

  beforeEach(function(){
    jasmine.addMatchers(customMatchers);

    Movie = JsonQuery(movies_data);
  });

  describe("equal", function(){
    it("with default equal operator", function(){
      movies = Movie.where({'year': 1967}).exec();

      expect(movies.length).toBe(1);
      expect(movies[0].year).toBe(1967);
    });

    it("with $eq operator", function(){
      movies = Movie.where({'year.$eq': 1967}).exec();

      expect(movies.length).toBe(1);
      expect(movies[0].year).toBe(1967);
    });

    it("with $ne operator", function(){
      movies = Movie.where({'rating.$ne': 8.7}).exec();

      expect(movies.length).toBe(9);

      $.each(movies, function(){
        expect(this.rating).not.toBe(8.7);
      })
    });
  });

  describe("like", function(){
    it("with $li operator", function(){
      movies = Movie.where({'name.$li': 'Terminator'}).exec();

      expect(movies.length).toBe(1);
      expect(movies[0].name).toContain("Terminator");
    });

    it("with $li operator with regex", function(){
      movies = Movie.where({'name.$li': /Time/i}).exec();

      expect(movies.length).toBe(1)
      expect(movies[0].name).toContain("Time");

      movies = Movie.where({'director.$li': /Wilder/i}).exec();

      expect(movies.length).toBe(1)
      expect(movies[0].director).toContain("Wilder");
    });

    it("with $li without case sensitiveness", function(){
      movies = Movie.where({'name.$li': /terminator/i}).exec();

      expect(movies.length).toBe(1)
      expect(movies[0].name).toContain("Terminator");
    });
  });

  describe("range", function(){
    it("with $bt operator", function(){
      movies = Movie.where({'year.$bt': [1991, 1993]}).exec();

      expect(movies.length).toBe(1);

      $.each(movies, function(){
        expect(this.year).toBeIn([1991, 1993]);
      });

    });
  });

  describe("grether/less then", function(){
    it("with $lt operator", function(){
      movies = Movie.where({'rating.$lt': 8.4}).exec();

      expect(movies.length).toBe(3);
      $.each(movies, function(){
        expect(this.rating).toBeLessThan(8.4);
      });
    });

    it("with $gt operator", function(){
      movies = Movie.where({'rating.$gt': 8.4}).exec();

      expect(movies.length).toBe(2);
      $.each(movies, function(){
        expect(this.rating).toBeGreaterThan(8.4);
      });
    });
  });

  describe("include", function(){
    it("with $in operator for number", function(){
      var years = [1968, 1991, 2015];
      movies = Movie.where({'year.$in': years}).exec();

      expect(movies.length).toBe(2);

      $.each(movies, function(){
        expect(years).toContain(this.year);
      });
    });

    it("with $in operator for string", function(){
      var actors = ['Henry Fonda', 'Tyrone Power'];
      movies = Movie.where({'actor.$in': actors}).exec();

      expect(movies.length).toBe(2);

      $.each(movies, function(){
        expect(actors).toContain(this.actor);
      });
    });

    it("with not in $ni operator", function(){
      var ratings = [8.6, 8.7, 7.6];
      movies = Movie.where({'rating.$ni': ratings}).exec();

      expect(movies.length).toBe(7);
      $.each(movies, function(){
        expect(ratings).not.toContain(this.rating);
      });
    });
  });

  describe("combine criterias", function(){
    it("with multiple operators", function(){
      movies = Movie.where({'year.$bt': [1960, 1992], 'rating.$in': [8.2, 7.7], 'actor.$li': 'Newman'}).exec();

      $.each(movies, function(){
        expect(this.year).toBeIn([1960, 1992]);
        expect([8.2, 7.7]).toContain(this.rating);
        expect(this.actor).toContain("Newman");
      });

    });
  });

  describe('Date Selectors', function(){
    it('equal for time field', function(){
      var d = new Date("2014-07-01T04:59:06.000+05:30");
      var movies = Movie.where({'date': d}).exec();

      $.each(movies, function(){
        expect(this.date).toBe(d);
      });
    });

    it('$be for time field', function(){
      var d1 = new Date("2014-05-18T04:14:01.000+05:30");
      var d2 = new Date("2014-07-01T04:59:06.000+05:30");
      var movies = Movie.where({'date.$bt': [d1, d2]}).exec();

      $.each(movies, function(){
        expect(new Date(this.date)).toBeIn([d1, d2]);
      });
    });

    it('equal for date field', function(){
      var Service = JsonQuery(services_data);
      var d = new Date("2011-08-15");
      var services = Service.where({'start_date': d}).exec();

      $.each(services, function(){
        expect(this.start_date).toBe(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
      });
    });
  });
});
