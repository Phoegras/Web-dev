const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productSchema = new Schema({
  image: String,
  name: String,
  price: Number,
  originalPrice: Number,
  isNew: Boolean,
  rating: Number,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
