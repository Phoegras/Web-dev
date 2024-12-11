const usersBusiness = require('./usersBusiness');

// Show account information
const showAccountInfo = async (req, res) => {
    try {
        const { user, userProfile } = await usersBusiness.findUserByEmail(req.user.email);
        res.render('account', { user, userProfile });
    } catch (error) {
        res.status(500).json({ message: 'Error getting user information' });
    }
};

module.exports = {
    showAccountInfo,
};
