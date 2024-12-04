const LocalStrategy = require('passport-local').Strategy;
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
