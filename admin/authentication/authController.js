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
        admin: req.user,
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

        // Check if admin already exists
        const existingAdmin = await authBusiness.findAdminByEmail(email);
        if (existingAdmin) {
            return res.status(400).json({ message: 'Account already exists.' });
        }

        if (email === process.env.SUPER_ADMIN_EMAIL) {
            return res.status(400).json({ message: 'Account already exists.' });
        }

        // Validate password complexity
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
            });
        }

        sendEmail(email);

        // Create admin
        await authBusiness.createAdmin({
            email,
            password,
            name,
        });

        return res.status(201).json({
            message:
                'Registration successful. Please check your email to verify your account.',
        });
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

async function sendEmail(email) {
    // Generate email verification token
    const hashedEmail = await bcrypt.hash(
        email,
        parseInt(process.env.BCRYPT_SALT_ROUND),
    );

    // Construct verification link
    const verificationLink = `${process.env.APP_URL}/auth/verify?email=${email}&token=${hashedEmail}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
            table {
                border-spacing: 0;
                width: 100%;
            }
            td {
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .email-header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-size: 24px;
            }
            .email-body {
                padding: 20px;
                color: #333333;
                line-height: 1.6;
            }
            .email-body p {
                margin: 0 0 16px;
            }
            .verify-btn {
                display: inline-block;
                background-color: #4CAF50;
                color: #ffffff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 4px;
                font-size: 16px;
            }
            .verify-btn:hover {
                background-color: #45a049;
            }
            .email-footer {
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #999999;
            }
        </style>
    </head>
    <body>
        <table role="presentation" class="email-container">
            <tr>
                <td class="email-header">
                    Verify Your Email
                </td>
            </tr>
            <tr>
                <td class="email-body">
                    <p>Hi there,</p>
                    <p>Thank you for signing up! Please confirm your email address by clicking the button below:</p>
                    <p style="text-align: center;">
                        <a href="${verificationLink}" class="verify-btn">Verify Email</a>
                    </p>
                    <p>If you did not create this account, you can safely ignore this email.</p>
                </td>
            </tr>
            <tr>
                <td class="email-footer">
                    &copy; ${new Date().getFullYear()} Techwind. All rights reserved.
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    // Send verification email
    await mailer.sendMail(
        email,
        'Verify Email',
        htmlContent,
    );
}

// Show register success notification
const showRegisterSuccess = (req, res) => {
    res.render('auth-register-success', {
        title: 'Register',
        noHeader: true,
        noFooter: true,
        admin: req.user,
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
    passport.authenticate('local', async (err, admin, info) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'An internal error occurred. Please try again later.',
            });
        }

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: info.message || 'Invalid email or password.',
            });
        }

        try {
            // Check if email is verified
            const adminInDb = await authBusiness.findAdminByEmail(admin.email);

            if (!adminInDb.emailVerifiedAt) {
                return res.status(403).json({
                    success: false,
                    message: 'Please verify your email before logging in.',
                });
            }

            // Handle successful login
            const redirectTo = req.session.returnTo || '/';
            req.login(admin, (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'An internal error occurred during login.',
                    });
                }

                // Set cookie expiration
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

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
        const admin = await authBusiness.findAdminByEmail(email);

        if (!admin) {
            return res.status(200).json({
                message: 'If the email exists, a password reset link has been sent.',
            });
        }

        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(token, parseInt(process.env.BCRYPT_SALT_ROUND));
        const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await authBusiness.storeResetToken(admin.id, hashedToken, tokenExpiry);

        const resetLink = `${process.env.APP_URL}/auth/re-password?email=${admin.email}&token=${token}`;
        await mailer.sendMail(
            admin.email,
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

        await authBusiness.changePassword(resetRecord.adminId, password);
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
