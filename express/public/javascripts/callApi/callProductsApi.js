/*********************/
/*    Pagination     */
/*********************/
async function renderProducts(products) {
    if (!products.length) {
        return '<p>No products available.</p>';
    }

    return products
        .map((product) => {
            const labelClass =
                product.label === 'New'
                    ? 'bg-orange-600'
                    : product.label === 'Sale'
                      ? 'bg-blue-600'
                      : product.label === 'Featured'
                        ? 'bg-green-600'
                        : product.label === 'Popular'
                          ? 'bg-cyan-500'
                          : 'bg-gray-600';

            return `
        <div class="group">
            <div class="relative overflow-hidden shadow dark:shadow-gray-800 group-hover:shadow-lg group-hover:dark:shadow-gray-800 rounded-md duration-500">
                <a href="/products/${product.id}">
                    <img src="${product.images[0] || '/images/placeholder-image.png'}" alt="${product.name}">
                </a>
                <ul class="list-none absolute top-[10px] end-4 opacity-0 group-hover:opacity-100 duration-500">
                    <li>
                        <a href="javascript:void(0)" class="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white">
                            <i class="mdi mdi-heart"></i>
                        </a>
                    </li>
                    <li class="mt-1">
                        <a href="/products/${product.id}" class="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white">
                            <i class="mdi mdi-eye-outline"></i>
                        </a>
                    </li>
                    <li class="mt-1">
                        <a href="javascript:void(0)" class="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white">
                            <i class="mdi mdi-bookmark-outline"></i>
                        </a>
                    </li>
                </ul>
                ${
                    product.label
                        ? `
                <ul class="list-none absolute top-[10px] start-4">
                    <li>
                        <a href="javascript:void(0)" class="text-white text-[10px] font-bold px-2.5 py-0.5 rounded h-5 ${labelClass}">
                            ${product.label}
                        </a>
                    </li>
                </ul>`
                        : ''
                }
            </div>
            <div class="mt-4">
                <a href="/products/${product.id}" class="hover:text-indigo-600 text-lg font-semibold">
                    ${product.name}
                </a>
                <div class="flex justify-between items-center mt-1">
                    <p class="text-green-600">
                        $${product.price}
                        ${product.originalPrice ? `<del class="text-red-600">$${product.originalPrice}</del>` : ''}
                    </p>
                    <ul class="font-medium text-amber-400 list-none">
                        <li class="inline">
                            <i class="mdi mdi-star"></i>
                            <span>${product.rating || 0}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        `;
        })
        .join('');
}
async function renderPagination(pagination) {
    if (!pagination || pagination.totalPages <= 1) {
        return ''; // No pagination needed if there's only one page
    }

    const { currentPage, totalPages, limit } = pagination;

    // Helper function for creating button classes
    const getButtonClass = (isDisabled, isActive) => {
        if (isDisabled) {
            return 'pointer-events-none opacity-50 cursor-not-allowed text-slate-300 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600';
        }
        if (isActive) {
            return 'text-white bg-indigo-600 border border-indigo-600';
        }
        return 'text-slate-400 bg-white dark:bg-slate-900 hover:text-white border border-gray-100 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600';
    };

    // Generate buttons
    const buttons = [];

    // Previous Button
    buttons.push(`
        <li>
            <button
                class="size-[40px] inline-flex justify-center items-center ${getButtonClass(currentPage <= 1)}"
                onclick="loadProducts(${currentPage - 1}, ${limit})"
                ${currentPage <= 1 ? 'disabled' : ''}>
                <i class="uil uil-angle-left text-[20px] rtl:rotate-180 rtl:-mt-1"></i>
            </button>
        </li>
    `);

    // Page Numbers
    for (let page = 1; page <= totalPages; page++) {
        if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 2 && page <= currentPage + 2)
        ) {
            buttons.push(`
                <li>
                    <button
                        class="size-[40px] inline-flex justify-center items-center ${getButtonClass(false, page === currentPage)}"
                        onclick="loadProducts(${page}, ${limit})">
                        ${page}
                    </button>
                </li>
            `);
        } else if (
            (page === currentPage - 3 || page === currentPage + 3) &&
            totalPages > 6
        ) {
            buttons.push(
                '<li><span class="size-[40px] text-gray-400">...</span></li>',
            );
        }
    }

    // Next Button
    buttons.push(`
        <li>
            <button
                class="size-[40px] inline-flex justify-center items-center ${getButtonClass(currentPage >= totalPages)}"
                onclick="loadProducts(${currentPage + 1}, ${limit})"
                ${currentPage >= totalPages ? 'disabled' : ''}>
                <i class="uil uil-angle-right text-[20px] rtl:rotate-180 rtl:-mt-1"></i>
            </button>
        </li>
    `);

    return `<ul class="inline-flex items-center -space-x-px">${buttons.join('')}</ul>`;
}

