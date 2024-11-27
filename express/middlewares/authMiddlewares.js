const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    req.flash('error_msg', 'Please log in to access this page');
    res.redirect('/auth/sign-in');
};

const isRememberLogin = (req, res, next) => {
    if (req.body.remember === 'yes') {
        console.log('COOKIE  ', req.session.cookie.maxAge);
        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
    } else {
        req.session.cookie.maxAge = null;
    }
    next();
}

module.exports = {
    isAuthenticated,
    isRememberLogin,
}
