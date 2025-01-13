const express = require('express');
const router = express.Router();
const ordersController = require('./ordersController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/', ordersController.getOrders);
router.get('/api', ordersController.getOrdersApi);
router.patch('/:id/status', ordersController.updateOrderStatus);
router.get('/:id', ordersController.getOrdersDetail);



module.exports = router;