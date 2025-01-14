const express = require('express');
const router = express.Router();
const orderController = require('./ordersController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.use(authMiddleware.isAuthenticated);

router.get('/checkout', orderController.renderCheckoutPage);
router.post('/place-order', orderController.placeOrder);
router.get('/history', orderController.getOrderHistory);
router.get('/:id', orderController.getOrderById);

module.exports = router;
