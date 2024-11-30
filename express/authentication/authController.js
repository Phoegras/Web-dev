const authBusiness = require('./authBusiness');
const passport = require('passport');

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
        const existingUser = await authBusiness.findUserByEmail(email);
        console.log(existingUser.email);
        if (existingUser) {
            return res.render('auth-register', { 
                title: 'Register',
                noHeader: true,
                noFooter: true,
                error: 'Email already exists.',
                phone: phone,
                name: name,
            });
        }
        await authBusiness.createUser({ phone, name, email, password });
        return res.redirect('/auth/register-success');
    } catch (error) {
        res.status(400).send('Registration failed: ' + error.message);
    }
};

// Show register success notification
const showRegisterSuccess = (req, res) => {
    res.render('auth-register-success', {
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

// Sign in
const signIn = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash('error', info.message || 'Missing credentials');
            return res.redirect('/auth/sign-in');
        }
        const redirectTo = req.session.returnTo || '/';
        req.login(user, (err) => {
            if (err) return next(err);

            if (req.body.rememberMe === 'yes') {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
            } else {
                req.session.cookie.expires = false;
            }

            delete req.session.returnTo;
            return res.redirect(redirectTo);
        });
    })(req, res, next);
};

// Show re-password form
const showRePasswordForm = (req, res) => {
    res.render('auth-re-password', {
        title: 'Reset Your Password',
        noHeader: true,
        noFooter: true,
    });
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
