const prisma = require('../prismaClient'); // Import Prisma client instance

/**
 * Fetch products with pagination and sorting.
 */
async function getProducts(query, page, limit, sortCriteria) {
  const products = await prisma.products.findMany({
    where: query,
    orderBy: sortCriteria,
    skip: (page - 1) * limit,
    take: limit,
  });
  return products;
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
 * Get total product count for pagination.
 */
async function getTotalProducts(query) {
  const totalProducts = await prisma.products.count({
    where: query,
  });
  return totalProducts;
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
 * Get a product by ID.
 */
async function getProductById(id) {
    const product = await prisma.products.findUnique({
      where: { id },
    });
    return product;
  }
  
  /**
   * Fetch relevant products by category, excluding a specific product.
   */
  async function getRelevantProducts(category, excludeId) {
    const relevantProducts = await prisma.products.findMany({
      where: {
        category,
        NOT: { id: excludeId },
      },
      take: 4, // Limit to 4 products
    });
    return relevantProducts;
  }
  
module.exports = {
  getProducts,
  getProductsWithCriteria,
  getTotalProducts,
  getDistinctCategories,
  getProductById,
  getRelevantProducts
};