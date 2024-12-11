var express = require('express');
var router = express.Router();
const cartController = require('./cartController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.use(authMiddleware.isAuthenticated);

router.post('/', cartController.addToCart);

router.get('/', cartController.getCart);

router.put('/', cartController.updateCart);

router.delete('/:cartItemId', cartController.removeFromCart);

module.exports = router;
