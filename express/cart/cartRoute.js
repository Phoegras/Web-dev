var express = require('express');
var router = express.Router();
const cartController = require('./cartController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.use(authMiddleware.isAuthenticated);

router.get('/checkout', cartController.getCheckout);

router.post('/cart', cartController.addToCart);

router.get('/cart', cartController.getCart);

router.put('/cart', cartController.updateCart);

router.delete('/cart/:cartItemId', cartController.removeFromCart);

module.exports = router;