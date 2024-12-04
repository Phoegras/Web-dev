const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl;

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        // For AJAX requests, respond with JSON
        return res.status(401).json({
            success: false,
            message: 'User not authenticated. Redirecting to login page.',
        });
    } else {
        // For non-AJAX requests, redirect the user to the sign-in page
        req.flash('error_msg', 'Please log in to access this page');
        return res.redirect('/auth/sign-in');
    }
};

const isRememberLogin = (req, res, next) => {
    if (req.body.remember === 'yes') {
        console.log('COOKIE  ', req.session.cookie.maxAge);
        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
    } else {
        req.session.cookie.maxAge = null;
    }
    next();
};

module.exports = {
    isAuthenticated,
    isRememberLogin,
};
