const express = require('express');
const router = express.Router();
const fs = require('fs');
const Animal = require('../models/animals');

/* GET animals listing. */
router.get('/', (req, res) => {
  //get data from json file
  fs.readFile('./data/animals.json', 'utf8', (err, animals) => {
    if (err) {
      console.log(err);
    } else {
      console.log(animals);
      res.render('animals/index', {
        title: 'Animal List',
        animals: JSON.parse(animals),
      });
    }
  });
});

// GET create
router.get('/create', (req, res) => {
  res.render('animals/create');
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
