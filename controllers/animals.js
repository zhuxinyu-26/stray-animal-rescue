var express = require('express');
var router = express.Router();

/* GET animals listing. */
router.get('/', (req, res) => {
  res.render('animals/index', { title: 'animal list' });
});

module.exports = router;
