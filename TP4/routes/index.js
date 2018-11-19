const express = require('express');
const {
  Product,
} = require('../lib/db');

const router = express.Router();

router.get(['/', '/accueil'], (req, res) => {
  res.render('index', {
    title: 'OnlineShop - Accueil',
  });
});
router.get('/produits', (req, res) => {
  Product.find()
    .then((products) => {
      products.sort((a, b) => a.price - b.price);
      res.render('products', {
        title: 'OnlineShop - Produits',
        products,
      });
    });
});

router.get('/produits/:id', (req, res) => {
  Product.findOne({
    id: req.params.id,
  }).then((product) => {
    res.render('product', {
      title: 'OnlineShop - Produit',
      product,
    });
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'OnlineShop - Contact',
  });
});

router.get('/panier', (req, res) => {
  res.render('shopping-cart', {
    title: 'OnlineShop - Panier',
  });
});

router.get('/commande', (req, res) => {
  res.render('order', {
    title: 'OnlineShop - Commande',
  });
});

router.get('/confirmation', (req, res) => {
  res.render('confirmation', {
    title: 'OnlineShop - Confirmation',
  });
});

module.exports = router;
