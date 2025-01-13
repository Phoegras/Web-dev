const express = require('express');
const router = express.Router();
const orderController = require('./ordersController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.use(authMiddleware.isAuthenticated);

router.get('/api', orderController.getOrders);
router.get('/checkout', orderController.renderCheckoutPage);
router.post('/place-order', orderController.placeOrder);

module.exports = router;
