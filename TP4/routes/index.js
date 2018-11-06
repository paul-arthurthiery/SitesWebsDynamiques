const express = require('express');

const router = express.Router();

router.get(['/', '/accueil'], (req, res) => {
  res.render('index');
});

module.exports = router;
