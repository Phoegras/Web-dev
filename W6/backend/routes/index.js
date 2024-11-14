var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');
const productController = require('../controllers/productController');

/* GET home page. */
router.get('/', indexController.getIndex);

router.get('/grid-two', productController.getProducts);

router.get('/cart', function(req, res, next) {
    res.render('cart');
});

router.get('/checkout', function(req, res, next) {
    res.render('checkout');
});

router.get('/account', function(req, res, next) {
    res.render('account');
});

router.get('/about', function(req, res, next) {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact Us',
        noFooter: true
    });
});

module.exports = router;