'use strict';

var path = require('path');
var fs = require('fs');
var petsPath = path.join(__dirname, 'pets.json');
var cmd = process.argv[2];

fs.readFile(petsPath, 'utf8', (err, data) => {
  
});
