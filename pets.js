#!/usr/bin/env node
'use strict';

var path = require('path');
var fs = require('fs');
var petsPath = path.join(__dirname, 'pets.json');
var cmd = process.argv[2];

var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);

if(cmd === 'read') {
  fs.readFile(petsPath, 'utf8', (rErr, data) => {
    if (rErr) {
      throw rErr;
    }
    else {
      let jsonLength = JSON.parse(data).length - 1;
      let index = process.argv[3];
      var parsedData = JSON.parse(data);

      // Check if there is an index with the read subcommand.
      if (index <= jsonLength && index >= 0) {
        console.log(parsedData[index]);
      }
      else if (index > jsonLength || index < 0) {
        console.error(`Usage: ${node} ${file} read INDEX`);
        process.exit(1);
      }
      else {
        console.log(parsedData);
      }
    }
  });
}
else if(cmd === 'create') {
  fs.readFile(petsPath, 'utf8', (rErr, data) => {
    if (rErr) {
      throw rErr;
    }
    else {
      var newPet = {};
      var pets = JSON.parse(data);

      if (process.argv[3] && process.argv[4] && process.argv[5]) {
        newPet.age = parseInt(process.argv[3]);
        newPet.kind = process.argv[4];
        newPet.name = process.argv[5];
        pets.push(newPet);

        var petsJSON = JSON.stringify(pets);
        fs.writeFile(petsPath, petsJSON, function(wErr) {
          if (wErr) {
            throw wErr;
          }
          console.log(newPet);
        });
      }
      else {
        console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
        process.exit(1);
      }
    }
  });
}
else if(cmd === 'update') {
  fs.readFile(petsPath, 'utf8', (rErr, data) => {
    if (rErr) {
      throw rErr;
    }
    else {
      var pets = JSON.parse(data);

      if (process.argv[3] && process.argv[4] && process.argv[5] && process.argv[6]) {
        let index = process.argv[3];

        // Updates the Pet.
        pets[index].age = parseInt(process.argv[4]);
        pets[index].kind = process.argv[5];
        pets[index].name = process.argv[6];

        var updatedPets = JSON.stringify(pets);

        fs.writeFile(petsPath, updatedPets, function(wErr) {
          if (wErr) {
            throw wErr;
          }
          console.log(pets[index]);
        });
      }
      else {
        console.error(`Usage: ${node} ${file} update INDEX AGE KIND NAME`);
        process.exit(1);
      }
    }
  });
}
else if (cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', (rErr, data) => {
    if (rErr) {
      throw rErr;
    }
    else {
      let pets = JSON.parse(data);

      if(process.argv[3] <= (pets.length - 1) && process.argv[3] >= 0) {
        var lostPet = pets[process.argv[3]];
        pets.splice(process.argv[3], 1);
        var updatedPets = JSON.stringify(pets);

        fs.writeFile(petsPath, updatedPets, function(wErr) {
          if (wErr) {
            throw wErr;
          }
          console.log(lostPet);
        });
      }
      else {
        console.error(`Usage: ${node} ${file} destroy INDEX`);
        process.exit(1);
      }
    }
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
