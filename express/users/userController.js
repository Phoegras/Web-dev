const usersBusiness = require('../business/usersBusiness');

// Show account information
const showAccountInfo = async (req, res) => {
    try {
        const user = await usersBusiness.findUserByEmail(req.user.email);
        res.render('account', { user });
    } catch (error) {
        res.status(500).json({ message: "Error getting user information" });
    }
}

module.exports = {
    showAccountInfo,
};
