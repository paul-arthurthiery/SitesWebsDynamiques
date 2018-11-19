const validator = require('validator');
const {
  Order,
  Product,
} = require('../lib/db');

exports.findAll = (req, res) => {
  Order.find()
    .then((orders) => {
      res.status(200).send(orders);
    });
};

exports.findOne = (req, res) => {
  Order.findOne({
    id: parseInt(req.params.id, 10),
  })
    .then((order) => {
      if (!order) throw new Error('No order found');
      res.status(200).send(order);
    })
    .catch((err) => {
      res.status(404).send({
        message: err.message,
      });
    });
};

exports.create = async (req, res) => {
  try {
    if (!(
      validator.isInt(`${req.body.id}`, {
        min: 0,
      }) &&
        validator.isLength(req.body.firstName, {
          min: 1,
          max: undefined,
        }) &&
        validator.isLength(req.body.lastName, {
          min: 1,
          max: undefined,
        }) &&
        validator.isEmail(req.body.email) &&
        validator.isMobilePhone(`${req.body.phone}`, 'en-CA'))) {
      throw new Error(`Error creating your order, check your parameters: ${JSON.stringify(req.body)}`);
    }

    await Promise.all(req.body.products.map(async (product) => {
      if (!(validator.isInt(`${product.id}`, {
        min: 0,
      }) &&
          validator.isInt(`${product.quantity}`, {
            gt: 0,
          })
      )) {
        throw new Error(`Error creating order, check your products: ${JSON.stringify(req.body.products)}`);
      }
      const productModel = await Product.findOne({
        id: product.id,
      });
      if (!productModel) {
        throw new Error('Error creating order, some products do not exist in database');
      }
    }));

    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).send('Order created');
  } catch (err) {
    res.status(400).send({
      message: err.message || 'Error adding order to database',
    });
  }
};

exports.deleteOne = (req, res) => {
  const idToDelete = req.params.id;
  Order.findOneAndRemove({
    id: idToDelete,
  })
    .then((product) => {
      if (!product) throw new Error();
      res.status(204).send();
    })
    .catch(err => (
      res.status(404).send({
        message: err.message || `No product with id ${idToDelete} was found`,
      })
    ));
};

exports.deleteAll = (req, res) => {
  Order.deleteMany()
    .then(() => {
      res.status(204).send();
    });
};
