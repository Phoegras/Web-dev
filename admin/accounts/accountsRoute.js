const express = require('express');
const router = express.Router();
const accountController = require('./accountsController');
const authMiddleware = require('../middlewares/authMiddlewares');

// router.get('/profile', authMiddleware.isAuthenticated, accountController.getProfile);
// router.post('/profile', authMiddleware.isAuthenticated, accountController.updateProfile);

module.exports = router;
