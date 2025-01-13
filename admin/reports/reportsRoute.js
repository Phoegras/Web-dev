const express = require('express');
const router = express.Router();

const reportsController = require('./reportsController');

router.get("/api/revenue", reportsController.getRevenueReport);
router.get("/api/top-products", reportsController.getTopProductsByRevenue);

module.exports = router;