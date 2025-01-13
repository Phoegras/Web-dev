const express = require('express');
const router = express.Router();
const userController = require('./usersController');
const authMiddleware = require('../middlewares/authMiddlewares');

// router.get(
//     '/:id',
//     authMiddleware.isAuthenticated,
//     userController.showAccountInfo,
// );

router.get(
    '/:id',
    userController.showAccountInfo,
);

module.exports = router;
