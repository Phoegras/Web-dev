const Product = require('../models/Product');
const mongoose = require('mongoose')

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('grid-two', { layout: 'layout', products });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

// Route to get a single product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid Product ID');
  }

  try {
      const product = await Product.findById(id);
      if (!product) {
          return res.status(404).send('Product not found');
      }
      res.render('item-detail', { product });
  } catch (error) {
      console.error('Error in getProductById:', error);
      res.status(500).send('Server Error');
  }
};

// Seed the database with sample data (optional, for testing)
const seedDatabase = async () => {
    const productExists = await Product.findOne();
    if (!productExists) {
      await Product.create([
        {
          "name": "Branded T-Shirt",
          "price": 16,
          "originalPrice": 21,
          "rating": {
            "score": 4.8,
            "reviews": 45
          },
          "overview": "A high-quality branded T-shirt made from premium cotton fabric. Perfect for casual wear and available in multiple colors and sizes.",
          "features": [
            "Digital Marketing Solutions for Tomorrow",
            "Our Talented & Experienced Marketing Agency",
            "Create your own style to match your brand"
          ],
          "images": [
            "/images/shop/items/s1.jpg",
            "/images/shop/single/single-2.jpg",
            "/images/shop/single/single-3.jpg",
            "/images/shop/single/single-4.jpg",
            "/images/shop/single/single-5.jpg",
            "/images/shop/single/single-6.jpg"
          ],
          "sizes": ["S", "M", "L", "XL", "XXL"],
          "colors": ["Red", "White", "Black", "Orange"],
          "material": "Cotton",
          "description": "Due to its widespread use as filler text for layouts, non-readability is of great importance: human perception is tuned to recognize certain patterns and repetitions in texts. This T-shirt allows for a neutral judgement on the visual impact and readability of typography."
        },
        {
          "name": "Shopping Bag",
          "description": "A spacious shopping bag made from durable fabric, perfect for carrying your groceries or personal items.",
          "price": 14.99,
          "originalPrice": 20.00,
          "rating": 4.2,
          "category": "Bags",
          "images": ["/images/shop/items/s2.jpg"],
          "sizes": ["One Size"],
          "colors": ["Black", "Brown", "Red"],
          "stock": 100
        },
        {
          "name": "Elegant Watch",
          "description": "A sophisticated and stylish watch with a leather strap, ideal for formal occasions.",
          "price": 129.99,
          "originalPrice": 160.00,
          "rating": 4.6,
          "category": "Accessories",
          "images": ["/images/shop/items/s3.jpg"],
          "sizes": ["One Size"],
          "colors": ["Gold", "Silver", "Black"],
          "stock": 50
        },
        {
          "name": "Casual Shoes",
          "description": "Comfortable casual shoes designed for all-day wear, with a breathable upper and durable sole.",
          "price": 49.99,
          "originalPrice": 70.00,
          "rating": 4.3,
          "category": "Shoes",
          "images": ["/images/shop/items/s4.jpg"],
          "sizes": ["7", "8", "9", "10", "11"],
          "colors": ["Brown", "Black", "Gray"],
          "stock": 80
        },
        {
          "name": "Earphones",
          "description": "High-quality earphones with noise-canceling features and crystal-clear sound for your music and calls.",
          "price": 19.99,
          "originalPrice": 30.00,
          "rating": 4.0,
          "category": "Electronics",
          "images": ["/images/shop/items/s5.jpg"],
          "sizes": ["One Size"],
          "colors": ["White", "Black", "Red"],
          "stock": 200
        },
        {
          "name": "Elegant Mug",
          "description": "A beautiful ceramic mug with an elegant design, perfect for your morning coffee or tea.",
          "price": 12.99,
          "originalPrice": 18.00,
          "rating": 4.5,
          "category": "Home & Kitchen",
          "images": ["/images/shop/items/s6.jpg"],
          "sizes": ["One Size"],
          "colors": ["White", "Blue", "Green"],
          "stock": 150
        },
        {
          "name": "Sony Headphones",
          "description": "High-quality noise-canceling Sony headphones, providing clear sound and deep bass for an immersive listening experience.",
          "price": 89.99,
          "originalPrice": 120.00,
          "rating": 4.7,
          "category": "Electronics",
          "images": ["/images/shop/items/s7.jpg"],
          "sizes": ["One Size"],
          "colors": ["Black", "Silver"],
          "stock": 60
        },
        {
          "name": "Wooden Stools",
          "description": "Handcrafted wooden stools designed to complement any rustic or modern interior, sturdy and long-lasting.",
          "price": 39.99,
          "originalPrice": 55.00,
          "rating": 4.4,
          "category": "Furniture",
          "images": ["/images/shop/items/s8.jpg"],
          "sizes": ["One Size"],
          "colors": ["Wooden", "Dark Brown", "Light Brown"],
          "stock": 40
        }
      ]);
      console.log('Database seeded with sample data');
    }
  };
  
  module.exports = { getProducts, getProductById , seedDatabase };