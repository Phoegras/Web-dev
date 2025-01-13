const express = require('express');
const router = express.Router();
const { addManufacturer, updateManufacturer, deleteManufacturer, getAllManufacturers } = require('./manufacturersController');
router.get('/', getAllManufacturers); // Fetch manufacturers
router.post('/api', addManufacturer); // Add manufacturer
router.put('/api/:id', updateManufacturer); // Update manufacturer
router.delete('/api/:id', deleteManufacturer); // Delete manufacturer

module.exports = router;