const authBusiness = require('./authBusiness');
const passport = require('passport');
const mailer = require('../utils/mailer');
const bcrypt = require('bcryptjs');
const validator = require('validator');

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
        const { name, email, password } = req.body;

        // Validate inputs
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: 'All fields are required.' });
        }

        // Check if user already exists
        const existingUser = await authBusiness.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Account already exists.' });
        }

        // Validate password complexity
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
            });
        }

        // Generate email verification token
        const hashedEmail = await bcrypt.hash(
            email,
            parseInt(process.env.BCRYPT_SALT_ROUND),
        );

        // Construct verification link
        const verificationLink = `${process.env.APP_URL}/auth/verify?email=${email}&token=${hashedEmail}`;

        // Send verification email
        const { success, message, error } = await mailer.sendMail(
            email,
            'Verify Email',
            `<a href="${verificationLink}">Click here to verify your email</a>`,
        );

        if (!success) {
            return res.status(404).json({
                message: message,
            });
        } else {
            // Create user
            await authBusiness.createUser({
                email,
                password,
                name,
            });

            return res.status(201).json({
                message:
                    'Registration successful. Please check your email to verify your account.',
            });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: 'Registration failed. Please try again later.' });
    }
};

const verify = async (req, res) => {
    try {
        const isMatch = await bcrypt.compare(req.query.email, req.query.token);
        if (isMatch) {
            const { error, data } = await authBusiness.verifyAdminEmail(
                req.query.email,
            );

            if (!error) {
                console.log('Verification successful');
                return res.redirect('/auth/sign-in');
            } else if (error.kind === 'not_found') {
                return res.redirect('/404');
            } else {
                console.error('Error updating verification status: ', error);
                return res.redirect('/500');
            }
        } else {
            console.log('Token mismatch');
            return res.redirect('/404');
        }
    } catch (err) {
        console.error('Error during verification process: ', err);
        return res.redirect('/500');
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
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'An internal error occurred. Please try again later.',
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: info.message || 'Invalid email or password.',
            });
        }

        try {
            // Check if email is verified
            const userInDb = await authBusiness.findUserByEmail(user.email);

            if (!userInDb.emailVerifiedAt) {
                return res.status(403).json({
                    success: false,
                    message: 'Please verify your email before logging in.',
                });
            }

            // Handle successful login
            const redirectTo = req.session.returnTo || '/';
            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'An internal error occurred during login.',
                    });
                }

                // Set cookie expiration based on "Remember Me" option
                if (req.body.rememberMe === 'yes') {
                    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
                } else {
                    req.session.cookie.expires = false;
                }

                delete req.session.returnTo;
                return res.status(200).json({
                    success: true,
                    message: 'Login successful!',
                    redirectTo,
                });
            });
        } catch (error) {
            console.error('Error checking email verification:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred. Please try again later.',
            });
        }
    })(req, res, next);
};

// Show forgot-password form
const showForgotPasswordForm = (req, res) => {
    res.render('auth-forgot-password', {
        title: 'Forgot Password',
        noHeader: true,
        noFooter: true,
    });
};

// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await authBusiness.findUserByEmail(email);

        if (!user) {
            return res.status(200).json({
                message: 'If the email exists, a password reset link has been sent.',
            });
        }

        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(token, parseInt(process.env.BCRYPT_SALT_ROUND));
        const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await authBusiness.storeResetToken(user.id, hashedToken, tokenExpiry);

        const resetLink = `${process.env.APP_URL}/auth/re-password?email=${user.email}&token=${token}`;
        await mailer.sendMail(
            user.email,
            'Reset password',
            `<a href="${resetLink}">Reset Password</a>`
        );

        res.status(200).json({
            message: 'If the email exists, a password reset link has been sent.',
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'An unexpected error occurred. Please try again later.',
        });
    }
};

// Show re-password form
const showRePasswordForm = async (req, res) => {
    const { email, token } = req.query;

    if (!email || !token) {
        return res.redirect('/errors?message=Invalid link');
    }

    console.log(email);


    try {
        const resetRecord = await authBusiness.findResetTokenByEmail(email);

        if (!resetRecord) {
            return res.redirect('/errors?message=Reset link not found');
        }

        if (resetRecord.expiry < Date.now()) {
            return res.redirect('/errors?message=Reset link has expired');
        }

        const isTokenValid = await bcrypt.compare(token, resetRecord.hashedToken);
        if (!isTokenValid) {
            return res.redirect('/errors?message=Invalid reset token');
        }

        res.render('auth-re-password', {
            title: 'Reset Your Password',
            noHeader: true,
            noFooter: true,
            token: token,
            email: email,
        });
    } catch (error) {
        console.error(error.message);
        res.redirect('/auth/error?message=An unexpected error occurred');
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
        return res.status(400).json({
            message: 'Invalid data.',
        });
    }

    try {
        const resetRecord = await authBusiness.findResetTokenByEmail(email);

        if (!resetRecord || resetRecord.expiry < Date.now()) {
            return res.status(400).json({ message: 'Reset link has expired' });
        }

        const isTokenValid = await bcrypt.compare(token, resetRecord.hashedToken);
        if (!isTokenValid) {
            return res.status(400).json({ message: 'Reset link not found' });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
            });
        }

        console.log(resetRecord);

        await authBusiness.changePassword(resetRecord.userId, password);
        await authBusiness.deleteResetToken(resetRecord.id);

        res.status(200).json({
            message: 'Password has been changed successfully!',
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'An unexpected error occurred. Please try again later.',
        });
    }
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
    verify,
    showRegisterSuccess,
    showSignInForm,
    signIn,
    showForgotPasswordForm,
    forgotPassword,
    showRePasswordForm,
    resetPassword,
    logout,
};
