const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Order = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  products: Array,
}, {
  versionKey: false,
});


const Product = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  features: Array,
}, {
  versionKey: false,
});

exports.Order = mongoose.model('Order', Order);
exports.Product = mongoose.model('Product', Product);

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/onlineShop', {
  useMongoClient: true,
});
