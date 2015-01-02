
//console.clear();
var Movie = JsonQuery(movies);
var Service = JsonQuery(services);

console.log(Movie.where({'rating': 9}).count)
Movie.where({'rating': 9}).destroy();
console.log(Movie.where({'rating': 9}).count)
