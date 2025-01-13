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
    if (req.isAuthenticated() && req.user.role === 'SUPER_ADMIN') {
        return next();
    }
    res.status(403).json({ message: 'You do not have permission to do this.' });
};

module.exports = {
    isAuthenticated,
    isSuperAdmin
};
