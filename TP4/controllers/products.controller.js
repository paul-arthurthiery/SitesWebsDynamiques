const {
  Product,
} = require('../lib/db');
const validator = require('validator');

const categories = ['cameras', 'computers', 'consoles', 'screens'];

// seperate sorting function to keep functions on the smaller side
const sortByCriteria = (array, criteria) => {
  switch (true) {
    case criteria === 'alpha-asc':
      array.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1));
      break;
    case criteria === 'alpha-dsc':
      array.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase() ? -1 : 1));
      break;
    case criteria === 'price-dsc':
      array.sort((a, b) => b.price - a.price);
      break;
    case criteria === 'price-asc' || !criteria:
      array.sort((a, b) => a.price - b.price);
      break;
    default:
      throw new Error('Invalid sorting criteria');
  }
  return array;
};

// Retrieve all products
exports.findAll = (req, res) => {
  const selectedCategory = req.query.category;
  const selectedCriteria = req.query.criteria;
  if (selectedCategory && !categories.includes(selectedCategory)) {
    res.status(400).send({
      message: 'Invalid category',
    });
    return;
  }
  Product.find(selectedCategory ? {
    category: selectedCategory,
  } : undefined)
    .then((products) => {
      const sortedProducts = sortByCriteria(products, selectedCriteria);
      res.status(200).send(sortedProducts);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || 'Some error occurred while find your products',
      });
    });
};

// Retrieve Product with matching id
exports.findOne = (req, res) => {
  Product.findOne({
    id: req.params.id,
  })
    .then((foundProduct) => {
      if (!foundProduct) throw new Error();
      res.status(200).send(foundProduct);
    })
    .catch((err) => {
      res.status(404).send({
        message: err.message || 'No matching product found',
      });
    });
};

// Create new Product
exports.create = (req, res) => {
  if (!(validator.isInt(`${req.body.id}`) &&
      req.body.name.length > 0 &&
      validator.isFloat(`${req.body.price}`, {
        min: 0.0,
      }) &&
      req.body.image.length > 0 &&
      categories.includes(req.body.category) &&
      req.body.description.length > 0 &&
      !req.body.features.includes(''))) {
    res.status(400).send({
      message: `Error creating your product, check your parameters: ${JSON.stringify(req.body)}`,
    });
    return;
  }
  const newProduct = new Product({
    id: parseInt(req.body.id, 10),
    name: req.body.name,
    price: parseFloat(req.body.price),
    image: req.body.image,
    category: req.body.category,
    description: req.body.description,
    features: req.body.features,
  });

  newProduct.save((err) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(400).send({
          message: 'Product id already exists',
        });
        return;
      }
      res.status(400).send({
        message: err.message || 'Error creating your product',
      });
    } else {
      res.status(201).send({
        message: `Created product ${req.body.name}`,
      });
    }
  });
};

// Delete a single Product
exports.deleteOne = (req, res) => {
  const idToDelete = req.params.id;
  Product.findOneAndRemove({
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

// Delete every Product
exports.deleteAll = (req, res) => {
  Product.deleteMany()
    .then(() => {
      res.status(204).send();
    });
};
