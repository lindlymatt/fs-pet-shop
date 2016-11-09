'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

app.use((req, res) => {
  if(req.status === '404') {
    res.sendStatus(404);
  }
});

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsData) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(404);
    }

    let pets = JSON.parse(petsData);
    res.send(pets);
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsData) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(404);
    }

    var id = Number.parseInt(req.params.id);
    let pets = JSON.parse(petsData);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    res.set('Content-Type', 'text/plain');
    res.send(pets[id]);
  });
});

app.listen(port, () => console.log('Listening on port', port));
module.exports = app;
