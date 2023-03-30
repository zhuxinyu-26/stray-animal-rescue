const express = require('express');
const router = express.Router();
// const fs = require('fs');
const Animal = require('../models/animals');
const Species = require('../models/species');
//global auth check to make
const global = require('../controllers/globalFunctions');
/* GET animals listing. */
router.get('/', (req, res) => {
  //get data from mgdb using animals model
  Animal.find((err, animals) => {
    if (err) {
      console.log(err);
    } else {
      console.log(animals);
      res.render('animals/index', {
        title: 'Animal List',
        animals: animals,
        user: req.user,
      });
    }
  });
});

// GET create
//inject auth check function as middleware for security
router.get('/create', global.isAuthenticated, (req, res) => {
  Species.find((err, species) => {
    if (err) {
      console.log(err);
    } else {
      res.render('animals/create', {
        species: species,
        user: req.user,
        title: 'Create a new rescued animal',
      });
    }
  });
});

// POST create
router.post('/create', global.isAuthenticated, (req, res) => {
  Animal.create(req.body, (err, newDocument) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/animals');
    }
  });
});

// GET delete/ab123
router.get('/delete/:_id', global.isAuthenticated, (req, res) => {
  Animal.remove({ _id: req.params._id }, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/animals');
    }
  });
});
/* GET /edit/abc123 => fetch & display selected animal */
router.get('/edit/:_id', global.isAuthenticated, (req, res) => {
  Animal.findById(req.params._id, (err, animal) => {
    if (err) {
      console.log(err);
    } else {
      Species.find((err, species) => {
        if (err) {
          console.log(err);
        } else {
          res.render('animals/edit', {
            animal: animal,
            title: 'Edit animal Details',
            species: species,
            user: req.user,
          });
        }
      });
    }
  });
});

/* POST /edit/abc123 => update seleted animal */
router.post('/edit/:_id', global.isAuthenticated, (req, res) => {
  Animal.findByIdAndUpdate({ _id: req.params._id }, req.body, null, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/animals');
    }
  });
});

module.exports = router;
