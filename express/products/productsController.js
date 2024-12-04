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
        let query = {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive', // Case-insensitive search
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ],
        };

        if (category) {
            query = {
                AND: [
                    query,
                    { category: category }, // Filter by category if specified
                ],
            };
        }

        const products = await productsBusiness.getProducts(
            query,
            page,
            limit,
            sortCriteria,
        );
        const totalProducts = await productsBusiness.getTotalProducts(query);
        const totalPages = Math.ceil(totalProducts / limit);
        let categories = await productsBusiness.getDistinctCategories();
        categories = categories
            .map((category) => category.category)
            .filter((category) => category !== null);

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

        res.render('item-detail', { product, relevantProducts });
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

module.exports = { getProducts, getProductById };
