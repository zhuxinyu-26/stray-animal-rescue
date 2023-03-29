const express = require('express');
const router = express.Router();
const fs = require('fs');

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
module.exports = router;
