// controllers/homeController.js
const Product = require('../models/Product');

const getIndex = async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('index', { layout: 'layout', title: 'Home', products });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

module.exports = { getIndex };
