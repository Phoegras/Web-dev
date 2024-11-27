const User = require('../models/User');

// Show register form
const showRegisterForm = (req, res) => {
    res.render('auth-register', {
        title: 'Register',
        noHeader: true,
        noFooter: true,
    });
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
    res.render('auth-register-success',{
        title: 'Register',
        noHeader: true,
        noFooter: true,
    });
};

// Show sign in form
const showSignInForm = (req, res) => {
    res.render('auth-sign-in', {
        title: 'Sign In',
        noHeader: true,
        noFooter: true,
    });
};

const signIn = async (req, res) => {
    res.redirect('/');
};

const showRePasswordForm = (req, res) => {
    res.render('auth-re-password',{
        title: 'Reset Your Password',
        noHeader: true,
        noFooter: true,
    });
};

module.exports = {
    showRegisterForm,
    register,
    showRegisterSuccess,
    showSignInForm,
    signIn,
    showRePasswordForm,
};
