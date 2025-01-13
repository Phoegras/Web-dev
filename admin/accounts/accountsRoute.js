const express = require('express');
const router = express.Router();
const accountController = require('./accountsController');
const authMiddleware = require('../middlewares/authMiddlewares');

// router.get('/:type', authMiddleware.isAuthenticated, accountController.getUserAccounts);
// router.get('/:type/api', authMiddleware.isAuthenticated, accountController.getUserAccountsApi);
// router.patch('/:type/:id/ban', authMiddleware.isAuthenticated, accountController.banAccount);
// router.patch('/:type/:id/unban', authMiddleware.isAuthenticated, accountController.unbanAccount);

router.patch('/:type/:id/unban', accountController.unbanAccount);
router.patch('/:type/:id/ban', accountController.banAccount);
router.get('/:type/api', accountController.getUserAccountsApi);
router.get('/:type', accountController.getUserAccounts);

module.exports = router;
