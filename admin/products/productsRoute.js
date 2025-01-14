const express = require('express');
const router = express.Router();
const { getProducts,
    getProductsApi,
    sortProducts,
    filterProducts, 
    getProductById, 
    editProduct,
    addNewProduct,
    getProductForm,
    deleteProduct
} = require('./productsController');
const authMiddleware = require('../middlewares/authMiddlewares');
const {uploadSingleFile, uploadMultipleFiles} = require("../middlewares/multer");

// Define route for getting all products
router.get('/', getProducts);

router.get('/api', sortProducts);
router.get('/api/filter', filterProducts);
router.get('/api/paginated', getProductsApi);
router.delete('/api/:id', deleteProduct);
// Route to get a single product by ID
router.get('/add', getProductForm);
router.get('/:id', getProductById);

router.post('/', uploadMultipleFiles, addNewProduct);
router.post('/:id', uploadMultipleFiles, editProduct);

module.exports = router;
