describe("Other Collection Selectors", function(){
  var Movie;

  beforeEach(function(){
    Movie = JsonQuery.new(movies_data);
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

  describe("Pluck", function(){
    beforeEach(function(){
      Movie = JsonQuery.new(movies_data_10);
    })

    it('pluck field', function(){
      actors = Movie.pluck('actor');

      expect(actors).toEqual(["Henry Fonda", "Arnold Schwarzenegger", "Mel Gibson", "Min-sik Choi", "Tyrone Power", "Jack Nicholson", "F. Murray Abraham", "Paul Newman", "Tatsuya Nakadai", "Tom Hardy"]);
    });

    it('pluck field with where', function(){
      actors = Movie.where({'year.$in':[1968, 1991]}).pluck('actor');

      expect(actors).toEqual(["Henry Fonda", "Arnold Schwarzenegger"]);
    });
  });

  describe('Limit and Offset', function(){

    it('fetch records by limit', function(){
      movies = Movie.limit(5).all;

      expect(movies.length).toBe(5)
    });

    it('fetch records by limit with where', function(){
      movies = Movie.where({'rating': 8.4}).limit(2).all;

      expect(movies.length).toBe(2);

      movies.forEach(function(m){
        expect(m.rating).toBe(8.4)
      })
    });

    it('fetch records by limit and offset', function(){
      Movie = JsonQuery.new(movies_data_10);

      movies = Movie.offset(7).limit(5).all;

      expect(movies.length).toBe(3)
      
      movies.forEach(function(m, i){
        expect(m.id).toBe(8 + i);
      })
    });

    it('fetch records by limit and offset with where', function(){
      movies = Movie.where({'rating': 8.4}).offset(1).limit(5).all;

      expect(movies.length).toBe(4)

      movies.forEach(function(m){
        expect(m.rating).toBe(8.4)
      })
    });

  });

  describe('Order', function(){
    beforeEach(function(){
      Movie = JsonQuery.new(movies_data_10);
    });

    it('fetch records by desc order', function(){
      movies = Movie.desc('rating').all

      var rating_in_orders = [8.7, 8.6, 8.4, 8.4, 8.4, 8.4, 8.4, 8.3, 8.2, 8.2]; 

      movies.forEach(function(movie, i){
        expect(movie.rating).toBe(rating_in_orders[i]);
      })
    });

    it('fetch records by asc order', function(){
      movies = Movie.asc('rating').all

      var rating_in_orders = [ 8.2, 8.2, 8.3, 8.4, 8.4, 8.4, 8.4, 8.4, 8.6, 8.7];

      movies.forEach(function(movie, i){
        expect(movie.rating).toBe(rating_in_orders[i]);
      })
    });

    it('fetch records by desc order with where', function(){
      movies = Movie.where({'year.$gt': 1970 }).desc('rating').all;

      var ratings = [8.6, 8.4, 8.4, 8.4, 8.4, 8.3, 8.2];

      movies.forEach(function(movie, i){
        expect(movie.year).toBeGreaterThan(1970);
        expect(movie.rating).toBe(ratings[i]);
      });

    });
  });

  describe('Uniq', function(){
    beforeEach(function(){
      Movie = JsonQuery.new(movies_data_10);
    });

    it('fetch uniq records', function(){
      var ratings = Movie.uniq('rating').pluck('rating');

      expect(ratings).toEqual([8.7, 8.6, 8.4, 8.2, 8.3])
    });
  });

  describe("Group By", function(){
    beforeEach(function(){
      Movie = JsonQuery.new(movies_data_10);
    });

    it('group by records', function(){
      rating_group = Movie.groupBy('rating').all

      expect(Object.keys(rating_group)).toEqual(['8.7', '8.6', '8.4', '8.2', '8.3'])
    });

    it('group by records with where', function(){
      rating_group = Movie.where({'rating': 8.4}).groupBy('rating').all

      expect(Object.keys(rating_group)).toEqual(['8.4'])
      expect(rating_group['8.4'].length).toBe(5)
    });

  });

  describe('Sum', function(){
    beforeEach(function(){
      Movie = JsonQuery.new(movies_data_10);
    });

    it('sum records field', function(){
      expect('84.00').toEqual(Movie.sum('rating').toFixed(2))
    });
  })

  describe('Find', function(){
    it('by id', function(){
      var record = Movie.find(5);

      expect(5).toEqual(record.id);
    });

    it('by field name and value', function(){
      var record = Movie.find('year', 2000);

      expect(2000).toEqual(record.year);
    });
    
  });

});
