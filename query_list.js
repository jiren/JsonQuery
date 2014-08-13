
QUERIES = [
  "Movie.where({'rating': 7.6})",
  "Movie.where({'rating.$eq': 7.6})",
  "Movie.where({'rating.$ne': 7.6})",
  "Movie.where({'name.$li': 'Assassins'})",
  "Movie.where({'name.$li': /assassins/i})",
  "Movie.where({'rating.$bt': [7, 8]})",
  "Movie.where({'rating.$gt': 7})",
  "Movie.where({'rating.$lt': 7.6})",
  "Movie.where({'rating.$in': [7.6, 7.4]})",
  "Movie.where({'rating.$ni': [7.6, 7.3]})",
  "Movie.where({'rating': 8.4, 'name.$li': /braveheart/i})",
  "Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 })",
  "Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).or({'rating': 8.4}).exec()",
  "Movie.all",
  "Movie.first",
  "Movie.last",
  "Movie.groupBy('rating').exec()",
  "Movie.select(['actor', 'rating']).exec()",
  "Movie.pluck('actor').exec()",
  "Movie.limit(10).offset(20).exec()",
  "Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).all",
  "Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).first",
  "Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).groupBy('rating').exec()",
  "Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).select('actor', 'rating').exec()",
  "Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).pluck('actor').exec()",
  "Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).limit(10).offset(20).exec()",
  "Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).order({'rating': 'desc'}).exec()",
  "Movie.order({'rating': 'desc', actor: 'asc'}).exec()",
  "Movie.uniq('rating').exec()",
  "Movie.where({'actor': 'Al Pacino', 'year.$gt': 1970 }).uniq('rating').exec()",
  "Movie.uniq('rating').pluck('rating').exec()",
  "Movie.find(10)",
  "Movie.find('rating', 8.4)"
];

function initTypehead(){

  var source = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: $.map(QUERIES, function(query) { return { value: query }; })
  });

  source.initialize();

  $('.typeahead').typeahead(null, {
    name: 'movies',
    displayKey: 'value',
    source: source.ttAdapter()
  })
}
