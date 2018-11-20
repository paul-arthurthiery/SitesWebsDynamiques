const express = require('express');
const {
  Product,
} = require('../lib/db');

const router = express.Router();

const countProducts = (req) => {
  let itemsCount = 0;
  if (req.session.cart) {
    req.session.cart.forEach((product) => {
      itemsCount += product.quantity;
    });
  }
  return itemsCount;
};

router.get(['/', '/accueil'], (req, res) => {
  res.render('index', {
    title: 'OnlineShop - Accueil',
    itemsCount: countProducts(req),
  });
});
router.get('/produits', (req, res) => {
  Product.find()
    .then((products) => {
      products.sort((a, b) => a.price - b.price);
      res.render('products', {
        title: 'OnlineShop - Produits',
        products,
        itemsCount: countProducts(req),
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
      itemsCount: countProducts(req),
    });
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'OnlineShop - Contact',
    itemsCount: countProducts(req),
  });
});

router.get('/panier', (req, res) => {
  res.render('shopping-cart', {
    title: 'OnlineShop - Panier',
    itemsCount: countProducts(req),
  });
});

router.get('/commande', (req, res) => {
  res.render('order', {
    title: 'OnlineShop - Commande',
    itemsCount: countProducts(req),
  });
});

router.get('/confirmation', (req, res) => {
  res.render('confirmation', {
    title: 'OnlineShop - Confirmation',
    itemsCount: countProducts(req),
  });
});

module.exports = router;
