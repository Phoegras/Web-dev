const authBusiness = require('./authBusiness');
const passport = require('passport');

// Show register form
const showRegisterForm = (req, res) => {
    res.render('auth-register');
};

// Register
const register = async (req, res) => {
    try {
        const { phone, name, email, password } = req.body;
        await authBusiness.createUser({ phone, name, email, password });
        res.redirect('/auth/register-success');
    } catch (error) {
        res.status(400).send('Registration failed: ' + error.message);
    }
};

// Show register success notification
const showRegisterSuccess = (req, res) => {
    res.render('auth-register-success');
};

// Show sign in form
const showSignInForm = (req, res) => {
    res.render('auth-sign-in');
};

// Sign in
const signIn = async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: req.session.returnTo || '/',
        failureRedirect: '/auth/sign-in',
        failureFlash: true,
    })(req, res, next);
};

// Show re-password form
const showRePasswordForm = (req, res) => {
    res.render('auth-re-password');
};

// Sign out
const logout = (req, res) => {
    const returnUrl = req.query.returnUrl || '/';

    req.logout((err) => {
        if (err) return next(err);
        res.redirect(returnUrl);
    });
};

module.exports = {
    showRegisterForm,
    register,
    showRegisterSuccess,
    showSignInForm,
    signIn,
    showRePasswordForm,
    logout,
};
