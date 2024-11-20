const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register-success', authController.showRegisterSuccess);
router.get('/register', authController.showRegisterForm);
router.post('/register', authController.register);
router.get('/sign-in', authController.showSignInForm);
router.post('/sign-in', authController.signIn);
router.get('/re-password', authController.showRePasswordForm);

module.exports = router;
