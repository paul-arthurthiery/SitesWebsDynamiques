const {
  Product,
} = require('../lib/db');
const validator = require('validator');

exports.getAll = (req, res) => {
  if (!req.session.cart) req.session.cart = [];
  res.status(200).send(req.session.cart);
};

exports.getOne = (req, res) => {
  let foundProduct;
  const wantedId = req.params.productId;
  if (req.session.cart) {
    foundProduct = req.session.cart.find(product => product.productId === parseInt(wantedId, 10));
  }
  if (!foundProduct) {
    res.status(404).send({
      message: 'Product not found',
    });
  } else res.status(200).send(foundProduct);
};

exports.add = (req, res) => {
  const productToAdd = req.body.productId;
  const quantityToAdd = req.body.quantity;
  if (!validator.isInt(`${quantityToAdd}`, {
    gt: 0,
  })) {
    res.status(400).send({
      message: 'Invalid propert',
    });
    return;
  }
  Product.findOne({
    id: productToAdd,
  })
    .then((foundProduct) => {
      if (!foundProduct) throw new Error('This product doesn\'t exist');
      if (!req.session.cart) req.session.cart = [];
      if (req.session.cart.find(product => product.productId === productToAdd)) throw new Error('Product already in cart');
      req.session.cart.push(req.body);
      res.status(201).send('Product added to cart');
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || 'No matching product found',
      });
    });
};

exports.addExisting = (req, res) => {
  if (!validator.isInt(`${req.body.quantity}`)) {
    res.status(400).send({
      message: 'Invalid quantiy',
    });
    return;
  }
  const productToEdit = req.session.cart.find(product =>
    product.productId === parseInt(req.params.productId, 10));
  if (!productToEdit) {
    res.status(404).send({
      message: 'Selected product not in cart',
    });
    return;
  }
  productToEdit.quantity = req.body.quantity;
  res.status(204).send();
};

exports.delete = (req, res) => {
  const oldCartLength = req.session.cart.length;
  const newCart = req.session.cart.filter(product =>
    product.productId !== parseInt(req.params.productId, 10));
  if (oldCartLength === newCart.length) {
    res.status(404).send({
      message: 'Product not in cart',
    });
    return;
  }
  req.session.cart = newCart;
  res.status(204).send();
};

exports.deleteAll = (req, res) => {
  req.session.cart = [];
  res.status(204).send();
};
