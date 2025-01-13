const prisma = require('../prismaClient'); // Import Prisma client instance

/**
 * Fetch products with pagination.
 */

async function getProducts(page, limit, filters) {
    const products = await prisma.products.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
    });
    return products;
}

async function getTotalProducts(filters) {
    const totalProducts = await prisma.products.count({ where: filters });
    return totalProducts;
}

/**
 * Fetch products with certain criteria.
 */
async function getProductsWithCriteria(criterias, limit) {
    const products = await prisma.products.findMany({
        where: criterias,
        take: limit,
    });
    return products;
}

/**
 * Fetch products with certain manufacturer.
 */
async function getProductsWithManufacturer(manufacturers, limit) {
    const products = await prisma.products.findMany({
        where: manufacturers,
        take: limit,
    });
    return products;
}

/**
 * Get total product count for pagination.
 */
// async function getProducts(search, category, manufacturer, page, limit, sortCriteria, min, max) {
//     let query = {
//         OR: [
//             {
//                 name: {
//                     contains: search,
//                     mode: 'insensitive', // Case-insensitive search
//                 },
//             },
//             {
//                 description: {
//                     contains: search,
//                     mode: 'insensitive',
//                 },
//             },
//         ],
//         AND: [
//             { 
//                 price: { 
//                     gte: min,
//                     lte: max,
//                 } 
//             },
//         ],
//     };

//     if (category) {
//         query = {
//             AND: [
//                 query,
//                 { category: category }, // Filter by category if specified
//             ],
//         };
//     }

//     if (manufacturer) {
//         query = {
//             AND: [
//                 query,
//                 { manufacturer: manufacturer }, // Filter by category if specified
//             ],
//         };
//     }
  
//     const products = await prisma.products.findMany({
//         where: query,
//         orderBy: sortCriteria,
//         skip: (page - 1) * limit,
//         take: limit,
//     });
//     return products;
// }

// async function getTotalProducts(search, category, manufacturer) {
//     let query = {
//         OR: [
//             {
//                 name: {
//                     contains: search,
//                     mode: 'insensitive', // Case-insensitive search
//                 },
//             },
//             {
//                 description: {
//                     contains: search,
//                     mode: 'insensitive',
//                 },
//             },
//         ],
//     };

//     if (category) {
//         query = {
//             AND: [
//                 query,
//                 { category: category }, // Filter by category if specified
//             ],
//         };
//     }

//     if (manufacturer) {
//         query = {
//             AND: [
//                 query,
//                 { manufacturer: manufacturer }, // Filter by category if specified
//             ],
//         };
//     }

//     const totalProducts = await prisma.products.count({
//         where: query,
//     });
//     return totalProducts;
// }


// Sort products

const getSortCriteria = (sortOption) => {
    let sortCriteria;
    switch (sortOption) {
        case 'latest':
            sortCriteria = [{ createdAt: 'desc' }]; // Sort by creation date (newest first)
            break;
        case 'oldest':
            sortCriteria = [{ createdAt: 'asc' }]; // Sort by creation date (oldest first)
            break;
        case 'priceLow':
            sortCriteria = [{ price: 'asc' }]; // Sort by price (low to high)
            break;
        case 'priceHigh':
            sortCriteria = [{ price: 'desc' }]; // Sort by price (high to low)
            break;
        case 'purchaseLow':
            sortCriteria = [{ sold: 'asc' }]; // Sort by purchase count (low to high)
            break;
        case 'purchaseHigh':
            sortCriteria = [{ sold: 'desc' }]; // Sort by purchase count (high to low)
            break;
        default:
            sortCriteria = [{ createdAt: 'desc' }]; // Default to 'latest'
            break;
    }

    return sortCriteria;
};

async function sortProducts(sort, order, page, limit) {
    const sortCriteria = [{ [sort]: order }];

    const products = await prisma.products.findMany({
        orderBy: sortCriteria,
        skip: (page - 1) * limit,
        take: limit,
    });
    return products;
}

