const usersBusiness = require('./usersBusiness');

// Show account information
const showAccountInfo = async (req, res) => {
    const id = req.params;
    try {
        const user = await usersBusiness.findUserById(id);
        console.log(user);
        res.render('user-detail', { user });
    } catch (error) {
        res.status(500).json({ message: 'Error getting user information' });
    }
};

module.exports = {
    showAccountInfo,
};
