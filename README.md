JsonQuery
=========

An incredibly fast and easy way to query your JSON data like a database.

- [Query Demo](http://jiren.github.io/JsonQuery/)
- [Google Map Demo](http://jiren.github.io/JsonQuery/geo.html)
- [Leflet Map Demo](http://jiren.github.io/JsonQuery/leaflet.html)

## Installation

```
bower install https://github.com/jiren/JsonQuery.git --save
```


### Query JSON data

For example: If we want to only show the movies with a rating of 8.6, we would do the following:

```
 var movies = [
  {
    "name":"Once Upon a Time in the West",
    "rating":8.7,
    "director":"Sergio Leone",
    "year":1968,
    "actor":
    "Henry Fonda"
  },
  {
    "name":"Terminator 2: Judgment Day",
    "rating":8.6,
    "director":"James Cameron",
    "year":1991,
    "actor":"Arnold Schwarzenegger"
  },
];

var Movie = JsonQuery.new(movies); //Initialize the Query Engine
var results = Movie.where({'rating': 8.6}).all;

```

***

#### Equal To

```
Movie.where({'rating': 7.6}).all

//Optionally use $gt
Movie.where({'rating.$eq': 7.6}).all
```

#### Not Equal To
```
Movie.where({'rating.$ne': 7.6}).all
```

#### Is Like

```
Movie.where({'name.$li': 'Assassins'}).all

// or with regex
Movie.where({'name.$li': /assassins/i}).all
```



#### Is Between

```
 Movie.where({'rating.$bt': [7, 8]}).all

```

#### Is Greater Than

```
  Movie.where({'rating.$gt': 7}).all
```

#### Is Less Than

```
  Movie.where({'rating.$lt': 7.6}).all
```

#### Is In

```
 Movie.where({'rating.$in': [7.6, 7.4]}).all
```

#### Is NOT In

```
 Movie.where({'rating.$ni': [7.6, 7.3]}).all
```

## Combine multiple criteria


```
 Movie.where({'actor.$li': /walter/i, 'year.$bt': [1950, 1980], 'rating': 7.7 }).all
```

#### More query functions : all, groupBy, select, pluck, limit and offset, order, first, last, count

## Chaining multiple functions


```
 Movie.all
 Movie.first
 Movie.last
 Movie.groupBy('rating')
 Movie.select(['actor', 'rating']).all
 Movie.pluck('actor').all
 Movie.limit(10).offset(20).all

 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).all
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).first
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).count
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).groupBy('rating')
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).select('actor', 'rating').all
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).pluck('actor').all
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).limit(10).offset(20).all

 #OR query. It must used with where.
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).or({'rating': 8.4}).all;

 # Order : desc / asc
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).order({'rating': 'desc'}).all
 Movie.order({'rating': 'desc', actor: 'asc'}).all

 # Unique
 Movie.uniq('rating').all
 Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).uniq('rating').all
 Movie.uniq('rating').pluck('rating').all

 # Find - will return first record
 # Default id field is `id`. If id field other then `id` then set "Movie = JsonQuery.new(movies, {'id': '_id'})";
 Movie.find(10)
 Movie.find('rating', 8.4)
 Movie.find('rating', 8.4)

 #Geo: Args: lat, lng, distance, unit(optional): (km, or mile) : Default: km
 Place.near(37.730416, -122.384424, 5).all
 Place.where({'name': 'Bayview'}).near(37.730416, -122.384424, 5).all

```

#### Iterating query result by passing callback

```
  Movie.order({'rating': 'desc', actor: 'asc'}).each(function(movie){
    console.log(movie.rating);
  })
```

#### Make JsonQuery from result of query for more complex queries.

In example, first search places `name` with `Bayview` and run query on subset of the result.

```
 var resultJQ = Place.where({'name': 'Bayview'}).toJQ();

 resultJQ.where({'types': 'neighborhood'}).all

 resultJQ.where({'types': 'political'}).all

```

***
