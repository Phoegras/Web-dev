const productsBusiness = require('./productsBusiness');

// Get all products
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;

        const sortOption = req.query.sort || 'latest';
        const sortCriteria = getSortCriteria(sortOption);

        const search = req.query.search || '';
        const category = req.query.category || '';
        const manufacturer = req.query.manufacturer || '';

        const { minPrice, maxPrice } = req.query;

        const min = parseFloat(minPrice) || 0;
        const max = parseFloat(maxPrice) || 1000;

        const products = await productsBusiness.getProducts(
            search,
            category,
            manufacturer,
            page,
            limit,
            sortCriteria,
            min, 
            max
        );

        const totalProducts = await productsBusiness.getTotalProducts(
            search,
            category,
            manufacturer
        );

        const totalPages = Math.ceil(totalProducts / limit);

        let categories = await productsBusiness.getDistinctCategories();
        categories = categories
            .map((category) => category.category)
            .filter((category) => category !== null);

        let manufacturers = await productsBusiness.getDistinctManufacturers();
        manufacturers = manufacturers
            .map((manufacturer) => manufacturer.manufacturer)
            .filter((manufacturer) => manufacturer !== null);

            // Check if this is an AJAX request
        if (req.headers['sec-fetch-dest'] == 'empty') {
            console.log('AJAX request detected');
            // Respond with partial views for content and pagination
            
            res.json({ 
                products,
                totalProducts,
                sortOption,
                search,
                category,
                categories,
                manufacturer,
                manufacturers,
                pagination: {
                    currentPage: page,
                    totalPages,
                    limit, 
                },
                minPrice:min,
                maxPrice:max
        });
            return;
        }

        res.render('grid-two', {
            title: 'Shop',
            layout: 'layout',
            products,
            totalProducts,
            sortOption,
            search,
            category,
            categories,
            manufacturer,
            manufacturers,
            pagination: {
                currentPage: page,
                totalPages,
                limit,
            },
            minPrice:min,
            maxPrice:max
        });
    } catch (error) {
        console.log('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
};

// Validate the ID format
const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

// Get a single product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).send('Invalid Product ID');
    }

    try {
        const product = await productsBusiness.getProductById(id);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Fetch relevant products
        const relevantProducts = await productsBusiness.getRelevantProducts(
            product.category,
            product.id,
        );

        const limit = req.query.limit ||4;
        const skip = req.query.skip || 0;
        const reviews = await productsBusiness.getProductReviews(id, limit, skip);
        const numOfReviews = await productsBusiness.getNumOfReviews(id);

        const formatter = getFormatter();
    
        reviews.forEach(review => {
            review.updatedAtFormatted = formatDate(review.updatedAt, formatter);
        });

        res.render('item-detail', { 
            title: product.name,
            product, relevantProducts, reviews, numOfReviews });
    } catch (error) {
        console.error('Error in getProductById:', error);
        res.status(500).send('Server Error');
    }
};

const getSortCriteria = (sortOption) => {
    let sortCriteria;
    switch (sortOption) {
        case 'latest':
            sortCriteria = [{ createdAt: 'desc' }]; // Sort by creation date (newest first)
            break;
        case 'popularity':
            sortCriteria = [{ sold: 'desc' }];
            break;
        case 'rating':
            sortCriteria = [{ rating: 'desc' }]; // Sort by rating (highest first)
            break;
        case 'priceLow':
            sortCriteria = [{ price: 'asc' }]; // Sort by price (low to high)
            break;
        case 'priceHigh':
            sortCriteria = [{ price: 'desc' }]; // Sort by price (high to low)
            break;
        default:
            sortCriteria = [{ createdAt: 'desc' }]; // Default to 'latest'
            break;
    }

    return sortCriteria;
};

// Get reviews for a product
const getProductReviewsApi = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json('Invalid Product ID');
    }

    const {skip = 0, limit = 4 } = req.query;

    try {
        const reviews = await productsBusiness.getProductReviews(id, parseInt(limit), parseInt(skip));
        const numOfReviews = await productsBusiness.getNumOfReviews(id);
        const formatter = getFormatter();
    
        reviews.forEach(review => {
            review.updatedAtFormatted = formatDate(review.updatedAt, formatter);
        });
        
        res.status(200).json({reviews, numOfReviews});
    } catch (error) {
        console.error('Error in getProductReviews:', error);
        res.status(500).json('Server Error');
    }
}

async function writeReviewApi(req, res) {
    const {productId, rating, comment } = req.body;    
    const userId = req.user.id;

    console.log('writeReviewApi:', productId, rating, comment, userId);
    if (!isValidObjectId(productId)) {
        return res.status(400).json('Invalid Product ID');
    }

    if(!rating || !comment) {
        return res.status(400).json('Please provide a rating and a comment');
    }
    
    try {
        const existingReview = await productsBusiness.getProductReviewByUserId(productId, userId);

        if (existingReview) {
            return res.status(400).json('You have already reviewed this product');
        }
    
        const review = await productsBusiness.createReview(productId, userId, rating, comment);
        res.status(200).json(review);
    } catch (error) {
        console.error('Error in writeReview:', error);
        res.status(500).json('Server Error');
    }
}

const getFormatter = () => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
const formatDate = (date, formatter) => {
    return formatter.format(new Date(date));
}

module.exports = { getProducts, 
                    getProductById, 
                    getProductReviewsApi, 
                    writeReviewApi };
