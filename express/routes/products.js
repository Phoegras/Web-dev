const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
} = require('../controllers/productController');

// Define route for getting all products
router.get('/', getProducts);

// Route to get a single product by ID
router.get('/:id', getProductById);

module.exports = router;
