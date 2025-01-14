const productsBusiness = require('./productsBusiness');
const {getManufacturers} = require('./manufacturers/manufacturersBusiness');
const {getCategories} = require('./categories/categoriesBusiness');

const status = ['On stock', 'Out of stock', 'Suspend'];
const colors = ['Black', 'Gray', 'Blue', 'Lavender', 'Green', 'Orange'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', 'One size'];
const label = ['Featured', 'New', 'Sale', 'Popular'];

const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
    
        const products = await productsBusiness.getProducts(
            page,
            limit,
        );
    
        const totalProducts = await productsBusiness.getTotalProducts();
    
        const categoriesList = await getCategories();
        const categories = categoriesList.map((category) => category.name);
        const manufacturersList = await getManufacturers();
        const manufacturers = manufacturersList.map((manufacturer) => manufacturer.name);


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
            categories,
            manufacturers,
            status,
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
        const category = req.query.category;
        const manufacturer = req.query.manufacturer;
        const status = req.query.status;
        const search = req.query.search;

        const filters = {};
        if (category) filters.category = category;
        if (manufacturer) filters.manufacturer = manufacturer;
        if (status) filters.status = status;
        if (search) filters.search = search;

        const products = await productsBusiness.getProducts(
            page,
            limit,
            filters
        );

        const totalProducts = await productsBusiness.getTotalProducts(filters);

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
        const categoriesList = await getCategories();
        const categories = categoriesList.map((category) => category.name);
        const manufacturersList = await getManufacturers();
        const manufacturers = manufacturersList.map((manufacturer) => manufacturer.name);

        res.render('product-form', { product, categories, manufacturers, colors, sizes, status, label });
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

        console.log(page, limit);
        const name = req.query.name || '';
        const category = req.query.category || '';
        const manufacturer = req.query.manufacturer || '';
        const status = req.query.status || '';

        const products = await productsBusiness.filterProducts(name, category, manufacturer, status, page, limit);

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
    const categoriesList = await getCategories();
    const categories = categoriesList.map((category) => category.name);
    const manufacturersList = await getManufacturers();
    const manufacturers = manufacturersList.map((manufacturer) => manufacturer.name);
    res.render('product-form', { categories, manufacturers, colors, sizes, status, label });
};

const getProductInput = (req) => {
    console.log(req.body);
    return {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category ,
        manufacturer: req.body.manufacturer,
        status: req.body.status,
        stock: parseInt(req.body.stock) || 0,
        colors: req.body.colors.split(','),
        sizes: req.body.sizes.split(','),
        label: req.body.label || '',
        material: req.body.material,
        originalPrice: parseFloat(req.body.originalPrice) || 0,
        price: parseFloat(req.body.price) || 0,
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
        if(imageUrls.length > 0)
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

    const existingImages = req.body.existingImages ?
        Array.isArray(req.body.existingImages)
        ? req.body.existingImages 
        : [req.body.existingImages]
    : [];
    
    try {
        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        // Upload images if any are provided
        let imageUrls = [];
        if (files && files.length > 0) {
            const uploads = await uploadMultiple(files, "products");
            imageUrls = uploads.map((upload) => upload.secure_url);
            console.log('Image URLs:', imageUrls);
        }

        updatedFields.images = [...existingImages, ...imageUrls] || [];

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
