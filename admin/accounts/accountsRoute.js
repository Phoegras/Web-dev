const express = require('express');
const router = express.Router();
const accountController = require('./accountsController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/user', accountController.getUserAccountList);
router.get('/admin', accountController.getAdminAccountList);

module.exports = router;
