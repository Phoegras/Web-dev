const express = require('express');
const router = express.Router();
const { getProducts, 
    getProductById, 
    getProductReviewsApi, 
    writeReviewApi 
} = require('./productsController');
const authMiddleware = require('../middlewares/authMiddlewares');

// Define route for getting all products
router.get('/', getProducts);

// Route to get a single product by ID
router.get('/:id', getProductById);

// Route to get reviews for a product
router.get('/api/:id/reviews', getProductReviewsApi);

router.post('/api/review',authMiddleware.isAuthenticated, writeReviewApi);

module.exports = router;
