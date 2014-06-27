JsonQuery
=========

Query your JSON data like database.

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
 var mDb = JsonQuery(movies);

```

***

#### Equal queries

```
 mDb.where({'rating': 7.6}) 

 #or

 mDb.where({'rating.$eq': 7.6}) 

 # not equal
 mDb.where({'rating.$ne': 7.6}) 
 
```

#### Like queries

```
 mDb.where({'name.$li': 'Assassins'}) 

 #or using regex
 mDb.where({'name.$li': /assassins/i}) 

```


#### Between queries

```
 mDb.where({'rating.$bt': [7, 8]}) 

```

#### Less then, greater then queries

```
  # greater then
  mDb.where({'rating.$gt': 7})

  # less then
  mDb.where({'rating.$lt': 7.6})

```

#### In queries

```
 # in
 mDb.where({'rating.$in': [7.6, 7.4]})

 # not in
 mDb.where({'rating.$ni': [7.6, 7.3]})

```

### Combine multiple criteria

```
 mDb.where({'rating': 8.4, 'name.$li': /braveheart/i})

 mDb.where({'actor': 'Al Pacino', 'year.$gt': 1970 })

 mDb.where({'actor.$li': /walter/i, 'year.$gt': 1970 })

 mDb.where({'actor.$li': /walter/i, 'year.$bt': [1950, 1980], 'rating': 7.7 })
```

***



