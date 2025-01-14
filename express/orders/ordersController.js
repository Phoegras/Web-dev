const ordersBusiness = require('./ordersBusiness');
const cartBusiness = require('../cart/cartBusiness');

const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await ordersBusiness.getOrders(userId);
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
}

const renderCheckoutPage = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await cartBusiness.getCartWithItem(userId);
        const userProfile = await ordersBusiness.getUserProfile(userId);
        const { subtotal, taxes, total } = calculateTotalPrice(cartItems.items);
        res.render('checkout', {
            title: 'Checkout',
            userProfile,
            cartItems,
            subtotal,
            taxes,
            total,
        });
    } catch (error) {
        res.status(500).send('Error rendering checkout page');
    }
};

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { recipient, phone, address } = req.body;

        const newOrder = await ordersBusiness.createOrder(
            userId,
            recipient,
            phone,
            address,
        );
        await ordersBusiness.clearCart(userId);
        const order = await ordersBusiness.getOrderById(newOrder.id);
        res.render('checkout-success', {
            title: 'Checkout successfully',
            order,
            success: true,
        });
    } catch (error) {
        res.status(500).send('Error placing order');
    }
};

const calculateTotalPrice = (cartItems) => {
    const vat = 0.08;
    const subtotal =
        Math.round(
            cartItems.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0,
            ) * 100,
        ) / 100;
    const taxes = parseFloat(process.env.SHIPPING_FEE);
    const total = Math.round((subtotal + taxes) * 100) / 100;
    return { subtotal, taxes, total };
};

const getOrderHistory = (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const orders = ordersBusiness.getOrdersByUserId(userId);

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found." });
        }

        res.json({
            message: "Order history retrieved successfully.",
            orders,
        });
    } catch (error) {
        console.error("Error retrieving order history:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await ordersBusiness.getOrderById(id);

        res.render('order-detail', {
            title: 'Order Details',
            order,
        })
    } catch (error) {
        console.error("Error getting order:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}


module.exports = {
    getOrders,
    renderCheckoutPage,
    placeOrder,
    getOrderHistory,
    getOrderById,
};
