const adminBusiness = require('./adminsBusiness');
const cloudinary = require('../config/cloudinary');

// Show admin account information
const showCurrentAccountInfo = async (req, res) => {
    try {
        const admin = await adminBusiness.findAdminByEmail(req.user.email);
        res.render('profile', { admin });
    } catch (error) {
        res.status(500).json({ message: 'Error getting admin information' });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        const updatedData = req.body;
        updatedAdmin = await adminBusiness.updateAdminProfile(
            req.user.id,
            updatedData.name,
            updatedData.address,
            updatedData.phone,
            updatedData.birthday,
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
        const updatedAdmin = await adminBusiness.updateAdminAvatar(req.user.id, avatarUrl);
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

// Show account information
const showAccountDetailById = async (req, res) => {
    const id = req.params;
    try {
        const account = await adminBusiness.findAdminById(id);
        res.render('admin-detail', { account });
    } catch (error) {
        res.status(500).json({ message: 'Error getting account information' });
    }
};

module.exports = {
    showCurrentAccountInfo,
    updateAdminProfile,
    updateAvatar,
    showAccountDetailById,
};
