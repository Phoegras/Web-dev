// const express = require('express');
// const { getProducts } = require('../controllers/productController');
// const router = express.Router();

// router.get('/products', getProducts);

// module.exports = router;

// backend/routes/products.js
var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');

// Define route for getting all products
router.get('/', productController.getProducts);

module.exports = router;