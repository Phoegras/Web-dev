const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const authBusiness = require('../authentication/authBusiness');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' },
            async (email, password, done) => {
                try {
                    const admin = await authBusiness.findAdminByEmail(email);
                    if (!admin) {
                        return done(null, false, {
                            message: 'Admin not found.',
                        });
                    }

                    const isMatch = await authBusiness.comparePassword(
                        password,
                        admin.password,
                    );
                    if (!isMatch) {
                        return done(null, false, {
                            message: 'Incorrect password.',
                        });
                    }
                    if (admin.status === 'BANNED') {
                        return done(null, false, {
                            message: 'Your account has been banned!',
                        })
                    }
                    return done(null, admin);
                } catch (err) {
                    return done(err);
                }
            },
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const admin = await authBusiness.findAdminById(id);
            if (!admin) {
                return done(new Error('Admin not found'));
            }
            done(null, admin);
        } catch (err) {
            done(err);
        }
    });
};
