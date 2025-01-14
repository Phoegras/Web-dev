const express = require('express');
const router = express.Router();
const authController = require('./authController');
const authMiddleware = require('../middlewares/authMiddlewares');

// Sign in
router.get('/sign-in', authController.showSignInForm);
router.post('/sign-in', authController.signIn);

// Password
router.get('/forgot-password', authController.showForgotPasswordForm);
router.post('/forgot-password', authController.forgotPassword);
router.get('/re-password', authController.showRePasswordForm);
router.post('/re-password', authController.resetPassword);

// Logout
router.get('/logout', authController.logout);

router.use(authMiddleware.isSuperAdmin);

// Register
router.get('/register', authController.showRegisterForm);
router.post('/register', authController.register);
router.get('/verify', authController.verify);
router.get('/register-success', authController.showRegisterSuccess);

module.exports = router;
