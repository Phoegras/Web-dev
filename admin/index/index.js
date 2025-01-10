const express = require('express');
const router = express.Router();
const indexController = require('./indexController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.get('/', indexController.getIndex);

module.exports = router;
