describe("Other Collection Selectors", function(){
  var Movie;

  beforeEach(function(){
    Movie = JsonQuery(movies_data);
  });

  describe("All", function(){

    it("all records", function(){
      movies = Movie.all

      expect(movies.length).toBe(movies_data.length)
    });

    it("all records with where", function(){
      movies = Movie.where({'rating': 8.4 }).all

      expect(movies.length).toBe(5)
    });
  })

  describe("First", function(){
    it("first record", function(){
      movie = Movie.first

      expect(movie.name).toBe('Once Upon a Time in the West')
    });

    it("first record with where", function(){
      movie = Movie.where({'rating': 8.4 }).first

      expect(movie.name).toBe('Braveheart')
    });
  })

  describe("Last", function(){
    it("last record", function(){
      movie = Movie.last

      expect(movie.name).toBe('The Passion of Anna')
    });

    it("last record with where", function(){
      movie = Movie.where({'rating': 8.4 }).last

      expect(movie.name).toBe('Amadeus')
    });

  })

  describe("Group By", function(){
    it('group by records', function(){
      rating_group = Movie.groupBy('rating').exec()

      expect(Object.keys(rating_group)).toEqual(['8.7', '8.6', '8.4', '8.2', '8.3', '7.6'])
    });

    it('group by records with where', function(){
      rating_group = Movie.where({'rating': 8.4}).groupBy('rating').exec()

      expect(Object.keys(rating_group)).toEqual(['8.4'])
      expect(rating_group['8.4'].length).toBe(5)
    });

  });

  describe("Select", function(){

    it('select fields', function(){
      movies = Movie.select('name', 'rating').exec();

      var m;

      $.each(movies, function(i){
        m = {name: movies_data[i].name, rating: movies_data[i].rating}
        expect(this).toEqual(m)
      });

    })

    it('select fields with where', function(){
      movies = Movie.where({'rating': 8.4}).select('name', 'rating').exec();

      expect(movies.length).toBe(5);
    });

  });

  describe("Pluck", function(){
    it('pluck field', function(){
      actors = Movie.pluck('actor').exec();

      expect(actors).toEqual(["Henry Fonda", "Arnold Schwarzenegger", "Mel Gibson", "Min-sik Choi", "Tyrone Power", "Jack Nicholson", "F. Murray Abraham", "Paul Newman", "Tatsuya Nakadai", "Liv Ullmann"]);
    });

    it('pluck field with where', function(){
      actors = Movie.where({'year.$in':[1968, 1991]}).pluck('actor').exec();

      expect(actors).toEqual(["Henry Fonda", "Arnold Schwarzenegger"]);
    });
  });

  describe('Limit and Offset', function(){

    it('fetch records by limit', function(){
      movies = Movie.limit(5).exec();

      expect(movies.length).toBe(5)
    });

    it('fetch records by limit with where', function(){
      movies = Movie.where({'rating': 8.4}).limit(2).exec();

      expect(movies.length).toBe(2);
      expect(movies[0].name).toBe('Braveheart');
    });

    it('fetch records by limit and offset', function(){
      movies = Movie.offset(7).limit(5).exec();

      expect(movies.length).toBe(3)
      expect(movies[0].name).toBe('Cool Hand Luke');
    });

    it('fetch records by limit and offset with where', function(){
      movies = Movie.where({'rating': 8.4}).offset(1).limit(5).exec();

      expect(movies.length).toBe(4)
      expect(movies[0].name).toBe('Oldboy');
    });

  });

  describe('Order', function(){

    it('fetch records by desc order', function(){
      movies = Movie.order({'rating': 'desc'}).exec()

      var rating_in_orders = [8.7, 8.6, 8.4, 8.4, 8.4, 8.4, 8.4, 8.3, 8.2, 7.6];

      $.each(movies, function(i){
        expect(this.rating).toBe(rating_in_orders[i]);
      })
    });

    it('fetch records by asc order', function(){
      movies = Movie.order({'rating': 'asc'}).exec()

      var rating_in_orders = [7.6, 8.2, 8.3, 8.4, 8.4, 8.4, 8.4, 8.4, 8.6, 8.7];

      $.each(movies, function(i){
        expect(this.rating).toBe(rating_in_orders[i]);
      })
    });

    it('fetch records by desc order with where', function(){
      movies = Movie.where({'year.$gt': 1970 }).order({'rating': 'desc'}).exec();

      var ratings = [8.6, 8.4, 8.4, 8.4, 8.4, 8.3];
      $.each(movies, function(i){
        expect(this.year).toBeGreaterThan(1970);
        expect(this.rating).toBe(ratings[i]);
      });

    });

  });

  describe('Uniq', function(){
    it('fetch uniq records', function(){
      var ratings = Movie.uniq('rating').pluck('rating').exec();

      expect(ratings).toEqual([8.7, 8.6, 8.4, 8.2, 8.3, 7.6])
    });
  });


});
