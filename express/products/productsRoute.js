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

const {upload} = require("../middlewares/multer");
const { uploadSingle } = require("../config/cloudinary");
router.post("/upload", upload.single("file"), async (req, res) => {
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
