const express = require('express');
const router = express.Router();
const userController = require('./usersController');
const authMiddleware = require('../middlewares/authMiddlewares');

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

module.exports = router;
