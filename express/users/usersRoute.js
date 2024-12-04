const express = require('express');
const router = express.Router();
const userController = require('./usersController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get(
    '/account',
    authMiddleware.isAuthenticated,
    userController.showAccountInfo,
);

module.exports = router;
