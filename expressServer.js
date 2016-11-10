'use strict';

// There are two types of code below. All commented code works with a global declared variable set equal to an array of JSON. Uncommented code works with the pets.json file dynamically, calling in/reading the file as needed.

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
app.disable('x-powered-by');
app.disable('ETag');
app.disable('Content-Length');
app.use(bodyParser.json());
app.use(morgan('short'));

// res.set('Content-Type', 'application/json');
// res.send(pets);

app.get('/pets', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, pData) => {
    if (err) {
      return next(err);
    }

    let pets = JSON.parse(pData);
    res.set('Content-Type', 'application/json');
    res.send(pets);
  });
});

// var id = Number.parseInt(req.params.id);
//
// if (id < 0 || id >= pets.length || Number.isNaN(id)) {
//   return next();
// }
//
// res.set('Content-Type', 'application/json');
// res.send(pets[id]);

app.get('/pets/:id', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, petsData) => {
    if (err) {
      return next(err);
    }

    var id = Number.parseInt(req.params.id);
    let pets = JSON.parse(petsData);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return next();
    }

    res.set('Content-Type', 'application/json');
    res.send(pets[id]);
  });
});

// if(req.body.age === undefined || isNaN(req.body.age) || req.body.kind === undefined || req.body.name === undefined) {
//   return res.sendStatus(400);
// }
// else {
//   var newPet = {
//     'age':req.body.age,
//     'kind':req.body.kind,
//     'name':req.body.name
//   };
//
//   pets.push(newPet);
//
//   res.set('Content-Type', 'application/json');
//   res.send(newPet);
// }

app.post('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      return res.sendStatus(500);
    }
    else {
      if(req.body.age && req.body.kind && req.body.name) {
        var pets = JSON.parse(data);
        var newPet = {
            'age':req.body.age,
            'kind':req.body.kind,
            'name':req.body.name
        };
        pets.push(newPet);
        var petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, err => {
          if (err) {
            return res.setStatus(500);
          }
          res.send(newPet);
        });
      }
      else {
        res.set('Content-Type', 'text/plain');
        res.sendStatus(400);
      }
    }
  });
});

app.put('/pets/:id', 'utf8', (err, req, res, next) => {
  var petId = req.params.id;

  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }
    else {
      var pets = JSON.parse(data);
      if(req.body.age && req.body.kind && req.body.name) {
        pets[petId] = {
            'age':req.body.age,
            'kind':req.body.kind,
            'name':req.body.name
        };
        var petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, err => {
          if (err) {
            return res.setStatus(500);
          }
          res.send(pets[petId]);
        });
      }
      else {
        res.set('Content-Type', 'text/plain');
        res.sendStatus(400);
      }
    }
  });
});

app.destroy('/pets/:id', 'utf8', (err, req, res, next) => {
  let petId = req.params.id;
  if(err) {
    return next(err);
  }
  else {
    fs.readFile(petsPath, 'utf8', (err, data) => {
      var pets = JSON.parse(data);
      var deletedPet = pets[petId];
      pets.splice(petId, 1);
      var petsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, petsJSON, err => {
        if (err) {
          next(err);
        }
        res.send(deletedPet);
      });
    });
  }
});

app.patch('/pets/:id', 'utf8', (err, req, res, next) => {
  let petId = req.params.id;
  if(err) {
    return next(err);
  }
  else {
    fs.readFile(petsPath, 'utf8', (err, data) => {
      var pets = JSON.parse(data);

      if(req.body) {
        if(req.body.age) {
          pets[petId].age = req.body.age;
        }
        else if(req.body.kind) {
          pets[petId].kind = req.body.kind;
        }
        else if(req.body.name) {
          pets[petId].name = req.body.name;
        }
        else {
          return next();
        }
      }
      var petsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, petsJSON, err => {
        if (err) {
          next(err);
        }
        res.send(pets[petId]);
      });
    });
  }
});

// Middleware to test 500 errors, if not a 404 error, it will slip through this error handling (since 404 is not an error).

app.use((err, req, res, next) => {
  if(err) {
    console.error(err.stack);
    res.sendStatus(500);
  }
  else {
    next();
  }
});

// After slipping through the error handling, this middleware handles the 404 errors that occur.

app.use((req, res) => {
  res.set('Content-Type', 'text/plain');
  res.sendStatus(404);
});

app.listen(port, () => console.log('Listening on port', port));
module.exports = app;
