const express = require('express');
const router = express.Router();
const accountController = require('./accountsController');
const authMiddleware = require('../middlewares/authMiddlewares');

// router.get('/:type', authMiddleware.isAuthenticated, accountController.getUserAccounts);
// router.get('/:type/api', authMiddleware.isAuthenticated, accountController.getUserAccountsApi);
// router.patch('/:type/:id/ban', authMiddleware.isAuthenticated, accountController.banAccount);
// router.patch('/:type/:id/unban', authMiddleware.isAuthenticated, accountController.unbanAccount);

router.get('/user/api', accountController.getUserAccountsApi);
router.get('/user', accountController.getUserAccounts);
router.patch('/user/ban/:id', accountController.banUserAccount);
router.patch('/user/unban/:id', accountController.unbanUserAccount);

router.get('/admin/api', accountController.getAdminAccountsApi);
router.get('/admin', accountController.getAdminAccounts);
router.patch('/admin/ban/:id', authMiddleware.isSuperAdmin, accountController.banAdminAccount);
router.patch('/admin/unban/:id', authMiddleware.isSuperAdmin, accountController.unbanAdminAccount);

module.exports = router;
