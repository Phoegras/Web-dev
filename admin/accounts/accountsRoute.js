const express = require('express');
const router = express.Router();
const accountController = require('./accountsController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/:type', accountController.getUserAccounts);
router.get('/:type/api', accountController.getUserAccountsApi);
router.patch('/:type/:id/ban', accountController.banAccount);
router.patch('/:type/:id/unban', accountController.unbanAccount);

module.exports = router;
