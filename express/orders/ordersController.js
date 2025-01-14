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
        const cart = req.query.cartId;

        const order = await ordersBusiness.createOrder(
            userId,
            recipient,
            phone,
            address,
        );
        console.log('create Order successfully');
        await ordersBusiness.clearCart(userId);
        console.log('clean Order successfully');
        res.render('checkout-success', { title: 'Processed order successfully', order });
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
    const taxes = Math.round(subtotal * vat * 100) / 100;
    const total = Math.round((subtotal + taxes) * 100) / 100;
    return { subtotal, taxes, total };
};

module.exports = {
    getOrders,
    renderCheckoutPage,
    placeOrder,
};
