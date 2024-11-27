const express = require('express');
const router = express.Router();
const authController = require('./authController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/register-success', authController.showRegisterSuccess);
router.get('/register', authController.showRegisterForm);
router.post('/register', authController.register);
router.get('/sign-in', authController.showSignInForm);
router.post('/sign-in', authController.signIn);
router.get('/re-password', authController.showRePasswordForm);
router.get('/logout', authController.logout);

module.exports = router;
