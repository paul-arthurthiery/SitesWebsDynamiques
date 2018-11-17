const router = require('express').Router();

const products = require('../controllers/products.controller.js');

// Retrieve all products
router.get('/api/products', products.findAll);

// Retrieve a product with matching id
router.get('/api/products/:id', products.findOne);

// Create a new product
router.post('/api/products', products.create);

// Delete a product with matching id
router.delete('/api/products/:id', products.deleteOne);

// Delete all products
router.delete('/api/products', products.deleteAll);

module.exports = router;
