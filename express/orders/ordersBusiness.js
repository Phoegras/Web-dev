const prisma = require('../prismaClient');
const { get } = require('./ordersRoute');

const getUserProfile = async (userId) => {
    return prisma.userProfile.findUnique({
        where: { userId: userId },
        select: { name: true, phone: true, address: true },
    });
};

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
        );

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

module.exports = {
    getUserProfile,
    createOrder,
    calculateOrderTotal,
    clearCart,
};
