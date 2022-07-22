const express = require('express');
const Dictionary = require('./models/Dictionary');
const router = express.Router();
var random = require('mongoose-simple-random');

router.get('/dict_entries', (req, res) => {
  Dictionary.findRandom({}, {}, { limit: 4 }, function (err, results) {
    // if (!err) {
    //   res.send(results);
    // }
    try {
      res.send(results);
    } catch (err) {
      res.status(500).send(err);
    }
  });
});

module.exports = router;
