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
router.get('/filter', filterProducts);
router.get('/api/paginated', getProductsApi);
// Route to get a single product by ID
router.get('/add', getProductForm);
router.get('/:id', getProductById);

router.post('/', uploadMultipleFiles, addNewProduct);
router.post('/:id', uploadMultipleFiles, editProduct);

router.delete('/api/:id', deleteProduct);

const { uploadSingle } = require("../config/cloudinary");
router.post("/upload", uploadSingleFile, async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const cldRes = await uploadSingle(dataURI, "users");
    console.log(cldRes);
    res.status(200).json(cldRes);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
});
module.exports = router;
