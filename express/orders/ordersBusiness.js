const prisma = require('../prismaClient');

const getUserProfile = async (userId) => {
    return prisma.userProfile.findUnique({
        where: { userId: userId },
        select: { name: true, phone: true, address: true },
    });
};

const getOrders = async (userId) => {
    return prisma.order.findMany({
        where: { userId },
        include: {
            orderItem: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {createdAt: 'desc'},
    });
}

const createOrder = async (userId, recipient, phone, address) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty or does not exist.');
        }

        const orderItems = cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
        }));
        const totalAmount = cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0,
        ) + parseFloat(process.env.SHIPPING_FEE);

        const order = await prisma.order.create({
            data: {
                recipient,
                phone,
                address,
                totalAmount,
                userId,
                orderItem: {
                    create: orderItems,
                },
            },
        });

        await prisma.cartItem.deleteMany({
            where: { id: { in: cart.items.map((item) => item.id) } },
        });

        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

const updateOrderStatus = async (id, status) => {
    try {
        const updatedOrder = await prisma.order.update({
            where: {
                id: id,
            },
            data: {
                status: status,
            },
        });
        return updatedOrder;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

const calculateOrderTotal = (orderItems) => {
    if (!orderItems || orderItems.length === 0) {
        return 0;
    }

    const total = orderItems.reduce((sum, item) => {
        return sum + item.quantity * item.price;
    }, 0);

    return total;
};

const clearCart = async (userId) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: true,
            },
        });

        if (!cart || cart.items.length === 0) {
            console.log('Cart is already empty or does not exist.');
            return;
        }

        await prisma.cartItem.deleteMany({
            where: { id: { in: cart.items.map((item) => item.id) } },
        });

        console.log(`Cart cleared successfully for userId: ${userId}`);
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};

const getOrdersByUserId = async (userId) => {
    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            orderItem: true, 
        },
        orderBy: { createdAt: 'desc' }
    })
    return orders;
}

const getOrderById = async (id) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            orderItem: {
                include: {
                    product: true,
                }
            }
        },
    })
    return order;
}

module.exports = {
    getUserProfile,
    getOrders,
    createOrder,
    calculateOrderTotal,
    clearCart,
    getOrdersByUserId,
    getOrderById,
    updateOrderStatus,
};
