const cartBusiness = require('./cartBusiness');

const getCart = async (req, res, next) => {
    const userId = req.session.passport.user;

    try {
        console.log('get cart with item');

        const cart = await cartBusiness.getCartWithItem(userId);

        let subtotal, taxes, total, cartItems;
        if (!cart) {
            cartItems = [];
            subtotal = taxes = total = 0;
        } else {
            cartItems = cart.items;
            ({ subtotal, taxes, total } = calculateTotalPrice(cart.items));
        }

        if (req.headers['sec-fetch-dest'] == 'empty') {
            // If AJAX or API request, respond with JSON
            console.log('get cart with item AJAX');
            return res.json({
                cartItems,
                subtotal,
                total,
            });
        } else {
            // Otherwise, render the cart page
            console.log('get cart with item render');
            res.render('cart', {
                title: 'Cart',
                cartItems,
                subtotal,
                taxes,
                total,
                isCartPage: true,
            });
        }
    } catch (error) {
        if (req.headers['sec-fetch-dest'] == 'empty') {
            return res.status(500).json({ error: error.message });
        }
        res.status(500).render('error', { error: 'Failed to load the cart' });
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

const addToCart = async (req, res) => {
    const { productId, size, quantity } = req.body;
    const userId = req.session.passport.user;
    console.log(userId);
    console.log(req.body);
    console.log(req.session);

    try {
        console.log('get cart');
        const cart = await cartBusiness.getCart(userId);

        if (!cart) {
            console.log('create cart');
            await cartBusiness.createCart(userId, productId, size, quantity);
        } else {
            const existingItem = await cartBusiness.findCartItem(
                cart,
                productId,
                size,
            );
            if (existingItem) {
                console.log('update cart');
                await cartBusiness.updateCartItem(existingItem, quantity);
            } else {
                console.log('add to cart');
                await cartBusiness.addToCart(userId, productId, size, quantity);
            }
        }

        res.status(200).json({ success: true, message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateCart = async (req, res) => {
    const { itemId, quantity } = req.body;

    try {
        await cartBusiness.updateQuantity(itemId, parseInt(quantity, 10));
        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    const { cartItemId } = req.params;

    try {
        await cartBusiness.removeFromCart(cartItemId);

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
};
