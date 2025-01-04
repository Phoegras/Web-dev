const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl;

    if (req.headers['sec-fetch-dest'] == 'empty') {
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

const isSuperAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.admin.role === 'super_admin') {
        return next();
    }
    req.flash('error_msg', 'You do not have permission to access this page.');
    res.redirect('/auth/sign-in');
};

module.exports = {
    isAuthenticated,
    isSuperAdmin
};
