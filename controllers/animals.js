const express = require('express');
const router = express.Router();
// const fs = require('fs');
const Animal = require('../models/animals');
const Species = require('../models/species');

/* GET animals listing. */
router.get('/', (req, res) => {
  //get data from json file
  //   fs.readFile('./data/animals.json', 'utf8', (err, animals) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(animals);
  //       res.render('animals/index', {
  //         title: 'Animal List',
  //         animals: JSON.parse(animals),
  //       });
  //     }
  //   });
  //get data from mgdb using animals model
  Animal.find((err, animals) => {
    if (err) {
      console.log(err);
    } else {
      console.log(animals);
      res.render('animals/index', {
        title: 'Animal List',
        animals: animals,
      });
    }
  });
});

// GET create
router.get('/create', (req, res) => {
  Species.find((err, species) => {
    if (err) {
      console.log(err);
    } else {
      res.render('animals/create', { species: species });
    }
  });
});

// POST create
router.post('/create', (req, res) => {
  Animal.create(req.body, (err, newDocument) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/animals');
    }
  });
});
module.exports = router;
