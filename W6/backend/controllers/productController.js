const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('products', { layout: 'layout', title: 'Products', products });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

// Seed the database with sample data (optional, for testing)
const seedDatabase = async () => {
    const productExists = await Product.findOne();
    if (!productExists) {
      await Product.create([
        { image: 'images/shop/items/s1.jpg', name: 'Branded T-Shirt', price: 16, originalPrice: 21, isNew: true, rating: 5 },
        { image: 'images/shop/items/s2.jpg', name: 'Shopping Bag', price: 16, originalPrice: 21, isNew: false, rating: 5 },
        { image: 'images/shop/items/s3.jpg', name: 'Elegent Watch', price: 16, originalPrice: 21, isNew: false, rating: 5 },
        { image: 'images/shop/items/s4.jpg', name: 'Casual Shoes', price: 16, originalPrice: 21, isNew: false, rating: 5 },
        { image: 'images/shop/items/s5.jpg', name: 'Earphones', price: 16, originalPrice: 21, isNew: true, rating: 5 },
        { image: 'images/shop/items/s6.jpg', name: 'Elegent Mug', price: 16, originalPrice: 21, isNew: false, rating: 5 },
        { image: 'images/shop/items/s7.jpg', name: 'Sony Headphones', price: 16, originalPrice: 21, isNew: false, rating: 5 },
        { image: 'images/shop/items/s8.jpg', name: 'Wooden Stools', price: 16, originalPrice: 21, isNew: false, rating: 5 },
        // Add more sample products as needed
      ]);
      console.log('Database seeded with sample data');
    }
  };
  
  module.exports = { getProducts, seedDatabase };