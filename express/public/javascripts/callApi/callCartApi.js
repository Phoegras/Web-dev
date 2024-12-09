/****************************/
/*  Add a product to cart   */
/****************************/
// Update UI for selected size (example functionality)
document.querySelectorAll('.product-size').forEach((sizeButton) => {
    sizeButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.product-size').forEach((btn) => {
            btn.classList.remove('bg-indigo-600', 'text-white', 'chosen-size');
            btn.classList.add('bg-indigo-600/5', 'text-indigo-600');
        });
        e.target.classList.remove('bg-indigo-600/5', 'text-indigo-600');
        e.target.classList.add('bg-indigo-600', 'text-white', 'chosen-size');
    });
});

async function addToCart(productId) {
    console.log('Adding product to cart ajax');
    try {
        const size = document.querySelector('.chosen-size')?.textContent.trim(); // Get selected size
        const quantity = parseInt(
            document.querySelector('input[name=quantity]').value,
        ); // Get quantity

        if (!size) {
            document.getElementById("not-choose-size").innerHTML = "Please select a size.";
            return;
        }

        // Prepare the data to send
        const data = {
            productId: productId,
            size: size,
            quantity: quantity,
        };

        // Send the request
        const response = await fetch('/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('You must be logged in to add items to the cart.');
                window.location.href = '/auth/sign-in'; // Redirect to login page
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Handle the response
        if (result.success) {
            alert('Product has been added to the cart!');
            updateCartDropDown(); // Update cart dropdown
        } else {
            alert(result.message || 'Failed to add product to the cart.');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('An error occurred. Please try again.');
    }
};


/********************************/
/*    Remove an item in cart    */
/********************************/
async function removeItem(element) {
    const rowElement = element.closest('tr');
    const itemId = rowElement.dataset.itemId;
    try {
        const response = await fetch(`/cart/${itemId}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
            rowElement.remove();
            // Update cart totals
            await updateCartTotals(); // Ensure totals are updated before proceeding
            await updateCartDropDown(); // Update cart dropdown
        } else {
            alert('Failed to remove item');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


/**************************************/
/*  Update product quantity in cart   */
/**************************************/
document.querySelectorAll('.quantity-input').forEach((input) => {
    input.addEventListener('change', function () {
        const itemId = this.dataset.itemId;
        const quantity = this.value;
        const productRow = document.querySelector(
            `.product-row[data-item-id="${itemId}"]`,
        );
        const unitPrice = parseFloat(productRow.dataset.price);
        const totalProductPrice = unitPrice * quantity;

        // Update product total price
        const productTotalPriceElement = productRow.querySelector(
            '.product-total-price',
        );
        productTotalPriceElement.textContent = `$${totalProductPrice.toFixed(2)}`;

        fetch('/cart/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId, quantity }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    updateCartTotals(); // Recalculate subtotal and total
                    updateCartDropDown(); // Update cart dropdown
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});

function updateCartTotals() {
    let subtotal = 0;

    // Loop through each product row to calculate the subtotal
    document.querySelectorAll('.product-row').forEach((row) => {
        const unitPrice = parseFloat(row.dataset.price);
        const quantity = parseInt(
            row.querySelector('.quantity-input').value,
            10,
        );
        subtotal += unitPrice * quantity;
    });

    // Update subtotal and total
    const cartSubtotalElement = document.querySelector('.cart-subtotal');
    const taxElement = document.querySelector('.tax');
    const cartTotalElement = document.querySelector('.cart-total');
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}
async function updateCartDropDown() {
    console.log('Updating cart dropdown');
    try {
        const response = await fetch('/cart', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }); // Same route used for both full page and dropdown

        const cartData = await response.json();
        const { cartItems, subtotal, total } = cartData;

        renderCartDropDown(cartItems, subtotal, total);
        try {
            localStorage.setItem('cartList', JSON.stringify(cartData));
        } catch (error) {
            console.error('Error updating cart dropdown:', error);
        }
    } catch (error) {
        console.error('Error updating cart dropdown:', error);
    }
}

function renderCartDropDown(cartItems, subtotal, total) {
    const cartList = document.querySelector('.cart-dropdown ul');

    if(!cartList) return;
    
    if (cartItems.length) {
        const cartItemsHtml = cartItems.map(item => {
            const productImage = item.product.images?.[0] || '/images/placeholder-image.png';
            return `
            <li>
                <a
                    href="/products/${item.id}"
                    class="flex items-center justify-between py-1.5 px-4"
                >
                    <span class="flex items-center">
                    <img
                        src="${productImage}"
                        class="rounded shadow dark:shadow-gray-800 w-9"
                        alt="${item.name}"
                    />
                    <span class="ms-3">
                        <span class="block font-semibold">${item.product.name} (${item.size})</span>
                        <span class="block text-sm text-slate-400">$${item.product.price}
                        X
                        ${item.quantity}</span>
                    </span>
                    </span>
                    <span class="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                </a>
            </li>
        `}).join('');

        cartList.innerHTML = `
            ${cartItemsHtml}
            <li class="border-t border-gray-100 dark:border-gray-800 my-2"></li>
            <li class="flex items-center justify-between py-1.5 px-4">
                <h6 class="font-semibold mb-0">Subtotal($):</h6>
                <h6 class="font-semibold mb-0">$${subtotal.toFixed(2)}</h6>
            </li>
            <li class="flex items-center justify-between py-1.5 px-4">
                <h6 class="font-semibold mb-0">Total($):</h6>
                <h6 class="font-semibold mb-0">$${total.toFixed(2)}</h6>
            </li>
            <li class='py-1.5 px-4'>
                <a
                    href='/cart'
                    class='py-[5px] px-4 inline-block font-semibold tracking-wide align-middle duration-500 text-sm text-center rounded-md bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 hover:border-indigo-700 text-white'
                >View Cart</a>
                <a
                    href='/checkout'
                    class='py-[5px] px-4 inline-block font-semibold tracking-wide align-middle duration-500 text-sm text-center rounded-md bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 hover:border-indigo-700 text-white'
                >Checkout</a>
                <p class='text-sm text-slate-400 mt-1'>*T&C Apply</p>
            </li>
        `;
    } else {
        cartList.innerHTML = `
        <p class="p-4 text-center">No items in the cart.</p>
        `;
    }
}
async function getCartDropDown() {
    const cachedCart = localStorage.getItem('cartList');
    const { cartItems, subtotal, total } = JSON.parse(cachedCart);
    if (cachedCart) {
        renderCartDropDown(cartItems, subtotal, total); // Use cached data
    } else {
        await updateCartDropDown(); // Fetch data only if not cached
    }
}