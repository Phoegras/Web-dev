const express = require('express');
const router = express.Router();
const accountController = require('./accountsController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/:type', authMiddleware.isAuthenticated, accountController.getUserAccounts);
router.get('/:type/api', authMiddleware.isAuthenticated, accountController.getUserAccountsApi);
router.patch('/:type/:id/ban', authMiddleware.isAuthenticated, accountController.banAccount);
router.patch('/:type/:id/unban', authMiddleware.isAuthenticated, accountController.unbanAccount);

module.exports = router;
