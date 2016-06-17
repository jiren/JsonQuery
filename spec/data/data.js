var fs = require('fs')
var movies = require('./movies_all.json')

function random (low, high) {
  return Math.random() * (high - low) + low;
}

movies.forEach( (m, i) => {
  //m.date = new Date(m.year, random(0, 11), random(1, 31));
  m.id= i + 1;
})

var data = JSON.stringify(movies, null, 2)

fs.writeFile('movies_all_f.json', data, {})
