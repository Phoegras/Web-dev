const usersBusiness = require('./usersBusiness');
const cloudinary = require('../config/cloudinary');
const { use } = require('passport');

// Show account information
const showAccountInfo = async (req, res) => {
    try {
        const user = usersBusiness.findUserById(req.user.id);
        const orders = await usersBusiness.getOrdersByUserId(req.user.id);
        res.render('account', {
            title: 'Account',
            user,
            orders
        });
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

const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploadSingle(dataURI, 'users');
        if (!result || !result.secure_url) {
            return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
        }
        const avatarUrl = result.secure_url;
        const updatedUser = await usersBusiness.updateUserAvatar(req.user.id, avatarUrl);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = usersBusiness.findUserById(req.user.id);
        res.render('account', {
            title: 'Account',
            user: req.user
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to update avatar',
            details: err.message,
        });
    }
};

module.exports = {
    showAccountInfo,
    updateUserProfile,
    updateAvatar,
};
