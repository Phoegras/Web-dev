const express = require('express');
const router = express.Router();
const authController = require('./authController');
const passport = require('passport');

// Register
router.get('/register', authController.showRegisterForm);
router.post('/register', authController.register);
router.get('/verify', authController.verify);
router.get('/register-success', authController.showRegisterSuccess);

// Sign in
router.get('/sign-in', authController.showSignInForm);
router.post('/sign-in', authController.signIn);
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
);
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/sign-in',
        failureFlash: true,
    }),
    authController.googleSignIn,
);

// Password
router.get('/forgot-password', authController.showForgotPasswordForm);
router.post('/forgot-password', authController.forgotPassword);
router.get('/re-password', authController.showRePasswordForm);
router.post('/re-password', authController.resetPassword);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
