JsonQuery
=========

Query your JSON data like database.

[Demo](http://jiren.github.io/JsonQuery/)

[Demo for Geo: GoogleMap](http://jiren.github.io/JsonQuery/geo.html)

[Demo for Geo: LefletMap](http://jiren.github.io/JsonQuery/leaflet.html)

### Query JSON data

 - Query movies

```
 var movies = [
  {"name":"Once Upon a Time in the West","rating":8.7,"director":"Sergio Leone","year":1968,"actor":"Henry Fonda"},
  ...
  ...
  {"name":"Terminator 2: Judgment Day","rating":8.6,"director":"James Cameron","year":1991,"actor":"Arnold Schwarzenegger"},
  ]

 # Init query object
 var Movie = JsonQuery(movies);

```
-  To execute query and get result call `exec()`

   i.e `Movie.where({'rating': 7.6}).exec()`

***

#### Equal queries

```
 Movie.where({'rating': 7.6}).exec()

 #or

 Movie.where({'rating.$eq': 7.6}).exec()

 # not equal
 Movie.where({'rating.$ne': 7.6}).exec()

```

#### Like queries

```
 Movie.where({'name.$li': 'Assassins'}).exec()

 #or using regex
 Movie.where({'name.$li': /assassins/i}).exec()

```


#### Between queries

```
 Movie.where({'rating.$bt': [7, 8]}).exec()

```

#### Less then, greater then queries

```
  # greater then
  Movie.where({'rating.$gt': 7}).exec()

  # less then
  Movie.where({'rating.$lt': 7.6}).exec()

```

#### In queries

```
 # in
 Movie.where({'rating.$in': [7.6, 7.4]}).exec()

 # not in
 Movie.where({'rating.$ni': [7.6, 7.3]}).exec()

```

#### Combine multiple criteria

```
 Movie.where({'rating': 8.4, 'name.$li': /braveheart/i}).exec()

 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).exec()

 Movie.where({'actor.$li': /walter/i, 'year.$gt': 1970 }).exec()

 Movie.where({'actor.$li': /walter/i, 'year.$bt': [1950, 1980], 'rating': 7.7 }).exec()

 Movie.where({'rating': 8.4, 'name.$li': /braveheart/i}).exec()
```

#### More query functions : all, groupBy, select, pluck, limit and offset, order, first, last, count

- Chaining multiple functions

```
 Movie.all
 Movie.first
 Movie.last
 Movie.groupBy('rating')
 Movie.select(['actor', 'rating']).exec()
 Movie.pluck('actor').exec()
 Movie.limit(10).offset(20).exec()

 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).all
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).first
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).count
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).groupBy('rating')
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).select('actor', 'rating').exec()
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).pluck('actor').exec()
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).limit(10).offset(20).exec()

 #OR query. It must used with where.
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).or({'rating': 8.4}).exec();

 # Order : desc / asc
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).order({'rating': 'desc'}).exec()
 Movie.order({'rating': 'desc', actor: 'asc'}).exec()

 # Unique
 Movie.uniq('rating').exec()
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).uniq('rating').exec()
 Movie.uniq('rating').pluck('rating').exec()

 # Find - will return first record
 # Default id field is `id`. If id field other then `id` then set "Movie = JsonQuery(movies, {'id': '_id'})";
 Movie.find(10)
 Movie.find('rating', 8.4)
 Movie.find('rating', 8.4)

 #Geo: Args: lat, lng, distance, unit(optional): (km, or mile) : Default: km
 Place.near(37.730416, -122.384424, 5).exec()
 Place.where({'name': 'Bayview'}).near(37.730416, -122.384424, 5).exec()

```

#### Iterating query result by passing function to `exec`

```
  Movie.order({'rating': 'desc', actor: 'asc'}).exec(function(movie){
    console.log(movie.rating);
  })
```

***





