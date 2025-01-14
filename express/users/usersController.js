const usersBusiness = require('./usersBusiness');

// Show account information
const showAccountInfo = async (req, res) => {
    try {
        const { user, userProfile } = await usersBusiness.findUserByEmail(
            req.user.email,
        );
        res.render('account', { title: 'My account', user, userProfile });
    } catch (error) {
        res.status(500).json({ message: 'Error getting user information' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = usersBusiness.updateUserProfile(
            req.user.id,
            req.body.name,
            req.body.address,
            req.body.phone,
            req.body.dateOfBirth,
        );
        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
        });
    }
};

module.exports = {
    showAccountInfo,
    updateUserProfile,
};
