const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get all products
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;

        const sortOption = req.query.sort || 'latest';
        const sortCriteria = getSortCriteria(sortOption);

        const search = req.query.search || '';
        const category = req.query.category || '';
        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
        };
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query)
            .sort(sortCriteria)
            .skip(page * limit - limit)
            .limit(limit)
            .lean();

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        const categories = await Product.distinct('category');
        res.render('grid-two', {
            layout: 'layout',
            products,
            totalProducts,
            sortOption,
            search,
            category,
            categories,
            pagination: {
                currentPage: page,
                totalPages,
                limit,
            },
        });
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid Product ID');
    }

    try {
        const product = await Product.findById(id).lean();
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Fetch relevant products based on category or similar criteria
        const relevantProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id }, // Exclude the current product
        })
            .limit(4)
            .lean();
        console.log(relevantProducts);
        res.render('item-detail', { product, relevantProducts });
    } catch (error) {
        console.error('Error in getProductById:', error);
        res.status(500).send('Server Error');
    }
};

const getPopularProducts = async (req, res) => {
    try {
        const popularProducts = await Product.find({ label: 'Popular' });
        return popularProducts;
    } catch (error) {
        res.status(500).send('Error fetching popular products');
    }
};

const getSortCriteria = (sortOption) => {
    let sortCriteria;
    switch (sortOption) {
        case 'latest':
            sortCriteria = { createdAt: -1 }; // Sort by creation date (newest first)
            break;
        case 'popularity':
            sortCriteria = { sold: -1 };
            break;
        case 'rating':
            sortCriteria = { rating: -1 }; // Sort by rating (highest first)
            break;
        case 'priceLow':
            sortCriteria = { price: 1 }; // Sort by price (low to high)
            break;
        case 'priceHigh':
            sortCriteria = { price: -1 }; // Sort by price (high to low)
            break;
        default:
            sortCriteria = { createdAt: -1 }; // Default to 'latest'
            break;
    }

    return sortCriteria;
};

// Seed the database with sample data for testing
const seedDatabase = async () => {
    await Product.insertMany([
        {
            name: 'Branded T-Shirt',
            price: 16,
            originalPrice: 21,
            rating: {
                score: 4.8,
                reviews: 45,
            },
            category: 'Clothing',
            overview:
                'A high-quality branded T-shirt made from premium cotton fabric. Perfect for casual wear and available in multiple colors and sizes.',
            features: [
                'Digital Marketing Solutions for Tomorrow',
                'Our Talented & Experienced Marketing Agency',
                'Create your own style to match your brand',
            ],
            images: [
                '/images/shop/items/s1.jpg',
                '/images/shop/single/single-2.jpg',
                '/images/shop/single/single-3.jpg',
                '/images/shop/single/single-4.jpg',
                '/images/shop/single/single-5.jpg',
                '/images/shop/single/single-6.jpg',
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Red', 'White', 'Black', 'Orange'],
            material: 'Cotton',
            label: 'Sale',
            description:
                'Due to its widespread use as filler text for layouts, non-readability is of great importance: human perception is tuned to recognize certain patterns and repetitions in texts. This T-shirt allows for a neutral judgement on the visual impact and readability of typography.',
        },
        {
            name: 'Shopping Bag',
            description:
                'A spacious shopping bag made from durable fabric, perfect for carrying your groceries or personal items.',
            price: 14.99,
            originalPrice: 20.0,
            rating: {
                score: 4.2,
            },
            category: 'Bags',
            images: ['/images/shop/items/s2.jpg'],
            sizes: ['One Size'],
            colors: ['Black', 'Brown', 'Red'],
            stock: 100,
            sold: 57,
            label: 'Featured',
        },
        {
            name: 'Elegant Watch',
            description:
                'A sophisticated and stylish watch with a leather strap, ideal for formal occasions.',
            price: 129.99,
            originalPrice: 160.0,
            rating: {
                score: 4.6,
            },
            category: 'Accessories',
            images: ['/images/shop/items/s3.jpg'],
            sizes: ['One Size'],
            colors: ['Gold', 'Silver', 'Black'],
            stock: 50,
            sold: 10,
            label: 'New',
        },
        {
            name: 'Casual Shoes',
            description:
                'Comfortable casual shoes designed for all-day wear, with a breathable upper and durable sole.',
            price: 49.99,
            originalPrice: 70.0,
            rating: {
                score: 4.3,
            },
            category: 'Shoes',
            images: ['/images/shop/items/s11.jpg'],
            sizes: ['7', '8', '9', '10', '11'],
            colors: ['Brown', 'Black', 'Gray'],
            stock: 80,
            sold: 157,
            label: 'Popular',
        },
        {
            name: 'Earphones',
            description:
                'High-quality earphones with noise-canceling features and crystal-clear sound for your music and calls.',
            price: 19.99,
            originalPrice: 30.0,
            rating: {
                score: 4.0,
            },
            category: 'Electronics',
            images: ['/images/shop/items/s7.jpg'],
            sizes: ['One Size'],
            colors: ['White', 'Black', 'Red'],
            stock: 200,
            sold: 500,
            label: 'Popular',
        },
        {
            name: 'Elegant Mug',
            description:
                'A beautiful ceramic mug with an elegant design, perfect for your morning coffee or tea.',
            price: 12.99,
            originalPrice: 18.0,
            rating: {
                score: 4.5,
            },
            category: 'Home & Kitchen',
            images: ['/images/shop/items/s6.jpg'],
            sizes: ['One Size'],
            colors: ['White', 'Blue', 'Green'],
            stock: 150,
            sold: 290,
            label: 'Popular',
        },
        {
            name: 'Sony Headphones',
            description:
                'High-quality noise-canceling Sony headphones, providing clear sound and deep bass for an immersive listening experience.',
            price: 89.99,
            originalPrice: 120.0,
            rating: {
                score: 4.7,
            },
            category: 'Electronics',
            images: ['/images/shop/items/s7.jpg'],
            sizes: ['One Size'],
            colors: ['Black', 'Silver'],
            stock: 60,
            sold: 100,
            label: 'Sale',
        },
        {
            name: 'Wooden Stools',
            description:
                'Handcrafted wooden stools designed to complement any rustic or modern interior, sturdy and long-lasting.',
            price: 39.99,
            originalPrice: 55.0,
            rating: {
                score: 4.4,
            },
            category: 'Furniture',
            images: ['/images/shop/items/s13.jpg'],
            sizes: ['One Size'],
            colors: ['Wooden', 'Dark Brown', 'Light Brown'],
            stock: 40,
            sold: 57,
            label: 'Sale',
        },
    ]);
    console.log('Database seeded with sample data');
};

module.exports = {
    getProducts,
    getProductById,
    getPopularProducts,
    seedDatabase,
};
