// controllers/homeController.js
const productsBusiness = require('../products/productsBusiness');

const getIndex = async (req, res) => {
    try {
        const featuredProducts = await productsBusiness.getProductsWithCriteria({ label: 'Featured' }, 8);
        const saleProducts = await productsBusiness.getProductsWithCriteria({ label: 'Sale' }, 8);

        res.render('index', {
            layout: 'layout',
            title: 'Home',
            featuredProducts,
            saleProducts,
        });
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
};

module.exports = { getIndex };