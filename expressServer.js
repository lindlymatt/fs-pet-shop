'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsData) => {
    if (err) {
      app.use((err, req, res, next) => {
        next();
      });
    }

    let pets = JSON.parse(petsData);
    res.send(pets);
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsData) => {
    if (err) {
      app.use((err, req, res, next) => {
        next();
      });
    }

    var id = Number.parseInt(req.params.id);
    let pets = JSON.parse(petsData);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      app.use((err, req, res, next) => {
        next();
      });
    }

    res.set('Content-Type', 'text/plain');
    res.send(pets[id]);
  });
});

app.use((err, req, res, next) => {
  if(err) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  }
  else {
    next();
  }
});

app.use((req, res) => {
  res.status(404).send('Sorry cant find that!');
});

app.listen(port, () => console.log('Listening on port', port));
module.exports = app;
