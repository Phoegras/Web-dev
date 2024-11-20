// controllers/homeController.js
const Product = require('../models/Product');

const getIndex = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ label: 'Featured' })
            .lean()
            .limit(8);
        const saleProducts = await Product.find({ label: 'Sale' })
            .lean()
            .limit(8);
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
