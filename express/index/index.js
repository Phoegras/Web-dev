var express = require('express');
var router = express.Router();
const indexController = require('./indexController');

/* GET home page. */
router.get('/', indexController.getIndex);

router.get('/about', indexController.getAbout);

router.get('/contact', indexController.getContact);

router.get('/errors', indexController.getErrorPage);

module.exports = router;
