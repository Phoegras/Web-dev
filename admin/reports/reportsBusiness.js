const prisma = require('../prismaClient');

const getRevenueReport = async (startDate, endDate) => {
  const revenueData = await prisma.order.groupBy({
    by: ["createdAt"],
    _sum: { totalAmount: true },
    _count: { id: true },
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      status: "Paid",
    },
    orderBy: { createdAt: "asc" },
  });

  // Transform data
  const response = revenueData.map((entry) => ({
    date: entry.createdAt.toISOString().split("T")[0], // Format date
    totalRevenue: entry._sum.totalAmount || 0,
    totalOrders: entry._count.id || 0,
    profit: (entry._sum.totalAmount || 0) * 0.3, // Example: Assuming 30% profit margin
  }));

  return response;
  };

  const getTopProductsByRevenue = async (startDate, endDate, limit = 10) => {
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          status: "Paid",
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });
  
    // Include product details for better presentation
    const productDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.products.findUnique({
          where: { id: item.productId },
        });
  
        return {
          name: product?.name || "Unknown",
          image: product?.images[0],
          category: product?.category || "Uncategorized",
          price: product?.price || 0,
          sold: item._sum.quantity || 0,
          profit: (product?.price || 0) * (item._sum.quantity || 0),
        };
      })
    );
  
    return productDetails;
  };
  
  
module.exports = {
    getRevenueReport,
    getTopProductsByRevenue,
}