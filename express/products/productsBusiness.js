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

// Seed the database with sample data for testing
const seedDatabase = async () => {

  const products = [
    {
      "name": "Elegant high heels",
      "price": 22,
      "originalPrice": 25,
      "rating": 3.8,
      "category": "Shoes",
      "overview": "High-quality high heels that is perfect in all events.",
      "features": [
        "Digital Marketing Solutions for Tomorrow",
        "Our Talented & Experienced Marketing Agency",
        "Create your own style to match your brand"
      ],
      "images": [
        "/images/shop/items/s14.jpg",
      ],
      "sizes": ["38", "39", "40"],
      "colors": ["Brown", "White", "Black"],
      "material": "Leather",
      "label": "Sale",
      "stock": 100,
      "description": "Party season arrived just in time! The Lulus Lullie Black Suede Rhinestone Ankle Strap Pointed-Toe Pumps have a soft faux suede composition and a pointed-toe upper. Sparkly rhinestones adorn the wrapping adjustable ankle strap and topline, and form a dramatic bow detail on the toe box."
    },
    {
      "name": "Branded T-Shirt",
      "price": 16,
      "originalPrice": 21,
      "rating": 4.8,
      "category": "Clothing",
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
      "label": "Sale",
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
      "stock": 100,
      "sold": 57,
      "label": "Featured"
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
      "stock": 50,
      "sold": 10,
      "label": "New"
    },
    {
      "name": "Casual Shoes",
      "description": "Comfortable casual shoes designed for all-day wear, with a breathable upper and durable sole.",
      "price": 49.99,
      "originalPrice": 70.00,
      "rating": 4.3,
      "category": "Shoes",
      "images": ["/images/shop/items/s11.jpg"],
      "sizes": ["7", "8", "9", "10", "11"],
      "colors": ["Brown", "Black", "Gray"],
      "stock": 80,
      "sold": 157,
      "label": "Popular"
    },
    {
      "name": "Earphones",
      "description": "High-quality earphones with noise-canceling features and crystal-clear sound for your music and calls.",
      "price": 19.99,
      "originalPrice": 30.00,
      "rating": 3.1,
      "category": "Electronics",
      "images": ["/images/shop/items/s7.jpg"],
      "sizes": ["One Size"],
      "colors": ["White", "Black", "Red"],
      "stock": 200,
      "sold": 500,
      "label": "Popular"
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
      "stock": 150,
      "sold": 290,
      "label": "Popular"
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
      "stock": 60,
      "sold": 100,
      "label": "Sale"
    },
    {
      "name": "Wooden Stools",
      "description": "Handcrafted wooden stools designed to complement any rustic or modern interior, sturdy and long-lasting.",
      "price": 39.99,
      "originalPrice": 55.00,
      "rating": 2.4,
      "category": "Furniture",
      "images": ["/images/shop/items/s13.jpg"],
      "sizes": ["One Size"],
      "colors": ["Wooden", "Dark Brown", "Light Brown"],
      "stock": 40,
      "sold": 57,
      "label": "Sale"
    }
  ];
  try {
    await prisma.products.createMany({
      data: products,
    });
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
};

const deleteProducts = async () => {
  try{
    await prisma.products.deleteMany({});
    console.log('Database deleted successfully');
  }catch (error) {
    console.error('Error deleting database:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

module.exports = {
  getProducts,
  getProductsWithCriteria,
  getTotalProducts,
  getDistinctCategories,
  getProductById,
  getRelevantProducts,
  seedDatabase,
  deleteProducts
};