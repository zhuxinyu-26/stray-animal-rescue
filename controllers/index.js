const express = require('express');
const { render } = require('../app');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Stray Animal Rescue', user: req.user });
});

// GET /about
router.get('/about', (req, res) => {
  res.render('about', { title: 'about', user: req.user });
});

module.exports = router;
