const router = require('express').Router();
const shoppingCart = require('../controllers/cart.controller.js');

// Retrieve shopping cart elements
router.get('/api/shopping-cart', shoppingCart.getAll);

// Retrieve an element from the shopping cart with matching id
router.get('/api/shopping-cart/:productId', shoppingCart.getOne);

// Add an amount of similar elements to the shopping cart
router.post('/api/shopping-cart', shoppingCart.add);

// Add more elements already present in the shopping cart
router.put('/api/shopping-cart/:productId', shoppingCart.addExisting);

// Delete elements of matching id from cart
router.delete('/api/shopping-cart/:productId', shoppingCart.delete);

// Empty shopping cart
router.delete('/api/shopping-cart', shoppingCart.deleteAll);

module.exports = router;