function getFilterCriteria(name, category, manufacturer, status) {
    let query = {
        OR: [
            {
                name: {
                    contains: name,
                    mode: 'insensitive', // Case-insensitive name
                },
            },
            {
                description: {
                    contains: name,
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

    if (manufacturer) {
        query = {
            AND: [
                query,
                { manufacturer: manufacturer }, // Filter by category if specified
            ],
        };
    }

    if (status) {
        query = {
            AND: [
                query,
                { status: status }, // Filter by category if specified
            ],
        };
    }
    return query;
}
// Filter products
async function filterProducts(name, category, manufacturer, status, page, limit) {
    const filterCriteria = getFilterCriteria(name, category, manufacturer, status);

    const products = await prisma.products.findMany({
        where: filterCriteria,
        skip: (page - 1) * limit,
        take: limit,
    });
    return products;
}

/**
 * Fetch distinct categories.
 */
async function getDistinctCategories() {
    const categories = await prisma.products.findMany({
        distinct: ['category'],
        select: { category: true },
    });
    return categories;
}

/**
 * Fetch distinct manufacturers.
 */
async function getDistinctManufacturers() {
    const manufacturer = await prisma.products.findMany({
        distinct: ['manufacturer'],
        select: { manufacturer: true },
    });
    return manufacturer;
}

/**
 * Get a product by ID.
 */
async function getProductById(id) {
    const product = await prisma.products.findUnique({
        where: { id },
    });
    return product;
}

async function getProductImages(id) {
    return await prisma.products.findUnique({
        where: { id },
    });
}

const addNewProduct = async (product) => {
    
    const categoryExists = await prisma.categories.findUnique({
        where: { name: product.category },
      });
      if (!categoryExists) {
        throw new Error(`Category "${product.category}" does not exist.`);
      }
  
      const manufacturerExists = await prisma.manufacturers.findUnique({
        where: { name: product.manufacturer },
      });
      if (!manufacturerExists) {
        throw new Error(`Manufacturer "${product.manufacturer}" does not exist.`);
      }

    product.categoryName = {
        connect: { name: product.category }, // Use the relationship field
    };
    product.manufacturerName = {
    connect: { name: product.manufacturer }, // Use the relationship field
    };
    delete product.category;
    delete product.manufacturer;
    
    const newProduct = await prisma.products.create({
        data: product,
    });
    return newProduct;
}

async function editProductInfo(productId, updatedFields) {
    try {
        // Validate the product ID
        if (!productId) {
            throw new Error('Product ID is required');
        }

        // Update the product in the database
        const updatedProduct = await prisma.products.update({
            where: {
                id: productId,
            },
            data: updatedFields,
        });

        return updatedProduct;
    } catch (error) {
        console.error('Error updating product:', error.message);
        throw new Error('Unable to update product');
    }
};

const deleteProduct = async (id) => {
    await prisma.cartItem.deleteMany({
        where: { productId: id },
    });
  
    // Delete related order items
    await prisma.orderItem.deleteMany({
        where: { productId: id },
    });

    // Delete related reviews
    await prisma.review.deleteMany({
        where: { productId: id },
    });

    await prisma.products.delete({
        where: { id: id },
    });
}

const deleteProducts = async () => {
    try {
        await prisma.products.deleteMany({});
        console.log('Database deleted successfully');
    } catch (error) {
        console.error('Error deleting database:', error);
    } finally {
        await prisma.$disconnect(); // Disconnect from the database
    }
};

module.exports = {
    getProducts,
    sortProducts,
    filterProducts,
    getProductsWithCriteria,
    getProductsWithManufacturer,
    getTotalProducts,
    getDistinctCategories,
    getDistinctManufacturers,
    getProductById,
    getProductImages,
    addNewProduct,
    editProductInfo,
    deleteProduct,
    deleteProducts,
};
