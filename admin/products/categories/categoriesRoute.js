const express = require('express');
const router = express.Router();
const { addCategory, updateCategory, deleteCategory, getAllCategories } = require('./categoriesController');
router.post('/api', addCategory); // Add category
router.put('/api/:id', updateCategory); // Update category
router.delete('/api/:id', deleteCategory); // Delete category
router.get('/', getAllCategories); // Fetch categories

module.exports = router;
