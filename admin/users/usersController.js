const usersBusiness = require('./usersBusiness');

// Show account information
const showAccountInfo = async (req, res) => {
    const id = req.params;
    try {
        const account = await usersBusiness.findUserById(id);
        res.render('user-detail', { account, admin: req.user });
    } catch (error) {
        res.status(500).json({ message: 'Error getting user information' });
    }
};

module.exports = {
    showAccountInfo,
};
