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
    itemsCount: countProducts(req),
  });
});
router.get('/produits', (req, res) => {
  Product.find()
    .then((products) => {
      products.sort((a, b) => a.price - b.price);
      res.render('products', {
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
      product,
      itemsCount: countProducts(req),
    });
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    itemsCount: countProducts(req),
  });
});

router.get('/panier', async (req, res) => {
  let cart = [];
  if (req.session.cart) {
    cart = await Promise.all(req.session.cart.map(async (entry) => {
      const newEntry = await Product.findOne({
        id: entry.productId,
      });
      newEntry.quantity = entry.quantity;
      return newEntry;
    }));
  }
  res.render('shopping-cart', {
    title: 'OnlineShop - Panier',
    itemsCount: countProducts(req),
    cart,
  });
});

router.get('/commande', (req, res) => {
  res.render('order', {
    itemsCount: countProducts(req),
  });
});

router.get('/confirmation', (req, res) => {
  res.render('confirmation', {
    itemsCount: countProducts(req),
  });
});

module.exports = router;
