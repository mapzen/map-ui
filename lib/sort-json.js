'use strict'

var fs = require ('fs')

var FILE = './components/locator/cities.json'

var source = fs.readFileSync(FILE, {encoding: 'utf8' })

var json = JSON.parse(source)

json.sort(function (a, b) {
  if (a.n < b.n) {
    return -1
  } else if (a.n > b.n) {
    return 1
  }
  return 0
})

var contents = JSON.stringify(json)

fs.writeFile(FILE + '.backup', source, function (err) {
  if (err) throw err

  fs.writeFile(FILE, contents, function (err) {
    if (err) throw err
    console.log('Data file at ' + FILE + ' has been sorted alphabetically by city name.')
  })
})
