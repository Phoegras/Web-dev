const User = require('../models/User');

// Show register form
const showRegisterForm = (req, res) => {
    res.render('auth-register');
};

// Register
const register = async (req, res) => {
    try {
        const { phone, name, email, password } = req.body;
        const user = new User({ phone, name, email, password });
        await user.save();
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

const signIn = async (req, res) => {
    res.redirect('/');
};

const showRePasswordForm = (req, res) => {
    res.render('auth-re-password');
};

module.exports = {
    showRegisterForm,
    register,
    showRegisterSuccess,
    showSignInForm,
    signIn,
    showRePasswordForm,
};
