const prisma = require('../prismaClient');

// Find cart of user by userId
async function getCart(userId) {
    const cart = await prisma.cart.findFirst({
        where: { userId },
        include: { items: true },
    });
    return cart;
}

// Find cart of user that has item
async function getCartWithItem(userId) {
    const cart = await prisma.cart.findFirst({
        where: { userId },
        include: { items: { include: { product: true } } },
    });
    return cart;
}

// Create a new cart for user
async function createCart(userId, productId, size, quantity) {
    const cart = await prisma.cart.create({
        data: {
            userId,
            items: { create: [{ productId, size, quantity }] },
        },
    });
    return cart;
}

// Find if item already exists in cart
async function findCartItem(cart, productId, size) {
    const existingItem = cart.items.find(
        (item) => item.productId === productId && item.size === size,
    );
    return existingItem;
}

// Update quantity of existing item in cart
async function updateCartItem(existingItem, quantity) {
    const updatedItem = await prisma.cartItem.update({
        where: {
            id: existingItem.id,
            size: existingItem.size,
        },
        data: { quantity: existingItem.quantity + quantity },
    });
    return updatedItem;
}

// Update quantity when user click on + - in cart
async function updateQuantity(itemId, quantity) {
    const updatedItem = await prisma.cartItem.update({
        where: {
            id: itemId,
        },
        data: { quantity: quantity },
    });
    return updatedItem;
}

// Add item to cart
async function addToCart(userId, productId, size, quantity) {
    await prisma.cart.update({
        where: { userId: userId },
        data: {
            items: { create: [{ productId, size, quantity }] },
        },
    });
}

//Delete item from cart
async function removeFromCart(cartItemId) {
    const cart = await prisma.cart.findFirst({
        where: {
            cartItemIds: { has: cartItemId }, // Check if the cart has the item
        },
    });

    if (!cart) {
        throw new Error("Cart not found or cart item does not exist.");
    }

    const updatedCartItemIds = cart.cartItemIds.filter(id => id !== cartItemId); // Remove the item

    await prisma.cart.update({
        where: {
            id: cart.id, // Update the specific cart
        },
        data: {
            cartItemIds: updatedCartItemIds, // Set the updated array
        },
    });

    await prisma.cartItem.delete({
        where: {
            id: cartItemId, // Delete the cart item
        },
    });
}

module.exports = {
    getCart,
    getCartWithItem,
    createCart,
    findCartItem,
    updateCartItem,
    updateQuantity,
    addToCart,
    removeFromCart,
};
