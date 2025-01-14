const express = require('express');
const router = express.Router();
const userController = require('./usersController');
const authMiddleware = require('../middlewares/authMiddlewares');
const {upload} = require("../middlewares/multer");

router.get(
    '/account',
    authMiddleware.isAuthenticated,
    userController.showAccountInfo,
);

router.put(
    '/update-profile',
    authMiddleware.isAuthenticated,
    userController.updateUserProfile,
);

router.post(
    '/update-avatar',
    authMiddleware.isAuthenticated,
    upload.single('avatar'),
    userController.updateAvatar,
)

module.exports = router;
