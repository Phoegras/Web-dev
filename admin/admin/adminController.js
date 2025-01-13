const adminBusiness = require('./adminBusiness');
const cloudinary = require('../config/cloudinary');

// Show admin account information
const showAccountInfo = async (req, res) => {
    try {
        const { admin, adminProfile } = await adminBusiness.findAdminByEmail(req.admin.email);
        res.render('account', { admin, adminProfile });
    } catch (error) {
        res.status(500).json({ message: 'Error getting admin information' });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        const updatedAdmin = await adminBusiness.updateAdminProfile(
            req.admin.id,
            req.body.name,
            req.body.address,
            req.body.phone,
            req.body.dateOfBirth,
        );
        res.status(200).json({ success: true, admin: updatedAdmin });
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
        const result = await cloudinary.uploadSingle(req.file, 'admins');
        if (!result || !result.secure_url) {
            return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
        }
        const avatarUrl = result.secure_url;
        const updatedAdmin = await adminBusiness.updateAdminAvatar(req.admin.id, avatarUrl);
        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Avatar updated successfully',
            avatarUrl,
        });
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
    updateAdminProfile,
    updateAvatar,
};
