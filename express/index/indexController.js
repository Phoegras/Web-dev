// controllers/homeController.js
const { times } = require('../config/handlebars-helpers');
const productsBusiness = require('../products/productsBusiness');

const getIndex = async (req, res) => {
    try {
        const featuredProducts = await productsBusiness.getProductsWithCriteria(
            { label: 'Featured' },
            8,
        );
        const saleProducts = await productsBusiness.getProductsWithCriteria(
            { label: 'Sale' },
            8,
        );

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

const getAbout = async (req, res) => {
    res.render('about', {
        title: 'About us',
    })
}

const getContact = async (req, res) => {
    res.render('contact', {
        title: 'Contact',
    })
}

const getErrorPage = async (req, res) => {
    res.render('errors', {
        title: 'Error',
        noHeader: true,
        noFooter: true,
    })
}

module.exports = {
    getIndex,
    getAbout,
    getContact,
    getErrorPage
};
