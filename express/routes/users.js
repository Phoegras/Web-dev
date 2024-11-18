const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes
router.get('/register-success', userController.showRegisterSuccess);
router.get('/register', userController.showRegisterForm);
router.post('/register', userController.registerUser);

module.exports = router;