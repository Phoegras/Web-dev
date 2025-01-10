const express = require('express');
const router = express.Router();
const accountController = require('./accountsController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/user', accountController.getUserAccountList);

module.exports = router;
