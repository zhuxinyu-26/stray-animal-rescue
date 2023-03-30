const express = require('express');
const router = express.Router();
const Species = require('../models/species');

// GET create
router.get('/create', (req, res) => {
  res.render('species/create');
});

// POST create
router.post('/create', (req, res) => {
  Species.create(req.body, (err, newDocument) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/animals');
    }
  });
});
module.exports = router;
