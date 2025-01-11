const productsBusiness = require('./productsBusiness');
const status = ['On Stock', 'Out of Stock', 'Suspend'];
const categories = [, 'Clothing', 'Shoes', 'Accessories', 'Electronics', 'Home', 'Beauty', 'Toys', 'Sports', 'Bags', 'Furniture', 'Other'];
const label = ['Featured', 'New', 'Sale', 'Popular'];
// Get all products
// const getProducts = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 9;

//         const sortOption = req.query.sort || 'latest';
//         const sortCriteria = getSortCriteria(sortOption);

//         const search = req.query.search || '';
//         const category = req.query.category || '';
//         const manufacturer = req.query.manufacturer || '';

//         const { minPrice, maxPrice } = req.query;

//         const min = parseFloat(minPrice) || 0;
//         const max = parseFloat(maxPrice) || 1000;

//         const products = await productsBusiness.getProducts(
//             search,
//             category,
//             manufacturer,
//             page,
//             limit,
//             sortCriteria,
//             min, 
//             max
//         );

//         const totalProducts = await productsBusiness.getTotalProducts(
//             search,
//             category,
//             manufacturer
//         );

//         const totalPages = Math.ceil(totalProducts / limit);

//         let categories = await productsBusiness.getDistinctCategories();
//         categories = categories
//             .map((category) => category.category)
//             .filter((category) => category !== null);

//         let manufacturers = await productsBusiness.getDistinctManufacturers();
//         manufacturers = manufacturers
//             .map((manufacturer) => manufacturer.manufacturer)
//             .filter((manufacturer) => manufacturer !== null);

//             // Check if this is an AJAX request
//         if (req.headers['sec-fetch-dest'] == 'empty') {
//             console.log('AJAX request detected');
//             // Respond with partial views for content and pagination
            
//             res.json({ 
//                 products,
//                 totalProducts,
//                 sortOption,
//                 search,
//                 category,
//                 categories,
//                 manufacturer,
//                 manufacturers,
//                 pagination: {
//                     currentPage: page,
//                     totalPages,
//                     limit, 
//                 },
//                 minPrice:min,
//                 maxPrice:max
//         });
//             return;
//         }

//         res.render('grid-two', {
//             layout: 'layout',
//             products,
//             totalProducts,
//             sortOption,
//             search,
//             category,
//             categories,
//             manufacturer,
//             manufacturers,
//             pagination: {
//                 currentPage: page,
//                 totalPages,
//                 limit,
//             },
//             minPrice:min,
//             maxPrice:max
//         });
//     } catch (error) {
//         console.log('Error fetching products:', error);
//         res.status(500).send('Error fetching products');
//     }
// };

const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
    
        const products = await productsBusiness.getProducts(
            page,
            limit,
        );
    
        const totalProducts = await productsBusiness.getTotalProducts();
    
        const totalPages = Math.ceil(totalProducts / limit);
    
        res.render('products', {
            layout: 'layout',
            products,
            totalProducts,
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

const getProductsApi = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const products = await productsBusiness.getProducts(
            page,
            limit,
        );

        const totalProducts = await productsBusiness.getTotalProducts();

        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            products,
            totalProducts,
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


        res.render('product-form', { product, categories, status, label });
    } catch (error) {
        console.error('Error in getProductById:', error);
        res.status(500).send('Server Error');
    }
};


const sortProducts = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const sort = req.query.sort || 'name';
        const order = req.query.order || 'asc';

        const products = await productsBusiness.sortProducts(sort, order, page, limit);

        const totalProducts = await productsBusiness.getTotalProducts();

        const totalPages = Math.ceil(totalProducts / limit);
        
        res.status(200).json({
            products,
            pagination: {
                currentPage: page,
                totalPages,
                limit,
            },
        });
    }
    catch (error) {
        console.log('Error sorting products:', error);
        res.status(500).send('Error fetching products');
    }
}

const filterProducts = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const name = req.query.name || '';
        const category = req.query.category || '';
        const manufacturer = req.query.manufacturer || '';

        const products = await productsBusiness.filterProducts(name, category, manufacturer, page, limit);

        const totalProducts = await productsBusiness.getTotalProducts();

        const totalPages = Math.ceil(totalProducts / limit);
        
        res.status(200).json({
            products,
            pagination: {
                currentPage: page,
                totalPages,
                limit,
            },
        });
    }catch(error){
        console.log('Error filtering products:', error);
        res.status(500).send('Error filtering products');
    }
}
const { uploadMultiple } = require("../config/cloudinary");

const getProductForm = async (req, res) => {
    res.render('product-form', { categories, status, label });
};

const getProductInput = (req) => {
    return {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        manufacturer: req.body.manufacturer,
        status: req.body.status,
        stock: parseInt(req.body.stock),
        label: req.body.label,
        material: req.body.material,
        originalPrice: parseFloat(req.body.originalPrice),
        price: parseFloat(req.body.price),
    };
};

const addNewProduct = async (req, res) => {
    const newProduct = getProductInput(req);

    const files = req.files;

    try {
        // Upload images if any are provided
        let imageUrls = [];
        if (files && files.length > 0) {
            const uploads = await uploadMultiple(files, "products");
            imageUrls = uploads.map((upload) => upload.secure_url);
        }

        // Add the images to the new product
        newProduct.images = imageUrls;

        const product = await productsBusiness.addNewProduct(newProduct);
        console.log('Product added:', product);
        res.redirect('/products');
    } catch (error) {
        console.log('Error editing product:', error);
        res.status(500).render('error', { message: error.message });
    }
};

const editProduct = async (req, res) => {
    const { id } = req.params;
    const updatedFields = getProductInput(req);
    const files = req.files;

    console.log("updated fields", updatedFields);
    try {
        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        // Upload images if any are provided
        let imageUrls = [];
        if (files && files.length > 0) {
            const uploads = await uploadMultiple(files, "products");
            imageUrls = uploads.map((upload) => upload.secure_url);
        }

        // Merge the new images with existing ones
        if (imageUrls.length > 0) {
            const existingProduct = await productsBusiness.getProductImages(id);
            updatedFields.images = [...(existingProduct.images || []), ...imageUrls];
        }

        const updatedProduct = await productsBusiness.editProductInfo(id, updatedFields);
        console.log('Product updated:', updatedProduct);
        res.redirect('/products');
    } catch (error) {
        console.log('Error editing product:', error);
        res.status(500).render('error', { message: error.message });
    }
};

const deleteProduct = async(req, res) => {
    try{
        const { id } = req.params;
        const product = await productsBusiness.deleteProduct(id);

        res.status(200).json({ message: "Product deleted successfully" });
    }catch(error){
        console.log('Error deleting product:', error);
        res.status(500).render('error', {message: 'Error deleting product'});
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
                    getProductsApi,
                    sortProducts,
                    filterProducts,
                    getProductById, 
                    getProductForm,
                    addNewProduct,
                    editProduct,
                    deleteProduct
};