async function fetchProducts(page, limit) {

    const search = document.getElementById('searchname').value;
    const category = document.querySelector('input[name=category]:checked')?.value;
    const manufacturer = document.querySelector('input[name=manufacturer]:checked')?.value;
    const sort = document.querySelector('select[name=sort]')?.value;
    const min = document.querySelector('input[name=minPrice]')?.value;
    const max = document.querySelector('input[name=maxPrice]')?.value;

    try {
        // Build query string dynamically
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (manufacturer) params.append('manufacturer', manufacturer);
        if (sort) params.append('sort', sort);
        if (min) params.append('minPrice', min);
        if (max) params.append('maxPrice', max);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);

        // Send AJAX request
        const response = await fetch(`/products?${params.toString()}`);
        const data = await response.json();

        //Total products
        document.getElementById('total-products').innerHTML = `${data.totalProducts} results`;
        // Render product list
        const productContainer = document.querySelector('#content-container');
        productContainer.innerHTML = await renderProducts(data.products);

        // Render pagination
        const paginationContainer = document.querySelector(
            '#pagination-container',
        );

        paginationContainer.innerHTML = await renderPagination(data.pagination);

        return params.toString();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadProducts(page, limit) {
    // Fetch and render products based on the new page and limit
    const urlParams = await fetchProducts(page, limit);

    history.pushState(null, '', `/products?${urlParams}`);

}

window.addEventListener('popstate', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page')) || 1;
    const limit = parseInt(urlParams.get('limit')) || 9;

    // Re-fetch and render products and pagination based on the updated URL
    await fetchProducts(page, limit);
});


let skip = 4; // Keep track of the number of reviews already loaded
const limit = 4; // Number of reviews to load per batch

// Function to fetch and render reviews
async function fetchAndRenderReviews() {
    const productContainer = document.getElementById('product-container');
    const productId = productContainer.dataset.productId;

    console.log('Product ID:', productId);
    try {
        const response = await fetch(`/products/api/${productId}/reviews?skip=${skip}&limit=${limit}`);
        const data = await response.json();

        const reviewsContainer = document.getElementById('review-container');
        const loadMoreButton = document.getElementById('load-more-reviews');

        // Append the new reviews to the container
        reviewsContainer.innerHTML += generateReviewHTML(data.reviews);

        // Increment the skip value
        skip += data.reviews.length;

        // Show or hide the "Load More" button based on remaining reviews
        if (skip >= data.totalReviews) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

// Generate review HTML (same as before)
function generateReviewHTML(reviews) {
    return reviews.map(review => `
        <div class="mt-8">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <img src="${review.userProfile.avatar}" class="size-11 rounded-full shadow" alt="">
                    <div class="ms-3 flex-1">
                        <a href="#" class="text-lg font-semibold hover:text-indigo-600 duration-500">${review.userProfile.name}</a>
                        <p class="text-sm text-slate-400">${review.updatedAtFormatted}</p>
                    </div>
                </div>
                <a href="#" class="text-slate-400 hover:text-indigo-600 duration-500 ms-5"><i class="mdi mdi-reply"></i> Reply</a>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-slate-800 rounded-md shadow dark:shadow-gray-800 mt-6">
                <ul class="list-none inline-block text-orange-400">
                    ${Array.from({ length: 5 }).map((_, i) => `
                        <li class="inline">
                            <i class="mdi mdi-star text-lg${review.rating >= i + 1 ? ' text-yellow-500' : ' text-gray-300'}"></i>
                        </li>
                    `).join('')}
                </ul>
                <p class="text-slate-400 italic">" ${review.comment} "</p>
            </div>
        </div>
    `).join('');
}

// Function to load more reviews
function loadMoreReviews() {
    fetchAndRenderReviews();
}

async function sendReview() {

    const productContainer = document.getElementById('product-container');
    const productId = productContainer.dataset.productId;
    const comment = document.getElementById('reviews').value;
    const ratingInput = document.getElementById("ratingInput");
    const rating = parseInt(ratingInput.value);

    try {
        const response = await fetch('/products/api/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, rating, comment }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('You must be logged in to add items to the cart.');
                return;
            }
            const errorMessage = await response.text();
            console.error('Error:', errorMessage);
            alert(`Failed to submit review: ${errorMessage}`);
            return;
        }

        const result = await response.json();
        console.log('Review submitted successfully:', result);

        // Optionally update the UI to display the new review
        alert('Review submitted successfully!');
        location.reload(); // Reload the page to show the updated reviews
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Error submitting review. Please try again later.');
    }
};
