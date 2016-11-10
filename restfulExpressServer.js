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
// var auth = require('basic-auth-connect');
app.disable('x-powered-by');
app.disable('ETag');
app.disable('Content-Length');
// app.use(auth((user, pass) => {
//   if(user === 'admin' && pass === 'meowmix') {
//     return true;
//   }
//   else {
//     express.setHeader('Content-Type', 'text/plain');
//   }
// }));
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
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(404);
    }

    res.set('Content-Type', 'application/json');
    res.send(pets[id]);
  });
});

// app.get('/noAuth', (req, res) => {
//  res.sendStatus(401);
// });

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

app.post('/pets', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
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

app.put('/pets/:id', (req, res, next) => {
  var petId = req.params.id;

  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }
    else {
      var pets = JSON.parse(data);
      if (petId < 0 || petId >= pets.length || Number.isNaN(petId)) {
        res.set('Content-Type', 'text/plain');
        return res.sendStatus(404);
      }

      if(req.body.age && req.body.kind && req.body.name) {
        pets[petId] = {
            'age':req.body.age,
            'kind':req.body.kind,
            'name':req.body.name
        };
        var petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, err => {
          if (err) {
            return next(err);
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

app.delete('/pets/:id', (req, res, next) => {
  let petId = req.params.id;

  fs.readFile(petsPath, 'utf8', (err, data) => {
    if(err) {
      return next(err);
    }
    else {
      var pets = JSON.parse(data);

      if (petId < 0 || petId >= pets.length || Number.isNaN(petId)) {
        res.set('Content-Type', 'text/plain');
        return res.sendStatus(404);
      }

      var deletedPet = pets[petId];
      pets.splice(petId, 1);
      var petsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, petsJSON, err => {
        if (err) {
          next(err);
        }
        res.send(deletedPet);
      });
    }
  });
});

app.patch('/pets/:id', (req, res, next) => {
  let petId = req.params.id;
  fs.readFile(petsPath, 'utf8', (err, data) => {
    var pets = JSON.parse(data);

    if (petId < 0 || petId >= pets.length || Number.isNaN(petId)) {
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(404);
    }

    if(req.body) {
      pets[petId] = {
        age:req.body.age || pets[petId].age,
        kind:req.body.kind || pets[petId].kind,
        name:req.body.name || pets[petId].name
      };
    }
    else {
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(400);
    }
    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, err => {
      if (err) {
        return next(err);
      }
      else {
        res.send(pets[petId]);
      }
    });
  });
});

// Middleware to test 500 errors, if not a 404 error, it will slip through this error handling (since 404 is not an error).

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: err
  });
});

// After slipping through the error handling, this middleware handles the 404 errors that occur.

app.use((req, res) => {
  res.set('Content-Type', 'text/plain');
  res.sendStatus(404);
});

app.listen(port, () => console.log('Listening on port', port));
module.exports = app;
