const User = require('../models/User');

// Show register form
exports.showRegisterForm = (req, res) => {
    res.render('register', { layout: false });
};

// Register
exports.registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.redirect('/users/register-success');
    } catch (error) {
        res.status(400).send('Registration failed: ' + error.message);
    }
};

// Show register success notification
exports.showRegisterSuccess = (req, res) => {
    res.render('register-success', { layout: false });
};