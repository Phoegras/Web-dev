// Business Logic (ordersBusiness.js)
const prisma = require('../prismaClient');

async function getAllOrders(page = 1, pageSize = 10, status, sortKey = 'createdAt', sortOrder = 'desc') {
    const skip = (page - 1) * pageSize;

    // Kiểm tra sortKey hợp lệ
    const validSortKeys = ['createdAt', 'totalAmount', 'status'];
    if (!validSortKeys.includes(sortKey)) {
        throw new Error(`Invalid sort key: ${sortKey}`);
    }

    // Truy vấn danh sách đơn hàng
    const orders = await prisma.order.findMany({
        where: {
            ...(status ? { status } : {}),
        },
        orderBy: {
            [sortKey]: sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc',
        },
        skip,
        take: pageSize,
        include: {
            user: {
                include: {
                    userProfile: true,
                },
            },
            orderItem: {
                include: {
                    product: true,
                },
            },
        },
    });

    return orders;
}

async function getTotalOrder(status) {
    const totalOrders = await prisma.order.count({
        where: {
            ...(status ? { status } : {}),
        },
    });

    return totalOrders;
}

async function getOrderDetail(orderId) {
    try {
        const orderDetail = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: {
                include: {
                    userProfile: true,
                }
            },
            orderItem: {
                include: {
                    product: true,
                },
            },
        },
        });

        if (!orderDetail) {
        throw new Error('Order not found');
        }

        return orderDetail;
    } catch (error) {
        console.error('Error fetching order detail:', error.message);
        throw new Error('Could not fetch order detail');
    }
}

const updateOrderStatus = async (orderId, status) => {
    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: status },
      });
  
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status in business logic:', error);
      throw new Error('Error updating order status');
    }
};

module.exports = {
    getAllOrders,
    getTotalOrder,
    getOrderDetail,
    updateOrderStatus,
};