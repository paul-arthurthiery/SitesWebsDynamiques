const router = require('express').Router();
const order = require('../controllers/orders.controller');

// Retrieve all orders
router.get('/api/orders', order.findAll);

// Retrieve an order with matching id
router.get('/api/orders/:id', order.findOne);

// Create a new order
router.post('/api/orders', order.create);

// Delete an order with matching id
router.delete('/api/orders/:id', order.deleteOne);

// Empty orders
router.delete('/api/orders', order.deleteAll);

module.exports = router;
