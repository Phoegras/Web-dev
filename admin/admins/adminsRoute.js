const express = require('express');
const router = express.Router();
const adminController = require('./adminsController');
const authMiddleware = require('../middlewares/authMiddlewares');
const { upload } = require('../middlewares/multer');

router.get(
    '/profile',
    authMiddleware.isAuthenticated,
    adminController.showAccountInfo,
);

router.put(
    '/update-profile',
    authMiddleware.isAuthenticated,
    adminController.updateAdminProfile,
);

router.post(
    '/upload-avatar',
    authMiddleware.isAuthenticated,
    upload.single('avatar'),
    adminController.updateAvatar,
);

module.exports = router;
