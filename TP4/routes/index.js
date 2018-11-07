const express = require('express');

const router = express.Router();

router.get('/produits', (req, res) => {
  res.render('products');
});

router.get('/produits/:id', (req, res) => {
    var id = req.params.id;
    res.render('products');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/panier', (req, res) => {
    res.render('panier');
});

router.get('/commande', (req, res) => {
    res.render('order');
});

router.get('/confirmation', (req, res) => {
    res.render('confirmation');
});

module.exports = router;
