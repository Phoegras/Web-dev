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
                    const user = await authBusiness.findUserByEmail(email);
                    if (!user) {
                        return done(null, false, {
                            message: 'User not found.',
                        });
                    }

                    const isMatch = await authBusiness.comparePassword(
                        password,
                        user.password,
                    );
                    if (!isMatch) {
                        return done(null, false, {
                            message: 'Incorrect password.',
                        });
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            },
        )
    );

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.APP_URL}/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await authBusiness.findUserByEmail(
                        profile.emails[0].value,
                    );
                    const data = {
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        type: 'GOOGLE',
                        emailVerifiedAt: new Date(),
                    };
                    if (!user) {
                        user = await authBusiness.createUser(data);
                    }

                    done(null, user);
                } catch (err) {
                    done(err, null);
                }
            },
        ),
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await authBusiness.findUserById(id);
            if (!user) {
                return done(new Error('User not found'));
            }
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
